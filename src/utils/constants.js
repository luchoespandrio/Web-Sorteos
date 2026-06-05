// Colores
export const COLORS = {
  YELLOW: "#FFD700",
  YELLOW2: "#F0B90B",
  BG: "#0a0a0f",
  SUCCESS: "#00C853",
  ERROR: "#FF3D00",
  WARNING: "#FF8C00",
  INFO: "#4ECDC4",
};
 
// Usuarios iniciales
export const USERS_INIT = [
  { id: 1, username: "admin", password: "admin", credits: 12430, isAdmin: true, name: "Admin", avatar: "👑" },
  { id: 2, username: "juanperez", password: "1234", credits: 500, isAdmin: false, name: "Juan Pérez", avatar: "🎯" },
  { id: 3, username: "maria", password: "1234", credits: 350, isAdmin: false, name: "María García", avatar: "🌟" },
  { id: 4, username: "carlos", password: "1234", credits: 600, isAdmin: false, name: "Carlos López", avatar: "💎" },
  { id: 5, username: "ana", password: "1234", credits: 200, isAdmin: false, name: "Ana Torres", avatar: "🎪" },
  { id: 6, username: "pablo", password: "1234", credits: 450, isAdmin: false, name: "Pablo Ruiz", avatar: "🔥" },
  { id: 7, username: "lucia", password: "1234", credits: 320, isAdmin: false, name: "Lucía Soto", avatar: "⚡" },
  { id: 8, username: "diego", password: "1234", credits: 750, isAdmin: false, name: "Diego Silva", avatar: "🎭" },
  { id: 9, username: "sofia", password: "1234", credits: 410, isAdmin: false, name: "Sofía Pérez", avatar: "🃏" },
  { id: 10, username: "marcos", password: "1234", credits: 290, isAdmin: false, name: "Marcos Díaz", avatar: "🎲" },
];
 
// Rifas iniciales (con campos para ganador manual)
export const RIFAS_INIT = [
  {
    id: 1,
    name: "Moto 0KM",
    subtitle: "Yamaha FZ 150cc 0km",
    icon: "🏍️",
    pricePerNumber: 150,
    prize: "$150,000",
    totalNumbers: 100,
    status: "active",
    numbers: {},
    winner: null,       // { number: "01", name: "Juan Pérez", userId: 2 }
    winnerId: null,     // ID del usuario ganador
    winnerNumber: null, // Número ganador
  },
  {
    id: 2,
    name: "Smart TV 50\"",
    subtitle: "Samsung 50\" 4K UHD",
    icon: "📺",
    pricePerNumber: 80,
    prize: "$80,000",
    totalNumbers: 50,
    status: "active",
    numbers: {},
    winner: null,
    winnerId: null,
    winnerNumber: null,
  },
  {
    id: 3,
    name: "Celular iPhone 15",
    subtitle: "iPhone 15 128GB",
    icon: "📱",
    pricePerNumber: 100,
    prize: "$100,000",
    totalNumbers: 75,
    status: "active",
    numbers: {},
    winner: null,
    winnerId: null,
    winnerNumber: null,
  },
  {
    id: 4,
    name: "Orden de Compra",
    subtitle: "$50,000 en compras libres",
    icon: "🛍️",
    pricePerNumber: 40,
    prize: "$50,000",
    totalNumbers: 30,
    status: "active",
    numbers: {},
    winner: null,
    winnerId: null,
    winnerNumber: null,
  },
];
 
// Cortitos iniciales
export const CORTITOS_INIT = [
  {
    id: 1,
    name: "Planilla 1",
    description: "Completá 5 casilleros para ganar el pozo",
    costPerSlot: 100,
    totalSlots: 10,
    casillerosToWin: 5,
    bolMin: 1,
    bolMax: 10,
    players: [],
    status: "open",
    seq: [],
    winner: null,
  },
  {
    id: 2,
    name: "Planilla 2",
    description: "Doble premio · Más emoción",
    costPerSlot: 200,
    totalSlots: 10,
    casillerosToWin: 5,
    bolMin: 1,
    bolMax: 10,
    players: [],
    status: "open",
    seq: [],
    winner: null,
  },
  {
    id: 3,
    name: "Planilla 3",
    description: "Precio accesible · El más jugado",
    costPerSlot: 50,
    totalSlots: 10,
    casillerosToWin: 5,
    bolMin: 1,
    bolMax: 10,
    players: [],
    status: "open",
    seq: [],
    winner: null,
  },
];
 
// Planillas iniciales
export const PLANILLAS_INIT = [
  {
    id: 1,
    name: "Sorteo Express",
    subtitle: "Sale 7 veces",
    prize: 20000,
    timesOut: 7,
    totalNumbers: 12,
    status: "open",
    prices: { cuarto: 5, medio: 10, entero: 20 },
    numbers: {}, // { "1": [slot0,slot1,slot2,slot3], ... } — se popula al comprar
    seq: [],
    winner: null,
    drawMode: "auto", // "auto" | "manual"
  },
  {
    id: 2,
    name: "Sorteo Grande",
    subtitle: "Sale 10 veces",
    prize: 50000,
    timesOut: 10,
    totalNumbers: 12,
    status: "open",
    prices: { cuarto: 15, medio: 30, entero: 60 },
    numbers: {},
    seq: [],
    winner: null,
    drawMode: "auto", // "auto" | "manual"
  },
  {
    id: 3,
    name: "Sorteo Flash",
    subtitle: "Sale 5 veces",
    prize: 10000,
    timesOut: 5,
    totalNumbers: 12,
    status: "open",
    prices: { cuarto: 3, medio: 6, entero: 12 },
    numbers: {},
    seq: [],
    winner: null,
    drawMode: "auto", // "auto" | "manual"
  },
];
 
// Colores de fracciones para Planillas
export const FRAC_COLORS = {
  cuarto: "#7C4DFF",
  medio:  "#00C853",
  entero: "#C9A84C",
};
 
// Clave para localStorage
export const DB_KEY = "rifasreal_db_v2";
 
// Colores de las bolas para los cortitos
export const BALL_COLORS = [
  "#FF6B6B", "#FF8C00", "#FFD700", "#A8E063",
  "#4ECDC4", "#4D96FF", "#C77DFF", "#FF6CAE", "#95E1D3", "#F38181",
]