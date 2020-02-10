const mongoose = require('mongoose');
const { Schema } = mongoose;

// Schemas
export const VoteSchema = new Schema(
  {
    user_id: { type: Number, required: true },
    chat_id: { type: Number, required: true },
    message_id: { type: Number, required: true },
    emo_id: { type: Number, required: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

export const Vote = mongoose.model('Vote', VoteSchema);

