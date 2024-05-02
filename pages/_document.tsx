import { Html, Head, Main, NextScript } from "next/document";

const Document: React.FC = (): JSX.Element => {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700&display=swap"
        />
      </Head>
      <body>
        <div id="fab-div" />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
