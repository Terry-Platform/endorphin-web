(function(){"use strict";const g=`
  :host {
    display: block;
    width: 100%;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  .terry-slider {
    overflow: hidden;
    padding: 12px 0;
    position: relative;
    mask-image: linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%);
    -webkit-mask-image: linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%);
  }

  .terry-track {
    display: flex;
    gap: 14px;
    width: max-content;
    animation: terry-scroll var(--scroll-duration, 60s) linear infinite;
  }

  .terry-track:hover {
    animation-play-state: paused;
  }

  @keyframes terry-scroll {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }

  .terry-card {
    display: flex;
    align-items: center;
    gap: 12px;
    background: white;
    border-radius: 14px;
    padding: 10px 16px;
    min-width: 280px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
    border: 1px solid rgba(0, 0, 0, 0.04);
    transition: box-shadow 0.2s ease, transform 0.2s ease;
    cursor: default;
    flex-shrink: 0;
  }

  .terry-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04);
    transform: translateY(-1px);
  }

  .terry-logo {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    object-fit: contain;
    background: #f9fafb;
    border: 1px solid #f3f4f6;
    flex-shrink: 0;
  }

  .terry-logo-fallback {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: linear-gradient(135deg, #16a34a, #059669);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 700;
    font-size: 16px;
    flex-shrink: 0;
  }

  .terry-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  .terry-store-name {
    font-size: 14px;
    font-weight: 600;
    color: #1f2937;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .terry-details {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
  }

  .terry-amount {
    font-weight: 700;
    color: #16a34a;
    white-space: nowrap;
  }

  .terry-arrow {
    color: #d1d5db;
    font-size: 11px;
    flex-shrink: 0;
  }

  .terry-project {
    color: #6b7280;
    font-weight: 400;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 160px;
  }

  .terry-skeleton {
    display: flex;
    gap: 14px;
    padding: 12px 0;
    overflow: hidden;
  }

  .terry-skeleton-card {
    display: flex;
    align-items: center;
    gap: 12px;
    background: white;
    border-radius: 14px;
    padding: 10px 16px;
    min-width: 280px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
    border: 1px solid rgba(0, 0, 0, 0.04);
    flex-shrink: 0;
  }

  .terry-skeleton-circle {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
    background-size: 200% 100%;
    animation: terry-shimmer 1.5s infinite;
    flex-shrink: 0;
  }

  .terry-skeleton-lines {
    display: flex;
    flex-direction: column;
    gap: 6px;
    flex: 1;
  }

  .terry-skeleton-line {
    height: 12px;
    border-radius: 6px;
    background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
    background-size: 200% 100%;
    animation: terry-shimmer 1.5s infinite;
  }

  .terry-skeleton-line:first-child { width: 70%; }
  .terry-skeleton-line:last-child { width: 50%; }

  @keyframes terry-shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  @media (max-width: 640px) {
    .terry-card {
      min-width: 240px;
      padding: 8px 12px;
    }

    .terry-logo, .terry-logo-fallback {
      width: 32px;
      height: 32px;
      font-size: 14px;
    }

    .terry-store-name { font-size: 13px; }
    .terry-details { font-size: 12px; }
    .terry-project { max-width: 120px; }
  }
`,h=["#16a34a","#059669","#34d399","#bbf7d0","#ffffff","#10b981"];function u(i){const e=document.createElement("canvas"),r=i.getBoundingClientRect();e.width=r.width,e.height=Math.min(r.height+200,400),e.style.cssText=`
    position: absolute;
    top: -100px;
    left: 0;
    width: 100%;
    height: ${e.height}px;
    pointer-events: none;
    z-index: 10;
  `,i.style.position="relative",i.appendChild(e);const a=e.getContext("2d");if(!a)return;const o=[],n=40;for(let t=0;t<n;t++)o.push({x:e.width*(.2+Math.random()*.6),y:e.height*.4,vx:(Math.random()-.5)*8,vy:-(Math.random()*6+3),size:Math.random()*6+3,color:h[Math.floor(Math.random()*h.length)],alpha:1,rotation:Math.random()*360,rotationSpeed:(Math.random()-.5)*10,shape:Math.random()>.5?"circle":"rect"});let s=0;const l=120;function c(){if(a){if(s++,s>l){e.remove();return}a.clearRect(0,0,e.width,e.height);for(const t of o)t.x+=t.vx,t.vy+=.15,t.y+=t.vy,t.alpha=Math.max(0,1-s/l),t.rotation+=t.rotationSpeed,a.save(),a.globalAlpha=t.alpha,a.translate(t.x,t.y),a.rotate(t.rotation*Math.PI/180),a.fillStyle=t.color,t.shape==="circle"?(a.beginPath(),a.arc(0,0,t.size/2,0,Math.PI*2),a.fill()):a.fillRect(-t.size/2,-t.size/2,t.size,t.size*.6),a.restore();requestAnimationFrame(c)}}requestAnimationFrame(c)}const y=Object.freeze(Object.defineProperty({__proto__:null,MOCK_TRANSACTIONS:[{store_name:"Bol.com",store_logo:null,cashback:12.34,project_name:"One Tree Planted",date:"2026-03-03 10:15:00"},{store_name:"Coolblue",store_logo:null,cashback:28.45,project_name:"Oceaanbescherming",date:"2026-03-03 09:42:00"},{store_name:"Zalando",store_logo:null,cashback:5.67,project_name:"Regenwoud Herstel",date:"2026-03-03 08:30:00"},{store_name:"MediaMarkt",store_logo:null,cashback:15.2,project_name:"Koraalrif Herstel",date:"2026-03-02 22:10:00"},{store_name:"H&M",store_logo:null,cashback:3.89,project_name:"One Tree Planted",date:"2026-03-02 20:45:00"},{store_name:"Booking.com",store_logo:null,cashback:42.1,project_name:"Schone Energie",date:"2026-03-02 18:20:00"},{store_name:"ASOS",store_logo:null,cashback:7.56,project_name:"Regenwoud Herstel",date:"2026-03-02 16:55:00"},{store_name:"Nike",store_logo:null,cashback:9.3,project_name:"Oceaanbescherming",date:"2026-03-02 15:30:00"},{store_name:"Wehkamp",store_logo:null,cashback:18.75,project_name:"One Tree Planted",date:"2026-03-02 14:10:00"},{store_name:"Adidas",store_logo:null,cashback:6.4,project_name:"Schone Energie",date:"2026-03-02 12:45:00"},{store_name:"Albert Heijn",store_logo:null,cashback:2.15,project_name:"Koraalrif Herstel",date:"2026-03-02 11:20:00"},{store_name:"Bijenkorf",store_logo:null,cashback:31.6,project_name:"Regenwoud Herstel",date:"2026-03-02 09:50:00"},{store_name:"Decathlon",store_logo:null,cashback:11.25,project_name:"One Tree Planted",date:"2026-03-01 23:30:00"},{store_name:"IKEA",store_logo:null,cashback:8.9,project_name:"Schone Energie",date:"2026-03-01 21:15:00"},{store_name:"Thuisbezorgd",store_logo:null,cashback:1.45,project_name:"Oceaanbescherming",date:"2026-03-01 19:40:00"},{store_name:"Kruidvat",store_logo:null,cashback:4.3,project_name:"Regenwoud Herstel",date:"2026-03-01 17:25:00"},{store_name:"Efteling",store_logo:null,cashback:22.8,project_name:"One Tree Planted",date:"2026-03-01 15:00:00"},{store_name:"Rituals",store_logo:null,cashback:13.55,project_name:"Koraalrif Herstel",date:"2026-03-01 13:30:00"},{store_name:"Gamma",store_logo:null,cashback:7.2,project_name:"Schone Energie",date:"2026-03-01 11:10:00"},{store_name:"COS",store_logo:null,cashback:16.9,project_name:"Regenwoud Herstel",date:"2026-03-01 09:00:00"}]},Symbol.toStringTag,{value:"Module"})),b="https://api.terry.earth",k=60,x=40;class p{shadow;container;transactions=[];track=null;sliderEl=null;pollTimer=null;confettiFired=!1;apiUrl;pollInterval;useMock;constructor(e){this.container=e,this.shadow=e.attachShadow({mode:"open"}),this.apiUrl=e.dataset.apiUrl||b,this.pollInterval=parseInt(e.dataset.pollInterval||String(k),10),this.useMock=e.dataset.useMock==="true",this.init()}async init(){this.injectStyles(),this.renderSkeleton(),await this.fetchTransactions(),this.render(),this.startPolling(),this.setupVisibilityObserver()}injectStyles(){const e=document.createElement("style");e.textContent=g,this.shadow.appendChild(e)}renderSkeleton(){const e=document.createElement("div");e.className="terry-skeleton";for(let r=0;r<5;r++)e.innerHTML+=`
        <div class="terry-skeleton-card">
          <div class="terry-skeleton-circle"></div>
          <div class="terry-skeleton-lines">
            <div class="terry-skeleton-line"></div>
            <div class="terry-skeleton-line"></div>
          </div>
        </div>
      `;this.shadow.appendChild(e)}async fetchTransactions(){try{const r=await(await fetch(`${this.apiUrl}/public/transactions/recent`,{headers:{Accept:"application/json"}})).json();if(r.success===1&&Array.isArray(r.data)&&r.data.length>0){this.transactions=r.data;return}}catch{}await this.buildFromPublicData()}async buildFromPublicData(){try{const[e,r]=await Promise.all([fetch(`${this.apiUrl}/public/app/stores`,{headers:{Accept:"application/json"}}),fetch(`${this.apiUrl}/public/app/projects`,{headers:{Accept:"application/json"}})]),a=await e.json(),o=await r.json(),n=[];if(a.success===1&&a.data)for(const t of Object.keys(a.data)){const d=a.data[t];if(Array.isArray(d))for(const f of d)n.push({name:f.name,logo:f.logo??null})}const s=[];if(o.success===1&&Array.isArray(o.data))for(const t of o.data)s.push({name:t.name});if(n.length===0)return;const l=n.sort(()=>Math.random()-.5).slice(0,25),c=Date.now();this.transactions=l.map((t,d)=>({store_name:t.name,store_logo:t.logo,cashback:Math.round((Math.random()*40+.5)*100)/100,project_name:s.length>0?s[Math.floor(Math.random()*s.length)].name:null,date:new Date(c-d*36e5*(1+Math.random()*3)).toISOString().replace("T"," ").substring(0,19)}))}catch{const{MOCK_TRANSACTIONS:e}=await Promise.resolve().then(()=>y);this.transactions=e}}formatCurrency(e){return new Intl.NumberFormat("nl-NL",{style:"currency",currency:"EUR"}).format(e)}createCard(e){const r=document.createElement("div");r.className="terry-card";const a=e.store_logo?`<img class="terry-logo" src="${e.store_logo}" alt="${e.store_name}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="terry-logo-fallback" style="display:none">${e.store_name.charAt(0).toUpperCase()}</div>`:`<div class="terry-logo-fallback">${e.store_name.charAt(0).toUpperCase()}</div>`,o=e.project_name?`<span class="terry-arrow">&#10132;</span><span class="terry-project">${e.project_name}</span>`:"";return r.innerHTML=`
      ${a}
      <div class="terry-info">
        <div class="terry-store-name">${e.store_name}</div>
        <div class="terry-details">
          <span class="terry-amount">${this.formatCurrency(e.cashback)}</span>
          ${o}
        </div>
      </div>
    `,r}render(){const e=this.shadow.querySelector(".terry-skeleton");e&&e.remove(),this.sliderEl&&this.sliderEl.remove(),this.sliderEl=document.createElement("div"),this.sliderEl.className="terry-slider",this.track=document.createElement("div"),this.track.className="terry-track";for(let n=0;n<2;n++)for(const s of this.transactions)this.track.appendChild(this.createCard(s));const o=this.transactions.length*294/x;this.track.style.setProperty("--scroll-duration",`${o}s`),this.sliderEl.appendChild(this.track),this.shadow.appendChild(this.sliderEl)}startPolling(){this.pollTimer=setInterval(async()=>{const e=this.transactions[0];await this.fetchTransactions();const r=this.transactions[0];e&&r&&(e.store_name!==r.store_name||e.cashback!==r.cashback||e.date!==r.date)&&this.render()},this.pollInterval*1e3)}setupVisibilityObserver(){const e=new IntersectionObserver(r=>{r[0].isIntersecting&&!this.confettiFired&&(this.confettiFired=!0,setTimeout(()=>{this.sliderEl&&u(this.sliderEl)},300),e.disconnect())},{threshold:.3});e.observe(this.container)}destroy(){this.pollTimer&&clearInterval(this.pollTimer)}}function m(){document.querySelectorAll("#terry-slider, [data-terry-slider]").forEach(e=>{e.__terrySlider||(e.__terrySlider=new p(e))})}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",m):m(),window.TerryTransactionSlider=p})();
