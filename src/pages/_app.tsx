import "../styles/globals.css";
import type { AppType } from "next/dist/shared/lib/utils";

import '../styles/App.scss';

const MyApp: AppType = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default MyApp;
