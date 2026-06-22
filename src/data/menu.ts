/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MenuItem, SectorInfo } from '../types';

export const CATEGORIES = [
  'Todos',
  'Entradas y Sopas',
  'Arroces Cantoneses',
  'Fideos y Tallarines',
  'Carnes y Pollos',
  'Pescados y Mariscos',
  'Combos Imperiales'
];

export const MENU_ITEMS: MenuItem[] = [
  // --- ENTRADAS ---
  {
    id: 'lumpia_tradicional',
    name: 'Lumpias Tradicionales (Par)',
    description: 'Dos rollos crujientes rellenos de vegetales frescos salteados y jamón ahumado picado finamente, fritos hasta obtener un dorado perfecto.',
    price: 4.50,
    category: 'Entradas y Sopas',
    image: 'https://images.unsplash.com/photo-1606755456206-b25206cde27e?w=800&auto=format&fit=crop&q=80',
    tags: ['Clásico', 'Crocante'],
    isAvailable: true
  },
  {
    id: 'lumpia_jamon_queso',
    name: 'Lumpias de Jamón y Queso (Par)',
    description: 'Dos rollos crujientes rellenos de jamón york y queso fundido premium, la fusión perfecta crujiente.',
    price: 5.00,
    category: 'Entradas y Sopas',
    image: 'https://images.unsplash.com/photo-1606755456206-b25206cde27e?w=800&auto=format&fit=crop&q=40',
    tags: ['Favorito niños'],
    isAvailable: true
  },
  {
    id: 'wanton_frito',
    name: 'Wanton Frito Tradicional',
    description: 'Fina masa crocante frita a la perfección, rellena con nuestro preparado selecto de camarones y tierno cerdo asado.',
    price: 5.50,
    category: 'Entradas y Sopas',
    image: 'https://images.unsplash.com/photo-1496116211227-7d3ccb8f45c8?w=800&auto=format&fit=crop&q=80',
    tags: ['Destacado', 'Crocante'],
    isAvailable: true
  },
  {
    id: 'costillas_cerdo_asadas',
    name: 'Costillas de Cerdo Asadas',
    description: 'Tiernas costillas de cerdo seleccionadas, asadas al horno con el toque secreto ahumado de la casa.',
    price: 13.00,
    category: 'Entradas y Sopas',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=40',
    tags: ['Tradicional'],
    isAvailable: true
  },
  {
    id: 'costillitas_agridulce',
    name: 'Costillitas Agridulce con Sésamo',
    description: 'Cubos de costillas de cerdo asadas y luego salteadas en nuestra icónica salsa agridulce imperial, espolvoreadas con semillas de sésamo/ajonjolí tostado.',
    price: 14.00,
    category: 'Entradas y Sopas',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
    tags: ['Recomendado'],
    isAvailable: true
  },

  // --- SOPAS ---
  {
    id: 'sopa_agripicante',
    name: 'Sopa Agripicante Imperial',
    description: 'Sopa espesa y tonificante con carne de res, cerdo, pollo, vegetales chinos seleccionados y tofu suave con un balanceado toque de picante y vinagre.',
    price: 5.00,
    category: 'Entradas y Sopas',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&auto=format&fit=crop&q=85',
    tags: ['Picante', 'Saludable'],
    spicyLevel: 1,
    isAvailable: true
  },
  {
    id: 'sopa_crema_maiz',
    name: 'Sopa Crema de Maíz con Pollo',
    description: 'Sopa cremosa y reconfortante de maíz dulce supremo combinada con finos hilos de pechuga de pollo y cebollín fresco picado.',
    price: 4.50,
    category: 'Entradas y Sopas',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&auto=format&fit=crop&q=40',
    tags: ['Reconfortante'],
    isAvailable: true
  },

  // --- ARROCES CANTONESES ---
  {
    id: 'arroz_cantones_clasico',
    name: 'Arroz Cantonés Tradicional',
    description: 'Arroz cantonés salteado al wok a alta temperatura con vegetales frescos, lechuga, tierno cerdo asado, camarones seleccionados, chorizo chino y cebollín.',
    price: 9.50,
    category: 'Arroces Cantoneses',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&auto=format&fit=crop&q=80',
    tags: ['Destacado', 'Principal'],
    isAvailable: true
  },
  {
    id: 'arroz_tipo_buda',
    name: 'Arroz Cantonés Tipo Buda (Vegetariano)',
    description: 'Arroz cantonés salteado exclusivamente con una variedad de vegetales chinos frescos del día y cebollín en soya ligera.',
    price: 7.50,
    category: 'Arroces Cantoneses',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&auto=format&fit=crop&q=40',
    tags: ['Vegetariano'],
    isAvailable: true
  },
  {
    id: 'arroz_3_sabores',
    name: 'Arroz Cantonés 3 Sabores',
    description: 'Sabor multifacético: salteado al wok con pollo marinado, trozos de cerdo asado char siu, jugoso lomito de res y cebollín picado.',
    price: 11.00,
    category: 'Arroces Cantoneses',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&auto=format&fit=crop&q=85',
    tags: ['Llenador'],
    isAvailable: true
  },
  {
    id: 'arroz_8_sabores',
    name: 'Arroz Cantonés Supremos 8 Sabores',
    description: 'El más completo de la casa. Mix premium de selectas carnes (pollo, res, cerdo, jamón), mariscos frescos, vegetales crujientes y cebollín.',
    price: 13.50,
    category: 'Arroces Cantoneses',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&auto=format&fit=crop&q=95',
    tags: ['Especialidad', 'Mar y Tierra'],
    isAvailable: true
  },
  {
    id: 'arroz_frito_especial',
    name: 'Arroz Frito Especial Palacio',
    description: 'Arroz frito tradicional cocido al wok con dados de jamón york, tierno pollo marinado, cerdo asado y un toque aromático de cebollín.',
    price: 10.00,
    category: 'Arroces Cantoneses',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&auto=format&fit=crop&q=65',
    tags: ['Popular'],
    isAvailable: true
  },

  // --- FIDEOS Y TALLARINES ---
  {
    id: 'fideos_arroz_cantones',
    name: 'Fideos de Arroz Cantoneses',
    description: 'Fideos de arroz delgados salteados con tierno pollo, camarones frescos y cebollín sobre un mezclum de salsas asiáticas artesanales.',
    price: 10.50,
    category: 'Fideos y Tallarines',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&auto=format&fit=crop&q=80',
    tags: ['Ligero'],
    isAvailable: true
  },
  {
    id: 'fideos_arroz_singapur',
    name: 'Fideos de Arroz Estilo Singapur',
    description: 'Delicados fideos de arroz salteados con cerdo asado, camarones y vegetales en salsa de curry imperial picante aromática.',
    price: 11.55,
    category: 'Fideos y Tallarines',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&auto=format&fit=crop&q=40',
    tags: ['Aromático', 'Picante'],
    spicyLevel: 1,
    isAvailable: true
  },
  {
    id: 'chow_mein_especial',
    name: 'Chow Mein Especial Palacio',
    description: 'Cama de tallarines extra delgados fritos súper crujientes, cubiertos con vegetales salteados, jamón, pollo y cerdo asado (estilo Chop Suey) en salsa de ostras.',
    price: 12.00,
    category: 'Fideos y Tallarines',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&auto=format&fit=crop&q=95',
    tags: ['Crocante'],
    isAvailable: true
  },
  {
    id: 'low_mein_3_sabores',
    name: 'Low Mein 3 Sabores Tradicional',
    description: 'Fideos de trigo suaves salteados con pollo, cerdo asado char siu, lomito de res y vegetales en una untuosa salsa de ostiones aromatizada.',
    price: 11.50,
    category: 'Fideos y Tallarines',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&auto=format&fit=crop&q=70',
    tags: ['Suave', 'Favorito'],
    isAvailable: true
  },

  // --- CARNES Y POLLOS ---
  {
    id: 'lomito_pimienta_negra',
    name: 'Lomito a la Pimienta Negra',
    description: 'Lomito de res de primera finamente picado, salteado al wok de alta potencia con vegetales frescos en una salsa untuosa de ostras y pimienta negra molida.',
    price: 14.50,
    category: 'Carnes y Pollos',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=50',
    tags: ['Sabroso'],
    isAvailable: true
  },
  {
    id: 'lomito_tausi',
    name: 'Lomito en Salsa Tausí',
    description: 'Finas lonjas de lomito salteadas con cebolla, pimentón dulce y jengibre en salsa tradicional china de frijoles negros fermentados (Tausí).',
    price: 14.00,
    category: 'Carnes y Pollos',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=55',
    tags: ['Gastronomía Tradicional'],
    isAvailable: true
  },
  {
    id: 'pollo_naranja_miel',
    name: 'Pollo Imperial Naranja y Miel',
    description: 'Dados de pechuga de pollo marinados de forma secreta, rebozados y bañados en una salsa cítrica y dulce a base de naranjas frescas y miel pura de abeja.',
    price: 11.50,
    category: 'Carnes y Pollos',
    image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&auto=format&fit=crop&q=80',
    tags: ['Dulce', 'Más pedido'],
    isAvailable: true
  },
  {
    id: 'pollo_miel_ajonjoli',
    name: 'Pollo rebozado Miel y Ajonjolí',
    description: 'Trozos crujientes de pollo rebozado y salteado al wok rápido con un glaseado meloso natural, cubierto enteramente con semillas de ajonjolí tostado.',
    price: 11.50,
    category: 'Carnes y Pollos',
    image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&auto=format&fit=crop&q=60',
    tags: ['Popular'],
    isAvailable: true
  },
  {
    id: 'costilla_sal_pimienta',
    name: 'Costillas de Cerdo Sal y Pimienta',
    description: 'La especialidad del chef de cerdo asado saltado en wok seco con pimentón fresco, cebolla en julianas, sal marina tostada y pimienta sichuanesa.',
    price: 14.50,
    category: 'Carnes y Pollos',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=90',
    tags: ['Clásico de Cantón'],
    isAvailable: true
  },

  // --- PESCADOS Y MARISCOS ---
  {
    id: 'camaron_millonario',
    name: 'Camarón Millonario en Salsa Blanca',
    description: 'Camarones gigantes seleccionados salteados al vapor en una cremosa salsa de vino blanco y ajo suave del palacio, servidos elegantemente sobre una cama dorada de fideos de arroz fritos crujientes.',
    price: 16.50,
    category: 'Pescados y Mariscos',
    image: 'https://images.unsplash.com/photo-1559737607-3f0e031c03e8?w=800&auto=format&fit=crop&q=80',
    tags: ['Destacado', 'Estrella Imperial'],
    isAvailable: true
  },
  {
    id: 'langostinos_ajo_dorado',
    name: 'Langostinos al Ajo Dorado',
    description: 'Langostinos frescos saltados al wok seco de alta potencia con láminas de ajo frito crujiente, cebollín y finos toques de vino de arroz Shaoxing.',
    price: 18.00,
    category: 'Pescados y Mariscos',
    image: 'https://images.unsplash.com/photo-1559737607-3f0e031c03e8?w=800&auto=format&fit=crop&q=40',
    tags: ['De Lujo'],
    isAvailable: true
  },
  {
    id: 'calamar_sal_pimienta',
    name: 'Calamar Sal y Pimienta',
    description: 'Anillos de calamar tiernos rebozados de forma ligera, fritos y salteados con ajo, pimiento rojo picado, sal marina y pimienta sichuanesa molida.',
    price: 13.50,
    category: 'Pescados y Mariscos',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&auto=format&fit=crop&q=80',
    tags: ['Crocante'],
    isAvailable: true
  },

  // --- COMBOS ---
  {
    id: 'combo_yuexiu_c1',
    name: 'Combo Yuexiu C1 (1 Persona)',
    description: '1/2 ración de Arroz Cantonés Especial, 1/2 ración de Chop Suey fresco, 1/2 ración de Lumpia Tradicional y 1/2 ración de Pan Chino artesanal.',
    price: 8.50,
    category: 'Combos Imperiales',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=80',
    tags: ['Personal', 'Económico'],
    isAvailable: true
  },
  {
    id: 'combo_baiyun_c2',
    name: 'Banquete Baiyun C2 (2 Personas)',
    description: '1 ración completa de Arroz Cantonés Especial, 1/2 ración de Chop Suey fresco, 1/2 ración de sabroso Pollo Agridulce, 1/2 ración de Lumpia Tradicional (1 und) y 1/2 ración de Pan Chino.',
    price: 16.00,
    category: 'Combos Imperiales',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&auto=format&fit=crop&q=80',
    tags: ['Pareja', 'Recomendado'],
    isAvailable: true
  },
  {
    id: 'combo_huadu_c3',
    name: 'Banquete Huadu C3 (3 Personas)',
    description: '2 porciones de Arroz Cantonés Especial, 1 ración completa de Chop Suey Especial, 1 ración completa de Pollo Agridulce imperial, 1 ración de Lumpias (2 unds) y 1 ración de Pan Chino caliente.',
    price: 26.50,
    category: 'Combos Imperiales',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=65',
    tags: ['Familia', 'Ahorro'],
    isAvailable: true
  },
  {
    id: 'combo_liwan_c4',
    name: 'Banquete Liwan C4 (4 Personas)',
    description: '2 porciones generosas de Arroz Cantonés Especial, 1 ración de Chop Suey Especial, 1 ración completa de Pollo Agridulce, 1 ración sabrosa de Lomito salteado con vegetal chino y 1 ración de Pan Chino.',
    price: 36.00,
    category: 'Combos Imperiales',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=55',
    tags: ['Banquete Imperial', 'Festín'],
    isAvailable: true
  }
];

export const SECTORS: SectorInfo[] = [
  {
    id: 'altavista',
    name: 'Alta Vista (Alta Vista Norte/Sur)',
    fee: 2.00,
    deliveryMinutes: 20,
    coords: { lat: 48, lng: 48 }
  },
  {
    id: 'losolivos',
    name: 'Los Olivos / Villa Asia / Toro Muerto',
    fee: 3.00,
    deliveryMinutes: 30,
    coords: { lat: 30, lng: 32 }
  },
  {
    id: 'costagranada',
    name: 'C.C. Costa Granada / Chilemex / Los Saltos',
    fee: 1.50, // Reduced as we are now in C.C. Costa Granada!
    deliveryMinutes: 15,
    coords: { lat: 68, lng: 38 }
  },
  {
    id: 'unare',
    name: 'Unare (Unare I, II, III / Las Garzas)',
    fee: 4.00,
    deliveryMinutes: 35,
    coords: { lat: 18, lng: 58 }
  },
  {
    id: 'centro',
    name: 'Centro de Puerto Ordaz / Castillito / El Roble',
    fee: 4.50,
    deliveryMinutes: 45,
    coords: { lat: 85, lng: 70 }
  }
];

export const MAP_CENTER_RESTAURANT = { lat: 68, lng: 38 }; // Shifted to Costa Granada region
