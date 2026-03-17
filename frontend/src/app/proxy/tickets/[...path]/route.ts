import { NextRequest } from 'next/server';
import { proxyToService } from '../../../_proxy';

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
    const targetPath = `/tickets/${params.path.join('/')}`;
    return proxyToService(req, 'http://ticket-service:8000', targetPath);
}
