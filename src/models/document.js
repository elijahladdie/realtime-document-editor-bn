import mongoose, { Schema } from 'mongoose';

const documentModal = new Schema({
    content: {
        type: String,
        required: false
    },
    last_updated_by: {
        type: String,
        required: false
    }
}, { timestamps: true });;

export const textareaContent = mongoose.model('document', documentModal);