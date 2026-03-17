import { NextRequest } from 'next/server';
import { proxyToService } from '../../../_proxy';

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
    const targetPath = `/bookings/${params.path.join('/')}`;
    return proxyToService(req, 'http://booking-service:8000', targetPath);
}

export async function POST(req: NextRequest, { params }: { params: { path: string[] } }) {
    const pathPart = params.path?.join('/') || '';
    const targetPath = pathPart ? `/bookings/${pathPart}` : '/bookings';
    return proxyToService(req, 'http://booking-service:8000', targetPath);
}

export async function DELETE(req: NextRequest, { params }: { params: { path: string[] } }) {
    const targetPath = `/bookings/${params.path.join('/')}`;
    return proxyToService(req, 'http://booking-service:8000', targetPath);
}
