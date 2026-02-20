import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    try {
        const { passcode } = await req.json();

        const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE;

        if (!ADMIN_PASSCODE) {
            console.error('ADMIN_PASSCODE is not defined in environment variables');
            return NextResponse.json({ success: false, message: 'Server configuration error' }, { status: 500 });
        }

        if (passcode === ADMIN_PASSCODE) {
            // Set HttpOnly cookie - Using a fixed value instead of the passcode itself
            const cookieStore = await cookies();
            cookieStore.set('admin_token', 'authenticated', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
                maxAge: 60 * 60 * 24 // 1 day
            });

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ success: false, message: 'Invalid passcode' }, { status: 401 });
    } catch (error) {
        console.error('Auth Error:', error);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}

export async function DELETE() {
    try {
        const cookieStore = await cookies();
        cookieStore.delete('admin_token');
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Logout failed' }, { status: 500 });
    }
}
