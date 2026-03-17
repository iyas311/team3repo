import { NextRequest } from 'next/server';
import { proxyToService } from '../../../_proxy';

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
    const targetPath = `/users/${params.path.join('/')}`;
    return proxyToService(req, 'http://user-service:8000', targetPath);
}

export async function POST(req: NextRequest, { params }: { params: { path: string[] } }) {
    const targetPath = `/users/${params.path.join('/')}`;
    return proxyToService(req, 'http://user-service:8000', targetPath);
}

export async function PUT(req: NextRequest, { params }: { params: { path: string[] } }) {
    const targetPath = `/users/${params.path.join('/')}`;
    return proxyToService(req, 'http://user-service:8000', targetPath);
}
