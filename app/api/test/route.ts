import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import Survey from '@/models/Survey';

export const dynamic = 'force-dynamic'; // Prevent caching

export async function GET() {
    try {
        // Check for admin token cookie
        const cookieStore = await cookies();
        const adminToken = cookieStore.get('admin_token')?.value;

        if (!adminToken || adminToken !== 'authenticated') {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        // 1. Fetch raw data (sorted by newest)
        const recentResponses = await Survey.find().sort({ createdAt: -1 }).limit(100).lean();

        // 2. Calculate Aggregates manually
        const totalRespondents = await Survey.countDocuments();

        // Helper for grouping
        const groupCount = (data: any[], field: string) => {
            const counts: Record<string, number> = {};
            data.forEach(item => {
                const val = item[field];
                if (val) {
                    counts[val] = (counts[val] || 0) + 1;
                }
            });
            return Object.entries(counts).map(([name, value]) => ({ _id: name, count: value }));
        };

        // 3. Fetch ALL data for distributions and advanced stats
        const allSurveys = await Survey.find({}, 'satisfactionLevel durationLevel locationLevel leaderLevel role faculty createdAt').lean();

        const stats = {
            avgSatisfaction: allSurveys.reduce((acc: number, curr: any) => acc + (curr.satisfactionLevel || 0), 0) / (totalRespondents || 1),
            avgDuration: allSurveys.reduce((acc: number, curr: any) => acc + (curr.durationLevel || 0), 0) / (totalRespondents || 1),
            avgLocation: allSurveys.reduce((acc: number, curr: any) => acc + (curr.locationLevel || 0), 0) / (totalRespondents || 1),
            avgLeader: allSurveys.reduce((acc: number, curr: any) => acc + (curr.leaderLevel || 0), 0) / (totalRespondents || 1),
        };

        // Timeline aggregation
        const timelineMap: Record<string, number> = {};
        allSurveys.forEach((s: any) => {
            if (s.createdAt) {
                const date = new Date(s.createdAt).toISOString().split('T')[0]; // YYYY-MM-DD
                timelineMap[date] = (timelineMap[date] || 0) + 1;
            }
        });
        const timeline = Object.entries(timelineMap)
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => a.date.localeCompare(b.date));

        // Faculty Performance
        const facultyStatsMap: Record<string, { total: number, count: number }> = {};
        allSurveys.forEach((s: any) => {
            if (s.faculty && s.satisfactionLevel) {
                if (!facultyStatsMap[s.faculty]) facultyStatsMap[s.faculty] = { total: 0, count: 0 };
                facultyStatsMap[s.faculty].total += s.satisfactionLevel;
                facultyStatsMap[s.faculty].count += 1;
            }
        });
        const facultyPerformance = Object.entries(facultyStatsMap)
            .map(([name, data]) => ({ name, value: data.total / data.count }))
            .sort((a, b) => b.value - a.value);

        // Stacked Score Matrix
        const scoreMatrix = [
            { name: 'ความพึงพอใจ', ...[1, 2, 3, 4, 5].reduce((acc, r) => ({ ...acc, [r]: allSurveys.filter((s: any) => s.satisfactionLevel === r).length }), {}) },
            { name: 'ระยะเวลา', ...[1, 2, 3, 4, 5].reduce((acc, r) => ({ ...acc, [r]: allSurveys.filter((s: any) => s.durationLevel === r).length }), {}) },
            { name: 'สถานที่', ...[1, 2, 3, 4, 5].reduce((acc, r) => ({ ...acc, [r]: allSurveys.filter((s: any) => s.locationLevel === r).length }), {}) },
            { name: 'วิทยากร', ...[1, 2, 3, 4, 5].reduce((acc, r) => ({ ...acc, [r]: allSurveys.filter((s: any) => s.leaderLevel === r).length }), {}) },
        ];

        return NextResponse.json({
            success: true,
            data: {
                totalRespondents,
                distributions: {
                    satisfaction: groupCount(allSurveys, 'satisfactionLevel').sort((a: any, b: any) => a._id - b._id),
                    duration: groupCount(allSurveys, 'durationLevel').sort((a: any, b: any) => a._id - b._id),
                    location: groupCount(allSurveys, 'locationLevel').sort((a: any, b: any) => a._id - b._id),
                    leader: groupCount(allSurveys, 'leaderLevel').sort((a: any, b: any) => a._id - b._id),
                    role: groupCount(allSurveys, 'role'),
                    faculty: groupCount(allSurveys, 'faculty'),
                },
                timeline,
                facultyPerformance,
                scoreMatrix,
                recentResponses,
                averages: stats
            }
        });

    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({
            success: false,
            message: 'Server Error',
            detail: error.message
        }, { status: 500 });
    }
}
