import { NextRequest } from 'next/server';
import { proxyToService } from '../_proxy';

export async function GET(req: NextRequest) {
    return proxyToService(req, 'http://ticket-service:8000', '/tickets');
}
