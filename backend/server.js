const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

const N8N_WEBHOOK_URL = 'https://n8n.rbgct.cloud/webhook/financiera';

app.use(cors());
const upload = multer({ dest: 'uploads/', limits: { fileSize: 20 * 1024 * 1024 } });

if (!fs.existsSync('uploads')) { fs.mkdirSync('uploads'); }

// Asegúrate de que la ruta coincida con la que llamas en el frontend (/api/enviar-formulario o /enviar-formulario)
app.post('/api/enviar-formulario', upload.any(), async (req, res) => {
    try {
        const formData = new FormData();
        
        // Agregar los campos de texto
        for (const key in req.body) { 
            formData.append(key, req.body[key]); 
        }
        
        // Agregar los archivos
        if (req.files && req.files.length > 0) {
            req.files.forEach((file, index) => {
                const inputName = req.files.length > 1 ? `${file.fieldname}_${index}` : file.fieldname;
                formData.append(inputName, fs.createReadStream(file.path), {
                    filename: file.originalname,
                    contentType: file.mimetype
                });
            });
        }

        const response = await axios.post(N8N_WEBHOOK_URL, formData, {
            headers: { ...formData.getHeaders() },
            validateStatus: (status) => status < 500
        });

        // Limpiar archivos temporales
        if (req.files) { req.files.forEach(f => fs.unlink(f.path, () => {})); }
        res.status(response.status).json(response.data);

    } catch (error) {
        console.error("Error al enviar a n8n:", error.message);
        res.status(500).json({ status: 'error', message: 'Error en el procesamiento' });
    }
});

app.listen(port, () => console.log(`API Profesional en puerto ${port}`));