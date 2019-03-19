const mongoose = require('mongoose');
const { Schema } = mongoose;

// Schemas
export const PostSchema = new Schema(
  {
    chat_id: { type: Number, required: true },
    message_id: { type: Number, required: true },
    group_id: { type: Number, required: true },
    post_id: { type: Number, required: true },
    is_cutted: { type: Boolean, default: false },
    map_url: { type: String, required: false },
    post_url: { type: String, required: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

export const Post = mongoose.model('Post', PostSchema);

