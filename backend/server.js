const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const os = require('os');
const path = require('path');

const PORT = process.env.PORT || 3000;
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'https://n8n.rbgct.cloud/webhook/financiera';
const MAX_FILE_SIZE_MB = 20;

const app = express();
const upload = multer({
  dest: path.join(os.tmpdir(), 'formulario-finanzas'),
  limits: { fileSize: MAX_FILE_SIZE_MB * 1024 * 1024 },
});

app.use(cors());

/** Reenvía campos y archivos a n8n con los mismos nombres que espera el flujo. */
function buildN8nPayload(fields, files) {
  const payload = new FormData();
  for (const [name, value] of Object.entries(fields)) {
    payload.append(name, value);
  }
  files.forEach((file, index) => {
    // Con varios archivos, n8n los recibe como soporte_financiero_0, soporte_financiero_1, ...
    const fieldName = files.length > 1 ? `${file.fieldname}_${index}` : file.fieldname;
    payload.append(fieldName, fs.createReadStream(file.path), {
      filename: file.originalname,
      contentType: file.mimetype,
    });
  });
  return payload;
}

function removeTempFiles(files) {
  files.forEach((file) => fs.unlink(file.path, () => {}));
}

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.post('/api/enviar-formulario', upload.any(), async (req, res) => {
  const files = req.files ?? [];
  try {
    const payload = buildN8nPayload(req.body, files);
    const response = await axios.post(N8N_WEBHOOK_URL, payload, {
      headers: payload.getHeaders(),
      maxBodyLength: Infinity,
      validateStatus: (status) => status < 500,
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error al enviar a n8n:', error.message);
    res.status(502).json({ status: 'error', message: 'No fue posible procesar el reporte.' });
  } finally {
    removeTempFiles(files);
  }
});

// Errores de multer (p. ej. archivo mayor al límite)
app.use((error, _req, res, _next) => {
  if (error instanceof multer.MulterError) {
    const message =
      error.code === 'LIMIT_FILE_SIZE'
        ? `Cada archivo debe pesar máximo ${MAX_FILE_SIZE_MB} MB.`
        : error.message;
    return res.status(413).json({ status: 'error', message });
  }
  console.error('Error inesperado:', error);
  return res.status(500).json({ status: 'error', message: 'Error interno del servidor.' });
});

app.listen(PORT, () => console.log(`API de Precios de Transferencia en puerto ${PORT}`));
