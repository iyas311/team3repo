/** @type {import('next').NextConfig} */
const nextConfig = {
  // NOTE: 'output: standalone' was removed because it conflicts with npm start + rewrites.
  // When standalone mode is enabled, Next.js sends redirect headers to the
  // rewrite destination instead of proxying transparently, causing the browser
  // to try reaching Docker-internal hostnames (e.g. event-service:8000) directly.
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  // Proxy API calls from the Next.js server to backend containers.
  // This makes the frontend work when accessed directly on port 3000.
  async rewrites() {
    return [
      // User Service
      {
        source: "/users/:path*",
        destination: "http://user-service:8000/users/:path*",
      },
      // Event Service
      {
        source: "/api/v1/:path*",
        destination: "http://event-service:8000/api/v1/:path*",
      },
      // Booking Service
      {
        source: "/bookings/:path*",
        destination: "http://booking-service:8000/bookings/:path*",
      },
      {
        source: "/bookings",
        destination: "http://booking-service:8000/bookings",
      },
      // Payment Service
      {
        source: "/payments/:path*",
        destination: "http://payment-service:8000/payments/:path*",
      },
      // Ticket Service
      {
        source: "/tickets/:path*",
        destination: "http://ticket-service:8000/tickets/:path*",
      },
    ];
  },
};

export default nextConfig;
