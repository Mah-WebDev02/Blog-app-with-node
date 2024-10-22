const quill = new Quill('#editor', {
    theme: 'snow'
});

document.getElementById('upload-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const content = quill.root.innerHTML;
    const imageFile = document.getElementById('image').files[0];

    const formData = new FormData();
    formData.append('title', title);
    formData.append('author', author);
    formData.append('content', content);
    if (imageFile) {
        formData.append('image', imageFile);
    }

    try {
        const response = await fetch('/api/posts', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const result = await response.json();
            alert('Blog post uploaded successfully!');
            window.location.href = `/blog-details/${result.id}`;
        } else {
            throw new Error('Failed to upload blog post');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to upload blog post. Please try again.');
    }
});