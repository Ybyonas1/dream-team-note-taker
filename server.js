// Dependencies
const express = require('express');
const path = require('path');
// const util = require('util');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// const api = require('./routes/index.js');
// const db = require('./db/db.json');

// Set up server
const PORT = process.env.PORT || 3001;
const app = express();

// app.use(clog);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) => res.send('public/index.html'))

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    const data = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
    res.json(data)
});

app.post('/api/notes', (req, res) => {
    const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
    req.body.id = uuidv4();
    notes.push(req.body);
    const newNotes = JSON.stringify(notes, null, 2);
    fs.writeFileSync('./db/db.json', newNotes);
    res.json(req.body);
});

app.delete('/api/notes/:id', (req, res) => {
    const data = fs.readFileSync('./db/db.json', 'utf-8');
    const notes = JSON.parse(data).filter(note => note.id !== req.params.id);
    const newNotes = JSON.stringify(notes, null, 2);
    fs.writeFileSync('./db/db.json', newNotes);
    res.json('Note deleted');
})


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);