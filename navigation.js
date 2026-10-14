if(location.hash==='#work')history.replaceState(null,'','#case-studies');
if(location.hash==='#contact')history.replaceState(null,'','#about');
'use strict';
const compactHeader=document.querySelector('.site-header');
const headerSpace=document.querySelector('.header-space');
function sizeHeaderSpace(){
 const measurement=compactHeader.cloneNode(true);
 measurement.classList.remove('is-compact');
 measurement.setAttribute('aria-hidden','true');
 measurement.style.visibility='hidden';
 measurement.style.pointerEvents='none';
 measurement.style.transition='none';
 document.body.append(measurement);
 headerSpace.style.height=measurement.offsetHeight+'px';
 measurement.remove();
}
function updateCompactHeader(){
 const compact=window.scrollY>80;
 compactHeader.classList.toggle('is-compact',compact);
 document.documentElement.classList.toggle('compact-navigation',compact);
}
sizeHeaderSpace();
updateCompactHeader();
addEventListener('scroll',updateCompactHeader,{passive:true});
addEventListener('resize',sizeHeaderSpace);
document.fonts.ready.then(sizeHeaderSpace);
// Resolve deep links after fonts and the compact header have settled.
let initialUserScroll=false;
addEventListener('wheel',()=>{initialUserScroll=true;},{once:true,passive:true});
addEventListener('touchstart',()=>{initialUserScroll=true;},{once:true,passive:true});
document.fonts.ready.then(()=>requestAnimationFrame(()=>requestAnimationFrame(()=>{
 const id=location.hash.slice(1);
 const target=id&&document.getElementById(id);
 if(target&&!initialUserScroll)target.scrollIntoView({block:'start',behavior:'instant'});
 document.documentElement.classList.add('navigation-ready');
})));
const initialAnchor=document.getElementById(location.hash.slice(1));
if(initialAnchor){
 const anchorLayoutObserver=new ResizeObserver(()=>{
  if(initialUserScroll){anchorLayoutObserver.disconnect();return;}
  requestAnimationFrame(()=>initialAnchor.scrollIntoView({block:'start',behavior:'instant'}));
 });
 anchorLayoutObserver.observe(document.querySelector('main'));
 addEventListener('pointerdown',()=>{initialUserScroll=true;anchorLayoutObserver.disconnect();},{once:true,passive:true});
 addEventListener('keydown',()=>{initialUserScroll=true;anchorLayoutObserver.disconnect();},{once:true});
}
