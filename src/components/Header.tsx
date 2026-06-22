/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShoppingBag, Clock, MapPin, Sparkles, Phone } from 'lucide-react';
import { CartItem } from '../types';
// @ts-ignore
import restaurantLogo from '../assets/images/restaurant_logo_1782093118510.jpg';

interface HeaderProps {
  cart: CartItem[];
  setIsCartOpen: (open: boolean) => void;
  activeOrderId: string | null;
  setView: (view: 'menu' | 'tracker' | 'chef' | 'admin') => void;
  itemCount: number;
  exchangeRate?: { bcv: number; parallel: number; source: string; loading: boolean };
}

export default function Header({
  cart,
  setIsCartOpen,
  activeOrderId,
  setView,
  itemCount,
  exchangeRate
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-[#150D0D] text-white shadow-xl border-b-2 border-[#C5A033] font-sans relative" id="app-header">
      {/* Top micro-bar styled as a rich Imperial Red lacquer ribband */}
      <div className="bg-[#800C0D] py-1.5 px-4 hidden sm:block text-xs text-yellow-100/90 tracking-wide border-b border-[#C5A033]/40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="flex items-center text-yellow-200">
              <Clock className="w-3.5 h-3.5 mr-1.5 text-[#C5A033]" />
              Horario: Lun-Sáb 11:30 AM - 10:00 PM | Dom hasta 9:00 PM
            </span>
            <span className="flex items-center text-yellow-200">
              <MapPin className="w-3.5 h-3.5 mr-1.5 text-[#C5A033]" />
              C.C. Costa Granada, Puerto Ordaz, Venezuela
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {exchangeRate && (
              <div className="flex items-center space-x-1.5 bg-[#4A0404] border border-[#C5A033] text-yellow-300 px-2.5 py-0.5 rounded-sm font-mono font-bold text-[10px] tracking-wide" title={`Tasa real-time de Bolívar obtenida vía ${exchangeRate.source}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span>TASA BCV: {exchangeRate.bcv.toFixed(2)} Bs</span>
              </div>
            )}
            <a 
              href="tel:04147712545" 
              className="flex items-center text-yellow-300 hover:text-[#C5A033] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 mr-1 text-[#C5A033]" />
              <span>0414-7712545</span>
            </a>
            <span className="bg-[#C5A033] hover:bg-[#D4AF37] text-black font-extrabold px-2.5 py-0.5 rounded-sm text-[9px] tracking-widest uppercase shadow-xs">
              🏮 DELIVERY ACTIVO
            </span>
          </div>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex justify-between items-center relative">
        {/* Decorative corner key accents */}
        <div className="corner-ornament-tl hidden lg:block" />
        <div className="corner-ornament-tr hidden lg:block" />

        {/* Brand Logo - Scaled and aligned to mimic Instagram Logo */}
        <div 
          className="flex items-center space-x-3.5 cursor-pointer group" 
          onClick={() => setView('menu')}
          id="header-brand"
        >
          {/* Beautiful Official Dragon Logo */}
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 transform group-hover:scale-105 transition-transform duration-300 rounded-full border-2 border-[#C5A033] overflow-hidden shadow-lg shadow-[#C5A033]/15 bg-black">
            <img 
              src={restaurantLogo} 
              alt="Logo Palacio Cantón" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div>
            <div className="flex items-center">
              {/* Calligraphy Red Seal Stamp */}
              <span className="cinnabar-stamp text-base font-bold w-6 h-6 rounded-sm flex items-center justify-center mr-2 select-none shadow-md" title="Palacio Cantón">
                福
              </span>
              <h1 className="text-lg sm:text-2xl font-serif font-black tracking-widest leading-none text-yellow-400 group-hover:text-[#C5A033] transition-colors uppercase">
                PALACIO CANTÓN
              </h1>
            </div>
            <p className="text-[9px] sm:text-[10px] text-yellow-100/70 font-mono uppercase tracking-widest mt-1">
              C.C. Costa Granada • Puerto Ordaz
            </p>
          </div>
        </div>

        {/* Navigation Action Buttons */}
        <div className="flex items-center space-x-2 sm:space-x-4" id="header-actions">
          {/* Menu link */}
          <button
            onClick={() => setView('menu')}
            className="px-2.5 py-2 rounded-md text-xs sm:text-sm font-serif font-bold text-yellow-100 hover:text-yellow-300 hover:bg-white/5 transition-colors focus:outline-none flex items-center space-x-1"
          >
            <span>La Carta</span>
          </button>

          {/* Portal Cocina (Restaurant admin portal link) */}
          <button
            onClick={() => setView('admin')}
            className="px-2.5 py-2 rounded-md text-xs sm:text-sm font-serif font-bold text-yellow-400 hover:text-yellow-200 hover:bg-white/5 border border-yellow-405/20 transition-colors focus:outline-none flex items-center space-x-1"
            id="admin-portal-header-btn"
          >
            <span>Portal Cocina 🏮</span>
          </button>

          {/* AI Chef Assistant shortcut */}
          <button
            onClick={() => setView('chef')}
            className="px-3.5 py-2 rounded-md text-xs sm:text-sm font-serif font-extrabold bg-[#800C0D] hover:bg-[#9B1315] text-[#FCFAF3] border border-[#C5A033] hover:brightness-110 shadow-md transition-all duration-200 flex items-center space-x-2"
            id="chef-assistant-btn"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
            <span className="hidden xs:inline">Chef AI Chen</span>
            <span className="xs:hidden">Chef AI</span>
          </button>

          {/* Active Order Tracker */}
          {activeOrderId && (
            <button
              onClick={() => setView('tracker')}
              className="px-3 py-2 rounded-md text-xs sm:text-sm font-serif font-bold border-2 border-green-600 bg-green-950/40 text-green-300 hover:bg-green-900/30 transition-all flex items-center space-x-1.5"
              id="active-tracker-btn"
            >
              <div className="w-2 h-2 bg-green-400 rounded-full animate-ping" />
              <span>Sigue tu pedido</span>
            </button>
          )}

          {/* Shopping Bag Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 rounded-md hover:bg-white/10 transition-all text-yellow-400 focus:outline-none flex bg-white/5 border border-white/10"
            aria-label="Ver carrito de compras"
            id="cart-trigger-btn"
          >
            <ShoppingBag className="w-5.5 h-5.5 text-[#C5A033]" />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#800C0D] text-[#FCFAF3] font-sans font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#C5A033] shadow-md animate-bounce">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
