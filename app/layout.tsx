import "./global.css";
import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Montserrat, Poppins, Playfair_Display, Playwrite_US_Trad } from 'next/font/google';
import localFont from 'next/font/local';
import { Navbar } from "./components/nav";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Footer from "./components/footer";
import { baseUrl } from "./sitemap";
import { ThemeProvider } from "./components/ThemeProvider";
import { darkModeScript } from "./components/ThemeScriptSimple";

// Font configuration with Next.js optimization
const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
});

const poppins = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
});

const playfair = Playfair_Display({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
});

const manufacturingConsent = localFont({
  src: '../public/fonts/ManufacturingConsent-Regular.ttf',
  display: 'swap',
  variable: '--font-manufacturing',
});

const playwriteUSA = Playwrite_US_Trad({
  weight: ['100', '200', '300', '400'],
  display: 'swap',
  variable: '--font-playwrite',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Hello, I'm Ghaly! Welcome to My Site",
  description: "This is my portfolio.",
  openGraph: {
    title: "My Portfolio",
    description: "This is my portfolio.",
    url: baseUrl,
    siteName: "My Portfolio",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: baseUrl,
  },
};

const cx = (...classes: string[]) => classes.filter(Boolean).join(" ");

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cx(
        GeistSans.variable,
        GeistMono.variable,
        montserrat.variable,
        poppins.variable,
        playfair.variable,
        manufacturingConsent.variable,
        playwriteUSA.variable
      )}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: darkModeScript }} />
      </head>
      <body className="antialiased max-w-3xl mx-auto px-4 sm:px-6 lg:px-4 xl:px-0 mt-6 sm:mt-8 lg:mt-12 bg-white dark:bg-[#121212] text-black dark:text-[#f5f5f7]">
        <ThemeProvider>
          <Navbar />
          <main className="min-w-0 mt-8 flex flex-col">
            {children}
            <Footer />
            <Analytics />
            <SpeedInsights />
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
