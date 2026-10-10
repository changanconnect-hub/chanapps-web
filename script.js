/* ChanApps shared effects + install guides. Edit GUIDES below to change steps. */
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];

/* ---------- Starfield (speeds up while scrolling) ---------- */
(function(){
  const cv=$('#stars');if(!cv)return;const x=cv.getContext('2d');let W,H,S=[],boost=0,lastY=scrollY;
  const init=()=>{W=cv.width=innerWidth;H=cv.height=innerHeight;S=Array.from({length:Math.min(160,W/6|0)},()=>({x:Math.random()*W,y:Math.random()*H,z:Math.random()*2+.3,h:Math.random()>.6?170:280}))};
  init();addEventListener('resize',init);
  addEventListener('scroll',()=>{boost=Math.min(Math.abs(scrollY-lastY),40);lastY=scrollY});
  (function f(){x.clearRect(0,0,W,H);boost*=.92;
    S.forEach(s=>{s.y-=s.z*.35+boost*s.z*.35;if(s.y<0){s.y=H;s.x=Math.random()*W}
      x.fillStyle=`hsla(${s.h},100%,75%,.8)`;x.fillRect(s.x,s.y,s.z,s.z+boost*s.z*.5)});
    requestAnimationFrame(f)})();
})();

/* ---------- Scroll progress bar ---------- */
addEventListener('scroll',()=>{const b=$('#bar');if(b)b.style.width=(scrollY/(document.body.scrollHeight-innerHeight)*100)+'%'});

/* ---------- Reveal on scroll + counters ---------- */
const io=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return;e.target.classList.add('on');
  const b=e.target.querySelector('[data-n]');
  if(b&&!b.done){b.done=1;const n=+b.dataset.n,d=+(b.dataset.d||0),p=b.dataset.p||'',t0=performance.now();
    (function f(t){const k=Math.min((t-t0)/1400,1);b.textContent=p+(n*k).toFixed(d);if(k<1)requestAnimationFrame(f)})(t0)}
}),{threshold:.2});
$$('.rv').forEach(el=>io.observe(el));

/* ---------- 3D tilt on cards, magnetic buttons ---------- */
$$('.app-card').forEach(c=>{
  c.onmousemove=e=>{const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    c.style.transform=`perspective(700px) rotateY(${x*16}deg) rotateX(${-y*16}deg) scale(1.04)`};
  c.onmouseleave=()=>c.style.transform='';
});
$$('.btn').forEach(b=>{
  b.onmousemove=e=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.15}px,${(e.clientY-r.top-r.height/2)*.25}px)`};
  b.onmouseleave=()=>b.style.transform='';
});

/* ---------- Rotating headline word with glitch ---------- */
(function(){
  const el=$('#rotor');if(!el)return;const W=['Full Potential','Dashboard','Music & Maps','Entertainment'];
  let i=0,c=0,del=false;
  (function t(){const w=W[i];c+=del?-1:1;el.textContent=w.slice(0,c);el.dataset.t=w.slice(0,c);let d=del?35:85;
    if(!del&&c===w.length){del=true;d=1600;el.classList.add('go');setTimeout(()=>el.classList.remove('go'),450)}
    else if(del&&c===0){del=false;i=(i+1)%W.length;d=250}
    setTimeout(t,d)})();
})();

/* ---------- Install guides (edit the text here) ---------- */
const S={
  dial:['Access Dial Menu',['Launch the application «Telephone» on your car\'s head unit','Dial the number *#*#888 and press "Call"','Enter your password "369875"']],
  adb:['Open ADB Port',['Select the "second item" from the left in the engineering menu','Click on the button that says "ADB"']],
  usb:['Connect Laptop to Car',['Take a USB-A to USB-A cable','Connect one head to the Laptop and the other head to Car USB port in the front']],
  inst:m=>['Install via ChanApps',[`Open ChanApps, select "${m}" from the dropdown, and click "Install" to install the selected app one by one.`]],
  fin:['Finish and Restart',['After all apps installed Keep "-" button on the steering wheel to restart the car monitor']]
};
const COMBO=[['OK','Hold 7 seconds','hold'],'→',['+','x 2'],['◄','x 2'],['−','x 2'],['►','x 2'],'→',['OK','x 3','finish']];
const comboHTML=`<p class="combo-label">Use the Steering Wheel sequence:</p><div class="combo-sequence">${COMBO.map(k=>typeof k==='string'?`<div class="arrow">${k}</div>`:`<div class="combo-key-wrapper"><div class="key">${k[0]}</div><span class="action-tag ${k[2]||''}">${k[1]||k[1]}</span></div>`).join('')}</div><p class="combo-label">When combination is correct you will hear the connecting sound from your Laptop.<br>The combination is hard to get at the first try, a few times.</p>`;
const std=m=>[S.dial,S.adb,S.usb,S.inst(m),S.fin];
const GUIDES={
  'Uni V':std('Uni V'),
  'Uni K':std('Uni K'),
  'A05 (Lamore)':[S.usb,['Access Dial Menu',[],comboHTML],S.inst('A05 (Lamore)'),['Finish and Restart',[...S.fin[1],'Restart Twice']]],
  'Q05':std('Q05')
};
(function(){
  const sel=$('#models'),out=$('#guide-out');if(!sel)return;
  const show=n=>{$$('.model-btn').forEach(b=>b.classList.toggle('active',b.dataset.n===n));
    out.innerHTML='<div class="timeline">'+GUIDES[n].map((s,i)=>`<div class="step" style="animation-delay:${i*.1}s"><div class="step-number">${i+1}</div><div class="step-content"><h3>${s[0]}</h3>${s[1].map(p=>`<p>${p}</p>`).join('')}${s[2]||''}</div></div>`).join('')+'</div>'};
  sel.innerHTML=Object.keys(GUIDES).map(n=>`<button class="model-btn" data-n="${n}">${n}</button>`).join('');
  sel.onclick=e=>e.target.dataset.n&&show(e.target.dataset.n);
  show(Object.keys(GUIDES)[0]);
})();
