const chromium = require('chrome-aws-lambda');

module.exports.handler = async (event, context) => {
  try {
    const ep = await chromium.executablePath;

    const browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: ep,
      headless: chromium.headless,
    });

    const page = await browser.newPage();

    // Set the content of the PDF
    await page.setContent('<h1>Hello, World!</h1>');

    // Generate the PDF
    const pdfBuffer = await page.pdf({ format: 'A4' });

    await browser.close();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/pdf',
      },
      body: pdfBuffer.toString('base64'),
      isBase64Encoded: true,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error generating PDF', error: error.message }),
    };
  }
};
