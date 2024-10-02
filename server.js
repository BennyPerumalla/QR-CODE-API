const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});