import { Router } from 'express';
import { fileURLToPath } from 'node:url';

const router = Router();
const dir = fileURLToPath(new URL('../../files/cv/', import.meta.url));

const formats = {
  pdf: { file: 'Ashmit_Sharma_CV.pdf', type: 'application/pdf' },
  docx: {
    file: 'Ashmit_Sharma_CV.docx',
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  },
};

router.get('/cv/:format', (req, res) => {
  const format = formats[req.params.format];
  if (!format) return res.status(404).json({ error: 'Format must be pdf or docx' });
  res.type(format.type);
  res.download(dir + format.file, format.file);
});

export default router;
