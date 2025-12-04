# Forum Configuration Guide

## Quick Start Checklist

- [ ] Create `posts` collection in Firestore
- [ ] Create `comments` subcollection in posts
- [ ] Verify `users` collection exists with proper fields
- [ ] Update Firestore security rules
- [ ] Add forum links to all navigation menus
- [ ] Test forum functionality
- [ ] Create Firestore indexes for performance

---

## Configuration Options

### 1. Appearance Configuration

#### Streak Badge Display

**File:** `forum/components/PostCard.js`

Change the streak display format:

```javascript
// Option 1: Fire emoji before number (default)
<span class="post-author-streak">🔥 ${post.authorStreak}</span>

// Option 2: Number with fire after
<span class="post-author-streak">${post.authorStreak} 🔥</span>

// Option 3: Longer format
<span class="post-author-streak">${post.authorStreak} day streak 🔥</span>

// Option 4: No emoji
<span class="post-author-streak">Streak: ${post.authorStreak}</span>
```

#### Color Scheme

**File:** `forum/styles/forum.css`

Modify these variables:

```css
:root {
  /* Primary action color */
  --tomato-red: rgb(219, 61, 39);
  
  /* Darker variant */
  --tomato-red-dark: rgb(112, 32, 21);
  
  /* Background color */
  --brown: rgb(76, 57, 52);
  
  /* Main text color */
  --yellow-title: rgb(255, 242, 220);
  
  /* Secondary text */
  --yellow-light-2: rgb(224, 210, 185);
  
  /* Muted text */
  --text-muted: rgba(224, 210, 185, 0.6);
  
  /* Button/accent green */
  --button-green: rgba(41, 195, 46, 1);
  
  /* Border color */
  --border-color: rgba(224, 210, 185, 0.1);
}
```

#### Font Settings

Change font in `forum/styles/forum.css`:

```css
* {
  font-family: 'Courier New', Courier, monospace;  /* Change this */
  font-weight: bolder;
}
```

---

### 2. Functional Configuration

#### Posts Per Page

**File:** `forum/services/forumService.js`

```javascript
const POSTS_PER_PAGE = 10;  // Change to 5, 15, 20, etc.
```

#### Character Limits

**File:** `forum/pages/forum.html`

Find and modify:

```html
<!-- Post title - default 100 characters -->
<input type="text" id="post-title" maxlength="100">

<!-- Post body - default 2000 characters -->
<textarea id="post-body" maxlength="2000"></textarea>

<!-- Comment - default 1000 characters -->
<textarea id="comment-body" maxlength="1000"></textarea>
```

#### Time Ago Format

**File:** `forum/components/PostCard.js`

Customize the `formatTimeAgo()` function:

```javascript
function formatTimeAgo(date) {
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  
  // Change this line to customize final format:
  return date.toLocaleDateString();  // e.g., "12/4/2024"
}
```

---

### 3. Default Content

#### Forum Title

**File:** `forum/pages/forum.html`

```html
<h1 class="forum-title">Community Forum</h1>
<!-- Change to -->
<h1 class="forum-title">Productivity Community</h1>
```

#### Sidebar Tips

**File:** `forum/pages/forum.html`

```html
<div style="font-size: 0.85rem; color: var(--yellow-light-2); line-height: 1.5;">
  💡 Share productivity tips<br>
  🤔 Ask for advice<br>
  🎯 Celebrate wins<br>
  🔥 Keep your streak alive
</div>
<!-- Modify the emojis and text as needed -->
```

#### Empty State Messages

**File:** `forum/pages/forum.js`

Find and customize empty state messages:

```javascript
// No posts
postsFeed.innerHTML = `
  <div class="empty-state">
    <div class="empty-state-icon">💭</div>
    <div class="empty-state-text">No posts yet. Start the conversation!</div>
  </div>
`;

// No comments
commentsList.innerHTML = `
  <div class="empty-state">
    <div class="empty-state-icon">🤔</div>
    <div class="empty-state-text">No comments yet. Be the first!</div>
  </div>
`;
```

---

### 4. Firestore Configuration

#### Collection References

If you use different collection names, update `forumService.js`:

```javascript
// Default: "posts"
collection(db, "posts")  // Change "posts" to your collection name

// Default: "comments"
collection(db, "posts", postId, "comments")  // Change "comments" if needed
```

#### Field Names

If your user document uses different field names, update in `forum/pages/forum.js`:

```javascript
// Find getUserData() function and adjust:
return {
  displayName: userDoc.data().yourNameField || "Anonymous",
  currentStreak: userDoc.data().yourStreakField || 0,
};
```

#### Server Timestamp

To use client-side timestamps instead of server timestamps:

**File:** `forum/services/forumService.js`

Replace all instances of:
```javascript
createdAt: serverTimestamp(),
```

With:
```javascript
createdAt: new Date(),
```

**Note:** Server timestamps are recommended for consistency and security.

---

### 5. Security Configuration

#### Modify Vote System

The current implementation uses a simple vote system. To prevent vote manipulation:

**File:** `forum/services/forumService.js`

Add vote limits:

```javascript
export async function upvotePost(postId, userId) {
  try {
    const postRef = doc(db, "posts", postId);
    const postData = await getDoc(postRef);
    
    // Check if user already voted
    if (postData.data().votes?.[userId]) {
      throw new Error("Already upvoted");
    }
    
    await updateDoc(postRef, {
      voteCount: increment(1),
      [`votes.${userId}`]: true
    });
  } catch (error) {
    console.error("Error upvoting post:", error);
    throw error;
  }
}
```

#### Content Moderation

Add a moderation flag to posts:

**In Firestore post document:**
```json
{
  ...
  "reported": false,
  "reportedBy": [],
  "reportCount": 0
}
```

---

### 6. Performance Tuning

#### Enable Post Caching

**File:** `forum/pages/forum.js`

Add a simple cache:

```javascript
const postCache = new Map();

async function getCachedPost(postId) {
  if (postCache.has(postId)) {
    return postCache.get(postId);
  }
  
  const post = await getPost(postId);
  postCache.set(postId, post);
  return post;
}
```

#### Lazy Load Comments

Only load comments when viewing post detail:

```javascript
async function showPostDetail(postId) {
  // Load post header first
  const post = await getPost(postId);
  renderPostDetail(post);
  
  // Then load comments asynchronously
  setTimeout(() => loadComments(postId), 100);
}
```

#### Infinite Scroll Alternative

Instead of "Load More" button, implement infinite scroll:

**File:** `forum/pages/forum.js`

```javascript
window.addEventListener('scroll', async () => {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 500) {
    await loadMorePosts();
  }
});
```

---

### 7. Feature Toggles

#### Disable Post Creation

```javascript
newPostBtn.style.display = "none";
createPostSection.style.display = "none";
```

#### Disable Comments

```javascript
commentForm.style.display = "none";
commentBtn.style.display = "none";
```

#### Disable Voting

```javascript
// In renderPostDetail(), hide upvote button:
upvoteBtn.style.display = "none";
```

#### Read-Only Mode

```javascript
// Make all forms disabled
document.querySelectorAll('form').forEach(form => {
  form.style.display = "none";
});
```

---

### 8. Navigation Configuration

#### Add Custom Breadcrumb

**File:** `forum/pages/forum.html`

Add before the forum-container:

```html
<div style="padding: 20px; color: var(--yellow-light-2);">
  <a href="../../main-page/main-page.html" style="color: var(--tomato-red);">Home</a>
  > Community Forum
</div>
```

#### Custom Back Button Text

**File:** `forum/pages/forum.js`

```javascript
const backBtn = document.getElementById("back-btn");
backBtn.textContent = "← Return to Feed";  // Change from "← Back to Feed"
```

---

### 9. Analytics & Tracking

Add basic analytics:

```javascript
// Track post creation
const postId = await createPost(...);
console.log("Event: post_created", { postId, authorId });

// Track post view
showPostDetail(postId);
console.log("Event: post_viewed", { postId });

// Track comment added
await addComment(...);
console.log("Event: comment_added", { postId });
```

Integrate with Google Analytics:

```javascript
if (window.gtag) {
  gtag('event', 'post_created', { 'postId': postId });
  gtag('event', 'post_viewed', { 'postId': postId });
}
```

---

## Firestore Index Configuration

### Recommended Indexes

Create these in Firebase Console → Firestore → Indexes:

**Index 1: Top Posts Sorting**
```
Collection: posts
Fields:
  - voteCount (Descending)
  - createdAt (Descending)
```

**Index 2: New Posts Sorting**
```
Collection: posts
Fields:
  - createdAt (Descending)
```

**Index 3: User Posts (Optional)**
```
Collection: posts
Fields:
  - authorId (Ascending)
  - createdAt (Descending)
```

---

## Environment-Specific Configuration

### Development Mode

```javascript
const isDevelopment = true;

if (isDevelopment) {
  // Enable detailed logging
  window.DEBUG_FORUM = true;
  
  // Allow test posts
  const allowTestData = true;
}
```

### Production Mode

```javascript
const isDevelopment = false;

if (!isDevelopment) {
  // Disable logging
  console.log = () => {};
  
  // Enable caching
  const enableCache = true;
}
```

---

## Maintenance Commands

### Clear Post Cache
```javascript
postCache.clear();
```

### Reset Forum
```javascript
// Full refresh
location.reload();

// Reload feed only
loadFeed();
```

### Export Posts Data
```javascript
const posts = await getDocs(collection(db, "posts"));
const data = posts.docs.map(doc => ({ id: doc.id, ...doc.data() }));
console.log(JSON.stringify(data, null, 2));
```

---

## Common Configuration Scenarios

### Scenario 1: Private Forum (Members Only)

Modify security rules:

```javascript
match /posts/{postId} {
  allow read: if isAuthenticated();
  allow create: if isAuthenticated();
}
```

### Scenario 2: Moderated Forum

Add moderator role check:

```javascript
allow update: if isModerator(request.auth.uid) || 
              request.auth.uid == resource.data.authorId;
```

### Scenario 3: High-Activity Forum

Increase posts per page:
```javascript
const POSTS_PER_PAGE = 25;
```

Implement pagination with cursors for better performance.

---

This configuration guide covers 90% of common customization needs. For advanced configurations, refer to `FORUM_IMPLEMENTATION.md`.
