const fs = require('fs');
const express = require('express');
const ejs = require('ejs');

// Initialize App
const app = express();
const pdfConverter = require('./pdfConverter');

const graphData = {
  xValues: [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150],
  yValues: [7, 8, 8, 9, 9, 9, 10, 11, 14, 14, 15]
}

async function getUpdatedHtmlTempFU() {
  fs.readFile('index.ejs', 'utf8', (err, template) => {
    if (err) {
      console.error('Error reading HTML template:', err);
      return;
    }

    // Render the template with the graph data
    const renderedHtml = ejs.render(template, graphData);

    // Specify the file path and name
    const filePath = 'index.html';

    // Write the rendered HTML to the file
    fs.writeFile(filePath, renderedHtml, (err) => {
      if (err) {
        console.error('Error writing HTML file:', err);
      } else {
        return true
      }
    });
  });

}


async function htmlToPdf() {
  (async () => {
    try {

      const getUpdatedHtmlTemp = await getUpdatedHtmlTempFU()
      const html = fs.readFileSync('index.html', 'utf-8')
      let file = await pdfConverter.convert_html_string_to_pdf(html);
    } catch (err) {
    }
  })()
}


htmlToPdf();