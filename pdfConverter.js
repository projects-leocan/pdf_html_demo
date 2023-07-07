const chromium = require('chrome-aws-lambda');
const { response } = require('express');
const puppeteer = require('puppeteer-core');

async function convert_html_string_to_pdf(html_string) {
  let browser = null;
  try{
  browser = await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless
  });
  // const browser = await puppeteer.launch();

  // Create a new page
  const page = await browser.newPage();
  await page.setContent(html_string, { waitUntil: 'networkidle0' });

  await page.emulateMediaType('screen');

// Downlaod the PDF
  const pdf = await page.pdf({
    path: 'pdfData.pdf',
    margin: { top: '100px', right: '50px', bottom: '100px', left: '50px' },
    printBackground: true,
    format: 'A4',
  });

  const response = {
    headers: {
      'Content-type': 'application/pdf',
      'content-disposition': 'attachment; filename=test.pdf'
    },

    statusCode: 200,
    body: pdf.toString('base64'),
    isBase64Encoded: true
  }
  console.log("response" , response );

  await browser.close();  
}
catch(err) {
console.log("err is --------" , err);
}
}

exports.convert_html_string_to_pdf = convert_html_string_to_pdf;