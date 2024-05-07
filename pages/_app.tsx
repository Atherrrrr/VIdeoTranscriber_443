import type { FC } from "react";
import React from "react";
import type { AppProps } from "next/app";
import { Provider as StoreProvider } from "jotai";
import type { EmotionCache } from "@emotion/react";
import Layout from "../layout";
import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { Amplify } from "aws-amplify";
import awsconfig from "../aws-exports";
import PageProvider from "@/components/layout/PageProvider";
// import "@/styles/global.css";

Amplify.configure({ ...awsconfig }, { ssr: true });

export interface MUIAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const App: FC<MUIAppProps> = ({ Component, pageProps, emotionCache }) => (
  <StoreProvider>
    <PageProvider emotionCache={emotionCache}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </PageProvider>
  </StoreProvider>
);

export default withAuthenticator(App);
