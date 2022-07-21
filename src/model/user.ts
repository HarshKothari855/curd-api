import { Schema, model } from 'mongoose';

const schema = new Schema(
    {
        name: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        img_url: String,
        img_publicId: String,
        category: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

export default model('user', schema)

