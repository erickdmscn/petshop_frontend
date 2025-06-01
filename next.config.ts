import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async rewrites() {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

    return [
      {
        source: '/api/companies',
        destination: `${apiBaseUrl}/v1/companies`,
      },
      {
        source: '/api/companies/:path*',
        destination: `${apiBaseUrl}/v1/companies/:path*`,
      },
      {
        source: '/api/auth',
        destination: `${apiBaseUrl}/v1/users/Authenticate`,
      },
    ]
  },
}

export default nextConfig
