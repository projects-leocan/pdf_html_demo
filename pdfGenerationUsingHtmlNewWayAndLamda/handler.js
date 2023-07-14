var admin = require("firebase-admin");
var serviceAccount = require("./firbase-pdfupload.json");
const pdfConverter = require('./pdfConverter');
const htmlString = require("./index")

//initialize firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "firbase-pdfupload.appspot.com/"
});

//initialize firebase bucket
var bucket = admin.storage().bucket();

const graphData = {
  xValues: [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150],
  yValues: [7, 8, 8, 9, 9, 9, 10, 11, 14, 14, 15]
}

// Function to upload PDF file to Firebase Storage
async function uploadPDF(response, filename) {
  try {
    const fileBuffer = Buffer.from(response, 'base64');

    const file = bucket.file(filename);
    const writeStream = file.createWriteStream({
      metadata: {
        contentType: 'application/pdf'
      }
    });

    // Write the file buffer to the write stream
    writeStream.end(fileBuffer);

    return new Promise((resolve, reject) => {
      // Handle the write stream events
      writeStream.on('finish', () => {
        resolve();
      });

      writeStream.on('error', (error) => {
        resolve();
      });
    });
  } catch (error) {
    console.error('Error uploading PDF:', error);
  }
}

module.exports.generatePdfAndUpload = async (event, context) => {
  try {
    const html = await htmlString(graphData)
    const response = await pdfConverter.convert_html_string_to_pdf(html);
    const destinationPath = `new-pdf-html/${Math.floor(new Date().getTime() / 1000.0)}.pdf`;
    
    await uploadPDF(response.body, destinationPath);

    console.log('PDF generated and uploaded successfully.');

    return {
      statusCode: 200,
      body: 'PDF generated and uploaded successfully.'
    };
  } catch (error) {
    console.error('Error generating and uploading PDF:', error);

    return {
      statusCode: 500,
      body: 'Error generating and uploading PDF'
    };
  }
};