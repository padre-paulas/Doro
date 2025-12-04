import { auth } from "../../config/firebase-config.js";
import { onAuthStateChanged } from "firebase/auth";
import {
  createPost,
  fetchPosts,
  getPost,
  addComment,
  upvotePost,
  removeUpvote,
  deletePost
} from "../services/forumService.js";
import { createPostCard, createCommentItem } from "../components/PostCard.js";

// ============================================================================
// STATE & VARIABLES
// ============================================================================

let currentUser = null;
let currentSort = "new";
let currentPostId = null;
let lastDoc = null;
let hasMore = true;
let isLoadingPosts = false;

// DOM Elements
const feedView = document.getElementById("feed-view");
const detailView = document.getElementById("detail-view");
const postsFeed = document.getElementById("posts-feed");
const createPostSection = document.getElementById("create-post-section");
const createPostForm = document.getElementById("create-post-form");
const cancelPostBtn = document.getElementById("cancel-post");
const newPostBtn = document.getElementById("new-post-btn");
const loadMoreBtn = document.getElementById("load-more-btn");
const backBtn = document.getElementById("back-btn");
const postDetailHeader = document.getElementById("post-detail-header");
const commentsList = document.getElementById("comments-list");
const addCommentForm = document.getElementById("add-comment-form");
const commentForm = document.getElementById("comment-form");
const cancelCommentBtn = document.getElementById("cancel-comment");
const commentBtn = document.getElementById("comment-btn");
const commentBody = document.getElementById("comment-body");
const menuButton = document.getElementById("menu-button");
const menuDropdown = document.getElementById("menu-dropdown");
const streakButton = document.getElementById("streak-button");
const streakModal = document.getElementById("streak-modal");
const modalClose = document.querySelector(".modal-close");
const sortButtons = document.querySelectorAll(".forum-tab");

// ============================================================================
// AUTHENTICATION
// ============================================================================

onAuthStateChanged(auth, async (user) => {
  currentUser = user;

  if (user) {
    createPostSection.style.display = "block";
    commentForm.style.display = "block";
    commentBtn.style.display = "none";
  } else {
    createPostSection.style.display = "none";
    commentForm.style.display = "none";
    commentBtn.style.display = "block";
  }

  loadFeed();
});

// ============================================================================
// FEED MANAGEMENT
// ============================================================================

/**
 * Load posts from Firestore
 */
async function loadFeed() {
  try {
    isLoadingPosts = true;
    postsFeed.innerHTML = '<div class="loading-spinner">Loading posts...</div>';

    lastDoc = null;
    const result = await fetchPosts(currentSort);
    displayPosts(result.posts);

    lastDoc = result.lastDoc;
    hasMore = result.hasMore;
    loadMoreBtn.style.display = hasMore ? "block" : "none";
  } catch (error) {
    console.error("Error loading feed:", error);
    postsFeed.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">⚠️</div>
        <div class="empty-state-text">Failed to load posts</div>
      </div>
    `;
  } finally {
    isLoadingPosts = false;
  }
}

/**
 * Display posts in the feed
 */
function displayPosts(posts) {
  if (posts.length === 0) {
    postsFeed.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">💭</div>
        <div class="empty-state-text">No posts yet. Start the conversation!</div>
      </div>
    `;
    return;
  }

  postsFeed.innerHTML = "";

  posts.forEach((post) => {
    const card = createPostCard(post, (postId) => {
      showPostDetail(postId);
    });
    postsFeed.appendChild(card);
  });
}

/**
 * Load more posts (pagination)
 */
async function loadMorePosts() {
  if (!hasMore || isLoadingPosts) return;

  try {
    isLoadingPosts = true;
    loadMoreBtn.disabled = true;
    loadMoreBtn.textContent = "Loading...";

    const result = await fetchPosts(currentSort, lastDoc);
    const existingPosts = Array.from(
      postsFeed.querySelectorAll(".post-card")
    ).map((card) => ({
      id: card.dataset.postId,
    }));

    const newPosts = result.posts.filter(
      (post) => !existingPosts.some((existing) => existing.id === post.id)
    );

    newPosts.forEach((post) => {
      const card = createPostCard(post, (postId) => {
        showPostDetail(postId);
      });
      postsFeed.appendChild(card);
    });

    lastDoc = result.lastDoc;
    hasMore = result.hasMore;
    loadMoreBtn.style.display = hasMore ? "block" : "none";
    loadMoreBtn.textContent = "Load More";
  } catch (error) {
    console.error("Error loading more posts:", error);
    loadMoreBtn.textContent = "Load More";
  } finally {
    isLoadingPosts = false;
    loadMoreBtn.disabled = false;
  }
}

// ============================================================================
// CREATE POST
// ============================================================================

newPostBtn.addEventListener("click", () => {
  if (!currentUser) {
    alert("You must be logged in to create a post");
    return;
  }
  createPostSection.style.display = "block";
  document.getElementById("post-title").focus();
});

cancelPostBtn.addEventListener("click", () => {
  createPostSection.style.display = "none";
  createPostForm.reset();
});

createPostForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!currentUser) {
    alert("You must be logged in to create a post");
    return;
  }

  try {
    const title = document.getElementById("post-title").value.trim();
    const body = document.getElementById("post-body").value.trim();

    if (!title || !body) {
      alert("Please fill in all fields");
      return;
    }

    // Fetch user data from Firestore
    const userData = await getUserData(currentUser.uid);

    const postId = await createPost(
      currentUser.uid,
      userData.displayName || "Anonymous",
      userData.currentStreak || 0,
      title,
      body
    );

    createPostForm.reset();
    createPostSection.style.display = "none";
    alert("Post created successfully!");
    loadFeed();
  } catch (error) {
    console.error("Error creating post:", error);
    alert("Failed to create post");
  }
});

// ============================================================================
// POST DETAIL VIEW
// ============================================================================

/**
 * Show post detail view
 */
async function showPostDetail(postId) {
  try {
    currentPostId = postId;
    feedView.style.display = "none";
    detailView.style.display = "block";

    const post = await getPost(postId);
    renderPostDetail(post);
    renderComments(post.comments || []);
  } catch (error) {
    console.error("Error loading post detail:", error);
    alert("Failed to load post");
    showFeedView();
  }
}

/**
 * Render post detail header
 */
function renderPostDetail(post) {
  const createdDate = post.createdAt?.toDate?.() || new Date(post.createdAt);
  const formattedDate = createdDate.toLocaleDateString();

  postDetailHeader.innerHTML = `
    <div class="post-detail-title">${escapeHtml(post.title)}</div>

    <div class="post-detail-author">
      <span class="post-detail-author-name">${escapeHtml(
        post.authorName || "Anonymous"
      )}</span>
      <span class="post-detail-author-streak">🔥 ${post.authorStreak || 0}</span>
    </div>

    <div class="post-detail-meta">
      Posted on ${formattedDate}
    </div>

    <div class="post-detail-body">${escapeHtml(post.body)}</div>

    <div class="post-detail-actions">
      <button class="post-action-btn" id="upvote-btn">
        👍 ${post.voteCount || 0}
      </button>
      <button class="post-action-btn" id="delete-btn" style="${
        post.authorId !== currentUser?.uid ? "display: none;" : ""
      }">
        🗑️ Delete
      </button>
    </div>
  `;

  // Attach event listeners
  const upvoteBtn = document.getElementById("upvote-btn");
  const deleteBtn = document.getElementById("delete-btn");

  upvoteBtn.addEventListener("click", () => handleUpvote(post.id));
  if (deleteBtn) {
    deleteBtn.addEventListener("click", () => handleDelete(post.id));
  }
}

/**
 * Handle upvote
 */
async function handleUpvote(postId) {
  if (!currentUser) {
    alert("You must be logged in to upvote");
    return;
  }

  try {
    const upvoteBtn = document.getElementById("upvote-btn");
    const isUpvoted = upvoteBtn.classList.contains("upvoted");

    if (isUpvoted) {
      await removeUpvote(postId, currentUser.uid);
      upvoteBtn.classList.remove("upvoted");
    } else {
      await upvotePost(postId, currentUser.uid);
      upvoteBtn.classList.add("upvoted");
    }

    const post = await getPost(postId);
    renderPostDetail(post);
  } catch (error) {
    console.error("Error upvoting:", error);
    alert("Failed to upvote");
  }
}

/**
 * Handle delete
 */
async function handleDelete(postId) {
  if (!confirm("Are you sure you want to delete this post?")) {
    return;
  }

  try {
    await deletePost(postId);
    alert("Post deleted successfully");
    showFeedView();
  } catch (error) {
    console.error("Error deleting post:", error);
    alert("Failed to delete post");
  }
}

// ============================================================================
// COMMENTS
// ============================================================================

/**
 * Render comments
 */
function renderComments(comments) {
  const commentCount = document.getElementById("comment-count");
  commentCount.textContent = comments.length;

  commentsList.innerHTML = "";

  if (comments.length === 0) {
    commentsList.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🤔</div>
        <div class="empty-state-text">No comments yet. Be the first!</div>
      </div>
    `;
    return;
  }

  comments.forEach((comment) => {
    const commentElement = createCommentItem(comment);
    commentsList.appendChild(commentElement);
  });
}

commentBtn.addEventListener("click", () => {
  alert("You must be logged in to comment");
});

cancelCommentBtn.addEventListener("click", () => {
  commentForm.style.display = "none";
  addCommentForm.reset();
});

addCommentForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!currentUser) {
    alert("You must be logged in to comment");
    return;
  }

  try {
    const body = commentBody.value.trim();

    if (!body) {
      alert("Please enter a comment");
      return;
    }

    const userData = await getUserData(currentUser.uid);

    await addComment(
      currentPostId,
      currentUser.uid,
      userData.displayName || "Anonymous",
      userData.currentStreak || 0,
      body
    );

    addCommentForm.reset();
    commentForm.style.display = "none";

    const post = await getPost(currentPostId);
    renderComments(post.comments || []);
  } catch (error) {
    console.error("Error adding comment:", error);
    alert("Failed to add comment");
  }
});

// ============================================================================
// VIEW NAVIGATION
// ============================================================================

backBtn.addEventListener("click", showFeedView);

function showFeedView() {
  feedView.style.display = "block";
  detailView.style.display = "none";
  currentPostId = null;
}

// ============================================================================
// SORTING
// ============================================================================

sortButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    sortButtons.forEach((b) => b.classList.remove("active"));
    e.target.classList.add("active");
    currentSort = e.target.dataset.sort;
    loadFeed();
  });
});

// ============================================================================
// PAGINATION
// ============================================================================

loadMoreBtn.addEventListener("click", loadMorePosts);

// ============================================================================
// MENU & STREAK MODAL
// ============================================================================

menuButton.addEventListener("click", () => {
  menuDropdown.classList.toggle("active");
});

document.addEventListener("click", (event) => {
  if (!event.target.closest("#navbar")) {
    menuDropdown.classList.remove("active");
  }
});

streakButton.addEventListener("click", (event) => {
  event.preventDefault();
  streakModal.style.display = "flex";
});

modalClose.addEventListener("click", () => {
  streakModal.style.display = "none";
});

streakModal.addEventListener("click", (event) => {
  if (event.target === streakModal) {
    streakModal.style.display = "none";
  }
});

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  if (!text) return "";
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Get user data from Firestore
 */
async function getUserData(uid) {
  try {
    const { getFirestore, doc, getDoc } = await import("firebase/firestore");

    const db = getFirestore();
    const userDoc = await getDoc(doc(db, "userStats", uid));

    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      return {
        displayName: "Anonymous",
        currentStreak: 0,
      };
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    return {
      displayName: "Anonymous",
      currentStreak: 0,
    };
  }
}

// ============================================================================
// INITIALIZE
// ============================================================================

// Load feed on page load (auth listener will trigger loadFeed)
console.log("Forum app initialized");
