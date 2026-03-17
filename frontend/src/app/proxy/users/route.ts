import { NextRequest } from 'next/server';
import { proxyToService } from '../_proxy';

export async function GET(req: NextRequest) {
    return proxyToService(req, 'http://user-service:8000', '/users');
}

export async function POST(req: NextRequest) {
    return proxyToService(req, 'http://user-service:8000', '/users');
}
