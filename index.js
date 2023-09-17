import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { config } from 'dotenv';
config();

const app = express();

// Middleware
app.use(express.json({limit: '50mb'}));      
app.use(express.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cors());

// Routes
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.get('/user', (req, res) => {
  res.status(200).json({_id: 1, name: "Shree"});
});

// Start server
const port = process.env.PORT
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
