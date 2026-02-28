const https = require('https');

const BOT_TOKEN = '8442060752:AAF8BjsRoKEY4ulcDBV5GM6xDHeQf1vZxd0';
const MANAGER_ID = '7745794986';

const server = require('http').createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    if (req.method === 'POST' && req.url === '/order') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const { order, total } = JSON.parse(body);
                const text = order.map(p => `• ${p.name} x${p.qty} — ${(p.price * p.qty).toLocaleString()} ₽`).join('\n');
                const message = `🛒 Новый заказ!\n\n${text}\n\n💰 Итого: ${total.toLocaleString()} ₽`;

                const postData = JSON.stringify({
                    chat_id: MANAGER_ID,
                    text: message
                });

                const options = {
                    hostname: 'api.telegram.org',
                    path: `/bot${BOT_TOKEN}/sendMessage`,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': Buffer.byteLength(postData)
                    }
                };

                const request = https.request(options, (response) => {
                    res.writeHead(200);
                    res.end(JSON.stringify({ ok: true }));
                });

                request.write(postData);
                request.end();
            } catch (e) {
                res.writeHead(400);
                res.end(JSON.stringify({ ok: false }));
            }
        });
    } else {
        res.writeHead(404);
        res.end();
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));