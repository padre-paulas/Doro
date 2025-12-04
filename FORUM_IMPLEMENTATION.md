# Reddit-Style Forum Implementation for DORO

## Overview

This implementation provides a fully-featured Reddit-style threaded forum integrated into the DORO Pomodoro application. The forum enables users to discuss productivity techniques while maintaining a low-dopamine, focus-friendly UI.

---

## Architecture

### Tech Stack
- **Backend**: Firebase Firestore + Firebase Auth
- **Frontend**: Vanilla JavaScript (ES6 modules)
- **Styling**: Custom CSS with DORO design system
- **Database**: Firestore with subcollections for comments

---

## Firestore Schema

### Collections Structure

#### `posts` Collection
```javascript
{
  id: "auto-generated",
  authorId: "uid",              // Reference to user
  authorName: "John Doe",       // Denormalized for efficiency
  authorStreak: 12,             // Snapshot of streak at time of posting
  title: "Best Pomodoro Techniques",
  body: "Here are my favorite...",
  voteCount: 45,
  commentCount: 8,
  createdAt: Timestamp,
  updatedAt: Timestamp,
  deleted: false,
  votes: {
    "user_uid_1": true,
    "user_uid_2": true
  }
}
```

#### `posts/{postId}/comments` Subcollection
```javascript
{
  id: "auto-generated",
  authorId: "uid",
  authorName: "Jane Smith",
  authorStreak: 7,
  body: "Great tip! I use...",
  createdAt: Timestamp
}
```

---

## Service Layer: `forumService.js`

### Core Functions

#### 1. **createPost(authorId, authorName, authorStreak, title, body)**
Creates a new forum post with server timestamp.

```javascript
const postId = await createPost(
  auth.currentUser.uid,
  "John Doe",
  12,
  "Staying Focused",
  "Here's what works for me..."
);
```

#### 2. **fetchPosts(sortBy = "new", lastDoc = null)**
Fetches paginated posts with two sorting options:
- `"new"`: Sorted by `createdAt` descending
- `"top"`: Sorted by `voteCount` descending, then `createdAt` descending

Returns: `{ posts: Array, lastDoc: DocumentSnapshot, hasMore: boolean }`

```javascript
const { posts, lastDoc, hasMore } = await fetchPosts("new");
```

#### 3. **getPost(postId)**
Fetches a single post with all its comments.

```javascript
const post = await getPost("post_id_123");
console.log(post.comments); // Array of comments
```

#### 4. **addComment(postId, authorId, authorName, authorStreak, body)**
Adds a comment to a post and increments comment count atomically.

```javascript
const commentId = await addComment(
  postId,
  auth.currentUser.uid,
  "Jane Smith",
  7,
  "Great advice!"
);
```

#### 5. **upvotePost(postId, userId)**
Increments vote count and tracks user upvote.

#### 6. **removeUpvote(postId, userId)**
Decrements vote count and removes user upvote.

#### 7. **deletePost(postId)**
Soft-deletes a post (only accessible to post author).

#### 8. **searchPosts(searchTerm)**
Full-text search across post titles and bodies.

---

## Components

### PostCard Component (`PostCard.js`)

#### **createPostCard(post, onClick)**
Displays a post in the feed with:
- Author name + streak badge (🔥 12)
- Post title and truncated body
- Vote count and comment count
- Time elapsed since posting

```javascript
const card = createPostCard(post, (postId) => {
  showPostDetail(postId);
});
feedElement.appendChild(card);
```

#### **createCommentItem(comment)**
Displays a comment in the thread with:
- Author name + streak badge
- Comment body
- Timestamp

---

## UI/UX Features

### Design Principles
1. **Low-Dopamine**: Minimal animations, subtle colors, no distracting elements
2. **Streak Integration**: Every author displays their current streak (e.g., "🔥 12")
3. **Two Views**:
   - **Feed View**: Browse all posts, sorted by New or Top
   - **Detail View**: Read full post + all comments

### Key Features
✅ Authentication gating (create post/comment requires login)
✅ Pagination (10 posts per page)
✅ Upvote system with user vote tracking
✅ Comment threading with display of user streaks
✅ Delete post (author only)
✅ Responsive design for mobile
✅ Menu integration with navbar
✅ Streak modal popup

---

## Integration Guide

### 1. **Add Forum Link to Main Navigation**

Edit `main-page.html` and add to the menu dropdown:
```html
<div id="menu-dropdown" class="menu-dropdown">
  <a href="../about-us/about-us.html" class="menu-item">About Us</a>
  <a href="../forum/pages/forum.html" class="menu-item">Community</a>
</div>
```

### 2. **Ensure User Collection Has Required Fields**

Your Firestore `users` collection must have:
```javascript
{
  uid: "user_id",
  displayName: "John Doe",
  photoURL: "https://...",
  currentStreak: 12,
  email: "john@example.com"
}
```

### 3. **Set Firestore Security Rules**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Posts
    match /posts/{postId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth.uid == resource.data.authorId;
      allow delete: if request.auth.uid == resource.data.authorId;
      
      // Comments subcollection
      match /comments/{commentId} {
        allow read: if true;
        allow create: if request.auth != null;
        allow delete: if request.auth.uid == resource.data.authorId;
      }
    }
    
    // Users
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth.uid == userId;
    }
  }
}
```

---

## Usage Examples

### Creating a Post (from forum.js)
```javascript
try {
  const userData = await getUserData(currentUser.uid);
  
  const postId = await createPost(
    currentUser.uid,
    userData.displayName || "Anonymous",
    userData.currentStreak || 0,
    title,
    body
  );
  
  // Reload feed
  loadFeed();
} catch (error) {
  alert("Failed to create post");
}
```

### Loading Posts with Sorting
```javascript
// Load newest posts
const { posts, lastDoc, hasMore } = await fetchPosts("new");

// Load top posts
const { posts, lastDoc, hasMore } = await fetchPosts("top", lastDoc);
```

### Adding a Comment
```javascript
const userData = await getUserData(currentUser.uid);

await addComment(
  postId,
  currentUser.uid,
  userData.displayName || "Anonymous",
  userData.currentStreak || 0,
  commentBody
);
```

---

## File Structure

```
forum/
├── components/
│   └── PostCard.js           # Post and comment display components
├── pages/
│   ├── forum.html            # Main forum HTML
│   └── forum.js              # Forum logic and state management
├── services/
│   └── forumService.js       # Firestore CRUD operations
└── styles/
    └── forum.css             # Forum styling (low-dopamine)
```

---

## Customization

### Changing Posts Per Page
In `forumService.js`:
```javascript
const POSTS_PER_PAGE = 10; // Change to desired number
```

### Adjusting Streak Display
In `PostCard.js`, change:
```javascript
<span class="post-author-streak">🔥 ${post.authorStreak}</span>
```

To something like:
```javascript
<span class="post-author-streak">${post.authorStreak} 🔥</span>
```

### Modifying Colors
Edit CSS variables in `forum.css`:
```css
:root {
  --tomato-red: rgb(219, 61, 39);    /* Primary color */
  --brown: rgb(76, 57, 52);          /* Background */
  --yellow-title: rgb(255, 242, 220); /* Text */
  /* ... etc */
}
```

---

## Security Considerations

✅ **XSS Protection**: All user input escaped with `escapeHtml()`
✅ **Auth Gating**: Post/comment creation requires authentication
✅ **Author Verification**: Delete/edit only available to post author
✅ **Server Timestamps**: Uses `serverTimestamp()` to prevent client manipulation
✅ **Firestore Rules**: Restricts write access based on user authentication

---

## Performance Tips

1. **Pagination**: Posts are loaded 10 at a time for better performance
2. **Denormalization**: Author name and streak stored in post (no extra query)
3. **Subcollections**: Comments stored as subcollection for efficient querying
4. **Indexing**: Consider adding composite indexes for "voteCount + createdAt" sorting

**Firestore Indexes to Create:**
- Collection: `posts`, Fields: `voteCount (Descending)`, `createdAt (Descending)`
- Collection: `posts`, Fields: `createdAt (Descending)`

---

## Troubleshooting

### Posts Not Loading
- Check Firestore connection
- Verify security rules allow read access to posts
- Check browser console for errors

### Comments Not Appearing
- Ensure `getPost()` is fetching subcollection
- Verify comment count is being incremented
- Check Firestore rules allow read/write to comments

### Authentication Not Working
- Ensure `currentUser` is set correctly in `onAuthStateChanged()`
- Verify user document exists in `users` collection
- Check Firebase Auth is properly initialized

---

## Future Enhancements

🚀 User profiles with post history
🚀 Voting on comments
🚀 Post editing
🚀 Thread categorization/tags
🚀 Search functionality
🚀 User mentions (@username)
🚀 Notifications for replies
🚀 Moderation tools
🚀 Post image uploads

---

## Support & Debugging

Enable console logging:
```javascript
// In forumService.js
console.log("Fetching posts with sort:", sortBy);
console.log("Firestore query:", q);
```

Check Firestore data:
1. Open Firebase Console
2. Go to Firestore Database
3. Check `posts` collection structure
4. Verify user data in `users` collection
