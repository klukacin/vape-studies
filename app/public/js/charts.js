
/* ---------- palette & helpers ---------- */
const C={cig:'#e05d4f',cigar:'#b07843',ecig:'#3aa896',vuse:'#2f9e8f',juul:'#6d7fa3',enva:'#ffb800',non:'#8b94a1',ink:'rgba(255,255,255,.9)',ink2:'rgba(255,255,255,.6)',ink3:'rgba(255,255,255,.38)',line:'rgba(255,255,255,.12)'};
const baseAxis={axisLine:{lineStyle:{color:C.line}},axisLabel:{color:C.ink2,fontFamily:'ui-monospace,Menlo,monospace',fontSize:11},splitLine:{lineStyle:{color:'rgba(255,255,255,.05)'}}};
const baseTip={trigger:'axis',backgroundColor:'#161412',borderColor:C.line,textStyle:{color:C.ink,fontSize:12}};
const charts=[];
function mk(id,opt){const el=document.getElementById(id);if(!el)return;const ch=echarts.init(el,null,{renderer:'canvas'});ch.setOption(opt);charts.push(ch);return ch;}
window.addEventListener('resize',()=>charts.forEach(c=>c.resize()));

/* ---------- hero canvas: temperature wave ---------- */
(function(){
const cv=document.getElementById('heroCanvas');if(!cv)return;const ctx=cv.getContext('2d');let w,h,t=0;
function rs(){w=cv.width=cv.offsetWidth;h=cv.height=cv.offsetHeight;}rs();window.addEventListener('resize',rs);
function draw(){t+=0.008;ctx.clearRect(0,0,w,h);
for(let i=0;i<28;i++){ctx.beginPath();const yBase=h*0.15+i*(h*0.72/28);
for(let x=0;x<=w;x+=8){const y=yBase+Math.sin(x*0.006+t*2+i*0.35)*14*Math.sin(i*0.5+t);
x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}
const hot=i/27;ctx.strokeStyle=`rgba(${255},${184-hot*120},${0+hot*60},${0.10+0.12*Math.abs(Math.sin(i+t))})`;ctx.lineWidth=1;ctx.stroke();}
requestAnimationFrame(draw);}draw();
})();

/* ---------- count-up ---------- */
document.querySelectorAll('.stat .v[data-count]').forEach(el=>{
const target=+el.dataset.count;let n=0;const step=()=>{n+=Math.ceil(target/40);if(n>=target)n=target;el.textContent='~'+n;if(n<target)requestAnimationFrame(step);};step();});

/* ---------- reveal & nav ---------- */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('on');}),{threshold:0.08});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
setTimeout(()=>document.querySelectorAll('.reveal:not(.on)').forEach(el=>el.classList.add('on')),2500);
const navLinks=[...document.querySelectorAll('#outline ol a')];
const secIO=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){navLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id));}}),{rootMargin:'-40% 0px -55% 0px'});
document.querySelectorAll('section').forEach(s=>secIO.observe(s));

/* ---------- 02 temp chart ---------- */
mk('chartTemp',{
tooltip:{trigger:'item',...baseTip,formatter:p=>`${p.name}<br><b>${p.value[1]}–${p.value[2]} °C</b>`},
grid:{left:210,right:40,top:30,bottom:50},
xAxis:{type:'value',name:'°C',nameTextStyle:{color:C.ink2},max:1000,...baseAxis},
yAxis:{type:'category',data:['Nepušač (referenca)','Pod-uređaji 1,2 Ω · ~10 W','Pod-uređaji 0,6 Ω · ~21 W','Vuse Pro One (procjena)','JUUL — prosjek atomizera','JUUL — grijaći element','ENVA Sol (procjena vršne)','PG/VG prag razgradnje','Dry burn — suhi fitilj','Cigareta — vrh pri puhanju'],...baseAxis,axisLabel:{...baseAxis.axisLabel,color:C.ink,fontSize:12}},
series:[{type:'custom',renderItem:(p,api)=>{const y=api.coord([0,api.value(0)])[1];const x1=api.coord([api.value(1),0])[0];const x2=api.coord([api.value(2),0])[0];
return{type:'rect',shape:{x:x1,y:y-11,width:Math.max(x2-x1,2),height:22},style:{fill:api.value(3),opacity:.92}};},
data:[
[0,36,37,C.non],
[1,63,90,C.ecig],
[2,103,150,C.ecig],
[3,60,180,C.vuse],
[4,150,300,C.juul],
[5,200,250,C.juul],
[6,120,200,C.enva],
[7,250,250,'#d94f70'],
[8,350,1008,'#8a2f2f'],
[9,600,900,C.cig]],
markLine:{symbol:'none',lineStyle:{color:'#d94f70',type:'dashed'},label:{color:'#d94f70',fontSize:11,formatter:'~250 °C — početak pirolize PG/VG'},data:[{xAxis:250}]}
}]});

/* ---------- 02 power chart ---------- */
mk('chartPower',{
tooltip:baseTip,legend:{textStyle:{color:C.ink2},top:0},
grid:[{left:70,right:'54%',top:50,bottom:60},{left:'56%',right:30,top:50,bottom:60}],
xAxis:[{gridIndex:0,type:'category',name:'snaga (W)',data:['5','7','9','11','15','20','25','80*'],...baseAxis,nameTextStyle:{color:C.ink2}},
{gridIndex:1,type:'category',data:['niska','srednja','visoka'],...baseAxis}],
yAxis:[{gridIndex:0,type:'log',name:'formaldehid (ng/puff, log)',...baseAxis,nameTextStyle:{color:C.ink2}},
{gridIndex:1,type:'value',name:'% udjela u karbonilima',max:100,...baseAxis,nameTextStyle:{color:C.ink2}}],
series:[
{name:'formaldehid (Geiss 2016)',type:'line',xAxisIndex:0,yAxisIndex:0,smooth:true,symbolSize:7,lineStyle:{width:3,color:C.enva},itemStyle:{color:C.enva},data:[24.2,40,90,210,430,1599.9,null,null],markArea:{itemStyle:{color:'rgba(224,93,79,.08)'},label:{color:C.cig,fontSize:11},data:[[{name:'>300 °C zavojnica',xAxis:'20'},{xAxis:'25'}]]}},
{name:'formaldehid (Gillman 2016)',type:'line',xAxisIndex:0,yAxisIndex:0,smooth:true,symbol:'diamond',symbolSize:8,lineStyle:{width:2,type:'dashed',color:C.cig},itemStyle:{color:C.cig},data:[3.4,19.8,71.8,380,718,null,null,null]},
{name:'formaldehid',type:'bar',stack:'s',xAxisIndex:1,yAxisIndex:1,itemStyle:{color:'#d94f70'},data:[100,64,33]},
{name:'acetaldehid',type:'bar',stack:'s',xAxisIndex:1,yAxisIndex:1,itemStyle:{color:'#b07843'},data:[0,22,31]},
{name:'akrolein',type:'bar',stack:'s',xAxisIndex:1,yAxisIndex:1,itemStyle:{color:'#6d7fa3'},data:[0,14,30]}
]});

/* ---------- 03 cancer potency ---------- */
mk('chartPotency',{
tooltip:{trigger:'item',...baseTip,formatter:p=>`${p.name}<br>rel. potentnost: <b>${p.value[0]}</b><br>${p.value[2]}`},
grid:{left:60,right:40,top:50,bottom:70},
xAxis:{type:'log',min:0.0003,max:2,name:'relativna karcinogena potentnost (cigareta = 1) · log',...baseAxis,nameTextStyle:{color:C.ink2},axisLabel:{...baseAxis.axisLabel,formatter:v=>v}},
yAxis:{type:'category',data:['Nikotinski inhalator (NRT)','Zatvorene e-cigarete (Vuse/JUUL klasa)','E-cigarete — prosjek svih tipova','E-cigarete — najgori uzorci (visoka snaga)','Grijani duhan (HTP/IQOS)','Cigareta'],...baseAxis,axisLabel:{...baseAxis.axisLabel,color:C.ink,fontSize:12}},
series:[{type:'scatter',symbolSize:d=>34,
data:[
[0.0004,0,'doživotni rizik 8,9×10⁻⁶',C.non],
[0.011,1,'rel. rizik 0,009–0,014',C.ecig],
[0.004,2,'doživotni rizik 9,5×10⁻⁵',C.ecig],
[0.35,3,'visoka snaga / dry puff — Stephens: manjina uzoraka',C.cig],
[0.024,4,'doživotni rizik 5,7×10⁻⁴',C.cigar],
[1,5,'doživotni rizik 2,4×10⁻²',C.cig]],
itemStyle:{color:p=>p.value[3]},
label:{show:true,position:'right',color:C.ink2,fontSize:11,fontFamily:'ui-monospace,Menlo,monospace',formatter:p=>p.value[0]}
}]});

/* ---------- 03 metals ---------- */
mk('chartMetals',{
tooltip:baseTip,
grid:{left:60,right:30,top:40,bottom:50},
xAxis:{type:'category',data:['Nikal','Olovo','Krom (VI)*','Mangan'],...baseAxis,axisLabel:{...baseAxis.axisLabel,color:C.ink,fontSize:13}},
yAxis:{type:'value',name:'% uzoraka iznad zdravstvene granice',max:100,...baseAxis,nameTextStyle:{color:C.ink2}},
series:[{type:'bar',barWidth:44,data:[
{value:57,itemStyle:{color:C.enva}},
{value:48,itemStyle:{color:C.cig}},
{value:68,itemStyle:{color:'#d94f70'}},
{value:50,itemStyle:{color:C.juul}}],
label:{show:true,position:'top',color:C.ink,fontFamily:'ui-monospace,Menlo,monospace',formatter:'{c}%'}
}],
graphic:[{type:'text',right:20,top:10,style:{text:'*ako je sav krom heksavalentan\nOlmedo 2018 · n=56 uređaja',fill:C.ink3,fontSize:11,fontFamily:'ui-monospace,Menlo,monospace'}}]
});

/* ---------- 03b metal source: dispenser vs aerosol vs tank ---------- */
mk('chartMetalSrc',{
tooltip:baseTip,legend:{textStyle:{color:C.ink2},top:0},
grid:{left:70,right:30,top:50,bottom:60},
xAxis:{type:'category',data:['Nikal','Krom','Olovo','Cink','Aluminij'],...baseAxis,axisLabel:{...baseAxis.axisLabel,color:C.ink,fontSize:12}},
yAxis:{type:'log',min:0.1,name:'µg/kg (log)',...baseAxis,nameTextStyle:{color:C.ink2}},
series:[
{name:'dozator (bez kontakta)',type:'bar',barWidth:22,itemStyle:{color:C.non},data:[2.03,0.5,0.476,13.1,10.9]},
{name:'aerosol',type:'bar',barWidth:22,itemStyle:{color:'#d94f70'},data:[68.4,8.38,14.8,515,16.3]},
{name:'spremnik nakon uporabe',type:'bar',barWidth:22,itemStyle:{color:C.juul},data:[233,55.4,40.2,426,31.2]}
]});

/* ---------- 03c ceramic vs quartz silicates ---------- */
mk('chartCeramic',{
tooltip:{...baseTip,formatter:p=>`${p[0].name}<br><b>${p[0].value.toLocaleString('hr')}</b> silikatnih čestica`},
grid:{left:200,right:70,top:30,bottom:50},
xAxis:{type:'log',min:100,max:100000,name:'silikatne čestice po uzorku (log)',...baseAxis,nameTextStyle:{color:C.ink2}},
yAxis:{type:'category',data:['Kvarcni element','Keramički element'],...baseAxis,axisLabel:{...baseAxis.axisLabel,color:C.ink,fontSize:13}},
series:[{type:'bar',barWidth:30,
data:[{value:3178,itemStyle:{color:C.juul}},{value:13644,itemStyle:{color:'#d94f70'}}],
label:{show:true,position:'right',color:C.ink,fontFamily:'ui-monospace,Menlo,monospace',formatter:p=>p.value.toLocaleString('hr')}
}],
graphic:[{type:'text',right:20,bottom:0,style:{text:'Lifecycle mjerenje 2024 (industrijski protokol, ICP-OES + brojač čestica)',fill:C.ink3,fontSize:11,fontFamily:'ui-monospace,Menlo,monospace'}}]
});

/* ---------- 03d brain metal accumulation ---------- */
mk('chartBrain',{
tooltip:{...baseTip,formatter:p=>`${p[0].name}<br>+<b>${p[0].value}%</b> vs kontrola (miševi, 2 mj. izloženosti)`},
grid:{left:200,right:70,top:30,bottom:50},
xAxis:{type:'value',name:'% iznad kontrolne grupe (moždano tkivo)',...baseAxis,nameTextStyle:{color:C.ink2}},
yAxis:{type:'category',data:['Mn — striatum','Ni — ventralni mezencefalon','Fe — striatum','Cu — striatum','Cr — motor. korteks','Sr — striatum','Pb — striatum','Pb — motor. korteks'],...baseAxis,axisLabel:{...baseAxis.axisLabel,color:C.ink,fontSize:12}},
series:[{type:'bar',barWidth:20,
data:[
{value:18,itemStyle:{color:C.juul}},
{value:39,itemStyle:{color:C.juul}},
{value:26,itemStyle:{color:C.ecig}},
{value:42,itemStyle:{color:C.ecig}},
{value:61,itemStyle:{color:C.enva}},
{value:99,itemStyle:{color:C.cigar}},
{value:185,itemStyle:{color:'#d94f70'}},
{value:259,itemStyle:{color:'#d94f70'}}],
label:{show:true,position:'right',color:C.ink,fontFamily:'ui-monospace,Menlo,monospace',formatter:'+{c}%'}
}],
graphic:[{type:'text',right:20,bottom:0,style:{text:'Woo i sur. 2021/2026 · striatum ako nije drugačije navedeno · Pb i Cr = najproblematičniji',fill:C.ink3,fontSize:11,fontFamily:'ui-monospace,Menlo,monospace'}}]
});

/* ---------- 03e blood metals ---------- */
mk('chartMetalBlood',{
tooltip:baseTip,legend:{textStyle:{color:C.ink2},top:0},
grid:{left:70,right:30,top:50,bottom:60},
xAxis:{type:'category',data:['Nepušači','Ekskluzivni vaperi','Dualni korisnici','Pušači cigareta'],...baseAxis,axisLabel:{...baseAxis.axisLabel,color:C.ink,fontSize:12,interval:0}},
yAxis:[{type:'value',name:'krvni Cd (µg/L)',...baseAxis,nameTextStyle:{color:C.ink2}},{type:'value',name:'urinski Cd (ng/mg)',...baseAxis,nameTextStyle:{color:C.ink2}}],
series:[
{name:'krvni Cd (Prokopowicz 2019)',type:'bar',barWidth:34,itemStyle:{color:C.juul},data:[0.31,0.44,1.38,1.44],label:{show:true,position:'top',color:C.ink,fontSize:11,fontFamily:'ui-monospace,Menlo,monospace',formatter:'{c}'}},
{name:'urinski Cd (PATH Wave 3)',type:'bar',yAxisIndex:1,barWidth:34,itemStyle:{color:C.ecig},data:[0.23,0.35,null,null],label:{show:true,position:'top',color:C.ink,fontSize:11,fontFamily:'ui-monospace,Menlo,monospace',formatter:'{c}'}}
],
graphic:[{type:'text',left:70,bottom:0,style:{text:'Dualni ≈ pušači; ekskluzivni vaperi blizu nepušača (krv); urinski Cd ipak viši kod vapera (PATH)',fill:C.ink3,fontSize:11,fontFamily:'ui-monospace,Menlo,monospace'}}]
});

/* ---------- 09 nicotine per puff ---------- */
(function(){
const cats=['Vuse Pro One (procjena)','ENVA Sol (procjena)','IQOS + TEREA (mjereno)','JUUL2 EU 18 mg/mL (procjena)','JUUL 5% SAD (mjereno)','Cigareta — dim (referenca)'];
const mins=[40,48,70,22,72,100];
const ranges=[40,96,50,28,92,200];
const cols=[C.vuse,C.enva,'#7d8a9e',C.juul,C.juul,C.cig];
const labs=['~40–80','48–144','~70–120','22–50','72–164','100–300'];
mk('chartNicotine',{
tooltip:{...baseTip,formatter:p=>{const i=cats.indexOf(p.name);return `${p.name}<br>nikotin po puffu: <b>${labs[i]}</b> µg`}},
grid:{left:250,right:90,top:20,bottom:50},
xAxis:{type:'log',min:10,max:1000,name:'µg nikotina po puffu (log skala)',...baseAxis,nameTextStyle:{color:C.ink2}},
yAxis:{type:'category',data:cats,...baseAxis,axisLabel:{...baseAxis.axisLabel,color:C.ink,fontSize:12}},
series:[
{type:'bar',stack:'r',barWidth:20,itemStyle:{color:'transparent'},data:mins,tooltip:{show:false},emphasis:{disabled:true},silent:true},
{type:'bar',stack:'r',barWidth:20,data:ranges.map((v,i)=>({value:v,itemStyle:{color:cols[i]}})),
label:{show:true,position:'right',color:C.ink,fontSize:11,fontFamily:'ui-monospace,Menlo,monospace',formatter:p=>labs[p.dataIndex]+' µg'}}
],
graphic:[{type:'text',left:250,bottom:0,style:{text:'mjereno: JUUL 5% (Prochaska 2021) · IQOS/TEREA (neovisna mjerenja aerosola) · ostalo = sadržaj poda/sticka ÷ deklarirani puffovi',fill:C.ink3,fontSize:11,fontFamily:'ui-monospace,Menlo,monospace'}}]
});
})();

/* ---------- 10 cost per 100 puffs ---------- */
mk('chartCost',{
tooltip:{trigger:'axis',...baseTip,axisPointer:{type:'shadow'},formatter:p=>`${p[0].name}<br><b>${p[0].value.toFixed(2)} €</b> po 100 puffova`},
grid:{left:230,right:90,top:20,bottom:50},
xAxis:{type:'value',max:3.5,name:'€ po 100 puffova (HR maloprodaja 2026)',...baseAxis,nameTextStyle:{color:C.ink2}},
yAxis:{type:'category',data:['Vuse Pod Golden Tobacco','ENVA Sol sticks (XXL, 300/stick)','ENVA Sol sticks (2/1, 300/stick)','ENVA Sol sticks (XXL, 200/stick)','TEREA (IQOS ILUMA)','ENVA Sol sticks (2/1, 200/stick)','Cigareta (Marlboro Red/Gold)','JUUL2 pod (UK — nije u HR)'],...baseAxis,axisLabel:{...baseAxis.axisLabel,color:C.ink,fontSize:12}},
series:[{type:'bar',barWidth:18,
data:[
{value:0.41,itemStyle:{color:C.vuse}},
{value:0.78,itemStyle:{color:C.enva}},
{value:1.15,itemStyle:{color:'#d9a520'}},
{value:1.17,itemStyle:{color:'rgba(255,184,0,.55)'}},
{value:1.54,itemStyle:{color:C.juul}},
{value:1.73,itemStyle:{color:'rgba(217,165,32,.5)'}},
{value:2.13,itemStyle:{color:C.cig}},
{value:2.93,itemStyle:{color:'#8b94a1'}}
],
label:{show:true,position:'right',color:C.ink,fontFamily:'ui-monospace,Menlo,monospace',formatter:p=>p.value.toFixed(2)+' €'}
}],
graphic:[{type:'text',left:230,bottom:0,style:{text:'ENVA stick 200–300 puffova (danski trgovac: ~300) · XXL = 69,90 €/30 stickova (2,33 €/stick) · Vuse ~1000/pod · TEREA ~14/stick · cigareta ~12 · parilica.hr, nargila-shop.hr, carina',fill:C.ink3,fontSize:11,fontFamily:'ui-monospace,Menlo,monospace'}}]
});

/* ---------- 10 monthly cost: ekvivalent 1 kutije + 2x/3x scenariji ---------- */
mk('chartMonthly',{
tooltip:{trigger:'axis',...baseTip,axisPointer:{type:'shadow'},formatter:p=>p.map(x=>`${x.marker} ${x.seriesName}: <b>${x.value.toFixed(0)} €</b>/mj`).join('<br>')},
legend:{textStyle:{color:C.ink2},top:0},
grid:{left:70,right:30,top:44,bottom:40},
xAxis:{type:'category',data:['Ekvivalent kutije/dan (240 puff)','E-cig: duplo puffova (480)','E-cig: trostruko (720)'],...baseAxis,axisLabel:{...baseAxis.axisLabel,color:C.ink,fontSize:12}},
yAxis:{type:'value',name:'€ / mjesec',...baseAxis,nameTextStyle:{color:C.ink2}},
series:[
{name:'Cigarete (Marlboro)',type:'bar',barWidth:'12%',itemStyle:{color:C.cig},data:[153,null,null],
label:{show:true,position:'top',color:C.ink,fontSize:10,fontFamily:'ui-monospace,Menlo,monospace',formatter:p=>p.value==null?'':p.value.toFixed(0)+' €'}},
{name:'Vuse podovi',type:'bar',barWidth:'12%',itemStyle:{color:C.vuse},data:[29.52,59.04,88.56],
label:{show:true,position:'top',color:C.ink,fontSize:10,fontFamily:'ui-monospace,Menlo,monospace',formatter:p=>p.value==null?'':p.value.toFixed(0)+' €'}},
{name:'TEREA (IQOS)',type:'bar',barWidth:'12%',itemStyle:{color:C.juul},data:[110.57,221.14,331.71]},
{name:'ENVA 2/1 — 200/stick',type:'bar',barWidth:'12%',itemStyle:{color:'rgba(217,165,32,.5)'},data:[124.20,248.40,372.60]},
{name:'ENVA 2/1 — 300/stick',type:'bar',barWidth:'12%',itemStyle:{color:'#d9a520'},data:[82.80,165.60,248.40]},
{name:'ENVA XXL — 200/stick',type:'bar',barWidth:'12%',itemStyle:{color:'rgba(255,184,0,.55)'},data:[83.88,167.76,251.64]},
{name:'ENVA XXL — 300/stick',type:'bar',barWidth:'12%',itemStyle:{color:C.enva},data:[55.92,111.84,167.76]}
]});

/* ---------- 04 NNAL ---------- */
mk('chartNNAL',{
tooltip:{trigger:'axis',...baseTip,formatter:p=>{const d=p[0];return `${d.name}<br>NNAL: <b>${d.value}</b> pg/mg kreatinina`}},
grid:{left:230,right:60,top:40,bottom:50},
xAxis:{type:'log',min:0.1,max:3000,name:'urinski NNAL (log skala)',...baseAxis,nameTextStyle:{color:C.ink2}},
yAxis:{type:'category',data:[
'Nepušači (meta 2025)',
'Nepušači (NHANES)',
'Adolescenti — samo vaping',
'Ekskluzivni vaperi (PATH)',
'Ekskluzivni vaperi (meta 2025)',
'Cigare — povremeno',
'Cigare — dnevno (PATH)',
'Cigarete — dnevno (meta)',
'Cigarete — dnevno (PATH)',
'Filtrirane cigare — dnevno'],...baseAxis,axisLabel:{...baseAxis.axisLabel,color:C.ink,fontSize:12}},
series:[{type:'bar',barWidth:18,
data:[
{value:5.42,itemStyle:{color:C.non}},
{value:1.01,itemStyle:{color:C.non}},
{value:0.3,itemStyle:{color:C.ecig}},
{value:6.3,itemStyle:{color:C.ecig}},
{value:7.93,itemStyle:{color:C.ecig}},
{value:7.42,itemStyle:{color:C.cigar}},
{value:248.66,itemStyle:{color:C.cigar}},
{value:169.7,itemStyle:{color:C.cig}},
{value:302.15,itemStyle:{color:C.cig}},
{value:979.54,itemStyle:{color:'#8a4a2f'}}],
label:{show:true,position:'right',color:C.ink,fontSize:11,fontFamily:'ui-monospace,Menlo,monospace'},
markLine:{symbol:'none',lineStyle:{color:C.cig,type:'dashed'},label:{color:C.cig,fontSize:11,formatter:'pušačka razina'},data:[{xAxis:150}]}
}]});

/* ---------- 04 cotinine ---------- */
mk('chartCot',{
tooltip:baseTip,legend:{textStyle:{color:C.ink2},top:0},
grid:{left:70,right:30,top:50,bottom:60},
xAxis:{type:'category',data:['Nepušači','Ekskl. vaperi','Pušači cigareta','Dualni','Pušači cigara (primarni)'],...baseAxis,axisLabel:{...baseAxis.axisLabel,color:C.ink,fontSize:12,interval:0}},
yAxis:[{type:'value',name:'urinski kotinin (ng/mL)',...baseAxis,nameTextStyle:{color:C.ink2}},{type:'value',name:'serum/saliva (ng/mL)',...baseAxis,nameTextStyle:{color:C.ink2}}],
series:[
{name:'urin (meta 2025)',type:'bar',barWidth:26,itemStyle:{color:C.juul},data:[133.7,175.87,490.19,559.74,null]},
{name:'serum (NHANES, cigare)',type:'bar',yAxisIndex:1,barWidth:26,itemStyle:{color:C.cigar},data:[0.045,null,null,null,6.2]},
{name:'saliva (meta 2025)',type:'bar',yAxisIndex:1,barWidth:26,itemStyle:{color:C.ecig},data:[1.43,193.81,188.33,224.08,null]}
]});

/* ---------- 04 VOC: sve 4 grupe (De Jesus 2020, PATH W1) ---------- */
mk('chartVOC',{
tooltip:{trigger:'axis',...baseTip,axisPointer:{type:'shadow'},formatter:p=>p.map(x=>`${x.marker} ${x.seriesName}: <b>${x.value}</b> ng/mg`).join('<br>')},
legend:{textStyle:{color:C.ink2},top:0},
grid:{left:70,right:30,top:44,bottom:64},
xAxis:{type:'category',data:['Akrolein (CEMA)','Akrolein (3-HPMA)','Akrilamid (AAMA)'],...baseAxis,axisLabel:{...baseAxis.axisLabel,color:C.ink,fontSize:12}},
yAxis:{type:'log',min:10,max:2000,name:'ng/mg kreatinina (log)',...baseAxis,nameTextStyle:{color:C.ink2}},
series:[
{name:'Nepušači',type:'bar',barWidth:'18%',itemStyle:{color:C.non},data:[79,223,67.8]},
{name:'Ekskluzivni vaperi',type:'bar',barWidth:'18%',itemStyle:{color:C.ecig},data:[120.8,338.6,88.5]},
{name:'Dualni korisnici',type:'bar',barWidth:'18%',itemStyle:{color:C.enva},data:[188.1,569.5,181.8]},
{name:'Pušači cigareta',type:'bar',barWidth:'18%',itemStyle:{color:C.cig},data:[180.1,724.4,191.9],
label:{show:true,position:'top',color:C.ink,fontSize:10,fontFamily:'ui-monospace,Menlo,monospace'}}
]});

/* ---------- 04 VOC karcinogeni: % vs nepušači ---------- */
mk('chartVOC2',{
tooltip:{trigger:'axis',...baseTip,axisPointer:{type:'shadow'},formatter:p=>p.map(x=>`${x.marker} ${x.seriesName}: <b>+${x.value}%</b> vs nepušači`).join('<br>')},
legend:{textStyle:{color:C.ink2},top:0},
grid:{left:190,right:90,top:44,bottom:56},
xAxis:{type:'log',min:1,max:30000,name:'% iznad razine nepušača (log skala, prilagođeno)',...baseAxis,nameTextStyle:{color:C.ink2}},
yAxis:{type:'category',data:['Krotonaldehid (HPMMA)','Akrilonitril (CYMA) — karcinogen'],...baseAxis,axisLabel:{...baseAxis.axisLabel,color:C.ink,fontSize:12}},
series:[
{name:'Ekskluzivni vaperi',type:'bar',barWidth:16,itemStyle:{color:C.ecig},data:[13,1002],
label:{show:true,position:'right',color:C.ink,fontSize:11,fontFamily:'ui-monospace,Menlo,monospace',formatter:'+{c}%'}},
{name:'Dualni korisnici',type:'bar',barWidth:16,itemStyle:{color:C.enva},data:[141,6569],
label:{show:true,position:'right',color:C.ink,fontSize:11,fontFamily:'ui-monospace,Menlo,monospace',formatter:'+{c}%'}},
{name:'Pušači cigareta',type:'bar',barWidth:16,itemStyle:{color:C.cig},data:[172,8901],
label:{show:true,position:'right',color:C.ink,fontSize:11,fontFamily:'ui-monospace,Menlo,monospace',formatter:'+{c}%'}}
],
graphic:[{type:'text',left:190,bottom:0,style:{text:'De Jesus 2020 · PATH Wave 1, odrasli (n=488 nepušači / 247 ENDS / 792 dualni / 2411 pušači) · propilen-oksid (2-HPMA): vaperi −20% (nisu viši), pušači +54%',fill:C.ink3,fontSize:11,fontFamily:'ui-monospace,Menlo,monospace'}}]
});


/* ---------- 03 general markers ---------- */
mk('chartGenMarkers',{
tooltip:{trigger:'axis',...baseTip,axisPointer:{type:'shadow'},formatter:p=>p.filter(x=>x.value!=null).map(x=>`${x.marker} ${x.seriesName}: <b>${x.value<=1?'≈ nepušači (n.s.)':'+'+x.value+'%'}</b>${x.value<=1?'':' iznad nepušača'}`).join('<br>')||'nema podataka'},
legend:{textStyle:{color:C.ink2},top:0},
grid:{left:190,right:120,top:40,bottom:60},
xAxis:{type:'log',min:0.9,max:1000,name:'% iznad razine nepušača (log skala)',...baseAxis,nameTextStyle:{color:C.ink2}},
yAxis:{type:'category',data:['Homocistein','Fibrinogen','Leukociti (WBC)','CRP (upala)','COHb (karboksihemoglobin)'],...baseAxis,axisLabel:{...baseAxis.axisLabel,color:C.ink,fontSize:12}},
series:[
{name:'Nepušači (baza = 0%)',type:'bar',barWidth:8,itemStyle:{color:'rgba(139,148,161,.45)'},data:[1,1,1,1,1],
label:{show:true,position:'right',color:C.ink2,fontSize:11,fontFamily:'ui-monospace,Menlo,monospace',formatter:'0'},
markLine:{silent:true,symbol:'none',lineStyle:{color:C.non,type:'dashed',width:1.5},label:{color:C.ink2,fontSize:10,fontFamily:'ui-monospace,Menlo,monospace',formatter:'nepušači = 0%'},data:[{xAxis:1}]}},
{name:'Ekskluzivni vaperi',type:'bar',barWidth:8,itemStyle:{color:C.ecig},data:[null,1,1,1,1],
label:{show:true,position:'right',color:C.ink,fontSize:11,fontFamily:'ui-monospace,Menlo,monospace',formatter:p=>p.value==null?'':'+0–1 (n.s.)'}},
{name:'Primarni pušači cigara',type:'bar',barWidth:8,itemStyle:{color:C.cigar},data:[null,1,1,1,10],
label:{show:true,position:'right',color:C.ink,fontSize:11,fontFamily:'ui-monospace,Menlo,monospace',formatter:p=>p.value==null?'':(p.value<=1?'+0–1 (n.s.)':`+${p.value}%`)}},
{name:'Pušači cigareta',type:'bar',barWidth:8,itemStyle:{color:C.cig},data:[12,7,21,100,400],
label:{show:true,position:'right',color:C.ink,fontSize:11,fontFamily:'ui-monospace,Menlo,monospace',formatter:p=>p.value==null?'':`+${p.value}%`}}
],
graphic:[{type:'text',left:190,bottom:0,style:{text:'Cigarete: NHANES III/PLoS Med 2005 · Bazzano 2003 · cigare: Wannamethee 2005 (≈ nepušači za CRP/WBC/fibrinogen) + Turner 1977 (COHb) · vaperi: PATH W1 & NHANES 2013–23 (sve n.s. vs nepušači)',fill:C.ink3,fontSize:11,fontFamily:'ui-monospace,Menlo,monospace'}}]
});


/* ---------- 05 switching ---------- */
mk('chartSwitch',{
tooltip:{...baseTip,formatter:p=>`${p[0].name}<br>smanjenje: <b>−${p[0].value}%</b>`},
legend:{textStyle:{color:C.ink2},top:0},
grid:{left:220,right:60,top:50,bottom:40},
xAxis:{type:'value',max:100,name:'% smanjenja biomarkera',...baseAxis,nameTextStyle:{color:C.ink2}},
yAxis:{type:'category',data:[
'Vuse Solo — benzen/akrilonitril (5d)',
'Vuse Vibe — COHb (5d)',
'Vuse Ciro — COHb (5d)',
'Vuse — NNN (5d)',
'Vuse — B[a]P (5d)',
'JUUL — agregat 8 BOE (5d)',
'JUUL — agregat vs abstinencija (5d)',
'IQOS — TSNA (5d)',
'IQOS — CO (5d)',
'IQOS — benzen (5d)',
'IQOS — butadien (5d)',
'IQOS — akrolein (5d)',
'THP 360 dana — održana smanjenja'],...baseAxis,axisLabel:{...baseAxis.axisLabel,color:C.ink,fontSize:11.5}},
series:[{type:'bar',barWidth:14,
data:[
{value:85,itemStyle:{color:C.vuse}},
{value:52.8,itemStyle:{color:C.vuse}},
{value:55.4,itemStyle:{color:C.vuse}},
{value:97,itemStyle:{color:C.vuse}},
{value:80,itemStyle:{color:C.vuse}},
{value:85,itemStyle:{color:C.juul}},
{value:85.3,itemStyle:{color:C.non}},
{value:56,itemStyle:{color:C.cigar}},
{value:77,itemStyle:{color:C.cigar}},
{value:94,itemStyle:{color:C.cigar}},
{value:92,itemStyle:{color:C.cigar}},
{value:58,itemStyle:{color:C.cigar}},
{value:70,itemStyle:{color:C.enva}}],
label:{show:true,position:'right',color:C.ink,fontSize:11,fontFamily:'ui-monospace,Menlo,monospace',formatter:p=>'−'+p.value+'%'}
}]});

/* ---------- 06 FMD ---------- */
mk('chartFMD',{
tooltip:baseTip,legend:{textStyle:{color:C.ink2},top:0},
grid:{left:60,right:30,top:50,bottom:60},
xAxis:{type:'category',data:['Nepušači / kontrole','Ekskluzivni vaperi','Pušači cigareta','Djeca — pasivni aerosol HTP','Djeca — pasivni dim'],...baseAxis,axisLabel:{...baseAxis.axisLabel,color:C.ink,fontSize:11,interval:0}},
yAxis:{type:'value',name:'FMD (%) — funkcija endotela',max:12,...baseAxis,nameTextStyle:{color:C.ink2}},
series:[{type:'bar',barWidth:38,
data:[
{value:10.7,itemStyle:{color:C.non}},
{value:5.3,itemStyle:{color:C.ecig}},
{value:6.5,itemStyle:{color:C.cig}},
{value:5.51,itemStyle:{color:C.cigar}},
{value:5.78,itemStyle:{color:C.cig}}],
label:{show:true,position:'top',color:C.ink,fontFamily:'ui-monospace,Menlo,monospace',formatter:'{c}%'}
}],
graphic:[{type:'text',left:70,bottom:0,style:{text:'Mohammadi 2022 (odrasli, kronična uporaba) · Loffredo 2020 (djeca, pasivna izloženost)',fill:C.ink3,fontSize:11,fontFamily:'ui-monospace,Menlo,monospace'}}]
});

/* ---------- 07 OR chart ---------- */
mk('chartOR',{
tooltip:{...baseTip,formatter:p=>`${p.name}<br>OR = <b>${p.value[1]}</b> (95% CI ${p.value[2]}–${p.value[3]})`},
grid:{left:220,right:50,top:40,bottom:50},
xAxis:{type:'value',min:0,max:2,name:'odds ratio (isprekidana linija = 1,0)',...baseAxis,nameTextStyle:{color:C.ink2}},
yAxis:{type:'category',data:['KOPB — vaping vs cigarete','Astma — vaping vs cigarete','Oralne bolesti — vaping vs cigarete','MI — vaping vs cigarete (reanaliza)','Moždani udar — vaping vs cigarete (rean.)','CVD — vaping vs cigarete (n.s.)','MI — dual vs cigarete','Moždani udar — dual vs cigarete','KOPB — dual vs cigarete'],...baseAxis,axisLabel:{...baseAxis.axisLabel,color:C.ink,fontSize:11.5}},
series:[{type:'custom',
renderItem:(p,api)=>{const y=api.coord([0,api.value(0)])[1];const x=api.coord([api.value(1),0])[0];const xl=api.coord([api.value(2),0])[0];const xh=api.coord([api.value(3),0])[0];const col=api.value(4);
return{type:'group',children:[
{type:'line',shape:{x1:xl,y1:y,x2:xh,y2:y},style:{stroke:col,lineWidth:2}},
{type:'circle',shape:{cx:x,cy:y,r:6},style:{fill:col}}]};},
data:[
[0,0.53,0.38,0.74,C.ecig],
[1,0.84,0.75,0.95,C.ecig],
[2,0.87,0.76,1.00,C.ecig],
[3,0.48,0.35,0.67,C.vuse],
[4,0.65,0.49,0.86,C.vuse],
[5,0.81,0.58,1.14,C.non],
[6,1.41,1.18,1.68,C.cig],
[7,1.39,1.06,1.82,C.cig],
[8,1.32,1.17,1.50,C.cig]],
markLine:{symbol:'none',lineStyle:{color:C.ink3,type:'dashed'},label:{show:false},data:[{xAxis:1}]}
}]});

/* ---------- 07 deaths ---------- */
mk('chartDeaths',{
tooltip:{...baseTip,formatter:p=>`${p[0].name}<br><b>${p[0].value.toLocaleString('hr')}</b> smrti godišnje`},
grid:{left:140,right:60,top:30,bottom:50},
xAxis:{type:'log',min:10,max:2000000,name:'smrti godišnje u SAD-u (log)',...baseAxis,nameTextStyle:{color:C.ink2}},
yAxis:{type:'category',data:['EVALI (2019–20, ukupno)','Cigare','Cigarete'],...baseAxis,axisLabel:{...baseAxis.axisLabel,color:C.ink,fontSize:13}},
series:[{type:'bar',barWidth:26,
data:[{value:68,itemStyle:{color:C.enva}},{value:9000,itemStyle:{color:C.cigar}},{value:480000,itemStyle:{color:C.cig}}],
label:{show:true,position:'right',color:C.ink,fontFamily:'ui-monospace,Menlo,monospace',formatter:p=>p.value.toLocaleString('hr')}
}]});

/* ---------- 08 ENVA TSNA ---------- */
mk('chartENVA',{
tooltip:baseTip,legend:{textStyle:{color:C.ink2},top:0},
grid:{left:70,right:30,top:50,bottom:60},
xAxis:{type:'category',data:['bez dodanog nitrita','+ 2 µg/g nitrita','+ 10 µg/g nitrita'],...baseAxis,axisLabel:{...baseAxis.axisLabel,color:C.ink,fontSize:12}},
yAxis:{type:'value',name:'NNK (ng/g)',...baseAxis,nameTextStyle:{color:C.ink2}},
series:[
{name:'u tekućini',type:'bar',barWidth:34,itemStyle:{color:C.juul},data:[0,0.64,2.63],label:{show:true,position:'top',color:C.ink,fontSize:11,fontFamily:'ui-monospace,Menlo,monospace',formatter:p=>p.value===0?'ND':p.value}},
{name:'u aerosolu',type:'bar',barWidth:34,itemStyle:{color:'#d94f70'},data:[0,12.0,53.8],label:{show:true,position:'top',color:C.ink,fontSize:11,fontFamily:'ui-monospace,Menlo,monospace',formatter:p=>p.value===0?'<0,37':p.value}}
],
graphic:[{type:'text',left:70,bottom:0,style:{text:'Jin i sur. 2022: nitrit u tekućini → TSNA nastaje tijekom aerosolizacije (19–20x više u aerosolu)',fill:C.ink3,fontSize:11,fontFamily:'ui-monospace,Menlo,monospace'}}]
});

/* ---------- 10 continuum ---------- */
mk('chartContinuum',{
tooltip:{trigger:'item',...baseTip,formatter:p=>`${p.name}<br>kompozitni indeks rizika: <b>${p.value[0]}</b> / 100`},
grid:{left:60,right:40,top:40,bottom:60},
xAxis:{type:'value',min:0,max:110,name:'kompozitni relativni rizik (cigareta = 100)',...baseAxis,nameTextStyle:{color:C.ink2}},
yAxis:{type:'category',data:['Nepušači','JUUL / Vuse (mjereno)','ENVA Sol (procjena, bez mjerenja)','Cigare — povremeno','IQOS / grijani duhan','Cigare — dnevno','Cigarete'],...baseAxis,axisLabel:{...baseAxis.axisLabel,color:C.ink,fontSize:12}},
series:[{type:'scatter',symbolSize:30,
data:[
[0,0,'',C.non],
[3,1,'',C.ecig],
[7,2,'',C.enva],
[8,3,'',C.cigar],
[25,4,'',C.cigar],
[75,5,'',C.cigar],
[100,6,'',C.cig]].map(d=>({value:[d[0],d[1]],itemStyle:{color:d[3]}})),
label:{show:true,position:'top',color:C.ink2,fontSize:11,fontFamily:'ui-monospace,Menlo,monospace',formatter:p=>p.value[0]}
}]});

/* ---------- 09 study database ---------- */
const STUDIES=[
["Goniewicz i sur.",2014,"Emisije / karbonili","Lab · 12 brandova","Toksikanti u aerosolu 9–450x niži od dima cigarete (Tob Control)",1],
["Kosmider i sur.",2014,"Emisije / temperatura","Lab · varijabilni napon","Napon 3,2→4,8 V: karbonili rastu 4–200x; formaldehid na visokom naponu doseže cigaretnu razinu",0],
["Sleiman i sur.",2016,"Emisije / temperatura","Lab · ES&T","Glycidol i propilen-oksid u aerosolu; akrolein raste 10x pri 4,8 V; single-coil gori",0],
["Jensen i sur.",2015,"Emisije / karbonili","Lab · NEJM","Formaldehid-hemiacetali na 5 V; kontroverzno — režim suhog udara",0],
["Salamanca i sur.",2018,"Emisije / karbonili","Lab · Sci Rep","Hemiacetali u višestrukom višku nad gasovitim HCHO; na 3,8 V nedetektabilni",0],
["Farsalinos i sur.",2017,"Emisije / metodologija","Lab + iskusni vaperi","Ekstremne emisije = suhi udar koji korisnici izbjegavaju; novi atomizer 94–99,8% manje karbonila",0],
["Geiss i sur.",2016,"Emisije / temperatura","Lab · IR termografija","Zavojnica >300 °C na 20 W; okus 'prevruć' od 20 W; emisije strmo rastu od 15 W",0],
["Margham i sur.",2016,"Emisije / Vuse","Lab · 150 analita (BAT)","Vype ePen: 104 analita nedetektabilna; ostali >99% ispod cigarete po puffu",0],
["Son i sur.",2020,"Emisije / usporedba uređaja","Lab · 4 tipa uređaja","JUUL: najmanje karbonila i CO od svih tipova; top-coil najviše formaldehida",0],
["Gillman i sur.",2016,"Emisije / snaga","Lab · 5–11,4 W","Formaldehid 0,3→380 µg/10 puffova sa snagom",0],
["Bekki / Uchiyama i sur.",2014,"Emisije / karbonili","Lab · 13 japanskih brandova","Bimodalne emisije karbonila; maks. 140 µg formaldehida/10 puffova",0],
["Chen W. i sur.",2018,"Emisije / temperatura","Lab · PLoS ONE","Top-coil: 322–1008 °C suho, 110–185 °C mokro — objašnjava varijabilnost emisija",0],
["Termalni model zavojnice",2025,"Emisije / temperatura","Lab + model · SSRN","2–8 W: vršna temperatura ovisi o snazi; talog karbona diže otpor",0],
["Olmedo i sur.",2018,"Emisije / metali","Lab + korisnici · EHP","Olovo, krom, nikal, mangan iznad granica u ~50% aerosola; metali iz zavojnice",1],
["Aherrera i sur.",2017,"Biomarkeri / metali","Korisnici · n=56","Nikal i krom u urinu/slini koreliraju s aerosolom — potvrda izloženosti",1],
["Zhao D. i sur.",2020,"Emisije / metali","Lab · otvoreni vs zatvoreni","Metali iz uređaja, ne iz tekućine; rastu sa starošću zavojnice",0],
["Jin i sur.",2022,"Emisije / TSNA","Lab · modeli tekućina","Nitrit + alkaloidi → TSNA nastaje u aerosolizaciji; bez nitrita TSNA nedetektabilni",0],
["Farsalinos i sur. (TSNA)",2015,"Emisije / TSNA","Lab · tekućina vs aerosol","Aerosol nikad ne prelazi TSNA tekućine — isparavanje ne stvara nitrozamine",0],
["Frontiers Oncol — TSNA pregled",2025,"Emisije / TSNA","Sustavni pregled","TSNA u e-cig aerosolima = onečišćenja sirovine, ne produkti korištenja",0],
["Stephens W.",2018,"Rizik / model","Model · 14 studija emisija","Karcinogena potentnost e-cig <1% dima; doživotni rizik EC 0,004 vs cigareta",0],
["Analiza MOE HTP/EC",2021,"Rizik / model","Model","Zatvorene EC: relativni doživotni rizik raka 0,009–0,014 vs cigareta",0],
["Allen i sur.",2016,"Emisije / arome","Lab · 51 okus · EHP","Diacetil u 39/51 okusa; barem 1 aroma-spoj u 47/51",0],
["Czoli / Hammond i sur.",2019,"Emisije / arome","Lab · Kanada","Identifikacija aroma-spojeva i potencijalnih toksikanata u e-tekućinama",0],
["Shahab i sur.",2017,"Biomarkeri / TSNA+VOC","Presječna · n=181 · UK","NNAL kod e-cig/NRT korisnika −97% vs pušači; nikotin jednak",1],
["Goniewicz i sur. (PATH)",2018,"Biomarkeri / PATH","Kohorta · Wave 1","Ekskluzivni vaperi: NNAL 6,3 ng/g; većina toksikanata na pozadinskoj razini",1],
["Xia i sur. (PATH)",2021,"Biomarkeri / PATH","Kohorta · Wave 3–4","E-cig korisnici: NNAL 3,7–64,5x niže od pušača; metali slični",1],
["Meta-analiza biomarkera",2025,"Biomarkeri / meta","16 studija · n=24.079","NNAL: vaperi 7,9 vs pušači 169,7 vs nepušači 5,4; IL-6/IL-8 kod vapera",1],
["Pulvers i sur.",2018,"Biomarkeri / VOC","Presječna · odrasli","VOC metaboliti kod ekskluzivnih vapera detektabilni, ispod pušača",1],
["Rubinstein i sur.",2018,"Biomarkeri / adolescencija","Kontrolirana · n=103 · Pediatrics","Adolescentni vaperi: 5 VOC-a do 3x iznad kontrola; dualni još 3x više",1],
["De Jesus i sur.",2020,"Biomarkeri / VOC","PATH Wave 1 · n=3.938 · Nicotine Tob Res","VOC metaboliti: nepušači < vaperi < dualni ≈ pušači; akrilonitril (CYMA) +1002% vaperi / +8901% pušači",1],
["Chen J. i sur.",2014,"Biomarkeri / cigare","NHANES 1999–2012 · n=25.522","Pušači cigara: kotinin 6,2 ng/mL, NNAL 19,1 pg/mg; dnevni ≈ pušači cigareta",1],
["Chang i sur.",2019,"Biomarkeri / cigare","PATH Wave 1 · n=5.604","Dnevni pušači cigara: NNAL 248,7 ng/g ≈ cigarete; filtrirane cigare 979 ng/g",1],
["Dai i sur.",2023,"Biomarkeri / premium cigare","Kohorta","Premium cigare: povišeni kotinin, NNAL i markeri oksidativnog stresa",1],
["PATH Wave 7 — cigare",2025,"Biomarkeri / cigare","Kohorta · 2022–23","Kadmij, olovo, uran i kotinin povišeni; kadmij/olovo na razini cigareta",1],
["Rodriguez i sur. (MESA)",2010,"Biomarkeri / cigare","Kohorta MESA","Kotinin ekskluzivnih pušača cigara: iznad nepušača, ispod cigareta",1],
["NHANES — metali/CBC",2025,"Biomarkeri / metali","NHANES 2013–23 · n=756","Pušači: povišeni olovo, kadmij, WBC; vaperi: manja odstupanja",1],
["UPF — slina pooling",2023,"Biomarkeri / TSNA","2 studije · n=851","Kotinin viši kod svih korisnika nikotina; TSNA najniži kod nepušača",1],
["Göney i sur. (Turska)",2016,"Biomarkeri / kotinin","Presječna","Urinski kotinin vapera korelira s koncentracijom nikotina u tekućini",1],
["Biomarkeri SHS adolescenata",2025,"Biomarkeri / pasivna","Kohorta · n=2.379","Pasivni dim: NNAL 4,1 pg/mg; pasivni aerosol: samo kotinin",1],
["JAMA — djeca SHS",2024,"Biomarkeri / pasivna","NHANES · n=1.777 · djeca 3–11","Kotinin: pasivni dim 0,494 vs pasivni aerosol 0,081 vs čisto 0,016 µg/L",1],
["Vuse Solo switching",2017,"Klinička / switching","RCT · n=153 · 5 dana","Biomarkeri pali 30–>85%; usporedivo s nikotinskom gumom",0],
["Vuse Vibe/Ciro switching",2023,"Klinička / switching","RCT · 5–7 dana","COHb −53/−55%; NNN −80–97%; B[a]P −67–80%; tromboksani dolje",0],
["JUUL SRNT",2019,"Klinička / switching","RCT · n=90 · 5 dana","Agregat 8 BOE-a −85,0% vs −85,3% abstinencija (jednako)",0],
["JUUL 6-dnevna",2021,"Klinička / switching","RCT · n=279 · 11 grupa","NNAL, 3-HPMA, MHBMA, S-PMA, COHb značajno dolje; dual-use manje",0],
["Gale i sur. (THP 360d)",2022,"Klinička / dugoročna","Ambulantna · 1 godina","Održana smanjenja BoE; BoPH prema razinama nepušača",1],
["BAT real-world Vuse",2022,"Klinička / presječna","n=4 grupe · UK","Vaperi >6 mj.: biomarkeri bliži bivšim pušačima nego pušačima",1],
["Hajek i sur.",2019,"Klinička / prestanak","RCT · n=886 · NEJM","Apstinencija 1 g.: e-cig 18,0% vs NRT 9,9% (RR 1,83)",0],
["Cochrane living review",2025,"Klinička / prestanak","Meta · 90 studija · ~29.000","Visoka sigurnost: e-cig bolji od NRT (RR 1,55–1,59)",0],
["Bullen i sur.",2010,"Klinička / prestanak","RCT","Prva RCT e-cig vs NRT — usporediva apstinencija",0],
["Lüdicke i sur. (THS 2.1)",2017,"Klinička / IQOS","RCT · 5 dana · Poljska","HPHC biomarkeri −47 do −96% uz jednak unos nikotina",0],
["Haziza i sur. (THS 2.2)",2016,"Klinička / IQOS","RCT · 5 dana · Poljska","Značajna smanjenja BoE uz prelazak na THS",0],
["Lüdicke i sur. (mTHS)",2018,"Klinička / IQOS","RCT · 90 dana · Japan","Mentol THS: 50–94% smanjenja biomarkera",0],
["Haziza i sur. (SAD)",2020,"Klinička / IQOS","RCT · 5 dana","mTHS SAD: smanjenja BoE potvrđena",0],
["Yuki i sur.",2018,"Klinička / HTP","RCT · 90 dana · Japan (JT)","Smanjenja BoE uz japanski HTP",0],
["IQOS 26-tjedna (SAD)",2020,"Klinička / IQOS","Ambulantna · 26 tj.","Umjerenija smanjenja (16–49%); dual korisnici ~10%",0],
["BAT Glo vs IQOS Japan",2019,"Klinička / HTP","RCT · 5 dana","Oba HTP-a: BoE −20 do −90%",0],
["Carnevale i sur.",2016,"Kardio / akutno","Crossover · n=40","E-cig i cigareta: ↑NOX2, ↑8-izo-PGF2α, ↓FMD — e-cig manje",1],
["Mohammadi i sur.",2022,"Kardio / kronično","Presječna + in vitro","FMD: vaperi 5,3% i pušači 6,5% vs 10,7%; S100A8/RAGE viši kod vapera",1],
["Caporale i sur.",2019,"Kardio / akutno","MRI · n=31 · bez nikotina","Vaskularne promjene i od aerosola bez nikotina",0],
["Biondi-Zoccai i sur.",2019,"Kardio / akutno","Crossover · n=20 · SUR-VAPES","Svi proizvodi pogoršavaju oksidativni stres/FMD; HTP<e-cig<cigareta",0],
["Loffredo i sur.",2020,"Kardio / djeca pasivno","n=78 · djeca","Pasivni HTP ≈ pasivni dim: ↑izoprostani, ↓FMD, ↑P-selektin",1],
["Ikonomidis i sur.",2019,"Kardio / HTP","n=75 · 1 mjesec","Prelazak na HTP: bolji FMD, CFR, PWV, MDA, TxB2",0],
["Boakye i sur.",2021,"Kardio / kronično","n=46","FMD i upalni markeri: bez značajne razlike vaperi vs ne-korisnici",1],
["Haptonstall i sur.",2020,"Kardio / kronično","n=136","Akutni TC pogoršava FMD; akutni EC ne; bazalno bez razlike",1],
["Antoniewicz i sur.",2019,"Kardio / akutno","Zdravi volonteri","10 puffova e-cig: ↑endotelne progenitorske stanice ≈ cigareta",0],
["Blount i sur. (EVALI)",2020,"EVALI","BAL · n=51+99 · NEJM","Vitamin E acetat u 48/51 bolesnika (94%), 0/99 kontrola",1],
["Thanavala i sur.",2020,"EVALI","Mišji model","VEA uzrokuje upalni odgovor i lipidne makrofage — kauzalna karika",0],
["Lee H.-W. i sur.",2018,"Mehanizam / DNA","Miš + ljudske stanice · PNAS","ECS: DNA adukti u plućima/mjehuru/srcu; ↓DNA popravak",0],
["Tang i sur.",2019,"Mehanizam / rak","Miš · PNAS","ECS: adenokarcinom pluća i hiperplazija mjehura u miševa (n=40)",0],
["Ganapathy i sur.",2017,"Mehanizam / DNA","Stanice · PLoS ONE","EC aerosol: oksidativna DNA oštećenja, supresija antioksidansa",0],
["Bhatta & Glantz",2020,"Ishodi / respiratorno","PATH longitudinalno","Vaping: AOR 1,29 incidentne respiratorne bolesti, neovisno o pušenju",0],
["Glantz i sur.",2024,"Ishodi / meta","107 studija · NEJM Evid.","CVD/stroke: bez razlike vs cigarete; KOPB 0,53, astma 0,84; dual gori",0],
["Lee P. i sur. — reanaliza",2025,"Ishodi / meta","Reekstrakcija","MI 0,48, stroke 0,65, KOPB 0,46 za vaping vs cigarete",0],
["Alzahrani i sur.",2018,"Ishodi / MI","NHIS · presječna","Dnevno vaping povezano s MI (kontroverzno, reverse causation)",0],
["Xie W. i sur.",2020,"Ishodi / respiratorno","PATH · presječna","E-cig i respiratorna simptomatologija",0],
["Cook i sur.",2023,"Ishodi / KOPB","PATH · longitudinalno","KOPB ishodi po kategorijama proizvoda",0],
["Hirschtick i sur.",2021,"Ishodi / CVD","PATH · longitudinalno","MI/stroke po proizvodima uz kontrolu reverse causation",0],
["Bricknell i sur.",2021,"Ishodi / stroke","BRFSS","Moždani udar i e-cig (presječno)",0],
["Falk i sur.",2022,"Ishodi / CVD","NHIS","MI i stroke kod vapera vs pušača",0],
["Parekh i sur.",2020,"Ishodi / stroke","BRFSS","Mlađi odrasli: e-cig i moždani udar",0],
["Wills i sur.",2021,"Ishodi / KOPB","BRFSS","E-cig i KOPB/astma",0],
["Perez M. i sur.",2019,"Ishodi / respiratorno","PATH","Piskanje u prsima i e-cig",0],
["Osei i sur.",2019,"Ishodi / CVD","BRFSS","E-cig, MI i koronarna bolest",0],
["Chang C. i sur.",2015,"Ishodi / cigare smrtnost","Sustavni pregled · 22 studije","3–10x rizik smrti od oralnih/larinks/eofag. karcinoma i bez udisanja",0],
["NCI Monograph 9",1998,"Ishodi / cigare","Monografija","RR smrtnosti raste s dozom: 1,02 / 1,08 / 1,17 po broju cigara/dan",0],
["NASEM — premium cigare",2022,"Ishodi / cigare","Izvještaj akademija","Zdravstveni učinci premium cigara; dokazi ovisni o dozi i udisanju",0],
["CDC — cigare",2024,"Ishodi / cigare","Nacionalna procjena","~9.000 preranih smrti/god.; $1,8 mlrd zdravstvenih troškova",0],
["Nonnemaker i sur.",2014,"Ishodi / cigare","Model · NHIS","Procjena cigar-atributivne smrtnosti (~9.000/god.)",0],
["NASEM 2018 — e-cigarete",2018,"Sinteza","Izvještaj akademija","Manje toksikanata u e-cig, ali dugoročni učinci nepoznati",0],
["IQOS scoping review",2024,"Sinteza / HTP","Pregled","Skup dokaza o toksičnosti i zdravstvenom učinku IQOS-a",0],
["Tox Reports — HTP/EC RCT pregled",2021,"Sinteza / klinička","Sustavni pregled RCT","Skup switching RCT-eva HTP i e-cig proizvoda",0],
["Farsalinos & Gillman",2018,"Sinteza / karbonili","Pregled","Metodološka kritika mjerenja karbonila; suhi udar kao artefakt",0],
["JAOTC / EU izvještaj",2024,"Sinteza / EU","Regulatorni izvještaj","Zdravstveni rizici novih proizvoda; varijable emisija",0],
["EPA biomonitoring — kotinin",2022,"Biomarkeri / pasivna","NHANES 1988–2016","Trendovi serumske kotinine kod nepušačke djece",1],
["Rodriguez i sur.",2024,"Biomarkeri / pasivna","n=48 dijada","Metaboliti pasivnog vapinga u slini/dahu djece; oksidativni stres",1],
["Behera i sur.",2014,"Biomarkeri / kotinin","Presječna","Urinski kotinin pušača 2.736 ng/mL; pasivni 285,75",1],
["Sharma i sur. (referenca)",2020,"Biomarkeri / meta","Meta-analiza","Razlikovanje nepušača, vapera i pušača po kotininu",1],
["CORESTA — JUUL temp.",2019,"Emisije / temperatura","Lab · IR + senzori (JUUL Labs)","JUUL: prosjek atomizera <300 °C; aktivna regulacija temperature",0],
["Bucknell — JUUL metali",2021,"Emisije / metali","Lab · ICP-MS","JUUL element Cr/Ni/Fe na 200–250 °C; porast Cr i Ni nakon vapinga",0],
["Williams i sur.",2013,"Emisije / metali","Lab · 22 kartomizera · PLoS ONE","Aerosol: Sn, Ag, Fe, Ni, Al, silikati; nanočestice Sn/Cr/Ni <100 nm; Ni 2–100x iznad Marlboro dima; silikati iz staklenog fitilja",0],
["Zhao i sur. (sub-ohm)",2019,"Emisije / metali","Lab · otvoreni sustavi 20–200 W","Ni do 147, Pb do 199 ng/puff na 200 W; pod-uređaji (JUUL 0,014–0,066 ng Ni/puff) redove veličine niže",0],
["Prieto i sur. (prijenos metala)",2022,"Emisije / metali","Lab · nichrome mod · AAS","Cr/Ni prelaze izravno iz žice u aerosol; koncentracije rastu s brojem puffova i snagom; Cu/Pb preko tekućine",0],
["Gray i sur. (Evolving EC)",2020,"Emisije / metali","Lab · 5 e-cig vs 2 cigarete · Front Toxicol","NiFe zavojnica ne povećava metale (osim malog Zn); 99% smanjenje prioritetnih toksikanata vs dim",0],
["Quartz vs Ceramic coil",2024,"Emisije / keramika","Lab · lifecycle · ICP-OES (industrija)","Keramika: 13.644 silikatnih čestica vs kvarc 3.178; keramika više aldehida (akrolein, butiraldehid); teški metali minimalni kod oba",0],
["CalState — tip zavojnice",2022,"Emisije / keramika","Lab · GT8/GT4 nichrome vs GT CCell keramika","CCell: SS316 zavojnica + keramički sloj između fitilja i žice; keramika mijenja profil metala u aerosolu i spremniku",0],
["Olmedo — tip zavojnice (Kanthal)",2018,"Emisije / metali","Korisnici · n=56 · EHP","Kanthal zavojnice: Cr, Fe, Mn, Ni, Pb, Sn u aerosolu viši od ostalih tipova zavojnica",1],
["Woo i sur. (mozak)",2021,"Biomarkeri / mozak","Miš · 2 mj. · ICP-MS 9 regija","Akumulacija neurotoksičnih metala u mozgu: Pb +185% striatum, +259% korteks; Cu +42%; Fe +26%; Mn +18%; krv: Cr +41%",1],
["Woo i sur. (pregled)",2026,"Biomarkeri / mozak","Pregled · Chem Res Toxicol","Dinamička kemija aerosola; metali u mozgu i neurodegenerativni rizik kronične izloženosti",0],
["Urinski metali JHU",2026,"Biomarkeri / metali","n=143 vaperi vs 80 kontrola","Urinski Cr 2,46x i Pb 1,95x viši kod vapera; linearni trend Al, Cr, Fe, Mn, Ni, Pb, Cd s intenzitetom",1],
["KNHANES — metali",2025,"Biomarkeri / metali","KNHANES 2013–17 · n~10.000","E-cig korisnici (uklj. dualne): Pb +10%, Hg +13,7%, Cd +61,4% u serumu vs nepušači",1],
["NHANES — krvni metali",2025,"Biomarkeri / metali","NHANES 2013–23 · n=756 · 18–30 g.","Pušači: viši krvni Pb i Cd; ekskluzivni vaperi: bez razlike u Pb, Cd čak niži od nepušača",1],
["Prokopowicz i sur.",2019,"Biomarkeri / metali","n=156 · prebacivanje","Krvni Cd: nepušači 0,31 · vaperi 0,44 · dualni 1,38 · pušači 1,44 µg/L",1],
["PATH adolescencija — metali",2024,"Biomarkeri / metali","PATH Wave 5 · n=200 · 13–17 g.","Česti vaperi: više urinsko olovo i uranij 2,3x; slatki okusi > mentol po uraniju",1],
["Španjolska — metali",2021,"Biomarkeri / metali","n=100 · urin/kosa/EBC","Aerosol/spremnik >> dozator: Ni 91x, Cr 7x, Zn 45x, Pb 12x viši; urin: Cr, Cu, Sn, Pb viši kod vapera",1],
["Vuse Pro One — FlavourFlow",2025,"Tehnologija / keramika","Proizvođač · specifikacija","Keramički grijač s FlavourFlow™; tekućina kroz keramiku; bez sukraloze; 1000 puffova/pod",0],
["Vuse Alto — FEELM",2024,"Tehnologija / keramika","FDA PMTA dokumentacija","FDA-odobreni Alto podovi koriste FEELM keramičku zavojnicu — ista platforma kao Pro One",0],
["AlzDiscovery — mozak",2025,"Sinteza / neuro","Pregled","Nikotinske soli povećavaju ispustanje metala iz zavojnice; etil-maltol povećava unos metala u stanice",0],
["JUUL Labs Science — 6d poster",2021,"Klinička / switching","Poster · n=279","NNAL, 3-HPMA, NikEkv značajno niže uz JUUL 3%",0],
["Harris C.C. — komentar",2018,"Mehanizam / rasprava","PNAS commentary","Kontekstualizacija Lee 2018: rizik postoji, ali << pušenje",0],
["Li Volti / Polosa — komentar",2018,"Mehanizam / rasprava","PNAS commentary","Kritika doza u Lee 2018: nerealne ekspozicije",0],
["Queimado i sur. — komentar",2018,"Mehanizam / DNA","PNAS commentary","Konzistentnost DNA oštećenja kroz vrste",0],
["Borrelli & O'Connor — editorial",2019,"Klinička / prestanak","NEJM editorial","Kontekst Hajek 2019: 18% ≈ vareniklin; oprez s dugoročnim vapingom",0],
["EU RJR / SCOTUS kontekst",2025,"Regulativa","Sudska praksa","Regulatorni okvir PMTA za odobrene proizvode",0],
["Prochaska i sur. — pregled",2021,"Emisije / nikotin","Pregled · JUUL farmakokinetika","JUUL 5%: 39,3–48,3 mg nikotina/podu; aerosol 72–164 µg/puff (prijenos ~68%); 200 puffova ≈ 13–30 cigareta; switching studija ≈ 18 cig/d",1],
["Bucknell i sur.",2021,"Emisije / metali","Lab · JUUL tekućina prije/poslije korištenja","Krom i nikal u JUUL tekućini rastu nakon kontakta s grijačem; nichrome element 200–250 °C",0],
["EU TPD / EU-CEG sustav",2014,"Regulativa","Direktiva 2014/40/EU","Notifikacija ≠ odobrenje: dosje (emisije, toksikologija) podnosi se 6 mj. prije tržišta; nije javno dostupno; EC-ID se ne može javno provjeriti",0],
["ENVA Sol — TPD notifikacija",2025,"Regulativa","EC-ID 02828-25-90142 (NL)","Notifikacija za EU preko Nizozemske; bez javnih laboratorijskih izvještaja; RAPEX bez zapisa",0],
["NHANES III / PLoS Medicine",2005,"Biomarkeri / upala","Presječna · n>4.000","Pušači 30+/dan: WBC 8.190 vs 6.760; fibrinogen 9,43 vs 8,82 µmol/L; CRP detektabilan OR 1,91; oporavak postupan, CRP najsporiji",1],
["King i sur.",2017,"Biomarkeri / upala","Longitudinalna · n=1.652 pušača · ATVB","CRP 4,6 mg/L, fibrinogen 286 mg/dL, CO 14,4 ppm kod pušača; godina abstinencije: značajan pad F2-izoprostana i leukocita",1],
["Bazzano i sur.",2003,"Biomarkeri / upala","NHANES III","Homocistein kod pušača +10–15%; raste s dozom pušenja",1],
["Chen i sur. (cigare)",2017,"Biomarkeri / cigare","NHANES 1999–2012","Primarni pušači cigara: kotinin 6,2 vs 0,045 ng/mL (137x); NNAL 19,1 vs 1,01 pg/mg; viši olovo i kadmij od nekorisnika",1],
["PATH Wave 1 — cigare",2018,"Biomarkeri / cigare","PATH · n=5.604","Dnevni pušači cigara: NNAL i akrilonitril usporedivi s pušačima cigareta; filtrirane cigare s najvišim biomarkerima",1],
["Turner i sur.",1977,"Biomarkeri / cigare","Lab · COHb mjerenja","Primarni pušači cigara/lule: COHb 0,8→1,0% (vs 3–8% pušači cigareta) — dim se ne udiše duboko",1],
["Venn & Britton",2007,"Biomarkeri / pasivna","NHANES III · pasivna izloženost","Pasivni pušači: povišeni fibrinogen i homocistein; homocistein raste kroz kvartile kotinina",1],
["Japanska kohorta radnika",2015,"Biomarkeri / upala","n=5.102 radnika · 30–60 g.","Fibrinogen i WBC viši kod pušača; kod bivših padaju s trajanjem abstinencije",1]
];
const catSet=[...new Set(STUDIES.map(s=>s[2]))];
const sel=document.getElementById('dbCat');
if(sel){catSet.sort().forEach(c=>{const o=document.createElement('option');o.value=c;o.textContent=c;sel.appendChild(o);});
function renderStudies(){
const q=document.getElementById('dbSearch').value.toLowerCase();
const cat=document.getElementById('dbCat').value;
const non=document.getElementById('dbNon').value;
const rows=STUDIES.map((s,i)=>({s,i})).filter(({s})=>
(!q||s.join(' ').toLowerCase().includes(q))&&(!cat||s[2]===cat)&&(!non||s[5]==1));
document.getElementById('studyCount').textContent=`${rows.length} / ${STUDIES.length} studija`;
document.getElementById('studyBody').innerHTML=rows.map(({s,i})=>
`<tr><td>${i+1}</td><td>${s[1]}</td><td><a href="studije/${i+1}/" style="color:inherit;border:none">${s[5]==1?'♦ ':''}${s[0]}</a></td><td>${s[2]}</td><td>${s[3]}</td><td>${s[4]}</td><td><a href="studije/${i+1}/" title="Otvori zapis studije" style="border:none">↗</a></td></tr>`).join('');
}
['dbSearch','dbCat','dbNon'].forEach(id=>document.getElementById(id).addEventListener('input',renderStudies));
renderStudies();}

/* ---------- product image modal ---------- */
(function(){
const root=document.getElementById('pgal');if(!root)return;
const PGAL={
juul:{title:'JUUL / JUUL2',imgs:[
['img/juul2.jpg','JUUL2 uređaj i podovi — EU/UK verzija, 18 mg/mL, 1,2 mL podovi (foto: juul.co.uk / evapo.co.uk)']]},
vuse:{title:'Vuse Pro One · vuse.com/hr',imgs:[
['img/vuse-pro-one-hr.jpg','Vuse Pro One uređaji i pod — hrvatska ponuda: crna, plava i magenta boja s metalik završetkom (foto: vuse.com/hr)'],
['img/vuse-pro-one-creamy.jpg','Vuse Pro One Creamy Tobacco — duhanski okus u hrvatskoj ponudi, 18 mg/mL (foto: vuse.com/hr)'],
['img/vuse-pro-one-banner.jpg','„Novi PRO ONE by Vuse" — službeni hrvatski banner: FlavourFLOW™ keramički sustav zagrijavanja, tipka za intenzitet (foto: vuse.com/hr)'],
['img/vuse-pod-golden.jpg','Vuse Pod Golden Tobacco 2-pack — 2 poda × 2 mL, „do 2000 puffova po pakiranju" (foto: vuse.com UK)']]},
enva:{title:'ENVA Sol',imgs:[
['img/enva-sol.jpg','ENVA Sol uređaj sa stickom — cigaretni format, 500 mAh ≈ 3 sticka/punjenje (foto: myenva.com)'],
['img/enva-sticks-pack.jpg','ENVA Sol sticks 2/1 — 0,8 mL svaki, 18 mg/mL nikotinska sol (foto: gejser-ecigaret.dk)'],
['img/enva-usporedba.jpg','ENVA marketinška usporedba: cigareta vs grijani duhan vs „Liquid Tobacco" (foto: myenva.com)'],
['img/enva-kapacitet.jpg','ENVA kapacitet: 2 sticka ≈ 20 cigareta; baterija ≈ 3 sticka/punjenje; mekani filter-tip (foto: myenva.com)']]},
iqos:{title:'IQOS ILUMA i · grijani duhan',imgs:[
['img/iqos-iluma-i-one.jpg','IQOS ILUMA i ONE — kompaktni model, u HR 39,00 € (foto: iqos.com)'],
['img/iqos-iluma-one-boje.jpg','IQOS ILUMA ONE serija u pet boja (foto: vape.co.uk)'],
['img/iqos-iluma-i-prime.jpg','IQOS ILUMA i PRIME — aluminijsko kućište, džepni punjač + držač, u HR 89,00 € (foto: 888vapour.com)'],
['img/terea-amber.jpg','TEREA Amber — 20 duhanskih stickova za ILUMA seriju, u HR ~4,30 € (foto: iqos.com)']]},
cig:{title:'Referenca: cigarete',imgs:[
['img/marlboro-karton.jpg','Marlboro Red/Gold — 5,10 € po pakiranju od 20 u Hrvatskoj (cjenik Carinske uprave) — mjera za sve usporedbe cijene po puffu']]}
};
const img=document.getElementById('pgalImg'),ttl=document.getElementById('pgalTitle'),
cap=document.getElementById('pgalCap'),cnt=document.getElementById('pgalCount');
let cur=null,idx=0;
function show(){const g=PGAL[cur];img.src=g.imgs[idx][0];img.alt=g.imgs[idx][1];cap.textContent=g.imgs[idx][1];cnt.textContent=(idx+1)+' / '+g.imgs.length;}
function open(k){cur=k;idx=0;ttl.textContent=PGAL[k].title;show();root.classList.add('open');root.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';}
function close(){root.classList.remove('open');root.setAttribute('aria-hidden','true');document.body.style.overflow='';}
function step(d){idx=(idx+d+PGAL[cur].imgs.length)%PGAL[cur].imgs.length;show();}
document.querySelectorAll('.pgal-open').forEach(b=>b.addEventListener('click',()=>open(b.dataset.gal)));
document.getElementById('pgalX').addEventListener('click',close);
document.getElementById('pgalPrev').addEventListener('click',()=>step(-1));
document.getElementById('pgalNext').addEventListener('click',()=>step(1));
root.addEventListener('click',e=>{if(e.target===root)close();});
document.addEventListener('keydown',e=>{if(!root.classList.contains('open'))return;
if(e.key==='Escape')close();if(e.key==='ArrowLeft')step(-1);if(e.key==='ArrowRight')step(1);});
})();
