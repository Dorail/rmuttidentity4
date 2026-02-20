'use client';

import { motion } from 'framer-motion';
import StaggerText from "@/components/ui/StaggerText";
import { BookOpen, Shield, HeartPulse, Baby } from 'lucide-react';
import Reveal from "@/components/ui/Reveal";
import Link from 'next/link';

const topics = [
    {
        title: "การป้องกันเบื้องต้น",
        desc: "หลักการง่ายๆ: ยินยอม, ไม่ประมาท, และความสะอาด",
        icon: <Shield className="w-8 h-8" />,
        color: "bg-green-100 text-green-600",
        href: "/education/basics",
        delay: 0.1
    },
    {
        title: "ประเภทความรุนแรง",
        desc: "รู้จักรูปแบบต่างๆ ของความรุนแรงทางเพศ",
        icon: <BookOpen className="w-8 h-8" />,
        color: "bg-blue-100 text-blue-600",
        href: "/education/types",
        delay: 0.2
    },
    {
        title: "การคุมกำเนิด",
        desc: "ทางเลือกต่างๆ เพื่อความปลอดภัยและมั่นใจ",
        icon: <HeartPulse className="w-8 h-8" />,
        color: "bg-rose-100 text-rose-600",
        href: "/education/contraception",
        delay: 0.3
    },
    {
        title: "ท้องไม่พร้อม",
        desc: "ทางออกและหน่วยงานช่วยเหลือเมื่อเกิดปัญหา",
        icon: <Baby className="w-8 h-8" />,
        color: "bg-amber-100 text-amber-600",
        href: "/education/pregnancy",
        delay: 0.4
    }
];

export default function EducationHubPage() {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans">
            <main className="pt-32 pb-24 px-4">
                <div className="max-w-6xl mx-auto space-y-12">

                    <div className="text-center space-y-6">
                        <Reveal width="100%" direction="down">
                            <h1 className="text-4xl md:text-6xl font-black text-zinc-900 dark:text-white tracking-tight">
                                <StaggerText text="คลังความรู้" />
                            </h1>
                        </Reveal>
                        <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                            รวมข้อมูลที่วัยรุ่นต้องรู้ เพื่อรักที่ปลอดภัยและรับผิดชอบ
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {topics.map((topic, i) => (
                            <Reveal key={topic.href} width="100%" delay={topic.delay}>
                                <Link href={topic.href}>
                                    <motion.div
                                        whileHover={{ y: -8, scale: 1.02 }}
                                        className="bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-sm hover:shadow-2xl transition-all duration-300 border border-zinc-100 dark:border-zinc-800 h-full flex items-start gap-6 group cursor-pointer"
                                    >
                                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${topic.color} group-hover:scale-110 transition-transform`}>
                                            {topic.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2 group-hover:text-rose-500 transition-colors">
                                                {topic.title}
                                            </h3>
                                            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                                {topic.desc}
                                            </p>
                                        </div>
                                    </motion.div>
                                </Link>
                            </Reveal>
                        ))}
                    </div>

                </div>
            </main>
        </div>
    );
}
