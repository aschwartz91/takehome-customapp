import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next();
  }

  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  // If you have a custom domain add it below to the
  // space separated frame-ancestors list.
  const cspHeader = `
  default-src 'self';
  style-src 'self' 'unsafe-inline';
  script-src-elem 'self' 'unsafe-eval''unsafe-inline' https://api.airtable.com;
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://api.airtable.com;
  img-src 'self' blob: data:;
  connect-src 'self' 'unsafe-eval' 'unsafe-inline' https://api.airtable.com; 
  font-src 'self';
  object-src 'self';
  base-uri 'self';
  form-action 'self';
  upgrade-insecure-requests;

`;
  // Replace newline characters and spaces
  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, ' ')
    .trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);

  requestHeaders.set(
    'Content-Security-Policy',
    contentSecurityPolicyHeaderValue,
  );

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  response.headers.set(
    'Content-Security-Policy',
    contentSecurityPolicyHeaderValue,
  );

  return response;
}
