'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

interface Department {
    _id: string;
    name: string;
    description?: string;
    icon?: string;
}

const ICONS = ['🏥', '🧬', '❤️', '🩸', '🔬', '🦴', '🧠', '🦷', '👶', '🦠'];

export default function TestsPage() {
    const [searchVal, setSearchVal] = useState('');
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [formName, setFormName] = useState('');
    const [formIcon, setFormIcon] = useState(ICONS[0]);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const res = await fetch('/api/v1/departments');
            const data = await res.json();
            if (data.success) {
                setDepartments(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch departments', error);
        } finally {
            setLoading(false);
        }
    };

    const openCreateModal = () => {
        setIsEditing(false);
        setCurrentId(null);
        setFormName('');
        setFormIcon(ICONS[0]);
        setShowModal(true);
    };

    const openEditModal = (dept: Department, e: React.MouseEvent) => {
        e.preventDefault();
        setIsEditing(true);
        setCurrentId(dept._id);
        setFormName(dept.name);
        setFormIcon(dept.icon || ICONS[0]);
        setShowModal(true);
    };

    const handleSubmit = async () => {
        if (!formName.trim()) return;
        setSubmitting(true);
        
        try {
            const url = isEditing 
                ? `/api/v1/departments/${currentId}` 
                : '/api/v1/departments';
            const method = isEditing ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: formName, icon: formIcon }),
            });
            
            const data = await res.json();
            
            if (data.success) {
                if (isEditing) {
                    setDepartments(departments.map(d => d._id === currentId ? data.data : d));
                } else {
                    setDepartments([data.data, ...departments]);
                }
                setShowModal(false);
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error('Failed to save department', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        if (!confirm('Are you sure you want to delete this department?')) return;

        try {
            const res = await fetch(`/api/v1/departments/${id}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (data.success) {
                setDepartments(departments.filter(d => d._id !== id));
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error('Failed to delete department', error);
        }
    };

    const filteredDepts = departments.filter(d => 
        d.name.toLowerCase().includes(searchVal.toLowerCase())
    );

    return (
        <div style={{ padding: '20px', background: 'linear-gradient(135deg,#eaf6ff,#f7fbff)', minHeight: 'calc(100vh - 60px)' }}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.headerTitle}>All Departments</div>
                    
                    <div className={styles.actions}>
                        <div className={styles.searchBox}>
                            <input 
                                type="text" 
                                placeholder="Search departments..." 
                                value={searchVal}
                                onChange={(e) => setSearchVal(e.target.value)}
                            />
                        </div>

                        <button 
                            onClick={openCreateModal}
                            style={{
                                padding: '10px 16px',
                                background: '#3f51b5',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: 600,
                                boxShadow: '0 4px 6px rgba(63, 81, 181, 0.2)',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            + Add Department
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <div className={styles.list}>
                        {filteredDepts.map((d) => (
                            <Link href="#" key={d._id}>
                                <div className={styles.listItem} style={{ alignItems: 'center', gap: '15px' }}>
                                    <div style={{ 
                                        fontSize: '24px', 
                                        background: '#f0f4ff', 
                                        width: '45px', 
                                        height: '45px', 
                                        borderRadius: '10px', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center' 
                                    }}>
                                        {d.icon || '🏥'}
                                    </div>
                                    <span style={{ 
                                        flex: 1, 
                                        fontWeight: 600, 
                                        color: '#1e293b',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        marginRight: '10px'
                                    }}>
                                        {d.name}
                                    </span>
                                    
                                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                                        <button 
                                            onClick={(e) => openEditModal(d, e)}
                                            style={{
                                                background: '#eff6ff',
                                                color: '#3b82f6',
                                                border: '1px solid #dbeafe',
                                                borderRadius: '6px',
                                                width: '30px',
                                                height: '30px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '14px'
                                            }}
                                            title="Edit"
                                        >
                                            ✏️
                                        </button>
                                        <button 
                                            onClick={(e) => handleDelete(d._id, e)}
                                            style={{
                                                background: '#fff1f2',
                                                color: '#f43f5e',
                                                border: '1px solid #ffe4e6',
                                                borderRadius: '6px',
                                                width: '30px',
                                                height: '30px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '16px'
                                            }}
                                            title="Delete"
                                        >
                                            ×
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {showModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: 'white',
                        padding: '24px',
                        borderRadius: '16px',
                        width: '400px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                    }}>
                        <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#1e3a8a' }}>
                            {isEditing ? 'Edit Department' : 'Add New Department'}
                        </h3>
                        
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#64748b' }}>Icon</label>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {ICONS.map(icon => (
                                    <button
                                        key={icon}
                                        type="button"
                                        onClick={() => setFormIcon(icon)}
                                        style={{
                                            fontSize: '20px',
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '8px',
                                            border: formIcon === icon ? '2px solid #3f51b5' : '1px solid #e2e8f0',
                                            background: formIcon === icon ? '#eef2ff' : 'white',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {icon}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginBottom: '25px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#64748b' }}>Name</label>
                            <input
                                type="text"
                                placeholder="Department Name"
                                value={formName}
                                onChange={(e) => setFormName(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid #e2e8f0',
                                    fontSize: '16px'
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => setShowModal(false)}
                                style={{
                                    padding: '8px 16px',
                                    background: '#f1f5f9',
                                    color: '#64748b',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: 600
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                style={{
                                    padding: '8px 16px',
                                    background: '#3f51b5',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    opacity: submitting ? 0.7 : 1
                                }}
                            >
                                {submitting ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
