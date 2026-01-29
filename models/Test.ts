import mongoose, { Schema, model, models } from 'mongoose';
import { ITest } from '@/types/test';

const ReferenceRangeSchema = new Schema({
    name: { type: String, required: true },
    min: { type: Number, required: true },
    max: { type: Number, required: true }
}, { _id: false });

const TestSchema = new Schema<ITest>({
    name: { type: String, required: [true, 'Test name is required'] },
    type: {
        type: String,
        required: [true, 'Test type is required'],
        enum: ['normal', 'descriptive', 'group'],
        default: 'normal'
    },
    shortCode: { type: String },
    tags: { type: [String], default: [] }, // 'Blood Test', etc.
    price: { type: Number, required: [true, 'Price is required'], min: 0 },
    revenueShare: { type: Number, default: 0, min: 0, max: 100 },
    department: { type: Schema.Types.ObjectId, ref: 'Department' },

    // Normal Test Specifics
    unit: { type: String },
    method: { type: String },
    formula: { type: String },
    interpretation: { type: String },
    referenceRanges: [ReferenceRangeSchema],

    // Descriptive Test Specifics
    template: { type: String }, // HTML content from rich text editor

    // Group Test Specifics
    subTests: [{ type: Schema.Types.ObjectId, ref: 'Test' }],
    parentGroup: { type: Schema.Types.ObjectId, ref: 'Test' }

}, { timestamps: true });

export default models.Test || model<ITest>('Test', TestSchema);
