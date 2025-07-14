import { AuthProvider } from './context/AuthContext';
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="lv">
      <body className="app-container">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
