/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  // Proxy API calls from the browser/Next.js server to backend services.
  // This makes the frontend work whether accessed via Nginx (port 80) or
  // directly on port 3000.
  async rewrites() {
    const userServiceUrl =
      process.env.USER_SERVICE_INTERNAL_URL || "http://user-service:8000";
    const eventServiceUrl =
      process.env.EVENT_SERVICE_INTERNAL_URL || "http://event-service:8000";
    const bookingServiceUrl =
      process.env.BOOKING_SERVICE_INTERNAL_URL || "http://booking-service:8000";
    const paymentServiceUrl =
      process.env.PAYMENT_SERVICE_INTERNAL_URL || "http://payment-service:8000";
    const ticketServiceUrl =
      process.env.TICKET_SERVICE_INTERNAL_URL || "http://ticket-service:8000";

    return [
      // User Service
      {
        source: "/users/:path*",
        destination: `${userServiceUrl}/users/:path*`,
      },
      // Event Service
      {
        source: "/api/v1/:path*",
        destination: `${eventServiceUrl}/api/v1/:path*`,
      },
      // Booking Service
      {
        source: "/bookings/:path*",
        destination: `${bookingServiceUrl}/bookings/:path*`,
      },
      {
        source: "/bookings",
        destination: `${bookingServiceUrl}/bookings`,
      },
      // Payment Service
      {
        source: "/payments/:path*",
        destination: `${paymentServiceUrl}/payments/:path*`,
      },
      // Ticket Service
      {
        source: "/tickets/:path*",
        destination: `${ticketServiceUrl}/tickets/:path*`,
      },
    ];
  },
};

export default nextConfig;
