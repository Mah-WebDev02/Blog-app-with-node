const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs-extra');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/blog', (req, res) => {
  res.sendFile(__dirname + '/public/blog.html');
});

app.get('/blog-details/:id', (req, res) => {
  res.sendFile(__dirname + '/public/blog-details.html');
});

app.get('/upload', (req, res) => {
  res.sendFile(__dirname + '/public/upload.html');
});

// API routes
app.get('/api/posts', (req, res) => {
  const posts = JSON.parse(fs.readFileSync('data/posts.json', 'utf8'));
  res.json(posts);
});

app.post('/api/posts', upload.single('image'), (req, res) => {
  const posts = JSON.parse(fs.readFileSync('data/posts.json', 'utf8'));
  const newPost = {
    id: Date.now().toString(),
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    image: req.file ? `/uploads/${req.file.filename}` : null,
    date: new Date().toISOString(),
    likes: 0,
    comments: []
  };
  posts.push(newPost);
  fs.writeFileSync('data/posts.json', JSON.stringify(posts, null, 2));
  res.json(newPost);
});

app.post('/api/posts/:id/like', (req, res) => {
  const posts = JSON.parse(fs.readFileSync('data/posts.json', 'utf8'));
  const post = posts.find(p => p.id === req.params.id);
  if (post) {
    post.likes++;
    fs.writeFileSync('data/posts.json', JSON.stringify(posts, null, 2));
    res.json({ likes: post.likes });
  } else {
    res.status(404).json({ error: 'Post not found' });
  }
});

app.post('/api/posts/:id/comment', (req, res) => {
  const posts = JSON.parse(fs.readFileSync('data/posts.json', 'utf8'));
  const post = posts.find(p => p.id === req.params.id);
  if (post) {
    const newComment = {
      id: Date.now().toString(),
      author: req.body.author,
      content: req.body.content,
      date: new Date().toISOString()
    };
    post.comments.push(newComment);
    fs.writeFileSync('data/posts.json', JSON.stringify(posts, null, 2));
    res.json(newComment);
  } else {
    res.status(404).json({ error: 'Post not found' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});