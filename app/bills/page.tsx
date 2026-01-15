'use client';
import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function BillsPage() {
    // Static data for now, as no API for bills was requested yet
    const bills = [
        {
            date: '31/12/2025',
            id: 1,
            patient: 'Ms. Janmejaya Panda',
            phone: '7077227961',
            doctor: 'Dr. Bidyadhar Panda',
            total: 750,
            discount: 50,
            due: 0,
            status: '-'
        }
    ];

    return (
        <div style={{ padding: '20px', background: '#eaf6ff', minHeight: 'calc(100vh - 60px)' }}>
            <div className={`container ${styles.cardBox}`} style={{maxWidth:'1200px', margin:'30px auto'}}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Bills</h2>
                    <div className={styles.actions}>
                        <input type="text" placeholder="Search" />
                        <Link href="/bills/create" className={styles.btnPrimary}>CREATE</Link>
                        <input type="date" />
                    </div>
                </div>

                <div style={{overflowX:'auto'}}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Bill Date</th>
                                <th>Bill ID</th>
                                <th>Patient Name</th>
                                <th>Phone</th>
                                <th>Doctor</th>
                                <th>Bill Total (₹)</th>
                                <th>Discount (₹)</th>
                                <th>Due (₹)</th>
                                <th>Report Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bills.map((bill, i) => (
                                <tr key={i}>
                                    <td data-label="Bill Date">{bill.date}</td>
                                    <td data-label="Bill ID">{bill.id}</td>
                                    <td data-label="Patient Name">{bill.patient}</td>
                                    <td data-label="Phone">{bill.phone}</td>
                                    <td data-label="Doctor">{bill.doctor}</td>
                                    <td data-label="Bill Total (₹)">{bill.total}</td>
                                    <td data-label="Discount (₹)">{bill.discount}</td>
                                    <td data-label="Due (₹)">{bill.due}</td>
                                    <td data-label="Report Status">{bill.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className={styles.showMore}>SHOW MORE</div>
            </div>
        </div>
    );
}
