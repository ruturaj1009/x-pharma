import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Report from '@/models/Report';
import { User } from '@/models/User';
import { UserRole } from '@/types/user';

export async function GET(request: Request) {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const date = searchParams.get('date');
    const skip = (page - 1) * limit;

    let query: any = {};

    if (date) {
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);
        query.date = { $gte: startDate, $lte: endDate };
    }

    if (search) {
        // Strategy: Find patients (Users) that match the search, then query by patient ID OR reportId
        try {
            const users = await User.find({
                role: "PATIENT", // Using string "PATIENT" if enum import fails or is tricky, but preferably import UserRole if possible.
                $or: [
                    { firstName: { $regex: search, $options: 'i' } },
                    { lastName: { $regex: search, $options: 'i' } },
                    { phone: { $regex: search, $options: 'i' } }
                ]
            }).select('_id');

            const userIds = users.map(u => u._id);

            query.$or = [
                // { reportId: { $regex: search, $options: 'i' } }, // Legacy
                { patient: { $in: userIds } }
            ];
        } catch (err) {
            console.error("Search lookup failed", err);
        }
    }

    try {
        const total = await Report.countDocuments(query);
        const reports = await Report.find(query)
            .populate('patient', 'firstName lastName phone age gender')
            .populate('doctor', 'firstName lastName title')
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit);

        return NextResponse.json({
            status: 200,
            data: reports,
            metadata: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        return NextResponse.json({ status: 500, error: (error as Error).message }, { status: 500 });
    }
}
