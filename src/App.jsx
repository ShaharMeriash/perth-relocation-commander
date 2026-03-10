import { useState, useEffect } from "react"; // v3 — live rates + flight panel

// ─── STYLES ───────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bg:#080d1a;--s0:#0e1525;--s1:#111e30;--s2:#16263d;--s3:#1c3050;
  --bd:#233554;--bd2:#2e4468;
  --g:#00d4aa;--g2:rgba(0,212,170,.12);--g3:rgba(0,212,170,.06);
  --b:#3b82f6;--b2:rgba(59,130,246,.12);
  --am:#f59e0b;--am2:rgba(245,158,11,.12);
  --re:#ef4444;--re2:rgba(239,68,68,.12);
  --t0:#f0f4fa;--t1:#a8bcd4;--t2:#5a7a9e;--t3:#2d4a68;
  --fd:'Syne',sans-serif;--fb:'DM Sans',sans-serif;
  --r:10px;--rl:16px;
}
html,body,#root{height:100%;background:var(--bg);color:var(--t0);font-family:var(--fb);}

/* ── LAYOUT ── */
.app{display:flex;height:100vh;overflow:hidden;}
.sidebar{width:200px;min-width:200px;background:var(--s0);border-right:1px solid var(--bd);display:flex;flex-direction:column;overflow:hidden;}
.main{flex:1;display:flex;flex-direction:column;overflow:hidden;background:var(--bg);}
.page-body{flex:1;overflow-y:auto;padding:24px 28px;}

/* ── SIDEBAR ── */
.logo-area{padding:20px 16px 14px;border-bottom:1px solid var(--bd);}
.logo-name{font-family:var(--fd);font-size:13px;font-weight:800;color:var(--g);line-height:1.3;}
.logo-sub{font-size:9px;color:var(--t3);text-transform:uppercase;letter-spacing:2px;margin-top:3px;}
.nav-group{padding:14px 10px 6px;}
.nav-label{font-size:9px;text-transform:uppercase;letter-spacing:2px;color:var(--t3);padding:0 8px;margin-bottom:5px;}
.nav-item{display:flex;align-items:center;gap:9px;padding:9px 10px;border-radius:9px;cursor:pointer;font-size:13px;font-weight:500;color:var(--t1);transition:all .13s;margin-bottom:2px;position:relative;}
.nav-item:hover{background:var(--s1);color:var(--t0);}
.nav-item.active{background:var(--g2);color:var(--g);}
.nav-item .ni{font-size:15px;width:18px;text-align:center;flex-shrink:0;}
.nav-badge{position:absolute;right:10px;background:var(--re);color:#fff;font-size:9px;font-weight:700;padding:1px 5px;border-radius:10px;}
.nav-bottom{margin-top:auto;padding:14px 10px;border-top:1px solid var(--bd);}

/* ── PAGE HEADER ── */
.page-header{padding:20px 28px 0;background:var(--s0);border-bottom:1px solid var(--bd);flex-shrink:0;}
.page-title{font-family:var(--fd);font-size:22px;font-weight:800;color:var(--t0);}
.page-sub{font-size:12px;color:var(--t1);margin-top:3px;padding-bottom:16px;}
.tabs{display:flex;gap:0;border-bottom:none;margin-top:14px;}
.tab{padding:10px 16px;font-size:12px;font-weight:600;cursor:pointer;border:none;background:none;color:var(--t2);border-bottom:2px solid transparent;font-family:var(--fb);transition:all .13s;letter-spacing:.2px;}
.tab.on{color:var(--g);border-bottom-color:var(--g);}
.tab:hover:not(.on){color:var(--t1);}

/* ── CURRENCY TOGGLE ── */
.cur-toggle{display:flex;gap:3px;}
.cur-btn{padding:5px 10px;border-radius:7px;font-size:10px;font-weight:700;cursor:pointer;border:1px solid var(--bd);background:none;color:var(--t2);font-family:var(--fb);transition:all .1s;}
.cur-btn.on{background:var(--g);color:#080d1a;border-color:var(--g);}

/* ── CARDS ── */
.card{background:var(--s0);border:1px solid var(--bd);border-radius:var(--rl);padding:16px;margin-bottom:12px;}
.card-title{font-family:var(--fd);font-size:13px;font-weight:700;color:var(--t0);margin-bottom:12px;}
.stat-card{background:var(--s0);border:1px solid var(--bd);border-radius:var(--rl);padding:18px;}
.stat-label{font-size:10px;text-transform:uppercase;letter-spacing:1.2px;color:var(--t2);}
.stat-val{font-family:var(--fd);font-size:26px;font-weight:800;margin-top:4px;line-height:1;}
.stat-sub{font-size:11px;color:var(--t1);margin-top:5px;}
.vg{color:var(--g);}.vb{color:var(--b);}.vam{color:var(--am);}.vr{color:var(--re);}

/* ── GRID ── */
.g2{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;}
.gc2{grid-column:span 2;}
.gc3{grid-column:span 3;}

/* ── PROGRESS BAR ── */
.pbar{height:4px;background:var(--s3);border-radius:2px;overflow:hidden;margin-top:8px;}
.pfill{height:100%;border-radius:2px;transition:width .6s ease;}
.pfill.g{background:var(--g);}
.pfill.b{background:var(--b);}
.pfill.am{background:var(--am);}

/* ── TAGS ── */
.tag{display:inline-flex;align-items:center;padding:2px 7px;border-radius:20px;font-size:9px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;cursor:default;}
.tg{background:var(--g2);color:var(--g);}
.tb{background:var(--b2);color:var(--b);}
.tam{background:var(--am2);color:var(--am);}
.tr{background:var(--re2);color:#f87171;}
.t3{background:rgba(74,96,128,.2);color:var(--t2);}
.tbd{background:rgba(74,96,128,.2);color:var(--t2);}
.tprog{background:var(--b2);color:var(--b);}
.tdone{background:var(--g2);color:var(--g);}
.tirr{background:rgba(44,56,80,.4);color:var(--t3);text-decoration:line-through;}

/* ── OWNER AVATAR ── */
.ava{width:22px;height:22px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:9px;font-weight:800;flex-shrink:0;}
.ava-R{background:rgba(0,212,170,.18);color:var(--g);}
.ava-S{background:rgba(59,130,246,.18);color:var(--b);}
.ava-K{background:rgba(245,158,11,.18);color:var(--am);}
.ava-E{background:rgba(74,96,128,.2);color:var(--t2);}

/* ── ACTION CARDS ── */
.acard{background:var(--s1);border:1px solid var(--bd);border-radius:var(--r);padding:12px 14px;margin-bottom:8px;transition:all .13s;}
.acard:hover{border-color:var(--bd2);background:var(--s2);}
.acard.done-card{opacity:.5;}
.acard-top{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;}
.acard-title{font-weight:600;font-size:13px;color:var(--t0);line-height:1.4;flex:1;}
.acard-meta{display:flex;gap:5px;margin-top:7px;flex-wrap:wrap;align-items:center;}
.acard-actions{display:flex;gap:5px;flex-shrink:0;align-items:center;}

/* inline status toggle */
.status-tog{cursor:pointer;transition:all .1s;}
.status-tog:hover{opacity:.75;transform:scale(1.05);}

/* ── PBAR MINI ── */
.mini-bar{height:3px;background:var(--s3);border-radius:2px;overflow:hidden;margin-top:5px;max-width:140px;}
.mini-fill{height:100%;background:var(--g);border-radius:2px;}

/* ── BUTTONS ── */
.btn{display:inline-flex;align-items:center;gap:5px;padding:7px 14px;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;border:none;font-family:var(--fb);transition:all .13s;white-space:nowrap;}
.btn-g{background:var(--g);color:#080d1a;}
.btn-g:hover{background:#00c49a;transform:translateY(-1px);}
.btn-s{background:var(--s2);border:1px solid var(--bd);color:var(--t0);}
.btn-s:hover{background:var(--s3);border-color:var(--bd2);}
.btn-d{background:var(--re2);border:1px solid rgba(239,68,68,.25);color:#f87171;}
.btn-d:hover{background:rgba(239,68,68,.25);}
.btn-fl{background:linear-gradient(135deg,#1d4ed8,#3b82f6);color:white;border:none;}
.btn-fl:hover{background:linear-gradient(135deg,#1e40af,#2563eb);}
.btn-sm{padding:5px 10px;font-size:11px;}
.btn-xs{padding:3px 8px;font-size:10px;}

/* ── MODAL ── */
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.75);z-index:200;display:flex;align-items:center;justify-content:center;padding:16px;backdrop-filter:blur(6px);}
.modal{background:var(--s0);border:1px solid var(--bd);border-radius:20px;padding:24px;width:100%;max-width:560px;max-height:88vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.5);}
.modal-title{font-family:var(--fd);font-size:18px;font-weight:800;margin-bottom:18px;}
.modal-section{font-family:var(--fd);font-size:11px;font-weight:700;color:var(--t2);text-transform:uppercase;letter-spacing:1px;margin:16px 0 10px;}
.modal-footer{display:flex;gap:8px;justify-content:flex-end;margin-top:20px;padding-top:16px;border-top:1px solid var(--bd);}
.expand-toggle{display:flex;align-items:center;gap:6px;font-size:11px;color:var(--t2);cursor:pointer;padding:6px 0;user-select:none;}
.expand-toggle:hover{color:var(--t1);}

/* ── FORM ── */
.fg{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
.fg1{display:grid;grid-template-columns:1fr;gap:10px;}
.fcol{display:flex;flex-direction:column;gap:4px;}
.fcol.span2{grid-column:span 2;}
.flabel{font-size:10px;text-transform:uppercase;letter-spacing:1px;color:var(--t2);font-weight:600;}
.finput,.fselect,.ftextarea{background:var(--s2);border:1px solid var(--bd);color:var(--t0);padding:8px 10px;border-radius:8px;font-size:12px;font-family:var(--fb);transition:border-color .13s;width:100%;}
.finput:focus,.fselect:focus,.ftextarea:focus{outline:none;border-color:var(--g);}
.ftextarea{resize:vertical;min-height:58px;}
.fselect option{background:var(--s1);}

/* ── SUBTASKS ── */
.sub-row{display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--bd);}
.sub-row:last-child{border-bottom:none;}
.sub-check{width:15px;height:15px;accent-color:var(--g);cursor:pointer;flex-shrink:0;}

/* ── ALERTS ── */
.alert{display:flex;align-items:flex-start;gap:8px;padding:10px 12px;border-radius:9px;margin-bottom:7px;font-size:12px;}
.alert-w{background:var(--am2);border:1px solid rgba(245,158,11,.25);color:#fbbf24;}
.alert-r{background:var(--re2);border:1px solid rgba(239,68,68,.25);color:#f87171;}
.alert-g{background:var(--g2);border:1px solid rgba(0,212,170,.25);color:var(--g);}
.alert-b{background:var(--b2);border:1px solid rgba(59,130,246,.25);color:#93c5fd;}

/* ── TOAST ── */
.toast{position:fixed;bottom:20px;right:20px;z-index:300;background:var(--s1);border:1px solid var(--bd);border-radius:var(--r);padding:12px 16px;max-width:300px;box-shadow:0 8px 32px rgba(0,0,0,.4);animation:tslide .2s ease;font-size:12px;}
.toast.ok{border-color:rgba(0,212,170,.4);}
.toast.err{border-color:rgba(239,68,68,.4);}
.toast.inf{border-color:rgba(59,130,246,.4);}
@keyframes tslide{from{transform:translateX(100%);opacity:0;}to{transform:translateX(0);opacity:1;}}

/* ── RATES PANEL ── */
.rates-bar{display:flex;align-items:center;gap:16px;padding:10px 28px;background:var(--s0);border-top:1px solid var(--bd);font-size:11px;flex-shrink:0;}
.rate-item{display:flex;align-items:center;gap:6px;color:var(--t2);}
.rate-val{color:var(--g);font-weight:700;font-family:var(--fd);}
.rate-updated{font-size:10px;color:var(--t3);margin-left:4px;}

/* ── PhD GATE ── */
.phd-gate{background:linear-gradient(135deg,#1e1000,#0e0a00);border:1px solid rgba(245,158,11,.35);border-radius:var(--rl);padding:14px 18px;display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:16px;}
.phd-gate.unlocked{background:linear-gradient(135deg,#001a13,#000e1f);border-color:rgba(0,212,170,.35);}
.phd-pill{font-size:9px;text-transform:uppercase;letter-spacing:1.5px;color:var(--am);font-weight:700;}
.phd-gate.unlocked .phd-pill{color:var(--g);}
.phd-name{font-family:var(--fd);font-size:14px;font-weight:700;margin-top:2px;}
.phd-hint{font-size:11px;color:var(--t1);margin-top:2px;}

/* ── COUNTDOWN ── */
.countdown{background:linear-gradient(135deg,#001f16,#000e1f);border:1px solid rgba(0,212,170,.25);border-radius:var(--rl);padding:20px;box-shadow:0 0 40px rgba(0,212,170,.07);}
.cd-label{font-size:10px;text-transform:uppercase;letter-spacing:2px;color:var(--g);}
.cd-title{font-family:var(--fd);font-size:16px;font-weight:800;margin-top:4px;}
.cd-units{display:flex;gap:8px;margin-top:14px;}
.cd-unit{flex:1;text-align:center;background:var(--s1);border:1px solid var(--bd);border-radius:10px;padding:10px 6px;}
.cd-num{font-family:var(--fd);font-size:28px;font-weight:800;color:var(--g);line-height:1;}
.cd-ulabel{font-size:9px;text-transform:uppercase;letter-spacing:1px;color:var(--t2);margin-top:3px;}

/* ── TODAY PAGE COLUMNS ── */
.today-cols{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:14px;}
.owner-col{background:var(--s0);border:1px solid var(--bd);border-radius:var(--rl);padding:14px;}
.owner-col-header{display:flex;align-items:center;gap:8px;margin-bottom:12px;}
.owner-col-name{font-family:var(--fd);font-size:13px;font-weight:700;}

/* ── URGENT CARD ── */
.urgent-card{background:linear-gradient(135deg,var(--s1),var(--s2));border:1px solid var(--bd2);border-radius:var(--rl);padding:16px 18px;margin-bottom:14px;}
.urgent-label{font-size:9px;text-transform:uppercase;letter-spacing:2px;color:var(--am);margin-bottom:6px;}
.urgent-title{font-family:var(--fd);font-size:16px;font-weight:700;}
.urgent-meta{display:flex;gap:6px;margin-top:8px;flex-wrap:wrap;align-items:center;}
.urgent-actions{display:flex;gap:7px;margin-top:12px;}

/* ── BUDGET PULSE ── */
.budget-row{display:flex;gap:12px;margin-bottom:14px;}
.bpulse{flex:1;background:var(--s0);border:1px solid var(--bd);border-radius:var(--rl);padding:14px;}

/* ── PHASE STRIP ── */
.phase-strip{display:flex;gap:4px;margin-bottom:18px;}
.phase-block{flex:1;padding:9px 8px;border-radius:9px;border:1px solid var(--bd);background:var(--s1);text-align:center;}
.phase-block.cur{border-color:var(--g);background:var(--g3);}
.phase-name{font-weight:700;font-size:11px;}
.phase-date{font-size:10px;color:var(--t2);margin-top:1px;}
.phase-count{font-size:10px;color:var(--g);font-weight:700;margin-top:4px;}

/* ── STEP ── */
.step-row{display:flex;gap:14px;padding:13px 0;border-bottom:1px solid var(--bd);}
.step-num{width:30px;height:30px;border-radius:50%;background:var(--s2);border:2px solid var(--bd);display:flex;align-items:center;justify-content:center;font-family:var(--fd);font-weight:800;font-size:12px;flex-shrink:0;}
.step-num.done{background:var(--g);border-color:var(--g);color:#080d1a;}

/* ── EXPENSE TABLE ── */
.exp-table{width:100%;}
.exp-hdr{display:grid;grid-template-columns:2fr 1fr 1fr 1fr 1fr;gap:8px;padding:8px 12px;font-size:10px;text-transform:uppercase;letter-spacing:.8px;color:var(--t2);font-weight:700;}
.exp-row{display:grid;grid-template-columns:2fr 1fr 1fr 1fr 1fr;gap:8px;padding:9px 12px;border-top:1px solid var(--bd);font-size:12px;transition:background .1s;}
.exp-row:hover{background:var(--s1);}

/* ── DOCUMENTS ── */
.doc-row{display:flex;align-items:center;justify-content:space-between;padding:11px 14px;border-bottom:1px solid var(--bd);transition:background .1s;}
.doc-row:hover{background:var(--s1);}
.doc-row:last-child{border-bottom:none;}

/* ── SHOPPING ── */
.shop-row{display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--bd);}
.shop-row:last-child{border-bottom:none;}

/* ── FLIGHT PANEL ── */
.flight-panel{background:linear-gradient(135deg,#030d1f,#041228);border:1px solid rgba(59,130,246,.3);border-radius:var(--rl);padding:16px 18px;margin-top:12px;}
.flight-panel-title{font-family:var(--fd);font-size:13px;font-weight:800;color:var(--t0);margin-bottom:4px;}
.flight-panel-meta{font-size:11px;color:var(--t2);margin-bottom:14px;line-height:1.7;}
.flight-panel-meta strong{color:var(--t1);}
.flight-btns{display:flex;gap:8px;flex-wrap:wrap;}
.flight-btn{display:inline-flex;align-items:center;gap:7px;padding:10px 16px;border-radius:10px;font-size:12px;font-weight:700;cursor:pointer;border:1px solid transparent;font-family:var(--fb);transition:all .15s;text-decoration:none;white-space:nowrap;}
.flight-btn:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(0,0,0,.35);}
.flight-btn-ico{font-size:15px;}
.flight-btn-name{font-weight:700;}
.flight-btn-arrow{opacity:.6;font-size:11px;}

/* ── DIVIDER ── */
.divider{height:1px;background:var(--bd);margin:12px 0;}

/* ── FILTER BAR ── */
.filter-bar{display:flex;gap:7px;flex-wrap:wrap;align-items:center;margin-bottom:14px;}
.search-in{background:var(--s1);border:1px solid var(--bd);color:var(--t0);padding:7px 12px;border-radius:8px;font-size:12px;font-family:var(--fb);flex:1;min-width:160px;}
.search-in:focus{outline:none;border-color:var(--g);}
.search-in::placeholder{color:var(--t3);}
.fsel{background:var(--s1);border:1px solid var(--bd);color:var(--t0);padding:7px 10px;border-radius:8px;font-size:11px;font-family:var(--fb);cursor:pointer;}
.fsel:focus{outline:none;border-color:var(--g);}
.fsel option{background:var(--s1);}

/* ── DONE COLLAPSE ── */
.done-toggle{display:flex;align-items:center;gap:7px;font-size:11px;color:var(--t2);cursor:pointer;padding:6px 0;user-select:none;}
.done-toggle:hover{color:var(--t1);}

/* ── RESPONSIVE ── */
@media(max-width:820px){
  .sidebar{width:52px;min-width:52px;}
  .logo-area,.nav-label,.nav-item span,.nav-bottom .cur-toggle{display:none;}
  .nav-item{justify-content:center;padding:11px;}
  .g3{grid-template-columns:1fr 1fr;}
  .gc2{grid-column:span 2;}
  .today-cols{grid-template-columns:1fr;}
  .exp-hdr,.exp-row{grid-template-columns:2fr 1fr 1fr 1fr;}
}
@media(max-width:580px){
  .page-body{padding:14px 16px;}
  .g2,.g3{grid-template-columns:1fr;}
  .gc2{grid-column:span 1;}
}
`;

// ─── FLIGHT DEEP LINKS ────────────────────────────────────────────────────────
// One-way TLV→PER · 2 adults · 2 children · 1 stop · June 20 2026 · ±5 days
const FLIGHT_LINKS = [
  {
    id: "google",
    name: "Google Flights",
    icon: "🔍",
    color: "#4285F4",
    colorDim: "rgba(66,133,244,.13)",
    label: "Google",
    // Google Flights: /search?tfs encodes badly, so use clean query URL
    // adults=2 children=2 via query string approach — Google reads pax from URL
    url: "https://www.google.com/travel/flights/search?tfs=CBwQARoeEgoyMDI2LTA2LTIwagcIARIDVExWcgcIARIDUEVSGAIgASoECAIQAg%3D%3D&hl=en&curr=USD",
    note: "2 adults · 2 children · Economy",
  },
  {
    id: "skyscanner",
    name: "Skyscanner",
    icon: "🌐",
    color: "#00B2EE",
    colorDim: "rgba(0,178,238,.13)",
    label: "Skyscanner",
    // Format: /transport/flights/{from}/{to}/{outbound-YYMMDD}/
    // adults, children(age), rtn=0 one-way, cabinclass, stops max
    url: "https://www.skyscanner.com/transport/flights/tlv/per/260620/?adults=2&children=2&infants=0&cabinclass=economy&rtn=0&preferdirects=false&outboundaltsenabled=true&ref=home",
    note: "Flexible dates · 1 stop filter on results page",
  },
  {
    id: "kayak",
    name: "Kayak",
    icon: "🛶",
    color: "#FF690F",
    colorDim: "rgba(255,105,15,.13)",
    label: "Kayak",
    // Format: /flights/{FROM}-{TO}/{date}/{pax}
    // children specified as c{age}, flexible=5 days around date
    url: "https://www.kayak.com/flights/TLV-PER/2026-06-20/2adults/children-c8-c6?sort=bestflight_a&fs=stops=1&flex=5",
    note: "±5 days flex · 1 stop · Best flights sort",
  },
];

// ─── DATA ─────────────────────────────────────────────────────────────────────
const ARRIVAL = new Date("2026-06-26T00:00:00");
const PHASES = [
  {name:"Month -6",label:"Oct–Dec 2025",date:new Date("2025-10-01")},
  {name:"Month -4",label:"Feb 2026",date:new Date("2026-02-01")},
  {name:"Month -3",label:"Mar 2026",date:new Date("2026-03-01")},
  {name:"Month -2",label:"Apr 2026",date:new Date("2026-04-01")},
  {name:"Month -1",label:"May 2026",date:new Date("2026-05-01")},
  {name:"Month 0 Arrival",label:"Jun 2026",date:new Date("2026-06-01")},
];
const JOURNEY_STEPS = [
  {id:"j1",n:1,title:"Prepare Passports",desc:"All family passports valid 12+ months past arrival",aid:"a1"},
  {id:"j2",n:2,title:"PhD Acceptance – UWA",desc:"Receive official UWA acceptance letter",aid:"a1"},
  {id:"j3",n:3,title:"Apply for Australian Visa",desc:"Submit visa application (subclass 500/482)",aid:"a3"},
  {id:"j4",n:4,title:"Apostille Documents",desc:"Notarise & apostille key civil documents",aid:"a9"},
  {id:"j5",n:5,title:"Get OSHC Insurance",desc:"Purchase mandatory Overseas Student Health Cover",aid:"a4"},
  {id:"j6",n:6,title:"Find Accommodation",desc:"Secure rental housing near UWA in Perth",aid:"a6"},
  {id:"j7",n:7,title:"Book Flights",desc:"Purchase one-way TLV → PER for 4",aid:"a2"},
  {id:"j8",n:8,title:"Enroll Kids in School",desc:"Complete Perth school enrollment",aid:"a5"},
  {id:"j9",n:9,title:"Ship Belongings",desc:"Arrange international freight",aid:"a7"},
  {id:"j10",n:10,title:"Arrive in Perth 🇦🇺",desc:"Land in Perth — begin new chapter!",aid:""},
];

const SEED_ACTIONS = [
  {id:"a1",title:"Getting accepted to PhD by UWA",desc:"UWA PhD acceptance — critical gate for entire relocation",type:"Visa Step",owner:"Raz",priority:"High",status:"in progress",phase:"Month -6",pdate:"",ddate:"2026-03-01",cost:"",cur:"ILS",vendor:"University of Western Australia",comments:"",subs:[{id:"s1",t:"Submit application",done:true},{id:"s2",t:"Receive confirmation email",done:false}]},
  {id:"a2",title:"Book Flight TLV → PER",desc:"One-way flights for family of 4",type:"Task",owner:"Shahar",priority:"High",status:"tbd",phase:"Month -3",pdate:"2026-06-26",ddate:"2026-04-01",cost:"",cur:"USD",vendor:"",comments:"",subs:[]},
  {id:"a3",title:"Apply for Australian Visa (500/482)",desc:"Visa application for Raz & Shahar",type:"Visa Step",owner:"Raz",priority:"High",status:"tbd",phase:"Month -4",pdate:"",ddate:"2026-02-01",cost:"7000",cur:"ILS",vendor:"",comments:"",subs:[]},
  {id:"a4",title:"Get OSHC Insurance",desc:"Overseas Student Health Cover — mandatory for visa",type:"Expense",owner:"Raz",priority:"High",status:"tbd",phase:"Month -4",pdate:"",ddate:"2026-03-15",cost:"3200",cur:"AUD",vendor:"Medibank / Bupa",comments:"",subs:[]},
  {id:"a5",title:"Enroll kids in Perth school",desc:"Find and enroll near UWA campus",type:"School",owner:"Shahar",priority:"High",status:"tbd",phase:"Month -2",pdate:"",ddate:"2026-05-01",cost:"",cur:"AUD",vendor:"",comments:"",subs:[]},
  {id:"a6",title:"Find rental accommodation in Perth",desc:"Secure housing near UWA — Nedlands / Subiaco",type:"Housing",owner:"Shahar",priority:"High",status:"tbd",phase:"Month -3",pdate:"",ddate:"2026-04-15",cost:"3500",cur:"AUD",vendor:"",comments:"",subs:[]},
  {id:"a7",title:"Ship personal belongings",desc:"Arrange sea or air freight container",type:"Task",owner:"Raz",priority:"Medium",status:"tbd",phase:"Month -1",pdate:"",ddate:"2026-05-20",cost:"8000",cur:"USD",vendor:"",comments:"",subs:[]},
  {id:"a8",title:"Open Australian bank account",desc:"Open AUD account before arrival if possible",type:"Admin",owner:"Raz",priority:"Medium",status:"tbd",phase:"Month -2",pdate:"",ddate:"2026-05-01",cost:"",cur:"AUD",vendor:"Commonwealth Bank / ANZ",comments:"",subs:[]},
  {id:"a9",title:"Apostille documents",desc:"Marriage cert, birth certs — apostille stamps",type:"Document",owner:"Shahar",priority:"Medium",status:"in progress",phase:"Month -6",pdate:"",ddate:"2026-02-01",cost:"1200",cur:"ILS",vendor:"Notary",comments:"",subs:[]},
  {id:"a10",title:"Buy furniture for Perth apartment",desc:"IKEA beds, kitchen items, fridge, washer",type:"Purchase",owner:"Shahar",priority:"Low",status:"tbd",phase:"Month 0 Arrival",pdate:"",ddate:"2026-07-10",cost:"5000",cur:"AUD",vendor:"IKEA / Kmart",comments:"",subs:[]},
];
const SEED_DOCS = [
  {id:"d1",type:"Passport – Raz",exp:"2030-05-12",aid:"",notes:""},
  {id:"d2",type:"Passport – Shahar",exp:"2029-11-08",aid:"",notes:""},
  {id:"d3",type:"Passport – Child 1",exp:"2028-03-15",aid:"",notes:""},
  {id:"d4",type:"Passport – Child 2",exp:"2027-09-22",aid:"",notes:""},
  {id:"d5",type:"Marriage Certificate (Apostilled)",exp:"",aid:"a9",notes:""},
  {id:"d6",type:"Birth Certificates (x2)",exp:"",aid:"a9",notes:""},
  {id:"d7",type:"OSHC Insurance Certificate",exp:"",aid:"a4",notes:""},
];
const SEED_SHOP = [
  {id:"sh1",name:"Fridge",store:"Harvey Norman",cost:1200,owner:"Shahar",phase:"Month 0 Arrival",done:false,notes:"650L+ family size"},
  {id:"sh2",name:"Washing Machine",store:"Harvey Norman",cost:900,owner:"Shahar",phase:"Month 0 Arrival",done:false,notes:""},
  {id:"sh3",name:"Family SUV",store:"CarSales / dealer",cost:28000,owner:"Raz",phase:"Month 0 Arrival",done:false,notes:"Toyota RAV4 or similar"},
  {id:"sh4",name:"IKEA Beds (x4)",store:"IKEA Perth",cost:1800,owner:"Shahar",phase:"Month 0 Arrival",done:false,notes:"2 adults + 2 kids"},
  {id:"sh5",name:"Kmart Kitchenware",store:"Kmart",cost:400,owner:"Shahar",phase:"Month 0 Arrival",done:false,notes:"Pots, pans, utensils"},
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function getCountdown(){
  const d = ARRIVAL - new Date();
  if(d<=0) return {D:0,H:0,M:0,S:0};
  return {D:Math.floor(d/86400000),H:Math.floor(d%86400000/3600000),M:Math.floor(d%3600000/60000),S:Math.floor(d%60000/1000)};
}
function conv(v,from,rates,to){
  if(!v||isNaN(+v)) return 0;
  let ils=+v;
  if(from==="AUD") ils*=rates.AUD;
  else if(from==="USD") ils*=rates.USD;
  if(to==="ILS") return ils;
  if(to==="AUD") return ils/rates.AUD;
  if(to==="USD") return ils/rates.USD;
  return ils;
}
function fmt(v,cur){
  const sym={ILS:"₪",AUD:"A$",USD:"$"}[cur]||"₪";
  return sym+Math.round(v).toLocaleString();
}
function stCls(s){return s==="in progress"?"tprog":s==="done"?"tdone":s==="irrelevant"?"tirr":"tbd";}
function prCls(p){return p==="High"?"tr":p==="Medium"?"tam":"t3";}
function ownerInit(o){return(o||"?")[0];}
function ownerCls(o){return "ava-"+(o||"E")[0];}
function csvDl(data,name){
  if(!data.length)return;
  const keys=Object.keys(data[0]).filter(k=>k!=="subs");
  const rows=[keys.join(","),...data.map(r=>keys.map(k=>JSON.stringify(r[k]??"")).join(","))];
  const a=Object.assign(document.createElement("a"),{href:URL.createObjectURL(new Blob([rows.join("\n")],{type:"text/csv"})),download:name});
  a.click();
}
const STATUS_CYCLE = {tbd:"in progress","in progress":"done",done:"tbd",irrelevant:"tbd"};

// ─── LOCALSTORAGE HOOK ────────────────────────────────────────────────────────
function useLS(key, def){
  const [val,setVal] = useState(()=>{
    try{ const s=window.localStorage.getItem(key); return s?JSON.parse(s):def; }catch{ return def; }
  });
  const set = v => {
    const next = typeof v==="function"?v(val):v;
    setVal(next);
    try{ window.localStorage.setItem(key,JSON.stringify(next)); }catch{}
  };
  return [val,set];
}

// ─── PIE CHART ────────────────────────────────────────────────────────────────
function Pie({data}){
  const COLS=["#00d4aa","#3b82f6","#f59e0b","#ef4444","#8b5cf6"];
  const total=data.reduce((s,d)=>s+d.v,0);
  if(!total) return <div style={{color:"var(--t2)",fontSize:12,padding:"10px 0"}}>No data</div>;
  let cum=0;
  const R=38,cx=50,cy=50;
  const slices=data.map((d,i)=>{
    const pct=d.v/total,st=cum*2*Math.PI; cum+=pct;
    const en=cum*2*Math.PI;
    const x1=cx+R*Math.sin(st),y1=cy-R*Math.cos(st);
    const x2=cx+R*Math.sin(en),y2=cy-R*Math.cos(en);
    return{path:`M${cx},${cy}L${x1},${y1}A${R},${R} 0 ${pct>.5?1:0} 1 ${x2},${y2}Z`,col:COLS[i%COLS.length],...d};
  });
  return(
    <div style={{display:"flex",alignItems:"center",gap:14}}>
      <svg width="80" height="80" style={{transform:"rotate(-90deg)",flexShrink:0}} viewBox="0 0 100 100">
        {slices.map((s,i)=><path key={i} d={s.path} fill={s.col} opacity={.9}/>)}
      </svg>
      <div style={{flex:1}}>
        {slices.map((s,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:6,marginBottom:5,fontSize:11}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:s.col,flexShrink:0}}/>
            <span style={{color:"var(--t1)",flex:1}}>{s.lbl}</span>
            <span style={{fontWeight:700,color:"var(--t0)"}}>{s.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App(){
  const [page,setPage] = useLS("prc_page","today");
  const [actions,setActions] = useLS("prc_acts",SEED_ACTIONS);
  const [docs,setDocs] = useLS("prc_docs",SEED_DOCS);
  const [shop,setShop] = useLS("prc_shop",SEED_SHOP);
  const [rates,setRates] = useLS("prc_rates",{AUD:2.17,USD:3.08,upd:"Manual",fetching:false});
  const [cur,setCur] = useLS("prc_cur","ILS");
  const [toast,setToast] = useState(null);
  const [modal,setModal] = useState(null);
  const [tick,setTick] = useState(getCountdown());

  useEffect(()=>{ const t=setInterval(()=>setTick(getCountdown()),1000); return()=>clearInterval(t); },[]);

  const T=(msg,type="ok")=>{ setToast({msg,type}); setTimeout(()=>setToast(null),3500); };

  const phdDone = actions.find(a=>a.id==="a1")?.status==="done";
  const overdue = actions.filter(a=>a.ddate&&new Date(a.ddate)<new Date()&&a.status!=="done").length;

  const saveAction = a => {
    if(!a.title?.trim()){ T("Title is required","err"); return false; }
    setActions(prev => a.id&&prev.find(x=>x.id===a.id) ? prev.map(x=>x.id===a.id?a:x) : [...prev,{...a,id:"a"+Date.now(),subs:a.subs||[]}]);
    T("Saved ✓"); return true;
  };
  const deleteAction = id => { setActions(prev=>prev.filter(a=>a.id!==id)); T("Deleted"); };
  const cycleStatus = id => {
    setActions(prev=>prev.map(a=>a.id===id?{...a,status:STATUS_CYCLE[a.status]||"tbd"}:a));
  };

  const fetchRates = async () => {
    setRates(r=>({...r,fetching:true}));
    T("Fetching live rates…","inf");
    try{
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:256,
          tools:[{type:"web_search_20250305",name:"web_search"}],
          messages:[{role:"user",content:"What are today\'s exact exchange rates? I need: 1 AUD in ILS, and 1 USD in ILS. Reply ONLY with a JSON object like: {\"AUD\":2.17,\"USD\":3.08} and nothing else. No explanation, no markdown, just the raw JSON."}]
        })
      });
      if(!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const text = (data.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("").trim();
      const clean = text.replace(/```json|```/g,"").trim();
      const parsed = JSON.parse(clean);
      const AUD = +parseFloat(parsed.AUD).toFixed(4);
      const USD = +parseFloat(parsed.USD).toFixed(4);
      if(!AUD||!USD||isNaN(AUD)||isNaN(USD)) throw new Error("Bad values");
      setRates({AUD,USD,upd:new Date().toLocaleDateString("en-AU"),fetching:false});
      T(`Rates updated ✓  A$1 = ₪${AUD}`,"ok");
    }catch(e){
      setRates(r=>({...r,fetching:false}));
      T("Could not fetch — using saved rates","err");
    }
  };

  const fmtC = v => fmt(v,cur);

  const totEst = actions.reduce((s,a)=>s+conv(a.cost,a.cur,rates,cur),0);
  const totPaid = actions.filter(a=>a.status==="done").reduce((s,a)=>s+conv(a.cost,a.cur,rates,cur),0);
  const shopTot = shop.reduce((s,i)=>s+conv(i.cost,"AUD",rates,cur),0);

  const NAV=[
    {id:"today",ic:"🏠",lbl:"Today"},
    {id:"plan",ic:"⚡",lbl:"Plan"},
    {id:"vault",ic:"🗂️",lbl:"Vault"},
    {id:"settings",ic:"⚙️",lbl:"Settings"},
  ];

  return(
    <>
      <style>{CSS}</style>
      <div className="app">
        {/* SIDEBAR */}
        <nav className="sidebar">
          <div className="logo-area">
            <div className="logo-name">Perth Relocation Commander</div>
            <div className="logo-sub">Relocation OS 2026</div>
          </div>
          <div className="nav-group">
            <div className="nav-label">Navigation</div>
            {NAV.map(n=>(
              <div key={n.id} className={`nav-item ${page===n.id?"active":""}`} onClick={()=>setPage(n.id)}>
                <span className="ni">{n.ic}</span>
                <span>{n.lbl}</span>
                {n.id==="today"&&overdue>0&&<span className="nav-badge">{overdue}</span>}
              </div>
            ))}
          </div>
          <div className="nav-bottom">
            <div style={{fontSize:9,color:"var(--t3)",textTransform:"uppercase",letterSpacing:"1.5px",marginBottom:7}}>Display Currency</div>
            <div className="cur-toggle">
              {["ILS","AUD","USD"].map(c=><button key={c} className={`cur-btn ${cur===c?"on":""}`} onClick={()=>setCur(c)}>{c}</button>)}
            </div>
          </div>
        </nav>

        {/* MAIN */}
        <div className="main">
          {page==="today" && <TodayPage actions={actions} phdDone={phdDone} tick={tick} cur={cur} rates={rates} fmtC={fmtC} totEst={totEst} totPaid={totPaid} overdue={overdue} onEdit={a=>setModal({type:"action",a})} onNew={()=>setModal({type:"action",a:null})} cycleStatus={cycleStatus} setPage={setPage}/>}
          {page==="plan"  && <PlanPage actions={actions} rates={rates} cur={cur} fmtC={fmtC} phdDone={phdDone} onEdit={a=>setModal({type:"action",a})} onNew={()=>setModal({type:"action",a:null})} onDelete={deleteAction} cycleStatus={cycleStatus} T={T}/>}
          {page==="vault" && <VaultPage actions={actions} docs={docs} setDocs={setDocs} shop={shop} setShop={setShop} rates={rates} cur={cur} fmtC={fmtC} shopTot={shopTot} T={T}/>}
          {page==="settings" && <SettingsPage rates={rates} setRates={setRates} fetchRates={fetchRates}/>}

          {/* RATES BAR */}
          <div className="rates-bar">
            <div className="rate-item">
              <span style={{color:"var(--t2)"}}>1 AUD =</span>
              <span className="rate-val">₪{rates.AUD}</span>
            </div>
            <div className="rate-item">
              <span style={{color:"var(--t2)"}}>1 USD =</span>
              <span className="rate-val">₪{rates.USD}</span>
            </div>
            <span className="rate-updated">Updated: {rates.upd}</span>
            <button className="btn btn-s btn-sm" style={{marginLeft:"auto"}} onClick={fetchRates} disabled={rates.fetching}>
              {rates.fetching?"⏳ Fetching…":"↻ Update Rates"}
            </button>
          </div>
        </div>
      </div>

      {/* ACTION MODAL */}
      {modal?.type==="action" && <ActionModal a={modal.a} onSave={a=>{if(saveAction(a))setModal(null);}} onClose={()=>setModal(null)}/>}
      {toast && <div className={`toast ${toast.type}`}>{toast.type==="err"?"⚠️":toast.type==="inf"?"ℹ️":"✅"} {toast.msg}</div>}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TODAY PAGE
// ─────────────────────────────────────────────────────────────────────────────
function TodayPage({actions,phdDone,tick,cur,rates,fmtC,totEst,totPaid,overdue,onEdit,onNew,cycleStatus,setPage}){
  const active = actions.filter(a=>a.status!=="done"&&a.status!=="irrelevant");
  const urgent = [...active].sort((a,b)=>{
    const pd={High:0,Medium:1,Low:2};
    if(a.ddate&&b.ddate) return new Date(a.ddate)-new Date(b.ddate);
    if(a.ddate) return -1; if(b.ddate) return 1;
    return pd[a.priority]-pd[b.priority];
  })[0];

  const byOwner = owner => active.filter(a=>a.owner===owner)
    .sort((a,b)=>({High:0,Medium:1,Low:2}[a.priority]||1)-({High:0,Medium:1,Low:2}[b.priority]||1))
    .slice(0,4);

  const pct = totEst>0 ? Math.min(100,Math.round(totPaid/totEst*100)) : 0;
  const done = actions.filter(a=>a.status==="done").length;
  const stCounts = ["tbd","in progress","done","irrelevant"].map(s=>({lbl:s==="in progress"?"In Progress":s[0].toUpperCase()+s.slice(1),v:actions.filter(a=>a.status===s).length}));

  return(
    <>
      <div className="page-header">
        <div className="page-title">Today 🏠</div>
        <div className="page-sub">Tel Aviv → Perth · June 26, 2026</div>
      </div>
      <div className="page-body">
        {/* PhD Gate */}
        <div className={`phd-gate ${phdDone?"unlocked":""}`}>
          <div>
            <div className="phd-pill">{phdDone?"✅ Gate Unlocked":"⚠️ Critical Gate — Pending"}</div>
            <div className="phd-name">PhD Acceptance – University of Western Australia</div>
            <div className="phd-hint">{phdDone?"Timeline active · countdown running":"Timeline is paused until acceptance is confirmed"}</div>
          </div>
          <button className="btn btn-s btn-sm" onClick={()=>onEdit(actions.find(a=>a.id==="a1"))}>{phdDone?"View":"Update Status"}</button>
        </div>

        {/* Urgent + Countdown row */}
        <div className="g2" style={{marginBottom:14}}>
          {urgent ? (
            <div className="urgent-card">
              <div className="urgent-label">🔥 Do This Now</div>
              <div className="urgent-title">{urgent.title}</div>
              <div className="urgent-meta">
                <span className={`tag ${stCls(urgent.status)}`}>{urgent.status}</span>
                <span className={`tag ${prCls(urgent.priority)}`}>{urgent.priority}</span>
                <div className={`ava ${ownerCls(urgent.owner)}`}>{ownerInit(urgent.owner)}</div>
                {urgent.ddate&&<span style={{fontSize:10,color:new Date(urgent.ddate)<new Date()?"var(--re)":"var(--t2)"}}>Due {urgent.ddate}</span>}
              </div>
              <div className="urgent-actions">
                <button className="btn btn-g btn-sm" onClick={()=>cycleStatus(urgent.id)}>
                  {urgent.status==="tbd"?"▶ Start":"✓ Mark Done"}
                </button>
                <button className="btn btn-s btn-sm" onClick={()=>onEdit(urgent)}>Edit</button>
              </div>
              {urgent.id==="a2"&&<FlightPanel/>}
            </div>
          ) : (
            <div className="urgent-card">
              <div className="urgent-label">✅ All Clear</div>
              <div className="urgent-title">No urgent actions pending</div>
              <div style={{marginTop:10}}><button className="btn btn-g btn-sm" onClick={onNew}>+ Add Action</button></div>
            </div>
          )}
          <div className="countdown">
            <div className="cd-label">🛫 Countdown to Perth</div>
            <div className="cd-title">{phdDone?"Days Until Arrival":"Activate after PhD ⏳"}</div>
            {phdDone ? (
              <div className="cd-units">
                {[["D",tick.D],["H",tick.H],["M",tick.M],["S",tick.S]].map(([l,v])=>(
                  <div key={l} className="cd-unit">
                    <div className="cd-num">{String(v).padStart(2,"0")}</div>
                    <div className="cd-ulabel">{l}</div>
                  </div>
                ))}
              </div>
            ):(
              <div style={{marginTop:12,color:"var(--t2)",fontSize:13}}>Mark PhD as <strong style={{color:"var(--g)"}}>Done</strong> to activate</div>
            )}
          </div>
        </div>

        {/* Budget Pulse */}
        <div className="budget-row">
          <div className="bpulse">
            <div className="stat-label">Total Estimated</div>
            <div style={{fontFamily:"var(--fd)",fontSize:22,fontWeight:800,color:"var(--g)",marginTop:3}}>{fmtC(totEst)}</div>
            <div className="pbar" style={{marginTop:8}}><div className="pfill b" style={{width:pct+"%"}}/></div>
            <div className="stat-sub">{fmtC(totPaid)} paid · {pct}% used</div>
          </div>
          <div className="bpulse">
            <div className="stat-label">Progress</div>
            <div style={{fontFamily:"var(--fd)",fontSize:22,fontWeight:800,color:"var(--b)",marginTop:3}}>{done}/{actions.length}</div>
            <div className="pbar" style={{marginTop:8}}><div className="pfill g" style={{width:actions.length?Math.round(done/actions.length*100)+"%":"0%"}}/></div>
            <div className="stat-sub">actions complete</div>
          </div>
          <div className="bpulse" style={{maxWidth:220}}>
            <div className="stat-label">Alerts</div>
            {overdue>0&&<div style={{marginTop:6}}><span className="tag tr">{overdue} overdue</span></div>}
            {!phdDone&&<div style={{marginTop:6}}><span className="tag tam">PhD pending</span></div>}
            {overdue===0&&phdDone&&<div style={{marginTop:6}}><span className="tag tg">All clear ✓</span></div>}
            <div style={{marginTop:8,fontSize:11,color:"var(--t2)"}}>{active.length} active actions</div>
          </div>
        </div>

        {/* Owner Columns */}
        <div className="today-cols">
          {["Raz","Shahar"].map(owner=>(
            <div key={owner} className="owner-col">
              <div className="owner-col-header">
                <div className={`ava ${ownerCls(owner)}`} style={{width:28,height:28,fontSize:12}}>{ownerInit(owner)}</div>
                <div className="owner-col-name">{owner}'s Actions</div>
                <button className="btn btn-s btn-sm" style={{marginLeft:"auto",fontSize:10}} onClick={()=>setPage("plan")}>See all →</button>
              </div>
              {byOwner(owner).map(a=>(
                <div key={a.id} className="acard" style={{marginBottom:7}}>
                  <div style={{display:"flex",alignItems:"flex-start",gap:8}}>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:600,fontSize:12,color:"var(--t0)"}}>{a.title}</div>
                      <div style={{display:"flex",gap:5,marginTop:5,flexWrap:"wrap",alignItems:"center"}}>
                        <span className={`tag ${stCls(a.status)} status-tog`} title="Click to cycle status" onClick={()=>cycleStatus(a.id)}>{a.status}</span>
                        <span className={`tag ${prCls(a.priority)}`}>{a.priority}</span>
                        {a.ddate&&<span style={{fontSize:10,color:new Date(a.ddate)<new Date()&&a.status!=="done"?"var(--re)":"var(--t2)"}}>Due {a.ddate}</span>}
                      </div>
                    </div>
                    <button className="btn btn-s btn-xs" onClick={()=>onEdit(a)}>Edit</button>
                  </div>
                </div>
              ))}
              {byOwner(owner).length===0&&<div style={{color:"var(--t2)",fontSize:12,padding:"10px 0"}}>Nothing active 🎉</div>}
            </div>
          ))}
        </div>

        {/* Status chart */}
        <div className="card" style={{marginTop:14}}>
          <div className="card-title">Overall Progress</div>
          <Pie data={stCounts}/>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PLAN PAGE
// ─────────────────────────────────────────────────────────────────────────────
function PlanPage({actions,rates,cur,fmtC,phdDone,onEdit,onNew,onDelete,cycleStatus,T}){
  const [tab,setTab] = useState("actions");
  const [fSt,setFSt] = useState("all");
  const [fOw,setFOw] = useState("all");
  const [fPr,setFPr] = useState("all");
  const [fTy,setFTy] = useState("all");
  const [q,setQ] = useState("");
  const [showDone,setShowDone] = useState(false);

  return(
    <>
      <div className="page-header">
        <div className="page-title">Plan ⚡</div>
        <div className="page-sub">{actions.length} actions · {actions.filter(a=>a.status==="done").length} done</div>
        <div className="tabs">
          {[["actions","All Actions"],["phases","By Phase"],["journey","Journey"]].map(([id,lbl])=>(
            <button key={id} className={`tab ${tab===id?"on":""}`} onClick={()=>setTab(id)}>{lbl}</button>
          ))}
        </div>
      </div>
      <div className="page-body">
        {tab==="actions" && <AllActionsTab actions={actions} fSt={fSt} setFSt={setFSt} fOw={fOw} setFOw={setFOw} fPr={fPr} setFPr={setFPr} fTy={fTy} setFTy={setFTy} q={q} setQ={setQ} showDone={showDone} setShowDone={setShowDone} onEdit={onEdit} onNew={onNew} onDelete={onDelete} cycleStatus={cycleStatus} rates={rates} fmtC={fmtC} T={T}/>}
        {tab==="phases" && <PhasesTab actions={actions} onEdit={onEdit}/>}
        {tab==="journey" && <JourneyTab actions={actions} phdDone={phdDone}/>}
      </div>
    </>
  );
}

function AllActionsTab({actions,fSt,setFSt,fOw,setFOw,fPr,setFPr,fTy,setFTy,q,setQ,showDone,setShowDone,onEdit,onNew,onDelete,cycleStatus,rates,fmtC,T}){
  const filtered = actions.filter(a=>{
    if(!showDone&&(a.status==="done"||a.status==="irrelevant")) return false;
    if(fSt!=="all"&&a.status!==fSt) return false;
    if(fOw!=="all"&&a.owner!==fOw) return false;
    if(fPr!=="all"&&a.priority!==fPr) return false;
    if(fTy!=="all"&&a.type!==fTy) return false;
    if(q&&!a.title.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });
  const doneCount = actions.filter(a=>a.status==="done"||a.status==="irrelevant").length;

  return(
    <>
      <div className="filter-bar">
        <input className="search-in" placeholder="🔍 Search actions..." value={q} onChange={e=>setQ(e.target.value)}/>
        <select className="fsel" value={fSt} onChange={e=>setFSt(e.target.value)}>
          <option value="all">All Status</option>
          {["tbd","in progress","done","irrelevant"].map(s=><option key={s} value={s}>{s}</option>)}
        </select>
        <select className="fsel" value={fOw} onChange={e=>setFOw(e.target.value)}>
          <option value="all">All Owners</option>
          {["Raz","Shahar","Kids","External"].map(o=><option key={o} value={o}>{o}</option>)}
        </select>
        <select className="fsel" value={fPr} onChange={e=>setFPr(e.target.value)}>
          <option value="all">All Priority</option>
          {["High","Medium","Low"].map(p=><option key={p} value={p}>{p}</option>)}
        </select>
        <select className="fsel" value={fTy} onChange={e=>setFTy(e.target.value)}>
          <option value="all">All Types</option>
          {["Task","Expense","Purchase","Document","Visa Step","Housing","School","Admin"].map(t=><option key={t} value={t}>{t}</option>)}
        </select>
        <button className="btn btn-s btn-sm" onClick={()=>{csvDl(actions.map(a=>({title:a.title,type:a.type,owner:a.owner,priority:a.priority,status:a.status,phase:a.phase,cost:a.cost,cur:a.cur,ddate:a.ddate})),"actions.csv");T("Exported ✓");}}>↓ CSV</button>
        <button className="btn btn-g" onClick={onNew}>+ New Action</button>
      </div>

      {filtered.length===0&&<div style={{color:"var(--t2)",textAlign:"center",padding:"32px 0"}}>No actions match filters</div>}
      {filtered.map(a=><FullActionCard key={a.id} a={a} onEdit={()=>onEdit(a)} onDelete={()=>onDelete(a.id)} cycleStatus={()=>cycleStatus(a.id)}/>)}

      <div className="done-toggle" onClick={()=>setShowDone(s=>!s)}>
        <span>{showDone?"▾":"▸"}</span>
        <span>{showDone?`Hide completed/irrelevant`:`Show ${doneCount} completed / irrelevant`}</span>
      </div>
    </>
  );
}

function FullActionCard({a,onEdit,onDelete,cycleStatus}){
  const isFlight = a.id==="a2";
  const sd = a.subs?.filter(s=>s.done).length||0;
  const st = a.subs?.length||0;
  return(
    <div className={`acard ${a.status==="done"||a.status==="irrelevant"?"done-card":""}`}>
      <div className="acard-top">
        <div style={{flex:1}}>
          <div className="acard-title">{a.title}</div>
          {a.desc&&<div style={{fontSize:11,color:"var(--t1)",marginTop:3}}>{a.desc}</div>}
          <div className="acard-meta">
            <span className={`tag ${stCls(a.status)} status-tog`} title="Click to cycle status" onClick={cycleStatus}>{a.status}</span>
            <span className={`tag ${prCls(a.priority)}`}>{a.priority}</span>
            <div className={`ava ${ownerCls(a.owner)}`}>{ownerInit(a.owner)}</div>
            <span className="tag t3">{a.type}</span>
            {a.phase&&<span style={{fontSize:10,color:"var(--t2)"}}>📅 {a.phase}</span>}
            {a.ddate&&<span style={{fontSize:10,color:new Date(a.ddate)<new Date()&&a.status!=="done"?"var(--re)":"var(--t2)"}}>Due {a.ddate}</span>}
            {a.cost&&<span style={{fontSize:11,color:"var(--g)",fontWeight:600}}>{a.cur} {a.cost}</span>}
            {a.vendor&&<span style={{fontSize:10,color:"var(--t2)"}}>🏢 {a.vendor}</span>}
          </div>
          {st>0&&<div style={{marginTop:6}}><div className="mini-bar"><div className="mini-fill" style={{width:`${sd/st*100}%`}}/></div><div style={{fontSize:10,color:"var(--t2)",marginTop:2}}>{sd}/{st} subtasks</div></div>}
        </div>
        <div className="acard-actions">
          <button className="btn btn-s btn-sm" onClick={onEdit}>Edit</button>
          <button className="btn btn-d btn-sm" onClick={onDelete}>✕</button>
        </div>
      </div>
      {isFlight&&<FlightPanel/>}
    </div>
  );
}

function PhasesTab({actions,onEdit}){
  const now=new Date();
  const curPhaseIdx = PHASES.reduce((b,p,i)=>now>=p.date?i:b,0);
  return(
    <>
      <div className="phase-strip">
        {PHASES.map((p,i)=>(
          <div key={p.name} className={`phase-block ${i===curPhaseIdx?"cur":""}`}>
            <div className="phase-name">{p.name}</div>
            <div className="phase-date">{p.label}</div>
            <div className="phase-count">{actions.filter(a=>a.phase===p.name).length}</div>
          </div>
        ))}
      </div>
      {PHASES.map(p=>{
        const pa=actions.filter(a=>a.phase===p.name);
        if(!pa.length) return null;
        return(
          <div key={p.name} className="card" style={{marginBottom:10}}>
            <div className="card-title">{p.name} <span style={{color:"var(--t2)",fontWeight:400,fontSize:12}}>— {p.label}</span></div>
            {pa.map(a=>(
              <div key={a.id} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 0",borderBottom:"1px solid var(--bd)",cursor:"pointer"}} onClick={()=>onEdit(a)}>
                <span style={{flex:1,fontSize:12,fontWeight:500}}>{a.title}</span>
                <div className={`ava ${ownerCls(a.owner)}`}>{ownerInit(a.owner)}</div>
                <span className={`tag ${stCls(a.status)}`}>{a.status}</span>
                {a.ddate&&<span style={{fontSize:10,color:"var(--t2)",minWidth:78}}>{a.ddate}</span>}
              </div>
            ))}
          </div>
        );
      })}
    </>
  );
}

function JourneyTab({actions,phdDone}){
  return(
    <>
      {!phdDone&&<div className="alert alert-w" style={{marginBottom:14}}>🔒 Complete PhD acceptance at UWA to unlock the full journey</div>}
      <div className="card">
        {JOURNEY_STEPS.map((step,i)=>{
          const linked=actions.find(a=>a.id===step.aid);
          const isDone=linked?linked.status==="done":false;
          const locked=!phdDone&&i>0;
          return(
            <div key={step.id} className="step-row" style={{opacity:locked?.38:1}}>
              <div className={`step-num ${isDone?"done":""}`}>{isDone?"✓":step.n}</div>
              <div>
                <div style={{fontWeight:600,fontSize:13}}>{step.title}{locked?" 🔒":""}</div>
                <div style={{fontSize:11,color:"var(--t1)",marginTop:2}}>{step.desc}</div>
                {linked&&<div style={{marginTop:5}}><span className={`tag ${stCls(linked.status)}`}>{linked.status}</span></div>}
                {step.id==="j7"&&<FlightPanel/>}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// VAULT PAGE
// ─────────────────────────────────────────────────────────────────────────────
function VaultPage({actions,docs,setDocs,shop,setShop,rates,cur,fmtC,shopTot,T}){
  const [tab,setTab] = useState("budget");
  return(
    <>
      <div className="page-header">
        <div className="page-title">Vault 🗂️</div>
        <div className="page-sub">Budget · Documents · Shopping</div>
        <div className="tabs">
          {[["budget","Budget"],["documents","Documents"],["shopping","Shopping"]].map(([id,lbl])=>(
            <button key={id} className={`tab ${tab===id?"on":""}`} onClick={()=>setTab(id)}>{lbl}</button>
          ))}
        </div>
      </div>
      <div className="page-body">
        {tab==="budget"    && <BudgetTab actions={actions} rates={rates} cur={cur} fmtC={fmtC} shopTot={shopTot} T={T}/>}
        {tab==="documents" && <DocumentsTab docs={docs} setDocs={setDocs} actions={actions} T={T}/>}
        {tab==="shopping"  && <ShoppingTab shop={shop} setShop={setShop} rates={rates} cur={cur} fmtC={fmtC} T={T}/>}
      </div>
    </>
  );
}

function BudgetTab({actions,rates,cur,fmtC,shopTot,T}){
  const ea=actions.filter(a=>a.cost);
  const tot=ea.reduce((s,a)=>s+conv(a.cost,a.cur,rates,cur),0);
  const paid=ea.filter(a=>a.status==="done").reduce((s,a)=>s+conv(a.cost,a.cur,rates,cur),0);
  const grand=tot+shopTot;
  return(
    <>
      <div className="g3" style={{marginBottom:16}}>
        <div className="stat-card">
          <div className="stat-label">Actions Budget</div>
          <div className="stat-val vg">{fmtC(tot)}</div>
          <div className="pbar"><div className="pfill b" style={{width:tot>0?Math.round(paid/tot*100)+"%":"0%"}}/></div>
          <div className="stat-sub">{fmtC(paid)} paid</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Shopping Budget</div>
          <div className="stat-val vb">{fmtC(shopTot)}</div>
          <div className="stat-sub">Post-arrival purchases</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Grand Total</div>
          <div className="stat-val vam">{fmtC(grand)}</div>
          <div className="stat-sub">All costs combined</div>
        </div>
      </div>
      <div className="card">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div className="card-title" style={{marginBottom:0}}>All Action Costs</div>
          <button className="btn btn-s btn-sm" onClick={()=>{csvDl(ea.map(a=>({title:a.title,cost:a.cost,currency:a.cur,status:a.status,owner:a.owner})),"budget.csv");T("Exported ✓");}}>↓ CSV</button>
        </div>
        <div className="exp-table">
          <div className="exp-hdr"><span>Name</span><span>Amount</span><span>{cur}</span><span>Owner</span><span>Status</span></div>
          {ea.map(a=>(
            <div key={a.id} className="exp-row">
              <span style={{fontWeight:500}}>{a.title}</span>
              <span style={{color:"var(--t1)"}}>{a.cost} {a.cur}</span>
              <span style={{color:"var(--g)",fontWeight:600}}>{fmtC(conv(a.cost,a.cur,rates,cur))}</span>
              <div className={`ava ${ownerCls(a.owner)}`}>{ownerInit(a.owner)}</div>
              <span className={`tag ${stCls(a.status)}`}>{a.status}</span>
            </div>
          ))}
          {!ea.length&&<div style={{color:"var(--t2)",textAlign:"center",padding:"20px 0"}}>No costs added yet</div>}
        </div>
      </div>
    </>
  );
}

function DocumentsTab({docs,setDocs,actions,T}){
  const [mo,setMo] = useState(false);
  const [f,setF] = useState({id:"",type:"",exp:"",aid:"",notes:""});
  const sf=(k,v)=>setF(p=>({...p,[k]:v}));
  const save=()=>{
    if(!f.type.trim()){T("Document type required","err");return;}
    setDocs(prev=>f.id?prev.map(d=>d.id===f.id?f:d):[...prev,{...f,id:"d"+Date.now()}]);
    setMo(false);T("Saved ✓");
  };
  const soonDate = new Date(Date.now()+365*86400000);
  return(
    <>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div style={{fontSize:12,color:"var(--t1)"}}>{docs.length} documents · {docs.filter(d=>d.exp&&new Date(d.exp)<soonDate).length} expiring within a year</div>
        <button className="btn btn-g btn-sm" onClick={()=>{setF({id:"",type:"",exp:"",aid:"",notes:""});setMo(true);}}>+ Add Document</button>
      </div>
      <div className="card" style={{padding:0,overflow:"hidden"}}>
        {docs.map(d=>{
          const expiring=d.exp&&new Date(d.exp)<soonDate;
          return(
            <div key={d.id} className="doc-row">
              <div>
                <div style={{fontWeight:600,fontSize:13}}>{d.type}</div>
                <div style={{display:"flex",gap:10,marginTop:3,flexWrap:"wrap"}}>
                  {d.exp&&<span style={{fontSize:11,color:expiring?"var(--am)":"var(--t2)"}}>Expires {d.exp}{expiring?" ⚠️":""}</span>}
                  {d.aid&&<span style={{fontSize:11,color:"var(--t2)"}}>🔗 {actions.find(a=>a.id===d.aid)?.title||d.aid}</span>}
                  {d.notes&&<span style={{fontSize:11,color:"var(--t1)"}}>{d.notes}</span>}
                </div>
              </div>
              <div style={{display:"flex",gap:6}}>
                <button className="btn btn-s btn-sm" onClick={()=>{setF(d);setMo(true);}}>Edit</button>
                <button className="btn btn-d btn-sm" onClick={()=>setDocs(p=>p.filter(x=>x.id!==d.id))}>✕</button>
              </div>
            </div>
          );
        })}
      </div>
      {mo&&<div className="overlay" onClick={e=>e.target===e.currentTarget&&setMo(false)}>
        <div className="modal">
          <div className="modal-title">{f.id?"Edit":"Add"} Document</div>
          <div className="fg1">
            <div className="fcol"><div className="flabel">Document Type *</div><input className="finput" value={f.type} onChange={e=>sf("type",e.target.value)}/></div>
            <div className="fcol"><div className="flabel">Expiry Date</div><input type="date" className="finput" value={f.exp} onChange={e=>sf("exp",e.target.value)}/></div>
            <div className="fcol"><div className="flabel">Linked Action</div><select className="fselect" value={f.aid} onChange={e=>sf("aid",e.target.value)}><option value="">None</option>{actions.map(a=><option key={a.id} value={a.id}>{a.title}</option>)}</select></div>
            <div className="fcol"><div className="flabel">Notes</div><textarea className="ftextarea" value={f.notes} onChange={e=>sf("notes",e.target.value)} rows={2}/></div>
          </div>
          <div className="modal-footer"><button className="btn btn-s" onClick={()=>setMo(false)}>Cancel</button><button className="btn btn-g" onClick={save}>Save</button></div>
        </div>
      </div>}
    </>
  );
}

function ShoppingTab({shop,setShop,rates,cur,fmtC,T}){
  const [mo,setMo] = useState(false);
  const [f,setF] = useState({id:"",name:"",store:"",cost:"",owner:"Shahar",phase:"Month 0 Arrival",done:false,notes:""});
  const sf=(k,v)=>setF(p=>({...p,[k]:v}));
  const totAUD=shop.reduce((s,i)=>s+(+i.cost||0),0);
  const save=()=>{
    if(!f.name.trim()){T("Name required","err");return;}
    setShop(prev=>f.id?prev.map(i=>i.id===f.id?f:i):[...prev,{...f,id:"sh"+Date.now()}]);
    setMo(false);T("Saved ✓");
  };
  return(
    <>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div style={{display:"flex",gap:20}}>
          <div><div className="stat-label">Total (AUD)</div><div style={{fontFamily:"var(--fd)",fontWeight:800,fontSize:20,color:"var(--g)",marginTop:2}}>A${totAUD.toLocaleString()}</div></div>
          <div><div className="stat-label">In {cur}</div><div style={{fontFamily:"var(--fd)",fontWeight:800,fontSize:20,color:"var(--b)",marginTop:2}}>{fmtC(conv(totAUD,"AUD",rates,cur))}</div></div>
          <div><div className="stat-label">Remaining</div><div style={{fontFamily:"var(--fd)",fontWeight:800,fontSize:20,color:"var(--am)",marginTop:2}}>{shop.filter(i=>!i.done).length} items</div></div>
        </div>
        <button className="btn btn-g btn-sm" onClick={()=>{setF({id:"",name:"",store:"",cost:"",owner:"Shahar",phase:"Month 0 Arrival",done:false,notes:""});setMo(true);}}>+ Add Item</button>
      </div>
      <div className="card">
        {shop.map(item=>(
          <div key={item.id} className="shop-row">
            <input type="checkbox" style={{width:16,height:16,accentColor:"var(--g)",cursor:"pointer",flexShrink:0}} checked={item.done} onChange={()=>setShop(p=>p.map(i=>i.id===item.id?{...i,done:!i.done}:i))}/>
            <div style={{flex:1}}>
              <div style={{fontWeight:600,fontSize:13,textDecoration:item.done?"line-through":"none",color:item.done?"var(--t2)":"var(--t0)"}}>{item.name}</div>
              <div style={{display:"flex",gap:10,marginTop:2,flexWrap:"wrap"}}>
                {item.store&&<span style={{fontSize:11,color:"var(--t2)"}}>🏬 {item.store}</span>}
                <div className={`ava ${ownerCls(item.owner)}`}>{ownerInit(item.owner)}</div>
                <span style={{fontSize:11,color:"var(--t2)"}}>📅 {item.phase}</span>
                {item.notes&&<span style={{fontSize:11,color:"var(--t1)"}}>{item.notes}</span>}
              </div>
            </div>
            <div style={{fontWeight:700,color:"var(--g)",fontSize:13,marginRight:8}}>A${(+item.cost||0).toLocaleString()}</div>
            <button className="btn btn-s btn-sm" onClick={()=>{setF(item);setMo(true);}}>Edit</button>
            <button className="btn btn-d btn-sm" onClick={()=>setShop(p=>p.filter(i=>i.id!==item.id))}>✕</button>
          </div>
        ))}
        {!shop.length&&<div style={{color:"var(--t2)",textAlign:"center",padding:"20px 0"}}>No items yet</div>}
      </div>
      {mo&&<div className="overlay" onClick={e=>e.target===e.currentTarget&&setMo(false)}>
        <div className="modal">
          <div className="modal-title">{f.id?"Edit":"Add"} Item</div>
          <div className="fg">
            <div className="fcol span2"><div className="flabel">Item Name *</div><input className="finput" value={f.name} onChange={e=>sf("name",e.target.value)}/></div>
            <div className="fcol"><div className="flabel">Store</div><input className="finput" value={f.store} onChange={e=>sf("store",e.target.value)}/></div>
            <div className="fcol"><div className="flabel">Cost (AUD)</div><input type="number" className="finput" value={f.cost} onChange={e=>sf("cost",e.target.value)}/></div>
            <div className="fcol"><div className="flabel">Owner</div><select className="fselect" value={f.owner} onChange={e=>sf("owner",e.target.value)}>{["Raz","Shahar","Kids","External"].map(o=><option key={o}>{o}</option>)}</select></div>
            <div className="fcol"><div className="flabel">Phase</div><select className="fselect" value={f.phase} onChange={e=>sf("phase",e.target.value)}>{PHASES.map(p=><option key={p.name}>{p.name}</option>)}</select></div>
            <div className="fcol span2"><div className="flabel">Notes</div><input className="finput" value={f.notes} onChange={e=>sf("notes",e.target.value)}/></div>
          </div>
          <div className="modal-footer"><button className="btn btn-s" onClick={()=>setMo(false)}>Cancel</button><button className="btn btn-g" onClick={save}>Save</button></div>
        </div>
      </div>}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SETTINGS PAGE
// ─────────────────────────────────────────────────────────────────────────────
function SettingsPage({rates,setRates,fetchRates}){
  const [audV,setAudV] = useState(String(rates.AUD));
  const [usdV,setUsdV] = useState(String(rates.USD));
  const save=()=>{
    const a=parseFloat(audV),u=parseFloat(usdV);
    if(isNaN(a)||isNaN(u)){alert("Invalid values");return;}
    setRates(r=>({...r,AUD:a,USD:u,upd:"Manual"}));
  };
  const INFO=[["App","Perth Relocation Commander 2026"],["Origin","🇮🇱 Tel Aviv, Israel"],["Destination","🇦🇺 Perth, Australia"],["Arrival","June 26, 2026"],["Family","4 · 2 adults · 2 children (ages 5 & 7)"],["Pets","No"],["Primary Currency","ILS (₪)"],["Secondary","AUD (A$)"]];
  return(
    <>
      <div className="page-header">
        <div className="page-title">Settings ⚙️</div>
        <div className="page-sub">Profile · Currency · Data</div>
      </div>
      <div className="page-body">
        <div className="g2" style={{alignItems:"start"}}>
          <div className="card">
            <div className="card-title">Relocation Profile</div>
            {INFO.map(([k,v])=>(
              <div key={k} style={{display:"flex",gap:12,padding:"7px 0",borderBottom:"1px solid var(--bd)",fontSize:12}}>
                <span style={{color:"var(--t2)",width:130,flexShrink:0}}>{k}</span>
                <span style={{fontWeight:500}}>{v}</span>
              </div>
            ))}
          </div>
          <div>
            <div className="card">
              <div className="card-title">Exchange Rates (to ILS)</div>
              <div style={{display:"grid",gap:10,marginBottom:14}}>
                <div className="fcol"><div className="flabel">1 AUD = ? ILS</div><input type="number" step="0.01" className="finput" value={audV} onChange={e=>setAudV(e.target.value)}/></div>
                <div className="fcol"><div className="flabel">1 USD = ? ILS</div><input type="number" step="0.01" className="finput" value={usdV} onChange={e=>setUsdV(e.target.value)}/></div>
              </div>
              <div style={{fontSize:11,color:"var(--t2)",marginBottom:12}}>Last updated: <strong style={{color:"var(--t1)"}}>{rates.upd}</strong></div>
              <div style={{display:"flex",gap:8}}>
                <button className="btn btn-g" onClick={save}>Save Manual Rates</button>
                <button className="btn btn-s" onClick={fetchRates} disabled={rates.fetching}>{rates.fetching?"⏳ Fetching…":"↻ Fetch Live Rates"}</button>
              </div>
              <div style={{marginTop:12,padding:"10px 12px",background:"var(--s2)",borderRadius:8,fontSize:11,color:"var(--t1)"}}>
                <strong>API:</strong> Claude AI · live web search · rates fetched in real-time
              </div>
            </div>
            <div className="card" style={{marginTop:0}}>
              <div className="card-title">Data Management</div>
              <div style={{fontSize:12,color:"var(--t1)",marginBottom:12}}>All data is stored in your browser's localStorage. It persists between sessions automatically.</div>
              <button className="btn btn-d btn-sm" onClick={()=>{if(window.confirm("Reset all data to defaults? This cannot be undone.")){["prc_acts","prc_docs","prc_shop","prc_rates","prc_cur","prc_page"].forEach(k=>localStorage.removeItem(k));window.location.reload();}}}>⚠ Reset All Data</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FLIGHT PANEL — 3 platform buttons
// ─────────────────────────────────────────────────────────────────────────────
function FlightPanel(){
  return(
    <div className="flight-panel">
      <div className="flight-panel-title">✈️ Book Your Flight — TLV → PER</div>
      <div className="flight-panel-meta">
        <strong>One-way</strong> · <strong>Jun 20, 2026</strong> · <strong>±5 days flexible</strong> · 2 adults · 2 children · 1 stop · Economy
      </div>
      <div className="flight-btns">
        {FLIGHT_LINKS.map(p=>(
          <a
            key={p.id}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flight-btn"
            style={{background:p.colorDim, borderColor:`${p.color}55`, color:p.color}}
            title={p.note}
          >
            <span className="flight-btn-ico">{p.icon}</span>
            <span className="flight-btn-name">{p.name}</span>
            <span className="flight-btn-arrow">↗</span>
          </a>
        ))}
      </div>
      <div style={{marginTop:10,fontSize:10,color:"var(--t3)"}}>
        Opens in new tab · Filters pre-applied where supported · Verify pax count on landing page
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ACTION MODAL — Quick Add + Advanced expand
// ─────────────────────────────────────────────────────────────────────────────
function ActionModal({a,onSave,onClose}){
  const blank={id:"",title:"",desc:"",type:"Task",owner:"Raz",priority:"High",status:"tbd",phase:"Month -3",pdate:"",ddate:"",cost:"",cur:"ILS",vendor:"",comments:"",subs:[]};
  const [f,setF] = useState(a||blank);
  const [adv,setAdv] = useState(!!a?.id); // show advanced if editing
  const [ns,setNs] = useState("");
  const sf=(k,v)=>setF(p=>({...p,[k]:v}));

  useEffect(()=>{
    if(f.subs?.some(s=>s.done)&&f.status==="tbd") sf("status","in progress");
  },[f.subs]);

  const isFlight=f.id==="a2"||f.title.toLowerCase().includes("flight");

  return(
    <div className="overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <div className="modal-title">{a?.id?"Edit Action":"New Action"}</div>

        {/* QUICK ADD — always visible */}
        <div className="fg">
          <div className="fcol span2">
            <div className="flabel">Title *</div>
            <input className="finput" value={f.title} onChange={e=>sf("title",e.target.value)} placeholder="What needs to be done?" autoFocus/>
          </div>
          <div className="fcol">
            <div className="flabel">Owner</div>
            <select className="fselect" value={f.owner} onChange={e=>sf("owner",e.target.value)}>
              {["Raz","Shahar","Kids","External"].map(o=><option key={o}>{o}</option>)}
            </select>
          </div>
          <div className="fcol">
            <div className="flabel">Priority</div>
            <select className="fselect" value={f.priority} onChange={e=>sf("priority",e.target.value)}>
              {["High","Medium","Low"].map(p=><option key={p}>{p}</option>)}
            </select>
          </div>
          <div className="fcol">
            <div className="flabel">Due Date</div>
            <input type="date" className="finput" value={f.ddate} onChange={e=>sf("ddate",e.target.value)}/>
          </div>
          <div className="fcol">
            <div className="flabel">Status</div>
            <select className="fselect" value={f.status} onChange={e=>sf("status",e.target.value)}>
              {["tbd","in progress","irrelevant","done"].map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* ADVANCED EXPAND */}
        <div className="expand-toggle" onClick={()=>setAdv(v=>!v)}>
          <span style={{fontSize:13}}>{adv?"▾":"▸"}</span>
          <span>{adv?"Hide advanced fields":"More options (type, cost, phase, subtasks…)"}</span>
        </div>

        {adv&&(
          <>
            <div className="fg">
              <div className="fcol">
                <div className="flabel">Type</div>
                <select className="fselect" value={f.type} onChange={e=>sf("type",e.target.value)}>
                  {["Task","Expense","Purchase","Document","Visa Step","Housing","School","Admin"].map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="fcol">
                <div className="flabel">Phase</div>
                <select className="fselect" value={f.phase} onChange={e=>sf("phase",e.target.value)}>
                  {PHASES.map(p=><option key={p.name}>{p.name}</option>)}
                </select>
              </div>
              <div className="fcol">
                <div className="flabel">Cost</div>
                <input type="number" className="finput" value={f.cost} onChange={e=>sf("cost",e.target.value)} placeholder="0"/>
              </div>
              <div className="fcol">
                <div className="flabel">Currency</div>
                <select className="fselect" value={f.cur} onChange={e=>sf("cur",e.target.value)}>
                  {["ILS","AUD","USD"].map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="fcol">
                <div className="flabel">Vendor</div>
                <input className="finput" value={f.vendor} onChange={e=>sf("vendor",e.target.value)}/>
              </div>
              <div className="fcol">
                <div className="flabel">{isFlight?"Flight Date":"Planned Date"}</div>
                <input type="date" className="finput" value={f.pdate} onChange={e=>sf("pdate",e.target.value)}/>
              </div>
              <div className="fcol span2">
                <div className="flabel">Description</div>
                <textarea className="ftextarea" value={f.desc} onChange={e=>sf("desc",e.target.value)} rows={2}/>
              </div>
              <div className="fcol span2">
                <div className="flabel">Comments</div>
                <textarea className="ftextarea" value={f.comments} onChange={e=>sf("comments",e.target.value)} rows={2}/>
              </div>
            </div>

            {/* SUBTASKS */}
            <div className="modal-section">Subtasks</div>
            {(f.subs||[]).map(sub=>(
              <div key={sub.id} className="sub-row">
                <input type="checkbox" className="sub-check" checked={sub.done} onChange={()=>sf("subs",f.subs.map(x=>x.id===sub.id?{...x,done:!x.done}:x))}/>
                <span style={{flex:1,fontSize:12,textDecoration:sub.done?"line-through":"none",color:sub.done?"var(--t2)":"var(--t0)"}}>{sub.t}</span>
                <button style={{background:"none",border:"none",color:"var(--t2)",cursor:"pointer",fontSize:12,padding:"0 4px"}} onClick={()=>sf("subs",f.subs.filter(x=>x.id!==sub.id))}>✕</button>
              </div>
            ))}
            <div style={{display:"flex",gap:7,marginTop:9}}>
              <input className="finput" style={{flex:1}} placeholder="Add subtask…" value={ns} onChange={e=>setNs(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&ns.trim()){sf("subs",[...(f.subs||[]),{id:"s"+Date.now(),t:ns,done:false}]);setNs("");}}}/>
              <button className="btn btn-s btn-sm" onClick={()=>{if(ns.trim()){sf("subs",[...(f.subs||[]),{id:"s"+Date.now(),t:ns,done:false}]);setNs("");}}}>+ Add</button>
            </div>
          </>
        )}

        <div className="modal-footer">
          <button className="btn btn-s" onClick={onClose}>Cancel</button>
          <button className="btn btn-g" onClick={()=>onSave(f)}>Save Action</button>
        </div>
      </div>
    </div>
  );
}
