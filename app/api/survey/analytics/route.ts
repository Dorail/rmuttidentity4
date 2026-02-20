import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import Survey from '@/models/Survey';

// Pre-connect to MongoDB to warm up the connection
dbConnect().catch(error => console.error('DB Warmup Error:', error));

export async function GET() {
    try {
        // Check for admin token cookie
        const cookieStore = await cookies();
        const adminToken = cookieStore.get('admin_token')?.value;

        if (!adminToken || adminToken !== 'authenticated') {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const totalRespondents = await Survey.countDocuments();

        // Helper for aggregation
        const getDistribution = async (field: string) => {
            return await Survey.aggregate([
                { $group: { _id: `$${field}`, count: { $sum: 1 } } },
                { $sort: { _id: 1 } }
            ]);
        };

        const [
            satisfactionData,
            durationData,
            locationData,
            leaderData,
            roleData,
            facultyData,
            recentResponses
        ] = await Promise.all([
            getDistribution('satisfactionLevel'),
            getDistribution('durationLevel'),
            getDistribution('locationLevel'),
            getDistribution('leaderLevel'),
            getDistribution('role'),
            getDistribution('faculty'),
            Survey.find().sort({ createdAt: -1 }).limit(50) // Get last 50 responses
        ]);

        // Mean calculations
        const stats = await Survey.aggregate([
            {
                $group: {
                    _id: null,
                    avgSatisfaction: { $avg: '$satisfactionLevel' },
                    avgDuration: { $avg: '$durationLevel' },
                    avgLocation: { $avg: '$locationLevel' },
                    avgLeader: { $avg: '$leaderLevel' }
                }
            }
        ]);

        return NextResponse.json({
            success: true,
            data: {
                totalRespondents,
                distributions: {
                    satisfaction: satisfactionData,
                    duration: durationData,
                    location: locationData,
                    leader: leaderData,
                    role: roleData,
                    faculty: facultyData,
                },
                recentResponses,
                averages: stats[0] || {}
            }
        });

    } catch (error: any) {
        console.error('Analytics API Error:', error);
        return NextResponse.json(
            {
                success: false,
                message: error.message || 'Database Connection Error',
                detail: String(error)
            },
            { status: 500 }
        );
    }
}

export const dynamic = 'force-dynamic';
