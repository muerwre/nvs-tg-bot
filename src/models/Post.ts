const mongoose = require('mongoose');
const { Schema } = mongoose;

// Schemas
export const PostSchema = new Schema(
  {
    chat_id: { type: Number, required: true },
    message_id: { type: Number, required: true },
    group_id: { type: Number, required: true },
    post_id: { type: Number, required: true },
    char_count: { type: Number, required: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

export const Post = mongoose.model('Post', PostSchema);

