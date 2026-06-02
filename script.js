/* ============================================================
   script.js — Smart Diabetic Wound Monitoring Patch Portfolio
   Renders content from data.js and adds timeline images + week focus titles.
============================================================ */

const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

function make(tag, cls, htmlText){
  const node = document.createElement(tag);
  if(cls) node.className = cls;
  if(htmlText !== undefined) node.innerHTML = htmlText;
  return node;
}

function esc(value){
  return String(value ?? "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function link(url, label, cls="btn btn-secondary"){
  if(!url || url === "#") return "";
  return `<a class="${cls}" href="${esc(url)}" target="_blank" rel="noopener">${esc(label)}</a>`;
}

function weekMedia(w){
  const media = (typeof WEEK_MEDIA !== "undefined" && WEEK_MEDIA[w.id]) ? WEEK_MEDIA[w.id] : {};
  return {
    image: media.image || `assets/week-${String(w.id).padStart(2,"0")}.svg`,
    focusTitle: media.focusTitle || w.phase || w.title
  };
}

/* ---------- HERO ---------- */
function renderHero(){
  $("#hero-text").innerHTML = `
    <span class="kicker">Final Year Project · EEE · University of Peradeniya</span>
    <h1>${esc(PROJECT.title)}</h1>
    <p>${esc(PROJECT.subtitle)}. ${esc(PROJECT.tagline)}</p>
    <div class="hero-actions">
      <a class="btn btn-primary" href="#weekly">View Weekly Progress →</a>
      <a class="btn btn-secondary" href="#overview">Read Overview</a>
    </div>
  `;

  $("#hero-panel").innerHTML = `
    <h3>Project at a Glance</h3>
    <div class="stats">
      <div class="stat"><b>59</b><span>mV per pH target</span></div>
      <div class="stat"><b>16-bit</b><span>ADC resolution</span></div>
      <div class="stat"><b>20 mm</b><span>coin electronics module</span></div>
      <div class="stat"><b>≤20k</b><span>LKR prototype budget</span></div>
    </div>
    <h3>Core Technology Stack</h3>
    <div class="chip-list">
      ${["PANI","Ag/AgCl","ESP32-S3","ADS1115","INA333","TMP117","BLE 5.0"].map(x=>`<span class="chip">${esc(x)}</span>`).join("")}
    </div>
  `;
}

/* ---------- OVERVIEW ---------- */
function renderAbstract(){
  $("#abstract-content").innerHTML = `<p>${esc(ABSTRACT).replaceAll("\n","<br>")}</p>`;
}

/* ---------- PROBLEM + TABLE ---------- */
function renderProblem(){
  const wrap = $("#problem-cards");
  (PROBLEM.points || []).forEach((p) => {
    const card = make("article","problem-card reveal");
    card.innerHTML = `
      <div class="problem-icon">${esc(p.icon)}</div>
      <h3>${esc(p.title)}</h3>
      <p>${esc(p.text)}</p>
    `;
    wrap.appendChild(card);
  });

  const body = $("#ph-table-body");
  (WOUND_PH_TABLE || []).forEach((r) => {
    const tr = make("tr");
    tr.innerHTML = `<td>${esc(r.state)}</td><td><b>${esc(r.range)}</b></td><td>${esc(r.interpretation)}</td>`;
    body.appendChild(tr);
  });
}

/* ---------- RESEARCH GAP ---------- */
function renderResearchGap(){
  const grid = $("#paper-cards");
  (RESEARCH_GAP.papers || []).forEach((p) => {
    const card = make("article","paper-card reveal");
    card.innerHTML = `
      <h3>${esc(p.citation)}</h3>
      <p><b>Finding:</b> ${esc(p.finding)}</p>
      <p><b>Limitation:</b> ${esc(p.limitation)}</p>
      <p><b>Relevance:</b> ${esc(p.relevance)}</p>
    `;
    grid.appendChild(card);
  });
  $("#gap-box").innerHTML = `<h3>◆ The Identified Gap</h3><p>${esc(RESEARCH_GAP.gap)}</p>`;
}

/* ---------- SOLUTION ---------- */
function renderSolution(){
  const list = $("#sol-list");
  (SOLUTION.features || []).forEach((f) => {
    const li = make("li");
    li.innerHTML = `<span class="feature-icon">${esc(f.icon)}</span>${esc(f.text)}`;
    list.appendChild(li);
  });
}

/* ---------- OBJECTIVES ---------- */
function renderObjectives(){
  const list = $("#objectives-list");
  (OBJECTIVES || []).forEach((o) => list.appendChild(make("li","reveal",esc(o))));
}

/* ---------- TIMELINE ---------- */
function renderTimeline(){
  const phases = ["All", ...new Set((WEEKS || []).map(w => w.phase))];
  const filterWrap = $("#phase-filters");
  phases.forEach((phase, i) => {
    const btn = make("button","phase-btn" + (i === 0 ? " active" : ""), esc(phase));
    btn.type = "button";
    btn.addEventListener("click", () => {
      $$(".phase-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      $$(".tl-item").forEach(item => {
        item.classList.toggle("hidden", !(phase === "All" || item.dataset.phase === phase));
      });
    });
    filterWrap.appendChild(btn);
  });

  const timeline = $("#timeline");
  (WEEKS || []).forEach((w) => {
    const media = weekMedia(w);
    const item = make("article","tl-item reveal" + (w.status === "Coming soon" ? " coming-soon" : ""));
    item.dataset.phase = w.phase;

    const folders = (w.folders || []).map(f => `<span class="folder-pill">${esc(f)}</span>`).join("");
    const findings = (w.keyFindings || []).map(f => `<li>${esc(f)}</li>`).join("");

    item.innerHTML = `
      <div class="week-image">
        <img src="${esc(media.image)}" alt="${esc(w.label)} work focus image" loading="lazy">
      </div>
      <div class="tl-body">
        <div class="tl-top">
          <span class="tl-week">${esc(w.label)}</span>
          <span class="phase-pill">${esc(w.phase)}</span>
          <span class="tl-status">${esc(w.status)}</span>
        </div>
        <p class="focus-title">Work Focus: ${esc(media.focusTitle)}</p>
        <h3>${esc(w.title)}</h3>
        <p>${esc(w.summary)}</p>
        <div class="folder-list">${folders}</div>
        <div class="tl-actions">
          ${link(w.resourceLink, `Open ${w.label} Drive Resources →`, "btn btn-primary")}
          <button class="btn btn-secondary tl-expand" type="button">+ Read full week breakdown</button>
        </div>
        <div class="tl-details">
          <p><b>Goals:</b> ${esc(w.goals)}</p>
          <p><b>Decisions Made:</b> ${esc(w.decisions)}</p>
          <p><b>Key Findings:</b></p>
          <ul>${findings}</ul>
          <p><b>Rejected / Set Aside:</b> ${esc(w.rejected)}</p>
          <p><b>Led Into Next Week:</b> ${esc(w.nextWeek)}</p>
          <p><b>Evidence / Resource Link:</b> ${esc(w.evidence)}</p>
        </div>
      </div>
    `;

    const btn = item.querySelector(".tl-expand");
    const details = item.querySelector(".tl-details");
    btn.addEventListener("click", () => {
      const open = details.classList.toggle("open");
      btn.textContent = open ? "− Hide breakdown" : "+ Read full week breakdown";
    });
    timeline.appendChild(item);
  });
}

/* ---------- ARCHITECTURE ---------- */
function renderArchitecture(){
  const wrap = $("#arch-diagram");
  (ARCHITECTURE.layers || []).forEach((layer, index) => {
    const row = make("div","arch-layer reveal");
    row.style.borderLeftColor = layer.color || "var(--primary)";
    row.innerHTML = `
      <h3>${esc(layer.label)}</h3>
      <div class="arch-components">${(layer.components || []).map(c => `<span class="arch-chip">${esc(c)}</span>`).join("")}</div>
      <p><b>Output:</b> ${esc(layer.output)}</p>
    `;
    wrap.appendChild(row);
    if(index < ARCHITECTURE.layers.length - 1) wrap.appendChild(make("div","arch-arrow","▼"));
  });
}

/* ---------- SENSOR TECH ---------- */
function renderSensorTech(){
  const data = [
    { icon:"🧪", name:"PANI pH Electrode", spec:"54–69 mV/pH", desc:"Polyaniline Emeraldine Salt working electrode with reversible acid-base doping." },
    { icon:"⚡", name:"Ag/AgCl Reference", spec:"Stable reference", desc:"Screen-printed solid-state reference electrode for potentiometric measurement." },
    { icon:"🌡️", name:"TMP117", spec:"Digital I²C temperature", desc:"Wound surface temperature monitoring and pH temperature compensation." },
    { icon:"💧", name:"Impedance Moisture", spec:"AC excitation", desc:"Exudate moisture inferred from AC impedance across the shared electrode pair." }
  ];
  const grid = $("#sensor-grid");
  data.forEach((s) => {
    const card = make("article","sensor-card reveal");
    card.innerHTML = `<div class="sensor-icon">${esc(s.icon)}</div><h3>${esc(s.name)}</h3><p><b>${esc(s.spec)}</b></p><p>${esc(s.desc)}</p>`;
    grid.appendChild(card);
  });
}

/* ---------- RESOURCES ---------- */
function renderResources(){
  const types = ["all", ...new Set((RESOURCES || []).map(r => r.type))];
  const labels = { all:"All", paper:"Papers", excel:"Excel", document:"Documents", datasheet:"Datasheets", video:"Videos" };
  const filters = $("#res-filters");
  types.forEach((type, i) => {
    const btn = make("button","filter-btn" + (i === 0 ? " active" : ""), esc(labels[type] || type));
    btn.type = "button";
    btn.addEventListener("click", () => {
      $$("#res-filters .filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      $$("#res-grid .res-card").forEach(card => card.classList.toggle("hidden", !(type === "all" || card.dataset.type === type)));
    });
    filters.appendChild(btn);
  });

  const grid = $("#res-grid");
  (RESOURCES || []).forEach((r) => grid.appendChild(resourceCard(r)));
}

function resourceCard(r){
  const card = make("article","res-card");
  card.dataset.type = r.type || "";
  const subtitle = r.type === "paper" ? `${r.journal || ""} ${r.year || ""}` : (r.type || "resource");
  const desc = r.relevance || r.description || r.note || r.role || "";
  const tags = (r.tags || []).map(t => `<span class="tag">${esc(t)}</span>`).join("");
  card.innerHTML = `
    <span class="res-type">${esc(r.type || r.category || "resource")}</span>
    <h3>${esc(r.title || r.component || r.name)}</h3>
    <p class="res-meta">${esc(subtitle)}${r.week ? " · Week " + esc(r.week) : ""}</p>
    <p>${esc(desc)}</p>
    <div class="tag-list">${tags}</div>
    ${r.link && r.link !== "#" ? `<a class="link-card" href="${esc(r.link)}" target="_blank" rel="noopener">Open file →</a>` : ""}
  `;
  return card;
}

function renderFileCategories(){
  const grid = $("#cat-grid");
  (FILE_CATEGORIES || []).forEach((c) => {
    const card = make("article","cat-card");
    card.innerHTML = `<div class="cat-icon">${esc(c.icon)}</div><h3>${esc(c.category)}</h3><p><b>${esc(c.count)}</b></p><p>${esc(c.support)}</p><p class="res-meta">${esc(c.files)}</p>`;
    grid.appendChild(card);
  });
}

function renderFileTable(){
  const body = $("#file-table-body");
  (FILE_ANALYSIS || []).forEach((f) => {
    const row = make("tr");
    row.innerHTML = `<td>${esc(f.name)}</td><td>${esc(f.week)}</td><td>${esc(f.type)}</td><td>${esc(f.content)}</td><td>${esc(f.importance)}</td><td>${esc(f.section)}</td>`;
    body.appendChild(row);
  });
}

function renderDatasheets(){
  const grid = $("#datasheets-grid");
  (DATASHEETS || []).forEach((d) => grid.appendChild(resourceCard({ type:d.category, title:d.component, description:d.role, link:d.link })));
}

function renderDocuments(){
  const grid = $("#documents-grid");
  (DOCUMENTS_LIB || []).forEach((d) => grid.appendChild(resourceCard({ type:d.type, title:d.title, description:d.note, link:d.link })));
}

function renderReferences(){
  const videoGrid = $("#videos-grid");
  (VIDEOS || []).forEach((v) => videoGrid.appendChild(resourceCard({ type:v.type, title:v.title, description:`${v.source}. ${v.note}`, link:v.link })));

  const pubGrid = $("#publications-grid");
  (KEY_PUBLICATIONS || []).forEach((p) => pubGrid.appendChild(resourceCard({ type:p.repo, title:p.title, description:p.note, link:p.link })));

  const similarGrid = $("#similar-products");
  (SIMILAR_PRODUCTS || []).forEach((p) => {
    similarGrid.appendChild(resourceCard({
      type:p.cost,
      title:p.name,
      description:`${p.origin}. Tech: ${p.tech}. ${p.relevance}`,
      link:"#"
    }));
  });
}

/* ---------- TESTING + BUDGET + FUTURE ---------- */
function renderTesting(){
  const grid = $("#testing-grid");
  (TESTING || []).forEach((t) => {
    const card = make("article","test-card");
    card.innerHTML = `<p class="test-phase">${esc(t.phase)}</p><h3>${esc(t.title)}</h3><p>${esc(t.description)}</p><p><b>${esc(t.status)}</b></p>`;
    grid.appendChild(card);
  });
}

function renderBudget(){
  $("#budget-header").innerHTML = `<h3>Target Budget: ${esc(BUDGET.target)}</h3><p>Currency: ${esc(BUDGET.currency)}. Estimated total: ${esc(BUDGET.total)}.</p>`;
  const rows = $("#budget-rows");
  (BUDGET.categories || []).forEach((c) => {
    const row = make("div","budget-row");
    row.innerHTML = `<b>${esc(c.name)}</b><span>${esc(c.local)}</span><span>${esc(c.notes)}</span>`;
    rows.appendChild(row);
  });
}

function renderFuture(){
  const list = $("#future-list");
  (FUTURE_WORK || []).forEach((f, i) => {
    const item = make("div","future-item reveal");
    item.innerHTML = `<span class="future-num">${i+1}</span><span>${esc(f)}</span>`;
    list.appendChild(item);
  });
}

function renderContact(){
  $("#contact-inner").innerHTML = `
    <p class="eyebrow">Get in Touch</p>
    <h2>Contact & Project Links</h2>
    <p>Questions about design, fabrication, weekly resources, papers, or datasheets can be sent through the university email.</p>
    <div class="contact-links">
      <a class="btn btn-primary" href="mailto:${esc(PROJECT.contactEmail)}">✉ ${esc(PROJECT.contactEmail)}</a>
      <a class="btn btn-light" href="${esc(PROJECT.githubRepo)}" target="_blank" rel="noopener">Open Project Drive</a>
    </div>
    <p>${esc(PROJECT.supervisor)}</p>
    <p><b>${esc(PROJECT.student)}</b> · ${esc(PROJECT.degree)} · ${esc(PROJECT.university)} · ${esc(PROJECT.year)}</p>
  `;
}

/* ---------- INTERACTION ---------- */
function initNav(){
  const hamburger = $("#hamburger");
  const links = $("#nav-links");
  hamburger.addEventListener("click", () => links.classList.toggle("open"));
  $$(".nav-links a").forEach(a => a.addEventListener("click", () => links.classList.remove("open")));
}

function initScroll(){
  const bar = $("#progress-bar");
  const top = $("#back-to-top");
  const navLinks = $$(".nav-links a");
  const sections = $$("section[id]");
  const onScroll = () => {
    const doc = document.documentElement;
    const scrolled = doc.scrollTop / Math.max(1, doc.scrollHeight - doc.clientHeight);
    bar.style.width = `${scrolled * 100}%`;
    top.classList.toggle("visible", doc.scrollTop > 600);
    let current = "";
    sections.forEach(s => { if(doc.scrollTop >= s.offsetTop - 140) current = s.id; });
    navLinks.forEach(a => a.classList.toggle("active", a.getAttribute("href") === `#${current}`));
  };
  window.addEventListener("scroll", onScroll, { passive:true });
  top.addEventListener("click", () => window.scrollTo({ top:0, behavior:"smooth" }));
  onScroll();
}

function initReveal(){
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add("visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold:0.12 });
  $$(".reveal").forEach(n => io.observe(n));
}

/* ---------- INIT ---------- */
document.addEventListener("DOMContentLoaded", () => {
  renderHero();
  renderAbstract();
  renderProblem();
  renderResearchGap();
  renderSolution();
  renderObjectives();
  renderTimeline();
  renderArchitecture();
  renderSensorTech();
  renderResources();
  renderFileCategories();
  renderFileTable();
  renderDatasheets();
  renderDocuments();
  renderReferences();
  renderTesting();
  renderBudget();
  renderFuture();
  renderContact();
  initNav();
  initScroll();
  initReveal();
});
