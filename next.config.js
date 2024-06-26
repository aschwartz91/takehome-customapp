/** @type {import('next').NextConfig} */
const nextConfig = {
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: '',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

const cspHeader = `
    default-src 'self';
    
    script-src-elem 'self' 'unsafe-eval' https://api.airtable.com"
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data:;
    connect-src 'self' https://api.airtable.com; 
    font-src 'self';
    object-src 'self';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;


`


module.exports = {nextConfig, cspHeader};
