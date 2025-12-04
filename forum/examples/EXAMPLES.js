/**
 * FORUM EXAMPLES
 * Common usage patterns and code examples for the DORO forum system
 */

// ============================================================================
// EXAMPLE 1: Creating a Post
// ============================================================================

import { createPost } from "../services/forumService.js";
import { auth } from "../../config/firebase-config.js";

async function createProductivityPost() {
  try {
    // Get current user
    const user = auth.currentUser;
    
    if (!user) {
      console.log("User must be logged in");
      return;
    }

    // In a real app, fetch this from Firestore users collection
    const userData = {
      displayName: user.displayName || "Anonymous User",
      currentStreak: 12
    };

    // Create the post
    const postId = await createPost(
      user.uid,
      userData.displayName,
      userData.currentStreak,
      "My Top 5 Productivity Techniques",
      `Here are the techniques that help me stay focused:
      1. 25-minute Pomodoro sessions
      2. No phone during work blocks
      3. Pre-plan my tasks
      4. Take real breaks
      5. Track my progress`
    );

    console.log("Post created successfully:", postId);
    
    // Refresh the feed
    loadFeed();
    
  } catch (error) {
    console.error("Error creating post:", error);
  }
}

// ============================================================================
// EXAMPLE 2: Fetching Posts with Different Sorting
// ============================================================================

import { fetchPosts } from "../services/forumService.js";

// Load newest posts
async function loadNewestPosts() {
  try {
    const { posts, lastDoc, hasMore } = await fetchPosts("new");
    
    console.log(`Loaded ${posts.length} newest posts`);
    posts.forEach(post => {
      console.log(`${post.authorName} 🔥 ${post.authorStreak}: ${post.title}`);
    });
    
    return { posts, lastDoc, hasMore };
  } catch (error) {
    console.error("Error loading posts:", error);
  }
}

// Load most popular posts
async function loadTopPosts() {
  try {
    const { posts, lastDoc, hasMore } = await fetchPosts("top");
    
    console.log(`Loaded ${posts.length} top posts (by votes)`);
    posts.forEach(post => {
      console.log(`👍 ${post.voteCount} - ${post.title}`);
    });
    
    return { posts, lastDoc, hasMore };
  } catch (error) {
    console.error("Error loading top posts:", error);
  }
}

// ============================================================================
// EXAMPLE 3: Pagination
// ============================================================================

let currentSort = "new";
let lastDoc = null;
let hasMore = true;

async function loadMorePosts() {
  if (!hasMore) {
    console.log("No more posts to load");
    return;
  }

  try {
    const { posts, lastDoc: newLastDoc, hasMore: newHasMore } = 
      await fetchPosts(currentSort, lastDoc);
    
    console.log(`Loaded ${posts.length} more posts`);
    
    // Update state
    lastDoc = newLastDoc;
    hasMore = newHasMore;
    
    // Add posts to feed...
    displayPosts(posts);
    
    if (!hasMore) {
      console.log("Reached end of feed");
    }
    
  } catch (error) {
    console.error("Error loading more posts:", error);
  }
}

// ============================================================================
// EXAMPLE 4: Get Single Post with Comments
// ============================================================================

import { getPost } from "../services/forumService.js";

async function viewPostDetail(postId) {
  try {
    const post = await getPost(postId);
    
    // Display post
    console.log(`=== ${post.title} ===`);
    console.log(`By: ${post.authorName} 🔥 ${post.authorStreak}`);
    console.log(`\n${post.body}`);
    console.log(`\n👍 ${post.voteCount} upvotes | 💬 ${post.commentCount} comments`);
    
    // Display comments
    console.log("\n--- Comments ---");
    post.comments.forEach((comment, i) => {
      console.log(`\n${i + 1}. ${comment.authorName} 🔥 ${comment.authorStreak}`);
      console.log(`   ${comment.body}`);
    });
    
  } catch (error) {
    console.error("Error loading post detail:", error);
  }
}

// ============================================================================
// EXAMPLE 5: Adding a Comment
// ============================================================================

import { addComment } from "../services/forumService.js";

async function replyToPost(postId, commentText) {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      console.log("Must be logged in to comment");
      return;
    }

    // Fetch user data
    const { getFirestore, doc, getDoc } = 
      await import("https://www.gstatic.com/firebasejs/10.12.3/firestore.js");
    
    const db = getFirestore();
    const userDoc = await getDoc(doc(db, "users", user.uid));
    const userData = userDoc.data();

    // Add comment
    const commentId = await addComment(
      postId,
      user.uid,
      userData.displayName || "Anonymous",
      userData.currentStreak || 0,
      commentText
    );

    console.log("Comment added successfully:", commentId);
    
    // Refresh post detail to show new comment
    const updatedPost = await getPost(postId);
    viewPostDetail(postId);
    
  } catch (error) {
    console.error("Error adding comment:", error);
  }
}

// Usage:
// replyToPost("post_id_123", "I tried this technique and it works great!");

// ============================================================================
// EXAMPLE 6: Upvoting Posts
// ============================================================================

import { upvotePost, removeUpvote, getPost } from "../services/forumService.js";

async function toggleUpvote(postId, userId) {
  try {
    const post = await getPost(postId);
    
    // Check if user already voted
    const hasVoted = post.votes?.[userId];
    
    if (hasVoted) {
      // Remove upvote
      await removeUpvote(postId, userId);
      console.log("Upvote removed");
    } else {
      // Add upvote
      await upvotePost(postId, userId);
      console.log("Post upvoted!");
    }
    
    // Refresh post data
    const updatedPost = await getPost(postId);
    console.log(`New vote count: ${updatedPost.voteCount}`);
    
  } catch (error) {
    console.error("Error toggling upvote:", error);
  }
}

// Usage:
// toggleUpvote("post_id_123", auth.currentUser.uid);

// ============================================================================
// EXAMPLE 7: Searching Posts
// ============================================================================

import { searchPosts } from "../services/forumService.js";

async function searchForum(query) {
  try {
    const results = await searchPosts(query);
    
    console.log(`Found ${results.length} posts matching "${query}"`);
    results.forEach(post => {
      console.log(`- ${post.title}`);
      console.log(`  By: ${post.authorName} 🔥 ${post.authorStreak}`);
    });
    
    return results;
    
  } catch (error) {
    console.error("Error searching posts:", error);
  }
}

// Usage:
// searchForum("pomodoro technique");

// ============================================================================
// EXAMPLE 8: Display Post with Streak Badge
// ============================================================================

function displayPostCard(post) {
  const card = document.createElement("div");
  card.className = "post-card";
  
  // Author info with streak badge
  const authorSection = document.createElement("div");
  authorSection.className = "post-author-info";
  
  const authorName = document.createElement("span");
  authorName.textContent = post.authorName;
  authorName.className = "post-author-name";
  
  const streakBadge = document.createElement("span");
  streakBadge.textContent = `🔥 ${post.authorStreak}`;
  streakBadge.className = "post-author-streak";
  
  authorSection.appendChild(authorName);
  authorSection.appendChild(streakBadge);
  
  // Post title
  const title = document.createElement("h3");
  title.textContent = post.title;
  title.className = "post-title";
  
  // Post body
  const body = document.createElement("p");
  body.textContent = post.body.substring(0, 150) + "...";
  body.className = "post-body";
  
  // Stats
  const stats = document.createElement("div");
  stats.className = "post-stats";
  stats.innerHTML = `
    <span>👍 ${post.voteCount}</span>
    <span>💬 ${post.commentCount}</span>
  `;
  
  // Assemble
  card.appendChild(authorSection);
  card.appendChild(title);
  card.appendChild(body);
  card.appendChild(stats);
  
  return card;
}

// Usage:
// const card = displayPostCard(postData);
// document.getElementById("feed").appendChild(card);

// ============================================================================
// EXAMPLE 9: Filter Posts by Author Streak
// ============================================================================

async function getHighStreakPosts() {
  try {
    const { posts } = await fetchPosts("new");
    
    // Filter for posts by users with 7+ day streaks
    const highStreakPosts = posts.filter(post => post.authorStreak >= 7);
    
    console.log(`Found ${highStreakPosts.length} posts by experienced users`);
    highStreakPosts.forEach(post => {
      console.log(`${post.authorName} 🔥 ${post.authorStreak}: ${post.title}`);
    });
    
    return highStreakPosts;
    
  } catch (error) {
    console.error("Error filtering posts:", error);
  }
}

// ============================================================================
// EXAMPLE 10: Real-Time Feed Updates
// ============================================================================

async function setupLivePostFeed() {
  let currentSort = "new";
  let lastDoc = null;
  const feedContainer = document.getElementById("posts-feed");
  
  // Initial load
  async function loadFeed() {
    try {
      const { posts, lastDoc: newLastDoc, hasMore } = 
        await fetchPosts(currentSort, lastDoc);
      
      // Clear feed
      feedContainer.innerHTML = "";
      
      // Add posts
      posts.forEach(post => {
        const card = displayPostCard(post);
        card.addEventListener("click", () => viewPostDetail(post.id));
        feedContainer.appendChild(card);
      });
      
      lastDoc = newLastDoc;
      
      // Show "Load More" button
      if (hasMore) {
        const loadMoreBtn = document.createElement("button");
        loadMoreBtn.textContent = "Load More";
        loadMoreBtn.addEventListener("click", loadFeed);
        feedContainer.appendChild(loadMoreBtn);
      }
      
    } catch (error) {
      console.error("Error loading feed:", error);
    }
  }
  
  // Sort buttons
  document.querySelectorAll(".sort-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      currentSort = e.target.dataset.sort;
      lastDoc = null;
      loadFeed();
    });
  });
  
  // Initial load
  loadFeed();
}

// ============================================================================
// EXAMPLE 11: Form Submission Example
// ============================================================================

async function handleCreatePostForm(e) {
  e.preventDefault();
  
  const formData = {
    title: document.getElementById("post-title").value,
    body: document.getElementById("post-body").value
  };
  
  // Validate
  if (!formData.title || !formData.body) {
    alert("Please fill in all fields");
    return;
  }
  
  try {
    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in");
      return;
    }
    
    // Fetch user data
    const { getFirestore, doc, getDoc } = 
      await import("https://www.gstatic.com/firebasejs/10.12.3/firestore.js");
    const db = getFirestore();
    const userDoc = await getDoc(doc(db, "users", user.uid));
    const userData = userDoc.data();
    
    // Create post
    const postId = await createPost(
      user.uid,
      userData.displayName || "Anonymous",
      userData.currentStreak || 0,
      formData.title,
      formData.body
    );
    
    // Clear form
    e.target.reset();
    
    // Hide form
    document.getElementById("create-post-section").style.display = "none";
    
    // Show success message
    alert("Post created successfully!");
    
    // Reload feed
    loadFeed();
    
  } catch (error) {
    console.error("Error creating post:", error);
    alert("Failed to create post");
  }
}

// ============================================================================
// EXAMPLE 12: User Stats Display
// ============================================================================

async function displayForumStats() {
  try {
    const { posts } = await fetchPosts("new");
    
    // Calculate stats
    const totalPosts = posts.length;
    const totalComments = posts.reduce((sum, p) => sum + (p.commentCount || 0), 0);
    const topPostTitle = posts.reduce((max, p) => 
      (p.voteCount > (max.voteCount || 0)) ? p : max
    ).title;
    const highStreakUsers = posts.filter(p => p.authorStreak >= 10).length;
    
    // Display stats
    const statsDiv = document.createElement("div");
    statsDiv.className = "forum-stats";
    statsDiv.innerHTML = `
      <h3>Community Stats</h3>
      <p>Total Posts: <strong>${totalPosts}</strong></p>
      <p>Total Comments: <strong>${totalComments}</strong></p>
      <p>Top Post: <strong>${topPostTitle}</strong></p>
      <p>Active Streakers: <strong>${highStreakUsers}</strong></p>
    `;
    
    return statsDiv;
    
  } catch (error) {
    console.error("Error calculating stats:", error);
  }
}

// ============================================================================
// EXAMPLE 13: Error Handling
// ============================================================================

async function safeLoadPosts() {
  try {
    // Show loading state
    const feedContainer = document.getElementById("posts-feed");
    feedContainer.innerHTML = '<div class="loading">Loading posts...</div>';
    
    const { posts } = await fetchPosts("new");
    
    if (posts.length === 0) {
      feedContainer.innerHTML = '<div class="empty">No posts yet</div>';
      return;
    }
    
    // Display posts
    feedContainer.innerHTML = "";
    posts.forEach(post => {
      feedContainer.appendChild(displayPostCard(post));
    });
    
  } catch (error) {
    console.error("Error loading posts:", error);
    feedContainer.innerHTML = `
      <div class="error">
        Failed to load posts. Please try again later.
      </div>
    `;
  }
}

// ============================================================================
// EXAMPLE 14: Authorization Check
// ============================================================================

function canUserDelete(postAuthorId, currentUserId) {
  return postAuthorId === currentUserId;
}

function canUserComment(currentUser) {
  return currentUser && currentUser.uid;
}

function canUserUpvote(currentUser) {
  return currentUser && currentUser.uid;
}

// Usage:
// if (canUserDelete(post.authorId, auth.currentUser.uid)) {
//   showDeleteButton();
// }

// ============================================================================
// EXAMPLE 15: Complete Forum Setup
// ============================================================================

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";

function initializeForumApp() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User logged in - show create post form
      document.getElementById("create-post-btn").style.display = "block";
      console.log("Welcome back,", user.displayName);
    } else {
      // User logged out - hide create post form
      document.getElementById("create-post-btn").style.display = "none";
      console.log("Please log in to create posts");
    }
  });
  
  // Load initial feed
  setupLivePostFeed();
  
  // Setup event listeners
  document.getElementById("create-post-form")
    .addEventListener("submit", handleCreatePostForm);
}

// Call on page load:
// initializeForumApp();
