/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Search, Flame, Sparkles, Plus, Check, Scale, HelpCircle } from 'lucide-react';
import { MenuItem } from '../types';
import { MENU_ITEMS, CATEGORIES } from '../data/menu';

interface MenuSectionProps {
  onAddToCart: (item: MenuItem, quantity: number, notes?: string) => void;
  onViewChef: () => void;
  exchangeRate?: { bcv: number; parallel: number; source: string; loading: boolean };
}

export default function MenuSection({ onAddToCart, onViewChef, exchangeRate }: MenuSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [modalQuantity, setModalQuantity] = useState(1);
  const [modalNotes, setModalNotes] = useState('');
  const [addedMessageItemId, setAddedMessageItemId] = useState<string | null>(null);

  // Filter items based on category and search query
  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      const matchesCategory =
        selectedCategory === 'Todos' || item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleOpenModal = (item: MenuItem) => {
    setSelectedItem(item);
    setModalQuantity(1);
    setModalNotes('');
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  const handleConfirmAdd = () => {
    if (selectedItem) {
      onAddToCart(selectedItem, modalQuantity, modalNotes);
      triggerSuccessMessage(selectedItem.id);
      handleCloseModal();
    }
  };

  const handleDirectAdd = (e: React.MouseEvent, item: MenuItem) => {
    e.stopPropagation();
    onAddToCart(item, 1, '');
    triggerSuccessMessage(item.id);
  };

  const triggerSuccessMessage = (id: string) => {
    setAddedMessageItemId(id);
    setTimeout(() => {
      setAddedMessageItemId(null);
    }, 2000);
  };

  return (
    <section className="py-8 px-4 max-w-7xl mx-auto font-sans" id="menu-section">
      {/* Search and Hero Assistant Link - Styled as a Chinese Lacquered panel */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-[#150D0D] p-6 border-2 border-[#C5A033] shadow-xl relative rounded-none">
        <div className="corner-ornament-tl" />
        <div className="corner-ornament-tr" />
        <div className="corner-ornament-bl" />
        <div className="corner-ornament-br" />

        <div className="relative z-10">
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#FCFAF3] tracking-widest uppercase">
            NUESTRA CARTA IMPERIAL
          </h2>
          <p className="text-yellow-100/70 text-xs sm:text-sm mt-1.5 font-light">
            Especialidades milenarias cocinadas con fuego vivo al wok clásico, calientes al instante.
          </p>
        </div>

        {/* Search input bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:w-1/2 relative z-10">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A033]" />
            <input
              type="text"
              placeholder="Buscar arroz, lumpias, pollo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#251A1A] border border-[#C5A033]/30 text-yellow-100 rounded-none text-xs sm:text-sm focus:bg-[#322323] focus:outline-none focus:ring-1 focus:ring-[#C5A033] focus:border-[#C5A033] transition-all"
              id="menu-search-input"
            />
          </div>
          {/* Smart chef banner link */}
          <button
            onClick={onViewChef}
            className="px-4 py-2.5 bg-[#800C0D] hover:bg-[#9B1315] border border-[#C5A033] rounded-none text-xs sm:text-sm font-serif font-bold text-[#FCFAF3] flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md"
          >
            <Sparkles className="w-4 h-4 text-yellow-400 animate-spin-slow" />
            <span>PREGUNTAR A CHEF CHEN</span>
          </button>
        </div>
      </div>

      {/* Category Pills Navigation */}
      <div className="mb-8 overflow-x-auto scrollbar-none flex space-x-3 pb-2" id="category-pills">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-5 py-2.5 rounded-none text-xs sm:text-sm font-serif font-extrabold tracking-widest border transition-all duration-300 uppercase whitespace-nowrap cursor-pointer ${
              selectedCategory === category
                ? 'bg-[#800C0D] text-yellow-105 border-[#C5A033] shadow-[0_0_12px_rgba(197,160,51,0.3)]'
                : 'bg-[#150D0D] text-yellow-100/60 border-[#C5A033]/20 hover:text-[#FCFAF3] hover:border-[#C5A033] hover:bg-[#231717]'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Grid of Dishes */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8" id="menu-items-grid">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleOpenModal(item)}
              className="bg-[#150D0D] overflow-hidden border-2 border-[#C5A033]/20 hover:border-[#C5A033] shadow-lg hover:shadow-[0_0_20px_rgba(197,160,51,0.2)] hover:-translate-y-1 transform transition-all duration-300 cursor-pointer flex flex-col h-full group relative rounded-none"
              id={`dish-${item.id}`}
            >
              {/* Subtle inner traditional geometric corners on hover */}
              <div className="corner-ornament-tl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="corner-ornament-tr opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="corner-ornament-bl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="corner-ornament-br opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Product Image and badges */}
              <div className="relative h-48 sm:h-52 w-full bg-black/40 overflow-hidden border-b border-[#C5A033]/20">
                <img
                  src={item.image}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Floating tags */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 max-w-[85%]">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-[#800C0D] border border-[#C5A033] text-[#FCFAF3] text-[9px] font-bold px-2 py-0.5 rounded-none uppercase tracking-wider shadow-md animate-pulse"
                    >
                      {tag}
                    </span>
                  ))}
                  {item.spicyLevel && item.spicyLevel > 0 && (
                    <span className="bg-[#800C0D] border border-red-500 text-red-100 text-[9px] font-bold px-2 py-0.5 rounded-none flex items-center space-x-0.5 shadow-md">
                      <Flame className="w-3 h-3 fill-red-400 text-red-400" />
                      <span>PICANTE</span>
                    </span>
                  )}
                </div>

                {/* Subtle oriental Stamp on top-right of image */}
                <span className="absolute top-3 right-3 w-7 h-7 bg-[#800C0D]/90 border border-[#C5A033] rounded-sm flex items-center justify-center font-calligraphy text-xs text-yellow-300 shadow-md">
                  饌
                </span>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-serif font-bold text-base sm:text-lg text-[#FCFAF3] group-hover:text-yellow-350 transition-colors line-clamp-1 uppercase tracking-wider">
                      {item.name}
                    </h3>
                    <div className="flex flex-col items-end flex-shrink-0">
                      <span className="font-mono text-base sm:text-lg font-extrabold text-[#C5A033] leading-tight text-right w-full">
                        ${item.price.toFixed(2)}
                      </span>
                      {exchangeRate && (
                        <span className="font-mono text-[10px] font-bold text-yellow-100/50 leading-none mt-1 text-right w-full" title="Conversión a Tasa BCV">
                          {(item.price * exchangeRate.bcv).toFixed(2)} Bs
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-yellow-100/70 text-xs sm:text-sm mt-3 line-clamp-3 leading-relaxed font-sans font-light">
                    {item.description}
                  </p>
                </div>

                {/* Card Action footer */}
                <div className="mt-5 flex items-center justify-between border-t border-[#C5A033]/15 pt-4">
                  <span className="text-[9px] uppercase font-serif font-black tracking-widest text-[#C5A033]/70">
                    {item.category}
                  </span>
                  <button
                    onClick={(e) => handleDirectAdd(e, item)}
                    className={`px-4 py-2 rounded-none text-xs font-serif font-bold tracking-widest uppercase flex items-center space-x-1.5 transition-all shadow-md cursor-pointer ${
                      addedMessageItemId === item.id
                        ? 'bg-green-700 text-white border border-green-500'
                        : 'bg-[#800C0D] hover:bg-[#9B1315] hover:text-[#FCFAF3] text-[#FCFAF3] border border-[#C5A033]'
                    }`}
                  >
                    {addedMessageItemId === item.id ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Añadido</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5 text-[#C5A033]" />
                        <span>Añadir</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#150D0D] py-16 text-center border-2 border-[#C5A033]/20 shadow-md">
          <p className="text-yellow-100/40 font-medium">No se encontraron delicias con ese filtro.</p>
          <button
            onClick={() => {
              setSelectedCategory('Todos');
              setSearchQuery('');
            }}
            className="mt-4 px-5 py-2.5 bg-[#800C0D] hover:bg-[#9B1315] text-[#FCFAF3] border border-[#C5A033] text-xs font-serif font-bold tracking-widest uppercase"
          >
            Ver todos los platos
          </button>
        </div>
      )}

      {/* Dish Detailed Interactive Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in" id="dish-detail-modal">
          <div className="bg-[#150D0D] overflow-hidden shadow-2xl max-w-2xl w-full border-2 border-[#C5A033] flex flex-col md:flex-row relative rounded-none">
            <div className="corner-ornament-tl" />
            <div className="corner-ornament-tr" />
            <div className="corner-ornament-bl" />
            <div className="corner-ornament-br" />

            {/* Modal Exit Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 z-20 w-8 h-8 bg-[#800C0D] hover:bg-[#9B1315] text-[#FCFAF3] rounded-none flex items-center justify-center transition-all cursor-pointer border border-[#C5A033]"
              aria-label="Cerrar modal"
            >
              <Plus className="w-5 h-5 rotate-45" />
            </button>

            {/* Left Column: Image */}
            <div className="md:w-1/2 h-56 md:h-auto bg-black/40 relative border-r border-[#C5A033]/30">
              <img
                src={selectedItem.image}
                alt={selectedItem.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex flex-wrap gap-1.5 max-w-[85%]">
                {selectedItem.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-[#800C0D] border border-[#C5A033] text-[#FCFAF3] text-[9px] font-bold px-2 py-0.5 rounded-none uppercase tracking-wider shadow-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Column: Order Configuration */}
            <div className="md:w-1/2 p-6 flex flex-col justify-between silk-parchment text-stone-900 relative">
              <div>
                <span className="text-[10px] font-serif font-black tracking-widest text-[#800C0D] uppercase block">
                  {selectedItem.category}
                </span>
                <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#800C0D] mt-1.5 uppercase tracking-wide">
                  {selectedItem.name}
                </h3>
                <p className="text-stone-700 text-xs sm:text-sm mt-3 leading-relaxed font-sans font-light">
                  {selectedItem.description}
                </p>

                {/* Notes box */}
                <div className="mt-5">
                  <label className="block text-[10px] font-serif font-black uppercase tracking-wider text-[#800C0D] mb-1.5">
                    Instrucciones Especiales
                  </label>
                  <textarea
                    placeholder="Ej. Sin cebollín, salsa picante extra, cubiertos..."
                    value={modalNotes}
                    onChange={(e) => setModalNotes(e.target.value)}
                    className="w-full p-3 bg-white/70 border border-amber-800/20 text-stone-900 rounded-none text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#800C0D] focus:border-[#800C0D] transition-all resize-none h-18 font-sans placeholder-stone-400"
                  />
                </div>
              </div>

              {/* Quantity Selectors and Add Button */}
              <div className="mt-6 pt-4 border-t border-amber-900/10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs sm:text-sm font-serif font-black text-[#800C0D]">CANTIDAD</span>
                  <div className="flex items-center space-x-4 border border-amber-900/30 px-3 py-1 bg-white/80">
                    <button
                      onClick={() => setModalQuantity(q => Math.max(1, q - 1))}
                      disabled={modalQuantity === 1}
                      className="text-stone-600 hover:text-black hover:scale-110 disabled:opacity-30 font-black text-sm sm:text-base focus:outline-none px-1.5 transition-all"
                    >
                      -
                    </button>
                    <span className="font-mono font-bold text-stone-900 text-xs sm:text-sm">
                      {modalQuantity}
                    </span>
                    <button
                      onClick={() => setModalQuantity(q => q + 1)}
                      className="text-stone-600 hover:text-black hover:scale-110 font-black text-sm sm:text-base focus:outline-none px-1.5 transition-all"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[9px] text-stone-500 block font-serif font-bold">SUBTOTAL</span>
                    <div className="flex flex-col">
                      <span className="font-mono text-lg sm:text-xl font-black text-[#800C0D] leading-none">
                        ${(selectedItem.price * modalQuantity).toFixed(2)}
                      </span>
                      {exchangeRate && (
                        <span className="font-mono text-[10px] font-bold text-[#800C0D]/60 mt-1">
                          {((selectedItem.price * modalQuantity) * exchangeRate.bcv).toFixed(2)} Bs
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={handleConfirmAdd}
                    className="flex-1 bg-[#800C0D] hover:bg-[#9B1315] text-[#FCFAF3] font-serif font-extrabold py-3 rounded-none border border-[#C5A033] shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2 text-xs sm:text-sm tracking-wider uppercase hover:brightness-110"
                  >
                    <span>AGREGAR AL CARRITO</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </section>
  );
}
