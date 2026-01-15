'use client';
import Link from 'next/link';
import { useState } from 'react';
import styles from './page.module.css';

export default function CreateBillStep1() {
    const [phone, setPhone] = useState('+91 ');

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value;
        if (!val.startsWith("+91 ")) val = "+91 ";
        const clean = val.replace("+91 ", "").replace(/\D/g, "").slice(0, 10);
        setPhone("+91 " + clean);
    };

    return (
        <div style={{ padding: '20px', background: '#eef6ff', minHeight: 'calc(100vh - 60px)' }}>
            <div className={styles.mainCard}>

                {/* STEPPER */}
                <div className={styles.stepper}>
                    <div className={`${styles.step} ${styles.stepActive}`}>
                        <div className={styles.circle}><i className="fa fa-check"></i></div>
                        Patient
                    </div>

                    <div className={styles.stepLine}></div>

                    <div className={styles.step}>
                        <div className={styles.circle}>2</div>
                        <div>Doctor <small style={{display:'block',fontSize:'0.8em'}}>Optional</small></div>
                    </div>

                    <div className={styles.stepLine}></div>

                    <div className={styles.step}>
                        <div className={styles.circle}>3</div>
                        Test
                    </div>

                    <div className={styles.stepLine}></div>

                    <div className={styles.step}>
                        <div className={styles.circle}>4</div>
                        Summary
                    </div>
                </div>

                {/* CONTENT */}
                <div className={styles.cardBody}>
                    <div className={styles.patientTitle}>Patient</div>

                    <div className={styles.searchWrap}>
                        <div className={styles.searchBox}>
                            <label>Search Patient Phone</label>
                            <input 
                                type="tel" 
                                value={phone}
                                onChange={handlePhoneChange}
                                onFocus={(e) => { if(e.target.value.trim() === '') setPhone('+91 '); }}
                            />
                        </div>

                        <div className={styles.searchIcon}>
                            <i className="fa fa-magnifying-glass"></i>
                        </div>

                        <div style={{fontWeight:600}}>OR</div>

                        <Link href="/patients/create" className={styles.createBtn}>
                            CREATE NEW PATIENT
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}
