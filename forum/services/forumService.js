import { app } from "../../config/firebase-config.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  startAfter, 
  getDocs, 
  serverTimestamp,
  doc,
  getDoc,
  updateDoc,
  increment,
  writeBatch,
  where
} from "https://www.gstatic.com/firebasejs/10.12.3/firestore.js";

const db = getFirestore(app);
const POSTS_PER_PAGE = 10;

/**
 * Create a new post in the forum
 * @param {string} authorId - User's UID
 * @param {string} authorName - User's display name
 * @param {number} authorStreak - User's current streak
 * @param {string} title - Post title
 * @param {string} body - Post content
 * @returns {Promise<string>} - Document ID of created post
 */
export async function createPost(authorId, authorName, authorStreak, title, body) {
  try {
    const postRef = await addDoc(collection(db, "posts"), {
      authorId,
      authorName,
      authorStreak,
      title,
      body,
      voteCount: 0,
      commentCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return postRef.id;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
}

/**
 * Fetch posts with pagination
 * @param {string} sortBy - "new" or "top"
 * @param {DocumentSnapshot} lastDoc - Last document for pagination
 * @returns {Promise<Object>} - { posts: Array, lastDoc: DocumentSnapshot }
 */
export async function fetchPosts(sortBy = "new", lastDoc = null) {
  try {
    let q;
    
    if (sortBy === "top") {
      q = query(
        collection(db, "posts"),
        orderBy("voteCount", "desc"),
        orderBy("createdAt", "desc"),
        limit(POSTS_PER_PAGE + 1)
      );
    } else {
      q = query(
        collection(db, "posts"),
        orderBy("createdAt", "desc"),
        limit(POSTS_PER_PAGE + 1)
      );
    }

    if (lastDoc) {
      q = query(
        collection(db, "posts"),
        sortBy === "top" 
          ? orderBy("voteCount", "desc")
          : orderBy("createdAt", "desc"),
        sortBy === "top"
          ? orderBy("createdAt", "desc")
          : orderBy("createdAt", "desc"),
        startAfter(lastDoc),
        limit(POSTS_PER_PAGE + 1)
      );
    }

    const snapshot = await getDocs(q);
    const posts = [];
    let newLastDoc = null;

    snapshot.forEach((doc, index) => {
      if (index < POSTS_PER_PAGE) {
        posts.push({
          id: doc.id,
          ...doc.data()
        });
      } else {
        newLastDoc = doc;
      }
    });

    return { posts, lastDoc: newLastDoc, hasMore: snapshot.size > POSTS_PER_PAGE };
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
}

/**
 * Get a single post with all its comments
 * @param {string} postId - Post document ID
 * @returns {Promise<Object>} - Post with comments array
 */
export async function getPost(postId) {
  try {
    const postDoc = await getDoc(doc(db, "posts", postId));
    if (!postDoc.exists()) {
      throw new Error("Post not found");
    }

    const post = {
      id: postDoc.id,
      ...postDoc.data()
    };

    // Fetch comments
    const commentsQuery = query(
      collection(db, "posts", postId, "comments"),
      orderBy("createdAt", "asc")
    );
    const commentsSnapshot = await getDocs(commentsQuery);
    const comments = [];
    
    commentsSnapshot.forEach(doc => {
      comments.push({
        id: doc.id,
        ...doc.data()
      });
    });

    post.comments = comments;
    return post;
  } catch (error) {
    console.error("Error fetching post:", error);
    throw error;
  }
}

/**
 * Add a comment to a post
 * @param {string} postId - Post document ID
 * @param {string} authorId - User's UID
 * @param {string} authorName - User's display name
 * @param {number} authorStreak - User's current streak
 * @param {string} body - Comment content
 * @returns {Promise<string>} - Document ID of created comment
 */
export async function addComment(postId, authorId, authorName, authorStreak, body) {
  try {
    const batch = writeBatch(db);

    // Add comment
    const commentRef = await addDoc(
      collection(db, "posts", postId, "comments"),
      {
        authorId,
        authorName,
        authorStreak,
        body,
        createdAt: serverTimestamp()
      }
    );

    // Increment comment count on post
    const postRef = doc(db, "posts", postId);
    batch.update(postRef, {
      commentCount: increment(1)
    });

    await batch.commit();
    return commentRef.id;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
}

/**
 * Upvote a post
 * @param {string} postId - Post document ID
 * @param {string} userId - User's UID
 * @returns {Promise<void>}
 */
export async function upvotePost(postId, userId) {
  try {
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      voteCount: increment(1),
      [`votes.${userId}`]: true
    });
  } catch (error) {
    console.error("Error upvoting post:", error);
    throw error;
  }
}

/**
 * Remove upvote from a post
 * @param {string} postId - Post document ID
 * @param {string} userId - User's UID
 * @returns {Promise<void>}
 */
export async function removeUpvote(postId, userId) {
  try {
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      voteCount: increment(-1),
      [`votes.${userId}`]: false
    });
  } catch (error) {
    console.error("Error removing upvote:", error);
    throw error;
  }
}

/**
 * Delete a post (only by author)
 * @param {string} postId - Post document ID
 * @returns {Promise<void>}
 */
export async function deletePost(postId) {
  try {
    await updateDoc(doc(db, "posts", postId), {
      deleted: true,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
}

/**
 * Search posts by title or body
 * @param {string} searchTerm - Search query
 * @returns {Promise<Array>} - Array of matching posts
 */
export async function searchPosts(searchTerm) {
  try {
    const q = query(
      collection(db, "posts"),
      where("deleted", "==", false),
      limit(20)
    );
    
    const snapshot = await getDocs(q);
    const results = [];
    
    snapshot.forEach(doc => {
      const post = doc.data();
      const searchLower = searchTerm.toLowerCase();
      
      if (
        post.title.toLowerCase().includes(searchLower) ||
        post.body.toLowerCase().includes(searchLower)
      ) {
        results.push({
          id: doc.id,
          ...post
        });
      }
    });
    
    return results;
  } catch (error) {
    console.error("Error searching posts:", error);
    throw error;
  }
}
