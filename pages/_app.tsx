import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider as StoreProvider } from "jotai";
import type { EmotionCache } from "@emotion/react";
import Layout from "../layout";
import ProtectedRoute from "../auth";
import React from "react";
import type { FC } from "react";
import PageProvider from "@/components/layout/PageProvider";

export interface MUIAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const App: FC<MUIAppProps> = ({ Component, pageProps, emotionCache }) => (
  <StoreProvider>
    <PageProvider emotionCache={emotionCache}>
      <Layout>
        {pageProps.protected ? (
          <ProtectedRoute>
            <Component {...pageProps} />
          </ProtectedRoute>
        ) : (
          <Component {...pageProps} />
        )}
      </Layout>
    </PageProvider>
  </StoreProvider>
);

export default App;
