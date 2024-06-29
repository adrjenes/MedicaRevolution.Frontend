import React from 'react';
import NavBar from './NavBar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow w-full" style={{ height: 'calc(100vh - 8rem)' }}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;