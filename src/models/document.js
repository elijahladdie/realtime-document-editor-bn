import mongoose, { Schema } from 'mongoose';

const documentModal = new Schema({
  content: {
    type: String,
    required: true,
  },
  last_updated_by: {
    type: String, 
  },
});

export const textareaContent = mongoose.model('Document', documentModal);
