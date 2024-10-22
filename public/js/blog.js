const postsPerPage = 5;
let currentPage = 1;

async function fetchPosts() {
    const response = await fetch('/api/posts');
    const posts = await response.json();
    return posts;
}

function renderPosts(posts) {
    const blogPostsContainer = document.getElementById('blog-posts');
    blogPostsContainer.innerHTML = '';

    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const paginatedPosts = posts.slice(startIndex, endIndex);

    paginatedPosts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('blog-post');
        postElement.innerHTML = `
            <h2><a href="/blog-details/${post.id}">${post.title}</a></h2>
            <p>By ${post.author} on ${new Date(post.date).toLocaleDateString()}</p>
            ${post.image ? `<img src="${post.image}" alt="${post.title}">` : ''}
            <p>${post.content.substring(0, 200)}...</p>
        `;
        blogPostsContainer.appendChild(postElement);
    });

    renderPagination(posts.length);
}

function renderPagination(totalPosts) {
    const totalPages = Math.ceil(totalPosts / postsPerPage);
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.addEventListener('click', () => {
            currentPage = i;
            fetchPosts().then(renderPosts);
        });
        paginationContainer.appendChild(button);
    }
}

function renderTrendingPosts(posts) {
    const trendingPostsContainer = document.getElementById('trending-posts');
    const trendingPosts = posts.sort((a, b) => b.likes - a.likes).slice(0, 5);

    trendingPosts.forEach(post => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="/blog-details/${post.id}">${post.title}</a>`;
        trendingPostsContainer.appendChild(li);
    });
}

function renderRecentPosts(posts) {
    const recentPostsContainer = document.getElementById('recent-posts');
    const recentPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

    recentPosts.forEach(post => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="/blog-details/${post.id}">${post.title}</a>`;
        recentPostsContainer.appendChild(li);
    });
}

fetchPosts().then(posts => {
    renderPosts(posts);
    renderTrendingPosts(posts);
    renderRecentPosts(posts);
});