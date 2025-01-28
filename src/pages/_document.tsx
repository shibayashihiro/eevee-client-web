import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="ja">
        <Head>
          <link rel="preconnect" href="https://www.googleapis.com" />
          <link rel="preconnect" href="https://storage.googleapis.com" />
          <link rel="preconnect" href="https://apis.google.com" />
          <link rel="preconnect" href="https://chompy-jp.firebaseapp.com" />
          <link rel="preconnect" href="https://identitytoolkit.googleapis.com" />
          <meta name="robots" content="noindex" />
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
