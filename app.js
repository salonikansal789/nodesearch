const express = require('express');
const { google } = require('googleapis');
const credentials = require('./crediential.json'); // Replace with the path to your credentials JSON file

const app = express();

const sheets = google.sheets('v4');
const sheetsAuth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

// app.get('/', async (req, res) => {
//   try {
//     const authClient = await sheetsAuth.getClient();
//     const spreadsheetId = '1qYOYB4A9I3QKEkO8AZngVrisReAY5gyos1AFOwQ3lLI'; // Replace with the correct spreadsheetId
//     const range = 'Sheet1!A1:G152'; // Replace with the sheet name and range you want to retrieve

//     const response = await sheets.spreadsheets.values.get({
//       auth: authClient,
//       spreadsheetId,
//       range,
//     });

//     const values = response.data.values;

//     if (!values || values.length === 0) {
//       res.send('No data found.');
//     } else {
//       // Convert data to an HTML table
//       const htmlTable = `<table border="1">
//         <tr>${values[0].map(cell => `<th>${cell}</th>`).join('')}</tr>
//         ${values.slice(1).map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}
//       </table>`;

//       res.send(htmlTable);
//     }
//   } catch (error) {
//     console.error('Error fetching data:', error.message);
//     res.status(500).send(`Error fetching data: ${error.message}`);
//   }
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });



app.get('/', async (req, res) => {
  try {
    const authClient = await sheetsAuth.getClient();
    const spreadsheetId = '1qYOYB4A9I3QKEkO8AZngVrisReAY5gyos1AFOwQ3lLI'; // Replace with the correct spreadsheetId
    const range = 'Sheet1!A1:G5'; // Replace with the sheet name and range you want to retrieve

    const response = await sheets.spreadsheets.values.get({
      auth: authClient,
      spreadsheetId,
      range,
    });

    const values = response.data.values;

    if (!values || values.length === 0) {
      res.send('No data found.');
    } else {
      // Render HTML with search input and button
      const html = `
        <form action="/" method="get">
          <label for="search">Search:</label>
          <input type="text" id="search" name="search" />
          <button type="submit">Search</button>
        </form>
        ${renderTable(req.query.search ? filterData(values, req.query.search) : values)}
      `;

      res.send(html);
    }
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).send(`Error fetching data: ${error.message}`);
  }
});
function filterData(data, searchQuery) {
    return data.filter(row =>
      row.some(cell => cell.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }
function renderTable(data) {
  return `<table border="1">
    <tr>${data[0].map(cell => `<th>${cell}</th>`).join('')}</tr>
    ${data.slice(1).map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}
  </table>`;
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});





