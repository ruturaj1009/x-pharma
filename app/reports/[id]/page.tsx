'use client';
import { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast'; 
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ReportStatus } from '@/enums/report';

interface TestResult {
    testId: string;
    testName: string;
    resultValue: string;
    unit?: string;
    referenceRange?: string;
    status: string;
}

interface Report {
    _id: string;
    reportId: string;
    date: string;
    status: string;
    patient: { _id: string; firstName: string; lastName: string; phone: string; age: number; gender: string };
    doctor: { _id: string; firstName: string; lastName: string; title: string };
    bill: { _id: string; dueAmount: number };
    results: TestResult[];
    createdAt: string;
}

export default function ReportDetailsPage() {
    const params = useParams();
    const id = params?.id as string;

    const [report, setReport] = useState<Report | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    // Status Options & Mapping
    const statusOptions = ['Initial', 'In Process', 'Completed', 'Verified & Signed', 'Printed', 'Delivered'];
    const reportStatusMap: Record<string, string> = {
        'Initial': ReportStatus.INITIAL,
        'In Process': ReportStatus.IN_PROGRESS,
        'Completed': ReportStatus.COMPLETED,
        'Verified & Signed': ReportStatus.VERIFIED,
        'Printed': ReportStatus.PRINTED,
        'Delivered': ReportStatus.DELIVERED
    };

    useEffect(() => {
        if (id) {
            fetchReport(id);
        }
    }, [id]);

    async function fetchReport(reportId: string) {
        try {
            const res = await fetch(`/api/v1/reports/${reportId}`);
            const data = await res.json();
            if (res.ok) {
                setReport(data.data);
            } else {
                toast.error('Failed to load report');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const handleStatusChange = async (newStatus: string) => {
        if (!report) return;
        setSaving(true);
        try {
            const res = await fetch(`/api/v1/reports/${report._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            const data = await res.json();
            if (res.ok) {
                setReport(data.data);
                toast.success(`Status updated to ${newStatus}`);
            } else {
                toast.error('Failed to update status');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const handleResultChange = (index: number, field: keyof TestResult, value: string) => {
        if (!report) return;
        const newResults = [...report.results];
        // @ts-ignore
        newResults[index][field] = value;
        setReport({ ...report, results: newResults });
    };

    const saveResults = async () => {
        if (!report) return;
        setSaving(true);
        try {
            const res = await fetch(`/api/v1/reports/${report._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ results: report.results })
            });
            const data = await res.json();
            if (res.ok) {
                setReport(data.data);
                toast.success('Results saved successfully');
            } else {
                toast.error('Failed to save results');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div style={{padding:'40px', textAlign:'center'}}>Loading...</div>;
    if (!report) return <div style={{padding:'40px', textAlign:'center'}}>Report not found</div>;

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleString('en-IN', {
             year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute:'2-digit' 
        });
    };

    return (
        <div style={{ padding: '20px', background: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
            <Toaster position="top-right" />
            
            {/* Main Card */}
            <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
                
                {/* Header Information */}
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', marginBottom: '30px' }}>
                    
                    {/* Patient Info */}
                    <div style={{ flex: 1, minWidth: '250px' }}>
                        <div style={{ fontSize: '15px', color: '#1e293b', marginBottom: '8px' }}>
                            <span style={{color: '#64748b'}}>Patient: </span> 
                            <span style={{fontWeight: 700}}>{report.patient?.firstName} {report.patient?.lastName}</span>
                        </div>
                        <div style={{ fontSize: '15px', color: '#1e293b', marginBottom: '8px' }}>
                            <span style={{color: '#64748b'}}>Sex / Age: </span> 
                            <span style={{fontWeight: 600}}>{report.patient?.gender} / {report.patient?.age} Years</span>
                        </div>
                        <div style={{ fontSize: '15px', color: '#1e293b' }}>
                            <span style={{color: '#64748b'}}>Referred By: </span> 
                            <span style={{fontWeight: 600}}>
                                {report.doctor?.firstName === 'SELF' ? 'Self' : `Dr. ${report.doctor?.firstName} ${report.doctor?.lastName}`}
                            </span>
                        </div>
                    </div>

                    {/* Report Info */}
                    <div style={{ flex: 1, minWidth: '250px' }}>
                        <div style={{ fontSize: '15px', color: '#1e293b', marginBottom: '8px' }}>
                            <span style={{color: '#64748b'}}>Sampling Date: </span> 
                            <span style={{fontWeight: 600}}>{formatDate(report.createdAt)}</span>
                        </div>
                         <div style={{ fontSize: '15px', color: '#1e293b', marginBottom: '8px' }}>
                            <span style={{color: '#64748b'}}>Report Date: </span> 
                            <span style={{fontWeight: 600}}>{formatDate(report.createdAt)}</span>
                        </div>
                        <div style={{ fontSize: '15px', color: '#1e293b' }}>
                            <span style={{color: '#64748b'}}>Report ID: </span> 
                            <span style={{fontWeight: 600}}>{report.reportId}</span>
                        </div>
                    </div>

                    {/* Status & Due */}
                    <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '15px' }}>
                         <div style={{ fontSize: '15px', color: '#1e293b' }}>
                            <span style={{color: '#64748b'}}>Due Amount: </span> 
                            <span style={{
                                background: report.bill?.dueAmount > 0 ? '#ef4444' : '#4caf50', 
                                color: 'white', 
                                padding: '2px 8px', 
                                borderRadius: '4px',
                                fontWeight: 600
                            }}>₹{report.bill?.dueAmount}</span>
                        </div>

                        {/* Status Dropdown */}
                        <div style={{ position: 'relative', width: '200px' }}>
                            <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '2px' }}>Report Status</label>
                            <select 
                                value={statusOptions.find(opt => reportStatusMap[opt] === report.status) || report.status}
                                onChange={(e) => handleStatusChange(reportStatusMap[e.target.value] || e.target.value)}
                                style={{ 
                                    width: '100%', 
                                    padding: '10px', 
                                    background: '#f1f5f9', 
                                    border: 'none', 
                                    borderRadius: '6px',
                                    fontWeight: 600, 
                                    color: '#334155',
                                    cursor: 'pointer'
                                }}
                            >
                                {statusOptions.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* divider */}
                <hr style={{border: 'none', borderTop: '1px solid #e2e8f0', margin: '0 0 20px 0'}} />

                {/* Tests Table */}
                <div style={{marginBottom: '30px'}}>
                     <table style={{width: '100%', borderCollapse: 'collapse'}}>
                        <thead>
                            <tr style={{ textAlign: 'left', fontSize: '13px', color: '#64748b', fontWeight: 700 }}>
                                <th style={{padding: '10px 5px', width: '30%'}}>Test Name</th>
                                <th style={{padding: '10px 5px', width: '30%'}}>Result</th>
                                <th style={{padding: '10px 5px', width: '25%'}}>Ref Range</th>
                                <th style={{padding: '10px 5px', width: '15%'}}>Unit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {report.results.map((result, idx) => (
                                <tr key={idx} style={{borderBottom: '1px solid #f1f5f9'}}>
                                    <td style={{padding: '15px 5px', verticalAlign: 'middle'}}>
                                        <div style={{fontWeight: 500, color: '#334155'}}>{result.testName}</div>
                                    </td>
                                    
                                    <td style={{padding: '15px 5px'}}>
                                        <input 
                                            value={result.resultValue || ''}
                                            onChange={(e) => handleResultChange(idx, 'resultValue', e.target.value)}
                                            placeholder="Enter Value"
                                            style={{
                                                width: '100%',
                                                padding: '8px',
                                                border: '1px solid #cbd5e1',
                                                borderRadius: '6px',
                                                outline: 'none'
                                            }}
                                        />
                                    </td>
                                    
                                    <td style={{padding: '15px 5px'}}>
                                        <input 
                                            value={result.referenceRange || ''}
                                            onChange={(e) => handleResultChange(idx, 'referenceRange', e.target.value)}
                                            placeholder="Range"
                                            style={{
                                                width: '100%',
                                                padding: '8px',
                                                border: '1px solid #cbd5e1',
                                                borderRadius: '6px',
                                                outline: 'none',
                                                background: '#f8fafc'
                                            }}
                                        />
                                    </td>
                                    
                                    <td style={{padding: '15px 5px'}}>
                                         <input 
                                            value={result.unit || ''}
                                            onChange={(e) => handleResultChange(idx, 'unit', e.target.value)}
                                            placeholder="Unit"
                                            style={{
                                                width: '100%',
                                                padding: '8px',
                                                border: '1px solid #cbd5e1',
                                                borderRadius: '6px',
                                                outline: 'none',
                                                 background: '#f8fafc'
                                            }}
                                        />
                                    </td>
                                    
                                     <td style={{padding: '15px 5px'}}>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                     </table>
                     
                     <div style={{marginTop: '20px', textAlign: 'right'}}>
                        <button 
                            onClick={saveResults}
                            disabled={saving}
                            style={{
                                background: '#3b82f6',
                                color: 'white',
                                padding: '10px 25px',
                                border: 'none',
                                borderRadius: '6px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                opacity: saving ? 0.7 : 1
                            }}
                        >
                            {saving ? 'Saving...' : 'Save Results'}
                        </button>
                     </div>
                </div>

            </div>

             {/* Footer Actions */}
             <div style={{maxWidth: '1200px', margin: '30px auto', textAlign: 'center'}}>
                 <Link href="/reports" style={{
                     display: 'inline-block', 
                     padding: '10px 20px', 
                     background: '#e2e8f0', 
                     color: '#475569', 
                     fontWeight: 600, 
                     borderRadius: '6px', 
                     textDecoration: 'none',
                     fontSize: '13px',
                     textTransform: 'uppercase',
                     marginBottom: '30px'
                 }}>
                    Go to Reports List
                 </Link>

                 {/* Action Buttons Row */}
                 <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <button style={actionBtnStyle('#2e7d32')}>EDIT</button>
                    <button style={actionBtnStyle('#1565c0')}>PRINT</button>
                    <button style={actionBtnStyle('#1565c0')}>CUSTOM PRINT</button>
                    <button style={actionBtnStyle('#1565c0')}>PRINT SETTINGS</button>
                    <button style={actionBtnStyle('#1565c0')}>SEND</button>
                    <Link href={`/bills/${report?.bill?._id}`}>
                        <button style={actionBtnStyle('#1565c0')}>VIEW BILL</button>
                    </Link>
                    <button style={actionBtnStyle('#2e7d32')}>VIDEO TUTORIAL</button>
                    <button style={actionBtnStyle('#1565c0')}>MORE ACTIONS</button>
                 </div>
             </div>
        </div>
    );
}

const actionBtnStyle = (bgColor: string) => ({
    background: bgColor,
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    fontWeight: 700,
    fontSize: '13px',
    cursor: 'pointer',
    textTransform: 'uppercase' as const,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
});
