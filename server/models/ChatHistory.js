const mongoose = require('mongoose');

const ChatHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // Set false to ease initial sandbox/dev endpoint testing
  },
  category: {
    type: String,
    enum: ['diagram', 'equation', 'graph', 'code', 'whiteboard'],
    required: true,
  },
  imageUrl: {
    type: String,
    required: false,
  },
  analysisResult: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ChatHistory', ChatHistorySchema);
