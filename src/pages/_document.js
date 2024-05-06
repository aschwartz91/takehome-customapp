import Document, { Html, Head, Main, NextScript } from 'next/document';


class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta http-equiv="Content-Security-Policy" content="
          default-src 'self';
          style-src 'self' 'unsafe-inline';
          script-src-elem 'self' 'unsafe-eval' https://api.airtable.com 'unsafe-inline';
          script-src 'self' 'unsafe-eval' https://api.airtable.com 'unsafe-inline' ;
          
          
          img-src 'self' blob: data:;
          connect-src 'self' https://api.airtable.com; 
          font-src 'self';
          object-src 'self';
          base-uri 'self';
          form-action 'self';
          frame-ancestors 'none';
          upgrade-insecure-requests;
      
      
    "/>

        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
