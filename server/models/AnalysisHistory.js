const mongoose = require('mongoose');

const AnalysisHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: false, // Optional if analyzed outside a specific lesson flow
  },
  category: {
    type: String,
    enum: ['diagram', 'equation', 'graph', 'code', 'whiteboard'],
    required: true,
  },
  fileUrl: {
    type: String,
    required: false, // Stores URL path of the analyzed document/image
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

module.exports = mongoose.model('AnalysisHistory', AnalysisHistorySchema);
