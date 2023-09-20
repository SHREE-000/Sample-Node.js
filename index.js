const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { config } = require('dotenv');
const { readFile } = require('fs').promises;
const { extname } = require('path');
const { fileURLToPath } = require('url');
const users = require('./user.json');
config();

const app = express();

// Middleware
app.use(express.json({limit: '50mb'}));      
app.use(express.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cors());

// Serve static files (CSS, JavaScript, etc.) from the root directory
app.use(express.static(__dirname));

app.get('/', async (req, res) => {
  try {
    const filePath = new URL('./index.html', __filename);

    // Convert the URL to a file path string
    const filePathString = fileURLToPath(filePath);

    // Read the HTML file
    const fileData = await readFile(filePathString, 'utf-8');

    // Set the Content-Type header based on the file extension
    const contentType = extname(filePathString) === '.html' ? 'text/html' : 'text/plain';

    res.set('Content-Type', contentType);
    res.send(fileData);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/users', (req, res) => {
  res.status(200).json(users);
});

app.post('/users', (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  const newUser = { id: users.length + 1, name };
  users.push(newUser);

  res.status(201).json(newUser);
});

app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  const user = users.find((u) => u.id === parseInt(id));

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(user);
});

app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const user = users.find((u) => u.id === parseInt(id));

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  user.name = name;
  return res.json(user);
});

app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  const userIndex = users.findIndex((u) => u.id === parseInt(id));

  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  users.splice(userIndex, 1);
  res.status = 204;
  return res.json(users);
});

// Start server
const port = process.env.PORT || 5500;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
