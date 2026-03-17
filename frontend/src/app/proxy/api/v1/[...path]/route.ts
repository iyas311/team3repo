import { NextRequest } from 'next/server';
import { proxyToService } from '../../../../_proxy';

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
    const targetPath = `/api/v1/${params.path.join('/')}`;
    return proxyToService(req, 'http://event-service:8000', targetPath);
}

export async function POST(req: NextRequest, { params }: { params: { path: string[] } }) {
    const targetPath = `/api/v1/${params.path.join('/')}`;
    return proxyToService(req, 'http://event-service:8000', targetPath);
}
