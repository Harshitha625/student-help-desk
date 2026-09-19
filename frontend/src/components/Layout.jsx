import React from 'react';
import Navbar from './Navbar';
import NotificationDrawer from './NotificationDrawer';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-brand-cream">
      <Navbar />

      <main>
        {children}
      </main>

      <NotificationDrawer />
    </div>
  );
}
