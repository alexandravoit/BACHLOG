const express = require('express');
const apiRouter = require('./api');
const db = require('./database');

const app = express();
const PORT = 3000;
const cors = require("cors");

app.use(cors({
    origin: "http://localhost:8080",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization"
}));
  

// Middleware to parse JSON requests
app.use(express.json());

// Use the API router
app.use('/api', apiRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});