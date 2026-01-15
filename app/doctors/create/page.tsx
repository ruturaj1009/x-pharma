'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function CreateDoctorPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        gender: 'Male',
        isOrganisation: false,
        email: '',
        mobile: '',
        address: '',
        doctorId: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (e.target.type === 'checkbox') {
             const checked = (e.target as HTMLInputElement).checked;
             setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/v1/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, role: 'DOCTOR' })
            });
            const data = await res.json();
            if (data.success) {
                alert('Doctor Created Successfully');
                router.push('/doctors');
            } else {
                alert('Error: ' + JSON.stringify(data.error));
            }
        } catch (err) {
            console.error(err);
            alert('Failed to create doctor');
        }
    };

    return (
        <div style={{ padding: '20px', background: '#eaf6ff', minHeight: 'calc(100vh - 60px)' }}>
            <div className={styles.formBox}>
                <form onSubmit={handleSubmit}>
                    {/* BASIC DETAILS */}
                    <div className={styles.section}>
                        <h3>Basic Details</h3>

                        <div className={styles.row}>
                            <input 
                                name="firstName" 
                                type="text" 
                                placeholder="First Name"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                            <input 
                                name="lastName" 
                                type="text" 
                                placeholder="Last Name"
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={styles.row}>
                            <select name="gender" value={formData.gender} onChange={handleChange}>
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                            </select>
                        </div>

                        <div className={styles.checkbox}>
                            <input 
                                name="isOrganisation" 
                                type="checkbox" 
                                checked={formData.isOrganisation}
                                onChange={handleChange}
                            />
                            <label>This is a Organisation like Clinic, Hospital, etc.</label>
                        </div>
                    </div>

                    {/* CONTACT DETAILS */}
                    <div className={styles.section}>
                        <h3>Contact Details</h3>

                        <div className={styles.row}>
                            <input 
                                name="email" 
                                type="email" 
                                placeholder="E-mail"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            <input 
                                name="mobile" 
                                type="text" 
                                placeholder="Phone"
                                value={formData.mobile}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={styles.row}>
                            <textarea 
                                name="address" 
                                placeholder="Address"
                                value={formData.address}
                                onChange={handleChange}
                            ></textarea>
                        </div>

                        <div className={styles.row}>
                            <input 
                                name="doctorId" 
                                type="text" 
                                placeholder="Doctor ID"
                                value={formData.doctorId}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* BUTTON LINKS */}
                    <div className={styles.buttons}>
                        <button type="button" className={`${styles.btn} ${styles.btnCancel}`} onClick={() => router.back()}>CANCEL</button>
                        <button type="submit" className={`${styles.btn} ${styles.btnCreate}`}>CREATE</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
