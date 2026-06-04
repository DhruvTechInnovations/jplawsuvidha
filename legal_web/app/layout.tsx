import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { AuthProvider } from "@/context/LoginContext";
import { PlanProvider } from "@/context/PlansContext";
import NotificationBanner from '@/components/NotificationBanner'
import LayoutVisibilityWrapper from "@/components/IconsWrapper";
import I18nextProvider from "@/context/LanguageContext";
import '../i18n';
import ScrollToTop from "@/components/ScrollToTop";
import CookieConsent from "@/components/Cookies";
import { Toaster } from 'sonner';
import ErrorBoundary from "@/components/ErrorBoundary";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JP Law Suvidha | Justice for People Driven by Technology",
  description:
    "JP Law Suvidha is a secure, technology-driven platform connecting clients with expert legal professionals. We leverage advanced digital tools and deep legal insight to deliver efficient, transparent, and accessible legal services for individuals and businesses—covering family, corporate, criminal, civil, and business law.",
  keywords: [
    "JP Law Suvidha",
    "legal services",
    "tech-enabled legal platform",
    "Hyderabad",
    "family law",
    "corporate law",
    "criminal law",
    "civil law",
    "business law",
    "legal consultation",
    "digital law platform",
    "lawyer matching",
    "NRI legal services",
    "NRI legal support"
  ],
  authors: [{ name: "JP Law Suvidha Team", url: "https://jplawsuvidha.com" }],
  openGraph: {
    title: "JP Law Suvidha | Justice for People Driven by Technology",
    description:
      "Empowering legal access through cutting-edge technology. Find the right legal expert and access professional legal services confidentially, efficiently, and affordably.",
    url: "https://jplawsuvidha.com",
    siteName: "JP Law Suvidha",
    images: [
      {
        url: "https://jplawsuvidha.com/og_logo.jpg", // Update with your site logo or preview image
        alt: "JP Law Suvidha Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico", // Adjust as needed
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          id="gtm-script"
          strategy="afterInteractive"
        >
          {`
            (function(w,d,s,l,i){
              w[l]=w[l]||[];
              w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});
              var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
              j.async=true;
              j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
              f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-5L8TP5BW');
          `}
        </Script>
        <link rel="preload" as="image" href="/hero.avif" />

      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* <CookieConsent/> */}
        <ErrorBoundary>
          <LayoutVisibilityWrapper>
            <I18nextProvider>

              <PlanProvider>
                <AuthProvider>
                  <ScrollToTop />
                  <NotificationBanner />


                  {children}
                  <Toaster richColors position="top-right" />


                </AuthProvider>
              </PlanProvider>
            </I18nextProvider>
          </LayoutVisibilityWrapper>
        </ErrorBoundary>

        {/* Tawk.to widget */}
        <Script
          id="tawkto"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
              (function(){
                var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
                s1.async=true;
                s1.src='https://embed.tawk.to/68938ad4a4fc79192a7bbeda/1j205ckk0';
                s1.charset='UTF-8';
                s1.setAttribute('crossorigin','*');
                s0.parentNode.insertBefore(s1,s0);
              })();
              setTimeout(function () {
                if (Tawk_API && Tawk_API.maximize) {
                  Tawk_API.maximize();
                }
              }, 10000);
            `,
          }}
        />

        <Script
          id="tawk-datalayer-hook"
          strategy="afterInteractive"
        >
          {`
            window.dataLayer = window.dataLayer || [];
            window.Tawk_API = window.Tawk_API || {};

            window.Tawk_API.onChatStarted = function () {
              window.dataLayer.push({
                event: "tawk_chat_started"
              });
            };
            window.Tawk_API.onChatMaximized = function () {
              window.dataLayer.push({
                event: "tawk_chat_maximized"
              });
            };
             window.Tawk_API.onChatMinimized = function () {
              window.dataLayer.push({
                event: "tawk_chat_minimized"
              });
            };
          `}
        </Script>
        <script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "96d73e85d19546f69c2d3210ad836aba"}'></script>
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5L8TP5BW"
          height="0" width="0" style={{ display: 'none', visibility: 'hidden' }}></iframe></noscript>

      </body>
    </html>
  );
}
