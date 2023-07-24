const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 5000; // You can use any port you prefer

app.use(cors());

// Define your API endpoint to serve the CSV file
app.get('/api/csv', (req, res) => {
  // Read the CSV file (assuming the file is named 'data.csv' and located in the root folder)
  fs.readFile('api/revenue-info-2023.csv', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the CSV file:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      // Split the CSV data into an array of lines
      const lines = data.trim().split('\n');
      // Assuming the first line contains the headers (column names)
      const headers = lines[0].split(',');
      // Initialize an empty array to store the JSON objects
      const jsonArray = [];

      // Iterate over each line starting from the second one (index 1) and create a JSON object
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        const jsonObject = {};
        for (let j = 0; j < headers.length; j++) {
          jsonObject[headers[j]] = values[j];
        }
        jsonArray.push(jsonObject);
      }

      // Respond with the JSON array containing the CSV data
      res.json(jsonArray);
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
