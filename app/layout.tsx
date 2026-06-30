import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "468Club — Caja",
  description: "Administración de clientes y caja de 468Club",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <header className="bg-sky-700 text-white">
          <div className="mx-auto max-w-5xl px-4 py-3 flex items-center gap-4">
            <Link href="/" className="font-bold text-lg">🏊 468Club</Link>
            <nav className="flex gap-3 text-sm">
              <Link href="/caja" className="hover:underline">Caja</Link>
              <Link href="/dueno" className="hover:underline">Dueño</Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
