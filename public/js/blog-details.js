const postId = window.location.pathname.split('/').pop();

async function fetchPost() {
    const response = await fetch('/api/posts');
    const posts = await response.json();
    return posts.find(post => post.id === postId);
}

function renderPost(post) {
    const postContainer = document.getElementById('blog-post');
    postContainer.innerHTML = `
        <h1>${post.title}</h1>
        <p>By ${post.author} on ${new Date(post.date).toLocaleDateString()}</p>
        ${post.image ? `<img src="${post.image}" alt="${post.title}">` : ''}
        <div>${post.content}</div>
    `;

    const likesContainer = document.getElementById('likes');
    likesContainer.innerHTML = `
        <p>Likes: <span id="likes-count">${post.likes}</span></p>
        <button id="like-button">Like</button>
    `;

    document.getElementById('like-button').addEventListener('click', () => likePost(post.id));

    renderComments(post.comments);
}

async function likePost(postId) {
    const response = await fetch(`/api/posts/${postId}/like`, { method: 'POST' });
    const result = await response.json();
    document.getElementById('likes-count').textContent = result.likes;
}

function renderComments(comments) {
    const commentsContainer = document.getElementById('comments');
    commentsContainer.innerHTML = '<h2>Comments</h2>';

    comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.classList.add('comment');
        commentElement.innerHTML = `
            <p><strong>${comment.author}</strong> on ${new Date(comment.date).toLocaleDateString()}</p>
            <p>${comment.content}</p>
        `;
        commentsContainer.appendChild(commentElement);
    });
}

document.getElementById('comment-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const author = document.getElementById('comment-author').value;
    const content = document.getElementById('comment-content').value;

    const response = await fetch(`/api/posts/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author, content })
    });

    const newComment = await response.json();
    renderComments([...document.querySelectorAll('.comment'), newComment]);

    document.getElementById('comment-author').value = '';
    document.getElementById('comment-content').value = '';
});

fetchPost().then(renderPost);