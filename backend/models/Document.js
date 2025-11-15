const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  docName: {
    type: String,
    required: [true, 'Please add a document name'],
    trim: true,
  },
  uploader: {
    type: String,
    required: [true, 'Please add an uploader name'],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  docHash: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model('Document', DocumentSchema);
