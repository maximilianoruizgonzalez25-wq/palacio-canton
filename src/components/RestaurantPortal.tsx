/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Store, User, Phone, MapPin, DollarSign, Clock, CheckCircle, 
  Flame, Navigation, RefreshCw, Eye, Search, AlertCircle, Play, Sparkles,
  ChevronRight
} from 'lucide-react';
import { Order, OrderStatus, Coordinates } from '../types';

interface RestaurantPortalProps {
  onBackToMenu: () => void;
  exchangeRate: { bcv: number; parallel: number };
}

export default function RestaurantPortal({ onBackToMenu, exchangeRate }: RestaurantPortalProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [expandedScreenshot, setExpandedScreenshot] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('active');
  const [error, setError] = useState('');
  // Lock code protection state
  const [pin, setPin] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(() => {
    return sessionStorage.getItem('canton_admin_unlocked') === 'true';
  });
  const [pinError, setPinError] = useState(false);

  // Poll orders list from server
  useEffect(() => {
    if (!isUnlocked) return;
    let active = true;

    async function loadOrders() {
      try {
        const res = await fetch('/api/orders');
        if (!res.ok) throw new Error('Error al cargar pedidos del servidor');
        const data = await res.json();
        if (active) {
          setOrders(data);
          setError('');
          setLoading(false);
          
          // Select first order by default if nothing selected yet and orders exist
          if (!selectedOrderId && data.length > 0) {
            setSelectedOrderId(data[0].id);
          }
        }
      } catch (err: any) {
        if (active) {
          setError(err.message || 'Error de conexión');
          setLoading(false);
        }
      }
    }

    loadOrders();
    const interval = setInterval(loadOrders, 1500);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [selectedOrderId]);

  // Get active selected order
  const selectedOrder = orders.find(o => o.id === selectedOrderId);

  // Change order status manually on server
  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('No se pudo actualizar el estado.');
      
      const updated = await res.json();
      
      // Update local state
      setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  // Filter and search
  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.phone.includes(searchQuery);

    const isDone = o.status === 'delivered';
    if (statusFilter === 'active') return matchesSearch && !isDone;
    if (statusFilter === 'completed') return matchesSearch && isDone;
    return matchesSearch;
  });

  if (!isUnlocked) {
    const correctPin = "1975";
    
    const handlePinSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (pin === correctPin) {
        setIsUnlocked(true);
        sessionStorage.setItem('canton_admin_unlocked', 'true');
        setPinError(false);
      } else {
        setPinError(true);
        setPin('');
      }
    };

    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-[#150D0D] border-4 border-[#C5A033] shadow-2xl relative text-yellow-101 font-sans rounded-none" id="canton-pin-restricted-workspace">
        <div className="corner-ornament-tl" />
        <div className="corner-ornament-tr" />
        <div className="corner-ornament-bl" />
        <div className="corner-ornament-br" />

        <div className="text-center mb-6">
          <span className="text-4xl text-yellow-500 block mb-2">🏮</span>
          <h2 className="text-xl font-serif font-black tracking-widest text-[#FCFAF3] uppercase">
            ACCESO RESTRINGIDO
          </h2>
          <p className="text-[#C5A033] font-serif text-[10px] tracking-wider uppercase font-black mt-1">
            SOLO CONSERJERÍA Y COCINA IMPERIAL
          </p>
          <div className="h-[1px] bg-[#C5A033]/30 w-1/2 mx-auto my-4" />
        </div>

        <form onSubmit={handlePinSubmit} className="space-y-4">
          <div className="text-center">
            <label className="block text-[10px] uppercase tracking-widest text-[#C5A033] mb-3.5 font-serif font-black">
              Introduce la Clave Imperial de Consola
            </label>
            <input
              type="password"
              maxLength={4}
              value={pin}
              autoFocus
              onChange={(e) => {
                setPin(e.target.value.replace(/[^0-9]/g, ''));
                setPinError(false);
              }}
              placeholder="••••"
              className="w-36 bg-[#110A0A] border-2 border-[#C5A033] text-center text-3xl font-mono tracking-[0.4em] py-3 text-yellow-450 focus:outline-none focus:ring-1 focus:ring-yellow-455 rounded-none placeholder-zinc-800"
            />
          </div>

          {pinError && (
            <p className="text-red-500 font-serif font-bold text-xs uppercase text-center tracking-wider animate-pulse pt-2">
              ❌ CLAVE IMPERIAL INCORRECTA
            </p>
          )}

          <div className="pt-4 flex flex-col gap-2">
            <button
              type="submit"
              className="w-full py-3.5 bg-[#800C0D] hover:bg-[#a61315] border-2 border-[#C5A033] text-[#FCFAF3] font-serif font-black text-xs uppercase tracking-widest transition-all cursor-pointer rounded-none"
            >
              🔑 AUTENTICAR PORTAL
            </button>
            <button
              type="button"
              onClick={onBackToMenu}
              className="w-full py-2.5 bg-transparent hover:bg-white/5 border border-yellow-101/20 text-yellow-101/60 text-xs font-serif uppercase tracking-widest transition-all cursor-pointer rounded-none"
            >
              ← Regresar a la Carta
            </button>
          </div>
        </form>

        <p className="text-[8px] text-[#C5A033]/40 text-center font-serif uppercase tracking-widest mt-6">
          SISTEMA DE DESPACHO PALACIO CANTÓN V1.2
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 font-sans" id="rest-portal-wrapper">
      
      {/* Page Title with Imperial decorations */}
      <div className="relative bg-[#150D0D] border-4 border-[#C5A033] p-6 mb-8 text-center text-yellow-101 relative">
        <div className="corner-ornament-tl" />
        <div className="corner-ornament-tr" />
        <div className="corner-ornament-bl" />
        <div className="corner-ornament-br" />

        <div className="flex flex-col items-center justify-center space-y-2">
          <span className="text-2xl sm:text-3xl text-yellow-500">🏮</span>
          <h1 className="text-2xl sm:text-4xl font-serif font-black tracking-widest text-[#FCFAF3] uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            Consola Operativa Imperial
          </h1>
          <p className="text-[#C5A033] font-serif uppercase text-[10px] tracking-[0.2em] font-black">
            DESPACHO, CARTA, COCINA Y SEGUIMIENTO LOCAL (PZO)
          </p>
          
          <button
            onClick={() => {
              setIsUnlocked(false);
              sessionStorage.removeItem('canton_admin_unlocked');
            }}
            className="mt-3 px-3 py-1 bg-[#800C0D] border border-[#C5A033]/60 hover:bg-[#a61315] hover:border-[#C5A033] text-yellow-250 text-[9px] font-serif font-bold uppercase tracking-widest transition-all cursor-pointer rounded-none"
          >
            🔒 Cerrar Sesión de Consola
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left column: Orders list */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Controls bar */}
          <div className="bg-[#150D0D] border-2 border-[#C5A033]/65 p-4 relative text-yellow-101">
            <div className="corner-ornament-tl" />
            
            <div className="flex flex-col space-y-3">
              <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-yellow-405 flex items-center gap-1.5 border-b border-[#C5A033]/25 pb-2">
                <Store className="w-4 h-4 text-[#C5A033]" />
                Filtros e ingresos
              </h3>
              
              {/* Search bar */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-yellow-101/40" />
                <input 
                  type="text" 
                  placeholder="Buscar por ID, Cliente o Teléfono..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#110A0A] border border-[#C5A033]/30 pl-9 pr-4 py-2 text-xs text-yellow-100 outline-none focus:border-[#C5A033] rounded-none font-sans"
                />
              </div>

              {/* Status tab selectors */}
              <div className="grid grid-cols-3 gap-2 text-[10px] font-serif font-semibold tracking-wider text-center uppercase">
                <button
                  onClick={() => setStatusFilter('active')}
                  className={`p-2 transition-all border cursor-pointer ${
                    statusFilter === 'active' 
                      ? 'bg-[#800C0D] border-[#C5A033] text-[#FCFAF3]' 
                      : 'bg-zinc-950 border-[#C5A033]/20 text-yellow-101/60 hover:text-yellow-100'
                  }`}
                >
                  Activos ({orders.filter(o => o.status !== 'delivered').length})
                </button>
                <button
                  onClick={() => setStatusFilter('completed')}
                  className={`p-2 transition-all border cursor-pointer ${
                    statusFilter === 'completed' 
                      ? 'bg-[#800C0D] border-[#C5A033] text-[#FCFAF3]' 
                      : 'bg-zinc-950 border-[#C5A033]/20 text-yellow-101/60 hover:text-yellow-100'
                  }`}
                >
                  Listos ({orders.filter(o => o.status === 'delivered').length})
                </button>
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`p-2 transition-all border cursor-pointer ${
                    statusFilter === 'all' 
                      ? 'bg-[#800C0D] border-[#C5A033] text-[#FCFAF3]' 
                      : 'bg-zinc-950 border-[#C5A033]/20 text-yellow-101/60 hover:text-yellow-100'
                  }`}
                >
                  Todos ({orders.length})
                </button>
              </div>
            </div>
          </div>

          {/* Orders list viewport */}
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1" id="orders-list-portal">
            {loading ? (
              <div className="bg-[#150D0D] text-center py-12 border-2 border-[#C5A033]/40">
                <RefreshCw className="w-8 h-8 text-[#C5A033] animate-spin mx-auto mb-2" />
                <p className="text-yellow-101/70 text-xs">Sincronizando órdenes imperiales...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="bg-[#150D0D] p-8 text-center border-2 border-[#C5A033]/40 text-yellow-101/60">
                <AlertCircle className="w-6 h-6 mx-auto text-yellow-500 mb-2" />
                <p className="text-xs">No hay pedidos disponibles bajo esta sección.</p>
              </div>
            ) : (
              filteredOrders.map(ord => {
                const isSelected = ord.id === selectedOrderId;
                const totalItemQty = ord.items.reduce((acc, it) => acc + it.quantity, 0);

                return (
                  <div
                    key={ord.id}
                    onClick={() => setSelectedOrderId(ord.id)}
                    className={`p-4 border-2 transition-all cursor-pointer text-yellow-101 relative rounded-none ${
                      isSelected 
                        ? 'bg-[#1E1212] border-[#C5A033] ring-1 ring-yellow-400/20' 
                        : 'bg-[#150D0D] border-[#C5A033]/15 hover:border-[#C5A033]/55'
                    }`}
                  >
                    {/* Visual status flag bar */}
                    <div className={`absolute top-0 bottom-0 left-0 w-1.5 ${
                      ord.status === 'received' ? 'bg-blue-600' :
                      ord.status === 'preparing' ? 'bg-amber-600' :
                      ord.status === 'on_the_way' ? 'bg-purple-600' : 'bg-emerald-600'
                    }`} />

                    <div className="pl-2">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-mono text-xs font-black text-yellow-405">{ord.id}</span>
                          <span className="text-[10px] ml-2 text-yellow-101/45 font-mono">
                            {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <span className={`text-[9px] uppercase font-serif font-black tracking-widest px-2 py-0.5 border ${
                          ord.status === 'received' ? 'border-blue-600/30 text-blue-400 bg-blue-950/20' :
                          ord.status === 'preparing' ? 'border-amber-500/30 text-amber-400 bg-amber-950/20 animate-pulse' :
                          ord.status === 'on_the_way' ? 'border-purple-500/30 text-purple-400 bg-purple-950/20' : 'border-emerald-500/30 text-emerald-400 bg-emerald-950/20'
                        }`}>
                          {ord.status === 'received' ? 'Recibido' :
                           ord.status === 'preparing' ? 'En Wok' :
                           ord.status === 'on_the_way' ? 'Viajando' : 'Entregado'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 text-xs gap-y-1 mb-2">
                        <div className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-yellow-101/50 flex-shrink-0" />
                          <span className="truncate font-semibold text-yellow-200">{ord.customerName}</span>
                        </div>
                        <div className="flex items-center justify-end gap-1.5 text-right font-serif font-black text-yellow-301">
                          <span>${ord.total.toFixed(2)}</span>
                        </div>
                      </div>

                      <p className="text-[10px] font-mono text-yellow-101/60 truncate">
                        {ord.deliveryType === 'delivery' ? `🛵 Delivery: ${ord.sector || 'PZO'}` : '🥡 Retirar en Local'}
                      </p>

                      <div className="mt-2.5 pt-2 border-t border-[#C5A033]/15 flex items-center justify-between text-[10px] text-yellow-101/50">
                        <span>{totalItemQty} platos comprados</span>
                        <span className="font-serif tracking-widest text-[#C5A033] flex items-center gap-1 uppercase">
                          Ver Detalles <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right column: Selected order workspace */}
        <div className="lg:col-span-7">
          {selectedOrder ? (
            <div className="space-y-6" id="selected-order-workspace">
              
              {/* Order sheet detail */}
              <div className="bg-[#150D0D] border-2 border-[#C5A033] p-6 relative text-yellow-101">
                <div className="corner-ornament-tr" />
                <div className="corner-ornament-bl" />
                
                <div className="border-b border-[#C5A033]/25 pb-4 mb-4 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-yellow-101/40 font-mono uppercase">Expediente de Cocina</p>
                    <h2 className="text-lg font-serif font-black text-[#FCFAF3]">Pedido {selectedOrder.id}</h2>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-[#C5A033] font-serif uppercase tracking-widest leading-none font-bold">Total imperial</p>
                    <p className="text-xl font-mono font-black text-yellow-405 mt-1">${selectedOrder.total.toFixed(2)}</p>
                    <p className="text-[10px] text-yellow-101/50 font-mono mt-0.5">
                      ≈ Bs {(selectedOrder.total * exchangeRate.parallel).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mb-4 p-3.5 bg-[#1E1212] border border-[#C5A033]/10">
                  <div className="space-y-2">
                    <p className="flex items-center gap-2">
                      <User className="w-4 h-4 text-[#C5A033]" />
                      <span>Comensal: <strong className="text-yellow-100">{selectedOrder.customerName}</strong></span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#C5A033]" />
                      <span>Teléfono: <strong className="text-yellow-100 font-mono">{selectedOrder.phone}</strong></span>
                    </p>
                    {selectedOrder.email && (
                      <p className="text-yellow-101/70 pl-6">E-mail: {selectedOrder.email}</p>
                    )}
                    <div className="pl-6 pt-1">
                      <a 
                        href={`https://wa.me/${selectedOrder.phone.replace(/[^0-9]/g, '')}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-900 border border-green-600 hover:bg-green-800 text-[#FCFAF3] text-[10px] font-bold uppercase tracking-wider rounded-none cursor-pointer"
                      >
                        📱 Abrir Whatsapp
                      </a>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#C5A033]" />
                      <span className="uppercase font-serif font-bold text-[10.5px]">
                        {selectedOrder.deliveryType === 'delivery' ? `Delivery (${selectedOrder.sector})` : 'Retiro en Local Imperial'}
                      </span>
                    </p>
                    {selectedOrder.deliveryType === 'delivery' && (
                      <p className="text-yellow-101/85 pl-6 leading-relaxed bg-zinc-950/20 p-2 border border-[#C5A033]/5 font-sans whitespace-pre-line text-[11px] max-h-16 overflow-y-auto">
                        <strong>Dirección:</strong> {selectedOrder.address}
                      </p>
                    )}
                    <p className="flex items-center gap-1.5 pl-6">
                      <DollarSign className="w-4 h-4 text-emerald-500" />
                      <span>Pago: <strong className="uppercase text-yellow-100">{selectedOrder.paymentMethod === 'pagomovil' ? 'Pago Móvil ($ / Bs)' : selectedOrder.paymentMethod}</strong></span>
                    </p>
                    {selectedOrder.paymentDetails && (
                      <p className="text-[11px] text-yellow-101/60 pl-6 break-all">Ref: <strong>{selectedOrder.paymentDetails}</strong></p>
                    )}
                    {selectedOrder.paymentScreenshot && (
                      <div className="pl-6 pt-2">
                        <p className="text-[10px] text-[#C5A033] font-serif uppercase tracking-wider font-extrabold mb-1">
                          📸 Capture Adjunto:
                        </p>
                        <div 
                          onClick={() => setExpandedScreenshot(selectedOrder.paymentScreenshot || null)}
                          className="relative w-28 h-20 border border-[#C5A033]/30 hover:border-[#C5A033]/70 transition-all cursor-zoom-in bg-black/40 overflow-hidden flex items-center justify-center group"
                        >
                          <img 
                            src={selectedOrder.paymentScreenshot} 
                            alt="Capture de pago" 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] text-[#FCFAF3] font-sans font-bold transition-opacity">
                            Ampliar 🔍
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Items in order */}
                <div className="space-y-2 mb-6">
                  <h4 className="font-serif font-black uppercase text-[10.5px] tracking-wider text-[#C5A033] border-b border-[#C5A033]/15 pb-1">
                    Platos seleccionados
                  </h4>
                  <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                    {selectedOrder.items.map((it) => (
                      <div key={it.menuItem.id} className="flex justify-between items-start text-xs border-b border-[#C5A033]/5 pb-1 select-all hover:bg-zinc-950/30">
                        <div className="pr-4">
                          <p className="font-serif font-bold text-[#FCFAF3] uppercase text-[11px] tracking-wide">
                            {it.menuItem.name} <span className="font-mono text-xs text-yellow-405">x{it.quantity}</span>
                          </p>
                          {it.notes && (
                            <p className="text-[10.5px] text-yellow-100/50 italic mt-0.5">Nota: "{it.notes}"</p>
                          )}
                        </div>
                        <span className="font-mono font-bold text-yellow-405">${(it.menuItem.price * it.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* STEP CONTROLS (THE CORE POWER) */}
                <div className="space-y-3.5 border-t border-[#C5A033]/25 pt-4">
                  <h4 className="font-serif font-black uppercase text-[10.5px] tracking-wider text-[#C5A033]">
                    Controles del Estado del Banquete (Wok & Despacho)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-serif font-bold uppercase tracking-widest text-center">
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'received')}
                      className={`p-2.5 border transition-all cursor-pointer ${
                        selectedOrder.status === 'received'
                          ? 'bg-[#800C0D] border-yellow-500 text-yellow-150 font-black'
                          : 'bg-zinc-950 border-[#C5A033]/25 text-yellow-101/50 hover:bg-zinc-900'
                      }`}
                    >
                      🏮 Recibido
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'preparing')}
                      className={`p-2.5 border transition-all cursor-pointer ${
                        selectedOrder.status === 'preparing'
                          ? 'bg-amber-800 border-amber-500 text-white font-black'
                          : 'bg-zinc-950 border-[#C5A033]/25 text-yellow-101/50 hover:bg-zinc-900'
                      }`}
                    >
                      🔥 En Wok
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'on_the_way')}
                      className={`p-2.5 border transition-all cursor-pointer ${
                        selectedOrder.status === 'on_the_way'
                          ? 'bg-purple-900 border-purple-500 text-white font-black'
                          : 'bg-zinc-950 border-[#C5A033]/25 text-yellow-101/50 hover:bg-zinc-900'
                      }`}
                    >
                      🛵 Viajando
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'delivered')}
                      className={`p-2.5 border transition-all cursor-pointer ${
                        selectedOrder.status === 'delivered'
                          ? 'bg-emerald-800 border-emerald-500 text-white font-black'
                          : 'bg-zinc-950 border-[#C5A033]/25 text-yellow-101/50 hover:bg-zinc-900'
                      }`}
                    >
                      ✅ Entregado
                    </button>
                  </div>
                </div>

              </div>



            </div>
          ) : (
            <div className="bg-[#150D0D] border-2 border-[#C5A033]/40 p-12 text-center text-yellow-101/60 flex flex-col justify-center items-center h-full min-h-[400px]">
              <AlertCircle className="w-8 h-8 text-yellow-500 mb-3" />
              <p className="font-serif uppercase tracking-widest text-xs font-black">Ningún pedido seleccionado</p>
              <p className="text-xs text-yellow-101/50 max-w-xs mt-1 leading-relaxed">
                Selecciona una orden de la lista de pendientes a la izquierda para visualizar el expediente de cocina y despachar.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Regresar a la carta button */}
      <div className="mt-12 flex justify-center">
        <button
          onClick={onBackToMenu}
          className="px-8 py-3.5 bg-[#150D0D] hover:bg-[#231717] border-2 border-[#C5A033] text-[#C5A033] hover:text-[#FCFAF3] font-serif font-bold rounded-none text-xs sm:text-sm uppercase tracking-widest transition-all cursor-pointer shadow-lg"
        >
          ← REGRESAR A LA CARTA IMPERIAL
        </button>
      </div>

      {/* Lightbox / Zoom modal for Payment Screenshot */}
      {expandedScreenshot && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex flex-col justify-center items-center p-4 sm:p-8"
          onClick={() => setExpandedScreenshot(null)}
        >
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
            <button 
              onClick={() => setExpandedScreenshot(null)}
              className="text-[#FCFAF3] hover:text-[#C5A033] text-xs uppercase tracking-widest font-serif font-black bg-[#150D0D] border border-[#C5A033] px-4 py-2 cursor-pointer rounded-none"
            >
              Cerrar ✕
            </button>
          </div>
          <div 
            className="max-w-4xl max-h-[80vh] border-2 border-[#C5A033] bg-[#150D0D]/95 p-2 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={expandedScreenshot} 
              alt="Capture de pago móvil" 
              className="max-w-full max-h-[75vh] object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <p className="text-[10px] text-yellow-101/60 font-serif uppercase tracking-widest mt-4">
            Haz clic fuera de la imagen o en Cerrar para regresar al panel
          </p>
        </div>
      )}

    </div>
  );
}
