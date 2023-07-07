const fs = require('fs');
const express = require('express');
const ejs = require('ejs');
var admin = require("firebase-admin");
const path = require('path')
var serviceAccount = require("./firbase-pdfupload.json");


// Initialize App
const app = express();
const pdfConverter = require('./pdfConverter');


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "firbase-pdfupload.appspot.com/"
});


var bucket = admin.storage().bucket();

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



// Function to upload PDF file to Firebase Storage
async function uploadPDF(filePath, destinationPath) {
  try {
    await bucket.upload(filePath, {
      destination: destinationPath,
      metadata: {
        contentType: 'application/pdf'
      }
    });
  } catch (error) {
    console.error('Error uploading PDF:', error);
  }
}

// Usage example
var filePath = path.join(__dirname, 'pdfData.pdf');

const destinationPath = `html_pdf/${Math.floor(new Date().getTime() / 1000.0)}.pdf`;
setTimeout(() => {
  uploadPDF(filePath, destinationPath);
}, 10000);
