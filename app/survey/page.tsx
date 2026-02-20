'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, ChevronDown, User, Star } from 'lucide-react';
import Link from 'next/link';

const faculties = [
    "คณะวิศวกรรมศาสตร์ (วศ.) Faculty of Engineering",
    "คณะบริหารธุรกิจ (บธ.) Faculty of Business Administration / International B.B.A.",
    "คณะเทคโนโลยีคหกรรมศาสตร์ (ทค.) Faculty of Home Economics Technology",
    "คณะศิลปกรรมศาสตร์ (ศก.) Faculty of Fine and Applied Arts",
    "คณะเทคโนโลยีการเกษตร (ทก.) Faculty of Agricultural Technology",
    "คณะครุศาสตร์อุตสาหกรรม (คอ.) Faculty of Technical Education",
    "คณะสถาปัตยกรรมศาสตร์ (สถ.) Faculty of Architecture",
    "คณะวิทยาศาสตร์และเทคโนโลยี (วท.) Faculty of Science and Technology",
    "คณะเทคโนโลยีสื่อสารมวลชน (ทสม.) Faculty of Mass Communication Technology",
    "คณะศิลปศาสตร์ (ศศ.) Faculty of Liberal Arts",
    "คณะการแพทย์บูรณาการ (กพบ.) Faculty of Integrative Medicine",
    "คณะพยาบาลศาสตร์ Faculty of Nursing",
];

const roles = ["นักศึกษา", "อาจารย์", "บุคลากร", "บุคคลภายนอก"];
const prefixes = ["นาย", "นางสาว", "นาง"];

export default function SurveyPage() {
    const [formData, setFormData] = useState({
        role: '',
        prefix: '',
        fullName: '',
        studentId: '',
        faculty: '',
        satisfactionLevel: 0,
        durationLevel: 0,
        locationLevel: 0,
        leaderLevel: 0,
    });

    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [requireStudentId, setRequireStudentId] = useState(true); // Default to true

    useEffect(() => {
        const fetchSettings = () => {
            fetch('/api/settings')
                .then(res => res.json())
                .then(data => {
                    if (data.success && data.data) {
                        // If key doesn't exist, default to true. 
                        if (data.data.requireStudentId !== undefined) {
                            setRequireStudentId(data.data.requireStudentId);
                        }
                    }
                })
                .catch(err => console.error('Failed to load settings', err));
        };

        // Initial fetch
        fetchSettings();

        // Poll every 3 seconds for real-time updates
        const interval = setInterval(fetchSettings, 3000);

        return () => clearInterval(interval);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newData = { ...prev, [name]: value };

            // Clear student fields if role changes to non-student
            if (name === 'role' && value !== 'นักศึกษา') {
                newData.studentId = '';
                newData.faculty = '';
            }
            return newData;
        });
    };

    const handleStudentIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
        if (value.length > 13) value = value.slice(0, 13); // Limit to 13 digits

        // Format as XXXXXXXXXXXX-X
        if (value.length > 12) {
            value = value.slice(0, 12) + '-' + value.slice(12);
        }

        setFormData(prev => ({ ...prev, studentId: value }));
    };

    const handleRating = (field: string, value: number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        setErrorMessage('');

        if (formData.role === 'นักศึกษา') {
            // Only validate student ID if required
            if (requireStudentId) {
                const rawId = formData.studentId.replace(/-/g, '');
                if (rawId.length !== 13 || isNaN(Number(rawId))) {
                    setStatus('error');
                    setErrorMessage('รหัสนักศึกษาต้องเป็นตัวเลข 13 หลัก');
                    return;
                }
            }

            if (!formData.faculty) {
                setStatus('error');
                setErrorMessage('กรุณาเลือกคณะ / หน่วยงาน');
                return;
            }
        }

        // Validate satisfaction ratings
        if (formData.satisfactionLevel === 0 ||
            formData.durationLevel === 0 ||
            formData.locationLevel === 0 ||
            formData.leaderLevel === 0) {
            setStatus('error');
            setErrorMessage('กรุณาประเมินความพึงพอใจให้ครบทุกหัวข้อ');
            return;
        }

        try {
            const res = await fetch('/api/survey', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus('success');
            } else {
                setStatus('error');
                setErrorMessage(data.message || 'เกิดข้อผิดพลาดในการส่งข้อมูล');
            }
        } catch (error) {
            console.error(error);
            setStatus('error');
            setErrorMessage('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
        }
    };

    if (status === 'success') {
        return (
            <div className="min-h-screen bg-neutral-100 dark:bg-zinc-950 flex items-center justify-center p-4 font-sans">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-800 max-w-md w-full overflow-hidden"
                >
                    <div className="h-3 bg-rose-500 w-full" />
                    <div className="p-10 text-center space-y-8">
                        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto text-green-600 dark:text-green-400">
                            <CheckCircle2 size={48} />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">บันทึกข้อมูลเรียบร้อย</h2>
                            <p className="text-lg text-zinc-600 dark:text-zinc-400">ขอบคุณสำหรับการประเมินความพึงพอใจครับ</p>
                        </div>
                        <Link href="/" className="inline-block w-full py-4 bg-rose-600 text-white rounded-xl font-bold text-lg hover:bg-rose-700 transition-colors shadow-md shadow-rose-200 dark:shadow-none">
                            กลับสู่หน้าหลัก
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f0f2f5] dark:bg-zinc-950 py-8 px-4 sm:px-6 font-sans">
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl mx-auto space-y-6"
            >
                {/* Header Card */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden relative">
                    <div className="h-3 bg-gradient-to-r from-rose-500 to-pink-600 w-full absolute top-0 left-0" />
                    <div className="p-8 pt-10 space-y-4">
                        <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white leading-tight">
                            แบบประเมินความพึงพอใจ
                        </h1>
                        <p className="text-lg text-zinc-600 dark:text-zinc-400">
                            โครงการรณรงค์ป้องกันการตั้งครรภ์ไม่พร้อมในวัยรุ่น
                        </p>
                        <div className="pt-2 text-base text-red-600 font-medium">
                            * จำเป็นต้องกรอกข้อมูล
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Personal Info Card */}
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-8 space-y-8">
                        <div className="flex items-center gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <User size={24} />
                            </div>
                            <h3 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">ข้อมูลทั่วไป</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="block text-lg font-semibold text-zinc-800 dark:text-zinc-200">
                                    สถานะ <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <select
                                        name="role"
                                        required
                                        className="w-full px-5 py-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all outline-none text-zinc-900 dark:text-white text-lg appearance-none cursor-pointer"
                                        onChange={handleChange}
                                    >
                                        <option value="">กรุณาเลือกสถานะ...</option>
                                        {roles.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={24} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-3 md:col-span-1">
                                    <label className="block text-lg font-semibold text-zinc-800 dark:text-zinc-200">
                                        คำนำหน้า <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="prefix"
                                            required
                                            className="w-full px-5 py-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all outline-none text-zinc-900 dark:text-white text-lg appearance-none cursor-pointer"
                                            onChange={handleChange}
                                        >
                                            <option value="">เลือก...</option>
                                            {prefixes.map(p => <option key={p} value={p}>{p}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={24} />
                                    </div>
                                </div>
                                <div className="space-y-3 md:col-span-2">
                                    <label className="block text-lg font-semibold text-zinc-800 dark:text-zinc-200">
                                        ชื่อ - นามสกุล <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        required
                                        placeholder="กรอกชื่อและนามสกุล..."
                                        className="w-full px-5 py-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all outline-none text-zinc-900 dark:text-white placeholder:text-zinc-400 text-lg"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {formData.role === 'นักศึกษา' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 mt-4"
                            >
                                {requireStudentId && (
                                    <div className="space-y-3">
                                        <label className="block text-lg font-semibold text-zinc-800 dark:text-zinc-200">
                                            รหัสนักศึกษา (13 หลัก) <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="studentId"
                                            required
                                            value={formData.studentId}
                                            maxLength={14}
                                            placeholder="xxxxxxxxxxxx-x"
                                            className="w-full px-5 py-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all outline-none text-zinc-900 dark:text-white placeholder:text-zinc-400 font-mono text-xl tracking-wide"
                                            onChange={handleStudentIdChange}
                                        />
                                    </div>
                                )}

                                <div className="space-y-3">
                                    <label className="block text-lg font-semibold text-zinc-800 dark:text-zinc-200">
                                        คณะ <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="faculty"
                                            required
                                            value={formData.faculty}
                                            className="w-full px-5 py-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all outline-none text-zinc-900 dark:text-white text-lg appearance-none pr-12 text-ellipsis overflow-hidden"
                                            onChange={handleChange}
                                        >
                                            <option value="">เลือกคณะ...</option>
                                            {faculties.map(f => <option key={f} value={f}>{f}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={24} />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Satisfaction Section Cards */}
                    {[
                        { id: 'satisfactionLevel', label: 'ความพึงพอใจในการเข้าร่วมกิจกรรม' },
                        { id: 'durationLevel', label: 'ระยะเวลาในการจัดกิจกรรม' },
                        { id: 'locationLevel', label: 'สถานที่จัดกิจกรรม' },
                        { id: 'leaderLevel', label: 'ผู้นำกิจกรรม / วิทยากร' }
                    ].map((item) => (
                        <div key={item.id} className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-8 space-y-6">
                            <div className="flex items-center gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4 mb-4">
                                <div className="w-10 h-10 rounded-full bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center text-yellow-600 dark:text-yellow-400">
                                    <Star size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">{item.label}</h3>
                            </div>

                            <div className="pt-2">
                                <div className="flex flex-col gap-4">
                                    <div className="flex justify-between items-end px-2">
                                        <span className="text-sm font-medium text-zinc-500">น้อยที่สุด</span>
                                        <span className="text-sm font-medium text-zinc-500">มากที่สุด</span>
                                    </div>

                                    <div className="grid grid-cols-5 gap-2 sm:gap-4">
                                        {[1, 2, 3, 4, 5].map((score) => {
                                            // Dynamic Color Logic
                                            let activeClass = '';
                                            let inactiveClass = 'bg-zinc-50 border-2 border-zinc-200 text-zinc-400 hover:border-zinc-300';

                                            if (score === 1) activeClass = 'bg-red-500 border-red-600 text-white shadow-red-200';
                                            if (score === 2) activeClass = 'bg-orange-500 border-orange-600 text-white shadow-orange-200';
                                            if (score === 3) activeClass = 'bg-yellow-400 border-yellow-500 text-white shadow-yellow-200';
                                            if (score === 4) activeClass = 'bg-lime-500 border-lime-600 text-white shadow-lime-200';
                                            if (score === 5) activeClass = 'bg-green-500 border-green-600 text-white shadow-green-200';

                                            return (
                                                <div key={score} className="flex flex-col items-center gap-1 group cursor-pointer" onClick={() => handleRating(item.id, score)}>
                                                    <motion.div
                                                        whileTap={{ scale: 0.9 }}
                                                        className={`
                                                            w-full aspect-square max-w-[4rem] rounded-xl flex items-center justify-center text-2xl font-bold transition-all duration-200 shadow-sm
                                                            ${(formData as any)[item.id] === score ? activeClass + ' ring-4 ring-offset-2 ring-zinc-100 dark:ring-zinc-800 scale-105' : inactiveClass}
                                                        `}
                                                    >
                                                        {score}
                                                    </motion.div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {errorMessage && (
                        <div className="p-6 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-200 rounded-2xl flex items-start gap-4 border border-red-100 dark:border-red-900/30 shadow-sm">
                            <AlertCircle size={28} className="shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <h4 className="font-bold text-lg">แจ้งเตือน</h4>
                                <span className="font-medium text-base">{errorMessage}</span>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col gap-4 pt-6 pb-12">
                        <button
                            type="submit"
                            disabled={status === 'submitting'}
                            className="w-full py-5 bg-rose-600 text-white font-bold text-xl rounded-2xl hover:bg-rose-700 shadow-lg shadow-rose-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
                        >
                            {status === 'submitting' ? 'กำลังส่งข้อมูล...' : 'ส่งแบบประเมิน'}
                        </button>
                    </div>

                </form>
            </motion.div>
        </div>
    );
}
