import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDepartment extends Document {
    name: string;
    description?: string;
    icon?: string;
    createdAt: Date;
    updatedAt: Date;
}

const DepartmentSchema: Schema<IDepartment> = new Schema(
    {
        name: { type: String, required: true, unique: true },
        description: { type: String },
        icon: { type: String, default: '🏥' },
    },
    {
        timestamps: true,
    }
);

// Force recompilation in dev to ensure schema changes (like new fields) are picked up
if (process.env.NODE_ENV !== 'production') {
    if (mongoose.models.Department) {
        delete mongoose.models.Department;
    }
}

export const Department = mongoose.models.Department || mongoose.model<IDepartment>('Department', DepartmentSchema);
