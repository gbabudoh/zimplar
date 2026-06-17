import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.zimplar.com";

export const metadata: Metadata = {
  title: {
    default: "Zimplar - Modern Learning Platform",
    template: "%s | Zimplar",
  },
  description: "Zimplar is a multi-tenant digital schooling and remote education platform tailored for Africa. Empowering governments, NGOs, private schools, and teachers with high-fidelity live rooms, billing, and AI proctoring.",
  keywords: ["EdTech", "Africa", "Digital Schooling", "E-learning", "LMS", "Zimplar", "Interactive Classroom", "Live Streaming", "Low Bandwidth Education", "Online Courses", "Virtual Classrooms"],
  authors: [{ name: "Zimplar Team", url: baseUrl }],
  creator: "Zimplar",
  publisher: "Zimplar",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Zimplar",
  },
  icons: {
    icon: "/favicon.png",
    apple: "/icon.png",
  },
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    title: "Zimplar - Modern Learning Platform",
    description: "Bridging the digital divide in African education. Interactive classrooms, multi-tenant portals for institutions, automated tuition, and offline-compatible learning architecture.",
    url: baseUrl,
    siteName: "Zimplar",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: `${baseUrl}/zimplarlogo.png`,
        width: 512,
        height: 512,
        alt: "Zimplar Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zimplar - Modern Learning Platform",
    description: "Bridging the digital divide in African education. Interactive classrooms, multi-tenant portals, automated tuition, and offline-compatible learning.",
    images: [`${baseUrl}/zimplarlogo.png`],
  },
};

export const viewport: Viewport = {
  themeColor: "#552121",
  width: "device-width",
  initialScale: 1,
};

import InstallPWA from "@/components/pwa/InstallPWA";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;
  const matomoUrl = process.env.NEXT_PUBLIC_MATOMO_URL;
  const matomoSiteId = process.env.NEXT_PUBLIC_MATOMO_SITE_ID;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var savedTheme = localStorage.getItem('theme');
                  if (!savedTheme) {
                    savedTheme = document.cookie.match(/theme=([^;]+)/)?.[1] || 'Light';
                  }
                  if (savedTheme === 'Dark' || (savedTheme === 'System' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.setAttribute('data-theme', 'Dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.setAttribute('data-theme', 'Light');
                  }
                } catch (e) {}
              })();
            `
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Google Analytics */}
        {gaId && gaId !== "G-XXXXXXXXXX" && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}

        {/* Microsoft Clarity */}
        {clarityId && clarityId !== "xxxxxxxxxx" && (
          <Script id="microsoft-clarity" strategy="afterInteractive">
            {`
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window,document,"clarity","script","${clarityId}");
            `}
          </Script>
        )}

        {/* Matomo Analytics */}
        {matomoUrl && matomoSiteId && (
          <Script id="matomo-analytics" strategy="afterInteractive">
            {`
              var _paq = window._paq = window._paq || [];
              _paq.push(['trackPageView']);
              _paq.push(['enableLinkTracking']);
              (function() {
                var u="${matomoUrl.endsWith("/") ? matomoUrl : matomoUrl + "/"}";
                _paq.push(['setTrackerUrl', u+'matomo.php']);
                _paq.push(['setSiteId', '${matomoSiteId}']);
                var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
                g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
              })();
            `}
          </Script>
        )}

        <SessionProvider>
          {children}
          <InstallPWA />
        </SessionProvider>
      </body>
    </html>
  );
}
