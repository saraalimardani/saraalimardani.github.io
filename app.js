'use strict';
const timeline=document.querySelector('.timeline');
const jobs=[...document.querySelectorAll('.job')];
const pageFill=document.querySelector('.page-progress span');
const navLinks=[...document.querySelectorAll('nav a')];
const sections=navLinks.map(a=>document.querySelector(a.hash));
let pending=false;
function sizeCards(){schedule();}

function updateScroll(){
 pending=false;
 const doc=document.documentElement;
 const pageLength=Math.max(1,doc.scrollHeight-innerHeight);
 pageFill.style.transform='scaleX('+Math.min(1,Math.max(0,scrollY/pageLength))+')';
 // Keep tall cards fully readable on shorter viewports.
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 jobs.forEach((job,i)=>{
  const card=job.querySelector('.job-card');
  const top=Math.min(112,innerHeight-card.offsetHeight-28);
  job.style.setProperty('--stack-top',top+'px');
  const next=jobs[i+1];
  const distance=next ? next.getBoundingClientRect().top-top : innerHeight;
  const progress=reduced?0:Math.max(0,Math.min(1,(innerHeight*.65-distance)/(innerHeight*.65)));
  card.style.transform='scale('+(1-progress*.045)+') rotate('+(-progress*.65)+'deg)';
  card.style.opacity=1-progress*.10;
 });
 let current=0;
 sections.forEach((section,i)=>{if(section.getBoundingClientRect().top<=innerHeight*.35)current=i;});
 // The final section may be too short to reach the activation line.
 if(scrollY>0 && scrollY>=pageLength-2)current=sections.length-1;
 navLinks.forEach((a,i)=>{a.classList.toggle('active',i===current);if(i===current)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});
 document.querySelector('header').classList.toggle('scrolled',scrollY>30);
}
function schedule(){if(!pending){pending=true;requestAnimationFrame(updateScroll);}}
addEventListener('scroll',schedule,{passive:true});
addEventListener('resize',sizeCards);
addEventListener('load',sizeCards);
document.fonts.ready.then(sizeCards);
new ResizeObserver(schedule).observe(timeline);
document.getElementById('year').textContent=new Date().getFullYear();
const title=document.getElementById('typed');
const roles=['Product Designer','Fintech Product Designer','Interaction Designer','Design Systems Designer'];
if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
 title.parentElement.setAttribute('aria-label',roles.join(', '));
 title.setAttribute('aria-hidden','true');
 let roleIndex=0,letter=0,deleting=false;
 title.textContent='';
 function animateRole(){
  if(document.hidden){setTimeout(animateRole,400);return;}
  const role=roles[roleIndex];
  letter+=deleting?-1:1;
  title.textContent=role.slice(0,letter);
  if(!deleting && letter===role.length){deleting=true;setTimeout(animateRole,2100);}
  else if(deleting && letter===0){deleting=false;roleIndex=(roleIndex+1)%roles.length;setTimeout(animateRole,300);}
  else setTimeout(animateRole,deleting?40:85);
 }
 setTimeout(animateRole,250);
}
sizeCards();
updateScroll();

// Reveal selected work and supporting sections without delaying access to content.
if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
 const targets=[...document.querySelectorAll('.project-card,.skills-grid article,.education-grid')];
 const reveals=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('revealed');reveals.unobserve(entry.target);}});
 },{threshold:.08});
 targets.forEach((target,i)=>{target.classList.add('reveal');target.style.setProperty('--reveal-delay',(i%2)*90+'ms');reveals.observe(target);});
}
