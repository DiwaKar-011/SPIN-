const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.static(path.join(__dirname)));
app.use(express.json());

// Initialize SQLite database
const db = new sqlite3.Database(path.join(__dirname, 'sqlite.db'), (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        // Create table if it doesn't exist
        db.run(`
            CREATE TABLE IF NOT EXISTS selections (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                team_name TEXT NOT NULL,
                team_number INTEGER NOT NULL,
                domain TEXT NOT NULL,
                problem_id TEXT NOT NULL,
                problem_title TEXT NOT NULL,
                problem_desc TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
    }
});

// Endpoint to save a selection
app.post('/api/save-selection', (req, res) => {
    const { teamName, teamNumber, domain, problemId, problemTitle, problemDesc } = req.body;

    if (!teamName || !teamNumber || !domain || !problemId || !problemTitle || !problemDesc) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const sql = `INSERT INTO selections (team_name, team_number, domain, problem_id, problem_title, problem_desc) 
                 VALUES (?, ?, ?, ?, ?, ?)`;
                 
    db.run(sql, [teamName, teamNumber, domain, problemId, problemTitle, problemDesc], function(err) {
        if (err) {
            console.error('Error saving to database:', err.message);
            return res.status(500).json({ error: 'Failed to save to database: ' + err.message });
        }
        
        console.log(`Saved Team ${teamNumber} (${teamName}) - Selected Problem: ${problemId}`);
        res.status(201).json({ 
            success: true, 
            id: this.lastID,
            message: 'Selection successfully recorded.'
        });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    console.log(`Serving static files from ${__dirname}`);
});
