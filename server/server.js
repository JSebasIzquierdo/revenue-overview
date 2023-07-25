const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 5000;

app.use(cors());

app.get('/api/csv', (req, res) => {
  fs.readFile('api/revenue-info-2023.csv', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the CSV file:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      const lines = data.trim().split('\n');
      const headers = lines[0].split(',').map((header) => header.trim());
      const jsonArray = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        const jsonObject = {};
        for (let j = 0; j < headers.length; j++) {
          jsonObject[headers[j]] = values[j].trim();
        }
        jsonArray.push(jsonObject);
      }

      res.json(jsonArray);
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
