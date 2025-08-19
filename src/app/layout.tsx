import "../styles/globals.css";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: {
    default: "Ice.code | Full Stack Developer & Systems Architect",
    template: "%s | Ice.code"
  },
  description: "Professional portfolio of Ice Trahan - Full stack developer, systems architect, and gaming community builder. Specializing in Python, JavaScript, React, and modern web technologies.",
  keywords: [
    "full stack developer",
    "systems architect", 
    "Python developer",
    "JavaScript developer",
    "React developer",
    "Next.js",
    "Three.js",
    "web development",
    "portfolio",
    "Ice Trahan"
  ],
  authors: [{ name: "Ice Trahan", url: "https://github.com/Icecode0" }],
  creator: "Ice Trahan",
  metadataBase: new URL("https://ice.codes"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ice.codes",
    title: "Ice.code | Full Stack Developer & Systems Architect",
    description: "Professional portfolio showcasing full stack development expertise, 3D web applications, and innovative solutions.",
    siteName: "Ice.code Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ice.code | Full Stack Developer",
    description: "Professional portfolio showcasing full stack development expertise and innovative solutions.",
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.className} bg-gray-900 text-gray-100 min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}