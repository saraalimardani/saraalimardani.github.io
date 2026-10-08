'use strict';
const timeline=document.querySelector('.timeline');
const jobs=[...document.querySelectorAll('.job')];
const dots=jobs.map(job=>job.querySelector('.dot'));
const fill=document.querySelector('.timeline-fill');
const pageFill=document.querySelector('.page-progress span');
const navLinks=[...document.querySelectorAll('nav a')];
const sections=navLinks.map(a=>document.querySelector(a.hash));
let pending=false;
function updateScroll(){
 pending=false;
 const doc=document.documentElement;
 const pageLength=Math.max(1,doc.scrollHeight-innerHeight);
 pageFill.style.transform='scaleX('+Math.min(1,Math.max(0,scrollY/pageLength))+')';
 const rect=timeline.getBoundingClientRect();
 const centers=dots.map(dot=>{const d=dot.getBoundingClientRect();return d.top+d.height/2-rect.top;});
 const start=centers[0],length=Math.max(1,centers.at(-1)-start);
 const cursor=innerHeight*.62-rect.top;
 const travelled=Math.max(0,Math.min(length,cursor-start));
 timeline.style.setProperty('--start',start+'px');
 timeline.style.setProperty('--length',length+'px');
 fill.style.height=travelled+'px';
 let active=-1;
 centers.forEach((center,i)=>{const passed=cursor>=center;jobs[i].classList.toggle('passed',passed);if(passed)active=i;});
 jobs.forEach((job,i)=>job.classList.toggle('active-step',i===active));
 let current=0;
 sections.forEach((section,i)=>{if(section.getBoundingClientRect().top<=innerHeight*.35)current=i;});
 navLinks.forEach((a,i)=>{a.classList.toggle('active',i===current);if(i===current)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});
 document.querySelector('header').classList.toggle('scrolled',scrollY>30);
}
function schedule(){if(!pending){pending=true;requestAnimationFrame(updateScroll);}}
addEventListener('scroll',schedule,{passive:true});
addEventListener('resize',schedule);
addEventListener('load',schedule);
document.fonts.ready.then(schedule);
new ResizeObserver(schedule).observe(timeline);
document.getElementById('year').textContent=new Date().getFullYear();
const title=document.getElementById('typed');
if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
 const text=title.textContent;title.textContent='';title.parentElement.setAttribute('aria-label',text);title.setAttribute('aria-hidden','true');let index=0;
 const type=()=>{title.textContent=text.slice(0,++index);if(index<text.length)setTimeout(type,85);};setTimeout(type,250);
}
updateScroll();
