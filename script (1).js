// ---------- Données des pièces (photos libres de droits, licence Unsplash) ----------
// Remarque : les coordonnées x/y sont une estimation raisonnable de la composition
// (photo grand-angle classique) — ajuste-les de quelques % en les comparant à l'image
// ouverte dans un nouvel onglet si un point ne tombe pas exactement sur l'élément.
const rooms = {
  salon: {
    photo: "https://images.unsplash.com/photo-1680965585463-386646047473?fm=jpg&q=80&w=2400&auto=format&fit=crop",
    credit: "Clay Banks / Unsplash",
    spots: [
      { x: 40, y: 66, zoom: 2.3, title:"Canapé", sub:"Assise grise, coussins texturés", desc:"Bas et profond, tourné vers la pièce plutôt que vers un écran — pensé pour la conversation." },
      { x: 66, y: 34, zoom: 2.4, title:"Toile murale", sub:"Accrochage sur mur lambrissé", desc:"Une seule pièce accrochée sur le bois, plutôt qu'une collection — pour laisser respirer le mur." },
      { x: 20, y: 48, zoom: 2.5, title:"Lampe d'appoint", sub:"Lumière basse et chaude", desc:"Complète la lumière naturelle en fin de journée sans jamais dominer la pièce." },
    ]
  },
  cuisine: {
    photo: "https://images.unsplash.com/photo-1682888813734-b1b0a4f79385?fm=jpg&q=80&w=2400&auto=format&fit=crop",
    credit: "Zac Gudakov / Unsplash",
    spots: [
      { x: 44, y: 60, zoom: 2.2, title:"Îlot central", sub:"Façade blanche, plan de travail bois", desc:"Le cœur de la pièce — assez large pour cuisiner à deux sans se gêner." },
      { x: 72, y: 68, zoom: 2.5, title:"Tabouret de bar", sub:"Bois clair", desc:"Installé côté îlot pour transformer la cuisine en lieu de passage et de discussion." },
    ]
  },
  chambre: {
    photo: "https://images.unsplash.com/photo-1552558636-f6a8f071c2b3?fm=jpg&q=80&w=2400&auto=format&fit=crop",
    credit: "nine koepfer / Unsplash",
    spots: [
      { x: 50, y: 62, zoom: 2.2, title:"Lit bas", sub:"Linge de lit naturel", desc:"Une silhouette basse qui garde la chambre silencieuse et laisse le regard filer vers la fenêtre." },
      { x: 22, y: 50, zoom: 2.6, title:"Plante", sub:"Feuillage près du lit", desc:"La seule touche végétale de la pièce — juste assez pour apporter de la vie sans surcharger." },
    ]
  }
};

// ---------- Rideau d'ouverture ----------
window.addEventListener('load', ()=>{
  setTimeout(()=>document.getElementById('curtain').classList.add('open'), 250);
});

// ---------- Parallax sur le héro ----------
const heroPhoto = document.querySelector('.hero-photo');
const heroSection = document.getElementById('hero');
addEventListener('scroll', ()=>{
  const r = heroSection.getBoundingClientRect();
  if (r.bottom > 0){
    heroPhoto.style.transform = `translateY(${window.scrollY * 0.18}px)`;
  }
}, {passive:true});

// ---------- Révélation des sections au scroll ----------
const revealIO = new IntersectionObserver(entries=>{
  entries.forEach(en=>{ if(en.isIntersecting) en.target.classList.add('in'); });
}, {threshold:.15});
document.querySelectorAll('[data-reveal]').forEach(el=>revealIO.observe(el));

// ---------- Titres en cascade (split par mots) ----------
document.querySelectorAll('[data-split]').forEach(el=>{
  const words = el.innerHTML.split(' ');
  el.innerHTML = words.map(w=>`<span class="word"><span>${w}</span></span>`).join(' ');
});
const splitIO = new IntersectionObserver(entries=>{
  entries.forEach(en=>{
    if(en.isIntersecting){
      en.target.querySelectorAll('.word span').forEach((s,i)=>{ s.style.transitionDelay = (i*45)+'ms'; });
      en.target.classList.add('in');
    }
  });
}, {threshold:.4});
document.querySelectorAll('[data-split]').forEach(el=>splitIO.observe(el));

// ---------- Visite interactive ----------
const scene = document.getElementById('scene');
const photo = document.getElementById('photo');
const spot = document.getElementById('spot');
const door = document.getElementById('door');
const panel = document.getElementById('panel');
const backBtn = document.getElementById('back');
const hint = document.querySelector('.hint');
const pTitle = document.getElementById('pTitle'), pSub = document.getElementById('pSub'), pDesc = document.getElementById('pDesc');
const tabs = document.querySelectorAll('.tab');

scene.addEventListener('mousemove', e=>{
  const r = scene.getBoundingClientRect();
  spot.style.left = (e.clientX - r.left) + 'px';
  spot.style.top = (e.clientY - r.top) + 'px';
  spot.style.marginLeft = '-130px'; spot.style.marginTop = '-130px';
});

let currentRoom = null;

function loadRoom(key){
  if(key === currentRoom) return;
  const first = currentRoom === null;
  currentRoom = key;
  closeSpot();
  const r = rooms[key];
  const swap = ()=>{
    photo.src = r.photo;
    document.querySelectorAll('.hotspot').forEach(h=>h.remove());
    r.spots.forEach(s=>{
      const h = document.createElement('button');
      h.className='hotspot';
      h.style.left = s.x+'%'; h.style.top = s.y+'%';
      h.setAttribute('aria-label', s.title);
      h.addEventListener('click', ()=>openSpot(s));
      scene.appendChild(h);
    });
  };
  if(first){ swap(); }
  else {
    document.querySelectorAll('.hotspot').forEach(h=>h.style.opacity='0');
    door.classList.add('close');
    setTimeout(()=>{
      swap();
      door.classList.add('open-out');
      door.classList.remove('close');
      setTimeout(()=>door.classList.remove('open-out'), 600);
    }, 560);
  }
  tabs.forEach(t=>t.classList.toggle('active', t.dataset.room===key));
}

function openSpot(s){
  scene.classList.add('zoomed');
  photo.style.transformOrigin = s.x+'% '+s.y+'%';
  photo.style.transform = `scale(${s.zoom})`;
  document.querySelectorAll('.hotspot').forEach(h=>h.style.opacity='0');
  backBtn.classList.add('show');
  hint.textContent = 'Cliquer sur la photo pour revenir';
  setTimeout(()=>{
    pTitle.textContent=s.title; pSub.textContent=s.sub; pDesc.textContent=s.desc;
    panel.classList.add('open');
  }, 650);
}
function closeSpot(){
  panel.classList.remove('open');
  scene.classList.remove('zoomed');
  photo.style.transform='scale(1)';
  backBtn.classList.remove('show');
  hint.textContent = 'Cliquer un point pour s\'approcher';
  setTimeout(()=>document.querySelectorAll('.hotspot').forEach(h=>h.style.opacity='1'), 400);
}
backBtn.addEventListener('click', closeSpot);
scene.addEventListener('click', e=>{
  if(scene.classList.contains('zoomed') && !e.target.closest('.hotspot') && !e.target.closest('#back')) closeSpot();
});
document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeSpot(); });
tabs.forEach(t=>t.addEventListener('click', ()=>loadRoom(t.dataset.room)));
loadRoom('salon');

// ---------- Projets ----------
const projects = [
  {name:"Maison Verrière", place:"Fontainebleau", yr:"2024", desc:"Extension en acier et verre d'une longère du XIXe, pensée comme une serre habitée entre le jardin et la forêt."},
  {name:"Le Petit Cavaillon", place:"Aix-en-Provence", yr:"2023", desc:"Rénovation d'un mas en maison d'hôtes de quatre chambres, pierre calcaire et enduits à la chaux teintée."},
  {name:"Atelier Nord-Est", place:"Belleville, Paris", yr:"2023", desc:"Transformation d'un atelier d'artisan en loft habité, verrières conservées, sol en béton ciré brossé."},
  {name:"Maison Litoral", place:"Île de Ré", yr:"2022", desc:"Maison basse en chêne brûlé et chaux, ouverte sur le bassin, conçue pour vieillir avec le sel et le vent."}
];
const plist = document.getElementById('plist');
projects.forEach(p=>{
  const b = document.createElement('button');
  b.className='pitem';
  b.innerHTML = `<span class="name">${p.name}</span><span class="place">${p.place}</span><span class="yr">${p.yr}</span>`;
  plist.appendChild(b);
});
