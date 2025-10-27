import { initializeApp, getApp } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js';
import { firebaseConfig } from '../firebase.js';
try { getApp() } catch { initializeApp(firebaseConfig) }

const fi = document.getElementById('fileInput');
document.getElementById('pickBtn').addEventListener('click', ()=>fi.click());

const c = document.getElementById('stage'), x = c.getContext('2d');
let img=null, scale=1, tx=0, ty=0, flip=1, caption='';
let frame={ kind:'none', color:null, thickness:40, rounded:26 };
const dpr=Math.max(1,Math.min(2,devicePixelRatio||1)); c.width=750*dpr; c.height=750*dpr; c.style.width='100%';

const FRAME_STYLES=[
  {id:'none',label:'None',kind:'none'},
  {id:'soft',label:'Soft',kind:'soft',color:'rgba(255,255,255,.85)',thickness:38,rounded:40},
  {id:'gold',label:'Gold',kind:'grad',colors:['#ffd54a','#ff7a00'],thickness:52,rounded:32},
  {id:'dark',label:'Dark',kind:'solid',color:'#0c0c0c',thickness:60,rounded:30},
  {id:'neon',label:'Neon',kind:'neon',color:'#ff7a00',thickness:30,rounded:28},
];

fi.addEventListener('change', e=>{
  const f=e.target.files[0]; if(!f) return;
  img=new Image(); img.onload=()=>{
    scale=Math.min(c.width/img.width,c.height/img.height);
    tx=(c.width-img.width*scale)/2; ty=(c.height-img.height*scale)/2; flip=1; draw();
  }; img.src=URL.createObjectURL(f);
});

function rr(ctx,x,y,w,h,r){const p=new Path2D();p.moveTo(x+r,y);p.arcTo(x+w,y,x+w,y+h,r);p.arcTo(x+w,y+h,x,y+h,r);p.arcTo(x,y+h,x,y,r);p.arcTo(x,y,x+w,y,r);ctx.stroke(p);}

function draw(){
  x.setTransform(1,0,0,1,0,0); x.clearRect(0,0,c.width,c.height);
  const g=x.createLinearGradient(0,0,c.width,c.height); g.addColorStop(0,'#0e0e0e'); g.addColorStop(1,'#0a0a0a'); x.fillStyle=g; x.fillRect(0,0,c.width,c.height);
  if(img){ x.save(); x.translate(tx+(img.width*scale/2), ty+(img.height*scale/2)); x.scale(flip,1); x.drawImage(img,-img.width*scale/2,-img.height*scale/2,img.width*scale,img.height*scale); x.restore(); }
  // frame
  if(frame.kind!=='none'){ const th=(frame.thickness||40), r=(frame.rounded||20);
    if(frame.kind==='solid'||frame.kind==='soft'){ x.lineWidth=th; x.strokeStyle=frame.color||'white'; rr(x,th/2,th/2,c.width-th,c.height-th,r); }
    if(frame.kind==='grad'){ x.lineWidth=th; const g=x.createLinearGradient(0,0,c.width,c.height); (frame.colors||['#ffd54a','#ff7a00']).forEach((col,i)=>g.addColorStop(i,col)); x.strokeStyle=g; rr(x,th/2,th/2,c.width-th,c.height-th,r); }
    if(frame.kind==='neon'){ x.save(); x.lineWidth=th/2; x.strokeStyle=frame.color||'#ff7a00'; x.shadowColor=frame.color||'#ff7a00'; x.shadowBlur=26; rr(x,th/2,th/2,c.width-th,c.height-th,r); x.restore(); }
  }
  if(caption){ x.save(); x.font=`${48}px Inter, system-ui`; x.fillStyle='#fff'; x.textAlign='center'; x.shadowColor='rgba(0,0,0,.6)'; x.shadowBlur=12; x.fillText(caption,c.width/2,c.height-48); x.restore(); }
}
draw();

// gestures
let drag=false, lx=0, ly=0, pinch=false, ldist=0;
function dist(t){const dx=t[0].clientX-t[1].clientX, dy=t[0].clientY-t[1].clientY; return Math.hypot(dx,dy);}
c.addEventListener('pointerdown', e=>{drag=true; lx=e.clientX; ly=e.clientY; c.setPointerCapture(e.pointerId)});
c.addEventListener('pointermove', e=>{if(drag&&!pinch){tx+=(e.clientX-lx)*dpr; ty+=(e.clientY-ly)*dpr; lx=e.clientX; ly=e.clientY; draw()}});
c.addEventListener('pointerup', e=>{drag=false; c.releasePointerCapture(e.pointerId)});
c.addEventListener('dblclick', ()=>{if(!img) return; scale=Math.min(c.width/img.width,c.height/img.height); tx=(c.width-img.width*scale)/2; ty=(c.height-img.height*scale)/2; draw();});
c.addEventListener('touchstart', e=>{if(e.touches.length===2){pinch=True; ldist=dist(e.touches)}},{passive:true})
c.addEventListener('touchmove', e=>{if(e.touches.length===2&&pinch){const d=dist(e.touches); const factor=d/ldist; ldist=d; scale*=factor; scale=Math.max(0.2,Math.min(5,scale)); draw()}},{passive:true})
c.addEventListener('touchend', ()=>{pinch=false});

document.getElementById('addTextBtn').addEventListener('click', ()=>{caption=document.getElementById('addText').value.trim(); draw()});
document.getElementById('resetBtn').addEventListener('click', ()=>{img=null; caption=''; tx=ty=0; scale=1; flip=1; draw()});
document.getElementById('fitBtn').addEventListener('click', ()=>{if(!img) return; scale=Math.min(c.width/img.width,c.height/img.height); tx=(c.width-img.width*scale)/2; ty=(c.height-img.height*scale)/2; draw()});
document.getElementById('flipBtn').addEventListener('click', ()=>{flip*=-1; draw()});

// frames list
const wrap=document.getElementById('frames');
FRAME_STYLES.forEach(f=>{
  const el=document.createElement('button'); el.className='chip'; el.innerHTML=`<span class="label">${f.label}</span>`;
  const p=document.createElement('canvas'); p.width=120; p.height=120; const px=p.getContext('2d');
  px.fillStyle='#0e0e0e'; px.fillRect(0,0,120,120);
  const t=(f.thickness||36)/3, r=(f.rounded||20)/2;
  px.lineWidth=t; px.strokeStyle=f.color||'#fff';
  if(f.kind==='grad'){const g=px.createLinearGradient(0,0,120,120); (f.colors||['#ffd54a','#ff7a00']).forEach((col,i)=>g.addColorStop(i,col)); px.strokeStyle=g;}
  px.beginPath(); const rr=(x,y,w,h,r)=>{px.moveTo(x+r,y);px.arcTo(x+w,y,x+w,y+h,r);px.arcTo(x+w,y+h,x,y+h,r);px.arcTo(x,y+h,x,y,r);px.arcTo(x,y,x+w,y,r)}; rr(t/2,t/2,120-t,120-t,r); px.stroke();
  el.prepend(p);
  el.addEventListener('click', ()=>{frame=f; draw()});
  wrap.appendChild(el);
});

async function outputBlob(){return new Promise(res=>c.toBlob(res,'image/png',1))}
document.getElementById('downloadBtn').addEventListener('click', async ()=>{
  const b=await outputBlob(); const url=URL.createObjectURL(b); const a=document.createElement('a'); a.href=url; a.download='timepasskatta.png'; a.click(); URL.revokeObjectURL(url); if(window.tkSaveToCloud) window.tkSaveToCloud(b);
});
document.getElementById('shareBtn').addEventListener('click', async ()=>{
  const b=await outputBlob();
  try{
    if(navigator.canShare){ const f=new File([b],'tpk.png',{type:'image/png'}); if(navigator.canShare({files:[f]})){ await navigator.share({files:[f], title:'Timepass Katta', text:'Made with Timepass Katta'}); return; } }
    const text=encodeURIComponent('Made with Timepass Katta – https://timepasskatta.app'); location.href='https://wa.me/?text='+text;
  }catch(e){ alert('Share not supported on this device'); }
  if(window.tkSaveToCloud) window.tkSaveToCloud(b);
});
