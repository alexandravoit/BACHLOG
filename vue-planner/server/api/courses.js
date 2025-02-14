
const express = require('express');
const db = require('../database');
const router = express.Router();

// Fetch courses (optionally filtered by semester)
router.get('/', (req, res) => {
  const { semester } = req.query;

  let query = 'SELECT * FROM courses';
  const params = [];

  if (semester) {
    query += ' WHERE semester = ?';
    params.push(semester);
  }

  db.all(query, params, (err, courses) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(courses);
  });
});

// Add a new course
router.post('/', (req, res) => {
  const { semester, code, title, credits, season } = req.body;

  db.run(
    'INSERT INTO courses (semester, code, title, credits, season) VALUES (?, ?, ?, ?, ?)',
    [semester, code, title, credits, season],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID });
    }
  );
});

// Update a course's semester
router.put('/:id', (req, res) => {
  const courseId = req.params.id;
  const { semester } = req.body;

  db.run(
    'UPDATE courses SET semester = ? WHERE id = ?',
    [semester, courseId],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ changes: this.changes });
    }
  );
});

// Update a course's comments and grade
router.put('/:id/details', (req, res) => {
  const courseId = req.params.id;
  const { comments, grade } = req.body;

  db.run(
    'UPDATE courses SET comments = ?, grade = ? WHERE id = ?',
    [JSON.stringify(comments), grade, courseId],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ changes: this.changes });
    }
  );
});

router.delete('/:id', (req, res) => {
    const courseId = req.params.id;

    db.run(
        'DELETE FROM courses WHERE id = ?',
        [courseId],
        function (err) {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.json({ changes: this.changes });
        }
      );
});

router.put('/:id/season', (req, res) => {
  const courseId = req.params.id;
  const { season } = req.body;

  db.run(
    'UPDATE courses SET season = ? WHERE id = ?',
    [season, courseId],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ changes: this.changes });
    }
  );
});

module.exports = router;