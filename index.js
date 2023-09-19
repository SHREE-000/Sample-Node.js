import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { config } from 'dotenv';
import { readFile } from 'fs/promises';
import { extname } from 'path';
import { fileURLToPath } from 'url';
// import * as swagger from './swagger.html' assert { type: 'json' };
config();

const app = express();

// Middleware
app.use(express.json({limit: '50mb'}));      
app.use(express.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cors());
  
app.get('/', async (req, res) => {
  try {
    const filePath = new URL('./swagger.html', import.meta.url);

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
  res.status(200).json(jsonData);
});

// Start server
const port = process.env.PORT || 5500;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
