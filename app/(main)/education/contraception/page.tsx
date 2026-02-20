'use client';

import { motion } from 'framer-motion';
import StaggerText from "@/components/ui/StaggerText";
import { Pill, ShieldCheck, Timer, AlertOctagon } from 'lucide-react';
import Reveal from "@/components/ui/Reveal";
import Link from 'next/link';

export default function ContraceptionPage() {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans">
            <main className="pt-32 pb-24 px-4">
                <div className="max-w-4xl mx-auto space-y-16">

                    {/* Header */}
                    <div className="text-center space-y-6">
                        <Reveal width="100%" direction="down">
                            <div className="w-20 h-20 mx-auto bg-rose-100 dark:bg-rose-900/30 rounded-3xl flex items-center justify-center text-rose-600 dark:text-rose-400">
                                <ShieldCheck className="w-10 h-10" />
                            </div>
                        </Reveal>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-900 dark:text-white">
                            <StaggerText text="การคุมกำเนิด (Contraception)" />
                        </h1>
                        <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                            เลือกวิธีที่ใช่ เพื่อความปลอดภัยและมั่นใจในทุกช่วงเวลา
                        </p>
                    </div>

                    {/* Method Categories */}
                    <div className="grid md:grid-cols-2 gap-8">

                        {/* Male Contraception */}
                        <Reveal width="100%" delay={0.2}>
                            <Link href="/education/contraception/male">
                                <motion.div
                                    whileHover={{ y: -5, scale: 1.02 }}
                                    className="h-full bg-white dark:bg-zinc-900 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 border border-zinc-100 dark:border-zinc-800 cursor-pointer group"
                                >
                                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                                        <ShieldCheck className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">สำหรับผู้ชาย</h3>
                                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                                        วิธีคุมกำเนิดสำหรับฝ่ายชาย เน้นความง่าย ป้องกันได้ทั้งท้องและโรคติดต่อ
                                    </p>
                                    <ul className="space-y-2 text-zinc-500 dark:text-zinc-500">
                                        <li className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                            ถุงยางอนามัย (Condom)
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                            การทำหมันชาย (Vasectomy)
                                        </li>
                                    </ul>
                                </motion.div>
                            </Link>
                        </Reveal>

                        {/* Female Contraception (Placeholder linked to non-existent dynamic route for now or static) */}
                        <Reveal width="100%" delay={0.3}>
                            <div className="h-full bg-white dark:bg-zinc-900 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 border border-zinc-100 dark:border-zinc-800 group relative opacity-80">
                                <div className="absolute top-4 right-4 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full text-xs font-bold text-zinc-500">Coming Soon</div>
                                <div className="w-16 h-16 bg-pink-100 dark:bg-pink-900/30 rounded-2xl flex items-center justify-center text-pink-600 dark:text-pink-400 mb-6 transition-transform">
                                    <Pill className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">สำหรับผู้หญิง</h3>
                                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                                    หลากหลายทางเลือกที่เหมาะสมกับฮอร์โมนและวิถีชีวิต
                                </p>
                                <ul className="space-y-2 text-zinc-500 dark:text-zinc-500">
                                    <li className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                                        ยาคุมกำเนิดแบบแผง
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                                        ยาคุมฉุกเฉิน
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                                        แผ่นแปะ / ยาฝัง
                                    </li>
                                </ul>
                            </div>
                        </Reveal>

                    </div>

                </div>
            </main>
        </div>
    );
}
