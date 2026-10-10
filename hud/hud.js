/* ChanApps HUD: gauges, engine-start intro, scroll speedometer. Needs ../script.js loaded first. */
(function(){
  const ARC='M43.43 156.57A80 80 0 1 1 156.57 156.57';
  function gauge(host,max,unit,label,color){
    if(!host)return null;let t='';
    for(let i=0;i<=20;i++){const a=(-135+i*13.5)*Math.PI/180,big=i%5===0,r1=93,r2=r1-(big?12:6);
      t+=`<line class="tk${big?' b':''}" x1="${100+r1*Math.sin(a)}" y1="${100-r1*Math.cos(a)}" x2="${100+r2*Math.sin(a)}" y2="${100-r2*Math.cos(a)}"/>`;
      if(big)t+=`<text class="tl" x="${100+68*Math.sin(a)}" y="${103-68*Math.cos(a)}">${Math.round(max*i/20)}</text>`}
    host.innerHTML=`<svg viewBox="0 0 200 200">${t}<path class="trk" d="${ARC}" pathLength="100"/><path class="val" d="${ARC}" pathLength="100" stroke-dasharray="0 100" style="stroke:${color};color:${color}"/><g class="nd" transform="rotate(-135 100 100)"><line x1="100" y1="100" x2="100" y2="30"/></g><circle class="hub" cx="100" cy="100" r="8"/><text class="num" x="100" y="142">0</text><text class="un" x="100" y="156">${unit}</text></svg><p class="gl">${label}</p>`;
    const v=host.querySelector('.val'),n=host.querySelector('.nd'),x=host.querySelector('.num');
    return p=>{p=Math.max(0,Math.min(1,p));v.setAttribute('stroke-dasharray',`${p*100} 100`);n.setAttribute('transform',`rotate(${-135+p*270} 100 100)`);x.textContent=Math.round(p*max)}
  }
  const speedo=gauge($('#g-speed'),240,'KM/H','SPEED','#19d3ff'),rpm=gauge($('#g-rpm'),8,'x1000 RPM','ENGINE','#ffb020');
  let cur=0,last=scrollY,vel=0,over=null;
  const mv=$('#mv'),mg=$('#mg');
  addEventListener('scroll',()=>{vel=Math.min(Math.abs(scrollY-last),60);last=scrollY});
  (function loop(){
    const max=document.body.scrollHeight-innerHeight||1,prog=scrollY/max;
    let tgt=over!==null?over:Math.min(1,.04+prog*.75+vel/120);vel*=.9;
    cur+=(tgt-cur)*.08;
    if(speedo)speedo(cur);if(rpm)rpm(Math.min(1,cur*.8+Math.sin(performance.now()/180)*.015*cur));
    if(mv){mv.textContent=String(Math.round(cur*240)).padStart(3,'0');mg.textContent=scrollY<40?'P':cur>.5?'D3':'D'}
    requestAnimationFrame(loop)
  })();
  const sweep=()=>{over=1;setTimeout(()=>over=0,900);setTimeout(()=>over=null,1900)};
  const boot=$('#boot');
  function go(){if(!boot||boot.classList.contains('off'))return;boot.classList.add('off');try{sessionStorage.setItem('booted','1')}catch(e){}sweep()}
  if(boot){let seen=false;try{seen=sessionStorage.getItem('booted')}catch(e){}
    if(seen){boot.classList.add('off');setTimeout(sweep,300)}
    else{$('#start').onclick=go;setTimeout(go,4500)}}
  const clk=$('#clock');if(clk){const tick=()=>clk.textContent=new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});tick();setInterval(tick,10000)}
})();
