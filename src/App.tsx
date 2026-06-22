/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import MenuSection from './components/MenuSection';
import CartDrawer from './components/CartDrawer';
import CheckoutSection from './components/CheckoutSection';
import OrderTracker from './components/OrderTracker';
import ChefAssistant from './components/ChefAssistant';
import RestaurantPortal from './components/RestaurantPortal';
import { CartItem, MenuItem } from './types';
import { Sparkles, MessageCircle, Info } from 'lucide-react';

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [view, setView] = useState<'menu' | 'checkout' | 'tracker' | 'chef' | 'admin'>('menu');
  
  // Notification banner state
  const [notification, setNotification] = useState<string | null>(null);

  // Real-time Venezuelan Bolívar rate state
  const [exchangeRate, setExchangeRate] = useState<{ bcv: number; parallel: number; source: string; loading: boolean }>({
    bcv: 36.62,
    parallel: 42.15,
    source: 'offline',
    loading: true
  });

  // Fetch live exchange rate on load
  useEffect(() => {
    let active = true;
    fetch('/api/exchange-rate')
      .then(res => res.ok ? res.json() : Promise.reject('API failed'))
      .then(data => {
        if (active && data && data.bcv) {
          setExchangeRate({
            bcv: data.bcv,
            parallel: data.parallel || data.bcv,
            source: data.source || 'bcv-api',
            loading: false
          });
        }
      })
      .catch(err => {
        console.error('Failed to grab live exchange rates, falling back to cache:', err);
        if (active) {
          setExchangeRate(prev => ({ ...prev, loading: false }));
        }
      });
    return () => {
      active = false;
    };
  }, []);

  // Restore cart and active order on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('palacio_canton_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse saved cart');
      }
    }

    const savedOrderId = localStorage.getItem('palacio_canton_active_order_id');
    if (savedOrderId) {
      setActiveOrderId(savedOrderId);
      // Automatically show active order tracker
      setView('tracker');
    }
  }, []);

  // Save cart changes
  const saveCartToLocalStorage = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('palacio_canton_cart', JSON.stringify(newCart));
  };

  const handleAddToCart = (item: MenuItem, quantity: number, notes?: string) => {
    const existingIndex = cart.findIndex(c => c.menuItem.id === item.id && c.notes === notes);
    let newCart = [...cart];

    if (existingIndex > -1) {
      newCart[existingIndex].quantity += quantity;
    } else {
      newCart.push({
        menuItem: item,
        quantity,
        notes
      });
    }

    saveCartToLocalStorage(newCart);
    triggerNotification(`¡Se añadió ${item.name} (${quantity}) can la orden!`);
  };

  const handleDirectAddProduct = (item: MenuItem) => {
    handleAddToCart(item, 1, '');
    triggerNotification(`Agregado: ${item.name} a tu comensal.`);
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    const newCart = cart.map(item => {
      if (item.menuItem.id === itemId) {
        return { ...item, quantity };
      }
      return item;
    });
    saveCartToLocalStorage(newCart);
  };

  const handleRemoveItem = (itemId: string) => {
    const newCart = cart.filter(item => item.menuItem.id !== itemId);
    saveCartToLocalStorage(newCart);
    triggerNotification('Se eliminó el plato del carrito.');
  };

  const handleOrderPlaced = (order: any) => {
    setActiveOrderId(order.id);
    localStorage.setItem('palacio_canton_active_order_id', order.id);
    
    // Clear cart
    saveCartToLocalStorage([]);
    
    // Redirect to tracker
    setView('tracker');
    triggerNotification('¡Tu pedido ha sido enviado a la cocina imperial! 🏮');
  };

  const handleResetActiveOrder = () => {
    localStorage.removeItem('palacio_canton_active_order_id');
    setActiveOrderId(null);
    setView('menu');
  };

  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setView('checkout');
  };

  const totalItemCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  return (
    <div className="min-h-screen bg-[#110A0A] flex flex-col justify-between text-yellow-100/90 selection:bg-[#800C0D] selection:text-white" id="app-root">
      
      {/* Header and navbar */}
      <Header
        cart={cart}
        setIsCartOpen={setIsCartOpen}
        activeOrderId={activeOrderId}
        setView={setView}
        itemCount={totalItemCount}
        exchangeRate={exchangeRate}
      />

      {/* Floating dynamic toast notification */}
      {notification && (
        <div className="fixed bottom-6 left-6 z-50 bg-[#1A0E0E] border-2 border-[#C5A033] text-[#FCFAF3] font-sans font-semibold text-xs sm:text-sm px-4 py-3 rounded-sm shadow-2xl flex items-center space-x-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main viewport */}
      <main className="flex-1 w-full animate-fade-in" id="root-viewport">
        {view === 'menu' && (
          <div className="animate-fade-in">
            {/* Banner Hero of restaurant */}
            <div className="relative bg-gradient-to-b from-[#800C0D] to-[#4D0304] text-[#FCFAF3] py-14 px-4 shadow-2xl text-center border-b-4 border-[#C5A033] overflow-hidden" id="imperial-hero">
              {/* Decorative Chinese Key corner borders */}
              <div className="corner-ornament-tl" />
              <div className="corner-ornament-tr" />
              <div className="corner-ornament-bl" />
              <div className="corner-ornament-br" />

              {/* Faded background calligraphic watermark logs */}
              <div className="absolute inset-y-0 left-4 w-20 opacity-15 flex flex-col justify-around text-2xl font-calligraphy text-yellow-300 pointer-events-none select-none hidden md:flex">
                <span>宮</span><span>廷</span><span>御</span><span>膳</span>
              </div>
              <div className="absolute inset-y-0 right-4 w-20 opacity-15 flex flex-col justify-around text-2xl font-calligraphy text-yellow-300 pointer-events-none select-none hidden md:flex">
                <span>中</span><span>華</span><span>美</span><span>食</span>
              </div>

              <div className="max-w-4xl mx-auto space-y-5 relative z-10">
                <span className="text-[10px] sm:text-xs uppercase font-serif font-black tracking-[0.2em] text-[#C5A033] bg-[#150D0D]/85 border border-[#C5A033]/60 px-5 py-2 rounded-sm inline-flex items-center space-x-2 shadow-inner">
                  <span>🏮</span>
                  <span>Puerto Ordaz • C.C. Costa Granada</span>
                  <span>🏮</span>
                </span>
                
                <h1 className="text-4xl sm:text-6xl font-serif font-black tracking-widest text-[#FCFAF3] drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                  PALACIO CANTÓN
                </h1>
                
                {/* Traditional subtitle flanked by golden symbols */}
                <div className="flex items-center justify-center space-x-4">
                  <div className="h-[1px] w-8 sm:w-16 bg-gradient-to-r from-transparent to-[#C5A033]" />
                  <p className="font-calligraphy text-yellow-405 tracking-widest text-lg sm:text-xl">
                    傳統の中華料理 — Recetas Orientales del Wok al Plato
                  </p>
                  <div className="h-[1px] w-8 sm:w-16 bg-gradient-to-r from-[#C5A033] to-transparent" />
                </div>

                <p className="max-w-lg mx-auto text-yellow-100/90 text-xs sm:text-sm leading-relaxed font-sans font-light tracking-wide">
                  Experimenta el sublime arte gastronómico chino-cantonés en Guayana. Una sinfonía de fuego vivo, ingredientes seleccionados y sazón imperial preparada al instante.
                </p>

                <div className="pt-4 flex flex-col xs:flex-row items-center justify-center gap-4">
                  <button 
                    onClick={() => setView('chef')}
                    className="w-full xs:w-auto px-6 py-3 bg-[#C5A033] hover:bg-[#D4AF37] text-black font-serif font-extrabold rounded-none text-xs sm:text-sm uppercase tracking-widest shadow-lg shadow-[#C5A033]/25 hover:shadow-[#C5A033]/40 transition-all cursor-pointer flex items-center justify-center space-x-2.5 transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <Sparkles className="w-4 h-4 text-black animate-spin-slow" />
                    <span>CONSULTAR CON CHEF CHEN AI</span>
                  </button>
                  <a 
                    href="#menu-section"
                    className="w-full xs:w-auto px-6 py-3 bg-[#150D0D]/85 hover:bg-[#231717] border border-[#C5A033] text-[#C5A033] rounded-none text-xs sm:text-sm font-serif font-bold uppercase tracking-widest transition-all text-center flex items-center justify-center space-x-2 hover:text-[#FCFAF3] hover:border-[#FCFAF3]"
                  >
                    <span>EXPLORAR LA CARTA</span>
                    <span>🐉</span>
                  </a>
                </div>
              </div>
            </div>

            {/* General menu cards listings */}
            <MenuSection 
              onAddToCart={handleAddToCart} 
              onViewChef={() => setView('chef')} 
              exchangeRate={exchangeRate}
            />
          </div>
        )}

        {view === 'checkout' && (
          <div className="animate-fade-in">
            <CheckoutSection
              cart={cart}
              onBackToMenu={() => setView('menu')}
              onOrderPlaced={handleOrderPlaced}
              exchangeRate={exchangeRate}
            />
          </div>
        )}

        {view === 'tracker' && activeOrderId && (
          <div className="animate-fade-in relative">
            <OrderTracker
              orderId={activeOrderId}
              onBackToMenu={() => setView('menu')}
            />
          </div>
        )}

        {view === 'chef' && (
          <div className="animate-fade-in">
            <ChefAssistant onDirectAddProduct={handleDirectAddProduct} />
          </div>
        )}

        {view === 'admin' && (
          <div className="animate-fade-in">
            <RestaurantPortal
              onBackToMenu={() => setView('menu')}
              exchangeRate={exchangeRate}
            />
          </div>
        )}
      </main>

      {/* Slide-out Cart sidebar Overlay */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleProceedToCheckout}
        exchangeRate={exchangeRate}
      />

      {/* Aesthetic human-friendly subtle footer */}
      <footer className="bg-slate-900 text-white/50 border-t border-slate-800 text-xs py-8 px-4 font-sans mt-12" id="app-footer">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="font-serif font-bold text-yellow-500 hover:text-yellow-400 cursor-pointer text-sm" onClick={() => setView('menu')}>
              PALACIO CANTÓN PUERTO ORDAZ
            </p>
            <p className="mt-1 text-slate-500 font-mono text-[10px]">
              Especialistas en Comida China-Cantonesa Fusión • Centro Comercial Costa Granada, Puerto Ordaz, Venezuela
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-4 text-[11px] font-semibold text-slate-400">
            <button onClick={() => setView('menu')} className="hover:text-white transition-colors">Menú Online</button>
            <span>•</span>
            <button onClick={() => setView('chef')} className="hover:text-white transition-colors">Asistente AI Chef Chen</button>
            <span>•</span>
            <a href="https://www.instagram.com/palaciocantonpzo" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              Instagram Oficial
            </a>
          </div>

          <div className="text-center md:text-right">
            <p className="text-[10px] text-slate-500">
              © {new Date().getFullYear()} Palacio Cantón PZO. Todos los derechos imperiales reservados.
            </p>
            <p className="text-[9px] text-slate-600/80 mt-0.5">
              Precios expresados en USD referenciales para transacciones nacionales y Pago Móvil.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
