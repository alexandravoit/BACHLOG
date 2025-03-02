
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
  const { semester, code, title, credits, season, type } = req.body;

  db.run(
    'INSERT INTO courses (semester, code, title, credits, season, type) VALUES (?, ?, ?, ?, ?, ?)',
    [semester, code, title, credits, season, type],
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

// Delete course
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

// Update season
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

// Update a course's type
router.put('/:id/type', (req, res) => {
  const courseId = req.params.id;
  const { type } = req.body;

  db.run(
    'UPDATE courses SET type = ? WHERE id = ?',
    [type, courseId],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      db.get(
        'SELECT * FROM courses WHERE id = ?',
        [courseId],
        (err, row) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          if (!row) {
            return res.status(404).json({ error: 'Course not found' });
          }

          res.json(row);
        }
      );
    }
  );
});

// Get EAPs by type
router.get('/stats/eap-by-type', (req, res) => {
  const query = `
    SELECT type, SUM(credits) as totalEAP
    FROM courses
    GROUP BY type
  `;

  
  db.all(query, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const stats = rows.reduce((acc, row) => {
      acc[row.type] = row.totalEAP;
      return acc;
    }, {});

    
    const types = ['kohustuslik', 'valikaine', 'vabaaine', 'moodul1', 'moodul2', 'määramata'];
    for (let index = 0; index < types.length; index++) {
      const element = types[index];
      if (!stats[element]) {
        stats[element] = 0;
      }
    }

    console.log("Stats:", stats);
    res.json(stats);
  });
});


router.get('/stats/average', (req, res) => {
  const query = `
      SELECT 
        COALESCE(SUM(grade * credits), 0) * 1.0 / NULLIF(SUM(credits), 0) as average
      FROM courses
      WHERE grade IS NOT NULL AND grade <> '';
  `;

  db.get(query, (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Handle case where SUM(credits) is 0
    if (!row.average) {
      return res.json({ average: 0 });
    }

    res.json({ average: row.average });
  });
});



module.exports = router;