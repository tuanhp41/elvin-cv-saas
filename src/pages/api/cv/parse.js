/**
 * API Route: /api/cv/parse
 * Nhận PDF upload → extract text → trả về structured text
 * Dùng pdf-parse (server-side only)
 *
 * NOTE: Next.js cần disable bodyParser để nhận multipart/form-data
 */

import fs from 'fs';

import formidable from 'formidable';
import pdfParse from 'pdf-parse';

// Tắt bodyParser mặc định của Next.js để dùng formidable
export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * Parse file PDF từ form upload
 * @param {IncomingMessage} req
 * @returns {Promise<{ filePath: string, fileName: string }>}
 */
function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = formidable({
      maxFileSize: 5 * 1024 * 1024, // 5MB max
      filter: ({ mimetype }) => mimetype === 'application/pdf',
    });

    form.parse(req, (err, _fields, files) => {
      if (err) return reject(err);
      const file = files?.pdf?.[0] || files?.pdf;
      if (!file) return reject(new Error('Không tìm thấy file PDF trong request'));
      resolve({
        filePath: file.filepath || file.path,
        fileName: file.originalFilename || file.name || 'document.pdf',
      });
    });
  });
}

export default async function handler(req, res) {
  // 1. Method check
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  let filePath = null;

  try {
    // 2. Parse file upload
    const { filePath: fp, fileName } = await parseForm(req);
    filePath = fp;

    // 3. Đọc PDF → extract text
    const fileBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(fileBuffer);

    const rawText = pdfData.text || '';

    if (!rawText.trim()) {
      return res.status(422).json({
        success: false,
        error: 'Không thể đọc nội dung PDF. File có thể là scan/ảnh — cần PDF có text.',
      });
    }

    // 4. Làm sạch text cơ bản
    const cleanText = rawText
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')  // Bỏ blank lines thừa
      .trim();

    console.log(`[API] /api/cv/parse — file="${fileName}" pages=${pdfData.numpages} chars=${cleanText.length}`);

    // 5. Success response
    return res.status(200).json({
      success: true,
      data: {
        fileName,
        pages: pdfData.numpages,
        charCount: cleanText.length,
        text: cleanText,
      },
    });

  } catch (error) {
    console.error('[API] /api/cv/parse error:', error.message);

    if (error.message.includes('maxFileSize')) {
      return res.status(413).json({ success: false, error: 'File quá lớn. Tối đa 5MB.' });
    }
    if (error.message.includes('filter')) {
      return res.status(415).json({ success: false, error: 'Chỉ hỗ trợ file PDF.' });
    }

    return res.status(500).json({ success: false, error: error.message || 'Internal server error' });

  } finally {
    // Xóa temp file sau khi xử lý
    if (filePath) {
      try { fs.unlinkSync(filePath); } catch { /* ignore */ }
    }
  }
}
