/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      { source: '/arbiter', destination: '/projects/arbiter' },
      { source: '/repotrajectory', destination: '/projects/repotrajectory' },
      { source: '/github_analysis', destination: '/projects/repotrajectory' },
      { source: '/gitaudit', destination: '/projects/gitaudit' },
      { source: '/oss-maintainer', destination: '/projects/gitaudit' },
      { source: '/github_maintainer', destination: '/projects/gitaudit' },
      { source: '/forma', destination: '/projects/forma' },
      { source: '/gemini-mcp', destination: '/projects/gemini-mcp' },
      { source: '/gemni-mcp', destination: '/projects/gemini-mcp' },
      { source: '/rsvp-shift', destination: '/projects/rsvp-shift' },
      { source: '/rsvpshift', destination: '/projects/rsvp-shift' },
    ];
  },
};

export default nextConfig;
