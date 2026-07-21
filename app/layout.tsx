import './globals.css';
import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { CartProvider } from '@/context/CartContext';
import AuthModal from '@/components/auth/AuthModal';
import CookieConsent from '@/components/shared/CookieConsent';
import Script from 'next/script';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.vedasach.com'),
  title: {
    default: 'VedaSach – Wellness, Ayurveda, Dream Meanings & Natural Health',
    template: '%s | VedaSach',
  },
  description: "India's trusted wellness platform covering dream meanings, Ayurveda, yoga, home remedies, beauty, nutrition, and spirituality. Healthy Mind • Healthy Body • Positive Life.",
  keywords: ['ayurveda', 'dream meanings', 'yoga', 'home remedies', 'wellness', 'natural health', 'spirituality', 'nutrition', 'beauty', 'meditation'],
  authors: [{ name: 'VedaSach Editorial Team', url: 'https://www.vedasach.com/about' }],
  creator: 'VedaSach Editorial Team',
  publisher: 'VedaSach',
  applicationName: 'VedaSach',
  category: 'Health & Wellness',
  formatDetection: { telephone: true, address: true, email: true },
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'VedaSach',
    title: 'VedaSach – Wellness, Ayurveda & Dream Meanings',
    description: "India's trusted wellness platform. Healthy Mind • Healthy Body • Positive Life.",
    url: 'https://www.vedasach.com',
    images: [{ url: '/logo.svg', width: 180, height: 48, alt: 'VedaSach Logo' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VedaSach – Wellness, Ayurveda & Dream Meanings',
    description: "India's trusted wellness platform. Healthy Mind • Healthy Body • Positive Life.",
    images: ['/logo.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
  manifest: '/manifest.json',
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/favicon.svg' }],
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'VedaSach',
  url: 'https://www.vedasach.com',
  logo: 'https://www.vedasach.com/logo.svg',
  description: "India's trusted wellness platform covering dream meanings, Ayurveda, yoga, home remedies, beauty, nutrition, and spirituality.",
  sameAs: ['https://www.vedasach.com', 'https://www.facebook.com/vedasach', 'https://twitter.com/vedasach', 'https://www.instagram.com/vedasach', 'https://www.linkedin.com/company/vedasach'],
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'VedaSach',
  url: 'https://www.vedasach.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://www.vedasach.com/search?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics – replace GA_MEASUREMENT_ID with your actual ID */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-VMN9PMWLLJ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-VMN9PMWLLJ', { page_path: window.location.pathname });
          `}
        </Script>

        {/* Google AdSense – replace ca-pub-XXXXXXXXXXXXXXXX with your publisher ID */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8123656560774437"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      </head>
      <body>
        <AuthProvider>
          <LanguageProvider>
            <CartProvider>
              <Header />
              <main>{children}</main>
              <Footer />
              <AuthModal />
              <CookieConsent />
            </CartProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
