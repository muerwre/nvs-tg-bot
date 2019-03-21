const mongoose = require('mongoose');
const { Schema } = mongoose;

// Schemas
export const MessageSchema = new Schema(
  {
    user_id: { type: Number, required: true },
    chat: { type: String, required: true },
    group_id: { type: Number, required: true },
    timestamp: { type: Number, required: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

export const Message = mongoose.model('Message', MessageSchema);

