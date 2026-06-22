/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Trash2, ArrowRight, MessageSquare, ShoppingCart } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (menuItemId: string, quantity: number) => void;
  onRemoveItem: (menuItemId: string) => void;
  onCheckout: () => void;
  exchangeRate?: { bcv: number; parallel: number; source: string; loading: boolean };
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  exchangeRate
}: CartDrawerProps) {
  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + (item.menuItem.price * item.quantity), 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans" id="cart-drawer-overlay">
      {/* Dark backdrop */}
      <div 
        className="absolute inset-0 bg-black/75 backdrop-blur-xs transition-opacity animate-fade-in" 
        onClick={onClose} 
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        {/* Cart panel */}
        <div className="w-screen max-w-md bg-[#150D0D] border-l-2 border-[#C5A033] shadow-2xl flex flex-col relative rounded-none animate-fade-in" id="cart-drawer-panel">
          {/* Decorative Corner Ornaments */}
          <div className="corner-ornament-tl" />
          <div className="corner-ornament-bl" />

          {/* Header */}
          <div className="px-5 py-4 border-b-2 border-[#C5A033] flex items-center justify-between bg-[#800C0D] text-white relative z-10">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🏮</span>
              <h2 className="text-base sm:text-lg font-serif font-black tracking-widest uppercase text-yellow-101">Tu Cesta Imperial</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 hover:bg-white/10 rounded-full text-white transition-colors cursor-pointer border border-[#C5A033]/20"
              aria-label="Cerrar carrito"
            >
              <X className="w-5.5 h-5.5 text-yellow-450" />
            </button>
          </div>

          {/* Cart Contents list wrapped in authentic Silk Parchment scroll backdrop */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 silk-parchment text-stone-905 relative z-10">
            {cart.length > 0 ? (
              cart.map((item) => (
                <div 
                  key={item.menuItem.id} 
                  className="flex items-stretch space-x-4 border-b border-amber-900/10 pb-4 last:border-0"
                  id={`cart-item-${item.menuItem.id}`}
                >
                  {/* Item Image */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-black/10 border border-amber-805/20 overflow-hidden flex-shrink-0 rounded-none">
                    <img 
                      src={item.menuItem.image} 
                      alt={item.menuItem.name} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover animate-fade-in" 
                    />
                  </div>

                  {/* Item details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-1">
                        <h4 className="font-serif font-bold text-[#800C0D] text-xs sm:text-sm line-clamp-1 uppercase tracking-wider">
                          {item.menuItem.name}
                        </h4>
                        <span className="font-mono text-xs sm:text-sm font-black text-[#800C0D] flex-shrink-0">
                          ${(item.menuItem.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                      
                      {/* Optional notes */}
                      {item.notes && (
                        <p className="text-stone-600 text-[10px] inline-flex items-center mt-1 bg-white/60 border border-amber-800/10 rounded-none px-1.5 py-0.5 max-w-full">
                          <MessageSquare className="w-3 h-3 mr-1 text-[#800C0D]" />
                          <span className="truncate">{item.notes}</span>
                        </p>
                      )}
                    </div>

                    {/* Quantity selectors & clear */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-3 border border-amber-950/30 rounded-none px-2 py-0.5 bg-white/70">
                        <button 
                          onClick={() => onUpdateQuantity(item.menuItem.id, Math.max(1, item.quantity - 1))}
                          className="text-stone-700 hover:text-black hover:scale-110 font-black text-xs sm:text-sm focus:outline-none px-1 transition-all"
                        >
                          -
                        </button>
                        <span className="font-mono font-bold text-stone-900 text-xs">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => onUpdateQuantity(item.menuItem.id, item.quantity + 1)}
                          className="text-stone-700 hover:text-black hover:scale-110 font-black text-xs sm:text-sm focus:outline-none px-1 transition-all"
                        >
                          +
                        </button>
                      </div>

                      <button 
                        onClick={() => onRemoveItem(item.menuItem.id)}
                        className="text-stone-400 hover:text-[#800C0D] transition-colors cursor-pointer p-1"
                        title="Eliminar plato"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <div className="w-16 h-16 bg-[#800C0D]/10 border border-[#800C0D]/20 flex items-center justify-center text-[#800C0D] mb-4 shadow-inner">
                  <ShoppingCart className="w-7 h-7" />
                </div>
                <p className="text-[#800C0D] font-serif font-black tracking-widest uppercase text-sm">Tu cesta esta vacía</p>
                <p className="text-stone-600 text-xs mt-1.5 font-light">¡Regálale a tu paladar nuestras deliciosas lumpias crujientes y arroces cantoneses tradicionales!</p>
                <button
                  onClick={onClose}
                  className="mt-6 px-5 py-2.5 border-2 border-[#800C0D] hover:bg-[#800C0D] text-[#800C0D] hover:text-[#FCFAF3] rounded-none text-xs font-serif font-bold tracking-widest uppercase transition-colors cursor-pointer"
                >
                  Volver a la carta
                </button>
              </div>
            )}
          </div>

          {/* Footer of cart */}
          {cart.length > 0 && (
            <div className="border-t-2 border-[#C5A033] p-5 bg-[#1E1212] text-yellow-101 relative z-10">
              <div className="flex justify-between items-end mb-4">
                <div className="flex flex-col">
                  <span className="text-xs font-serif font-black uppercase text-[#C5A033] tracking-wider">Subtotal del Banquete</span>
                  {exchangeRate && (
                    <span className="text-[10px] text-yellow-100/50 font-mono font-semibold mt-1">
                      Tasa Real-Time BCV: {exchangeRate.bcv.toFixed(2)} Bs
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-mono text-2xl font-black text-yellow-405 leading-none">
                    ${subtotal.toFixed(2)}
                  </span>
                  {exchangeRate && (
                    <span className="font-mono text-xs font-bold text-yellow-101/60 mt-1">
                      ≈ {(subtotal * exchangeRate.bcv).toFixed(2)} Bs
                    </span>
                  )}
                </div>
              </div>
              <p className="text-[10.5px] text-yellow-250/50 mb-4 italic font-light leading-snug">
                * Las tarifas y tiempos de entrega se calcularán al instante en el checkout según su sector en Guayana.
              </p>
              <button 
                onClick={onCheckout}
                className="w-full bg-[#800C0D] hover:bg-[#9B1315] border border-[#C5A033] text-[#FCFAF3] font-serif font-extrabold py-3.5 rounded-none shadow-md tracking-wider uppercase text-xs sm:text-sm cursor-pointer transition-all hover:brightness-110 flex items-center justify-center space-x-2"
                id="cart-checkout-btn"
              >
                <span>PROCEDER AL PAGO</span>
                <ArrowRight className="w-4 h-4 text-yellow-400" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
