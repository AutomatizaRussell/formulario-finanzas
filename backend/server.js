const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

const N8N_WEBHOOK_URL = 'https://n8n.rbgct.cloud/webhook-test/4bd559a1-cf8b-416b-ae2c-764f1adcd55f';

app.use(cors());
const upload = multer({ dest: 'uploads/', limits: { fileSize: 20 * 1024 * 1024 } });

if (!fs.existsSync('uploads')) { fs.mkdirSync('uploads'); }

app.post('/enviar-formulario', upload.any(), async (req, res) => {
    try {
        const formData = new FormData();
        for (const key in req.body) { formData.append(key, req.body[key]); }
        if (req.files) {
            req.files.forEach(file => {
                formData.append(file.fieldname, fs.createReadStream(file.path), file.originalname);
            });
        }

        const response = await axios.post(N8N_WEBHOOK_URL, formData, {
            headers: { ...formData.getHeaders() },
            validateStatus: (status) => status < 500
        });

        if (req.files) { req.files.forEach(f => fs.unlink(f.path, () => {})); }
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error en el procesamiento' });
    }
});

app.listen(port, () => console.log(`API Profesional en puerto ${port}`));