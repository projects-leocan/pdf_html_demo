'use strict';
const chromium = require('chrome-aws-lambda');

module.exports.pdf = async (event, context) => {
  let browser = null;
  try {
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.setContent('<h1>Hello, World!</h1>');

    const pdf = await page.pdf({
      format: 'A4',
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=hello.pdf',
      },
      body: pdf.toString('base64'),
      isBase64Encoded: true,
    };
  } catch (error) {
    console.error('Error generating PDF:', error);
    return {
      statusCode: 500,
      body: 'Error generating PDF',
    };
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
};