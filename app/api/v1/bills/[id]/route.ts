import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Bill from '@/models/Bill';
// Force registration of models
import '@/models/User';
import '@/models/Test';
import { ApiResponse } from '@/types/api';

export async function GET(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    await dbConnect();
    const params = await props.params;
    const id = params.id;

    try {
        const bill = await Bill.findById(id)
            .populate('patient')
            .populate('doctor')
            .populate('tests.test');

        if (!bill) {
            return NextResponse.json({ status: 404, error: 'Bill not found' }, { status: 404 });
        }

        // Fetch associated report status
        const Report = (await import('@/models/Report')).default;
        const report = await Report.findOne({ bill: id }).select('status reportId _id');

        const billData = bill.toObject();
        billData.reportStatus = report ? report.status : 'INITIAL';
        billData.reportId = report ? report.reportId : null;
        billData.reportMongoId = report ? report._id : null;

        return NextResponse.json({
            status: 200,
            data: billData
        });

    } catch (error) {
        return NextResponse.json({
            status: 500,
            error: (error as Error).message
        }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    await dbConnect();
    const params = await props.params;
    const { id } = params;

    try {
        const body = await request.json();
        // Extract fields we allow updating
        // We expect: tests, totalAmount, discountAmount, paidAmount, dueAmount, paymentType, discountType, status
        const { tests, totalAmount, discountAmount, paidAmount, dueAmount, paymentType, discountType, status } = body;

        // 1. Update Bill
        const updatedBill = await Bill.findByIdAndUpdate(
            id,
            {
                tests,
                totalAmount,
                discountAmount,
                paidAmount,
                dueAmount,
                paymentType,
                discountType,
                status // e.g. if PAID -> PARTIAL or vice versa
            },
            { new: true }
        ).populate('tests.test');

        if (!updatedBill) {
            return NextResponse.json({ status: 404, error: 'Bill not found' }, { status: 404 });
        }

        // 2. Sync Report
        const Report = (await import('@/models/Report')).default;
        const report = await Report.findOne({ bill: id });

        if (report) {
            let reportModified = false;
            const existingTestIds = report.results.map((r: any) => r.testId.toString());

            // Check for new tests
            updatedBill.tests.forEach((t: any) => {
                // t.test is populated object due to .populate('tests.test') above
                // Check safety if population failed?
                if (t.test && t.test._id) {
                    const tId = t.test._id.toString();
                    if (!existingTestIds.includes(tId)) {
                        // Add new test result placeholder
                        report.results.push({
                            testId: t.test._id,
                            testName: t.test.name,
                            status: 'PENDING',
                            resultValue: '',
                            unit: t.test.unit || '',
                            referenceRange: '' // Simplification
                        });
                        reportModified = true;
                    }
                }
            });

            if (reportModified) {
                await report.save();
            }
        }

        return NextResponse.json({
            status: 200,
            data: updatedBill,
            message: 'Bill updated and Report synced'
        });

    } catch (error) {
        console.error("Bill PUT Error:", error);
        return NextResponse.json({
            status: 500,
            error: (error as Error).message
        }, { status: 500 });
    }
}
