const fs = require('fs')
const http = require('http');
const url = require('url');

const slugify = require('slugify');

const replaceTemplate = require('./modules/replaceTemplates')

// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log("===>", textIn);

// const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('File written');

////////////////////////////////
/////////////////////////////////////////
//SERVERS

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8')
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8')
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8')
const tempPurchase = fs.readFileSync(`${__dirname}/templates/template-purchase.html`, 'utf-8')

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8')
const dataObj = JSON.parse(data)

const slugs = dataObj.map(el => slugify(el.productName, { lower: true }))
console.log(slugs);


const server = http.createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true);
    console.log(url.parse(req.url, true));


    //Overview page
    if (pathname === '/' || pathname === '/overview') {

        res.writeHead(200, { 'Content-type': 'text/html' });

        const cardHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('')
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardHtml)

        res.end(output);


        // Product Page
    } else if (pathname === '/product') {
        const product = dataObj[query.id]
        const output = replaceTemplate(tempProduct, product)
        res.end(output);

        //Api Page
    } else if (pathname === '/api') {
        res.writeHead(200, { 'Content-type': 'application/json' });
        res.end(data)

        //Purchase Page
    } else if (pathname === '/purchase') {
        const product = dataObj[query.id]
        const output = replaceTemplate(tempPurchase, product)

        res.end(output)

        //Not found
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
        });
        res.end('<h1>Page Not Found!</h1>');
    }

});

server.listen(8000, '127.0.0.1', () => {
    console.log("Listening to requests on port 8000")
})