import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { MobileBottomBar } from '../components/MobileBottomBar';
import { LocalBusinessSchema } from '../components/seo/JsonLd';
import { apiGet } from '../api/client';
import type { Category } from '../types/domain';

const inter = Inter({
  subsets: ['vietnamese', 'latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://hopgiayre.vn'),
  title: {
    default: 'Xưởng In Hộp Giấy Giá Rẻ TP.HCM - HopGiayRe.vn | Giá Tận Xưởng',
    template: '%s | HopGiayRe.vn',
  },
  description:
    'Xưởng sản xuất và in ấn hộp giấy giá rẻ tại TP.HCM. Chuyên thùng carton sóng E/B, hộp cứng cao cấp, hộp giấy Kraft, túi giấy. Hỗ trợ thiết kế miễn phí, nhận in từ 100 hộp, giao hàng 24h.',
  keywords: [
    'in hộp giấy',
    'in hộp giấy giá rẻ',
    'xưởng in hộp giấy',
    'hộp carton sóng e',
    'hộp cứng cao cấp',
    'in túi giấy',
    'hộp giấy tphcm',
  ],
  authors: [{ name: 'HopGiayRe.vn' }],
  creator: 'HopGiayRe.vn',
  publisher: 'HopGiayRe.vn',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://hopgiayre.vn',
    siteName: 'HopGiayRe.vn',
    title: 'Xưởng In Hộp Giấy Giá Rẻ TP.HCM - HopGiayRe.vn',
    description:
      'Sản xuất trực tiếp không qua trung gian. Báo giá in hộp giấy carton, hộp quà, túi giấy sau 5 phút.',
    images: [
      {
        url: '/images/logo.svg',
        width: 1200,
        height: 630,
        alt: 'HopGiayRe.vn - Xưởng in hộp giấy giá rẻ',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Xưởng In Hộp Giấy Giá Rẻ TP.HCM - HopGiayRe.vn',
    description: 'Sản xuất trực tiếp không qua trung gian. Nhận in từ 100 hộp, báo giá sau 5 phút.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

async function getCategories(): Promise<Category[]> {
  try {
    const res = await apiGet<Category[]>('/catalog/get_all', { show_home: 'show' });
    return res || [];
  } catch {
    return [];
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getCategories();

  return (
    <html lang="vi" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col bg-white text-slate-900 antialiased selection:bg-emerald-500 selection:text-white`}>
        <LocalBusinessSchema />
        <Header categories={categories} />
        <main className="flex-1">{children}</main>
        <Footer />
        <MobileBottomBar />
      </body>
    </html>
  );
}
