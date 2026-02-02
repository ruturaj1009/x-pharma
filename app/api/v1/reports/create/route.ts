import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Bill from '@/models/Bill';
import Report from '@/models/Report';
import { ReportStatus } from '@/enums/report';

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { billId } = await request.json();

        if (!billId) {
            return NextResponse.json({ status: 400, error: 'Bill ID is required' }, { status: 400 });
        }

        const bill = await Bill.findById(billId)
            .populate('patient')
            .populate('doctor')
            .populate({ path: 'tests.test', populate: { path: 'subTests' } });

        if (!bill) {
            return NextResponse.json({ status: 404, error: 'Bill not found' }, { status: 404 });
        }

        let report = await Report.findOne({ bill: billId });

        if (!report) {
            // Create New
            const reportResults: any[] = [];

            bill.tests.forEach((t: any) => {
                const testDef = t.test;
                if (!testDef) return;

                if (testDef.type === 'group' && testDef.subTests && testDef.subTests.length > 0) {
                    // Group: Nested
                    const groupResult = {
                        testId: testDef._id,
                        testName: testDef.name,
                        type: 'group',
                        status: 'PENDING',
                        groupResults: testDef.subTests.map((sub: any) => ({
                            testId: sub._id,
                            testName: sub.name || 'Unknown Test',
                            type: sub.type || 'normal',
                            status: 'PENDING',
                            unit: sub.unit || '',
                            referenceRange: ''
                        }))
                    };
                    reportResults.push(groupResult);
                } else {
                    // Normal or Descriptive
                    reportResults.push({
                        testId: testDef._id,
                        testName: testDef.name || 'Unknown Test',
                        type: testDef.type || 'normal',
                        status: 'PENDING',
                        unit: testDef.unit || '',
                        referenceRange: ''
                    });
                }
            });

            report = await Report.create({
                bill: bill._id,
                patient: bill.patient._id,
                doctor: bill.doctor._id,
                results: reportResults,
                status: ReportStatus.INITIAL
            });
        }

        return NextResponse.json({
            status: 201,
            data: report,
            message: 'Report synced successfully'
        });

    } catch (error) {
        return NextResponse.json({
            status: 500,
            error: (error as Error).message
        }, { status: 500 });
    }
}
