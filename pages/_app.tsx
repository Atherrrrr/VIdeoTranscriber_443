import type { FC } from "react";
import React, { useEffect } from "react";
import type { AppProps } from "next/app";
import { Provider as StoreProvider } from "jotai";
import type { EmotionCache } from "@emotion/react";
import Layout from "../layout";
import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { Amplify } from "aws-amplify";
import awsconfig from "../aws-exports";
import PageProvider from "@/components/layout/PageProvider";
import { useRouter } from "next/router";

Amplify.configure({ ...awsconfig }, { ssr: true });

export interface MUIAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const App: FC<MUIAppProps> = ({ Component, pageProps, emotionCache }) => {
  const router = useRouter();

  useEffect(() => {
    // Handle redirection for undefined URLs
    const handleRouteChange = (url: string) => {
      // List of defined routes
      const pathname = new URL(url, window.location.href).pathname;
      const definedRoutes = ["/", "/dashboard", "/video"];
      const isVideoRoute = pathname.startsWith("/video");
      if (!definedRoutes.includes(pathname) && !isVideoRoute) {
        console.log("url", url);
        router.replace("/dashboard");
      }
    };

    // Add event listener for route changes
    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      // Remove event listener when component unmounts
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router]);

  return (
    <StoreProvider>
      <PageProvider emotionCache={emotionCache}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </PageProvider>
    </StoreProvider>
  );
};

export default withAuthenticator(App);
