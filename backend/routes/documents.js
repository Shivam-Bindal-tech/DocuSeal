const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const Document = require('../models/Document');
const sanitize = require('../middleware/sanitize');

const router = express.Router();

// Multer storage configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Function to generate hash
const generateDocHash = (buffer) => {
  return crypto.createHash('sha256').update(buffer).digest('hex');
};

// @desc    Register a document
// @route   POST /api/documents/register
// @access  Public
router.post('/register', upload.single('file'), sanitize, async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please upload a file' });
  }

  const { uploader, docHash } = req.body;
  if (!uploader) {
    return res.status(400).json({ success: false, message: 'Please provide uploader details' });
  }
  if (!docHash) {
    return res.status(400).json({ success: false, message: 'Missing docHash' });
  }

  try {
    let document = await Document.findOne({ docHash });

    if (document) {
      return res.status(400).json({ success: false, message: 'This exact document has already been registered.' });
    }

    document = await Document.create({
      docName: req.file.originalname,
      uploader,
      docHash,
    });

    res.status(201).json({
      success: true,
      data: document,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @desc    Verify a document
// @route   POST /api/documents/verify
// @access  Public
router.post('/verify', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    const { docHash } = req.body;
    if (!docHash) {
        return res.status(400).json({ success: false, message: 'Missing docHash' });
    }

    try {
        const document = await Document.findOne({ docHash });

        if (document) {
            res.status(200).json({ success: true, status: 'Genuine', record: document });
        } else {
            res.status(200).json({ success: true, status: 'Fake', record: null, message: 'Document not found on the blockchain. It may be altered or not registered.' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// @desc    Get all documents
// @route   GET /api/documents
// @access  Public
router.get('/', async (req, res) => {
  try {
    const documents = await Document.find();
    res.status(200).json({ success: true, data: documents });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @desc    Delete a document
// @route   DELETE /api/documents/:hash
// @access  Public
router.delete('/:hash', async (req, res) => {
    try {
        const document = await Document.findOneAndDelete({ docHash: req.params.hash });

        if (!document) {
            return res.status(404).json({ success: false, message: 'Document not found' });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});


module.exports = router;
