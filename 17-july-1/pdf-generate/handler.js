const puppeteer = require('puppeteer');
module.exports.handler = async (event, context) => {
    try {
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox'],
            executablePath: puppeteer.executablePath(), // Set the path to your Chrome executable
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
                'Content-Disposition': 'attachment; filename="hello.pdf"',
            },
            body: pdfBuffer.toString('base64'),
            isBase64Encoded: true,
        };

        // console.log("pdfBuffer.toString('base64')," ,pdfBuffer.toString('base64'))
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error generating PDF', error: error.message }),
        };
    }
};