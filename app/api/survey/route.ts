import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Survey from '@/models/Survey';

// Pre-connect to MongoDB to warm up the connection
dbConnect().catch(error => console.error('DB Warmup Error:', error));

export async function POST(req: Request) {
    // Start db connection immediately
    const connPromise = dbConnect();

    try {
        const body = await req.json();

        // Basic Validation
        if (!body.role || !body.fullName || !body.satisfactionLevel) {
            return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
        }

        await connPromise;
        const newSurvey = await Survey.create(body);

        return NextResponse.json({ success: true, data: newSurvey }, { status: 201 });
    } catch (error: any) {
        console.error('Submission Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const body = await req.json();
        const { id, passcode } = body;

        // Validate Passcode
        const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || 'admin123';
        if (passcode !== ADMIN_PASSCODE) {
            return NextResponse.json({ success: false, message: 'Invalid passcode' }, { status: 401 });
        }

        await dbConnect();

        if (!id) {
            return NextResponse.json({ success: false, message: 'Missing ID' }, { status: 400 });
        }

        const deletedSurvey = await Survey.findByIdAndDelete(id);

        if (!deletedSurvey) {
            return NextResponse.json({ success: false, message: 'Survey not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Deleted successfully' });
    } catch (error: any) {
        console.error('Delete Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
