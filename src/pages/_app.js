import { SessionProvider } from "next-auth/react";
import "@/styles/globals.css";

import "@fontsource/amatic-sc";
import "@fontsource/anton";
import "@fontsource/arimo";
import "@fontsource/bebas-neue";
import "@fontsource/caveat";
import "@fontsource/cormorant";
import "@fontsource/dancing-script";
import "@fontsource/eb-garamond";
import "@fontsource/fauna-one";
import "@fontsource/fjalla-one";
import "@fontsource/indie-flower";
import "@fontsource/josefin-sans";
import "@fontsource/lato";
import "@fontsource/limelight";
import "@fontsource/lobster";
import "@fontsource/merriweather";
import "@fontsource/monoton";
import "@fontsource/montserrat";
import "@fontsource/noto-sans";
import "@fontsource/open-sans";
import "@fontsource/oswald";
import "@fontsource/pt-sans";
import "@fontsource/pacifico";
import "@fontsource/philosopher";
import "@fontsource/playfair-display";
import "@fontsource/poppins";
import "@fontsource/quicksand";
import "@fontsource/raleway";
import "@fontsource/roboto";
import "@fontsource/slabo-27px";
import "@fontsource/source-sans-pro";
import "@fontsource/teko";
import "@fontsource/trirong";
import "@fontsource/ubuntu";
import "@fontsource/unifrakturmaguntia";
import "@fontsource/varela-round";
import "@fontsource/yanone-kaffeesatz";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
