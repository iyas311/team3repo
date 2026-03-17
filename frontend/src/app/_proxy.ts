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
    // If the original request had a trailing slash, preserve it
    const hasTrailingSlash = req.nextUrl.pathname.endsWith('/');
    const sanitizedTargetPath = targetPath.endsWith('/') ? targetPath : (hasTrailingSlash ? `${targetPath}/` : targetPath);
    
    const searchParams = req.nextUrl.search;
    const targetUrl = `${serviceBaseUrl}${sanitizedTargetPath}${searchParams}`;

    // Forward relevant headers, strip hop-by-hop headers
    const forwardHeaders = new Headers();
    req.headers.forEach((value, key) => {
        const lower = key.toLowerCase();
        if (!['host', 'connection', 'transfer-encoding', 'te', 'upgrade', 'keep-alive'].includes(lower)) {
            forwardHeaders.set(key, value);
        }
    });

    const hasBody = req.method !== 'GET' && req.method !== 'HEAD';
    const body = hasBody ? req.body : undefined;
    
    // If forwarding a body, we must let fetch handle the content-type but preserve it
    const fetchOptions: RequestInit = {
        method: req.method,
        headers: forwardHeaders,
        body: body as any,
        // @ts-ignore
        duplex: hasBody ? 'half' : undefined,
    };

    try {
        const upstream = await fetch(targetUrl, fetchOptions);

        // Forward response headers, strip problematic ones
        const resHeaders = new Headers();
        upstream.headers.forEach((value, key) => {
            const lower = key.toLowerCase();
            if (!['transfer-encoding', 'connection', 'keep-alive'].includes(lower)) {
                // Special handling for Location header to prevent internal URL leakage
                if (lower === 'location' && value.includes('://')) {
                    try {
                        const url = new URL(value);
                        let newPath = url.pathname + url.search;
                        // Ensure the redirect stays behind our /proxy prefix
                        if (!newPath.startsWith('/proxy')) {
                            newPath = '/proxy' + newPath;
                        }
                        resHeaders.set(key, newPath);
                    } catch {
                        resHeaders.set(key, value);
                    }
                } else {
                    resHeaders.set(key, value);
                }
            }
        });

        // Use arrayBuffer to safely handle body without double-parsing or encoding issues
        const resBody = await upstream.arrayBuffer();

        return new NextResponse(resBody, {
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
