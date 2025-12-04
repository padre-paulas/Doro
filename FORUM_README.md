# DORO Forum - Community Discussion Platform

A Reddit-style, low-dopamine threaded forum integrated into the DORO Pomodoro productivity app. Users can share productivity tips, ask for advice, and celebrate wins with their community while displaying their current focus streak.

---

## Features

✅ **Post Creation & Discussion** - Create posts and engage in threaded conversations
✅ **Streak Integration** - See author's current focus streak (🔥 12) with every post/comment
✅ **Sorting Options** - Sort posts by "New" (latest first) or "Top" (most votes)
✅ **Pagination** - Load 10 posts at a time for better performance
✅ **Upvoting System** - Vote on posts to surface the best content
✅ **Comment Threading** - Read and reply to comments in organized threads
✅ **Authentication** - Secure post/comment creation (requires login)
✅ **Low-Dopamine Design** - Minimal animations, focus-friendly UI
✅ **Responsive Mobile** - Works perfectly on all device sizes
✅ **User Profiles** - Author info with current streak display

---

## Tech Stack

- **Backend**: Firebase Firestore + Firebase Authentication
- **Frontend**: Vanilla JavaScript (ES6 modules)
- **Styling**: Custom CSS (no frameworks - minimal dependencies)
- **Database Schema**: Optimized for read efficiency with denormalization

---

## Quick Start

### 1. **View the Forum**
Navigate to the forum from any page using the menu → "Community"

### 2. **Create a Post** (requires login)
- Click "New Discussion"
- Enter a topic and share your thoughts
- Click "Post" to publish

### 3. **Interact**
- Click any post to view full content and comments
- Click 👍 to upvote posts
- Add comments to join the discussion

---

## Project Structure

```
forum/
├── components/
│   └── PostCard.js                 # Post & comment display components
├── pages/
│   ├── forum.html                  # Main forum page HTML
│   └── forum.js                    # Forum logic & state management
├── services/
│   └── forumService.js             # Firestore CRUD operations
└── styles/
    └── forum.css                   # Styling (low-dopamine design)

Documentation/
├── FORUM_README.md                 # This file
├── FORUM_IMPLEMENTATION.md         # Detailed architecture & API docs
├── FORUM_SETUP.md                  # Step-by-step setup guide
└── CONFIG_GUIDE.md                 # Configuration & customization
```

---

## Key Components

### forumService.js
Handles all Firestore operations:
- `createPost()` - Create new posts
- `fetchPosts()` - Paginated post retrieval with sorting
- `getPost()` - Get single post with all comments
- `addComment()` - Add comment to a post
- `upvotePost()` - Upvote a post
- `searchPosts()` - Search by title or body

### PostCard.js
Display components:
- `createPostCard()` - Renders post in feed with metadata
- `createCommentItem()` - Renders comment in thread
- `formatTimeAgo()` - Format timestamps (e.g., "2h ago")
- `escapeHtml()` - XSS protection

### forum.js
Main application logic:
- Feed management (loading, pagination, sorting)
- Detail view (single post + comments)
- Authentication gating
- Form submission handling
- UI state management

---

## Data Model

### Posts Collection
```javascript
{
  id: "auto-id",
  authorId: "uid",              // Reference to user
  authorName: "John Doe",       // Denormalized for efficiency
  authorStreak: 12,             // Snapshot of streak at posting time
  title: "Best Pomodoro Techniques",
  body: "Here are my favorite...",
  voteCount: 45,
  commentCount: 8,
  createdAt: Timestamp,
  updatedAt: Timestamp,
  deleted: false,
  votes: {
    "user_uid": true            // Track who upvoted
  }
}
```

### Comments Subcollection
```javascript
{
  id: "auto-id",
  authorId: "uid",
  authorName: "Jane Smith",
  authorStreak: 7,
  body: "Great tip!...",
  createdAt: Timestamp
}
```

---

## Authentication

The forum uses Firebase Authentication. Users must be logged in to:
- ✅ Create posts
- ✅ Add comments
- ✅ Upvote posts

Unauthenticated users can:
- ✅ Read all posts and comments
- ✅ View author profiles & streaks

---

## Usage Examples

### Load Posts by Newest
```javascript
const { posts, lastDoc, hasMore } = await fetchPosts("new");
```

### Load Top Posts
```javascript
const { posts, lastDoc, hasMore } = await fetchPosts("top");
```

### Get Single Post with Comments
```javascript
const post = await getPost("post_id_123");
console.log(post.comments); // Array of all comments
```

### Create a Post
```javascript
const postId = await createPost(
  auth.currentUser.uid,
  "John Doe",
  12,
  "My Productivity Tips",
  "Here's what works for me..."
);
```

### Add a Comment
```javascript
await addComment(
  postId,
  auth.currentUser.uid,
  "Jane Smith",
  7,
  "Great advice!"
);
```

---

## Design Principles

### Low-Dopamine Focus
- Minimal animations and transitions
- Subtle colors that don't distract
- Clear typography for readability
- No autoplay videos or pop-ups
- Simple, functional UI

### User Streak Integration
Every post and comment displays the author's current streak:
```
Author Name 🔥 12
```

This provides context on the author's productivity level and encourages continued engagement.

### Responsive Design
- Mobile-first approach
- Works on phones, tablets, desktops
- Touch-friendly buttons and interactions
- Adaptive layouts for all screen sizes

---

## Performance Optimizations

✅ **Pagination**: Load 10 posts at a time
✅ **Denormalization**: Author name/streak stored in post
✅ **Subcollections**: Comments organized under posts
✅ **Lazy Loading**: Comments load only when viewing post
✅ **Firestore Indexes**: Optimized queries for sorting

---

## Security

✅ **XSS Protection**: All user input escaped
✅ **Auth Gating**: Post/comment creation requires authentication
✅ **Server Timestamps**: Uses `serverTimestamp()` to prevent manipulation
✅ **Firestore Rules**: Restricts access based on user authentication
✅ **Author Verification**: Only post authors can delete their posts

---

## Customization

### Change Colors
Edit CSS variables in `forum/styles/forum.css`:
```css
:root {
  --tomato-red: rgb(219, 61, 39);
  --brown: rgb(76, 57, 52);
  --yellow-title: rgb(255, 242, 220);
}
```

### Change Posts Per Page
In `forum/services/forumService.js`:
```javascript
const POSTS_PER_PAGE = 10;  // Change to desired number
```

### Change Streak Display
In `forum/components/PostCard.js`:
```javascript
// From: 🔥 12
// To:   12-Day Streak 🔥
```

See `CONFIG_GUIDE.md` for more customization options.

---

## Setup Instructions

For detailed setup, see `FORUM_SETUP.md`. Quick steps:

1. Create `posts` collection in Firestore
2. Create `comments` subcollection under posts
3. Update Firestore security rules
4. Add forum link to navigation menu
5. Test creating posts and comments

---

## Troubleshooting

**Posts not loading?**
- Check Firestore connection
- Verify security rules allow read access
- Check browser console for errors

**Comments not appearing?**
- Ensure `getPost()` fetches subcollection
- Verify comment count is being incremented
- Check Firestore rules for comments

**Authentication issues?**
- Verify user document exists in `users` collection
- Check Firebase Auth is properly initialized
- Ensure user has `displayName` and `currentStreak` fields

For more help, see `FORUM_IMPLEMENTATION.md`.

---

## Future Enhancements

🚀 User profiles with post history
🚀 Voting on comments
🚀 Post editing & deletion
🚀 Categories/tags for posts
🚀 Advanced search functionality
🚀 User mentions (@username)
🚀 Notifications for replies
🚀 Moderation tools
🚀 Image uploads
🚀 Real-time updates

---

## Files Overview

| File | Purpose |
|------|---------|
| `forum.html` | Main page structure |
| `forum.js` | App logic & state management |
| `forumService.js` | Firestore database operations |
| `PostCard.js` | UI components |
| `forum.css` | Styling |
| `FORUM_README.md` | This file |
| `FORUM_SETUP.md` | Setup instructions |
| `FORUM_IMPLEMENTATION.md` | Technical documentation |
| `CONFIG_GUIDE.md` | Configuration options |

---

## API Reference

### forumService.js

#### `createPost(authorId, authorName, authorStreak, title, body)`
Creates a new forum post.

**Parameters:**
- `authorId` (string): User's UID
- `authorName` (string): User's display name
- `authorStreak` (number): User's current streak
- `title` (string): Post title (max 100 chars)
- `body` (string): Post content (max 2000 chars)

**Returns:** Promise<string> - Document ID of created post

---

#### `fetchPosts(sortBy, lastDoc)`
Fetches paginated posts with sorting.

**Parameters:**
- `sortBy` (string): "new" or "top"
- `lastDoc` (DocumentSnapshot, optional): For pagination

**Returns:** Promise<{posts, lastDoc, hasMore}>

---

#### `getPost(postId)`
Gets a single post with all comments.

**Parameters:**
- `postId` (string): Post document ID

**Returns:** Promise<Object> - Post with comments array

---

#### `addComment(postId, authorId, authorName, authorStreak, body)`
Adds a comment to a post.

**Parameters:**
- `postId` (string): Post document ID
- `authorId` (string): User's UID
- `authorName` (string): User's display name
- `authorStreak` (number): User's current streak
- `body` (string): Comment content (max 1000 chars)

**Returns:** Promise<string> - Document ID of created comment

---

#### `upvotePost(postId, userId)`
Upvotes a post.

**Parameters:**
- `postId` (string): Post document ID
- `userId` (string): User's UID

**Returns:** Promise<void>

---

## Contributing

This forum is part of the DORO Pomodoro application. For issues or feature requests, refer to the main project documentation.

---

## License

Part of the DORO Project by @padre-paulas

---

## Support

For detailed help:
- **Setup Issues**: See `FORUM_SETUP.md`
- **Configuration**: See `CONFIG_GUIDE.md`
- **Technical Details**: See `FORUM_IMPLEMENTATION.md`
- **Usage**: See this file

Last updated: December 4, 2024
