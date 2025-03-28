const express = require('express');
const sqllite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

let db = new sqllite3.Database('./database.sqllite', (err) => {
  if (err) {
    console.error(err.message);
  }
  else {
    console.log('Connected to the notes database.');
    db.run('CREATE TABLE IF NOT EXISTS chatbot_rules (id INTEGER PRIMARY KEY, question TEXT, response TEXT)', (err) => {console.log(err)});
  }
});

app.post('/chatbot_rules', (req, res) => {
  const { question, response } = req.body;
  db.run('INSERT INTO chatbot_rules (question, response) VALUES (?, ?)', [question, response], (err) => {
    if (err) {
      res.status(500).send('Error inserting data into the database');
    }
    else {
      res.status(200).send('Data inserted into the database');
    }
  });
});
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});