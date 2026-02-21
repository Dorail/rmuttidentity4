'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Users, Star, MapPin, Clock, UserCheck, RefreshCw, Table as TableIcon, PieChart as PieChartIcon, TrendingUp, Award, Target, Layers, Trash2, X, Lock, AlertCircle } from 'lucide-react';


export default function AdminDashboard() {
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<'summary' | 'individual' | 'analytics' | 'settings'>('summary');

    const [error, setError] = useState<string | null>(null);

    // Delete State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
    const [deletePasscode, setDeletePasscode] = useState('');
    const [deleteError, setDeleteError] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        // Auth is now handled by middleware
        fetchData();
    }, [router]);

    const fetchData = () => {
        setLoading(true);
        setError(null);
        fetch('/api/test')
            .then(res => res.json())
            .then(res => {
                if (res.success) {
                    setData(res.data);
                } else {
                    setError(res.message + (res.detail ? ` (${res.detail})` : ''));
                    setData(null);
                }
                setLoading(false);
            })
            .catch(err => {
                setError(err.message || 'Network Error');
                setLoading(false);
            });
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center text-white bg-neutral-950 space-y-4">
            <RefreshCw className="animate-spin text-rose-500" size={40} />
            <p className="text-zinc-400">Loading analytics...</p>
        </div>
    );

    if (error || !data) return (
        <div className="min-h-screen flex flex-col items-center justify-center text-white bg-neutral-950 space-y-6">
            <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-500">
                <TableIcon size={40} />
            </div>
            <div className="text-center max-w-lg px-6">
                <h2 className="text-2xl font-bold text-white mb-2">Error loading data</h2>
                <p className="text-red-400 font-mono text-sm break-words bg-neutral-900 p-4 rounded-lg border border-red-900/50">
                    {error || 'Unknown Error'}
                </p>
            </div>
            <button
                onClick={fetchData}
                className="px-8 py-3 bg-rose-600 rounded-xl hover:bg-rose-700 transition font-bold shadow-lg shadow-rose-500/20 flex items-center gap-2"
            >
                <RefreshCw size={18} />
                Try Again
            </button>
        </div>
    );

    // Helper to shorten faculty name
    const formatFaculty = (name: string) => {
        if (!name) return '';
        return name.split(/(?:\s\(|\sFaculty)/)[0];
    };

    const handleDeleteClick = (id: string) => {
        setDeleteTargetId(id);
        setDeleteModalOpen(true);
        setDeletePasscode('');
        setDeleteError('');
    };

    const confirmDelete = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!deleteTargetId) return;

        setIsDeleting(true);
        setDeleteError('');

        try {
            const res = await fetch('/api/survey', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: deleteTargetId, passcode: deletePasscode }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setDeleteModalOpen(false);
                fetchData(); // Refresh data
            } else {
                setDeleteError(data.message || 'Failed to delete');
            }
        } catch (error) {
            setDeleteError('Network error');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-white font-sans">
            {/* Header */}
            <div className="bg-neutral-900 border-b border-neutral-800 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-500 to-purple-500 bg-clip-text text-transparent">
                            Survey Dashboard
                        </h1>
                        <p className="text-neutral-400 text-sm">Activity Satisfaction Report</p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={fetchData}
                            className="p-2 text-neutral-400 hover:text-white transition-colors"
                            title="Refresh"
                        >
                            <RefreshCw size={20} />
                        </button>
                        <button
                            onClick={async () => {
                                await fetch('/api/admin/auth', { method: 'DELETE' });
                                router.push('/admin');
                            }}
                            className="px-4 py-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition text-sm font-medium"
                        >
                            Logout
                        </button>
                    </div>
                </div>
                {/* Tabs */}
                <div className="max-w-7xl mx-auto px-6 flex gap-8 font-sans">
                    <button
                        onClick={() => setTab('summary')}
                        className={`py-3 text-sm font-medium border-b-2 transition-colors ${tab === 'summary' ? 'border-rose-500 text-rose-500' : 'border-transparent text-neutral-400 hover:text-neutral-200'
                            }`}
                    >
                        ข้อมูลสรุป (Summary)
                    </button>
                    <button
                        onClick={() => setTab('individual')}
                        className={`py-3 text-sm font-medium border-b-2 transition-colors ${tab === 'individual' ? 'border-rose-500 text-rose-500' : 'border-transparent text-neutral-400 hover:text-neutral-200'
                            }`}
                    >
                        รายบุคคล (Individual)
                    </button>
                    <button
                        onClick={() => setTab('analytics')}
                        className={`py-3 text-sm font-medium border-b-2 transition-colors ${tab === 'analytics' ? 'border-rose-500 text-rose-500' : 'border-transparent text-neutral-400 hover:text-neutral-200'
                            }`}
                    >
                        การวิเคราะห์ละเอียด (Analytics)
                    </button>
                    <button
                        onClick={() => setTab('settings')}
                        className={`py-3 text-sm font-medium border-b-2 transition-colors ${tab === 'settings' ? 'border-rose-500 text-rose-500' : 'border-transparent text-neutral-400 hover:text-neutral-200'
                            }`}
                    >
                        ตั้งค่า (Settings)
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6 space-y-8">
                {/* Top Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <StatCard icon={<Users />} label="ผู้ตอบแบบสอบถาม" value={data.totalRespondents} color="blue" />
                    <StatCard icon={<Star />} label="ความพึงพอใจเฉลี่ย" value={`${data.averages?.avgSatisfaction?.toFixed(2) || '0.00'}/5`} color="emerald" />
                    <StatCard icon={<Clock />} label="ระยะเวลาเฉลี่ย" value={`${data.averages?.avgDuration?.toFixed(2) || '0.00'}/5`} color="purple" />
                    <StatCard icon={<MapPin />} label="สถานที่เฉลี่ย" value={`${data.averages?.avgLocation?.toFixed(2) || '0.00'}/5`} color="orange" />
                    <StatCard icon={<UserCheck />} label="วิทยากรเฉลี่ย" value={`${data.averages?.avgLeader?.toFixed(2) || '0.00'}/5`} color="pink" />
                </div>

                {tab === 'summary' && (
                    <div className="grid grid-cols-1 gap-8">
                        {/* New Charts Config */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Timeline Chart */}
                            <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800">
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                    <TrendingUp className="text-rose-500" size={20} />
                                    แนวโน้มการตอบแบบสอบถาม (Timeline)
                                </h3>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={data.timeline}>
                                            <defs>
                                                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <XAxis dataKey="date" stroke="#525252" tick={{ fontSize: 12 }} />
                                            <YAxis stroke="#525252" tick={{ fontSize: 12 }} />
                                            <Tooltip contentStyle={{ backgroundColor: '#262626', border: 'none', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                                            <Area type="monotone" dataKey="count" stroke="#f43f5e" fillOpacity={1} fill="url(#colorCount)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Faculty Performance */}
                            <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800">
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                    <Award className="text-amber-500" size={20} />
                                    คะแนนความพึงพอใจแยกตามคณะ (Faculty Score)
                                </h3>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={data.facultyPerformance?.map((d: any) => ({ ...d, name: formatFaculty(d.name) }))}
                                            layout="vertical"
                                            margin={{ left: 40, right: 20 }}
                                        >
                                            <XAxis type="number" domain={[0, 5]} stroke="#525252" />
                                            <YAxis dataKey="name" type="category" width={180} stroke="#a3a3a3" style={{ fontSize: '11px' }} />
                                            <Tooltip cursor={{ fill: '#262626' }} contentStyle={{ backgroundColor: '#262626', border: 'none', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                                            <Bar dataKey="value" fill="#fbbf24" radius={[0, 4, 4, 0]}>
                                                {data.facultyPerformance?.map((entry: any, index: number) => (
                                                    <Cell key={`cell-${index}`} fill={['#fbbf24', '#f59e0b', '#d97706'][index % 3]} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Radar & Stacked Bar */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Radar Chart */}
                            <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800">
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                    <Target className="text-emerald-500" size={20} />
                                    ภาพรวมการประเมิน 4 ด้าน (Overview)
                                </h3>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart outerRadius={90} data={[
                                            { subject: 'ความพึงพอใจ', A: data.averages.avgSatisfaction, fullMark: 5 },
                                            { subject: 'ระยะเวลา', A: data.averages.avgDuration, fullMark: 5 },
                                            { subject: 'สถานที่', A: data.averages.avgLocation, fullMark: 5 },
                                            { subject: 'วิทยากร', A: data.averages.avgLeader, fullMark: 5 },
                                        ]}>
                                            <PolarGrid stroke="#404040" />
                                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#a3a3a3', fontSize: 12 }} />
                                            <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: '#525252' }} />
                                            <Radar name="Score" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                                            <Tooltip contentStyle={{ backgroundColor: '#262626', border: 'none', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Stacked Bar Chart */}
                            <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800">
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                    <Layers className="text-blue-500" size={20} />
                                    การกระจายของคะแนน (Score Distribution)
                                </h3>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={data.scoreMatrix} margin={{ left: 20 }}>
                                            <XAxis dataKey="name" stroke="#525252" tick={{ fontSize: 12 }} />
                                            <YAxis stroke="#525252" />
                                            <Tooltip contentStyle={{ backgroundColor: '#262626', border: 'none', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                                            <Bar dataKey="1" stackId="a" fill="#ef4444" name="น้อยที่สุด (1 คะแนน)" />
                                            <Bar dataKey="2" stackId="a" fill="#f97316" name="น้อย (2 คะแนน)" />
                                            <Bar dataKey="3" stackId="a" fill="#eab308" name="ปานกลาง (3 คะแนน)" />
                                            <Bar dataKey="4" stackId="a" fill="#3b82f6" name="มาก (4 คะแนน)" />
                                            <Bar dataKey="5" stackId="a" fill="#22c55e" name="มากที่สุด (5 คะแนน)" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                {/* Custom Legend */}
                                <div className="flex flex-wrap justify-center gap-4 mt-4">
                                    {[
                                        { label: 'น้อยที่สุด (1 คะแนน)', color: '#ef4444' },
                                        { label: 'น้อย (2 คะแนน)', color: '#f97316' },
                                        { label: 'ปานกลาง (3 คะแนน)', color: '#eab308' },
                                        { label: 'มาก (4 คะแนน)', color: '#3b82f6' },
                                        { label: 'มากที่สุด (5 คะแนน)', color: '#22c55e' },
                                    ].map((item) => (
                                        <div key={item.label} className="flex items-center gap-2">
                                            <div className="w-3 h-3" style={{ backgroundColor: item.color }} />
                                            <span className="text-xs text-neutral-400">{item.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-8">
                            <ChartSection title="สถานะผู้เข้าร่วม (Role)" data={data.distributions.role} type="role" />
                            <ChartSection title="สังกัด / คณะ (Faculty)" data={data.distributions.faculty} type="faculty" defaultChart="bar" formatLabel={formatFaculty} />
                        </div>

                        <div className="border-t border-neutral-800 my-4"></div>
                        <h2 className="text-xl font-bold text-neutral-200">ผลการประเมินรายข้อ (Detailed Breakdown)</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <ChartSection title="1. ความพึงพอใจในการเข้าร่วมโครงการในภาพรวม" data={data.distributions.satisfaction} type="rating" />
                            <ChartSection title="2. ระยะเวลาในการจัดกิจกรรม" data={data.distributions.duration} type="rating" />
                            <ChartSection title="3. สถานที่จัดกิจกรรม" data={data.distributions.location} type="rating" />
                            <ChartSection title="4. ผู้นำกิจกรรม / วิทยากร" data={data.distributions.leader} type="rating" />
                        </div>

                    </div>
                )}

                {tab === 'individual' && (
                    <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-neutral-800 text-neutral-400 text-sm border-b border-neutral-700">
                                        <th className="p-4 font-medium min-w-[150px]">เวลา (Time)</th>
                                        <th className="p-4 font-medium min-w-[200px]">รหัสนักศึกษา / สถานะ</th>
                                        <th className="p-4 font-medium min-w-[200px]">ชื่อ - นามสกุล</th>
                                        <th className="p-4 font-medium min-w-[200px]">คณะ</th>
                                        <th className="p-4 font-medium text-center">ความพึงพอใจ</th>
                                        <th className="p-4 font-medium text-center">เวลา</th>
                                        <th className="p-4 font-medium text-center">สถานที่</th>
                                        <th className="p-4 font-medium text-center">วิทยากร</th>
                                        <th className="p-4 font-medium text-center">ลบข้อมูล</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {data.recentResponses?.map((r: any, i: number) => (
                                        <tr key={i} className="border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors">
                                            <td className="p-4 text-neutral-500 whitespace-nowrap">
                                                {new Date(r.createdAt).toLocaleString('th-TH', {
                                                    timeZone: 'Asia/Bangkok',
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </td>
                                            <td className="p-4 whitespace-nowrap">
                                                <span className="bg-neutral-800 text-neutral-400 px-2 py-1 rounded text-xs border border-neutral-700 font-mono">
                                                    {(r.role === 'Student' || r.role === 'นักศึกษา') ? (
                                                        <>นักศึกษา <span className="text-rose-500">{r.studentId || '-'}</span></>
                                                    ) : r.role}
                                                </span>
                                            </td>
                                            <td className="p-4">{r.prefix} {r.fullName}</td>
                                            <td className="p-4 text-neutral-400">
                                                {(r.role === 'Student' || r.role === 'นักศึกษา') ? formatFaculty(r.faculty) : '-'}
                                            </td>
                                            <td className="p-4 text-center font-bold text-emerald-400">{r.satisfactionLevel}</td>
                                            <td className="p-4 text-center font-bold text-emerald-400">{r.durationLevel}</td>
                                            <td className="p-4 text-center font-bold text-emerald-400">{r.locationLevel}</td>
                                            <td className="p-4 text-center font-bold text-emerald-400">{r.leaderLevel}</td>
                                            <td className="p-4 text-center">
                                                <button
                                                    onClick={() => handleDeleteClick(r._id)}
                                                    className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                                                    title="ลบข้อมูล"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {(!data.recentResponses || data.recentResponses.length === 0) && (
                            <div className="p-8 text-center text-neutral-500">No responses yet.</div>
                        )}
                    </div>
                )}

                {tab === 'analytics' && (
                    <AnalyticsView data={data} formatFaculty={formatFaculty} />
                )}

                {tab === 'settings' && (
                    <SettingsView />
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteModalOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
                        <button
                            onClick={() => setDeleteModalOpen(false)}
                            className="absolute top-4 right-4 text-neutral-400 hover:text-white"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-2">
                                <Trash2 size={32} />
                            </div>

                            <h2 className="text-xl font-bold text-white">ยืนยันการลบข้อมูล</h2>
                            <p className="text-neutral-400 text-sm">
                                การกระทำนี้ไม่สามารถย้อนกลับได้ กรุณากรอกรหัสผ่าน Admin เพื่อยืนยัน
                            </p>

                            <form onSubmit={confirmDelete} className="w-full space-y-4 mt-2">
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                                    <input
                                        type="password"
                                        value={deletePasscode}
                                        onChange={(e) => setDeletePasscode(e.target.value)}
                                        placeholder="Admin Passcode"
                                        className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-10 py-3 text-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                                        autoFocus
                                    />
                                </div>

                                {deleteError && (
                                    <p className="text-red-500 text-sm font-medium animate-pulse">{deleteError}</p>
                                )}

                                <div className="flex gap-3 w-full">
                                    <button
                                        type="button"
                                        onClick={() => setDeleteModalOpen(false)}
                                        className="flex-1 py-3 bg-neutral-800 rounded-xl hover:bg-neutral-700 transition font-medium text-neutral-300"
                                    >
                                        ยกเลิก
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isDeleting}
                                        className="flex-1 py-3 bg-red-600 rounded-xl hover:bg-red-700 transition font-bold text-white shadow-lg shadow-red-500/20 disabled:opacity-50"
                                    >
                                        {isDeleting ? 'กำลังลบ...' : 'ลบข้อมูลทันที'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatCard({ icon, label, value, color }: any) {
    const colors: any = {
        blue: 'bg-blue-500/10 text-blue-500',
        emerald: 'bg-emerald-500/10 text-emerald-500',
        purple: 'bg-purple-500/10 text-purple-500',
        orange: 'bg-orange-500/10 text-orange-500',
        pink: 'bg-pink-500/10 text-pink-500',
    };

    return (
        <div className="bg-neutral-900 p-5 rounded-2xl border border-neutral-800">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${colors[color]}`}>
                {icon}
            </div>
            <p className="text-neutral-400 text-sm mb-1">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    );
}

function ChartSection({ title, data, type, defaultChart = 'pie', formatLabel }: any) {
    const [chartType, setChartType] = useState<'pie' | 'bar'>(defaultChart as any);

    // Process data for Recharts
    let chartData = [];
    let labelMap: any = {};

    if (type === 'rating') {
        const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        data?.forEach((d: any) => { if (d._id >= 1 && d._id <= 5) counts[d._id as keyof typeof counts] = d.count; });

        // Define explicit order and labels
        const d = [
            { id: '1', label: 'น้อยที่สุด (1 คะแนน)', value: counts[1] },
            { id: '2', label: 'น้อย (2 คะแนน)', value: counts[2] },
            { id: '3', label: 'ปานกลาง (3 คะแนน)', value: counts[3] },
            { id: '4', label: 'มาก (4 คะแนน)', value: counts[4] },
            { id: '5', label: 'มากที่สุด (5 คะแนน)', value: counts[5] },
        ];
        chartData = d;
        // Create a map for tickFormatter
        d.forEach(item => { labelMap[item.id] = item.label; });

    } else {
        // Apply formatLabel if provided
        chartData = data?.map((d: any) => {
            const label = formatLabel ? formatLabel(d._id) : d._id;
            return {
                id: label, // For other types, id is label
                name: label,
                label: label,
                value: d.count
            };
        }) || [];
        // For non-rating, map is identity
        chartData.forEach((item: any) => { labelMap[item.id] = item.label; });
    }

    const COLORS = ['#ef4444', '#f97316', '#eab308', '#3b82f6', '#22c55e', '#a855f7', '#ec4899'];

    return (
        <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 flex flex-col">
            <div className="flex justify-between items-start mb-6">
                <h3 className="font-bold text-lg">{title}</h3>
                <div className="flex bg-neutral-800 rounded-lg p-1">
                    <button
                        onClick={() => setChartType('pie')}
                        className={`p-2 rounded-md transition-all ${chartType === 'pie' ? 'bg-neutral-700 text-white shadow' : 'text-neutral-400 hover:text-neutral-200'}`}
                    >
                        <PieChartIcon size={16} />
                    </button>
                    <button
                        onClick={() => setChartType('bar')}
                        className={`p-2 rounded-md transition-all ${chartType === 'bar' ? 'bg-neutral-700 text-white shadow' : 'text-neutral-400 hover:text-neutral-200'}`}
                    >
                        <TableIcon size={16} />
                    </button>
                </div>
            </div>

            <div className="h-[300px] w-full mt-auto flex flex-col md:flex-row items-center gap-4">
                <div className="flex-1 h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        {chartType === 'pie' ? (
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    nameKey="label"
                                >
                                    {chartData.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#262626', border: 'none', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                            </PieChart>
                        ) : (
                            <BarChart data={chartData} layout="vertical" margin={{ left: 40, right: 10 }}>
                                <XAxis type="number" stroke="#525252" />
                                <YAxis
                                    dataKey="id"
                                    type="category"
                                    width={100}
                                    stroke="#a3a3a3"
                                    style={{ fontSize: '12px' }}
                                    tickFormatter={(val) => labelMap[val] || val}
                                />
                                <Tooltip
                                    cursor={{ fill: '#262626' }}
                                    contentStyle={{ backgroundColor: '#262626', border: 'none', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                    labelFormatter={(val) => labelMap[val] || val}
                                />
                                <Bar dataKey="value" fill="#f43f5e" radius={[0, 4, 4, 0]}>
                                    {chartData.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        )}
                    </ResponsiveContainer>
                </div>

                {/* Custom Legend for Pie Chart */}
                {chartType === 'pie' && (
                    <div className="w-full md:w-auto flex flex-col justify-center space-y-2 p-2">
                        {chartData.map((item: any, index: number) => (
                            <div key={item.id} className="flex items-center gap-3">
                                <div
                                    className="w-4 h-4 rounded-sm shrink-0"
                                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                />
                                <span className="text-sm text-neutral-300">
                                    {item.label}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-4 text-sm text-neutral-500 text-center">
                จำนวนผู้ตอบทั้งหมด: {chartData.reduce((acc: any, curr: any) => acc + curr.value, 0)}
            </div>
        </div >
    );
}


function AnalyticsView({ data, formatFaculty }: any) {
    const calculateStats = (distribution: any[]) => {
        let totalCount = 0;
        let sum = 0;
        let sumSq = 0;

        distribution?.forEach(d => {
            const score = parseInt(d._id);
            const count = d.count;
            if (!isNaN(score)) {
                totalCount += count;
                sum += score * count;
                sumSq += (score * score) * count;
            }
        });

        const mean = totalCount > 0 ? sum / totalCount : 0;
        const variance = totalCount > 0 ? (sumSq / totalCount) - (mean * mean) : 0;
        const sd = Math.sqrt(variance);

        let interpretation = '';
        if (mean >= 4.50) interpretation = 'มากที่สุด';
        else if (mean >= 3.50) interpretation = 'มาก';
        else if (mean >= 2.50) interpretation = 'ปานกลาง';
        else if (mean >= 1.50) interpretation = 'น้อย';
        else interpretation = 'น้อยที่สุด';

        return { mean, sd, totalCount, interpretation };
    };

    const AnalyticsCard = ({ title, data, type, formatLabel }: any) => {
        const stats = type === 'rating' ? calculateStats(data) : null;

        return (
            <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-6">
                <h3 className="text-lg font-bold mb-6 text-neutral-200">{title}</h3>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Chart Area */}
                    <div className="flex-1 min-h-[300px]">
                        <ChartSection title="" data={data} type={type} defaultChart={type === 'rating' ? 'bar' : 'pie'} formatLabel={formatLabel} />
                    </div>

                    {/* Stats Area */}
                    <div className="w-full lg:w-[300px] flex flex-col justify-center">
                        {type === 'rating' && stats && (
                            <div className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-800 space-y-4">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-rose-500">{stats.mean.toFixed(2)}</div>
                                    <div className="text-xs text-neutral-400">ค่าเฉลี่ย (Mean)</div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 border-t border-neutral-700 pt-4">
                                    <div className="text-center">
                                        <div className="text-lg font-semibold text-white">{stats.sd.toFixed(2)}</div>
                                        <div className="text-[10px] text-neutral-400">S.D.</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-lg font-semibold text-white">{stats.totalCount}</div>
                                        <div className="text-[10px] text-neutral-400">จำนวนตอบ</div>
                                    </div>
                                </div>
                                <div className="border-t border-neutral-700 pt-4 text-center">
                                    <div className="text-sm font-medium text-emerald-400">"{stats.interpretation}"</div>
                                    <div className="text-[10px] text-neutral-400">การแปลผล</div>
                                </div>
                            </div>
                        )}

                        {/* Frequency Table for Categories */}
                        {type !== 'rating' && (
                            <div className="bg-neutral-800/50 rounded-xl overflow-hidden border border-neutral-800">
                                <table className="w-full text-sm">
                                    <thead className="bg-neutral-800 text-neutral-400">
                                        <tr>
                                            <th className="p-3 text-left">ตัวเลือก</th>
                                            <th className="p-3 text-right">จำนวน</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-800">
                                        {data?.map((d: any, i: number) => (
                                            <tr key={i}>
                                                <td className="p-3 text-neutral-300">
                                                    {formatLabel ? formatLabel(d._id) : d._id}
                                                </td>
                                                <td className="p-3 text-right font-mono text-neutral-400">{d.count}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    };

    return (
        <div className="space-y-8">
            <AnalyticsCard title="1. สถานภาพ (Role)" data={data.distributions.role} type="role" />
            <AnalyticsCard title="2. สังกัด / คณะ (Faculty)" data={data.distributions.faculty} type="faculty" formatLabel={formatFaculty} />

            <div className="border-t border-neutral-800 my-4"></div>
            <h2 className="text-xl font-bold text-neutral-200">ส่วนที่ 2: ความพึงพอใจต่อการจัดกิจกรรม</h2>

            <AnalyticsCard title="1. ความพึงพอใจในการเข้าร่วมโครงการในภาพรวม" data={data.distributions.satisfaction} type="rating" />
            <AnalyticsCard title="2. ระยะเวลาในการจัดกิจกรรม" data={data.distributions.duration} type="rating" />
            <AnalyticsCard title="3. สถานที่จัดกิจกรรม" data={data.distributions.location} type="rating" />
            <AnalyticsCard title="4. ผู้นำกิจกรรม / วิทยากร" data={data.distributions.leader} type="rating" />
        </div>
    );
}

function SettingsView() {
    const [settings, setSettings] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Modal State
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pendingChange, setPendingChange] = useState<any>(null); // { key: 'requireStudentId', value: false }
    const [passcode, setPasscode] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/settings');
            const data = await res.json();
            if (data.success) {
                // Default requireStudentId to true if missing
                if (data.data.requireStudentId === undefined) {
                    data.data.requireStudentId = true;
                }
                setSettings(data.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = (key: string, currentValue: boolean) => {
        setPendingChange({ key, value: !currentValue });
        setConfirmOpen(true);
        setPasscode('');
        setError('');
    };

    const confirmChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    key: pendingChange.key,
                    value: pendingChange.value,
                    passcode
                })
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setSettings((prev: any) => ({ ...prev, [pendingChange.key]: pendingChange.value }));
                setConfirmOpen(false);
                setPendingChange(null);
            } else {
                setError(data.message || 'Incorrect passcode');
            }
        } catch (err) {
            setError('Network error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-neutral-400 p-8 text-center">Loading settings...</div>;

    return (
        <div className="w-full mx-auto space-y-8">
            <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-8">
                <div className="flex items-center gap-4 border-b border-neutral-800 pb-6 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                        <Lock size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">การตั้งค่าระบบ (System Config)</h2>
                        <p className="text-neutral-400 text-sm">จัดการและตั้งค่าการทำงานของระบบ</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Setting Item */}
                    <div className="flex items-center justify-between p-4 bg-neutral-800/30 rounded-xl border border-neutral-800">
                        <div className="space-y-1">
                            <h3 className="font-medium text-white">บังคับกรอกรหัสนักศึกษา (Require Student ID)</h3>
                            <p className="text-xs text-neutral-400">
                                หากปิด: นักศึกษาจะไม่ต้องกรอกรหัสนักศึกษา (กรอกเฉพาะคณะ)
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${settings.requireStudentId
                                ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                                : 'bg-neutral-700/50 text-neutral-400 border border-neutral-700'
                                }`}>
                                {settings.requireStudentId ? 'เปิดใช้งาน (ON)' : 'ปิดใช้งาน (OFF)'}
                            </div>
                            <button
                                onClick={() => handleToggle('requireStudentId', settings.requireStudentId)}
                                className={`
                                    relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-neutral-900
                                    ${settings.requireStudentId ? 'bg-green-500' : 'bg-neutral-600'}
                                `}
                            >
                                <span
                                    className={`
                                        inline-block h-6 w-6 transform rounded-full bg-white transition duration-200 shadow-sm
                                        ${settings.requireStudentId ? 'translate-x-7' : 'translate-x-1'}
                                    `}
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {confirmOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-sm p-6 relative shadow-2xl">
                        <button
                            onClick={() => setConfirmOpen(false)}
                            className="absolute top-4 right-4 text-neutral-400 hover:text-white"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-500 mb-2">
                                <Lock size={32} />
                            </div>

                            <h2 className="text-xl font-bold text-white">ยืนยันการตั้งค่า</h2>
                            <p className="text-neutral-400 text-sm">
                                กรุณากรอกรหัส Admin เพื่อบันทึกการเปลี่ยนแปลง
                            </p>

                            <form onSubmit={confirmChange} className="w-full space-y-4 mt-2">
                                <input
                                    type="password"
                                    value={passcode}
                                    onChange={(e) => setPasscode(e.target.value)}
                                    placeholder="Admin Passcode"
                                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-rose-500 focus:outline-none text-center"
                                    autoFocus
                                />

                                {error && (
                                    <p className="text-red-500 text-sm font-medium animate-pulse">{error}</p>
                                )}

                                <div className="flex gap-3 w-full">
                                    <button
                                        type="button"
                                        onClick={() => setConfirmOpen(false)}
                                        className="flex-1 py-3 bg-neutral-800 rounded-xl hover:bg-neutral-700 transition font-medium text-neutral-300"
                                    >
                                        ยกเลิก
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="flex-1 py-3 bg-rose-600 rounded-xl hover:bg-rose-700 transition font-bold text-white shadow-lg shadow-rose-500/20 disabled:opacity-50"
                                    >
                                        {saving ? 'บันทึก...' : 'ยืนยัน'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
