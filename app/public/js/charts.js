
/* ---------- palette & helpers ---------- */
const C={cig:'#e05d4f',cigar:'#b07843',ecig:'#3aa896',vuse:'#2f9e8f',juul:'#6d7fa3',enva:'#ffb800',iqos:'#ad8fd7',non:'#8b94a1',ink:'rgba(255,255,255,.9)',ink2:'rgba(255,255,255,.6)',ink3:'rgba(255,255,255,.38)',line:'rgba(255,255,255,.12)'};
const baseAxis={nameTextStyle:{color:C.ink2,fontSize:12},axisLine:{lineStyle:{color:C.line}},axisLabel:{color:C.ink2,fontFamily:'ui-monospace,Menlo,monospace',fontSize:11},splitLine:{lineStyle:{color:'rgba(255,255,255,.05)'}}};
const baseTip={trigger:'axis',backgroundColor:'#161412',borderColor:C.line,textStyle:{color:C.ink,fontSize:12}};
const charts=[];
// Measure category labels at the active reading size instead of reserving fixed pixels.
function fitChartLabels(opt){
 const yAxes=Array.isArray(opt.yAxis)?opt.yAxis:[opt.yAxis];
 const horizontal=yAxes.some(axis=>axis?.type==='category');
 opt.grid={...opt.grid,containLabel:true,left:horizontal?16:64,right:horizontal?120:yAxes.length>1?72:32,bottom:70};
 if(opt.legend)opt.grid.top=Math.max(opt.grid.top||0,75);
 const xAxes=Array.isArray(opt.xAxis)?opt.xAxis:[opt.xAxis];
 xAxes.forEach(axis=>{if(axis?.name){axis.nameLocation='middle';axis.nameGap=40;}});
 yAxes.forEach(axis=>{if(axis?.name){axis.nameLocation='middle';axis.nameGap=42;}});
 return opt;
}
function readingOption(value){
 const light=document.documentElement.dataset.theme!=='dark', css=getComputedStyle(document.documentElement);
 const colors={'rgba(255,255,255,.9)':css.getPropertyValue('--ink').trim(),'rgba(255,255,255,.6)':css.getPropertyValue('--ink2').trim(),'rgba(255,255,255,.38)':css.getPropertyValue('--ink3').trim(),'rgba(255,255,255,.12)':css.getPropertyValue('--line').trim(),'rgba(255,255,255,.05)':css.getPropertyValue('--line').trim(),'#161412':css.getPropertyValue('--bg2').trim(),'#ddd':css.getPropertyValue('--ink').trim(),'#aaa':css.getPropertyValue('--ink2').trim()};
 function visit(v){if(Array.isArray(v))return v.map(visit);if(v&&typeof v==='object'){const out={};for(const [k,x] of Object.entries(v))out[k]=k==='fontSize'&&typeof x==='number'?x*(document.documentElement.dataset.textSize==='l'?1.2:document.documentElement.dataset.textSize==='s'?.9:1):visit(x);return out;}return light&&typeof v==='string'&&colors[v]?colors[v]:v;}
 return visit(value);
}
window.addEventListener('readingchange',()=>charts.forEach(c=>{c.setOption(readingOption(c.readingOriginal),true);c.resize();}));
// Availability is specific to the endpoint, units and study population, never a zero.
const iqosEvidence={
 chartTemp:['Mjerenje / deklaracija','Stariji IQOS: 330 ± 10 °C (SD, n=2). ILUMA: do 350 °C prema proizvođaču; to nije izmjereni raspon.',193,201],
 chartPower:['N/A','Pokus s čistim PG/VG u reaktoru. IQOS grije duhan; µg/stick ne možemo staviti na os µg/mg otapala.',192,193],
 chartPowerComposition:['N/A','IQOS grije duhan, ne čisti PG ili VG u ovom reaktoru. µg/stick nisu µg/mg otapala.',192,193],
 chartPotency:['Model','THS 2.2 prototip: 0,024 je omjer modeliranog doživotnog rizika raka prema cigareti. Nije klinički rizik niti rezultat za ILUMA/TEREA.',20],
 chartMetals:['N/A','IQOS nije uključen u ovih 56 uređaja. Emisija metala u drugoj jedinici ne daje postotak uzoraka iznad ove granice.',14],
 chartMetalSrc:['N/A','IQOS nema spremnik e-tekućine. Nemamo usporedivu seriju dozator → aerosol → spremnik.',14],
 chartBrain:['N/A','U ovom pokusu na miševima nije testiran IQOS; nema iste analize tkiva i doze.',107],
 chartMetalBlood:['N/A','Za IQOS nemamo isti krvni i urinski kadmij u ovim populacijama.',112],
 chartNNAL:['Mjerenje','THS 2.2: geometrijski prosjek 49,65 pg/mg; 95% CI 42,47–58,05, peti dan prelaska pušača. To nije dugoročna razina isključivih korisnika.',194],
 chartCot:['Mjerenje','IQOS/HEETS: serumski kotinin 61,0 ± 16,7 ng/mL (SD) odmah nakon uporabe. Urin i slina u drugim serijama nisu ista matrica ni postupak.',60],
 chartVOC:['Djelomični podatak','THS 2.2: geometrijski prosjek 3-HPMA 402,26 ng/mg (95% CI 366,55–441,45), peti dan; druga kohorta od PATH-a. CEMA i AAMA: N/A. Kratica CEMA u tom IQOS radu označava drugi spoj.',194],
 chartVOC2:['N/A','IQOS nema procjenu prema nepušačima iz istoga PATH modela. Smanjenje nakon prelaska ne pretvaramo u taj postotak.',194],
 chartSwitch:['Mjerenje','THS 2.2: aritmetički prosjek promjene od početka do petog dana u istoj skupini. Nije usporedba s nepušačima. PMI financiranje.',194],
 chartFMD:['N/A u ovoj usporedbi','Nemamo odgovarajuću kroničnu skupinu odraslih korisnika IQOS-a. Akutni rezultati IQOS/HEETS prikazani su zasebno ispod.',60],
 chartFMDAcute:['Mjerenje','THS 2.2/HEETS Amber: 20 istih pušača u crossover pokusu. Prije 6,10 ± 3,01%; poslije 3,79 ± 2,68% (SD).',60],
 chartOR:['N/A','Nema IQOS procjene u prikazanim modelima. Biomarker ili laboratorijska emisija ne određuje omjer izgleda za bolest.',164],
 chartDeaths:['N/A','Nemamo usporedivu procjenu godišnjih smrti pripisanih IQOS-u. Nedostajući podatak ne znači nula smrti.',164],
 chartENVA:['N/A','Modelni pokus s nitritom u e-tekućini nije test IQOS-a, a nije ni izravno mjerenje ENVA Sola.',17]
};
function mk(id,opt){
 const el=document.getElementById(id);if(!el)return;
 fitChartLabels(opt);
 const ch=echarts.init(el,null,{renderer:'canvas'});ch.readingOriginal=opt;ch.setOption(readingOption(opt));charts.push(ch);
 const evidence=iqosEvidence[id];
 if(evidence){
  const note=document.createElement('p');note.className='graph-iqos';note.dataset.chart=id;note.dataset.status=evidence[0];
  const label=document.createElement('strong');label.textContent=`IQOS · ${evidence[0]}: `;note.append(label,document.createTextNode(evidence[1]+' '));
  evidence.slice(2).forEach(n=>{const a=document.createElement('a');a.href=`/studije/${n}/`;a.textContent=`Izvor #${n} ↗`;note.append(a,document.createTextNode(' '));});
  const footnote=document.querySelector(`[data-chart-notes="${id}"]`);
  if(footnote){
   footnote.querySelector('.chart-footnote-content').append(note);
   footnote.querySelector('.chart-iqos-status').textContent=` · IQOS: ${evidence[0]}`;
  }else (el.parentElement.classList.contains('chart-scroll')?el.parentElement:el).after(note);
 }
 return ch;
}
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
const temperatureLabel=(row,low,high)=>row===4?'<300 °C · prosjek':row===8?'330 ± 10 °C (SD)':row===9?'do 350 °C · deklaracija':`${low}–${high} °C`;
mk('chartTemp',{
tooltip:{...baseTip,trigger:'item',formatter:p=>`Temperatura<br><b>${temperatureLabel(p.value[0],p.value[1],p.value[2])}</b>`},
grid:{left:265,right:120,top:30,bottom:50},
xAxis:{type:'value',name:'°C',nameTextStyle:{color:C.ink2},min:0,max:1100,...baseAxis},
yAxis:{type:'category',data:['Tjelesna temperatura','Top-coil — mokri test','Generički pod-uređaji — N/A','Vuse Pro One — N/A','JUUL — prosjek atomizera','JUUL — grijaći element','ENVA Sol — N/A','Wiip Magnetic II / X Pro — N/A','IQOS — stariji model','IQOS ILUMA — maksimum','Top-coil — suhi test','Cigareta — vrh pri puhanju'],...baseAxis,axisLabel:{...baseAxis.axisLabel,color:C.ink,fontSize:12}},
series:[{type:'custom',renderItem:(p,api)=>{const y=api.coord([0,api.value(0)])[1];const x1=api.coord([api.value(1),0])[0];const x2=api.coord([api.value(2),0])[0];
return{type:'group',children:[{type:'rect',shape:{x:x1,y:y-9,width:Math.max(x2-x1,3),height:18},style:{fill:api.value(3),opacity:.92}},{type:'text',style:{x:x2+7,y,text:temperatureLabel(api.value(0),api.value(1),api.value(2)),fill:getComputedStyle(document.documentElement).getPropertyValue('--ink').trim(),fontSize:11,verticalAlign:'middle'}}]};},
data:[
[0,36,37,C.non],
[1,110,185,C.ecig],
[4,300,300,C.juul],
[5,200,250,C.juul],
[8,320,340,C.iqos,'330 ± 10 °C (SD)'],
[9,350,350,C.iqos,'do 350 °C · deklaracija'],
[10,322,1008,'#8a2f2f'],
[11,600,900,C.cig]]
}]});

/* ---------- 02 measured reactor temperature; no watt-to-temperature conversion ---------- */
mk('chartPower',{
 tooltip:{...baseTip,formatter:items=>items.map(p=>`${p.marker} ${p.seriesName}<br>${p.value[0]} °C: <b>${p.value[1]} µg/mg otapala</b>`).join('<br>')},
 legend:{data:['Propilen-glikol (PG)','Glicerol (VG)'],textStyle:{color:C.ink2},top:0},
 grid:{left:80,right:45,top:75,bottom:65},
 xAxis:{...baseAxis,type:'value',min:200,max:330,splitNumber:4,name:'Izmjerena temperatura reaktora (°C)',nameLocation:'middle',nameGap:35,nameTextStyle:{color:C.ink2,fontSize:11}},
 yAxis:{...baseAxis,type:'value',min:0,max:25,name:'Formaldehid (µg/mg otapala)',nameLocation:'middle',nameGap:45},
 series:[
 {name:'Propilen-glikol (PG)',type:'line',symbolSize:9,itemStyle:{color:C.ecig},data:[[215,0.03],[270,0.29],[318,2.03]],label:{show:true,position:'top',distance:18,color:C.ink,formatter:p=>p.value[1]}},
 {name:'Glicerol (VG)',type:'line',symbol:'diamond',symbolSize:10,itemStyle:{color:C.enva},data:[[270,7.97],[318,21.10]],label:{show:true,position:'right',distance:10,color:C.ink,formatter:p=>p.value[1]}},
 {name:'Prosjek ± SD',type:'custom',tooltip:{show:false},renderItem:(params,api)=>{
  const low=api.coord([api.value(0),api.value(1)]),high=api.coord([api.value(0),api.value(2)]);
  return{type:'group',children:[{type:'line',shape:{x1:low[0],y1:low[1],x2:high[0],y2:high[1]},style:{stroke:api.value(3),lineWidth:2}},...([low,high].map(p=>({type:'line',shape:{x1:p[0]-5,y1:p[1],x2:p[0]+5,y2:p[1]},style:{stroke:api.value(3),lineWidth:2}})))]};
 },data:[[215,0,.06,C.ecig],[270,.18,.40,C.ecig],[318,1.23,2.83,C.ecig],[270,6.89,9.05,C.enva],[318,17.30,24.90,C.enva]]}
 ]
});
mk('chartPowerComposition',{
 tooltip:{...baseTip,valueFormatter:v=>`${v} µg/mg otapala`},
 legend:{textStyle:{color:C.ink2},top:0},
 grid:{left:75,right:35,top:65,bottom:55},
 xAxis:{...baseAxis,type:'category',data:['PG','VG']},
 yAxis:{...baseAxis,type:'value',min:0,max:25,name:'µg spoja / mg otapala',nameLocation:'middle',nameGap:45},
 series:[
 {name:'Formaldehid',type:'bar',itemStyle:{color:'#d94f70'},data:[2.03,21.10]},
 {name:'Acetaldehid',type:'bar',itemStyle:{color:C.cigar},data:[2.35,2.40]},
 {name:'Akrolein',type:'bar',itemStyle:{color:C.juul},data:[null,.80]}
 ].map(s=>({...s,barMaxWidth:65,label:{show:true,position:'top',color:C.ink,formatter:'{c}'}}))
});

/* ---------- 03 cancer potency ---------- */
mk('chartPotency',{
tooltip:{trigger:'item',...baseTip,formatter:p=>`${p.name}<br>modelirani omjer rizika raka: <b>${p.value[0]}</b><br>${p.value[2]}`},
grid:{left:60,right:40,top:50,bottom:70},
xAxis:{type:'log',min:0.0003,max:2,name:'Relativni rizik raka · log',...baseAxis,nameTextStyle:{color:C.ink2},axisLabel:{...baseAxis.axisLabel,formatter:v=>v}},
yAxis:{type:'category',data:['Nikotinski inhalator','Zatvorene e-cigarete','E-cigarete — prosjek','E-cigarete — visoka snaga','Grijani duhan / IQOS','Cigareta'],...baseAxis,axisLabel:{...baseAxis.axisLabel,color:C.ink,fontSize:12}},
series:[{type:'scatter',symbolSize:d=>34,
data:[
[0.0004,0,'doživotni rizik 8,9×10⁻⁶',C.non],
[0.011,1,'rel. rizik 0,009–0,014',C.ecig],
[0.004,2,'doživotni rizik 9,5×10⁻⁵',C.ecig],
[0.35,3,'visoka snaga / dry puff — Stephens: manjina uzoraka',C.cig],
[0.024,4,'model: doživotni rizik 5,7×10⁻⁴ · prototip THS 2.2',C.iqos],
[1,5,'doživotni rizik 2,4×10⁻²',C.cig]],
itemStyle:{color:p=>p.value[3]},
label:{show:true,position:'right',color:C.ink2,fontSize:11,fontFamily:'ui-monospace,Menlo,monospace',formatter:p=>p.value[0]}
}]});

/* ---------- 03 metals ---------- */
mk('chartMetals',{
tooltip:baseTip,
grid:{left:60,right:30,top:40,bottom:50},
xAxis:{type:'category',data:['Nikal','Olovo','Krom (VI)*','Mangan'],...baseAxis,axisLabel:{...baseAxis.axisLabel,color:C.ink,fontSize:13}},
yAxis:{type:'value',name:'Uzorci iznad granice (%)',max:100,...baseAxis,nameTextStyle:{color:C.ink2}},
series:[{type:'bar',barWidth:44,data:[
{value:57,itemStyle:{color:C.enva}},
{value:48,itemStyle:{color:C.cig}},
{value:68,itemStyle:{color:'#d94f70'}},
{value:50,itemStyle:{color:C.juul}}],
label:{show:true,position:'top',color:C.ink,fontFamily:'ui-monospace,Menlo,monospace',formatter:'{c}%'}
}]
});

/* ---------- 03b metal source: dispenser vs aerosol vs tank ---------- */
mk('chartMetalSrc',{
tooltip:baseTip,legend:{textStyle:{color:C.ink2},top:0},
grid:{left:70,right:30,top:50,bottom:60},
xAxis:{type:'category',data:['Nikal','Krom','Olovo','Cink','Aluminij'],...baseAxis,axisLabel:{...baseAxis.axisLabel,color:C.ink,fontSize:12}},
yAxis:{type:'value',min:0,name:'µg/kg',...baseAxis,nameTextStyle:{color:C.ink2}},
series:[
{name:'dozator (bez kontakta)',type:'bar',barWidth:22,itemStyle:{color:C.non},data:[2.03,0.5,0.476,13.1,10.9]},
{name:'aerosol',type:'bar',barWidth:22,itemStyle:{color:'#d94f70'},data:[68.4,8.38,14.8,515,16.3]},
{name:'spremnik nakon uporabe',type:'bar',barWidth:22,itemStyle:{color:C.juul},data:[233,55.4,40.2,426,31.2]}
]});

/* ---------- 03d brain metal accumulation ---------- */
mk('chartBrain',{
tooltip:{...baseTip,formatter:p=>`${p[0].name}<br>+<b>${p[0].value}%</b> vs kontrola (miševi, 2 mj. izloženosti)`},
grid:{left:200,right:70,top:30,bottom:50},
xAxis:{type:'value',name:'Promjena prema kontroli (%)',...baseAxis,nameTextStyle:{color:C.ink2}},
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
}]
});

/* ---------- 03e blood metals ---------- */
mk('chartMetalBlood',{
tooltip:baseTip,legend:{textStyle:{color:C.ink2},top:0},
grid:{left:70,right:30,top:50,bottom:60},
xAxis:{type:'category',data:['Nepušači','Ekskluzivni vaperi','Dualni korisnici','Pušači cigareta'],...baseAxis,axisLabel:{...baseAxis.axisLabel,color:C.ink,fontSize:12,interval:0}},
yAxis:[{type:'value',name:'krvni Cd (µg/L)',...baseAxis,nameTextStyle:{color:C.ink2}},{type:'value',name:'urinski Cd (ng/mg)',...baseAxis,nameTextStyle:{color:C.ink2}}],
series:[
{name:'Krvni Cd [1]',type:'bar',barWidth:34,itemStyle:{color:C.juul},data:[0.31,0.44,1.38,1.44],label:{show:true,position:'top',color:C.ink,fontSize:11,fontFamily:'ui-monospace,Menlo,monospace',formatter:'{c}'}},
{name:'Urinski Cd [2]',type:'bar',yAxisIndex:1,barWidth:34,itemStyle:{color:C.ecig},data:[0.23,0.35,null,null],label:{show:true,position:'top',color:C.ink,fontSize:11,fontFamily:'ui-monospace,Menlo,monospace',formatter:'{c}'}}
]
});

/* ---------- 04 NNAL ---------- */
mk('chartNNAL',{
tooltip:{trigger:'axis',...baseTip,formatter:p=>{const d=p[0];return `${d.name}<br>NNAL: <b>${d.value}</b> pg/mg kreatinina`}},
grid:{left:230,right:60,top:40,bottom:50},
xAxis:{type:'value',min:0,max:1100,name:'Urinski NNAL (pg/mg)',nameLocation:'middle',nameGap:30,...baseAxis,nameTextStyle:{color:C.ink2}},
yAxis:{type:'category',data:[
'Nepušači [1]',
'Nepušači [2]',
'Adolescenti — vaping [3]',
'Isključivi vaperi [4]',
'Isključivi vaperi [1]',
'Cigare — povremeno',
'Cigare — dnevno [5]',
'Cigarete — dnevno [1]',
'Cigarete — dnevno [5]',
'Filtrirane cigare — dnevno',
'IQOS / THS 2.2 — dan 5'],...baseAxis,axisLabel:{...baseAxis.axisLabel,color:C.ink,fontSize:12}},
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
{value:979.54,itemStyle:{color:'#8a4a2f'}},
{value:49.65,itemStyle:{color:C.iqos}}],
label:{show:true,position:'right',color:C.ink,fontSize:11,fontFamily:'ui-monospace,Menlo,monospace'},
markLine:{symbol:'none',lineStyle:{color:C.cig,type:'dashed'},label:{color:C.cig,fontSize:11,formatter:'pušačka razina'},data:[{xAxis:150}]}
}]});

/* ---------- 04 cotinine ---------- */
mk('chartCot',{
tooltip:baseTip,legend:{textStyle:{color:C.ink2},top:0},
grid:{left:70,right:30,top:50,bottom:60},
xAxis:{type:'category',data:['Nepušači','Ekskl. vaperi','Pušači cigareta','Dualni','Cigare (primarni)','IQOS / HEETS\nnakon sesije'],...baseAxis,axisLabel:{...baseAxis.axisLabel,color:C.ink,fontSize:12,interval:0}},
yAxis:[{type:'value',name:'urinski kotinin (ng/mL)',...baseAxis,nameTextStyle:{color:C.ink2}},{type:'value',name:'serum/saliva (ng/mL)',...baseAxis,nameTextStyle:{color:C.ink2}}],
series:[
{name:'Urin [1]',type:'bar',barWidth:22,itemStyle:{color:C.juul},data:[133.7,175.87,490.19,559.74,null,null]},
{name:'Serum · cigare [2]',type:'bar',yAxisIndex:1,barWidth:22,itemStyle:{color:C.cigar},data:[0.045,null,null,null,6.2,null]},
{name:'Slina [1]',type:'bar',yAxisIndex:1,barWidth:22,itemStyle:{color:C.ecig},data:[1.43,193.81,188.33,224.08,null,null]},
{name:'Serum · IQOS [3]',type:'bar',yAxisIndex:1,barWidth:22,itemStyle:{color:C.iqos},data:[null,null,null,null,null,61],label:{show:true,position:'top',color:C.ink,formatter:'{c}'}}
]});

/* ---------- 04 VOC: sve 4 grupe (De Jesus 2020, PATH W1) ---------- */
mk('chartVOC',{
tooltip:{trigger:'axis',...baseTip,axisPointer:{type:'shadow'},formatter:p=>p.map(x=>`${x.marker} ${x.seriesName}: <b>${x.value}</b> ng/mg`).join('<br>')},
legend:{textStyle:{color:C.ink2},top:0},
grid:{left:70,right:30,top:44,bottom:64},
xAxis:{type:'category',data:['Akrolein (CEMA)','Akrolein (3-HPMA)','Akrilamid (AAMA)'],...baseAxis,axisLabel:{...baseAxis.axisLabel,color:C.ink,fontSize:12}},
yAxis:{type:'value',min:0,name:'ng/mg kreatinina',...baseAxis,nameTextStyle:{color:C.ink2}},
series:[
{name:'Nepušači',type:'bar',barWidth:'18%',itemStyle:{color:C.non},data:[79,223,67.8]},
{name:'Ekskluzivni vaperi',type:'bar',barWidth:'18%',itemStyle:{color:C.ecig},data:[120.8,338.6,88.5]},
{name:'Dualni korisnici',type:'bar',barWidth:'18%',itemStyle:{color:C.enva},data:[188.1,569.5,181.8]},
{name:'Pušači cigareta',type:'bar',barWidth:'14%',itemStyle:{color:C.cig},data:[180.1,724.4,191.9],
label:{show:true,position:'top',color:C.ink,fontSize:10,fontFamily:'ui-monospace,Menlo,monospace'}}
,{name:'IQOS / THS 2.2 · dan 5',type:'bar',barWidth:'14%',itemStyle:{color:C.iqos},data:[null,402.26,null],label:{show:true,position:'top',color:C.ink,fontSize:10,formatter:'{c}'}}
]});

/* ---------- 04 VOC karcinogeni: % vs nepušači ---------- */
mk('chartVOC2',{
tooltip:{trigger:'axis',...baseTip,axisPointer:{type:'shadow'},formatter:p=>p.map(x=>`${x.marker} ${x.seriesName}: <b>+${x.value}%</b> vs nepušači`).join('<br>')},
legend:{textStyle:{color:C.ink2},top:0},
grid:{left:245,right:85,top:60,bottom:65},
xAxis:{type:'value',min:0,max:10000,name:'% iznad nepušača · linearno od 0',nameLocation:'middle',nameGap:35,...baseAxis,nameTextStyle:{color:C.ink2}},
yAxis:{type:'category',data:['Krotonaldehid (HPMMA)','Akrilonitril (CYMA) — karcinogen'],...baseAxis,axisLabel:{...baseAxis.axisLabel,color:C.ink,fontSize:12}},
series:[
{name:'Ekskluzivni vaperi',type:'bar',barWidth:16,itemStyle:{color:C.ecig},data:[13,1002],
label:{show:true,position:'right',color:C.ink,fontSize:11,fontFamily:'ui-monospace,Menlo,monospace',formatter:'+{c}%'}},
{name:'Dualni korisnici',type:'bar',barWidth:16,itemStyle:{color:C.enva},data:[141,6569],
label:{show:true,position:'right',color:C.ink,fontSize:11,fontFamily:'ui-monospace,Menlo,monospace',formatter:'+{c}%'}},
{name:'Pušači cigareta',type:'bar',barWidth:16,itemStyle:{color:C.cig},data:[172,8901],
label:{show:true,position:'right',color:C.ink,fontSize:11,fontFamily:'ui-monospace,Menlo,monospace',formatter:'+{c}%'}}
],

});


/* ---------- 05 switching ---------- */
mk('chartSwitch',{
tooltip:{...baseTip,formatter:p=>`${p[0].name}<br>smanjenje: <b>−${p[0].value}%</b>`},
legend:{textStyle:{color:C.ink2},top:0},
grid:{left:220,right:60,top:50,bottom:40},
xAxis:{type:'value',max:100,name:'% smanjenja biomarkera',...baseAxis,nameTextStyle:{color:C.ink2}},
yAxis:{type:'category',data:[
'Vuse Solo — benzen/akrilonitril',
'Vuse Vibe — COHb (5d)',
'Vuse Ciro — COHb (5d)',
'Vuse — NNN (5d)',
'Vuse — B[a]P (5d)',
'JUUL — agregat 8 BOE (5d)',
'Apstinencija — JUUL pokus (5d)',
'IQOS — NNAL (5d)',
'IQOS — COHb (5d)',
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
{value:53.98,itemStyle:{color:C.iqos}},
{value:76.20,itemStyle:{color:C.iqos}},
{value:92.03,itemStyle:{color:C.iqos}},
{value:84.98,itemStyle:{color:C.iqos}},
{value:49.68,itemStyle:{color:C.iqos}},
{value:70,itemStyle:{color:C.enva}}],
label:{show:true,position:'right',color:C.ink,fontSize:11,fontFamily:'ui-monospace,Menlo,monospace',formatter:p=>'−'+p.value+'%'}
}]});

/* ---------- 06 FMD ---------- */
mk('chartFMD',{
tooltip:baseTip,legend:{textStyle:{color:C.ink2},top:0},
grid:{left:60,right:30,top:50,bottom:60},
xAxis:{type:'category',data:['Nepušači /\nkontrole','Ekskluzivni vaperi','Pušači cigareta','Djeca — pasivni\naerosol HTP','Djeca —\npasivni dim'],...baseAxis,axisLabel:{...baseAxis.axisLabel,color:C.ink,fontSize:11,interval:0}},
yAxis:{type:'value',name:'FMD (%)',max:12,...baseAxis,nameTextStyle:{color:C.ink2}},
series:[{type:'bar',barWidth:38,
data:[
{value:10.7,itemStyle:{color:C.non}},
{value:5.3,itemStyle:{color:C.ecig}},
{value:6.5,itemStyle:{color:C.cig}},
{value:5.51,itemStyle:{color:C.cigar}},
{value:5.78,itemStyle:{color:C.cig}}],
label:{show:true,position:'top',color:C.ink,fontFamily:'ui-monospace,Menlo,monospace',formatter:'{c}%'}
}]
});

/* Same participants and protocol; separate from chronic FMD. */
mk('chartFMDAcute',{
 tooltip:{...baseTip,valueFormatter:v=>`${v}%`},
 legend:{top:0,textStyle:{color:C.ink2}},grid:{left:70,right:35,top:55,bottom:65},
 xAxis:{...baseAxis,type:'category',data:['IQOS /\nHEETS Amber','Blu Pro\n(9 udisaja)','Marlboro Gold\n(1 cigareta)']},
 yAxis:{...baseAxis,type:'value',min:0,max:10,name:'FMD (%)'},
 series:[{name:'Prije sesije',type:'bar',barMaxWidth:45,itemStyle:{color:C.non},data:[6.10,6.14,6.20]},
 {name:'Odmah poslije',type:'bar',barMaxWidth:45,itemStyle:{color:C.iqos},data:[3.79,3.72,2.40]}].map(s=>({...s,label:{show:true,position:'top',color:C.ink,formatter:'{c}%'}}))
});

/* ---------- 07 OR chart ---------- */
mk('chartOR',{
tooltip:{...baseTip,formatter:p=>`${p.name}<br>OR = <b>${p.value[1]}</b> (95% CI ${p.value[2]}–${p.value[3]})`},
grid:{left:220,right:50,top:40,bottom:50},
xAxis:{type:'value',min:0,max:2,name:'OR prema cigaretama',...baseAxis,nameTextStyle:{color:C.ink2}},
yAxis:{type:'category',data:['KOPB — e-cig','Astma — e-cig','Oralne bolesti — e-cig','Infarkt — e-cig [2]','Moždani udar — e-cig [2]','Srčanožilne bolesti — e-cig','Infarkt — dualna uporaba','Moždani udar — dualna uporaba','KOPB — dualna uporaba'],...baseAxis,axisLabel:{...baseAxis.axisLabel,color:C.ink,fontSize:11.5}},
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
tooltip:{...baseTip,formatter:p=>`${p[0].name}<br><b>${p[0].value.toLocaleString('hr')}</b> smrti ${p[0].dataIndex===0?'ukupno 2019.–2020.':'godišnje'}`},
grid:{left:205,right:75,top:30,bottom:60},
xAxis:{type:'value',min:0,max:550000,name:'Broj smrti u SAD-u',nameLocation:'middle',nameGap:30,...baseAxis,nameTextStyle:{color:C.ink2}},
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
]
});

/* ---------- 09 study database ---------- */
