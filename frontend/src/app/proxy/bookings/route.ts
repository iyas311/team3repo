import { NextRequest } from 'next/server';
import { proxyToService } from '../_proxy';

export async function GET(req: NextRequest) {
    return proxyToService(req, 'http://booking-service:8000', '/bookings');
}

export async function POST(req: NextRequest) {
    return proxyToService(req, 'http://booking-service:8000', '/bookings');
}
