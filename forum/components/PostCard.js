/**
 * PostCard Component
 * Displays a forum post with author streak, vote count, and comment preview
 */
export function createPostCard(post, onClick) {
  const card = document.createElement('div');
  card.className = 'post-card';
  card.dataset.postId = post.id;

  // Format timestamp
  const createdDate = post.createdAt?.toDate?.() || new Date(post.createdAt);
  const timeAgo = formatTimeAgo(createdDate);

  // Truncate body if too long
  const bodyPreview = post.body.length > 150 
    ? post.body.substring(0, 150) + '...' 
    : post.body;

  card.innerHTML = `
    <div class="post-card-header">
      <div class="post-author-info">
        <span class="post-author-name">${escapeHtml(post.authorName)}</span>
        <span class="post-author-streak">🔥 ${post.authorStreak}</span>
      </div>
      <span class="post-time">${timeAgo}</span>
    </div>

    <div class="post-card-title">${escapeHtml(post.title)}</div>

    <div class="post-card-body">${escapeHtml(bodyPreview)}</div>

    <div class="post-card-footer">
      <div class="post-stats">
        <span class="post-stat">
          <span class="stat-icon">👍</span>
          ${post.voteCount || 0}
        </span>
        <span class="post-stat">
          <span class="stat-icon">💬</span>
          ${post.commentCount || 0}
        </span>
      </div>
    </div>
  `;

  card.addEventListener('click', () => {
    if (onClick) onClick(post.id);
  });

  return card;
}

/**
 * CommentItem Component
 * Displays a single comment in the thread
 */
export function createCommentItem(comment) {
  const item = document.createElement('div');
  item.className = 'comment-item';

  const createdDate = comment.createdAt?.toDate?.() || new Date(comment.createdAt);
  const timeAgo = formatTimeAgo(createdDate);

  item.innerHTML = `
    <div class="comment-header">
      <div class="comment-author-info">
        <span class="comment-author-name">${escapeHtml(comment.authorName)}</span>
        <span class="comment-author-streak">🔥 ${comment.authorStreak}</span>
      </div>
      <span class="comment-time">${timeAgo}</span>
    </div>
    <div class="comment-body">${escapeHtml(comment.body)}</div>
  `;

  return item;
}

/**
 * Format date to "time ago" format
 */
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
  
  return date.toLocaleDateString();
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
