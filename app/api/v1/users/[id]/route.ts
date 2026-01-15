import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User } from '@/models/User';
import { ApiResponse } from '@/types/api';
import { IUser } from '@/types/user';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    await dbConnect();
    try {
        const { id } = await params;
        const user = await User.findById(id);
        if (!user) {
            const response: ApiResponse<null> = { status: 404, error: 'User not found' };
            return NextResponse.json(response, { status: 404 });
        }
        const response: ApiResponse<IUser> = { status: 200, data: user };
        return NextResponse.json(response);
    } catch (error) {
        const response: ApiResponse<null> = { status: 400, error: (error as Error).message };
        return NextResponse.json(response, { status: 400 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    await dbConnect();
    try {
        const { id } = await params;
        const body = await request.json();
        const user = await User.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        if (!user) {
            const response: ApiResponse<null> = { status: 404, error: 'User not found' };
            return NextResponse.json(response, { status: 404 });
        }
        const response: ApiResponse<IUser> = { status: 200, data: user };
        return NextResponse.json(response);
    } catch (error) {
        const response: ApiResponse<null> = { status: 400, error: (error as Error).message };
        return NextResponse.json(response, { status: 400 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    await dbConnect();
    try {
        const { id } = await params;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            const response: ApiResponse<null> = { status: 404, error: 'User not found' };
            return NextResponse.json(response, { status: 404 });
        }
        const response: ApiResponse<object> = { status: 200, data: {} };
        return NextResponse.json(response);
    } catch (error) {
        const response: ApiResponse<null> = { status: 400, error: (error as Error).message };
        return NextResponse.json(response, { status: 400 });
    }
}
