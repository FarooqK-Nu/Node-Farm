const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate');
const slugify = require('slugify');

// variables
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);
const slugs = dataObj.map(el => slugify(el.productName, { lower: true }));
console.log(slugs);

//defining template variables
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8',
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8',
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8',
);

// creating a server
const server = http.createServer((req, res) => {
  // const pathname = req.url;
  const { query, pathname } = url.parse(req.url, true);
  // console.log(url.parse(req.url), true);
  //overview page
  // console.log(query, pathName);
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      'content-type': 'text/html',
    });

    const cardsHTML = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
    const output = tempOverview.replace('(%PRODUCT_CARDS%)', cardsHTML);
    res.end(output);
    // product page
  } else if (pathname === '/product') {
    res.writeHead(200, {
      'content-type': 'text/html',
    });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
    //api page
  } else if (pathname === '/api') {
    const prodData = JSON.parse(data);
    res.writeHead(200, {
      'Content-type': 'application/json',
    });
    res.end(data);

    //not found
  } else {
    res.writeHead(404, {
      'content-type': 'text/html',
      'my-header': 'hi world',
    });
    res.end('<h1> page not found!</h1>');
  }
});

// activating the server
server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requests in port 8000');
});
