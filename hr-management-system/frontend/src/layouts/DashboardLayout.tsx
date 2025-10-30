// src/layouts/DashboardLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function DashboardLayout() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar fixe à gauche */}
      <Sidebar />

      {/* Contenu principal avec Header */}
      <div className="flex-1 flex flex-col ml-64 overflow-hidden">
        {/* Header en haut */}
        <Header />

        {/* Contenu de la page avec scroll */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}