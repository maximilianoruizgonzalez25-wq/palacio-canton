/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { Order, OrderStatus, Coordinates, ChatMessage } from './src/types';
import { MENU_ITEMS, SECTORS } from './src/data/menu';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK lazily
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is not set. Chat assistant will run with simulated answers.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "FAKE_KEY",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// In-memory order database
const ordersDb = new Map<string, Order>();

// Fetch the order from the in-memory database directly
function getSimulatedOrder(id: string): Order | undefined {
  return ordersDb.get(id);
}

// REST API: Get all active/completed orders (for restaurant admin portal)
app.get('/api/orders', (req, res) => {
  const list: Order[] = [];
  for (const id of ordersDb.keys()) {
    const sim = getSimulatedOrder(id);
    if (sim) {
      list.push(sim);
    }
  }
  // Sort by creation time (newest first)
  list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json(list);
});

// REST API: Get a specific order
app.get('/api/orders/:id', (req, res) => {
  const orderId = req.params.id;
  const simulated = getSimulatedOrder(orderId);
  if (!simulated) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json(simulated);
});

// REST API: Update order status manually (takes manual control from simulator)
app.post('/api/orders/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, driverCoords, estimatedDeliveryMinutes } = req.body;

  const order = ordersDb.get(id);
  if (!order) {
    return res.status(404).json({ error: 'Pedido no encontrado' });
  }

  order.status = status;
  order.isSimulated = false; // Disable simulator

  if (driverCoords) {
    order.driverCoords = driverCoords;
  } else {
    // Set appropriate coordinate states for driver based on phase
    if (status === 'received' || status === 'preparing') {
      order.driverCoords = { ...order.restaurantCoords };
    } else if (status === 'delivered' && order.deliveryCoords) {
      order.driverCoords = { ...order.deliveryCoords };
    }
  }

  if (estimatedDeliveryMinutes !== undefined) {
    order.estimatedDeliveryMinutes = estimatedDeliveryMinutes;
  }

  ordersDb.set(id, order);
  res.json(order);
});

// REST API: Update driver coordinates manually (for live tracking/moving courier)
app.post('/api/orders/:id/coords', (req, res) => {
  const { id } = req.params;
  const { lat, lng } = req.body;

  const order = ordersDb.get(id);
  if (!order) {
    return res.status(404).json({ error: 'Pedido no encontrado' });
  }

  order.isSimulated = false; // Disable simulator
  order.driverCoords = { lat, lng };

  ordersDb.set(id, order);
  res.json(order);
});

// REST API: Place a new order
app.post('/api/orders', (req, res) => {
  const { customerName, phone, email, deliveryType, paymentMethod, paymentDetails, paymentScreenshot, sector: sectorId, address, items, subtotal, deliveryFee, total } = req.body;

  if (!customerName || !phone || !items || !items.length) {
    return res.status(400).json({ error: 'Faltan datos requeridos para procesar el pedido.' });
  }

  const orderId = 'PC-' + Math.floor(1000 + Math.random() * 9000);
  const selectedSector = SECTORS.find(s => s.id === sectorId);

  const newOrder: Order = {
    id: orderId,
    customerName,
    phone,
    email: email || '',
    deliveryType,
    paymentMethod,
    paymentDetails: paymentDetails || '',
    paymentScreenshot: paymentScreenshot || undefined,
    sector: selectedSector ? selectedSector.name : undefined,
    address: address || '',
    items,
    subtotal,
    deliveryFee: deliveryFee || 0,
    total,
    status: 'received',
    createdAt: new Date().toISOString(),
    estimatedDeliveryMinutes: selectedSector ? selectedSector.deliveryMinutes : 20,
    restaurantCoords: { lat: 50, lng: 50 },
    deliveryCoords: selectedSector ? selectedSector.coords : undefined,
    driverCoords: deliveryType === 'delivery' ? { lat: 50, lng: 50 } : undefined
  };

  ordersDb.set(orderId, newOrder);
  res.status(201).json(newOrder);
});

// AI API: Conversational chat assistant
app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;
  if (!messages || !messages.length) {
    return res.status(400).json({ error: 'Messages are required' });
  }

  const promptMessage = messages[messages.length - 1];
  const userText = promptMessage.text;

  // Build local menu details for context
  const menuContext = MENU_ITEMS.map(item => {
    return `- ID: "${item.id}" | Nombre: "${item.name}" | Descripción: "${item.description}" | Precio: $${item.price.toFixed(2)} | Categoría: "${item.category}" | Tags: ${item.tags.join(', ')}`;
  }).join('\n');

  const sectorContext = SECTORS.map(s => {
    return `- Sector: "${s.name}" | Costo de Delivery: $${s.fee.toFixed(2)} | Tiempo: ${s.deliveryMinutes} min`;
  }).join('\n');

  const systemPrompt = `Eres "Chen", el amigable Chef y sommelier virtual del restaurante de comida china-cantonesa más lujoso y querido de Puerto Ordaz, Venezuela: "Palacio Cantón PZO" (ubicado en C.C. Costa Granada).
Tu objetivo es guiar, asesorar y mimar a los clientes en su selección de comida, recomendando platos auténticos y combos.

Información útil sobre Palacio Cantón PZO:
- Ubicación exacta: C.C. Costa Granada, Puerto Ordaz, Bolívar.
- Teléfono/WhatsApp de atención directa: 0414-7712545 (puedes sugerirles contactar si tienen dudas especiales).
- Horarios reales: Lunes a sábados de 11:30 AM a 10:00 PM, y Domingos de 11:30 AM a 9:00 PM.

Aquí tienes el menú oficial disponible en tiempo real:
${menuContext}

Zonas de delivery y tarifas en Puerto Ordaz:
${sectorContext}

REGLAS DE INTERACCIÓN:
1. Responde de manera sumamente elegante, cortés, amigable y con toques de hospitalidad china ("Estimado comensal", "¡Un saludo imperial!", etc.), pero mantén un tono moderno.
2. Siempre que el cliente te pida recomendaciones basándose en cuántas personas van a comer, sugiéreles directamente el combo ideal (por ejemplo: "Combo Yuexiu C1" para 1 persona, "Banquete Baiyun C2" para 2 personas, "Banquete Huadu C3" para 3 personas, o "Banquete Liwan C4" para 4 personas).
3. Si te preguntan sobre ingredientes de platos, explícales con pasión (la cocción al wok, el toque de ajo dorado de la casa, el crujiente perfecto de las lumpias o el majestuoso sabor de Camarón Millonario).
4. El pago se puede hacer en Pago Móvil, Zelle o Efectivo en divisas.
5. CRUCIAL: Identifica de qué platos de los que estás hablando en tu respuesta. Si al usuario podría interesarle ordenar alguno de los platos mencionados, debes incluir las claves ID de dichos platos al FINAL absoluto de tu mensaje, formateados EXACTAMENTE en una línea independiente que empiece con "RECOMENDACION_IDS:" seguido por los IDs de los platos separados por comas. Por ejemplo:
RECOMENDACION_IDS: arroz_cantones_clasico, wanton_frito, camaron_millonario

No agregues ninguna otra palabra en esa última línea de IDs. Esto permite al software agregar un botón de "Añadir al carrito" directamente para esos platos de forma mágica. ¡Asegúrate de colocar los IDs correctos que coincidan con la lista de arriba!

Responde siempre en español fluido.`;

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Return simulated responses if no API key is specified, so that the app functions regardless
      let simulatedReply = "¡Un saludo imperial, estimado comensal! Soy el Chef Chen. Disculpa, mi conexión sagrada está en descanso en el palacio (sin API key), pero déjame sugerirte nuestro plato estelar: el espectacular Arroz Cantonés Tradicional ($9.50) y nuestro riquísimo Wanton Frito Tradicional ($5.50). ¿Te gustaría que agregue estos platos a tu orden?\n\nRECOMENDACION_IDS: arroz_cantones_clasico, wanton_frito";
      
      const lowerText = userText.toLowerCase();
      if (lowerText.includes('camaron') || lowerText.includes('millonario') || lowerText.includes('marisco') || lowerText.includes('pescado')) {
        simulatedReply = "¡Excelente elección! Te sugiero probar nuestra gran especialidad: Camarón Millonario en Salsa Blanca ($16.50). Camarones gigantes sobre cama crujiente de fideos de arroz. ¡Una gozada celestial!\n\nRECOMENDACION_IDS: camaron_millonario";
      } else if (lowerText.includes('lumpia') || lowerText.includes('entrada') || lowerText.includes('rollo')) {
        simulatedReply = "¡Para comenzar tu banquete, nada como nuestras crujientes y doradas Lumpias Tradicionales ($4.50 por un par de unidades con jamón y vegetales)! O si prefieres un giro gourmet, nuestras Lumpias de Jamón y Queso ($5.00).\n\nRECOMENDACION_IDS: lumpia_tradicional, lumpia_jamon_queso";
      } else if (lowerText.includes('combo') || lowerText.includes('familiar') || lowerText.includes('comer') || lowerText.includes('personas') || lowerText.includes('amigos')) {
        simulatedReply = "Para compartir en familia, te recomiendo nuestro Banquete Huadu C3 ($26.50) para 3 personas (con 2 porciones de Arroz Cantonés, Chop Suey, Pollo Agridulce, Lumpias y Pan Chino), o el Banquete Liwan C4 ($36.00) diseñado idealmente para 4 personas.\n\nRECOMENDACION_IDS: combo_huadu_c3, combo_liwan_c4";
      } else if (lowerText.includes('carne') || lowerText.includes('lomito') || lowerText.includes('pimienta')) {
        simulatedReply = "Te recomiendo altamente nuestro jugoso Lomito a la Pimienta Negra ($14.50), salteado en wok a fuego vivo con vegetales, o el clásico Lomito en Salsa Tausí ($14.00).\n\nRECOMENDACION_IDS: lomito_pimienta_negra, lomito_tausi";
      } else if (lowerText.includes('pollo') || lowerText.includes('naranja') || lowerText.includes('miel')) {
        simulatedReply = "El plato más adorado por grandes y chicos es el Pollo Imperial Naranja y Miel ($11.50) o nuestro crujiente Pollo rebozado Miel y Ajonjolí ($11.50).\n\nRECOMENDACION_IDS: pollo_naranja_miel, pollo_miel_ajonjoli";
      }
      return res.json({ text: simulatedReply });
    }

    const ai = getGeminiClient();
    
    // Map previous conversation to contents structure for chat
    const history = messages.slice(0, -1).map((m: ChatMessage) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    // Use chats API or standard generateContent with history
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: [
        ...history,
        { role: 'user', parts: [{ text: userText }] }
      ],
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      }
    });

    const replyText = response.text || "Lo siento, tuve un desvío en mi wok mental. ¿En qué más puedo complacerte?";
    res.json({ text: replyText });

  } catch (err: any) {
    console.error("Gemini API Error:", err);
    res.status(500).json({ error: 'Error del servidor al procesar el chat con el asistente.', details: err.message });
  }
});

// Real-time exchange rate API with multi-source failover for Venezuelan Bolívar (VES)
app.get('/api/exchange-rate', async (req, res) => {
  try {
    // 1. Try to fetch from ve.descg.com (Most popular and localized for Venezuela)
    const descgResponse = await fetch('https://ve.descg.com/api/v1/dolar')
      .then(async r => r.ok ? await r.json() : null)
      .catch(() => null);

    if (descgResponse && typeof descgResponse === 'object') {
      const bcv = descgResponse.bcv || (descgResponse.monedas && descgResponse.monedas.usd && descgResponse.monedas.usd.bcv) || descgResponse.price;
      const parallel = descgResponse.enparalelovzla || (descgResponse.monedas && descgResponse.monedas.usd && descgResponse.monedas.usd.enparalelovzla) || bcv;
      if (bcv) {
        return res.json({
          bcv: Number(bcv),
          parallel: Number(parallel || bcv),
          source: 've.descg.com',
          timestamp: new Date().toISOString()
        });
      }
    }

    // 2. Fallback: Try dolarapi.com
    const dolarapiResponse = await fetch('https://dolarapi.com/v1/dolares/oficial')
      .then(async r => r.ok ? await r.json() : null)
      .catch(() => null);

    if (dolarapiResponse && typeof dolarapiResponse === 'object' && dolarapiResponse.promedio) {
      return res.json({
        bcv: Number(dolarapiResponse.promedio),
        parallel: Number(dolarapiResponse.promedio),
        source: 'dolarapi.com',
        timestamp: new Date().toISOString()
      });
    }

    // 3. Last fallback: Try standard open.er-api.com
    const openErResponse = await fetch('https://open.er-api.com/v6/latest/USD')
      .then(async r => r.ok ? await r.json() : null)
      .catch(() => null);

    if (openErResponse && openErResponse.rates && openErResponse.rates.VES) {
      const vesRate = openErResponse.rates.VES;
      return res.json({
        bcv: Number(vesRate),
        parallel: Number(vesRate),
        source: 'open.er-api.com',
        timestamp: new Date().toISOString()
      });
    }

    // 4. Ultimate hardcoded fallback (historically accurate)
    return res.json({
      bcv: 36.62,
      parallel: 42.15,
      source: 'offline-fallback',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Exchange rate fetch error:', error);
    res.json({
      bcv: 36.62,
      parallel: 42.15,
      source: 'error-fallback',
      timestamp: new Date().toISOString()
    });
  }
});

// Vite Middleware & Production static serve setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting in development mode with active Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting in production mode, serving pre-built static assets...");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Palacio Cantón PZO Backend] Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
