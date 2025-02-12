const express = require('express');
const coursesRouter = require('./courses');

const router = express.Router();

// Use the courses router for /api/courses
router.use('/courses', coursesRouter);

module.exports = router;