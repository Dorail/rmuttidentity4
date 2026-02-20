import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Setting from '@/models/Setting';

export async function GET(req: Request) {
    try {
        await dbConnect();
        const settings = await Setting.find({});

        // Convert array to object for easier frontend consumption
        const settingsMap: any = {};
        settings.forEach(s => {
            settingsMap[s.key] = s.value;
        });

        return NextResponse.json({ success: true, data: settingsMap });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { key, value, passcode } = body;

        // Validate Passcode
        const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || 'admin123';
        if (passcode !== ADMIN_PASSCODE) {
            return NextResponse.json({ success: false, message: 'Invalid passcode' }, { status: 401 });
        }

        if (!key) {
            return NextResponse.json({ success: false, message: 'Missing key' }, { status: 400 });
        }

        await dbConnect();

        const updatedSetting = await Setting.findOneAndUpdate(
            { key },
            { key, value },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        return NextResponse.json({ success: true, data: updatedSetting });
    } catch (error: any) {
        console.error('Settings Update Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
