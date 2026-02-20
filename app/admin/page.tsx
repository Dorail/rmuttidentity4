'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminLogin() {
    const [passcode, setPasscode] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch('/api/admin/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ passcode }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                // Cookie is set by the server
                router.push('/admin/dashboard');
            } else {
                setError(data.message || 'รหัสผ่านไม่ถูกต้อง');
            }
        } catch (err) {
            console.error(err);
            setError('เกิดข้อผิดพลาดในการเชื่อมต่อ (API Error)');
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-black border border-zinc-800 p-8 rounded-2xl w-full max-w-sm space-y-6 text-center"
            >
                <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto text-zinc-400">
                    <Lock size={24} />
                </div>

                <h1 className="text-xl font-bold text-white">Admin Access</h1>

                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        type="password"
                        value={passcode}
                        onChange={(e) => setPasscode(e.target.value)}
                        placeholder="Enter Passcode"
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-white focus:outline-none"
                    />

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button
                        type="submit"
                        className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-zinc-200 transition-colors"
                    >
                        Enter Dashboard
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
