// Colores
export const COLORS = {
  YELLOW: "#FFD700", YELLOW2: "#F0B90B", BG: "#0a0a0f",
  SUCCESS: "#00C853", ERROR: "#FF3D00", WARNING: "#FF8C00", INFO: "#4ECDC4",
};
 
// Permisos por defecto
const NO_PERMS  = { canGiveCredits:false, canApproveCredits:false, canCreateUsers:false, canManageGames:false };
const ALL_PERMS = { canGiveCredits:true,  canApproveCredits:true,  canCreateUsers:true,  canManageGames:true  };
 
// Usuarios iniciales
export const USERS_INIT = [
  { id:1,  username:"admin",      password:"admin",    credits:12430, isAdmin:true,  role:"admin",      name:"Admin",          avatar:"👑", permissions:ALL_PERMS },
  { id:11, username:"supervisor", password:"super123", credits:0,     isAdmin:false, role:"supervisor", name:"Supervisor",     avatar:"🎪", permissions:{ canGiveCredits:true, canApproveCredits:true, canCreateUsers:true, canManageGames:false } },
  { id:2,  username:"juanperez",  password:"1234",     credits:500,   isAdmin:false, role:"player",     name:"Juan Pérez",     avatar:"🎯", permissions:NO_PERMS },
  { id:3,  username:"maria",      password:"1234",     credits:350,   isAdmin:false, role:"player",     name:"María García",   avatar:"🌟", permissions:NO_PERMS },
  { id:4,  username:"carlos",     password:"1234",     credits:600,   isAdmin:false, role:"player",     name:"Carlos López",   avatar:"💎", permissions:NO_PERMS },
  { id:5,  username:"ana",        password:"1234",     credits:200,   isAdmin:false, role:"player",     name:"Ana Torres",     avatar:"🎪", permissions:NO_PERMS },
  { id:6,  username:"pablo",      password:"1234",     credits:450,   isAdmin:false, role:"player",     name:"Pablo Ruiz",     avatar:"🔥", permissions:NO_PERMS },
  { id:7,  username:"lucia",      password:"1234",     credits:320,   isAdmin:false, role:"player",     name:"Lucía Soto",     avatar:"⚡", permissions:NO_PERMS },
  { id:8,  username:"diego",      password:"1234",     credits:750,   isAdmin:false, role:"player",     name:"Diego Silva",    avatar:"🎭", permissions:NO_PERMS },
  { id:9,  username:"sofia",      password:"1234",     credits:410,   isAdmin:false, role:"player",     name:"Sofía Pérez",    avatar:"🃏", permissions:NO_PERMS },
  { id:10, username:"marcos",     password:"1234",     credits:290,   isAdmin:false, role:"player",     name:"Marcos Díaz",    avatar:"🎲", permissions:NO_PERMS },
];
 
export const RIFAS_INIT = [
  { id:1, name:"Moto 0KM",        subtitle:"Yamaha FZ 150cc 0km",        icon:"🏍️", pricePerNumber:150, prize:"$150,000", totalNumbers:100, status:"active", numbers:{}, winner:null, winnerId:null, winnerNumber:null },
  { id:2, name:'Smart TV 50"',    subtitle:'Samsung 50" 4K UHD',         icon:"📺", pricePerNumber:80,  prize:"$80,000",  totalNumbers:50,  status:"active", numbers:{}, winner:null, winnerId:null, winnerNumber:null },
  { id:3, name:"Celular iPhone 15",subtitle:"iPhone 15 128GB",           icon:"📱", pricePerNumber:100, prize:"$100,000", totalNumbers:75,  status:"active", numbers:{}, winner:null, winnerId:null, winnerNumber:null },
  { id:4, name:"Orden de Compra",  subtitle:"$50,000 en compras libres", icon:"🛍️", pricePerNumber:40,  prize:"$50,000",  totalNumbers:30,  status:"active", numbers:{}, winner:null, winnerId:null, winnerNumber:null },
];
 
export const CORTITOS_INIT = [
  { id:1, name:"Cortito 1", description:"Completá 5 casilleros para ganar el pozo", costPerSlot:100, totalSlots:10, casillerosToWin:5, bolMin:1, bolMax:10, players:[], status:"open", seq:[], winner:null },
  { id:2, name:"Cortito 2", description:"Doble premio · Más emoción",               costPerSlot:200, totalSlots:10, casillerosToWin:5, bolMin:1, bolMax:10, players:[], status:"open", seq:[], winner:null },
  { id:3, name:"Cortito 3", description:"Precio accesible · El más jugado",         costPerSlot:50,  totalSlots:10, casillerosToWin:5, bolMin:1, bolMax:10, players:[], status:"open", seq:[], winner:null },
];
 
export const PLANILLAS_INIT = [
  { id:1, name:"Planilla Express", subtitle:"Sale 7 veces",  prize:20000, timesOut:7,  totalNumbers:12, status:"open", prices:{cuarto:5,  medio:10, entero:20}, numbers:{}, seq:[], winner:null },
  { id:2, name:"Planilla Grande",  subtitle:"Sale 10 veces", prize:50000, timesOut:10, totalNumbers:12, status:"open", prices:{cuarto:15, medio:30, entero:60}, numbers:{}, seq:[], winner:null },
  { id:3, name:"Planilla Flash",   subtitle:"Sale 5 veces",  prize:10000, timesOut:5,  totalNumbers:12, status:"open", prices:{cuarto:3,  medio:6,  entero:12}, numbers:{}, seq:[], winner:null },
];
 
export const FRAC_COLORS = { cuarto:"#7C4DFF", medio:"#00C853", entero:"#C9A84C" };
export const DB_KEY = "rifasreal_db_v2";
export const BALL_COLORS = ["#FF6B6B","#FF8C00","#FFD700","#A8E063","#4ECDC4","#4D96FF","#C77DFF","#FF6CAE","#95E1D3","#F38181"];