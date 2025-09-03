import type { Metadata } from "next";
import "./globals.css";
import "react-quill-new/dist/quill.snow.css"; 
import { Bricolage_Grotesque } from "next/font/google";

const inter = Bricolage_Grotesque({
	weight: ["300", "400", "500", "600", "700"],
	subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Home | Google Docs Clone",
  description: "Google Docs Clone - Collaborative Document Editing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
     <body className={inter.className}>
        <main>{children}</main>
    
      </body>
    </html>
  );
}
