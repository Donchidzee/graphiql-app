import { Providers } from './providers';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import './global.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="body">
            <Header />
            <section>{children}</section>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
