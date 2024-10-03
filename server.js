const http = require('http');
const fs = require('fs');
const path = require('path');
const DATA = "items.json";

const PORT = 3000;
const itemsFilePath = path.join(__dirname, DATA);

const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'GET' && req.url === '/items') {
        fs.readFile(itemsFilePath, 'utf-8', (err, data) => {
            if (err) {
                res.writeHead(500);
                return res.end(JSON.stringify({ error: 'Server Error' }));
            }else{

                const items = JSON.parse(data || '[]'); // Ensure it's an array
                res.writeHead(200);
                res.end(JSON.stringify(items)); // Use `items` instead of `item`
            }
        });
    } else if (req.method === 'POST' && req.url === '/items') {
        let body = "";
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const newItem = JSON.parse(body);
                fs.readFile(itemsFilePath, 'utf8', (err, data) => {
                    if (err) {
                        res.writeHead(500);
                        return res.end(JSON.stringify({ error: 'Server Error' }));
                    }
                    const items = JSON.parse(data || '[]');
                    items.push(newItem);
                    fs.writeFile(itemsFilePath, JSON.stringify(items), err => {
                        if (err) {
                            res.writeHead(500);
                            return res.end(JSON.stringify({ error: 'Server Error' }));
                        }
                        res.writeHead(201);
                        res.end(JSON.stringify(newItem));
                    });
                });
            } catch (err) {
                res.writeHead(400); // Bad Request
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });
    } else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
