// ---------- Données des pièces (photos libres de droits, licence Unsplash) ----------
const rooms = {
  salon: {
    photo: "https://images.unsplash.com/photo-1680965585463-386646047473?fm=jpg&q=80&w=2400&auto=format&fit=crop",
    credit: "Clay Banks / Unsplash",
    spots: [
      { x: 38, y: 62, zoom: 2.4, title:"Canapé", sub:"Assise basse, tissu texturé", desc:"Placé face à la pièce plutôt qu'au mur, il invite à la conversation plutôt qu'à l'écran." },
      { x: 68, y: 40, zoom: 2.6, title:"Applique murale", sub:"Laiton brossé", desc:"Une lumière chaude et basse, allumée en soirée pour remplacer l'éclairage principal." },
      { x: 20, y: 30, zoom: 2.2, title:"Bibliothèque", sub:"Bois brut", desc:"Rangement ouvert pensé pour vieillir avec les objets qu'il accueille." },
    ]
  },
  cuisine: {
    photo: "https://images.unsplash.com/photo-1682888813734-b1b0a4f79385?fm=jpg&q=80&w=2400&auto=format&fit=crop",
    credit: "Zac Gudakov / Unsplash",
    spots: [
      { x: 46, y: 58, zoom: 2.3, title:"Îlot central", sub:"Bois massif, plan de travail continu", desc:"Pensé pour rassembler — plan de travail d'un seul tenant, sans joint visible." },
      { x: 74, y: 35, zoom: 2.4, title:"Rangements hauts", sub:"Laque mate", desc:"Une façade continue qui efface la frontière entre rangement et mur." },
    ]
  },
  chambre: {
    photo: "https://images.unsplash.com/photo-1552558636-f6a8f071c2b3?fm=jpg&q=80&w=2400&auto=format&fit=crop",
    credit: "nine koepfer / Unsplash",
    spots: [
      { x: 42, y: 56, zoom: 2.3, title:"Tête de lit basse", sub:"Bois naturel", desc:"Une ligne basse qui garde la pièce silencieuse et ouverte sur la lumière du matin." },
      { x: 78, y: 42, zoom: 2.5, title:"Coin lecture", sub:"Lin lavé", desc:"Un point de calme supplémentaire, à l'écart du lit, pensé pour ralentir avant de dormir." },
    ]
  }
};

// ---------- Visite interactive ----------
const scene = document.getElementById('scene');
const photo = document.getElementById('photo');
const panel = document.getElementById('panel');
const backBtn = document.getElementById('back');
const pTitle = document.getElementById('pTitle'), pSub = document.getElementById('pSub'), pDesc = document.getElementById('pDesc');
const tabs = document.querySelectorAll('.tab');

let currentRoom = 'salon';

function loadRoom(key){
  currentRoom = key;
  closeSpot();
  const r = rooms[key];
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
  tabs.forEach(t=>t.classList.toggle('active', t.dataset.room===key));
}

function openSpot(s){
  scene.classList.add('zoomed');
  photo.style.transformOrigin = s.x+'% '+s.y+'%';
  photo.style.transform = `scale(${s.zoom})`;
  document.querySelectorAll('.hotspot').forEach(h=>h.style.opacity='0');
  backBtn.classList.add('show');
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
  setTimeout(()=>document.querySelectorAll('.hotspot').forEach(h=>h.style.opacity='1'), 400);
}
backBtn.addEventListener('click', closeSpot);
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
