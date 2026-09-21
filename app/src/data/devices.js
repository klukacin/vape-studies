// Prices not freshly verified are explicitly retained as editable scenarios.
export const devices = [
 {id:'juul',name:'JUUL2',unit:'pod',kit:null,price:null,priceLabel:'9,99 £ / 2 poda (raniji UK pregled)',volume:1.2,strength:18,puffs:200,puffNote:'200: pretpostavka ranijeg izračuna',source:'/studije/124/',sourceLabel:'JUUL literatura (5% ≠ JUUL2)',heater:'Pod; materijal nije potvrđen ovim pregledom',dose:'Za JUUL2 nema potvrđenog prinosa. JUUL 5%: 72–164 µg/puff u pregledu #124.'},
 {id:'vuse',name:'Vuse Pro One',unit:'pod',kit:11,price:4.10,priceLabel:'4,10 € / pod (raniji pregled trgovca)',volume:2,strength:18,puffs:1000,puffNote:'do 1000: deklaracija, nije jamstvo trajanja',source:'/studije/158/',sourceLabel:'Vuse HR / raniji cjenovni pregled',heater:'FlavourFlow keramika prema proizvođaču',dose:'Za ovu kombinaciju nema potvrđenog prinosa po puffu.'},
 {id:'enva',name:'ENVA Sol',unit:'stick',kit:29,price:3.45,priceLabel:'6,90 € / 2 sticka (raniji pregled)',volume:0.8,strength:18,puffs:100,puffNote:'100: konzervativni scenarij; može se izmijeniti',source:'/#enva',sourceLabel:'ENVA analiza / raniji cjenovni pregled',heater:'TLA kontrola; nema potvrđene temperaturne krivulje',dose:'Nema potvrđenog prinosa po puffu za ovaj uređaj.'},
 {id:'iqos',name:'IQOS ILUMA i ONE',unit:'TEREA stick',kit:39,price:0.215,priceLabel:'4,30 € / 20 TEREA (raniji pregled)',volume:null,strength:null,puffs:14,puffNote:'14: računski scenarij, uporaba može varirati',source:'https://www.iqos.com/hr/hr/',sourceLabel:'IQOS · cijene u tablici su raniji scenarij',heater:'Indukcijsko zagrijavanje duhanskog sticka',dose:'Podaci za grijani duhan nisu sadržaj nikotina u e-tekućini.'},
 {id:'wiipMagnetic',name:'Wiip Magnetic II',unit:'Magnetic pod',kit:14.99,price:4.20,priceLabel:'4,20 € / Magnetic pod (21. 9. 2026.)',volume:2,strength:18,puffs:null,puffNote:'Nema potvrđenog broja puffova po podu',source:'/studije/144/',sourceLabel:'Wiip specifikacija i deklaracija Cola 18 (#148)',heater:'Materijal nepoznat; tri načina rada',dose:'Cola 18 deklarira 140 µg/puff; uređaj i režim testa nisu objavljeni.'},
 {id:'wiipXPro',name:'Wiip X Pro',unit:'Magnetic pod',kit:9.99,price:4.20,priceLabel:'4,20 € / Magnetic pod (21. 9. 2026.)',volume:2,strength:18,puffs:null,puffNote:'Nema potvrđenog broja puffova po podu',source:'/studije/145/',sourceLabel:'Wiip specifikacija i deklaracija Cola 18 (#148)',heater:'Materijal nepoznat; aktivacija udisajem',dose:'Ista deklaracija poda; nije potvrđeno mjerenje X Pro uređaja.'},
 {id:'cig',name:'Cigarete · referenca',unit:'cigareta',kit:0,price:0.255,priceLabel:'5,10 € / 20 cigareta (raniji pregled)',volume:null,strength:null,puffs:12,puffNote:'12: računski scenarij',source:'/#market',sourceLabel:'Raniji cjenovni pregled',heater:'Izgaranje duhana',dose:'Apsorpcija i strojni prinos dima nisu sadržaj nikotina u tekućini.'}
];
export const liquidContent = d => d.volume == null || d.strength == null ? null : d.volume*d.strength;
export function costs(price,puffs,daily){
 if(!Number.isFinite(price)||price<0||!Number.isFinite(puffs)||puffs<=0||!Number.isFinite(daily)||daily<0)return null;
 return {hundred:100*price/puffs,month:30*daily*price/puffs,year:365*daily*price/puffs};
}

// Four explicit ENVA scenarios; puff counts are assumptions, not measured yields.
export const costScenarios = devices.flatMap(device => device.id !== 'enva' ? [device] :
 [{pack:'2/1',price:6.90/2},{pack:'XXL',price:69.90/30}].flatMap(({pack,price}) =>
  [200,300].map(puffs => ({...device,id:`enva${pack==='XXL'?'XXL':'Regular'}${puffs}`,
   name:`ENVA Sol ${pack} · ${puffs} puffova/stick`,price,puffs,
   puffNote:`Scenarij ${puffs} puffova; ${pack==='XXL'?'69,90 € / 30 stickova, paket s uređajem':'6,90 € / 2 sticka'}`}))));
