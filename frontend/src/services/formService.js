import { FILE_FIELD } from '../config/formSchema.js';

const ENDPOINT = '/api/enviar-formulario';

export async function submitReport(values, files) {
  const body = new FormData();
  for (const [name, value] of Object.entries(values)) {
    body.append(name, value.trim());
  }
  for (const file of files) {
    body.append(FILE_FIELD.name, file);
  }

  const response = await fetch(ENDPOINT, { method: 'POST', body });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Código ${response.status}${detail ? `: ${detail}` : ''}`);
  }
}
