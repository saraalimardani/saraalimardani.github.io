'use strict';
const title=document.getElementById('typed');
const roles=['Product Designer','Fintech Product Designer','Interaction Designer','Design Systems Designer'];
if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
 title.parentElement.setAttribute('aria-label',roles.join(', '));
 title.setAttribute('aria-hidden','true');
 let roleIndex=0,letter=0,deleting=false;
 title.textContent='';
 function animateRole(){
  if(document.hidden){title.textContent=roles[roleIndex];letter=roles[roleIndex].length;deleting=true;setTimeout(animateRole,400);return;}
  const role=roles[roleIndex];
  letter+=deleting?-1:1;
  title.textContent=role.slice(0,letter);
  if(!deleting && letter===role.length){deleting=true;setTimeout(animateRole,2100);}
  else if(deleting && letter===0){deleting=false;roleIndex=(roleIndex+1)%roles.length;setTimeout(animateRole,300);}
  else setTimeout(animateRole,deleting?40:85);
 }
 setTimeout(animateRole,250);
}

const cases=document.getElementById('case-studies');
const homeLink=document.querySelector('nav a[href="#top"]');
const casesLink=document.querySelector('nav a[href="#case-studies"]');
const aboutLink=document.querySelector('nav a[href="about.html"]');
function updateNavigation(){
 const inCases=cases.getBoundingClientRect().top<innerHeight*.45;
 const inAbout=document.getElementById('about').getBoundingClientRect().top<innerHeight*.45;
 [homeLink,casesLink,aboutLink].forEach((link,i)=>{const active=i===(inAbout?2:inCases?1:0);link.classList.toggle('active',active);if(active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
}
addEventListener('scroll',updateNavigation,{passive:true});
addEventListener('resize',updateNavigation);
updateNavigation();
const careerSteps=[...document.querySelectorAll('.career-step')];
const header=document.querySelector('.site-header');
// Career history stays in normal document flow at its natural content height.
careerSteps.forEach(step=>{
 step.classList.add('stack-static');
 step.querySelector('.career-card').style.minHeight='';
});
const caseSteps=[...document.querySelectorAll('.case-step')];
const caseList=document.querySelector('.case-list');
function layoutCases(){
 const compactHeight=matchMedia('(max-width:560px)').matches?59:47;
 const headerTop=compactHeight+18;
 caseList.classList.remove('stack-enabled');
 const rows=caseSteps.map(step=>step.querySelector('.case-row'));
 rows.forEach(row=>{row.style.height='';row.style.minHeight='';});
 const height=Math.ceil(Math.max(...rows.map(row=>row.getBoundingClientRect().height)));
 rows.forEach(row=>{row.style.height=height+'px';});
 // Tall cards scroll fully into view before their lower edge pins.
 const top=Math.min(headerTop,innerHeight-height-16);
 caseList.style.setProperty('--case-top',top+'px');
 caseList.classList.toggle('stack-enabled',!matchMedia('(prefers-reduced-motion: reduce)').matches);
}
addEventListener('resize',layoutCases);
addEventListener('load',layoutCases);
document.fonts.ready.then(layoutCases);
layoutCases();

const careerRail=document.querySelector('.career-rail');
const careerFill=document.querySelector('.career-rail-fill');
function updateCareerProgress(){
 const stack=document.querySelector('.career-stack').getBoundingClientRect();
 careerRail.style.clipPath='inset('+Math.max(0,header.offsetHeight-careerRail.getBoundingClientRect().top)+'px 0 0 0)';
 const marker=Math.max(header.offsetHeight+48,innerHeight*.4);
 const progress=Math.max(0,Math.min(1,(marker-stack.top-48)/careerRail.offsetHeight));
 careerFill.style.transform='scaleY('+progress+')';
 let current=-1;
 careerSteps.forEach((step,i)=>{if(step.getBoundingClientRect().top+48<=marker)current=i;});
 careerSteps.forEach((step,i)=>{step.classList.toggle('is-current',i===current);step.classList.toggle('is-past',i<current);});
}
addEventListener('scroll',updateCareerProgress,{passive:true});
addEventListener('resize',updateCareerProgress);
addEventListener('load',updateCareerProgress);
document.fonts.ready.then(updateCareerProgress);
updateCareerProgress();
