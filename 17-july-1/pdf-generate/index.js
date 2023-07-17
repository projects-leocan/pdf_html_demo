const PDFDocument = require('pdfkit');

module.exports.handler = async (event) => {
  try {
    const doc = new PDFDocument();

    // Create a Promise to wait for the document generation to complete
    const pdfPromise = new Promise((resolve) => {
      const chunks = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks);
        resolve(pdfBuffer);
      });
    });

    // Add content to the PDF
    doc.fontSize(25).text('Hello, World!', 100, 100);

    // Finalize the PDF and end the stream
    doc.end();

    // Wait for the Promise to resolve and get the PDF buffer
    const pdfBuffer = await pdfPromise;

    // Create the success response with the PDF content
    const successResponse = {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="hello.pdf"',
      },
      body: pdfBuffer.toString('base64'),
      isBase64Encoded: true,
    };

    return successResponse;
  } catch (error) {
    // If an error occurs during PDF generation, return the error message in the response
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error generating PDF', error: error.message }),
    };
  }
};


// const axios = require('axios');

// module.exports.handler = async (event) => {
//   try {
//     // Make an HTTP GET request to an example API (https://jsonplaceholder.typicode.com/posts/1)
//     const response = await axios.get('https://jsonplaceholder.typicode.com/posts/1');
//     console.log("response =====" ,response.data);

//     // Extract the data from the response
//     const data = response.data;

//     return {
//       statusCode: 200,
//       body: JSON.stringify(data)
//     };
//   } catch (error) {
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ message: 'Error fetching data from the API' })
//     };
//   }
// };