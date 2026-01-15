import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { Department } from '@/models/Department';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/x-pharma';

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    try {
        await mongoose.connect(MONGODB_URI);
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
};

export async function GET() {
    await connectDB();
    try {
        const departments = await Department.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: departments });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    await connectDB();
    try {
        const body = await req.json();
        console.log('CREATE Department Body:', body);
        const { name, description, icon } = body;

        if (!name) {
            return NextResponse.json({ success: false, error: 'Name is required' }, { status: 400 });
        }

        const existing = await Department.findOne({ name });
        if (existing) {
            return NextResponse.json({ success: false, error: 'Department with this name already exists' }, { status: 400 });
        }

        const department = await Department.create({ name, description, icon });
        return NextResponse.json({ success: true, data: department }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
