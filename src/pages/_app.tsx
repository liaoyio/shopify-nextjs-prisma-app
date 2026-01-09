import AppBridgeProvider from "@/components/providers/app-bridge";
import { AppProvider as PolarisProvider } from "@shopify/polaris";
import "@shopify/polaris/build/esm/styles.css";
import translations from "@shopify/polaris/locales/en.json";
import Link from "next/link";
import type { AppProps } from "next/app";
import { NavMenu } from "@shopify/app-bridge-react";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <PolarisProvider i18n={translations}>
        <AppBridgeProvider>
          <NavMenu>
            <Link href="/debug">Debug Cards</Link>
          </NavMenu>
          <Component {...pageProps} />
        </AppBridgeProvider>
      </PolarisProvider>
    </>
  );
};

export default App;
