import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider as StoreProvider } from "jotai";
import { EmotionCache } from "@emotion/react";
import Layout from "@/layout";
import ProtectedRoute from "@/auth_rowaha";
import React from "react";
import { Amplify } from "aws-amplify";
import { FC } from "react";
import PageProvider from "@/components/layout/PageProvider";
import awsconfig from "@/src/amplifyconfiguration.json";
import AuthContext from "@/utils/AuthContext";
// import AuthContext from "../context/AuthContext";

Amplify.configure({ ...awsconfig });

export interface MUIAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

// export default function App FC<MUIAppProps> ({ Component, pageProps, emotionCache }: AppProps) {
const App: FC<MUIAppProps> = ({ Component, pageProps, emotionCache }) => (
  // return (
  <StoreProvider>
    {/* <AuthContext> */}
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
    {/* </AuthContext> */}
  </StoreProvider>
);

// }
export default App;
