/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Clock, Navigation, MapPin, Store, CheckCircle, RefreshCw, Flame, HelpCircle } from 'lucide-react';
import { Order } from '../types';

interface OrderTrackerProps {
  orderId: string;
  onBackToMenu: () => void;
}

export default function OrderTracker({ orderId, onBackToMenu }: OrderTrackerProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');
  const [isPolling, setIsPolling] = useState(true);

  // Poll order data every 4 seconds
  useEffect(() => {
    let active = true;

    async function fetchOrder() {
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        if (!response.ok) {
          throw new Error('No se pudo encontrar el pedido en Puerto Ordaz.');
        }
        const data = await response.json();
        if (active) {
          setOrder(data);
          setError('');
          // Stop polling if delivered
          if (data.status === 'delivered') {
            setIsPolling(false);
          }
        }
      } catch (err: any) {
        if (active) {
          setError(err.message || 'Error al obtener estado.');
        }
      }
    }

    fetchOrder(); // Initial fetch

    const interval = setInterval(() => {
      if (isPolling) fetchOrder();
    }, 1500);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [orderId, isPolling]);

  if (error) {
    return (
      <div className="py-12 px-4 max-w-xl mx-auto text-center font-sans" id="tracker-error">
        <div className="bg-red-50 p-6 rounded-2xl border border-red-200">
          <p className="text-red-700 font-bold">{error}</p>
          <button
            onClick={onBackToMenu}
            className="mt-4 px-4 py-2 bg-[#8C1A1A] text-white rounded-xl text-sm font-semibold hover:bg-red-850"
          >
            Regresar a la carta
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-24 text-center font-sans" id="tracker-loading">
        <RefreshCw className="w-10 h-10 text-[#8C1A1A] animate-spin mx-auto mb-4" />
        <p className="text-gray-500 font-semibold">Cargando mapa de Puerto Ordaz y enlace del motorizado...</p>
      </div>
    );
  }

  // Define steps for progress
  const getStepProgress = () => {
    switch (order.status) {
      case 'received': return 25;
      case 'preparing': return 50;
      case 'on_the_way': return 75;
      case 'delivered': return 100;
      default: return 25;
    }
  };

  const getStatusName = () => {
    switch (order.status) {
      case 'received': return 'Recibido en Cocina';
      case 'preparing': return 'Chef Chen Preparando';
      case 'on_the_way': return 'Repartidor en Camino';
      case 'delivered': return order.deliveryType === 'delivery' ? '¡Entregado con Éxito!' : '¡Listo para Retirar!';
      default: return 'Pedido Activo';
    }
  };

  const currentStepPercentage = getStepProgress();

  return (
    <div className="py-8 px-4 max-w-5xl mx-auto font-sans text-yellow-101" id="order-tracker-page">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <span className="text-[10px] uppercase font-serif bg-[#800C0D] text-yellow-300 border border-[#C5A033]/50 px-3 py-1.5 font-bold tracking-widest">
            Rastreador de Envío Imperial
          </span>
          <h2 className="text-xl sm:text-2xl font-serif font-black text-yellow-405 mt-2 flex items-center gap-2 uppercase tracking-widest">
            <span>Pedido: {order.id}</span>
            <span className="text-xs text-yellow-101/60 font-sans font-normal hidden xs:inline">({getStatusName()})</span>
          </h2>
        </div>

        {/* Action controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onBackToMenu}
            className="px-4 py-2 border-2 border-[#800C0D] text-yellow-301 hover:bg-[#800C0D] hover:text-[#FCFAF3] text-xs font-serif font-black tracking-widest uppercase transition-all cursor-pointer rounded-none bg-transparent"
          >
            Pedir Algo Más
          </button>
          
          {isPolling && (
            <span className="text-[10px] uppercase tracking-wider font-semibold text-yellow-101/60 flex items-center space-x-1.5 bg-[#1E1212] px-3 py-2 rounded-none border border-[#C5A033]/25">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#C5A033]" />
              <span>Conexión en Vivo</span>
            </span>
          )}
        </div>
      </div>

      {/* Grid of contents */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Progress status indicator & maps visualizer */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Progress Timeline bar */}
          <div className="bg-[#150D0D] p-6 border-2 border-[#C5A033] shadow-xl text-yellow-101 relative rounded-none">
            <div className="corner-ornament-tl" />
            <div className="corner-ornament-tr" />
            
            <div className="relative mb-6">
              {/* Ground bar */}
              <div className="absolute top-1/2 left-0 -translate-y-1/2 h-2 w-full bg-[#2D1B1B] rounded-none" />
              {/* Active highlights bar */}
              <div 
                className="absolute top-1/2 left-0 -translate-y-1/2 h-2 bg-[#800C0D] border-y border-[#C5A033]/30 rounded-none transition-all duration-1000"
                style={{ width: `${currentStepPercentage}%` }}
              />

              {/* Progress markers */}
              <div className="relative flex justify-between">
                {[
                  { value: 'received', title: 'Recibido', text: 'Confirmado' },
                  { value: 'preparing', title: 'En Wok', text: 'Cocinado' },
                  { value: 'on_the_way', title: 'Viajando', text: 'En camino' },
                  { value: 'delivered', title: 'A tu Mesa', text: 'Entregado' }
                ].map((s, i) => {
                  const stepDone = 
                    (s.value === 'received' && (order.status === 'received' || order.status === 'preparing' || order.status === 'on_the_way' || order.status === 'delivered')) ||
                    (s.value === 'preparing' && (order.status === 'preparing' || order.status === 'on_the_way' || order.status === 'delivered')) ||
                    (s.value === 'on_the_way' && (order.status === 'on_the_way' || order.status === 'delivered')) ||
                    (s.value === 'delivered' && order.status === 'delivered');

                  return (
                    <div key={s.value} className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-none border-2 flex items-center justify-center font-bold text-xs select-none ${
                        stepDone ? 'border-[#C5A033] text-yellow-300 bg-[#800C0D]' : 'border-zinc-800 bg-zinc-900 text-yellow-101/30'
                      }`}>
                        {i + 1}
                      </div>
                      <span className={`text-[10px] sm:text-xs font-serif font-bold uppercase tracking-wider mt-2.5 ${stepDone ? 'text-yellow-405' : 'text-yellow-101/30'}`}>
                        {s.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* General instructions countdown */}
            <div className="flex items-center space-x-3.5 bg-[#1E1212] border border-[#C5A033]/25 p-4 rounded-none text-xs sm:text-sm">
              <Clock className="w-5.5 h-5.5 text-yellow-405 flex-shrink-0 animate-pulse" />
              <div>
                <p className="font-serif font-black uppercase text-yellow-405 leading-none tracking-widest text-xs sm:text-sm">
                  {order.status === 'delivered' 
                    ? '¡Tu banquete ha llegado!' 
                    : `Llegada Estimada: ${order.estimatedDeliveryMinutes} minutos`}
                </p>
                <p className="text-yellow-101/60 text-[10.5px] sm:text-xs mt-1 leading-snug">
                  {order.deliveryType === 'pickup' 
                    ? 'Acércate para retirar tu pedido recién salido del brasero caliente en Palacio Cantón Alta Vista.'
                    : 'Estamos preparando y despachando tu pedido recién salido del wok con la mayor rapidez imperial.'}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Order summary log */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#150D0D] p-6 border-2 border-[#C5A033] shadow-xl text-yellow-101 rounded-none relative">
            <div className="corner-ornament-tl" />
            <div className="corner-ornament-tr" />
            <h3 className="font-serif font-black text-yellow-405 pb-2 border-b border-[#C5A033]/20 mb-4 text-xs sm:text-sm uppercase tracking-widest">
              Detalles del Pedido
            </h3>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex justify-between items-center pb-1">
                <span className="text-yellow-101/60 font-serif uppercase text-[10px] tracking-wider">Cliente</span>
                <span className="font-bold font-serif text-yellow-200 uppercase text-[11px] sm:text-xs">{order.customerName}</span>
              </div>
              <div className="flex justify-between items-center pb-1 border-t border-[#C5A033]/10">
                <span className="text-yellow-101/60 font-serif uppercase text-[10px] tracking-wider">Teléfono</span>
                <span className="font-mono font-bold text-yellow-205 text-xs">{order.phone}</span>
              </div>
              {order.sector && (
                <div className="flex justify-between items-center pb-1 border-t border-[#C5A033]/10">
                  <span className="text-yellow-101/60 font-serif uppercase text-[10px] tracking-wider">Zona de Envío</span>
                  <span className="font-bold text-yellow-200 font-serif text-[11px] uppercase tracking-wider">{order.sector}</span>
                </div>
              )}
              <div className="flex justify-between items-center pb-1 border-t border-[#C5A033]/10">
                <span className="text-yellow-101/60 font-serif uppercase text-[10px] tracking-wider">Obtención</span>
                <span className="font-serif font-black text-yellow-301 uppercase tracking-widest text-[10px]">
                  {order.deliveryType === 'delivery' ? 'A Domicilio' : 'Retiro en Local'}
                </span>
              </div>
              <div className="flex justify-between items-center pb-1 border-t border-[#C5A033]/10">
                <span className="text-yellow-101/60 font-serif uppercase text-[10px] tracking-wider">Método de Pago</span>
                <span className="font-serif font-bold text-yellow-200 uppercase tracking-widest text-[10px]">
                  {order.paymentMethod === 'pagomovil' ? 'Pago Móvil ($ / Bs)' : order.paymentMethod}
                </span>
              </div>

              {order.address && (
                <div className="pt-2 border-t border-[#C5A033]/15">
                  <span className="text-[#C5A033] font-serif text-[10px] uppercase block tracking-wider mb-1">Dirección de Entrega</span>
                  <p className="text-yellow-100/75 text-xs sm:text-sm leading-relaxed bg-[#1E1212] p-2.5 border border-[#C5A033]/20 max-h-24 overflow-y-auto rounded-none font-sans">
                    {order.address}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* List of items in tracker */}
          <div className="bg-[#150D0D] p-6 border-2 border-[#C5A033] shadow-xl text-yellow-101 rounded-none relative">
            <div className="corner-ornament-tl" />
            <div className="corner-ornament-tr" />
            <h3 className="font-serif font-black text-yellow-405 pb-2 border-b border-[#C5A033]/20 mb-4 text-xs sm:text-sm uppercase tracking-widest">
              Platos Comprados
            </h3>

            <div className="space-y-3">
              {order.items.map((it) => (
                <div key={it.menuItem.id} className="flex justify-between items-start text-xs sm:text-sm" id={`tracker-item-${it.menuItem.id}`}>
                  <div className="pr-4">
                    <p className="font-serif font-bold text-yellow-101 text-[11px] sm:text-xs uppercase tracking-wider">
                      {it.menuItem.name} <span className="font-mono text-xs text-yellow-101/50">x{it.quantity}</span>
                    </p>
                    {it.notes && (
                      <p className="text-[10px] text-yellow-100/50 italic mt-0.5">"{it.notes}"</p>
                    )}
                  </div>
                  <span className="font-mono font-bold text-yellow-405">
                    ${(it.menuItem.price * it.quantity).toFixed(2)}
                  </span>
                </div>
              ))}

              <div className="pt-3 border-t border-[#C5A033]/15 mt-4 space-y-1.5 text-xs sm:text-sm font-sans">
                <div className="flex justify-between text-yellow-101/60">
                  <span>Subtotal</span>
                  <span className="font-mono font-medium">${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-yellow-101/60">
                  <span>Delivery</span>
                  <span className="font-mono font-medium">${order.deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-end text-yellow-101 font-serif font-black text-sm pt-2.5 border-t border-[#C5A033]/15">
                  <span className="text-[#C5A033] uppercase font-black tracking-widest text-xs sm:text-sm">Monto Total</span>
                  <span className="font-mono text-lg text-yellow-405 font-black">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
