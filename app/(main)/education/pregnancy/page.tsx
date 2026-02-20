'use client';

import { motion } from 'framer-motion';
import StaggerText from "@/components/ui/StaggerText";
import { Baby, Phone, HeartHandshake, Home } from 'lucide-react';
import Reveal from "@/components/ui/Reveal";

export default function PregnancyPage() {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans">
            <main className="pt-32 pb-24 px-4">
                <div className="max-w-4xl mx-auto space-y-16">

                    {/* Header */}
                    <div className="text-center space-y-6">
                        <Reveal width="100%" direction="down">
                            <div className="w-20 h-20 mx-auto bg-amber-100 dark:bg-amber-900/30 rounded-3xl flex items-center justify-center text-amber-600 dark:text-amber-400">
                                <Baby className="w-10 h-10" />
                            </div>
                        </Reveal>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-900 dark:text-white">
                            <StaggerText text="เมื่อตั้งครรภ์ไม่พร้อม" />
                        </h1>
                        <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                            คุณไม่ได้อยู่ตัวคนเดียว ยังมีทางออกและหน่วยงานที่พร้อมเคียงข้างเสมอ
                        </p>
                    </div>

                    {/* Content Steps */}
                    <div className="grid gap-8">

                        <Reveal width="100%" delay={0.2}>
                            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 md:p-12 shadow-sm border border-zinc-100 dark:border-zinc-800">
                                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">3 สิ่งแรกที่ควรทำ</h2>
                                <div className="space-y-6">
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center font-bold text-zinc-500 shrink-0">1</div>
                                        <div>
                                            <h3 className="font-bold text-lg">ตั้งสติและยอมรับความจริง</h3>
                                            <p className="text-zinc-600 dark:text-zinc-400">การตื่นตระหนกอาจทำให้ตัดสินใจผิดพลาด หายใจเข้าลึกๆ ทุกปัญหามีทางออก</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center font-bold text-zinc-500 shrink-0">2</div>
                                        <div>
                                            <h3 className="font-bold text-lg">ปรึกษาคนที่ไว้ใจได้</h3>
                                            <p className="text-zinc-600 dark:text-zinc-400">พ่อแม่, ครูแนะแนว, หรือเพื่อนสนิท การระบายความรู้สึกจะช่วยลดความกดดันได้มาก</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center font-bold text-zinc-500 shrink-0">3</div>
                                        <div>
                                            <h3 className="font-bold text-lg">ติดต่อหน่วยงานช่วยเหลือ</h3>
                                            <p className="text-zinc-600 dark:text-zinc-400">มีผู้เชี่ยวชาญพร้อมให้คำปรึกษาทางเลือกที่ปลอดภัยและถูกต้องตามกฎหมาย</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Reveal>

                        {/* Resources */}
                        <Reveal width="100%" delay={0.3}>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-rose-500 text-white p-8 rounded-3xl shadow-xl shadow-rose-500/20">
                                    <Phone className="w-10 h-10 mb-4" />
                                    <h3 className="text-2xl font-bold mb-2">สายด่วน 1663</h3>
                                    <p className="text-rose-100">
                                        ปรึกษาปัญหาท้องไม่พร้อม (09.00 - 21.00 น.)<br />
                                        ให้คำปรึกษาทางเลือกที่เป็นมิตรและปลอดภัย
                                    </p>
                                </div>
                                <div className="bg-zinc-900 dark:bg-zinc-800 text-white p-8 rounded-3xl">
                                    <HeartHandshake className="w-10 h-10 mb-4 text-emerald-400" />
                                    <h3 className="text-2xl font-bold mb-2">RSA Thai</h3>
                                    <p className="text-zinc-400">
                                        เครือข่ายส่งต่อเพื่อการยุติการตั้งครรภ์ที่ปลอดภัย<br />
                                        <a href="https://rsathai.org" target="_blank" className="underline hover:text-white transition-colors">www.rsathai.org</a>
                                    </p>
                                </div>
                            </div>
                        </Reveal>

                    </div>
                </div>
            </main>
        </div>
    );
}
