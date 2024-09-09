import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ParkMate",
  description: "Find & Book Parking Hassle-Free, Anytime, Anywhere",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        <Providers>
          <ToastContainer
            autoClose={1000}
            theme="light"
            transition={Slide}
            pauseOnHover={false}
            hideProgressBar
          />
          {children}
        </Providers>
      </body>
    </html>
  );
}
