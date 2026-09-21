
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
tooltip:{...baseTip,trigger:'item',formatter:p=>`Temperaturni raspon<br><b>${p.value[1]}–${p.value[2]} °C</b>`},
grid:{left:230,right:100,top:30,bottom:50},
xAxis:{type:'value',name:'°C',nameTextStyle:{color:C.ink2},min:0,max:1100,...baseAxis},
yAxis:{type:'category',data:['Nepušač (referenca)','Pod-uređaji 1,2 Ω · ~10 W','Pod-uređaji 0,6 Ω · ~21 W','Vuse Pro One — nema mjerenja','JUUL — prosjek atomizera','JUUL — grijaći element','ENVA Sol — nema mjerenja','PG/VG prag razgradnje','Dry burn — suhi fitilj','Cigareta — vrh pri puhanju'],...baseAxis,axisLabel:{...baseAxis.axisLabel,color:C.ink,fontSize:12}},
series:[{type:'custom',renderItem:(p,api)=>{const y=api.coord([0,api.value(0)])[1];const x1=api.coord([api.value(1),0])[0];const x2=api.coord([api.value(2),0])[0];
return{type:'group',children:[{type:'rect',shape:{x:x1,y:y-11,width:Math.max(x2-x1,2),height:22},style:{fill:api.value(3),opacity:.92}},{type:'text',style:{x:x2+7,y,text:api.value(1)+'–'+api.value(2)+' °C',fill:C.ink,fontSize:11,verticalAlign:'middle'}}]};},
data:[
[0,36,37,C.non],
[1,63,90,C.ecig],
[2,103,150,C.ecig],
[4,150,300,C.juul],
[5,200,250,C.juul],
[7,250,250,'#d94f70'],
[8,350,1008,'#8a2f2f'],
[9,600,900,C.cig]],
markLine:{symbol:'none',lineStyle:{color:'#d94f70',type:'dashed'},label:{color:'#d94f70',fontSize:11,formatter:'~250 °C — početak pirolize PG/VG'},data:[{xAxis:250}]}
}]});

/* ---------- 02 power: separate absolute emissions and composition ---------- */
mk('chartPower',{
 tooltip:{...baseTip, valueFormatter:v=>`${v} ng/puff`},
 legend:{textStyle:{color:C.ink2},top:0},
 grid:{left:75,right:35,top:65,bottom:60},
 xAxis:{...baseAxis,type:'value',min:0,max:22,name:'Snaga (W)',nameLocation:'middle',nameGap:30},
 yAxis:{...baseAxis,type:'value',min:0,name:'Formaldehid (ng/puff)'},
 series:[
 {name:'Geiss 2016',type:'line',symbolSize:8,itemStyle:{color:C.enva},data:[[5,24.2],[7,40],[9,90],[11,210],[15,430],[20,1599.9]]},
 {name:'Gillman 2016',type:'line',symbol:'diamond',symbolSize:8,itemStyle:{color:C.cig},data:[[5,3.4],[7,19.8],[9,71.8],[11,380],[15,718]]}
 ]
});
mk('chartPowerComposition',{
 tooltip:{...baseTip,valueFormatter:v=>`${v}%`},
 legend:{textStyle:{color:C.ink2},top:0},
 grid:{left:75,right:35,top:65,bottom:55},
 xAxis:{...baseAxis,type:'category',data:['Niska snaga','Srednja snaga','Visoka snaga']},
 yAxis:{...baseAxis,type:'value',min:0,max:100,name:'Udio u karbonilima (%)'},
 series:[
 {name:'Formaldehid',type:'bar',itemStyle:{color:'#d94f70'},data:[100,64,33]},
 {name:'Acetaldehid',type:'bar',itemStyle:{color:C.cigar},data:[0,22,31]},
 {name:'Akrolein',type:'bar',itemStyle:{color:C.juul},data:[0,14,30]}
 ].map(s=>({...s,barMaxWidth:65,label:{show:true,position:'top',color:C.ink,formatter:'{c}%'}}))
});

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

/* ---------- 04 NNAL ---------- */
mk('chartNNAL',{
tooltip:{trigger:'axis',...baseTip,formatter:p=>{const d=p[0];return `${d.name}<br>NNAL: <b>${d.value}</b> pg/mg kreatinina`}},
grid:{left:230,right:60,top:40,bottom:50},
xAxis:{type:'value',min:0,max:1100,name:'Urinski NNAL (pg/mg)',nameLocation:'middle',nameGap:30,...baseAxis,nameTextStyle:{color:C.ink2}},
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
yAxis:{type:'value',min:0,name:'ng/mg kreatinina',...baseAxis,nameTextStyle:{color:C.ink2}},
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
