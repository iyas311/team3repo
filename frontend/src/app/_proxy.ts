import { NextRequest, NextResponse } from 'next/server';

/**
 * Generic server-side proxy for a backend service.
 * Runs inside Docker container where service hostnames are resolvable.
 */
export async function proxyToService(
    req: NextRequest,
    serviceBaseUrl: string,
    targetPath: string
): Promise<NextResponse> {
    const searchParams = req.nextUrl.search;
    const targetUrl = `${serviceBaseUrl}${targetPath}${searchParams}`;

    // Forward relevant headers, strip hop-by-hop headers
    const forwardHeaders = new Headers();
    req.headers.forEach((value, key) => {
        const lower = key.toLowerCase();
        if (!['host', 'connection', 'transfer-encoding', 'te', 'upgrade', 'keep-alive'].includes(lower)) {
            forwardHeaders.set(key, value);
        }
    });

    const hasBody = req.method !== 'GET' && req.method !== 'HEAD';
    const body = hasBody ? await req.text() : undefined;

    try {
        const upstream = await fetch(targetUrl, {
            method: req.method,
            headers: forwardHeaders,
            body,
        });

        // Forward response headers, strip problematic ones
        const resHeaders = new Headers();
        upstream.headers.forEach((value, key) => {
            const lower = key.toLowerCase();
            if (!['transfer-encoding', 'connection', 'keep-alive'].includes(lower)) {
                resHeaders.set(key, value);
            }
        });

        return new NextResponse(upstream.body, {
            status: upstream.status,
            headers: resHeaders,
        });
    } catch (err: any) {
        console.error(`Proxy error → ${targetUrl}:`, err.message);
        return NextResponse.json(
            { error: 'Service unavailable', detail: err.message, target: targetUrl },
            { status: 503 }
        );
    }
}
