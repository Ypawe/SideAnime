const animeData = [
  {id:"jujutsu-kaisen",title:"Jujutsu Kaisen",year:2020,rating:8.7,episodes:24,genres:["Aksiyon","Fantastik"],symbol:"呪",bg:"#37224f",glow:"#bd62e9",description:"lanetlerin ve doğaüstü güçlerin gölgesindeki bir dünyada yuji itadori, arkadaşlarını korumak ve tehlikeli lanetlerle yüzleşmek için büyücülük dünyasına adım atar.",status:"tamamlandı"},
  {id:"chainsaw-man",title:"Chainsaw Man",year:2022,rating:8.5,episodes:12,genres:["Aksiyon","Fantastik"],symbol:"刃",bg:"#4b1d32",glow:"#f36b8d",description:"borç içinde yaşayan denji, hayatını değiştiren bir olayın ardından testere şeytanının güçlerini kazanır ve şeytan avcılarının dünyasına girer.",status:"tamamlandı"},
  {id:"frieren",title:"Frieren: Beyond Journey's End",year:2023,rating:9.3,episodes:28,genres:["Fantastik","Drama"],symbol:"葬",bg:"#20324b",glow:"#7aacef",description:"büyük macera sona erdikten sonra elf büyücü frieren, zamanın insanlar için ne kadar değerli olduğunu anlamak üzere yeni bir yolculuğa çıkar.",status:"tamamlandı"},
  {id:"spy-family",title:"SPY x FAMILY",year:2022,rating:8.4,episodes:25,genres:["Aksiyon","Drama"],symbol:"S×F",bg:"#234438",glow:"#7bd6a0",description:"gizli bir görev için casus loid sahte bir aile kurar. ancak evlat edindiği çocuk telepat, eşi ise gizli bir suikastçıdır.",status:"tamamlandı"},
  {id:"evangelion",title:"Neon Genesis Evangelion",year:1995,rating:8.3,episodes:26,genres:["Drama","Aksiyon"],symbol:"EVA",bg:"#3c2b56",glow:"#d88be9",description:"shinji ikari, insanlığı tehdit eden gizemli varlıklara karşı devasa eva birimlerini kullanmak üzere görevlendirilir.",status:"tamamlandı"},
  {id:"demon-slayer",title:"Demon Slayer",year:2019,rating:8.6,episodes:26,genres:["Aksiyon","Fantastik"],symbol:"滅",bg:"#183d46",glow:"#68d7d1",description:"ailesi şeytanlar tarafından saldırıya uğrayan tanjiro, kız kardeşini kurtarmak ve ailesinin intikamını almak için şeytan avcısı olur.",status:"tamamlandı"}
];

const app = document.getElementById("app");
const featuredGrid = document.getElementById("featured-grid");
const catalogGrid = document.getElementById("catalog-grid");
const searchInput = document.getElementById("search-input");
const emptyState = document.getElementById("empty-state");
let activeGenre = "Tümü";
let searchTerm = "";

function posterMarkup(anime, compact=false) {
  return `<div class="${compact ? "detail-poster" : "poster"}" style="--poster-bg:${anime.bg};--poster-glow:${anime.glow}">
    <span class="${compact ? "" : "poster-symbol"}">${anime.symbol}</span>
    ${compact ? "" : `<span class="poster-badge">${anime.year}</span><span class="poster-score">★ ${anime.rating}</span>`}
  </div>`;
}
function cardMarkup(anime) {
  return `<article class="anime-card" tabindex="0" role="link" aria-label="${anime.title} detaylarını aç" data-open-anime="${anime.id}">
    ${posterMarkup(anime)}
    <div class="card-content"><div class="card-title-row"><h3 class="card-title">${anime.title}</h3><span class="card-year">${anime.year}</span></div>
      <div class="card-meta">${anime.genres.map(g=>`<span class="genre-tag">${g}</span>`).join("")}</div>
      <div class="card-bottom"><span>▶ ${anime.episodes} bölüm</span><strong>★ ${anime.rating} / 10</strong></div>
    </div>
  </article>`;
}
function renderCatalog() {
  const filtered = animeData.filter(a => (activeGenre === "Tümü" || a.genres.includes(activeGenre)) && a.title.toLowerCase().includes(searchTerm));
  catalogGrid.innerHTML = filtered.map(cardMarkup).join("");
  emptyState.classList.toggle("hidden", filtered.length !== 0);
  document.getElementById("catalog-count").textContent = `${filtered.length.toString().padStart(2,"0")} anime`;
}
function renderDetail(id) {
  const anime = animeData.find(a=>a.id===id);
  if (!anime) { location.hash = "#catalog"; return; }
  document.querySelector(".hero").classList.add("hidden");
  document.querySelector("#top").classList.add("hidden");
  document.querySelector("#catalog").classList.add("hidden");
  document.getElementById("watch-view").classList.add("hidden");
  const detail = document.getElementById("detail-view");
  detail.classList.remove("hidden");
  const episodes = Array.from({length:anime.episodes},(_,i)=>`<button class="episode-item" data-watch="${anime.id}" data-episode="${i+1}"><span class="episode-number">${String(i+1).padStart(2,"0")}</span><span class="episode-info"><strong>${i+1}. bölüm</strong><span>${i===0?"başlangıç":`bölüm ${i+1}`} · bölüm bilgisi</span></span><span>▶</span></button>`).join("");
  detail.innerHTML = `<a class="back-link" href="#catalog">← anime kataloğuna dön</a>
    <div class="detail-hero"><div>${posterMarkup(anime,true)}</div><div class="detail-copy"><p class="eyebrow">anime detayları</p><h1>${anime.title}</h1><div class="detail-rating">★ ${anime.rating} / 10 <span style="color:var(--muted)"> · ${anime.year} · ${anime.episodes} bölüm</span></div><p class="detail-description">${anime.description}</p><div class="detail-tags">${anime.genres.map(g=>`<span>${g}</span>`).join("")}<span>${anime.status}</span></div><div class="detail-buttons"><button class="primary-button" data-watch="${anime.id}" data-episode="1">ilk bölüme git <span>▶</span></button><button class="secondary-button" data-favorite="${anime.id}">♡ favorilere ekle</button></div></div></div>
    <div class="episode-heading"><h2>bölümler</h2><span class="catalog-count">${anime.episodes} bölüm</span></div><div class="episode-list">${episodes}</div>`;
  window.scrollTo({top:0,behavior:"smooth"});
}
function renderWatch(id, episode) {
  const anime = animeData.find(a=>a.id===id);
  if (!anime) return;
  document.querySelector(".hero").classList.add("hidden");
  document.querySelector("#top").classList.add("hidden");
  document.querySelector("#catalog").classList.add("hidden");
  document.getElementById("detail-view").classList.add("hidden");
  const watch = document.getElementById("watch-view");
  watch.classList.remove("hidden");
  watch.innerHTML = `<a class="back-link" href="#anime/${anime.id}">← ${anime.title} bölüm listesi</a><div class="player-placeholder"><button class="player-play" aria-label="oynat">▶</button><h1>${anime.title} · ${episode}. bölüm</h1><p>bu alan oynatıcı demosudur. gerçek video oynatmak için yayınlama iznin olan bir video kaynağı eklemeliyiz</p></div><div class="watch-next"><p>★ ${anime.rating} / 10 · bölüm ${episode} / ${anime.episodes}</p><div><button class="secondary-button" data-watch="${anime.id}" data-episode="${Math.max(1,episode-1)}" ${episode===1?"disabled":""}>← önceki</button> <button class="primary-button" data-watch="${anime.id}" data-episode="${Math.min(anime.episodes,episode+1)}">sonraki →</button></div></div>`;
  window.scrollTo({top:0,behavior:"smooth"});
}
function showHome() {
  document.querySelector(".hero").classList.remove("hidden");
  document.querySelector("#top").classList.remove("hidden");
  document.querySelector("#catalog").classList.remove("hidden");
  document.getElementById("detail-view").classList.add("hidden");
  document.getElementById("watch-view").classList.add("hidden");
}
function route() {
  const hash = decodeURIComponent(location.hash || "#home").replace(/^#/,"");
  if (hash.startsWith("anime/")) renderDetail(hash.split("/")[1]);
  else if (hash.startsWith("watch/")) { const [,id,episode] = hash.split("/"); renderWatch(id, Number(episode)||1); }
  else showHome();
}
featuredGrid.innerHTML = [...animeData].sort((a,b)=>b.rating-a.rating).slice(0,3).map(cardMarkup).join("");
renderCatalog();
document.getElementById("anime-count").textContent = String(animeData.length).padStart(2,"0");
document.addEventListener("click", event => {
  const card = event.target.closest("[data-open-anime]");
  if (card) { location.hash = `anime/${card.dataset.openAnime}`; return; }
  const watch = event.target.closest("[data-watch]");
  if (watch) { location.hash = `watch/${watch.dataset.watch}/${watch.dataset.episode}`; return; }
  const favorite = event.target.closest("[data-favorite]");
  if (favorite) {
    const id = favorite.dataset.favorite;
    const saved = new Set(JSON.parse(localStorage.getItem("sideanime-favorites") || "[]"));
    saved.has(id) ? saved.delete(id) : saved.add(id);
    localStorage.setItem("sideanime-favorites", JSON.stringify([...saved]));
    favorite.textContent = saved.has(id) ? "♥ favorilere eklendi" : "♡ favorilere ekle";
    return;
  }
});
document.addEventListener("keydown", event => {
  if ((event.key==="Enter" || event.key===" ") && event.target.matches("[data-open-anime]")) { event.preventDefault(); location.hash=`anime/${event.target.dataset.openAnime}`; }
});
searchInput.addEventListener("input",()=>{searchTerm=searchInput.value.trim().toLowerCase();renderCatalog();});
document.getElementById("genre-filters").addEventListener("click",event=>{
  const button=event.target.closest("[data-genre]"); if(!button)return;
  activeGenre=button.dataset.genre;
  document.querySelectorAll("[data-genre]").forEach(b=>b.classList.toggle("active",b===button));
  renderCatalog();
});
document.getElementById("search-toggle").addEventListener("click",()=>{document.getElementById("catalog").scrollIntoView({behavior:"smooth"});searchInput.focus();});
document.getElementById("profile-button").addEventListener("click",()=>document.getElementById("profile-dialog").showModal());
window.addEventListener("hashchange",route);
route();
