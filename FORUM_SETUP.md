# Forum Setup Guide - Step by Step

## Prerequisites

✅ Firebase project initialized
✅ Firebase Authentication enabled
✅ Firestore database created
✅ Users collection with `displayName` and `currentStreak` fields

---

## Step 1: Create Firestore Collections

### 1.1 Create `posts` Collection

1. Go to Firebase Console → Firestore Database
2. Click "Create collection"
3. Name: `posts`
4. Add a sample document with:
   ```json
   {
     "authorId": "sample_user_id",
     "authorName": "Sample User",
     "authorStreak": 5,
     "title": "Welcome to the Forum!",
     "body": "This is a sample post to get started.",
     "voteCount": 0,
     "commentCount": 0,
     "createdAt": "2024-12-04T12:00:00Z",
     "updatedAt": "2024-12-04T12:00:00Z",
     "deleted": false,
     "votes": {}
   }
   ```

### 1.2 Create `comments` Subcollection

1. In your sample post, click "Create collection"
2. Name: `comments`
3. Add a sample comment:
   ```json
   {
     "authorId": "sample_user_id",
     "authorName": "Sample User",
     "authorStreak": 5,
     "body": "Great post! Thanks for sharing.",
     "createdAt": "2024-12-04T12:05:00Z"
   }
   ```

### 1.3 Ensure `users` Collection Exists

Check that your `users` collection has these fields:
```json
{
  "uid": "user_id",
  "displayName": "John Doe",
  "currentStreak": 12,
  "photoURL": "https://example.com/avatar.jpg",
  "email": "user@example.com"
}
```

---

## Step 2: Update Firestore Security Rules

1. Go to Firebase Console → Firestore Database → Rules
2. Replace with the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Posts collection
    match /posts/{postId} {
      // Anyone can read posts
      allow read: if true;
      
      // Only authenticated users can create posts
      allow create: if request.auth != null;
      
      // Only author can update their post
      allow update: if request.auth.uid == resource.data.authorId;
      
      // Only author can delete their post
      allow delete: if request.auth.uid == resource.data.authorId;
      
      // Comments subcollection
      match /comments/{commentId} {
        // Anyone can read comments
        allow read: if true;
        
        // Only authenticated users can create comments
        allow create: if request.auth != null;
        
        // Only comment author can delete
        allow delete: if request.auth.uid == resource.data.authorId;
      }
    }
    
    // Users collection
    match /users/{userId} {
      // Anyone can read user profiles (for display names, streaks)
      allow read: if true;
      
      // Users can only write their own profile
      allow write: if request.auth.uid == userId;
    }
  }
}
```

3. Click "Publish"

---

## Step 3: Verify Files Are Created

Check that these files exist:

```
forum/
├── components/
│   └── PostCard.js              ✅
├── pages/
│   ├── forum.html               ✅
│   └── forum.js                 ✅
├── services/
│   └── forumService.js          ✅
└── styles/
    └── forum.css                ✅
```

Plus the guide files:
- `FORUM_IMPLEMENTATION.md`      ✅
- `FORUM_SETUP.md`               ✅

---

## Step 4: Add Forum Link to Navigation

### 4.1 Update Main Page (`main-page.html`)

Find the menu dropdown and add the forum link:

```html
<div id="menu-dropdown" class="menu-dropdown">
  <a href="../about-us/about-us.html" class="menu-item">About Us</a>
  <a href="../forum/pages/forum.html" class="menu-item">Community</a>
</div>
```

### 4.2 Update User Account (`user-account.html`)

Find the menu dropdown and add the forum link:

```html
<div id="menu-dropdown" class="menu-dropdown">
  <a href="../../about-us/about-us.html" class="menu-item">About Us</a>
  <a href="../../forum/pages/forum.html" class="menu-item">Community</a>
</div>
```

### 4.3 Update About Us (`about-us.html`)

Find the menu dropdown and add the forum link:

```html
<div id="menu-dropdown" class="menu-dropdown">
  <a href="../about-us/about-us.html" class="menu-item">About Us</a>
  <a href="../forum/pages/forum.html" class="menu-item">Community</a>
</div>
```

### 4.4 Update Focus Leaders (`focus-leaders.html`)

Find the menu dropdown and add the forum link:

```html
<div id="menu-dropdown" class="menu-dropdown">
  <a href="../../about-us/about-us.html" class="menu-item">About Us</a>
  <a href="../../forum/pages/forum.html" class="menu-item">Community</a>
</div>
```

---

## Step 5: Test the Forum

### 5.1 Access the Forum

1. Open your app in a browser
2. Navigate to `main-page.html`
3. Click the menu button (☰)
4. Click "Community"
5. You should see the forum page

### 5.2 Test Creating a Post

1. Log in to your app (if authentication is required)
2. Click "New Discussion"
3. Fill in the form:
   - Topic: "My Favorite Pomodoro Technique"
   - Content: "I love using the 25-5 method..."
4. Click "Post"
5. Your post should appear in the feed

### 5.3 Test Comments

1. Click on a post to view details
2. Click "Add Comment"
3. Type a comment
4. Click "Comment"
5. Your comment should appear below the post

### 5.4 Test Upvoting

1. On a post detail page, click the 👍 button
2. The vote count should increase
3. Click again to remove your upvote

### 5.5 Test Sorting

1. On the feed, click "New" or "Top"
2. Posts should re-sort accordingly

---

## Step 6: Customize (Optional)

### Change Colors

Edit `forum/styles/forum.css`:

```css
:root {
  --tomato-red: rgb(219, 61, 39);      /* Change primary color */
  --brown: rgb(76, 57, 52);            /* Change background */
  --yellow-title: rgb(255, 242, 220);  /* Change text color */
}
```

### Change Posts Per Page

Edit `forum/services/forumService.js`:

```javascript
const POSTS_PER_PAGE = 10; // Change to desired number
```

### Change Streak Display Format

Edit `forum/components/PostCard.js`:

```javascript
// From:
<span class="post-author-streak">🔥 ${post.authorStreak}</span>

// To:
<span class="post-author-streak">${post.authorStreak}-Day Streak 🔥</span>
```

---

## Step 7: Create Firestore Indexes (Recommended)

For optimal performance with sorting:

1. Go to Firebase Console → Firestore → Indexes
2. Click "Create Index"
3. Create these composite indexes:

**Index 1:**
- Collection: `posts`
- Fields to index:
  - `voteCount` (Descending)
  - `createdAt` (Descending)

**Index 2:**
- Collection: `posts`
- Fields to index:
  - `createdAt` (Descending)

These will make the "Top" and "New" sorting very fast.

---

## Step 8: Enable Analytics (Optional)

In `forum/pages/forum.js`, you can track user actions:

```javascript
// Log post creation
console.log("Post created:", postId);

// Log post view
console.log("Post viewed:", postId);

// Log comment added
console.log("Comment added:", commentId);
```

---

## Troubleshooting

### Forum Page Won't Load
**Solution:**
- Check browser console (F12) for errors
- Verify `forum.js` is loading correctly
- Ensure Firebase config is available

### Can't Create Posts
**Solution:**
- Verify you're logged in
- Check Firestore rules allow `create` for authenticated users
- Ensure your user document has `displayName` and `currentStreak`

### Comments Not Showing
**Solution:**
- Check Firestore rules allow read on comments subcollection
- Verify comments are being saved to correct post ID
- Clear browser cache and reload

### Streak Not Displaying
**Solution:**
- Ensure `currentStreak` field exists in user document
- Check it's a number, not a string
- Verify `authorStreak` is being passed to `createPost()`

---

## Monitoring & Debugging

### Enable Debug Logging

Add to `forum/pages/forum.js`:

```javascript
const DEBUG = true;

function debug(message, data) {
  if (DEBUG) {
    console.log(`[FORUM] ${message}`, data);
  }
}

// Usage:
debug("Posts loaded", posts);
debug("Comment added", commentId);
```

### Check Firestore Usage

1. Go to Firebase Console → Firestore
2. Click "Usage" tab
3. Monitor:
   - Read operations (loading posts/comments)
   - Write operations (creating posts/comments)
   - Data stored size

### Test Query Performance

In browser console:

```javascript
// Measure time to load posts
const start = performance.now();
await fetchPosts("new");
console.log(`Posts loaded in ${performance.now() - start}ms`);
```

---

## Deployment Checklist

Before deploying to production:

- [ ] Firestore security rules are set correctly
- [ ] Authentication is properly configured
- [ ] User documents have `displayName` and `currentStreak`
- [ ] Forum links added to all navigation menus
- [ ] CSS styles match app theme
- [ ] All files are in correct folders
- [ ] Test creating, reading, and commenting
- [ ] Test on mobile devices
- [ ] Set up Firestore indexes
- [ ] Monitor performance in Firebase Console

---

## Next Steps

🚀 Consider adding:
1. **User Profiles** - Click username to see user's posts
2. **Thread Notifications** - Notify user of new comments
3. **Post Categories** - Tag posts with topics
4. **Search** - Full-text search for posts
5. **Moderation** - Admin tools to remove spam
6. **User Reputation** - Points system based on votes

---

## Support

For issues, check:
1. Browser console (F12) for error messages
2. Firestore Database rules are correct
3. User collection has required fields
4. Firebase auth is working correctly

Common errors and solutions are documented in `FORUM_IMPLEMENTATION.md`.
