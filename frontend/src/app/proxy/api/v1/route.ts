import { NextRequest } from 'next/server';
import { proxyToService } from '../../_proxy';

export async function GET(req: NextRequest) {
    return proxyToService(req, 'http://event-service:8000', '/api/v1/events');
}

export async function POST(req: NextRequest) {
    return proxyToService(req, 'http://event-service:8000', '/api/v1/events');
}
