/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { CreditCard, MapPin, Truck, Store, ArrowLeft, ShieldCheck, Landmark, Upload, Image as ImageIcon, Trash2 } from 'lucide-react';
import { CartItem, DeliveryType, PaymentMethod } from '../types';
import { SECTORS } from '../data/menu';

interface CheckoutSectionProps {
  cart: CartItem[];
  onBackToMenu: () => void;
  onOrderPlaced: (order: any) => void;
  exchangeRate?: { bcv: number; parallel: number; source: string; loading: boolean };
}

export default function CheckoutSection({
  cart,
  onBackToMenu,
  onOrderPlaced,
  exchangeRate
}: CheckoutSectionProps) {
  const currentRate = useMemo(() => {
    return exchangeRate ? exchangeRate.bcv : 45.20;
  }, [exchangeRate]);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('delivery');
  const [selectedSectorId, setSelectedSectorId] = useState(SECTORS[0].id);
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pagomovil');
  const [paymentDetails, setPaymentDetails] = useState('');
  const [paymentScreenshot, setPaymentScreenshot] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  const handleFileChange = (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setCheckoutError('Por favor selecciona una imagen válida (PNG, JPG, JPEG).');
      return;
    }
    // Limit to ~2MB just in case
    if (file.size > 2 * 1024 * 1024) {
      setCheckoutError('La imagen es demasiado pesada. El límite es de 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPaymentScreenshot(e.target.result as string);
        setCheckoutError('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const selectedSector = useMemo(() => {
    return SECTORS.find(s => s.id === selectedSectorId) || SECTORS[0];
  }, [selectedSectorId]);

  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + (item.menuItem.price * item.quantity), 0);
  }, [cart]);

  const deliveryFee = useMemo(() => {
    return deliveryType === 'delivery' ? selectedSector.fee : 0;
  }, [deliveryType, selectedSector]);

  const total = useMemo(() => {
    return subtotal + deliveryFee;
  }, [subtotal, deliveryFee]);

  const totalInBs = useMemo(() => {
    return total * currentRate;
  }, [total, currentRate]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError('');

    if (!customerName.trim()) {
      setCheckoutError('Por favor, ingresa tu nombre completo.');
      return;
    }
    if (!phone.trim()) {
      setCheckoutError('Por favor, ingresa tu número telefónico.');
      return;
    }
    if (deliveryType === 'delivery' && !address.trim()) {
      setCheckoutError('Por favor, ingresa tu dirección exacta de entrega en Puerto Ordaz.');
      return;
    }
    if ((paymentMethod === 'pagomovil' || paymentMethod === 'zelle') && !paymentDetails.trim()) {
      setCheckoutError('Por favor, introduce el código de referencia o comprobante de pago.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          phone,
          email,
          deliveryType,
          paymentMethod,
          paymentDetails,
          paymentScreenshot,
          sector: deliveryType === 'delivery' ? selectedSectorId : undefined,
          address: deliveryType === 'delivery' ? address : 'Retiro en restaurante Palacio Cantón Alta Vista',
          items: cart,
          subtotal,
          deliveryFee,
          total
        })
      });

      if (!response.ok) {
        throw new Error('Hubo un inconveniente en el servidor al enviar tu solicitud.');
      }

      const orderData = await response.json();
      onOrderPlaced(orderData);
    } catch (err: any) {
      console.error(err);
      setCheckoutError(err.message || 'Error de conexión. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-8 px-4 max-w-5xl mx-auto font-sans" id="checkout-section">
      {/* Return link */}
      <button
        onClick={onBackToMenu}
        className="mb-6 inline-flex items-center space-x-2 text-xs font-serif font-black uppercase text-yellow-101/70 hover:text-yellow-305 tracking-widest transition-colors focus:outline-none cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 text-[#C5A033]" />
        <span>Volver a la Carta Imperial</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form & settings */}
        <div className="lg:col-span-7 bg-[#150D0D] p-6 border-2 border-[#C5A033] shadow-xl relative rounded-none">
          {/* Decorative Corner Ornaments */}
          <div className="corner-ornament-tl" />
          <div className="corner-ornament-tr" />

          <h2 className="text-lg sm:text-xl font-serif font-black text-yellow-405 border-b border-[#C5A033]/20 pb-3 mb-6 uppercase tracking-widest">
            Detalles de Entrega & Pago
          </h2>

          <form onSubmit={handlePlaceOrder} className="space-y-6">
            
            {/* Delivery Type Selectors */}
            <div>
              <label className="block text-[10px] font-serif font-black uppercase tracking-widest text-[#C5A033] mb-2.5">
                Método de Obtención
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setDeliveryType('delivery')}
                  className={`p-4 rounded-none border-2 flex flex-col items-center justify-center transition-all cursor-pointer ${
                    deliveryType === 'delivery'
                      ? 'border-[#C5A033] bg-[#800C0D] text-yellow-300 font-serif font-bold'
                      : 'border-[#C5A033]/20 bg-[#1E1212] text-yellow-101/60 hover:bg-[#2D1B1B]'
                  }`}
                >
                  <Truck className="w-6 h-6 mb-2 text-[#C5A033]" />
                  <span className="text-xs sm:text-sm uppercase tracking-wider">Envío a Domicilio</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryType('pickup')}
                  className={`p-4 rounded-none border-2 flex flex-col items-center justify-center transition-all cursor-pointer ${
                    deliveryType === 'pickup'
                      ? 'border-[#C5A033] bg-[#800C0D] text-yellow-300 font-serif font-bold'
                      : 'border-[#C5A033]/20 bg-[#1E1212] text-yellow-101/60 hover:bg-[#2D1B1B]'
                  }`}
                >
                  <Store className="w-6 h-6 mb-2 text-[#C5A033]" />
                  <span className="text-xs sm:text-sm uppercase tracking-wider">Retiro en Local</span>
                </button>
              </div>
            </div>

            {/* Customer coordinates details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-serif font-black uppercase tracking-wider text-[#C5A033] mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Manuel Rodríguez"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#2D1B1B] border border-[#C5A033]/30 text-yellow-101 rounded-none text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#C5A033] transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-serif font-black uppercase tracking-wider text-[#C5A033] mb-1">
                  Teléfono de Contacto (WhatsApp) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Ej. 0414-8765432"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#2D1B1B] border border-[#C5A033]/30 text-yellow-101 rounded-none text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#C5A033] transition-all"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] font-serif font-black uppercase tracking-wider text-[#C5A033] mb-1">
                  Correo Electrónico (Opcional)
                </label>
                <input
                  type="email"
                  placeholder="Ej. manuel@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#2D1B1B] border border-[#C5A033]/30 text-yellow-101 rounded-none text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#C5A033] transition-all"
                />
              </div>
            </div>

            {/* Delivery address details (only if delivery) */}
            {deliveryType === 'delivery' && (
              <div className="space-y-4 border-t border-[#C5A033]/25 pt-4 animate-fade-in">
                <div>
                  <label className="block text-[10px] font-serif font-black uppercase tracking-wider text-[#C5A033] mb-1">
                    Sector de Envío en Puerto Ordaz *
                  </label>
                  <select
                    value={selectedSectorId}
                    onChange={(e) => setSelectedSectorId(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#2D1B1B] border border-[#C5A033]/30 text-yellow-101 rounded-none text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#C5A033] transition-all"
                  >
                    {SECTORS.map((sec) => (
                      <option key={sec.id} value={sec.id} className="bg-[#150D0D] text-yellow-101">
                        {sec.name} — ${sec.fee.toFixed(2)} ({sec.deliveryMinutes} min aprox)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-serif font-black uppercase tracking-wider text-[#C5A033] mb-1">
                    Dirección Exacta (Calle, Edificio/Casa, Punto de Referencia) *
                  </label>
                  <textarea
                    required
                    placeholder="Ej. Av. Las Américas, Residencias Las Garzas, Torre B, Apto 4-C, al lado del bodegón."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-4 bg-[#2D1B1B] border border-[#C5A033]/30 text-yellow-101 rounded-none text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#C5A033] transition-all resize-none h-20"
                  />
                  <span className="text-[10px] text-yellow-100/50 mt-1 block">
                    * Nuestro repartidor imperial se comunicará contigo al teléfono provisto al llegar a tu sector.
                  </span>
                </div>
              </div>
            )}

            {/* Payment Methods */}
            <div className="border-t border-[#C5A033]/25 pt-4">
              <label className="block text-[10px] font-serif font-black uppercase tracking-widest text-[#C5A033] mb-3">
                Método de Pago Seleccionado
              </label>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('pagomovil')}
                  className={`px-3 py-2.5 rounded-none border flex items-center space-x-2 text-xs font-semibold cursor-pointer transition-all ${
                    paymentMethod === 'pagomovil'
                      ? 'border-[#C5A033] bg-[#800C0D] text-yellow-300 font-serif font-bold scale-[1.01]'
                      : 'border-[#C5A033]/20 bg-[#231515] text-yellow-101/60 hover:bg-[#2D1B1B]'
                  }`}
                >
                  <Landmark className="w-4 h-4 text-yellow-405" />
                  <span>Pago Móvil</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('zelle')}
                  className={`px-3 py-2.5 rounded-none border flex items-center space-x-2 text-xs font-semibold cursor-pointer transition-all ${
                    paymentMethod === 'zelle'
                      ? 'border-[#C5A033] bg-[#800C0D] text-yellow-300 font-serif font-bold scale-[1.01]'
                      : 'border-[#C5A033]/20 bg-[#231515] text-yellow-101/60 hover:bg-[#2D1B1B]'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-[#C5A033]" />
                  <span>Zelle USD</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('efectivo')}
                  className={`px-3 py-2.5 rounded-none border flex items-center space-x-2 text-xs font-semibold cursor-pointer transition-all ${
                    paymentMethod === 'efectivo'
                      ? 'border-[#C5A033] bg-[#800C0D] text-yellow-300 font-serif font-bold scale-[1.01]'
                      : 'border-[#C5A033]/20 bg-[#231515] text-yellow-101/60 hover:bg-[#2D1B1B]'
                  }`}
                >
                  <Truck className="w-4 h-4 text-[#C5A033]" />
                  <span>Efectivo ($ / Bs)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`px-3 py-2.5 rounded-none border flex items-center space-x-2 text-xs font-semibold cursor-pointer transition-all ${
                    paymentMethod === 'paypal'
                      ? 'border-[#C5A033] bg-[#800C0D] text-yellow-300 font-serif font-bold scale-[1.01]'
                      : 'border-[#C5A033]/20 bg-[#231515] text-yellow-101/60 hover:bg-[#2D1B1B]'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-[#C5A033]" />
                  <span>PayPal</span>
                </button>
              </div>

              {/* Dynamic Credentials panel based on selected method */}
              <div className="bg-[#1E1212] p-4 rounded-none border border-[#C5A033]/25 text-xs sm:text-sm text-yellow-101 space-y-3">
                {paymentMethod === 'pagomovil' && (
                  <>
                    <h4 className="font-serif font-black text-[#C5A033] text-xs sm:text-sm pb-1 border-b border-[#C5A033]/15">
                      Datos para Pago Móvil (Banco Mercantil)
                    </h4>
                    <p className="flex justify-between text-yellow-101/90">
                      <span className="font-semibold">Banco:</span>
                      <span>Banco Mercantil (0105)</span>
                    </p>
                    <p className="flex justify-between text-yellow-101/90">
                      <span className="font-semibold">Teléfono:</span>
                      <span>0424-9123456</span>
                    </p>
                    <p className="flex justify-between text-yellow-101/90">
                      <span className="font-semibold">RIF:</span>
                      <span>J-40812345-0</span>
                    </p>
                    <p className="flex justify-between text-yellow-405 font-bold pt-1 border-t border-[#C5A033]/15">
                      <span>Tasa oficial Real-Time:</span>
                      <span>{currentRate.toFixed(2)} Bs / $</span>
                    </p>
                    <p className="flex justify-between text-yellow-500 font-extrabold text-sm border-t border-[#C5A033]/15 pt-1.5">
                      <span>Monto total a transferir:</span>
                      <span className="font-mono">{totalInBs.toFixed(2)} Bs</span>
                    </p>
                    <div className="pt-2">
                      <label className="block text-[10px] font-serif font-black uppercase tracking-wider text-[#C5A033] mb-1">
                        Código de Referencia (últimos 5 dígitos) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej. 78241"
                        value={paymentDetails}
                        onChange={(e) => setPaymentDetails(e.target.value)}
                        className="w-full px-3 py-2 bg-[#2D1B1B] border border-[#C5A033]/30 text-yellow-101 rounded-none text-sm focus:outline-none focus:ring-1 focus:ring-[#C5A033] mb-3"
                      />
                    </div>

                    <div className="pt-1">
                      <label className="block text-[10px] font-serif font-black uppercase tracking-wider text-[#C5A033] mb-1.5">
                        Capture de Confirmación (Opcional pero recomendado)
                      </label>
                      <div
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed p-4 text-center cursor-pointer transition-all ${
                          isDragActive
                            ? 'border-yellow-405 bg-yellow-950/20'
                            : paymentScreenshot
                            ? 'border-emerald-500 bg-emerald-950/10'
                            : 'border-[#C5A033]/30 bg-[#2D1B1B] hover:border-[#C5A033]/60'
                        }`}
                        onClick={() => {
                          const fileInput = document.getElementById('payment-screenshot-input');
                          if (fileInput) fileInput.click();
                        }}
                      >
                        <input
                          id="payment-screenshot-input"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleFileChange(e.target.files[0]);
                            }
                          }}
                        />

                        {paymentScreenshot ? (
                          <div className="flex flex-col items-center space-y-2" onClick={(e) => e.stopPropagation()}>
                            <div className="relative w-full max-w-[140px] h-20 border border-emerald-500 overflow-hidden bg-black/40">
                              <img
                                src={paymentScreenshot}
                                alt="Capture cargado"
                                className="w-full h-full object-contain"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <p className="text-[10px] text-emerald-400 font-serif uppercase tracking-widest font-black">
                              ✓ Screenshot Adjuntado
                            </p>
                            <button
                              type="button"
                              onClick={() => setPaymentScreenshot('')}
                              className="inline-flex items-center space-x-1 px-2 py-1 bg-red-950/50 hover:bg-red-900/65 border border-red-500/50 text-red-200 text-[9px] font-serif font-bold uppercase tracking-wider transition-all"
                            >
                              <Trash2 className="w-2.5 h-2.5" />
                              <span>Cambiar Imagen</span>
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center space-y-1 py-1.5 text-yellow-101/60">
                            <Upload className="w-5 h-5 text-[#C5A033]/80 animate-pulse" />
                            <p className="text-[11px] font-serif uppercase tracking-wider text-yellow-101/90 font-bold">
                              {isDragActive ? "Suelta la imagen aquí" : "Arrastra o haz clic para subir capture"}
                            </p>
                            <p className="text-[9px] text-[#C5A033]/50 uppercase tracking-widest">
                              Formatos: PNG, JPG, JPEG (Máx. 2MB)
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {paymentMethod === 'zelle' && (
                  <>
                    <h4 className="font-serif font-black text-[#C5A033] text-xs sm:text-sm pb-1 border-b border-[#C5A033]/15">
                      Datos para Transferencia Zelle
                    </h4>
                    <p className="flex justify-between">
                      <span className="font-semibold">Correo Electrónico:</span>
                      <span className="font-mono select-all text-yellow-300">pagos@palaciocantonpzo.com</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="font-semibold">Titular del Pago:</span>
                      <span>Representaciones Cantón, C.A.</span>
                    </p>
                    <div className="pt-2">
                      <label className="block text-[10px] font-serif font-black uppercase tracking-wider text-[#C5A033] mb-1">
                        Nombre del Titular de Zelle o Referencia *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej. Carlos Mendoza / Ref: Z9824"
                        value={paymentDetails}
                        onChange={(e) => setPaymentDetails(e.target.value)}
                        className="w-full px-3 py-2 bg-[#2D1B1B] border border-[#C5A033]/30 text-yellow-101 rounded-none text-sm focus:outline-none"
                      />
                    </div>
                  </>
                )}

                {paymentMethod === 'efectivo' && (
                  <p className="italic text-yellow-101/70 text-xs sm:text-sm leading-relaxed">
                    Cancela en efectivo en dólares (USD) o bolívares en físico al recibir en tu sector o retirar en el local de Alta Vista. Procura tener el monto exacto si es posible.
                  </p>
                )}

                {paymentMethod === 'paypal' && (
                  <>
                    <p className="flex justify-between border-b border-[#C5A033]/15 pb-1.5 mb-1.5">
                      <span className="font-semibold">Cuenta PayPal:</span>
                      <span className="font-mono text-yellow-300 select-all font-bold">paypal@palaciocantonpzo.com</span>
                    </p>
                    <p className="italic text-yellow-100/60 text-xs text-center leading-relaxed">
                      El sistema acreditará automáticamente la orden una vez enviada.
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Action Feedback alerts */}
            {checkoutError && (
              <div className="text-sm font-bold text-red-300 bg-red-955/40 border border-red-550/30 rounded-none p-3 font-serif">
                {checkoutError}
              </div>
            )}

            {/* Confirm CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#800C0D] hover:bg-[#9B1315] text-[#FCFAF3] border border-[#C5A033] font-serif font-extrabold py-3.5 rounded-none shadow-md tracking-widest uppercase transition-all cursor-pointer flex items-center justify-center space-x-1 hover:brightness-110"
              id="confirm-checkout-btn"
            >
              <span>{isSubmitting ? 'Procesando en Cocina...' : 'Confirmar Pedido Imperial'}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Order Summary side view */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#150D0D] border-2 border-[#C5A033] p-6 shadow-xl flex flex-col h-full justify-between rounded-none text-yellow-101 relative">
            <div className="corner-ornament-tl" />
            <div className="corner-ornament-tr" />
            <div>
              <h3 className="font-serif font-black text-yellow-405 border-b border-[#C5A033]/20 pb-2 mb-4 text-sm sm:text-base uppercase tracking-widest">
                Resumen de Compra
              </h3>

              {/* Items List in Summary */}
              <div className="space-y-4 max-h-76 overflow-y-auto mb-6 pr-1 scrollbar-thin">
                {cart.map((item) => (
                  <div key={item.menuItem.id} className="flex justify-between text-xs sm:text-sm" id={`summary-item-${item.menuItem.id}`}>
                    <div className="flex-1 pr-4">
                      <p className="font-bold font-serif uppercase tracking-wider text-yellow-101 text-[11px] sm:text-xs">
                        {item.menuItem.name} <span className="font-mono text-xs font-normal text-yellow-101/60">x{item.quantity}</span>
                      </p>
                      {item.notes && (
                        <p className="text-[10px] text-yellow-100/50 truncate italic">"{item.notes}"</p>
                      )}
                    </div>
                    <span className="font-mono font-bold text-[#C5A033]">
                      ${(item.menuItem.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Calculations Blocks */}
            <div className="border-t border-[#C5A033]/25 pt-4 space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between text-yellow-101/60">
                <span>Subtotal</span>
                <span className="font-mono">${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-yellow-101/60">
                <span>Costo del Delivery ({deliveryType === 'delivery' ? selectedSector.name.split(' ')[0] : 'Retiro en Local'})</span>
                <span className="font-mono">
                  {deliveryType === 'delivery' ? `$${deliveryFee.toFixed(2)}` : 'Gratis'}
                </span>
              </div>

              <div className="flex justify-between items-end border-t border-[#C5A033]/20 pt-3 text-yellow-101">
                <div>
                  <span className="font-bold block text-sm sm:text-base text-yellow-305 uppercase font-serif tracking-wider">Total de la Orden</span>
                  <span className="text-[10px] font-mono text-yellow-100/50">Tasa BCV {currentRate.toFixed(2)} Bs</span>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xl sm:text-2xl font-black text-yellow-405 block leading-tight">
                    ${total.toFixed(2)}
                  </span>
                  <span className="font-mono text-xs font-bold text-[#C5A033] block">
                    {totalInBs.toFixed(2)} Bs
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Secure transaction certificate banner */}
          <div className="p-4 bg-[#800C0D]/10 border border-[#C5A033]/30 flex items-center space-x-3 text-yellow-101/80 text-[11px] sm:text-xs">
            <ShieldCheck className="w-10 h-10 text-yellow-405 flex-shrink-0" />
            <p className="leading-relaxed font-sans font-medium">
              <strong className="text-yellow-405 font-serif uppercase tracking-wider block mb-0.5">Transacción Protegida</strong> Tu pedido se registra de forma directa en las cocinas del Palacio Cantón Alta Vista. Rastrea tu motorizado imperial al instante tras pulsar Confirmar.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
