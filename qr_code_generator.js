// qr-code-generator.js

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to generate QR code
app.post('/api/generate-qr', async (req, res) => {
    const { qr_code_text } = req.body;
    const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qr_code_text)}&size=150x150`;

    try {
        const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
        const qrCodeImage = Buffer.from(response.data, 'binary').toString('base64');
        res.json({ image: `data:image/png;base64,${qrCodeImage}` });
    } catch (error) {
        res.status(500).json({ error: 'Error generating QR code' });
    }
});

// Serve the HTML page
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>QR Code Generator</title>
            <style>
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    font-family: Arial, sans-serif;
                    background-color: #f8f8f8;
                    color: #333;
                }
                .container {
                    max-width: 320px;
                    width: 100%;
                    text-align: center;
                }
                h1 {
                    font-size: 1.5em;
                    margin-bottom: 1rem;
                }
                input, button {
                    width: 100%;
                    padding: 12px;
                    margin: 10px 0;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 1em;
                }
                button {
                    background-color: #007bff;
                    color: #fff;
                    cursor: pointer;
                    transition: background 0.3s ease;
                }
                button:hover {
                    background-color: #0056b3;
                }
                img {
                    margin-top: 20px;
                    max-width: 100%;
                    height: auto;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>QR Code Generator</h1>
                <input id="qrCodeText" placeholder="Enter text or URL" />
                <button onclick="generateQRCode()">Generate QR Code</button>
                <div id="qrCodeContainer"></div>
            </div>
            <script>
                async function generateQRCode() {
                    const qrCodeText = document.getElementById('qrCodeText').value;
                    const response = await fetch('/api/generate-qr', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ qr_code_text: qrCodeText })
                    });
                    const data = await response.json();
                    if (data.image) {
                        document.getElementById('qrCodeContainer').innerHTML = '<img src="' + data.image + '" alt="QR Code" />';
                    } else {
                        alert('Error generating QR code');
                    }
                }
            </script>
        </body>
        </html>
    `);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
