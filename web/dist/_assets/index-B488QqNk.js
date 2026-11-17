var Ah=Object.defineProperty;var Rh=(r,e,t)=>e in r?Ah(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t;var U=(r,e,t)=>Rh(r,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function t(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(i){if(i.ep)return;i.ep=!0;const s=t(i);fetch(i.href,s)}})();function Ch(r){r.innerHTML=`
    <!-- Top Navigation Bar -->
    <header class="top-nav">
      <div class="nav-brand">
        <div class="nav-logo-icon">W</div>
        <span>World Model 3D</span>
        <span class="badge badge-live" style="margin-left: 8px;">NBA 2026</span>
      </div>
      <nav class="nav-links">
        <a href="#/" class="active">Simulations</a>
        <a href="#/results">Accreditation Results</a>
        <a href="#/about">Architecture & Tech</a>
      </nav>
    </header>

    <main class="home-container">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="glass-pill hero-badge">
          <span style="color: var(--accent-cyan); font-weight: 700;">● Model-Based Predictive Control</span>
          <span style="color: var(--text-dim);">|</span>
          <span>National Board of Accreditation Showcase</span>
        </div>
        <h1 class="hero-title">World Model: Learn, Imagine, Act</h1>
        <p class="hero-subtitle">
          Instead of reacting blindly, autonomous systems learn an internal physics model,
          mentally roll out candidate futures in parallel, and choose optimal actions before physical execution.
        </p>

        <!-- 3-Step Explainer Strip -->
        <div class="explainer-strip">
          <div class="glass-panel step-card">
            <div class="step-number">Step 01</div>
            <h3 class="step-title">LEARN</h3>
            <p class="step-desc">
              Collect transitions (state, action) &rarr; (next state, reward) to train an epistemic uncertainty-aware neural dynamics model.
            </p>
          </div>
          <div class="glass-panel step-card">
            <div class="step-number">Step 02</div>
            <h3 class="step-title">IMAGINE</h3>
            <p class="step-desc">
              Roll out hundreds of candidate action trajectories 14 steps into the future in 8.7 ms without touching physical hardware.
            </p>
          </div>
          <div class="glass-panel step-card">
            <div class="step-number">Step 03</div>
            <h3 class="step-title">ACT</h3>
            <p class="step-desc">
              Execute the first action of the highest-value simulated trajectory, completely bypassing local collision traps.
            </p>
          </div>
        </div>
      </section>

      <!-- 3 Simulation Choices Grid -->
      <section>
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
          <h2 style="font-size: 1.4rem; font-weight: 700;">Interactive Simulation Environments</h2>
          <span style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--font-mono);">3 Domains Available</span>
        </div>

        <div class="cards-grid">
          <!-- Card 1: Robotics -->
          <div class="glass-panel sim-card">
            <div class="sim-card-thumb">
              <img src="./results/screenshots/hero_split_screen.png" alt="Warehouse Robotics" onerror="this.src='./results/screenshots/hero_menu.png'" />
              <div class="sim-card-badge">
                <span class="badge badge-live">● LIVE Ready</span>
              </div>
            </div>
            <div class="sim-card-body">
              <h3 class="sim-card-title">Autonomous Warehouse Robotics</h3>
              <div class="sim-card-tagline">"Imagining detour paths before moving"</div>
              <p class="sim-card-desc">
                Predictive obstacle evasion & dynamic pedestrian anticipation. World Model MPC achieves 94% win rate in static U-traps and 97% against moving pedestrians.
              </p>
              <a href="#/sim/robotics" class="btn-launch">
                <span>Launch Robotics Sim</span>
                <span style="font-size: 1.1rem;">&rarr;</span>
              </a>
            </div>
          </div>

          <!-- Card 2: Driving -->
          <div class="glass-panel sim-card">
            <div class="sim-card-thumb">
              <img src="./results/screenshots/hero_menu.png" alt="Highway Driving" />
              <div class="sim-card-badge">
                <span class="badge badge-replay">● Prototype / Replay</span>
              </div>
            </div>
            <div class="sim-card-body">
              <h3 class="sim-card-title">Autonomous Highway Driving</h3>
              <div class="sim-card-tagline">"Predicting lead vehicle braking dynamics"</div>
              <p class="sim-card-desc">
                Continuous lane-centering and traffic speed adaptation. Implements the frozen BaseEnv adapter with modular hooks for teammate expansion.
              </p>
              <a href="#/sim/driving" class="btn-launch">
                <span>Launch Driving Sim</span>
                <span style="font-size: 1.1rem;">&rarr;</span>
              </a>
            </div>
          </div>

          <!-- Card 3: Factory -->
          <div class="glass-panel sim-card">
            <div class="sim-card-thumb">
              <img src="./results/visuals3d/model_sheet_v2.png" alt="Factory Digital Twin" onerror="this.src='./results/screenshots/hero_menu.png'" />
              <div class="sim-card-badge">
                <span class="badge badge-green">● Digital Twin</span>
              </div>
            </div>
            <div class="sim-card-body">
              <h3 class="sim-card-title">Factory-Line Digital Twin</h3>
              <div class="sim-card-tagline">"Predictive maintenance before line stoppage"</div>
              <p class="sim-card-desc">
                A 3-station manufacturing pipeline with stochastic machine wear. The World Model forecasts queue buildup and executes maintenance before failure.
              </p>
              <a href="#/sim/factory" class="btn-launch">
                <span>Launch Factory Sim</span>
                <span style="font-size: 1.1rem;">&rarr;</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  `}/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Ta="182",Vi={ROTATE:0,DOLLY:1,PAN:2},Hi={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Ph=0,rl=1,Lh=2,Ih=0,pr=1,br=2,bs=3,Wn=0,Jt=1,At=2,Hn=0,Wi=1,ws=2,ol=3,al=4,Dh=5,gi=100,Nh=101,Uh=102,Fh=103,Oh=104,Bh=200,kh=201,zh=202,Gh=203,Eo=204,Ao=205,Hh=206,Vh=207,Wh=208,Xh=209,Yh=210,jh=211,qh=212,Kh=213,$h=214,Ro=0,Co=1,Po=2,qi=3,Lo=4,Io=5,Do=6,No=7,Cc=0,Zh=1,Jh=2,Tn=0,Pc=1,Lc=2,Ic=3,Pr=4,Dc=5,Nc=6,Uc=7,ll="attached",Qh="detached",Fc=300,Mi=301,Ki=302,Uo=303,Fo=304,Lr=306,$i=1e3,ln=1001,Mr=1002,It=1003,Oc=1004,Ms=1005,Dt=1006,mr=1007,zn=1008,sn=1009,Bc=1010,kc=1011,Cs=1012,Ea=1013,Rn=1014,cn=1015,Xn=1016,Aa=1017,Ra=1018,Ps=1020,zc=35902,Gc=35899,Hc=1021,Vc=1022,hn=1023,Yn=1026,vi=1027,Ca=1028,Pa=1029,Zi=1030,La=1031,Ia=1033,gr=33776,_r=33777,xr=33778,vr=33779,Oo=35840,Bo=35841,ko=35842,zo=35843,Go=36196,Ho=37492,Vo=37496,Wo=37488,Xo=37489,Yo=37490,jo=37491,qo=37808,Ko=37809,$o=37810,Zo=37811,Jo=37812,Qo=37813,ea=37814,ta=37815,na=37816,ia=37817,sa=37818,ra=37819,oa=37820,aa=37821,la=36492,ca=36494,ha=36495,da=36283,ua=36284,fa=36285,pa=36286,Ls=2300,Is=2301,Or=2302,cl=2400,hl=2401,dl=2402,ed=2500,td=0,Wc=1,ma=2,nd=3200,Xc=0,id=1,ii="",Bt="srgb",Xt="srgb-linear",Sr="linear",dt="srgb",Ei=7680,ul=519,sd=512,rd=513,od=514,Da=515,ad=516,ld=517,Na=518,cd=519,ga=35044,fl="300 es",wn=2e3,wr=2001;function Yc(r){for(let e=r.length-1;e>=0;--e)if(r[e]>=65535)return!0;return!1}function hd(r){return ArrayBuffer.isView(r)&&!(r instanceof DataView)}function Ds(r){return document.createElementNS("http://www.w3.org/1999/xhtml",r)}function dd(){const r=Ds("canvas");return r.style.display="block",r}const pl={};function Tr(...r){const e="THREE."+r.shift();console.log(e,...r)}function Ie(...r){const e="THREE."+r.shift();console.warn(e,...r)}function ze(...r){const e="THREE."+r.shift();console.error(e,...r)}function Ns(...r){const e=r.join(" ");e in pl||(pl[e]=!0,Ie(...r))}function ud(r,e,t){return new Promise(function(n,i){function s(){switch(r.clientWaitSync(e,r.SYNC_FLUSH_COMMANDS_BIT,0)){case r.WAIT_FAILED:i();break;case r.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:n()}}setTimeout(s,t)})}class Si{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const i=n[e];if(i!==void 0){const s=i.indexOf(t);s!==-1&&i.splice(s,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const i=n.slice(0);for(let s=0,o=i.length;s<o;s++)i[s].call(this,e);e.target=null}}}const zt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let ml=1234567;const Ts=Math.PI/180,Ji=180/Math.PI;function _n(){const r=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(zt[r&255]+zt[r>>8&255]+zt[r>>16&255]+zt[r>>24&255]+"-"+zt[e&255]+zt[e>>8&255]+"-"+zt[e>>16&15|64]+zt[e>>24&255]+"-"+zt[t&63|128]+zt[t>>8&255]+"-"+zt[t>>16&255]+zt[t>>24&255]+zt[n&255]+zt[n>>8&255]+zt[n>>16&255]+zt[n>>24&255]).toLowerCase()}function Ke(r,e,t){return Math.max(e,Math.min(t,r))}function Ua(r,e){return(r%e+e)%e}function fd(r,e,t,n,i){return n+(r-e)*(i-n)/(t-e)}function pd(r,e,t){return r!==e?(t-r)/(e-r):0}function Es(r,e,t){return(1-t)*r+t*e}function md(r,e,t,n){return Es(r,e,1-Math.exp(-t*n))}function gd(r,e=1){return e-Math.abs(Ua(r,e*2)-e)}function _d(r,e,t){return r<=e?0:r>=t?1:(r=(r-e)/(t-e),r*r*(3-2*r))}function xd(r,e,t){return r<=e?0:r>=t?1:(r=(r-e)/(t-e),r*r*r*(r*(r*6-15)+10))}function vd(r,e){return r+Math.floor(Math.random()*(e-r+1))}function yd(r,e){return r+Math.random()*(e-r)}function bd(r){return r*(.5-Math.random())}function Md(r){r!==void 0&&(ml=r);let e=ml+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Sd(r){return r*Ts}function wd(r){return r*Ji}function Td(r){return(r&r-1)===0&&r!==0}function Ed(r){return Math.pow(2,Math.ceil(Math.log(r)/Math.LN2))}function Ad(r){return Math.pow(2,Math.floor(Math.log(r)/Math.LN2))}function Rd(r,e,t,n,i){const s=Math.cos,o=Math.sin,a=s(t/2),c=o(t/2),l=s((e+n)/2),h=o((e+n)/2),d=s((e-n)/2),u=o((e-n)/2),f=s((n-e)/2),m=o((n-e)/2);switch(i){case"XYX":r.set(a*h,c*d,c*u,a*l);break;case"YZY":r.set(c*u,a*h,c*d,a*l);break;case"ZXZ":r.set(c*d,c*u,a*h,a*l);break;case"XZX":r.set(a*h,c*m,c*f,a*l);break;case"YXY":r.set(c*f,a*h,c*m,a*l);break;case"ZYZ":r.set(c*m,c*f,a*h,a*l);break;default:Ie("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function mn(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return r/4294967295;case Uint16Array:return r/65535;case Uint8Array:return r/255;case Int32Array:return Math.max(r/2147483647,-1);case Int16Array:return Math.max(r/32767,-1);case Int8Array:return Math.max(r/127,-1);default:throw new Error("Invalid component type.")}}function ut(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return Math.round(r*4294967295);case Uint16Array:return Math.round(r*65535);case Uint8Array:return Math.round(r*255);case Int32Array:return Math.round(r*2147483647);case Int16Array:return Math.round(r*32767);case Int8Array:return Math.round(r*127);default:throw new Error("Invalid component type.")}}const Et={DEG2RAD:Ts,RAD2DEG:Ji,generateUUID:_n,clamp:Ke,euclideanModulo:Ua,mapLinear:fd,inverseLerp:pd,lerp:Es,damp:md,pingpong:gd,smoothstep:_d,smootherstep:xd,randInt:vd,randFloat:yd,randFloatSpread:bd,seededRandom:Md,degToRad:Sd,radToDeg:wd,isPowerOfTwo:Td,ceilPowerOfTwo:Ed,floorPowerOfTwo:Ad,setQuaternionFromProperEuler:Rd,normalize:ut,denormalize:mn};class Le{constructor(e=0,t=0){Le.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Ke(this.x,e.x,t.x),this.y=Ke(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Ke(this.x,e,t),this.y=Ke(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Ke(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Ke(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),i=Math.sin(t),s=this.x-e.x,o=this.y-e.y;return this.x=s*n-o*i+e.x,this.y=s*i+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class xn{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,s,o,a){let c=n[i+0],l=n[i+1],h=n[i+2],d=n[i+3],u=s[o+0],f=s[o+1],m=s[o+2],_=s[o+3];if(a<=0){e[t+0]=c,e[t+1]=l,e[t+2]=h,e[t+3]=d;return}if(a>=1){e[t+0]=u,e[t+1]=f,e[t+2]=m,e[t+3]=_;return}if(d!==_||c!==u||l!==f||h!==m){let g=c*u+l*f+h*m+d*_;g<0&&(u=-u,f=-f,m=-m,_=-_,g=-g);let p=1-a;if(g<.9995){const x=Math.acos(g),S=Math.sin(x);p=Math.sin(p*x)/S,a=Math.sin(a*x)/S,c=c*p+u*a,l=l*p+f*a,h=h*p+m*a,d=d*p+_*a}else{c=c*p+u*a,l=l*p+f*a,h=h*p+m*a,d=d*p+_*a;const x=1/Math.sqrt(c*c+l*l+h*h+d*d);c*=x,l*=x,h*=x,d*=x}}e[t]=c,e[t+1]=l,e[t+2]=h,e[t+3]=d}static multiplyQuaternionsFlat(e,t,n,i,s,o){const a=n[i],c=n[i+1],l=n[i+2],h=n[i+3],d=s[o],u=s[o+1],f=s[o+2],m=s[o+3];return e[t]=a*m+h*d+c*f-l*u,e[t+1]=c*m+h*u+l*d-a*f,e[t+2]=l*m+h*f+a*u-c*d,e[t+3]=h*m-a*d-c*u-l*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,i=e._y,s=e._z,o=e._order,a=Math.cos,c=Math.sin,l=a(n/2),h=a(i/2),d=a(s/2),u=c(n/2),f=c(i/2),m=c(s/2);switch(o){case"XYZ":this._x=u*h*d+l*f*m,this._y=l*f*d-u*h*m,this._z=l*h*m+u*f*d,this._w=l*h*d-u*f*m;break;case"YXZ":this._x=u*h*d+l*f*m,this._y=l*f*d-u*h*m,this._z=l*h*m-u*f*d,this._w=l*h*d+u*f*m;break;case"ZXY":this._x=u*h*d-l*f*m,this._y=l*f*d+u*h*m,this._z=l*h*m+u*f*d,this._w=l*h*d-u*f*m;break;case"ZYX":this._x=u*h*d-l*f*m,this._y=l*f*d+u*h*m,this._z=l*h*m-u*f*d,this._w=l*h*d+u*f*m;break;case"YZX":this._x=u*h*d+l*f*m,this._y=l*f*d+u*h*m,this._z=l*h*m-u*f*d,this._w=l*h*d-u*f*m;break;case"XZY":this._x=u*h*d-l*f*m,this._y=l*f*d-u*h*m,this._z=l*h*m+u*f*d,this._w=l*h*d+u*f*m;break;default:Ie("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],i=t[4],s=t[8],o=t[1],a=t[5],c=t[9],l=t[2],h=t[6],d=t[10],u=n+a+d;if(u>0){const f=.5/Math.sqrt(u+1);this._w=.25/f,this._x=(h-c)*f,this._y=(s-l)*f,this._z=(o-i)*f}else if(n>a&&n>d){const f=2*Math.sqrt(1+n-a-d);this._w=(h-c)/f,this._x=.25*f,this._y=(i+o)/f,this._z=(s+l)/f}else if(a>d){const f=2*Math.sqrt(1+a-n-d);this._w=(s-l)/f,this._x=(i+o)/f,this._y=.25*f,this._z=(c+h)/f}else{const f=2*Math.sqrt(1+d-n-a);this._w=(o-i)/f,this._x=(s+l)/f,this._y=(c+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ke(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,i=e._y,s=e._z,o=e._w,a=t._x,c=t._y,l=t._z,h=t._w;return this._x=n*h+o*a+i*l-s*c,this._y=i*h+o*c+s*a-n*l,this._z=s*h+o*l+n*c-i*a,this._w=o*h-n*a-i*c-s*l,this._onChangeCallback(),this}slerp(e,t){if(t<=0)return this;if(t>=1)return this.copy(e);let n=e._x,i=e._y,s=e._z,o=e._w,a=this.dot(e);a<0&&(n=-n,i=-i,s=-s,o=-o,a=-a);let c=1-t;if(a<.9995){const l=Math.acos(a),h=Math.sin(l);c=Math.sin(c*l)/h,t=Math.sin(t*l)/h,this._x=this._x*c+n*t,this._y=this._y*c+i*t,this._z=this._z*c+s*t,this._w=this._w*c+o*t,this._onChangeCallback()}else this._x=this._x*c+n*t,this._y=this._y*c+i*t,this._z=this._z*c+s*t,this._w=this._w*c+o*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class I{constructor(e=0,t=0,n=0){I.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(gl.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(gl.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6]*i,this.y=s[1]*t+s[4]*n+s[7]*i,this.z=s[2]*t+s[5]*n+s[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,s=e.elements,o=1/(s[3]*t+s[7]*n+s[11]*i+s[15]);return this.x=(s[0]*t+s[4]*n+s[8]*i+s[12])*o,this.y=(s[1]*t+s[5]*n+s[9]*i+s[13])*o,this.z=(s[2]*t+s[6]*n+s[10]*i+s[14])*o,this}applyQuaternion(e){const t=this.x,n=this.y,i=this.z,s=e.x,o=e.y,a=e.z,c=e.w,l=2*(o*i-a*n),h=2*(a*t-s*i),d=2*(s*n-o*t);return this.x=t+c*l+o*d-a*h,this.y=n+c*h+a*l-s*d,this.z=i+c*d+s*h-o*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*i,this.y=s[1]*t+s[5]*n+s[9]*i,this.z=s[2]*t+s[6]*n+s[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Ke(this.x,e.x,t.x),this.y=Ke(this.y,e.y,t.y),this.z=Ke(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Ke(this.x,e,t),this.y=Ke(this.y,e,t),this.z=Ke(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Ke(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,i=e.y,s=e.z,o=t.x,a=t.y,c=t.z;return this.x=i*c-s*a,this.y=s*o-n*c,this.z=n*a-i*o,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Br.copy(this).projectOnVector(e),this.sub(Br)}reflect(e){return this.sub(Br.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Ke(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Br=new I,gl=new xn;class qe{constructor(e,t,n,i,s,o,a,c,l){qe.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,s,o,a,c,l)}set(e,t,n,i,s,o,a,c,l){const h=this.elements;return h[0]=e,h[1]=i,h[2]=a,h[3]=t,h[4]=s,h[5]=c,h[6]=n,h[7]=o,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,s=this.elements,o=n[0],a=n[3],c=n[6],l=n[1],h=n[4],d=n[7],u=n[2],f=n[5],m=n[8],_=i[0],g=i[3],p=i[6],x=i[1],S=i[4],M=i[7],T=i[2],E=i[5],R=i[8];return s[0]=o*_+a*x+c*T,s[3]=o*g+a*S+c*E,s[6]=o*p+a*M+c*R,s[1]=l*_+h*x+d*T,s[4]=l*g+h*S+d*E,s[7]=l*p+h*M+d*R,s[2]=u*_+f*x+m*T,s[5]=u*g+f*S+m*E,s[8]=u*p+f*M+m*R,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],o=e[4],a=e[5],c=e[6],l=e[7],h=e[8];return t*o*h-t*a*l-n*s*h+n*a*c+i*s*l-i*o*c}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],o=e[4],a=e[5],c=e[6],l=e[7],h=e[8],d=h*o-a*l,u=a*c-h*s,f=l*s-o*c,m=t*d+n*u+i*f;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/m;return e[0]=d*_,e[1]=(i*l-h*n)*_,e[2]=(a*n-i*o)*_,e[3]=u*_,e[4]=(h*t-i*c)*_,e[5]=(i*s-a*t)*_,e[6]=f*_,e[7]=(n*c-l*t)*_,e[8]=(o*t-n*s)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,s,o,a){const c=Math.cos(s),l=Math.sin(s);return this.set(n*c,n*l,-n*(c*o+l*a)+o+e,-i*l,i*c,-i*(-l*o+c*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(kr.makeScale(e,t)),this}rotate(e){return this.premultiply(kr.makeRotation(-e)),this}translate(e,t){return this.premultiply(kr.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const kr=new qe,_l=new qe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),xl=new qe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Cd(){const r={enabled:!0,workingColorSpace:Xt,spaces:{},convert:function(i,s,o){return this.enabled===!1||s===o||!s||!o||(this.spaces[s].transfer===dt&&(i.r=Vn(i.r),i.g=Vn(i.g),i.b=Vn(i.b)),this.spaces[s].primaries!==this.spaces[o].primaries&&(i.applyMatrix3(this.spaces[s].toXYZ),i.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===dt&&(i.r=Xi(i.r),i.g=Xi(i.g),i.b=Xi(i.b))),i},workingToColorSpace:function(i,s){return this.convert(i,this.workingColorSpace,s)},colorSpaceToWorking:function(i,s){return this.convert(i,s,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===ii?Sr:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,s=this.workingColorSpace){return i.fromArray(this.spaces[s].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,s,o){return i.copy(this.spaces[s].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(i,s){return Ns("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),r.workingToColorSpace(i,s)},toWorkingColorSpace:function(i,s){return Ns("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),r.colorSpaceToWorking(i,s)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return r.define({[Xt]:{primaries:e,whitePoint:n,transfer:Sr,toXYZ:_l,fromXYZ:xl,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Bt},outputColorSpaceConfig:{drawingBufferColorSpace:Bt}},[Bt]:{primaries:e,whitePoint:n,transfer:dt,toXYZ:_l,fromXYZ:xl,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Bt}}}),r}const nt=Cd();function Vn(r){return r<.04045?r*.0773993808:Math.pow(r*.9478672986+.0521327014,2.4)}function Xi(r){return r<.0031308?r*12.92:1.055*Math.pow(r,.41666)-.055}let Ai;class Pd{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Ai===void 0&&(Ai=Ds("canvas")),Ai.width=e.width,Ai.height=e.height;const i=Ai.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=Ai}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Ds("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const i=n.getImageData(0,0,e.width,e.height),s=i.data;for(let o=0;o<s.length;o++)s[o]=Vn(s[o]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Vn(t[n]/255)*255):t[n]=Vn(t[n]);return{data:t,width:e.width,height:e.height}}else return Ie("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Ld=0;class Fa{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Ld++}),this.uuid=_n(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let s;if(Array.isArray(i)){s=[];for(let o=0,a=i.length;o<a;o++)i[o].isDataTexture?s.push(zr(i[o].image)):s.push(zr(i[o]))}else s=zr(i);n.url=s}return t||(e.images[this.uuid]=n),n}}function zr(r){return typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&r instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&r instanceof ImageBitmap?Pd.getDataURL(r):r.data?{data:Array.from(r.data),width:r.width,height:r.height,type:r.data.constructor.name}:(Ie("Texture: Unable to serialize Texture."),{})}let Id=0;const Gr=new I;class Nt extends Si{constructor(e=Nt.DEFAULT_IMAGE,t=Nt.DEFAULT_MAPPING,n=ln,i=ln,s=Dt,o=zn,a=hn,c=sn,l=Nt.DEFAULT_ANISOTROPY,h=ii){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Id++}),this.uuid=_n(),this.name="",this.source=new Fa(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=s,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new Le(0,0),this.repeat=new Le(1,1),this.center=new Le(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new qe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Gr).x}get height(){return this.source.getSize(Gr).y}get depth(){return this.source.getSize(Gr).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){Ie(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){Ie(`Texture.setValues(): property '${t}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Fc)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case $i:e.x=e.x-Math.floor(e.x);break;case ln:e.x=e.x<0?0:1;break;case Mr:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case $i:e.y=e.y-Math.floor(e.y);break;case ln:e.y=e.y<0?0:1;break;case Mr:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Nt.DEFAULT_IMAGE=null;Nt.DEFAULT_MAPPING=Fc;Nt.DEFAULT_ANISOTROPY=1;class bt{constructor(e=0,t=0,n=0,i=1){bt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,s=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*i+o[12]*s,this.y=o[1]*t+o[5]*n+o[9]*i+o[13]*s,this.z=o[2]*t+o[6]*n+o[10]*i+o[14]*s,this.w=o[3]*t+o[7]*n+o[11]*i+o[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,s;const c=e.elements,l=c[0],h=c[4],d=c[8],u=c[1],f=c[5],m=c[9],_=c[2],g=c[6],p=c[10];if(Math.abs(h-u)<.01&&Math.abs(d-_)<.01&&Math.abs(m-g)<.01){if(Math.abs(h+u)<.1&&Math.abs(d+_)<.1&&Math.abs(m+g)<.1&&Math.abs(l+f+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const S=(l+1)/2,M=(f+1)/2,T=(p+1)/2,E=(h+u)/4,R=(d+_)/4,D=(m+g)/4;return S>M&&S>T?S<.01?(n=0,i=.707106781,s=.707106781):(n=Math.sqrt(S),i=E/n,s=R/n):M>T?M<.01?(n=.707106781,i=0,s=.707106781):(i=Math.sqrt(M),n=E/i,s=D/i):T<.01?(n=.707106781,i=.707106781,s=0):(s=Math.sqrt(T),n=R/s,i=D/s),this.set(n,i,s,t),this}let x=Math.sqrt((g-m)*(g-m)+(d-_)*(d-_)+(u-h)*(u-h));return Math.abs(x)<.001&&(x=1),this.x=(g-m)/x,this.y=(d-_)/x,this.z=(u-h)/x,this.w=Math.acos((l+f+p-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Ke(this.x,e.x,t.x),this.y=Ke(this.y,e.y,t.y),this.z=Ke(this.z,e.z,t.z),this.w=Ke(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Ke(this.x,e,t),this.y=Ke(this.y,e,t),this.z=Ke(this.z,e,t),this.w=Ke(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Ke(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Dd extends Si{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Dt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new bt(0,0,e,t),this.scissorTest=!1,this.viewport=new bt(0,0,e,t);const i={width:e,height:t,depth:n.depth},s=new Nt(i);this.textures=[];const o=n.count;for(let a=0;a<o;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){const t={minFilter:Dt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let i=0,s=this.textures.length;i<s;i++)this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=n,this.textures[i].isData3DTexture!==!0&&(this.textures[i].isArrayTexture=this.textures[i].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const i=Object.assign({},e.textures[t].image);this.textures[t].source=new Fa(i)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class En extends Dd{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class jc extends Nt{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=It,this.minFilter=It,this.wrapR=ln,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Nd extends Nt{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=It,this.minFilter=It,this.wrapR=ln,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class qn{constructor(e=new I(1/0,1/0,1/0),t=new I(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(dn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(dn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=dn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const s=n.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,dn):dn.fromBufferAttribute(s,o),dn.applyMatrix4(e.matrixWorld),this.expandByPoint(dn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),zs.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),zs.copy(n.boundingBox)),zs.applyMatrix4(e.matrixWorld),this.union(zs)}const i=e.children;for(let s=0,o=i.length;s<o;s++)this.expandByObject(i[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,dn),dn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(hs),Gs.subVectors(this.max,hs),Ri.subVectors(e.a,hs),Ci.subVectors(e.b,hs),Pi.subVectors(e.c,hs),Kn.subVectors(Ci,Ri),$n.subVectors(Pi,Ci),ci.subVectors(Ri,Pi);let t=[0,-Kn.z,Kn.y,0,-$n.z,$n.y,0,-ci.z,ci.y,Kn.z,0,-Kn.x,$n.z,0,-$n.x,ci.z,0,-ci.x,-Kn.y,Kn.x,0,-$n.y,$n.x,0,-ci.y,ci.x,0];return!Hr(t,Ri,Ci,Pi,Gs)||(t=[1,0,0,0,1,0,0,0,1],!Hr(t,Ri,Ci,Pi,Gs))?!1:(Hs.crossVectors(Kn,$n),t=[Hs.x,Hs.y,Hs.z],Hr(t,Ri,Ci,Pi,Gs))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,dn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(dn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Dn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Dn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Dn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Dn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Dn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Dn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Dn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Dn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Dn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Dn=[new I,new I,new I,new I,new I,new I,new I,new I],dn=new I,zs=new qn,Ri=new I,Ci=new I,Pi=new I,Kn=new I,$n=new I,ci=new I,hs=new I,Gs=new I,Hs=new I,hi=new I;function Hr(r,e,t,n,i){for(let s=0,o=r.length-3;s<=o;s+=3){hi.fromArray(r,s);const a=i.x*Math.abs(hi.x)+i.y*Math.abs(hi.y)+i.z*Math.abs(hi.z),c=e.dot(hi),l=t.dot(hi),h=n.dot(hi);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>a)return!1}return!0}const Ud=new qn,ds=new I,Vr=new I;class Ln{constructor(e=new I,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):Ud.setFromPoints(e).getCenter(n);let i=0;for(let s=0,o=e.length;s<o;s++)i=Math.max(i,n.distanceToSquared(e[s]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ds.subVectors(e,this.center);const t=ds.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(ds,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Vr.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ds.copy(e.center).add(Vr)),this.expandByPoint(ds.copy(e.center).sub(Vr))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const Nn=new I,Wr=new I,Vs=new I,Zn=new I,Xr=new I,Ws=new I,Yr=new I;class is{constructor(e=new I,t=new I(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Nn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Nn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Nn.copy(this.origin).addScaledVector(this.direction,t),Nn.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){Wr.copy(e).add(t).multiplyScalar(.5),Vs.copy(t).sub(e).normalize(),Zn.copy(this.origin).sub(Wr);const s=e.distanceTo(t)*.5,o=-this.direction.dot(Vs),a=Zn.dot(this.direction),c=-Zn.dot(Vs),l=Zn.lengthSq(),h=Math.abs(1-o*o);let d,u,f,m;if(h>0)if(d=o*c-a,u=o*a-c,m=s*h,d>=0)if(u>=-m)if(u<=m){const _=1/h;d*=_,u*=_,f=d*(d+o*u+2*a)+u*(o*d+u+2*c)+l}else u=s,d=Math.max(0,-(o*u+a)),f=-d*d+u*(u+2*c)+l;else u=-s,d=Math.max(0,-(o*u+a)),f=-d*d+u*(u+2*c)+l;else u<=-m?(d=Math.max(0,-(-o*s+a)),u=d>0?-s:Math.min(Math.max(-s,-c),s),f=-d*d+u*(u+2*c)+l):u<=m?(d=0,u=Math.min(Math.max(-s,-c),s),f=u*(u+2*c)+l):(d=Math.max(0,-(o*s+a)),u=d>0?s:Math.min(Math.max(-s,-c),s),f=-d*d+u*(u+2*c)+l);else u=o>0?-s:s,d=Math.max(0,-(o*u+a)),f=-d*d+u*(u+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,d),i&&i.copy(Wr).addScaledVector(Vs,u),f}intersectSphere(e,t){Nn.subVectors(e.center,this.origin);const n=Nn.dot(this.direction),i=Nn.dot(Nn)-n*n,s=e.radius*e.radius;if(i>s)return null;const o=Math.sqrt(s-i),a=n-o,c=n+o;return c<0?null:a<0?this.at(c,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,s,o,a,c;const l=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return l>=0?(n=(e.min.x-u.x)*l,i=(e.max.x-u.x)*l):(n=(e.max.x-u.x)*l,i=(e.min.x-u.x)*l),h>=0?(s=(e.min.y-u.y)*h,o=(e.max.y-u.y)*h):(s=(e.max.y-u.y)*h,o=(e.min.y-u.y)*h),n>o||s>i||((s>n||isNaN(n))&&(n=s),(o<i||isNaN(i))&&(i=o),d>=0?(a=(e.min.z-u.z)*d,c=(e.max.z-u.z)*d):(a=(e.max.z-u.z)*d,c=(e.min.z-u.z)*d),n>c||a>i)||((a>n||n!==n)&&(n=a),(c<i||i!==i)&&(i=c),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,Nn)!==null}intersectTriangle(e,t,n,i,s){Xr.subVectors(t,e),Ws.subVectors(n,e),Yr.crossVectors(Xr,Ws);let o=this.direction.dot(Yr),a;if(o>0){if(i)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Zn.subVectors(this.origin,e);const c=a*this.direction.dot(Ws.crossVectors(Zn,Ws));if(c<0)return null;const l=a*this.direction.dot(Xr.cross(Zn));if(l<0||c+l>o)return null;const h=-a*Zn.dot(Yr);return h<0?null:this.at(h/o,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class je{constructor(e,t,n,i,s,o,a,c,l,h,d,u,f,m,_,g){je.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,s,o,a,c,l,h,d,u,f,m,_,g)}set(e,t,n,i,s,o,a,c,l,h,d,u,f,m,_,g){const p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=i,p[1]=s,p[5]=o,p[9]=a,p[13]=c,p[2]=l,p[6]=h,p[10]=d,p[14]=u,p[3]=f,p[7]=m,p[11]=_,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new je().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinant()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinant()===0)return this.identity();const t=this.elements,n=e.elements,i=1/Li.setFromMatrixColumn(e,0).length(),s=1/Li.setFromMatrixColumn(e,1).length(),o=1/Li.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*s,t[5]=n[5]*s,t[6]=n[6]*s,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,i=e.y,s=e.z,o=Math.cos(n),a=Math.sin(n),c=Math.cos(i),l=Math.sin(i),h=Math.cos(s),d=Math.sin(s);if(e.order==="XYZ"){const u=o*h,f=o*d,m=a*h,_=a*d;t[0]=c*h,t[4]=-c*d,t[8]=l,t[1]=f+m*l,t[5]=u-_*l,t[9]=-a*c,t[2]=_-u*l,t[6]=m+f*l,t[10]=o*c}else if(e.order==="YXZ"){const u=c*h,f=c*d,m=l*h,_=l*d;t[0]=u+_*a,t[4]=m*a-f,t[8]=o*l,t[1]=o*d,t[5]=o*h,t[9]=-a,t[2]=f*a-m,t[6]=_+u*a,t[10]=o*c}else if(e.order==="ZXY"){const u=c*h,f=c*d,m=l*h,_=l*d;t[0]=u-_*a,t[4]=-o*d,t[8]=m+f*a,t[1]=f+m*a,t[5]=o*h,t[9]=_-u*a,t[2]=-o*l,t[6]=a,t[10]=o*c}else if(e.order==="ZYX"){const u=o*h,f=o*d,m=a*h,_=a*d;t[0]=c*h,t[4]=m*l-f,t[8]=u*l+_,t[1]=c*d,t[5]=_*l+u,t[9]=f*l-m,t[2]=-l,t[6]=a*c,t[10]=o*c}else if(e.order==="YZX"){const u=o*c,f=o*l,m=a*c,_=a*l;t[0]=c*h,t[4]=_-u*d,t[8]=m*d+f,t[1]=d,t[5]=o*h,t[9]=-a*h,t[2]=-l*h,t[6]=f*d+m,t[10]=u-_*d}else if(e.order==="XZY"){const u=o*c,f=o*l,m=a*c,_=a*l;t[0]=c*h,t[4]=-d,t[8]=l*h,t[1]=u*d+_,t[5]=o*h,t[9]=f*d-m,t[2]=m*d-f,t[6]=a*h,t[10]=_*d+u}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Fd,e,Od)}lookAt(e,t,n){const i=this.elements;return tn.subVectors(e,t),tn.lengthSq()===0&&(tn.z=1),tn.normalize(),Jn.crossVectors(n,tn),Jn.lengthSq()===0&&(Math.abs(n.z)===1?tn.x+=1e-4:tn.z+=1e-4,tn.normalize(),Jn.crossVectors(n,tn)),Jn.normalize(),Xs.crossVectors(tn,Jn),i[0]=Jn.x,i[4]=Xs.x,i[8]=tn.x,i[1]=Jn.y,i[5]=Xs.y,i[9]=tn.y,i[2]=Jn.z,i[6]=Xs.z,i[10]=tn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,s=this.elements,o=n[0],a=n[4],c=n[8],l=n[12],h=n[1],d=n[5],u=n[9],f=n[13],m=n[2],_=n[6],g=n[10],p=n[14],x=n[3],S=n[7],M=n[11],T=n[15],E=i[0],R=i[4],D=i[8],y=i[12],b=i[1],L=i[5],k=i[9],z=i[13],j=i[2],q=i[6],O=i[10],H=i[14],se=i[3],xe=i[7],ue=i[11],be=i[15];return s[0]=o*E+a*b+c*j+l*se,s[4]=o*R+a*L+c*q+l*xe,s[8]=o*D+a*k+c*O+l*ue,s[12]=o*y+a*z+c*H+l*be,s[1]=h*E+d*b+u*j+f*se,s[5]=h*R+d*L+u*q+f*xe,s[9]=h*D+d*k+u*O+f*ue,s[13]=h*y+d*z+u*H+f*be,s[2]=m*E+_*b+g*j+p*se,s[6]=m*R+_*L+g*q+p*xe,s[10]=m*D+_*k+g*O+p*ue,s[14]=m*y+_*z+g*H+p*be,s[3]=x*E+S*b+M*j+T*se,s[7]=x*R+S*L+M*q+T*xe,s[11]=x*D+S*k+M*O+T*ue,s[15]=x*y+S*z+M*H+T*be,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],i=e[8],s=e[12],o=e[1],a=e[5],c=e[9],l=e[13],h=e[2],d=e[6],u=e[10],f=e[14],m=e[3],_=e[7],g=e[11],p=e[15],x=c*f-l*u,S=a*f-l*d,M=a*u-c*d,T=o*f-l*h,E=o*u-c*h,R=o*d-a*h;return t*(_*x-g*S+p*M)-n*(m*x-g*T+p*E)+i*(m*S-_*T+p*R)-s*(m*M-_*E+g*R)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],o=e[4],a=e[5],c=e[6],l=e[7],h=e[8],d=e[9],u=e[10],f=e[11],m=e[12],_=e[13],g=e[14],p=e[15],x=d*g*l-_*u*l+_*c*f-a*g*f-d*c*p+a*u*p,S=m*u*l-h*g*l-m*c*f+o*g*f+h*c*p-o*u*p,M=h*_*l-m*d*l+m*a*f-o*_*f-h*a*p+o*d*p,T=m*d*c-h*_*c-m*a*u+o*_*u+h*a*g-o*d*g,E=t*x+n*S+i*M+s*T;if(E===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const R=1/E;return e[0]=x*R,e[1]=(_*u*s-d*g*s-_*i*f+n*g*f+d*i*p-n*u*p)*R,e[2]=(a*g*s-_*c*s+_*i*l-n*g*l-a*i*p+n*c*p)*R,e[3]=(d*c*s-a*u*s-d*i*l+n*u*l+a*i*f-n*c*f)*R,e[4]=S*R,e[5]=(h*g*s-m*u*s+m*i*f-t*g*f-h*i*p+t*u*p)*R,e[6]=(m*c*s-o*g*s-m*i*l+t*g*l+o*i*p-t*c*p)*R,e[7]=(o*u*s-h*c*s+h*i*l-t*u*l-o*i*f+t*c*f)*R,e[8]=M*R,e[9]=(m*d*s-h*_*s-m*n*f+t*_*f+h*n*p-t*d*p)*R,e[10]=(o*_*s-m*a*s+m*n*l-t*_*l-o*n*p+t*a*p)*R,e[11]=(h*a*s-o*d*s-h*n*l+t*d*l+o*n*f-t*a*f)*R,e[12]=T*R,e[13]=(h*_*i-m*d*i+m*n*u-t*_*u-h*n*g+t*d*g)*R,e[14]=(m*a*i-o*_*i-m*n*c+t*_*c+o*n*g-t*a*g)*R,e[15]=(o*d*i-h*a*i+h*n*c-t*d*c-o*n*u+t*a*u)*R,this}scale(e){const t=this.elements,n=e.x,i=e.y,s=e.z;return t[0]*=n,t[4]*=i,t[8]*=s,t[1]*=n,t[5]*=i,t[9]*=s,t[2]*=n,t[6]*=i,t[10]*=s,t[3]*=n,t[7]*=i,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),i=Math.sin(t),s=1-n,o=e.x,a=e.y,c=e.z,l=s*o,h=s*a;return this.set(l*o+n,l*a-i*c,l*c+i*a,0,l*a+i*c,h*a+n,h*c-i*o,0,l*c-i*a,h*c+i*o,s*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,s,o){return this.set(1,n,s,0,e,1,o,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){const i=this.elements,s=t._x,o=t._y,a=t._z,c=t._w,l=s+s,h=o+o,d=a+a,u=s*l,f=s*h,m=s*d,_=o*h,g=o*d,p=a*d,x=c*l,S=c*h,M=c*d,T=n.x,E=n.y,R=n.z;return i[0]=(1-(_+p))*T,i[1]=(f+M)*T,i[2]=(m-S)*T,i[3]=0,i[4]=(f-M)*E,i[5]=(1-(u+p))*E,i[6]=(g+x)*E,i[7]=0,i[8]=(m+S)*R,i[9]=(g-x)*R,i[10]=(1-(u+_))*R,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){const i=this.elements;if(e.x=i[12],e.y=i[13],e.z=i[14],this.determinant()===0)return n.set(1,1,1),t.identity(),this;let s=Li.set(i[0],i[1],i[2]).length();const o=Li.set(i[4],i[5],i[6]).length(),a=Li.set(i[8],i[9],i[10]).length();this.determinant()<0&&(s=-s),un.copy(this);const l=1/s,h=1/o,d=1/a;return un.elements[0]*=l,un.elements[1]*=l,un.elements[2]*=l,un.elements[4]*=h,un.elements[5]*=h,un.elements[6]*=h,un.elements[8]*=d,un.elements[9]*=d,un.elements[10]*=d,t.setFromRotationMatrix(un),n.x=s,n.y=o,n.z=a,this}makePerspective(e,t,n,i,s,o,a=wn,c=!1){const l=this.elements,h=2*s/(t-e),d=2*s/(n-i),u=(t+e)/(t-e),f=(n+i)/(n-i);let m,_;if(c)m=s/(o-s),_=o*s/(o-s);else if(a===wn)m=-(o+s)/(o-s),_=-2*o*s/(o-s);else if(a===wr)m=-o/(o-s),_=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=h,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=d,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=m,l[14]=_,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,i,s,o,a=wn,c=!1){const l=this.elements,h=2/(t-e),d=2/(n-i),u=-(t+e)/(t-e),f=-(n+i)/(n-i);let m,_;if(c)m=1/(o-s),_=o/(o-s);else if(a===wn)m=-2/(o-s),_=-(o+s)/(o-s);else if(a===wr)m=-1/(o-s),_=-s/(o-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=h,l[4]=0,l[8]=0,l[12]=u,l[1]=0,l[5]=d,l[9]=0,l[13]=f,l[2]=0,l[6]=0,l[10]=m,l[14]=_,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const Li=new I,un=new je,Fd=new I(0,0,0),Od=new I(1,1,1),Jn=new I,Xs=new I,tn=new I,vl=new je,yl=new xn;class Cn{constructor(e=0,t=0,n=0,i=Cn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const i=e.elements,s=i[0],o=i[4],a=i[8],c=i[1],l=i[5],h=i[9],d=i[2],u=i[6],f=i[10];switch(t){case"XYZ":this._y=Math.asin(Ke(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(u,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Ke(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-d,s),this._z=0);break;case"ZXY":this._x=Math.asin(Ke(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,s));break;case"ZYX":this._y=Math.asin(-Ke(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,f),this._z=Math.atan2(c,s)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(Ke(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-d,s)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-Ke(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(u,l),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-h,f),this._y=0);break;default:Ie("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return vl.makeRotationFromQuaternion(e),this.setFromRotationMatrix(vl,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return yl.setFromEuler(this),this.setFromQuaternion(yl,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Cn.DEFAULT_ORDER="XYZ";class Oa{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Bd=0;const bl=new I,Ii=new xn,Un=new je,Ys=new I,us=new I,kd=new I,zd=new xn,Ml=new I(1,0,0),Sl=new I(0,1,0),wl=new I(0,0,1),Tl={type:"added"},Gd={type:"removed"},Di={type:"childadded",child:null},jr={type:"childremoved",child:null};class Mt extends Si{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Bd++}),this.uuid=_n(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Mt.DEFAULT_UP.clone();const e=new I,t=new Cn,n=new xn,i=new I(1,1,1);function s(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(s),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new je},normalMatrix:{value:new qe}}),this.matrix=new je,this.matrixWorld=new je,this.matrixAutoUpdate=Mt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Mt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Oa,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Ii.setFromAxisAngle(e,t),this.quaternion.multiply(Ii),this}rotateOnWorldAxis(e,t){return Ii.setFromAxisAngle(e,t),this.quaternion.premultiply(Ii),this}rotateX(e){return this.rotateOnAxis(Ml,e)}rotateY(e){return this.rotateOnAxis(Sl,e)}rotateZ(e){return this.rotateOnAxis(wl,e)}translateOnAxis(e,t){return bl.copy(e).applyQuaternion(this.quaternion),this.position.add(bl.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Ml,e)}translateY(e){return this.translateOnAxis(Sl,e)}translateZ(e){return this.translateOnAxis(wl,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Un.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Ys.copy(e):Ys.set(e,t,n);const i=this.parent;this.updateWorldMatrix(!0,!1),us.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Un.lookAt(us,Ys,this.up):Un.lookAt(Ys,us,this.up),this.quaternion.setFromRotationMatrix(Un),i&&(Un.extractRotation(i.matrixWorld),Ii.setFromRotationMatrix(Un),this.quaternion.premultiply(Ii.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(ze("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Tl),Di.child=e,this.dispatchEvent(Di),Di.child=null):ze("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Gd),jr.child=e,this.dispatchEvent(jr),jr.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Un.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Un.multiply(e.parent.matrixWorld)),e.applyMatrix4(Un),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Tl),Di.child=e,this.dispatchEvent(Di),Di.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){const o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const i=this.children;for(let s=0,o=i.length;s<o;s++)i[s].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(us,e,kd),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(us,zd,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const i=this.children;for(let s=0,o=i.length;s<o;s++)i[s].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(a=>({...a})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(e),i.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function s(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=s(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const c=a.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const d=c[l];s(e.shapes,d)}else s(e.shapes,c)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(s(e.materials,this.material[c]));i.material=a}else i.material=s(e.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){const c=this.animations[a];i.animations.push(s(e.animations,c))}}if(t){const a=o(e.geometries),c=o(e.materials),l=o(e.textures),h=o(e.images),d=o(e.shapes),u=o(e.skeletons),f=o(e.animations),m=o(e.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),u.length>0&&(n.skeletons=u),f.length>0&&(n.animations=f),m.length>0&&(n.nodes=m)}return n.object=i,n;function o(a){const c=[];for(const l in a){const h=a[l];delete h.metadata,c.push(h)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const i=e.children[n];this.add(i.clone())}return this}}Mt.DEFAULT_UP=new I(0,1,0);Mt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Mt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const fn=new I,Fn=new I,qr=new I,On=new I,Ni=new I,Ui=new I,El=new I,Kr=new I,$r=new I,Zr=new I,Jr=new bt,Qr=new bt,eo=new bt;class gn{constructor(e=new I,t=new I,n=new I){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),fn.subVectors(e,t),i.cross(fn);const s=i.lengthSq();return s>0?i.multiplyScalar(1/Math.sqrt(s)):i.set(0,0,0)}static getBarycoord(e,t,n,i,s){fn.subVectors(i,t),Fn.subVectors(n,t),qr.subVectors(e,t);const o=fn.dot(fn),a=fn.dot(Fn),c=fn.dot(qr),l=Fn.dot(Fn),h=Fn.dot(qr),d=o*l-a*a;if(d===0)return s.set(0,0,0),null;const u=1/d,f=(l*c-a*h)*u,m=(o*h-a*c)*u;return s.set(1-f-m,m,f)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,On)===null?!1:On.x>=0&&On.y>=0&&On.x+On.y<=1}static getInterpolation(e,t,n,i,s,o,a,c){return this.getBarycoord(e,t,n,i,On)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(s,On.x),c.addScaledVector(o,On.y),c.addScaledVector(a,On.z),c)}static getInterpolatedAttribute(e,t,n,i,s,o){return Jr.setScalar(0),Qr.setScalar(0),eo.setScalar(0),Jr.fromBufferAttribute(e,t),Qr.fromBufferAttribute(e,n),eo.fromBufferAttribute(e,i),o.setScalar(0),o.addScaledVector(Jr,s.x),o.addScaledVector(Qr,s.y),o.addScaledVector(eo,s.z),o}static isFrontFacing(e,t,n,i){return fn.subVectors(n,t),Fn.subVectors(e,t),fn.cross(Fn).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return fn.subVectors(this.c,this.b),Fn.subVectors(this.a,this.b),fn.cross(Fn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return gn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return gn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,s){return gn.getInterpolation(e,this.a,this.b,this.c,t,n,i,s)}containsPoint(e){return gn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return gn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,i=this.b,s=this.c;let o,a;Ni.subVectors(i,n),Ui.subVectors(s,n),Kr.subVectors(e,n);const c=Ni.dot(Kr),l=Ui.dot(Kr);if(c<=0&&l<=0)return t.copy(n);$r.subVectors(e,i);const h=Ni.dot($r),d=Ui.dot($r);if(h>=0&&d<=h)return t.copy(i);const u=c*d-h*l;if(u<=0&&c>=0&&h<=0)return o=c/(c-h),t.copy(n).addScaledVector(Ni,o);Zr.subVectors(e,s);const f=Ni.dot(Zr),m=Ui.dot(Zr);if(m>=0&&f<=m)return t.copy(s);const _=f*l-c*m;if(_<=0&&l>=0&&m<=0)return a=l/(l-m),t.copy(n).addScaledVector(Ui,a);const g=h*m-f*d;if(g<=0&&d-h>=0&&f-m>=0)return El.subVectors(s,i),a=(d-h)/(d-h+(f-m)),t.copy(i).addScaledVector(El,a);const p=1/(g+_+u);return o=_*p,a=u*p,t.copy(n).addScaledVector(Ni,o).addScaledVector(Ui,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const qc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Qn={h:0,s:0,l:0},js={h:0,s:0,l:0};function to(r,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?r+(e-r)*6*t:t<1/2?e:t<2/3?r+(e-r)*6*(2/3-t):r}class Oe{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Bt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,nt.colorSpaceToWorking(this,t),this}setRGB(e,t,n,i=nt.workingColorSpace){return this.r=e,this.g=t,this.b=n,nt.colorSpaceToWorking(this,i),this}setHSL(e,t,n,i=nt.workingColorSpace){if(e=Ua(e,1),t=Ke(t,0,1),n=Ke(n,0,1),t===0)this.r=this.g=this.b=n;else{const s=n<=.5?n*(1+t):n+t-n*t,o=2*n-s;this.r=to(o,s,e+1/3),this.g=to(o,s,e),this.b=to(o,s,e-1/3)}return nt.colorSpaceToWorking(this,i),this}setStyle(e,t=Bt){function n(s){s!==void 0&&parseFloat(s)<1&&Ie("Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const o=i[1],a=i[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:Ie("Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=i[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(s,16),t);Ie("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Bt){const n=qc[e.toLowerCase()];return n!==void 0?this.setHex(n,t):Ie("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Vn(e.r),this.g=Vn(e.g),this.b=Vn(e.b),this}copyLinearToSRGB(e){return this.r=Xi(e.r),this.g=Xi(e.g),this.b=Xi(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Bt){return nt.workingToColorSpace(Gt.copy(this),e),Math.round(Ke(Gt.r*255,0,255))*65536+Math.round(Ke(Gt.g*255,0,255))*256+Math.round(Ke(Gt.b*255,0,255))}getHexString(e=Bt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=nt.workingColorSpace){nt.workingToColorSpace(Gt.copy(this),t);const n=Gt.r,i=Gt.g,s=Gt.b,o=Math.max(n,i,s),a=Math.min(n,i,s);let c,l;const h=(a+o)/2;if(a===o)c=0,l=0;else{const d=o-a;switch(l=h<=.5?d/(o+a):d/(2-o-a),o){case n:c=(i-s)/d+(i<s?6:0);break;case i:c=(s-n)/d+2;break;case s:c=(n-i)/d+4;break}c/=6}return e.h=c,e.s=l,e.l=h,e}getRGB(e,t=nt.workingColorSpace){return nt.workingToColorSpace(Gt.copy(this),t),e.r=Gt.r,e.g=Gt.g,e.b=Gt.b,e}getStyle(e=Bt){nt.workingToColorSpace(Gt.copy(this),e);const t=Gt.r,n=Gt.g,i=Gt.b;return e!==Bt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(Qn),this.setHSL(Qn.h+e,Qn.s+t,Qn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Qn),e.getHSL(js);const n=Es(Qn.h,js.h,t),i=Es(Qn.s,js.s,t),s=Es(Qn.l,js.l,t);return this.setHSL(n,i,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,i=this.b,s=e.elements;return this.r=s[0]*t+s[3]*n+s[6]*i,this.g=s[1]*t+s[4]*n+s[7]*i,this.b=s[2]*t+s[5]*n+s[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Gt=new Oe;Oe.NAMES=qc;let Hd=0;class An extends Si{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Hd++}),this.uuid=_n(),this.name="",this.type="Material",this.blending=Wi,this.side=Wn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Eo,this.blendDst=Ao,this.blendEquation=gi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Oe(0,0,0),this.blendAlpha=0,this.depthFunc=qi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=ul,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ei,this.stencilZFail=Ei,this.stencilZPass=Ei,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){Ie(`Material: parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){Ie(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Wi&&(n.blending=this.blending),this.side!==Wn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Eo&&(n.blendSrc=this.blendSrc),this.blendDst!==Ao&&(n.blendDst=this.blendDst),this.blendEquation!==gi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==qi&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==ul&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ei&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Ei&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Ei&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.allowOverride===!1&&(n.allowOverride=!1),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(s){const o=[];for(const a in s){const c=s[a];delete c.metadata,o.push(c)}return o}if(t){const s=i(e.textures),o=i(e.images);s.length>0&&(n.textures=s),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const i=t.length;n=new Array(i);for(let s=0;s!==i;++s)n[s]=t[s].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class gt extends An{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Oe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Cn,this.combine=Cc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Pt=new I,qs=new Le;let Vd=0;class Rt{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Vd++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=ga,this.updateRanges=[],this.gpuType=cn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,s=this.itemSize;i<s;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)qs.fromBufferAttribute(this,t),qs.applyMatrix3(e),this.setXY(t,qs.x,qs.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Pt.fromBufferAttribute(this,t),Pt.applyMatrix3(e),this.setXYZ(t,Pt.x,Pt.y,Pt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Pt.fromBufferAttribute(this,t),Pt.applyMatrix4(e),this.setXYZ(t,Pt.x,Pt.y,Pt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Pt.fromBufferAttribute(this,t),Pt.applyNormalMatrix(e),this.setXYZ(t,Pt.x,Pt.y,Pt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Pt.fromBufferAttribute(this,t),Pt.transformDirection(e),this.setXYZ(t,Pt.x,Pt.y,Pt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=mn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=ut(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=mn(t,this.array)),t}setX(e,t){return this.normalized&&(t=ut(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=mn(t,this.array)),t}setY(e,t){return this.normalized&&(t=ut(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=mn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=ut(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=mn(t,this.array)),t}setW(e,t){return this.normalized&&(t=ut(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=ut(t,this.array),n=ut(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=ut(t,this.array),n=ut(n,this.array),i=ut(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,s){return e*=this.itemSize,this.normalized&&(t=ut(t,this.array),n=ut(n,this.array),i=ut(i,this.array),s=ut(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==ga&&(e.usage=this.usage),e}}class Kc extends Rt{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class $c extends Rt{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class at extends Rt{constructor(e,t,n){super(new Float32Array(e),t,n)}}let Wd=0;const on=new je,no=new Mt,Fi=new I,nn=new qn,fs=new qn,Ot=new I;class lt extends Si{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Wd++}),this.uuid=_n(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Yc(e)?$c:Kc)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const s=new qe().getNormalMatrix(e);n.applyNormalMatrix(s),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return on.makeRotationFromQuaternion(e),this.applyMatrix4(on),this}rotateX(e){return on.makeRotationX(e),this.applyMatrix4(on),this}rotateY(e){return on.makeRotationY(e),this.applyMatrix4(on),this}rotateZ(e){return on.makeRotationZ(e),this.applyMatrix4(on),this}translate(e,t,n){return on.makeTranslation(e,t,n),this.applyMatrix4(on),this}scale(e,t,n){return on.makeScale(e,t,n),this.applyMatrix4(on),this}lookAt(e){return no.lookAt(e),no.updateMatrix(),this.applyMatrix4(no.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Fi).negate(),this.translate(Fi.x,Fi.y,Fi.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let i=0,s=e.length;i<s;i++){const o=e[i];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new at(n,3))}else{const n=Math.min(e.length,t.count);for(let i=0;i<n;i++){const s=e[i];t.setXYZ(i,s.x,s.y,s.z||0)}e.length>t.count&&Ie("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new qn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){ze("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new I(-1/0,-1/0,-1/0),new I(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){const s=t[n];nn.setFromBufferAttribute(s),this.morphTargetsRelative?(Ot.addVectors(this.boundingBox.min,nn.min),this.boundingBox.expandByPoint(Ot),Ot.addVectors(this.boundingBox.max,nn.max),this.boundingBox.expandByPoint(Ot)):(this.boundingBox.expandByPoint(nn.min),this.boundingBox.expandByPoint(nn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&ze('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ln);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){ze("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new I,1/0);return}if(e){const n=this.boundingSphere.center;if(nn.setFromBufferAttribute(e),t)for(let s=0,o=t.length;s<o;s++){const a=t[s];fs.setFromBufferAttribute(a),this.morphTargetsRelative?(Ot.addVectors(nn.min,fs.min),nn.expandByPoint(Ot),Ot.addVectors(nn.max,fs.max),nn.expandByPoint(Ot)):(nn.expandByPoint(fs.min),nn.expandByPoint(fs.max))}nn.getCenter(n);let i=0;for(let s=0,o=e.count;s<o;s++)Ot.fromBufferAttribute(e,s),i=Math.max(i,n.distanceToSquared(Ot));if(t)for(let s=0,o=t.length;s<o;s++){const a=t[s],c=this.morphTargetsRelative;for(let l=0,h=a.count;l<h;l++)Ot.fromBufferAttribute(a,l),c&&(Fi.fromBufferAttribute(e,l),Ot.add(Fi)),i=Math.max(i,n.distanceToSquared(Ot))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&ze('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){ze("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,i=t.normal,s=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Rt(new Float32Array(4*n.count),4));const o=this.getAttribute("tangent"),a=[],c=[];for(let D=0;D<n.count;D++)a[D]=new I,c[D]=new I;const l=new I,h=new I,d=new I,u=new Le,f=new Le,m=new Le,_=new I,g=new I;function p(D,y,b){l.fromBufferAttribute(n,D),h.fromBufferAttribute(n,y),d.fromBufferAttribute(n,b),u.fromBufferAttribute(s,D),f.fromBufferAttribute(s,y),m.fromBufferAttribute(s,b),h.sub(l),d.sub(l),f.sub(u),m.sub(u);const L=1/(f.x*m.y-m.x*f.y);isFinite(L)&&(_.copy(h).multiplyScalar(m.y).addScaledVector(d,-f.y).multiplyScalar(L),g.copy(d).multiplyScalar(f.x).addScaledVector(h,-m.x).multiplyScalar(L),a[D].add(_),a[y].add(_),a[b].add(_),c[D].add(g),c[y].add(g),c[b].add(g))}let x=this.groups;x.length===0&&(x=[{start:0,count:e.count}]);for(let D=0,y=x.length;D<y;++D){const b=x[D],L=b.start,k=b.count;for(let z=L,j=L+k;z<j;z+=3)p(e.getX(z+0),e.getX(z+1),e.getX(z+2))}const S=new I,M=new I,T=new I,E=new I;function R(D){T.fromBufferAttribute(i,D),E.copy(T);const y=a[D];S.copy(y),S.sub(T.multiplyScalar(T.dot(y))).normalize(),M.crossVectors(E,y);const L=M.dot(c[D])<0?-1:1;o.setXYZW(D,S.x,S.y,S.z,L)}for(let D=0,y=x.length;D<y;++D){const b=x[D],L=b.start,k=b.count;for(let z=L,j=L+k;z<j;z+=3)R(e.getX(z+0)),R(e.getX(z+1)),R(e.getX(z+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Rt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let u=0,f=n.count;u<f;u++)n.setXYZ(u,0,0,0);const i=new I,s=new I,o=new I,a=new I,c=new I,l=new I,h=new I,d=new I;if(e)for(let u=0,f=e.count;u<f;u+=3){const m=e.getX(u+0),_=e.getX(u+1),g=e.getX(u+2);i.fromBufferAttribute(t,m),s.fromBufferAttribute(t,_),o.fromBufferAttribute(t,g),h.subVectors(o,s),d.subVectors(i,s),h.cross(d),a.fromBufferAttribute(n,m),c.fromBufferAttribute(n,_),l.fromBufferAttribute(n,g),a.add(h),c.add(h),l.add(h),n.setXYZ(m,a.x,a.y,a.z),n.setXYZ(_,c.x,c.y,c.z),n.setXYZ(g,l.x,l.y,l.z)}else for(let u=0,f=t.count;u<f;u+=3)i.fromBufferAttribute(t,u+0),s.fromBufferAttribute(t,u+1),o.fromBufferAttribute(t,u+2),h.subVectors(o,s),d.subVectors(i,s),h.cross(d),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Ot.fromBufferAttribute(e,t),Ot.normalize(),e.setXYZ(t,Ot.x,Ot.y,Ot.z)}toNonIndexed(){function e(a,c){const l=a.array,h=a.itemSize,d=a.normalized,u=new l.constructor(c.length*h);let f=0,m=0;for(let _=0,g=c.length;_<g;_++){a.isInterleavedBufferAttribute?f=c[_]*a.data.stride+a.offset:f=c[_]*h;for(let p=0;p<h;p++)u[m++]=l[f++]}return new Rt(u,h,d)}if(this.index===null)return Ie("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new lt,n=this.index.array,i=this.attributes;for(const a in i){const c=i[a],l=e(c,n);t.setAttribute(a,l)}const s=this.morphAttributes;for(const a in s){const c=[],l=s[a];for(let h=0,d=l.length;h<d;h++){const u=l[h],f=e(u,n);c.push(f)}t.morphAttributes[a]=c}t.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,c=o.length;a<c;a++){const l=o[a];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const c in n){const l=n[c];e.data.attributes[c]=l.toJSON(e.data)}const i={};let s=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let d=0,u=l.length;d<u;d++){const f=l[d];h.push(f.toJSON(e.data))}h.length>0&&(i[c]=h,s=!0)}s&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const i=e.attributes;for(const l in i){const h=i[l];this.setAttribute(l,h.clone(t))}const s=e.morphAttributes;for(const l in s){const h=[],d=s[l];for(let u=0,f=d.length;u<f;u++)h.push(d[u].clone(t));this.morphAttributes[l]=h}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let l=0,h=o.length;l<h;l++){const d=o[l];this.addGroup(d.start,d.count,d.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Al=new je,di=new is,Ks=new Ln,Rl=new I,$s=new I,Zs=new I,Js=new I,io=new I,Qs=new I,Cl=new I,er=new I;class N extends Mt{constructor(e=new lt,t=new gt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=i.length;s<o;s++){const a=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(e,t){const n=this.geometry,i=n.attributes.position,s=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(i,e);const a=this.morphTargetInfluences;if(s&&a){Qs.set(0,0,0);for(let c=0,l=s.length;c<l;c++){const h=a[c],d=s[c];h!==0&&(io.fromBufferAttribute(d,e),o?Qs.addScaledVector(io,h):Qs.addScaledVector(io.sub(t),h))}t.add(Qs)}return t}raycast(e,t){const n=this.geometry,i=this.material,s=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Ks.copy(n.boundingSphere),Ks.applyMatrix4(s),di.copy(e.ray).recast(e.near),!(Ks.containsPoint(di.origin)===!1&&(di.intersectSphere(Ks,Rl)===null||di.origin.distanceToSquared(Rl)>(e.far-e.near)**2))&&(Al.copy(s).invert(),di.copy(e.ray).applyMatrix4(Al),!(n.boundingBox!==null&&di.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,di)))}_computeIntersections(e,t,n){let i;const s=this.geometry,o=this.material,a=s.index,c=s.attributes.position,l=s.attributes.uv,h=s.attributes.uv1,d=s.attributes.normal,u=s.groups,f=s.drawRange;if(a!==null)if(Array.isArray(o))for(let m=0,_=u.length;m<_;m++){const g=u[m],p=o[g.materialIndex],x=Math.max(g.start,f.start),S=Math.min(a.count,Math.min(g.start+g.count,f.start+f.count));for(let M=x,T=S;M<T;M+=3){const E=a.getX(M),R=a.getX(M+1),D=a.getX(M+2);i=tr(this,p,e,n,l,h,d,E,R,D),i&&(i.faceIndex=Math.floor(M/3),i.face.materialIndex=g.materialIndex,t.push(i))}}else{const m=Math.max(0,f.start),_=Math.min(a.count,f.start+f.count);for(let g=m,p=_;g<p;g+=3){const x=a.getX(g),S=a.getX(g+1),M=a.getX(g+2);i=tr(this,o,e,n,l,h,d,x,S,M),i&&(i.faceIndex=Math.floor(g/3),t.push(i))}}else if(c!==void 0)if(Array.isArray(o))for(let m=0,_=u.length;m<_;m++){const g=u[m],p=o[g.materialIndex],x=Math.max(g.start,f.start),S=Math.min(c.count,Math.min(g.start+g.count,f.start+f.count));for(let M=x,T=S;M<T;M+=3){const E=M,R=M+1,D=M+2;i=tr(this,p,e,n,l,h,d,E,R,D),i&&(i.faceIndex=Math.floor(M/3),i.face.materialIndex=g.materialIndex,t.push(i))}}else{const m=Math.max(0,f.start),_=Math.min(c.count,f.start+f.count);for(let g=m,p=_;g<p;g+=3){const x=g,S=g+1,M=g+2;i=tr(this,o,e,n,l,h,d,x,S,M),i&&(i.faceIndex=Math.floor(g/3),t.push(i))}}}}function Xd(r,e,t,n,i,s,o,a){let c;if(e.side===Jt?c=n.intersectTriangle(o,s,i,!0,a):c=n.intersectTriangle(i,s,o,e.side===Wn,a),c===null)return null;er.copy(a),er.applyMatrix4(r.matrixWorld);const l=t.ray.origin.distanceTo(er);return l<t.near||l>t.far?null:{distance:l,point:er.clone(),object:r}}function tr(r,e,t,n,i,s,o,a,c,l){r.getVertexPosition(a,$s),r.getVertexPosition(c,Zs),r.getVertexPosition(l,Js);const h=Xd(r,e,t,n,$s,Zs,Js,Cl);if(h){const d=new I;gn.getBarycoord(Cl,$s,Zs,Js,d),i&&(h.uv=gn.getInterpolatedAttribute(i,a,c,l,d,new Le)),s&&(h.uv1=gn.getInterpolatedAttribute(s,a,c,l,d,new Le)),o&&(h.normal=gn.getInterpolatedAttribute(o,a,c,l,d,new I),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const u={a,b:c,c:l,normal:new I,materialIndex:0};gn.getNormal($s,Zs,Js,u.normal),h.face=u,h.barycoord=d}return h}class ie extends lt{constructor(e=1,t=1,n=1,i=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:s,depthSegments:o};const a=this;i=Math.floor(i),s=Math.floor(s),o=Math.floor(o);const c=[],l=[],h=[],d=[];let u=0,f=0;m("z","y","x",-1,-1,n,t,e,o,s,0),m("z","y","x",1,-1,n,t,-e,o,s,1),m("x","z","y",1,1,e,n,t,i,o,2),m("x","z","y",1,-1,e,n,-t,i,o,3),m("x","y","z",1,-1,e,t,n,i,s,4),m("x","y","z",-1,-1,e,t,-n,i,s,5),this.setIndex(c),this.setAttribute("position",new at(l,3)),this.setAttribute("normal",new at(h,3)),this.setAttribute("uv",new at(d,2));function m(_,g,p,x,S,M,T,E,R,D,y){const b=M/R,L=T/D,k=M/2,z=T/2,j=E/2,q=R+1,O=D+1;let H=0,se=0;const xe=new I;for(let ue=0;ue<O;ue++){const be=ue*L-z;for(let Ve=0;Ve<q;Ve++){const Ye=Ve*b-k;xe[_]=Ye*x,xe[g]=be*S,xe[p]=j,l.push(xe.x,xe.y,xe.z),xe[_]=0,xe[g]=0,xe[p]=E>0?1:-1,h.push(xe.x,xe.y,xe.z),d.push(Ve/R),d.push(1-ue/D),H+=1}}for(let ue=0;ue<D;ue++)for(let be=0;be<R;be++){const Ve=u+be+q*ue,Ye=u+be+q*(ue+1),vt=u+(be+1)+q*(ue+1),ct=u+(be+1)+q*ue;c.push(Ve,Ye,ct),c.push(Ye,vt,ct),se+=6}a.addGroup(f,se,y),f+=se,u+=H}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ie(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Qi(r){const e={};for(const t in r){e[t]={};for(const n in r[t]){const i=r[t][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(Ie("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone():Array.isArray(i)?e[t][n]=i.slice():e[t][n]=i}}return e}function Wt(r){const e={};for(let t=0;t<r.length;t++){const n=Qi(r[t]);for(const i in n)e[i]=n[i]}return e}function Yd(r){const e=[];for(let t=0;t<r.length;t++)e.push(r[t].clone());return e}function Zc(r){const e=r.getRenderTarget();return e===null?r.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:nt.workingColorSpace}const jd={clone:Qi,merge:Wt};var qd=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Kd=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Pn extends An{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=qd,this.fragmentShader=Kd,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Qi(e.uniforms),this.uniformsGroups=Yd(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const i in this.uniforms){const o=this.uniforms[i].value;o&&o.isTexture?t.uniforms[i]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[i]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[i]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[i]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[i]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[i]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[i]={type:"m4",value:o.toArray()}:t.uniforms[i]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class Jc extends Mt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new je,this.projectionMatrix=new je,this.projectionMatrixInverse=new je,this.coordinateSystem=wn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const ei=new I,Pl=new Le,Ll=new Le;class kt extends Jc{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Ji*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Ts*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Ji*2*Math.atan(Math.tan(Ts*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){ei.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(ei.x,ei.y).multiplyScalar(-e/ei.z),ei.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(ei.x,ei.y).multiplyScalar(-e/ei.z)}getViewSize(e,t){return this.getViewBounds(e,Pl,Ll),t.subVectors(Ll,Pl)}setViewOffset(e,t,n,i,s,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Ts*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,s=-.5*i;const o=this.view;if(this.view!==null&&this.view.enabled){const c=o.fullWidth,l=o.fullHeight;s+=o.offsetX*i/c,t-=o.offsetY*n/l,i*=o.width/c,n*=o.height/l}const a=this.filmOffset;a!==0&&(s+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+i,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Oi=-90,Bi=1;class $d extends Mt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new kt(Oi,Bi,e,t);i.layers=this.layers,this.add(i);const s=new kt(Oi,Bi,e,t);s.layers=this.layers,this.add(s);const o=new kt(Oi,Bi,e,t);o.layers=this.layers,this.add(o);const a=new kt(Oi,Bi,e,t);a.layers=this.layers,this.add(a);const c=new kt(Oi,Bi,e,t);c.layers=this.layers,this.add(c);const l=new kt(Oi,Bi,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,i,s,o,a,c]=t;for(const l of t)this.remove(l);if(e===wn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===wr)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,o,a,c,l,h]=this.children,d=e.getRenderTarget(),u=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),m=e.xr.enabled;e.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,i),e.render(t,s),e.setRenderTarget(n,1,i),e.render(t,o),e.setRenderTarget(n,2,i),e.render(t,a),e.setRenderTarget(n,3,i),e.render(t,c),e.setRenderTarget(n,4,i),e.render(t,l),n.texture.generateMipmaps=_,e.setRenderTarget(n,5,i),e.render(t,h),e.setRenderTarget(d,u,f),e.xr.enabled=m,n.texture.needsPMREMUpdate=!0}}class Qc extends Nt{constructor(e=[],t=Mi,n,i,s,o,a,c,l,h){super(e,t,n,i,s,o,a,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class eh extends En{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];this.texture=new Qc(i),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new ie(5,5,5),s=new Pn({name:"CubemapFromEquirect",uniforms:Qi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Jt,blending:Hn});s.uniforms.tEquirect.value=t;const o=new N(i,s),a=t.minFilter;return t.minFilter===zn&&(t.minFilter=Dt),new $d(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,n=!0,i=!0){const s=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,i);e.setRenderTarget(s)}}class Ce extends Mt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Zd={type:"move"};class so{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ce,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ce,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new I,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new I),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ce,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new I,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new I),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,s=null,o=null;const a=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){o=!0;for(const _ of e.hand.values()){const g=t.getJointPose(_,n),p=this._getHandJoint(l,_);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}const h=l.joints["index-finger-tip"],d=l.joints["thumb-tip"],u=h.position.distanceTo(d.position),f=.02,m=.005;l.inputState.pinching&&u>f+m?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&u<=f-m&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,n),s!==null&&(c.matrix.fromArray(s.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,s.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(s.linearVelocity)):c.hasLinearVelocity=!1,s.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(s.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&s!==null&&(i=s),i!==null&&(a.matrix.fromArray(i.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,i.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(i.linearVelocity)):a.hasLinearVelocity=!1,i.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(i.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Zd)))}return a!==null&&(a.visible=i!==null),c!==null&&(c.visible=s!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new Ce;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}class yi{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new Oe(e),this.density=t}clone(){return new yi(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class th extends Mt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Cn,this.environmentIntensity=1,this.environmentRotation=new Cn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class Jd{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=ga,this.updateRanges=[],this.version=0,this.uuid=_n()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let i=0,s=this.stride;i<s;i++)this.array[e+i]=t.array[n+i];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=_n()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=_n()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Vt=new I;class Ba{constructor(e,t,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Vt.fromBufferAttribute(this,t),Vt.applyMatrix4(e),this.setXYZ(t,Vt.x,Vt.y,Vt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Vt.fromBufferAttribute(this,t),Vt.applyNormalMatrix(e),this.setXYZ(t,Vt.x,Vt.y,Vt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Vt.fromBufferAttribute(this,t),Vt.transformDirection(e),this.setXYZ(t,Vt.x,Vt.y,Vt.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=mn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=ut(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=ut(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=ut(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=ut(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=ut(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=mn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=mn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=mn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=mn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=ut(t,this.array),n=ut(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=ut(t,this.array),n=ut(n,this.array),i=ut(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this}setXYZW(e,t,n,i,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=ut(t,this.array),n=ut(n,this.array),i=ut(i,this.array),s=ut(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this.data.array[e+3]=s,this}clone(e){if(e===void 0){Tr("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[i+s])}return new Rt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new Ba(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){Tr("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[i+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}const Il=new I,Dl=new bt,Nl=new bt,Qd=new I,Ul=new je,nr=new I,ro=new Ln,Fl=new je,oo=new is;class eu extends N{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=ll,this.bindMatrix=new je,this.bindMatrixInverse=new je,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const e=this.geometry;this.boundingBox===null&&(this.boundingBox=new qn),this.boundingBox.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,nr),this.boundingBox.expandByPoint(nr)}computeBoundingSphere(){const e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new Ln),this.boundingSphere.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,nr),this.boundingSphere.expandByPoint(nr)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){const n=this.material,i=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),ro.copy(this.boundingSphere),ro.applyMatrix4(i),e.ray.intersectsSphere(ro)!==!1&&(Fl.copy(i).invert(),oo.copy(e.ray).applyMatrix4(Fl),!(this.boundingBox!==null&&oo.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,oo)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const e=new bt,t=this.geometry.attributes.skinWeight;for(let n=0,i=t.count;n<i;n++){e.fromBufferAttribute(t,n);const s=1/e.manhattanLength();s!==1/0?e.multiplyScalar(s):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===ll?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===Qh?this.bindMatrixInverse.copy(this.bindMatrix).invert():Ie("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){const n=this.skeleton,i=this.geometry;Dl.fromBufferAttribute(i.attributes.skinIndex,e),Nl.fromBufferAttribute(i.attributes.skinWeight,e),Il.copy(t).applyMatrix4(this.bindMatrix),t.set(0,0,0);for(let s=0;s<4;s++){const o=Nl.getComponent(s);if(o!==0){const a=Dl.getComponent(s);Ul.multiplyMatrices(n.bones[a].matrixWorld,n.boneInverses[a]),t.addScaledVector(Qd.copy(Il).applyMatrix4(Ul),o)}}return t.applyMatrix4(this.bindMatrixInverse)}}class nh extends Mt{constructor(){super(),this.isBone=!0,this.type="Bone"}}class ka extends Nt{constructor(e=null,t=1,n=1,i,s,o,a,c,l=It,h=It,d,u){super(null,o,a,c,l,h,i,s,d,u),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Ol=new je,tu=new je;class za{constructor(e=[],t=[]){this.uuid=_n(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.previousBoneMatrices=null,this.boneTexture=null,this.init()}init(){const e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){Ie("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,i=this.bones.length;n<i;n++)this.boneInverses.push(new je)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){const n=new je;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){const e=this.bones,t=this.boneInverses,n=this.boneMatrices,i=this.boneTexture;for(let s=0,o=e.length;s<o;s++){const a=e[s]?e[s].matrixWorld:tu;Ol.multiplyMatrices(a,t[s]),Ol.toArray(n,s*16)}i!==null&&(i.needsUpdate=!0)}clone(){return new za(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);const t=new Float32Array(e*e*4);t.set(this.boneMatrices);const n=new ka(t,e,e,hn,cn);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){const i=this.bones[t];if(i.name===e)return i}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,i=e.bones.length;n<i;n++){const s=e.bones[n];let o=t[s];o===void 0&&(Ie("Skeleton: No bone found with UUID:",s),o=new nh),this.bones.push(o),this.boneInverses.push(new je().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){const e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;const t=this.bones,n=this.boneInverses;for(let i=0,s=t.length;i<s;i++){const o=t[i];e.bones.push(o.uuid);const a=n[i];e.boneInverses.push(a.toArray())}return e}}class _a extends Rt{constructor(e,t,n,i=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const ki=new je,Bl=new je,ir=[],kl=new qn,nu=new je,ps=new N,ms=new Ln;class iu extends N{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new _a(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,nu)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new qn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,ki),kl.copy(e.boundingBox).applyMatrix4(ki),this.boundingBox.union(kl)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Ln),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,ki),ms.copy(e.boundingSphere).applyMatrix4(ki),this.boundingSphere.union(ms)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,i=this.morphTexture.source.data.data,s=n.length+1,o=e*s+1;for(let a=0;a<n.length;a++)n[a]=i[o+a]}raycast(e,t){const n=this.matrixWorld,i=this.count;if(ps.geometry=this.geometry,ps.material=this.material,ps.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),ms.copy(this.boundingSphere),ms.applyMatrix4(n),e.ray.intersectsSphere(ms)!==!1))for(let s=0;s<i;s++){this.getMatrixAt(s,ki),Bl.multiplyMatrices(n,ki),ps.matrixWorld=Bl,ps.raycast(e,ir);for(let o=0,a=ir.length;o<a;o++){const c=ir[o];c.instanceId=s,c.object=this,t.push(c)}ir.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new _a(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const n=t.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new ka(new Float32Array(i*this.count),i,this.count,Ca,cn));const s=this.morphTexture.source.data.data;let o=0;for(let l=0;l<n.length;l++)o+=n[l];const a=this.geometry.morphTargetsRelative?1:1-o,c=i*e;s[c]=a,s.set(n,c+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const ao=new I,su=new I,ru=new qe;class ni{constructor(e=new I(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const i=ao.subVectors(n,t).cross(su.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(ao),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/i;return s<0||s>1?null:t.copy(e.start).addScaledVector(n,s)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||ru.getNormalMatrix(e),i=this.coplanarPoint(ao).applyMatrix4(e),s=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ui=new Ln,ou=new Le(.5,.5),sr=new I;class Ga{constructor(e=new ni,t=new ni,n=new ni,i=new ni,s=new ni,o=new ni){this.planes=[e,t,n,i,s,o]}set(e,t,n,i,s,o){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(i),a[4].copy(s),a[5].copy(o),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=wn,n=!1){const i=this.planes,s=e.elements,o=s[0],a=s[1],c=s[2],l=s[3],h=s[4],d=s[5],u=s[6],f=s[7],m=s[8],_=s[9],g=s[10],p=s[11],x=s[12],S=s[13],M=s[14],T=s[15];if(i[0].setComponents(l-o,f-h,p-m,T-x).normalize(),i[1].setComponents(l+o,f+h,p+m,T+x).normalize(),i[2].setComponents(l+a,f+d,p+_,T+S).normalize(),i[3].setComponents(l-a,f-d,p-_,T-S).normalize(),n)i[4].setComponents(c,u,g,M).normalize(),i[5].setComponents(l-c,f-u,p-g,T-M).normalize();else if(i[4].setComponents(l-c,f-u,p-g,T-M).normalize(),t===wn)i[5].setComponents(l+c,f+u,p+g,T+M).normalize();else if(t===wr)i[5].setComponents(c,u,g,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ui.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ui.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ui)}intersectsSprite(e){ui.center.set(0,0,0);const t=ou.distanceTo(e.center);return ui.radius=.7071067811865476+t,ui.applyMatrix4(e.matrixWorld),this.intersectsSphere(ui)}intersectsSphere(e){const t=this.planes,n=e.center,i=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const i=t[n];if(sr.x=i.normal.x>0?e.max.x:e.min.x,sr.y=i.normal.y>0?e.max.y:e.min.y,sr.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(sr)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class si extends An{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Oe(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Er=new I,Ar=new I,zl=new je,gs=new is,rr=new Ln,lo=new I,Gl=new I;class Sn extends Mt{constructor(e=new lt,t=new si){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let i=1,s=t.count;i<s;i++)Er.fromBufferAttribute(t,i-1),Ar.fromBufferAttribute(t,i),n[i]=n[i-1],n[i]+=Er.distanceTo(Ar);e.setAttribute("lineDistance",new at(n,1))}else Ie("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,s=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),rr.copy(n.boundingSphere),rr.applyMatrix4(i),rr.radius+=s,e.ray.intersectsSphere(rr)===!1)return;zl.copy(i).invert(),gs.copy(e.ray).applyMatrix4(zl);const a=s/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=this.isLineSegments?2:1,h=n.index,u=n.attributes.position;if(h!==null){const f=Math.max(0,o.start),m=Math.min(h.count,o.start+o.count);for(let _=f,g=m-1;_<g;_+=l){const p=h.getX(_),x=h.getX(_+1),S=or(this,e,gs,c,p,x,_);S&&t.push(S)}if(this.isLineLoop){const _=h.getX(m-1),g=h.getX(f),p=or(this,e,gs,c,_,g,m-1);p&&t.push(p)}}else{const f=Math.max(0,o.start),m=Math.min(u.count,o.start+o.count);for(let _=f,g=m-1;_<g;_+=l){const p=or(this,e,gs,c,_,_+1,_);p&&t.push(p)}if(this.isLineLoop){const _=or(this,e,gs,c,m-1,f,m-1);_&&t.push(_)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=i.length;s<o;s++){const a=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}}function or(r,e,t,n,i,s,o){const a=r.geometry.attributes.position;if(Er.fromBufferAttribute(a,i),Ar.fromBufferAttribute(a,s),t.distanceSqToSegment(Er,Ar,lo,Gl)>n)return;lo.applyMatrix4(r.matrixWorld);const l=e.ray.origin.distanceTo(lo);if(!(l<e.near||l>e.far))return{distance:l,point:Gl.clone().applyMatrix4(r.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:r}}const Hl=new I,Vl=new I;class au extends Sn{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let i=0,s=t.count;i<s;i+=2)Hl.fromBufferAttribute(t,i),Vl.fromBufferAttribute(t,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+Hl.distanceTo(Vl);e.setAttribute("lineDistance",new at(n,1))}else Ie("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class lu extends Sn{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}}class Ha extends An{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Oe(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const Wl=new je,xa=new is,ar=new Ln,lr=new I;class ih extends Mt{constructor(e=new lt,t=new Ha){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,s=e.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ar.copy(n.boundingSphere),ar.applyMatrix4(i),ar.radius+=s,e.ray.intersectsSphere(ar)===!1)return;Wl.copy(i).invert(),xa.copy(e.ray).applyMatrix4(Wl);const a=s/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=n.index,d=n.attributes.position;if(l!==null){const u=Math.max(0,o.start),f=Math.min(l.count,o.start+o.count);for(let m=u,_=f;m<_;m++){const g=l.getX(m);lr.fromBufferAttribute(d,g),Xl(lr,g,c,i,e,t,this)}}else{const u=Math.max(0,o.start),f=Math.min(d.count,o.start+o.count);for(let m=u,_=f;m<_;m++)lr.fromBufferAttribute(d,m),Xl(lr,m,c,i,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=i.length;s<o;s++){const a=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}}function Xl(r,e,t,n,i,s,o){const a=xa.distanceSqToPoint(r);if(a<t){const c=new I;xa.closestPointToPoint(r,c),c.applyMatrix4(n);const l=i.ray.origin.distanceTo(c);if(l<i.near||l>i.far)return;s.push({distance:l,distanceToRay:Math.sqrt(a),point:c,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}class _s extends Nt{constructor(e,t,n,i,s,o,a,c,l){super(e,t,n,i,s,o,a,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Us extends Nt{constructor(e,t,n=Rn,i,s,o,a=It,c=It,l,h=Yn,d=1){if(h!==Yn&&h!==vi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const u={width:e,height:t,depth:d};super(u,i,s,o,a,c,h,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Fa(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class cu extends Us{constructor(e,t=Rn,n=Mi,i,s,o=It,a=It,c,l=Yn){const h={width:e,height:e,depth:1},d=[h,h,h,h,h,h];super(e,e,t,n,i,s,o,a,c,l),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class sh extends Nt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Rr extends lt{constructor(e=1,t=32,n=0,i=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:i},t=Math.max(3,t);const s=[],o=[],a=[],c=[],l=new I,h=new Le;o.push(0,0,0),a.push(0,0,1),c.push(.5,.5);for(let d=0,u=3;d<=t;d++,u+=3){const f=n+d/t*i;l.x=e*Math.cos(f),l.y=e*Math.sin(f),o.push(l.x,l.y,l.z),a.push(0,0,1),h.x=(o[u]/e+1)/2,h.y=(o[u+1]/e+1)/2,c.push(h.x,h.y)}for(let d=1;d<=t;d++)s.push(d,d+1,0);this.setIndex(s),this.setAttribute("position",new at(o,3)),this.setAttribute("normal",new at(a,3)),this.setAttribute("uv",new at(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Rr(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class Ee extends lt{constructor(e=1,t=1,n=1,i=32,s=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:i,heightSegments:s,openEnded:o,thetaStart:a,thetaLength:c};const l=this;i=Math.floor(i),s=Math.floor(s);const h=[],d=[],u=[],f=[];let m=0;const _=[],g=n/2;let p=0;x(),o===!1&&(e>0&&S(!0),t>0&&S(!1)),this.setIndex(h),this.setAttribute("position",new at(d,3)),this.setAttribute("normal",new at(u,3)),this.setAttribute("uv",new at(f,2));function x(){const M=new I,T=new I;let E=0;const R=(t-e)/n;for(let D=0;D<=s;D++){const y=[],b=D/s,L=b*(t-e)+e;for(let k=0;k<=i;k++){const z=k/i,j=z*c+a,q=Math.sin(j),O=Math.cos(j);T.x=L*q,T.y=-b*n+g,T.z=L*O,d.push(T.x,T.y,T.z),M.set(q,R,O).normalize(),u.push(M.x,M.y,M.z),f.push(z,1-b),y.push(m++)}_.push(y)}for(let D=0;D<i;D++)for(let y=0;y<s;y++){const b=_[y][D],L=_[y+1][D],k=_[y+1][D+1],z=_[y][D+1];(e>0||y!==0)&&(h.push(b,L,z),E+=3),(t>0||y!==s-1)&&(h.push(L,k,z),E+=3)}l.addGroup(p,E,0),p+=E}function S(M){const T=m,E=new Le,R=new I;let D=0;const y=M===!0?e:t,b=M===!0?1:-1;for(let k=1;k<=i;k++)d.push(0,g*b,0),u.push(0,b,0),f.push(.5,.5),m++;const L=m;for(let k=0;k<=i;k++){const j=k/i*c+a,q=Math.cos(j),O=Math.sin(j);R.x=y*O,R.y=g*b,R.z=y*q,d.push(R.x,R.y,R.z),u.push(0,b,0),E.x=q*.5+.5,E.y=O*.5*b+.5,f.push(E.x,E.y),m++}for(let k=0;k<i;k++){const z=T+k,j=L+k;M===!0?h.push(j,j+1,z):h.push(j+1,j,z),D+=3}l.addGroup(p,D,M===!0?1:2),p+=D}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ee(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Va extends Ee{constructor(e=1,t=1,n=32,i=1,s=!1,o=0,a=Math.PI*2){super(0,e,t,n,i,s,o,a),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:i,openEnded:s,thetaStart:o,thetaLength:a}}static fromJSON(e){return new Va(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Wa extends lt{constructor(e=[],t=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:i};const s=[],o=[];a(i),l(n),h(),this.setAttribute("position",new at(s,3)),this.setAttribute("normal",new at(s.slice(),3)),this.setAttribute("uv",new at(o,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function a(x){const S=new I,M=new I,T=new I;for(let E=0;E<t.length;E+=3)f(t[E+0],S),f(t[E+1],M),f(t[E+2],T),c(S,M,T,x)}function c(x,S,M,T){const E=T+1,R=[];for(let D=0;D<=E;D++){R[D]=[];const y=x.clone().lerp(M,D/E),b=S.clone().lerp(M,D/E),L=E-D;for(let k=0;k<=L;k++)k===0&&D===E?R[D][k]=y:R[D][k]=y.clone().lerp(b,k/L)}for(let D=0;D<E;D++)for(let y=0;y<2*(E-D)-1;y++){const b=Math.floor(y/2);y%2===0?(u(R[D][b+1]),u(R[D+1][b]),u(R[D][b])):(u(R[D][b+1]),u(R[D+1][b+1]),u(R[D+1][b]))}}function l(x){const S=new I;for(let M=0;M<s.length;M+=3)S.x=s[M+0],S.y=s[M+1],S.z=s[M+2],S.normalize().multiplyScalar(x),s[M+0]=S.x,s[M+1]=S.y,s[M+2]=S.z}function h(){const x=new I;for(let S=0;S<s.length;S+=3){x.x=s[S+0],x.y=s[S+1],x.z=s[S+2];const M=g(x)/2/Math.PI+.5,T=p(x)/Math.PI+.5;o.push(M,1-T)}m(),d()}function d(){for(let x=0;x<o.length;x+=6){const S=o[x+0],M=o[x+2],T=o[x+4],E=Math.max(S,M,T),R=Math.min(S,M,T);E>.9&&R<.1&&(S<.2&&(o[x+0]+=1),M<.2&&(o[x+2]+=1),T<.2&&(o[x+4]+=1))}}function u(x){s.push(x.x,x.y,x.z)}function f(x,S){const M=x*3;S.x=e[M+0],S.y=e[M+1],S.z=e[M+2]}function m(){const x=new I,S=new I,M=new I,T=new I,E=new Le,R=new Le,D=new Le;for(let y=0,b=0;y<s.length;y+=9,b+=6){x.set(s[y+0],s[y+1],s[y+2]),S.set(s[y+3],s[y+4],s[y+5]),M.set(s[y+6],s[y+7],s[y+8]),E.set(o[b+0],o[b+1]),R.set(o[b+2],o[b+3]),D.set(o[b+4],o[b+5]),T.copy(x).add(S).add(M).divideScalar(3);const L=g(T);_(E,b+0,x,L),_(R,b+2,S,L),_(D,b+4,M,L)}}function _(x,S,M,T){T<0&&x.x===1&&(o[S]=x.x-1),M.x===0&&M.z===0&&(o[S]=T/2/Math.PI+.5)}function g(x){return Math.atan2(x.z,-x.x)}function p(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Wa(e.vertices,e.indices,e.radius,e.detail)}}class hu{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Ie("Curve: .getPoint() not implemented.")}getPointAt(e,t){const n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let n,i=this.getPoint(0),s=0;t.push(0);for(let o=1;o<=e;o++)n=this.getPoint(o/e),s+=n.distanceTo(i),t.push(s),i=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const n=this.getLengths();let i=0;const s=n.length;let o;t?o=t:o=e*n[s-1];let a=0,c=s-1,l;for(;a<=c;)if(i=Math.floor(a+(c-a)/2),l=n[i]-o,l<0)a=i+1;else if(l>0)c=i-1;else{c=i;break}if(i=c,n[i]===o)return i/(s-1);const h=n[i],u=n[i+1]-h,f=(o-h)/u;return(i+f)/(s-1)}getTangent(e,t){let i=e-1e-4,s=e+1e-4;i<0&&(i=0),s>1&&(s=1);const o=this.getPoint(i),a=this.getPoint(s),c=t||(o.isVector2?new Le:new I);return c.copy(a).sub(o).normalize(),c}getTangentAt(e,t){const n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){const n=new I,i=[],s=[],o=[],a=new I,c=new je;for(let f=0;f<=e;f++){const m=f/e;i[f]=this.getTangentAt(m,new I)}s[0]=new I,o[0]=new I;let l=Number.MAX_VALUE;const h=Math.abs(i[0].x),d=Math.abs(i[0].y),u=Math.abs(i[0].z);h<=l&&(l=h,n.set(1,0,0)),d<=l&&(l=d,n.set(0,1,0)),u<=l&&n.set(0,0,1),a.crossVectors(i[0],n).normalize(),s[0].crossVectors(i[0],a),o[0].crossVectors(i[0],s[0]);for(let f=1;f<=e;f++){if(s[f]=s[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(i[f-1],i[f]),a.length()>Number.EPSILON){a.normalize();const m=Math.acos(Ke(i[f-1].dot(i[f]),-1,1));s[f].applyMatrix4(c.makeRotationAxis(a,m))}o[f].crossVectors(i[f],s[f])}if(t===!0){let f=Math.acos(Ke(s[0].dot(s[e]),-1,1));f/=e,i[0].dot(a.crossVectors(s[0],s[e]))>0&&(f=-f);for(let m=1;m<=e;m++)s[m].applyMatrix4(c.makeRotationAxis(i[m],f*m)),o[m].crossVectors(i[m],s[m])}return{tangents:i,normals:s,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}function Xa(){let r=0,e=0,t=0,n=0;function i(s,o,a,c){r=s,e=a,t=-3*s+3*o-2*a-c,n=2*s-2*o+a+c}return{initCatmullRom:function(s,o,a,c,l){i(o,a,l*(a-s),l*(c-o))},initNonuniformCatmullRom:function(s,o,a,c,l,h,d){let u=(o-s)/l-(a-s)/(l+h)+(a-o)/h,f=(a-o)/h-(c-o)/(h+d)+(c-a)/d;u*=h,f*=h,i(o,a,u,f)},calc:function(s){const o=s*s,a=o*s;return r+e*s+t*o+n*a}}}const cr=new I,co=new Xa,ho=new Xa,uo=new Xa;class du extends hu{constructor(e=[],t=!1,n="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=i}getPoint(e,t=new I){const n=t,i=this.points,s=i.length,o=(s-(this.closed?0:1))*e;let a=Math.floor(o),c=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/s)+1)*s:c===0&&a===s-1&&(a=s-2,c=1);let l,h;this.closed||a>0?l=i[(a-1)%s]:(cr.subVectors(i[0],i[1]).add(i[0]),l=cr);const d=i[a%s],u=i[(a+1)%s];if(this.closed||a+2<s?h=i[(a+2)%s]:(cr.subVectors(i[s-1],i[s-2]).add(i[s-1]),h=cr),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let m=Math.pow(l.distanceToSquared(d),f),_=Math.pow(d.distanceToSquared(u),f),g=Math.pow(u.distanceToSquared(h),f);_<1e-4&&(_=1),m<1e-4&&(m=_),g<1e-4&&(g=_),co.initNonuniformCatmullRom(l.x,d.x,u.x,h.x,m,_,g),ho.initNonuniformCatmullRom(l.y,d.y,u.y,h.y,m,_,g),uo.initNonuniformCatmullRom(l.z,d.z,u.z,h.z,m,_,g)}else this.curveType==="catmullrom"&&(co.initCatmullRom(l.x,d.x,u.x,h.x,this.tension),ho.initCatmullRom(l.y,d.y,u.y,h.y,this.tension),uo.initCatmullRom(l.z,d.z,u.z,h.z,this.tension));return n.set(co.calc(c),ho.calc(c),uo.calc(c)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(i.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const i=this.points[t];e.points.push(i.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(new I().fromArray(i))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}class Ya extends Wa{constructor(e=1,t=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],i=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,i,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Ya(e.radius,e.detail)}}class jn extends lt{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};const s=e/2,o=t/2,a=Math.floor(n),c=Math.floor(i),l=a+1,h=c+1,d=e/a,u=t/c,f=[],m=[],_=[],g=[];for(let p=0;p<h;p++){const x=p*u-o;for(let S=0;S<l;S++){const M=S*d-s;m.push(M,-x,0),_.push(0,0,1),g.push(S/a),g.push(1-p/c)}}for(let p=0;p<c;p++)for(let x=0;x<a;x++){const S=x+l*p,M=x+l*(p+1),T=x+1+l*(p+1),E=x+1+l*p;f.push(S,M,E),f.push(M,T,E)}this.setIndex(f),this.setAttribute("position",new at(m,3)),this.setAttribute("normal",new at(_,3)),this.setAttribute("uv",new at(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new jn(e.width,e.height,e.widthSegments,e.heightSegments)}}class kn extends lt{constructor(e=.5,t=1,n=32,i=1,s=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:i,thetaStart:s,thetaLength:o},n=Math.max(3,n),i=Math.max(1,i);const a=[],c=[],l=[],h=[];let d=e;const u=(t-e)/i,f=new I,m=new Le;for(let _=0;_<=i;_++){for(let g=0;g<=n;g++){const p=s+g/n*o;f.x=d*Math.cos(p),f.y=d*Math.sin(p),c.push(f.x,f.y,f.z),l.push(0,0,1),m.x=(f.x/t+1)/2,m.y=(f.y/t+1)/2,h.push(m.x,m.y)}d+=u}for(let _=0;_<i;_++){const g=_*(n+1);for(let p=0;p<n;p++){const x=p+g,S=x,M=x+n+1,T=x+n+2,E=x+1;a.push(S,M,E),a.push(M,T,E)}}this.setIndex(a),this.setAttribute("position",new at(c,3)),this.setAttribute("normal",new at(l,3)),this.setAttribute("uv",new at(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new kn(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class Zt extends lt{constructor(e=1,t=32,n=16,i=0,s=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:i,phiLength:s,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const c=Math.min(o+a,Math.PI);let l=0;const h=[],d=new I,u=new I,f=[],m=[],_=[],g=[];for(let p=0;p<=n;p++){const x=[],S=p/n;let M=0;p===0&&o===0?M=.5/t:p===n&&c===Math.PI&&(M=-.5/t);for(let T=0;T<=t;T++){const E=T/t;d.x=-e*Math.cos(i+E*s)*Math.sin(o+S*a),d.y=e*Math.cos(o+S*a),d.z=e*Math.sin(i+E*s)*Math.sin(o+S*a),m.push(d.x,d.y,d.z),u.copy(d).normalize(),_.push(u.x,u.y,u.z),g.push(E+M,1-S),x.push(l++)}h.push(x)}for(let p=0;p<n;p++)for(let x=0;x<t;x++){const S=h[p][x+1],M=h[p][x],T=h[p+1][x],E=h[p+1][x+1];(p!==0||o>0)&&f.push(S,M,E),(p!==n-1||c<Math.PI)&&f.push(M,T,E)}this.setIndex(f),this.setAttribute("position",new at(m,3)),this.setAttribute("normal",new at(_,3)),this.setAttribute("uv",new at(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Zt(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Cr extends lt{constructor(e=1,t=.4,n=12,i=48,s=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:i,arc:s},n=Math.floor(n),i=Math.floor(i);const o=[],a=[],c=[],l=[],h=new I,d=new I,u=new I;for(let f=0;f<=n;f++)for(let m=0;m<=i;m++){const _=m/i*s,g=f/n*Math.PI*2;d.x=(e+t*Math.cos(g))*Math.cos(_),d.y=(e+t*Math.cos(g))*Math.sin(_),d.z=t*Math.sin(g),a.push(d.x,d.y,d.z),h.x=e*Math.cos(_),h.y=e*Math.sin(_),u.subVectors(d,h).normalize(),c.push(u.x,u.y,u.z),l.push(m/i),l.push(f/n)}for(let f=1;f<=n;f++)for(let m=1;m<=i;m++){const _=(i+1)*f+m-1,g=(i+1)*(f-1)+m-1,p=(i+1)*(f-1)+m,x=(i+1)*f+m;o.push(_,g,x),o.push(g,p,x)}this.setIndex(o),this.setAttribute("position",new at(a,3)),this.setAttribute("normal",new at(c,3)),this.setAttribute("uv",new at(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Cr(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class uu extends Pn{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class te extends An{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Oe(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Oe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Xc,this.normalScale=new Le(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Cn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class In extends te{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new Le(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Ke(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Oe(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Oe(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Oe(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class fu extends An{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=nd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class pu extends An{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}function hr(r,e){return!r||r.constructor===e?r:typeof e.BYTES_PER_ELEMENT=="number"?new e(r):Array.prototype.slice.call(r)}function mu(r){function e(i,s){return r[i]-r[s]}const t=r.length,n=new Array(t);for(let i=0;i!==t;++i)n[i]=i;return n.sort(e),n}function Yl(r,e,t){const n=r.length,i=new r.constructor(n);for(let s=0,o=0;o!==n;++s){const a=t[s]*e;for(let c=0;c!==e;++c)i[o++]=r[a+c]}return i}function rh(r,e,t,n){let i=1,s=r[0];for(;s!==void 0&&s[n]===void 0;)s=r[i++];if(s===void 0)return;let o=s[n];if(o!==void 0)if(Array.isArray(o))do o=s[n],o!==void 0&&(e.push(s.time),t.push(...o)),s=r[i++];while(s!==void 0);else if(o.toArray!==void 0)do o=s[n],o!==void 0&&(e.push(s.time),o.toArray(t,t.length)),s=r[i++];while(s!==void 0);else do o=s[n],o!==void 0&&(e.push(s.time),t.push(o)),s=r[i++];while(s!==void 0)}class Fs{constructor(e,t,n,i){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){const t=this.parameterPositions;let n=this._cachedIndex,i=t[n],s=t[n-1];n:{e:{let o;t:{i:if(!(e<i)){for(let a=n+2;;){if(i===void 0){if(e<s)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(s=i,i=t[++n],e<i)break e}o=t.length;break t}if(!(e>=s)){const a=t[1];e<a&&(n=2,s=a);for(let c=n-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===c)break;if(i=s,s=t[--n-1],e>=s)break e}o=n,n=0;break t}break n}for(;n<o;){const a=n+o>>>1;e<t[a]?o=a:n=a+1}if(i=t[n],s=t[n-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,s,i)}return this.interpolate_(n,s,e,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,s=e*i;for(let o=0;o!==i;++o)t[o]=n[s+o];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}}class gu extends Fs{constructor(e,t,n,i){super(e,t,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:cl,endingEnd:cl}}intervalChanged_(e,t,n){const i=this.parameterPositions;let s=e-2,o=e+1,a=i[s],c=i[o];if(a===void 0)switch(this.getSettings_().endingStart){case hl:s=e,a=2*t-n;break;case dl:s=i.length-2,a=t+i[s]-i[s+1];break;default:s=e,a=n}if(c===void 0)switch(this.getSettings_().endingEnd){case hl:o=e,c=2*n-t;break;case dl:o=1,c=n+i[1]-i[0];break;default:o=e-1,c=t}const l=(n-t)*.5,h=this.valueSize;this._weightPrev=l/(t-a),this._weightNext=l/(c-n),this._offsetPrev=s*h,this._offsetNext=o*h}interpolate_(e,t,n,i){const s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,l=c-a,h=this._offsetPrev,d=this._offsetNext,u=this._weightPrev,f=this._weightNext,m=(n-t)/(i-t),_=m*m,g=_*m,p=-u*g+2*u*_-u*m,x=(1+u)*g+(-1.5-2*u)*_+(-.5+u)*m+1,S=(-1-f)*g+(1.5+f)*_+.5*m,M=f*g-f*_;for(let T=0;T!==a;++T)s[T]=p*o[h+T]+x*o[l+T]+S*o[c+T]+M*o[d+T];return s}}class _u extends Fs{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){const s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,l=c-a,h=(n-t)/(i-t),d=1-h;for(let u=0;u!==a;++u)s[u]=o[l+u]*d+o[c+u]*h;return s}}class xu extends Fs{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e){return this.copySampleValue_(e-1)}}class vn{constructor(e,t,n,i){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=hr(t,this.TimeBufferType),this.values=hr(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(e){const t=e.constructor;let n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:hr(e.times,Array),values:hr(e.values,Array)};const i=e.getInterpolation();i!==e.DefaultInterpolation&&(n.interpolation=i)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new xu(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new _u(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new gu(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case Ls:t=this.InterpolantFactoryMethodDiscrete;break;case Is:t=this.InterpolantFactoryMethodLinear;break;case Or:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){const n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return Ie("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Ls;case this.InterpolantFactoryMethodLinear:return Is;case this.InterpolantFactoryMethodSmooth:return Or}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){const t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]+=e}return this}scale(e){if(e!==1){const t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]*=e}return this}trim(e,t){const n=this.times,i=n.length;let s=0,o=i-1;for(;s!==i&&n[s]<e;)++s;for(;o!==-1&&n[o]>t;)--o;if(++o,s!==0||o!==i){s>=o&&(o=Math.max(o,1),s=o-1);const a=this.getValueSize();this.times=n.slice(s,o),this.values=this.values.slice(s*a,o*a)}return this}validate(){let e=!0;const t=this.getValueSize();t-Math.floor(t)!==0&&(ze("KeyframeTrack: Invalid value size in track.",this),e=!1);const n=this.times,i=this.values,s=n.length;s===0&&(ze("KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==s;a++){const c=n[a];if(typeof c=="number"&&isNaN(c)){ze("KeyframeTrack: Time is not a valid number.",this,a,c),e=!1;break}if(o!==null&&o>c){ze("KeyframeTrack: Out of order keys.",this,a,c,o),e=!1;break}o=c}if(i!==void 0&&hd(i))for(let a=0,c=i.length;a!==c;++a){const l=i[a];if(isNaN(l)){ze("KeyframeTrack: Value is not a valid number.",this,a,l),e=!1;break}}return e}optimize(){const e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===Or,s=e.length-1;let o=1;for(let a=1;a<s;++a){let c=!1;const l=e[a],h=e[a+1];if(l!==h&&(a!==1||l!==e[0]))if(i)c=!0;else{const d=a*n,u=d-n,f=d+n;for(let m=0;m!==n;++m){const _=t[d+m];if(_!==t[u+m]||_!==t[f+m]){c=!0;break}}}if(c){if(a!==o){e[o]=e[a];const d=a*n,u=o*n;for(let f=0;f!==n;++f)t[u+f]=t[d+f]}++o}}if(s>0){e[o]=e[s];for(let a=s*n,c=o*n,l=0;l!==n;++l)t[c+l]=t[a+l];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*n)):(this.times=e,this.values=t),this}clone(){const e=this.times.slice(),t=this.values.slice(),n=this.constructor,i=new n(this.name,e,t);return i.createInterpolant=this.createInterpolant,i}}vn.prototype.ValueTypeName="";vn.prototype.TimeBufferType=Float32Array;vn.prototype.ValueBufferType=Float32Array;vn.prototype.DefaultInterpolation=Is;class ss extends vn{constructor(e,t,n){super(e,t,n)}}ss.prototype.ValueTypeName="bool";ss.prototype.ValueBufferType=Array;ss.prototype.DefaultInterpolation=Ls;ss.prototype.InterpolantFactoryMethodLinear=void 0;ss.prototype.InterpolantFactoryMethodSmooth=void 0;class oh extends vn{constructor(e,t,n,i){super(e,t,n,i)}}oh.prototype.ValueTypeName="color";class es extends vn{constructor(e,t,n,i){super(e,t,n,i)}}es.prototype.ValueTypeName="number";class vu extends Fs{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){const s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=(n-t)/(i-t);let l=e*a;for(let h=l+a;l!==h;l+=4)xn.slerpFlat(s,0,o,l-a,o,l,c);return s}}class ts extends vn{constructor(e,t,n,i){super(e,t,n,i)}InterpolantFactoryMethodLinear(e){return new vu(this.times,this.values,this.getValueSize(),e)}}ts.prototype.ValueTypeName="quaternion";ts.prototype.InterpolantFactoryMethodSmooth=void 0;class rs extends vn{constructor(e,t,n){super(e,t,n)}}rs.prototype.ValueTypeName="string";rs.prototype.ValueBufferType=Array;rs.prototype.DefaultInterpolation=Ls;rs.prototype.InterpolantFactoryMethodLinear=void 0;rs.prototype.InterpolantFactoryMethodSmooth=void 0;class ns extends vn{constructor(e,t,n,i){super(e,t,n,i)}}ns.prototype.ValueTypeName="vector";class yu{constructor(e="",t=-1,n=[],i=ed){this.name=e,this.tracks=n,this.duration=t,this.blendMode=i,this.uuid=_n(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){const t=[],n=e.tracks,i=1/(e.fps||1);for(let o=0,a=n.length;o!==a;++o)t.push(Mu(n[o]).scale(i));const s=new this(e.name,e.duration,t,e.blendMode);return s.uuid=e.uuid,s.userData=JSON.parse(e.userData||"{}"),s}static toJSON(e){const t=[],n=e.tracks,i={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let s=0,o=n.length;s!==o;++s)t.push(vn.toJSON(n[s]));return i}static CreateFromMorphTargetSequence(e,t,n,i){const s=t.length,o=[];for(let a=0;a<s;a++){let c=[],l=[];c.push((a+s-1)%s,a,(a+1)%s),l.push(0,1,0);const h=mu(c);c=Yl(c,1,h),l=Yl(l,1,h),!i&&c[0]===0&&(c.push(s),l.push(l[0])),o.push(new es(".morphTargetInfluences["+t[a].name+"]",c,l).scale(1/n))}return new this(e,-1,o)}static findByName(e,t){let n=e;if(!Array.isArray(e)){const i=e;n=i.geometry&&i.geometry.animations||i.animations}for(let i=0;i<n.length;i++)if(n[i].name===t)return n[i];return null}static CreateClipsFromMorphTargetSequences(e,t,n){const i={},s=/^([\w-]*?)([\d]+)$/;for(let a=0,c=e.length;a<c;a++){const l=e[a],h=l.name.match(s);if(h&&h.length>1){const d=h[1];let u=i[d];u||(i[d]=u=[]),u.push(l)}}const o=[];for(const a in i)o.push(this.CreateFromMorphTargetSequence(a,i[a],t,n));return o}static parseAnimation(e,t){if(Ie("AnimationClip: parseAnimation() is deprecated and will be removed with r185"),!e)return ze("AnimationClip: No animation in JSONLoader data."),null;const n=function(d,u,f,m,_){if(f.length!==0){const g=[],p=[];rh(f,g,p,m),g.length!==0&&_.push(new d(u,g,p))}},i=[],s=e.name||"default",o=e.fps||30,a=e.blendMode;let c=e.length||-1;const l=e.hierarchy||[];for(let d=0;d<l.length;d++){const u=l[d].keys;if(!(!u||u.length===0))if(u[0].morphTargets){const f={};let m;for(m=0;m<u.length;m++)if(u[m].morphTargets)for(let _=0;_<u[m].morphTargets.length;_++)f[u[m].morphTargets[_]]=-1;for(const _ in f){const g=[],p=[];for(let x=0;x!==u[m].morphTargets.length;++x){const S=u[m];g.push(S.time),p.push(S.morphTarget===_?1:0)}i.push(new es(".morphTargetInfluence["+_+"]",g,p))}c=f.length*o}else{const f=".bones["+t[d].name+"]";n(ns,f+".position",u,"pos",i),n(ts,f+".quaternion",u,"rot",i),n(ns,f+".scale",u,"scl",i)}}return i.length===0?null:new this(s,c,i,a)}resetDuration(){const e=this.tracks;let t=0;for(let n=0,i=e.length;n!==i;++n){const s=this.tracks[n];t=Math.max(t,s.times[s.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){const e=[];for(let n=0;n<this.tracks.length;n++)e.push(this.tracks[n].clone());const t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}}function bu(r){switch(r.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return es;case"vector":case"vector2":case"vector3":case"vector4":return ns;case"color":return oh;case"quaternion":return ts;case"bool":case"boolean":return ss;case"string":return rs}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+r)}function Mu(r){if(r.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const e=bu(r.type);if(r.times===void 0){const t=[],n=[];rh(r.keys,t,n,"value"),r.times=t,r.values=n}return e.parse!==void 0?e.parse(r):new e(r.name,r.times,r.values,r.interpolation)}const Gn={enabled:!1,files:{},add:function(r,e){this.enabled!==!1&&(this.files[r]=e)},get:function(r){if(this.enabled!==!1)return this.files[r]},remove:function(r){delete this.files[r]},clear:function(){this.files={}}};class Su{constructor(e,t,n){const i=this;let s=!1,o=0,a=0,c;const l=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(h){a++,s===!1&&i.onStart!==void 0&&i.onStart(h,o,a),s=!0},this.itemEnd=function(h){o++,i.onProgress!==void 0&&i.onProgress(h,o,a),o===a&&(s=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(h){i.onError!==void 0&&i.onError(h)},this.resolveURL=function(h){return c?c(h):h},this.setURLModifier=function(h){return c=h,this},this.addHandler=function(h,d){return l.push(h,d),this},this.removeHandler=function(h){const d=l.indexOf(h);return d!==-1&&l.splice(d,2),this},this.getHandler=function(h){for(let d=0,u=l.length;d<u;d+=2){const f=l[d],m=l[d+1];if(f.global&&(f.lastIndex=0),f.test(h))return m}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}}const wu=new Su;class os{constructor(e){this.manager=e!==void 0?e:wu,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){const n=this;return new Promise(function(i,s){n.load(e,i,t,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}}os.DEFAULT_MATERIAL_NAME="__DEFAULT";const Bn={};class Tu extends Error{constructor(e,t){super(e),this.response=t}}class ah extends os{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=Gn.get(`file:${e}`);if(s!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(s),this.manager.itemEnd(e)},0),s;if(Bn[e]!==void 0){Bn[e].push({onLoad:t,onProgress:n,onError:i});return}Bn[e]=[],Bn[e].push({onLoad:t,onProgress:n,onError:i});const o=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),a=this.mimeType,c=this.responseType;fetch(o).then(l=>{if(l.status===200||l.status===0){if(l.status===0&&Ie("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||l.body===void 0||l.body.getReader===void 0)return l;const h=Bn[e],d=l.body.getReader(),u=l.headers.get("X-File-Size")||l.headers.get("Content-Length"),f=u?parseInt(u):0,m=f!==0;let _=0;const g=new ReadableStream({start(p){x();function x(){d.read().then(({done:S,value:M})=>{if(S)p.close();else{_+=M.byteLength;const T=new ProgressEvent("progress",{lengthComputable:m,loaded:_,total:f});for(let E=0,R=h.length;E<R;E++){const D=h[E];D.onProgress&&D.onProgress(T)}p.enqueue(M),x()}},S=>{p.error(S)})}}});return new Response(g)}else throw new Tu(`fetch for "${l.url}" responded with ${l.status}: ${l.statusText}`,l)}).then(l=>{switch(c){case"arraybuffer":return l.arrayBuffer();case"blob":return l.blob();case"document":return l.text().then(h=>new DOMParser().parseFromString(h,a));case"json":return l.json();default:if(a==="")return l.text();{const d=/charset="?([^;"\s]*)"?/i.exec(a),u=d&&d[1]?d[1].toLowerCase():void 0,f=new TextDecoder(u);return l.arrayBuffer().then(m=>f.decode(m))}}}).then(l=>{Gn.add(`file:${e}`,l);const h=Bn[e];delete Bn[e];for(let d=0,u=h.length;d<u;d++){const f=h[d];f.onLoad&&f.onLoad(l)}}).catch(l=>{const h=Bn[e];if(h===void 0)throw this.manager.itemError(e),l;delete Bn[e];for(let d=0,u=h.length;d<u;d++){const f=h[d];f.onError&&f.onError(l)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}const zi=new WeakMap;class Eu extends os{constructor(e){super(e)}load(e,t,n,i){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=this,o=Gn.get(`image:${e}`);if(o!==void 0){if(o.complete===!0)s.manager.itemStart(e),setTimeout(function(){t&&t(o),s.manager.itemEnd(e)},0);else{let d=zi.get(o);d===void 0&&(d=[],zi.set(o,d)),d.push({onLoad:t,onError:i})}return o}const a=Ds("img");function c(){h(),t&&t(this);const d=zi.get(this)||[];for(let u=0;u<d.length;u++){const f=d[u];f.onLoad&&f.onLoad(this)}zi.delete(this),s.manager.itemEnd(e)}function l(d){h(),i&&i(d),Gn.remove(`image:${e}`);const u=zi.get(this)||[];for(let f=0;f<u.length;f++){const m=u[f];m.onError&&m.onError(d)}zi.delete(this),s.manager.itemError(e),s.manager.itemEnd(e)}function h(){a.removeEventListener("load",c,!1),a.removeEventListener("error",l,!1)}return a.addEventListener("load",c,!1),a.addEventListener("error",l,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),Gn.add(`image:${e}`,a),s.manager.itemStart(e),a.src=e,a}}class Au extends os{constructor(e){super(e)}load(e,t,n,i){const s=new Nt,o=new Eu(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(e,function(a){s.image=a,s.needsUpdate=!0,t!==void 0&&t(s)},n,i),s}}class Os extends Mt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Oe(e),this.intensity=t}dispose(){this.dispatchEvent({type:"dispose"})}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}class lh extends Os{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Mt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Oe(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){const t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}}const fo=new je,jl=new I,ql=new I;class ja{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Le(512,512),this.mapType=sn,this.map=null,this.mapPass=null,this.matrix=new je,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ga,this._frameExtents=new Le(1,1),this._viewportCount=1,this._viewports=[new bt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;jl.setFromMatrixPosition(e.matrixWorld),t.position.copy(jl),ql.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(ql),t.updateMatrixWorld(),fo.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(fo,t.coordinateSystem,t.reversedDepth),t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(fo)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class Ru extends ja{constructor(){super(new kt(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){const t=this.camera,n=Ji*2*e.angle*this.focus,i=this.mapSize.width/this.mapSize.height*this.aspect,s=e.distance||t.far;(n!==t.fov||i!==t.aspect||s!==t.far)&&(t.fov=n,t.aspect=i,t.far=s,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}}class bi extends Os{constructor(e,t,n=0,i=Math.PI/3,s=0,o=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(Mt.DEFAULT_UP),this.updateMatrix(),this.target=new Mt,this.distance=n,this.angle=i,this.penumbra=s,this.decay=o,this.map=null,this.shadow=new Ru}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}}class Cu extends ja{constructor(){super(new kt(90,1,.5,500)),this.isPointLightShadow=!0}}class Yi extends Os{constructor(e,t,n=0,i=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new Cu}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}}class Ir extends Jc{constructor(e=-1,t=1,n=1,i=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let s=n-e,o=n+e,a=i+t,c=i-t;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=l*this.view.offsetX,o=s+l*this.view.width,a-=h*this.view.offsetY,c=a-h*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class Pu extends ja{constructor(){super(new Ir(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class qa extends Os{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Mt.DEFAULT_UP),this.updateMatrix(),this.target=new Mt,this.shadow=new Pu}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}class ch extends Os{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}class As{static extractUrlBase(e){const t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}}const po=new WeakMap;class Lu extends os{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&Ie("ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&Ie("ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=this,o=Gn.get(`image-bitmap:${e}`);if(o!==void 0){if(s.manager.itemStart(e),o.then){o.then(l=>{if(po.has(o)===!0)i&&i(po.get(o)),s.manager.itemError(e),s.manager.itemEnd(e);else return t&&t(l),s.manager.itemEnd(e),l});return}return setTimeout(function(){t&&t(o),s.manager.itemEnd(e)},0),o}const a={};a.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",a.headers=this.requestHeader,a.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;const c=fetch(e,a).then(function(l){return l.blob()}).then(function(l){return createImageBitmap(l,Object.assign(s.options,{colorSpaceConversion:"none"}))}).then(function(l){return Gn.add(`image-bitmap:${e}`,l),t&&t(l),s.manager.itemEnd(e),l}).catch(function(l){i&&i(l),po.set(c,l),Gn.remove(`image-bitmap:${e}`),s.manager.itemError(e),s.manager.itemEnd(e)});Gn.add(`image-bitmap:${e}`,c),s.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}class Iu extends kt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}const Ka="\\[\\]\\.:\\/",Du=new RegExp("["+Ka+"]","g"),$a="[^"+Ka+"]",Nu="[^"+Ka.replace("\\.","")+"]",Uu=/((?:WC+[\/:])*)/.source.replace("WC",$a),Fu=/(WCOD+)?/.source.replace("WCOD",Nu),Ou=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",$a),Bu=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",$a),ku=new RegExp("^"+Uu+Fu+Ou+Bu+"$"),zu=["material","materials","bones","map"];class Gu{constructor(e,t,n){const i=n||ft.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,i)}getValue(e,t){this.bind();const n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(e,t)}setValue(e,t){const n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,s=n.length;i!==s;++i)n[i].setValue(e,t)}bind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}}class ft{constructor(e,t,n){this.path=t,this.parsedPath=n||ft.parseTrackName(t),this.node=ft.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new ft.Composite(e,t,n):new ft(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(Du,"")}static parseTrackName(e){const t=ku.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);const n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){const s=n.nodeName.substring(i+1);zu.indexOf(s)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=s)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){const n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){const n=function(s){for(let o=0;o<s.length;o++){const a=s[o];if(a.name===t||a.uuid===t)return a;const c=n(a.children);if(c)return c}return null},i=n(e.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){const n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)e[t++]=n[i]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){const n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++]}_setValue_array_setNeedsUpdate(e,t){const n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){const n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node;const t=this.parsedPath,n=t.objectName,i=t.propertyName;let s=t.propertyIndex;if(e||(e=ft.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){Ie("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=t.objectIndex;switch(n){case"materials":if(!e.material){ze("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){ze("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){ze("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===l){l=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){ze("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){ze("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){ze("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(l!==void 0){if(e[l]===void 0){ze("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[l]}}const o=e[i];if(o===void 0){const l=t.nodeName;ze("PropertyBinding: Trying to update property for track: "+l+"."+i+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?a=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(s!==void 0){if(i==="morphTargetInfluences"){if(!e.geometry){ze("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){ze("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[s]!==void 0&&(s=e.morphTargetDictionary[s])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=s}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}ft.Composite=Gu;ft.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};ft.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};ft.prototype.GetterByBindingType=[ft.prototype._getValue_direct,ft.prototype._getValue_array,ft.prototype._getValue_arrayElement,ft.prototype._getValue_toArray];ft.prototype.SetterByBindingTypeAndVersioning=[[ft.prototype._setValue_direct,ft.prototype._setValue_direct_setNeedsUpdate,ft.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ft.prototype._setValue_array,ft.prototype._setValue_array_setNeedsUpdate,ft.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ft.prototype._setValue_arrayElement,ft.prototype._setValue_arrayElement_setNeedsUpdate,ft.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ft.prototype._setValue_fromArray,ft.prototype._setValue_fromArray_setNeedsUpdate,ft.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];const Kl=new je;class Hu{constructor(e,t,n=0,i=1/0){this.ray=new is(e,t),this.near=n,this.far=i,this.camera=null,this.layers=new Oa,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):ze("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Kl.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Kl),this}intersectObject(e,t=!0,n=[]){return va(e,this,n,t),n.sort($l),n}intersectObjects(e,t=!0,n=[]){for(let i=0,s=e.length;i<s;i++)va(e[i],this,n,t);return n.sort($l),n}}function $l(r,e){return r.distance-e.distance}function va(r,e,t,n){let i=!0;if(r.layers.test(e.layers)&&r.raycast(e,t)===!1&&(i=!1),i===!0&&n===!0){const s=r.children;for(let o=0,a=s.length;o<a;o++)va(s[o],e,t,!0)}}class Zl{constructor(e=1,t=0,n=0){this.radius=e,this.phi=t,this.theta=n}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Ke(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(Ke(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class Vu extends Si{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){if(e===void 0){Ie("Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}}function Jl(r,e,t,n){const i=Wu(n);switch(t){case Hc:return r*e;case Ca:return r*e/i.components*i.byteLength;case Pa:return r*e/i.components*i.byteLength;case Zi:return r*e*2/i.components*i.byteLength;case La:return r*e*2/i.components*i.byteLength;case Vc:return r*e*3/i.components*i.byteLength;case hn:return r*e*4/i.components*i.byteLength;case Ia:return r*e*4/i.components*i.byteLength;case gr:case _r:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*8;case xr:case vr:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case Bo:case zo:return Math.max(r,16)*Math.max(e,8)/4;case Oo:case ko:return Math.max(r,8)*Math.max(e,8)/2;case Go:case Ho:case Wo:case Xo:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*8;case Vo:case Yo:case jo:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case qo:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case Ko:return Math.floor((r+4)/5)*Math.floor((e+3)/4)*16;case $o:return Math.floor((r+4)/5)*Math.floor((e+4)/5)*16;case Zo:return Math.floor((r+5)/6)*Math.floor((e+4)/5)*16;case Jo:return Math.floor((r+5)/6)*Math.floor((e+5)/6)*16;case Qo:return Math.floor((r+7)/8)*Math.floor((e+4)/5)*16;case ea:return Math.floor((r+7)/8)*Math.floor((e+5)/6)*16;case ta:return Math.floor((r+7)/8)*Math.floor((e+7)/8)*16;case na:return Math.floor((r+9)/10)*Math.floor((e+4)/5)*16;case ia:return Math.floor((r+9)/10)*Math.floor((e+5)/6)*16;case sa:return Math.floor((r+9)/10)*Math.floor((e+7)/8)*16;case ra:return Math.floor((r+9)/10)*Math.floor((e+9)/10)*16;case oa:return Math.floor((r+11)/12)*Math.floor((e+9)/10)*16;case aa:return Math.floor((r+11)/12)*Math.floor((e+11)/12)*16;case la:case ca:case ha:return Math.ceil(r/4)*Math.ceil(e/4)*16;case da:case ua:return Math.ceil(r/4)*Math.ceil(e/4)*8;case fa:case pa:return Math.ceil(r/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Wu(r){switch(r){case sn:case Bc:return{byteLength:1,components:1};case Cs:case kc:case Xn:return{byteLength:2,components:1};case Aa:case Ra:return{byteLength:2,components:4};case Rn:case Ea:case cn:return{byteLength:4,components:1};case zc:case Gc:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${r}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ta}}));typeof window<"u"&&(window.__THREE__?Ie("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ta);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function hh(){let r=null,e=!1,t=null,n=null;function i(s,o){t(s,o),n=r.requestAnimationFrame(i)}return{start:function(){e!==!0&&t!==null&&(n=r.requestAnimationFrame(i),e=!0)},stop:function(){r.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){r=s}}}function Xu(r){const e=new WeakMap;function t(a,c){const l=a.array,h=a.usage,d=l.byteLength,u=r.createBuffer();r.bindBuffer(c,u),r.bufferData(c,l,h),a.onUploadCallback();let f;if(l instanceof Float32Array)f=r.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)f=r.HALF_FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?f=r.HALF_FLOAT:f=r.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=r.SHORT;else if(l instanceof Uint32Array)f=r.UNSIGNED_INT;else if(l instanceof Int32Array)f=r.INT;else if(l instanceof Int8Array)f=r.BYTE;else if(l instanceof Uint8Array)f=r.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=r.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:u,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:d}}function n(a,c,l){const h=c.array,d=c.updateRanges;if(r.bindBuffer(l,a),d.length===0)r.bufferSubData(l,0,h);else{d.sort((f,m)=>f.start-m.start);let u=0;for(let f=1;f<d.length;f++){const m=d[u],_=d[f];_.start<=m.start+m.count+1?m.count=Math.max(m.count,_.start+_.count-m.start):(++u,d[u]=_)}d.length=u+1;for(let f=0,m=d.length;f<m;f++){const _=d[f];r.bufferSubData(l,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}c.clearUpdateRanges()}c.onUploadCallback()}function i(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function s(a){a.isInterleavedBufferAttribute&&(a=a.data);const c=e.get(a);c&&(r.deleteBuffer(c.buffer),e.delete(a))}function o(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const h=e.get(a);(!h||h.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const l=e.get(a);if(l===void 0)e.set(a,t(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,a,c),l.version=a.version}}return{get:i,remove:s,update:o}}var Yu=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,ju=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,qu=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Ku=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,$u=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Zu=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Ju=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Qu=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,ef=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,tf=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,nf=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,sf=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,rf=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,of=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,af=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,lf=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,cf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,hf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,df=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,uf=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,ff=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,pf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,mf=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,gf=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,_f=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,xf=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,vf=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,yf=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,bf=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Mf=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Sf="gl_FragColor = linearToOutputTexel( gl_FragColor );",wf=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Tf=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Ef=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Af=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Rf=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Cf=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Pf=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Lf=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,If=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Df=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Nf=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Uf=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Ff=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Of=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Bf=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,kf=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,zf=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Gf=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Hf=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Vf=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Wf=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Xf=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return v;
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( vec3( 1.0 ) - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Yf=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,jf=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,qf=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Kf=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,$f=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Zf=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Jf=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Qf=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,ep=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,tp=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,np=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,ip=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,sp=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,rp=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,op=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,ap=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,lp=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,cp=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,hp=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,dp=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,up=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,fp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,pp=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,mp=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,gp=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,_p=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,xp=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,vp=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,yp=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,bp=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Mp=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Sp=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,wp=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Tp=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Ep=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Ap=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Rp=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * 6.28318530718;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * 6.28318530718;
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 0, 5, phi ).x + bitangent * vogelDiskSample( 0, 5, phi ).y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 1, 5, phi ).x + bitangent * vogelDiskSample( 1, 5, phi ).y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 2, 5, phi ).x + bitangent * vogelDiskSample( 2, 5, phi ).y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 3, 5, phi ).x + bitangent * vogelDiskSample( 3, 5, phi ).y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 4, 5, phi ).x + bitangent * vogelDiskSample( 4, 5, phi ).y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadow = step( depth, dp );
			#else
				shadow = step( dp, depth );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,Cp=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Pp=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Lp=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Ip=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Dp=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Np=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Up=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Fp=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Op=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Bp=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,kp=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,zp=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Gp=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Hp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Vp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Wp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Xp=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Yp=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,jp=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,qp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Kp=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,$p=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Zp=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Jp=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Qp=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,em=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,tm=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,nm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,im=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,sm=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,rm=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,om=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,am=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,lm=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,cm=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,hm=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,dm=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,um=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,fm=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,pm=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,mm=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,gm=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,_m=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,xm=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,vm=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ym=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,bm=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Mm=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Sm=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,wm=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Tm=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ze={alphahash_fragment:Yu,alphahash_pars_fragment:ju,alphamap_fragment:qu,alphamap_pars_fragment:Ku,alphatest_fragment:$u,alphatest_pars_fragment:Zu,aomap_fragment:Ju,aomap_pars_fragment:Qu,batching_pars_vertex:ef,batching_vertex:tf,begin_vertex:nf,beginnormal_vertex:sf,bsdfs:rf,iridescence_fragment:of,bumpmap_pars_fragment:af,clipping_planes_fragment:lf,clipping_planes_pars_fragment:cf,clipping_planes_pars_vertex:hf,clipping_planes_vertex:df,color_fragment:uf,color_pars_fragment:ff,color_pars_vertex:pf,color_vertex:mf,common:gf,cube_uv_reflection_fragment:_f,defaultnormal_vertex:xf,displacementmap_pars_vertex:vf,displacementmap_vertex:yf,emissivemap_fragment:bf,emissivemap_pars_fragment:Mf,colorspace_fragment:Sf,colorspace_pars_fragment:wf,envmap_fragment:Tf,envmap_common_pars_fragment:Ef,envmap_pars_fragment:Af,envmap_pars_vertex:Rf,envmap_physical_pars_fragment:kf,envmap_vertex:Cf,fog_vertex:Pf,fog_pars_vertex:Lf,fog_fragment:If,fog_pars_fragment:Df,gradientmap_pars_fragment:Nf,lightmap_pars_fragment:Uf,lights_lambert_fragment:Ff,lights_lambert_pars_fragment:Of,lights_pars_begin:Bf,lights_toon_fragment:zf,lights_toon_pars_fragment:Gf,lights_phong_fragment:Hf,lights_phong_pars_fragment:Vf,lights_physical_fragment:Wf,lights_physical_pars_fragment:Xf,lights_fragment_begin:Yf,lights_fragment_maps:jf,lights_fragment_end:qf,logdepthbuf_fragment:Kf,logdepthbuf_pars_fragment:$f,logdepthbuf_pars_vertex:Zf,logdepthbuf_vertex:Jf,map_fragment:Qf,map_pars_fragment:ep,map_particle_fragment:tp,map_particle_pars_fragment:np,metalnessmap_fragment:ip,metalnessmap_pars_fragment:sp,morphinstance_vertex:rp,morphcolor_vertex:op,morphnormal_vertex:ap,morphtarget_pars_vertex:lp,morphtarget_vertex:cp,normal_fragment_begin:hp,normal_fragment_maps:dp,normal_pars_fragment:up,normal_pars_vertex:fp,normal_vertex:pp,normalmap_pars_fragment:mp,clearcoat_normal_fragment_begin:gp,clearcoat_normal_fragment_maps:_p,clearcoat_pars_fragment:xp,iridescence_pars_fragment:vp,opaque_fragment:yp,packing:bp,premultiplied_alpha_fragment:Mp,project_vertex:Sp,dithering_fragment:wp,dithering_pars_fragment:Tp,roughnessmap_fragment:Ep,roughnessmap_pars_fragment:Ap,shadowmap_pars_fragment:Rp,shadowmap_pars_vertex:Cp,shadowmap_vertex:Pp,shadowmask_pars_fragment:Lp,skinbase_vertex:Ip,skinning_pars_vertex:Dp,skinning_vertex:Np,skinnormal_vertex:Up,specularmap_fragment:Fp,specularmap_pars_fragment:Op,tonemapping_fragment:Bp,tonemapping_pars_fragment:kp,transmission_fragment:zp,transmission_pars_fragment:Gp,uv_pars_fragment:Hp,uv_pars_vertex:Vp,uv_vertex:Wp,worldpos_vertex:Xp,background_vert:Yp,background_frag:jp,backgroundCube_vert:qp,backgroundCube_frag:Kp,cube_vert:$p,cube_frag:Zp,depth_vert:Jp,depth_frag:Qp,distance_vert:em,distance_frag:tm,equirect_vert:nm,equirect_frag:im,linedashed_vert:sm,linedashed_frag:rm,meshbasic_vert:om,meshbasic_frag:am,meshlambert_vert:lm,meshlambert_frag:cm,meshmatcap_vert:hm,meshmatcap_frag:dm,meshnormal_vert:um,meshnormal_frag:fm,meshphong_vert:pm,meshphong_frag:mm,meshphysical_vert:gm,meshphysical_frag:_m,meshtoon_vert:xm,meshtoon_frag:vm,points_vert:ym,points_frag:bm,shadow_vert:Mm,shadow_frag:Sm,sprite_vert:wm,sprite_frag:Tm},_e={common:{diffuse:{value:new Oe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new qe},alphaMap:{value:null},alphaMapTransform:{value:new qe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new qe}},envmap:{envMap:{value:null},envMapRotation:{value:new qe},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new qe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new qe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new qe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new qe},normalScale:{value:new Le(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new qe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new qe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new qe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new qe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Oe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Oe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new qe},alphaTest:{value:0},uvTransform:{value:new qe}},sprite:{diffuse:{value:new Oe(16777215)},opacity:{value:1},center:{value:new Le(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new qe},alphaMap:{value:null},alphaMapTransform:{value:new qe},alphaTest:{value:0}}},Mn={basic:{uniforms:Wt([_e.common,_e.specularmap,_e.envmap,_e.aomap,_e.lightmap,_e.fog]),vertexShader:Ze.meshbasic_vert,fragmentShader:Ze.meshbasic_frag},lambert:{uniforms:Wt([_e.common,_e.specularmap,_e.envmap,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.fog,_e.lights,{emissive:{value:new Oe(0)}}]),vertexShader:Ze.meshlambert_vert,fragmentShader:Ze.meshlambert_frag},phong:{uniforms:Wt([_e.common,_e.specularmap,_e.envmap,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.fog,_e.lights,{emissive:{value:new Oe(0)},specular:{value:new Oe(1118481)},shininess:{value:30}}]),vertexShader:Ze.meshphong_vert,fragmentShader:Ze.meshphong_frag},standard:{uniforms:Wt([_e.common,_e.envmap,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.roughnessmap,_e.metalnessmap,_e.fog,_e.lights,{emissive:{value:new Oe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ze.meshphysical_vert,fragmentShader:Ze.meshphysical_frag},toon:{uniforms:Wt([_e.common,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.gradientmap,_e.fog,_e.lights,{emissive:{value:new Oe(0)}}]),vertexShader:Ze.meshtoon_vert,fragmentShader:Ze.meshtoon_frag},matcap:{uniforms:Wt([_e.common,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.fog,{matcap:{value:null}}]),vertexShader:Ze.meshmatcap_vert,fragmentShader:Ze.meshmatcap_frag},points:{uniforms:Wt([_e.points,_e.fog]),vertexShader:Ze.points_vert,fragmentShader:Ze.points_frag},dashed:{uniforms:Wt([_e.common,_e.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ze.linedashed_vert,fragmentShader:Ze.linedashed_frag},depth:{uniforms:Wt([_e.common,_e.displacementmap]),vertexShader:Ze.depth_vert,fragmentShader:Ze.depth_frag},normal:{uniforms:Wt([_e.common,_e.bumpmap,_e.normalmap,_e.displacementmap,{opacity:{value:1}}]),vertexShader:Ze.meshnormal_vert,fragmentShader:Ze.meshnormal_frag},sprite:{uniforms:Wt([_e.sprite,_e.fog]),vertexShader:Ze.sprite_vert,fragmentShader:Ze.sprite_frag},background:{uniforms:{uvTransform:{value:new qe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ze.background_vert,fragmentShader:Ze.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new qe}},vertexShader:Ze.backgroundCube_vert,fragmentShader:Ze.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ze.cube_vert,fragmentShader:Ze.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ze.equirect_vert,fragmentShader:Ze.equirect_frag},distance:{uniforms:Wt([_e.common,_e.displacementmap,{referencePosition:{value:new I},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ze.distance_vert,fragmentShader:Ze.distance_frag},shadow:{uniforms:Wt([_e.lights,_e.fog,{color:{value:new Oe(0)},opacity:{value:1}}]),vertexShader:Ze.shadow_vert,fragmentShader:Ze.shadow_frag}};Mn.physical={uniforms:Wt([Mn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new qe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new qe},clearcoatNormalScale:{value:new Le(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new qe},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new qe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new qe},sheen:{value:0},sheenColor:{value:new Oe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new qe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new qe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new qe},transmissionSamplerSize:{value:new Le},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new qe},attenuationDistance:{value:0},attenuationColor:{value:new Oe(0)},specularColor:{value:new Oe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new qe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new qe},anisotropyVector:{value:new Le},anisotropyMap:{value:null},anisotropyMapTransform:{value:new qe}}]),vertexShader:Ze.meshphysical_vert,fragmentShader:Ze.meshphysical_frag};const dr={r:0,b:0,g:0},fi=new Cn,Em=new je;function Am(r,e,t,n,i,s,o){const a=new Oe(0);let c=s===!0?0:1,l,h,d=null,u=0,f=null;function m(S){let M=S.isScene===!0?S.background:null;return M&&M.isTexture&&(M=(S.backgroundBlurriness>0?t:e).get(M)),M}function _(S){let M=!1;const T=m(S);T===null?p(a,c):T&&T.isColor&&(p(T,1),M=!0);const E=r.xr.getEnvironmentBlendMode();E==="additive"?n.buffers.color.setClear(0,0,0,1,o):E==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(r.autoClear||M)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),r.clear(r.autoClearColor,r.autoClearDepth,r.autoClearStencil))}function g(S,M){const T=m(M);T&&(T.isCubeTexture||T.mapping===Lr)?(h===void 0&&(h=new N(new ie(1,1,1),new Pn({name:"BackgroundCubeMaterial",uniforms:Qi(Mn.backgroundCube.uniforms),vertexShader:Mn.backgroundCube.vertexShader,fragmentShader:Mn.backgroundCube.fragmentShader,side:Jt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(E,R,D){this.matrixWorld.copyPosition(D.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(h)),fi.copy(M.backgroundRotation),fi.x*=-1,fi.y*=-1,fi.z*=-1,T.isCubeTexture&&T.isRenderTargetTexture===!1&&(fi.y*=-1,fi.z*=-1),h.material.uniforms.envMap.value=T,h.material.uniforms.flipEnvMap.value=T.isCubeTexture&&T.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=M.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Em.makeRotationFromEuler(fi)),h.material.toneMapped=nt.getTransfer(T.colorSpace)!==dt,(d!==T||u!==T.version||f!==r.toneMapping)&&(h.material.needsUpdate=!0,d=T,u=T.version,f=r.toneMapping),h.layers.enableAll(),S.unshift(h,h.geometry,h.material,0,0,null)):T&&T.isTexture&&(l===void 0&&(l=new N(new jn(2,2),new Pn({name:"BackgroundMaterial",uniforms:Qi(Mn.background.uniforms),vertexShader:Mn.background.vertexShader,fragmentShader:Mn.background.fragmentShader,side:Wn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=T,l.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,l.material.toneMapped=nt.getTransfer(T.colorSpace)!==dt,T.matrixAutoUpdate===!0&&T.updateMatrix(),l.material.uniforms.uvTransform.value.copy(T.matrix),(d!==T||u!==T.version||f!==r.toneMapping)&&(l.material.needsUpdate=!0,d=T,u=T.version,f=r.toneMapping),l.layers.enableAll(),S.unshift(l,l.geometry,l.material,0,0,null))}function p(S,M){S.getRGB(dr,Zc(r)),n.buffers.color.setClear(dr.r,dr.g,dr.b,M,o)}function x(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(S,M=1){a.set(S),c=M,p(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(S){c=S,p(a,c)},render:_,addToRenderList:g,dispose:x}}function Rm(r,e){const t=r.getParameter(r.MAX_VERTEX_ATTRIBS),n={},i=u(null);let s=i,o=!1;function a(b,L,k,z,j){let q=!1;const O=d(z,k,L);s!==O&&(s=O,l(s.object)),q=f(b,z,k,j),q&&m(b,z,k,j),j!==null&&e.update(j,r.ELEMENT_ARRAY_BUFFER),(q||o)&&(o=!1,M(b,L,k,z),j!==null&&r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,e.get(j).buffer))}function c(){return r.createVertexArray()}function l(b){return r.bindVertexArray(b)}function h(b){return r.deleteVertexArray(b)}function d(b,L,k){const z=k.wireframe===!0;let j=n[b.id];j===void 0&&(j={},n[b.id]=j);let q=j[L.id];q===void 0&&(q={},j[L.id]=q);let O=q[z];return O===void 0&&(O=u(c()),q[z]=O),O}function u(b){const L=[],k=[],z=[];for(let j=0;j<t;j++)L[j]=0,k[j]=0,z[j]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:L,enabledAttributes:k,attributeDivisors:z,object:b,attributes:{},index:null}}function f(b,L,k,z){const j=s.attributes,q=L.attributes;let O=0;const H=k.getAttributes();for(const se in H)if(H[se].location>=0){const ue=j[se];let be=q[se];if(be===void 0&&(se==="instanceMatrix"&&b.instanceMatrix&&(be=b.instanceMatrix),se==="instanceColor"&&b.instanceColor&&(be=b.instanceColor)),ue===void 0||ue.attribute!==be||be&&ue.data!==be.data)return!0;O++}return s.attributesNum!==O||s.index!==z}function m(b,L,k,z){const j={},q=L.attributes;let O=0;const H=k.getAttributes();for(const se in H)if(H[se].location>=0){let ue=q[se];ue===void 0&&(se==="instanceMatrix"&&b.instanceMatrix&&(ue=b.instanceMatrix),se==="instanceColor"&&b.instanceColor&&(ue=b.instanceColor));const be={};be.attribute=ue,ue&&ue.data&&(be.data=ue.data),j[se]=be,O++}s.attributes=j,s.attributesNum=O,s.index=z}function _(){const b=s.newAttributes;for(let L=0,k=b.length;L<k;L++)b[L]=0}function g(b){p(b,0)}function p(b,L){const k=s.newAttributes,z=s.enabledAttributes,j=s.attributeDivisors;k[b]=1,z[b]===0&&(r.enableVertexAttribArray(b),z[b]=1),j[b]!==L&&(r.vertexAttribDivisor(b,L),j[b]=L)}function x(){const b=s.newAttributes,L=s.enabledAttributes;for(let k=0,z=L.length;k<z;k++)L[k]!==b[k]&&(r.disableVertexAttribArray(k),L[k]=0)}function S(b,L,k,z,j,q,O){O===!0?r.vertexAttribIPointer(b,L,k,j,q):r.vertexAttribPointer(b,L,k,z,j,q)}function M(b,L,k,z){_();const j=z.attributes,q=k.getAttributes(),O=L.defaultAttributeValues;for(const H in q){const se=q[H];if(se.location>=0){let xe=j[H];if(xe===void 0&&(H==="instanceMatrix"&&b.instanceMatrix&&(xe=b.instanceMatrix),H==="instanceColor"&&b.instanceColor&&(xe=b.instanceColor)),xe!==void 0){const ue=xe.normalized,be=xe.itemSize,Ve=e.get(xe);if(Ve===void 0)continue;const Ye=Ve.buffer,vt=Ve.type,ct=Ve.bytesPerElement,Q=vt===r.INT||vt===r.UNSIGNED_INT||xe.gpuType===Ea;if(xe.isInterleavedBufferAttribute){const ee=xe.data,Se=ee.stride,Xe=xe.offset;if(ee.isInstancedInterleavedBuffer){for(let Ae=0;Ae<se.locationSize;Ae++)p(se.location+Ae,ee.meshPerAttribute);b.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=ee.meshPerAttribute*ee.count)}else for(let Ae=0;Ae<se.locationSize;Ae++)g(se.location+Ae);r.bindBuffer(r.ARRAY_BUFFER,Ye);for(let Ae=0;Ae<se.locationSize;Ae++)S(se.location+Ae,be/se.locationSize,vt,ue,Se*ct,(Xe+be/se.locationSize*Ae)*ct,Q)}else{if(xe.isInstancedBufferAttribute){for(let ee=0;ee<se.locationSize;ee++)p(se.location+ee,xe.meshPerAttribute);b.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=xe.meshPerAttribute*xe.count)}else for(let ee=0;ee<se.locationSize;ee++)g(se.location+ee);r.bindBuffer(r.ARRAY_BUFFER,Ye);for(let ee=0;ee<se.locationSize;ee++)S(se.location+ee,be/se.locationSize,vt,ue,be*ct,be/se.locationSize*ee*ct,Q)}}else if(O!==void 0){const ue=O[H];if(ue!==void 0)switch(ue.length){case 2:r.vertexAttrib2fv(se.location,ue);break;case 3:r.vertexAttrib3fv(se.location,ue);break;case 4:r.vertexAttrib4fv(se.location,ue);break;default:r.vertexAttrib1fv(se.location,ue)}}}}x()}function T(){D();for(const b in n){const L=n[b];for(const k in L){const z=L[k];for(const j in z)h(z[j].object),delete z[j];delete L[k]}delete n[b]}}function E(b){if(n[b.id]===void 0)return;const L=n[b.id];for(const k in L){const z=L[k];for(const j in z)h(z[j].object),delete z[j];delete L[k]}delete n[b.id]}function R(b){for(const L in n){const k=n[L];if(k[b.id]===void 0)continue;const z=k[b.id];for(const j in z)h(z[j].object),delete z[j];delete k[b.id]}}function D(){y(),o=!0,s!==i&&(s=i,l(s.object))}function y(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:a,reset:D,resetDefaultState:y,dispose:T,releaseStatesOfGeometry:E,releaseStatesOfProgram:R,initAttributes:_,enableAttribute:g,disableUnusedAttributes:x}}function Cm(r,e,t){let n;function i(l){n=l}function s(l,h){r.drawArrays(n,l,h),t.update(h,n,1)}function o(l,h,d){d!==0&&(r.drawArraysInstanced(n,l,h,d),t.update(h,n,d))}function a(l,h,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,h,0,d);let f=0;for(let m=0;m<d;m++)f+=h[m];t.update(f,n,1)}function c(l,h,d,u){if(d===0)return;const f=e.get("WEBGL_multi_draw");if(f===null)for(let m=0;m<l.length;m++)o(l[m],h[m],u[m]);else{f.multiDrawArraysInstancedWEBGL(n,l,0,h,0,u,0,d);let m=0;for(let _=0;_<d;_++)m+=h[_]*u[_];t.update(m,n,1)}}this.setMode=i,this.render=s,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=c}function Pm(r,e,t,n){let i;function s(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){const R=e.get("EXT_texture_filter_anisotropic");i=r.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(R){return!(R!==hn&&n.convert(R)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(R){const D=R===Xn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(R!==sn&&n.convert(R)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==cn&&!D)}function c(R){if(R==="highp"){if(r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.HIGH_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.MEDIUM_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp";const h=c(l);h!==l&&(Ie("WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const d=t.logarithmicDepthBuffer===!0,u=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),f=r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS),m=r.getParameter(r.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=r.getParameter(r.MAX_TEXTURE_SIZE),g=r.getParameter(r.MAX_CUBE_MAP_TEXTURE_SIZE),p=r.getParameter(r.MAX_VERTEX_ATTRIBS),x=r.getParameter(r.MAX_VERTEX_UNIFORM_VECTORS),S=r.getParameter(r.MAX_VARYING_VECTORS),M=r.getParameter(r.MAX_FRAGMENT_UNIFORM_VECTORS),T=r.getParameter(r.MAX_SAMPLES),E=r.getParameter(r.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:u,maxTextures:f,maxVertexTextures:m,maxTextureSize:_,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:x,maxVaryings:S,maxFragmentUniforms:M,maxSamples:T,samples:E}}function Lm(r){const e=this;let t=null,n=0,i=!1,s=!1;const o=new ni,a=new qe,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){const f=d.length!==0||u||n!==0||i;return i=u,n=d.length,f},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(d,u){t=h(d,u,0)},this.setState=function(d,u,f){const m=d.clippingPlanes,_=d.clipIntersection,g=d.clipShadows,p=r.get(d);if(!i||m===null||m.length===0||s&&!g)s?h(null):l();else{const x=s?0:n,S=x*4;let M=p.clippingState||null;c.value=M,M=h(m,u,S,f);for(let T=0;T!==S;++T)M[T]=t[T];p.clippingState=M,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=x}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(d,u,f,m){const _=d!==null?d.length:0;let g=null;if(_!==0){if(g=c.value,m!==!0||g===null){const p=f+_*4,x=u.matrixWorldInverse;a.getNormalMatrix(x),(g===null||g.length<p)&&(g=new Float32Array(p));for(let S=0,M=f;S!==_;++S,M+=4)o.copy(d[S]).applyMatrix4(x,a),o.normal.toArray(g,M),g[M+3]=o.constant}c.value=g,c.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,g}}function Im(r){let e=new WeakMap;function t(o,a){return a===Uo?o.mapping=Mi:a===Fo&&(o.mapping=Ki),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===Uo||a===Fo)if(e.has(o)){const c=e.get(o).texture;return t(c,o.mapping)}else{const c=o.image;if(c&&c.height>0){const l=new eh(c.height);return l.fromEquirectangularTexture(r,o),e.set(o,l),o.addEventListener("dispose",i),t(l.texture,o.mapping)}else return null}}return o}function i(o){const a=o.target;a.removeEventListener("dispose",i);const c=e.get(a);c!==void 0&&(e.delete(a),c.dispose())}function s(){e=new WeakMap}return{get:n,dispose:s}}const ri=4,Ql=[.125,.215,.35,.446,.526,.582],_i=20,Dm=256,xs=new Ir,ec=new Oe;let mo=null,go=0,_o=0,xo=!1;const Nm=new I;class tc{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,i=100,s={}){const{size:o=256,position:a=Nm}=s;mo=this._renderer.getRenderTarget(),go=this._renderer.getActiveCubeFace(),_o=this._renderer.getActiveMipmapLevel(),xo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,n,i,c,a),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=sc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=ic(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(mo,go,_o),this._renderer.xr.enabled=xo,e.scissorTest=!1,Gi(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Mi||e.mapping===Ki?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),mo=this._renderer.getRenderTarget(),go=this._renderer.getActiveCubeFace(),_o=this._renderer.getActiveMipmapLevel(),xo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Dt,minFilter:Dt,generateMipmaps:!1,type:Xn,format:hn,colorSpace:Xt,depthBuffer:!1},i=nc(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=nc(e,t,n);const{_lodMax:s}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=Um(s)),this._blurMaterial=Om(s,e,t),this._ggxMaterial=Fm(s,e,t)}return i}_compileMaterial(e){const t=new N(new lt,e);this._renderer.compile(t,xs)}_sceneToCubeUV(e,t,n,i,s){const c=new kt(90,1,t,n),l=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],d=this._renderer,u=d.autoClear,f=d.toneMapping;d.getClearColor(ec),d.toneMapping=Tn,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(i),d.clearDepth(),d.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new N(new ie,new gt({name:"PMREM.Background",side:Jt,depthWrite:!1,depthTest:!1})));const _=this._backgroundBox,g=_.material;let p=!1;const x=e.background;x?x.isColor&&(g.color.copy(x),e.background=null,p=!0):(g.color.copy(ec),p=!0);for(let S=0;S<6;S++){const M=S%3;M===0?(c.up.set(0,l[S],0),c.position.set(s.x,s.y,s.z),c.lookAt(s.x+h[S],s.y,s.z)):M===1?(c.up.set(0,0,l[S]),c.position.set(s.x,s.y,s.z),c.lookAt(s.x,s.y+h[S],s.z)):(c.up.set(0,l[S],0),c.position.set(s.x,s.y,s.z),c.lookAt(s.x,s.y,s.z+h[S]));const T=this._cubeSize;Gi(i,M*T,S>2?T:0,T,T),d.setRenderTarget(i),p&&d.render(_,c),d.render(e,c)}d.toneMapping=f,d.autoClear=u,e.background=x}_textureToCubeUV(e,t){const n=this._renderer,i=e.mapping===Mi||e.mapping===Ki;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=sc()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=ic());const s=i?this._cubemapMaterial:this._equirectMaterial,o=this._lodMeshes[0];o.material=s;const a=s.uniforms;a.envMap.value=e;const c=this._cubeSize;Gi(t,0,0,3*c,2*c),n.setRenderTarget(t),n.render(o,xs)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const i=this._lodMeshes.length;for(let s=1;s<i;s++)this._applyGGXFilter(e,s-1,s);t.autoClear=n}_applyGGXFilter(e,t,n){const i=this._renderer,s=this._pingPongRenderTarget,o=this._ggxMaterial,a=this._lodMeshes[n];a.material=o;const c=o.uniforms,l=n/(this._lodMeshes.length-1),h=t/(this._lodMeshes.length-1),d=Math.sqrt(l*l-h*h),u=0+l*1.25,f=d*u,{_lodMax:m}=this,_=this._sizeLods[n],g=3*_*(n>m-ri?n-m+ri:0),p=4*(this._cubeSize-_);c.envMap.value=e.texture,c.roughness.value=f,c.mipInt.value=m-t,Gi(s,g,p,3*_,2*_),i.setRenderTarget(s),i.render(a,xs),c.envMap.value=s.texture,c.roughness.value=0,c.mipInt.value=m-n,Gi(e,g,p,3*_,2*_),i.setRenderTarget(e),i.render(a,xs)}_blur(e,t,n,i,s){const o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,i,"latitudinal",s),this._halfBlur(o,e,n,n,i,"longitudinal",s)}_halfBlur(e,t,n,i,s,o,a){const c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&ze("blur direction must be either latitudinal or longitudinal!");const h=3,d=this._lodMeshes[i];d.material=l;const u=l.uniforms,f=this._sizeLods[n]-1,m=isFinite(s)?Math.PI/(2*f):2*Math.PI/(2*_i-1),_=s/m,g=isFinite(s)?1+Math.floor(h*_):_i;g>_i&&Ie(`sigmaRadians, ${s}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${_i}`);const p=[];let x=0;for(let R=0;R<_i;++R){const D=R/_,y=Math.exp(-D*D/2);p.push(y),R===0?x+=y:R<g&&(x+=2*y)}for(let R=0;R<p.length;R++)p[R]=p[R]/x;u.envMap.value=e.texture,u.samples.value=g,u.weights.value=p,u.latitudinal.value=o==="latitudinal",a&&(u.poleAxis.value=a);const{_lodMax:S}=this;u.dTheta.value=m,u.mipInt.value=S-n;const M=this._sizeLods[i],T=3*M*(i>S-ri?i-S+ri:0),E=4*(this._cubeSize-M);Gi(t,T,E,3*M,2*M),c.setRenderTarget(t),c.render(d,xs)}}function Um(r){const e=[],t=[],n=[];let i=r;const s=r-ri+1+Ql.length;for(let o=0;o<s;o++){const a=Math.pow(2,i);e.push(a);let c=1/a;o>r-ri?c=Ql[o-r+ri-1]:o===0&&(c=0),t.push(c);const l=1/(a-2),h=-l,d=1+l,u=[h,h,d,h,d,d,h,h,d,d,h,d],f=6,m=6,_=3,g=2,p=1,x=new Float32Array(_*m*f),S=new Float32Array(g*m*f),M=new Float32Array(p*m*f);for(let E=0;E<f;E++){const R=E%3*2/3-1,D=E>2?0:-1,y=[R,D,0,R+2/3,D,0,R+2/3,D+1,0,R,D,0,R+2/3,D+1,0,R,D+1,0];x.set(y,_*m*E),S.set(u,g*m*E);const b=[E,E,E,E,E,E];M.set(b,p*m*E)}const T=new lt;T.setAttribute("position",new Rt(x,_)),T.setAttribute("uv",new Rt(S,g)),T.setAttribute("faceIndex",new Rt(M,p)),n.push(new N(T,null)),i>ri&&i--}return{lodMeshes:n,sizeLods:e,sigmas:t}}function nc(r,e,t){const n=new En(r,e,t);return n.texture.mapping=Lr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Gi(r,e,t,n,i){r.viewport.set(e,t,n,i),r.scissor.set(e,t,n,i)}function Fm(r,e,t){return new Pn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:Dm,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Dr(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 3.2: Transform view direction to hemisphere configuration
				vec3 Vh = normalize(vec3(alpha * V.x, alpha * V.y, V.z));

				// Section 4.1: Orthonormal basis
				float lensq = Vh.x * Vh.x + Vh.y * Vh.y;
				vec3 T1 = lensq > 0.0 ? vec3(-Vh.y, Vh.x, 0.0) / sqrt(lensq) : vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(Vh, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + Vh.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * Vh;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:Hn,depthTest:!1,depthWrite:!1})}function Om(r,e,t){const n=new Float32Array(_i),i=new I(0,1,0);return new Pn({name:"SphericalGaussianBlur",defines:{n:_i,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:Dr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Hn,depthTest:!1,depthWrite:!1})}function ic(){return new Pn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Dr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Hn,depthTest:!1,depthWrite:!1})}function sc(){return new Pn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Dr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Hn,depthTest:!1,depthWrite:!1})}function Dr(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Bm(r){let e=new WeakMap,t=null;function n(a){if(a&&a.isTexture){const c=a.mapping,l=c===Uo||c===Fo,h=c===Mi||c===Ki;if(l||h){let d=e.get(a);const u=d!==void 0?d.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==u)return t===null&&(t=new tc(r)),d=l?t.fromEquirectangular(a,d):t.fromCubemap(a,d),d.texture.pmremVersion=a.pmremVersion,e.set(a,d),d.texture;if(d!==void 0)return d.texture;{const f=a.image;return l&&f&&f.height>0||h&&f&&i(f)?(t===null&&(t=new tc(r)),d=l?t.fromEquirectangular(a):t.fromCubemap(a),d.texture.pmremVersion=a.pmremVersion,e.set(a,d),a.addEventListener("dispose",s),d.texture):null}}}return a}function i(a){let c=0;const l=6;for(let h=0;h<l;h++)a[h]!==void 0&&c++;return c===l}function s(a){const c=a.target;c.removeEventListener("dispose",s);const l=e.get(c);l!==void 0&&(e.delete(c),l.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:o}}function km(r){const e={};function t(n){if(e[n]!==void 0)return e[n];const i=r.getExtension(n);return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const i=t(n);return i===null&&Ns("WebGLRenderer: "+n+" extension not supported."),i}}}function zm(r,e,t,n){const i={},s=new WeakMap;function o(d){const u=d.target;u.index!==null&&e.remove(u.index);for(const m in u.attributes)e.remove(u.attributes[m]);u.removeEventListener("dispose",o),delete i[u.id];const f=s.get(u);f&&(e.remove(f),s.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,t.memory.geometries--}function a(d,u){return i[u.id]===!0||(u.addEventListener("dispose",o),i[u.id]=!0,t.memory.geometries++),u}function c(d){const u=d.attributes;for(const f in u)e.update(u[f],r.ARRAY_BUFFER)}function l(d){const u=[],f=d.index,m=d.attributes.position;let _=0;if(f!==null){const x=f.array;_=f.version;for(let S=0,M=x.length;S<M;S+=3){const T=x[S+0],E=x[S+1],R=x[S+2];u.push(T,E,E,R,R,T)}}else if(m!==void 0){const x=m.array;_=m.version;for(let S=0,M=x.length/3-1;S<M;S+=3){const T=S+0,E=S+1,R=S+2;u.push(T,E,E,R,R,T)}}else return;const g=new(Yc(u)?$c:Kc)(u,1);g.version=_;const p=s.get(d);p&&e.remove(p),s.set(d,g)}function h(d){const u=s.get(d);if(u){const f=d.index;f!==null&&u.version<f.version&&l(d)}else l(d);return s.get(d)}return{get:a,update:c,getWireframeAttribute:h}}function Gm(r,e,t){let n;function i(u){n=u}let s,o;function a(u){s=u.type,o=u.bytesPerElement}function c(u,f){r.drawElements(n,f,s,u*o),t.update(f,n,1)}function l(u,f,m){m!==0&&(r.drawElementsInstanced(n,f,s,u*o,m),t.update(f,n,m))}function h(u,f,m){if(m===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,s,u,0,m);let g=0;for(let p=0;p<m;p++)g+=f[p];t.update(g,n,1)}function d(u,f,m,_){if(m===0)return;const g=e.get("WEBGL_multi_draw");if(g===null)for(let p=0;p<u.length;p++)l(u[p]/o,f[p],_[p]);else{g.multiDrawElementsInstancedWEBGL(n,f,0,s,u,0,_,0,m);let p=0;for(let x=0;x<m;x++)p+=f[x]*_[x];t.update(p,n,1)}}this.setMode=i,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=d}function Hm(r){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,o,a){switch(t.calls++,o){case r.TRIANGLES:t.triangles+=a*(s/3);break;case r.LINES:t.lines+=a*(s/2);break;case r.LINE_STRIP:t.lines+=a*(s-1);break;case r.LINE_LOOP:t.lines+=a*s;break;case r.POINTS:t.points+=a*s;break;default:ze("WebGLInfo: Unknown draw mode:",o);break}}function i(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function Vm(r,e,t){const n=new WeakMap,i=new bt;function s(o,a,c){const l=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,d=h!==void 0?h.length:0;let u=n.get(a);if(u===void 0||u.count!==d){let b=function(){D.dispose(),n.delete(a),a.removeEventListener("dispose",b)};var f=b;u!==void 0&&u.texture.dispose();const m=a.morphAttributes.position!==void 0,_=a.morphAttributes.normal!==void 0,g=a.morphAttributes.color!==void 0,p=a.morphAttributes.position||[],x=a.morphAttributes.normal||[],S=a.morphAttributes.color||[];let M=0;m===!0&&(M=1),_===!0&&(M=2),g===!0&&(M=3);let T=a.attributes.position.count*M,E=1;T>e.maxTextureSize&&(E=Math.ceil(T/e.maxTextureSize),T=e.maxTextureSize);const R=new Float32Array(T*E*4*d),D=new jc(R,T,E,d);D.type=cn,D.needsUpdate=!0;const y=M*4;for(let L=0;L<d;L++){const k=p[L],z=x[L],j=S[L],q=T*E*4*L;for(let O=0;O<k.count;O++){const H=O*y;m===!0&&(i.fromBufferAttribute(k,O),R[q+H+0]=i.x,R[q+H+1]=i.y,R[q+H+2]=i.z,R[q+H+3]=0),_===!0&&(i.fromBufferAttribute(z,O),R[q+H+4]=i.x,R[q+H+5]=i.y,R[q+H+6]=i.z,R[q+H+7]=0),g===!0&&(i.fromBufferAttribute(j,O),R[q+H+8]=i.x,R[q+H+9]=i.y,R[q+H+10]=i.z,R[q+H+11]=j.itemSize===4?i.w:1)}}u={count:d,texture:D,size:new Le(T,E)},n.set(a,u),a.addEventListener("dispose",b)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(r,"morphTexture",o.morphTexture,t);else{let m=0;for(let g=0;g<l.length;g++)m+=l[g];const _=a.morphTargetsRelative?1:1-m;c.getUniforms().setValue(r,"morphTargetBaseInfluence",_),c.getUniforms().setValue(r,"morphTargetInfluences",l)}c.getUniforms().setValue(r,"morphTargetsTexture",u.texture,t),c.getUniforms().setValue(r,"morphTargetsTextureSize",u.size)}return{update:s}}function Wm(r,e,t,n){let i=new WeakMap;function s(c){const l=n.render.frame,h=c.geometry,d=e.get(c,h);if(i.get(d)!==l&&(e.update(d),i.set(d,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),i.get(c)!==l&&(t.update(c.instanceMatrix,r.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,r.ARRAY_BUFFER),i.set(c,l))),c.isSkinnedMesh){const u=c.skeleton;i.get(u)!==l&&(u.update(),i.set(u,l))}return d}function o(){i=new WeakMap}function a(c){const l=c.target;l.removeEventListener("dispose",a),t.remove(l.instanceMatrix),l.instanceColor!==null&&t.remove(l.instanceColor)}return{update:s,dispose:o}}const Xm={[Pc]:"LINEAR_TONE_MAPPING",[Lc]:"REINHARD_TONE_MAPPING",[Ic]:"CINEON_TONE_MAPPING",[Pr]:"ACES_FILMIC_TONE_MAPPING",[Nc]:"AGX_TONE_MAPPING",[Uc]:"NEUTRAL_TONE_MAPPING",[Dc]:"CUSTOM_TONE_MAPPING"};function Ym(r,e,t,n,i){const s=new En(e,t,{type:r,depthBuffer:n,stencilBuffer:i}),o=new En(e,t,{type:Xn,depthBuffer:!1,stencilBuffer:!1}),a=new lt;a.setAttribute("position",new at([-1,3,0,-1,-1,0,3,-1,0],3)),a.setAttribute("uv",new at([0,2,0,0,2,0],2));const c=new uu({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),l=new N(a,c),h=new Ir(-1,1,1,-1,0,1);let d=null,u=null,f=!1,m,_=null,g=[],p=!1;this.setSize=function(x,S){s.setSize(x,S),o.setSize(x,S);for(let M=0;M<g.length;M++){const T=g[M];T.setSize&&T.setSize(x,S)}},this.setEffects=function(x){g=x,p=g.length>0&&g[0].isRenderPass===!0;const S=s.width,M=s.height;for(let T=0;T<g.length;T++){const E=g[T];E.setSize&&E.setSize(S,M)}},this.begin=function(x,S){if(f||x.toneMapping===Tn&&g.length===0)return!1;if(_=S,S!==null){const M=S.width,T=S.height;(s.width!==M||s.height!==T)&&this.setSize(M,T)}return p===!1&&x.setRenderTarget(s),m=x.toneMapping,x.toneMapping=Tn,!0},this.hasRenderPass=function(){return p},this.end=function(x,S){x.toneMapping=m,f=!0;let M=s,T=o;for(let E=0;E<g.length;E++){const R=g[E];if(R.enabled!==!1&&(R.render(x,T,M,S),R.needsSwap!==!1)){const D=M;M=T,T=D}}if(d!==x.outputColorSpace||u!==x.toneMapping){d=x.outputColorSpace,u=x.toneMapping,c.defines={},nt.getTransfer(d)===dt&&(c.defines.SRGB_TRANSFER="");const E=Xm[u];E&&(c.defines[E]=""),c.needsUpdate=!0}c.uniforms.tDiffuse.value=M.texture,x.setRenderTarget(_),x.render(l,h),_=null,f=!1},this.isCompositing=function(){return f},this.dispose=function(){s.dispose(),o.dispose(),a.dispose(),c.dispose()}}const dh=new Nt,ya=new Us(1,1),uh=new jc,fh=new Nd,ph=new Qc,rc=[],oc=[],ac=new Float32Array(16),lc=new Float32Array(9),cc=new Float32Array(4);function as(r,e,t){const n=r[0];if(n<=0||n>0)return r;const i=e*t;let s=rc[i];if(s===void 0&&(s=new Float32Array(i),rc[i]=s),e!==0){n.toArray(s,0);for(let o=1,a=0;o!==e;++o)a+=t,r[o].toArray(s,a)}return s}function Ut(r,e){if(r.length!==e.length)return!1;for(let t=0,n=r.length;t<n;t++)if(r[t]!==e[t])return!1;return!0}function Ft(r,e){for(let t=0,n=e.length;t<n;t++)r[t]=e[t]}function Nr(r,e){let t=oc[e];t===void 0&&(t=new Int32Array(e),oc[e]=t);for(let n=0;n!==e;++n)t[n]=r.allocateTextureUnit();return t}function jm(r,e){const t=this.cache;t[0]!==e&&(r.uniform1f(this.addr,e),t[0]=e)}function qm(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ut(t,e))return;r.uniform2fv(this.addr,e),Ft(t,e)}}function Km(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(r.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Ut(t,e))return;r.uniform3fv(this.addr,e),Ft(t,e)}}function $m(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ut(t,e))return;r.uniform4fv(this.addr,e),Ft(t,e)}}function Zm(r,e){const t=this.cache,n=e.elements;if(n===void 0){if(Ut(t,e))return;r.uniformMatrix2fv(this.addr,!1,e),Ft(t,e)}else{if(Ut(t,n))return;cc.set(n),r.uniformMatrix2fv(this.addr,!1,cc),Ft(t,n)}}function Jm(r,e){const t=this.cache,n=e.elements;if(n===void 0){if(Ut(t,e))return;r.uniformMatrix3fv(this.addr,!1,e),Ft(t,e)}else{if(Ut(t,n))return;lc.set(n),r.uniformMatrix3fv(this.addr,!1,lc),Ft(t,n)}}function Qm(r,e){const t=this.cache,n=e.elements;if(n===void 0){if(Ut(t,e))return;r.uniformMatrix4fv(this.addr,!1,e),Ft(t,e)}else{if(Ut(t,n))return;ac.set(n),r.uniformMatrix4fv(this.addr,!1,ac),Ft(t,n)}}function e0(r,e){const t=this.cache;t[0]!==e&&(r.uniform1i(this.addr,e),t[0]=e)}function t0(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ut(t,e))return;r.uniform2iv(this.addr,e),Ft(t,e)}}function n0(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ut(t,e))return;r.uniform3iv(this.addr,e),Ft(t,e)}}function i0(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ut(t,e))return;r.uniform4iv(this.addr,e),Ft(t,e)}}function s0(r,e){const t=this.cache;t[0]!==e&&(r.uniform1ui(this.addr,e),t[0]=e)}function r0(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ut(t,e))return;r.uniform2uiv(this.addr,e),Ft(t,e)}}function o0(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ut(t,e))return;r.uniform3uiv(this.addr,e),Ft(t,e)}}function a0(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ut(t,e))return;r.uniform4uiv(this.addr,e),Ft(t,e)}}function l0(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i);let s;this.type===r.SAMPLER_2D_SHADOW?(ya.compareFunction=t.isReversedDepthBuffer()?Na:Da,s=ya):s=dh,t.setTexture2D(e||s,i)}function c0(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||fh,i)}function h0(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTextureCube(e||ph,i)}function d0(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||uh,i)}function u0(r){switch(r){case 5126:return jm;case 35664:return qm;case 35665:return Km;case 35666:return $m;case 35674:return Zm;case 35675:return Jm;case 35676:return Qm;case 5124:case 35670:return e0;case 35667:case 35671:return t0;case 35668:case 35672:return n0;case 35669:case 35673:return i0;case 5125:return s0;case 36294:return r0;case 36295:return o0;case 36296:return a0;case 35678:case 36198:case 36298:case 36306:case 35682:return l0;case 35679:case 36299:case 36307:return c0;case 35680:case 36300:case 36308:case 36293:return h0;case 36289:case 36303:case 36311:case 36292:return d0}}function f0(r,e){r.uniform1fv(this.addr,e)}function p0(r,e){const t=as(e,this.size,2);r.uniform2fv(this.addr,t)}function m0(r,e){const t=as(e,this.size,3);r.uniform3fv(this.addr,t)}function g0(r,e){const t=as(e,this.size,4);r.uniform4fv(this.addr,t)}function _0(r,e){const t=as(e,this.size,4);r.uniformMatrix2fv(this.addr,!1,t)}function x0(r,e){const t=as(e,this.size,9);r.uniformMatrix3fv(this.addr,!1,t)}function v0(r,e){const t=as(e,this.size,16);r.uniformMatrix4fv(this.addr,!1,t)}function y0(r,e){r.uniform1iv(this.addr,e)}function b0(r,e){r.uniform2iv(this.addr,e)}function M0(r,e){r.uniform3iv(this.addr,e)}function S0(r,e){r.uniform4iv(this.addr,e)}function w0(r,e){r.uniform1uiv(this.addr,e)}function T0(r,e){r.uniform2uiv(this.addr,e)}function E0(r,e){r.uniform3uiv(this.addr,e)}function A0(r,e){r.uniform4uiv(this.addr,e)}function R0(r,e,t){const n=this.cache,i=e.length,s=Nr(t,i);Ut(n,s)||(r.uniform1iv(this.addr,s),Ft(n,s));let o;this.type===r.SAMPLER_2D_SHADOW?o=ya:o=dh;for(let a=0;a!==i;++a)t.setTexture2D(e[a]||o,s[a])}function C0(r,e,t){const n=this.cache,i=e.length,s=Nr(t,i);Ut(n,s)||(r.uniform1iv(this.addr,s),Ft(n,s));for(let o=0;o!==i;++o)t.setTexture3D(e[o]||fh,s[o])}function P0(r,e,t){const n=this.cache,i=e.length,s=Nr(t,i);Ut(n,s)||(r.uniform1iv(this.addr,s),Ft(n,s));for(let o=0;o!==i;++o)t.setTextureCube(e[o]||ph,s[o])}function L0(r,e,t){const n=this.cache,i=e.length,s=Nr(t,i);Ut(n,s)||(r.uniform1iv(this.addr,s),Ft(n,s));for(let o=0;o!==i;++o)t.setTexture2DArray(e[o]||uh,s[o])}function I0(r){switch(r){case 5126:return f0;case 35664:return p0;case 35665:return m0;case 35666:return g0;case 35674:return _0;case 35675:return x0;case 35676:return v0;case 5124:case 35670:return y0;case 35667:case 35671:return b0;case 35668:case 35672:return M0;case 35669:case 35673:return S0;case 5125:return w0;case 36294:return T0;case 36295:return E0;case 36296:return A0;case 35678:case 36198:case 36298:case 36306:case 35682:return R0;case 35679:case 36299:case 36307:return C0;case 35680:case 36300:case 36308:case 36293:return P0;case 36289:case 36303:case 36311:case 36292:return L0}}class D0{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=u0(t.type)}}class N0{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=I0(t.type)}}class U0{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const i=this.seq;for(let s=0,o=i.length;s!==o;++s){const a=i[s];a.setValue(e,t[a.id],n)}}}const vo=/(\w+)(\])?(\[|\.)?/g;function hc(r,e){r.seq.push(e),r.map[e.id]=e}function F0(r,e,t){const n=r.name,i=n.length;for(vo.lastIndex=0;;){const s=vo.exec(n),o=vo.lastIndex;let a=s[1];const c=s[2]==="]",l=s[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===i){hc(t,l===void 0?new D0(a,r,e):new N0(a,r,e));break}else{let d=t.map[a];d===void 0&&(d=new U0(a),hc(t,d)),t=d}}}class yr{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let o=0;o<n;++o){const a=e.getActiveUniform(t,o),c=e.getUniformLocation(t,a.name);F0(a,c,this)}const i=[],s=[];for(const o of this.seq)o.type===e.SAMPLER_2D_SHADOW||o.type===e.SAMPLER_CUBE_SHADOW||o.type===e.SAMPLER_2D_ARRAY_SHADOW?i.push(o):s.push(o);i.length>0&&(this.seq=i.concat(s))}setValue(e,t,n,i){const s=this.map[t];s!==void 0&&s.setValue(e,n,i)}setOptional(e,t,n){const i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let s=0,o=t.length;s!==o;++s){const a=t[s],c=n[a.id];c.needsUpdate!==!1&&a.setValue(e,c.value,i)}}static seqWithValue(e,t){const n=[];for(let i=0,s=e.length;i!==s;++i){const o=e[i];o.id in t&&n.push(o)}return n}}function dc(r,e,t){const n=r.createShader(e);return r.shaderSource(n,t),r.compileShader(n),n}const O0=37297;let B0=0;function k0(r,e){const t=r.split(`
`),n=[],i=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let o=i;o<s;o++){const a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}const uc=new qe;function z0(r){nt._getMatrix(uc,nt.workingColorSpace,r);const e=`mat3( ${uc.elements.map(t=>t.toFixed(4))} )`;switch(nt.getTransfer(r)){case Sr:return[e,"LinearTransferOETF"];case dt:return[e,"sRGBTransferOETF"];default:return Ie("WebGLProgram: Unsupported color space: ",r),[e,"LinearTransferOETF"]}}function fc(r,e,t){const n=r.getShaderParameter(e,r.COMPILE_STATUS),s=(r.getShaderInfoLog(e)||"").trim();if(n&&s==="")return"";const o=/ERROR: 0:(\d+)/.exec(s);if(o){const a=parseInt(o[1]);return t.toUpperCase()+`

`+s+`

`+k0(r.getShaderSource(e),a)}else return s}function G0(r,e){const t=z0(e);return[`vec4 ${r}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const H0={[Pc]:"Linear",[Lc]:"Reinhard",[Ic]:"Cineon",[Pr]:"ACESFilmic",[Nc]:"AgX",[Uc]:"Neutral",[Dc]:"Custom"};function V0(r,e){const t=H0[e];return t===void 0?(Ie("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+r+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+r+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const ur=new I;function W0(){nt.getLuminanceCoefficients(ur);const r=ur.x.toFixed(4),e=ur.y.toFixed(4),t=ur.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${r}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function X0(r){return[r.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",r.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ss).join(`
`)}function Y0(r){const e=[];for(const t in r){const n=r[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function j0(r,e){const t={},n=r.getProgramParameter(e,r.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const s=r.getActiveAttrib(e,i),o=s.name;let a=1;s.type===r.FLOAT_MAT2&&(a=2),s.type===r.FLOAT_MAT3&&(a=3),s.type===r.FLOAT_MAT4&&(a=4),t[o]={type:s.type,location:r.getAttribLocation(e,o),locationSize:a}}return t}function Ss(r){return r!==""}function pc(r,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return r.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function mc(r,e){return r.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const q0=/^[ \t]*#include +<([\w\d./]+)>/gm;function ba(r){return r.replace(q0,$0)}const K0=new Map;function $0(r,e){let t=Ze[e];if(t===void 0){const n=K0.get(e);if(n!==void 0)t=Ze[n],Ie('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return ba(t)}const Z0=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function gc(r){return r.replace(Z0,J0)}function J0(r,e,t,n){let i="";for(let s=parseInt(e);s<parseInt(t);s++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return i}function _c(r){let e=`precision ${r.precision} float;
	precision ${r.precision} int;
	precision ${r.precision} sampler2D;
	precision ${r.precision} samplerCube;
	precision ${r.precision} sampler3D;
	precision ${r.precision} sampler2DArray;
	precision ${r.precision} sampler2DShadow;
	precision ${r.precision} samplerCubeShadow;
	precision ${r.precision} sampler2DArrayShadow;
	precision ${r.precision} isampler2D;
	precision ${r.precision} isampler3D;
	precision ${r.precision} isamplerCube;
	precision ${r.precision} isampler2DArray;
	precision ${r.precision} usampler2D;
	precision ${r.precision} usampler3D;
	precision ${r.precision} usamplerCube;
	precision ${r.precision} usampler2DArray;
	`;return r.precision==="highp"?e+=`
#define HIGH_PRECISION`:r.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:r.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const Q0={[pr]:"SHADOWMAP_TYPE_PCF",[bs]:"SHADOWMAP_TYPE_VSM"};function eg(r){return Q0[r.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const tg={[Mi]:"ENVMAP_TYPE_CUBE",[Ki]:"ENVMAP_TYPE_CUBE",[Lr]:"ENVMAP_TYPE_CUBE_UV"};function ng(r){return r.envMap===!1?"ENVMAP_TYPE_CUBE":tg[r.envMapMode]||"ENVMAP_TYPE_CUBE"}const ig={[Ki]:"ENVMAP_MODE_REFRACTION"};function sg(r){return r.envMap===!1?"ENVMAP_MODE_REFLECTION":ig[r.envMapMode]||"ENVMAP_MODE_REFLECTION"}const rg={[Cc]:"ENVMAP_BLENDING_MULTIPLY",[Zh]:"ENVMAP_BLENDING_MIX",[Jh]:"ENVMAP_BLENDING_ADD"};function og(r){return r.envMap===!1?"ENVMAP_BLENDING_NONE":rg[r.combine]||"ENVMAP_BLENDING_NONE"}function ag(r){const e=r.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function lg(r,e,t,n){const i=r.getContext(),s=t.defines;let o=t.vertexShader,a=t.fragmentShader;const c=eg(t),l=ng(t),h=sg(t),d=og(t),u=ag(t),f=X0(t),m=Y0(s),_=i.createProgram();let g,p,x=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(Ss).join(`
`),g.length>0&&(g+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(Ss).join(`
`),p.length>0&&(p+=`
`)):(g=[_c(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ss).join(`
`),p=[_c(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+h:"",t.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Tn?"#define TONE_MAPPING":"",t.toneMapping!==Tn?Ze.tonemapping_pars_fragment:"",t.toneMapping!==Tn?V0("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ze.colorspace_pars_fragment,G0("linearToOutputTexel",t.outputColorSpace),W0(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Ss).join(`
`)),o=ba(o),o=pc(o,t),o=mc(o,t),a=ba(a),a=pc(a,t),a=mc(a,t),o=gc(o),a=gc(a),t.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,g=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,p=["#define varying in",t.glslVersion===fl?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===fl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const S=x+g+o,M=x+p+a,T=dc(i,i.VERTEX_SHADER,S),E=dc(i,i.FRAGMENT_SHADER,M);i.attachShader(_,T),i.attachShader(_,E),t.index0AttributeName!==void 0?i.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&i.bindAttribLocation(_,0,"position"),i.linkProgram(_);function R(L){if(r.debug.checkShaderErrors){const k=i.getProgramInfoLog(_)||"",z=i.getShaderInfoLog(T)||"",j=i.getShaderInfoLog(E)||"",q=k.trim(),O=z.trim(),H=j.trim();let se=!0,xe=!0;if(i.getProgramParameter(_,i.LINK_STATUS)===!1)if(se=!1,typeof r.debug.onShaderError=="function")r.debug.onShaderError(i,_,T,E);else{const ue=fc(i,T,"vertex"),be=fc(i,E,"fragment");ze("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(_,i.VALIDATE_STATUS)+`

Material Name: `+L.name+`
Material Type: `+L.type+`

Program Info Log: `+q+`
`+ue+`
`+be)}else q!==""?Ie("WebGLProgram: Program Info Log:",q):(O===""||H==="")&&(xe=!1);xe&&(L.diagnostics={runnable:se,programLog:q,vertexShader:{log:O,prefix:g},fragmentShader:{log:H,prefix:p}})}i.deleteShader(T),i.deleteShader(E),D=new yr(i,_),y=j0(i,_)}let D;this.getUniforms=function(){return D===void 0&&R(this),D};let y;this.getAttributes=function(){return y===void 0&&R(this),y};let b=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return b===!1&&(b=i.getProgramParameter(_,O0)),b},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=B0++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=T,this.fragmentShader=E,this}let cg=0;class hg{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,i=this._getShaderStage(t),s=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(i)===!1&&(o.add(i),i.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new dg(e),t.set(e,n)),n}}class dg{constructor(e){this.id=cg++,this.code=e,this.usedTimes=0}}function ug(r,e,t,n,i,s,o){const a=new Oa,c=new hg,l=new Set,h=[],d=new Map,u=i.logarithmicDepthBuffer;let f=i.precision;const m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(y){return l.add(y),y===0?"uv":`uv${y}`}function g(y,b,L,k,z){const j=k.fog,q=z.geometry,O=y.isMeshStandardMaterial?k.environment:null,H=(y.isMeshStandardMaterial?t:e).get(y.envMap||O),se=H&&H.mapping===Lr?H.image.height:null,xe=m[y.type];y.precision!==null&&(f=i.getMaxPrecision(y.precision),f!==y.precision&&Ie("WebGLProgram.getParameters:",y.precision,"not supported, using",f,"instead."));const ue=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,be=ue!==void 0?ue.length:0;let Ve=0;q.morphAttributes.position!==void 0&&(Ve=1),q.morphAttributes.normal!==void 0&&(Ve=2),q.morphAttributes.color!==void 0&&(Ve=3);let Ye,vt,ct,Q;if(xe){const He=Mn[xe];Ye=He.vertexShader,vt=He.fragmentShader}else Ye=y.vertexShader,vt=y.fragmentShader,c.update(y),ct=c.getVertexShaderID(y),Q=c.getFragmentShaderID(y);const ee=r.getRenderTarget(),Se=r.state.buffers.depth.getReversed(),Xe=z.isInstancedMesh===!0,Ae=z.isBatchedMesh===!0,tt=!!y.map,Ct=!!y.matcap,Qe=!!H,rt=!!y.aoMap,pt=!!y.lightMap,K=!!y.bumpMap,ke=!!y.normalMap,P=!!y.displacementMap,$e=!!y.emissiveMap,Pe=!!y.metalnessMap,We=!!y.roughnessMap,me=y.anisotropy>0,A=y.clearcoat>0,v=y.dispersion>0,F=y.iridescence>0,Y=y.sheen>0,J=y.transmission>0,X=me&&!!y.anisotropyMap,de=A&&!!y.clearcoatMap,le=A&&!!y.clearcoatNormalMap,fe=A&&!!y.clearcoatRoughnessMap,we=F&&!!y.iridescenceMap,ne=F&&!!y.iridescenceThicknessMap,ae=Y&&!!y.sheenColorMap,ve=Y&&!!y.sheenRoughnessMap,Me=!!y.specularMap,re=!!y.specularColorMap,Be=!!y.specularIntensityMap,C=J&&!!y.transmissionMap,ce=J&&!!y.thicknessMap,he=!!y.gradientMap,pe=!!y.alphaMap,$=y.alphaTest>0,Z=!!y.alphaHash,oe=!!y.extensions;let Ne=Tn;y.toneMapped&&(ee===null||ee.isXRRenderTarget===!0)&&(Ne=r.toneMapping);const st={shaderID:xe,shaderType:y.type,shaderName:y.name,vertexShader:Ye,fragmentShader:vt,defines:y.defines,customVertexShaderID:ct,customFragmentShaderID:Q,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:f,batching:Ae,batchingColor:Ae&&z._colorsTexture!==null,instancing:Xe,instancingColor:Xe&&z.instanceColor!==null,instancingMorph:Xe&&z.morphTexture!==null,outputColorSpace:ee===null?r.outputColorSpace:ee.isXRRenderTarget===!0?ee.texture.colorSpace:Xt,alphaToCoverage:!!y.alphaToCoverage,map:tt,matcap:Ct,envMap:Qe,envMapMode:Qe&&H.mapping,envMapCubeUVHeight:se,aoMap:rt,lightMap:pt,bumpMap:K,normalMap:ke,displacementMap:P,emissiveMap:$e,normalMapObjectSpace:ke&&y.normalMapType===id,normalMapTangentSpace:ke&&y.normalMapType===Xc,metalnessMap:Pe,roughnessMap:We,anisotropy:me,anisotropyMap:X,clearcoat:A,clearcoatMap:de,clearcoatNormalMap:le,clearcoatRoughnessMap:fe,dispersion:v,iridescence:F,iridescenceMap:we,iridescenceThicknessMap:ne,sheen:Y,sheenColorMap:ae,sheenRoughnessMap:ve,specularMap:Me,specularColorMap:re,specularIntensityMap:Be,transmission:J,transmissionMap:C,thicknessMap:ce,gradientMap:he,opaque:y.transparent===!1&&y.blending===Wi&&y.alphaToCoverage===!1,alphaMap:pe,alphaTest:$,alphaHash:Z,combine:y.combine,mapUv:tt&&_(y.map.channel),aoMapUv:rt&&_(y.aoMap.channel),lightMapUv:pt&&_(y.lightMap.channel),bumpMapUv:K&&_(y.bumpMap.channel),normalMapUv:ke&&_(y.normalMap.channel),displacementMapUv:P&&_(y.displacementMap.channel),emissiveMapUv:$e&&_(y.emissiveMap.channel),metalnessMapUv:Pe&&_(y.metalnessMap.channel),roughnessMapUv:We&&_(y.roughnessMap.channel),anisotropyMapUv:X&&_(y.anisotropyMap.channel),clearcoatMapUv:de&&_(y.clearcoatMap.channel),clearcoatNormalMapUv:le&&_(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:fe&&_(y.clearcoatRoughnessMap.channel),iridescenceMapUv:we&&_(y.iridescenceMap.channel),iridescenceThicknessMapUv:ne&&_(y.iridescenceThicknessMap.channel),sheenColorMapUv:ae&&_(y.sheenColorMap.channel),sheenRoughnessMapUv:ve&&_(y.sheenRoughnessMap.channel),specularMapUv:Me&&_(y.specularMap.channel),specularColorMapUv:re&&_(y.specularColorMap.channel),specularIntensityMapUv:Be&&_(y.specularIntensityMap.channel),transmissionMapUv:C&&_(y.transmissionMap.channel),thicknessMapUv:ce&&_(y.thicknessMap.channel),alphaMapUv:pe&&_(y.alphaMap.channel),vertexTangents:!!q.attributes.tangent&&(ke||me),vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,pointsUvs:z.isPoints===!0&&!!q.attributes.uv&&(tt||pe),fog:!!j,useFog:y.fog===!0,fogExp2:!!j&&j.isFogExp2,flatShading:y.flatShading===!0&&y.wireframe===!1,sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:Se,skinning:z.isSkinnedMesh===!0,morphTargets:q.morphAttributes.position!==void 0,morphNormals:q.morphAttributes.normal!==void 0,morphColors:q.morphAttributes.color!==void 0,morphTargetsCount:be,morphTextureStride:Ve,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:y.dithering,shadowMapEnabled:r.shadowMap.enabled&&L.length>0,shadowMapType:r.shadowMap.type,toneMapping:Ne,decodeVideoTexture:tt&&y.map.isVideoTexture===!0&&nt.getTransfer(y.map.colorSpace)===dt,decodeVideoTextureEmissive:$e&&y.emissiveMap.isVideoTexture===!0&&nt.getTransfer(y.emissiveMap.colorSpace)===dt,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===At,flipSided:y.side===Jt,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:oe&&y.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(oe&&y.extensions.multiDraw===!0||Ae)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return st.vertexUv1s=l.has(1),st.vertexUv2s=l.has(2),st.vertexUv3s=l.has(3),l.clear(),st}function p(y){const b=[];if(y.shaderID?b.push(y.shaderID):(b.push(y.customVertexShaderID),b.push(y.customFragmentShaderID)),y.defines!==void 0)for(const L in y.defines)b.push(L),b.push(y.defines[L]);return y.isRawShaderMaterial===!1&&(x(b,y),S(b,y),b.push(r.outputColorSpace)),b.push(y.customProgramCacheKey),b.join()}function x(y,b){y.push(b.precision),y.push(b.outputColorSpace),y.push(b.envMapMode),y.push(b.envMapCubeUVHeight),y.push(b.mapUv),y.push(b.alphaMapUv),y.push(b.lightMapUv),y.push(b.aoMapUv),y.push(b.bumpMapUv),y.push(b.normalMapUv),y.push(b.displacementMapUv),y.push(b.emissiveMapUv),y.push(b.metalnessMapUv),y.push(b.roughnessMapUv),y.push(b.anisotropyMapUv),y.push(b.clearcoatMapUv),y.push(b.clearcoatNormalMapUv),y.push(b.clearcoatRoughnessMapUv),y.push(b.iridescenceMapUv),y.push(b.iridescenceThicknessMapUv),y.push(b.sheenColorMapUv),y.push(b.sheenRoughnessMapUv),y.push(b.specularMapUv),y.push(b.specularColorMapUv),y.push(b.specularIntensityMapUv),y.push(b.transmissionMapUv),y.push(b.thicknessMapUv),y.push(b.combine),y.push(b.fogExp2),y.push(b.sizeAttenuation),y.push(b.morphTargetsCount),y.push(b.morphAttributeCount),y.push(b.numDirLights),y.push(b.numPointLights),y.push(b.numSpotLights),y.push(b.numSpotLightMaps),y.push(b.numHemiLights),y.push(b.numRectAreaLights),y.push(b.numDirLightShadows),y.push(b.numPointLightShadows),y.push(b.numSpotLightShadows),y.push(b.numSpotLightShadowsWithMaps),y.push(b.numLightProbes),y.push(b.shadowMapType),y.push(b.toneMapping),y.push(b.numClippingPlanes),y.push(b.numClipIntersection),y.push(b.depthPacking)}function S(y,b){a.disableAll(),b.instancing&&a.enable(0),b.instancingColor&&a.enable(1),b.instancingMorph&&a.enable(2),b.matcap&&a.enable(3),b.envMap&&a.enable(4),b.normalMapObjectSpace&&a.enable(5),b.normalMapTangentSpace&&a.enable(6),b.clearcoat&&a.enable(7),b.iridescence&&a.enable(8),b.alphaTest&&a.enable(9),b.vertexColors&&a.enable(10),b.vertexAlphas&&a.enable(11),b.vertexUv1s&&a.enable(12),b.vertexUv2s&&a.enable(13),b.vertexUv3s&&a.enable(14),b.vertexTangents&&a.enable(15),b.anisotropy&&a.enable(16),b.alphaHash&&a.enable(17),b.batching&&a.enable(18),b.dispersion&&a.enable(19),b.batchingColor&&a.enable(20),b.gradientMap&&a.enable(21),y.push(a.mask),a.disableAll(),b.fog&&a.enable(0),b.useFog&&a.enable(1),b.flatShading&&a.enable(2),b.logarithmicDepthBuffer&&a.enable(3),b.reversedDepthBuffer&&a.enable(4),b.skinning&&a.enable(5),b.morphTargets&&a.enable(6),b.morphNormals&&a.enable(7),b.morphColors&&a.enable(8),b.premultipliedAlpha&&a.enable(9),b.shadowMapEnabled&&a.enable(10),b.doubleSided&&a.enable(11),b.flipSided&&a.enable(12),b.useDepthPacking&&a.enable(13),b.dithering&&a.enable(14),b.transmission&&a.enable(15),b.sheen&&a.enable(16),b.opaque&&a.enable(17),b.pointsUvs&&a.enable(18),b.decodeVideoTexture&&a.enable(19),b.decodeVideoTextureEmissive&&a.enable(20),b.alphaToCoverage&&a.enable(21),y.push(a.mask)}function M(y){const b=m[y.type];let L;if(b){const k=Mn[b];L=jd.clone(k.uniforms)}else L=y.uniforms;return L}function T(y,b){let L=d.get(b);return L!==void 0?++L.usedTimes:(L=new lg(r,b,y,s),h.push(L),d.set(b,L)),L}function E(y){if(--y.usedTimes===0){const b=h.indexOf(y);h[b]=h[h.length-1],h.pop(),d.delete(y.cacheKey),y.destroy()}}function R(y){c.remove(y)}function D(){c.dispose()}return{getParameters:g,getProgramCacheKey:p,getUniforms:M,acquireProgram:T,releaseProgram:E,releaseShaderCache:R,programs:h,dispose:D}}function fg(){let r=new WeakMap;function e(o){return r.has(o)}function t(o){let a=r.get(o);return a===void 0&&(a={},r.set(o,a)),a}function n(o){r.delete(o)}function i(o,a,c){r.get(o)[a]=c}function s(){r=new WeakMap}return{has:e,get:t,remove:n,update:i,dispose:s}}function pg(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.material.id!==e.material.id?r.material.id-e.material.id:r.z!==e.z?r.z-e.z:r.id-e.id}function xc(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.z!==e.z?e.z-r.z:r.id-e.id}function vc(){const r=[];let e=0;const t=[],n=[],i=[];function s(){e=0,t.length=0,n.length=0,i.length=0}function o(d,u,f,m,_,g){let p=r[e];return p===void 0?(p={id:d.id,object:d,geometry:u,material:f,groupOrder:m,renderOrder:d.renderOrder,z:_,group:g},r[e]=p):(p.id=d.id,p.object=d,p.geometry=u,p.material=f,p.groupOrder=m,p.renderOrder=d.renderOrder,p.z=_,p.group=g),e++,p}function a(d,u,f,m,_,g){const p=o(d,u,f,m,_,g);f.transmission>0?n.push(p):f.transparent===!0?i.push(p):t.push(p)}function c(d,u,f,m,_,g){const p=o(d,u,f,m,_,g);f.transmission>0?n.unshift(p):f.transparent===!0?i.unshift(p):t.unshift(p)}function l(d,u){t.length>1&&t.sort(d||pg),n.length>1&&n.sort(u||xc),i.length>1&&i.sort(u||xc)}function h(){for(let d=e,u=r.length;d<u;d++){const f=r[d];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:t,transmissive:n,transparent:i,init:s,push:a,unshift:c,finish:h,sort:l}}function mg(){let r=new WeakMap;function e(n,i){const s=r.get(n);let o;return s===void 0?(o=new vc,r.set(n,[o])):i>=s.length?(o=new vc,s.push(o)):o=s[i],o}function t(){r=new WeakMap}return{get:e,dispose:t}}function gg(){const r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new I,color:new Oe};break;case"SpotLight":t={position:new I,direction:new I,color:new Oe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new I,color:new Oe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new I,skyColor:new Oe,groundColor:new Oe};break;case"RectAreaLight":t={color:new Oe,position:new I,halfWidth:new I,halfHeight:new I};break}return r[e.id]=t,t}}}function _g(){const r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Le};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Le};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Le,shadowCameraNear:1,shadowCameraFar:1e3};break}return r[e.id]=t,t}}}let xg=0;function vg(r,e){return(e.castShadow?2:0)-(r.castShadow?2:0)+(e.map?1:0)-(r.map?1:0)}function yg(r){const e=new gg,t=_g(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new I);const i=new I,s=new je,o=new je;function a(l){let h=0,d=0,u=0;for(let y=0;y<9;y++)n.probe[y].set(0,0,0);let f=0,m=0,_=0,g=0,p=0,x=0,S=0,M=0,T=0,E=0,R=0;l.sort(vg);for(let y=0,b=l.length;y<b;y++){const L=l[y],k=L.color,z=L.intensity,j=L.distance;let q=null;if(L.shadow&&L.shadow.map&&(L.shadow.map.texture.format===Zi?q=L.shadow.map.texture:q=L.shadow.map.depthTexture||L.shadow.map.texture),L.isAmbientLight)h+=k.r*z,d+=k.g*z,u+=k.b*z;else if(L.isLightProbe){for(let O=0;O<9;O++)n.probe[O].addScaledVector(L.sh.coefficients[O],z);R++}else if(L.isDirectionalLight){const O=e.get(L);if(O.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){const H=L.shadow,se=t.get(L);se.shadowIntensity=H.intensity,se.shadowBias=H.bias,se.shadowNormalBias=H.normalBias,se.shadowRadius=H.radius,se.shadowMapSize=H.mapSize,n.directionalShadow[f]=se,n.directionalShadowMap[f]=q,n.directionalShadowMatrix[f]=L.shadow.matrix,x++}n.directional[f]=O,f++}else if(L.isSpotLight){const O=e.get(L);O.position.setFromMatrixPosition(L.matrixWorld),O.color.copy(k).multiplyScalar(z),O.distance=j,O.coneCos=Math.cos(L.angle),O.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),O.decay=L.decay,n.spot[_]=O;const H=L.shadow;if(L.map&&(n.spotLightMap[T]=L.map,T++,H.updateMatrices(L),L.castShadow&&E++),n.spotLightMatrix[_]=H.matrix,L.castShadow){const se=t.get(L);se.shadowIntensity=H.intensity,se.shadowBias=H.bias,se.shadowNormalBias=H.normalBias,se.shadowRadius=H.radius,se.shadowMapSize=H.mapSize,n.spotShadow[_]=se,n.spotShadowMap[_]=q,M++}_++}else if(L.isRectAreaLight){const O=e.get(L);O.color.copy(k).multiplyScalar(z),O.halfWidth.set(L.width*.5,0,0),O.halfHeight.set(0,L.height*.5,0),n.rectArea[g]=O,g++}else if(L.isPointLight){const O=e.get(L);if(O.color.copy(L.color).multiplyScalar(L.intensity),O.distance=L.distance,O.decay=L.decay,L.castShadow){const H=L.shadow,se=t.get(L);se.shadowIntensity=H.intensity,se.shadowBias=H.bias,se.shadowNormalBias=H.normalBias,se.shadowRadius=H.radius,se.shadowMapSize=H.mapSize,se.shadowCameraNear=H.camera.near,se.shadowCameraFar=H.camera.far,n.pointShadow[m]=se,n.pointShadowMap[m]=q,n.pointShadowMatrix[m]=L.shadow.matrix,S++}n.point[m]=O,m++}else if(L.isHemisphereLight){const O=e.get(L);O.skyColor.copy(L.color).multiplyScalar(z),O.groundColor.copy(L.groundColor).multiplyScalar(z),n.hemi[p]=O,p++}}g>0&&(r.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=_e.LTC_FLOAT_1,n.rectAreaLTC2=_e.LTC_FLOAT_2):(n.rectAreaLTC1=_e.LTC_HALF_1,n.rectAreaLTC2=_e.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=d,n.ambient[2]=u;const D=n.hash;(D.directionalLength!==f||D.pointLength!==m||D.spotLength!==_||D.rectAreaLength!==g||D.hemiLength!==p||D.numDirectionalShadows!==x||D.numPointShadows!==S||D.numSpotShadows!==M||D.numSpotMaps!==T||D.numLightProbes!==R)&&(n.directional.length=f,n.spot.length=_,n.rectArea.length=g,n.point.length=m,n.hemi.length=p,n.directionalShadow.length=x,n.directionalShadowMap.length=x,n.pointShadow.length=S,n.pointShadowMap.length=S,n.spotShadow.length=M,n.spotShadowMap.length=M,n.directionalShadowMatrix.length=x,n.pointShadowMatrix.length=S,n.spotLightMatrix.length=M+T-E,n.spotLightMap.length=T,n.numSpotLightShadowsWithMaps=E,n.numLightProbes=R,D.directionalLength=f,D.pointLength=m,D.spotLength=_,D.rectAreaLength=g,D.hemiLength=p,D.numDirectionalShadows=x,D.numPointShadows=S,D.numSpotShadows=M,D.numSpotMaps=T,D.numLightProbes=R,n.version=xg++)}function c(l,h){let d=0,u=0,f=0,m=0,_=0;const g=h.matrixWorldInverse;for(let p=0,x=l.length;p<x;p++){const S=l[p];if(S.isDirectionalLight){const M=n.directional[d];M.direction.setFromMatrixPosition(S.matrixWorld),i.setFromMatrixPosition(S.target.matrixWorld),M.direction.sub(i),M.direction.transformDirection(g),d++}else if(S.isSpotLight){const M=n.spot[f];M.position.setFromMatrixPosition(S.matrixWorld),M.position.applyMatrix4(g),M.direction.setFromMatrixPosition(S.matrixWorld),i.setFromMatrixPosition(S.target.matrixWorld),M.direction.sub(i),M.direction.transformDirection(g),f++}else if(S.isRectAreaLight){const M=n.rectArea[m];M.position.setFromMatrixPosition(S.matrixWorld),M.position.applyMatrix4(g),o.identity(),s.copy(S.matrixWorld),s.premultiply(g),o.extractRotation(s),M.halfWidth.set(S.width*.5,0,0),M.halfHeight.set(0,S.height*.5,0),M.halfWidth.applyMatrix4(o),M.halfHeight.applyMatrix4(o),m++}else if(S.isPointLight){const M=n.point[u];M.position.setFromMatrixPosition(S.matrixWorld),M.position.applyMatrix4(g),u++}else if(S.isHemisphereLight){const M=n.hemi[_];M.direction.setFromMatrixPosition(S.matrixWorld),M.direction.transformDirection(g),_++}}}return{setup:a,setupView:c,state:n}}function yc(r){const e=new yg(r),t=[],n=[];function i(h){l.camera=h,t.length=0,n.length=0}function s(h){t.push(h)}function o(h){n.push(h)}function a(){e.setup(t)}function c(h){e.setupView(t,h)}const l={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:i,state:l,setupLights:a,setupLightsView:c,pushLight:s,pushShadow:o}}function bg(r){let e=new WeakMap;function t(i,s=0){const o=e.get(i);let a;return o===void 0?(a=new yc(r),e.set(i,[a])):s>=o.length?(a=new yc(r),o.push(a)):a=o[s],a}function n(){e=new WeakMap}return{get:t,dispose:n}}const Mg=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Sg=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,wg=[new I(1,0,0),new I(-1,0,0),new I(0,1,0),new I(0,-1,0),new I(0,0,1),new I(0,0,-1)],Tg=[new I(0,-1,0),new I(0,-1,0),new I(0,0,1),new I(0,0,-1),new I(0,-1,0),new I(0,-1,0)],bc=new je,vs=new I,yo=new I;function Eg(r,e,t){let n=new Ga;const i=new Le,s=new Le,o=new bt,a=new fu,c=new pu,l={},h=t.maxTextureSize,d={[Wn]:Jt,[Jt]:Wn,[At]:At},u=new Pn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Le},radius:{value:4}},vertexShader:Mg,fragmentShader:Sg}),f=u.clone();f.defines.HORIZONTAL_PASS=1;const m=new lt;m.setAttribute("position",new Rt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new N(m,u),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=pr;let p=this.type;this.render=function(E,R,D){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||E.length===0)return;E.type===br&&(Ie("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),E.type=pr);const y=r.getRenderTarget(),b=r.getActiveCubeFace(),L=r.getActiveMipmapLevel(),k=r.state;k.setBlending(Hn),k.buffers.depth.getReversed()===!0?k.buffers.color.setClear(0,0,0,0):k.buffers.color.setClear(1,1,1,1),k.buffers.depth.setTest(!0),k.setScissorTest(!1);const z=p!==this.type;z&&R.traverse(function(j){j.material&&(Array.isArray(j.material)?j.material.forEach(q=>q.needsUpdate=!0):j.material.needsUpdate=!0)});for(let j=0,q=E.length;j<q;j++){const O=E[j],H=O.shadow;if(H===void 0){Ie("WebGLShadowMap:",O,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;i.copy(H.mapSize);const se=H.getFrameExtents();if(i.multiply(se),s.copy(H.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(s.x=Math.floor(h/se.x),i.x=s.x*se.x,H.mapSize.x=s.x),i.y>h&&(s.y=Math.floor(h/se.y),i.y=s.y*se.y,H.mapSize.y=s.y)),H.map===null||z===!0){if(H.map!==null&&(H.map.depthTexture!==null&&(H.map.depthTexture.dispose(),H.map.depthTexture=null),H.map.dispose()),this.type===bs){if(O.isPointLight){Ie("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}H.map=new En(i.x,i.y,{format:Zi,type:Xn,minFilter:Dt,magFilter:Dt,generateMipmaps:!1}),H.map.texture.name=O.name+".shadowMap",H.map.depthTexture=new Us(i.x,i.y,cn),H.map.depthTexture.name=O.name+".shadowMapDepth",H.map.depthTexture.format=Yn,H.map.depthTexture.compareFunction=null,H.map.depthTexture.minFilter=It,H.map.depthTexture.magFilter=It}else{O.isPointLight?(H.map=new eh(i.x),H.map.depthTexture=new cu(i.x,Rn)):(H.map=new En(i.x,i.y),H.map.depthTexture=new Us(i.x,i.y,Rn)),H.map.depthTexture.name=O.name+".shadowMap",H.map.depthTexture.format=Yn;const ue=r.state.buffers.depth.getReversed();this.type===pr?(H.map.depthTexture.compareFunction=ue?Na:Da,H.map.depthTexture.minFilter=Dt,H.map.depthTexture.magFilter=Dt):(H.map.depthTexture.compareFunction=null,H.map.depthTexture.minFilter=It,H.map.depthTexture.magFilter=It)}H.camera.updateProjectionMatrix()}const xe=H.map.isWebGLCubeRenderTarget?6:1;for(let ue=0;ue<xe;ue++){if(H.map.isWebGLCubeRenderTarget)r.setRenderTarget(H.map,ue),r.clear();else{ue===0&&(r.setRenderTarget(H.map),r.clear());const be=H.getViewport(ue);o.set(s.x*be.x,s.y*be.y,s.x*be.z,s.y*be.w),k.viewport(o)}if(O.isPointLight){const be=H.camera,Ve=H.matrix,Ye=O.distance||be.far;Ye!==be.far&&(be.far=Ye,be.updateProjectionMatrix()),vs.setFromMatrixPosition(O.matrixWorld),be.position.copy(vs),yo.copy(be.position),yo.add(wg[ue]),be.up.copy(Tg[ue]),be.lookAt(yo),be.updateMatrixWorld(),Ve.makeTranslation(-vs.x,-vs.y,-vs.z),bc.multiplyMatrices(be.projectionMatrix,be.matrixWorldInverse),H._frustum.setFromProjectionMatrix(bc,be.coordinateSystem,be.reversedDepth)}else H.updateMatrices(O);n=H.getFrustum(),M(R,D,H.camera,O,this.type)}H.isPointLightShadow!==!0&&this.type===bs&&x(H,D),H.needsUpdate=!1}p=this.type,g.needsUpdate=!1,r.setRenderTarget(y,b,L)};function x(E,R){const D=e.update(_);u.defines.VSM_SAMPLES!==E.blurSamples&&(u.defines.VSM_SAMPLES=E.blurSamples,f.defines.VSM_SAMPLES=E.blurSamples,u.needsUpdate=!0,f.needsUpdate=!0),E.mapPass===null&&(E.mapPass=new En(i.x,i.y,{format:Zi,type:Xn})),u.uniforms.shadow_pass.value=E.map.depthTexture,u.uniforms.resolution.value=E.mapSize,u.uniforms.radius.value=E.radius,r.setRenderTarget(E.mapPass),r.clear(),r.renderBufferDirect(R,null,D,u,_,null),f.uniforms.shadow_pass.value=E.mapPass.texture,f.uniforms.resolution.value=E.mapSize,f.uniforms.radius.value=E.radius,r.setRenderTarget(E.map),r.clear(),r.renderBufferDirect(R,null,D,f,_,null)}function S(E,R,D,y){let b=null;const L=D.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(L!==void 0)b=L;else if(b=D.isPointLight===!0?c:a,r.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0||R.alphaToCoverage===!0){const k=b.uuid,z=R.uuid;let j=l[k];j===void 0&&(j={},l[k]=j);let q=j[z];q===void 0&&(q=b.clone(),j[z]=q,R.addEventListener("dispose",T)),b=q}if(b.visible=R.visible,b.wireframe=R.wireframe,y===bs?b.side=R.shadowSide!==null?R.shadowSide:R.side:b.side=R.shadowSide!==null?R.shadowSide:d[R.side],b.alphaMap=R.alphaMap,b.alphaTest=R.alphaToCoverage===!0?.5:R.alphaTest,b.map=R.map,b.clipShadows=R.clipShadows,b.clippingPlanes=R.clippingPlanes,b.clipIntersection=R.clipIntersection,b.displacementMap=R.displacementMap,b.displacementScale=R.displacementScale,b.displacementBias=R.displacementBias,b.wireframeLinewidth=R.wireframeLinewidth,b.linewidth=R.linewidth,D.isPointLight===!0&&b.isMeshDistanceMaterial===!0){const k=r.properties.get(b);k.light=D}return b}function M(E,R,D,y,b){if(E.visible===!1)return;if(E.layers.test(R.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&b===bs)&&(!E.frustumCulled||n.intersectsObject(E))){E.modelViewMatrix.multiplyMatrices(D.matrixWorldInverse,E.matrixWorld);const z=e.update(E),j=E.material;if(Array.isArray(j)){const q=z.groups;for(let O=0,H=q.length;O<H;O++){const se=q[O],xe=j[se.materialIndex];if(xe&&xe.visible){const ue=S(E,xe,y,b);E.onBeforeShadow(r,E,R,D,z,ue,se),r.renderBufferDirect(D,null,z,ue,E,se),E.onAfterShadow(r,E,R,D,z,ue,se)}}}else if(j.visible){const q=S(E,j,y,b);E.onBeforeShadow(r,E,R,D,z,q,null),r.renderBufferDirect(D,null,z,q,E,null),E.onAfterShadow(r,E,R,D,z,q,null)}}const k=E.children;for(let z=0,j=k.length;z<j;z++)M(k[z],R,D,y,b)}function T(E){E.target.removeEventListener("dispose",T);for(const D in l){const y=l[D],b=E.target.uuid;b in y&&(y[b].dispose(),delete y[b])}}}const Ag={[Ro]:Co,[Po]:Do,[Lo]:No,[qi]:Io,[Co]:Ro,[Do]:Po,[No]:Lo,[Io]:qi};function Rg(r,e){function t(){let C=!1;const ce=new bt;let he=null;const pe=new bt(0,0,0,0);return{setMask:function($){he!==$&&!C&&(r.colorMask($,$,$,$),he=$)},setLocked:function($){C=$},setClear:function($,Z,oe,Ne,st){st===!0&&($*=Ne,Z*=Ne,oe*=Ne),ce.set($,Z,oe,Ne),pe.equals(ce)===!1&&(r.clearColor($,Z,oe,Ne),pe.copy(ce))},reset:function(){C=!1,he=null,pe.set(-1,0,0,0)}}}function n(){let C=!1,ce=!1,he=null,pe=null,$=null;return{setReversed:function(Z){if(ce!==Z){const oe=e.get("EXT_clip_control");Z?oe.clipControlEXT(oe.LOWER_LEFT_EXT,oe.ZERO_TO_ONE_EXT):oe.clipControlEXT(oe.LOWER_LEFT_EXT,oe.NEGATIVE_ONE_TO_ONE_EXT),ce=Z;const Ne=$;$=null,this.setClear(Ne)}},getReversed:function(){return ce},setTest:function(Z){Z?ee(r.DEPTH_TEST):Se(r.DEPTH_TEST)},setMask:function(Z){he!==Z&&!C&&(r.depthMask(Z),he=Z)},setFunc:function(Z){if(ce&&(Z=Ag[Z]),pe!==Z){switch(Z){case Ro:r.depthFunc(r.NEVER);break;case Co:r.depthFunc(r.ALWAYS);break;case Po:r.depthFunc(r.LESS);break;case qi:r.depthFunc(r.LEQUAL);break;case Lo:r.depthFunc(r.EQUAL);break;case Io:r.depthFunc(r.GEQUAL);break;case Do:r.depthFunc(r.GREATER);break;case No:r.depthFunc(r.NOTEQUAL);break;default:r.depthFunc(r.LEQUAL)}pe=Z}},setLocked:function(Z){C=Z},setClear:function(Z){$!==Z&&(ce&&(Z=1-Z),r.clearDepth(Z),$=Z)},reset:function(){C=!1,he=null,pe=null,$=null,ce=!1}}}function i(){let C=!1,ce=null,he=null,pe=null,$=null,Z=null,oe=null,Ne=null,st=null;return{setTest:function(He){C||(He?ee(r.STENCIL_TEST):Se(r.STENCIL_TEST))},setMask:function(He){ce!==He&&!C&&(r.stencilMask(He),ce=He)},setFunc:function(He,Yt,jt){(he!==He||pe!==Yt||$!==jt)&&(r.stencilFunc(He,Yt,jt),he=He,pe=Yt,$=jt)},setOp:function(He,Yt,jt){(Z!==He||oe!==Yt||Ne!==jt)&&(r.stencilOp(He,Yt,jt),Z=He,oe=Yt,Ne=jt)},setLocked:function(He){C=He},setClear:function(He){st!==He&&(r.clearStencil(He),st=He)},reset:function(){C=!1,ce=null,he=null,pe=null,$=null,Z=null,oe=null,Ne=null,st=null}}}const s=new t,o=new n,a=new i,c=new WeakMap,l=new WeakMap;let h={},d={},u=new WeakMap,f=[],m=null,_=!1,g=null,p=null,x=null,S=null,M=null,T=null,E=null,R=new Oe(0,0,0),D=0,y=!1,b=null,L=null,k=null,z=null,j=null;const q=r.getParameter(r.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let O=!1,H=0;const se=r.getParameter(r.VERSION);se.indexOf("WebGL")!==-1?(H=parseFloat(/^WebGL (\d)/.exec(se)[1]),O=H>=1):se.indexOf("OpenGL ES")!==-1&&(H=parseFloat(/^OpenGL ES (\d)/.exec(se)[1]),O=H>=2);let xe=null,ue={};const be=r.getParameter(r.SCISSOR_BOX),Ve=r.getParameter(r.VIEWPORT),Ye=new bt().fromArray(be),vt=new bt().fromArray(Ve);function ct(C,ce,he,pe){const $=new Uint8Array(4),Z=r.createTexture();r.bindTexture(C,Z),r.texParameteri(C,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(C,r.TEXTURE_MAG_FILTER,r.NEAREST);for(let oe=0;oe<he;oe++)C===r.TEXTURE_3D||C===r.TEXTURE_2D_ARRAY?r.texImage3D(ce,0,r.RGBA,1,1,pe,0,r.RGBA,r.UNSIGNED_BYTE,$):r.texImage2D(ce+oe,0,r.RGBA,1,1,0,r.RGBA,r.UNSIGNED_BYTE,$);return Z}const Q={};Q[r.TEXTURE_2D]=ct(r.TEXTURE_2D,r.TEXTURE_2D,1),Q[r.TEXTURE_CUBE_MAP]=ct(r.TEXTURE_CUBE_MAP,r.TEXTURE_CUBE_MAP_POSITIVE_X,6),Q[r.TEXTURE_2D_ARRAY]=ct(r.TEXTURE_2D_ARRAY,r.TEXTURE_2D_ARRAY,1,1),Q[r.TEXTURE_3D]=ct(r.TEXTURE_3D,r.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),a.setClear(0),ee(r.DEPTH_TEST),o.setFunc(qi),K(!1),ke(rl),ee(r.CULL_FACE),rt(Hn);function ee(C){h[C]!==!0&&(r.enable(C),h[C]=!0)}function Se(C){h[C]!==!1&&(r.disable(C),h[C]=!1)}function Xe(C,ce){return d[C]!==ce?(r.bindFramebuffer(C,ce),d[C]=ce,C===r.DRAW_FRAMEBUFFER&&(d[r.FRAMEBUFFER]=ce),C===r.FRAMEBUFFER&&(d[r.DRAW_FRAMEBUFFER]=ce),!0):!1}function Ae(C,ce){let he=f,pe=!1;if(C){he=u.get(ce),he===void 0&&(he=[],u.set(ce,he));const $=C.textures;if(he.length!==$.length||he[0]!==r.COLOR_ATTACHMENT0){for(let Z=0,oe=$.length;Z<oe;Z++)he[Z]=r.COLOR_ATTACHMENT0+Z;he.length=$.length,pe=!0}}else he[0]!==r.BACK&&(he[0]=r.BACK,pe=!0);pe&&r.drawBuffers(he)}function tt(C){return m!==C?(r.useProgram(C),m=C,!0):!1}const Ct={[gi]:r.FUNC_ADD,[Nh]:r.FUNC_SUBTRACT,[Uh]:r.FUNC_REVERSE_SUBTRACT};Ct[Fh]=r.MIN,Ct[Oh]=r.MAX;const Qe={[Bh]:r.ZERO,[kh]:r.ONE,[zh]:r.SRC_COLOR,[Eo]:r.SRC_ALPHA,[Yh]:r.SRC_ALPHA_SATURATE,[Wh]:r.DST_COLOR,[Hh]:r.DST_ALPHA,[Gh]:r.ONE_MINUS_SRC_COLOR,[Ao]:r.ONE_MINUS_SRC_ALPHA,[Xh]:r.ONE_MINUS_DST_COLOR,[Vh]:r.ONE_MINUS_DST_ALPHA,[jh]:r.CONSTANT_COLOR,[qh]:r.ONE_MINUS_CONSTANT_COLOR,[Kh]:r.CONSTANT_ALPHA,[$h]:r.ONE_MINUS_CONSTANT_ALPHA};function rt(C,ce,he,pe,$,Z,oe,Ne,st,He){if(C===Hn){_===!0&&(Se(r.BLEND),_=!1);return}if(_===!1&&(ee(r.BLEND),_=!0),C!==Dh){if(C!==g||He!==y){if((p!==gi||M!==gi)&&(r.blendEquation(r.FUNC_ADD),p=gi,M=gi),He)switch(C){case Wi:r.blendFuncSeparate(r.ONE,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case ws:r.blendFunc(r.ONE,r.ONE);break;case ol:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case al:r.blendFuncSeparate(r.DST_COLOR,r.ONE_MINUS_SRC_ALPHA,r.ZERO,r.ONE);break;default:ze("WebGLState: Invalid blending: ",C);break}else switch(C){case Wi:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case ws:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE,r.ONE,r.ONE);break;case ol:ze("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case al:ze("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:ze("WebGLState: Invalid blending: ",C);break}x=null,S=null,T=null,E=null,R.set(0,0,0),D=0,g=C,y=He}return}$=$||ce,Z=Z||he,oe=oe||pe,(ce!==p||$!==M)&&(r.blendEquationSeparate(Ct[ce],Ct[$]),p=ce,M=$),(he!==x||pe!==S||Z!==T||oe!==E)&&(r.blendFuncSeparate(Qe[he],Qe[pe],Qe[Z],Qe[oe]),x=he,S=pe,T=Z,E=oe),(Ne.equals(R)===!1||st!==D)&&(r.blendColor(Ne.r,Ne.g,Ne.b,st),R.copy(Ne),D=st),g=C,y=!1}function pt(C,ce){C.side===At?Se(r.CULL_FACE):ee(r.CULL_FACE);let he=C.side===Jt;ce&&(he=!he),K(he),C.blending===Wi&&C.transparent===!1?rt(Hn):rt(C.blending,C.blendEquation,C.blendSrc,C.blendDst,C.blendEquationAlpha,C.blendSrcAlpha,C.blendDstAlpha,C.blendColor,C.blendAlpha,C.premultipliedAlpha),o.setFunc(C.depthFunc),o.setTest(C.depthTest),o.setMask(C.depthWrite),s.setMask(C.colorWrite);const pe=C.stencilWrite;a.setTest(pe),pe&&(a.setMask(C.stencilWriteMask),a.setFunc(C.stencilFunc,C.stencilRef,C.stencilFuncMask),a.setOp(C.stencilFail,C.stencilZFail,C.stencilZPass)),$e(C.polygonOffset,C.polygonOffsetFactor,C.polygonOffsetUnits),C.alphaToCoverage===!0?ee(r.SAMPLE_ALPHA_TO_COVERAGE):Se(r.SAMPLE_ALPHA_TO_COVERAGE)}function K(C){b!==C&&(C?r.frontFace(r.CW):r.frontFace(r.CCW),b=C)}function ke(C){C!==Ph?(ee(r.CULL_FACE),C!==L&&(C===rl?r.cullFace(r.BACK):C===Lh?r.cullFace(r.FRONT):r.cullFace(r.FRONT_AND_BACK))):Se(r.CULL_FACE),L=C}function P(C){C!==k&&(O&&r.lineWidth(C),k=C)}function $e(C,ce,he){C?(ee(r.POLYGON_OFFSET_FILL),(z!==ce||j!==he)&&(r.polygonOffset(ce,he),z=ce,j=he)):Se(r.POLYGON_OFFSET_FILL)}function Pe(C){C?ee(r.SCISSOR_TEST):Se(r.SCISSOR_TEST)}function We(C){C===void 0&&(C=r.TEXTURE0+q-1),xe!==C&&(r.activeTexture(C),xe=C)}function me(C,ce,he){he===void 0&&(xe===null?he=r.TEXTURE0+q-1:he=xe);let pe=ue[he];pe===void 0&&(pe={type:void 0,texture:void 0},ue[he]=pe),(pe.type!==C||pe.texture!==ce)&&(xe!==he&&(r.activeTexture(he),xe=he),r.bindTexture(C,ce||Q[C]),pe.type=C,pe.texture=ce)}function A(){const C=ue[xe];C!==void 0&&C.type!==void 0&&(r.bindTexture(C.type,null),C.type=void 0,C.texture=void 0)}function v(){try{r.compressedTexImage2D(...arguments)}catch(C){ze("WebGLState:",C)}}function F(){try{r.compressedTexImage3D(...arguments)}catch(C){ze("WebGLState:",C)}}function Y(){try{r.texSubImage2D(...arguments)}catch(C){ze("WebGLState:",C)}}function J(){try{r.texSubImage3D(...arguments)}catch(C){ze("WebGLState:",C)}}function X(){try{r.compressedTexSubImage2D(...arguments)}catch(C){ze("WebGLState:",C)}}function de(){try{r.compressedTexSubImage3D(...arguments)}catch(C){ze("WebGLState:",C)}}function le(){try{r.texStorage2D(...arguments)}catch(C){ze("WebGLState:",C)}}function fe(){try{r.texStorage3D(...arguments)}catch(C){ze("WebGLState:",C)}}function we(){try{r.texImage2D(...arguments)}catch(C){ze("WebGLState:",C)}}function ne(){try{r.texImage3D(...arguments)}catch(C){ze("WebGLState:",C)}}function ae(C){Ye.equals(C)===!1&&(r.scissor(C.x,C.y,C.z,C.w),Ye.copy(C))}function ve(C){vt.equals(C)===!1&&(r.viewport(C.x,C.y,C.z,C.w),vt.copy(C))}function Me(C,ce){let he=l.get(ce);he===void 0&&(he=new WeakMap,l.set(ce,he));let pe=he.get(C);pe===void 0&&(pe=r.getUniformBlockIndex(ce,C.name),he.set(C,pe))}function re(C,ce){const pe=l.get(ce).get(C);c.get(ce)!==pe&&(r.uniformBlockBinding(ce,pe,C.__bindingPointIndex),c.set(ce,pe))}function Be(){r.disable(r.BLEND),r.disable(r.CULL_FACE),r.disable(r.DEPTH_TEST),r.disable(r.POLYGON_OFFSET_FILL),r.disable(r.SCISSOR_TEST),r.disable(r.STENCIL_TEST),r.disable(r.SAMPLE_ALPHA_TO_COVERAGE),r.blendEquation(r.FUNC_ADD),r.blendFunc(r.ONE,r.ZERO),r.blendFuncSeparate(r.ONE,r.ZERO,r.ONE,r.ZERO),r.blendColor(0,0,0,0),r.colorMask(!0,!0,!0,!0),r.clearColor(0,0,0,0),r.depthMask(!0),r.depthFunc(r.LESS),o.setReversed(!1),r.clearDepth(1),r.stencilMask(4294967295),r.stencilFunc(r.ALWAYS,0,4294967295),r.stencilOp(r.KEEP,r.KEEP,r.KEEP),r.clearStencil(0),r.cullFace(r.BACK),r.frontFace(r.CCW),r.polygonOffset(0,0),r.activeTexture(r.TEXTURE0),r.bindFramebuffer(r.FRAMEBUFFER,null),r.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),r.bindFramebuffer(r.READ_FRAMEBUFFER,null),r.useProgram(null),r.lineWidth(1),r.scissor(0,0,r.canvas.width,r.canvas.height),r.viewport(0,0,r.canvas.width,r.canvas.height),h={},xe=null,ue={},d={},u=new WeakMap,f=[],m=null,_=!1,g=null,p=null,x=null,S=null,M=null,T=null,E=null,R=new Oe(0,0,0),D=0,y=!1,b=null,L=null,k=null,z=null,j=null,Ye.set(0,0,r.canvas.width,r.canvas.height),vt.set(0,0,r.canvas.width,r.canvas.height),s.reset(),o.reset(),a.reset()}return{buffers:{color:s,depth:o,stencil:a},enable:ee,disable:Se,bindFramebuffer:Xe,drawBuffers:Ae,useProgram:tt,setBlending:rt,setMaterial:pt,setFlipSided:K,setCullFace:ke,setLineWidth:P,setPolygonOffset:$e,setScissorTest:Pe,activeTexture:We,bindTexture:me,unbindTexture:A,compressedTexImage2D:v,compressedTexImage3D:F,texImage2D:we,texImage3D:ne,updateUBOMapping:Me,uniformBlockBinding:re,texStorage2D:le,texStorage3D:fe,texSubImage2D:Y,texSubImage3D:J,compressedTexSubImage2D:X,compressedTexSubImage3D:de,scissor:ae,viewport:ve,reset:Be}}function Cg(r,e,t,n,i,s,o){const a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Le,h=new WeakMap;let d;const u=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(A,v){return f?new OffscreenCanvas(A,v):Ds("canvas")}function _(A,v,F){let Y=1;const J=me(A);if((J.width>F||J.height>F)&&(Y=F/Math.max(J.width,J.height)),Y<1)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap||typeof VideoFrame<"u"&&A instanceof VideoFrame){const X=Math.floor(Y*J.width),de=Math.floor(Y*J.height);d===void 0&&(d=m(X,de));const le=v?m(X,de):d;return le.width=X,le.height=de,le.getContext("2d").drawImage(A,0,0,X,de),Ie("WebGLRenderer: Texture has been resized from ("+J.width+"x"+J.height+") to ("+X+"x"+de+")."),le}else return"data"in A&&Ie("WebGLRenderer: Image in DataTexture is too big ("+J.width+"x"+J.height+")."),A;return A}function g(A){return A.generateMipmaps}function p(A){r.generateMipmap(A)}function x(A){return A.isWebGLCubeRenderTarget?r.TEXTURE_CUBE_MAP:A.isWebGL3DRenderTarget?r.TEXTURE_3D:A.isWebGLArrayRenderTarget||A.isCompressedArrayTexture?r.TEXTURE_2D_ARRAY:r.TEXTURE_2D}function S(A,v,F,Y,J=!1){if(A!==null){if(r[A]!==void 0)return r[A];Ie("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let X=v;if(v===r.RED&&(F===r.FLOAT&&(X=r.R32F),F===r.HALF_FLOAT&&(X=r.R16F),F===r.UNSIGNED_BYTE&&(X=r.R8)),v===r.RED_INTEGER&&(F===r.UNSIGNED_BYTE&&(X=r.R8UI),F===r.UNSIGNED_SHORT&&(X=r.R16UI),F===r.UNSIGNED_INT&&(X=r.R32UI),F===r.BYTE&&(X=r.R8I),F===r.SHORT&&(X=r.R16I),F===r.INT&&(X=r.R32I)),v===r.RG&&(F===r.FLOAT&&(X=r.RG32F),F===r.HALF_FLOAT&&(X=r.RG16F),F===r.UNSIGNED_BYTE&&(X=r.RG8)),v===r.RG_INTEGER&&(F===r.UNSIGNED_BYTE&&(X=r.RG8UI),F===r.UNSIGNED_SHORT&&(X=r.RG16UI),F===r.UNSIGNED_INT&&(X=r.RG32UI),F===r.BYTE&&(X=r.RG8I),F===r.SHORT&&(X=r.RG16I),F===r.INT&&(X=r.RG32I)),v===r.RGB_INTEGER&&(F===r.UNSIGNED_BYTE&&(X=r.RGB8UI),F===r.UNSIGNED_SHORT&&(X=r.RGB16UI),F===r.UNSIGNED_INT&&(X=r.RGB32UI),F===r.BYTE&&(X=r.RGB8I),F===r.SHORT&&(X=r.RGB16I),F===r.INT&&(X=r.RGB32I)),v===r.RGBA_INTEGER&&(F===r.UNSIGNED_BYTE&&(X=r.RGBA8UI),F===r.UNSIGNED_SHORT&&(X=r.RGBA16UI),F===r.UNSIGNED_INT&&(X=r.RGBA32UI),F===r.BYTE&&(X=r.RGBA8I),F===r.SHORT&&(X=r.RGBA16I),F===r.INT&&(X=r.RGBA32I)),v===r.RGB&&(F===r.UNSIGNED_INT_5_9_9_9_REV&&(X=r.RGB9_E5),F===r.UNSIGNED_INT_10F_11F_11F_REV&&(X=r.R11F_G11F_B10F)),v===r.RGBA){const de=J?Sr:nt.getTransfer(Y);F===r.FLOAT&&(X=r.RGBA32F),F===r.HALF_FLOAT&&(X=r.RGBA16F),F===r.UNSIGNED_BYTE&&(X=de===dt?r.SRGB8_ALPHA8:r.RGBA8),F===r.UNSIGNED_SHORT_4_4_4_4&&(X=r.RGBA4),F===r.UNSIGNED_SHORT_5_5_5_1&&(X=r.RGB5_A1)}return(X===r.R16F||X===r.R32F||X===r.RG16F||X===r.RG32F||X===r.RGBA16F||X===r.RGBA32F)&&e.get("EXT_color_buffer_float"),X}function M(A,v){let F;return A?v===null||v===Rn||v===Ps?F=r.DEPTH24_STENCIL8:v===cn?F=r.DEPTH32F_STENCIL8:v===Cs&&(F=r.DEPTH24_STENCIL8,Ie("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):v===null||v===Rn||v===Ps?F=r.DEPTH_COMPONENT24:v===cn?F=r.DEPTH_COMPONENT32F:v===Cs&&(F=r.DEPTH_COMPONENT16),F}function T(A,v){return g(A)===!0||A.isFramebufferTexture&&A.minFilter!==It&&A.minFilter!==Dt?Math.log2(Math.max(v.width,v.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?v.mipmaps.length:1}function E(A){const v=A.target;v.removeEventListener("dispose",E),D(v),v.isVideoTexture&&h.delete(v)}function R(A){const v=A.target;v.removeEventListener("dispose",R),b(v)}function D(A){const v=n.get(A);if(v.__webglInit===void 0)return;const F=A.source,Y=u.get(F);if(Y){const J=Y[v.__cacheKey];J.usedTimes--,J.usedTimes===0&&y(A),Object.keys(Y).length===0&&u.delete(F)}n.remove(A)}function y(A){const v=n.get(A);r.deleteTexture(v.__webglTexture);const F=A.source,Y=u.get(F);delete Y[v.__cacheKey],o.memory.textures--}function b(A){const v=n.get(A);if(A.depthTexture&&(A.depthTexture.dispose(),n.remove(A.depthTexture)),A.isWebGLCubeRenderTarget)for(let Y=0;Y<6;Y++){if(Array.isArray(v.__webglFramebuffer[Y]))for(let J=0;J<v.__webglFramebuffer[Y].length;J++)r.deleteFramebuffer(v.__webglFramebuffer[Y][J]);else r.deleteFramebuffer(v.__webglFramebuffer[Y]);v.__webglDepthbuffer&&r.deleteRenderbuffer(v.__webglDepthbuffer[Y])}else{if(Array.isArray(v.__webglFramebuffer))for(let Y=0;Y<v.__webglFramebuffer.length;Y++)r.deleteFramebuffer(v.__webglFramebuffer[Y]);else r.deleteFramebuffer(v.__webglFramebuffer);if(v.__webglDepthbuffer&&r.deleteRenderbuffer(v.__webglDepthbuffer),v.__webglMultisampledFramebuffer&&r.deleteFramebuffer(v.__webglMultisampledFramebuffer),v.__webglColorRenderbuffer)for(let Y=0;Y<v.__webglColorRenderbuffer.length;Y++)v.__webglColorRenderbuffer[Y]&&r.deleteRenderbuffer(v.__webglColorRenderbuffer[Y]);v.__webglDepthRenderbuffer&&r.deleteRenderbuffer(v.__webglDepthRenderbuffer)}const F=A.textures;for(let Y=0,J=F.length;Y<J;Y++){const X=n.get(F[Y]);X.__webglTexture&&(r.deleteTexture(X.__webglTexture),o.memory.textures--),n.remove(F[Y])}n.remove(A)}let L=0;function k(){L=0}function z(){const A=L;return A>=i.maxTextures&&Ie("WebGLTextures: Trying to use "+A+" texture units while this GPU supports only "+i.maxTextures),L+=1,A}function j(A){const v=[];return v.push(A.wrapS),v.push(A.wrapT),v.push(A.wrapR||0),v.push(A.magFilter),v.push(A.minFilter),v.push(A.anisotropy),v.push(A.internalFormat),v.push(A.format),v.push(A.type),v.push(A.generateMipmaps),v.push(A.premultiplyAlpha),v.push(A.flipY),v.push(A.unpackAlignment),v.push(A.colorSpace),v.join()}function q(A,v){const F=n.get(A);if(A.isVideoTexture&&Pe(A),A.isRenderTargetTexture===!1&&A.isExternalTexture!==!0&&A.version>0&&F.__version!==A.version){const Y=A.image;if(Y===null)Ie("WebGLRenderer: Texture marked for update but no image data found.");else if(Y.complete===!1)Ie("WebGLRenderer: Texture marked for update but image is incomplete");else{Q(F,A,v);return}}else A.isExternalTexture&&(F.__webglTexture=A.sourceTexture?A.sourceTexture:null);t.bindTexture(r.TEXTURE_2D,F.__webglTexture,r.TEXTURE0+v)}function O(A,v){const F=n.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&F.__version!==A.version){Q(F,A,v);return}else A.isExternalTexture&&(F.__webglTexture=A.sourceTexture?A.sourceTexture:null);t.bindTexture(r.TEXTURE_2D_ARRAY,F.__webglTexture,r.TEXTURE0+v)}function H(A,v){const F=n.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&F.__version!==A.version){Q(F,A,v);return}t.bindTexture(r.TEXTURE_3D,F.__webglTexture,r.TEXTURE0+v)}function se(A,v){const F=n.get(A);if(A.isCubeDepthTexture!==!0&&A.version>0&&F.__version!==A.version){ee(F,A,v);return}t.bindTexture(r.TEXTURE_CUBE_MAP,F.__webglTexture,r.TEXTURE0+v)}const xe={[$i]:r.REPEAT,[ln]:r.CLAMP_TO_EDGE,[Mr]:r.MIRRORED_REPEAT},ue={[It]:r.NEAREST,[Oc]:r.NEAREST_MIPMAP_NEAREST,[Ms]:r.NEAREST_MIPMAP_LINEAR,[Dt]:r.LINEAR,[mr]:r.LINEAR_MIPMAP_NEAREST,[zn]:r.LINEAR_MIPMAP_LINEAR},be={[sd]:r.NEVER,[cd]:r.ALWAYS,[rd]:r.LESS,[Da]:r.LEQUAL,[od]:r.EQUAL,[Na]:r.GEQUAL,[ad]:r.GREATER,[ld]:r.NOTEQUAL};function Ve(A,v){if(v.type===cn&&e.has("OES_texture_float_linear")===!1&&(v.magFilter===Dt||v.magFilter===mr||v.magFilter===Ms||v.magFilter===zn||v.minFilter===Dt||v.minFilter===mr||v.minFilter===Ms||v.minFilter===zn)&&Ie("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),r.texParameteri(A,r.TEXTURE_WRAP_S,xe[v.wrapS]),r.texParameteri(A,r.TEXTURE_WRAP_T,xe[v.wrapT]),(A===r.TEXTURE_3D||A===r.TEXTURE_2D_ARRAY)&&r.texParameteri(A,r.TEXTURE_WRAP_R,xe[v.wrapR]),r.texParameteri(A,r.TEXTURE_MAG_FILTER,ue[v.magFilter]),r.texParameteri(A,r.TEXTURE_MIN_FILTER,ue[v.minFilter]),v.compareFunction&&(r.texParameteri(A,r.TEXTURE_COMPARE_MODE,r.COMPARE_REF_TO_TEXTURE),r.texParameteri(A,r.TEXTURE_COMPARE_FUNC,be[v.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(v.magFilter===It||v.minFilter!==Ms&&v.minFilter!==zn||v.type===cn&&e.has("OES_texture_float_linear")===!1)return;if(v.anisotropy>1||n.get(v).__currentAnisotropy){const F=e.get("EXT_texture_filter_anisotropic");r.texParameterf(A,F.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,i.getMaxAnisotropy())),n.get(v).__currentAnisotropy=v.anisotropy}}}function Ye(A,v){let F=!1;A.__webglInit===void 0&&(A.__webglInit=!0,v.addEventListener("dispose",E));const Y=v.source;let J=u.get(Y);J===void 0&&(J={},u.set(Y,J));const X=j(v);if(X!==A.__cacheKey){J[X]===void 0&&(J[X]={texture:r.createTexture(),usedTimes:0},o.memory.textures++,F=!0),J[X].usedTimes++;const de=J[A.__cacheKey];de!==void 0&&(J[A.__cacheKey].usedTimes--,de.usedTimes===0&&y(v)),A.__cacheKey=X,A.__webglTexture=J[X].texture}return F}function vt(A,v,F){return Math.floor(Math.floor(A/F)/v)}function ct(A,v,F,Y){const X=A.updateRanges;if(X.length===0)t.texSubImage2D(r.TEXTURE_2D,0,0,0,v.width,v.height,F,Y,v.data);else{X.sort((ne,ae)=>ne.start-ae.start);let de=0;for(let ne=1;ne<X.length;ne++){const ae=X[de],ve=X[ne],Me=ae.start+ae.count,re=vt(ve.start,v.width,4),Be=vt(ae.start,v.width,4);ve.start<=Me+1&&re===Be&&vt(ve.start+ve.count-1,v.width,4)===re?ae.count=Math.max(ae.count,ve.start+ve.count-ae.start):(++de,X[de]=ve)}X.length=de+1;const le=r.getParameter(r.UNPACK_ROW_LENGTH),fe=r.getParameter(r.UNPACK_SKIP_PIXELS),we=r.getParameter(r.UNPACK_SKIP_ROWS);r.pixelStorei(r.UNPACK_ROW_LENGTH,v.width);for(let ne=0,ae=X.length;ne<ae;ne++){const ve=X[ne],Me=Math.floor(ve.start/4),re=Math.ceil(ve.count/4),Be=Me%v.width,C=Math.floor(Me/v.width),ce=re,he=1;r.pixelStorei(r.UNPACK_SKIP_PIXELS,Be),r.pixelStorei(r.UNPACK_SKIP_ROWS,C),t.texSubImage2D(r.TEXTURE_2D,0,Be,C,ce,he,F,Y,v.data)}A.clearUpdateRanges(),r.pixelStorei(r.UNPACK_ROW_LENGTH,le),r.pixelStorei(r.UNPACK_SKIP_PIXELS,fe),r.pixelStorei(r.UNPACK_SKIP_ROWS,we)}}function Q(A,v,F){let Y=r.TEXTURE_2D;(v.isDataArrayTexture||v.isCompressedArrayTexture)&&(Y=r.TEXTURE_2D_ARRAY),v.isData3DTexture&&(Y=r.TEXTURE_3D);const J=Ye(A,v),X=v.source;t.bindTexture(Y,A.__webglTexture,r.TEXTURE0+F);const de=n.get(X);if(X.version!==de.__version||J===!0){t.activeTexture(r.TEXTURE0+F);const le=nt.getPrimaries(nt.workingColorSpace),fe=v.colorSpace===ii?null:nt.getPrimaries(v.colorSpace),we=v.colorSpace===ii||le===fe?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,v.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,v.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,we);let ne=_(v.image,!1,i.maxTextureSize);ne=We(v,ne);const ae=s.convert(v.format,v.colorSpace),ve=s.convert(v.type);let Me=S(v.internalFormat,ae,ve,v.colorSpace,v.isVideoTexture);Ve(Y,v);let re;const Be=v.mipmaps,C=v.isVideoTexture!==!0,ce=de.__version===void 0||J===!0,he=X.dataReady,pe=T(v,ne);if(v.isDepthTexture)Me=M(v.format===vi,v.type),ce&&(C?t.texStorage2D(r.TEXTURE_2D,1,Me,ne.width,ne.height):t.texImage2D(r.TEXTURE_2D,0,Me,ne.width,ne.height,0,ae,ve,null));else if(v.isDataTexture)if(Be.length>0){C&&ce&&t.texStorage2D(r.TEXTURE_2D,pe,Me,Be[0].width,Be[0].height);for(let $=0,Z=Be.length;$<Z;$++)re=Be[$],C?he&&t.texSubImage2D(r.TEXTURE_2D,$,0,0,re.width,re.height,ae,ve,re.data):t.texImage2D(r.TEXTURE_2D,$,Me,re.width,re.height,0,ae,ve,re.data);v.generateMipmaps=!1}else C?(ce&&t.texStorage2D(r.TEXTURE_2D,pe,Me,ne.width,ne.height),he&&ct(v,ne,ae,ve)):t.texImage2D(r.TEXTURE_2D,0,Me,ne.width,ne.height,0,ae,ve,ne.data);else if(v.isCompressedTexture)if(v.isCompressedArrayTexture){C&&ce&&t.texStorage3D(r.TEXTURE_2D_ARRAY,pe,Me,Be[0].width,Be[0].height,ne.depth);for(let $=0,Z=Be.length;$<Z;$++)if(re=Be[$],v.format!==hn)if(ae!==null)if(C){if(he)if(v.layerUpdates.size>0){const oe=Jl(re.width,re.height,v.format,v.type);for(const Ne of v.layerUpdates){const st=re.data.subarray(Ne*oe/re.data.BYTES_PER_ELEMENT,(Ne+1)*oe/re.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,$,0,0,Ne,re.width,re.height,1,ae,st)}v.clearLayerUpdates()}else t.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,$,0,0,0,re.width,re.height,ne.depth,ae,re.data)}else t.compressedTexImage3D(r.TEXTURE_2D_ARRAY,$,Me,re.width,re.height,ne.depth,0,re.data,0,0);else Ie("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else C?he&&t.texSubImage3D(r.TEXTURE_2D_ARRAY,$,0,0,0,re.width,re.height,ne.depth,ae,ve,re.data):t.texImage3D(r.TEXTURE_2D_ARRAY,$,Me,re.width,re.height,ne.depth,0,ae,ve,re.data)}else{C&&ce&&t.texStorage2D(r.TEXTURE_2D,pe,Me,Be[0].width,Be[0].height);for(let $=0,Z=Be.length;$<Z;$++)re=Be[$],v.format!==hn?ae!==null?C?he&&t.compressedTexSubImage2D(r.TEXTURE_2D,$,0,0,re.width,re.height,ae,re.data):t.compressedTexImage2D(r.TEXTURE_2D,$,Me,re.width,re.height,0,re.data):Ie("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):C?he&&t.texSubImage2D(r.TEXTURE_2D,$,0,0,re.width,re.height,ae,ve,re.data):t.texImage2D(r.TEXTURE_2D,$,Me,re.width,re.height,0,ae,ve,re.data)}else if(v.isDataArrayTexture)if(C){if(ce&&t.texStorage3D(r.TEXTURE_2D_ARRAY,pe,Me,ne.width,ne.height,ne.depth),he)if(v.layerUpdates.size>0){const $=Jl(ne.width,ne.height,v.format,v.type);for(const Z of v.layerUpdates){const oe=ne.data.subarray(Z*$/ne.data.BYTES_PER_ELEMENT,(Z+1)*$/ne.data.BYTES_PER_ELEMENT);t.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,Z,ne.width,ne.height,1,ae,ve,oe)}v.clearLayerUpdates()}else t.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,0,ne.width,ne.height,ne.depth,ae,ve,ne.data)}else t.texImage3D(r.TEXTURE_2D_ARRAY,0,Me,ne.width,ne.height,ne.depth,0,ae,ve,ne.data);else if(v.isData3DTexture)C?(ce&&t.texStorage3D(r.TEXTURE_3D,pe,Me,ne.width,ne.height,ne.depth),he&&t.texSubImage3D(r.TEXTURE_3D,0,0,0,0,ne.width,ne.height,ne.depth,ae,ve,ne.data)):t.texImage3D(r.TEXTURE_3D,0,Me,ne.width,ne.height,ne.depth,0,ae,ve,ne.data);else if(v.isFramebufferTexture){if(ce)if(C)t.texStorage2D(r.TEXTURE_2D,pe,Me,ne.width,ne.height);else{let $=ne.width,Z=ne.height;for(let oe=0;oe<pe;oe++)t.texImage2D(r.TEXTURE_2D,oe,Me,$,Z,0,ae,ve,null),$>>=1,Z>>=1}}else if(Be.length>0){if(C&&ce){const $=me(Be[0]);t.texStorage2D(r.TEXTURE_2D,pe,Me,$.width,$.height)}for(let $=0,Z=Be.length;$<Z;$++)re=Be[$],C?he&&t.texSubImage2D(r.TEXTURE_2D,$,0,0,ae,ve,re):t.texImage2D(r.TEXTURE_2D,$,Me,ae,ve,re);v.generateMipmaps=!1}else if(C){if(ce){const $=me(ne);t.texStorage2D(r.TEXTURE_2D,pe,Me,$.width,$.height)}he&&t.texSubImage2D(r.TEXTURE_2D,0,0,0,ae,ve,ne)}else t.texImage2D(r.TEXTURE_2D,0,Me,ae,ve,ne);g(v)&&p(Y),de.__version=X.version,v.onUpdate&&v.onUpdate(v)}A.__version=v.version}function ee(A,v,F){if(v.image.length!==6)return;const Y=Ye(A,v),J=v.source;t.bindTexture(r.TEXTURE_CUBE_MAP,A.__webglTexture,r.TEXTURE0+F);const X=n.get(J);if(J.version!==X.__version||Y===!0){t.activeTexture(r.TEXTURE0+F);const de=nt.getPrimaries(nt.workingColorSpace),le=v.colorSpace===ii?null:nt.getPrimaries(v.colorSpace),fe=v.colorSpace===ii||de===le?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,v.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,v.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,fe);const we=v.isCompressedTexture||v.image[0].isCompressedTexture,ne=v.image[0]&&v.image[0].isDataTexture,ae=[];for(let Z=0;Z<6;Z++)!we&&!ne?ae[Z]=_(v.image[Z],!0,i.maxCubemapSize):ae[Z]=ne?v.image[Z].image:v.image[Z],ae[Z]=We(v,ae[Z]);const ve=ae[0],Me=s.convert(v.format,v.colorSpace),re=s.convert(v.type),Be=S(v.internalFormat,Me,re,v.colorSpace),C=v.isVideoTexture!==!0,ce=X.__version===void 0||Y===!0,he=J.dataReady;let pe=T(v,ve);Ve(r.TEXTURE_CUBE_MAP,v);let $;if(we){C&&ce&&t.texStorage2D(r.TEXTURE_CUBE_MAP,pe,Be,ve.width,ve.height);for(let Z=0;Z<6;Z++){$=ae[Z].mipmaps;for(let oe=0;oe<$.length;oe++){const Ne=$[oe];v.format!==hn?Me!==null?C?he&&t.compressedTexSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Z,oe,0,0,Ne.width,Ne.height,Me,Ne.data):t.compressedTexImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Z,oe,Be,Ne.width,Ne.height,0,Ne.data):Ie("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):C?he&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Z,oe,0,0,Ne.width,Ne.height,Me,re,Ne.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Z,oe,Be,Ne.width,Ne.height,0,Me,re,Ne.data)}}}else{if($=v.mipmaps,C&&ce){$.length>0&&pe++;const Z=me(ae[0]);t.texStorage2D(r.TEXTURE_CUBE_MAP,pe,Be,Z.width,Z.height)}for(let Z=0;Z<6;Z++)if(ne){C?he&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,0,0,ae[Z].width,ae[Z].height,Me,re,ae[Z].data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,Be,ae[Z].width,ae[Z].height,0,Me,re,ae[Z].data);for(let oe=0;oe<$.length;oe++){const st=$[oe].image[Z].image;C?he&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Z,oe+1,0,0,st.width,st.height,Me,re,st.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Z,oe+1,Be,st.width,st.height,0,Me,re,st.data)}}else{C?he&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,0,0,Me,re,ae[Z]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,Be,Me,re,ae[Z]);for(let oe=0;oe<$.length;oe++){const Ne=$[oe];C?he&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Z,oe+1,0,0,Me,re,Ne.image[Z]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Z,oe+1,Be,Me,re,Ne.image[Z])}}}g(v)&&p(r.TEXTURE_CUBE_MAP),X.__version=J.version,v.onUpdate&&v.onUpdate(v)}A.__version=v.version}function Se(A,v,F,Y,J,X){const de=s.convert(F.format,F.colorSpace),le=s.convert(F.type),fe=S(F.internalFormat,de,le,F.colorSpace),we=n.get(v),ne=n.get(F);if(ne.__renderTarget=v,!we.__hasExternalTextures){const ae=Math.max(1,v.width>>X),ve=Math.max(1,v.height>>X);J===r.TEXTURE_3D||J===r.TEXTURE_2D_ARRAY?t.texImage3D(J,X,fe,ae,ve,v.depth,0,de,le,null):t.texImage2D(J,X,fe,ae,ve,0,de,le,null)}t.bindFramebuffer(r.FRAMEBUFFER,A),$e(v)?a.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,Y,J,ne.__webglTexture,0,P(v)):(J===r.TEXTURE_2D||J>=r.TEXTURE_CUBE_MAP_POSITIVE_X&&J<=r.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&r.framebufferTexture2D(r.FRAMEBUFFER,Y,J,ne.__webglTexture,X),t.bindFramebuffer(r.FRAMEBUFFER,null)}function Xe(A,v,F){if(r.bindRenderbuffer(r.RENDERBUFFER,A),v.depthBuffer){const Y=v.depthTexture,J=Y&&Y.isDepthTexture?Y.type:null,X=M(v.stencilBuffer,J),de=v.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;$e(v)?a.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,P(v),X,v.width,v.height):F?r.renderbufferStorageMultisample(r.RENDERBUFFER,P(v),X,v.width,v.height):r.renderbufferStorage(r.RENDERBUFFER,X,v.width,v.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,de,r.RENDERBUFFER,A)}else{const Y=v.textures;for(let J=0;J<Y.length;J++){const X=Y[J],de=s.convert(X.format,X.colorSpace),le=s.convert(X.type),fe=S(X.internalFormat,de,le,X.colorSpace);$e(v)?a.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,P(v),fe,v.width,v.height):F?r.renderbufferStorageMultisample(r.RENDERBUFFER,P(v),fe,v.width,v.height):r.renderbufferStorage(r.RENDERBUFFER,fe,v.width,v.height)}}r.bindRenderbuffer(r.RENDERBUFFER,null)}function Ae(A,v,F){const Y=v.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(r.FRAMEBUFFER,A),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const J=n.get(v.depthTexture);if(J.__renderTarget=v,(!J.__webglTexture||v.depthTexture.image.width!==v.width||v.depthTexture.image.height!==v.height)&&(v.depthTexture.image.width=v.width,v.depthTexture.image.height=v.height,v.depthTexture.needsUpdate=!0),Y){if(J.__webglInit===void 0&&(J.__webglInit=!0,v.depthTexture.addEventListener("dispose",E)),J.__webglTexture===void 0){J.__webglTexture=r.createTexture(),t.bindTexture(r.TEXTURE_CUBE_MAP,J.__webglTexture),Ve(r.TEXTURE_CUBE_MAP,v.depthTexture);const we=s.convert(v.depthTexture.format),ne=s.convert(v.depthTexture.type);let ae;v.depthTexture.format===Yn?ae=r.DEPTH_COMPONENT24:v.depthTexture.format===vi&&(ae=r.DEPTH24_STENCIL8);for(let ve=0;ve<6;ve++)r.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ve,0,ae,v.width,v.height,0,we,ne,null)}}else q(v.depthTexture,0);const X=J.__webglTexture,de=P(v),le=Y?r.TEXTURE_CUBE_MAP_POSITIVE_X+F:r.TEXTURE_2D,fe=v.depthTexture.format===vi?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;if(v.depthTexture.format===Yn)$e(v)?a.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,fe,le,X,0,de):r.framebufferTexture2D(r.FRAMEBUFFER,fe,le,X,0);else if(v.depthTexture.format===vi)$e(v)?a.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,fe,le,X,0,de):r.framebufferTexture2D(r.FRAMEBUFFER,fe,le,X,0);else throw new Error("Unknown depthTexture format")}function tt(A){const v=n.get(A),F=A.isWebGLCubeRenderTarget===!0;if(v.__boundDepthTexture!==A.depthTexture){const Y=A.depthTexture;if(v.__depthDisposeCallback&&v.__depthDisposeCallback(),Y){const J=()=>{delete v.__boundDepthTexture,delete v.__depthDisposeCallback,Y.removeEventListener("dispose",J)};Y.addEventListener("dispose",J),v.__depthDisposeCallback=J}v.__boundDepthTexture=Y}if(A.depthTexture&&!v.__autoAllocateDepthBuffer)if(F)for(let Y=0;Y<6;Y++)Ae(v.__webglFramebuffer[Y],A,Y);else{const Y=A.texture.mipmaps;Y&&Y.length>0?Ae(v.__webglFramebuffer[0],A,0):Ae(v.__webglFramebuffer,A,0)}else if(F){v.__webglDepthbuffer=[];for(let Y=0;Y<6;Y++)if(t.bindFramebuffer(r.FRAMEBUFFER,v.__webglFramebuffer[Y]),v.__webglDepthbuffer[Y]===void 0)v.__webglDepthbuffer[Y]=r.createRenderbuffer(),Xe(v.__webglDepthbuffer[Y],A,!1);else{const J=A.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,X=v.__webglDepthbuffer[Y];r.bindRenderbuffer(r.RENDERBUFFER,X),r.framebufferRenderbuffer(r.FRAMEBUFFER,J,r.RENDERBUFFER,X)}}else{const Y=A.texture.mipmaps;if(Y&&Y.length>0?t.bindFramebuffer(r.FRAMEBUFFER,v.__webglFramebuffer[0]):t.bindFramebuffer(r.FRAMEBUFFER,v.__webglFramebuffer),v.__webglDepthbuffer===void 0)v.__webglDepthbuffer=r.createRenderbuffer(),Xe(v.__webglDepthbuffer,A,!1);else{const J=A.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,X=v.__webglDepthbuffer;r.bindRenderbuffer(r.RENDERBUFFER,X),r.framebufferRenderbuffer(r.FRAMEBUFFER,J,r.RENDERBUFFER,X)}}t.bindFramebuffer(r.FRAMEBUFFER,null)}function Ct(A,v,F){const Y=n.get(A);v!==void 0&&Se(Y.__webglFramebuffer,A,A.texture,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,0),F!==void 0&&tt(A)}function Qe(A){const v=A.texture,F=n.get(A),Y=n.get(v);A.addEventListener("dispose",R);const J=A.textures,X=A.isWebGLCubeRenderTarget===!0,de=J.length>1;if(de||(Y.__webglTexture===void 0&&(Y.__webglTexture=r.createTexture()),Y.__version=v.version,o.memory.textures++),X){F.__webglFramebuffer=[];for(let le=0;le<6;le++)if(v.mipmaps&&v.mipmaps.length>0){F.__webglFramebuffer[le]=[];for(let fe=0;fe<v.mipmaps.length;fe++)F.__webglFramebuffer[le][fe]=r.createFramebuffer()}else F.__webglFramebuffer[le]=r.createFramebuffer()}else{if(v.mipmaps&&v.mipmaps.length>0){F.__webglFramebuffer=[];for(let le=0;le<v.mipmaps.length;le++)F.__webglFramebuffer[le]=r.createFramebuffer()}else F.__webglFramebuffer=r.createFramebuffer();if(de)for(let le=0,fe=J.length;le<fe;le++){const we=n.get(J[le]);we.__webglTexture===void 0&&(we.__webglTexture=r.createTexture(),o.memory.textures++)}if(A.samples>0&&$e(A)===!1){F.__webglMultisampledFramebuffer=r.createFramebuffer(),F.__webglColorRenderbuffer=[],t.bindFramebuffer(r.FRAMEBUFFER,F.__webglMultisampledFramebuffer);for(let le=0;le<J.length;le++){const fe=J[le];F.__webglColorRenderbuffer[le]=r.createRenderbuffer(),r.bindRenderbuffer(r.RENDERBUFFER,F.__webglColorRenderbuffer[le]);const we=s.convert(fe.format,fe.colorSpace),ne=s.convert(fe.type),ae=S(fe.internalFormat,we,ne,fe.colorSpace,A.isXRRenderTarget===!0),ve=P(A);r.renderbufferStorageMultisample(r.RENDERBUFFER,ve,ae,A.width,A.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+le,r.RENDERBUFFER,F.__webglColorRenderbuffer[le])}r.bindRenderbuffer(r.RENDERBUFFER,null),A.depthBuffer&&(F.__webglDepthRenderbuffer=r.createRenderbuffer(),Xe(F.__webglDepthRenderbuffer,A,!0)),t.bindFramebuffer(r.FRAMEBUFFER,null)}}if(X){t.bindTexture(r.TEXTURE_CUBE_MAP,Y.__webglTexture),Ve(r.TEXTURE_CUBE_MAP,v);for(let le=0;le<6;le++)if(v.mipmaps&&v.mipmaps.length>0)for(let fe=0;fe<v.mipmaps.length;fe++)Se(F.__webglFramebuffer[le][fe],A,v,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+le,fe);else Se(F.__webglFramebuffer[le],A,v,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+le,0);g(v)&&p(r.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(de){for(let le=0,fe=J.length;le<fe;le++){const we=J[le],ne=n.get(we);let ae=r.TEXTURE_2D;(A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(ae=A.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),t.bindTexture(ae,ne.__webglTexture),Ve(ae,we),Se(F.__webglFramebuffer,A,we,r.COLOR_ATTACHMENT0+le,ae,0),g(we)&&p(ae)}t.unbindTexture()}else{let le=r.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(le=A.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),t.bindTexture(le,Y.__webglTexture),Ve(le,v),v.mipmaps&&v.mipmaps.length>0)for(let fe=0;fe<v.mipmaps.length;fe++)Se(F.__webglFramebuffer[fe],A,v,r.COLOR_ATTACHMENT0,le,fe);else Se(F.__webglFramebuffer,A,v,r.COLOR_ATTACHMENT0,le,0);g(v)&&p(le),t.unbindTexture()}A.depthBuffer&&tt(A)}function rt(A){const v=A.textures;for(let F=0,Y=v.length;F<Y;F++){const J=v[F];if(g(J)){const X=x(A),de=n.get(J).__webglTexture;t.bindTexture(X,de),p(X),t.unbindTexture()}}}const pt=[],K=[];function ke(A){if(A.samples>0){if($e(A)===!1){const v=A.textures,F=A.width,Y=A.height;let J=r.COLOR_BUFFER_BIT;const X=A.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,de=n.get(A),le=v.length>1;if(le)for(let we=0;we<v.length;we++)t.bindFramebuffer(r.FRAMEBUFFER,de.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+we,r.RENDERBUFFER,null),t.bindFramebuffer(r.FRAMEBUFFER,de.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+we,r.TEXTURE_2D,null,0);t.bindFramebuffer(r.READ_FRAMEBUFFER,de.__webglMultisampledFramebuffer);const fe=A.texture.mipmaps;fe&&fe.length>0?t.bindFramebuffer(r.DRAW_FRAMEBUFFER,de.__webglFramebuffer[0]):t.bindFramebuffer(r.DRAW_FRAMEBUFFER,de.__webglFramebuffer);for(let we=0;we<v.length;we++){if(A.resolveDepthBuffer&&(A.depthBuffer&&(J|=r.DEPTH_BUFFER_BIT),A.stencilBuffer&&A.resolveStencilBuffer&&(J|=r.STENCIL_BUFFER_BIT)),le){r.framebufferRenderbuffer(r.READ_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.RENDERBUFFER,de.__webglColorRenderbuffer[we]);const ne=n.get(v[we]).__webglTexture;r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,ne,0)}r.blitFramebuffer(0,0,F,Y,0,0,F,Y,J,r.NEAREST),c===!0&&(pt.length=0,K.length=0,pt.push(r.COLOR_ATTACHMENT0+we),A.depthBuffer&&A.resolveDepthBuffer===!1&&(pt.push(X),K.push(X),r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,K)),r.invalidateFramebuffer(r.READ_FRAMEBUFFER,pt))}if(t.bindFramebuffer(r.READ_FRAMEBUFFER,null),t.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),le)for(let we=0;we<v.length;we++){t.bindFramebuffer(r.FRAMEBUFFER,de.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+we,r.RENDERBUFFER,de.__webglColorRenderbuffer[we]);const ne=n.get(v[we]).__webglTexture;t.bindFramebuffer(r.FRAMEBUFFER,de.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+we,r.TEXTURE_2D,ne,0)}t.bindFramebuffer(r.DRAW_FRAMEBUFFER,de.__webglMultisampledFramebuffer)}else if(A.depthBuffer&&A.resolveDepthBuffer===!1&&c){const v=A.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,[v])}}}function P(A){return Math.min(i.maxSamples,A.samples)}function $e(A){const v=n.get(A);return A.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&v.__useRenderToTexture!==!1}function Pe(A){const v=o.render.frame;h.get(A)!==v&&(h.set(A,v),A.update())}function We(A,v){const F=A.colorSpace,Y=A.format,J=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||F!==Xt&&F!==ii&&(nt.getTransfer(F)===dt?(Y!==hn||J!==sn)&&Ie("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):ze("WebGLTextures: Unsupported texture color space:",F)),v}function me(A){return typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement?(l.width=A.naturalWidth||A.width,l.height=A.naturalHeight||A.height):typeof VideoFrame<"u"&&A instanceof VideoFrame?(l.width=A.displayWidth,l.height=A.displayHeight):(l.width=A.width,l.height=A.height),l}this.allocateTextureUnit=z,this.resetTextureUnits=k,this.setTexture2D=q,this.setTexture2DArray=O,this.setTexture3D=H,this.setTextureCube=se,this.rebindTextures=Ct,this.setupRenderTarget=Qe,this.updateRenderTargetMipmap=rt,this.updateMultisampleRenderTarget=ke,this.setupDepthRenderbuffer=tt,this.setupFrameBufferTexture=Se,this.useMultisampledRTT=$e,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function Pg(r,e){function t(n,i=ii){let s;const o=nt.getTransfer(i);if(n===sn)return r.UNSIGNED_BYTE;if(n===Aa)return r.UNSIGNED_SHORT_4_4_4_4;if(n===Ra)return r.UNSIGNED_SHORT_5_5_5_1;if(n===zc)return r.UNSIGNED_INT_5_9_9_9_REV;if(n===Gc)return r.UNSIGNED_INT_10F_11F_11F_REV;if(n===Bc)return r.BYTE;if(n===kc)return r.SHORT;if(n===Cs)return r.UNSIGNED_SHORT;if(n===Ea)return r.INT;if(n===Rn)return r.UNSIGNED_INT;if(n===cn)return r.FLOAT;if(n===Xn)return r.HALF_FLOAT;if(n===Hc)return r.ALPHA;if(n===Vc)return r.RGB;if(n===hn)return r.RGBA;if(n===Yn)return r.DEPTH_COMPONENT;if(n===vi)return r.DEPTH_STENCIL;if(n===Ca)return r.RED;if(n===Pa)return r.RED_INTEGER;if(n===Zi)return r.RG;if(n===La)return r.RG_INTEGER;if(n===Ia)return r.RGBA_INTEGER;if(n===gr||n===_r||n===xr||n===vr)if(o===dt)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===gr)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===_r)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===xr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===vr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===gr)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===_r)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===xr)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===vr)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Oo||n===Bo||n===ko||n===zo)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===Oo)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Bo)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===ko)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===zo)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Go||n===Ho||n===Vo||n===Wo||n===Xo||n===Yo||n===jo)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(n===Go||n===Ho)return o===dt?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===Vo)return o===dt?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC;if(n===Wo)return s.COMPRESSED_R11_EAC;if(n===Xo)return s.COMPRESSED_SIGNED_R11_EAC;if(n===Yo)return s.COMPRESSED_RG11_EAC;if(n===jo)return s.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===qo||n===Ko||n===$o||n===Zo||n===Jo||n===Qo||n===ea||n===ta||n===na||n===ia||n===sa||n===ra||n===oa||n===aa)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(n===qo)return o===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Ko)return o===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===$o)return o===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Zo)return o===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Jo)return o===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Qo)return o===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===ea)return o===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===ta)return o===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===na)return o===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===ia)return o===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===sa)return o===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===ra)return o===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===oa)return o===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===aa)return o===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===la||n===ca||n===ha)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(n===la)return o===dt?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===ca)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===ha)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===da||n===ua||n===fa||n===pa)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(n===da)return s.COMPRESSED_RED_RGTC1_EXT;if(n===ua)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===fa)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===pa)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Ps?r.UNSIGNED_INT_24_8:r[n]!==void 0?r[n]:null}return{convert:t}}const Lg=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Ig=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class Dg{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new sh(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new Pn({vertexShader:Lg,fragmentShader:Ig,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new N(new jn(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Ng extends Si{constructor(e,t){super();const n=this;let i=null,s=1,o=null,a="local-floor",c=1,l=null,h=null,d=null,u=null,f=null,m=null;const _=typeof XRWebGLBinding<"u",g=new Dg,p={},x=t.getContextAttributes();let S=null,M=null;const T=[],E=[],R=new Le;let D=null;const y=new kt;y.viewport=new bt;const b=new kt;b.viewport=new bt;const L=[y,b],k=new Iu;let z=null,j=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Q){let ee=T[Q];return ee===void 0&&(ee=new so,T[Q]=ee),ee.getTargetRaySpace()},this.getControllerGrip=function(Q){let ee=T[Q];return ee===void 0&&(ee=new so,T[Q]=ee),ee.getGripSpace()},this.getHand=function(Q){let ee=T[Q];return ee===void 0&&(ee=new so,T[Q]=ee),ee.getHandSpace()};function q(Q){const ee=E.indexOf(Q.inputSource);if(ee===-1)return;const Se=T[ee];Se!==void 0&&(Se.update(Q.inputSource,Q.frame,l||o),Se.dispatchEvent({type:Q.type,data:Q.inputSource}))}function O(){i.removeEventListener("select",q),i.removeEventListener("selectstart",q),i.removeEventListener("selectend",q),i.removeEventListener("squeeze",q),i.removeEventListener("squeezestart",q),i.removeEventListener("squeezeend",q),i.removeEventListener("end",O),i.removeEventListener("inputsourceschange",H);for(let Q=0;Q<T.length;Q++){const ee=E[Q];ee!==null&&(E[Q]=null,T[Q].disconnect(ee))}z=null,j=null,g.reset();for(const Q in p)delete p[Q];e.setRenderTarget(S),f=null,u=null,d=null,i=null,M=null,ct.stop(),n.isPresenting=!1,e.setPixelRatio(D),e.setSize(R.width,R.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Q){s=Q,n.isPresenting===!0&&Ie("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Q){a=Q,n.isPresenting===!0&&Ie("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(Q){l=Q},this.getBaseLayer=function(){return u!==null?u:f},this.getBinding=function(){return d===null&&_&&(d=new XRWebGLBinding(i,t)),d},this.getFrame=function(){return m},this.getSession=function(){return i},this.setSession=async function(Q){if(i=Q,i!==null){if(S=e.getRenderTarget(),i.addEventListener("select",q),i.addEventListener("selectstart",q),i.addEventListener("selectend",q),i.addEventListener("squeeze",q),i.addEventListener("squeezestart",q),i.addEventListener("squeezeend",q),i.addEventListener("end",O),i.addEventListener("inputsourceschange",H),x.xrCompatible!==!0&&await t.makeXRCompatible(),D=e.getPixelRatio(),e.getSize(R),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let Se=null,Xe=null,Ae=null;x.depth&&(Ae=x.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Se=x.stencil?vi:Yn,Xe=x.stencil?Ps:Rn);const tt={colorFormat:t.RGBA8,depthFormat:Ae,scaleFactor:s};d=this.getBinding(),u=d.createProjectionLayer(tt),i.updateRenderState({layers:[u]}),e.setPixelRatio(1),e.setSize(u.textureWidth,u.textureHeight,!1),M=new En(u.textureWidth,u.textureHeight,{format:hn,type:sn,depthTexture:new Us(u.textureWidth,u.textureHeight,Xe,void 0,void 0,void 0,void 0,void 0,void 0,Se),stencilBuffer:x.stencil,colorSpace:e.outputColorSpace,samples:x.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1})}else{const Se={antialias:x.antialias,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:s};f=new XRWebGLLayer(i,t,Se),i.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),M=new En(f.framebufferWidth,f.framebufferHeight,{format:hn,type:sn,colorSpace:e.outputColorSpace,stencilBuffer:x.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await i.requestReferenceSpace(a),ct.setContext(i),ct.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function H(Q){for(let ee=0;ee<Q.removed.length;ee++){const Se=Q.removed[ee],Xe=E.indexOf(Se);Xe>=0&&(E[Xe]=null,T[Xe].disconnect(Se))}for(let ee=0;ee<Q.added.length;ee++){const Se=Q.added[ee];let Xe=E.indexOf(Se);if(Xe===-1){for(let tt=0;tt<T.length;tt++)if(tt>=E.length){E.push(Se),Xe=tt;break}else if(E[tt]===null){E[tt]=Se,Xe=tt;break}if(Xe===-1)break}const Ae=T[Xe];Ae&&Ae.connect(Se)}}const se=new I,xe=new I;function ue(Q,ee,Se){se.setFromMatrixPosition(ee.matrixWorld),xe.setFromMatrixPosition(Se.matrixWorld);const Xe=se.distanceTo(xe),Ae=ee.projectionMatrix.elements,tt=Se.projectionMatrix.elements,Ct=Ae[14]/(Ae[10]-1),Qe=Ae[14]/(Ae[10]+1),rt=(Ae[9]+1)/Ae[5],pt=(Ae[9]-1)/Ae[5],K=(Ae[8]-1)/Ae[0],ke=(tt[8]+1)/tt[0],P=Ct*K,$e=Ct*ke,Pe=Xe/(-K+ke),We=Pe*-K;if(ee.matrixWorld.decompose(Q.position,Q.quaternion,Q.scale),Q.translateX(We),Q.translateZ(Pe),Q.matrixWorld.compose(Q.position,Q.quaternion,Q.scale),Q.matrixWorldInverse.copy(Q.matrixWorld).invert(),Ae[10]===-1)Q.projectionMatrix.copy(ee.projectionMatrix),Q.projectionMatrixInverse.copy(ee.projectionMatrixInverse);else{const me=Ct+Pe,A=Qe+Pe,v=P-We,F=$e+(Xe-We),Y=rt*Qe/A*me,J=pt*Qe/A*me;Q.projectionMatrix.makePerspective(v,F,Y,J,me,A),Q.projectionMatrixInverse.copy(Q.projectionMatrix).invert()}}function be(Q,ee){ee===null?Q.matrixWorld.copy(Q.matrix):Q.matrixWorld.multiplyMatrices(ee.matrixWorld,Q.matrix),Q.matrixWorldInverse.copy(Q.matrixWorld).invert()}this.updateCamera=function(Q){if(i===null)return;let ee=Q.near,Se=Q.far;g.texture!==null&&(g.depthNear>0&&(ee=g.depthNear),g.depthFar>0&&(Se=g.depthFar)),k.near=b.near=y.near=ee,k.far=b.far=y.far=Se,(z!==k.near||j!==k.far)&&(i.updateRenderState({depthNear:k.near,depthFar:k.far}),z=k.near,j=k.far),k.layers.mask=Q.layers.mask|6,y.layers.mask=k.layers.mask&3,b.layers.mask=k.layers.mask&5;const Xe=Q.parent,Ae=k.cameras;be(k,Xe);for(let tt=0;tt<Ae.length;tt++)be(Ae[tt],Xe);Ae.length===2?ue(k,y,b):k.projectionMatrix.copy(y.projectionMatrix),Ve(Q,k,Xe)};function Ve(Q,ee,Se){Se===null?Q.matrix.copy(ee.matrixWorld):(Q.matrix.copy(Se.matrixWorld),Q.matrix.invert(),Q.matrix.multiply(ee.matrixWorld)),Q.matrix.decompose(Q.position,Q.quaternion,Q.scale),Q.updateMatrixWorld(!0),Q.projectionMatrix.copy(ee.projectionMatrix),Q.projectionMatrixInverse.copy(ee.projectionMatrixInverse),Q.isPerspectiveCamera&&(Q.fov=Ji*2*Math.atan(1/Q.projectionMatrix.elements[5]),Q.zoom=1)}this.getCamera=function(){return k},this.getFoveation=function(){if(!(u===null&&f===null))return c},this.setFoveation=function(Q){c=Q,u!==null&&(u.fixedFoveation=Q),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=Q)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(k)},this.getCameraTexture=function(Q){return p[Q]};let Ye=null;function vt(Q,ee){if(h=ee.getViewerPose(l||o),m=ee,h!==null){const Se=h.views;f!==null&&(e.setRenderTargetFramebuffer(M,f.framebuffer),e.setRenderTarget(M));let Xe=!1;Se.length!==k.cameras.length&&(k.cameras.length=0,Xe=!0);for(let Qe=0;Qe<Se.length;Qe++){const rt=Se[Qe];let pt=null;if(f!==null)pt=f.getViewport(rt);else{const ke=d.getViewSubImage(u,rt);pt=ke.viewport,Qe===0&&(e.setRenderTargetTextures(M,ke.colorTexture,ke.depthStencilTexture),e.setRenderTarget(M))}let K=L[Qe];K===void 0&&(K=new kt,K.layers.enable(Qe),K.viewport=new bt,L[Qe]=K),K.matrix.fromArray(rt.transform.matrix),K.matrix.decompose(K.position,K.quaternion,K.scale),K.projectionMatrix.fromArray(rt.projectionMatrix),K.projectionMatrixInverse.copy(K.projectionMatrix).invert(),K.viewport.set(pt.x,pt.y,pt.width,pt.height),Qe===0&&(k.matrix.copy(K.matrix),k.matrix.decompose(k.position,k.quaternion,k.scale)),Xe===!0&&k.cameras.push(K)}const Ae=i.enabledFeatures;if(Ae&&Ae.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&_){d=n.getBinding();const Qe=d.getDepthInformation(Se[0]);Qe&&Qe.isValid&&Qe.texture&&g.init(Qe,i.renderState)}if(Ae&&Ae.includes("camera-access")&&_){e.state.unbindTexture(),d=n.getBinding();for(let Qe=0;Qe<Se.length;Qe++){const rt=Se[Qe].camera;if(rt){let pt=p[rt];pt||(pt=new sh,p[rt]=pt);const K=d.getCameraImage(rt);pt.sourceTexture=K}}}}for(let Se=0;Se<T.length;Se++){const Xe=E[Se],Ae=T[Se];Xe!==null&&Ae!==void 0&&Ae.update(Xe,ee,l||o)}Ye&&Ye(Q,ee),ee.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ee}),m=null}const ct=new hh;ct.setAnimationLoop(vt),this.setAnimationLoop=function(Q){Ye=Q},this.dispose=function(){}}}const pi=new Cn,Ug=new je;function Fg(r,e){function t(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function n(g,p){p.color.getRGB(g.fogColor.value,Zc(r)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function i(g,p,x,S,M){p.isMeshBasicMaterial||p.isMeshLambertMaterial?s(g,p):p.isMeshToonMaterial?(s(g,p),d(g,p)):p.isMeshPhongMaterial?(s(g,p),h(g,p)):p.isMeshStandardMaterial?(s(g,p),u(g,p),p.isMeshPhysicalMaterial&&f(g,p,M)):p.isMeshMatcapMaterial?(s(g,p),m(g,p)):p.isMeshDepthMaterial?s(g,p):p.isMeshDistanceMaterial?(s(g,p),_(g,p)):p.isMeshNormalMaterial?s(g,p):p.isLineBasicMaterial?(o(g,p),p.isLineDashedMaterial&&a(g,p)):p.isPointsMaterial?c(g,p,x,S):p.isSpriteMaterial?l(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,t(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,t(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===Jt&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,t(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===Jt&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,t(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,t(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);const x=e.get(p),S=x.envMap,M=x.envMapRotation;S&&(g.envMap.value=S,pi.copy(M),pi.x*=-1,pi.y*=-1,pi.z*=-1,S.isCubeTexture&&S.isRenderTargetTexture===!1&&(pi.y*=-1,pi.z*=-1),g.envMapRotation.value.setFromMatrix4(Ug.makeRotationFromEuler(pi)),g.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,g.aoMapTransform))}function o(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,t(p.map,g.mapTransform))}function a(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function c(g,p,x,S){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*x,g.scale.value=S*.5,p.map&&(g.map.value=p.map,t(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function l(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,t(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function h(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function d(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function u(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function f(g,p,x){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Jt&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=x.texture,g.transmissionSamplerSize.value.set(x.width,x.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function _(g,p){const x=e.get(p).light;g.referencePosition.value.setFromMatrixPosition(x.matrixWorld),g.nearDistance.value=x.shadow.camera.near,g.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function Og(r,e,t,n){let i={},s={},o=[];const a=r.getParameter(r.MAX_UNIFORM_BUFFER_BINDINGS);function c(x,S){const M=S.program;n.uniformBlockBinding(x,M)}function l(x,S){let M=i[x.id];M===void 0&&(m(x),M=h(x),i[x.id]=M,x.addEventListener("dispose",g));const T=S.program;n.updateUBOMapping(x,T);const E=e.render.frame;s[x.id]!==E&&(u(x),s[x.id]=E)}function h(x){const S=d();x.__bindingPointIndex=S;const M=r.createBuffer(),T=x.__size,E=x.usage;return r.bindBuffer(r.UNIFORM_BUFFER,M),r.bufferData(r.UNIFORM_BUFFER,T,E),r.bindBuffer(r.UNIFORM_BUFFER,null),r.bindBufferBase(r.UNIFORM_BUFFER,S,M),M}function d(){for(let x=0;x<a;x++)if(o.indexOf(x)===-1)return o.push(x),x;return ze("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(x){const S=i[x.id],M=x.uniforms,T=x.__cache;r.bindBuffer(r.UNIFORM_BUFFER,S);for(let E=0,R=M.length;E<R;E++){const D=Array.isArray(M[E])?M[E]:[M[E]];for(let y=0,b=D.length;y<b;y++){const L=D[y];if(f(L,E,y,T)===!0){const k=L.__offset,z=Array.isArray(L.value)?L.value:[L.value];let j=0;for(let q=0;q<z.length;q++){const O=z[q],H=_(O);typeof O=="number"||typeof O=="boolean"?(L.__data[0]=O,r.bufferSubData(r.UNIFORM_BUFFER,k+j,L.__data)):O.isMatrix3?(L.__data[0]=O.elements[0],L.__data[1]=O.elements[1],L.__data[2]=O.elements[2],L.__data[3]=0,L.__data[4]=O.elements[3],L.__data[5]=O.elements[4],L.__data[6]=O.elements[5],L.__data[7]=0,L.__data[8]=O.elements[6],L.__data[9]=O.elements[7],L.__data[10]=O.elements[8],L.__data[11]=0):(O.toArray(L.__data,j),j+=H.storage/Float32Array.BYTES_PER_ELEMENT)}r.bufferSubData(r.UNIFORM_BUFFER,k,L.__data)}}}r.bindBuffer(r.UNIFORM_BUFFER,null)}function f(x,S,M,T){const E=x.value,R=S+"_"+M;if(T[R]===void 0)return typeof E=="number"||typeof E=="boolean"?T[R]=E:T[R]=E.clone(),!0;{const D=T[R];if(typeof E=="number"||typeof E=="boolean"){if(D!==E)return T[R]=E,!0}else if(D.equals(E)===!1)return D.copy(E),!0}return!1}function m(x){const S=x.uniforms;let M=0;const T=16;for(let R=0,D=S.length;R<D;R++){const y=Array.isArray(S[R])?S[R]:[S[R]];for(let b=0,L=y.length;b<L;b++){const k=y[b],z=Array.isArray(k.value)?k.value:[k.value];for(let j=0,q=z.length;j<q;j++){const O=z[j],H=_(O),se=M%T,xe=se%H.boundary,ue=se+xe;M+=xe,ue!==0&&T-ue<H.storage&&(M+=T-ue),k.__data=new Float32Array(H.storage/Float32Array.BYTES_PER_ELEMENT),k.__offset=M,M+=H.storage}}}const E=M%T;return E>0&&(M+=T-E),x.__size=M,x.__cache={},this}function _(x){const S={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(S.boundary=4,S.storage=4):x.isVector2?(S.boundary=8,S.storage=8):x.isVector3||x.isColor?(S.boundary=16,S.storage=12):x.isVector4?(S.boundary=16,S.storage=16):x.isMatrix3?(S.boundary=48,S.storage=48):x.isMatrix4?(S.boundary=64,S.storage=64):x.isTexture?Ie("WebGLRenderer: Texture samplers can not be part of an uniforms group."):Ie("WebGLRenderer: Unsupported uniform value type.",x),S}function g(x){const S=x.target;S.removeEventListener("dispose",g);const M=o.indexOf(S.__bindingPointIndex);o.splice(M,1),r.deleteBuffer(i[S.id]),delete i[S.id],delete s[S.id]}function p(){for(const x in i)r.deleteBuffer(i[x]);o=[],i={},s={}}return{bind:c,update:l,dispose:p}}const Bg=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let yn=null;function kg(){return yn===null&&(yn=new ka(Bg,16,16,Zi,Xn),yn.name="DFG_LUT",yn.minFilter=Dt,yn.magFilter=Dt,yn.wrapS=ln,yn.wrapT=ln,yn.generateMipmaps=!1,yn.needsUpdate=!0),yn}class mh{constructor(e={}){const{canvas:t=dd(),context:n=null,depth:i=!0,stencil:s=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:u=!1,outputBufferType:f=sn}=e;this.isWebGLRenderer=!0;let m;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=n.getContextAttributes().alpha}else m=o;const _=f,g=new Set([Ia,La,Pa]),p=new Set([sn,Rn,Cs,Ps,Aa,Ra]),x=new Uint32Array(4),S=new Int32Array(4);let M=null,T=null;const E=[],R=[];let D=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Tn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const y=this;let b=!1;this._outputColorSpace=Bt;let L=0,k=0,z=null,j=-1,q=null;const O=new bt,H=new bt;let se=null;const xe=new Oe(0);let ue=0,be=t.width,Ve=t.height,Ye=1,vt=null,ct=null;const Q=new bt(0,0,be,Ve),ee=new bt(0,0,be,Ve);let Se=!1;const Xe=new Ga;let Ae=!1,tt=!1;const Ct=new je,Qe=new I,rt=new bt,pt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let K=!1;function ke(){return z===null?Ye:1}let P=n;function $e(w,B){return t.getContext(w,B)}try{const w={alpha:!0,depth:i,stencil:s,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Ta}`),t.addEventListener("webglcontextlost",Ne,!1),t.addEventListener("webglcontextrestored",st,!1),t.addEventListener("webglcontextcreationerror",He,!1),P===null){const B="webgl2";if(P=$e(B,w),P===null)throw $e(B)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(w){throw ze("WebGLRenderer: "+w.message),w}let Pe,We,me,A,v,F,Y,J,X,de,le,fe,we,ne,ae,ve,Me,re,Be,C,ce,he,pe,$;function Z(){Pe=new km(P),Pe.init(),he=new Pg(P,Pe),We=new Pm(P,Pe,e,he),me=new Rg(P,Pe),We.reversedDepthBuffer&&u&&me.buffers.depth.setReversed(!0),A=new Hm(P),v=new fg,F=new Cg(P,Pe,me,v,We,he,A),Y=new Im(y),J=new Bm(y),X=new Xu(P),pe=new Rm(P,X),de=new zm(P,X,A,pe),le=new Wm(P,de,X,A),Be=new Vm(P,We,F),ve=new Lm(v),fe=new ug(y,Y,J,Pe,We,pe,ve),we=new Fg(y,v),ne=new mg,ae=new bg(Pe),re=new Am(y,Y,J,me,le,m,c),Me=new Eg(y,le,We),$=new Og(P,A,We,me),C=new Cm(P,Pe,A),ce=new Gm(P,Pe,A),A.programs=fe.programs,y.capabilities=We,y.extensions=Pe,y.properties=v,y.renderLists=ne,y.shadowMap=Me,y.state=me,y.info=A}Z(),_!==sn&&(D=new Ym(_,t.width,t.height,i,s));const oe=new Ng(y,P);this.xr=oe,this.getContext=function(){return P},this.getContextAttributes=function(){return P.getContextAttributes()},this.forceContextLoss=function(){const w=Pe.get("WEBGL_lose_context");w&&w.loseContext()},this.forceContextRestore=function(){const w=Pe.get("WEBGL_lose_context");w&&w.restoreContext()},this.getPixelRatio=function(){return Ye},this.setPixelRatio=function(w){w!==void 0&&(Ye=w,this.setSize(be,Ve,!1))},this.getSize=function(w){return w.set(be,Ve)},this.setSize=function(w,B,W=!0){if(oe.isPresenting){Ie("WebGLRenderer: Can't change size while VR device is presenting.");return}be=w,Ve=B,t.width=Math.floor(w*Ye),t.height=Math.floor(B*Ye),W===!0&&(t.style.width=w+"px",t.style.height=B+"px"),D!==null&&D.setSize(t.width,t.height),this.setViewport(0,0,w,B)},this.getDrawingBufferSize=function(w){return w.set(be*Ye,Ve*Ye).floor()},this.setDrawingBufferSize=function(w,B,W){be=w,Ve=B,Ye=W,t.width=Math.floor(w*W),t.height=Math.floor(B*W),this.setViewport(0,0,w,B)},this.setEffects=function(w){if(_===sn){console.error("THREE.WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(w){for(let B=0;B<w.length;B++)if(w[B].isOutputPass===!0){console.warn("THREE.WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}D.setEffects(w||[])},this.getCurrentViewport=function(w){return w.copy(O)},this.getViewport=function(w){return w.copy(Q)},this.setViewport=function(w,B,W,V){w.isVector4?Q.set(w.x,w.y,w.z,w.w):Q.set(w,B,W,V),me.viewport(O.copy(Q).multiplyScalar(Ye).round())},this.getScissor=function(w){return w.copy(ee)},this.setScissor=function(w,B,W,V){w.isVector4?ee.set(w.x,w.y,w.z,w.w):ee.set(w,B,W,V),me.scissor(H.copy(ee).multiplyScalar(Ye).round())},this.getScissorTest=function(){return Se},this.setScissorTest=function(w){me.setScissorTest(Se=w)},this.setOpaqueSort=function(w){vt=w},this.setTransparentSort=function(w){ct=w},this.getClearColor=function(w){return w.copy(re.getClearColor())},this.setClearColor=function(){re.setClearColor(...arguments)},this.getClearAlpha=function(){return re.getClearAlpha()},this.setClearAlpha=function(){re.setClearAlpha(...arguments)},this.clear=function(w=!0,B=!0,W=!0){let V=0;if(w){let G=!1;if(z!==null){const ge=z.texture.format;G=g.has(ge)}if(G){const ge=z.texture.type,Te=p.has(ge),ye=re.getClearColor(),Re=re.getClearAlpha(),De=ye.r,Ge=ye.g,Ue=ye.b;Te?(x[0]=De,x[1]=Ge,x[2]=Ue,x[3]=Re,P.clearBufferuiv(P.COLOR,0,x)):(S[0]=De,S[1]=Ge,S[2]=Ue,S[3]=Re,P.clearBufferiv(P.COLOR,0,S))}else V|=P.COLOR_BUFFER_BIT}B&&(V|=P.DEPTH_BUFFER_BIT),W&&(V|=P.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),P.clear(V)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",Ne,!1),t.removeEventListener("webglcontextrestored",st,!1),t.removeEventListener("webglcontextcreationerror",He,!1),re.dispose(),ne.dispose(),ae.dispose(),v.dispose(),Y.dispose(),J.dispose(),le.dispose(),pe.dispose(),$.dispose(),fe.dispose(),oe.dispose(),oe.removeEventListener("sessionstart",Ja),oe.removeEventListener("sessionend",Qa),ai.stop()};function Ne(w){w.preventDefault(),Tr("WebGLRenderer: Context Lost."),b=!0}function st(){Tr("WebGLRenderer: Context Restored."),b=!1;const w=A.autoReset,B=Me.enabled,W=Me.autoUpdate,V=Me.needsUpdate,G=Me.type;Z(),A.autoReset=w,Me.enabled=B,Me.autoUpdate=W,Me.needsUpdate=V,Me.type=G}function He(w){ze("WebGLRenderer: A WebGL context could not be created. Reason: ",w.statusMessage)}function Yt(w){const B=w.target;B.removeEventListener("dispose",Yt),jt(B)}function jt(w){oi(w),v.remove(w)}function oi(w){const B=v.get(w).programs;B!==void 0&&(B.forEach(function(W){fe.releaseProgram(W)}),w.isShaderMaterial&&fe.releaseShaderCache(w))}this.renderBufferDirect=function(w,B,W,V,G,ge){B===null&&(B=pt);const Te=G.isMesh&&G.matrixWorld.determinant()<0,ye=bh(w,B,W,V,G);me.setMaterial(V,Te);let Re=W.index,De=1;if(V.wireframe===!0){if(Re=de.getWireframeAttribute(W),Re===void 0)return;De=2}const Ge=W.drawRange,Ue=W.attributes.position;let Je=Ge.start*De,mt=(Ge.start+Ge.count)*De;ge!==null&&(Je=Math.max(Je,ge.start*De),mt=Math.min(mt,(ge.start+ge.count)*De)),Re!==null?(Je=Math.max(Je,0),mt=Math.min(mt,Re.count)):Ue!=null&&(Je=Math.max(Je,0),mt=Math.min(mt,Ue.count));const wt=mt-Je;if(wt<0||wt===1/0)return;pe.setup(G,V,ye,W,Re);let Tt,xt=C;if(Re!==null&&(Tt=X.get(Re),xt=ce,xt.setIndex(Tt)),G.isMesh)V.wireframe===!0?(me.setLineWidth(V.wireframeLinewidth*ke()),xt.setMode(P.LINES)):xt.setMode(P.TRIANGLES);else if(G.isLine){let Fe=V.linewidth;Fe===void 0&&(Fe=1),me.setLineWidth(Fe*ke()),G.isLineSegments?xt.setMode(P.LINES):G.isLineLoop?xt.setMode(P.LINE_LOOP):xt.setMode(P.LINE_STRIP)}else G.isPoints?xt.setMode(P.POINTS):G.isSprite&&xt.setMode(P.TRIANGLES);if(G.isBatchedMesh)if(G._multiDrawInstances!==null)Ns("WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),xt.renderMultiDrawInstances(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount,G._multiDrawInstances);else if(Pe.get("WEBGL_multi_draw"))xt.renderMultiDraw(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount);else{const Fe=G._multiDrawStarts,ht=G._multiDrawCounts,ot=G._multiDrawCount,Qt=Re?X.get(Re).bytesPerElement:1,Ti=v.get(V).currentProgram.getUniforms();for(let en=0;en<ot;en++)Ti.setValue(P,"_gl_DrawID",en),xt.render(Fe[en]/Qt,ht[en])}else if(G.isInstancedMesh)xt.renderInstances(Je,wt,G.count);else if(W.isInstancedBufferGeometry){const Fe=W._maxInstanceCount!==void 0?W._maxInstanceCount:1/0,ht=Math.min(W.instanceCount,Fe);xt.renderInstances(Je,wt,ht)}else xt.render(Je,wt)};function ls(w,B,W){w.transparent===!0&&w.side===At&&w.forceSinglePass===!1?(w.side=Jt,w.needsUpdate=!0,ks(w,B,W),w.side=Wn,w.needsUpdate=!0,ks(w,B,W),w.side=At):ks(w,B,W)}this.compile=function(w,B,W=null){W===null&&(W=w),T=ae.get(W),T.init(B),R.push(T),W.traverseVisible(function(G){G.isLight&&G.layers.test(B.layers)&&(T.pushLight(G),G.castShadow&&T.pushShadow(G))}),w!==W&&w.traverseVisible(function(G){G.isLight&&G.layers.test(B.layers)&&(T.pushLight(G),G.castShadow&&T.pushShadow(G))}),T.setupLights();const V=new Set;return w.traverse(function(G){if(!(G.isMesh||G.isPoints||G.isLine||G.isSprite))return;const ge=G.material;if(ge)if(Array.isArray(ge))for(let Te=0;Te<ge.length;Te++){const ye=ge[Te];ls(ye,W,G),V.add(ye)}else ls(ge,W,G),V.add(ge)}),T=R.pop(),V},this.compileAsync=function(w,B,W=null){const V=this.compile(w,B,W);return new Promise(G=>{function ge(){if(V.forEach(function(Te){v.get(Te).currentProgram.isReady()&&V.delete(Te)}),V.size===0){G(w);return}setTimeout(ge,10)}Pe.get("KHR_parallel_shader_compile")!==null?ge():setTimeout(ge,10)})};let wi=null;function yh(w){wi&&wi(w)}function Ja(){ai.stop()}function Qa(){ai.start()}const ai=new hh;ai.setAnimationLoop(yh),typeof self<"u"&&ai.setContext(self),this.setAnimationLoop=function(w){wi=w,oe.setAnimationLoop(w),w===null?ai.stop():ai.start()},oe.addEventListener("sessionstart",Ja),oe.addEventListener("sessionend",Qa),this.render=function(w,B){if(B!==void 0&&B.isCamera!==!0){ze("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(b===!0)return;const W=oe.enabled===!0&&oe.isPresenting===!0,V=D!==null&&(z===null||W)&&D.begin(y,z);if(w.matrixWorldAutoUpdate===!0&&w.updateMatrixWorld(),B.parent===null&&B.matrixWorldAutoUpdate===!0&&B.updateMatrixWorld(),oe.enabled===!0&&oe.isPresenting===!0&&(D===null||D.isCompositing()===!1)&&(oe.cameraAutoUpdate===!0&&oe.updateCamera(B),B=oe.getCamera()),w.isScene===!0&&w.onBeforeRender(y,w,B,z),T=ae.get(w,R.length),T.init(B),R.push(T),Ct.multiplyMatrices(B.projectionMatrix,B.matrixWorldInverse),Xe.setFromProjectionMatrix(Ct,wn,B.reversedDepth),tt=this.localClippingEnabled,Ae=ve.init(this.clippingPlanes,tt),M=ne.get(w,E.length),M.init(),E.push(M),oe.enabled===!0&&oe.isPresenting===!0){const Te=y.xr.getDepthSensingMesh();Te!==null&&Ur(Te,B,-1/0,y.sortObjects)}Ur(w,B,0,y.sortObjects),M.finish(),y.sortObjects===!0&&M.sort(vt,ct),K=oe.enabled===!1||oe.isPresenting===!1||oe.hasDepthSensing()===!1,K&&re.addToRenderList(M,w),this.info.render.frame++,Ae===!0&&ve.beginShadows();const G=T.state.shadowsArray;if(Me.render(G,w,B),Ae===!0&&ve.endShadows(),this.info.autoReset===!0&&this.info.reset(),(V&&D.hasRenderPass())===!1){const Te=M.opaque,ye=M.transmissive;if(T.setupLights(),B.isArrayCamera){const Re=B.cameras;if(ye.length>0)for(let De=0,Ge=Re.length;De<Ge;De++){const Ue=Re[De];tl(Te,ye,w,Ue)}K&&re.render(w);for(let De=0,Ge=Re.length;De<Ge;De++){const Ue=Re[De];el(M,w,Ue,Ue.viewport)}}else ye.length>0&&tl(Te,ye,w,B),K&&re.render(w),el(M,w,B)}z!==null&&k===0&&(F.updateMultisampleRenderTarget(z),F.updateRenderTargetMipmap(z)),V&&D.end(y),w.isScene===!0&&w.onAfterRender(y,w,B),pe.resetDefaultState(),j=-1,q=null,R.pop(),R.length>0?(T=R[R.length-1],Ae===!0&&ve.setGlobalState(y.clippingPlanes,T.state.camera)):T=null,E.pop(),E.length>0?M=E[E.length-1]:M=null};function Ur(w,B,W,V){if(w.visible===!1)return;if(w.layers.test(B.layers)){if(w.isGroup)W=w.renderOrder;else if(w.isLOD)w.autoUpdate===!0&&w.update(B);else if(w.isLight)T.pushLight(w),w.castShadow&&T.pushShadow(w);else if(w.isSprite){if(!w.frustumCulled||Xe.intersectsSprite(w)){V&&rt.setFromMatrixPosition(w.matrixWorld).applyMatrix4(Ct);const Te=le.update(w),ye=w.material;ye.visible&&M.push(w,Te,ye,W,rt.z,null)}}else if((w.isMesh||w.isLine||w.isPoints)&&(!w.frustumCulled||Xe.intersectsObject(w))){const Te=le.update(w),ye=w.material;if(V&&(w.boundingSphere!==void 0?(w.boundingSphere===null&&w.computeBoundingSphere(),rt.copy(w.boundingSphere.center)):(Te.boundingSphere===null&&Te.computeBoundingSphere(),rt.copy(Te.boundingSphere.center)),rt.applyMatrix4(w.matrixWorld).applyMatrix4(Ct)),Array.isArray(ye)){const Re=Te.groups;for(let De=0,Ge=Re.length;De<Ge;De++){const Ue=Re[De],Je=ye[Ue.materialIndex];Je&&Je.visible&&M.push(w,Te,Je,W,rt.z,Ue)}}else ye.visible&&M.push(w,Te,ye,W,rt.z,null)}}const ge=w.children;for(let Te=0,ye=ge.length;Te<ye;Te++)Ur(ge[Te],B,W,V)}function el(w,B,W,V){const{opaque:G,transmissive:ge,transparent:Te}=w;T.setupLightsView(W),Ae===!0&&ve.setGlobalState(y.clippingPlanes,W),V&&me.viewport(O.copy(V)),G.length>0&&Bs(G,B,W),ge.length>0&&Bs(ge,B,W),Te.length>0&&Bs(Te,B,W),me.buffers.depth.setTest(!0),me.buffers.depth.setMask(!0),me.buffers.color.setMask(!0),me.setPolygonOffset(!1)}function tl(w,B,W,V){if((W.isScene===!0?W.overrideMaterial:null)!==null)return;if(T.state.transmissionRenderTarget[V.id]===void 0){const Je=Pe.has("EXT_color_buffer_half_float")||Pe.has("EXT_color_buffer_float");T.state.transmissionRenderTarget[V.id]=new En(1,1,{generateMipmaps:!0,type:Je?Xn:sn,minFilter:zn,samples:We.samples,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:nt.workingColorSpace})}const ge=T.state.transmissionRenderTarget[V.id],Te=V.viewport||O;ge.setSize(Te.z*y.transmissionResolutionScale,Te.w*y.transmissionResolutionScale);const ye=y.getRenderTarget(),Re=y.getActiveCubeFace(),De=y.getActiveMipmapLevel();y.setRenderTarget(ge),y.getClearColor(xe),ue=y.getClearAlpha(),ue<1&&y.setClearColor(16777215,.5),y.clear(),K&&re.render(W);const Ge=y.toneMapping;y.toneMapping=Tn;const Ue=V.viewport;if(V.viewport!==void 0&&(V.viewport=void 0),T.setupLightsView(V),Ae===!0&&ve.setGlobalState(y.clippingPlanes,V),Bs(w,W,V),F.updateMultisampleRenderTarget(ge),F.updateRenderTargetMipmap(ge),Pe.has("WEBGL_multisampled_render_to_texture")===!1){let Je=!1;for(let mt=0,wt=B.length;mt<wt;mt++){const Tt=B[mt],{object:xt,geometry:Fe,material:ht,group:ot}=Tt;if(ht.side===At&&xt.layers.test(V.layers)){const Qt=ht.side;ht.side=Jt,ht.needsUpdate=!0,nl(xt,W,V,Fe,ht,ot),ht.side=Qt,ht.needsUpdate=!0,Je=!0}}Je===!0&&(F.updateMultisampleRenderTarget(ge),F.updateRenderTargetMipmap(ge))}y.setRenderTarget(ye,Re,De),y.setClearColor(xe,ue),Ue!==void 0&&(V.viewport=Ue),y.toneMapping=Ge}function Bs(w,B,W){const V=B.isScene===!0?B.overrideMaterial:null;for(let G=0,ge=w.length;G<ge;G++){const Te=w[G],{object:ye,geometry:Re,group:De}=Te;let Ge=Te.material;Ge.allowOverride===!0&&V!==null&&(Ge=V),ye.layers.test(W.layers)&&nl(ye,B,W,Re,Ge,De)}}function nl(w,B,W,V,G,ge){w.onBeforeRender(y,B,W,V,G,ge),w.modelViewMatrix.multiplyMatrices(W.matrixWorldInverse,w.matrixWorld),w.normalMatrix.getNormalMatrix(w.modelViewMatrix),G.onBeforeRender(y,B,W,V,w,ge),G.transparent===!0&&G.side===At&&G.forceSinglePass===!1?(G.side=Jt,G.needsUpdate=!0,y.renderBufferDirect(W,B,V,G,w,ge),G.side=Wn,G.needsUpdate=!0,y.renderBufferDirect(W,B,V,G,w,ge),G.side=At):y.renderBufferDirect(W,B,V,G,w,ge),w.onAfterRender(y,B,W,V,G,ge)}function ks(w,B,W){B.isScene!==!0&&(B=pt);const V=v.get(w),G=T.state.lights,ge=T.state.shadowsArray,Te=G.state.version,ye=fe.getParameters(w,G.state,ge,B,W),Re=fe.getProgramCacheKey(ye);let De=V.programs;V.environment=w.isMeshStandardMaterial?B.environment:null,V.fog=B.fog,V.envMap=(w.isMeshStandardMaterial?J:Y).get(w.envMap||V.environment),V.envMapRotation=V.environment!==null&&w.envMap===null?B.environmentRotation:w.envMapRotation,De===void 0&&(w.addEventListener("dispose",Yt),De=new Map,V.programs=De);let Ge=De.get(Re);if(Ge!==void 0){if(V.currentProgram===Ge&&V.lightsStateVersion===Te)return sl(w,ye),Ge}else ye.uniforms=fe.getUniforms(w),w.onBeforeCompile(ye,y),Ge=fe.acquireProgram(ye,Re),De.set(Re,Ge),V.uniforms=ye.uniforms;const Ue=V.uniforms;return(!w.isShaderMaterial&&!w.isRawShaderMaterial||w.clipping===!0)&&(Ue.clippingPlanes=ve.uniform),sl(w,ye),V.needsLights=Sh(w),V.lightsStateVersion=Te,V.needsLights&&(Ue.ambientLightColor.value=G.state.ambient,Ue.lightProbe.value=G.state.probe,Ue.directionalLights.value=G.state.directional,Ue.directionalLightShadows.value=G.state.directionalShadow,Ue.spotLights.value=G.state.spot,Ue.spotLightShadows.value=G.state.spotShadow,Ue.rectAreaLights.value=G.state.rectArea,Ue.ltc_1.value=G.state.rectAreaLTC1,Ue.ltc_2.value=G.state.rectAreaLTC2,Ue.pointLights.value=G.state.point,Ue.pointLightShadows.value=G.state.pointShadow,Ue.hemisphereLights.value=G.state.hemi,Ue.directionalShadowMap.value=G.state.directionalShadowMap,Ue.directionalShadowMatrix.value=G.state.directionalShadowMatrix,Ue.spotShadowMap.value=G.state.spotShadowMap,Ue.spotLightMatrix.value=G.state.spotLightMatrix,Ue.spotLightMap.value=G.state.spotLightMap,Ue.pointShadowMap.value=G.state.pointShadowMap,Ue.pointShadowMatrix.value=G.state.pointShadowMatrix),V.currentProgram=Ge,V.uniformsList=null,Ge}function il(w){if(w.uniformsList===null){const B=w.currentProgram.getUniforms();w.uniformsList=yr.seqWithValue(B.seq,w.uniforms)}return w.uniformsList}function sl(w,B){const W=v.get(w);W.outputColorSpace=B.outputColorSpace,W.batching=B.batching,W.batchingColor=B.batchingColor,W.instancing=B.instancing,W.instancingColor=B.instancingColor,W.instancingMorph=B.instancingMorph,W.skinning=B.skinning,W.morphTargets=B.morphTargets,W.morphNormals=B.morphNormals,W.morphColors=B.morphColors,W.morphTargetsCount=B.morphTargetsCount,W.numClippingPlanes=B.numClippingPlanes,W.numIntersection=B.numClipIntersection,W.vertexAlphas=B.vertexAlphas,W.vertexTangents=B.vertexTangents,W.toneMapping=B.toneMapping}function bh(w,B,W,V,G){B.isScene!==!0&&(B=pt),F.resetTextureUnits();const ge=B.fog,Te=V.isMeshStandardMaterial?B.environment:null,ye=z===null?y.outputColorSpace:z.isXRRenderTarget===!0?z.texture.colorSpace:Xt,Re=(V.isMeshStandardMaterial?J:Y).get(V.envMap||Te),De=V.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,Ge=!!W.attributes.tangent&&(!!V.normalMap||V.anisotropy>0),Ue=!!W.morphAttributes.position,Je=!!W.morphAttributes.normal,mt=!!W.morphAttributes.color;let wt=Tn;V.toneMapped&&(z===null||z.isXRRenderTarget===!0)&&(wt=y.toneMapping);const Tt=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,xt=Tt!==void 0?Tt.length:0,Fe=v.get(V),ht=T.state.lights;if(Ae===!0&&(tt===!0||w!==q)){const Ht=w===q&&V.id===j;ve.setState(V,w,Ht)}let ot=!1;V.version===Fe.__version?(Fe.needsLights&&Fe.lightsStateVersion!==ht.state.version||Fe.outputColorSpace!==ye||G.isBatchedMesh&&Fe.batching===!1||!G.isBatchedMesh&&Fe.batching===!0||G.isBatchedMesh&&Fe.batchingColor===!0&&G.colorTexture===null||G.isBatchedMesh&&Fe.batchingColor===!1&&G.colorTexture!==null||G.isInstancedMesh&&Fe.instancing===!1||!G.isInstancedMesh&&Fe.instancing===!0||G.isSkinnedMesh&&Fe.skinning===!1||!G.isSkinnedMesh&&Fe.skinning===!0||G.isInstancedMesh&&Fe.instancingColor===!0&&G.instanceColor===null||G.isInstancedMesh&&Fe.instancingColor===!1&&G.instanceColor!==null||G.isInstancedMesh&&Fe.instancingMorph===!0&&G.morphTexture===null||G.isInstancedMesh&&Fe.instancingMorph===!1&&G.morphTexture!==null||Fe.envMap!==Re||V.fog===!0&&Fe.fog!==ge||Fe.numClippingPlanes!==void 0&&(Fe.numClippingPlanes!==ve.numPlanes||Fe.numIntersection!==ve.numIntersection)||Fe.vertexAlphas!==De||Fe.vertexTangents!==Ge||Fe.morphTargets!==Ue||Fe.morphNormals!==Je||Fe.morphColors!==mt||Fe.toneMapping!==wt||Fe.morphTargetsCount!==xt)&&(ot=!0):(ot=!0,Fe.__version=V.version);let Qt=Fe.currentProgram;ot===!0&&(Qt=ks(V,B,G));let Ti=!1,en=!1,cs=!1;const yt=Qt.getUniforms(),qt=Fe.uniforms;if(me.useProgram(Qt.program)&&(Ti=!0,en=!0,cs=!0),V.id!==j&&(j=V.id,en=!0),Ti||q!==w){me.buffers.depth.getReversed()&&w.reversedDepth!==!0&&(w._reversedDepth=!0,w.updateProjectionMatrix()),yt.setValue(P,"projectionMatrix",w.projectionMatrix),yt.setValue(P,"viewMatrix",w.matrixWorldInverse);const Kt=yt.map.cameraPosition;Kt!==void 0&&Kt.setValue(P,Qe.setFromMatrixPosition(w.matrixWorld)),We.logarithmicDepthBuffer&&yt.setValue(P,"logDepthBufFC",2/(Math.log(w.far+1)/Math.LN2)),(V.isMeshPhongMaterial||V.isMeshToonMaterial||V.isMeshLambertMaterial||V.isMeshBasicMaterial||V.isMeshStandardMaterial||V.isShaderMaterial)&&yt.setValue(P,"isOrthographic",w.isOrthographicCamera===!0),q!==w&&(q=w,en=!0,cs=!0)}if(Fe.needsLights&&(ht.state.directionalShadowMap.length>0&&yt.setValue(P,"directionalShadowMap",ht.state.directionalShadowMap,F),ht.state.spotShadowMap.length>0&&yt.setValue(P,"spotShadowMap",ht.state.spotShadowMap,F),ht.state.pointShadowMap.length>0&&yt.setValue(P,"pointShadowMap",ht.state.pointShadowMap,F)),G.isSkinnedMesh){yt.setOptional(P,G,"bindMatrix"),yt.setOptional(P,G,"bindMatrixInverse");const Ht=G.skeleton;Ht&&(Ht.boneTexture===null&&Ht.computeBoneTexture(),yt.setValue(P,"boneTexture",Ht.boneTexture,F))}G.isBatchedMesh&&(yt.setOptional(P,G,"batchingTexture"),yt.setValue(P,"batchingTexture",G._matricesTexture,F),yt.setOptional(P,G,"batchingIdTexture"),yt.setValue(P,"batchingIdTexture",G._indirectTexture,F),yt.setOptional(P,G,"batchingColorTexture"),G._colorsTexture!==null&&yt.setValue(P,"batchingColorTexture",G._colorsTexture,F));const rn=W.morphAttributes;if((rn.position!==void 0||rn.normal!==void 0||rn.color!==void 0)&&Be.update(G,W,Qt),(en||Fe.receiveShadow!==G.receiveShadow)&&(Fe.receiveShadow=G.receiveShadow,yt.setValue(P,"receiveShadow",G.receiveShadow)),V.isMeshGouraudMaterial&&V.envMap!==null&&(qt.envMap.value=Re,qt.flipEnvMap.value=Re.isCubeTexture&&Re.isRenderTargetTexture===!1?-1:1),V.isMeshStandardMaterial&&V.envMap===null&&B.environment!==null&&(qt.envMapIntensity.value=B.environmentIntensity),qt.dfgLUT!==void 0&&(qt.dfgLUT.value=kg()),en&&(yt.setValue(P,"toneMappingExposure",y.toneMappingExposure),Fe.needsLights&&Mh(qt,cs),ge&&V.fog===!0&&we.refreshFogUniforms(qt,ge),we.refreshMaterialUniforms(qt,V,Ye,Ve,T.state.transmissionRenderTarget[w.id]),yr.upload(P,il(Fe),qt,F)),V.isShaderMaterial&&V.uniformsNeedUpdate===!0&&(yr.upload(P,il(Fe),qt,F),V.uniformsNeedUpdate=!1),V.isSpriteMaterial&&yt.setValue(P,"center",G.center),yt.setValue(P,"modelViewMatrix",G.modelViewMatrix),yt.setValue(P,"normalMatrix",G.normalMatrix),yt.setValue(P,"modelMatrix",G.matrixWorld),V.isShaderMaterial||V.isRawShaderMaterial){const Ht=V.uniformsGroups;for(let Kt=0,Fr=Ht.length;Kt<Fr;Kt++){const li=Ht[Kt];$.update(li,Qt),$.bind(li,Qt)}}return Qt}function Mh(w,B){w.ambientLightColor.needsUpdate=B,w.lightProbe.needsUpdate=B,w.directionalLights.needsUpdate=B,w.directionalLightShadows.needsUpdate=B,w.pointLights.needsUpdate=B,w.pointLightShadows.needsUpdate=B,w.spotLights.needsUpdate=B,w.spotLightShadows.needsUpdate=B,w.rectAreaLights.needsUpdate=B,w.hemisphereLights.needsUpdate=B}function Sh(w){return w.isMeshLambertMaterial||w.isMeshToonMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isShadowMaterial||w.isShaderMaterial&&w.lights===!0}this.getActiveCubeFace=function(){return L},this.getActiveMipmapLevel=function(){return k},this.getRenderTarget=function(){return z},this.setRenderTargetTextures=function(w,B,W){const V=v.get(w);V.__autoAllocateDepthBuffer=w.resolveDepthBuffer===!1,V.__autoAllocateDepthBuffer===!1&&(V.__useRenderToTexture=!1),v.get(w.texture).__webglTexture=B,v.get(w.depthTexture).__webglTexture=V.__autoAllocateDepthBuffer?void 0:W,V.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(w,B){const W=v.get(w);W.__webglFramebuffer=B,W.__useDefaultFramebuffer=B===void 0};const wh=P.createFramebuffer();this.setRenderTarget=function(w,B=0,W=0){z=w,L=B,k=W;let V=null,G=!1,ge=!1;if(w){const ye=v.get(w);if(ye.__useDefaultFramebuffer!==void 0){me.bindFramebuffer(P.FRAMEBUFFER,ye.__webglFramebuffer),O.copy(w.viewport),H.copy(w.scissor),se=w.scissorTest,me.viewport(O),me.scissor(H),me.setScissorTest(se),j=-1;return}else if(ye.__webglFramebuffer===void 0)F.setupRenderTarget(w);else if(ye.__hasExternalTextures)F.rebindTextures(w,v.get(w.texture).__webglTexture,v.get(w.depthTexture).__webglTexture);else if(w.depthBuffer){const Ge=w.depthTexture;if(ye.__boundDepthTexture!==Ge){if(Ge!==null&&v.has(Ge)&&(w.width!==Ge.image.width||w.height!==Ge.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");F.setupDepthRenderbuffer(w)}}const Re=w.texture;(Re.isData3DTexture||Re.isDataArrayTexture||Re.isCompressedArrayTexture)&&(ge=!0);const De=v.get(w).__webglFramebuffer;w.isWebGLCubeRenderTarget?(Array.isArray(De[B])?V=De[B][W]:V=De[B],G=!0):w.samples>0&&F.useMultisampledRTT(w)===!1?V=v.get(w).__webglMultisampledFramebuffer:Array.isArray(De)?V=De[W]:V=De,O.copy(w.viewport),H.copy(w.scissor),se=w.scissorTest}else O.copy(Q).multiplyScalar(Ye).floor(),H.copy(ee).multiplyScalar(Ye).floor(),se=Se;if(W!==0&&(V=wh),me.bindFramebuffer(P.FRAMEBUFFER,V)&&me.drawBuffers(w,V),me.viewport(O),me.scissor(H),me.setScissorTest(se),G){const ye=v.get(w.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_CUBE_MAP_POSITIVE_X+B,ye.__webglTexture,W)}else if(ge){const ye=B;for(let Re=0;Re<w.textures.length;Re++){const De=v.get(w.textures[Re]);P.framebufferTextureLayer(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0+Re,De.__webglTexture,W,ye)}}else if(w!==null&&W!==0){const ye=v.get(w.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,ye.__webglTexture,W)}j=-1},this.readRenderTargetPixels=function(w,B,W,V,G,ge,Te,ye=0){if(!(w&&w.isWebGLRenderTarget)){ze("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Re=v.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&Te!==void 0&&(Re=Re[Te]),Re){me.bindFramebuffer(P.FRAMEBUFFER,Re);try{const De=w.textures[ye],Ge=De.format,Ue=De.type;if(!We.textureFormatReadable(Ge)){ze("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!We.textureTypeReadable(Ue)){ze("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}B>=0&&B<=w.width-V&&W>=0&&W<=w.height-G&&(w.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+ye),P.readPixels(B,W,V,G,he.convert(Ge),he.convert(Ue),ge))}finally{const De=z!==null?v.get(z).__webglFramebuffer:null;me.bindFramebuffer(P.FRAMEBUFFER,De)}}},this.readRenderTargetPixelsAsync=async function(w,B,W,V,G,ge,Te,ye=0){if(!(w&&w.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Re=v.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&Te!==void 0&&(Re=Re[Te]),Re)if(B>=0&&B<=w.width-V&&W>=0&&W<=w.height-G){me.bindFramebuffer(P.FRAMEBUFFER,Re);const De=w.textures[ye],Ge=De.format,Ue=De.type;if(!We.textureFormatReadable(Ge))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!We.textureTypeReadable(Ue))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Je=P.createBuffer();P.bindBuffer(P.PIXEL_PACK_BUFFER,Je),P.bufferData(P.PIXEL_PACK_BUFFER,ge.byteLength,P.STREAM_READ),w.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+ye),P.readPixels(B,W,V,G,he.convert(Ge),he.convert(Ue),0);const mt=z!==null?v.get(z).__webglFramebuffer:null;me.bindFramebuffer(P.FRAMEBUFFER,mt);const wt=P.fenceSync(P.SYNC_GPU_COMMANDS_COMPLETE,0);return P.flush(),await ud(P,wt,4),P.bindBuffer(P.PIXEL_PACK_BUFFER,Je),P.getBufferSubData(P.PIXEL_PACK_BUFFER,0,ge),P.deleteBuffer(Je),P.deleteSync(wt),ge}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(w,B=null,W=0){const V=Math.pow(2,-W),G=Math.floor(w.image.width*V),ge=Math.floor(w.image.height*V),Te=B!==null?B.x:0,ye=B!==null?B.y:0;F.setTexture2D(w,0),P.copyTexSubImage2D(P.TEXTURE_2D,W,0,0,Te,ye,G,ge),me.unbindTexture()};const Th=P.createFramebuffer(),Eh=P.createFramebuffer();this.copyTextureToTexture=function(w,B,W=null,V=null,G=0,ge=null){ge===null&&(G!==0?(Ns("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),ge=G,G=0):ge=0);let Te,ye,Re,De,Ge,Ue,Je,mt,wt;const Tt=w.isCompressedTexture?w.mipmaps[ge]:w.image;if(W!==null)Te=W.max.x-W.min.x,ye=W.max.y-W.min.y,Re=W.isBox3?W.max.z-W.min.z:1,De=W.min.x,Ge=W.min.y,Ue=W.isBox3?W.min.z:0;else{const rn=Math.pow(2,-G);Te=Math.floor(Tt.width*rn),ye=Math.floor(Tt.height*rn),w.isDataArrayTexture?Re=Tt.depth:w.isData3DTexture?Re=Math.floor(Tt.depth*rn):Re=1,De=0,Ge=0,Ue=0}V!==null?(Je=V.x,mt=V.y,wt=V.z):(Je=0,mt=0,wt=0);const xt=he.convert(B.format),Fe=he.convert(B.type);let ht;B.isData3DTexture?(F.setTexture3D(B,0),ht=P.TEXTURE_3D):B.isDataArrayTexture||B.isCompressedArrayTexture?(F.setTexture2DArray(B,0),ht=P.TEXTURE_2D_ARRAY):(F.setTexture2D(B,0),ht=P.TEXTURE_2D),P.pixelStorei(P.UNPACK_FLIP_Y_WEBGL,B.flipY),P.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL,B.premultiplyAlpha),P.pixelStorei(P.UNPACK_ALIGNMENT,B.unpackAlignment);const ot=P.getParameter(P.UNPACK_ROW_LENGTH),Qt=P.getParameter(P.UNPACK_IMAGE_HEIGHT),Ti=P.getParameter(P.UNPACK_SKIP_PIXELS),en=P.getParameter(P.UNPACK_SKIP_ROWS),cs=P.getParameter(P.UNPACK_SKIP_IMAGES);P.pixelStorei(P.UNPACK_ROW_LENGTH,Tt.width),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,Tt.height),P.pixelStorei(P.UNPACK_SKIP_PIXELS,De),P.pixelStorei(P.UNPACK_SKIP_ROWS,Ge),P.pixelStorei(P.UNPACK_SKIP_IMAGES,Ue);const yt=w.isDataArrayTexture||w.isData3DTexture,qt=B.isDataArrayTexture||B.isData3DTexture;if(w.isDepthTexture){const rn=v.get(w),Ht=v.get(B),Kt=v.get(rn.__renderTarget),Fr=v.get(Ht.__renderTarget);me.bindFramebuffer(P.READ_FRAMEBUFFER,Kt.__webglFramebuffer),me.bindFramebuffer(P.DRAW_FRAMEBUFFER,Fr.__webglFramebuffer);for(let li=0;li<Re;li++)yt&&(P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,v.get(w).__webglTexture,G,Ue+li),P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,v.get(B).__webglTexture,ge,wt+li)),P.blitFramebuffer(De,Ge,Te,ye,Je,mt,Te,ye,P.DEPTH_BUFFER_BIT,P.NEAREST);me.bindFramebuffer(P.READ_FRAMEBUFFER,null),me.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else if(G!==0||w.isRenderTargetTexture||v.has(w)){const rn=v.get(w),Ht=v.get(B);me.bindFramebuffer(P.READ_FRAMEBUFFER,Th),me.bindFramebuffer(P.DRAW_FRAMEBUFFER,Eh);for(let Kt=0;Kt<Re;Kt++)yt?P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,rn.__webglTexture,G,Ue+Kt):P.framebufferTexture2D(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,rn.__webglTexture,G),qt?P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,Ht.__webglTexture,ge,wt+Kt):P.framebufferTexture2D(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,Ht.__webglTexture,ge),G!==0?P.blitFramebuffer(De,Ge,Te,ye,Je,mt,Te,ye,P.COLOR_BUFFER_BIT,P.NEAREST):qt?P.copyTexSubImage3D(ht,ge,Je,mt,wt+Kt,De,Ge,Te,ye):P.copyTexSubImage2D(ht,ge,Je,mt,De,Ge,Te,ye);me.bindFramebuffer(P.READ_FRAMEBUFFER,null),me.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else qt?w.isDataTexture||w.isData3DTexture?P.texSubImage3D(ht,ge,Je,mt,wt,Te,ye,Re,xt,Fe,Tt.data):B.isCompressedArrayTexture?P.compressedTexSubImage3D(ht,ge,Je,mt,wt,Te,ye,Re,xt,Tt.data):P.texSubImage3D(ht,ge,Je,mt,wt,Te,ye,Re,xt,Fe,Tt):w.isDataTexture?P.texSubImage2D(P.TEXTURE_2D,ge,Je,mt,Te,ye,xt,Fe,Tt.data):w.isCompressedTexture?P.compressedTexSubImage2D(P.TEXTURE_2D,ge,Je,mt,Tt.width,Tt.height,xt,Tt.data):P.texSubImage2D(P.TEXTURE_2D,ge,Je,mt,Te,ye,xt,Fe,Tt);P.pixelStorei(P.UNPACK_ROW_LENGTH,ot),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,Qt),P.pixelStorei(P.UNPACK_SKIP_PIXELS,Ti),P.pixelStorei(P.UNPACK_SKIP_ROWS,en),P.pixelStorei(P.UNPACK_SKIP_IMAGES,cs),ge===0&&B.generateMipmaps&&P.generateMipmap(ht),me.unbindTexture()},this.initRenderTarget=function(w){v.get(w).__webglFramebuffer===void 0&&F.setupRenderTarget(w)},this.initTexture=function(w){w.isCubeTexture?F.setTextureCube(w,0):w.isData3DTexture?F.setTexture3D(w,0):w.isDataArrayTexture||w.isCompressedArrayTexture?F.setTexture2DArray(w,0):F.setTexture2D(w,0),me.unbindTexture()},this.resetState=function(){L=0,k=0,z=null,me.reset(),pe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return wn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=nt._getDrawingBufferColorSpace(e),t.unpackColorSpace=nt._getUnpackColorSpace()}}function Mc(r,e){if(e===td)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),r;if(e===ma||e===Wc){let t=r.getIndex();if(t===null){const o=[],a=r.getAttribute("position");if(a!==void 0){for(let c=0;c<a.count;c++)o.push(c);r.setIndex(o),t=r.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),r}const n=t.count-2,i=[];if(e===ma)for(let o=1;o<=n;o++)i.push(t.getX(0)),i.push(t.getX(o)),i.push(t.getX(o+1));else for(let o=0;o<n;o++)o%2===0?(i.push(t.getX(o)),i.push(t.getX(o+1)),i.push(t.getX(o+2))):(i.push(t.getX(o+2)),i.push(t.getX(o+1)),i.push(t.getX(o)));i.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");const s=r.clone();return s.setIndex(i),s.clearGroups(),s}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),r}class zg extends os{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new Xg(t)}),this.register(function(t){return new Yg(t)}),this.register(function(t){return new t_(t)}),this.register(function(t){return new n_(t)}),this.register(function(t){return new i_(t)}),this.register(function(t){return new qg(t)}),this.register(function(t){return new Kg(t)}),this.register(function(t){return new $g(t)}),this.register(function(t){return new Zg(t)}),this.register(function(t){return new Wg(t)}),this.register(function(t){return new Jg(t)}),this.register(function(t){return new jg(t)}),this.register(function(t){return new e_(t)}),this.register(function(t){return new Qg(t)}),this.register(function(t){return new Hg(t)}),this.register(function(t){return new s_(t)}),this.register(function(t){return new r_(t)})}load(e,t,n,i){const s=this;let o;if(this.resourcePath!=="")o=this.resourcePath;else if(this.path!==""){const l=As.extractUrlBase(e);o=As.resolveURL(l,this.path)}else o=As.extractUrlBase(e);this.manager.itemStart(e);const a=function(l){i?i(l):console.error(l),s.manager.itemError(e),s.manager.itemEnd(e)},c=new ah(this.manager);c.setPath(this.path),c.setResponseType("arraybuffer"),c.setRequestHeader(this.requestHeader),c.setWithCredentials(this.withCredentials),c.load(e,function(l){try{s.parse(l,o,function(h){t(h),s.manager.itemEnd(e)},a)}catch(h){a(h)}},n,a)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,i){let s;const o={},a={},c=new TextDecoder;if(typeof e=="string")s=JSON.parse(e);else if(e instanceof ArrayBuffer)if(c.decode(new Uint8Array(e,0,4))===gh){try{o[et.KHR_BINARY_GLTF]=new o_(e)}catch(d){i&&i(d);return}s=JSON.parse(o[et.KHR_BINARY_GLTF].content)}else s=JSON.parse(c.decode(e));else s=e;if(s.asset===void 0||s.asset.version[0]<2){i&&i(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}const l=new v_(s,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});l.fileLoader.setRequestHeader(this.requestHeader);for(let h=0;h<this.pluginCallbacks.length;h++){const d=this.pluginCallbacks[h](l);d.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),a[d.name]=d,o[d.name]=!0}if(s.extensionsUsed)for(let h=0;h<s.extensionsUsed.length;++h){const d=s.extensionsUsed[h],u=s.extensionsRequired||[];switch(d){case et.KHR_MATERIALS_UNLIT:o[d]=new Vg;break;case et.KHR_DRACO_MESH_COMPRESSION:o[d]=new a_(s,this.dracoLoader);break;case et.KHR_TEXTURE_TRANSFORM:o[d]=new l_;break;case et.KHR_MESH_QUANTIZATION:o[d]=new c_;break;default:u.indexOf(d)>=0&&a[d]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+d+'".')}}l.setExtensions(o),l.setPlugins(a),l.parse(n,i)}parseAsync(e,t){const n=this;return new Promise(function(i,s){n.parse(e,t,i,s)})}}function Gg(){let r={};return{get:function(e){return r[e]},add:function(e,t){r[e]=t},remove:function(e){delete r[e]},removeAll:function(){r={}}}}const et={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"};class Hg{constructor(e){this.parser=e,this.name=et.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){const e=this.parser,t=this.parser.json.nodes||[];for(let n=0,i=t.length;n<i;n++){const s=t[n];s.extensions&&s.extensions[this.name]&&s.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,s.extensions[this.name].light)}}_loadLight(e){const t=this.parser,n="light:"+e;let i=t.cache.get(n);if(i)return i;const s=t.json,c=((s.extensions&&s.extensions[this.name]||{}).lights||[])[e];let l;const h=new Oe(16777215);c.color!==void 0&&h.setRGB(c.color[0],c.color[1],c.color[2],Xt);const d=c.range!==void 0?c.range:0;switch(c.type){case"directional":l=new qa(h),l.target.position.set(0,0,-1),l.add(l.target);break;case"point":l=new Yi(h),l.distance=d;break;case"spot":l=new bi(h),l.distance=d,c.spot=c.spot||{},c.spot.innerConeAngle=c.spot.innerConeAngle!==void 0?c.spot.innerConeAngle:0,c.spot.outerConeAngle=c.spot.outerConeAngle!==void 0?c.spot.outerConeAngle:Math.PI/4,l.angle=c.spot.outerConeAngle,l.penumbra=1-c.spot.innerConeAngle/c.spot.outerConeAngle,l.target.position.set(0,0,-1),l.add(l.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+c.type)}return l.position.set(0,0,0),bn(l,c),c.intensity!==void 0&&(l.intensity=c.intensity),l.name=t.createUniqueName(c.name||"light_"+e),i=Promise.resolve(l),t.cache.add(n,i),i}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){const t=this,n=this.parser,s=n.json.nodes[e],a=(s.extensions&&s.extensions[this.name]||{}).light;return a===void 0?null:this._loadLight(a).then(function(c){return n._getNodeRef(t.cache,a,c)})}}class Vg{constructor(){this.name=et.KHR_MATERIALS_UNLIT}getMaterialType(){return gt}extendParams(e,t,n){const i=[];e.color=new Oe(1,1,1),e.opacity=1;const s=t.pbrMetallicRoughness;if(s){if(Array.isArray(s.baseColorFactor)){const o=s.baseColorFactor;e.color.setRGB(o[0],o[1],o[2],Xt),e.opacity=o[3]}s.baseColorTexture!==void 0&&i.push(n.assignTexture(e,"map",s.baseColorTexture,Bt))}return Promise.all(i)}}class Wg{constructor(e){this.parser=e,this.name=et.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){const i=this.parser.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const s=i.extensions[this.name].emissiveStrength;return s!==void 0&&(t.emissiveIntensity=s),Promise.resolve()}}class Xg{constructor(e){this.parser=e,this.name=et.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:In}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const s=[],o=i.extensions[this.name];if(o.clearcoatFactor!==void 0&&(t.clearcoat=o.clearcoatFactor),o.clearcoatTexture!==void 0&&s.push(n.assignTexture(t,"clearcoatMap",o.clearcoatTexture)),o.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=o.clearcoatRoughnessFactor),o.clearcoatRoughnessTexture!==void 0&&s.push(n.assignTexture(t,"clearcoatRoughnessMap",o.clearcoatRoughnessTexture)),o.clearcoatNormalTexture!==void 0&&(s.push(n.assignTexture(t,"clearcoatNormalMap",o.clearcoatNormalTexture)),o.clearcoatNormalTexture.scale!==void 0)){const a=o.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new Le(a,a)}return Promise.all(s)}}class Yg{constructor(e){this.parser=e,this.name=et.KHR_MATERIALS_DISPERSION}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:In}extendMaterialParams(e,t){const i=this.parser.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const s=i.extensions[this.name];return t.dispersion=s.dispersion!==void 0?s.dispersion:0,Promise.resolve()}}class jg{constructor(e){this.parser=e,this.name=et.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:In}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const s=[],o=i.extensions[this.name];return o.iridescenceFactor!==void 0&&(t.iridescence=o.iridescenceFactor),o.iridescenceTexture!==void 0&&s.push(n.assignTexture(t,"iridescenceMap",o.iridescenceTexture)),o.iridescenceIor!==void 0&&(t.iridescenceIOR=o.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),o.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=o.iridescenceThicknessMinimum),o.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=o.iridescenceThicknessMaximum),o.iridescenceThicknessTexture!==void 0&&s.push(n.assignTexture(t,"iridescenceThicknessMap",o.iridescenceThicknessTexture)),Promise.all(s)}}class qg{constructor(e){this.parser=e,this.name=et.KHR_MATERIALS_SHEEN}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:In}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const s=[];t.sheenColor=new Oe(0,0,0),t.sheenRoughness=0,t.sheen=1;const o=i.extensions[this.name];if(o.sheenColorFactor!==void 0){const a=o.sheenColorFactor;t.sheenColor.setRGB(a[0],a[1],a[2],Xt)}return o.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=o.sheenRoughnessFactor),o.sheenColorTexture!==void 0&&s.push(n.assignTexture(t,"sheenColorMap",o.sheenColorTexture,Bt)),o.sheenRoughnessTexture!==void 0&&s.push(n.assignTexture(t,"sheenRoughnessMap",o.sheenRoughnessTexture)),Promise.all(s)}}class Kg{constructor(e){this.parser=e,this.name=et.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:In}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const s=[],o=i.extensions[this.name];return o.transmissionFactor!==void 0&&(t.transmission=o.transmissionFactor),o.transmissionTexture!==void 0&&s.push(n.assignTexture(t,"transmissionMap",o.transmissionTexture)),Promise.all(s)}}class $g{constructor(e){this.parser=e,this.name=et.KHR_MATERIALS_VOLUME}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:In}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const s=[],o=i.extensions[this.name];t.thickness=o.thicknessFactor!==void 0?o.thicknessFactor:0,o.thicknessTexture!==void 0&&s.push(n.assignTexture(t,"thicknessMap",o.thicknessTexture)),t.attenuationDistance=o.attenuationDistance||1/0;const a=o.attenuationColor||[1,1,1];return t.attenuationColor=new Oe().setRGB(a[0],a[1],a[2],Xt),Promise.all(s)}}class Zg{constructor(e){this.parser=e,this.name=et.KHR_MATERIALS_IOR}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:In}extendMaterialParams(e,t){const i=this.parser.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const s=i.extensions[this.name];return t.ior=s.ior!==void 0?s.ior:1.5,Promise.resolve()}}class Jg{constructor(e){this.parser=e,this.name=et.KHR_MATERIALS_SPECULAR}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:In}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const s=[],o=i.extensions[this.name];t.specularIntensity=o.specularFactor!==void 0?o.specularFactor:1,o.specularTexture!==void 0&&s.push(n.assignTexture(t,"specularIntensityMap",o.specularTexture));const a=o.specularColorFactor||[1,1,1];return t.specularColor=new Oe().setRGB(a[0],a[1],a[2],Xt),o.specularColorTexture!==void 0&&s.push(n.assignTexture(t,"specularColorMap",o.specularColorTexture,Bt)),Promise.all(s)}}class Qg{constructor(e){this.parser=e,this.name=et.EXT_MATERIALS_BUMP}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:In}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const s=[],o=i.extensions[this.name];return t.bumpScale=o.bumpFactor!==void 0?o.bumpFactor:1,o.bumpTexture!==void 0&&s.push(n.assignTexture(t,"bumpMap",o.bumpTexture)),Promise.all(s)}}class e_{constructor(e){this.parser=e,this.name=et.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:In}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const s=[],o=i.extensions[this.name];return o.anisotropyStrength!==void 0&&(t.anisotropy=o.anisotropyStrength),o.anisotropyRotation!==void 0&&(t.anisotropyRotation=o.anisotropyRotation),o.anisotropyTexture!==void 0&&s.push(n.assignTexture(t,"anisotropyMap",o.anisotropyTexture)),Promise.all(s)}}class t_{constructor(e){this.parser=e,this.name=et.KHR_TEXTURE_BASISU}loadTexture(e){const t=this.parser,n=t.json,i=n.textures[e];if(!i.extensions||!i.extensions[this.name])return null;const s=i.extensions[this.name],o=t.options.ktx2Loader;if(!o){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,s.source,o)}}class n_{constructor(e){this.parser=e,this.name=et.EXT_TEXTURE_WEBP}loadTexture(e){const t=this.name,n=this.parser,i=n.json,s=i.textures[e];if(!s.extensions||!s.extensions[t])return null;const o=s.extensions[t],a=i.images[o.source];let c=n.textureLoader;if(a.uri){const l=n.options.manager.getHandler(a.uri);l!==null&&(c=l)}return n.loadTextureImage(e,o.source,c)}}class i_{constructor(e){this.parser=e,this.name=et.EXT_TEXTURE_AVIF}loadTexture(e){const t=this.name,n=this.parser,i=n.json,s=i.textures[e];if(!s.extensions||!s.extensions[t])return null;const o=s.extensions[t],a=i.images[o.source];let c=n.textureLoader;if(a.uri){const l=n.options.manager.getHandler(a.uri);l!==null&&(c=l)}return n.loadTextureImage(e,o.source,c)}}class s_{constructor(e){this.name=et.EXT_MESHOPT_COMPRESSION,this.parser=e}loadBufferView(e){const t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){const i=n.extensions[this.name],s=this.parser.getDependency("buffer",i.buffer),o=this.parser.options.meshoptDecoder;if(!o||!o.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return s.then(function(a){const c=i.byteOffset||0,l=i.byteLength||0,h=i.count,d=i.byteStride,u=new Uint8Array(a,c,l);return o.decodeGltfBufferAsync?o.decodeGltfBufferAsync(h,d,u,i.mode,i.filter).then(function(f){return f.buffer}):o.ready.then(function(){const f=new ArrayBuffer(h*d);return o.decodeGltfBuffer(new Uint8Array(f),h,d,u,i.mode,i.filter),f})})}else return null}}class r_{constructor(e){this.name=et.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){const t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;const i=t.meshes[n.mesh];for(const l of i.primitives)if(l.mode!==an.TRIANGLES&&l.mode!==an.TRIANGLE_STRIP&&l.mode!==an.TRIANGLE_FAN&&l.mode!==void 0)return null;const o=n.extensions[this.name].attributes,a=[],c={};for(const l in o)a.push(this.parser.getDependency("accessor",o[l]).then(h=>(c[l]=h,c[l])));return a.length<1?null:(a.push(this.parser.createNodeMesh(e)),Promise.all(a).then(l=>{const h=l.pop(),d=h.isGroup?h.children:[h],u=l[0].count,f=[];for(const m of d){const _=new je,g=new I,p=new xn,x=new I(1,1,1),S=new iu(m.geometry,m.material,u);for(let M=0;M<u;M++)c.TRANSLATION&&g.fromBufferAttribute(c.TRANSLATION,M),c.ROTATION&&p.fromBufferAttribute(c.ROTATION,M),c.SCALE&&x.fromBufferAttribute(c.SCALE,M),S.setMatrixAt(M,_.compose(g,p,x));for(const M in c)if(M==="_COLOR_0"){const T=c[M];S.instanceColor=new _a(T.array,T.itemSize,T.normalized)}else M!=="TRANSLATION"&&M!=="ROTATION"&&M!=="SCALE"&&m.geometry.setAttribute(M,c[M]);Mt.prototype.copy.call(S,m),this.parser.assignFinalMaterial(S),f.push(S)}return h.isGroup?(h.clear(),h.add(...f),h):f[0]}))}}const gh="glTF",ys=12,Sc={JSON:1313821514,BIN:5130562};class o_{constructor(e){this.name=et.KHR_BINARY_GLTF,this.content=null,this.body=null;const t=new DataView(e,0,ys),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==gh)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");const i=this.header.length-ys,s=new DataView(e,ys);let o=0;for(;o<i;){const a=s.getUint32(o,!0);o+=4;const c=s.getUint32(o,!0);if(o+=4,c===Sc.JSON){const l=new Uint8Array(e,ys+o,a);this.content=n.decode(l)}else if(c===Sc.BIN){const l=ys+o;this.body=e.slice(l,l+a)}o+=a}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}}class a_{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=et.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){const n=this.json,i=this.dracoLoader,s=e.extensions[this.name].bufferView,o=e.extensions[this.name].attributes,a={},c={},l={};for(const h in o){const d=Ma[h]||h.toLowerCase();a[d]=o[h]}for(const h in e.attributes){const d=Ma[h]||h.toLowerCase();if(o[h]!==void 0){const u=n.accessors[e.attributes[h]],f=ji[u.componentType];l[d]=f.name,c[d]=u.normalized===!0}}return t.getDependency("bufferView",s).then(function(h){return new Promise(function(d,u){i.decodeDracoFile(h,function(f){for(const m in f.attributes){const _=f.attributes[m],g=c[m];g!==void 0&&(_.normalized=g)}d(f)},a,l,Xt,u)})})}}class l_{constructor(){this.name=et.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){return(t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0||(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),e.needsUpdate=!0),e}}class c_{constructor(){this.name=et.KHR_MESH_QUANTIZATION}}class _h extends Fs{constructor(e,t,n,i){super(e,t,n,i)}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,s=e*i*3+i;for(let o=0;o!==i;o++)t[o]=n[s+o];return t}interpolate_(e,t,n,i){const s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=a*2,l=a*3,h=i-t,d=(n-t)/h,u=d*d,f=u*d,m=e*l,_=m-l,g=-2*f+3*u,p=f-u,x=1-g,S=p-u+d;for(let M=0;M!==a;M++){const T=o[_+M+a],E=o[_+M+c]*h,R=o[m+M+a],D=o[m+M]*h;s[M]=x*T+S*E+g*R+p*D}return s}}const h_=new xn;class d_ extends _h{interpolate_(e,t,n,i){const s=super.interpolate_(e,t,n,i);return h_.fromArray(s).normalize().toArray(s),s}}const an={POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6},ji={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},wc={9728:It,9729:Dt,9984:Oc,9985:mr,9986:Ms,9987:zn},Tc={33071:ln,33648:Mr,10497:$i},bo={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},Ma={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},ti={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},u_={CUBICSPLINE:void 0,LINEAR:Is,STEP:Ls},Mo={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function f_(r){return r.DefaultMaterial===void 0&&(r.DefaultMaterial=new te({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:Wn})),r.DefaultMaterial}function mi(r,e,t){for(const n in t.extensions)r[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function bn(r,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(r.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function p_(r,e,t){let n=!1,i=!1,s=!1;for(let l=0,h=e.length;l<h;l++){const d=e[l];if(d.POSITION!==void 0&&(n=!0),d.NORMAL!==void 0&&(i=!0),d.COLOR_0!==void 0&&(s=!0),n&&i&&s)break}if(!n&&!i&&!s)return Promise.resolve(r);const o=[],a=[],c=[];for(let l=0,h=e.length;l<h;l++){const d=e[l];if(n){const u=d.POSITION!==void 0?t.getDependency("accessor",d.POSITION):r.attributes.position;o.push(u)}if(i){const u=d.NORMAL!==void 0?t.getDependency("accessor",d.NORMAL):r.attributes.normal;a.push(u)}if(s){const u=d.COLOR_0!==void 0?t.getDependency("accessor",d.COLOR_0):r.attributes.color;c.push(u)}}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(c)]).then(function(l){const h=l[0],d=l[1],u=l[2];return n&&(r.morphAttributes.position=h),i&&(r.morphAttributes.normal=d),s&&(r.morphAttributes.color=u),r.morphTargetsRelative=!0,r})}function m_(r,e){if(r.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)r.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){const t=e.extras.targetNames;if(r.morphTargetInfluences.length===t.length){r.morphTargetDictionary={};for(let n=0,i=t.length;n<i;n++)r.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function g_(r){let e;const t=r.extensions&&r.extensions[et.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+So(t.attributes):e=r.indices+":"+So(r.attributes)+":"+r.mode,r.targets!==void 0)for(let n=0,i=r.targets.length;n<i;n++)e+=":"+So(r.targets[n]);return e}function So(r){let e="";const t=Object.keys(r).sort();for(let n=0,i=t.length;n<i;n++)e+=t[n]+":"+r[t[n]]+";";return e}function Sa(r){switch(r){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function __(r){return r.search(/\.jpe?g($|\?)/i)>0||r.search(/^data\:image\/jpeg/)===0?"image/jpeg":r.search(/\.webp($|\?)/i)>0||r.search(/^data\:image\/webp/)===0?"image/webp":r.search(/\.ktx2($|\?)/i)>0||r.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}const x_=new je;class v_{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new Gg,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,i=-1,s=!1,o=-1;if(typeof navigator<"u"){const a=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(a)===!0;const c=a.match(/Version\/(\d+)/);i=n&&c?parseInt(c[1],10):-1,s=a.indexOf("Firefox")>-1,o=s?a.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&i<17||s&&o<98?this.textureLoader=new Au(this.options.manager):this.textureLoader=new Lu(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new ah(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){const n=this,i=this.json,s=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(o){return o._markDefs&&o._markDefs()}),Promise.all(this._invokeAll(function(o){return o.beforeRoot&&o.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(o){const a={scene:o[0][i.scene||0],scenes:o[0],animations:o[1],cameras:o[2],asset:i.asset,parser:n,userData:{}};return mi(s,a,i),bn(a,i),Promise.all(n._invokeAll(function(c){return c.afterRoot&&c.afterRoot(a)})).then(function(){for(const c of a.scenes)c.updateMatrixWorld();e(a)})}).catch(t)}_markDefs(){const e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let i=0,s=t.length;i<s;i++){const o=t[i].joints;for(let a=0,c=o.length;a<c;a++)e[o[a]].isBone=!0}for(let i=0,s=e.length;i<s;i++){const o=e[i];o.mesh!==void 0&&(this._addNodeRef(this.meshCache,o.mesh),o.skin!==void 0&&(n[o.mesh].isSkinnedMesh=!0)),o.camera!==void 0&&this._addNodeRef(this.cameraCache,o.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;const i=n.clone(),s=(o,a)=>{const c=this.associations.get(o);c!=null&&this.associations.set(a,c);for(const[l,h]of o.children.entries())s(h,a.children[l])};return s(n,i),i.name+="_instance_"+e.uses[t]++,i}_invokeOne(e){const t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){const i=e(t[n]);if(i)return i}return null}_invokeAll(e){const t=Object.values(this.plugins);t.unshift(this);const n=[];for(let i=0;i<t.length;i++){const s=e(t[i]);s&&n.push(s)}return n}getDependency(e,t){const n=e+":"+t;let i=this.cache.get(n);if(!i){switch(e){case"scene":i=this.loadScene(t);break;case"node":i=this._invokeOne(function(s){return s.loadNode&&s.loadNode(t)});break;case"mesh":i=this._invokeOne(function(s){return s.loadMesh&&s.loadMesh(t)});break;case"accessor":i=this.loadAccessor(t);break;case"bufferView":i=this._invokeOne(function(s){return s.loadBufferView&&s.loadBufferView(t)});break;case"buffer":i=this.loadBuffer(t);break;case"material":i=this._invokeOne(function(s){return s.loadMaterial&&s.loadMaterial(t)});break;case"texture":i=this._invokeOne(function(s){return s.loadTexture&&s.loadTexture(t)});break;case"skin":i=this.loadSkin(t);break;case"animation":i=this._invokeOne(function(s){return s.loadAnimation&&s.loadAnimation(t)});break;case"camera":i=this.loadCamera(t);break;default:if(i=this._invokeOne(function(s){return s!=this&&s.getDependency&&s.getDependency(e,t)}),!i)throw new Error("Unknown type: "+e);break}this.cache.add(n,i)}return i}getDependencies(e){let t=this.cache.get(e);if(!t){const n=this,i=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(i.map(function(s,o){return n.getDependency(e,o)})),this.cache.add(e,t)}return t}loadBuffer(e){const t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[et.KHR_BINARY_GLTF].body);const i=this.options;return new Promise(function(s,o){n.load(As.resolveURL(t.uri,i.path),s,void 0,function(){o(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){const t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){const i=t.byteLength||0,s=t.byteOffset||0;return n.slice(s,s+i)})}loadAccessor(e){const t=this,n=this.json,i=this.json.accessors[e];if(i.bufferView===void 0&&i.sparse===void 0){const o=bo[i.type],a=ji[i.componentType],c=i.normalized===!0,l=new a(i.count*o);return Promise.resolve(new Rt(l,o,c))}const s=[];return i.bufferView!==void 0?s.push(this.getDependency("bufferView",i.bufferView)):s.push(null),i.sparse!==void 0&&(s.push(this.getDependency("bufferView",i.sparse.indices.bufferView)),s.push(this.getDependency("bufferView",i.sparse.values.bufferView))),Promise.all(s).then(function(o){const a=o[0],c=bo[i.type],l=ji[i.componentType],h=l.BYTES_PER_ELEMENT,d=h*c,u=i.byteOffset||0,f=i.bufferView!==void 0?n.bufferViews[i.bufferView].byteStride:void 0,m=i.normalized===!0;let _,g;if(f&&f!==d){const p=Math.floor(u/f),x="InterleavedBuffer:"+i.bufferView+":"+i.componentType+":"+p+":"+i.count;let S=t.cache.get(x);S||(_=new l(a,p*f,i.count*f/h),S=new Jd(_,f/h),t.cache.add(x,S)),g=new Ba(S,c,u%f/h,m)}else a===null?_=new l(i.count*c):_=new l(a,u,i.count*c),g=new Rt(_,c,m);if(i.sparse!==void 0){const p=bo.SCALAR,x=ji[i.sparse.indices.componentType],S=i.sparse.indices.byteOffset||0,M=i.sparse.values.byteOffset||0,T=new x(o[1],S,i.sparse.count*p),E=new l(o[2],M,i.sparse.count*c);a!==null&&(g=new Rt(g.array.slice(),g.itemSize,g.normalized)),g.normalized=!1;for(let R=0,D=T.length;R<D;R++){const y=T[R];if(g.setX(y,E[R*c]),c>=2&&g.setY(y,E[R*c+1]),c>=3&&g.setZ(y,E[R*c+2]),c>=4&&g.setW(y,E[R*c+3]),c>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}g.normalized=m}return g})}loadTexture(e){const t=this.json,n=this.options,s=t.textures[e].source,o=t.images[s];let a=this.textureLoader;if(o.uri){const c=n.manager.getHandler(o.uri);c!==null&&(a=c)}return this.loadTextureImage(e,s,a)}loadTextureImage(e,t,n){const i=this,s=this.json,o=s.textures[e],a=s.images[t],c=(a.uri||a.bufferView)+":"+o.sampler;if(this.textureCache[c])return this.textureCache[c];const l=this.loadImageSource(t,n).then(function(h){h.flipY=!1,h.name=o.name||a.name||"",h.name===""&&typeof a.uri=="string"&&a.uri.startsWith("data:image/")===!1&&(h.name=a.uri);const u=(s.samplers||{})[o.sampler]||{};return h.magFilter=wc[u.magFilter]||Dt,h.minFilter=wc[u.minFilter]||zn,h.wrapS=Tc[u.wrapS]||$i,h.wrapT=Tc[u.wrapT]||$i,h.generateMipmaps=!h.isCompressedTexture&&h.minFilter!==It&&h.minFilter!==Dt,i.associations.set(h,{textures:e}),h}).catch(function(){return null});return this.textureCache[c]=l,l}loadImageSource(e,t){const n=this,i=this.json,s=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(d=>d.clone());const o=i.images[e],a=self.URL||self.webkitURL;let c=o.uri||"",l=!1;if(o.bufferView!==void 0)c=n.getDependency("bufferView",o.bufferView).then(function(d){l=!0;const u=new Blob([d],{type:o.mimeType});return c=a.createObjectURL(u),c});else if(o.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");const h=Promise.resolve(c).then(function(d){return new Promise(function(u,f){let m=u;t.isImageBitmapLoader===!0&&(m=function(_){const g=new Nt(_);g.needsUpdate=!0,u(g)}),t.load(As.resolveURL(d,s.path),m,void 0,f)})}).then(function(d){return l===!0&&a.revokeObjectURL(c),bn(d,o),d.userData.mimeType=o.mimeType||__(o.uri),d}).catch(function(d){throw console.error("THREE.GLTFLoader: Couldn't load texture",c),d});return this.sourceCache[e]=h,h}assignTexture(e,t,n,i){const s=this;return this.getDependency("texture",n.index).then(function(o){if(!o)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(o=o.clone(),o.channel=n.texCoord),s.extensions[et.KHR_TEXTURE_TRANSFORM]){const a=n.extensions!==void 0?n.extensions[et.KHR_TEXTURE_TRANSFORM]:void 0;if(a){const c=s.associations.get(o);o=s.extensions[et.KHR_TEXTURE_TRANSFORM].extendTexture(o,a),s.associations.set(o,c)}}return i!==void 0&&(o.colorSpace=i),e[t]=o,o})}assignFinalMaterial(e){const t=e.geometry;let n=e.material;const i=t.attributes.tangent===void 0,s=t.attributes.color!==void 0,o=t.attributes.normal===void 0;if(e.isPoints){const a="PointsMaterial:"+n.uuid;let c=this.cache.get(a);c||(c=new Ha,An.prototype.copy.call(c,n),c.color.copy(n.color),c.map=n.map,c.sizeAttenuation=!1,this.cache.add(a,c)),n=c}else if(e.isLine){const a="LineBasicMaterial:"+n.uuid;let c=this.cache.get(a);c||(c=new si,An.prototype.copy.call(c,n),c.color.copy(n.color),c.map=n.map,this.cache.add(a,c)),n=c}if(i||s||o){let a="ClonedMaterial:"+n.uuid+":";i&&(a+="derivative-tangents:"),s&&(a+="vertex-colors:"),o&&(a+="flat-shading:");let c=this.cache.get(a);c||(c=n.clone(),s&&(c.vertexColors=!0),o&&(c.flatShading=!0),i&&(c.normalScale&&(c.normalScale.y*=-1),c.clearcoatNormalScale&&(c.clearcoatNormalScale.y*=-1)),this.cache.add(a,c),this.associations.set(c,this.associations.get(n))),n=c}e.material=n}getMaterialType(){return te}loadMaterial(e){const t=this,n=this.json,i=this.extensions,s=n.materials[e];let o;const a={},c=s.extensions||{},l=[];if(c[et.KHR_MATERIALS_UNLIT]){const d=i[et.KHR_MATERIALS_UNLIT];o=d.getMaterialType(),l.push(d.extendParams(a,s,t))}else{const d=s.pbrMetallicRoughness||{};if(a.color=new Oe(1,1,1),a.opacity=1,Array.isArray(d.baseColorFactor)){const u=d.baseColorFactor;a.color.setRGB(u[0],u[1],u[2],Xt),a.opacity=u[3]}d.baseColorTexture!==void 0&&l.push(t.assignTexture(a,"map",d.baseColorTexture,Bt)),a.metalness=d.metallicFactor!==void 0?d.metallicFactor:1,a.roughness=d.roughnessFactor!==void 0?d.roughnessFactor:1,d.metallicRoughnessTexture!==void 0&&(l.push(t.assignTexture(a,"metalnessMap",d.metallicRoughnessTexture)),l.push(t.assignTexture(a,"roughnessMap",d.metallicRoughnessTexture))),o=this._invokeOne(function(u){return u.getMaterialType&&u.getMaterialType(e)}),l.push(Promise.all(this._invokeAll(function(u){return u.extendMaterialParams&&u.extendMaterialParams(e,a)})))}s.doubleSided===!0&&(a.side=At);const h=s.alphaMode||Mo.OPAQUE;if(h===Mo.BLEND?(a.transparent=!0,a.depthWrite=!1):(a.transparent=!1,h===Mo.MASK&&(a.alphaTest=s.alphaCutoff!==void 0?s.alphaCutoff:.5)),s.normalTexture!==void 0&&o!==gt&&(l.push(t.assignTexture(a,"normalMap",s.normalTexture)),a.normalScale=new Le(1,1),s.normalTexture.scale!==void 0)){const d=s.normalTexture.scale;a.normalScale.set(d,d)}if(s.occlusionTexture!==void 0&&o!==gt&&(l.push(t.assignTexture(a,"aoMap",s.occlusionTexture)),s.occlusionTexture.strength!==void 0&&(a.aoMapIntensity=s.occlusionTexture.strength)),s.emissiveFactor!==void 0&&o!==gt){const d=s.emissiveFactor;a.emissive=new Oe().setRGB(d[0],d[1],d[2],Xt)}return s.emissiveTexture!==void 0&&o!==gt&&l.push(t.assignTexture(a,"emissiveMap",s.emissiveTexture,Bt)),Promise.all(l).then(function(){const d=new o(a);return s.name&&(d.name=s.name),bn(d,s),t.associations.set(d,{materials:e}),s.extensions&&mi(i,d,s),d})}createUniqueName(e){const t=ft.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){const t=this,n=this.extensions,i=this.primitiveCache;function s(a){return n[et.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(a,t).then(function(c){return Ec(c,a,t)})}const o=[];for(let a=0,c=e.length;a<c;a++){const l=e[a],h=g_(l),d=i[h];if(d)o.push(d.promise);else{let u;l.extensions&&l.extensions[et.KHR_DRACO_MESH_COMPRESSION]?u=s(l):u=Ec(new lt,l,t),i[h]={primitive:l,promise:u},o.push(u)}}return Promise.all(o)}loadMesh(e){const t=this,n=this.json,i=this.extensions,s=n.meshes[e],o=s.primitives,a=[];for(let c=0,l=o.length;c<l;c++){const h=o[c].material===void 0?f_(this.cache):this.getDependency("material",o[c].material);a.push(h)}return a.push(t.loadGeometries(o)),Promise.all(a).then(function(c){const l=c.slice(0,c.length-1),h=c[c.length-1],d=[];for(let f=0,m=h.length;f<m;f++){const _=h[f],g=o[f];let p;const x=l[f];if(g.mode===an.TRIANGLES||g.mode===an.TRIANGLE_STRIP||g.mode===an.TRIANGLE_FAN||g.mode===void 0)p=s.isSkinnedMesh===!0?new eu(_,x):new N(_,x),p.isSkinnedMesh===!0&&p.normalizeSkinWeights(),g.mode===an.TRIANGLE_STRIP?p.geometry=Mc(p.geometry,Wc):g.mode===an.TRIANGLE_FAN&&(p.geometry=Mc(p.geometry,ma));else if(g.mode===an.LINES)p=new au(_,x);else if(g.mode===an.LINE_STRIP)p=new Sn(_,x);else if(g.mode===an.LINE_LOOP)p=new lu(_,x);else if(g.mode===an.POINTS)p=new ih(_,x);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+g.mode);Object.keys(p.geometry.morphAttributes).length>0&&m_(p,s),p.name=t.createUniqueName(s.name||"mesh_"+e),bn(p,s),g.extensions&&mi(i,p,g),t.assignFinalMaterial(p),d.push(p)}for(let f=0,m=d.length;f<m;f++)t.associations.set(d[f],{meshes:e,primitives:f});if(d.length===1)return s.extensions&&mi(i,d[0],s),d[0];const u=new Ce;s.extensions&&mi(i,u,s),t.associations.set(u,{meshes:e});for(let f=0,m=d.length;f<m;f++)u.add(d[f]);return u})}loadCamera(e){let t;const n=this.json.cameras[e],i=n[n.type];if(!i){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new kt(Et.radToDeg(i.yfov),i.aspectRatio||1,i.znear||1,i.zfar||2e6):n.type==="orthographic"&&(t=new Ir(-i.xmag,i.xmag,i.ymag,-i.ymag,i.znear,i.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),bn(t,n),Promise.resolve(t)}loadSkin(e){const t=this.json.skins[e],n=[];for(let i=0,s=t.joints.length;i<s;i++)n.push(this._loadNodeShallow(t.joints[i]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(i){const s=i.pop(),o=i,a=[],c=[];for(let l=0,h=o.length;l<h;l++){const d=o[l];if(d){a.push(d);const u=new je;s!==null&&u.fromArray(s.array,l*16),c.push(u)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[l])}return new za(a,c)})}loadAnimation(e){const t=this.json,n=this,i=t.animations[e],s=i.name?i.name:"animation_"+e,o=[],a=[],c=[],l=[],h=[];for(let d=0,u=i.channels.length;d<u;d++){const f=i.channels[d],m=i.samplers[f.sampler],_=f.target,g=_.node,p=i.parameters!==void 0?i.parameters[m.input]:m.input,x=i.parameters!==void 0?i.parameters[m.output]:m.output;_.node!==void 0&&(o.push(this.getDependency("node",g)),a.push(this.getDependency("accessor",p)),c.push(this.getDependency("accessor",x)),l.push(m),h.push(_))}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(c),Promise.all(l),Promise.all(h)]).then(function(d){const u=d[0],f=d[1],m=d[2],_=d[3],g=d[4],p=[];for(let S=0,M=u.length;S<M;S++){const T=u[S],E=f[S],R=m[S],D=_[S],y=g[S];if(T===void 0)continue;T.updateMatrix&&T.updateMatrix();const b=n._createAnimationTracks(T,E,R,D,y);if(b)for(let L=0;L<b.length;L++)p.push(b[L])}const x=new yu(s,void 0,p);return bn(x,i),x})}createNodeMesh(e){const t=this.json,n=this,i=t.nodes[e];return i.mesh===void 0?null:n.getDependency("mesh",i.mesh).then(function(s){const o=n._getNodeRef(n.meshCache,i.mesh,s);return i.weights!==void 0&&o.traverse(function(a){if(a.isMesh)for(let c=0,l=i.weights.length;c<l;c++)a.morphTargetInfluences[c]=i.weights[c]}),o})}loadNode(e){const t=this.json,n=this,i=t.nodes[e],s=n._loadNodeShallow(e),o=[],a=i.children||[];for(let l=0,h=a.length;l<h;l++)o.push(n.getDependency("node",a[l]));const c=i.skin===void 0?Promise.resolve(null):n.getDependency("skin",i.skin);return Promise.all([s,Promise.all(o),c]).then(function(l){const h=l[0],d=l[1],u=l[2];u!==null&&h.traverse(function(f){f.isSkinnedMesh&&f.bind(u,x_)});for(let f=0,m=d.length;f<m;f++)h.add(d[f]);return h})}_loadNodeShallow(e){const t=this.json,n=this.extensions,i=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];const s=t.nodes[e],o=s.name?i.createUniqueName(s.name):"",a=[],c=i._invokeOne(function(l){return l.createNodeMesh&&l.createNodeMesh(e)});return c&&a.push(c),s.camera!==void 0&&a.push(i.getDependency("camera",s.camera).then(function(l){return i._getNodeRef(i.cameraCache,s.camera,l)})),i._invokeAll(function(l){return l.createNodeAttachment&&l.createNodeAttachment(e)}).forEach(function(l){a.push(l)}),this.nodeCache[e]=Promise.all(a).then(function(l){let h;if(s.isBone===!0?h=new nh:l.length>1?h=new Ce:l.length===1?h=l[0]:h=new Mt,h!==l[0])for(let d=0,u=l.length;d<u;d++)h.add(l[d]);if(s.name&&(h.userData.name=s.name,h.name=o),bn(h,s),s.extensions&&mi(n,h,s),s.matrix!==void 0){const d=new je;d.fromArray(s.matrix),h.applyMatrix4(d)}else s.translation!==void 0&&h.position.fromArray(s.translation),s.rotation!==void 0&&h.quaternion.fromArray(s.rotation),s.scale!==void 0&&h.scale.fromArray(s.scale);if(!i.associations.has(h))i.associations.set(h,{});else if(s.mesh!==void 0&&i.meshCache.refs[s.mesh]>1){const d=i.associations.get(h);i.associations.set(h,{...d})}return i.associations.get(h).nodes=e,h}),this.nodeCache[e]}loadScene(e){const t=this.extensions,n=this.json.scenes[e],i=this,s=new Ce;n.name&&(s.name=i.createUniqueName(n.name)),bn(s,n),n.extensions&&mi(t,s,n);const o=n.nodes||[],a=[];for(let c=0,l=o.length;c<l;c++)a.push(i.getDependency("node",o[c]));return Promise.all(a).then(function(c){for(let h=0,d=c.length;h<d;h++)s.add(c[h]);const l=h=>{const d=new Map;for(const[u,f]of i.associations)(u instanceof An||u instanceof Nt)&&d.set(u,f);return h.traverse(u=>{const f=i.associations.get(u);f!=null&&d.set(u,f)}),d};return i.associations=l(s),s})}_createAnimationTracks(e,t,n,i,s){const o=[],a=e.name?e.name:e.uuid,c=[];ti[s.path]===ti.weights?e.traverse(function(u){u.morphTargetInfluences&&c.push(u.name?u.name:u.uuid)}):c.push(a);let l;switch(ti[s.path]){case ti.weights:l=es;break;case ti.rotation:l=ts;break;case ti.translation:case ti.scale:l=ns;break;default:switch(n.itemSize){case 1:l=es;break;case 2:case 3:default:l=ns;break}break}const h=i.interpolation!==void 0?u_[i.interpolation]:Is,d=this._getArrayFromAccessor(n);for(let u=0,f=c.length;u<f;u++){const m=new l(c[u]+"."+ti[s.path],t.array,d,h);i.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(m),o.push(m)}return o}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){const n=Sa(t.constructor),i=new Float32Array(t.length);for(let s=0,o=t.length;s<o;s++)i[s]=t[s]*n;t=i}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){const i=this instanceof ts?d_:_h;return new i(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}}function y_(r,e,t){const n=e.attributes,i=new qn;if(n.POSITION!==void 0){const a=t.json.accessors[n.POSITION],c=a.min,l=a.max;if(c!==void 0&&l!==void 0){if(i.set(new I(c[0],c[1],c[2]),new I(l[0],l[1],l[2])),a.normalized){const h=Sa(ji[a.componentType]);i.min.multiplyScalar(h),i.max.multiplyScalar(h)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;const s=e.targets;if(s!==void 0){const a=new I,c=new I;for(let l=0,h=s.length;l<h;l++){const d=s[l];if(d.POSITION!==void 0){const u=t.json.accessors[d.POSITION],f=u.min,m=u.max;if(f!==void 0&&m!==void 0){if(c.setX(Math.max(Math.abs(f[0]),Math.abs(m[0]))),c.setY(Math.max(Math.abs(f[1]),Math.abs(m[1]))),c.setZ(Math.max(Math.abs(f[2]),Math.abs(m[2]))),u.normalized){const _=Sa(ji[u.componentType]);c.multiplyScalar(_)}a.max(c)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}i.expandByVector(a)}r.boundingBox=i;const o=new Ln;i.getCenter(o.center),o.radius=i.min.distanceTo(i.max)/2,r.boundingSphere=o}function Ec(r,e,t){const n=e.attributes,i=[];function s(o,a){return t.getDependency("accessor",o).then(function(c){r.setAttribute(a,c)})}for(const o in n){const a=Ma[o]||o.toLowerCase();a in r.attributes||i.push(s(n[o],a))}if(e.indices!==void 0&&!r.index){const o=t.getDependency("accessor",e.indices).then(function(a){r.setIndex(a)});i.push(o)}return nt.workingColorSpace!==Xt&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${nt.workingColorSpace}" not supported.`),bn(r,e),y_(r,e,t),Promise.all(i).then(function(){return e.targets!==void 0?p_(r,e.targets,t):r})}const Ac={type:"change"},Za={type:"start"},xh={type:"end"},fr=new is,Rc=new ni,b_=Math.cos(70*Et.DEG2RAD),Lt=new I,$t=2*Math.PI,_t={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},wo=1e-6;class vh extends Vu{constructor(e,t=null){super(e,t),this.state=_t.NONE,this.target=new I,this.cursor=new I,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Vi.ROTATE,MIDDLE:Vi.DOLLY,RIGHT:Vi.PAN},this.touches={ONE:Hi.ROTATE,TWO:Hi.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new I,this._lastQuaternion=new xn,this._lastTargetPosition=new I,this._quat=new xn().setFromUnitVectors(e.up,new I(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Zl,this._sphericalDelta=new Zl,this._scale=1,this._panOffset=new I,this._rotateStart=new Le,this._rotateEnd=new Le,this._rotateDelta=new Le,this._panStart=new Le,this._panEnd=new Le,this._panDelta=new Le,this._dollyStart=new Le,this._dollyEnd=new Le,this._dollyDelta=new Le,this._dollyDirection=new I,this._mouse=new Le,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=S_.bind(this),this._onPointerDown=M_.bind(this),this._onPointerUp=w_.bind(this),this._onContextMenu=L_.bind(this),this._onMouseWheel=A_.bind(this),this._onKeyDown=R_.bind(this),this._onTouchStart=C_.bind(this),this._onTouchMove=P_.bind(this),this._onMouseDown=T_.bind(this),this._onMouseMove=E_.bind(this),this._interceptControlDown=I_.bind(this),this._interceptControlUp=D_.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Ac),this.update(),this.state=_t.NONE}update(e=null){const t=this.object.position;Lt.copy(t).sub(this.target),Lt.applyQuaternion(this._quat),this._spherical.setFromVector3(Lt),this.autoRotate&&this.state===_t.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,i=this.maxAzimuthAngle;isFinite(n)&&isFinite(i)&&(n<-Math.PI?n+=$t:n>Math.PI&&(n-=$t),i<-Math.PI?i+=$t:i>Math.PI&&(i-=$t),n<=i?this._spherical.theta=Math.max(n,Math.min(i,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+i)/2?Math.max(n,this._spherical.theta):Math.min(i,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let s=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),s=o!=this._spherical.radius}if(Lt.setFromSpherical(this._spherical),Lt.applyQuaternion(this._quatInverse),t.copy(this.target).add(Lt),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){const a=Lt.length();o=this._clampDistance(a*this._scale);const c=a-o;this.object.position.addScaledVector(this._dollyDirection,c),this.object.updateMatrixWorld(),s=!!c}else if(this.object.isOrthographicCamera){const a=new I(this._mouse.x,this._mouse.y,0);a.unproject(this.object);const c=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),s=c!==this.object.zoom;const l=new I(this._mouse.x,this._mouse.y,0);l.unproject(this.object),this.object.position.sub(l).add(a),this.object.updateMatrixWorld(),o=Lt.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(fr.origin.copy(this.object.position),fr.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(fr.direction))<b_?this.object.lookAt(this.target):(Rc.setFromNormalAndCoplanarPoint(this.object.up,this.target),fr.intersectPlane(Rc,this.target))))}else if(this.object.isOrthographicCamera){const o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),s=!0)}return this._scale=1,this._performCursorZoom=!1,s||this._lastPosition.distanceToSquared(this.object.position)>wo||8*(1-this._lastQuaternion.dot(this.object.quaternion))>wo||this._lastTargetPosition.distanceToSquared(this.target)>wo?(this.dispatchEvent(Ac),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?$t/60*this.autoRotateSpeed*e:$t/60/60*this.autoRotateSpeed}_getZoomScale(e){const t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){Lt.setFromMatrixColumn(t,0),Lt.multiplyScalar(-e),this._panOffset.add(Lt)}_panUp(e,t){this.screenSpacePanning===!0?Lt.setFromMatrixColumn(t,1):(Lt.setFromMatrixColumn(t,0),Lt.crossVectors(this.object.up,Lt)),Lt.multiplyScalar(e),this._panOffset.add(Lt)}_pan(e,t){const n=this.domElement;if(this.object.isPerspectiveCamera){const i=this.object.position;Lt.copy(i).sub(this.target);let s=Lt.length();s*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*s/n.clientHeight,this.object.matrix),this._panUp(2*t*s/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const n=this.domElement.getBoundingClientRect(),i=e-n.left,s=t-n.top,o=n.width,a=n.height;this._mouse.x=i/o*2-1,this._mouse.y=-(s/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft($t*this._rotateDelta.x/t.clientHeight),this._rotateUp($t*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp($t*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-$t*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft($t*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-$t*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),i=.5*(e.pageY+t.y);this._rotateStart.set(n,i)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),i=.5*(e.pageY+t.y);this._panStart.set(n,i)}}_handleTouchStartDolly(e){const t=this._getSecondPointerPosition(e),n=e.pageX-t.x,i=e.pageY-t.y,s=Math.sqrt(n*n+i*i);this._dollyStart.set(0,s)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),i=.5*(e.pageX+n.x),s=.5*(e.pageY+n.y);this._rotateEnd.set(i,s)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft($t*this._rotateDelta.x/t.clientHeight),this._rotateUp($t*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),i=.5*(e.pageY+t.y);this._panEnd.set(n,i)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const t=this._getSecondPointerPosition(e),n=e.pageX-t.x,i=e.pageY-t.y,s=Math.sqrt(n*n+i*i);this._dollyEnd.set(0,s),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const o=(e.pageX+t.x)*.5,a=(e.pageY+t.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new Le,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){const t=e.deltaMode,n={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}}function M_(r){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(r.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(r)&&(this._addPointer(r),r.pointerType==="touch"?this._onTouchStart(r):this._onMouseDown(r)))}function S_(r){this.enabled!==!1&&(r.pointerType==="touch"?this._onTouchMove(r):this._onMouseMove(r))}function w_(r){switch(this._removePointer(r),this._pointers.length){case 0:this.domElement.releasePointerCapture(r.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(xh),this.state=_t.NONE;break;case 1:const e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function T_(r){let e;switch(r.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case Vi.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(r),this.state=_t.DOLLY;break;case Vi.ROTATE:if(r.ctrlKey||r.metaKey||r.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(r),this.state=_t.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(r),this.state=_t.ROTATE}break;case Vi.PAN:if(r.ctrlKey||r.metaKey||r.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(r),this.state=_t.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(r),this.state=_t.PAN}break;default:this.state=_t.NONE}this.state!==_t.NONE&&this.dispatchEvent(Za)}function E_(r){switch(this.state){case _t.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(r);break;case _t.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(r);break;case _t.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(r);break}}function A_(r){this.enabled===!1||this.enableZoom===!1||this.state!==_t.NONE||(r.preventDefault(),this.dispatchEvent(Za),this._handleMouseWheel(this._customWheelEvent(r)),this.dispatchEvent(xh))}function R_(r){this.enabled!==!1&&this._handleKeyDown(r)}function C_(r){switch(this._trackPointer(r),this._pointers.length){case 1:switch(this.touches.ONE){case Hi.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(r),this.state=_t.TOUCH_ROTATE;break;case Hi.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(r),this.state=_t.TOUCH_PAN;break;default:this.state=_t.NONE}break;case 2:switch(this.touches.TWO){case Hi.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(r),this.state=_t.TOUCH_DOLLY_PAN;break;case Hi.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(r),this.state=_t.TOUCH_DOLLY_ROTATE;break;default:this.state=_t.NONE}break;default:this.state=_t.NONE}this.state!==_t.NONE&&this.dispatchEvent(Za)}function P_(r){switch(this._trackPointer(r),this.state){case _t.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(r),this.update();break;case _t.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(r),this.update();break;case _t.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(r),this.update();break;case _t.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(r),this.update();break;default:this.state=_t.NONE}}function L_(r){this.enabled!==!1&&r.preventDefault()}function I_(r){r.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function D_(r){r.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const xi=class xi{constructor(){U(this,"container");U(this,"banner");U(this,"visible",!1);U(this,"activeRenderer",null);U(this,"lastTime",performance.now());U(this,"frameCount",0);U(this,"fps",60);U(this,"frameMs",16.6);U(this,"wsLatencyMs",0);U(this,"serverDiag",null);this.banner=document.createElement("div"),this.banner.id="hw-accel-banner",this.banner.style.cssText=`
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 99999;
      background: linear-gradient(90deg, #991b1b, #b91c1c);
      color: #ffffff;
      padding: 10px 20px;
      font-family: var(--font-sans);
      font-size: 0.85rem;
      font-weight: 600;
      display: none;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 4px 12px rgba(0,0,0,0.5);
      border-bottom: 1px solid rgba(255,255,255,0.2);
    `,this.banner.innerHTML=`
      <div style="display: flex; align-items: center; gap: 10px;">
        <span style="font-size: 1.2rem;">⚠️</span>
        <div>
          <span>Hardware Acceleration is OFF in your browser. 3D simulation is running on slow CPU software emulation.</span>
          <div style="font-size: 0.75rem; font-weight: 400; opacity: 0.9; margin-top: 2px;">
            Fix: Open <code>brave://settings/system</code> or <code>chrome://settings/system</code>, toggle <strong>"Use graphics acceleration when available" ON</strong>, and relaunch.
          </div>
        </div>
      </div>
      <button id="btn-dismiss-hw-banner" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 4px 10px; border-radius: 4px; cursor: pointer; font-size: 0.75rem;">
        Dismiss
      </button>
    `,document.body.appendChild(this.banner);const e=this.banner.querySelector("#btn-dismiss-hw-banner");e&&e.addEventListener("click",()=>{this.banner.style.display="none"}),this.container=document.createElement("div"),this.container.id="dev-diagnostics-card",this.container.style.cssText=`
      position: fixed;
      top: 48px;
      right: 16px;
      z-index: 99998;
      width: 330px;
      background: rgba(10, 15, 25, 0.92);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(0, 229, 255, 0.3);
      border-radius: 8px;
      padding: 14px;
      font-family: var(--font-mono);
      font-size: 0.72rem;
      color: #e2e8f0;
      box-shadow: 0 8px 32px rgba(0,0,0,0.7);
      display: none;
      pointer-events: auto;
    `,document.body.appendChild(this.container),window.addEventListener("keydown",t=>{t.shiftKey&&(t.key==="D"||t.key==="d")&&this.toggle()}),this.checkHardwareAcceleration(),this.pollServerDiagnostics(),setInterval(()=>this.pollServerDiagnostics(),3e3)}static getInstance(){return xi.instance||(xi.instance=new xi),xi.instance}setRenderer(e){this.activeRenderer=e}setWsLatency(e){this.wsLatencyMs=e}toggle(){this.visible=!this.visible,this.container.style.display=this.visible?"block":"none",this.visible&&this.renderStats()}tick(){this.frameCount++;const e=performance.now(),t=e-this.lastTime;t>=500&&(this.fps=Math.round(this.frameCount*1e3/t),this.frameMs=Number((t/this.frameCount).toFixed(1)),this.frameCount=0,this.lastTime=e,this.visible&&this.renderStats())}checkHardwareAcceleration(){try{const e=document.createElement("canvas"),t=e.getContext("webgl")||e.getContext("experimental-webgl");if(!t){this.showSoftwareBanner("No WebGL Support Detected");return}const n=t.getExtension("WEBGL_debug_renderer_info"),i=n?t.getParameter(n.UNMASKED_RENDERER_WEBGL):t.getParameter(t.RENDERER),s=(i||"").toLowerCase();(s.includes("swiftshader")||s.includes("llvmpipe")||s.includes("basic render driver")||s.includes("software")||s.includes("microsoft basic"))&&this.showSoftwareBanner(i)}catch{}}showSoftwareBanner(e){this.banner.style.display="flex",console.warn(`[Diagnostics] Software WebGL detected: ${e}`)}async pollServerDiagnostics(){try{const e=await fetch("/api/diagnostics");e.ok&&(this.serverDiag=await e.json(),this.visible&&this.renderStats())}catch{this.serverDiag=null}}renderStats(){var d,u,f,m,_;let e=0,t=0,n=0,i=0;this.activeRenderer&&(e=this.activeRenderer.info.render.calls,t=this.activeRenderer.info.render.triangles,n=this.activeRenderer.info.memory.geometries,i=this.activeRenderer.info.memory.textures);const s=((d=this.serverDiag)==null?void 0:d.gpu_name)||"Querying...",o=((u=this.serverDiag)==null?void 0:u.vram_allocated_mb)??"-",a=((f=this.serverDiag)==null?void 0:f.vram_reserved_mb)??"-",c=(((m=this.serverDiag)==null?void 0:m.device)||"cpu").toUpperCase(),l=((_=this.serverDiag)==null?void 0:_.active_sessions)??"-",h=this.fps>=50?"#00ff9d":this.fps>=30?"#f59e0b":"#ef4444";this.container.innerHTML=`
      <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.15); padding-bottom: 6px; margin-bottom: 8px;">
        <span style="font-weight: 700; color: #00e5ff;">SYSTEM DIAGNOSTICS</span>
        <span style="color: #64748b; font-size: 0.65rem;">[Shift+D to hide]</span>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 10px;">
        <div>Client FPS: <span style="font-weight: 700; color: ${h};">${this.fps} FPS</span></div>
        <div>Frame Time: <span style="color: #38bdf8;">${this.frameMs} ms</span></div>
        <div>Draw Calls: <span style="color: #cbd5e1;">${e}</span></div>
        <div>Triangles: <span style="color: #cbd5e1;">${t.toLocaleString()}</span></div>
        <div>Geometries: <span style="color: #cbd5e1;">${n}</span></div>
        <div>Textures: <span style="color: #cbd5e1;">${i}</span></div>
        <div>DPR: <span style="color: #cbd5e1;">${window.devicePixelRatio.toFixed(1)}</span></div>
        <div>WS Latency: <span style="color: #cbd5e1;">${this.wsLatencyMs} ms</span></div>
      </div>

      <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 6px; margin-top: 4px;">
        <div style="font-weight: 600; color: #94a3b8; margin-bottom: 4px;">SERVER BACKEND:</div>
        <div>Device: <span style="color: #00ff9d; font-weight: 700;">${c}</span></div>
        <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${s}">
          GPU: <span style="color: #f1f5f9;">${s}</span>
        </div>
        <div>VRAM: <span style="color: #38bdf8;">${o} MB alloc / ${a} MB res</span></div>
        <div>Sessions: <span style="color: #f1f5f9;">${l} / 3 concurrent</span></div>
      </div>
    `}};U(xi,"instance",null);let wa=xi;class pn{static createFloorCanvasTexture(){const e=document.createElement("canvas");e.width=2048,e.height=2048;const t=e.getContext("2d");if(!t)return new _s(e);const n=t.createRadialGradient(1024,1024,150,1024,1024,1300);n.addColorStop(0,"#d1d5db"),n.addColorStop(.45,"#b5bfc9"),n.addColorStop(.85,"#9ca3af"),n.addColorStop(1,"#8993a4"),t.fillStyle=n,t.fillRect(0,0,2048,2048);const i=t.getImageData(0,0,2048,2048),s=i.data;for(let h=0;h<s.length;h+=4){const d=(Math.random()-.5)*18;s[h]=Math.min(255,Math.max(0,s[h]+d)),s[h+1]=Math.min(255,Math.max(0,s[h+1]+d)),s[h+2]=Math.min(255,Math.max(0,s[h+2]+d))}t.putImageData(i,0,0),t.strokeStyle="rgba(51, 65, 85, 0.50)",t.lineWidth=4;const o=2048/20;for(let h=0;h<=2048;h+=o)t.beginPath(),t.moveTo(h,0),t.lineTo(h,2048),t.stroke();const a=2048/13;for(let h=0;h<=2048;h+=a)t.beginPath(),t.moveTo(0,h),t.lineTo(2048,h),t.stroke();t.save(),t.strokeStyle="rgba(30, 41, 59, 0.14)",t.lineWidth=26,t.lineCap="round",t.beginPath(),t.arc(1200,1024,280,Math.PI*.8,Math.PI*1.4),t.stroke(),t.beginPath(),t.arc(840,960,200,Math.PI*.1,Math.PI*.7),t.stroke(),t.lineWidth=14,t.beginPath(),t.moveTo(1500,980),t.lineTo(1680,980),t.moveTo(1500,1040),t.lineTo(1680,1040),t.stroke(),t.restore();const c=64;t.save(),this.drawHazardStripes(t,0,0,2048,c),this.drawHazardStripes(t,0,2048-c,2048,c),this.drawHazardStripes(t,0,0,c,2048),this.drawHazardStripes(t,2048-c,0,c,2048),t.restore(),t.strokeStyle="#facc15",t.lineWidth=7,t.strokeRect(c+8,c+8,2048-(c+8)*2,2048-(c+8)*2),this.drawCornerBrackets(t,c+24),t.save(),t.strokeStyle="rgba(14, 165, 233, 0.85)",t.lineWidth=5,t.beginPath(),t.arc(1024,1024,180,0,Math.PI*2),t.stroke(),t.strokeStyle="rgba(14, 165, 233, 0.45)",t.lineWidth=3,t.beginPath(),t.arc(1024,1024,280,0,Math.PI*2),t.stroke(),t.beginPath(),t.moveTo(684,1024),t.lineTo(1364,1024),t.moveTo(1024,684),t.lineTo(1024,1364),t.stroke(),t.fillStyle="rgba(14, 165, 233, 0.90)",t.font="bold 26px monospace",t.textAlign="center",t.fillText("N [0°]",1024,729),t.fillText("S [180°]",1024,1344),t.fillText("W [-90°]",734,1032),t.fillText("E [+90°]",1314,1032),t.font="20px monospace",t.fillText("HUMANOID NAV DATUM (0.0, 0.0) • 255.2 M² ARENA",1024,1072),t.restore(),t.save(),t.strokeStyle="#eab308",t.lineWidth=6,t.setLineDash([24,14]),t.strokeRect(1480,680,480,680),t.setLineDash([]),this.drawFloorArrow(t,1560,1024,120,0),this.drawFloorArrow(t,1680,1024,120,0),t.fillStyle="#ca8a04",t.font="bold 28px monospace",t.textAlign="left",t.fillText("[ CHARGING BAY 01 ]",1510,740),t.font="22px monospace",t.fillText("AMR AUTO-COUPLING STATION",1510,780),t.fillText("48V WIRELESS INDUCTION DOCK",1510,815),t.fillText("KEEP CLEAR OF VEHICLE DOCK",1510,1320),t.restore(),t.save(),t.fillStyle="rgba(51, 65, 85, 0.85)",t.font="bold 34px sans-serif",t.textAlign="left",t.fillText("GIGAFACTORY TESTBED CELL 01 • AUTONOMOUS OMNIDIRECTIONAL ROBOTICS",110,140),t.font="22px monospace",t.fillText("FACILITY: GIGA-ROBOTICS-HQ | TOTAL ARENA: 255.2 M² | SPEED LIMIT: 1.5 M/S | 48V AMR",110,180),t.fillText("SAFETY INTERLOCK ACTIVE • EMERGENCY STOP MONITORED • OVERHEAD CRANE ZONE",110,1960),t.restore(),this.drawFloorArrow(t,550,1024,130,0),this.drawFloorArrow(t,1024,550,130,-Math.PI/2);const l=new _s(e);return l.wrapS=ln,l.wrapT=ln,l.colorSpace=Bt,l}static createFloorRoughnessTexture(){const e=document.createElement("canvas");e.width=1024,e.height=1024;const t=e.getContext("2d");if(!t)return new _s(e);t.fillStyle="#484848",t.fillRect(0,0,1024,1024),t.fillStyle="#adadad";const n=32;return t.fillRect(0,0,1024,n),t.fillRect(0,1024-n,1024,n),t.fillRect(0,0,n,1024),t.fillRect(1024-n,0,n,1024),t.strokeStyle="#999999",t.lineWidth=8,t.strokeRect(740,340,240,340),new _s(e)}static drawHazardStripes(e,t,n,i,s){e.save(),e.beginPath(),e.rect(t,n,i,s),e.clip(),e.fillStyle="#eab308",e.fillRect(t,n,i,s),e.fillStyle="#1e293b";const o=52;for(let a=-2048;a<4096;a+=o*2)e.beginPath(),e.moveTo(a,n),e.lineTo(a+o,n),e.lineTo(a+o+s,n+s),e.lineTo(a+s,n+s),e.closePath(),e.fill();e.restore()}static drawCornerBrackets(e,t){e.fillStyle="#facc15",e.fillRect(t,t,64,8),e.fillRect(t,t,8,64),e.fillRect(2048-t-64,t,64,8),e.fillRect(2048-t-8,t,8,64),e.fillRect(t,2048-t-8,64,8),e.fillRect(t,2048-t-64,8,64),e.fillRect(2048-t-64,2048-t-8,64,8),e.fillRect(2048-t-8,2048-t-64,8,64)}static drawFloorArrow(e,t,n,i,s){e.save(),e.translate(t,n),e.rotate(s),e.fillStyle="rgba(14, 165, 233, 0.45)",e.beginPath(),e.moveTo(0,-16),e.lineTo(i-40,-16),e.lineTo(i-40,-36),e.lineTo(i,0),e.lineTo(i-40,36),e.lineTo(i-40,16),e.lineTo(0,16),e.closePath(),e.fill(),e.restore()}static buildWarehouseArchitecture(e){const t=[],n=new te({color:1120295,roughness:.88,metalness:.15}),i=new te({color:1976635,roughness:.75,metalness:.2}),s=new te({color:3359061,roughness:.65,metalness:.3}),o=new te({color:988970,roughness:.35,metalness:.85}),a=new te({color:16436245,roughness:.35,metalness:.25}),c=new te({color:15357964,roughness:.45,metalness:.4}),l=new te({color:1920728,roughness:.4,metalness:.5}),h=6.8,d=new jn(48,36),u=new N(d,n);u.rotation.x=-Math.PI/2,u.position.set(0,-.005,0),u.receiveShadow=!0,e.add(u);const f=[[-9.9,-6.6],[9.9,-6.6],[-9.9,6.6],[9.9,6.6]];for(const[b,L]of f)this.createSafetyBollard(e,b,L,a,o);const m=new N(new ie(24,1.4,.22),i);m.position.set(0,.7,-7.3),m.receiveShadow=!0,e.add(m);const _=new N(new ie(24,h-1.4,.22),s);_.position.set(0,1.4+(h-1.4)/2,-7.3),_.receiveShadow=!0,e.add(_);const g=new te({color:9741240,roughness:.25,metalness:.9}),p=new N(new Ee(.025,.025,23.6,12),g);p.rotation.z=Math.PI/2,p.position.set(0,1.6,-7.18),e.add(p);const x=new N(new Ee(.02,.02,23.6,12),g);x.rotation.z=Math.PI/2,x.position.set(0,3.4,-7.18),e.add(x);const S=new N(new ie(.22,1.4,16),i);S.position.set(-10.8,.7,0),S.receiveShadow=!0,e.add(S);const M=new N(new ie(.22,h-1.4,16),s);M.position.set(-10.8,1.4+(h-1.4)/2,0),M.receiveShadow=!0,e.add(M);const T=new N(new ie(.22,1.4,16),i);T.position.set(10.8,.7,0),T.receiveShadow=!0,e.add(T);const E=new N(new ie(.22,h-1.4,16),s);E.position.set(10.8,1.4+(h-1.4)/2,0),E.receiveShadow=!0,e.add(E);const R=new N(new ie(24,.24,.16),i);R.position.set(0,.12,7.1),e.add(R);const D=[[-10.7,-7.2],[-5.3,-7.2],[0,-7.2],[5.3,-7.2],[10.7,-7.2],[-10.7,0],[10.7,0],[-10.7,7],[10.7,7]];for(const[b,L]of D){const k=new N(new ie(.28,h,.28),o);k.position.set(b,h/2,L),k.castShadow=!0,k.receiveShadow=!0,e.add(k);const z=new N(new Ee(.22,.25,.95,16),a);z.position.set(b,.475,L),z.castShadow=!0,e.add(z)}this.createOverheadCraneSystem(e),this.createMezzanineCatwalkAndControlRoom(e),this.createRoboticArmCell(e,-8.6,-4.8),this.createRollerConveyorLine(e,-6,6,-6.1,.7),this.createElectricalSubstation(e,-8.8,1.8);const y=[[-7,-4.2],[-2.3,-4.2],[2.3,-4.2],[7,-4.2],[-7,2],[-2.3,2],[2.3,2],[7,2]];for(const[b,L]of y){const k=new N(new Ee(.015,.015,.65,8),o);k.position.set(b,h-.32,L),e.add(k);const z=new N(new Ee(.16,.44,.28,18,1,!0),o);z.position.set(b,h-.62,L),e.add(z);const j=new N(new Rr(.42,18),new gt({color:16775917,side:At}));j.rotation.x=Math.PI/2,j.position.set(b,h-.76,L),e.add(j)}for(const b of[-6.2,-2.1,2.1,6.2])this.buildPalletRack(e,b,-6.95,c,l);return this.createBiophilicPlanters(e),this.createWallSafetySign(e,-4.2,2.8,-7.18,"caution"),this.createWallSafetySign(e,4.2,2.8,-7.18,"notice"),this.createEmergencyStopStation(e,0,1.8,-7.18),{lights:t}}static createOverheadCraneSystem(e){const t=new Ce,n=new te({color:1976635,roughness:.35,metalness:.85}),i=new te({color:16436245,roughness:.3,metalness:.4}),s=new te({color:9741240,roughness:.2,metalness:.95});for(const u of[-6.8,-4.8]){const f=new N(new ie(23.6,.24,.24),n);f.position.set(0,6.5,u),t.add(f);for(let m=-10;m<=10;m+=2.5){const _=new N(new Ee(.025,.025,.45,8),n);_.position.set(m,6.62,u),t.add(_)}}for(const u of[-10.6,10.6]){const f=new N(new ie(.18,.28,15.6),n);f.position.set(u,6,0),t.add(f);for(const m of[-7.6,7.6]){const _=new N(new ie(.3,.35,.35),i);_.position.set(u,6,m),t.add(_)}}const o=-5.8;for(const u of[-.35,.35]){const f=new N(new ie(21.2,.42,.16),i);f.position.set(0,6.18,o+u),f.castShadow=!0,t.add(f)}for(const u of[-10.5,10.5]){const f=new N(new ie(.35,.22,1.2),n);f.position.set(u,6.18,o),t.add(f)}const a=1.4,c=new N(new ie(1.2,.32,1.1),n);c.position.set(a,6.42,o),c.castShadow=!0,t.add(c);const l=new N(new Ee(.16,.16,.75,16),s);l.rotation.z=Math.PI/2,l.position.set(a,6.62,o),t.add(l);for(const u of[-.2,.2]){const f=new N(new Ee(.008,.008,2.3,8),s);f.position.set(a+u,5.25,o),t.add(f)}const h=new N(new ie(.48,.32,.28),i);h.position.set(a,4,o),h.castShadow=!0,t.add(h);const d=new N(new Cr(.16,.045,12,24,Math.PI*1.3),n);d.rotation.z=Math.PI*.85,d.position.set(a,3.75,o),d.castShadow=!0,t.add(d);for(const u of[-10,10]){const f=new N(new Ee(.06,.06,.12,12),new gt({color:16096779}));f.position.set(u,6.45,o),t.add(f)}e.add(t)}static createMezzanineCatwalkAndControlRoom(e){const t=new Ce,n=new te({color:1976635,roughness:.4,metalness:.8}),i=new te({color:3359061,roughness:.6,metalness:.7}),s=new te({color:16436245,roughness:.35,metalness:.3}),o=new te({color:3718648,roughness:.1,metalness:.9,transparent:!0,opacity:.45}),a=10,c=2.8,l=new N(new ie(1.4,.08,12),i);l.position.set(a,c,0),l.receiveShadow=!0,t.add(l);for(const y of[-5.5,-2.5,.5,3.5,5.5]){const b=new N(new ie(.16,c,.16),n);b.position.set(a-.65,c/2,y),b.castShadow=!0,t.add(b)}const h=a-.7,d=new N(new Ee(.02,.02,12,10),s);d.rotation.x=Math.PI/2,d.position.set(h,c+1.05,0),t.add(d);const u=new N(new Ee(.016,.016,12,10),s);u.rotation.x=Math.PI/2,u.position.set(h,c+.55,0),t.add(u);const f=new N(new ie(.02,.15,12),s);f.position.set(h,c+.08,0),t.add(f);for(let y=-5.8;y<=5.8;y+=1.45){const b=new N(new Ee(.022,.022,1.05,10),s);b.position.set(h,c+.525,y),t.add(b)}const m=10,_=c/m,g=2/m;for(let y=0;y<m;y++){const b=new N(new ie(1,.04,g),n);b.position.set(a,_*(y+.5),6.2-g*y),t.add(b)}const p=new Ce;p.position.set(a,c+.04,0);const x=new te({color:988970,roughness:.3,metalness:.9}),S=new N(new ie(1.35,.08,4.4),x);S.position.set(0,2.4,0),p.add(S);const M=new N(new ie(.04,2,4.2),o);M.position.set(-.65,1.2,0),p.add(M);for(const y of[-1.4,0,1.4]){const b=new N(new ie(.06,2,.05),x);b.position.set(-.65,1.2,y),p.add(b)}const T=new gt({color:61695}),E=new gt({color:16096779}),R=new gt({color:1096065});for(let y=0;y<4;y++){const b=y%3===0?T:y%3===1?R:E,L=new N(new ie(.02,.45,.8),b);L.position.set(.4,1.35,-1.5+y*1),L.rotation.y=-.15,p.add(L)}const D=new Yi(61695,1.5,6,1.5);D.position.set(-.1,1.8,0),p.add(D),t.add(p),e.add(t)}static createRoboticArmCell(e,t,n){const i=new Ce;i.position.set(t,0,n);const s=new te({color:6583435,roughness:.9,metalness:.1}),o=new te({color:15357964,roughness:.35,metalness:.5}),a=new te({color:988970,roughness:.3,metalness:.9}),c=new te({color:16436245,roughness:.4,metalness:.3}),l=new N(new ie(1.8,.3,1.8),s);l.position.y=.15,l.receiveShadow=!0,i.add(l);const h=new N(new ie(.85,.05,.85),c);h.position.y=.325,i.add(h);const d=new N(new Ee(.32,.36,.4,20),a);d.position.y=.525,d.castShadow=!0,i.add(d);const u=new N(new Zt(.24,16,16),a);u.position.y=.82,u.castShadow=!0,i.add(u);const f=new N(new ie(.22,.95,.22),o);f.position.set(.18,1.25,-.15),f.rotation.x=-.35,f.rotation.z=.25,f.castShadow=!0,i.add(f);const m=new N(new Zt(.18,16,16),a);m.position.set(.32,1.68,-.32),m.castShadow=!0,i.add(m);const _=new N(new Ee(.11,.14,.85,16),o);_.rotation.z=Math.PI/3,_.rotation.y=.4,_.position.set(.68,1.55,-.22),_.castShadow=!0,i.add(_);const g=new N(new Zt(.1,14,14),a);g.position.set(1.08,1.35,-.12),i.add(g);for(const E of[-.08,.08]){const R=new N(new ie(.18,.04,.04),a);R.position.set(1.22,1.35+E,-.12),i.add(R)}const p=new N(new Ee(.06,.06,.14,16),new te({color:3718648,roughness:.2,metalness:.9}));p.position.set(1.25,1.35,-.12),i.add(p);const x=2.6,S=1.6;for(const[E,R]of[[-x/2,-x/2],[x/2,-x/2],[-x/2,x/2],[x/2,x/2]]){const D=new N(new Ee(.04,.04,S,12),c);D.position.set(E,S/2,R),i.add(D)}for(const E of[.15,S*.5,S]){const R=new N(new ie(x,.03,.03),c);R.position.set(0,E,-x/2),i.add(R);const D=new N(new ie(x,.03,.03),c);D.position.set(0,E,x/2),i.add(D);const y=new N(new ie(.03,.03,x),c);y.position.set(-x/2,E,0),i.add(y)}const M=new N(new Ee(.02,.02,.5,8),a);M.position.set(x/2,S+.25,x/2),i.add(M);const T=new N(new Ee(.05,.05,.12,12),new gt({color:16096779}));T.position.set(x/2,S+.56,x/2),i.add(T),e.add(i)}static createRollerConveyorLine(e,t,n,i,s){const o=new Ce,a=new te({color:1976635,roughness:.4,metalness:.8}),c=new te({color:9741240,roughness:.25,metalness:.95}),l=new te({color:11817737,roughness:.85,metalness:.05}),h=new te({color:165063,roughness:.35,metalness:.2}),d=Math.abs(n-t),u=(t+n)/2,f=.85;for(const p of[-f/2,f/2]){const x=new N(new ie(d,.12,.05),a);x.position.set(u,s,i+p),o.add(x)}for(let p=t+.4;p<=n-.4;p+=2.4){for(const S of[-f/2,f/2]){const M=new N(new ie(.06,s,.06),a);M.position.set(p,s/2,i+S),o.add(M)}const x=new N(new ie(.04,.04,f),a);x.position.set(p,s*.35,i),o.add(x)}const m=.038;for(let p=t+.15;p<=n-.15;p+=.28){const x=new N(new Ee(m,m,f-.06,12),c);x.rotation.x=Math.PI/2,x.position.set(p,s+.02,i),o.add(x)}const _=[{x:t+1.2,isTote:!1},{x:t+3.4,isTote:!0},{x:t+5.8,isTote:!1},{x:t+8.2,isTote:!0},{x:t+10.5,isTote:!1}];for(const p of _)if(p.x<n)if(p.isTote){const x=new N(new ie(.48,.28,.55),h);x.position.set(p.x,s+.04+.14,i),x.castShadow=!0,o.add(x)}else{const x=new N(new ie(.55,.45,.55),l);x.position.set(p.x,s+.04+.225,i),x.castShadow=!0,o.add(x)}const g=new N(new ie(.35,.35,.35),a);g.position.set(t-.2,s-.1,i),o.add(g),e.add(o)}static createElectricalSubstation(e,t,n){const i=new Ce;i.position.set(t,0,n);const s=new te({color:3359061,roughness:.4,metalness:.7}),o=new te({color:1976635,roughness:.3,metalness:.85}),a=new te({color:10033947,roughness:.2,metalness:.3}),c=new te({color:16436245,roughness:.35}),l=new N(new ie(1.4,1.8,1.1),s);l.position.y=.9,l.castShadow=!0,l.receiveShadow=!0,i.add(l);for(const f of[-.58,.58])for(let m=-.55;m<=.55;m+=.12){const _=new N(new ie(.02,1.5,.18),o);_.position.set(m,.9,f),i.add(_)}for(const f of[-.35,0,.35]){const m=new N(new Ee(.045,.065,.38,14),a);m.position.set(f,1.99,0),i.add(m);const _=new N(new Zt(.05,12,12),new te({color:14870768,roughness:.2,metalness:.9}));_.position.set(f,2.2,0),i.add(_)}const h=new N(new ie(.42,.28,.02),c);h.position.set(0,1.25,.56),i.add(h);const d=new N(new Zt(.025,12,12),new gt({color:1096065}));d.position.set(-.25,1.6,.56),i.add(d);const u=new N(new Zt(.025,12,12),new gt({color:15680580}));u.position.set(-.15,1.6,.56),i.add(u),e.add(i)}static createBarrelCluster(e=.85,t=.95,n=.85){const i=new Ce,s=new te({color:16436245,roughness:.45,metalness:.1}),o=new te({color:1976635,roughness:.6,metalness:.7}),a=new te({color:15381256,roughness:.35,metalness:.4}),c=new te({color:165063,roughness:.35,metalness:.5}),l=new te({color:988970,roughness:.4,metalness:.7}),h=new N(new ie(e,.12,n),s);h.position.y=.06,h.castShadow=!0,h.receiveShadow=!0,i.add(h);const d=new N(new ie(e-.06,.02,n-.06),o);d.position.y=.13,i.add(d);const u=.18,f=.82,m=[{x:-.16,z:-.16,mat:a},{x:.18,z:-.12,mat:c},{x:0,z:.18,mat:l}];for(const _ of m){const g=new Ce;g.position.set(_.x,.14,_.z);const p=new N(new Ee(u,u,f,20),_.mat);p.position.y=f/2,p.castShadow=!0,p.receiveShadow=!0,g.add(p);const x=new te({color:1976635,roughness:.35,metalness:.8});for(const M of[f*.35,f*.68]){const T=new N(new Cr(u+.008,.012,8,20),x);T.rotation.x=Math.PI/2,T.position.y=M,g.add(T)}const S=new N(new Ee(.025,.025,.02,10),x);S.position.set(.08,f+.01,0),g.add(S),i.add(g)}return i}static createSafetyBarrier(e=1.1,t=.85,n=.45){const i=new Ce,s=new te({color:16436245,roughness:.35,metalness:.3}),o=new te({color:988970,roughness:.4,metalness:.85}),a=.045,c=t;for(const l of[-e/2+.1,e/2-.1]){const h=new N(new Ee(a,a,c,16),s);h.position.set(l,c/2,0),h.castShadow=!0,i.add(h);const d=new N(new ie(.24,.025,.24),o);d.position.set(l,.0125,0),d.receiveShadow=!0,i.add(d)}for(const l of[t-.08,t*.45]){const h=new N(new Ee(a*.9,a*.9,e,16),s);h.rotation.z=Math.PI/2,h.position.set(0,l,0),h.castShadow=!0,i.add(h);const d=new N(new Ee(a*.92,a*.92,e*.25,16),o);d.rotation.z=Math.PI/2,d.position.set(0,l,0),i.add(d)}return i}static createBiophilicPlanters(e){const t=new te({color:9741240,roughness:.2,metalness:.9}),n=new te({color:2563606,roughness:.9}),i=new te({color:1409085,roughness:.5,metalness:.1}),s=[[-9.8,6.2],[9.8,6.2]];for(const[o,a]of s){const c=new Ce;c.position.set(o,0,a);const l=new N(new Ee(.42,.35,.85,20),t);l.position.y=.425,l.castShadow=!0,l.receiveShadow=!0,c.add(l);const h=new N(new Rr(.4,18),n);h.rotation.x=-Math.PI/2,h.position.y=.84,c.add(h);for(let d=0;d<9;d++){const u=new N(new Zt(.32,10,8),i),f=d/9*Math.PI*2;u.scale.set(.65,1.6,.22),u.rotation.set(.45*Math.cos(f),f,.45*Math.sin(f)),u.position.set(.18*Math.cos(f),1.05+Math.sin(d)*.12,.18*Math.sin(f)),u.castShadow=!0,c.add(u)}e.add(c)}}static createSafetyBollard(e,t,n,i,s){const o=new Ce;o.position.set(t,0,n);const a=new Ee(.11,.11,.95,16),c=new N(a,i);c.position.y=.95/2,c.castShadow=!0,o.add(c);const l=new Zt(.11,16,8,0,Math.PI*2,0,Math.PI/2),h=new N(l,i);h.position.y=.95,o.add(h);const d=new te({color:988970,roughness:.3}),u=new N(new Ee(.112,.112,.08,16),d);u.position.y=.72,o.add(u);const f=new N(new Ee(.112,.112,.08,16),d);f.position.y=.52,o.add(f),e.add(o)}static createEmergencyStopStation(e,t,n,i){const s=new Ce;s.position.set(t,n,i);const o=new te({color:16436245,roughness:.35}),a=new N(new ie(.32,.42,.12),o);s.add(a);const c=new te({color:15680580,roughness:.2,emissive:15680580,emissiveIntensity:.3}),l=new N(new Ee(.065,.045,.06,16),c);l.rotation.x=Math.PI/2,l.position.set(0,0,.07),s.add(l),e.add(s)}static buildPalletRack(e,t,n,i,s){const o=new Ce;o.position.set(t,0,n);const a=3.2,c=.75,l=3.6;for(const[h,d]of[[-a/2,-c/2],[a/2,-c/2],[-a/2,c/2],[a/2,c/2]]){const u=new N(new ie(.09,l,.09),s);u.position.set(h,l/2,d),u.castShadow=!0,o.add(u)}for(const h of[1.1,2.2,3.3]){const d=new N(new ie(a,.11,.05),i);d.position.set(0,h,c/2),o.add(d);const u=new N(new ie(a,.11,.05),i);u.position.set(0,h,-c/2),o.add(u);const f=this.createWoodenPallet(1.1,.14,.65);f.position.set(0,h+.07,0),o.add(f);const m=new te({color:14251782,roughness:.8}),_=new N(new ie(.55,.5,.55),m);_.position.set(-.35,h+.38,0),_.castShadow=!0,o.add(_);const g=new te({color:165063,roughness:.4,metalness:.2}),p=new N(new ie(.48,.4,.55),g);p.position.set(.35,h+.33,0),p.castShadow=!0,o.add(p)}e.add(o)}static createWoodenPallet(e,t,n){const i=new Ce,s=new te({color:12887170,roughness:.85});for(let o=-e/2+.08;o<=e/2-.08;o+=.18){const a=new N(new ie(.12,.025,n),s);a.position.set(o,t-.0125,0),i.add(a)}for(const o of[-e/2+.06,0,e/2-.06]){const a=new N(new ie(.09,t-.04,n),s);a.position.set(o,(t-.04)/2+.02,0),i.add(a)}return i}static createWallSafetySign(e,t,n,i,s){const o=document.createElement("canvas");o.width=512,o.height=256;const a=o.getContext("2d");if(!a)return;a.fillStyle="#ffffff",a.fillRect(0,0,512,256),a.lineWidth=14,a.strokeStyle=s==="caution"?"#eab308":"#2563eb",a.strokeRect(7,7,498,242),a.fillStyle=s==="caution"?"#eab308":"#2563eb",a.fillRect(14,14,484,68),a.fillStyle=s==="caution"?"#000000":"#ffffff",a.font="bold 38px sans-serif",a.textAlign="center",a.fillText(s==="caution"?"⚠ CAUTION":"NOTICE",256,62),a.fillStyle="#1e293b",a.font="bold 26px sans-serif",s==="caution"?(a.fillText("AUTONOMOUS MOBILE ROBOT",256,130),a.fillText("TESTING IN PROGRESS",256,168),a.font="20px monospace",a.fillText("STAY CLEAR OF VEHICLE PATHWAY",256,212)):(a.fillText("EYE PROTECTION REQUIRED",256,130),a.fillText("IN THIS TESTING AREA",256,168),a.font="20px monospace",a.fillText("RESTRICTED ACCESS ONLY",256,212));const c=new _s(o),l=new jn(1.6,.8),h=new gt({map:c,side:At}),d=new N(l,h);d.position.set(t,n,i),e.add(d)}static createWorkstationObstacle(e,t,n){const i=new Ce,s=new te({color:1976635,roughness:.45,metalness:.75}),o=new te({color:11817737,roughness:.55,metalness:.05}),a=new te({color:16436245,roughness:.35}),c=new te({color:988970,roughness:.85}),l=.06,h=new N(new ie(e,l,n),o);h.position.y=t-l/2,h.castShadow=!0,h.receiveShadow=!0,i.add(h);const d=new N(new ie(e,.025,.015),a);d.position.set(0,t-l/2,n/2+.008),i.add(d);const u=.05,f=t-l,m=.02;for(const S of[-1,1])for(const M of[-1,1]){const T=S*(e/2-u/2),E=M*(n/2-u/2),R=new N(new ie(u,f,u),s);R.position.set(T,f/2,E),R.castShadow=!0,i.add(R);const D=new N(new Ee(.038,.045,m,12),c);D.position.set(T,m/2,E),i.add(D)}const _=t*.32,g=new N(new ie(e-u*1.5,.03,n-u*1.5),s);g.position.y=_,g.castShadow=!0,i.add(g);const p=new te({color:165063,roughness:.4,metalness:.3}),x=new N(new ie(e*.5,.14,n*.6),p);return x.position.set(0,_+.085,0),x.castShadow=!0,i.add(x),i}static createRealisticCrate(e,t,n){const i=new Ce,s=new te({color:10124118,roughness:.78,metalness:.05}),o=new te({color:3359061,roughness:.4,metalness:.8}),a=new N(new ie(e,t,n),s);a.position.y=t/2,a.castShadow=!0,a.receiveShadow=!0,i.add(a);const c=Math.min(e,t,n)*.18;for(const h of[-1,1])for(const d of[0,1])for(const u of[-1,1]){const f=new N(new ie(c,c*.8,c),o);f.position.set(h*(e/2-c/2),d*(t-c*.8/2)+(1-d)*(c*.8/2),u*(n/2-c/2)),i.add(f)}const l=new te({color:988970,roughness:.3,metalness:.9});for(const h of[t*.3,t*.7]){const d=new N(new ie(e+.01,.03,n+.01),l);d.position.y=h,i.add(d)}return i}static createToolCabinet(e,t,n){const i=new Ce,s=new te({color:12131356,roughness:.35,metalness:.6}),o=new te({color:14870768,roughness:.2,metalness:.95}),a=new te({color:988970,roughness:.9}),c=new N(new ie(e,t-.06,n),s);c.position.y=(t-.06)/2+.06,c.castShadow=!0,c.receiveShadow=!0,i.add(c);const l=new N(new ie(e+.02,.03,n+.02),a);l.position.y=t,i.add(l);const h=4,d=(t-.15)/h;for(let f=0;f<h;f++){const m=new N(new Ee(.012,.012,e*.65,8),o);m.rotation.z=Math.PI/2,m.position.set(0,.14+f*d,n/2+.02),i.add(m)}const u=new te({color:1976635,roughness:.5,metalness:.5});for(const f of[-1,1])for(const m of[-1,1]){const _=new N(new Ee(.04,.04,.03,12),u);_.rotation.z=Math.PI/2,_.position.set(f*(e/2-.06),.04,m*(n/2-.06)),i.add(_)}return i}static createRealisticTechnician(){const e=new Ce,t=new te({color:16173216,roughness:.65}),n=new te({color:16436245,roughness:.3,metalness:.3}),i=new te({color:16347926,roughness:.6}),s=new te({color:14870768,roughness:.2,metalness:.9}),o=new te({color:1976635,roughness:.8}),a=new te({color:4140317,roughness:.7});for(const g of[-.1,.1]){const p=new N(new ie(.12,.14,.24),a);p.position.set(g,.07,.02),p.castShadow=!0,e.add(p)}for(const g of[-.1,.1]){const p=new N(new Ee(.08,.07,.74,12),o);p.position.set(g,.51,0),p.castShadow=!0,e.add(p)}const c=new N(new ie(.36,.56,.22),i);c.position.set(0,1.16,0),c.castShadow=!0,e.add(c);const l=new N(new ie(.364,.04,.224),s);l.position.set(0,1.25,0),e.add(l);const h=new N(new ie(.364,.04,.224),s);h.position.set(0,1.05,0),e.add(h);for(const g of[-.23,.23]){const p=new N(new Ee(.06,.05,.52,10),i);p.position.set(g,1.15,0),p.castShadow=!0,e.add(p)}const d=new Ce;d.position.set(0,1.54,0);const u=new N(new Zt(.11,16,16),t);u.position.y=0,u.castShadow=!0,d.add(u);const f=new N(new Zt(.125,16,12,0,Math.PI*2,0,Math.PI*.55),n);f.position.y=.05,d.add(f);const m=new N(new kn(.11,.16,16),n);m.rotation.x=-Math.PI/2,m.position.y=.05,d.add(m);const _=new N(new ie(.16,.035,.04),new te({color:3718648,roughness:.1,metalness:.8,transparent:!0,opacity:.8}));return _.position.set(0,.01,.1),d.add(_),e.add(d),{root:e,head:d}}}class N_{constructor(){U(this,"root");U(this,"head");U(this,"chestCore");U(this,"povAnchor");U(this,"pelvisGroup");U(this,"torsoGroup");U(this,"leftArmGroup");U(this,"rightArmGroup");U(this,"leftElbowGroup");U(this,"rightElbowGroup");U(this,"leftLegGroup");U(this,"rightLegGroup");U(this,"leftKneeGroup");U(this,"rightKneeGroup");U(this,"walkPhase",0);U(this,"basePelvisY",.88);U(this,"lastPos",new I);U(this,"smoothedSpeed",0);U(this,"walkTimer",0);this.root=new Ce;const e=new te({color:15857145,roughness:.32,metalness:.2}),t=new te({color:988970,roughness:.4,metalness:.88}),n=new te({color:3359061,roughness:.45,metalness:.65}),i=new te({color:58879,emissive:58879,emissiveIntensity:1.4,roughness:.1,metalness:.9}),s=new te({color:65437,emissive:65437,emissiveIntensity:1.6,roughness:.2,metalness:.8}),o=new te({color:1976635,roughness:.92,metalness:.05});this.pelvisGroup=new Ce,this.pelvisGroup.position.y=this.basePelvisY,this.root.add(this.pelvisGroup);const a=new ie(.24,.12,.16),c=new N(a,t);c.castShadow=!0,this.pelvisGroup.add(c);const l=new N(new Ee(.045,.045,.26,16),t);l.rotation.z=Math.PI/2,this.pelvisGroup.add(l),this.torsoGroup=new Ce,this.torsoGroup.position.set(0,.06,0),this.pelvisGroup.add(this.torsoGroup);const h=new N(new Ee(.06,.07,.1,16),t);h.position.set(0,.05,0),this.torsoGroup.add(h);const d=new ie(.32,.34,.2),u=new N(d,e);u.position.set(0,.26,0),u.castShadow=!0,this.torsoGroup.add(u);const f=new N(new ie(.28,.26,.04),n);f.position.set(0,.28,.1),this.torsoGroup.add(f);const m=new N(new ie(.24,.3,.08),t);m.position.set(0,.26,-.12),m.castShadow=!0,this.torsoGroup.add(m);const _=new Ee(.045,.045,.02,24);this.chestCore=new N(_,s),this.chestCore.rotation.x=Math.PI/2,this.chestCore.position.set(0,.3,.125),this.torsoGroup.add(this.chestCore);const g=new Yi(65437,.8,1.5,1.5);g.position.set(0,.3,.16),this.torsoGroup.add(g),this.head=new Ce,this.head.position.set(0,.48,0),this.torsoGroup.add(this.head);const p=new N(new Ee(.04,.045,.08,16),t);p.position.set(0,.03,0),this.head.add(p);const x=new ie(.18,.2,.19),S=new N(x,e);S.position.set(0,.14,0),S.castShadow=!0,this.head.add(S);const M=new ie(.16,.065,.04),T=new N(M,i);T.position.set(0,.15,.095),this.head.add(T);const E=new bi(16775917,1.8,8,Math.PI/5,.3,1.2);E.position.set(0,.15,.1),E.target.position.set(0,.15,3),this.head.add(E),this.head.add(E.target),this.povAnchor=new Mt,this.povAnchor.position.set(0,.15,.12),this.head.add(this.povAnchor),this.leftArmGroup=new Ce,this.leftArmGroup.position.set(-.21,.38,0),this.torsoGroup.add(this.leftArmGroup),this.buildArm(this.leftArmGroup,"left",e,t),this.rightArmGroup=new Ce,this.rightArmGroup.position.set(.21,.38,0),this.torsoGroup.add(this.rightArmGroup),this.buildArm(this.rightArmGroup,"right",e,t),this.leftLegGroup=new Ce,this.leftLegGroup.position.set(-.11,-.06,0),this.pelvisGroup.add(this.leftLegGroup),this.leftKneeGroup=this.buildLeg(this.leftLegGroup,e,t,o),this.rightLegGroup=new Ce,this.rightLegGroup.position.set(.11,-.06,0),this.pelvisGroup.add(this.rightLegGroup),this.rightKneeGroup=this.buildLeg(this.rightLegGroup,e,t,o),this.root.traverse(R=>R.layers.set(1))}buildArm(e,t,n,i){const s=new N(new Zt(.045,16,16),i);e.add(s);const o=new Ce;e.add(o);const a=new N(new Ee(.038,.034,.2,16),n);a.position.set(0,-.11,0),a.castShadow=!0,o.add(a);const c=new Ce;c.position.set(0,-.22,0),o.add(c),t==="left"?this.leftElbowGroup=c:this.rightElbowGroup=c;const l=new N(new Ee(.032,.032,.06,12),i);l.rotation.z=Math.PI/2,c.add(l);const h=new N(new ie(.06,.18,.06),n);h.position.set(0,-.1,0),h.castShadow=!0,c.add(h);const d=new Ce;d.position.set(0,-.2,0),c.add(d);const u=new N(new ie(.05,.06,.03),i);u.position.set(0,-.03,0),d.add(u);for(let f=-.018;f<=.018;f+=.018){const m=new N(new ie(.012,.04,.015),n);m.position.set(f,-.075,.005),d.add(m)}}buildLeg(e,t,n,i){const s=new Ce;e.add(s);const o=new N(new ie(.1,.34,.11),t);o.position.set(0,-.18,0),o.castShadow=!0,s.add(o);const a=new Ce;a.position.set(0,-.36,0),s.add(a);const c=new N(new Ee(.042,.042,.1,16),n);c.rotation.z=Math.PI/2,a.add(c);const l=new N(new ie(.09,.34,.09),t);l.position.set(0,-.18,0),l.castShadow=!0,a.add(l);const h=new Ce;h.position.set(0,-.36,0),a.add(h);const d=new N(new ie(.1,.05,.2),t);d.position.set(0,-.025,.04),d.castShadow=!0,h.add(d);const u=new N(new ie(.105,.015,.205),i);return u.position.set(0,-.055,.04),h.add(u),a}update(e,t,n,i,s,o=!1){const a=performance.now(),c=t.x-this.lastPos.x,l=t.z-this.lastPos.z,h=Math.hypot(c,l);this.lastPos.copy(t);const d=e>0?h/e:0;this.smoothedSpeed=Et.lerp(this.smoothedSpeed,d,.25),!o&&this.smoothedSpeed>.06?this.walkTimer=.18:this.walkTimer>0&&(this.walkTimer-=e);const u=this.walkTimer>0;if(this.root.position.copy(t),this.root.rotation.y=n,u){const m=Math.min(7.5,Math.max(4,this.smoothedSpeed*4.5));this.walkPhase+=e*m;const _=Math.sin(this.walkPhase),g=Math.cos(this.walkPhase);this.leftLegGroup.rotation.x=_*.48,this.rightLegGroup.rotation.x=-_*.48,this.leftKneeGroup.rotation.x=Math.max(0,-_)*.65,this.rightKneeGroup.rotation.x=Math.max(0,_)*.65,this.leftArmGroup.rotation.x=-_*.42,this.rightArmGroup.rotation.x=_*.42,this.leftElbowGroup.rotation.x=.2+Math.max(0,-_)*.25,this.rightElbowGroup.rotation.x=.2+Math.max(0,_)*.25;const p=Math.abs(g)*.025;this.pelvisGroup.position.y=this.basePelvisY+p,this.torsoGroup.rotation.y=_*.06,this.torsoGroup.rotation.z=-_*.02}else{this.leftLegGroup.rotation.x=Et.lerp(this.leftLegGroup.rotation.x,0,.12),this.rightLegGroup.rotation.x=Et.lerp(this.rightLegGroup.rotation.x,0,.12),this.leftKneeGroup.rotation.x=Et.lerp(this.leftKneeGroup.rotation.x,0,.12),this.rightKneeGroup.rotation.x=Et.lerp(this.rightKneeGroup.rotation.x,0,.12),this.leftArmGroup.rotation.x=Et.lerp(this.leftArmGroup.rotation.x,.06,.12),this.rightArmGroup.rotation.x=Et.lerp(this.rightArmGroup.rotation.x,.06,.12),this.leftElbowGroup.rotation.x=Et.lerp(this.leftElbowGroup.rotation.x,.18,.12),this.rightElbowGroup.rotation.x=Et.lerp(this.rightElbowGroup.rotation.x,.18,.12);const m=Math.sin(a*.0025)*.008;this.pelvisGroup.position.y=Et.lerp(this.pelvisGroup.position.y,this.basePelvisY+m,.1),this.torsoGroup.rotation.y=Et.lerp(this.torsoGroup.rotation.y,0,.1),this.torsoGroup.rotation.z=Et.lerp(this.torsoGroup.rotation.z,0,.1)}const f=this.chestCore.material;s?(f.color.setHex(15680580),f.emissive.setHex(15680580)):i==="world_model"?(f.color.setHex(65437),f.emissive.setHex(65437)):(f.color.setHex(16096779),f.emissive.setHex(16096779)),f.emissiveIntensity=1.3+Math.sin(a*.006)*.4}}const St=class St{constructor(e){U(this,"container");U(this,"renderer",null);U(this,"scene");U(this,"camera");U(this,"povCamera");U(this,"activeCamera");U(this,"controls",null);U(this,"sunLight");U(this,"hemiLight");U(this,"ambientLight");U(this,"ceilingLights",[]);U(this,"povHeadlight");U(this,"floorMesh",null);U(this,"gridHelper",null);U(this,"humanoidRobot");U(this,"robotGroup");U(this,"robotMeshRoot");U(this,"robotScanner",null);U(this,"robotLedRing",null);U(this,"lidarSweepLine",null);U(this,"personGroup");U(this,"personMeshRoot");U(this,"personHead",null);U(this,"goalGroup");U(this,"goalRing",null);U(this,"goalBeacon",null);U(this,"goalDiamond",null);U(this,"obstacleMeshes",new Map);U(this,"lastFrameTime",performance.now());U(this,"dockingStationGroup");U(this,"dockLeftClamp",null);U(this,"dockRightClamp",null);U(this,"dockStatusLed",null);U(this,"dockLight",null);U(this,"dockCoil",null);U(this,"isDocked",!0);U(this,"clampAngle",0);U(this,"targetClampAngle",0);U(this,"pathEdgeLineLeft",null);U(this,"pathEdgeLineRight",null);U(this,"activePlacementTool","goal");U(this,"onFloorClick");U(this,"onPlaceObstacle");U(this,"pointerDownPos",{x:0,y:0,time:0});U(this,"clickRipples",[]);U(this,"chosenRibbonMesh",null);U(this,"candidateLinesGroup");U(this,"collisionMarkersGroup");U(this,"destinationRing",null);U(this,"ghostPool",[]);U(this,"ghostMeshesGroup");U(this,"breadcrumbPoints",[]);U(this,"breadcrumbLine",null);U(this,"hitboxesRoot");U(this,"cameraMode","overview");U(this,"targetCamPos",new I(0,5.8,5.8));U(this,"targetCamLookAt",new I(0,.2,0));U(this,"currentCamPos",new I(0,5.8,5.8));U(this,"currentCamLookAt",new I(0,.2,0));U(this,"povTargetQuat",new xn);U(this,"orbitAngle",0);U(this,"showHitboxes",!1);U(this,"showMindView",!1);U(this,"quality","high");U(this,"targetDpr",1);U(this,"currentDpr",1);U(this,"currentFps",60);U(this,"isDestroyed",!1);U(this,"cyberParticles",null);U(this,"animFrameId",0);U(this,"lastRenderTime",performance.now());U(this,"renderFrameCount",0);U(this,"lastFpsTime",performance.now());U(this,"onFpsUpdate");U(this,"robotSnapshots",[]);U(this,"personSnapshots",[]);U(this,"currentRobotPos",new I);U(this,"currentRobotHeading",0);U(this,"currentPersonPos",new I);U(this,"currentPersonHeading",0);U(this,"personVy",0);U(this,"personVisible",!1);U(this,"lastMode","world_model");U(this,"hasCollision",!1);U(this,"isFirstStateUpdate",!0);U(this,"candidateLinePool",[]);U(this,"ribbonPosArray",new Float32Array(St.MAX_RIBBON_PTS*2*3));U(this,"leftRailPosArray",new Float32Array(St.MAX_RIBBON_PTS*3));U(this,"rightRailPosArray",new Float32Array(St.MAX_RIBBON_PTS*3));U(this,"gltfLoader",new zg);U(this,"modelCache",new Map);U(this,"handleResize",()=>{if(!this.renderer||!this.container)return;const e=this.container.clientWidth,t=this.container.clientHeight;this.camera.aspect=e/t,this.camera.updateProjectionMatrix(),this.povCamera.aspect=e/t,this.povCamera.updateProjectionMatrix(),this.renderer.setSize(e,t)});U(this,"handleVisibility",()=>{document.hidden?this.animFrameId&&(cancelAnimationFrame(this.animFrameId),this.animFrameId=0):!this.animFrameId&&!this.isDestroyed&&(this.lastRenderTime=performance.now(),this.startRenderLoop())});this.container=e,this.scene=new th,this.scene.background=new Oe("#0a0f1d"),this.scene.fog=new yi(659229,.015);const t=e.clientWidth||900,n=e.clientHeight||600,i=t/n;this.camera=new kt(48,i,.05,120),this.camera.position.set(0,14.8,15.8),this.camera.lookAt(0,.5,0),this.camera.layers.enable(0),this.camera.layers.enable(1),this.povCamera=new kt(80,i,.05,50),this.povCamera.position.set(0,1.52,0),this.povCamera.layers.enable(0),this.povCamera.layers.disable(1),this.povHeadlight=new bi(16775917,2.5,9,Math.PI/4,.4,1.2),this.povHeadlight.position.set(0,1.5,0),this.povHeadlight.castShadow=!0,this.povCamera.add(this.povHeadlight),this.scene.add(this.povCamera),this.activeCamera=this.camera;try{this.renderer=new mh({antialias:!0,powerPreference:"high-performance",stencil:!1}),this.renderer.setSize(t,n),this.targetDpr=Math.min(window.devicePixelRatio||1,1.25),this.currentDpr=this.targetDpr,this.renderer.setPixelRatio(this.currentDpr),this.renderer.toneMapping=Pr,this.renderer.toneMappingExposure=1.22,this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=br,e.appendChild(this.renderer.domElement),wa.getInstance().setRenderer(this.renderer),this.controls=new vh(this.camera,this.renderer.domElement),this.controls.enableDamping=!0,this.controls.dampingFactor=.08,this.controls.target.set(0,.5,0),this.controls.maxPolarAngle=Math.PI/2-.04,this.controls.minDistance=2,this.controls.maxDistance=45}catch(l){console.warn("Three.js WebGL initialization failed:",l),this.renderer=null;return}this.sunLight=new qa(16775142,2),this.sunLight.position.set(6.5,14,5.5),this.sunLight.castShadow=!0,this.sunLight.shadow.mapSize.width=1024,this.sunLight.shadow.mapSize.height=1024,this.sunLight.shadow.camera.near=.5,this.sunLight.shadow.camera.far=45,this.sunLight.shadow.camera.left=-14,this.sunLight.shadow.camera.right=14,this.sunLight.shadow.camera.top=10,this.sunLight.shadow.camera.bottom=-10,this.sunLight.shadow.bias=-3e-4,this.scene.add(this.sunLight),this.hemiLight=new lh(9741240,1976635,.85),this.scene.add(this.hemiLight),this.ambientLight=new ch(16777215,.4),this.scene.add(this.ambientLight),this.candidateLinesGroup=new Ce,this.scene.add(this.candidateLinesGroup),this.collisionMarkersGroup=new Ce,this.scene.add(this.collisionMarkersGroup),this.ghostMeshesGroup=new Ce,this.scene.add(this.ghostMeshesGroup),this.hitboxesRoot=new Ce,this.scene.add(this.hitboxesRoot),this.buildLabEnvironment();const s=200,o=new lt,a=new Float32Array(s*3);for(let l=0;l<s*3;l+=3)a[l]=(Math.random()-.5)*22,a[l+1]=Math.random()*4.5+.2,a[l+2]=(Math.random()-.5)*14;o.setAttribute("position",new Rt(a,3));const c=new Ha({color:58879,size:.04,transparent:!0,opacity:.5,blending:ws});this.cyberParticles=new ih(o,c),this.scene.add(this.cyberParticles),this.humanoidRobot=new N_,this.humanoidRobot.root.scale.set(1.65,1.65,1.65),this.scene.add(this.humanoidRobot.root),this.dockingStationGroup=this.buildDockingStation(),this.dockingStationGroup.position.set(-7.39,0,0),this.scene.add(this.dockingStationGroup),this.robotGroup=new Ce,this.robotMeshRoot=new Ce,this.personGroup=this.buildPerson(),this.personGroup.scale.set(1.5,1.5,1.5),this.scene.add(this.personGroup),this.goalGroup=this.buildGoal(),this.goalGroup.scale.set(1.5,1.5,1.5),this.scene.add(this.goalGroup),this.initGhostPool(12),this.initCandidateLinePool(),this.initNavigationRibbonPool(),this.preloadAuthoredModels(),window.addEventListener("resize",this.handleResize),document.addEventListener("visibilitychange",this.handleVisibility),this.setupInteractionListeners(),this.startRenderLoop()}setupInteractionListeners(){if(!this.renderer)return;const e=this.renderer.domElement;e.addEventListener("pointerdown",t=>{this.pointerDownPos={x:t.clientX,y:t.clientY,time:performance.now()}}),e.addEventListener("pointerup",t=>{const n=Math.abs(t.clientX-this.pointerDownPos.x),i=Math.abs(t.clientY-this.pointerDownPos.y),s=performance.now()-this.pointerDownPos.time;n<6&&i<6&&s<450&&this.handleFloorPointer(t.clientX,t.clientY)})}handleFloorPointer(e,t){if(!this.floorMesh||!this.renderer)return;const n=this.renderer.domElement.getBoundingClientRect(),i=(e-n.left)/n.width*2-1,s=-((t-n.top)/n.height)*2+1,o=new Hu;o.setFromCamera(new Le(i,s),this.activeCamera);const a=o.intersectObject(this.floorMesh);if(a.length>0){const c=a[0].point,l=Math.min(860,Math.max(40,Math.round(c.x*St.SCALE_FACTOR+450))),h=Math.min(560,Math.max(40,Math.round(c.z*St.SCALE_FACTOR+300)));this.spawnClickRipple(c.x,c.z,this.activePlacementTool),this.activePlacementTool==="goal"?this.onFloorClick&&this.onFloorClick(l,h):this.onPlaceObstacle&&this.onPlaceObstacle(l,h,this.activePlacementTool)}}spawnClickRipple(e,t,n="goal"){let i=58879;n==="crate"?i=14251782:n==="cabinet"?i=15680580:n==="workstation"?i=16436245:n==="barrels"?i=165063:n==="barrier"&&(i=16436245);const s=new kn(.18,.36,32),o=new gt({color:i,transparent:!0,opacity:.95,side:At}),a=new N(s,o);a.rotation.x=-Math.PI/2,a.position.set(e,.025,t),this.scene.add(a),this.clickRipples.push({mesh:a,createdAt:performance.now()})}isAvailable(){return this.renderer!==null}getRendererElement(){return this.renderer?this.renderer.domElement:null}to3D(e,t){return{x:(e-450)/St.SCALE_FACTOR,z:(t-300)/St.SCALE_FACTOR}}buildLabEnvironment(){const e=new jn(900/St.SCALE_FACTOR,600/St.SCALE_FACTOR,32,32),t=pn.createFloorCanvasTexture(),n=pn.createFloorRoughnessTexture(),i=new te({map:t,roughnessMap:n,roughness:.32,metalness:.08});this.floorMesh=new N(e,i),this.floorMesh.rotation.x=-Math.PI/2,this.floorMesh.receiveShadow=!0,this.scene.add(this.floorMesh);const{lights:s}=pn.buildWarehouseArchitecture(this.scene);this.ceilingLights.push(...s),this.addRoomDecorations()}addRoomDecorations(){const e=new Ce,t=new te({color:988970,roughness:.3,metalness:.8}),n=new N(new ie(1.8,.85,.85),t);n.position.set(0,.425,0),e.add(n);const i=new gt({color:61695});for(const d of[-.45,.45]){const u=new N(new Ee(.02,.02,.25,8),t);u.position.set(d,.97,0),e.add(u);const f=new N(new ie(.55,.35,.02),i);f.position.set(d,1.15,0),f.rotation.y=d<0?.15:-.15,e.add(f)}e.position.set(8.2,0,5.2),e.rotation.y=-Math.PI*.75,this.scene.add(e);const s=new Ce,o=new N(new ie(.7,1.5,.4),t);o.position.set(0,.75,0),s.add(o);const a=new N(new ie(.1,1,.02),new gt({color:65437}));a.position.set(0,.8,.21),s.add(a),s.position.set(-8.4,0,5.2),s.rotation.y=Math.PI*.75,this.scene.add(s);const c=new si({color:61695,transparent:!0,opacity:.35}),l=[new I(-9.6,.015,-6.3),new I(9.6,.015,-6.3),new I(9.6,.015,6.3),new I(-9.6,.015,6.3),new I(-9.6,.015,-6.3)],h=new Sn(new lt().setFromPoints(l),c);this.scene.add(h)}buildRobot(){const e=new Ce;this.robotMeshRoot=new Ce,e.add(this.robotMeshRoot);const t=new Ee(.18,.18,.14,24),n=new te({color:1976635,roughness:.35,metalness:.7}),i=new N(t,n);i.position.y=.09,i.castShadow=!0,this.robotMeshRoot.add(i);const s=new ie(.16,.035,.05),o=new te({color:440020,emissive:440020,emissiveIntensity:.9}),a=new N(s,o);a.position.set(0,.12,-.16),this.robotMeshRoot.add(a);const c=new N(new Ee(.022,.022,.015,12),new te({color:16436245,roughness:.4}));c.position.set(.08,.165,.06),this.robotMeshRoot.add(c);const l=new N(new Ee(.018,.014,.018,12),new te({color:15680580,roughness:.3,emissive:15680580,emissiveIntensity:.4}));l.position.set(.08,.178,.06),this.robotMeshRoot.add(l);const h=new Ce;h.position.set(0,.18,0);const d=new Ee(.06,.06,.05,16),u=new te({color:988970,roughness:.2,metalness:.9}),f=new N(d,u);f.position.y=.025,h.add(f);const m=new lt().setFromPoints([new I(0,.025,0),new I(0,.025,-2.4)]),_=new si({color:65437,transparent:!0,opacity:.75}),g=new Sn(m,_);h.add(g),this.lidarSweepLine=g,this.robotScanner=h,e.add(h);const p=new kn(.12,.16,24),x=new te({color:1096065,emissive:1096065,emissiveIntensity:.8,side:At});this.robotLedRing=new N(p,x),this.robotLedRing.rotation.x=-Math.PI/2,this.robotLedRing.position.set(0,.162,0),e.add(this.robotLedRing);const S=new Yi(440020,1.4,1.2,1.5);S.position.set(0,.04,0),e.add(S);const M=new te({color:988970,roughness:.85,metalness:.2}),T=new N(new Ee(.065,.065,.04,16),M);T.rotation.z=Math.PI/2,T.position.set(-.17,.065,0),e.add(T);const E=new N(new Ee(.065,.065,.04,16),M);E.rotation.z=Math.PI/2,E.position.set(.17,.065,0),e.add(E);const R=new te({color:16777215,emissive:16775917,emissiveIntensity:1.5}),D=new N(new Ee(.02,.02,.02,12),R);D.rotation.x=Math.PI/2,D.position.set(-.08,.09,-.17),e.add(D);const y=new N(new Ee(.02,.02,.02,12),R);return y.rotation.x=Math.PI/2,y.position.set(.08,.09,-.17),e.add(y),this.robotMeshRoot.traverse(b=>b.layers.set(1)),e}buildDockingStation(){const e=new Ce,t=new ie(1.5,.08,1.4),n=new te({color:1976635,roughness:.35,metalness:.8}),i=new N(t,n);i.position.y=.04,i.receiveShadow=!0,e.add(i);const s=new ie(1.54,.03,1.44),o=new te({color:16436245,roughness:.4}),a=new N(s,o);a.position.y=.02,e.add(a);const c=new te({color:988970,roughness:.5,metalness:.9});for(const k of[-.32,.32]){const z=new N(new ie(.12,.04,1.1),c);z.position.set(k,.09,.05),e.add(z)}const l=new kn(.25,.44,32),h=new te({color:61695,emissive:61695,emissiveIntensity:1.5,side:At});this.dockCoil=new N(l,h),this.dockCoil.rotation.x=-Math.PI/2,this.dockCoil.position.y=.085,e.add(this.dockCoil);const d=new ie(.9,1.9,.3),u=new te({color:988970,roughness:.25,metalness:.85}),f=new N(d,u);f.position.set(0,.95,-.55),f.castShadow=!0,e.add(f);for(const k of[-.25,.25]){const z=new N(new Ee(.025,.025,1.6,12),c);z.position.set(k,.9,-.42),e.add(z)}const m=new N(new ie(1.1,.12,.65),u);m.position.set(0,1.92,-.32),m.castShadow=!0,e.add(m);const _=new bi(16775917,2.8,5,Math.PI/3,.5,1.2);_.position.set(0,1.88,-.2),_.target.position.set(0,0,0),e.add(_),e.add(_.target);const g=new ie(.55,.12,.02),p=new te({color:16096779,emissive:16096779,emissiveIntensity:1.8});this.dockStatusLed=new N(g,p),this.dockStatusLed.position.set(0,1.6,-.39),e.add(this.dockStatusLed),this.dockLight=new Yi(16096779,1.8,3.2,1.2),this.dockLight.position.set(0,.6,0),e.add(this.dockLight);const x=new te({color:3359061,roughness:.35,metalness:.75}),S=new te({color:15680580,roughness:.8});this.dockLeftClamp=new Ce,this.dockLeftClamp.position.set(-.48,.85,-.38);const M=new N(new Ee(.045,.045,.18,16),c);this.dockLeftClamp.add(M);const T=new N(new ie(.06,.06,.48),x);T.position.set(0,0,.24),this.dockLeftClamp.add(T);const E=new N(new ie(.24,.06,.06),x);E.position.set(.12,0,.48),this.dockLeftClamp.add(E);const R=new N(new ie(.08,.08,.14),S);R.position.set(.24,0,.48),this.dockLeftClamp.add(R),e.add(this.dockLeftClamp),this.dockRightClamp=new Ce,this.dockRightClamp.position.set(.48,.85,-.38);const D=new N(new Ee(.045,.045,.18,16),c);this.dockRightClamp.add(D);const y=new N(new ie(.06,.06,.48),x);y.position.set(0,0,.24),this.dockRightClamp.add(y);const b=new N(new ie(.24,.06,.06),x);b.position.set(-.12,0,.48),this.dockRightClamp.add(b);const L=new N(new ie(.08,.08,.14),S);return L.position.set(-.24,0,.48),this.dockRightClamp.add(L),e.add(this.dockRightClamp),e}setDockStatus(e){if(this.isDocked=e==="docked",this.targetClampAngle=this.isDocked?0:1.15,this.dockStatusLed){const t=this.dockStatusLed.material;this.isDocked?(t.color.setHex(16096779),t.emissive.setHex(16096779)):(t.color.setHex(65437),t.emissive.setHex(65437))}this.dockLight&&this.dockLight.color.setHex(this.isDocked?16096779:65437)}buildPerson(){const{root:e,head:t}=pn.createRealisticTechnician();return this.personMeshRoot=e,this.personHead=t,e.visible=!1,e}buildGoal(){const e=new Ce,t=new Ee(.35,.38,.05,32),n=new te({color:1976635,roughness:.3,metalness:.7}),i=new N(t,n);i.position.y=.025,i.receiveShadow=!0,e.add(i);const s=new kn(.24,.34,32),o=new te({color:16096779,emissive:16096779,emissiveIntensity:1.4,side:At});this.goalRing=new N(s,o),this.goalRing.rotation.x=-Math.PI/2,this.goalRing.position.y=.052,e.add(this.goalRing);const a=new kn(.38,.44,32),c=new gt({color:16498468,transparent:!0,opacity:.45,side:At}),l=new N(a,c);l.rotation.x=-Math.PI/2,l.position.y=.015,l.name="goalOuterPulse",e.add(l);const h=new Ee(.03,.03,3.2,16,1,!0),d=new gt({color:16776171,transparent:!0,opacity:.6,side:At,blending:ws}),u=new N(h,d);u.position.y=1.6,e.add(u);const f=new Ee(.12,.12,3.2,24,1,!0),m=new gt({color:16096779,transparent:!0,opacity:.28,side:At,blending:ws});this.goalBeacon=new N(f,m),this.goalBeacon.position.y=1.6,e.add(this.goalBeacon);const _=new Ya(.12,0),g=new te({color:16498468,emissive:16096779,emissiveIntensity:1.3,roughness:.2,metalness:.9});this.goalDiamond=new N(_,g),this.goalDiamond.position.y=2.4,e.add(this.goalDiamond);const p=new Yi(16096779,1.8,3.5,1.2);return p.position.y=.5,e.add(p),e}preloadAuthoredModels(){[{key:"goal",url:"/models/goal_pad.glb"},{key:"crate",url:"/models/crate.glb"},{key:"cabinet",url:"/models/cabinet.glb"},{key:"plant",url:"/models/plant.glb"},{key:"desk",url:"/models/desk.glb"}].forEach(({key:t,url:n})=>{this.gltfLoader.load(n,i=>{const s=i.scene;s.traverse(o=>{o.isMesh&&(o.castShadow=!0,o.receiveShadow=!0)}),this.modelCache.set(t,s)},void 0,i=>{const s=(i==null?void 0:i.message)||String(i);console.warn(`Authored GLB model [${t}] unavailable (${s}). Using high-fidelity procedural PBR.`)})})}replaceRobotWithAuthoredModel(e){for(;this.robotMeshRoot.children.length>0;)this.robotMeshRoot.remove(this.robotMeshRoot.children[0]);e.scale.set(.75,.75,.75),e.position.set(0,0,0),e.traverse(t=>t.layers.set(1)),this.robotMeshRoot.add(e)}initGhostPool(e){const t=new gt({color:440020,transparent:!0,opacity:.32,wireframe:!0});for(let n=0;n<e;n++){const i=new Ce,s=new N(new Ee(.18,.18,.12,16),t.clone());s.position.y=.06,i.add(s),i.visible=!1,this.ghostPool.push(i),this.ghostMeshesGroup.add(i)}}initCandidateLinePool(e=St.MAX_CANDIDATE_LINES){for(let t=0;t<e;t++){const n=new lt,i=new Float32Array(St.MAX_CANDIDATE_PTS*3);n.setAttribute("position",new Rt(i,3)),n.setDrawRange(0,0);const s=new si({color:440020,transparent:!0,opacity:.28}),o=new Sn(n,s);o.visible=!1,this.candidateLinesGroup.add(o),this.candidateLinePool.push(o)}}initNavigationRibbonPool(){const e=new lt,t=St.MAX_RIBBON_PTS,n=new Uint16Array((t-1)*6);for(let c=0;c<t-1;c++){const l=c*2,h=c*6;n[h+0]=l,n[h+1]=l+1,n[h+2]=l+2,n[h+3]=l+1,n[h+4]=l+3,n[h+5]=l+2}e.setIndex(new Rt(n,1)),e.setAttribute("position",new Rt(this.ribbonPosArray,3)),e.setDrawRange(0,0);const i=new gt({color:61695,side:At,transparent:!0,opacity:.85,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-4});this.chosenRibbonMesh=new N(e,i),this.chosenRibbonMesh.visible=!1,this.scene.add(this.chosenRibbonMesh);const s=new si({color:65535,transparent:!0,opacity:.95}),o=new lt;o.setAttribute("position",new Rt(this.leftRailPosArray,3)),o.setDrawRange(0,0),this.pathEdgeLineLeft=new Sn(o,s),this.pathEdgeLineLeft.visible=!1,this.scene.add(this.pathEdgeLineLeft);const a=new lt;a.setAttribute("position",new Rt(this.rightRailPosArray,3)),a.setDrawRange(0,0),this.pathEdgeLineRight=new Sn(a,s.clone()),this.pathEdgeLineRight.visible=!1,this.scene.add(this.pathEdgeLineRight)}startRenderLoop(){const e=t=>{this.isDestroyed||(this.animFrameId=requestAnimationFrame(e),this.renderFrame(t))};this.animFrameId=requestAnimationFrame(e)}renderFrame(e){if(!this.renderer||this.isDestroyed)return;const t=Math.min(.05,Math.max(.001,(e-this.lastRenderTime)/1e3));if(this.lastRenderTime=e,this.renderFrameCount++,e-this.lastFpsTime>=500&&(this.currentFps=Math.round(this.renderFrameCount*1e3/(e-this.lastFpsTime)),this.renderFrameCount=0,this.lastFpsTime=e,this.currentFps<42&&this.currentDpr>1?(this.currentDpr=1,this.renderer.setPixelRatio(this.currentDpr)):this.currentFps>58&&this.currentDpr<this.targetDpr&&(this.currentDpr=this.targetDpr,this.renderer.setPixelRatio(this.currentDpr)),this.onFpsUpdate&&this.onFpsUpdate(this.currentFps)),this.controls&&this.controls.enabled&&this.controls.update(),this.robotSnapshots.length>0)if(this.robotSnapshots.length===1){const l=this.robotSnapshots[0];this.currentRobotPos.set(l.x,0,l.z),this.currentRobotHeading=l.heading}else{const l=e-St.INTERP_DELAY_MS,h=this.robotSnapshots;if(l<=h[0].time)this.currentRobotPos.set(h[0].x,0,h[0].z),this.currentRobotHeading=h[0].heading;else if(l>=h[h.length-1].time){const d=h[h.length-1],u=h[h.length-2],f=Math.max(.015,(d.time-u.time)/1e3),m=(d.x-u.x)/f,_=(d.z-u.z)/f,g=Math.min(.05,(l-d.time)/1e3),p=Math.max(0,1-g/.05);this.currentRobotPos.set(d.x+m*g*p,0,d.z+_*g*p),this.currentRobotHeading=d.heading}else{let d=0;for(let p=0;p<h.length-1;p++)if(h[p].time<=l&&l<=h[p+1].time){d=p;break}const u=h[d],f=h[d+1],m=Math.max(.001,f.time-u.time),_=Math.max(0,Math.min(1,(l-u.time)/m));this.currentRobotPos.set(Et.lerp(u.x,f.x,_),0,Et.lerp(u.z,f.z,_));let g=(f.heading-u.heading)%(Math.PI*2);g>Math.PI&&(g-=Math.PI*2),g<-Math.PI&&(g+=Math.PI*2),this.currentRobotHeading=u.heading+g*_}}this.humanoidRobot&&this.humanoidRobot.update(t,this.currentRobotPos,this.currentRobotHeading,this.lastMode==="world_model"?"world_model":"baseline",this.hasCollision,this.isDocked);const n=Math.sin(this.currentRobotHeading),i=Math.cos(this.currentRobotHeading),s=this.currentRobotPos.x+n*.12,o=1.52,a=this.currentRobotPos.z+i*.12;if(this.povCamera.position.set(s,o,a),this.povTargetQuat.setFromAxisAngle(new I(0,1,0),this.currentRobotHeading+Math.PI),this.povCamera.quaternion.slerp(this.povTargetQuat,.25),this.povHeadlight.position.set(s,o,a),this.povHeadlight.target.position.set(s+n*4,o-.2,a+i*4),this.personGroup&&this.personVisible&&this.personSnapshots.length>0){if(this.personSnapshots.length===1){const d=this.personSnapshots[0];this.currentPersonPos.set(d.x,0,d.z),this.currentPersonHeading=d.heading}else{const d=e-St.INTERP_DELAY_MS,u=this.personSnapshots;if(d<=u[0].time)this.currentPersonPos.set(u[0].x,0,u[0].z),this.currentPersonHeading=u[0].heading;else if(d>=u[u.length-1].time){const f=u[u.length-1];this.currentPersonPos.set(f.x,0,f.z),this.currentPersonHeading=f.heading}else{let f=0;for(let S=0;S<u.length-1;S++)if(u[S].time<=d&&d<=u[S+1].time){f=S;break}const m=u[f],_=u[f+1],g=Math.max(.001,_.time-m.time),p=Math.max(0,Math.min(1,(d-m.time)/g));this.currentPersonPos.set(Et.lerp(m.x,_.x,p),0,Et.lerp(m.z,_.z,p));let x=(_.heading-m.heading)%(Math.PI*2);x>Math.PI&&(x-=Math.PI*2),x<-Math.PI&&(x+=Math.PI*2),this.currentPersonHeading=m.heading+x*p}}const h=Math.abs(this.personVy)>.01?Math.abs(Math.sin(e*.008))*.03:0;if(this.personGroup.position.set(this.currentPersonPos.x,h,this.currentPersonPos.z),this.personGroup.rotation.y=this.currentPersonHeading,this.personHead)if(Math.hypot(this.currentPersonPos.x-this.currentRobotPos.x,this.currentPersonPos.z-this.currentRobotPos.z)<2.5){const u=Math.atan2(this.currentRobotPos.x-this.currentPersonPos.x,this.currentRobotPos.z-this.currentPersonPos.z);this.personHead.rotation.y=u-this.personGroup.rotation.y}else this.personHead.rotation.y=0}this.goalRing&&this.goalRing.scale.setScalar(1+.08*Math.sin(e*.005)),this.goalDiamond&&(this.goalDiamond.rotation.y+=.025,this.goalDiamond.rotation.x=Math.sin(e*.003)*.15,this.goalDiamond.position.y=2.4+Math.sin(e*.004)*.08);const c=this.goalGroup?this.goalGroup.getObjectByName("goalOuterPulse"):null;if(c){const l=1+.18*Math.sin(e*.006);c.scale.set(l,l,1)}if(this.clampAngle=Et.lerp(this.clampAngle,this.targetClampAngle,.18),this.dockLeftClamp&&(this.dockLeftClamp.rotation.y=-this.clampAngle),this.dockRightClamp&&(this.dockRightClamp.rotation.y=this.clampAngle),this.dockCoil&&this.isDocked){const l=1+Math.sin(e*.005)*.08;this.dockCoil.scale.set(l,l,1)}for(let l=this.clickRipples.length-1;l>=0;l--){const h=this.clickRipples[l],d=(e-h.createdAt)/550;if(d>=1)this.scene.remove(h.mesh),h.mesh.geometry.dispose(),h.mesh.material.dispose(),this.clickRipples.splice(l,1);else{const u=1+d*3.5;h.mesh.scale.set(u,u,1),h.mesh.material.opacity=(1-d)*.95}}if(this.cyberParticles){const l=this.cyberParticles.geometry.attributes.position,h=l.array;for(let d=1;d<h.length;d+=3)h[d]+=t*.25,h[d]>4.8&&(h[d]=.25);l.needsUpdate=!0}this.updateCamera(e,this.currentRobotPos.x,this.currentRobotPos.z,this.currentRobotHeading),this.renderer.render(this.scene,this.activeCamera)}update(e){this.updateState(e)}updateState(e){var s;if(!this.renderer||!e||this.isDestroyed)return;const t=e.entities||[];let n=!1;const i=new Set;for(let o=0;o<t.length;o++){const a=t[o];i.add(a.id);const c=this.to3D(a.x,a.y);if(a.kind==="robot"){const l=performance.now();(e.step===0||!this.dockingStationGroup.userData.positioned)&&(this.dockingStationGroup.position.set(c.x,0,c.z),this.dockingStationGroup.userData.positioned=!0),this.hasCollision=!!((s=a.extra)!=null&&s.collision),this.lastMode=e.mode||"world_model";let h=this.isDocked?Math.PI/2:this.currentRobotHeading;const d=this.robotSnapshots.length>0?this.robotSnapshots[this.robotSnapshots.length-1]:null;if(this.isDocked)h=Math.PI/2;else if(d){const u=c.x-d.x,f=c.z-d.z;Math.hypot(u,f)>.02?h=Math.atan2(u,f):h=d.heading}this.isFirstStateUpdate||e.step===0||d&&Math.hypot(c.x-d.x,c.z-d.z)>2.5?(this.robotSnapshots=[{x:c.x,z:c.z,heading:h,time:l}],this.currentRobotPos.set(c.x,0,c.z),this.currentRobotHeading=h,this.isFirstStateUpdate=!1):(this.robotSnapshots.push({x:c.x,z:c.z,heading:h,time:l}),this.robotSnapshots.length>15&&this.robotSnapshots.shift())}else if(a.kind==="person"){n=!0,this.personVisible=!0;const l=performance.now(),h=-((a.heading||0)*(Math.PI/180));this.personVy=a.vy||0,this.personSnapshots.length===0||Math.hypot(c.x-this.personSnapshots[this.personSnapshots.length-1].x,c.z-this.personSnapshots[this.personSnapshots.length-1].z)>2.5?(this.personSnapshots=[{x:c.x,z:c.z,heading:h,time:l}],this.currentPersonPos.set(c.x,0,c.z),this.currentPersonHeading=h):(this.personSnapshots.push({x:c.x,z:c.z,heading:h,time:l}),this.personSnapshots.length>15&&this.personSnapshots.shift())}else{let l=this.obstacleMeshes.get(a.id);const h=1.45,d=(a.w||80)/100*h,u=(a.h||80)/100*h;l||(a.id==="obs_0"||a.kind==="chair"||a.kind==="workstation"?l=pn.createWorkstationObstacle(d,.95,u):a.id==="obs_1"||a.kind==="crate"?l=pn.createRealisticCrate(d,.9,u):a.id==="obs_2"||a.kind==="cabinet"?l=pn.createToolCabinet(d,.95,u):a.kind==="barrels"?l=pn.createBarrelCluster(d,.95,u):a.kind==="barrier"?l=pn.createSafetyBarrier(d,.85,u):l=o%2===0?pn.createRealisticCrate(d,.9,u):pn.createToolCabinet(d,.95,u),this.scene.add(l),this.obstacleMeshes.set(a.id,l));const f=this.to3D(a.x+(a.w||80)/2,a.y+(a.h||80)/2);l.position.set(f.x,0,f.z)}}this.personVisible=n,this.personGroup&&(this.personGroup.visible=n);for(const[o,a]of this.obstacleMeshes.entries())i.has(o)||(this.scene.remove(a),this.obstacleMeshes.delete(o));if(e.goal){const o=this.to3D(e.goal.x,e.goal.y);this.goalGroup.position.set(o.x,0,o.z)}this.updateNavigationRibbon(e.plan),this.showMindView?(this.scene.background=new Oe("#050814"),this.sunLight.intensity=.6,this.hemiLight.intensity=.4,this.floorMesh&&this.floorMesh.material.color.setHex(1450040)):(this.scene.background=new Oe("#0a0f1d"),this.sunLight.intensity=1.8,this.hemiLight.intensity=.75,this.floorMesh&&this.floorMesh.material.color.setHex(16777215))}updateNavigationRibbon(e){if(e){if(e.best&&e.best.length>=2){const t=e.best.map(l=>{const h=this.to3D(l[0],l[1]);return new I(h.x,.015,h.z)}),n=new du(t),i=.95,s=Math.min(St.MAX_RIBBON_PTS-1,Math.min(60,t.length*5)),o=n.getPoints(s),a=o.length;for(let l=0;l<a;l++){const h=o[l];let d,u;l<a-1?(d=o[l+1].x-h.x,u=o[l+1].z-h.z):(d=h.x-o[l-1].x,u=h.z-o[l-1].z);const f=Math.hypot(d,u)||1,m=i*.5/f,_=-u*m,g=d*m,p=h.x+_,x=h.z+g,S=h.x-_,M=h.z-g,T=l*6;this.ribbonPosArray[T+0]=p,this.ribbonPosArray[T+1]=.022,this.ribbonPosArray[T+2]=x,this.ribbonPosArray[T+3]=S,this.ribbonPosArray[T+4]=.022,this.ribbonPosArray[T+5]=M;const E=l*3;this.leftRailPosArray[E+0]=p,this.leftRailPosArray[E+1]=.025,this.leftRailPosArray[E+2]=x,this.rightRailPosArray[E+0]=S,this.rightRailPosArray[E+1]=.025,this.rightRailPosArray[E+2]=M}if(this.chosenRibbonMesh){const l=this.chosenRibbonMesh.geometry.attributes.position;l.needsUpdate=!0,this.chosenRibbonMesh.geometry.setDrawRange(0,(a-1)*6),this.chosenRibbonMesh.visible=!0}if(this.pathEdgeLineLeft){const l=this.pathEdgeLineLeft.geometry.attributes.position;l.needsUpdate=!0,this.pathEdgeLineLeft.geometry.setDrawRange(0,a),this.pathEdgeLineLeft.visible=!0}if(this.pathEdgeLineRight){const l=this.pathEdgeLineRight.geometry.attributes.position;l.needsUpdate=!0,this.pathEdgeLineRight.geometry.setDrawRange(0,a),this.pathEdgeLineRight.visible=!0}if(o.length>0){const l=o[o.length-1];if(!this.destinationRing){const h=new kn(.48,.64,36),d=new gt({color:61695,side:At,transparent:!0,opacity:.9,polygonOffset:!0,polygonOffsetFactor:-3,polygonOffsetUnits:-6});this.destinationRing=new N(h,d),this.destinationRing.rotation.x=-Math.PI/2,this.scene.add(this.destinationRing)}this.destinationRing.position.set(l.x,.026,l.z),this.destinationRing.visible=!0}const c=[3,6,9];for(let l=0;l<this.ghostPool.length;l++){const h=this.ghostPool[l];if(l<c.length&&c[l]<t.length){const d=t[c[l]];h.position.set(d.x,0,d.z),h.visible=!0}else h.visible=!1}}else this.chosenRibbonMesh&&(this.chosenRibbonMesh.visible=!1),this.destinationRing&&(this.destinationRing.visible=!1),this.pathEdgeLineLeft&&(this.pathEdgeLineLeft.visible=!1),this.pathEdgeLineRight&&(this.pathEdgeLineRight.visible=!1),this.ghostPool.forEach(t=>t.visible=!1);if(e&&e.alts&&e.alts.length>0){const t=e.alts.slice(0,this.candidateLinePool.length);for(let n=0;n<this.candidateLinePool.length;n++){const i=this.candidateLinePool[n];if(n<t.length){const s=t[n];if(s.path&&s.path.length>=2){const o=s.score<-5||s.predicted_collision_step&&s.predicted_collision_step>0,a=o?15680580:440020,c=o?.45:.28,l=i.material;l.color.setHex(a),l.opacity=c;const h=i.geometry.attributes.position,d=h.array,u=Math.min(St.MAX_CANDIDATE_PTS,s.path.length);for(let f=0;f<u;f++){const m=this.to3D(s.path[f][0],s.path[f][1]);d[f*3]=m.x,d[f*3+1]=.012,d[f*3+2]=m.z}h.needsUpdate=!0,i.geometry.setDrawRange(0,u),i.visible=!0;continue}}i.visible=!1}}else this.candidateLinePool.forEach(t=>t.visible=!1)}}updateCamera(e,t,n,i){if(this.cameraMode==="robot_pov"){this.activeCamera=this.povCamera,this.controls&&(this.controls.enabled=!1);return}if(this.activeCamera=this.camera,this.cameraMode==="chase"){this.controls&&(this.controls.enabled=!1);const s=2.4,o=1.85,a=t-Math.sin(i)*s,c=n-Math.cos(i)*s;this.targetCamPos.set(a,o,c),this.targetCamLookAt.set(t+Math.sin(i)*1.5,1.1,n+Math.cos(i)*1.5),this.currentCamPos.lerp(this.targetCamPos,.08),this.currentCamLookAt.lerp(this.targetCamLookAt,.08),this.camera.position.copy(this.currentCamPos),this.camera.lookAt(this.currentCamLookAt)}else if(this.cameraMode==="orbit"){this.controls&&(this.controls.enabled=!1),this.orbitAngle+=.003;const s=6.2;this.targetCamPos.set(Math.cos(this.orbitAngle)*s,5,Math.sin(this.orbitAngle)*s),this.targetCamLookAt.set(0,.2,0),this.currentCamPos.lerp(this.targetCamPos,.08),this.currentCamLookAt.lerp(this.targetCamLookAt,.08),this.camera.position.copy(this.currentCamPos),this.camera.lookAt(this.currentCamLookAt)}else if(this.cameraMode==="cinematic"){this.controls&&(this.controls.enabled=!1),this.orbitAngle+=.005;const s=3.8,o=2.1+Math.sin(this.orbitAngle*1.5)*.35;this.targetCamPos.set(t+Math.cos(this.orbitAngle)*s,o,n+Math.sin(this.orbitAngle)*s),this.targetCamLookAt.set(t,.75,n),this.currentCamPos.lerp(this.targetCamPos,.06),this.currentCamLookAt.lerp(this.targetCamLookAt,.06),this.camera.position.copy(this.currentCamPos),this.camera.lookAt(this.currentCamLookAt)}else this.cameraMode==="topdown"?this.controls&&(this.controls.enabled=!0,this.controls.update()):this.controls&&(this.controls.enabled=!0,this.controls.update())}captureScreenshot(){return this.renderer?(this.renderer.render(this.scene,this.activeCamera),this.renderer.domElement.toDataURL("image/png")):""}setCameraMode(e){this.cameraMode=e,this.controls&&(e==="overview"?(this.controls.enabled=!0,this.controls.target.set(0,.5,0),this.camera.position.set(0,14.8,15.8),this.camera.lookAt(0,.5,0)):e==="topdown"?(this.controls.enabled=!0,this.controls.target.set(0,0,0),this.camera.position.set(0,17.5,.01),this.camera.lookAt(0,0,0)):this.controls.enabled=!1)}cycleCamera(){const e=["overview","chase","topdown","robot_pov","orbit","cinematic"],t=(e.indexOf(this.cameraMode)+1)%e.length;return this.setCameraMode(e[t]),this.cameraMode}setQuality(e){this.quality=e,this.renderer&&(e==="low"?(this.renderer.shadowMap.enabled=!1,this.targetDpr=1):e==="med"?(this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=Ih,this.targetDpr=1):(this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=br,this.targetDpr=Math.min(window.devicePixelRatio||1,1.25)),this.currentDpr=this.targetDpr,this.renderer.setPixelRatio(this.currentDpr))}destroy(){this.isDestroyed=!0,this.animFrameId&&(cancelAnimationFrame(this.animFrameId),this.animFrameId=0),window.removeEventListener("resize",this.handleResize),document.removeEventListener("visibilitychange",this.handleVisibility),this.controls&&(this.controls.dispose(),this.controls=null);for(const e of this.clickRipples)this.scene.remove(e.mesh),e.mesh.geometry.dispose(),e.mesh.material.dispose();this.clickRipples=[];for(const e of this.candidateLinePool)this.scene.remove(e),e.geometry.dispose(),e.material.dispose();this.candidateLinePool=[],this.chosenRibbonMesh&&(this.chosenRibbonMesh.geometry.dispose(),this.chosenRibbonMesh.material.dispose()),this.pathEdgeLineLeft&&(this.pathEdgeLineLeft.geometry.dispose(),this.pathEdgeLineLeft.material.dispose()),this.pathEdgeLineRight&&(this.pathEdgeLineRight.geometry.dispose(),this.pathEdgeLineRight.material.dispose()),this.renderer&&(this.renderer.dispose(),this.renderer.domElement&&this.renderer.domElement.parentElement&&this.renderer.domElement.parentElement.removeChild(this.renderer.domElement))}};U(St,"SCALE_FACTOR",46),U(St,"INTERP_DELAY_MS",50),U(St,"MAX_CANDIDATE_LINES",8),U(St,"MAX_CANDIDATE_PTS",32),U(St,"MAX_RIBBON_PTS",80);let Rs=St;class To{constructor(e){U(this,"container");U(this,"renderer",null);U(this,"scene");U(this,"camera");U(this,"controls",null);U(this,"sunLight");U(this,"ambientLight");U(this,"hemiLight");U(this,"streetLightsGroup");U(this,"rainParticles",null);U(this,"terrainMesh",null);U(this,"roadMesh",null);U(this,"roadLinesMesh",null);U(this,"guardrailsMesh",null);U(this,"sceneryGroup");U(this,"cameraMode","chase");U(this,"timeOfDay","day");U(this,"isRaining",!1);U(this,"targetFov",60);U(this,"egoVehicleGroup");U(this,"egoWheels",[]);U(this,"egoHeadlights",[]);U(this,"egoTaillightMeshes",[]);U(this,"egoIndicatorMeshes",{left:[],right:[]});U(this,"npcMeshes",new Map);U(this,"pedestrianMeshes",new Map);U(this,"mindViewEnabled",!0);U(this,"bestTrajectoryLine",null);U(this,"altTrajectoryLines",[]);U(this,"ghostCarMesh",null);U(this,"animFrameId",null);U(this,"lastRenderTime",performance.now());U(this,"fpsCounter",60);U(this,"frameCount",0);U(this,"fpsTimer",performance.now());U(this,"egoTargetPos",new I(0,0,0));U(this,"egoTargetHeading",0);U(this,"egoSpeedMps",20);U(this,"egoSteerAngle",0);U(this,"egoWheelSpin",0);U(this,"screenShakeIntensity",0);U(this,"onFpsUpdate",null);U(this,"onCollision",null);U(this,"onFloorClick",null);U(this,"onPlaceObstacle",null);U(this,"activePlacementTool","goal");U(this,"currentFps",60);this.container=e,this.scene=new th,this.scene.background=new Oe(659746),this.scene.fog=new yi(659746,.0035),this.camera=new kt(60,e.clientWidth/Math.max(1,e.clientHeight),.1,800),this.camera.position.set(0,10,-18);try{this.renderer=new mh({antialias:!0,alpha:!1,powerPreference:"high-performance"}),this.renderer.setSize(e.clientWidth,e.clientHeight),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),this.renderer.toneMapping=Pr,this.renderer.toneMappingExposure=1.15,this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=br,e.appendChild(this.renderer.domElement),this.controls=new vh(this.camera,this.renderer.domElement),this.controls.enableDamping=!0,this.controls.dampingFactor=.05,this.controls.enabled=!1}catch(t){console.warn("WebGL initialization failed:",t),this.renderer=null}this.streetLightsGroup=new Ce,this.sceneryGroup=new Ce,this.egoVehicleGroup=new Ce,this.scene.add(this.streetLightsGroup),this.scene.add(this.sceneryGroup),this.scene.add(this.egoVehicleGroup),this.sunLight=new qa(16775917,2.2),this.sunLight.position.set(80,120,60),this.sunLight.castShadow=!0,this.sunLight.shadow.mapSize.width=2048,this.sunLight.shadow.mapSize.height=2048,this.sunLight.shadow.camera.near=10,this.sunLight.shadow.camera.far=350,this.sunLight.shadow.camera.left=-70,this.sunLight.shadow.camera.right=70,this.sunLight.shadow.camera.top=70,this.sunLight.shadow.camera.bottom=-70,this.scene.add(this.sunLight),this.ambientLight=new ch(3688544,.85),this.scene.add(this.ambientLight),this.hemiLight=new lh(7377072,2042167,.7),this.scene.add(this.hemiLight),this.buildTerrain(),this.buildEgoVehicle(),this.buildGhostVehicle(),this.buildTrajectoryRibbons(),this.setupEventListeners(),this.setTimeOfDay("day"),this.animate=this.animate.bind(this),this.animFrameId=requestAnimationFrame(this.animate)}cycleCamera(){const e=["chase","cockpit","topdown","orbit","cinematic"],t=e.indexOf(this.cameraMode),n=e[(t+1)%e.length];return this.setCameraMode(n),n}captureScreenshot(){return this.renderer?this.renderer.domElement.toDataURL("image/png"):""}setDockStatus(e){}destroy(){this.dispose()}isAvailable(){return this.renderer!==null}buildTerrain(){const e=new jn(1200,1200,32,32),t=new te({color:1715741,roughness:.92,metalness:.05});this.terrainMesh=new N(e,t),this.terrainMesh.rotation.x=-Math.PI/2,this.terrainMesh.position.y=-.15,this.terrainMesh.receiveShadow=!0,this.scene.add(this.terrainMesh)}buildRoadFromCenterline(e,t=11.25){if(!e||e.length<2)return;this.roadMesh&&this.scene.remove(this.roadMesh),this.roadLinesMesh&&this.scene.remove(this.roadLinesMesh),this.guardrailsMesh&&this.scene.remove(this.guardrailsMesh);const s=t/2+1.8,o=[],a=[],c=[],l=[],h=[];let d=0,u=new Le(e[0][0],e[0][1]);for(let p=0;p<e.length;p++){const x=new Le(e[p][0],e[p][1]);p>0&&(d+=x.distanceTo(u)),u=x;let S=new Le(1,0);p<e.length-1?S=new Le(e[p+1][0]-x.x,e[p+1][1]-x.y).normalize():p>0&&(S=new Le(x.x-e[p-1][0],x.y-e[p-1][1]).normalize());const M=new Le(-S.y,S.x),T=x.x-M.x*s,E=-(x.y-M.y*s),R=x.x+M.x*s,D=-(x.y+M.y*s);if(o.push(T,0,E),o.push(R,0,D),a.push(0,d*.1),a.push(1,d*.1),p<e.length-1){const b=p*2;c.push(b,b+1,b+2),c.push(b+1,b+3,b+2)}if([-1.875,1.875].forEach(b=>{const L=x.x+M.x*b,k=-(x.y+M.y*b),z=.08;l.push(L-M.x*z,.02,k+M.y*z),l.push(L+M.x*z,.02,k-M.y*z)}),p<e.length-1){const b=p*4;h.push(b,b+1,b+4),h.push(b+1,b+5,b+4),h.push(b+2,b+3,b+6),h.push(b+3,b+7,b+6)}p%8===0&&p>0&&(this.addStreetlight(T-M.x*1.5,E-M.y*1.5,-S),this.addTree(T-M.x*6,E-M.y*6),this.addTree(R+M.x*6,D+M.y*6))}const f=new lt;f.setAttribute("position",new at(o,3)),f.setAttribute("uv",new at(a,2)),f.setIndex(c),f.computeVertexNormals();const m=new te({color:1975344,roughness:.85,metalness:.12});this.roadMesh=new N(f,m),this.roadMesh.receiveShadow=!0,this.scene.add(this.roadMesh);const _=new lt;_.setAttribute("position",new at(l,3)),_.setIndex(h),_.computeVertexNormals();const g=new gt({color:16317180,transparent:!0,opacity:.85});this.roadLinesMesh=new N(_,g),this.scene.add(this.roadLinesMesh)}addStreetlight(e,t,n){const i=new Ee(.08,.12,6.5,8),s=new te({color:4674921,metalness:.8,roughness:.3}),o=new N(i,s);o.position.set(e,3.25,t),o.castShadow=!0,this.streetLightsGroup.add(o);const a=new ie(.4,.15,.9),c=new te({color:988970,emissive:16707722,emissiveIntensity:.6}),l=new N(a,c);if(l.position.set(e,6.4,t),this.streetLightsGroup.add(l),this.timeOfDay==="night"){const h=new bi(16775149,3,35,Math.PI/4,.4);h.position.set(e,6.4,t),h.target.position.set(e,0,t),this.scene.add(h.target),this.streetLightsGroup.add(h)}}addTree(e,t){const n=new Ee(.2,.3,2,6),i=new te({color:4073251,roughness:.9}),s=new N(n,i);s.position.set(e,1,t);const o=new Va(1.6,3.5,7),a=new te({color:1786674,roughness:.8}),c=new N(o,a);c.position.set(e,3.2,t);const l=new Ce;l.add(s),l.add(c),this.sceneryGroup.add(l)}createVehicleModel(e,t=!1,n=!1){const i=new Ce;if(t){const u=new ie(2.4,2.6,3.2),f=new te({color:e,metalness:.3,roughness:.4}),m=new N(u,f);m.position.set(0,1.5,2.4),m.castShadow=!0,i.add(m);const _=new ie(2.5,3.2,6.5),g=new te({color:14870768,metalness:.2,roughness:.5}),p=new N(_,g);p.position.set(0,1.8,-2.4),p.castShadow=!0,i.add(p)}else{const u=new ie(1.9,.65,4.4),f=new te({color:e,metalness:n?.75:.4,roughness:n?.25:.45,clearcoat:n?1:0,clearcoatRoughness:.1}),m=new N(u,f);m.position.set(0,.55,0),m.castShadow=!0,i.add(m);const _=new ie(1.65,.55,2.3),g=new te({color:329745,roughness:.1,metalness:.9,transparent:!0,opacity:.85}),p=new N(_,g);p.position.set(0,1.05,-.2),i.add(p);const x=new ie(.35,.12,.05),S=new te({color:16777215,emissive:16707722,emissiveIntensity:1.5}),M=new N(x,S);M.position.set(-.65,.55,2.2);const T=new N(x,S);T.position.set(.65,.55,2.2),i.add(M),i.add(T);const E=new ie(.35,.12,.05),R=new te({color:8330525,emissive:15680580,emissiveIntensity:.8}),D=new N(E,R.clone());D.position.set(-.65,.55,-2.2);const y=new N(E,R.clone());y.position.set(.65,.55,-2.2),i.add(D),i.add(y),i.userData.taillights=[D,y]}const s=new Ee(.34,.34,.24,16);s.rotateZ(Math.PI/2);const o=new te({color:988970,roughness:.9}),a=[[-.95,.34,1.4],[.95,.34,1.4],[-.95,.34,-1.4],[.95,.34,-1.4]],c=[];a.forEach(u=>{const f=new N(s,o);f.position.set(u[0],u[1],u[2]),f.castShadow=!0,i.add(f),c.push(f)}),i.userData.wheels=c;const l=new jn(2.3,4.8),h=new gt({color:0,transparent:!0,opacity:.45}),d=new N(l,h);return d.rotation.x=-Math.PI/2,d.position.y=.02,i.add(d),i}buildEgoVehicle(){const e=this.createVehicleModel(65437,!1,!0);this.egoVehicleGroup.add(e),this.egoWheels=e.userData.wheels||[],this.egoTaillightMeshes=e.userData.taillights||[];const t=new bi(16777215,2.5,45,Math.PI/6,.3);t.position.set(-.6,.6,2.2),t.target.position.set(-.6,0,30);const n=new bi(16777215,2.5,45,Math.PI/6,.3);n.position.set(.6,.6,2.2),n.target.position.set(.6,0,30),this.egoVehicleGroup.add(t),this.egoVehicleGroup.add(t.target),this.egoVehicleGroup.add(n),this.egoVehicleGroup.add(n.target),this.egoHeadlights=[t,n]}buildGhostVehicle(){this.ghostCarMesh=this.createVehicleModel(61695,!1,!1),this.ghostCarMesh.traverse(e=>{e instanceof N&&(e.material=new gt({color:61695,wireframe:!0,transparent:!0,opacity:.35}))}),this.ghostCarMesh.visible=!1,this.scene.add(this.ghostCarMesh)}buildTrajectoryRibbons(){const e=new lt,t=new si({color:65437,linewidth:3,transparent:!0,opacity:.95});this.bestTrajectoryLine=new Sn(e,t),this.bestTrajectoryLine.frustumCulled=!1,this.scene.add(this.bestTrajectoryLine);for(let n=0;n<16;n++){const i=new lt,s=new si({color:61695,transparent:!0,opacity:.25-n*.012}),o=new Sn(i,s);o.frustumCulled=!1,this.scene.add(o),this.altTrajectoryLines.push(o)}}update(e){var s,o,a,c,l,h,d,u,f;if(!e)return;!this.roadMesh&&((o=(s=e.world)==null?void 0:s.layout)!=null&&o.centerline)&&this.buildRoadFromCenterline(e.world.layout.centerline,e.world.layout.road_width||11.25);const t=e.entities||[],n=new Set,i=new Set;for(const m of t)if(m.id==="ego_car"||(a=m.extra)!=null&&a.is_ego){this.egoTargetPos.set(m.x,0,-m.y),this.egoTargetHeading=Et.degToRad(m.heading||0),this.egoSpeedMps=(((c=m.extra)==null?void 0:c.speed_kmh)||70)/3.6,this.egoSteerAngle=Et.degToRad(((l=m.extra)==null?void 0:l.steer_deg)||0);const _=!!((h=m.extra)!=null&&h.brake_lights);this.egoTaillightMeshes.forEach(g=>{g.material instanceof te&&(g.material.emissiveIntensity=_?2.5:.6)})}else if(m.kind==="person"){i.add(m.id);let _=this.pedestrians.get(m.id);if(!_){_=new Ce;const g=new N(new Zt(.3,12,12),new te({color:15485081}));g.position.y=1.4;const p=new N(new Ee(.2,.25,1.2,8),new te({color:3900150}));p.position.y=.6,_.add(g),_.add(p),this.scene.add(_),this.pedestrianMeshes.set(m.id,_)}_.position.set(m.x,0,-m.y)}else{n.add(m.id);let _=this.npcMeshes.get(m.id);if(!_){const x=(d=m.extra)!=null&&d.color?parseInt(m.extra.color.replace("#","0x")):3718648;_=this.createVehicleModel(x,m.kind==="truck",!1),this.scene.add(_),this.npcMeshes.set(m.id,_)}_.position.set(m.x,0,-m.y),_.rotation.y=Et.degToRad(m.heading||0);const g=_.userData.taillights||[],p=!!((u=m.extra)!=null&&u.brake_lights);g.forEach(x=>{x.material instanceof te&&(x.material.emissiveIntensity=p?2.5:.6)})}for(const[m,_]of this.npcMeshes.entries())n.has(m)||(this.scene.remove(_),this.npcMeshes.delete(m));if(this.mindViewEnabled&&e.plan){if(this.bestTrajectoryLine&&e.plan.best&&e.plan.best.length>1){const _=e.plan.best.map(g=>new I(g[0],.12,-g[1]));if(this.bestTrajectoryLine.geometry.dispose(),this.bestTrajectoryLine.geometry=new lt().setFromPoints(_),this.bestTrajectoryLine.visible=!0,this.ghostCarMesh&&_.length>0){const g=_[_.length-1],p=_[Math.max(0,_.length-2)];this.ghostCarMesh.position.copy(g),this.ghostCarMesh.position.y=0,this.ghostCarMesh.rotation.y=Math.atan2(g.x-p.x,-(g.z-p.z)),this.ghostCarMesh.visible=!0}}const m=e.plan.alts||[];this.altTrajectoryLines.forEach((_,g)=>{if(g<m.length&&m[g].path&&m[g].path.length>1){const p=m[g].path.map(x=>new I(x[0],.06,-x[1]));_.geometry.dispose(),_.geometry=new lt().setFromPoints(p),_.visible=!0}else _.visible=!1})}else this.bestTrajectoryLine&&(this.bestTrajectoryLine.visible=!1),this.altTrajectoryLines.forEach(m=>m.visible=!1),this.ghostCarMesh&&(this.ghostCarMesh.visible=!1);e.events&&(e.events.includes("bonk")||((f=e.metrics)==null?void 0:f.collisions)>0)&&(this.screenShakeIntensity=.85,this.onCollision&&this.onCollision())}setCameraMode(e){this.cameraMode=e,this.controls&&(this.controls.enabled=e==="orbit")}setTimeOfDay(e){this.timeOfDay=e,e==="day"?(this.scene.background=new Oe(990256),this.scene.fog=new yi(990256,.0035),this.sunLight.color.setHex(16775917),this.sunLight.intensity=2.4,this.ambientLight.intensity=.85,this.egoHeadlights.forEach(t=>t.intensity=0)):e==="sunset"?(this.scene.background=new Oe(2626070),this.scene.fog=new yi(2626070,.0045),this.sunLight.color.setHex(16347926),this.sunLight.intensity=1.8,this.ambientLight.intensity=.6,this.egoHeadlights.forEach(t=>t.intensity=1.2)):e==="night"&&(this.scene.background=new Oe(132631),this.scene.fog=new yi(132631,.008),this.sunLight.color.setHex(1976635),this.sunLight.intensity=.2,this.ambientLight.intensity=.25,this.egoHeadlights.forEach(t=>t.intensity=3.5))}setMindView(e){this.mindViewEnabled=e}updateCamera(){const e=this.egoVehicleGroup.position,t=this.egoVehicleGroup.rotation.y;if(this.cameraMode==="chase"){const s=e.x-Math.sin(t)*14,o=e.z-Math.cos(t)*14;this.camera.position.lerp(new I(s,4.8,o),.12);const a=new I(e.x+Math.sin(t)*12,e.y+1.2,e.z+Math.cos(t)*12);this.camera.lookAt(a),this.targetFov=58+Math.min(18,this.egoSpeedMps/30*18)}else if(this.cameraMode==="cockpit"){const n=e.x+Math.sin(t)*.4,i=e.z+Math.cos(t)*.4;this.camera.position.set(n,1.15,i);const s=new I(e.x+Math.sin(t)*30,1.15,e.z+Math.cos(t)*30);this.camera.lookAt(s),this.targetFov=72}else if(this.cameraMode==="topdown")this.camera.position.lerp(new I(e.x,60,e.z),.1),this.camera.lookAt(e),this.targetFov=50;else if(this.cameraMode==="cinematic"){const n=e.x+8,i=e.z+16;this.camera.position.lerp(new I(n,1.6,i),.05),this.camera.lookAt(e),this.targetFov=45}Math.abs(this.camera.fov-this.targetFov)>.1&&(this.camera.fov+=(this.targetFov-this.camera.fov)*.08,this.camera.updateProjectionMatrix()),this.screenShakeIntensity>.01&&(this.camera.position.x+=(Math.random()-.5)*this.screenShakeIntensity*.4,this.camera.position.y+=(Math.random()-.5)*this.screenShakeIntensity*.4,this.screenShakeIntensity*=.9)}animate(){this.animFrameId=requestAnimationFrame(this.animate);const e=performance.now(),t=Math.min((e-this.lastRenderTime)/1e3,.1);this.lastRenderTime=e,this.frameCount++,e-this.fpsTimer>=1e3&&(this.fpsCounter=this.frameCount,this.frameCount=0,this.fpsTimer=e,this.onFpsUpdate&&this.onFpsUpdate(this.fpsCounter)),this.egoVehicleGroup.position.lerp(this.egoTargetPos,.25);let n=this.egoTargetHeading-this.egoVehicleGroup.rotation.y;for(;n>Math.PI;)n-=2*Math.PI;for(;n<-Math.PI;)n+=2*Math.PI;this.egoVehicleGroup.rotation.y+=n*.22,this.egoWheelSpin+=this.egoSpeedMps/.34*t,this.egoWheels.forEach((i,s)=>{i.rotation.x=this.egoWheelSpin,(s===0||s===1)&&(i.rotation.y=this.egoSteerAngle)}),this.updateCamera(),this.controls&&this.controls.enabled&&this.controls.update(),this.renderer&&this.renderer.render(this.scene,this.camera)}setupEventListeners(){const e=()=>{if(!this.renderer)return;const t=this.container.clientWidth,n=this.container.clientHeight;this.camera.aspect=t/Math.max(1,n),this.camera.updateProjectionMatrix(),this.renderer.setSize(t,n)};window.addEventListener("resize",e)}dispose(){this.animFrameId!==null&&cancelAnimationFrame(this.animFrameId),this.renderer&&(this.renderer.dispose(),this.container.contains(this.renderer.domElement)&&this.container.removeChild(this.renderer.domElement),this.renderer=null)}}class U_{constructor(e){U(this,"canvas");U(this,"ctx");U(this,"showHitboxes",!1);U(this,"showMindView",!1);this.canvas=document.createElement("canvas"),this.canvas.width=900,this.canvas.height=600,this.canvas.style.width="100%",this.canvas.style.height="100%",this.canvas.style.objectFit="contain",this.canvas.style.backgroundColor="#0e1420",e.appendChild(this.canvas),this.ctx=this.canvas.getContext("2d")}render(e){if(!e||!this.ctx)return;const t=this.ctx,n=this.canvas.width,i=this.canvas.height;t.fillStyle=this.showMindView?"#060910":"#121824",t.fillRect(0,0,n,i),t.strokeStyle=this.showMindView?"rgba(0, 229, 255, 0.12)":"rgba(35, 48, 70, 0.4)",t.lineWidth=1;for(let s=0;s<n;s+=45)t.beginPath(),t.moveTo(s,0),t.lineTo(s,i),t.stroke();for(let s=0;s<i;s+=45)t.beginPath(),t.moveTo(0,s),t.lineTo(n,s),t.stroke();if(t.strokeStyle="rgba(70, 95, 135, 0.6)",t.lineWidth=4,t.strokeRect(2,2,n-4,i-4),e.goal){const s=e.goal.x,o=e.goal.y,a=e.goal.r||20;t.fillStyle="rgba(0, 255, 157, 0.25)",t.beginPath(),t.arc(s,o,a,0,Math.PI*2),t.fill(),t.strokeStyle="#00ff9d",t.lineWidth=2,t.beginPath(),t.arc(s,o,a,0,Math.PI*2),t.stroke(),t.fillStyle="#00ff9d",t.font="bold 11px Inter, sans-serif",t.fillText("GOAL",s-14,o+4)}if(e.plan&&(e.plan.alts&&e.plan.alts.length>0&&e.plan.alts.forEach(s=>{if(!(!s.path||s.path.length<2)){t.strokeStyle=s.score<-5?"rgba(255, 75, 75, 0.25)":"rgba(0, 229, 255, 0.22)",t.lineWidth=1.5,t.beginPath(),t.moveTo(s.path[0][0],s.path[0][1]);for(let o=1;o<s.path.length;o++)t.lineTo(s.path[o][0],s.path[o][1]);t.stroke()}}),e.plan.best&&e.plan.best.length>=2)){t.strokeStyle="#00ff9d",t.lineWidth=this.showMindView?4.5:3.5,t.beginPath(),t.moveTo(e.plan.best[0][0],e.plan.best[0][1]);for(let s=1;s<e.plan.best.length;s++)t.lineTo(e.plan.best[s][0],e.plan.best[s][1]);t.stroke();for(let s=3;s<e.plan.best.length;s+=3){const o=e.plan.best[s];t.fillStyle="rgba(0, 229, 255, 0.35)",t.beginPath(),t.arc(o[0],o[1],10,0,Math.PI*2),t.fill()}}e.entities&&e.entities.forEach(s=>{var o,a;if(s.kind==="robot"){t.fillStyle=((o=s.extra)==null?void 0:o.status_led)==="red"?"#ff4444":"#00d4ff",t.beginPath(),t.arc(s.x,s.y,s.r||18,0,Math.PI*2),t.fill(),t.strokeStyle="#ffffff",t.lineWidth=2,t.beginPath(),t.arc(s.x,s.y,s.r||18,0,Math.PI*2),t.stroke();const c=(s.heading||0)*(Math.PI/180);t.strokeStyle="#ffffff",t.lineWidth=3,t.beginPath(),t.moveTo(s.x,s.y),t.lineTo(s.x+Math.sin(c)*22,s.y-Math.cos(c)*22),t.stroke()}else if(s.kind==="person")t.fillStyle="#ffaa00",t.beginPath(),t.arc(s.x,s.y,s.r||22.5,0,Math.PI*2),t.fill(),t.strokeStyle="#ffffff",t.lineWidth=2,t.stroke();else if(s.kind==="machine"){const c=s.w||70,l=s.h||70,h=((a=s.extra)==null?void 0:a.status)||"nominal";t.fillStyle=h==="jammed"?"rgba(239, 68, 68, 0.85)":h==="maintenance"?"rgba(245, 158, 11, 0.85)":"rgba(59, 130, 246, 0.85)",t.fillRect(s.x-c/2,s.y-l/2,c,l),t.strokeStyle="#ffffff",t.lineWidth=2,t.strokeRect(s.x-c/2,s.y-l/2,c,l),t.fillStyle="#ffffff",t.font="bold 10px Inter, sans-serif",t.fillText(h.toUpperCase(),s.x-c/2+6,s.y)}else if(s.kind==="conveyor")t.fillStyle="rgba(45, 55, 72, 0.9)",t.fillRect(s.x-(s.w||100)/2,s.y-(s.h||30)/2,s.w||100,s.h||30),t.strokeStyle="rgba(160, 174, 192, 0.6)",t.lineWidth=2,t.strokeRect(s.x-(s.w||100)/2,s.y-(s.h||30)/2,s.w||100,s.h||30);else if(s.kind==="item")t.fillStyle="#38bdf8",t.fillRect(s.x-8,s.y-8,16,16);else if(s.kind==="car")t.fillStyle="#3b82f6",t.fillRect(s.x-20,s.y-35,40,70),t.strokeStyle="#ffffff",t.lineWidth=2,t.strokeRect(s.x-20,s.y-35,40,70);else{const c=s.w||60,l=s.h||60;t.fillStyle="rgba(180, 100, 60, 0.85)",t.fillRect(s.x,s.y,c,l),t.strokeStyle="rgba(255, 180, 120, 0.9)",t.lineWidth=2,t.strokeRect(s.x,s.y,c,l)}this.showHitboxes&&(t.strokeStyle="#00ffff",t.lineWidth=1,s.r?(t.beginPath(),t.arc(s.x,s.y,s.r,0,Math.PI*2),t.stroke()):s.w&&s.h&&t.strokeRect(s.x,s.y,s.w,s.h))}),t.fillStyle="rgba(255, 255, 255, 0.4)",t.font="12px JetBrains Mono, monospace",t.fillText("2D Canvas Fallback Renderer",16,i-16)}destroy(){this.canvas&&this.canvas.parentNode&&this.canvas.parentNode.removeChild(this.canvas)}}class F_{constructor(e){U(this,"ws",null);U(this,"scenario");U(this,"reconnectAttempts",0);U(this,"maxReconnects",2);U(this,"isConnected",!1);U(this,"shouldReconnect",!0);U(this,"onFrame",null);U(this,"onStatusChange",null);U(this,"onFallback",null);this.scenario=e}connect(){this.shouldReconnect=!0,this.onStatusChange&&this.onStatusChange("connecting");const e=window.location.protocol==="https:"?"wss:":"ws:",t=window.location.host||"127.0.0.1:8000",n=`${e}//${t}/ws/${this.scenario}`;try{this.ws=new WebSocket(n)}catch{this.handleConnectionFailure();return}this.ws.onopen=()=>{this.isConnected=!0,this.reconnectAttempts=0,this.onStatusChange&&this.onStatusChange("connected")},this.ws.onmessage=i=>{try{const s=JSON.parse(i.data);this.onFrame&&this.onFrame(s)}catch(s){console.warn("WS packet parse error:",s)}},this.ws.onerror=()=>{},this.ws.onclose=()=>{this.isConnected=!1,this.shouldReconnect&&this.reconnectAttempts<this.maxReconnects?(this.reconnectAttempts++,setTimeout(()=>this.connect(),1e3*this.reconnectAttempts)):this.handleConnectionFailure()}}handleConnectionFailure(){this.isConnected=!1,this.onStatusChange&&this.onStatusChange("fallback_replay"),this.onFallback&&this.onFallback()}sendCommand(e){this.ws&&this.ws.readyState===WebSocket.OPEN&&this.ws.send(JSON.stringify(e))}disconnect(){this.shouldReconnect=!1,this.ws&&(this.ws.close(),this.ws=null),this.isConnected=!1}}class O_{constructor(){U(this,"frames",[]);U(this,"frameIndex",0);U(this,"isLoaded",!1);U(this,"isPlaying",!0);U(this,"timer",null);U(this,"onFrame",null);U(this,"onLoaded",null);U(this,"onError",null)}async load(e,t,n="wm"){this.stop();const s=`${e}_s${t}_${n==="baseline"?"baseline":"wm"}.json`,o=[`./replays/${s}`,`/replays/${s}`,`web/replays/${s}`];let a=null;for(const c of o)try{const l=await fetch(c);if(l.ok){a=await l.json();break}}catch{continue}return!a||!a.frames||a.frames.length===0?(this.onError&&this.onError(new Error(`Failed to load replay: ${s}`)),!1):(this.frames=a.frames,this.frameIndex=0,this.isLoaded=!0,this.onLoaded&&this.onLoaded(a),this.play(),!0)}play(e=1){this.isPlaying=!0,this.timer&&clearInterval(this.timer);const t=Math.max(10,Math.round(1e3/30/e));this.timer=setInterval(()=>this.step(),t)}pause(){this.isPlaying=!1,this.timer&&(clearInterval(this.timer),this.timer=null)}step(){if(!this.isLoaded||this.frames.length===0)return;const e=this.frames[this.frameIndex];this.onFrame&&this.onFrame(e),this.frameIndex=(this.frameIndex+1)%this.frames.length}stop(){this.pause(),this.frameIndex=0}getCurrentFrame(){return this.frames[this.frameIndex]||null}}class B_{constructor(){U(this,"ctx",null);U(this,"masterGain",null);U(this,"analyser",null);U(this,"dataArray",null);U(this,"isMuted",!1);U(this,"volume",.65);U(this,"motorOsc",null);U(this,"motorSubOsc",null);U(this,"motorGain",null);U(this,"motorFilter",null);U(this,"isMoving",!1);U(this,"lastMoveTime",0)}initContext(){if(!this.ctx&&typeof window<"u"){const e=window.AudioContext||window.webkitAudioContext;e&&(this.ctx=new e,this.masterGain=this.ctx.createGain(),this.masterGain.gain.setValueAtTime(this.volume,this.ctx.currentTime),this.analyser=this.ctx.createAnalyser(),this.analyser.fftSize=64,this.analyser.smoothingTimeConstant=.85,this.dataArray=new Uint8Array(this.analyser.frequencyBinCount),this.masterGain.connect(this.analyser),this.analyser.connect(this.ctx.destination))}this.ctx&&this.ctx.state==="suspended"&&this.ctx.resume().catch(()=>{})}unlock(){this.initContext()}setVolume(e){this.volume=Math.max(0,Math.min(1,e)),this.masterGain&&this.ctx&&this.masterGain.gain.setValueAtTime(this.isMuted?0:this.volume,this.ctx.currentTime)}toggleMute(){return this.isMuted=!this.isMuted,this.masterGain&&this.ctx&&this.masterGain.gain.setValueAtTime(this.isMuted?0:this.volume,this.ctx.currentTime),this.isMuted}playMove(){if(this.isMuted||!this.ctx||this.ctx.state!=="running"||!this.masterGain)return;const e=performance.now();if(!(e-this.lastMoveTime<130)){this.lastMoveTime=e;try{const t=this.ctx.currentTime,n=.22,i=this.ctx.createBiquadFilter();i.type="lowpass",i.frequency.setValueAtTime(190,t),i.Q.setValueAtTime(.7,t);const s=this.ctx.createOscillator(),o=this.ctx.createGain();s.type="sine",s.frequency.setValueAtTime(72,t),s.frequency.linearRampToValueAtTime(94,t+n*.45),s.frequency.linearRampToValueAtTime(68,t+n),o.gain.setValueAtTime(1e-4,t),o.gain.linearRampToValueAtTime(.018,t+.05),o.gain.exponentialRampToValueAtTime(1e-4,t+n);const a=this.ctx.createOscillator(),c=this.ctx.createGain();a.type="sine",a.frequency.setValueAtTime(42,t),c.gain.setValueAtTime(1e-4,t),c.gain.linearRampToValueAtTime(.014,t+.05),c.gain.exponentialRampToValueAtTime(1e-4,t+n),s.connect(o),a.connect(c),o.connect(i),c.connect(i),i.connect(this.masterGain),s.start(t),a.start(t),s.stop(t+n),a.stop(t+n)}catch{}}}playGoal(){}playBonk(){}playClick(){}playToolSelect(){}speak(e){}renderOscilloscope(e){if(!this.analyser||!this.dataArray){const s=e.getContext("2d");if(!s)return;s.clearRect(0,0,e.width,e.height),s.strokeStyle="rgba(0, 240, 255, 0.2)",s.lineWidth=1.5,s.beginPath(),s.moveTo(0,e.height/2),s.lineTo(e.width,e.height/2),s.stroke();return}const t=e.getContext("2d");if(!t)return;this.analyser.getByteTimeDomainData(this.dataArray),t.clearRect(0,0,e.width,e.height),t.lineWidth=1.8,t.strokeStyle=this.isMuted?"rgba(100, 116, 139, 0.4)":"#00f0ff",t.beginPath();const n=e.width/this.dataArray.length;let i=0;for(let s=0;s<this.dataArray.length;s++){const a=this.dataArray[s]/128*e.height/2;s===0?t.moveTo(i,a):t.lineTo(i,a),i+=n}t.lineTo(e.width,e.height/2),t.stroke()}}const it=new B_;function k_(r,e){let t=!1,n=1,i=1001,s=!1;const o=Date.now();let a=()=>{},c=null,l=!1;const d={robotics:"AUTONOMOUS WAREHOUSE ROBOTICS",driving:"AUTONOMOUS HIGHWAY DRIVING",factory:"FACTORY-LINE DIGITAL TWIN"}[e]||"WORLD MODEL MISSION CONTROL";r.innerHTML=`
    <div class="sim-viewport-layout">
      <!-- 3D Canvas / Viewports Container -->
      <div id="sim-canvas-root" class="canvas-container" style="position: relative; width: 100%; height: 100%; overflow: hidden;"></div>

      <!-- Advanced Cyberpunk / Military Robot POV Visor HUD -->
      <div id="pov-sensor-overlay" style="display: none; position: absolute; inset: 0; pointer-events: none; z-index: 10;">
        <!-- Visor Border Brackets & Scanlines -->
        <div style="position: absolute; inset: 12px; border: 2px solid rgba(0, 240, 255, 0.35); box-shadow: inset 0 0 120px rgba(0, 0, 0, 0.9);">
          <!-- Top Compass Ribbon -->
          <div style="position: absolute; top: 16px; left: 50%; transform: translateX(-50%); width: 340px; height: 28px; background: rgba(5, 10, 20, 0.85); border: 1px solid rgba(0, 240, 255, 0.4); border-radius: 4px; display: flex; align-items: center; justify-content: space-around; font-family: var(--font-mono); font-size: 0.72rem; color: #00f0ff; letter-spacing: 2px;">
            <span>W</span><span>|</span><span style="color: #00ff9d; font-weight: 700;" id="pov-heading-val">N 000°</span><span>|</span><span>E</span>
          </div>

          <!-- Artificial Horizon Center Crosshair -->
          <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 90px; height: 90px; pointer-events: none;">
            <div style="position: absolute; top: 50%; left: 0; width: 26px; height: 2px; background: #00f0ff;"></div>
            <div style="position: absolute; top: 50%; right: 0; width: 26px; height: 2px; background: #00f0ff;"></div>
            <div style="position: absolute; top: 0; left: 50%; width: 2px; height: 26px; background: #00f0ff;"></div>
            <div style="position: absolute; bottom: 0; left: 50%; width: 2px; height: 26px; background: #00f0ff;"></div>
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 6px; height: 6px; border-radius: 50%; background: #00ff9d; box-shadow: 0 0 8px #00ff9d;"></div>
          </div>

          <!-- Left Flight Telemetry Data Box -->
          <div style="position: absolute; left: 32px; top: 40%; transform: translateY(-50%); font-family: var(--font-mono); font-size: 0.75rem; color: #00f0ff; display: flex; flex-direction: column; gap: 6px; background: rgba(5, 10, 20, 0.75); padding: 8px 12px; border-left: 3px solid #00f0ff; border-radius: 2px;">
            <div style="color: #64748b; font-size: 0.65rem;">TELEMETRY</div>
            <div>SPD: <span id="pov-speed" style="color: #00ff9d; font-weight: 700;">0.45 m/s</span></div>
            <div>STATUS: <span style="color: #00ff9d; font-weight: 700;">NOMINAL</span></div>
            <div>LIDAR: <span style="color: #38bdf8;">ACTIVE (360°)</span></div>
          </div>

          <!-- Right Goal Distance & Target Tracking Box -->
          <div style="position: absolute; right: 32px; top: 40%; transform: translateY(-50%); font-family: var(--font-mono); font-size: 0.75rem; color: #00f0ff; display: flex; flex-direction: column; gap: 6px; background: rgba(5, 10, 20, 0.75); padding: 8px 12px; border-right: 3px solid #ffb703; border-radius: 2px; text-align: right;">
            <div style="color: #64748b; font-size: 0.65rem;">TARGET TRACKING</div>
            <div>GOAL DIST: <span id="pov-target-dist" style="color: #ffb703; font-weight: 700;">- m</span></div>
            <div>HORIZON: <span style="color: #38bdf8;">14 STEPS</span></div>
            <div>LOCK: <span style="color: #00ff9d; font-weight: 700;">CONFIRMED</span></div>
          </div>
        </div>
      </div>

      ${e==="driving"?`
        <!-- AV Autonomous Driving Premium Glassmorphic HUD -->
        <div id="av-hud" class="av-dashboard-hud">
          <div class="av-speed-cluster">
            <div id="av-speed-val" class="av-speed-val">0</div>
            <div class="av-speed-unit">KM / H</div>
            <div class="av-speed-limit">100</div>
          </div>
          <div class="av-gauge-item">
            <div class="av-gauge-header"><span>LANE OFFSET</span><span id="av-offset-val">0.0 m</span></div>
            <div class="av-gauge-bar-bg">
              <div id="av-offset-fill" class="av-gauge-bar-fill" style="width: 50%; background: #00ff9d;"></div>
            </div>
          </div>
          <div class="av-gauge-item">
            <div class="av-gauge-header"><span>HEADWAY TTC</span><span id="av-ttc-val">10.0 s</span></div>
            <div class="av-gauge-bar-bg">
              <div id="av-ttc-fill" class="av-gauge-bar-fill" style="width: 100%; background: #00ff9d;"></div>
            </div>
          </div>
          <div style="display: flex; flex-direction: column; gap: 4px; align-items: center; min-width: 90px;">
            <div style="font-size: 0.65rem; color: var(--text-dim); font-weight: 700;">ACTION</div>
            <div id="av-action-chip" class="av-action-chip cruise">CRUISE</div>
          </div>
          <div style="display: flex; flex-direction: column; gap: 4px; border-left: 1px solid rgba(255,255,255,0.12); padding-left: 14px;">
            <div style="font-size: 0.65rem; color: var(--text-dim); font-weight: 700;">MODEL MAE</div>
            <div id="av-mae-val" style="color: var(--accent-cyan); font-weight: 800; font-size: 0.95rem;">0.019</div>
          </div>
        </div>

        <!-- Radar Mini-map -->
        <div id="av-minimap-box" class="av-minimap-box">
          <div style="font-size: 0.60rem; color: var(--text-dim); font-weight: 800; margin-bottom: 2px;">RADAR MAP</div>
          <canvas id="av-minimap-canvas" width="128" height="110" style="display: block; width: 100%; height: 100%; border-radius: 4px; background: #020617;"></canvas>
        </div>

        <!-- Toast Notifications -->
        <div id="av-toast-box" class="av-toast-box"></div>
      `:`
        <!-- Floating Docking Bay HUD Banner -->
        <div id="dock-hud-banner" style="position: absolute; bottom: 22px; left: 50%; transform: translateX(-50%); background: rgba(5, 10, 25, 0.92); border: 1px solid #00ff9d; border-radius: 6px; padding: 8px 18px; display: flex; align-items: center; gap: 12px; font-family: var(--font-mono); font-size: 0.78rem; pointer-events: none; z-index: 15; box-shadow: 0 0 24px rgba(0, 255, 157, 0.35);">
          <span id="dock-hud-dot" style="width: 10px; height: 10px; border-radius: 50%; background: #00ff9d; box-shadow: 0 0 10px #00ff9d; display: inline-block;"></span>
          <span id="dock-hud-text" style="color: #f8fafc; font-weight: 700;">ROBOT ACTIVE — EXECUTING TRAJECTORY — [SPACE] TO HOLD</span>
        </div>
      `}

      <!-- Top Mission Control Navigation Header -->
      <header class="top-nav">
        <div style="display: flex; align-items: center; gap: 14px;">
          <a href="#/" class="glass-pill" style="padding: 4px 10px; font-weight: 700; color: var(--accent-cyan);">
            <span>&larr; CATALOG</span>
          </a>
          <div style="display: flex; align-items: center; gap: 8px;">
            <div class="nav-logo-icon">WM</div>
            <span style="font-weight: 800; font-size: 0.95rem; letter-spacing: 0.05em; font-family: var(--font-mono);">${d}</span>
          </div>
          <span id="badge-connection" class="badge badge-live">● LIVE FEED</span>
        </div>

        <div style="display: flex; align-items: center; gap: 12px;">
          <!-- Mission Elapsed Clock -->
          <div class="glass-pill" style="padding: 3px 8px; color: var(--text-dim);">
            <span>MISSION:</span>
            <span id="mission-clock" style="color: var(--accent-cyan); font-weight: 700;">T+00:00:00</span>
          </div>

          <!-- Live Audio Oscilloscope Canvas -->
          <div class="glass-pill" style="padding: 2px 6px; display: flex; align-items: center; gap: 6px;" title="Live Audio Waveform Oscilloscope">
            <span style="font-size: 0.68rem; color: var(--text-dim);">AUDIO:</span>
            <canvas id="audio-visualizer-canvas" width="80" height="18" style="display: block;"></canvas>
          </div>

          <!-- Speed selector -->
          <div class="glass-pill" style="padding: 3px 8px;">
            <span style="font-size: 0.70rem; color: var(--text-dim);">SPEED:</span>
            <select id="select-speed" style="background: transparent; border: none; color: var(--accent-cyan); font-family: var(--font-mono); font-size: 0.78rem; cursor: pointer;">
              <option value="0.5" style="background: #090f1d;">0.5x</option>
              <option value="1.0" selected style="background: #090f1d;">1.0x</option>
              <option value="2.0" style="background: #090f1d;">2.0x</option>
              <option value="4.0" style="background: #090f1d;">4.0x</option>
            </select>
          </div>

          <!-- High-Res Screenshot Tool -->
          <button id="btn-snapshot" class="glass-pill" title="Capture High-Res Viewport PNG (Screen Snap)" style="color: #38bdf8;">
            <span>📸 SNAP</span>
          </button>

          <!-- Fullscreen Toggle -->
          <button id="btn-fullscreen" class="glass-pill" title="Toggle Fullscreen" style="color: var(--text-main);">
            <span>⛶ FULL</span>
          </button>

          <!-- Live FPS Gauge -->
          <span id="fps-display" class="glass-pill" style="font-size: 0.78rem; color: var(--accent-green); font-weight: 700;">
            60.0 FPS
          </span>

          <button id="btn-help" class="glass-pill" title="Keyboard Guide (H)">
            <span>HELP [H]</span>
          </button>
        </div>
      </header>

      <!-- Left Heavy Tactical Control Rail -->
      <aside class="glass-panel control-rail">
        <div class="rail-group-title">Robot Docking Bay</div>
        <button id="btn-dock-launch" class="rail-btn active" style="justify-content: center; background: rgba(0, 255, 157, 0.22); border: 2px solid #00ff9d; box-shadow: 0 0 18px rgba(0, 255, 157, 0.5); font-weight: 800; font-size: 0.82rem; padding: 10px 8px; margin-bottom: 6px;" title="Press SPACE or ENTER to hold/launch robot">
          <span id="lbl-dock-launch" style="color: #00ff9d; letter-spacing: 0.5px;">⏸️ HOLD / PAUSE [SPACE]</span>
        </button>

        <div class="rail-group-title">Tactical Strategy</div>
        <button id="btn-mode-wm" class="rail-btn active" title="Model Predictive Control with Deep Neural World Model">
          <span>Neural World Model</span>
          <span style="font-size: 0.70rem; color: var(--accent-cyan);">[TAB]</span>
        </button>
        <button id="btn-mode-base" class="rail-btn" title="Reactive Greedy Agent without planning (repeatedly crashes into traps)">
          <span>Reactive Greedy</span>
          <span style="font-size: 0.70rem; color: var(--text-dim);">[T]</span>
        </button>
        <button id="btn-mode-compare" class="rail-btn" title="Side-by-side synchronized evaluation: Reactive vs World Model">
          <span>Dual Split Compare</span>
          <span style="font-size: 0.70rem; color: var(--accent-green);">[S]</span>
        </button>

        ${e==="driving"?`
          <div class="rail-group-title" style="margin-top: 4px;">Highway Scenarios</div>
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <button id="btn-ds1" class="rail-btn active" style="font-size: 0.73rem;">S1: Highway Curves</button>
            <button id="btn-ds2" class="rail-btn " style="font-size: 0.73rem;">S2: Sudden Braking</button>
            <button id="btn-ds3" class="rail-btn " style="font-size: 0.73rem;">S3: Overtaking</button>
            <button id="btn-ds4" class="rail-btn " style="font-size: 0.73rem;">S4: Pedestrian Hazard</button>
          </div>

          <div class="rail-group-title" style="margin-top: 4px;">Camera Perspectives</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
            <button id="cam-chase" class="rail-btn active" style="justify-content: center; font-size: 0.72rem;">1: Chase</button>
            <button id="cam-pov" class="rail-btn" style="justify-content: center; font-size: 0.72rem; color: #38bdf8;">2: Cockpit</button>
            <button id="cam-topdown" class="rail-btn" style="justify-content: center; font-size: 0.72rem;">3: Top-Down</button>
            <button id="cam-orbit" class="rail-btn" style="justify-content: center; font-size: 0.72rem;">4: Orbit</button>
            <button id="cam-cinematic" class="rail-btn" style="justify-content: center; font-size: 0.72rem; color: #c084fc;">5: Fly-By</button>
          </div>

          <div class="rail-group-title" style="margin-top: 4px;">Time of Day & Atmosphere</div>
          <div style="display: flex; gap: 4px;">
            <button id="btn-tod-day" class="rail-btn active" style="flex: 1; justify-content: center; font-size: 0.70rem;">☀️ Day</button>
            <button id="btn-tod-sunset" class="rail-btn" style="flex: 1; justify-content: center; font-size: 0.70rem;">🌅 Sunset</button>
            <button id="btn-tod-night" class="rail-btn" style="flex: 1; justify-content: center; font-size: 0.70rem;">🌙 Night</button>
          </div>

          <button id="btn-manual-drive" class="rail-btn" style="margin-top: 6px; justify-content: center; background: rgba(56, 189, 248, 0.15); border: 1px solid #38bdf8; color: #38bdf8; font-weight: 700; font-size: 0.75rem;">
            <span id="lbl-manual-drive">🎮 MANUAL DRIVE [WASD]</span>
          </button>
        `:`
          ${e==="robotics"?`
            <div class="rail-group-title" style="margin-top: 4px;">Scenario Arena</div>
            <div style="display: flex; gap: 4px;">
              <button id="btn-s1" class="rail-btn active" style="flex: 1; justify-content: center; font-size: 0.75rem;">S1: Chair</button>
              <button id="btn-s2" class="rail-btn" style="flex: 1; justify-content: center; font-size: 0.75rem;">S2: Person</button>
            </div>
          `:""}

          <div class="rail-group-title" style="margin-top: 4px;">Camera & Perspective</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
            <button id="cam-overview" class="rail-btn active" style="justify-content: center; font-size: 0.72rem;">Overview</button>
            <button id="cam-chase" class="rail-btn" style="justify-content: center; font-size: 0.72rem;">Chase Cam</button>
            <button id="cam-pov" class="rail-btn" style="justify-content: center; font-size: 0.72rem; color: #38bdf8;">Robot POV</button>
            <button id="cam-topdown" class="rail-btn" style="justify-content: center; font-size: 0.72rem;">Top-Down</button>
            <button id="cam-orbit" class="rail-btn" style="justify-content: center; font-size: 0.72rem;">Free Orbit</button>
            <button id="cam-cinematic" class="rail-btn" style="justify-content: center; font-size: 0.72rem; color: #c084fc;">Director</button>
          </div>

          <div class="rail-group-title" style="margin-top: 4px;">Interactive Sandbox Tools</div>
          <div style="font-size: 0.68rem; color: var(--text-dim);">Pick tool, then click arena floor:</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
            <button id="tool-goal" class="rail-btn active" style="justify-content: center; font-size: 0.74rem;" title="Move target docking beacon">
              <span>🎯 Goal Dock</span>
            </button>
            <button id="tool-crate" class="rail-btn" style="justify-content: center; font-size: 0.74rem;" title="Drop Wooden Shipping Crate">
              <span>📦 Crate</span>
            </button>
            <button id="tool-cabinet" class="rail-btn" style="justify-content: center; font-size: 0.74rem;" title="Drop Metal Tool Cabinet">
              <span>🧰 Cabinet</span>
            </button>
            <button id="tool-workstation" class="rail-btn" style="justify-content: center; font-size: 0.74rem;" title="Drop Workbench Desk">
              <span>🛠️ Table</span>
            </button>
            <button id="tool-barrels" class="rail-btn" style="justify-content: center; font-size: 0.74rem;" title="Drop 55-Gal Oil Drum Cluster">
              <span>🛢️ Barrels</span>
            </button>
            <button id="tool-barrier" class="rail-btn" style="justify-content: center; font-size: 0.74rem;" title="Drop Heavy Crash Barrier">
              <span>🚧 Barrier</span>
            </button>
          </div>
          <div style="display: flex; gap: 4px; margin-top: 2px;">
            <button id="btn-clear-obs" class="rail-btn" style="flex: 1; justify-content: center; color: #ff4757; border-color: rgba(255, 71, 87, 0.4); font-size: 0.70rem;" title="Clear all obstacles from arena">
              <span>✕ Clear All</span>
            </button>
            <button id="btn-random-obs" class="rail-btn" style="flex: 1; justify-content: center; font-size: 0.70rem;" title="Generate random obstacle course">
              <span>🎲 Randomize</span>
            </button>
          </div>
        `}

        <div class="rail-group-title" style="margin-top: 4px;">Acoustics & Audio</div>
        <div style="display: flex; gap: 4px;">
          <button id="btn-mute" class="rail-btn active" style="flex: 1; justify-content: center; font-size: 0.72rem;">
            <span id="lbl-sound">🔊 MOTOR GLIDE: ON</span>
          </button>
        </div>

        <button id="btn-reset" class="rail-btn" style="margin-top: 4px; justify-content: center; background: rgba(0, 240, 255, 0.08); border-color: rgba(0, 240, 255, 0.3); font-weight: 700;">
          <span>⚡ RESET LAYOUT [R]</span>
        </button>
      </aside>

      <!-- Right Neural Telemetry & Cortex Terminal -->
      <aside class="glass-panel brain-panel">
        <div class="brain-header">
          <div class="brain-title">
            <span style="width: 8px; height: 8px; border-radius: 50%; background: var(--accent-cyan); box-shadow: 0 0 8px var(--accent-cyan); display: inline-block;"></span>
            <span>NEURAL CORTEX DYNAMICS</span>
          </div>
          <span id="metric-latency" style="font-family: var(--font-mono); font-size: 0.76rem; color: var(--accent-green); font-weight: 700;">8.7 ms</span>
        </div>

        <!-- 4-Step Pipeline Strip -->
        <div class="pipeline-strip">
          <div class="pipeline-node active">
            <span class="node-label">Sensors</span>
            <span class="node-metric">16-Dim</span>
          </div>
          <div class="pipeline-node active">
            <span class="node-label">Imagine</span>
            <span class="node-metric" id="metric-plan-samples">300x14</span>
          </div>
          <div class="pipeline-node active">
            <span class="node-label">Planner</span>
            <span class="node-metric">Optimal</span>
          </div>
          <div class="pipeline-node active">
            <span class="node-label">Action</span>
            <span id="lbl-chosen-action" class="node-metric" style="color: var(--accent-green);">STAY</span>
          </div>
        </div>

        <!-- Real-Time Neural Network Synaptic Activity Visualizer -->
        <div class="cortex-container">
          <div class="cortex-header">
            <span>RESIDUAL MLP ACTIVATIONS</span>
            <span style="color: #64748b;">288,818 PARAMS</span>
          </div>
          <canvas id="neural-cortex-canvas" width="310" height="74" style="width: 100%; height: 74px; display: block;"></canvas>
        </div>

        <!-- Why This Move? Candidate Card -->
        <div class="why-card">
          <div class="why-title">Model Predictive Rollouts</div>
          <div id="candidates-container">
            <div style="color: var(--text-dim); font-size: 0.72rem;">Evaluating candidate trajectories...</div>
          </div>
          <div id="why-explanation" class="why-reason">
            Vectorized MPC simulating 300 imagined trajectories in parallel...
          </div>
        </div>

        <!-- Telemetry Gauges Cluster -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-family: var(--font-mono);">
          <div class="glass-panel" style="padding: 8px;">
            <div style="font-size: 0.65rem; color: var(--text-dim); font-weight: 700;">SUCCESS RATE</div>
            <div id="metric-winrate" style="font-size: 1.10rem; font-weight: 800; color: var(--accent-green);">- (n=0)</div>
          </div>
          <div class="glass-panel" style="padding: 8px;">
            <div style="font-size: 0.65rem; color: var(--text-dim); font-weight: 700;">COLLISIONS</div>
            <div id="metric-collisions" style="font-size: 1.10rem; font-weight: 800; color: var(--accent-orange);">0</div>
          </div>
          <div class="glass-panel" style="padding: 8px;">
            <div style="font-size: 0.65rem; color: var(--text-dim); font-weight: 700;">STEPS / MAX</div>
            <div id="metric-steps" style="font-size: 1.10rem; font-weight: 800; color: #ffffff;">0 / 200</div>
          </div>
          <div class="glass-panel" style="padding: 8px;">
            <div style="font-size: 0.65rem; color: var(--text-dim); font-weight: 700;">GOAL DISTANCE</div>
            <div id="metric-goal-dist" style="font-size: 1.10rem; font-weight: 800; color: var(--accent-cyan);">- m</div>
          </div>
        </div>

        <!-- Real-Time Distance Sparkline -->
        <div class="glass-panel" style="padding: 6px 10px;">
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.65rem; color: var(--text-dim); margin-bottom: 2px;">
            <span style="font-weight: 700; letter-spacing: 0.5px;">DISTANCE TO DOCK BEACON</span>
            <span id="sparkline-dist-val" style="color: var(--accent-cyan); font-family: var(--font-mono); font-weight: 700;">- m</span>
          </div>
          <svg id="sparkline-dist" viewBox="0 0 200 28" style="width: 100%; height: 28px; display: block; overflow: visible;">
            <path id="sparkline-dist-path" fill="none" stroke="#00f0ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M 0 14 L 200 14" />
          </svg>
        </div>
      </aside>

      <!-- Bottom Status Pill -->
      <div class="glass-pill bottom-pill">
        <span>[S] Split Compare | [TAB] Toggle WM | [C] Camera | [1/2] Scenarios | [R] Reset | [H] Help</span>
      </div>

      <!-- Help Modal (H key) -->
      <div id="help-modal" class="modal-overlay" style="display: none;">
        <div class="glass-panel modal-content">
          <div class="modal-header">
            <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--accent-cyan); font-family: var(--font-mono);">MISSION CONTROL SHORTCUT GUIDE</h3>
            <button id="btn-close-help" class="glass-pill">&times; CLOSE</button>
          </div>
          <div class="shortcut-grid">
            <span class="shortcut-key">ENTER / SPACE</span><span>Launch Robot from Docking Station / Hold</span>
            <span class="shortcut-key">TAB / T</span><span>Toggle World Model Predictive Control vs Reactive Baseline</span>
            <span class="shortcut-key">S</span><span>Toggle Dual Synchronized Split-Screen Comparison</span>
            <span class="shortcut-key">C</span><span>Cycle Camera (Overview &rarr; Chase &rarr; Visor POV &rarr; Top-Down &rarr; Orbit &rarr; Director)</span>
            <span class="shortcut-key">1 / 2</span><span>Switch Scenario 1 (Static Chair) / Scenario 2 (Dynamic Pedestrian)</span>
            <span class="shortcut-key">R</span><span>Reset Current Layout / Advance to Next Seed</span>
            <span class="shortcut-key">N</span><span>Toggle Procedural Audio Effects Mute / Unmute</span>
            <span class="shortcut-key">CLICK FLOOR</span><span>Deploy currently selected object (Goal, Crate, Cabinet, Table)</span>
            <span class="shortcut-key">H</span><span>Toggle this Help Modal</span>
            <span class="shortcut-key">ESC</span><span>Return to Simulations Catalog</span>
          </div>
        </div>
      </div>
    </div>
  `;const u=document.getElementById("sim-canvas-root"),f=document.getElementById("pov-sensor-overlay"),m=document.getElementById("badge-connection"),_=document.getElementById("fps-display"),g=document.getElementById("metric-latency"),p=document.getElementById("metric-plan-samples"),x=document.getElementById("lbl-chosen-action"),S=document.getElementById("metric-winrate"),M=document.getElementById("metric-collisions"),T=document.getElementById("metric-steps"),E=document.getElementById("candidates-container"),R=document.getElementById("why-explanation"),D=document.getElementById("help-modal"),y=document.getElementById("audio-visualizer-canvas"),b=document.getElementById("neural-cortex-canvas"),L=document.getElementById("pov-heading-val"),k=document.getElementById("pov-target-dist"),z=document.getElementById("metric-goal-dist"),j=document.getElementById("sparkline-dist-path"),q=document.getElementById("sparkline-dist-val");let O=null,H=null,se=null,xe=null,ue=null,be=null;const Ve=[],Ye=(K,ke)=>{ee.sendCommand({cmd:"set_goal",x:K,y:ke}),it.playToolSelect()},vt=(K,ke,P)=>{{let $e=80,Pe=80;P==="crate"?($e=75,Pe=75):P==="cabinet"?($e=75,Pe=65):P==="barrels"?($e=85,Pe=85):P==="barrier"&&($e=110,Pe=45),ee.sendCommand({cmd:"add_obstacle",x:K,y:ke,kind:P,w:$e,h:Pe}),it.playToolSelect()}},ct=()=>{u.innerHTML="",H=null,e==="driving"?O=new To(u):O=new Rs(u),O.isAvailable()?(O.onFloorClick=Ye,O.onPlaceObstacle=vt,O.onFpsUpdate=K=>{_.textContent=`${K}.0 FPS`}):(O=null,se=new U_(u))},Q=()=>{u.innerHTML=`
      <div id="compare-wrapper" style="display: flex; width: 100%; height: 100%; position: relative;">
        <!-- Left Viewport: Reactive Baseline -->
        <div style="flex: 1; height: 100%; position: relative; border-right: 2px solid rgba(0, 240, 255, 0.3);">
          <div style="position: absolute; top: 60px; left: 16px; z-index: 5; background: rgba(9, 15, 29, 0.90); backdrop-filter: blur(10px); padding: 5px 12px; border-radius: 4px; border: 1px solid rgba(255, 71, 87, 0.5); font-family: var(--font-mono); font-size: 0.74rem;">
            <span style="color: #ff4757; font-weight: 800;">WITHOUT WORLD MODEL</span>
            <span id="left-telemetry" style="color: #cbd5e1; margin-left: 8px;">Hits: 0 | Steps: 0</span>
          </div>
          <div id="left-canvas-container" style="width: 100%; height: 100%;"></div>
        </div>

        <!-- Right Viewport: World Model MPC -->
        <div style="flex: 1; height: 100%; position: relative;">
          <div style="position: absolute; top: 60px; left: 16px; z-index: 5; background: rgba(9, 15, 29, 0.90); backdrop-filter: blur(10px); padding: 5px 12px; border-radius: 4px; border: 1px solid rgba(0, 255, 157, 0.5); font-family: var(--font-mono); font-size: 0.74rem;">
            <span style="color: #00ff9d; font-weight: 800;">WITH WORLD MODEL</span>
            <span id="right-telemetry" style="color: #cbd5e1; margin-left: 8px;">Hits: 0 | Steps: 0</span>
          </div>
          <div id="winner-badge" style="display: none; position: absolute; top: 96px; left: 50%; transform: translateX(-50%); z-index: 10; background: linear-gradient(90deg, rgba(0, 255, 157, 0.95), rgba(0, 240, 255, 0.95)); color: #050811; font-weight: 800; font-family: var(--font-mono); font-size: 0.82rem; padding: 6px 16px; border-radius: 4px; box-shadow: 0 0 25px rgba(0,255,157,0.7);">
            🏆 MISSION OBJECTIVE REACHED (0 COLLISIONS)
          </div>
          <div id="right-canvas-container" style="width: 100%; height: 100%;"></div>
        </div>
      </div>
    `;const K=document.getElementById("left-canvas-container"),ke=document.getElementById("right-canvas-container");xe=document.getElementById("left-telemetry"),ue=document.getElementById("right-telemetry"),be=document.getElementById("winner-badge"),e==="driving"?(H=new To(K),O=new To(ke)):(H=new Rs(K),O=new Rs(ke)),O&&(O.onFloorClick=Ye,O.onPlaceObstacle=vt,O.onFpsUpdate=P=>{_.textContent=`${P}.0 FPS`})};ct();const ee=new F_(e),Se=new O_,Xe=K=>{var $e,Pe,We;if(K.is_compare||t){H||Q(),K.is_compare&&(H&&K.left&&(H.update(K.left),xe&&K.left.metrics&&(xe.textContent=`Hits: ${K.left.metrics.collisions} | Steps: ${K.left.step}/200`)),O&&K.right&&(O.update(K.right),ue&&K.right.metrics&&(ue.textContent=`Hits: ${K.right.metrics.collisions} | Steps: ${K.right.step}/200`),be&&(($e=K.right.metrics)!=null&&$e.success)&&(be.style.display="block")),Ae(K.right));return}H&&ct();const ke=K;O?(O.update(ke),_.textContent=`${O.currentFps}.0 FPS`,f.style.display=O.cameraMode==="robot_pov"?"block":"none"):se&&se.render(ke);const P=(We=(Pe=ke.metrics)==null?void 0:Pe.extra)==null?void 0:We.is_paused;P!==void 0&&P!==l&&a(P,!1),ke.events&&ke.events.length>0?((ke.events.includes("bonk")||ke.events.includes("collision"))&&it.playBonk(),ke.events.includes("goal")&&it.playGoal()):it.playMove(),Ae(ke),Ct(b)},Ae=K=>{var P,$e,Pe,We,me,A,v,F,Y,J,X;if(!K)return;const ke=((P=K.metrics)==null?void 0:P.step_count)??K.step??0;if(K.metrics){const de=K.metrics.episode??1,fe=(((($e=K.metrics.extra)==null?void 0:$e.success_count)??(K.metrics.success?1:0))/Math.max(de,1)*100).toFixed(1);S.textContent=`${fe}% (n=${de})`,M.textContent=`${K.metrics.collisions}`,T.textContent=`${ke} / 200`}if(e==="driving"){const de=((We=(Pe=K.metrics)==null?void 0:Pe.extra)==null?void 0:We.speed_kmh)??70,le=document.getElementById("av-speed-val");le&&(le.textContent=Math.round(de).toString());const fe=((A=(me=K.metrics)==null?void 0:me.extra)==null?void 0:A.lane_offset)??0,we=document.getElementById("av-offset-val"),ne=document.getElementById("av-offset-fill");if(we&&(we.textContent=`${fe>=0?"+":""}${fe.toFixed(2)} m`),ne){const $=Math.min(100,Math.max(0,50+fe/4*50));ne.style.width=`${$}%`,ne.style.backgroundColor=Math.abs(fe)<.6?"#00ff9d":Math.abs(fe)<1.4?"#ffb703":"#ef4444"}const ae=((F=(v=K.metrics)==null?void 0:v.extra)==null?void 0:F.ttc)??10,ve=document.getElementById("av-ttc-val"),Me=document.getElementById("av-ttc-fill");if(ve&&(ve.textContent=ae<9.9?`${ae.toFixed(1)} s`:"CLEAR"),Me){const $=Math.min(100,Math.max(0,ae/6*100));Me.style.width=`${$}%`,Me.style.backgroundColor=ae>3?"#00ff9d":ae>1.8?"#ffb703":"#ef4444"}const re=["ACCELERATE","BRAKE","STEER LEFT","STEER RIGHT","CRUISE"],Be=["accelerate","brake","steer-left","steer-right","cruise"],C=((Y=K.plan)==null?void 0:Y.chosen_action)??4,ce=document.getElementById("av-action-chip");ce&&(ce.className=`av-action-chip ${Be[C]||"cruise"}`,ce.textContent=re[C]||"CRUISE");const he=document.getElementById("av-mae-val");he&&(he.textContent=K.model_error!==null&&K.model_error!==void 0?K.model_error.toFixed(4):"0.019");const pe=document.getElementById("av-minimap-canvas");if(pe&&((X=(J=K.world)==null?void 0:J.layout)!=null&&X.centerline)){const $=pe.getContext("2d");if($){$.clearRect(0,0,pe.width,pe.height);const Z=K.world.layout.centerline,oe=K.world.bounds?K.world.bounds[2]:200,Ne=He=>8+He/oe*(pe.width-16),st=He=>pe.height/2-He/50*(pe.height/2);$.strokeStyle="rgba(71, 85, 105, 0.7)",$.lineWidth=4,$.beginPath(),Z.forEach((He,Yt)=>{const jt=Ne(He[0]),oi=st(He[1]);Yt===0?$.moveTo(jt,oi):$.lineTo(jt,oi)}),$.stroke(),(K.entities||[]).forEach(He=>{var oi,ls,wi;const Yt=Ne(He.x),jt=st(He.y);$.fillStyle=(oi=He.extra)!=null&&oi.is_ego?"#00ff9d":((ls=He.extra)==null?void 0:ls.color)||"#38bdf8",$.beginPath(),$.arc(Yt,jt,(wi=He.extra)!=null&&wi.is_ego?3.5:2.5,0,Math.PI*2),$.fill()})}}if(K.events&&K.events.length>0){const $=document.getElementById("av-toast-box");$&&K.events.forEach(Z=>{const oe=document.createElement("div");oe.className="av-toast-item",Z==="brake"?(oe.innerHTML="⚠️ LEAD VEHICLE HARD BRAKING",oe.style.borderColor="#ffb703"):Z==="lane_change"?(oe.innerHTML="↔️ LANE CHANGE MANEUVER",oe.style.borderColor="#00f0ff"):Z==="near_miss"?(oe.innerHTML="⚡ CRITICAL HEADWAY ALERT (TTC < 1.8s)",oe.style.borderColor="#ff4757"):Z==="bonk"?(oe.innerHTML="💥 COLLISION DETECTED",oe.style.borderColor="#ef4444"):Z==="goal"&&(oe.innerHTML="🏆 HIGHWAY DESTINATION REACHED",oe.style.borderColor="#00ff9d"),$.appendChild(oe),setTimeout(()=>{oe.remove()},2500)})}}if(K.goal&&K.entities){const de=K.entities.find(le=>le.id==="robot"||le.kind==="robot");if(de&&z&&j&&q){const fe=Math.hypot(K.goal.x-de.x,K.goal.y-de.y)/100;if(z.textContent=`${fe.toFixed(2)} m`,q.textContent=`${fe.toFixed(2)} m`,k&&(k.textContent=`${fe.toFixed(2)} m`),L&&de.angle!==void 0){const ae=Math.round((de.angle*180/Math.PI+360)%360);L.textContent=`HDG ${ae.toString().padStart(3,"0")}°`}Ve.push(fe),Ve.length>25&&Ve.shift();const we=Math.max(6,...Ve),ne=Ve.map((ae,ve)=>{const Me=ve/Math.max(Ve.length-1,1)*200,re=24-ae/we*20;return`${Me.toFixed(1)},${re.toFixed(1)}`});j.setAttribute("d","M "+ne.join(" L "))}}if(K.plan){g.textContent=`${K.plan.ms?K.plan.ms.toFixed(1):"8.7"} ms`,p.textContent=`${K.plan.samples||300}x${K.plan.horizon||14}`;const de=["NORTH","SOUTH","WEST","EAST","STAY"],le=K.plan.chosen_action!==void 0?K.plan.chosen_action:4,fe=de[le]||"STAY";if(x.textContent=fe,K.plan.alts&&Array.isArray(K.plan.alts)){let we=-1e9,ne=1e9;K.plan.alts.forEach(re=>{const Be=re.score!==void 0?re.score:re.return!==void 0?re.return:0;Be>we&&(we=Be),Be<ne&&(ne=Be)});const ae=Math.max(we-ne,1);(E.querySelectorAll(".candidate-row").length!==K.plan.alts.length||E.querySelector(".why-reason"))&&(E.innerHTML="",K.plan.alts.forEach(()=>{const re=document.createElement("div");re.className="candidate-row",re.innerHTML=`
              <span class="cand-act" style="width: 50px;"></span>
              <div class="candidate-bar-bg">
                <div class="candidate-bar-fill"></div>
              </div>
              <span class="cand-score" style="width: 48px; text-align: right; font-weight: 700;"></span>
            `,E.appendChild(re)}));const Me=E.children;K.plan.alts.forEach((re,Be)=>{const C=Me[Be];if(!C)return;const ce=re.score!==void 0?re.score:re.return!==void 0?re.return:0,he=re.first_action!==void 0?re.first_action:re.action!==void 0?re.action:4,pe=de[he]||"STAY",$=he===le,Z=Math.max(8,Math.min(100,Math.round((ce-ne)/ae*100))),oe=$?"#00ff9d":re.collides?"#ff4757":"#00f0ff";C.style.opacity=$?"1":"0.75";const Ne=C.querySelector(".cand-act");Ne&&(Ne.textContent=`${pe}:`,Ne.style.fontWeight=$?"800":"500",Ne.style.color=$?"#00ff9d":"inherit");const st=C.querySelector(".candidate-bar-fill");st&&(st.style.width=`${Z}%`,st.style.background=oe);const He=C.querySelector(".cand-score");He&&(He.textContent=`${ce>=0?"+":""}${Number(ce).toFixed(1)}`,He.style.color=oe)}),R.textContent=`Evaluated 300 candidate rollouts over a 14-step receding horizon. Selected [${fe}] as the highest expected reward trajectory toward the goal.`}}};let tt=0;const Ct=(K,ke)=>{if(!K)return;const P=K.getContext("2d");if(!P)return;tt+=.08;const $e=K.width,Pe=K.height;P.clearRect(0,0,$e,Pe);const We=[{name:"IN",count:5,x:25},{name:"RES1",count:6,x:105},{name:"RES2",count:6,x:195},{name:"OUT",count:4,x:285}];P.lineWidth=1;for(let me=0;me<We.length-1;me++){const A=We[me],v=We[me+1];for(let F=0;F<A.count;F++){const Y=Pe/(A.count+1)*(F+1);for(let J=0;J<v.count;J++){const X=Pe/(v.count+1)*(J+1),de=(me*2+F+J)*.4,le=.08+.12*Math.sin(tt+de);P.strokeStyle=`rgba(0, 240, 255, ${le.toFixed(2)})`,P.beginPath(),P.moveTo(A.x,Y),P.lineTo(v.x,X),P.stroke()}}}We.forEach((me,A)=>{for(let v=0;v<me.count;v++){const F=Pe/(me.count+1)*(v+1);P.fillStyle=A===3?"#00ff9d":A===0?"#ffb703":"#00f0ff",P.beginPath(),P.arc(me.x,F,3.2,0,Math.PI*2),P.fill()}})};ee.onFrame=Xe,ee.onStatusChange=K=>{K==="connected"?(m.textContent="● LIVE FEED",m.className="badge badge-live",O&&O.setDockStatus("released")):(m.textContent="○ REPLAY FALLBACK",m.className="badge badge-replay",Se.onFrame=ke=>Xe(ke),Se.load("robotics",1,"wm"))},ee.connect();let Qe=0;const rt=()=>{it.renderOscilloscope(y);const K=Math.floor((Date.now()-o)/1e3),ke=Math.floor(K/3600).toString().padStart(2,"0"),P=Math.floor(K%3600/60).toString().padStart(2,"0"),$e=(K%60).toString().padStart(2,"0"),Pe=document.getElementById("mission-clock");Pe&&(Pe.textContent=`T+${ke}:${P}:${$e}`),Qe=requestAnimationFrame(rt)};return Qe=requestAnimationFrame(rt),(()=>{const K=document.getElementById("btn-mode-wm"),ke=document.getElementById("btn-mode-base"),P=document.getElementById("btn-mode-compare"),$e=C=>{[K,ke,P].forEach(ce=>ce.classList.remove("active")),C.classList.add("active")};K.onclick=()=>{t=!1,$e(K),H&&ct(),ee.sendCommand({cmd:"set",mode:"world_model"}),it.playToolSelect(),it.speak("Neural World Model engaged.")},ke.onclick=()=>{t=!1,$e(ke),H&&ct(),ee.sendCommand({cmd:"set",mode:"baseline"}),it.playToolSelect(),it.speak("Reactive baseline engaged.")},P.onclick=()=>{t=!0,$e(P),H||Q(),ee.sendCommand({cmd:"set",mode:"compare"}),it.playToolSelect(),it.speak("Dual synchronized compare mode active.")};const Pe={overview:document.getElementById("cam-overview"),chase:document.getElementById("cam-chase"),pov:document.getElementById("cam-pov"),topdown:document.getElementById("cam-topdown"),orbit:document.getElementById("cam-orbit"),cinematic:document.getElementById("cam-cinematic")},We=C=>{Object.values(Pe).forEach(ce=>ce.classList.remove("active")),Pe[C]&&Pe[C].classList.add("active")};Pe.overview.onclick=()=>{O==null||O.setCameraMode("overview"),We("overview"),it.playClick()},Pe.chase.onclick=()=>{O==null||O.setCameraMode("chase"),We("chase"),it.playClick()},Pe.pov.onclick=()=>{O==null||O.setCameraMode("robot_pov"),We("pov"),it.playClick(),it.speak("Visor HUD online.")},Pe.topdown.onclick=()=>{O==null||O.setCameraMode("topdown"),We("topdown"),it.playClick()},Pe.orbit.onclick=()=>{O==null||O.setCameraMode("orbit"),We("orbit"),it.playClick()},Pe.cinematic.onclick=()=>{O==null||O.setCameraMode("cinematic"),We("cinematic"),it.playClick(),it.speak("Cinematic director mode active.")};const me=document.getElementById("tool-goal"),A=document.getElementById("tool-crate"),v=document.getElementById("tool-cabinet"),F=document.getElementById("tool-workstation"),Y=document.getElementById("tool-barrels"),J=document.getElementById("tool-barrier"),X=[me,A,v,F,Y,J],de=(C,ce)=>{X.forEach(he=>he.classList.remove("active")),C.classList.add("active"),O&&(O.activePlacementTool=ce),it.playToolSelect()};me.onclick=()=>de(me,"goal"),A.onclick=()=>de(A,"crate"),v.onclick=()=>de(v,"cabinet"),F.onclick=()=>de(F,"workstation"),Y.onclick=()=>de(Y,"barrels"),J.onclick=()=>de(J,"barrier"),document.getElementById("btn-clear-obs").onclick=()=>{ee.sendCommand({cmd:"clear_obstacles"}),it.playBonk(),it.speak("Arena cleared.")},document.getElementById("btn-random-obs").onclick=()=>{i=Math.floor(Math.random()*9e3)+1e3,ee.sendCommand({cmd:"reset",seed:i}),it.playToolSelect()};const le=document.getElementById("btn-mute"),fe=document.getElementById("lbl-sound");le.onclick=()=>{const C=it.toggleMute();fe.textContent=C?"🔇 MOTOR: MUTED":"🔊 MOTOR GLIDE: ON",le.classList.toggle("active",!C)},l=!1;const we=document.getElementById("btn-dock-launch"),ne=document.getElementById("lbl-dock-launch"),ae=document.getElementById("dock-hud-dot"),ve=document.getElementById("dock-hud-text");a=(C,ce=!0)=>{l=C,O&&O.setDockStatus(C?"docked":"released"),C?(ce&&ee.sendCommand({cmd:"pause"}),we.style.background="rgba(0, 240, 255, 0.18)",we.style.borderColor="#00f0ff",we.style.boxShadow="0 0 16px rgba(0, 240, 255, 0.4)",ne.textContent="🚀 LAUNCH ROBOT [SPACE]",ne.style.color="#00f0ff",ae&&(ae.style.background="#f59e0b",ae.style.boxShadow="0 0 10px #f59e0b"),ve&&(ve.textContent="ROBOT DOCKED AT BAY — PRESS [SPACE] TO LAUNCH")):(ce&&ee.sendCommand({cmd:"start"}),we.style.background="rgba(0, 255, 157, 0.22)",we.style.borderColor="#00ff9d",we.style.boxShadow="0 0 18px rgba(0, 255, 157, 0.5)",ne.textContent="⏸️ HOLD / PAUSE [SPACE]",ne.style.color="#00ff9d",ae&&(ae.style.background="#00ff9d",ae.style.boxShadow="0 0 10px #00ff9d"),ve&&(ve.textContent="ROBOT ACTIVE — EXECUTING TRAJECTORY — [SPACE] TO HOLD"),it.playMove())};const Me=()=>{a(!l)};we&&(we.onclick=C=>{C.preventDefault(),we.blur(),Me()}),document.getElementById("btn-reset").onclick=()=>{ee.sendCommand({cmd:"reset",seed:i}),a(!0),it.playToolSelect()};const re=document.getElementById("select-speed");re.onchange=()=>{n=parseFloat(re.value),ee.sendCommand({cmd:"set",speed:n}),it.playClick()},document.getElementById("btn-snapshot").onclick=()=>{if(O){const C=O.captureScreenshot();if(C){const ce=document.createElement("a");ce.href=C,ce.download=`world_model_telemetry_${Date.now()}.png`,ce.click(),it.playGoal(),it.speak("Snapshot saved.")}}},document.getElementById("btn-fullscreen").onclick=()=>{document.fullscreenElement?document.exitFullscreen().catch(()=>{}):document.documentElement.requestFullscreen().catch(()=>{}),it.playClick()},document.getElementById("btn-help").onclick=()=>{s=!s,D.style.display=s?"flex":"none",it.playClick()},document.getElementById("btn-close-help").onclick=()=>{s=!1,D.style.display="none",it.playClick()},document.querySelectorAll("button").forEach(C=>{C.addEventListener("click",()=>C.blur())});const Be=C=>{if(!(C.target instanceof HTMLInputElement||C.target instanceof HTMLSelectElement))if(C.key==="Enter"||C.code==="Enter"||C.code==="NumpadEnter"||C.code==="Space"||C.key===" "){C.preventDefault(),C.stopPropagation(),Me();return}else if(C.key==="Tab")C.preventDefault(),K.click();else if(C.key==="t"||C.key==="T")ke.click();else if(C.key==="s"||C.key==="S")P.click();else if(C.key==="c"||C.key==="C"){if(O){const ce=O.cycleCamera();We(ce)}}else C.key==="r"||C.key==="R"?document.getElementById("btn-reset").click():C.key==="h"||C.key==="H"?document.getElementById("btn-help").click():(C.key==="n"||C.key==="N")&&le.click()};window.addEventListener("keydown",Be),c=()=>window.removeEventListener("keydown",Be)})(),()=>{c&&c(),cancelAnimationFrame(Qe),ee.disconnect(),Se.stop(),O&&O.destroy(),H&&H.destroy()}}function z_(r){r.innerHTML=`
    <!-- Top Navigation Bar -->
    <header class="top-nav">
      <div class="nav-brand">
        <div class="nav-logo-icon">W</div>
        <span>World Model 3D</span>
        <span class="badge badge-live" style="margin-left: 8px;">NBA 2026</span>
      </div>
      <nav class="nav-links">
        <a href="#/">Simulations</a>
        <a href="#/results" class="active">Accreditation Results</a>
        <a href="#/about">Architecture & Tech</a>
      </nav>
    </header>

    <main class="home-container" style="max-width: 1100px;">
      <div style="margin-bottom: 24px;">
        <div class="glass-pill" style="margin-bottom: 12px;">
          <span style="color: var(--accent-cyan); font-weight: 700;">● Official Held-Out Test Benchmark</span>
          <span style="color: var(--text-dim);">|</span>
          <span>Seeds 5000 – 5099 (100 Episodes Each)</span>
        </div>
        <h1 style="font-size: 2.2rem; font-weight: 800; margin-bottom: 8px;">Evaluation & Ablation Results</h1>
        <p style="color: var(--text-muted); font-size: 1rem;">
          Rigorous empirical evaluation comparing reactive greedy baseline control against the learned deep ensemble World Model and the theoretical Oracle MPC upper bound.
        </p>
      </div>

      <!-- KPI Summary Cards -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px;">
        <div class="glass-panel" style="padding: 16px;">
          <div style="font-size: 0.75rem; color: var(--text-dim); font-family: var(--font-mono);">SCENARIO 1 WIN RATE</div>
          <div style="font-size: 1.8rem; font-weight: 800; color: var(--accent-green); margin: 4px 0;">94.0%</div>
          <div style="font-size: 0.78rem; color: var(--text-muted);">+60.0% vs Greedy (34.0%)</div>
        </div>
        <div class="glass-panel" style="padding: 16px;">
          <div style="font-size: 0.75rem; color: var(--text-dim); font-family: var(--font-mono);">SCENARIO 2 WIN RATE</div>
          <div style="font-size: 1.8rem; font-weight: 800; color: var(--accent-cyan); margin: 4px 0;">97.0%</div>
          <div style="font-size: 0.78rem; color: var(--text-muted);">+63.0% vs Greedy (34.0%)</div>
        </div>
        <div class="glass-panel" style="padding: 16px;">
          <div style="font-size: 0.75rem; color: var(--text-dim); font-family: var(--font-mono);">COLLISION SUPPRESSION</div>
          <div style="font-size: 1.8rem; font-weight: 800; color: var(--accent-orange); margin: 4px 0;">92.9%</div>
          <div style="font-size: 0.78rem; color: var(--text-muted);">From 120.2 to 8.48 hits/ep</div>
        </div>
        <div class="glass-panel" style="padding: 16px;">
          <div style="font-size: 0.75rem; color: var(--text-dim); font-family: var(--font-mono);">MPC STEP LATENCY</div>
          <div style="font-size: 1.8rem; font-weight: 800; color: var(--accent-yellow); margin: 4px 0;">8.78 ms</div>
          <div style="font-size: 0.78rem; color: var(--text-muted);">Budget: &le; 25.0 ms (60 FPS)</div>
        </div>
      </div>

      <!-- Results Table -->
      <section class="glass-panel" style="padding: 24px; margin-bottom: 32px;">
        <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 16px;">Official Consolidated Benchmark Table</h3>
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.88rem; font-family: var(--font-mono);">
            <thead>
              <tr style="border-bottom: 1px solid var(--border-subtle); color: var(--text-muted); text-align: left;">
                <th style="padding: 10px;">Scenario</th>
                <th style="padding: 10px;">Control Policy</th>
                <th style="padding: 10px; text-align: right;">Success %</th>
                <th style="padding: 10px; text-align: right;">Mean Collisions</th>
                <th style="padding: 10px; text-align: right;">Coll / 100 Steps</th>
                <th style="padding: 10px; text-align: right;">Mean Steps</th>
              </tr>
            </thead>
            <tbody>
              <!-- Scenario 1 -->
              <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.04);">
                <td style="padding: 10px; color: var(--text-dim);">Scenario 1 (Chair Trap)</td>
                <td style="padding: 10px;">Random Walk Baseline</td>
                <td style="padding: 10px; text-align: right;">0.0%</td>
                <td style="padding: 10px; text-align: right;">4.14</td>
                <td style="padding: 10px; text-align: right;">2.07</td>
                <td style="padding: 10px; text-align: right; color: var(--text-dim);">&mdash;</td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.04);">
                <td style="padding: 10px; color: var(--text-dim);">Scenario 1 (Chair Trap)</td>
                <td style="padding: 10px;">Reactive Greedy Baseline</td>
                <td style="padding: 10px; text-align: right; color: var(--accent-orange);">34.0%</td>
                <td style="padding: 10px; text-align: right;">120.24</td>
                <td style="padding: 10px; text-align: right;">80.32</td>
                <td style="padding: 10px; text-align: right;">52.1</td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.04);">
                <td style="padding: 10px; color: var(--text-dim);">Scenario 1 (Chair Trap)</td>
                <td style="padding: 10px;">Greedy with Unstick Heuristic</td>
                <td style="padding: 10px; text-align: right;">58.0%</td>
                <td style="padding: 10px; text-align: right;">59.79</td>
                <td style="padding: 10px; text-align: right;">51.43</td>
                <td style="padding: 10px; text-align: right;">55.6</td>
              </tr>
              <tr style="border-bottom: 1px solid var(--border-subtle); background: rgba(0, 229, 255, 0.05);">
                <td style="padding: 10px; font-weight: 700; color: var(--accent-cyan);">Scenario 1 (Chair Trap)</td>
                <td style="padding: 10px; font-weight: 700; color: var(--accent-cyan);">World Model MPC (Ensemble)</td>
                <td style="padding: 10px; text-align: right; font-weight: 700; color: var(--accent-green);">94.0%</td>
                <td style="padding: 10px; text-align: right; font-weight: 700; color: var(--accent-green);">8.48</td>
                <td style="padding: 10px; text-align: right; font-weight: 700;">13.53</td>
                <td style="padding: 10px; text-align: right; font-weight: 700;">53.9</td>
              </tr>
              <tr style="border-bottom: 2px solid var(--border-subtle);">
                <td style="padding: 10px; color: var(--text-dim);">Scenario 1 (Chair Trap)</td>
                <td style="padding: 10px; font-style: italic;">Oracle-MPC (Upper Bound)</td>
                <td style="padding: 10px; text-align: right; font-style: italic;">96.0%</td>
                <td style="padding: 10px; text-align: right; font-style: italic;">0.00</td>
                <td style="padding: 10px; text-align: right; font-style: italic;">0.00</td>
                <td style="padding: 10px; text-align: right; font-style: italic;">56.4</td>
              </tr>

              <!-- Scenario 2 -->
              <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.04);">
                <td style="padding: 10px; color: var(--text-dim);">Scenario 2 (Moving Person)</td>
                <td style="padding: 10px;">Reactive Greedy Baseline</td>
                <td style="padding: 10px; text-align: right; color: var(--accent-orange);">34.0%</td>
                <td style="padding: 10px; text-align: right;">121.00</td>
                <td style="padding: 10px; text-align: right;">80.42</td>
                <td style="padding: 10px; text-align: right;">54.3</td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.04);">
                <td style="padding: 10px; color: var(--text-dim);">Scenario 2 (Moving Person)</td>
                <td style="padding: 10px;">Greedy with Unstick Heuristic</td>
                <td style="padding: 10px; text-align: right;">57.0%</td>
                <td style="padding: 10px; text-align: right;">62.49</td>
                <td style="padding: 10px; text-align: right;">52.50</td>
                <td style="padding: 10px; text-align: right;">57.9</td>
              </tr>
              <tr style="border-bottom: 1px solid var(--border-subtle); background: rgba(0, 229, 255, 0.05);">
                <td style="padding: 10px; font-weight: 700; color: var(--accent-cyan);">Scenario 2 (Moving Person)</td>
                <td style="padding: 10px; font-weight: 700; color: var(--accent-cyan);">World Model MPC (Ensemble)</td>
                <td style="padding: 10px; text-align: right; font-weight: 700; color: var(--accent-green);">97.0%</td>
                <td style="padding: 10px; text-align: right; font-weight: 700; color: var(--accent-green);">5.55</td>
                <td style="padding: 10px; text-align: right; font-weight: 700;">9.12</td>
                <td style="padding: 10px; text-align: right; font-weight: 700;">56.6</td>
              </tr>
              <tr>
                <td style="padding: 10px; color: var(--text-dim);">Scenario 2 (Moving Person)</td>
                <td style="padding: 10px; font-style: italic;">Oracle-MPC (Upper Bound)</td>
                <td style="padding: 10px; text-align: right; font-style: italic;">99.0%</td>
                <td style="padding: 10px; text-align: right; font-style: italic;">0.20</td>
                <td style="padding: 10px; text-align: right; font-style: italic;">0.32</td>
                <td style="padding: 10px; text-align: right; font-style: italic;">61.3</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Visual Charts Gallery -->
      <section style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        <div class="glass-panel" style="padding: 16px;">
          <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 12px; color: var(--accent-cyan);">Learning Curves (5-Model Deep Ensemble)</h4>
          <img src="./results/training_curves.png" alt="Training Curves" style="width: 100%; border-radius: 8px; border: 1px solid var(--border-subtle);" onerror="this.src='./results/robot_loss.png'" />
        </div>
        <div class="glass-panel" style="padding: 16px;">
          <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 12px; color: var(--accent-green);">Multi-Method Performance Comparison</h4>
          <img src="./results/robot_comparison.png" alt="Robot Comparison" style="width: 100%; border-radius: 8px; border: 1px solid var(--border-subtle);" />
        </div>
      </section>
    </main>
  `}function G_(r){r.innerHTML=`
    <!-- Top Navigation Bar -->
    <header class="top-nav">
      <div class="nav-brand">
        <div class="nav-logo-icon">W</div>
        <span>World Model 3D</span>
        <span class="badge badge-live" style="margin-left: 8px;">NBA 2026</span>
      </div>
      <nav class="nav-links">
        <a href="#/">Simulations</a>
        <a href="#/results">Accreditation Results</a>
        <a href="#/about" class="active">Architecture & Tech</a>
      </nav>
    </header>

    <main class="home-container" style="max-width: 960px;">
      <div style="margin-bottom: 28px;">
        <h1 style="font-size: 2.2rem; font-weight: 800; margin-bottom: 8px;">Technical Architecture & Mathematical Formulation</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem;">
          How World Model predictive control enables autonomous agents to imagine future consequences before taking physical action.
        </p>
      </div>

      <!-- Core Principle Section -->
      <section class="glass-panel" style="padding: 24px; margin-bottom: 24px;">
        <h2 style="font-size: 1.25rem; font-weight: 700; color: var(--accent-cyan); margin-bottom: 12px;">1. The Core Paradigm: Learn &rarr; Imagine &rarr; Act</h2>
        <p style="color: var(--text-muted); margin-bottom: 14px; font-size: 0.95rem;">
          Traditional reactive policies (e.g. greedy distance minimization or potential fields) compute actions based strictly on current observations. When presented with non-convex obstacles (such as U-shaped chair traps or intersecting pedestrians), greedy agents get trapped in limit cycles or cause repeated physical collisions.
        </p>
        <p style="color: var(--text-muted); font-size: 0.95rem;">
          In contrast, our World Model controller learns the differential physics of the environment from offline transition data. Given current state \\(s_t\\), the agent samples \\(N = 300\\) candidate action sequences over planning horizon \\(H = 14\\), predicts the full multi-step trajectory using vectorized PyTorch forward passes, and selects the first action of the trajectory with the highest expected discounted return:
        </p>
        <div style="background: rgba(10, 14, 24, 0.75); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 14px; margin-top: 14px; font-family: var(--font-mono); font-size: 0.88rem; color: var(--accent-green);">
          a*_t = argmax_{a_{0:H-1}} &sum;_{k=0}^{H-1} &gamma;^k &middot; r_{pred}(s_{t+k}, a_{t+k})
        </div>
      </section>

      <!-- Model Architecture -->
      <section class="glass-panel" style="padding: 24px; margin-bottom: 24px;">
        <h2 style="font-size: 1.25rem; font-weight: 700; color: var(--accent-green); margin-bottom: 12px;">2. Deep Ensemble Neural Architecture</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; font-size: 0.9rem; color: var(--text-muted);">
          <div>
            <h4 style="color: #ffffff; font-weight: 700; margin-bottom: 8px;">Ensemble Specifications</h4>
            <ul style="padding-left: 20px; line-height: 1.7;">
              <li><strong>Ensemble Members:</strong> K = 5 independent deep residual MLPs</li>
              <li><strong>Hidden Units:</strong> 512 dimensions per layer</li>
              <li><strong>Residual Blocks:</strong> 3 blocks with LayerNorm & GELU</li>
              <li><strong>Epistemic Uncertainty:</strong> Inter-model variance across heads</li>
              <li><strong>Training:</strong> 500k transitions across seeds 0–999 on RTX 5070</li>
            </ul>
          </div>
          <div>
            <h4 style="color: #ffffff; font-weight: 700; margin-bottom: 8px;">Planner Optimizations</h4>
            <ul style="padding-left: 20px; line-height: 1.7;">
              <li><strong>Sample Distribution:</strong> 50% cached motion primitives + 50% persistent walks</li>
              <li><strong>Execution Latency:</strong> 8.78 ms per MPC step (&le; 25 ms target)</li>
              <li><strong>Anti-Reversal Bias:</strong> Suppresses high-frequency chatter</li>
              <li><strong>Hardware Acceleration:</strong> PyTorch AMP fp16 with Tensor Cores</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- System Architecture & NBA Guarantees -->
      <section class="glass-panel" style="padding: 24px;">
        <h2 style="font-size: 1.25rem; font-weight: 700; color: var(--accent-purple); margin-bottom: 12px;">3. NBA Accreditation Engineering Guarantees</h2>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; font-size: 0.88rem;">
          <div style="background: rgba(12, 16, 26, 0.6); padding: 14px; border-radius: 8px; border: 1px solid var(--border-subtle);">
            <div style="color: var(--accent-cyan); font-weight: 700; margin-bottom: 6px;">100% Offline Safe</div>
            <p style="color: var(--text-muted);">All assets, models, and libraries are locally bundled. Runs without internet connection.</p>
          </div>
          <div style="background: rgba(12, 16, 26, 0.6); padding: 14px; border-radius: 8px; border: 1px solid var(--border-subtle);">
            <div style="color: var(--accent-green); font-weight: 700; margin-bottom: 6px;">Dual WebGL Fallback</div>
            <p style="color: var(--text-muted);">If 3D WebGL context fails, automatically downgrades to pure 2D Canvas fallback renderer.</p>
          </div>
          <div style="background: rgba(12, 16, 26, 0.6); padding: 14px; border-radius: 8px; border: 1px solid var(--border-subtle);">
            <div style="color: var(--accent-yellow); font-weight: 700; margin-bottom: 6px;">Frozen Core Engine</div>
            <p style="color: var(--text-muted);">The public Python API (API.md) and simulation physics are 100% frozen and bit-for-bit verified.</p>
          </div>
        </div>
      </section>
    </main>
  `}class H_{constructor(e){U(this,"container");U(this,"currentCleanup",null);this.container=e,window.addEventListener("hashchange",()=>this.route())}init(){this.route()}route(){this.currentCleanup&&(this.currentCleanup(),this.currentCleanup=null),this.container.cleanup&&(this.container.cleanup(),this.container.cleanup=null);const e=window.location.hash.slice(1)||"/";if(e.startsWith("/sim/")){const t=e.replace("/sim/","").split("?")[0];k_(this.container,t)}else e==="/results"?z_(this.container):e==="/about"?G_(this.container):Ch(this.container);window.scrollTo(0,0)}}document.addEventListener("DOMContentLoaded",()=>{const r=document.getElementById("app");if(!r)return;const e=()=>{it.unlock(),window.removeEventListener("pointerdown",e),window.removeEventListener("keydown",e)};window.addEventListener("pointerdown",e),window.addEventListener("keydown",e),new H_(r).init()});
