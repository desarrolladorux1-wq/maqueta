
window.__FOTO_MODULE_VERSION = 'foto-remove-selection-state-v1';

window.__MODULE_PATHS = {
  'fotovoltaico-source': 'modulos/fotovoltaico/fotovoltaico.html?v=foto-dger-processing-v2',
  'electricidad-source': 'modulos/electricidad_al_toque/electricidad_al_toque.html?v=elec-beneficiarios-v3',
  'vale-fise-source': 'modulos/vale_fise/vale_fise.html?v=heatmap-suave-v3',
  'ahorro-gnv-source': 'modulos/ahorro_gnv/ahorro_gnv.html?v=gnv-cofide-api-v9',
    'ahorro-gnv-satcontrol-source': 'modulos/ahorro_gnv/ahorro_gnv_satcontrol.html?v=gnv-limite-agrupacion-v18',
  'masificacion-source': 'modulos/masificacion/masificacion.html?v=masif-strata-colors-v14',
  'masificacion-satcontrol-source': 'modulos/masificacion/masificacion_satcontrol.html?v=masif-strata-toggle-v18',
  'mcter-source': 'modulos/mtcer/mtcer.html?v=mcter-beneficiarios-v3'
};
window.__moduleCache = window.__moduleCache || {};
window.__moduleFetchPromises = window.__moduleFetchPromises || {};

async function fetchModuleHtml(id) {
  if (window.__moduleCache[id]) return window.__moduleCache[id];
  if (window.__moduleFetchPromises[id]) return window.__moduleFetchPromises[id];
  var path = window.__MODULE_PATHS[id];
  if (!path) return '';
  var bust = (id === 'fotovoltaico-source' && window.__FOTO_MODULE_VERSION) ? ('?v=' + encodeURIComponent(window.__FOTO_MODULE_VERSION)) : '';
  window.__moduleFetchPromises[id] = fetch(path + bust).then(function(r) {
    if (!r.ok) throw new Error('No se pudo cargar ' + path);
    return r.text();
  }).then(function(html) {
    html = html.split('<\\/script>').join('</script>');
    window.__moduleCache[id] = html;
    return html;
  }).finally(function() { delete window.__moduleFetchPromises[id]; });
  return window.__moduleFetchPromises[id];
}

async function loadShellModules() {
  var adminHost = document.getElementById('administradorHost');
  var bonogasHost = document.getElementById('bonogasHost');
  var tasks = [];
  var adminVersion = 'projects-toolbar-order-v1';
  if (adminHost && (adminHost.dataset.loaded !== adminVersion || !adminHost.querySelector('.content'))) {
    tasks.push(fetch('modulos/administrador/administrador.html?v=' + adminVersion).then(function(r) {
      return r.text();
    }).then(function(html) {
      adminHost.innerHTML = html;
      adminHost.dataset.loaded = adminVersion;
    }));
  }
  if (bonogasHost && bonogasHost.dataset.loaded !== 'bonogas-pay-v1') {
    tasks.push(fetch('modulos/bonogas/bonogas.html?v=bonogas-pay-v1').then(function(r) {
      return r.text();
    }).then(function(html) {
      bonogasHost.innerHTML = html;
      bonogasHost.dataset.loaded = 'bonogas-pay-v1';
    }));
  }
  if (tasks.length) await Promise.all(tasks);
  if (typeof window.wireShellModuleEvents === 'function') window.wireShellModuleEvents();
  if (typeof window.bindSatPanelToggles === 'function') window.bindSatPanelToggles();
  if (typeof window.__prepareUtilsDocks === 'function') window.__prepareUtilsDocks();
  if (typeof window.initProjectUtilsDockWhenReady === 'function') window.initProjectUtilsDockWhenReady();
  if (typeof window.wireToolsBtns === 'function') window.wireToolsBtns();
  if (typeof window.bindMapDrawButtons === 'function') window.bindMapDrawButtons();
}

function getModuleSource(id) {
  return window.__moduleCache[id] || '';
}

async function ensureModuleSource(id) {
  if (window.__moduleCache[id]) return window.__moduleCache[id];
  return fetchModuleHtml(id);
}

(function checkAuthRedirect(){
  if (location.pathname.replace(/\\/g,'/').includes('/login/')) return;
  try {
    if (!sessionStorage.getItem('maqueteo_logged_in')) {
      location.replace('login/login.html');
    }
  } catch(e) {}
})();
(function(){
  function setStep(n){
    document.querySelectorAll('#aiAssistantModal .ai-step').forEach(el=>el.classList.toggle('active',el.dataset.step==String(n)));
    document.querySelectorAll('#aiStepper .st').forEach(el=>{
      var s=Number(el.dataset.st);
      el.classList.toggle('active',s==n);
      el.classList.toggle('done',s<n);
    });
  }
  function reset(){ setStep(1); }
  document.addEventListener('click',function(e){
    var t=e.target.closest('#aiGoScanBtn'); if(t){ setStep(2); setTimeout(function(){setStep(3);},2000); return; }
    var b=e.target.closest('#aiBackUploadBtn'); if(b){ reset(); return; }
    var open=e.target.closest('#aiRobotBtn,[data-open-ai-flow]'); if(open){ setTimeout(reset,30); }
  });
  document.addEventListener('click',function(e){
    var c=e.target.closest('[data-close="aiAssistantModal"]'); if(c){ setTimeout(reset,200); }
  });
})();
document.addEventListener('DOMContentLoaded',function(){
  const style=document.createElement('style');
  style.textContent=`
    :root{
      --sat-bg:#11172f;
      --sat-top:#1c223b;
      --sat-panel:#1a223d;
      --sat-card:#2c3967;
      --sat-border:#32426b;
      --sat-text:#f7f9ff;
      --sat-muted:#aebbd3;
      --sat-cyan:#56c1f2;
    }
    body,.app{background:var(--sat-bg)!important;color:var(--sat-text)!important;}
    .main{background:var(--sat-bg)!important;}
    .content{background:var(--sat-bg)!important;gap:18px!important;padding:18px!important;}
    .left-panel,.info-panel{background:var(--sat-panel)!important;border:1px solid var(--sat-border)!important;border-radius:18px!important;box-shadow:none!important;}
    .panel-head{border-bottom:0!important;padding:24px 22px 14px!important;}
    .panel-head h2,.info-title h2{color:#fff!important;font-size:17px!important;font-weight:950!important;letter-spacing:0!important;}
    .panel-head p,.info-title p,.project-card small,.project-card .meta,.project-card .meta span{color:var(--sat-muted)!important;}
    .search{padding:8px 16px 14px!important;}
    .search input{height:58px!important;background:#151b34!important;border:1px solid #34436d!important;border-radius:14px!important;color:#f8fbff!important;font-size:15px!important;font-weight:700!important;padding:0 17px!important;}
    .search input::placeholder{color:#929db6!important;}
    .project-list{padding:0 16px 18px!important;gap:10px!important;}
    .project-card{background:var(--sat-card)!important;border:1px solid transparent!important;border-radius:14px!important;color:#eaf0ff!important;box-shadow:none!important;padding:18px 16px!important;}
    .project-card:hover,.project-card.selected{background:#334274!important;border-color:rgba(96,130,204,.42)!important;box-shadow:none!important;transform:none!important;}
    .project-card h3{color:#f2f6ff!important;font-size:15px!important;line-height:1.35!important;font-weight:900!important;letter-spacing:0!important;}
    .project-card small{font-size:14px!important;font-weight:700!important;}
    .map-shell,.map{border-radius:20px!important;border-color:#35466f!important;background:#0e152c!important;box-shadow:none!important;}
    .map-shell{outline:1px solid rgba(70,91,145,.35)!important;}
    .project-utils-dock{background:rgba(17,26,52,.92)!important;border:1px solid rgba(103,232,249,.22)!important;border-radius:12px!important;box-shadow:0 10px 28px rgba(0,0,0,.34)!important;gap:4px!important;backdrop-filter:blur(14px)!important;padding:4px 5px!important;}
    .project-utils-dock .util-btn{width:24px!important;height:24px!important;border-radius:6px!important;}
    .project-utils-dock .util-btn .svg-icon{width:12px!important;height:12px!important;}
    .project-utils-dock .util-btn.pdf{background:#ef4d42!important;color:#fff!important;}
    .project-utils-dock .util-btn.image{background:#47b867!important;color:#fff!important;}
    .project-utils-dock .util-btn.upload{background:#52d5a6!important;color:#071826!important;}
    .project-utils-dock .util-btn.pdf.secondary{background:#4269df!important;color:#fff!important;}
    .project-utils-dock .util-btn.icon-plain{color:#8b96b1!important;background:transparent!important;}
    .project-utils-dock .util-btn.icon-plain:hover{background:#1b2544!important;color:#f8fbff!important;}
    .project-utils-dock .util-separator{background:#304166!important;}
    .project-utils-dock.is-pinned{position:absolute!important;right:18px!important;left:auto!important;top:18px!important;background:rgba(17,26,52,.92)!important;border:1px solid rgba(103,232,249,.22)!important;border-radius:12px!important;box-shadow:0 10px 28px rgba(0,0,0,.34)!important;}
    .project-utils-dock.is-pinned .util-btn.pin{color:#67e8f9!important;background:#111a31!important;}
  `;
  document.head.appendChild(style);
});

document.addEventListener('DOMContentLoaded',function(){
  const style=document.createElement('style');
  style.textContent='.project-files-card{width:min(1420px,94vw)!important;height:min(1040px,88vh)!important;max-height:88vh!important;background:#1c223b!important;background-image:none!important;border:1px solid #4a5a86!important;border-radius:44px!important;padding:54px 42px!important;box-shadow:0 28px 80px rgba(0,0,0,.48)!important;color:#fff!important}.project-files-card .modal-head{border-bottom:0!important;margin:0 0 52px!important;padding:0!important;align-items:flex-start!important}.project-files-card .modal-head h2{color:#fff!important;font-size:30px!important;font-weight:900!important;letter-spacing:0!important}.project-files-card .modal-head p{display:none!important}.project-files-card .close{width:58px!important;height:58px!important;border-radius:50%!important;background:#222a47!important;border:3px solid rgba(255,255,255,.92)!important;color:#9db0da!important;font-size:30px!important;font-weight:300!important;line-height:1!important}.project-files-table{border:2px solid #2f3c66!important;border-radius:22px!important;min-height:230px!important;padding:30px 30px!important;background:#141a33!important}.project-files-head{display:grid!important;grid-template-columns:1fr 1fr 1fr!important;color:#b8c4de!important;font-size:22px!important;font-weight:900!important;padding-bottom:24px!important;border-bottom:2px solid #304069!important}.project-files-empty{min-height:126px!important;display:grid!important;place-items:center!important;color:rgba(178,187,209,.16)!important;font-size:22px!important;font-weight:850!important;text-align:center!important}';
  document.head.appendChild(style);
});

const projects=[
  {id:'FISE-2026-001',nombre:'AGRUPACIÓN 1',lider:'Oliver Gonzales',responsables:['Equipo GIS','Equipo Social','Mesa Técnica'],departamento:'Arequipa',provincia:'Arequipa',distrito:'Sauna',estado:'En evaluación',beneficiarios:128,area:'0.21 ha',tipo:'Masificación de gas FISE',lat:-16.3989,lng:-71.5350},
  {id:'FISE-2026-002',nombre:'AGRUPACIÓN 2',lider:'Oliver Gonzales',responsables:['Operaciones','Validador FISE'],departamento:'Arequipa',provincia:'Arequipa',distrito:'Yanahuara',estado:'Aprobado',beneficiarios:64,area:'0.12 ha',tipo:'Masificación de gas FISE',lat:-16.3420,lng:-71.6120},
  {id:'FISE-2026-003',nombre:'AGRUPACIÓN 3',lider:'Oliver Gonzales',responsables:['Catastro','Campo'],departamento:'Arequipa',provincia:'Arequipa',distrito:'Cayma',estado:'En ejecución',beneficiarios:230,area:'0.48 ha',tipo:'Masificación de gas FISE',lat:-16.4720,lng:-71.4780},
  {id:'FISE-2026-004',nombre:'AGRUPACIÓN 4',lider:'Oliver Gonzales',responsables:['Instalaciones','Social'],departamento:'Arequipa',provincia:'Arequipa',distrito:'Miraflores',estado:'En evaluación',beneficiarios:94,area:'0.18 ha',tipo:'Masificación de gas FISE',lat:-16.3120,lng:-71.5680},
  {id:'FISE-2026-005',nombre:'AGRUPACIÓN 5',lider:'Oliver Gonzales',responsables:['Campo','Técnico'],departamento:'Arequipa',provincia:'Arequipa',distrito:'Cerro Colorado',estado:'Aprobado',beneficiarios:156,area:'0.32 ha',tipo:'Masificación de gas FISE',lat:-16.4920,lng:-71.6380},
  {id:'FISE-2026-006',nombre:'AGRUPACIÓN 6',lider:'Oliver Gonzales',responsables:['Operaciones','GIS'],departamento:'Arequipa',provincia:'Arequipa',distrito:'Paucarpata',estado:'En ejecución',beneficiarios:312,area:'0.55 ha',tipo:'Masificación de gas FISE',lat:-16.3580,lng:-71.4480}
];
let selectedId=projects[0].id,editingId=null,deletingId=null,activeMapProjectId=null,lastSyncedProjectId=null;
function qsProyectos(sel){const root=qs('.content');return root?root.querySelector(sel):qs(sel);}
function isProyectosSatcontrolView(){const main=qs('.main');return main&&!main.classList.contains('vale-fise-mode')&&!main.classList.contains('ahorro-gnv-mode')&&!main.classList.contains('fotovoltaico-mode')&&!main.classList.contains('electricidad-mode')&&!main.classList.contains('masificacion-mode')&&!main.classList.contains('mcter-mode')&&!main.classList.contains('requests-mode')&&!main.classList.contains('validations-mode')&&!main.classList.contains('bonogas-satcontrol-mode')&&!main.classList.contains('bonogas-active')&&!main.classList.contains('project-list-mode')&&!main.classList.contains('create-project-mode');}
function clearBonogasHuLayerOnly(){if(window.bonogasHuLayer&&leafletMap&&leafletMap.hasLayer(window.bonogasHuLayer))leafletMap.removeLayer(window.bonogasHuLayer);window.bonogasHuLayer=null;}
function clearProyectosForeignMapLayers(){clearBonogasHuLayerOnly();const main=qs('.main');if(main){main.classList.remove('bonogas-satcontrol-mode','bonogas-active');}}
function ensureProjectLayerToggles(){['#layerEstrato','#layerCobertura','#layerTroncal','#layerRamales','#layerConcesionaria','#layerBenLiquidados','#layerBenPendLiquid','#layerBenConstrDentro','#layerBenConstrFuera'].forEach(id=>{const el=qs(id);if(el)el.checked=true;});}
function isBonogasMapContext(){const main=qs('.main');return !!(main&&(main.classList.contains('bonogas-satcontrol-mode')||main.classList.contains('bonogas-active')));}
function clearProyectosBeneficiaryOverlays(){if(!leafletMap)return;[beneficiaryLayer,morosityLayer,...Object.values(moduleThematicLayers||{})].forEach(layer=>{if(layer&&leafletMap.hasLayer(layer))leafletMap.removeLayer(layer);});}
function projectSupplyState(i,connected,delayed){if(connected)return i%4===0?'Pendiente de liquidación':'Liquidado';return delayed?'Fuera de plazo':'Dentro de plazo';}
function selectProject(projectId){const p=projects.find(x=>x.id===projectId);if(!p)return;const inBonogas=typeof isBonogasSatcontrolView==='function'&&isBonogasSatcontrolView();selectedId=projectId;activeMapProjectId=projectId;if(!inBonogas)clearProyectosForeignMapLayers();if(!inBonogas)ensureProjectLayerToggles();if(drawLayer)drawLayer.clearLayers();clearObjectSelection(false);activeAreaRecords=[];renderProjects();renderInfo();showToast('Agrupación activa: '+p.nombre);}
window.selectProject=selectProject;window.clearProyectosForeignMapLayers=clearProyectosForeignMapLayers;
const solicitudes=[
  {id:'SOL-2026-0001',beneficiario:'María Quispe Huamán',dni:'43567891',distrito:'Yanahuara',origen:'BONOGAS2.0',estado:'En validación',fecha:'2026-05-12',diasConstruccion:68,telefono:'+51 987 321 654',direccion:'Calle Los Sauces 120',tipo:'Residencial',observacion:'Pendiente revision domiciliaria'},
  {id:'SOL-2026-0002',beneficiario:'José Mamani Flores',dni:'40221876',distrito:'Sauna',origen:'Campo',estado:'Nueva',fecha:'2026-05-11',diasConstruccion:94,telefono:'+51 976 554 210',direccion:'Mz. B Lt. 08',tipo:'Residencial',observacion:'Registro capturado por aplicativo móvil'},
  {id:'SOL-2026-0003',beneficiario:'Bodega San Lázaro',dni:'RUC 20604588911',distrito:'Yanahuara',origen:'Web',estado:'Aprobada',fecha:'2026-05-10',diasConstruccion:45,telefono:'+51 954 889 770',direccion:'Av. Ejército 450',tipo:'No residencial',observacion:'Lista para programación de instalación'},
  {id:'SOL-2026-0004',beneficiario:'Rosa Condori Arias',dni:'46123988',distrito:'Bagua',origen:'BONOGAS2.0',estado:'Observada',fecha:'2026-05-09',diasConstruccion:101,telefono:'+51 944 772 118',direccion:'Jr. Amazonas 315',tipo:'Residencial',observacion:'Documento de titularidad pendiente'},
  {id:'SOL-2026-0005',beneficiario:'Luis Apaza Quispe',dni:'41880932',distrito:'Cajaruro',origen:'Campo',estado:'En validación',fecha:'2026-05-08',diasConstruccion:87,telefono:'+51 933 145 900',direccion:'Sector Nuevo Horizonte',tipo:'Residencial',observacion:'Cruce con padrón social en proceso'},
  {id:'SOL-2026-0006',beneficiario:'Elena Chávez Rojas',dni:'47201588',distrito:'Sauna',origen:'BONOGAS2.0',estado:'Aprobada',fecha:'2026-05-07',diasConstruccion:53,telefono:'+51 922 456 817',direccion:'Pasaje Industrial 104',tipo:'Residencial',observacion:'Expediente conforme'},
  {id:'SOL-2026-0007',beneficiario:'Pedro Gálvez Rojas',dni:'40123876',distrito:'Yanahuara',origen:'BONOGAS2.0',estado:'Aprobada',fecha:'2026-05-06',diasConstruccion:110,telefono:'+51 912 344 221',direccion:'Av. Independencia 820',tipo:'Comercial',observacion:'Local comercial apto'},
  {id:'SOL-2026-0008',beneficiario:'Industrias del Sur S.A.C.',dni:'RUC 20548796321',distrito:'Villa El Salvador',origen:'Web',estado:'En validación',fecha:'2026-05-05',diasConstruccion:34,telefono:'+51 955 887 663',direccion:'Parque Industrial 45',tipo:'Industrial',observacion:'Validación técnica especializada'},
  {id:'SOL-2026-0009',beneficiario:'Ana María López',dni:'47896521',distrito:'Sauna',origen:'Campo',estado:'Nueva',fecha:'2026-05-04',diasConstruccion:76,telefono:'+51 988 774 112',direccion:'Calle Primavera 33',tipo:'Residencial',observacion:'Pendiente revision'},
  {id:'SOL-2026-0010',beneficiario:'Juan Pérez Quispe',dni:'41234567',distrito:'Cajaruro',origen:'BONOGAS2.0',estado:'Observada',fecha:'2026-05-03',diasConstruccion:92,telefono:'+51 977 665 443',direccion:'Jr. Libertad 112',tipo:'Residencial',observacion:'Falta documento de propiedad'},
  {id:'SOL-2026-0011',beneficiario:'Comercial El Triunfo E.I.R.L.',dni:'RUC 20111222334',distrito:'Bagua',origen:'Web',estado:'En validación',fecha:'2026-05-02',diasConstruccion:58,telefono:'+51 966 554 332',direccion:'Av. Héroes 220',tipo:'Comercial',observacion:'Validación de planos'},
  {id:'SOL-2026-0012',beneficiario:'Rosa Paredes Huamán',dni:'46543219',distrito:'Yanahuara',origen:'Campo',estado:'Aprobada',fecha:'2026-05-01',diasConstruccion:41,telefono:'+51 944 332 118',direccion:'Calle Los Pinos 77',tipo:'Residencial',observacion:'Expediente conforme para instalación'}
];
let selectedSolicitudId=solicitudes[0].id;
let solicitudesPage=1;
let solicitudesKpiFilter='all';
let validacionesPage=1;
let validacionesKpiFilter='all';
const BONOGAS_PAGE_SIZE=5;
const BONOGAS_ORDER_IDS=new Set(['FISE-2025-0002489','FISE-2025-0002418','FISE-2025-0002301']);

function renderDataPagination(prefix,total,currentPage,pageSize){
  const key=prefix.toLowerCase();
  const totalPages=Math.max(1,Math.ceil(total/pageSize));
  const page=Math.min(Math.max(1,currentPage),totalPages);
  const first=total?((page-1)*pageSize)+1:0;
  const last=Math.min(page*pageSize,total);
  const summary=qs('#'+key+'PageSummary');
  const numbers=qs('#'+key+'PageNumbers');
  const root=qs('#'+key+'Pagination');
  if(summary)summary.textContent=total?`Mostrando ${first}–${last} de ${total} registros`:'Sin registros para mostrar';
  if(numbers)numbers.innerHTML=Array.from({length:totalPages},(_,i)=>`<button type="button" class="${i+1===page?'active':''}" data-${key}-page="${i+1}" aria-label="Página ${i+1}" aria-current="${i+1===page?'page':'false'}">${i+1}</button>`).join('');
  if(root){
    const prev=root.querySelector(`[data-${key}-page="prev"]`);
    const next=root.querySelector(`[data-${key}-page="next"]`);
    if(prev)prev.disabled=page<=1;
    if(next)next.disabled=page>=totalPages;
  }
  return page;
}
const validaciones=[
  {id:'VAL-2026-0001',solicitud:'SOL-2026-0001',beneficiario:'María Quispe Huamán',dni:'43567891',distrito:'Yanahuara',tipo:'Social',responsable:'Equipo Social',riesgo:'Medio',avance:72,estado:'Pendiente',nota:'Falta confirmar composición del hogar y titularidad del predio.',checks:[['Padrón social','done','Validado'],['Visita domiciliaria','warn','Pendiente'],['Cruce duplicidad','done','Sin alerta'],['Documentos de titularidad','warn','Por confirmar']]},
  {id:'VAL-2026-0002',solicitud:'SOL-2026-0002',beneficiario:'José Mamani Flores',dni:'40221876',distrito:'Sauna',tipo:'Documental',responsable:'Mesa FISE',riesgo:'Alto',avance:38,estado:'Observada',nota:'Documento de identidad legible, pero falta constancia de domicilio y firma en declaración jurada.',checks:[['DNI / identidad','done','Validado'],['Constancia de domicilio','obs','Faltante'],['Declaración jurada','obs','Sin firma'],['Autorización de tratamiento de datos','warn','Por revisar']]},
  {id:'VAL-2026-0003',solicitud:'SOL-2026-0003',beneficiario:'Bodega San Lázaro',dni:'RUC 20604588911',distrito:'Yanahuara',tipo:'Técnica',responsable:'Equipo Técnico',riesgo:'Bajo',avance:95,estado:'Conforme',nota:'Local con factibilidad técnica y punto de conexión identificado.',checks:[['Factibilidad de red','done','Conforme'],['Punto de conexión','done','Conforme'],['Seguridad interna','done','Conforme'],['Evidencia fotográfica','done','Cargada']]},
  {id:'VAL-2026-0004',solicitud:'SOL-2026-0004',beneficiario:'Rosa Condori Arias',dni:'46123988',distrito:'Bagua',tipo:'Geoespacial',responsable:'GIS / Catastro',riesgo:'Alto',avance:44,estado:'Observada',nota:'La coordenada del predio cae fuera de la cobertura declarada; requiere validación de campo.',checks:[['Ubicación GIS','obs','Fuera de cobertura'],['Cruce distrital','done','Correcto'],['Cobertura de red','warn','Cercana'],['Evidencia georreferenciada','warn','Pendiente']]},
  {id:'VAL-2026-0005',solicitud:'SOL-2026-0005',beneficiario:'Luis Apaza Quispe',dni:'41880932',distrito:'Cajaruro',tipo:'Social',responsable:'Equipo Social',riesgo:'Medio',avance:61,estado:'Pendiente',nota:'Cruce con padrón social en proceso; revisar priorización del beneficiario.',checks:[['Padrón social','warn','En proceso'],['Visita domiciliaria','done','Realizada'],['Ingreso declarado','warn','Por validar'],['Duplicidad','done','Sin alerta']]},
  {id:'VAL-2026-0006',solicitud:'SOL-2026-0006',beneficiario:'Elena Chávez Rojas',dni:'47201588',distrito:'Sauna',tipo:'Técnica',responsable:'Equipo Técnico',riesgo:'Bajo',avance:88,estado:'Conforme',nota:'Expediente técnico conforme. Pendiente programación final de instalación.',checks:[['Factibilidad técnica','done','Conforme'],['Materiales requeridos','done','Completos'],['Riesgos de instalación','done','Bajo'],['Programación de cuadrilla','warn','Pendiente']]}
];
let selectedValidacionId='FISE-2025-0002489';let selectedGnvDjValidacionId='DJ-2026-0001';let valLeafletMap=null;let valMorosityLayers=null;window.__validacionesContext='bonogas-payment';
const gnvDjRows=[
  {id:'DJ-2026-0001',beneficiario:'Maria Quispe Huaman',dni:'43567891',suministro:'5208079',instalacion:'INS-5208079',direccion:'Calle Los Sauces 120',empresa:'Instalaciones del Norte S.A.C.',ruc:'20548796321',representante:'Carlos Perez Salas',firma:'Detectada',fotos:'5/6',resultado:'Observada',estado:'Rechazada',fotoFachada:'ok',fotoGabinete:'warn',fotoAmbiente:'ok',fotoGas:'warn',alertas:['Foto de gabinete borrosa','Direccion incompleta segun BonoGas 2.0']},
  {id:'DJ-2026-0002',beneficiario:'Jose Mamani Flores',dni:'40221876',suministro:'913777',instalacion:'INS-913777',direccion:'Mz. B Lt. 08',empresa:'Gas & Hogar E.I.R.L.',ruc:'20604588911',representante:'Rosa Diaz Leon',firma:'Detectada',fotos:'6/6',resultado:'Observada',estado:'Subsanada',fotoFachada:'ok',fotoGabinete:'ok',fotoAmbiente:'ok',fotoGas:'ok',alertas:['DJ subsanada por empresa instaladora tras revision inicial']},
  {id:'DJ-2026-0003',beneficiario:'Rosa Condori Arias',dni:'46123988',suministro:'5410777',instalacion:'INS-5410777',direccion:'Jr. Amazonas 315',empresa:'Instalagas Peru S.A.C.',ruc:'20445566771',representante:'Luis Torres Vega',firma:'Detectada',fotos:'6/6',resultado:'Conforme',estado:'Aprobada',fotoFachada:'ok',fotoGabinete:'ok',fotoAmbiente:'ok',fotoGas:'ok',alertas:[]},
  {id:'DJ-2026-0004',beneficiario:'Pedro Salas Cordova',dni:'41880932',suministro:'5208122',instalacion:'INS-5208122',direccion:'Av. Los Incas 450',empresa:'Conexiones Seguras S.A.C.',ruc:'20445566112',representante:'Ana Ruiz Vega',firma:'Detectada',fotos:'6/6',resultado:'Conforme',estado:'Aprobada',fotoFachada:'ok',fotoGabinete:'ok',fotoAmbiente:'ok',fotoGas:'ok',alertas:[]},
  {id:'DJ-2026-0005',beneficiario:'Elena Chavez Rojas',dni:'47201588',suministro:'5208199',instalacion:'INS-5208199',direccion:'Pasaje Las Flores 18',empresa:'RedGas Contratistas',ruc:'20611223344',representante:'Miguel Salas',firma:'Detectada',fotos:'4/6',resultado:'Observada',estado:'Rechazada',fotoFachada:'ok',fotoGabinete:'warn',fotoAmbiente:'warn',fotoGas:'warn',alertas:['Numero de suministro inconsistente con BonoGas 2.0','Gasodomestico conectado no visible','Foto de ambiente borrosa']}
];
window.gnvDjRows=gnvDjRows;
window.bonogasDjRows=gnvDjRows;
const qs=s=>document.querySelector(s),qsa=s=>[...document.querySelectorAll(s)];

window.__MODULE_SIDEBAR_MAP={
  'bono gas':'bonogas',
  'vale fise':'vale-fise',
  'ahorro gnv':'ahorro-gnv',
  'fotovoltaico':'fotovoltaico',
  'masificacion':'masificacion',
  'masificación':'masificacion',
  'electricidad al toque':'electricidad-al-toque',
  'mcter':'mtcer',
  'mtcer':'mtcer'
};

window.__MODULE_HOME={
  'administrador':null,
  'bonogas':'navBonoSatcontrol',
  'vale-fise':'navValeFise',
  'ahorro-gnv':'navAhorroGnvSatcontrol',
  'fotovoltaico':'navFotovoltaico',
  'masificacion':'navMasificacionSatcontrol',
  'electricidad-al-toque':'navElectricidad',
  'mtcer':'navMcter'
};

function getSessionModule(){
  try{
    const params=new URLSearchParams(location.search);
    const fromUrl=params.get('modulo');
    if(fromUrl){
      sessionStorage.setItem('maqueteo_modulo',fromUrl);
      return fromUrl;
    }
    return sessionStorage.getItem('maqueteo_modulo')||'administrador';
  }catch(e){
    return 'administrador';
  }
}

function tagSidebarModuleKeys(){
  qsa('.sidebar .nav-accordion').forEach(function(li){
    if(li.getAttribute('data-mod-key')) return;
    const label=li.querySelector('.nav-accordion-toggle .nav-label');
    if(!label) return;
    const key=window.__MODULE_SIDEBAR_MAP[label.textContent.trim().toLowerCase()]||'general';
    li.setAttribute('data-mod-key',key);
  });
}

function applyModuleFilter(sel){
  sel=sel||getSessionModule();
  try{ sessionStorage.setItem('maqueteo_modulo',sel); }catch(e){}
  document.documentElement.setAttribute('data-module-scope',sel);
  const sidebar=qs('#sidebar');
  if(sidebar) sidebar.setAttribute('data-module-scope',sel);
  tagSidebarModuleKeys();
  const items=qsa('.sidebar .nav-accordion');
  if(!sel||sel==='administrador'){
    items.forEach(function(li){
      li.classList.add('mod-visible');
      li.style.removeProperty('display');
    });
    return;
  }
  items.forEach(function(li){
    const k=li.getAttribute('data-mod-key');
    const show=k===sel;
    li.classList.toggle('mod-visible',show);
    if(show){
      const btn=li.querySelector('.nav-accordion-toggle');
      if(btn){
        btn.setAttribute('aria-expanded','true');
        li.classList.add('open');
        const chevron=btn.querySelector('.nav-chevron');
        if(chevron) chevron.textContent='expand_more';
      }
    }else{
      li.classList.remove('open');
    }
  });
}

function goToModuleHome(sel){
  const navId=window.__MODULE_HOME[sel];
  if(!navId) return;
  const link=document.getElementById(navId);
  if(!link) return;
  const accordion=link.closest('.nav-accordion');
  if(accordion){
    accordion.classList.add('open');
    const toggle=accordion.querySelector('.nav-accordion-toggle');
    if(toggle){
      toggle.setAttribute('aria-expanded','true');
      const chevron=toggle.querySelector('.nav-chevron');
      if(chevron) chevron.textContent='expand_more';
    }
  }
  link.click();
}

function openModuleAfterLogin(mod){
  const openMap={
    'vale-fise':function(){ openIntegratedModule('vale','SATCONTROL'); },
    'ahorro-gnv':function(){ openIntegratedModule('gnv','SATCONTROL'); },
    'fotovoltaico':function(){ openIntegratedModule('fotovoltaico','SATCONTROL'); },
    'masificacion':function(){ openIntegratedModule('masificacion','SATCONTROL'); },
    'electricidad-al-toque':function(){ openIntegratedModule('electricidad','SATCONTROL'); },
    'mtcer':function(){ openIntegratedModule('mcter','SATCONTROL'); },
    'bonogas':function(){
      if(typeof openBonogasSatcontrol==='function') openBonogasSatcontrol();
      else qs('#navBonoSatcontrol')?.click();
    }
  };
  if(openMap[mod]) openMap[mod]();
  else if(mod==='administrador'&&typeof openSatcontrolView==='function') openSatcontrolView();
}

function doLogout(ev){
  if(ev) ev.preventDefault();
  try{
    sessionStorage.removeItem('maqueteo_logged_in');
    sessionStorage.removeItem('maqueteo_modulo');
  }catch(e){}
  location.href='login/login.html';
}
function tone(s){return s==='Aprobado'?'ok':s==='Observado'?'obs':'eval'}
function daysSince(startDate){const start=new Date(startDate+'T00:00:00');const today=new Date();return Math.max(0,Math.round((today-start)/(1000*60*60*24)));}
function formatElapsed(startDate,status){if(status==='Conectado')return 'Finalizada';const days=daysSince(startDate);return days+' días desde inicio de construcción'}
function constructionDeadlineDays(data){const text=normalizeText((data&&data.tipoSuministro)||'');return /no residencial|comercial/.test(text)?90:20;}
function supplyDeadlineInfo(data){const d=normalizeSelectedRecord(data||{});const limit=constructionDeadlineDays(d);const days=d.inicioConstruccion&&d.inicioConstruccion!=='Pendiente de habilitación'?daysSince(d.inicioConstruccion):null;const commercial=/no residencial|comercial/.test(normalizeText((d.tipoSuministro||d.tipo||'')));const within=d.estadoInstalacion!=='En construcción'?true:(days===null?true:days<=limit);return {limit,days,within,commercial};}
function supplyColorScheme(data){const d=normalizeSelectedRecord(data||{});const info=supplyDeadlineInfo(d);if(d.estadoInstalacion==='Penalizado')return {color:'#fb923c',fill:'#f97316',tooltip:'Penalizado'};if(d.estadoInstalacion==='Conectado')return {color:'#22d3ee',fill:'#67e8f9',tooltip:'Conectado'};if(info.within)return info.commercial?{color:'#2563eb',fill:'#38bdf8',tooltip:`En plazo (${info.days===null?'--':info.days}/${info.limit} días)`}:{color:'#16a34a',fill:'#4ade80',tooltip:`En plazo (${info.days===null?'--':info.days}/${info.limit} días)`};return {color:'#ef4444',fill:'#f87171',tooltip:`Fuera de plazo (${info.days===null?'--':info.days}/${info.limit} días)`};}
function supplyPopupHtml(data){const d=normalizeSelectedRecord(data||{});const info=supplyDeadlineInfo(d);const deadlineText=info.days===null?'Sin inicio registrado':`${info.days}/${info.limit} días`;const status=info.within?'Dentro de plazo':'Fuera de plazo';return `<b>${d.suministro||'Suministro'} · ${d.beneficiario||'Beneficiario'}</b><br>N° Suministro: ${d.suministro||'-'}<br>Nombre: ${d.beneficiario||'-'}<br>Tipo: ${d.tipoSuministro||'-'}<br>Empresa instaladora GNR: ${d.empresaInstaladora||'-'}<br>Monto pendiente de recaudación: ${formatMoney(d.montoPendiente||0)}<br>Estado territorial: ${d.estadoInstalacion||'-'}<br>Plazo regulatorio: ${status} · ${deadlineText}`;}
function addDaysIso(dateStr,days){const d=new Date((dateStr&&dateStr!=='Pendiente de habilitación'?dateStr:new Date().toISOString().slice(0,10))+'T00:00:00');d.setDate(d.getDate()+days);return d.toISOString().slice(0,10);}
function formatTimelineDate(dateStr,time='09:15'){if(!dateStr||dateStr==='Pendiente de habilitación')return 'Pendiente';const [y,m,d]=dateStr.split('-');return `${d}/${m}/${y} ${time}`;}
function expedienteTimeline(data){const d=normalizeSelectedRecord(data||{});const start=d.inicioConstruccion&&d.inicioConstruccion!=='Pendiente de habilitación'?d.inicioConstruccion:(d.fechaInstalacion&&d.fechaInstalacion!=='Pendiente de habilitación'?d.fechaInstalacion:new Date().toISOString().slice(0,10));const install=d.fechaInstalacion&&d.fechaInstalacion!=='Pendiente de habilitación'?d.fechaInstalacion:null;const hab=install?addDaysIso(install,5):null;const solLiq=hab?addDaysIso(hab,3):null;const liq=solLiq?addDaysIso(solLiq,7):null;const rec=liq?addDaysIso(liq,14):null;const estado=d.estadoInstalacion||'En evaluación';const isLiquidado=estado==='Liquidado'||estado==='Conectado';const isHabilitado=install||isLiquidado;const isPendienteLiq=isHabilitado&&!isLiquidado;return [{label:'Registro',date:formatTimelineDate(start,'09:15'),state:'done',icon:'<svg class="svg-icon" aria-hidden="true"><use href="#i-check"></use></svg>'},{label:'Instalación Interna',date:install?formatTimelineDate(install,'10:30'):'Pendiente',state:install?'done':'current',icon:install?'<svg class="svg-icon" aria-hidden="true"><use href="#i-check"></use></svg>':'•'},{label:'Habilitación',date:hab?formatTimelineDate(hab,'11:05'):'Pendiente',state:hab?'done':(install?'current':'pending'),icon:hab?'<svg class="svg-icon" aria-hidden="true"><use href="#i-check"></use></svg>':'▣'},{label:'Solicitud de Liquidación',date:solLiq?formatTimelineDate(solLiq,'09:18'):'Pendiente',state:solLiq?'done':(hab?'current':'pending'),icon:solLiq?'<svg class="svg-icon" aria-hidden="true"><use href="#i-check"></use></svg>':'▣'},{label:'Liquidación',date:liq?formatTimelineDate(liq,'14:20'):'Pendiente',state:liq?'done':(solLiq?'current':'pending'),icon:liq?'<svg class="svg-icon" aria-hidden="true"><use href="#i-check"></use></svg>':'▣'},{label:'Recaudación',date:rec?formatTimelineDate(rec,'16:00'):'Pendiente',state:isLiquidado?'done':(liq?'current':'pending'),icon:isLiquidado?'<svg class="svg-icon" aria-hidden="true"><use href="#i-check"></use></svg>':'▣'}];}
function renderMapTimeline(data){const panel=qs('#mapTimelinePanel'),track=qs('#timelineTrack'),title=qs('#timelineTitle'),shell=qs('.map-shell');if(!panel||!track)return;if(!data){panel.classList.remove('open');shell?.classList.remove('timeline-open');shell?.classList.remove('timeline-right-open');return;}const d=normalizeSelectedRecord(data);title.textContent='Expediente · '+(d.beneficiario||'Usuario')+' · '+(d.suministro||'Suministro');track.innerHTML=expedienteTimeline(d).map(step=>`<div class="timeline-step"><div class="timeline-dot ${step.state}">${step.icon}</div><div class="timeline-step-text"><b>${step.label}</b><span>${step.date}</span>${step.label==='Liquidación'?'<small>'+((d.estadoInstalacion==='Conectado')?'Pendiente':'En proceso')+'</small>':''}</div></div>`).join('');panel.classList.add('open');shell?.classList.add('timeline-open');shell?.classList.toggle('timeline-right-open',panel.classList.contains('dock-right'));}
function setTimelineDock(mode){const panel=qs('#mapTimelinePanel'),shell=qs('.map-shell');if(!panel)return;panel.classList.remove('dock-bottom','dock-right','floating');shell?.classList.remove('timeline-right-open');if(mode==='right'){panel.classList.add('dock-right');panel.style.left='';panel.style.top='';panel.style.right='';panel.style.bottom='';shell?.classList.add('timeline-right-open');showToast('Línea de tiempo acoplada a la derecha');}else if(mode==='bottom'){panel.classList.add('dock-bottom');panel.style.left='';panel.style.top='';panel.style.right='';panel.style.bottom='';showToast('Línea de tiempo acoplada abajo');}else{panel.classList.add('floating');}}
function clampTimelinePosition(panel){const parent=panel.closest('.map-shell')||panel.parentElement;if(!parent)return;const parentRect=parent.getBoundingClientRect();const rect=panel.getBoundingClientRect();let left=rect.left-parentRect.left,top=rect.top-parentRect.top;const maxLeft=parentRect.width-rect.width-8,maxTop=parentRect.height-rect.height-8;left=Math.max(8,Math.min(left,maxLeft));top=Math.max(8,Math.min(top,maxTop));panel.style.left=left+'px';panel.style.top=top+'px';panel.style.right='auto';panel.style.bottom='auto';}
function enableTimelineDrag(){const panel=qs('#mapTimelinePanel'),handle=qs('#timelineDragHandle'),mapShell=qs('.map-shell');if(!panel||!handle||!mapShell||panel.dataset.dragReady==='1')return;panel.dataset.dragReady='1';let dragging=false,startX=0,startY=0,startLeft=0,startTop=0;function onPointerMove(e){if(!dragging)return;const dx=e.clientX-startX,dy=e.clientY-startY;panel.classList.remove('dock-bottom','dock-right');panel.classList.add('floating');mapShell.classList.remove('timeline-right-open');panel.style.left=(startLeft+dx)+'px';panel.style.top=(startTop+dy)+'px';panel.style.right='auto';panel.style.bottom='auto';}
function onPointerUp(){if(!dragging)return;dragging=false;document.removeEventListener('pointermove',onPointerMove);document.removeEventListener('pointerup',onPointerUp);clampTimelinePosition(panel);const shellRect=mapShell.getBoundingClientRect();const rect=panel.getBoundingClientRect();const centerX=rect.left+rect.width/2;if(centerX>shellRect.left+shellRect.width*.78){setTimelineDock('right');}else if(rect.top>shellRect.top+shellRect.height*.72){setTimelineDock('bottom');}else{panel.classList.remove('dock-right','dock-bottom');panel.classList.add('floating');mapShell.classList.remove('timeline-right-open');clampTimelinePosition(panel);}}
handle.addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;dragging=true;const rect=panel.getBoundingClientRect();const shellRect=mapShell.getBoundingClientRect();if(panel.classList.contains('dock-bottom')||panel.classList.contains('dock-right')){panel.style.left=(rect.left-shellRect.left)+'px';panel.style.top=(rect.top-shellRect.top)+'px';panel.style.right='auto';panel.style.bottom='auto';panel.classList.remove('dock-bottom','dock-right');panel.classList.add('floating');mapShell.classList.remove('timeline-right-open');}startX=e.clientX;startY=e.clientY;startLeft=parseFloat(panel.style.left||0);startTop=parseFloat(panel.style.top||0);document.addEventListener('pointermove',onPointerMove);document.addEventListener('pointerup',onPointerUp);});}
function objectId(data){if(data&&data._geoJsonFeature)return 'GEOJSON-'+(data.loteId||data.suministro||data._geoIndex||Math.random());return data.suministro||data.loteId||('OBJ-'+(data.estrato||'X')+'-'+(data.hogares||0)+'-'+(data.beneficiario||data.estado||Math.random()))}
function normalizeSelectedRecord(data){const isGeoJson=!!data._geoJsonFeature;const isLot=!isGeoJson&&!!data.estrato&&!data.lat;const estado=data.estadoInstalacion||data.estado||'En evaluación';return Object.assign({},data,{objectType:isGeoJson?(data.objectType||'Elemento GeoJSON'):(isLot?'Lote / área censal':'Vivienda / suministro'),beneficiarios:data.beneficiarios||data.hogares||1,liquidacion:data.liquidacion||((data.hogares||1)*(estado==='Conectado'?950:520)),estadoInstalacion:estado,servicioElectrico:data.servicioElectrico||(data.estrato==='Bajo'?'Sin servicio':'Con servicio'),cocinaGLP:data.cocinaGLP||(estado==='Conectado'?'Sí':'No'),tipoCombustible:data.tipoCombustible||(data.tipoSuministro==='No residencial'?'GLP':'Gas natural'),sexo:data.sexo||(isLot?'No aplica':'Masculino')});}
function rowHtml(label,value){if(value===undefined||value===null||value==='')return '';return `<div class="supply-item"><span>${label}</span><b>${value}</b></div>`}
function isBonogasSatcontrolView(){const m=qs('.main');return !!(m&&m.classList.contains('bonogas-satcontrol-mode')&&m.classList.contains('bonogas-active'));}
function bonogasDisplayEstrato(d){if(!d)return '-';if(d.estratoLabel)return d.estratoLabel;if(d.estratoSocioeconomico!=null&&String(d.estratoSocioeconomico)!=='')return 'Estrato '+d.estratoSocioeconomico;return d.estrato||'-';}
function installerLinkHtml(companyName){
  const name=String(companyName||'').trim();
  if(!name||name==='-'||name==='Sin empresa')return '-';
  const safe=name.replace(/"/g,'&quot;');
  return `<button class="installer-link" type="button" data-installer-name="${safe}" title="Ver ranking e histórico"><span class="rank-mini"><svg class="svg-icon" aria-hidden="true"><use href="#i-star"></use></svg></span>${name}</button>`;
}
function ensureSupplyInstallerLinks(){
  const box=qs('#supplyDetails');
  if(!box||box.dataset.installerLinksReady==='1')return;
  box.dataset.installerLinksReady='1';
  box.addEventListener('click',function(e){
    const btn=e.target.closest('[data-installer-name]');
    if(!btn||!box.contains(btn))return;
    e.preventDefault();
    e.stopPropagation();
    if(typeof openInstallerRanking==='function')openInstallerRanking(btn.dataset.installerName);
  });
}
function enrichBonogasDetailRecord(data){const d=normalizeSelectedRecord(data||{});const numInst=d.numeroInstalacion||d.nInstalacion||d.instalacion||(d.suministro?('INS-'+String(d.suministro).replace(/\D/g,'').slice(-6).padStart(6,'0')):'-');const costo=Number(d.costoInstalacion!=null?d.costoInstalacion:(d.liquidacion||2540));const pct=Number(d.porcentajeSubsidio!=null?d.porcentajeSubsidio:72);const sub=Number(d.montoSubsidiado!=null?d.montoSubsidiado:Math.round(costo*pct/100));const fin=Number(d.montoFinanciado!=null?d.montoFinanciado:Math.max(0,costo-sub));const cuotasTot=Number(d.cuotasTotales||d.numeroCuotas||12);const pend=Number(d.montoPendiente!=null?d.montoPendiente:Math.max(0,fin-Math.round(fin*0.45)));const ratioPag=fin>0?Math.max(0,Math.min(1,1-pend/fin)):0;const cuotasPag=Number(d.cuotasPagadas!=null?d.cuotasPagadas:Math.round(cuotasTot*ratioPag));const cuotasPen=Number(d.cuotasPendientes!=null?d.cuotasPendientes:Math.max(0,cuotasTot-cuotasPag));return Object.assign({},d,{numeroInstalacion:numInst,tipoBeneficiario:d.tipoBeneficiario||d.tipoSuministro||'Residencial',fechaRegistroPortal:d.fechaRegistro||d.fechaRegistroPortal||(d.inicioConstruccion?String(d.inicioConstruccion).slice(0,10):'-'),fechaHabilitacion:d.fechaHabilitacion||(d.fechaInstalacion&&d.fechaInstalacion!=='Pendiente de habilitación'?d.fechaInstalacion:'Pendiente'),materialInstalacion:d.materialInstalacion||'Cobre recocido y PEAD',tipoAcometida:d.tipoAcometida||'Simple',tipoMedidor:d.tipoMedidor||'Diafragma residencial G4',costoInstalacion:costo,porcentajeSubsidio:pct,montoSubsidiado:sub,montoFinanciado:fin,suministroActivo:d.suministroActivo||(cuotasPen>0&&pend>0?'Sí':'Sí'),cuotaMensual:Number(d.cuotaMensual!=null?d.cuotaMensual:Math.max(35,Math.round(fin/Math.max(cuotasTot,1)))),cuotasTotales:cuotasTot,cuotasPagadas:cuotasPag,cuotasPendientes:cuotasPen,montoPendiente:pend,estrato:bonogasDisplayEstrato(d),concesionaria:d.concesionaria||'-'});}
function resolveBonogasDetailRecord(data){const base=normalizeSelectedRecord(data||{});const _nrm=function(v){return String(v||'').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu,'');};let match=(window._enrichedBeneficiarios||[]).find(function(x){return (base.suministro&&x.suministro===base.suministro)||_nrm(x.beneficiario||'')===_nrm(base.beneficiario||'');});if(!match&&typeof bonogasMapRows==='function'){match=bonogasMapRows().find(function(x){return (base.suministro&&x.suministro===base.suministro)||_nrm(x.beneficiario||'')===_nrm(base.beneficiario||'');});}return enrichBonogasDetailRecord(match?Object.assign({},base,match):base);}
function objectRows(data){return supplySectionRows(data)+collectionSectionRows(data);}
function supplySectionRows(data){const d=enrichBonogasDetailRecord(data);const empresaVal=isBonogasSatcontrolView()?installerLinkHtml(d.empresaInstaladora):(d.empresaInstaladora||'-');return rowHtml('N.° de suministro',d.suministro||'-')+rowHtml('N.° de instalación',d.numeroInstalacion||'-')+rowHtml('Nombre del beneficiario',d.beneficiario||'-')+rowHtml('Tipo de beneficiario',d.tipoBeneficiario||d.tipoSuministro||'-')+rowHtml('Fecha de registro en portal',d.fechaRegistroPortal||d.fechaRegistro||'-')+rowHtml('Fecha de habilitación',d.fechaHabilitacion||'-')+rowHtml('Estrato',d.estrato||'-')+rowHtml('Material de instalación',d.materialInstalacion||'-')+rowHtml('Empresa instaladora',empresaVal)+rowHtml('Tipo de acometida',d.tipoAcometida||'-')+rowHtml('Tipo de medidor',d.tipoMedidor||'-');}
function collectionSectionRows(data){const d=enrichBonogasDetailRecord(data);const subLabel=formatMoney(d.montoSubsidiado)+' ('+d.porcentajeSubsidio+'%)';const cuotasTot=Number(d.cuotasTotales||12);const cuotasPag=Number(d.cuotasPagadas||0);const cuotasPen=Number(d.cuotasPendientes!=null?d.cuotasPendientes:Math.max(0,cuotasTot-cuotasPag));return rowHtml('Costo de instalación (liquidación)',formatMoney(d.costoInstalacion||d.liquidacion||0))+rowHtml('Monto subsidiado',subLabel)+rowHtml('Monto a financiar',formatMoney(d.montoFinanciado||0))+rowHtml('Suministro activo',d.suministroActivo||'-')+rowHtml('Valor de cuota mensual',formatMoney(d.cuotaMensual||0))+rowHtml('Cuotas pagadas',cuotasPag+' / '+cuotasTot)+rowHtml('Cuotas pendientes',String(cuotasPen))+rowHtml('Monto pendiente de recaudación',formatMoney(d.montoPendiente||0));}
function renderSupplyDetails(data){const box=qs('#supplyDetails');if(!box)return;box.style.display='';if(selectedObjects.length>1){const stats=summarizeRecords(activeSelectionRecords);box.className='supply-card';box.innerHTML=`<div class="selection-head"><h3>Objetos seleccionados (${selectedObjects.length})</h3><button class="selection-clear" onclick="clearObjectSelection()">Limpiar</button></div><p class="selection-note">Selección múltiple activa. Use Ctrl + clic para agregar o retirar viviendas/lotes del conjunto.</p><div class="selection-kpis"><div class="selection-kpi"><span>Suministros / lotes</span><b>${stats.total}</b></div><div class="selection-kpi"><span>Beneficiarios</span><b>${stats.beneficiarios}</b></div><div class="selection-kpi"><span>Conectados</span><b>${stats.conectados}</b></div><div class="selection-kpi"><span>Liquidación</span><b>${formatMoney(stats.liquidacion)}</b></div></div><div class="selection-list">${selectedObjects.map(o=>{const d=normalizeSelectedRecord(o.data);return `<div class="selection-mini"><b>${d.suministro||d.beneficiario||('Lote estrato '+(d.estrato||'-'))}</b><span>${d.objectType} · ${d.estadoInstalacion} · ${formatMoney(d.liquidacion||0)}</span></div>`}).join('')}</div>`;renderMapTimeline(null);return;}if(!data){box.className='supply-card empty';box.innerHTML='<h3>Detalle de suministro</h3><p class="supply-hint">Seleccione un lote o vivienda en el mapa. Mantenga presionada la tecla Ctrl y haga clic para seleccionar varios objetos individualmente.</p>';renderMapTimeline(null);return;}const d=normalizeSelectedRecord(data);if(d._geoJsonFeature){const props=d._geoJsonProps||{};const rows=Object.keys(props).slice(0,14).map(function(k){return rowHtml(String(k).replace(/_/g,' '),props[k]);}).join('');box.className='supply-card';box.innerHTML=`<div class="selection-head"><h3>Elemento GeoJSON</h3>${selectedObjects.length?'<button class="selection-clear" onclick="clearObjectSelection()">Limpiar</button>':''}</div><p class="selection-note">${d.objectType||'Capa cargada'} · ${d._geoJsonLayerName||'GeoJSON'}</p><div class="supply-section-title">Atributos del elemento</div><div class="supply-grid">${rows||rowHtml('Elemento',d.suministro||'-')}</div>`;renderMapTimeline(null);return;}const detailData=isBonogasSatcontrolView()?resolveBonogasDetailRecord(data):d;const supplyTitle=isBonogasSatcontrolView()?'Datos del Suministro (Portal de Habilitaciones y BonoGas 2.0)':'Datos del Suministro';const collTitle=isBonogasSatcontrolView()?'Datos de Recaudación (BonoGas 2.0)':'Datos de Recaudación';box.className='supply-card';box.innerHTML=`<div class="selection-head"><h3>${selectedObjects.length?'Objeto seleccionado':'Detalle de suministro'}</h3>${selectedObjects.length?'<button class="selection-clear" onclick="clearObjectSelection()">Limpiar</button>':''}</div><p class="selection-note">Portal de Habilitaciones · BonoGas 2.0 · ${detailData.estadoInstalacion||'Sin estado'}</p><div class="supply-section-title">${supplyTitle}</div><div class="supply-grid">${supplySectionRows(detailData)}</div><div class="supply-section-title">${collTitle}</div><div class="supply-grid">${collectionSectionRows(detailData)}</div>`;const isUserRecord=!!(detailData.suministro&&detailData.beneficiario);renderMapTimeline(isUserRecord?detailData:null);}
function formatMoney(n){return 'S/ '+Math.round(n).toLocaleString('es-PE')}
function summarizeRecords(records){const total=records.length;const conectados=records.filter(r=>r.estadoInstalacion==='Conectado').length;const construccion=records.filter(r=>r.estadoInstalacion==='En construcción').length;const penalizados=records.filter(r=>r.estadoInstalacion==='Penalizado').length;const beneficiarios=records.reduce((s,r)=>s+(r.beneficiarios||1),0);const liquidacion=records.reduce((s,r)=>s+(r.liquidacion||0),0);const pendiente=records.reduce((s,r)=>s+(r.montoPendiente||0),0);return {total,conectados,construccion,penalizados,beneficiarios,liquidacion,pendiente};}
function areaSummaryHtml(stats,title='Resumen del área seleccionada'){const maxValue=Math.max(stats.total,stats.conectados,stats.construccion,stats.penalizados||0,stats.beneficiarios,1);const bar=(label,value)=>`<div class="area-bar"><span>${label}</span><div class="area-bar-track"><div class="area-bar-fill" style="width:${Math.max(8,(value/maxValue)*100)}%"></div></div><b>${value}</b></div>`;return `<h3>${title}</h3><p class="area-sub">Estadística calculada con los suministros ubicados dentro del área circunscrita.</p><div class="area-kpis"><div class="area-kpi"><span>Suministros</span><b>${stats.total}</b></div><div class="area-kpi"><span>Conectados</span><b>${stats.conectados}</b></div><div class="area-kpi"><span>En construcción</span><b>${stats.construccion}</b></div><div class="area-kpi"><span>Penalizados</span><b>${stats.penalizados||0}</b></div><div class="area-kpi"><span>Beneficiarios</span><b>${stats.beneficiarios}</b></div></div><div class="area-money"><span>Total liquidaciones</span><b>${formatMoney(stats.liquidacion)}</b></div><div class="area-money"><span>Total morosidad</span><b>${formatMoney(stats.pendiente||0)}</b></div><div class="area-bars">${bar('Suministros',stats.total)}${bar('Conectados',stats.conectados)}${bar('Construcción',stats.construccion)}${bar('Penalizados',stats.penalizados||0)}${bar('Beneficiarios',stats.beneficiarios)}</div>`;}
function renderAreaStats(stats,title='Resumen del área seleccionada'){const box=qs('#areaStatsDetails');if(!box)return;if(!stats){box.className='area-summary empty';box.innerHTML='<h3>Resumen del área seleccionada</h3><p class="area-sub">Dibuje un círculo o polígono para calcular conexiones, beneficiarios, liquidaciones y total de morosidad dentro del área.</p>';return;}box.className='area-summary';box.innerHTML=areaSummaryHtml(stats,title);}
function getChartDataset(records,filterKey){let leftLabel='',rightLabel='',leftValue=0,rightValue=0,title='';if(filterKey==='servicioElectrico'){title='Servicio eléctrico';leftLabel='Con servicio';rightLabel='Sin servicio';leftValue=records.filter(r=>r.servicioElectrico==='Con servicio').length;rightValue=records.filter(r=>r.servicioElectrico==='Sin servicio').length;}if(filterKey==='cocinaGLP'){title='Cocina GLP';leftLabel='Sí';rightLabel='No';leftValue=records.filter(r=>r.cocinaGLP==='Sí').length;rightValue=records.filter(r=>r.cocinaGLP==='No').length;}if(filterKey==='tipoCombustible'){title='Tipo combustible';leftLabel='Gas natural';rightLabel='GLP';leftValue=records.filter(r=>r.tipoCombustible==='Gas natural').length;rightValue=records.filter(r=>r.tipoCombustible==='GLP').length;}if(filterKey==='estadoInstalacion'){title='Estado beneficiario';leftLabel='Conectado';rightLabel='Pendiente / penalizado';leftValue=records.filter(r=>r.estadoInstalacion==='Conectado').length;rightValue=records.filter(r=>r.estadoInstalacion==='En construcción'||r.estadoInstalacion==='Penalizado').length;}if(filterKey==='sexo'){title='Sexo';leftLabel='Masculino';rightLabel='Femenino';leftValue=records.filter(r=>r.sexo==='Masculino').length;rightValue=records.filter(r=>r.sexo==='Femenino').length;}if(filterKey==='beneficiarios'){title='Beneficiarios';leftLabel='Titulares';rightLabel='Registros';leftValue=records.reduce((s,r)=>s+(r.beneficiarios||1),0);rightValue=records.length;}return {title,leftLabel,rightLabel,leftValue,rightValue};}
function renderDonutChart(records,filterKey=currentStatsFilter,sourceLabel='Agrupación seleccionada'){if(typeof isBonogasMapContext==='function'&&isBonogasMapContext())return;const chart=qs('#donutChart');if(!chart)return;const data=getChartDataset(records,filterKey);const total=Math.max(data.leftValue+data.rightValue,1);const percent=Math.round((data.leftValue/total)*100);qs('#donutTitle').textContent='Estadística · '+data.title;qs('#donutSubtitle').textContent='Fuente: '+sourceLabel;qs('#donutCases').textContent=data.leftValue+data.rightValue;qs('#donutLegendA').textContent='■ '+data.leftLabel+' ('+data.leftValue+')';qs('#donutLegendB').textContent='■ '+data.rightLabel+' ('+data.rightValue+')';chart.style.background=`conic-gradient(#22d3ee 0 ${percent}%, #31c48d ${percent}% 100%)`;}
function escHtml(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function projectEstadoTone(s){if(s==='Aprobado'||/ejecuci/i.test(String(s||'')))return 'ok';if(/observ/i.test(String(s||'')))return 'obs';return 'eval';}
function projectSupplyStatsForPanel(p){const rows=(currentSupplyRecords||window.currentSupplyRecords||[]).filter(r=>!r.projectId||r.projectId===p.id);const stats={liquidados:0,pendientes:0,dentro:0,fuera:0};rows.forEach(function(r){const s=String(r.estadoInstalacion||r.estado||'');if(/^liquidado$/i.test(s)||(/conectado|habil/i.test(s)&&!/pendiente/i.test(s)))stats.liquidados++;else if(/pendiente.*liquid/i.test(s))stats.pendientes++;else if(/fuera de plazo/i.test(s)||r.within===false&&/construc/i.test(s))stats.fuera++;else if(/dentro de plazo/i.test(s)||/construc/i.test(s))stats.dentro++;});return stats;}
function refreshActiveProjectPanel(){const p=currentProject();if(!p)return;const box=qs('#details');if(box)box.classList.remove('project-details-hidden');const bonogas=typeof isBonogasSatcontrolView==='function'&&isBonogasSatcontrolView();if(qs('#infoContextLabel'))qs('#infoContextLabel').textContent=bonogas?'Información seleccionada':'Agrupación activa:';if(qs('#infoName'))qs('#infoName').textContent=p.nombre;if(qs('#infoPlace'))qs('#infoPlace').textContent=p.distrito+' · '+p.provincia+' – '+p.departamento;renderProjectDetailsPanel(p);if(bonogas&&typeof window.renderBonogasProjectBeneficiaryTable==='function'){const rows=typeof window.getBonogasFilteredRows==='function'?window.getBonogasFilteredRows():window.currentSupplyRecords||[];window.renderBonogasProjectBeneficiaryTable(p,rows);}}
function hideProjectDetailsPanel(){const box=qs('#details');if(box){box.className='project-details project-details-hidden';box.innerHTML='';}}
function updateSelectionPanelHeader(contextLabel,name,place){hideProjectDetailsPanel();if(qs('#infoContextLabel'))qs('#infoContextLabel').textContent=contextLabel||'Selección:';if(qs('#infoName'))qs('#infoName').textContent=name||'SELECCIONADO';if(qs('#infoPlace'))qs('#infoPlace').textContent=place||'';}
function renderProjectDetailsPanel(p){if(!p)return;const box=qs('#details');if(!box)return;box.className='project-details project-details-bordered';const stats=projectSupplyStatsForPanel(p);const estadoTone=projectEstadoTone(p.estado);const responsables=(p.responsables||[]).join(', ');const bonogas=typeof isBonogasSatcontrolView==='function'&&isBonogasSatcontrolView();box.innerHTML='<div class="project-details-card"><div class="project-details-card-head"><div>'+(bonogas?'':'<h3>'+escHtml(p.nombre)+'</h3>')+'<p>'+escHtml(p.id)+'</p></div><span class="pill '+estadoTone+'">'+escHtml(p.estado||'—')+'</span></div><dl class="project-details-grid project-details-grid-compact"><div class="project-details-row"><dt>Ubicación</dt><dd>'+escHtml(p.distrito+' · '+p.provincia+' – '+p.departamento)+'</dd></div><div class="project-details-row"><dt>Beneficiarios</dt><dd>'+escHtml(String(p.beneficiarios||0))+'</dd></div><div class="project-details-row"><dt>Área</dt><dd>'+escHtml(p.area||'—')+'</dd></div><div class="project-details-row"><dt>Líder</dt><dd>'+escHtml(p.lider||'—')+'</dd></div><div class="project-details-row"><dt>Responsables</dt><dd>'+escHtml(responsables||'—')+'</dd></div></dl><div class="project-status-breakdown project-status-breakdown-compact"><div class="project-status-item liquidados"><i aria-hidden="true"></i><span>Liquidados</span><b>'+stats.liquidados+'</b></div><div class="project-status-item pendientes"><i aria-hidden="true"></i><span>Pendientes</span><b>'+stats.pendientes+'</b></div><div class="project-status-item dentro"><i aria-hidden="true"></i><span>Dentro plazo</span><b>'+stats.dentro+'</b></div><div class="project-status-item fuera"><i aria-hidden="true"></i><span>Fuera plazo</span><b>'+stats.fuera+'</b></div></div></div>';}
function currentProject(){return projects.find(x=>x.id===selectedId)||projects[0];}
function exportContextRecords(){const records=activeSelectionRecords.length?activeSelectionRecords:(activeAreaRecords.length?activeAreaRecords:currentSupplyRecords);const sourceLabel=activeSelectionRecords.length?'Objetos seleccionados':(activeAreaRecords.length?'Área seleccionada':(isBonogasSatcontrolView()?'Filtros activos · BONOGAS':'Agrupación seleccionada'));const mapped=records.map(function(r){return isBonogasSatcontrolView()?resolveBonogasDetailRecord(r):normalizeSelectedRecord(r);});return {records:mapped,sourceLabel};}
function excelSafe(value){return String(value??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function excelTable(title,headers,rows){return `<h2>${excelSafe(title)}</h2><table border="1"><thead><tr>${headers.map(h=>`<th>${excelSafe(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(v=>`<td>${excelSafe(v)}</td>`).join('')}</tr>`).join('')}</tbody></table><br>`;}
async function institutionalExportLogo(path,fallback){try{let response=await fetch(path);if(!response.ok&&fallback)response=await fetch(fallback);if(!response.ok)return null;const blob=await response.blob();return await new Promise(resolve=>{const url=URL.createObjectURL(blob),img=new Image();img.onload=()=>{const canvas=document.createElement('canvas');canvas.width=480;canvas.height=240;const ctx=canvas.getContext('2d'),scale=Math.min(480/img.naturalWidth,240/img.naturalHeight),w=img.naturalWidth*scale,h=img.naturalHeight*scale;ctx.clearRect(0,0,480,240);ctx.drawImage(img,(480-w)/2,(240-h)/2,w,h);URL.revokeObjectURL(url);resolve(canvas.toDataURL('image/png'));};img.onerror=()=>{URL.revokeObjectURL(url);resolve(null);};img.src=url;});}catch(error){return null;}}
async function downloadExcelFile(filename,html){const logos=await Promise.all([institutionalExportLogo('log_fise.png','fise-logo.svg'),institutionalExportLogo('logopaulet.png')]);if(!html.includes('data-export-brand')){const brand=`<div data-export-brand style="height:68px;display:flex;align-items:center;gap:5px;border-bottom:3px solid #0ea5e9;margin-bottom:14px">${logos[0]?`<img src="${logos[0]}" style="width:135px;height:56px;object-fit:contain">`:''}${logos[1]?`<img src="${logos[1]}" style="width:88px;height:56px;object-fit:contain">`:''}</div>`;html=html.replace(/<body([^>]*)>/i,(match,attrs)=>`<body${attrs}>${brand}`);}const blob=new Blob(['ï»¿'+html],{type:'application/vnd.ms-excel;charset=utf-8;'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;document.body.appendChild(a);a.click();document.body.removeChild(a);setTimeout(()=>URL.revokeObjectURL(url),800);}
function deriveExportRecord(r){const d=isBonogasSatcontrolView()?resolveBonogasDetailRecord(r):normalizeSelectedRecord(r);const numInst=d.numeroInstalacion||d.nInstalacion||(d.suministro?('INST-'+String(d.suministro).replace(/\D/g,'').slice(-6).padStart(6,'0')):'-');const medidor=d.tipoMedidor||'Diafragma residencial G4';const acometida=d.tipoAcometida||'Aérea estándar 3/4"';const fin=Number(d.montoFinanciado!=null?d.montoFinanciado:(d.liquidacion||0));const sub=Number(d.montoSubsidiado!=null?d.montoSubsidiado:Math.round(fin*0.36));const cuotasTot=Number(d.cuotasTotales||d.numeroCuotas||12);const pend=Number(d.montoPendiente!=null?d.montoPendiente:Math.max(0,fin-Math.round(fin*0.45)));const ratioPag=fin>0?Math.max(0,Math.min(1,1-pend/fin)):0;const cuotasPag=Number(d.cuotasPagadas!=null?d.cuotasPagadas:Math.round(cuotasTot*ratioPag));const cuotasPen=Number(d.cuotasPendientes!=null?d.cuotasPendientes:Math.max(0,cuotasTot-cuotasPag));return {suministro:d.suministro||'-',numInst,beneficiario:d.beneficiario||'-',empresaInstaladora:d.empresaInstaladora||'-',estrato:bonogasDisplayEstrato(d),concesionaria:d.concesionaria||'-',acometida,medidor,estadoInstalacion:d.estadoInstalacion||'-',montoSubsidiado:sub,montoFinanciado:fin,cuotasPagadas:cuotasPag+' / '+cuotasTot,cuotasPendientes:cuotasPen,montoPendiente:pend};}
function csvCell(value){const s=String(value??'');return /[",\n;]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s;}
function downloadTextFile(filename,text,mime){const blob=new Blob(['\ufeff'+text],{type:(mime||'text/csv')+';charset=utf-8;'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;document.body.appendChild(a);a.click();document.body.removeChild(a);setTimeout(()=>URL.revokeObjectURL(url),800);}
function exportSelectionRows(){const ctx=exportContextRecords();const derived=ctx.records.map(deriveExportRecord);const headers=['#','N° suministro','N° instalación','Beneficiario','Empresa instaladora','Estrato','Estado instalación','Monto subsidiado','Monto financiado','Cuotas pagadas','Cuotas pendientes','Monto pendiente'];const rows=derived.map((r,i)=>[i+1,r.suministro,r.numInst,r.beneficiario,r.empresaInstaladora,r.estrato,r.estadoInstalacion,r.montoSubsidiado,r.montoFinanciado,r.cuotasPagadas,r.cuotasPendientes,r.montoPendiente]);return {headers,rows,ctx,derived};}
function exportSelectionCSV(){const p=currentProject();const {headers,rows,ctx}=exportSelectionRows();if(!rows.length){showToast('No hay registros en la selección para exportar');return;}const stats=summarizeRecords(ctx.records);const meta=[['Módulo','SATCONTROL AGRUPACIONES'],['Agrupación',p.nombre||'-'],['Código',p.id||'-'],['Ubicación',(p.provincia||'')+' - '+(p.departamento||'')],['Fuente',ctx.sourceLabel],['Registros',rows.length],['Conectados',stats.conectados],['Beneficiarios',stats.beneficiarios],['Total liquidaciones',Math.round(stats.liquidacion)],['Fecha',new Date().toLocaleString('es-PE')]];const lines=[];meta.forEach(m=>lines.push(m.map(csvCell).join(',')));lines.push('');lines.push(headers.map(csvCell).join(','));rows.forEach(r=>lines.push(r.map(csvCell).join(',')));downloadTextFile('SATCONTROL_seleccion.csv',lines.join('\n'));showToast('CSV exportado: '+rows.length+' registros');}
async function exportSelectionPDF(){const p=currentProject();const {headers,rows,ctx}=exportSelectionRows();if(!rows.length){showToast('No hay registros en la selección para exportar');return;}let jsPDF;try{jsPDF=await ensureJsPdf();}catch(err){showToast('No se pudo cargar librería PDF');return;}if(!jsPDF){showToast('Librería PDF no disponible');return;}const stats=summarizeRecords(ctx.records);const doc=new jsPDF({orientation:'landscape',unit:'pt',format:'a4'});doc.setFillColor(15,118,110);doc.rect(0,0,doc.internal.pageSize.getWidth(),64,'F');doc.setTextColor(255,255,255);doc.setFontSize(16);doc.text('SATCONTROL AGRUPACIONES · Exportación de selección',40,30);doc.setFontSize(10);doc.text(`${p.nombre||'-'} · ${ctx.sourceLabel} · ${rows.length} registros · ${new Date().toLocaleString('es-PE')}`,40,48);doc.setTextColor(15,23,42);doc.setFontSize(10);doc.text(`Conectados: ${stats.conectados}   Beneficiarios: ${stats.beneficiarios}   Liquidaciones: ${formatMoney(stats.liquidacion)}   Morosidad: ${formatMoney(stats.pendiente||0)}`,40,84);if(typeof doc.autoTable==='function'){doc.autoTable({head:[headers],body:rows.map(r=>r.map(v=>String(v))),startY:96,styles:{fontSize:7,cellPadding:3},headStyles:{fillColor:[14,165,233]},alternateRowStyles:{fillColor:[239,246,255]},margin:{left:40,right:40}});}else{let y=110;doc.setFontSize(8);rows.slice(0,40).forEach(r=>{doc.text(r.map(v=>String(v)).join('  |  ').slice(0,180),40,y);y+=12;});}doc.save('SATCONTROL_seleccion.pdf');showToast('PDF exportado: '+rows.length+' registros');}
function openExportSelectionMenu(anchor){let menu=qs('#exportSelectionMenu');if(menu){menu.remove();return;}menu=document.createElement('div');menu.id='exportSelectionMenu';menu.className='export-selection-menu';menu.innerHTML='<button type="button" data-export-sel="pdf"><span class="es-ic es-pdf">PDF</span>Exportar a PDF</button><button type="button" data-export-sel="csv"><span class="es-ic es-csv">CSV</span>Exportar a CSV</button>';document.body.appendChild(menu);const r=anchor.getBoundingClientRect();menu.style.top=(r.bottom+8)+'px';menu.style.left=Math.max(12,Math.min(r.left,window.innerWidth-200))+'px';const close=()=>{menu?.remove();document.removeEventListener('click',onDoc,true);};const onDoc=e=>{if(!menu.contains(e.target)&&e.target!==anchor){close();}};setTimeout(()=>document.addEventListener('click',onDoc,true),0);menu.querySelectorAll('[data-export-sel]').forEach(b=>b.addEventListener('click',()=>{const fmt=b.dataset.exportSel;close();if(fmt==='pdf')exportSelectionPDF();else exportSelectionCSV();}));}
function exportRightPanelExcel(){const p=currentProject();const ctx=exportContextRecords();const records=ctx.records;const stats=summarizeRecords(records);const now=new Date().toLocaleString('es-PE');const bonogas=isBonogasSatcontrolView();const m=bonogas&&typeof window.bonogasExportMeta==='function'?window.bonogasExportMeta():null;const projectRows=bonogas&&m?[['Módulo','SATCONTROL · BONO GAS'],['Fuente exportada',ctx.sourceLabel],['Estrato socioeconómico',m.estrato],['Empresa instaladora',m.empresa],['Concesionaria',m.concesionaria],['Fecha',m.fecha],['Registros exportados',records.length]]:[['Código',p.id],['Agrupación',p.nombre],['Ubicación',(p.provincia||'')+' – '+(p.departamento||'')],['Distrito',p.distrito||''],['Área',p.area||''],['Beneficiarios de la agrupación',p.beneficiarios||0],['Responsables',(p.responsables||[]).join(', ')],['Fuente exportada',ctx.sourceLabel],['Fecha de exportación',now]];const summaryRows=[['Total suministros / objetos',stats.total],['Conectados',stats.conectados],['En construcción',stats.construccion],['Penalizados',stats.penalizados||0],['Beneficiarios',stats.beneficiarios],['Total liquidaciones',formatMoney(stats.liquidacion)],['Pendiente de recaudación',formatMoney(stats.pendiente||0)]];const derived=records.map(deriveExportRecord);const supplyRows=derived.map((r,i)=>[i+1,r.suministro,r.numInst,r.beneficiario,r.empresaInstaladora,r.estrato,r.acometida,r.medidor,r.estadoInstalacion]);const collectionRows=derived.map((r,i)=>[i+1,r.suministro,r.beneficiario,formatMoney(r.montoSubsidiado),formatMoney(r.montoFinanciado),r.cuotasPagadas,r.cuotasPendientes,formatMoney(r.montoPendiente)]);const workbook=`<html><head><meta charset="utf-8"><style>body{font-family:Arial,sans-serif}h1{color:#0f172a}h2{background:#0f766e;color:white;padding:8px}table{border-collapse:collapse;margin-bottom:14px}th{background:#dbeafe;font-weight:bold}td,th{padding:6px 8px;border:1px solid #94a3b8;mso-number-format:'\@'}</style></head><body><h1>Exportación BONO GAS · Panel derecho</h1>${excelTable('Agrupación seleccionada',['Campo','Valor'],projectRows)}${excelTable('Resumen exportado',['Indicador','Valor'],summaryRows)}${excelTable('Datos del Suministro',['#','N° suministro','N° instalación','Beneficiario','Empresa instaladora','Estrato','Tipo de acometida','Tipo de medidor','Estado instalación'],supplyRows)}${excelTable('Datos de Recaudación',['#','N° suministro','Beneficiario','Monto subsidiado','Monto financiado','Cuotas pagadas','Cuotas pendientes','Monto pendiente de recaudación'],collectionRows)}
<div class="beneficiary-panel" id="beneficiaryPanel">
  <button class="beneficiary-close" onclick="closeBeneficiaryPanel()" type="button">×</button>
  <h3>Información del Beneficiario</h3>
  <div class="beneficiary-section">
    <h4 style="margin:0 0 6px;color:#67e8f9;font-size:12px;font-weight:950">Datos del Suministro</h4>
    <div class="beneficiary-row"><span>N° Suministro</span><b id="bpSuministro">-</b></div>
    <div class="beneficiary-row"><span>N° Instalación</span><b id="bpInstalacion">-</b></div>
    <div class="beneficiary-row"><span>Beneficiario</span><b id="bpBeneficiario">-</b></div>
    <div class="beneficiary-row"><span>Tipo</span><b id="bpTipo">-</b></div>
    <div class="beneficiary-row"><span>Fecha registro portal</span><b id="bpFechaReg">-</b></div>
    <div class="beneficiary-row"><span>Fecha habilitación</span><b id="bpFechaHab">-</b></div>
    <div class="beneficiary-row"><span>Estrato</span><b id="bpEstrato">-</b></div>
    <div class="beneficiary-row"><span>Material instalación</span><b id="bpMaterial">-</b></div>
    <div class="beneficiary-row"><span>Empresa instaladora</span><b id="bpEmpresa">-</b></div>
    <div class="beneficiary-row"><span>Tipo acometida</span><b id="bpAcometida">-</b></div>
    <div class="beneficiary-row"><span>Tipo medidor</span><b id="bpMedidor">-</b></div>
  </div>
  <div class="beneficiary-section">
    <h4 style="margin:0 0 6px;color:#67e8f9;font-size:12px;font-weight:950">Datos de Recaudación</h4>
    <div class="beneficiary-row"><span>Costo instalación</span><b id="bpCosto">-</b></div>
    <div class="beneficiary-row"><span>Monto subsidiado</span><b id="bpSubsidio">-</b></div>
    <div class="beneficiary-row"><span>Monto financiado</span><b id="bpFinanciado">-</b></div>
    <div class="beneficiary-row"><span>Suministro activo</span><b id="bpActivo">-</b></div>
    <div class="beneficiary-row"><span>Cuota mensual</span><b id="bpCuota">-</b></div>
    <div class="beneficiary-row"><span>Cuotas pagadas</span><b id="bpPagadas">-</b></div>
    <div class="beneficiary-row"><span>Cuotas pendientes</span><b id="bpPendientes">-</b></div>
    <div class="beneficiary-row"><span>Monto pendiente recaudación</span><b id="bpPendiente">-</b></div>
  </div>
  <div class="beneficiary-section">
    <h4 style="margin:0 0 6px;color:#67e8f9;font-size:12px;font-weight:950">Flujo del Expediente</h4>
    <div id="bpTimeline" style="font-size:11px;color:#93a4c7"></div>
  </div>
</div>

</body></html>`;downloadExcelFile('BONO_GAS_'+(p.id||'agrupación')+'_panel_derecho.xls',workbook);showToast('Excel exportado: '+records.length+' registros');}

function updateStatsByCurrentSelection(){if(typeof isBonogasMapContext==='function'&&isBonogasMapContext())return;const baseRecords=activeSelectionRecords.length?activeSelectionRecords:(activeAreaRecords.length?activeAreaRecords:currentSupplyRecords);const sourceLabel=activeSelectionRecords.length?'Objetos seleccionados':(activeAreaRecords.length?'Área seleccionada':'Proyecto seleccionado');renderDonutChart(baseRecords,currentStatsFilter,sourceLabel);}
function aiEsc(value){return String(value??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function appendAiMessage(role,html){const body=qs('#aiChatBody');if(!body)return;body.insertAdjacentHTML('beforeend',`<div class="ai-msg ${role}">${html}</div>`);body.scrollTop=body.scrollHeight;}
function findDelayedPenaltyCandidates(days=90){return currentSupplyRecords.filter(r=>r.estadoInstalacion!=='Conectado'&&r.estadoInstalacion!=='Penalizado'&&r.inicioConstruccion&&daysSince(r.inicioConstruccion)>=days);}
function markPenaltyCandidates(records){records.forEach(r=>{const layer=r._layer;if(layer&&layer.setStyle){layer.setRadius?.(11);layer.setStyle({color:'#ffffff',weight:4,fillColor:'#f97316',fillOpacity:.96});layer.bindTooltip('Candidato a penalidad · '+daysSince(r.inicioConstruccion)+' días',{direction:'top',className:'penalty-label'});}});if(records.length&&leafletMap){const pts=records.map(r=>[r.lat,r.lng]);try{leafletMap.fitBounds(pts,{padding:[44,44]});}catch(e){}}}
function handleAiQuery(query){const q=(query||'').trim();if(!q)return;appendAiMessage('user',aiEsc(q));const dayMatch=q.match(/([0-9]+)[ ]*d[ií]as/i);const days=dayMatch?Number(dayMatch[1]):90;const wantsPenalty=/penal|habilitar|construcci[oó]n|pendiente|d[ií]as/i.test(q.toLowerCase());if(!wantsPenalty){appendAiMessage('bot','<b>Asistente:</b> Puedo buscar retrasos, suministros sin habilitar o candidatos para penalidad. Escribe, por ejemplo: <b>más de 90 días sin habilitar</b>.');return;}aiPenaltyTargets=findDelayedPenaltyCandidates(days);markPenaltyCandidates(aiPenaltyTargets);if(!aiPenaltyTargets.length){appendAiMessage('bot',`<b>Asistente:</b> No encontré suministros con más de <b>${days} días</b> sin habilitar en el agrupación actual.`);return;}const stats=summarizeRecords(aiPenaltyTargets);setActiveAreaRecords(aiPenaltyTargets,'Candidatos a penalidad IA');renderSupplyDetails(aiPenaltyTargets[0]);const rows=aiPenaltyTargets.map(r=>`<div class="ai-result-item"><span>${aiEsc(r.suministro)} · ${aiEsc(r.beneficiario)}</span><b>${daysSince(r.inicioConstruccion)} días</b></div>`).join('');appendAiMessage('bot',`<b>Asistente:</b> Identifiqué <b>${aiPenaltyTargets.length}</b> suministros con más de <b>${days} días</b> sin habilitar. Ya están marcados en color naranja en el mapa.<div class="ai-result-card"><h4>Candidatos para penalidad</h4><p>Liquidación referencial total: <b>${formatMoney(stats.liquidacion)}</b></p><div class="ai-result-list">${rows}</div></div><div class="ai-bulk-box"><label>Estado masivo a aplicar</label><div class="ai-bulk-row"><input id="aiPenaltyStatusInput" value="Penalizado"><button class="btn" type="button" onclick="applyMassPenaltyStatus()">Aplicar masivamente</button></div></div>`);showToast(aiPenaltyTargets.length+' candidatos marcados en naranja');}
function applyMassPenaltyStatus(){const status=(qs('#aiPenaltyStatusInput')?.value||'Penalizado').trim()||'Penalizado';if(!aiPenaltyTargets.length){showToast('No hay candidatos para actualizar');return;}aiPenaltyTargets.forEach(r=>{r.estadoInstalacion=status;r.estadoPenalidad=status;r.fechaPenalizacion=new Date().toISOString().slice(0,10);r.motivoPenalidad='Más de 90 días sin habilitar';if(r._layer){restoreLayerStyle(r._layer,r);r._layer.bindTooltip(status+' · '+daysSince(r.inicioConstruccion)+' días',{direction:'top',className:'penalty-label'});r._layer.setPopupContent(`<b>${r.suministro}</b><br>${r.beneficiario}<br>Estado: ${status}<br>Tiempo: ${formatElapsed(r.inicioConstruccion,status)}<br>Liquidación: ${formatMoney(r.liquidacion)}`);}});activeAreaRecords=aiPenaltyTargets.map(normalizeSelectedRecord);renderAreaStats(summarizeRecords(activeAreaRecords),'Suministros penalizados por IA');renderSupplyDetails(aiPenaltyTargets[0]);updateStatsByCurrentSelection();appendAiMessage('bot',`<b>Asistente:</b> Acción aplicada. <b>${aiPenaltyTargets.length}</b> suministros fueron actualizados masivamente al estado <b>${aiEsc(status)}</b>.`);showToast('Estado masivo aplicado: '+status);}
function ensureRightPanelVisible(){const content=qs('.content');if(content&&content.classList.contains('right-hidden')){content.classList.remove('right-hidden');if(typeof updateCollapseIcons==='function')updateCollapseIcons();if(typeof resizeMapAfterLayout==='function')resizeMapAfterLayout();}}
function resetEvidencePanel(){const box=qs('#evidencePhotos'),count=qs('#evidenceCount');if(count)count.textContent='0/5 fotos';if(box)box.innerHTML='<div class="evidence-empty">Sin evidencias cargadas.<br>Seleccione un suministro, lote, círculo o área en el mapa.</div>';}
function clearRightPanelForMapSelection(showMessage=true){ensureRightPanelVisible();closeMapPanels();if(drawLayer)drawLayer.clearLayers();drawingPoints=[];circleCenter=null;tempShape=null;activeAreaRecords=[];activeSelectionRecords=[];clearObjectSelection(false);selectedObjects=[];selectedLayerRefs.clear();if(typeof refreshActiveProjectPanel==='function')refreshActiveProjectPanel();else{if(qs('#infoContextLabel'))qs('#infoContextLabel').textContent='Selección:';if(qs('#infoName'))qs('#infoName').textContent='SELECCIONE EN EL MAPA';if(qs('#infoPlace'))qs('#infoPlace').textContent='Use dedo de selección, área o círculo';if(qs('#details'))qs('#details').innerHTML='';}if(qs('#supplyDetails')){qs('#supplyDetails').className='supply-card empty';qs('#supplyDetails').innerHTML='<h3>Información de la selección</h3><p class="supply-hint">El panel está limpio. Use el dedo de selección para elegir una vivienda/lote, o dibuje un círculo o polígono para cargar la información del área seleccionada.</p>';}resetEvidencePanel();renderAreaStats(null);renderDonutChart([],currentStatsFilter,'Sin selección');renderMapTimeline(null);setMapTool('select');if(showMessage)showToast('Panel derecho limpio. Seleccione en el mapa para cargar información.');}
function updateRightPanelForObjectSelection(records,selectedRecord){ensureRightPanelVisible();const p=currentProject();const normalized=(records||[]).map(normalizeSelectedRecord);const d=normalizeSelectedRecord(selectedRecord||normalized[0]||{});if(normalized.length>1){updateSelectionPanelHeader('Selección:','SELECCIÓN MÚLTIPLE',normalized.length+' objetos seleccionados · Ctrl + clic');}else{updateSelectionPanelHeader('Selección:',d.suministro||d.beneficiario||('LOTE · '+(d.estrato||'SELECCIONADO')),(d.objectType||'Suministro')+' · '+(p.distrito||p.provincia||''));}}
function renderAreaSelectionDetails(records,title){const box=qs('#supplyDetails');if(!box)return;const normalized=(records||[]).map(normalizeSelectedRecord);const stats=summarizeRecords(normalized);if(!normalized.length){box.className='supply-card empty';box.innerHTML='<h3>Información de la selección</h3><p class="supply-hint">No se encontraron suministros dentro del área delimitada. Ajuste el círculo o polígono para ampliar la selección.</p>';return;}box.className='supply-card';box.innerHTML=`<div class="selection-head"><h3>Información de la selección</h3><button class="selection-clear" onclick="clearDrawings()">Limpiar</button></div><p class="selection-note">${title||'Área seleccionada'} · ${stats.total} suministros encontrados. Se muestra la información estadística y las características principales.</p><div class="selection-kpis"><div class="selection-kpi"><span>Suministros</span><b>${stats.total}</b></div><div class="selection-kpi"><span>Beneficiarios</span><b>${stats.beneficiarios}</b></div><div class="selection-kpi"><span>Conectados</span><b>${stats.conectados}</b></div><div class="selection-kpi"><span>En construcción</span><b>${stats.construccion}</b></div><div class="selection-kpi"><span>Liquidaciones</span><b>${formatMoney(stats.liquidacion)}</b></div><div class="selection-kpi"><span>Morosidad</span><b>${formatMoney(stats.pendiente||0)}</b></div></div><div class="selection-list">${normalized.slice(0,14).map(d=>`<div class="selection-mini"><b>${d.suministro||d.beneficiario||('Lote estrato '+(d.estrato||'-'))}</b><span>${d.tipoSuministro||d.objectType} · ${d.estadoInstalacion} · ${d.beneficiario||'Sin beneficiario'} · ${formatMoney(d.montoPendiente||0)} pendiente</span></div>`).join('')}</div>`;}
function updateRightPanelForAreaSelection(records,title,extraInfo){ensureRightPanelVisible();const areaLabel=extraInfo||'Área delimitada por utilitario GIS';updateSelectionPanelHeader('Selección GIS:',title||'Área seleccionada',areaLabel);renderAreaSelectionDetails((records||[]).map(normalizeSelectedRecord),title);}
function syncActiveAreaRecordsGlobal(){window.activeAreaRecords=activeAreaRecords;}
function isMapPlazoCardContext(){const main=qs('.main');if(!main)return false;if(typeof isBonogasSatcontrolView==='function'&&isBonogasSatcontrolView())return true;return typeof isProyectosSatcontrolView==='function'&&isProyectosSatcontrolView();}
function setActiveAreaRecords(records,title,extraInfo){clearObjectSelection(false);activeAreaRecords=records||[];syncActiveAreaRecordsGlobal();if(isMapPlazoCardContext()&&activeAreaRecords.length&&!isBonogasSatcontrolView()){ensureRightPanelVisible();renderAreaStats(null);if(typeof window.updatePlazoArt259Card==='function')window.updatePlazoArt259Card(activeAreaRecords,title||extraInfo||'Seleccion por area');}else if(!isBonogasSatcontrolView()){renderAreaStats(activeAreaRecords.length?summarizeRecords(activeAreaRecords):null,title||'Resumen del área seleccionada');}updateRightPanelForAreaSelection(activeAreaRecords,title||'Resumen del área seleccionada',extraInfo);updateStatsByCurrentSelection();if(typeof window.syncPlazoAreaSelectionUi==='function')window.syncPlazoAreaSelectionUi();}
function pointInPolygon(point,polygon){const x=point.lng,y=point.lat;let inside=false;for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){const xi=polygon[i].lng,yi=polygon[i].lat,xj=polygon[j].lng,yj=polygon[j].lat;const intersect=((yi>y)!==(yj>y))&&(x<(xj-xi)*(y-yi)/(yj-yi)+xi);if(intersect)inside=!inside;}return inside;}
function getUploadedGeoJsonRecords(){const out=[];uploadedMapLayers.forEach(function(item){if(!item.visible||!item.records||!item.records.length)return;item.records.forEach(function(r){out.push(r);});});return out;}
function getMapSelectionSupplyRecords(){let base=[];if(typeof isBonogasSatcontrolView==='function'&&isBonogasSatcontrolView()){if(typeof window.getBonogasFilteredRows==='function')base=window.getBonogasFilteredRows();else if(window.currentSupplyRecords&&window.currentSupplyRecords.length)base=window.currentSupplyRecords;else base=currentSupplyRecords;}else base=currentSupplyRecords;const uploaded=getUploadedGeoJsonRecords();return uploaded.length?base.concat(uploaded):base;}
function recordMatchesAreaSelection(record,testFn){if(record._geoJsonFeature&&Array.isArray(record._geoCoords)&&record._geoCoords.length){if(record._geoCoords.some(testFn))return true;if(Number.isFinite(Number(record.lat))&&Number.isFinite(Number(record.lng)))return testFn({lat:Number(record.lat),lng:Number(record.lng)});return false;}if(Number.isFinite(Number(record.lat))&&Number.isFinite(Number(record.lng)))return testFn({lat:Number(record.lat),lng:Number(record.lng)});return false;}
function recordsInsidePolygon(points){const test=function(p){return pointInPolygon(p,points);};return getMapSelectionSupplyRecords().filter(function(r){return recordMatchesAreaSelection(r,test);});}
function recordsInsideCircle(center,radius){const test=function(p){return distanceMeters(center,p)<=radius;};return getMapSelectionSupplyRecords().filter(function(r){return recordMatchesAreaSelection(r,test);});}
function shouldSkipBonogasAutoMapZoom(){if(window.__geoJsonCenterLockUntil&&Date.now()<window.__geoJsonCenterLockUntil)return true;return (uploadedMapLayers||[]).some(function(x){return x.layer&&x.visible;});}
function restoreLayerStyle(layer,data){if(!layer)return;if(data&&data._geoJsonFeature){const color=data._geoJsonColor||'#22c55e';if(layer.setRadius)layer.setRadius(data._geoJsonGeomType==='Point'?6:undefined);if(layer.setStyle)layer.setStyle({color:color,weight:3,fillColor:color,fillOpacity:data._geoJsonGeomType==='Point'?.9:.18});return;}if(data.estrato&&layer.setStyle){if(data.estadoInstalacion==='Penalizado'){layer.setStyle({color:'#fb923c',weight:3,fillColor:'#f97316',fillOpacity:.62});return;}layer.setStyle(styleEstrato({properties:data}));return;}if(layer.setRadius)layer.setRadius(7);if(layer.setStyle){const connected=data.estadoInstalacion==='Conectado';const penalized=data.estadoInstalacion==='Penalizado';const scheme=supplyColorScheme(data);layer.setStyle({color:penalized?'#fb923c':(connected?scheme.color:scheme.color),weight:penalized?3:2,fillColor:penalized?'#f97316':scheme.fill,fillOpacity:.9});}}
function applySelectedLayerStyle(layer,data){if(!layer)return;if(data&&data._geoJsonFeature){if(layer.setRadius)layer.setRadius(data._geoJsonGeomType==='Point'?9:undefined);if(layer.setStyle)layer.setStyle({color:'#ffffff',weight:4,fillColor:'#0ea5e9',fillOpacity:.85});return;}if(layer.setRadius)layer.setRadius(10);if(layer.setStyle){layer.setStyle({color:'#ffffff',weight:4,fillColor:'#0ea5e9',fillOpacity:data.estrato?0.55:0.95});}}
function refreshSelectionRecords(){activeSelectionRecords=selectedObjects.map(o=>normalizeSelectedRecord(o.data));}
function clearObjectSelection(updateUi=true){selectedObjects.forEach(o=>restoreLayerStyle(o.layer,o.data));selectedObjects=[];selectedLayerRefs.clear();activeSelectionRecords=[];if(updateUi){renderSupplyDetails(null);renderAreaStats(activeAreaRecords.length?summarizeRecords(activeAreaRecords):null,activeAreaRecords.length?'Resumen del área seleccionada':'Resumen del área seleccionada');updateStatsByCurrentSelection();if(!activeSelectionRecords.length&&!activeAreaRecords.length&&typeof refreshActiveProjectPanel==='function')refreshActiveProjectPanel();}}
function selectMapObject(data,layer,ev){if(activeMapTool!=='select')return;const useCtrl=!!(ev&&(ev.ctrlKey||ev.metaKey||(typeof ev.getModifierState==='function'&&ev.getModifierState('Control'))));activeAreaRecords=[];const record=normalizeSelectedRecord(data);const id=objectId(record);if(!useCtrl)clearObjectSelection(false);if(useCtrl&&selectedLayerRefs.has(id)){const current=selectedLayerRefs.get(id);restoreLayerStyle(current.layer,current.data);selectedLayerRefs.delete(id);selectedObjects=selectedObjects.filter(o=>o.id!==id);}else{selectedLayerRefs.set(id,{layer,data:record});selectedObjects=selectedObjects.filter(o=>o.id!==id).concat({id,layer,data:record});applySelectedLayerStyle(layer,record);}refreshSelectionRecords();if(activeSelectionRecords.length){updateRightPanelForObjectSelection(activeSelectionRecords,record);renderAreaStats(summarizeRecords(activeSelectionRecords),activeSelectionRecords.length>1?'Resumen selección múltiple':'Resumen objeto seleccionado');renderSupplyDetails(record);showToast(activeSelectionRecords.length>1?activeSelectionRecords.length+' objetos seleccionados':'Objeto seleccionado');}else{renderSupplyDetails(null);renderAreaStats(null);resetEvidencePanel();if(typeof refreshActiveProjectPanel==='function')refreshActiveProjectPanel();}updateStatsByCurrentSelection();}
function adminProjectLabel(value){return String(value||'').replace(/AGRUPACIONES/gi,'PROYECTOS').replace(/AGRUPACIÓN/gi,'PROYECTO');}
function renderProjects(){const search=qsProyectos('#searchInput');const list=qsProyectos('#projectList');if(!list)return;const filter=(search?.value||'').toLowerCase();list.innerHTML=projects.filter(p=>(p.nombre+p.id+p.distrito+p.lider).toLowerCase().includes(filter)).map(p=>`<div class="project-card ${p.id===selectedId?'selected':''}" data-id="${p.id}"><div class="card-actions"><button class="icon-btn edit" title="Modificar" data-edit="${p.id}"><svg class="svg-icon" aria-hidden="true"><use href="#i-edit"></use></svg></button><button class="icon-btn delete" title="Eliminar" data-delete="${p.id}"><svg class="svg-icon" aria-hidden="true"><use href="#i-trash"></use></svg></button></div><h3>${adminProjectLabel(p.nombre)}</h3><small>${p.id}</small><div style="margin-top:9px"><span class="pill ${tone(p.estado)}">${p.estado}</span></div><div class="meta"><p><span>Líder:</span> ${p.lider}</p><p><span>Ubicación:</span> ${p.departamento}</p></div></div>`).join('');list.querySelectorAll('.project-card').forEach(el=>el.onclick=e=>{if(e.target.closest('button'))return;selectProject(el.dataset.id)});list.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>openProjectModal(b.dataset.edit));list.querySelectorAll('[data-delete]').forEach(b=>b.onclick=()=>{deletingId=b.dataset.delete;qs('#deleteText').textContent='¿Realmente quieres eliminar el proyecto '+adminProjectLabel(projects.find(p=>p.id===deletingId).nombre)+'?';openModal('deleteModal')});}
function renderInfo(){const p=projects.find(x=>x.id===selectedId)||projects[0];if(!p)return;activeMapProjectId=p.id;clearObjectSelection(false);if(typeof isBonogasSatcontrolView==='function'&&isBonogasSatcontrolView()){activeAreaRecords=[];renderSupplyDetails(null);renderAreaStats(null);if(typeof window.syncBonogasMapToProject==='function')window.syncBonogasMapToProject(p);if(typeof window.applyBonogasFilters==='function')window.applyBonogasFilters();if(typeof window.getBonogasFilteredRows==='function'){const rows=window.getBonogasFilteredRows();currentSupplyRecords=rows.slice();window.currentSupplyRecords=rows.slice();}refreshActiveProjectPanel();renderProjectEvidences(p);return;}if(qs('#infoContextLabel'))qs('#infoContextLabel').textContent='Proyecto activo:';qs('#infoName').textContent=adminProjectLabel(p.nombre);qs('#infoPlace').textContent=p.provincia+' – '+p.departamento;refreshActiveProjectPanel();renderProjectEvidences(p);renderSupplyDetails(null);activeAreaRecords=[];renderAreaStats(null);if(isProyectosSatcontrolView())syncMapToProject(p);updateStatsByCurrentSelection();}
let leafletMap=null,projectMarker=null,searchLocationMarker=null,districtLayer=null,selectedDistrictLayer=null,selectedDistrictId=null,estratoLayer=null,beneficiaryLayer=null,gasLayer=null,coberturaLayer=null,troncalLayer=null,ramalesLayer=null,concesionariaLayer=null,morosityLayer=null,moduleThematicLayers={},satelliteAnalysisLayer=null,drawLayer=null,activeBase='osm',activeSatelliteMode=null,gasVisible=true,activeMapTool='select',drawingPoints=[],tempShape=null,circleCenter=null,circlePreviewPoint=null,circlePreviewRadius=0,currentSupplyRecords=[],activeAreaRecords=[],activeSelectionRecords=[],selectedObjects=[],selectedLayerRefs=new Map(),currentStatsFilter='servicioElectrico',uploadedMapLayers=[],pendingLayerFile=null,aiPenaltyTargets=[];
const baseLayers={};
function polygonBox(lat,lng,w,h,props){return {type:'Feature',properties:props,geometry:{type:'Polygon',coordinates:[[[lng-w,lat-h],[lng+w,lat-h],[lng+w,lat+h],[lng-w,lat+h],[lng-w,lat-h]]]}};}
function buildEstratoGeoJSON(centerLat,centerLng){const supplies=[{suministro:'SUM-ARQ-0001',tipoSuministro:'Residencial',beneficiario:'María Quispe Huamán',fechaInstalacion:'2026-04-23',estadoInstalacion:'Conectado',inicioConstruccion:'2026-04-01',empresaInstaladora:'GasSur Instalaciones S.A.C.'},{suministro:'SUM-ARQ-0002',tipoSuministro:'Residencial',beneficiario:'José Mamani Flores',fechaInstalacion:'2026-04-18',estadoInstalacion:'En construcción',inicioConstruccion:'2026-04-18',empresaInstaladora:'Andes Gas Contratistas'},{suministro:'SUM-ARQ-0003',tipoSuministro:'No residencial',beneficiario:'Bodega San Lázaro',fechaInstalacion:'2026-04-10',estadoInstalacion:'Conectado',inicioConstruccion:'2026-03-28',empresaInstaladora:'RedGas Perú S.A.C.'},{suministro:'SUM-ARQ-0004',tipoSuministro:'Residencial',beneficiario:'Rosa Condori Arias',fechaInstalacion:'2026-04-26',estadoInstalacion:'En construcción',inicioConstruccion:'2026-04-26',empresaInstaladora:'TecnoGas Arequipa'},{suministro:'SUM-ARQ-0005',tipoSuministro:'Residencial',beneficiario:'Luis Apaza Quispe',fechaInstalacion:'2026-04-05',estadoInstalacion:'Conectado',inicioConstruccion:'2026-03-20',empresaInstaladora:'GasSur Instalaciones S.A.C.'}];return {type:'FeatureCollection',features:[polygonBox(centerLat+.007,centerLng-.009,.0024,.0016,Object.assign({estrato:'Alto',hogares:45,estado:'Validado'},supplies[0])),polygonBox(centerLat-.005,centerLng+.007,.0027,.0018,Object.assign({estrato:'Medio',hogares:73,estado:'En evaluación'},supplies[1])),polygonBox(centerLat+.003,centerLng+.012,.0019,.0015,Object.assign({estrato:'Bajo',hogares:39,estado:'Prioritario'},supplies[2])),polygonBox(centerLat-.009,centerLng-.005,.0023,.0014,Object.assign({estrato:'Medio',hogares:51,estado:'Observado'},supplies[3])),polygonBox(centerLat+.011,centerLng+.003,.0018,.0013,Object.assign({estrato:'Bajo',hogares:27,estado:'Prioritario'},supplies[4]))]};}
function styleEstrato(f){const e=f.properties.estrato;return {color:e==='Bajo'?'#ef4444':e==='Medio'?'#f59e0b':'#a7f3d0',weight:2,fillColor:e==='Bajo'?'#dc2626':e==='Medio'?'#d97706':'#d9f99d',fillOpacity:.45};}
function buildGasNetwork(lat,lng){return L.polyline([[lat-.006,lng-.006],[lat-.003,lng-.003],[lat,lng-.001],[lat+.002,lng+.002],[lat+.005,lng+.005]],{color:'#22d3ee',weight:5,opacity:.75,dashArray:'8 8'}).bindPopup('<b>Red de gas proyectada</b><br>Tramo referencial para la maqueta FISE.');}
function buildCoberturaLayer(lat,lng){return L.circle([lat,lng],{radius:650,color:'#2563eb',weight:2,fillColor:'#60a5fa',fillOpacity:.15}).bindPopup('<b>Cobertura</b><br>Área de cobertura referencial del sistema de distribución.');}
function buildTroncalLayer(lat,lng){return L.polyline([[lat-.010,lng-.008],[lat-.006,lng-.004],[lat-.002,lng-.001],[lat+.003,lng+.003],[lat+.008,lng+.006]],{color:'#f97316',weight:6,opacity:.95}).bindPopup('<b>Troncal de gas</b><br>Infraestructura principal de conducción.');}
function buildRamalesLayer(lat,lng){return L.layerGroup([L.polyline([[lat-.002,lng-.001],[lat-.004,lng+.003]],{color:'#22c55e',weight:4,opacity:.9}).bindPopup('<b>Ramal</b><br>Instalación secundaria'),L.polyline([[lat+.001,lng+.001],[lat+.004,lng-.002]],{color:'#22c55e',weight:4,opacity:.9}).bindPopup('<b>Ramal</b><br>Instalación secundaria'),L.polyline([[lat+.003,lng+.003],[lat+.006,lng+.006]],{color:'#22c55e',weight:4,opacity:.9}).bindPopup('<b>Ramal</b><br>Instalación secundaria')]);}
function buildConcesionariaLayer(lat,lng){return L.layerGroup([L.polyline([[lat-.011,lng-.010],[lat-.007,lng-.006],[lat-.003,lng-.003],[lat+.001,lng-.001],[lat+.006,lng+.003]],{color:'#8b5cf6',weight:5,opacity:.9}).bindPopup('<b>Red por concesionaria</b><br>Concesionaria: GasSur<br>Tipo: Red principal<br>Estado: Operativa'),L.polyline([[lat-.008,lng+.007],[lat-.004,lng+.004],[lat+.001,lng+.002],[lat+.005,lng+.006],[lat+.009,lng+.009]],{color:'#06b6d4',weight:5,opacity:.9,dashArray:'8 5'}).bindPopup('<b>Red por concesionaria</b><br>Concesionaria: RedGas Perú<br>Tipo: Red secundaria<br>Estado: En expansión'),L.polyline([[lat+.007,lng-.008],[lat+.004,lng-.005],[lat+.002,lng-.002],[lat-.001,lng+.001],[lat-.005,lng+.005]],{color:'#f43f5e',weight:5,opacity:.88,dashArray:'3 6'}).bindPopup('<b>Red por concesionaria</b><br>Concesionaria: Andes Gas<br>Tipo: Ramal concesionado<br>Estado: Programada')]);}
function morosityColor(amount){if(amount>=5200)return '#7f1d1d';if(amount>=3000)return '#ef4444';if(amount>=1200)return '#f59e0b';return '#22c55e';}
function morosityLevel(amount){if(amount>=5200)return 'Crítica';if(amount>=3000)return 'Alta';if(amount>=1200)return 'Media';return 'Baja';}
function createNativeHeatLayer(points,options={}){if(!window.L)return null;const NativeHeatLayer=L.Layer.extend({initialize:function(pts,opts){this._points=pts||[];this._opts=Object.assign({radius:76,maxOpacity:.64},opts||{});},onAdd:function(map){this._map=map;this._canvas=L.DomUtil.create('canvas','native-heat-layer');this._canvas.style.position='absolute';this._canvas.style.pointerEvents='none';map.getPane('overlayPane').appendChild(this._canvas);map.on('moveend zoomend resize',this._reset,this);this._reset();},onRemove:function(map){map.off('moveend zoomend resize',this._reset,this);if(this._canvas&&this._canvas.parentNode)this._canvas.parentNode.removeChild(this._canvas);this._canvas=null;},_rgba:function(hex,alpha){const h=hex.replace('#','');const r=parseInt(h.slice(0,2),16),g=parseInt(h.slice(2,4),16),b=parseInt(h.slice(4,6),16);return `rgba(${r},${g},${b},${alpha})`;},_color:function(t){if(t>=.88)return '#7f1d1d';if(t>=.58)return '#ef4444';if(t>=.28)return '#f59e0b';return '#22c55e';},_reset:function(){if(!this._map||!this._canvas)return;const size=this._map.getSize();const topLeft=this._map.containerPointToLayerPoint([0,0]);this._canvas.width=size.x;this._canvas.height=size.y;L.DomUtil.setPosition(this._canvas,topLeft);this._draw(topLeft);},_draw:function(topLeft){const ctx=this._canvas.getContext('2d');ctx.clearRect(0,0,this._canvas.width,this._canvas.height);ctx.globalCompositeOperation='source-over';this._points.forEach(pt=>{const intensity=Math.max(.08,Math.min(1,Number(pt[2]||0)));const layerPoint=this._map.latLngToLayerPoint([pt[0],pt[1]]);const x=layerPoint.x-topLeft.x,y=layerPoint.y-topLeft.y;const radius=this._opts.radius*(.72+intensity*.55);const color=this._color(intensity);const gradient=ctx.createRadialGradient(x,y,0,x,y,radius);gradient.addColorStop(0,this._rgba(color,this._opts.maxOpacity));gradient.addColorStop(.28,this._rgba(color,this._opts.maxOpacity*.58));gradient.addColorStop(.66,this._rgba(color,this._opts.maxOpacity*.22));gradient.addColorStop(1,this._rgba(color,0));ctx.fillStyle=gradient;ctx.beginPath();ctx.arc(x,y,radius,0,Math.PI*2);ctx.fill();});}});return new NativeHeatLayer(points,options);}
function buildMorosityHeatLayer(lat,lng){const group=L.layerGroup();const records=currentSupplyRecords.filter(r=>(r.montoPendiente||0)>0);const maxPendiente=Math.max(...records.map(r=>r.montoPendiente||0),1);const heatPoints=records.map(r=>[r.lat,r.lng,Math.max(.18,(r.montoPendiente||0)/maxPendiente)]);const heatLayer=createNativeHeatLayer(heatPoints,{radius:82,maxOpacity:.66});if(heatLayer)heatLayer.addTo(group);const cells=[{id:'MZ-01',dx:-.004,dy:.003,w:.0021,h:.0015},{id:'MZ-02',dx:.002,dy:.002,w:.0023,h:.0014},{id:'MZ-03',dx:.005,dy:-.001,w:.0021,h:.0015},{id:'MZ-04',dx:-.003,dy:-.004,w:.0024,h:.0016},{id:'MZ-05',dx:.001,dy:-.005,w:.0022,h:.0014},{id:'MZ-06',dx:.006,dy:.004,w:.0020,h:.0013}];cells.forEach((c,idx)=>{const bounds=[[lat+c.dy-c.h,lng+c.dx-c.w],[lat+c.dy+c.h,lng+c.dx+c.w]];const cellRecords=currentSupplyRecords.filter(r=>r.lat>=bounds[0][0]&&r.lat<=bounds[1][0]&&r.lng>=bounds[0][1]&&r.lng<=bounds[1][1]);const pendienteBase=cellRecords.reduce((s,r)=>s+(r.montoPendiente||0),0);const pendiente=pendienteBase+(idx%3)*850+(idx===2?2500:0);const morosos=cellRecords.filter(r=>(r.montoPendiente||0)>0).length+((idx===2||idx===4)?2:0);const level=morosityLevel(pendiente);const action=level==='Crítica'?'Priorizar cobranza, visita domiciliaria y bloqueo preventivo':level==='Alta'?'Programar campaña de cobro y notificación masiva':level==='Media'?'Enviar recordatorio y seguimiento telefónico':'Monitoreo regular';const rectColor=morosityColor(pendiente);const hotspot=L.rectangle(bounds,{color:rectColor,weight:2,opacity:0.9,fillColor:rectColor,fillOpacity:0.45,dashArray:'3 3'}).bindPopup(`<b>Zona de morosidad ${c.id}</b><br>Nivel de morosidad: <b>${level}</b><br>Monto pendiente: <b>${formatMoney(pendiente)}</b><br>Suministros morosos: ${morosos}<br>Acción sugerida: ${action}`);hotspot.bindTooltip(`${c.id}<br>${formatMoney(pendiente)}`,{permanent:true,direction:'center',className:'morosity-label'});hotspot.on('mouseover',function(){this.setStyle({fillOpacity:0.7,weight:3});});hotspot.on('mouseout',function(){this.setStyle({fillOpacity:0.45,weight:2});});hotspot.on('click',()=>{const enriched=cellRecords.map(r=>Object.assign({},r,{manzana:c.id,nivelMorosidad:r.nivelMorosidad||level}));const stats=summarizeRecords(enriched);stats.pendiente=pendiente;setActiveAreaRecords(enriched,`Morosidad · Zona ${c.id}`,'Mapa temático de morosidad · '+level+' · '+formatMoney(pendiente));if(enriched[0])renderSupplyDetails(enriched[0]);showToast(`Zona ${c.id}: ${level} · ${formatMoney(pendiente)}`);});hotspot.addTo(group);});return group;}
function thematicHeat(points,title){const group=L.layerGroup();const heat=createNativeHeatLayer(points,{radius:72,maxOpacity:.58});if(heat)heat.addTo(group);points.forEach((pt,idx)=>{const value=Math.round((pt[2]||0)*100);L.circleMarker([pt[0],pt[1]],{radius:5,color:'#fff',weight:2,fillColor:value>=70?'#ef4444':value>=40?'#f59e0b':'#22c55e',fillOpacity:.95}).bindPopup(`<b>${title}</b><br>Sector ${idx+1}<br>Intensidad referencial: ${value}%`).addTo(group);});return group;}
function buildModuleThematicLayers(lat,lng){
  const valePoints=[[lat+.006,lng-.007,.38],[lat-.004,lng+.006,.76],[lat+.002,lng+.010,.58],[lat-.008,lng-.003,.28]];
  const gnvPoints=[[lat+.004,lng-.004,.82],[lat-.003,lng+.004,.63],[lat+.007,lng+.006,.44],[lat-.006,lng-.006,.30]];
  const photovoltaic=L.layerGroup([[.006,-.008,'Operativo','#22c55e'],[-.004,.006,'En mantenimiento','#f59e0b'],[.002,.010,'Inactivo','#ef4444'],[-.007,-.002,'Operativo','#22c55e']].map((x,i)=>L.circleMarker([lat+x[0],lng+x[1]],{radius:9,color:'#fff',weight:2,fillColor:x[3],fillOpacity:.92}).bindPopup(`<b>Fotovoltaico · Sistema ${i+1}</b><br>Estado: ${x[2]}`)));
  const masification=L.layerGroup([L.polyline([[lat-.010,lng-.008],[lat-.003,lng-.002],[lat+.006,lng+.006]],{color:'#16a34a',weight:7,opacity:.85}).bindPopup('<b>Masificación</b><br>Red ejecutada · 82%'),L.polyline([[lat-.006,lng+.008],[lat,lng+.002],[lat+.009,lng-.003]],{color:'#f59e0b',weight:6,opacity:.88,dashArray:'8 6'}).bindPopup('<b>Masificación</b><br>Red en construcción · 54%'),L.polyline([[lat-.008,lng-.004],[lat-.002,lng+.003],[lat+.005,lng+.009]],{color:'#ef4444',weight:5,opacity:.82,dashArray:'3 7'}).bindPopup('<b>Masificación</b><br>Tramo programado')]);
  const electricity=L.layerGroup([[.005,-.007,'Operativo','#22c55e'],[-.005,.006,'Observado','#f59e0b'],[.007,.005,'Inactivo','#ef4444'],[-.006,-.006,'Operativo','#22c55e']].map((x,i)=>L.circle([lat+x[0],lng+x[1]],{radius:150,color:x[3],weight:2,fillColor:x[3],fillOpacity:.30}).bindPopup(`<b>Electricidad al Toque · Beneficiario ${i+1}</b><br>Estado: ${x[2]}`)));
  const mcterPoints=[[lat+.007,lng-.005,.72],[lat-.005,lng+.006,.46],[lat+.001,lng+.009,.88],[lat-.007,lng-.004,.32]];
  return {vale:thematicHeat(valePoints,'Vale FISE · Densidad de beneficiarios'),gnv:thematicHeat(gnvPoints,'Ahorro GNV · Consumos y demanda'),photovoltaic,masification,electricity,mcter:thematicHeat(mcterPoints,'MCTER · Suministros compensados')};
}
let moduleThematicCenter='';
function ensureModuleThematicLayers(){const p=currentProject();if(!leafletMap||!p)return;const key=p.id+'|'+p.lat+'|'+p.lng;if(moduleThematicCenter===key&&Object.keys(moduleThematicLayers).length)return;Object.values(moduleThematicLayers||{}).forEach(layer=>{if(layer&&leafletMap.hasLayer(layer))leafletMap.removeLayer(layer);});moduleThematicLayers=buildModuleThematicLayers(p.lat,p.lng);moduleThematicCenter=key;}
function setSatelliteDateVisible(visible){
  const box=qs('#dateSelectBox');
  if(box) box.classList.toggle('open',!!visible);
}
function satelliteModeLabel(mode){
  return mode==='ndvi'?'NDVI':mode==='builtup'?'Built Up':'Satélite';
}
function buildSatelliteAnalysisLayer(mode,lat,lng){
  if(!window.L || !mode || mode==='satellite') return null;
  const date=qs('#dateLayerSelect')?.value||'';
  if(mode==='ndvi'){
    return L.layerGroup([
      L.circle([lat+.002,lng-.003],{radius:390,color:'#22c55e',weight:2,fillColor:'#22c55e',fillOpacity:.26}).bindTooltip('NDVI alto · '+date,{direction:'top',className:'beneficiary-label'}),
      L.circle([lat-.003,lng+.004],{radius:310,color:'#84cc16',weight:2,fillColor:'#84cc16',fillOpacity:.22}).bindTooltip('NDVI medio · '+date,{direction:'top',className:'beneficiary-label'}),
      L.circle([lat+.004,lng+.005],{radius:230,color:'#f59e0b',weight:2,fillColor:'#f59e0b',fillOpacity:.20}).bindTooltip('NDVI bajo · '+date,{direction:'top',className:'beneficiary-label'})
    ]);
  }
  return L.layerGroup([
    L.rectangle([[lat+.001,lng-.006],[lat+.004,lng-.001]],{color:'#f97316',weight:2,fillColor:'#f97316',fillOpacity:.30}).bindTooltip('Built Up · zona consolidada · '+date,{direction:'top',className:'beneficiary-label'}),
    L.rectangle([[lat-.004,lng+.002],[lat-.001,lng+.007]],{color:'#ef4444',weight:2,fillColor:'#ef4444',fillOpacity:.26}).bindTooltip('Built Up · expansión urbana · '+date,{direction:'top',className:'beneficiary-label'}),
    L.rectangle([[lat+.004,lng+.002],[lat+.0065,lng+.006]],{color:'#f59e0b',weight:2,fillColor:'#f59e0b',fillOpacity:.24}).bindTooltip('Built Up · densidad media · '+date,{direction:'top',className:'beneficiary-label'})
  ]);
}
function clearSatelliteMode(){
  activeSatelliteMode=null;
  if(satelliteAnalysisLayer && leafletMap && leafletMap.hasLayer(satelliteAnalysisLayer)) leafletMap.removeLayer(satelliteAnalysisLayer);
  satelliteAnalysisLayer=null;
  setSatelliteDateVisible(false);
  qs('#satellitePanel')?.classList.remove('open');
  qs('#sateliteBtn')?.classList.remove('active');
  updateActiveLayerLabel();
}
function refreshSatelliteAnalysisLayer(){
  if(!leafletMap) return;
  if(satelliteAnalysisLayer && leafletMap.hasLayer(satelliteAnalysisLayer)) leafletMap.removeLayer(satelliteAnalysisLayer);
  satelliteAnalysisLayer=null;
  if(!activeSatelliteMode){
    setSatelliteDateVisible(false);
    qs('#sateliteBtn')?.classList.remove('active');
    updateActiveLayerLabel();
    return;
  }
  const p=currentProject();
  setSatelliteDateVisible(true);
  if(activeBase!=='sat') setBaseLayer('sat');
  satelliteAnalysisLayer=buildSatelliteAnalysisLayer(activeSatelliteMode,p.lat,p.lng);
  if(satelliteAnalysisLayer) satelliteAnalysisLayer.addTo(leafletMap);
  qs('#sateliteBtn')?.classList.add('active');
  updateActiveLayerLabel();
}
function setSatelliteLayerMode(mode){
  activeSatelliteMode=mode||null;
  qsa('input[name="satelliteMode"]').forEach(r=>r.checked=r.value===activeSatelliteMode);
  refreshSatelliteAnalysisLayer();
  showToast('Índice satelital: '+satelliteModeLabel(activeSatelliteMode));
}
function openSatelliteIndicesPanel(){
  closeMapPanels();
  qs('#mapsPanel')?.classList.add('open');
  qs('#mapasBtn')?.classList.add('active');
  qs('#satellitePanel')?.classList.add('open');
  setSatelliteDateVisible(!!activeSatelliteMode);
}
function toggleSatellitePanel(){
  const panel=qs('#satellitePanel'),btn=qs('#sateliteBtn');
  if(!panel||!btn) return;
  const alreadyOpen=panel.classList.contains('open');
  closeMapPanels();
  if(alreadyOpen){
    if(!activeSatelliteMode) setSatelliteDateVisible(false);
    return;
  }
  panel.classList.add('open');
  btn.classList.add('active');
  if(!activeSatelliteMode){
    const checked=qs('input[name="satelliteMode"]:checked')?.value||'satellite';
    activeSatelliteMode=checked;
    refreshSatelliteAnalysisLayer();
  }else{
    setSatelliteDateVisible(true);
  }
}
function closeMapPanels(){
  qs('#mapsPanel')?.classList.remove('open');
  qs('#layersPanel')?.classList.remove('open');
  qs('#themesPanel')?.classList.remove('open');
  qs('#satellitePanel')?.classList.remove('open');
  qs('#mapasBtn')?.classList.remove('active');
  qs('#capasBtn')?.classList.remove('active');
  qs('#tematicosBtn')?.classList.remove('active');
  if(!activeSatelliteMode) qs('#sateliteBtn')?.classList.remove('active');
}
function toggleMapPanel(panelId,buttonId){
  const panel=qs(panelId),btn=qs(buttonId);
  if(!panel||!btn) return;
  const alreadyOpen=panel.classList.contains('open');
  closeMapPanels();
  if(!alreadyOpen){panel.classList.add('open');btn.classList.add('active');}
}
const peruLocations=[
  {name:'Arequipa',type:'Departamento / Provincia',lat:-16.3989,lng:-71.5350,zoom:13},
  {name:'Lima',type:'Departamento / Provincia',lat:-12.0464,lng:-77.0428,zoom:12},
  {name:'Cusco',type:'Departamento / Provincia',lat:-13.5319,lng:-71.9675,zoom:13},
  {name:'Trujillo',type:'Ciudad · La Libertad',lat:-8.1116,lng:-79.0287,zoom:13},
  {name:'Chiclayo',type:'Ciudad · Lambayeque',lat:-6.7714,lng:-79.8409,zoom:13},
  {name:'Piura',type:'Departamento / Ciudad',lat:-5.1945,lng:-80.6328,zoom:13},
  {name:'Iquitos',type:'Ciudad · Loreto',lat:-3.7437,lng:-73.2516,zoom:13},
  {name:'Huancayo',type:'Ciudad · Junín',lat:-12.0686,lng:-75.2103,zoom:13},
  {name:'Tacna',type:'Departamento / Ciudad',lat:-18.0066,lng:-70.2463,zoom:13},
  {name:'Av. Javier Prado, Lima',type:'Calle / avenida',lat:-12.0906,lng:-77.0219,zoom:16},
  {name:'Av. Arequipa, Lima',type:'Calle / avenida',lat:-12.0931,lng:-77.0346,zoom:16},
  {name:'Av. Brasil, Lima',type:'Calle / avenida',lat:-12.0772,lng:-77.0507,zoom:16},
  {name:'San Isidro, Lima',type:'Distrito',lat:-12.0977,lng:-77.0365,zoom:15},
  {name:'Miraflores, Lima',type:'Distrito',lat:-12.1211,lng:-77.0297,zoom:15},
  {name:'Cayma, Arequipa',type:'Distrito',lat:-16.3634,lng:-71.5458,zoom:15},
  {name:'Yanahuara, Arequipa',type:'Distrito',lat:-16.3893,lng:-71.5446,zoom:15},
  {name:'Av. Ejército, Arequipa',type:'Calle / avenida',lat:-16.3909,lng:-71.5427,zoom:16}
];
function normalizeText(value){return String(value||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();}
function localLocationMatches(query){const q=normalizeText(query);if(!q)return[];return peruLocations.filter(item=>normalizeText(item.name+' '+item.type).includes(q)).slice(0,8);}
function renderLocationResults(results){const box=qs('#locationSearchResults');if(!box)return;if(!results.length){box.innerHTML='<div class="location-result"><b>No se encontraron resultados locales</b><span>Pruebe con departamento, distrito, avenida o calle del Perú.</span></div>';box.classList.add('open');return;}box.innerHTML=results.map((r,idx)=>`<button class="location-result" type="button" data-location-idx="${idx}"><b>${r.name}</b><span>${r.type}</span></button>`).join('');box.classList.add('open');qsa('[data-location-idx]').forEach(btn=>btn.addEventListener('click',()=>goToLocation(results[Number(btn.dataset.locationIdx)])));}
function goToLocation(loc){if(!loc||!leafletMap)return;leafletMap.setView([loc.lat,loc.lng],loc.zoom||15,{animate:true});if(searchLocationMarker&&leafletMap.hasLayer(searchLocationMarker))leafletMap.removeLayer(searchLocationMarker);searchLocationMarker=L.marker([loc.lat,loc.lng],{icon:L.divIcon({className:'',html:'<div class="search-marker"></div>',iconSize:[18,18],iconAnchor:[9,9]})}).addTo(leafletMap).bindPopup('<b>'+loc.name+'</b><br>'+loc.type).openPopup();qs('#locationSearchInput').value=loc.name;qs('#locationSearchResults')?.classList.remove('open');showToast('Ubicación encontrada: '+loc.name);}
async function searchLocation(){const input=qs('#locationSearchInput');const query=(input?.value||'').trim();if(!query){showToast('Ingrese una ubicación');return;}const local=localLocationMatches(query);if(local.length){renderLocationResults(local);return;}renderLocationResults([]);try{const url='https://nominatim.openstreetmap.org/search?format=json&limit=6&countrycodes=pe&q='+encodeURIComponent(query+', Perú');const response=await fetch(url);const data=await response.json();const results=(data||[]).map(x=>({name:x.display_name.split(',').slice(0,3).join(','),type:'Resultado OSM · Perú',lat:Number(x.lat),lng:Number(x.lon),zoom:16})).filter(x=>!Number.isNaN(x.lat)&&!Number.isNaN(x.lng));renderLocationResults(results);}catch(err){showToast('Búsqueda externa no disponible en esta previsualización');}}
const districtCatalog={Arequipa:{Arequipa:[{id:'yanahuara',name:'Yanahuara',province:'Arequipa',department:'Arequipa',center:[-16.3893,-71.5446],polygon:[[-16.3848,-71.5518],[-16.3831,-71.5452],[-16.3860,-71.5398],[-16.3927,-71.5393],[-16.3954,-71.5448],[-16.3938,-71.5519]]},{id:'cayma',name:'Cayma',province:'Arequipa',department:'Arequipa',center:[-16.3634,-71.5458],polygon:[[-16.3570,-71.5552],[-16.3548,-71.5458],[-16.3589,-71.5369],[-16.3678,-71.5359],[-16.3714,-71.5443],[-16.3685,-71.5537]]},{id:'cercado-arequipa',name:'Cercado de Arequipa',province:'Arequipa',department:'Arequipa',center:[-16.3988,-71.5369],polygon:[[-16.3945,-71.5438],[-16.3937,-71.5340],[-16.3986,-71.5292],[-16.4046,-71.5311],[-16.4054,-71.5407],[-16.4002,-71.5447]]},{id:'cerro-colorado',name:'Cerro Colorado',province:'Arequipa',department:'Arequipa',center:[-16.3767,-71.5580],polygon:[[-16.3715,-71.5672],[-16.3696,-71.5562],[-16.3744,-71.5487],[-16.3820,-71.5486],[-16.3850,-71.5565],[-16.3824,-71.5668]]}]}};
function getDistrictsBySelection(){const dep=qs('#districtDepartmentSelect')?.value||'Arequipa';const prov=qs('#districtProvinceSelect')?.value||'Arequipa';return districtCatalog[dep]?.[prov]||[];}
function districtNameById(id){return getDistrictsBySelection().find(d=>d.id===id)?.name||'';}
function renderDistrictList(){const box=qs('#districtList');if(!box)return;const districts=getDistrictsBySelection();if(!districts.length){box.innerHTML='<div class="district-item"><b>Sin resultados</b><span>No hay distritos cargados.</span></div>';return;}box.innerHTML=districts.map(d=>`<button class="district-item ${selectedDistrictId===d.id?'active':''}" type="button" data-district-id="${d.id}"><b>${d.name}</b><span>${d.province} · ${d.department}</span></button>`).join('');qsa('[data-district-id]').forEach(btn=>btn.addEventListener('click',()=>selectDistrictById(btn.dataset.districtId,true)));}
function buildDistrictLayer(){if(!window.L)return null;const districts=getDistrictsBySelection();return L.layerGroup(districts.map(d=>{const poly=L.polygon(d.polygon,{color:'#64748b',weight:2,fillColor:'#94a3b8',fillOpacity:.10}).bindPopup(`<b>${d.name}</b><br>${d.province}, ${d.department}`).bindTooltip(d.name,{direction:'center',className:'district-label'});poly.on('click',()=>selectDistrictById(d.id,true));poly._districtId=d.id;return poly;}));}
function refreshDistrictLayer(){if(!leafletMap)return;if(districtLayer&&leafletMap.hasLayer(districtLayer))leafletMap.removeLayer(districtLayer);districtLayer=buildDistrictLayer();const on=!!qs('#layerDistritos')?.checked;if(on&&districtLayer)districtLayer.addTo(leafletMap);if(selectedDistrictLayer&&leafletMap.hasLayer(selectedDistrictLayer))leafletMap.removeLayer(selectedDistrictLayer);selectedDistrictLayer=null;if(on&&selectedDistrictId){const exists=getDistrictsBySelection().some(d=>d.id===selectedDistrictId);if(exists)selectDistrictById(selectedDistrictId,false);}updateActiveLayerLabel();}
function selectDistrictById(id,fit=true){const district=getDistrictsBySelection().find(d=>d.id===id);if(!district||!leafletMap)return;selectedDistrictId=district.id;if(selectedDistrictLayer&&leafletMap.hasLayer(selectedDistrictLayer))leafletMap.removeLayer(selectedDistrictLayer);selectedDistrictLayer=L.polygon(district.polygon,{color:'#0ea5e9',weight:3,fillColor:'#38bdf8',fillOpacity:.24}).addTo(leafletMap).bindPopup(`<b>${district.name}</b><br>${district.province}, ${district.department}<br>Distrito delimitado`);if(fit){leafletMap.fitBounds(selectedDistrictLayer.getBounds(),{padding:[28,28]});selectedDistrictLayer.openPopup();}const polyPoints=district.polygon.map(p=>({lat:p[0],lng:p[1]}));const records=recordsInsidePolygon(polyPoints);setActiveAreaRecords(records,'Distrito seleccionado: '+district.name,'Distrito delimitado · '+district.province+' – '+district.department);renderDistrictList();updateActiveLayerLabel();showToast('Distrito seleccionado: '+district.name);}
function toggleDistrictsFeature(enabled){if(enabled){qs('#districtsPanel')?.classList.add('open');renderDistrictList();refreshDistrictLayer();}else{qs('#districtsPanel')?.classList.remove('open');if(districtLayer&&leafletMap?.hasLayer(districtLayer))leafletMap.removeLayer(districtLayer);if(selectedDistrictLayer&&leafletMap?.hasLayer(selectedDistrictLayer))leafletMap.removeLayer(selectedDistrictLayer);districtLayer=null;selectedDistrictLayer=null;selectedDistrictId=null;activeAreaRecords=[];renderAreaStats(null);updateStatsByCurrentSelection();}updateActiveLayerLabel();}
function enableDistrictPanelDrag(){const panel=qs('#districtsPanel'),handle=qs('#districtsPanelHandle'),shell=qs('.map-shell');if(!panel||!handle||!shell||panel.dataset.dragReady==='1')return;panel.dataset.dragReady='1';let dragging=false,startX=0,startY=0,startLeft=0,startTop=0;function onMove(e){if(!dragging)return;panel.style.left=(startLeft+e.clientX-startX)+'px';panel.style.top=(startTop+e.clientY-startY)+'px';}function onUp(){if(!dragging)return;dragging=false;document.removeEventListener('pointermove',onMove);document.removeEventListener('pointerup',onUp);const shellRect=shell.getBoundingClientRect(),rect=panel.getBoundingClientRect();let left=rect.left-shellRect.left,top=rect.top-shellRect.top;left=Math.max(8,Math.min(left,shellRect.width-rect.width-8));top=Math.max(8,Math.min(top,shellRect.height-rect.height-8));panel.style.left=left+'px';panel.style.top=top+'px';}handle.addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;dragging=true;startX=e.clientX;startY=e.clientY;startLeft=parseFloat(panel.style.left||92);startTop=parseFloat(panel.style.top||92);document.addEventListener('pointermove',onMove);document.addEventListener('pointerup',onUp);});}
function getLayerExtension(filename=''){return filename.split('.').pop().toLowerCase();}
function baseFilename(filename){const dot=filename.lastIndexOf('.');return dot>0?filename.slice(0,dot):filename;}
function splitCoordinateText(text){return text.trim().split(String.fromCharCode(10)).join(' ').split(String.fromCharCode(9)).join(' ').split(' ').filter(Boolean);}
function friendlyLayerType(ext){if(ext==='gpx')return 'GPX';if(ext==='geojson'||ext==='json')return 'GeoJSON';if(ext==='kml')return 'KML';if(ext==='zip')return 'ZIP / SHP';return 'Desconocido';}
function randomLayerColor(index){const palette=['#f97316','#22c55e','#8b5cf6','#ef4444','#0ea5e9','#eab308'];return palette[index%palette.length];}
function flattenGeoJsonCoords(coords,out){if(!coords)return;if(typeof coords[0]==='number'){out.push({lat:Number(coords[1]),lng:Number(coords[0])});return;}coords.forEach(function(c){flattenGeoJsonCoords(c,out);});}
function extractFeatureCoords(feature){const out=[];if(feature&&feature.geometry)flattenGeoJsonCoords(feature.geometry.coordinates,out);return out.filter(function(p){return Number.isFinite(p.lat)&&Number.isFinite(p.lng);});}
function featureLatLng(feature,layer){if(layer&&typeof layer.getBounds==='function'){try{const b=layer.getBounds();if(b&&typeof b.isValid==='function'&&b.isValid())return b.getCenter();}catch(e){}}const coords=extractFeatureCoords(feature);if(!coords.length)return {lat:null,lng:null};let lat=0,lng=0;coords.forEach(function(c){lat+=c.lat;lng+=c.lng;});return {lat:lat/coords.length,lng:lng/coords.length};}
function geoJsonFeatureToRecord(feature,layer,layerName,color,index){const props=feature.properties||{};const ll=featureLatLng(feature,layer);const label=props.Nombre_proyecto||props.NAME||props.Sector_comercial||props.id||props.ID_PIPE||('Elemento '+(index+1));return Object.assign({},props,{_geoJsonFeature:true,_geoJsonProps:props,_geoJsonLayerName:layerName,_geoJsonColor:color,_geoIndex:index,_geoJsonGeomType:(feature.geometry&&feature.geometry.type)||'Feature',lat:ll.lat,lng:ll.lng,loteId:props.id||props.ID||('GEO-'+(index+1)),suministro:props.id||props.Codigo_proyecto||props.ID_PIPE||('GEO-'+(index+1)),beneficiario:label,objectType:props.tipo_geoportal||((feature.geometry&&feature.geometry.type)||'GeoJSON'),estadoInstalacion:props.STATE||props.estado||'GeoJSON',tipoSuministro:props.tipo_geoportal||'GeoJSON',empresaInstaladora:props.Contratista_asignado||'-',beneficiarios:1,liquidacion:0});}
function buildGeoJsonPopup(record,layerName){const props=record._geoJsonProps||{};const title=record.beneficiario||layerName;const safe=function(v){return String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');};const lines=Object.keys(props).slice(0,6).map(function(k){return safe(String(k).replace(/_/g,' '))+': '+safe(props[k]);}).join('<br>');return '<b>'+safe(title)+'</b><br>'+(lines||('Capa: '+safe(layerName)));}
function parseGeoJSONLayer(text,name,color){const json=JSON.parse(text);const records=[];const layer=L.geoJSON(json,{style:function(){return {color:color,weight:3,fillColor:color,fillOpacity:.18};},pointToLayer:function(feature,latlng){return L.circleMarker(latlng,{radius:6,color:color,weight:2,fillColor:color,fillOpacity:.9});},onEachFeature:function(feature,subLayer){const idx=records.length;const record=geoJsonFeatureToRecord(feature,subLayer,name,color,idx);record._geoCoords=extractFeatureCoords(feature);record._layer=subLayer;records.push(record);subLayer.bindPopup(buildGeoJsonPopup(record,name));subLayer.on('click',function(e){if(activeMapTool==='circle'||activeMapTool==='polygon'||activeMapTool==='measure'){handleMapToolClick(e);if(e.originalEvent&&L.DomEvent)L.DomEvent.stopPropagation(e.originalEvent);return;}selectMapObject(record,subLayer,e.originalEvent);if(e.originalEvent&&L.DomEvent)L.DomEvent.stopPropagation(e.originalEvent);});}});layer._uploadRecords=records;return layer;}
function parseGPXLayer(text,name,color){const xml=new DOMParser().parseFromString(text,'text/xml');const layers=[];xml.querySelectorAll('trkseg').forEach(seg=>{const pts=[...seg.querySelectorAll('trkpt')].map(p=>[parseFloat(p.getAttribute('lat')),parseFloat(p.getAttribute('lon'))]).filter(x=>!Number.isNaN(x[0])&&!Number.isNaN(x[1]));if(pts.length)layers.push(L.polyline(pts,{color,weight:4,opacity:.95}).bindPopup(`<b>${name}</b><br>Tipo: GPX · Track`));});xml.querySelectorAll('rte').forEach(route=>{const pts=[...route.querySelectorAll('rtept')].map(p=>[parseFloat(p.getAttribute('lat')),parseFloat(p.getAttribute('lon'))]).filter(x=>!Number.isNaN(x[0])&&!Number.isNaN(x[1]));if(pts.length)layers.push(L.polyline(pts,{color,weight:4,dashArray:'6 6',opacity:.95}).bindPopup(`<b>${name}</b><br>Tipo: GPX · Ruta`));});xml.querySelectorAll('wpt').forEach(wpt=>{const lat=parseFloat(wpt.getAttribute('lat')),lon=parseFloat(wpt.getAttribute('lon'));if(!Number.isNaN(lat)&&!Number.isNaN(lon))layers.push(L.circleMarker([lat,lon],{radius:6,color,weight:2,fillColor:color,fillOpacity:.95}).bindPopup(`<b>${name}</b><br>Tipo: GPX · Punto`));});return L.featureGroup(layers);}
function parseKMLLayer(text,name,color){const xml=new DOMParser().parseFromString(text,'text/xml');const layers=[];xml.querySelectorAll('LineString').forEach(line=>{const coordsText=line.querySelector('coordinates')?.textContent||'';const coords=splitCoordinateText(coordsText).map(c=>{const parts=c.split(',').map(Number);return [parts[1],parts[0]];}).filter(x=>!Number.isNaN(x[0])&&!Number.isNaN(x[1]));if(coords.length)layers.push(L.polyline(coords,{color,weight:4,opacity:.95}).bindPopup(`<b>${name}</b><br>Tipo: KML · Línea`));});xml.querySelectorAll('Polygon').forEach(poly=>{const coordsText=poly.querySelector('coordinates')?.textContent||'';const coords=splitCoordinateText(coordsText).map(c=>{const parts=c.split(',').map(Number);return [parts[1],parts[0]];}).filter(x=>!Number.isNaN(x[0])&&!Number.isNaN(x[1]));if(coords.length)layers.push(L.polygon(coords,{color,weight:3,fillColor:color,fillOpacity:.18}).bindPopup(`<b>${name}</b><br>Tipo: KML · Polígono`));});xml.querySelectorAll('Point').forEach(point=>{const coordsText=point.querySelector('coordinates')?.textContent||'';const parts=coordsText.trim().split(',').map(Number);const lon=parts[0],lat=parts[1];if(!Number.isNaN(lat)&&!Number.isNaN(lon))layers.push(L.circleMarker([lat,lon],{radius:6,color,weight:2,fillColor:color,fillOpacity:.95}).bindPopup(`<b>${name}</b><br>Tipo: KML · Punto`));});return L.featureGroup(layers);}
function buildLayerFromFile(fileText,ext,name,color){if(ext==='geojson'||ext==='json')return parseGeoJSONLayer(fileText,name,color);if(ext==='gpx')return parseGPXLayer(fileText,name,color);if(ext==='kml')return parseKMLLayer(fileText,name,color);return null;}
function collectLayerBounds(layer){if(!layer||typeof L==='undefined')return null;let bounds=null;const extendBounds=function(b){if(!b)return;try{if(typeof b.isValid==='function'&&!b.isValid())return;if(!bounds)bounds=L.latLngBounds(b);else bounds.extend(b);}catch(e){}};const visit=function(node){if(!node)return;if(typeof node.getLatLng==='function'){const ll=node.getLatLng();if(ll&&Number.isFinite(ll.lat)&&Number.isFinite(ll.lng))extendBounds(L.latLngBounds([ll,ll]));return;}if(typeof node.getBounds==='function'){try{extendBounds(node.getBounds());}catch(e){}}if(typeof node.eachLayer==='function')node.eachLayer(visit);};visit(layer);return bounds;}
function fitMapToLayerBounds(layer,opts){
  opts=opts||{};
  if(!leafletMap||!layer)return false;
  const padding=opts.padding||[56,56];
  const maxZoom=opts.maxZoom!=null?opts.maxZoom:17;
  const animate=opts.animate!==false;
  try{
    const bounds=collectLayerBounds(layer);
    if(bounds&&typeof bounds.isValid==='function'&&bounds.isValid()){
      leafletMap.fitBounds(bounds,{padding:padding,maxZoom:maxZoom,animate:animate});
      return true;
    }
    if(typeof layer.getBounds==='function'){
      const b=layer.getBounds();
      if(b&&typeof b.isValid==='function'&&b.isValid()){
        leafletMap.fitBounds(b,{padding:padding,maxZoom:maxZoom,animate:animate});
        return true;
      }
    }
    if(typeof layer.getLatLng==='function'){
      const ll=layer.getLatLng();
      if(ll&&Number.isFinite(ll.lat)&&Number.isFinite(ll.lng)){
        leafletMap.setView([ll.lat,ll.lng],opts.pointZoom||15,{animate:animate});
        return true;
      }
    }
  }catch(err){}
  return false;
}
function zoomLeafletToLayer(layer,opts){
  if(typeof leafletMap.invalidateSize==='function')leafletMap.invalidateSize();
  return fitMapToLayerBounds(layer,opts);
}
function centerMapOnUploadedLayer(layer){
  if(!leafletMap||!layer)return;
  window.__geoJsonCenterLockUntil=Date.now()+4000;
  const run=function(){
    if(typeof leafletMap.invalidateSize==='function')leafletMap.invalidateSize();
    fitMapToLayerBounds(layer,{padding:[56,56],maxZoom:17});
  };
  run();
  setTimeout(run,320);
}
window.zoomLeafletToLayer=zoomLeafletToLayer;
window.centerMapOnUploadedLayer=centerMapOnUploadedLayer;
window.shouldSkipBonogasAutoMapZoom=shouldSkipBonogasAutoMapZoom;
function layerScopeLabel(scope){return scope==='shared'?'Compartida · Equipo':'Individual · Solo usuario';}
function layerScopeBadge(scope){const cls=scope==='shared'?'shared':'individual';return `<span class="layer-scope-badge ${cls}">${layerScopeLabel(scope)}</span>`;}
function renderUploadedLayersList(){const box=qs('#uploadedLayersList');if(!box)return;if(!uploadedMapLayers.length){box.innerHTML='<div class="uploaded-empty">No hay capas cargadas</div>';return;}box.innerHTML=uploadedMapLayers.map((item,idx)=>`<div class="uploaded-layer-item"><div class="uploaded-layer-top"><div><div class="uploaded-layer-name">${item.name}</div><div class="uploaded-layer-meta">${item.type} · ${item.filename}</div>${layerScopeBadge(item.scope)}</div></div><div class="uploaded-layer-actions"><label><input type="checkbox" data-upload-layer="${idx}" ${item.visible?'checked':''} ${item.layer?'':'disabled'}> Visible</label>${item.layer?`<button type="button" data-zoom-layer="${idx}">Zoom</button>`:''}<button class="remove-layer" type="button" data-remove-layer="${idx}">Eliminar</button></div></div>`).join('');qsa('[data-upload-layer]').forEach(input=>input.addEventListener('change',e=>{const idx=Number(e.target.dataset.uploadLayer),item=uploadedMapLayers[idx];if(!item||!item.layer||!leafletMap)return;item.visible=e.target.checked;item.visible?item.layer.addTo(leafletMap):leafletMap.removeLayer(item.layer);updateOverlayVisibility();}));qsa('[data-zoom-layer]').forEach(btn=>btn.addEventListener('click',e=>{const item=uploadedMapLayers[Number(e.target.dataset.zoomLayer)];if(!item||!item.layer||!leafletMap)return;if(!zoomLeafletToLayer(item.layer,{padding:[56,56],maxZoom:17}))showToast('La capa no tiene extensión para zoom')}));qsa('[data-remove-layer]').forEach(btn=>btn.addEventListener('click',e=>{const idx=Number(e.target.dataset.removeLayer),item=uploadedMapLayers[idx];if(item?.layer&&leafletMap?.hasLayer(item.layer))leafletMap.removeLayer(item.layer);uploadedMapLayers.splice(idx,1);renderUploadedLayersList();updateOverlayVisibility();showToast('Capa eliminada')}));}
function resetUploadLayerForm(){pendingLayerFile=null;if(qs('#selectedLayerFileName'))qs('#selectedLayerFileName').textContent='Ningún archivo seleccionado';if(qs('#layerDisplayName'))qs('#layerDisplayName').value='';if(qs('#layerDetectedType'))qs('#layerDetectedType').value='';if(qs('#layerFileInput'))qs('#layerFileInput').value='';const individual=qs('input[name="layerVisibilityScope"][value="individual"]');if(individual)individual.checked=true;}
function openUploadLayerWorkflow(){
  resetUploadLayerForm();
  const title=qs('#uploadLayerModal .modal-head h2'),desc=qs('#uploadLayerModal .modal-head p'),file=qs('#layerFileInput');
  if(title)title.textContent='Subir capa GIS';
  if(desc)desc.textContent='Cargue archivos GPX, GeoJSON, KML o ZIP, asigne un nombre y defina si será individual o compartida.';
  if(file)file.accept='.gpx,.geojson,.json,.kml,.zip';
  const formGrid=qs('#uploadLayerModal .form-grid'),actions=qs('#uploadLayerModal .modal-actions');
  if(formGrid)formGrid.style.setProperty('display','grid','important');
  if(actions)actions.style.setProperty('display','flex','important');
  qs('#geoJsonEditor')?.classList.remove('open');
  openModal('uploadLayerModal');
}
function openGeoJsonUploadWorkflow(){
  const modal=qs('#uploadLayerModal');
  if(modal&&modal.classList.contains('open'))return;
  openUploadLayerWorkflow();
  const title=qs('#uploadLayerModal .modal-head h2'),desc=qs('#uploadLayerModal .modal-head p'),file=qs('#layerFileInput'),type=qs('#layerDetectedType'),card=qs('#uploadLayerModal .modal-card');
  if(title)title.textContent='Cargar GeoJSON';
  if(desc)desc.textContent='Seleccione un archivo .json o .geojson para cargarlo como capa de la agrupación.';
  if(file)file.accept='.geojson,.json';
  if(type)type.placeholder='GeoJSON / JSON';
  qs('#uploadLayerModal .form-grid')?.style.setProperty('display','none','important');
  qs('#uploadLayerModal .modal-actions')?.style.setProperty('display','none','important');
  let editor=qs('#geoJsonEditor');
  if(!editor&&card){
    editor=document.createElement('div');
    editor.id='geoJsonEditor';
    editor.className='geojson-editor';
    editor.innerHTML='<div class="geojson-file-box"><div><b>Archivo GeoJSON</b><span>Formatos permitidos: .geojson y .json</span><button class="btn dark" type="button" id="geoJsonChooseBtn">Seleccionar archivo</button><p class="geojson-file-name" id="geoJsonFileName">Ningún archivo seleccionado</p></div></div><div class="modal-actions" style="margin-top:0"><button class="btn dark" type="button" id="geoJsonCancelBtn">Cancelar</button><button class="btn" type="button" id="geoJsonLoadBtn">Cargar GeoJSON</button></div>';
    card.appendChild(editor);
  }
  editor?.classList.add('open');
  const nameBox=qs('#geoJsonFileName');
  if(nameBox)nameBox.textContent=pendingLayerFile?.name||'Ningún archivo seleccionado';
  if(file&&!file.dataset.geoJsonChangeBound){
    file.dataset.geoJsonChangeBound='1';
    file.addEventListener('change',function(e){
      const selected=e.target.files?.[0];
      if(!selected)return;
      pendingLayerFile=selected;
      if(nameBox)nameBox.textContent=selected.name;
      if(qs('#selectedLayerFileName'))qs('#selectedLayerFileName').textContent=selected.name;
      if(qs('#layerDisplayName'))qs('#layerDisplayName').value=baseFilename(selected.name);
      if(qs('#layerDetectedType'))qs('#layerDetectedType').value='GeoJSON / JSON';
    });
  }
}
function isBonogasGeoJsonUploadContext(){
  const main=qs('.main');
  return !!(main&&(main.classList.contains('bonogas-satcontrol-mode')||main.classList.contains('bonogas-active')));
}
function bindGeoJsonUploadWorkflowButtons(){
  ['#uploadLayerBtn'].forEach(function(selector){
    const button=qs(selector);
    if(!button||button.dataset.gisUploadBound==='1')return;
    button.dataset.gisUploadBound='1';
    button.addEventListener('click',function(e){
      e.preventDefault();
      e.stopPropagation();
      closeMapPanels();
      openUploadLayerWorkflow();
    });
  });
}
window.openGeoJsonUploadWorkflow=openGeoJsonUploadWorkflow;
window.openUploadLayerWorkflow=openUploadLayerWorkflow;
window.bindGeoJsonUploadWorkflowButtons=bindGeoJsonUploadWorkflowButtons;
function confirmGeoJsonFileUpload(){
  if(!pendingLayerFile){showToast('Seleccione un archivo GeoJSON');return;}
  const ext=getLayerExtension(pendingLayerFile.name);
  if(!['geojson','json'].includes(ext)){showToast('Solo se permite .geojson o .json');return;}
  if(qs('#layerDisplayName'))qs('#layerDisplayName').value=baseFilename(pendingLayerFile.name);
  confirmLayerUpload();
}
function loadScriptOnce(src,globalName){
  return new Promise((resolve,reject)=>{
    if(globalName&&window[globalName])return resolve(window[globalName]);
    const existing=[...document.scripts].find(s=>s.src===src);
    if(existing){
      existing.addEventListener('load',()=>resolve(globalName?window[globalName]:true),{once:true});
      existing.addEventListener('error',reject,{once:true});
      return;
    }
    const script=document.createElement('script');
    script.src=src;
    script.onload=()=>resolve(globalName?window[globalName]:true);
    script.onerror=reject;
    document.head.appendChild(script);
  });
}
async function ensureHtml2Canvas(){
  if(window.html2canvas)return window.html2canvas;
  return loadScriptOnce('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js','html2canvas');
}
async function ensureJsPdf(){
  if(window.jspdf?.jsPDF)return window.jspdf.jsPDF;
  await loadScriptOnce('https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js','jspdf');
  return window.jspdf?.jsPDF;
}
function reportEsc(value){
  return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
async function generateSatcontrolPdfReport(){
  let jsPDF;
  try{jsPDF=await ensureJsPdf();}catch(err){showToast('No se pudo cargar librería PDF');return;}
  if(!jsPDF){showToast('Librería PDF no disponible');return;}
  let html2canvasFn;
  try{html2canvasFn=await ensureHtml2Canvas();}catch(err){showToast('No se pudo cargar captura para PDF');return;}
  const p=currentProject();
  const now=new Date();
  const generated=now.toLocaleString('es-PE',{year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false});
  showToast('Generando reporte PDF...');
  if(leafletMap)leafletMap.invalidateSize();
  await new Promise(resolve=>setTimeout(resolve,320));
  const report=document.createElement('div');
  report.id='satcontrolPdfReport';
  report.style.cssText='position:fixed;left:-99999px;top:0;width:1800px;background:#fff;color:#0f172a;font-family:Inter,Arial,sans-serif;';
  const mapClone=qs('.map-shell')?.cloneNode(true);
  const infoClone=qs('.info-panel')?.cloneNode(true);
  if(mapClone){
    mapClone.querySelectorAll('.project-utils-dock,.toolbar,.map-floating-panel,.location-search,.date-select,.heat-legend,.map-status,.draw-hint,.map-legend-float,.layer-label,.sat-panel-toggle').forEach(el=>el.remove());
    mapClone.style.width='1210px';
    mapClone.style.height='930px';
    mapClone.style.minHeight='930px';
    mapClone.style.borderRadius='18px';
    mapClone.style.boxShadow='none';
  }
  if(infoClone){
    infoClone.querySelectorAll('.right-collapse-btn,.utils,.project-details,.supply-card.empty,.scroll-section .area-summary,.corrections-suite,.export-excel-btn').forEach(el=>el.remove());
    infoClone.style.width='390px';
    infoClone.style.height='930px';
    infoClone.style.borderRadius='18px';
    infoClone.style.boxShadow='none';
    infoClone.style.overflow='hidden';
  }
  report.innerHTML=`<div style="height:110px;background:#0f1428;color:#fff;display:grid;grid-template-columns:1fr 1fr 1fr;align-items:center;padding:0 48px;border-top:2px solid #4b5563">
    <div><h1 style="margin:0 0 12px;font-size:28px;font-weight:950">REPORTE SATCONTROL</h1><div style="font-size:20px">Agrupación: ${reportEsc(p.nombre||'-')}</div></div>
    <div style="font-size:20px;text-align:center;align-self:end;padding-bottom:12px">Departamento: ${reportEsc(p.departamento||'-')}</div>
    <div style="font-size:18px;text-align:right">Generado: ${reportEsc(generated)}</div>
  </div>
  <div style="padding:48px;background:#fff">
    <div id="satcontrolReportBody" style="background:#081126;border-radius:20px;padding:22px;display:flex;gap:20px;min-height:980px">
      <div id="reportMapMount"></div>
      <aside id="reportInfoMount" style="width:390px"></aside>
    </div>
    <div style="font-size:16px;color:#8aa0c4;margin-top:12px">Paulet · SATCONTROL</div>
  </div>`;
  if(mapClone)report.querySelector('#reportMapMount').appendChild(mapClone);
  if(infoClone)report.querySelector('#reportInfoMount').appendChild(infoClone);
  document.body.appendChild(report);
  try{
    const canvas=await html2canvasFn(report,{backgroundColor:'#ffffff',scale:1.25,useCORS:true,logging:false});
    const img=canvas.toDataURL('image/jpeg',0.92);
    const pdf=new jsPDF({orientation:'landscape',unit:'pt',format:'a4'});
    const pageW=pdf.internal.pageSize.getWidth(),pageH=pdf.internal.pageSize.getHeight();
    pdf.addImage(img,'JPEG',0,0,pageW,pageH);
    pdf.save('REPORTE_SATCONTROL.pdf');
    showToast('PDF generado correctamente');
  }catch(err){
    console.error(err);
    showToast('No se pudo generar la captura PDF');
  }finally{
    report.remove();
  }
}
async function confirmLayerUpload(){
  if(!pendingLayerFile){showToast('Seleccione un archivo');return;}
  const ext=getLayerExtension(pendingLayerFile.name),type=friendlyLayerType(ext),displayName=(qs('#layerDisplayName').value||baseFilename(pendingLayerFile.name)).trim(),scope=qs('input[name="layerVisibilityScope"]:checked')?.value||'individual';
  if(!displayName){showToast('Ingrese un nombre para la capa');return;}
  const color=randomLayerColor(uploadedMapLayers.length);
  if(ext==='zip'){
    uploadedMapLayers.push({name:displayName,filename:pendingLayerFile.name,type,scope,visible:false,layer:null,records:[]});
    renderUploadedLayersList();closeModal('uploadLayerModal');
    showToast(scope==='shared'?'Capa ZIP compartida registrada':'Capa ZIP individual registrada');
    return;
  }
  try{
    const text=await pendingLayerFile.text();
    const layer=buildLayerFromFile(text,ext,displayName,color);
    if(!layer){showToast('Formato no soportado');return;}
    const records=layer._uploadRecords||[];
    uploadedMapLayers.push({name:displayName,filename:pendingLayerFile.name,type,scope,visible:true,layer,records});
    if(leafletMap){layer.addTo(leafletMap);}
    renderUploadedLayersList();
    const bonogasMap=qs('.main')&&(qs('.main').classList.contains('bonogas-satcontrol-mode')||qs('.main').classList.contains('bonogas-active'));
    if(bonogasMap){syncUploadedMapLayersToLeaflet();}else{updateOverlayVisibility();}
    closeModal('uploadLayerModal');
    qs('#geoJsonEditor')?.classList.remove('open');
    showToast(scope==='shared'?'Capa compartida cargada':'Capa individual cargada');
    if(leafletMap){
      if(typeof resizeMapAfterLayout==='function')resizeMapAfterLayout();
      centerMapOnUploadedLayer(layer);
    }
  }catch(err){console.error(err);showToast('No se pudo cargar la capa');}
}

function distanceMeters(a,b){const R=6371000,rad=Math.PI/180;const dLat=(b.lat-a.lat)*rad,dLng=(b.lng-a.lng)*rad;const lat1=a.lat*rad,lat2=b.lat*rad;const h=Math.sin(dLat/2)**2+Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLng/2)**2;return 2*R*Math.asin(Math.sqrt(h));}
function totalDistance(points){let d=0;for(let i=1;i<points.length;i++)d+=distanceMeters(points[i-1],points[i]);return d;}
function formatDistance(m){return m>=1000?(m/1000).toFixed(2)+' km':Math.round(m)+' m';}
function projectPoint(p){const R=6378137,rad=Math.PI/180;return {x:R*p.lng*rad,y:R*Math.log(Math.tan(Math.PI/4+(p.lat*rad)/2))};}
function polygonAreaMeters(points){if(points.length<3)return 0;const projected=points.map(projectPoint);let sum=0;for(let i=0;i<projected.length;i++){const a=projected[i],b=projected[(i+1)%projected.length];sum+=a.x*b.y-b.x*a.y;}return Math.abs(sum/2);}
function formatArea(a){return a>=10000?(a/10000).toFixed(2)+' ha':Math.round(a)+' m²';}
function clearTempShape(){if(tempShape&&drawLayer)drawLayer.removeLayer(tempShape);tempShape=null;}
function ensureDrawLayer(){if(drawLayer)return drawLayer;if(typeof leafletMap==='undefined'||!leafletMap||typeof L==='undefined')return null;drawLayer=L.layerGroup().addTo(leafletMap);return drawLayer;}
function defaultCircleRadiusMeters(){if(!leafletMap||!circleCenter)return 450;try{const c=leafletMap.latLngToContainerPoint(circleCenter);const size=leafletMap.getSize();const offset=Math.min(size.x,size.y)*0.22;const edge=leafletMap.containerPointToLatLng(L.point(c.x+offset,c.y));return Math.max(120,distanceMeters(circleCenter,edge));}catch(e){return 450;}}
function offsetLatLng(center,radiusMeters,bearingDeg){const R=6378137;const br=(bearingDeg||90)*Math.PI/180;const lat1=center.lat*Math.PI/180;const lng1=center.lng*Math.PI/180;const lat2=Math.asin(Math.sin(lat1)*Math.cos(radiusMeters/R)+Math.cos(lat1)*Math.sin(radiusMeters/R)*Math.cos(br));const lng2=lng1+Math.atan2(Math.sin(br)*Math.sin(radiusMeters/R)*Math.cos(lat1),Math.cos(radiusMeters/R)-Math.sin(lat1)*Math.sin(lat2));return L.latLng(lat2*180/Math.PI,lng2*180/Math.PI);}
function getCircleDrawRadius(){if(!circleCenter)return 0;if(tempShape&&typeof tempShape.getRadius==='function'){const r=tempShape.getRadius();if(r>0)return r;}if(circlePreviewRadius>0)return circlePreviewRadius;if(circlePreviewPoint){const r=distanceMeters(circleCenter,circlePreviewPoint);if(r>0)return r;}return defaultCircleRadiusMeters();}
function setMapTool(tool){activeMapTool=tool;drawingPoints=[];circleCenter=null;circlePreviewPoint=null;circlePreviewRadius=0;clearTempShape();qsa('.tool-utility').forEach(b=>b.classList.remove('active'));qsa('#projectUtilsDock [data-proy-tool-proxy]').forEach(b=>b.classList.remove('active'));const buttons={select:['#selectToolBtn','#utilSelectToolBtn','#bonoUtilSelectToolBtn'],measure:['#measureToolBtn','#utilMeasureToolBtn','#bonoUtilMeasureToolBtn'],polygon:['#polygonToolBtn','#utilPolygonToolBtn','#bonoUtilPolygonToolBtn'],circle:['#circleToolBtn','#utilCircleToolBtn','#bonoUtilCircleToolBtn']}[tool]||[];buttons.forEach(sel=>{qs(sel)?.classList.add('active');qsa('[data-proy-tool-proxy="'+sel+'"]').forEach(c=>c.classList.add('active'));});const hint=qs('#toolHint'),text=qs('#toolHintText');if(!hint||!text)return;const messages={select:'Herramienta: Seleccionar objetos. Clic selecciona uno; Ctrl + clic agrega o retira varios.',measure:'Medición activa: haga clic en el mapa para trazar distancia.',polygon:'Dibujo de área: marque vértices y presione Finalizar o doble clic en el mapa.',circle:'Círculo activo: primer clic centro, ajuste el radio y presione Finalizar.'};text.textContent=messages[tool];hint.classList.toggle('open',tool!=='select');if(leafletMap)leafletMap.getContainer().style.cursor=tool==='select'?'':'crosshair';}
function addMeasureTooltip(layer,label){layer.bindTooltip(label,{permanent:true,direction:'center',className:'measure-label'});}
function finalizeCircleSelection(radius){if(!ensureDrawLayer()||!circleCenter||!(radius>0))return false;clearTempShape();const records=recordsInsideCircle(circleCenter,radius);const stats=summarizeRecords(records);setActiveAreaRecords(records,'Selección por círculo','Radio: '+formatDistance(radius)+' · Área: '+formatArea(Math.PI*radius*radius));const c=L.circle(circleCenter,{radius:radius,color:'#22d3ee',weight:3,fillColor:'#22d3ee',fillOpacity:.18}).addTo(drawLayer).bindPopup('<b>Círculo dibujado</b><br>Radio: '+formatDistance(radius)+'<br>Área: '+formatArea(Math.PI*radius*radius)+'<br>Suministros: '+stats.total+'<br>Conectados: '+stats.conectados+'<br>En construcción: '+stats.construccion+'<br>Beneficiarios: '+stats.beneficiarios+'<br>Liquidaciones: '+formatMoney(stats.liquidacion)+'<br>Total morosidad: '+formatMoney(stats.pendiente||0));addMeasureTooltip(c,'Suministros '+stats.total+' · Morosidad '+formatMoney(stats.pendiente||0));circleCenter=null;circlePreviewPoint=null;circlePreviewRadius=0;showToast('Círculo creado: '+stats.total+' suministros dentro');setMapTool('select');return true;}
function updateDrawingPreview(extraPoint){if(!ensureDrawLayer())return;clearTempShape();const pts=extraPoint?[...drawingPoints,extraPoint]:drawingPoints;if(activeMapTool==='measure'&&pts.length>1){tempShape=L.polyline(pts,{color:'#0ea5e9',weight:4,dashArray:'6 6'}).addTo(drawLayer);addMeasureTooltip(tempShape,formatDistance(totalDistance(pts)));}if(activeMapTool==='polygon'&&pts.length>1){tempShape=(pts.length>2?L.polygon(pts,{color:'#f59e0b',weight:3,fillColor:'#f59e0b',fillOpacity:.22}):L.polyline(pts,{color:'#f59e0b',weight:3,dashArray:'6 6'})).addTo(drawLayer);if(pts.length>2)addMeasureTooltip(tempShape,formatArea(polygonAreaMeters(pts)));}if(activeMapTool==='circle'&&circleCenter&&extraPoint){const r=distanceMeters(circleCenter,extraPoint);circlePreviewRadius=r;circlePreviewPoint=extraPoint;tempShape=L.circle(circleCenter,{radius:r,color:'#22d3ee',weight:3,fillColor:'#22d3ee',fillOpacity:.18}).addTo(drawLayer);addMeasureTooltip(tempShape,'Radio '+formatDistance(r));}}
function handleMapToolClick(e){if(activeMapTool==='select')return;if(!ensureDrawLayer())return;if(e&&e.originalEvent)L.DomEvent.stopPropagation(e.originalEvent);if(activeMapTool==='measure'){drawingPoints.push(e.latlng);L.circleMarker(e.latlng,{radius:4,color:'#0ea5e9',fillColor:'#e0f2fe',fillOpacity:1,weight:2}).addTo(drawLayer);updateDrawingPreview();showToast(drawingPoints.length>1?'Distancia: '+formatDistance(totalDistance(drawingPoints)):'Punto inicial de medición');}
if(activeMapTool==='polygon'){drawingPoints.push(e.latlng);L.circleMarker(e.latlng,{radius:4,color:'#f59e0b',fillColor:'#fde68a',fillOpacity:1,weight:2}).addTo(drawLayer);updateDrawingPreview();showToast(drawingPoints.length>2?'Área: '+formatArea(polygonAreaMeters(drawingPoints)):'Vértice agregado');}
if(activeMapTool==='circle'){if(!circleCenter){circleCenter=e.latlng;L.circleMarker(circleCenter,{radius:5,color:'#22d3ee',fillColor:'#cffafe',fillOpacity:1,weight:2}).addTo(drawLayer);circlePreviewRadius=defaultCircleRadiusMeters();circlePreviewPoint=offsetLatLng(circleCenter,circlePreviewRadius,90);updateDrawingPreview(circlePreviewPoint);showToast('Centro definido · ajuste el radio o presione Finalizar');}else finalizeCircleSelection(distanceMeters(circleCenter,e.latlng));}}
function handleMapToolMove(e){if(activeMapTool==='select')return;if(activeMapTool==='measure'&&drawingPoints.length>0)updateDrawingPreview(e.latlng);if(activeMapTool==='polygon'&&drawingPoints.length>0)updateDrawingPreview(e.latlng);if(activeMapTool==='circle'&&circleCenter){circlePreviewPoint=e.latlng;updateDrawingPreview(e.latlng);}}
function finishDrawing(){if(!ensureDrawLayer()){showToast('Mapa no listo para dibujar');return;}if(activeMapTool==='circle'){if(!circleCenter){showToast('Marque primero el centro del círculo en el mapa');return;}if(!finalizeCircleSelection(getCircleDrawRadius()))showToast('No se pudo cerrar el círculo');return;}
if(activeMapTool==='measure'&&drawingPoints.length>1){clearTempShape();const line=L.polyline(drawingPoints,{color:'#0ea5e9',weight:4}).addTo(drawLayer).bindPopup('<b>Medición</b><br>Distancia: '+formatDistance(totalDistance(drawingPoints)));addMeasureTooltip(line,formatDistance(totalDistance(drawingPoints)));showToast('Medición finalizada');setMapTool('select');}
if(activeMapTool==='polygon'&&drawingPoints.length>2){clearTempShape();const records=recordsInsidePolygon(drawingPoints);const stats=summarizeRecords(records);setActiveAreaRecords(records,'Selección por área / polígono','Área: '+formatArea(polygonAreaMeters(drawingPoints)));const poly=L.polygon(drawingPoints,{color:'#f59e0b',weight:3,fillColor:'#f59e0b',fillOpacity:.24}).addTo(drawLayer).bindPopup('<b>Polígono / área</b><br>Área: '+formatArea(polygonAreaMeters(drawingPoints))+'<br>Suministros: '+stats.total+'<br>Conectados: '+stats.conectados+'<br>En construcción: '+stats.construccion+'<br>Beneficiarios: '+stats.beneficiarios+'<br>Liquidaciones: '+formatMoney(stats.liquidacion)+'<br>Total morosidad: '+formatMoney(stats.pendiente||0));addMeasureTooltip(poly,'Suministros '+stats.total+' · Morosidad '+formatMoney(stats.pendiente||0));showToast('Polígono finalizado: '+stats.total+' suministros dentro');setMapTool('select');}
drawingPoints=[];circleCenter=null;circlePreviewPoint=null;circlePreviewRadius=0;tempShape=null;}
function clearDrawings(){if(drawLayer){drawLayer.clearLayers();if(leafletMap&&leafletMap.hasLayer(drawLayer))leafletMap.removeLayer(drawLayer);}drawLayer=(leafletMap&&typeof L!=='undefined')?L.layerGroup().addTo(leafletMap):null;drawingPoints=[];circleCenter=null;circlePreviewPoint=null;circlePreviewRadius=0;tempShape=null;activeAreaRecords=[];syncActiveAreaRecordsGlobal();clearObjectSelection(false);renderSupplyDetails(null);renderAreaStats(null);updateStatsByCurrentSelection();if(typeof refreshActiveProjectPanel==='function')refreshActiveProjectPanel();if(typeof window.syncPlazoAreaSelectionUi==='function')window.syncPlazoAreaSelectionUi();if(activeMapTool!=='select')setMapTool('select');showToast('Dibujos, selecciones y estadísticas limpiados');}
function bindMapDrawButtons(){const finish=qs('#finishDrawBtn');const clear=qs('#clearDrawBtn');if(finish&&!finish.dataset.drawBound){finish.dataset.drawBound='1';finish.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();finishDrawing();});}if(clear&&!clear.dataset.drawBound){clear.dataset.drawBound='1';clear.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();clearDrawings();});}}
window.finishDrawing=finishDrawing;window.clearDrawings=clearDrawings;window.setMapTool=setMapTool;window.bindMapDrawButtons=bindMapDrawButtons;
function setBaseLayer(name){if(!leafletMap)return;Object.values(baseLayers).forEach(layer=>{if(layer&&leafletMap.hasLayer(layer))leafletMap.removeLayer(layer)});if(baseLayers[name])baseLayers[name].addTo(leafletMap);activeBase=name;updateActiveLayerLabel();if(name==='sat')setTimeout(openSatelliteIndicesPanel,0);}
function updateActiveLayerLabel(){const label=qs('#activeLayerLabel');if(!label)return;const baseLabels={osm:'OpenStreetMap',dark:'Carto Dark',sat:'Satélite'};const active=[];const coberturaOn=qs('#layerCobertura')?.checked??true;const troncalOn=qs('#layerTroncal')?.checked??true;const ramalesOn=qs('#layerRamales')?.checked??true;const concesionariaOn=qs('#layerConcesionaria')?.checked??true;const morosidadOn=qs('#layerMorosidad')?.checked??false;const estratoOn=qs('#layerEstrato')?.checked??true;const beneficiariosOn=qs('#layerBeneficiarios')?.checked??true;const distritosOn=qs('#layerDistritos')?.checked??false;if(estratoOn)active.push('Estrato INEI');if(beneficiariosOn)active.push('Beneficiarios');if(coberturaOn)active.push('Cobertura');if(troncalOn)active.push('Troncal');if(ramalesOn)active.push('Ramales');if(concesionariaOn)active.push('Redes por concesionaria');if(distritosOn)active.push(selectedDistrictId?'Distrito: '+districtNameById(selectedDistrictId):'Distritos delimitados');if(morosidadOn)active.push('Temático: Bono Gas · Morosidad');const thematicLabels={layerThemeValeDensity:'Vale FISE · Densidad',layerThemeGnvConsumption:'Ahorro GNV · Consumos',layerThemePhotovoltaic:'Fotovoltaico · Operatividad',layerThemeMasification:'Masificación · Redes',layerThemeElectricity:'Electricidad al Toque · Beneficiarios',layerThemeMcter:'MCTER · Densidad'};Object.entries(thematicLabels).forEach(([id,text])=>{if(qs('#'+id)?.checked)active.push('Temático: '+text);});if(activeSatelliteMode)active.push('Satelital: '+satelliteModeLabel(activeSatelliteMode));const userLayers=(uploadedMapLayers||[]).filter(x=>x.visible).length;if(userLayers)active.push(userLayers+' capa(s) cargada(s)');label.innerHTML='Capas activas: <span style="color:#67e8f9">'+(active.join(' · ')||'Sin capas')+'</span><br><span style="color:#cbd5e1;font-size:10px">Mapa base: '+(baseLabels[activeBase]||activeBase)+'</span>';}

function cycleBaseLayer(){const order=['osm','dark','sat'];setBaseLayer(order[(order.indexOf(activeBase)+1)%order.length]);showToast('Capa base cambiada a '+activeBase.toUpperCase());}
function syncMapToProject(p){if(!leafletMap||!p)return;if(typeof isBonogasSatcontrolView==='function'&&isBonogasSatcontrolView())return;clearProyectosForeignMapLayers();ensureProjectLayerToggles();activeMapProjectId=p.id;if(typeof p.lat!=='number'||typeof p.lng!=='number'){p.lat=-12.0464;p.lng=-77.0428;}const coords=[p.lat,p.lng];const benCount=Math.min(38,Math.max(16,Math.round((p.beneficiarios||24)/6)));[beneficiaryLayer,gasLayer,coberturaLayer,troncalLayer,ramalesLayer,concesionariaLayer,morosityLayer].forEach(layer=>{if(layer&&leafletMap.hasLayer(layer))leafletMap.removeLayer(layer);});if(estratoLayer){estratoLayer.clearLayers();estratoLayer.addData(buildEstratoGeoJSON(p.lat,p.lng));}beneficiaryLayer=buildBeneficiaries(p.lat,p.lng,benCount,p);lastSyncedProjectId=p.id;gasLayer=buildGasNetwork(p.lat,p.lng);coberturaLayer=buildCoberturaLayer(p.lat,p.lng);troncalLayer=buildTroncalLayer(p.lat,p.lng);ramalesLayer=buildRamalesLayer(p.lat,p.lng);concesionariaLayer=buildConcesionariaLayer(p.lat,p.lng);morosityLayer=buildMorosityHeatLayer(p.lat,p.lng);if(projectMarker){if(leafletMap.hasLayer(projectMarker))leafletMap.removeLayer(projectMarker);projectMarker.setLatLng(coords).setPopupContent(`<b>${p.nombre}</b><br>${p.distrito}, ${p.departamento}<br>${p.beneficiarios} beneficiarios estimados`);}else{projectMarker=L.marker(coords,{icon:L.divIcon({className:'',html:'<div class="project-pin"></div>',iconSize:[46,46],iconAnchor:[15,15]})}).bindPopup(`<b>${p.nombre}</b><br>${p.distrito}, ${p.departamento}<br>${p.beneficiarios} beneficiarios estimados`);}refreshDistrictLayer();updateOverlayVisibility();refreshSatelliteAnalysisLayer();try{if(beneficiaryLayer&&beneficiaryLayer.getLayers().length){const b=L.featureGroup(beneficiaryLayer.getLayers()).getBounds();if(b.isValid())leafletMap.fitBounds(b.pad(0.12),{padding:[50,50],maxZoom:15,animate:true});else leafletMap.setView(coords,14,{animate:true});}else leafletMap.setView(coords,14,{animate:true});}catch(err){leafletMap.setView(coords,14,{animate:true});}if(projectMarker&&!leafletMap.hasLayer(projectMarker))projectMarker.addTo(leafletMap);setTimeout(()=>{if(leafletMap){leafletMap.invalidateSize();}},120);}
function initLeafletMap(){if(!window.L){qs('#map').innerHTML='<div class="map-fallback">No se pudo cargar Leaflet desde CDN.<br>La maqueta mantiene el contenedor GIS listo para conexión.</div>';return;}const first=projects[0];leafletMap=L.map('map',{zoomControl:true,preferCanvas:true,attributionControl:false}).setView([first.lat,first.lng],14);baseLayers.osm=L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap'});baseLayers.dark=L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',{maxZoom:19,attribution:'© OpenStreetMap · © CARTO'});baseLayers.sat=L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',{maxZoom:19,attribution:'Tiles © Esri'});setBaseLayer('osm');estratoLayer=L.geoJSON(buildEstratoGeoJSON(first.lat,first.lng),{style:styleEstrato,onEachFeature:(f,l)=>{l.bindPopup(`<b>Lote · Estrato ${f.properties.estrato}</b><br>Suministro: ${f.properties.suministro}<br>Estado: ${f.properties.estadoInstalacion}`);l.on('click',e=>selectMapObject(f.properties,l,e.originalEvent));}});beneficiaryLayer=buildBeneficiaries(first.lat,first.lng,24,first);lastSyncedProjectId=first.id;gasLayer=buildGasNetwork(first.lat,first.lng);coberturaLayer=buildCoberturaLayer(first.lat,first.lng);troncalLayer=buildTroncalLayer(first.lat,first.lng);ramalesLayer=buildRamalesLayer(first.lat,first.lng);concesionariaLayer=buildConcesionariaLayer(first.lat,first.lng);morosityLayer=buildMorosityHeatLayer(first.lat,first.lng);districtLayer=buildDistrictLayer();projectMarker=L.marker([first.lat,first.lng],{icon:L.divIcon({className:'',html:'<div class="project-pin"></div>',iconSize:[46,46],iconAnchor:[15,15]})}).addTo(leafletMap).bindPopup(`<b>${first.nombre}</b><br>${first.distrito}, ${first.departamento}<br>${first.beneficiarios} beneficiarios estimados`);updateOverlayVisibility();drawLayer=L.layerGroup().addTo(leafletMap);leafletMap.on('click',handleMapToolClick);leafletMap.on('mousemove',handleMapToolMove);leafletMap.on('dblclick',function(e){if(activeMapTool==='polygon'&&drawingPoints.length>2){if(e&&e.originalEvent)L.DomEvent.stopPropagation(e.originalEvent);finishDrawing();}});setTimeout(()=>leafletMap.invalidateSize(),120);}
function renderAll(){renderProjects();renderInfo();}
function openModal(id){const modal=qs('#'+id);if(modal)modal.classList.add('open')}function closeModal(id){const modal=qs('#'+id);if(modal)modal.classList.remove('open')}window.openModal=openModal;window.closeModal=closeModal;qsa('[data-close]').forEach(b=>b.onclick=()=>closeModal(b.dataset.close));qsa('.modal').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)m.classList.remove('open')}));document.addEventListener('keydown',function(e){if(e.key!=='Escape')return;const open=Array.from(document.querySelectorAll('.modal.open'));if(open.length)open[open.length-1].classList.remove('open');});ensureSupplyInstallerLinks();
const PROJECT_BENEF_HEADERS=['Tipo de intervencion','Tipo de beneficiario','ID beneficiario','RUC / DNI','Razon social','Tipo de Entidad','Consumo 12 meses (kWh)','Estado beneficiario','Monto vale (S/)','Tipo combustible / programa'];
const PROJECT_BENEF_KEYS=['tipoIntervencion','tipo','id','doc','razon','entidad','consumo','estado','monto','programa'];
let projectModalBeneficiaries=[];
function isExcelBeneficiaryImportMode(){const scope=document.documentElement.getAttribute('data-module-scope');if(['bonogas','ahorro-gnv','masificacion'].indexOf(scope)>=0)return true;if(typeof isBonogasSatcontrolView==='function'&&isBonogasSatcontrolView())return true;const main=qs('.main');return !!(main&&(main.classList.contains('gnv-satcontrol-mode')||main.classList.contains('masificacion-mode')));}
function isBonogasBeneficiaryImportMode(){return isExcelBeneficiaryImportMode();}
function excelBenefApi(){return window.ExcelBeneficiaryImport;}
function syncBonogasBeneficiaryUi(scope){const excel=isExcelBeneficiaryImportMode();const api=excelBenefApi();if(api){if(excel)api.setModuleLabel(api.getModuleLabelFromDom());api.syncUi(scope,excel);}else if(scope==='modal'&&typeof renderProjectModalBeneficiaries==='function'&&!excel)renderProjectModalBeneficiaries();}
function setBonogasBeneficiaryRows(scope,rows){excelBenefApi()?.setRows(scope,rows);}
function downloadBonogasBeneficiaryFormat(){excelBenefApi()?.downloadFormat();}
function importBonogasBeneficiaryFile(scope,file){return excelBenefApi()?.importFile(scope,file);}
function initBonogasBeneficiaryImport(){excelBenefApi()?.init({showToast:showToast});}
function getBonogasBeneficiaryRows(scope){return excelBenefApi()?excelBenefApi().getRows(scope):[];}
function resetBonogasBeneficiaryImport(scope){excelBenefApi()?.reset(scope);syncBonogasBeneficiaryUi(scope);}
function defaultProjectBeneficiary(idx){idx=idx||1;return {tipoIntervencion:'',tipo:'Residencial',id:'BEN-'+String(idx).padStart(3,'0'),doc:idx===1?'20123456789':'',razon:'',entidad:'',consumo:'',estado:'Activo',monto:'',programa:'GLP'};}
function escAttr(v){return String(v==null?'':v).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');}
function projectBeneficiaryCardHtml(b,i,total){
  const tipoInterv=`<select data-ben-field="tipoIntervencion" data-ben-idx="${i}"><option value="">-- Seleccione --</option><option${b.tipoIntervencion==='Instalacion interna'?' selected':''}>Instalacion interna</option><option${b.tipoIntervencion==='Conexion domiciliaria'?' selected':''}>Conexion domiciliaria</option><option${b.tipoIntervencion==='Habilitacion'?' selected':''}>Habilitacion</option></select>`;
  const entidad=`<select data-ben-field="entidad" data-ben-idx="${i}"><option value="">-- Seleccione --</option><option${b.entidad==='Persona natural'?' selected':''}>Persona natural</option><option${b.entidad==='Empresa'?' selected':''}>Empresa</option><option${b.entidad==='Institucion'?' selected':''}>Institucion</option></select>`;
  const programa=`<select data-ben-field="programa" data-ben-idx="${i}"><option${b.programa==='GLP'?' selected':''}>GLP</option><option${b.programa==='Gas natural'?' selected':''}>Gas natural</option><option${b.programa==='Electricidad'?' selected':''}>Electricidad</option></select>`;
  return `<div class="project-beneficiary-card" data-ben-card="${i}"><div class="project-beneficiary-head"><h4>Beneficiario #${i+1}</h4><button class="btn red" type="button" data-ben-remove="${i}" ${total<=1?'disabled':''}>Eliminar</button></div><div class="project-create-grid"><div class="project-create-field"><label>Tipo de intervencion</label>${tipoInterv}</div><div class="project-create-field"><label>Tipo de beneficiario</label><input data-ben-field="tipo" data-ben-idx="${i}" value="${escAttr(b.tipo)}" placeholder="Residencial"></div><div class="project-create-field"><label>ID beneficiario</label><input data-ben-field="id" data-ben-idx="${i}" value="${escAttr(b.id)}" placeholder="BEN-001"></div><div class="project-create-field"><label>RUC / DNI</label><input data-ben-field="doc" data-ben-idx="${i}" value="${escAttr(b.doc)}" placeholder="20123456789"></div><div class="project-create-field"><label>Razon social</label><input data-ben-field="razon" data-ben-idx="${i}" value="${escAttr(b.razon)}" placeholder="Empresa o institucion"></div><div class="project-create-field"><label>Tipo de Entidad</label>${entidad}</div><div class="project-create-field"><label>Consumo 12 meses (kWh)</label><input data-ben-field="consumo" data-ben-idx="${i}" type="number" value="${escAttr(b.consumo)}"></div><div class="project-create-field"><label>Estado beneficiario</label><input data-ben-field="estado" data-ben-idx="${i}" value="${escAttr(b.estado||'Activo')}"></div><div class="project-create-field"><label>Monto vale (S/)</label><input data-ben-field="monto" data-ben-idx="${i}" value="${escAttr(b.monto)}" placeholder="Opcional"></div><div class="project-create-field"><label>Tipo combustible / programa</label>${programa}</div></div></div>`;
}
function syncProjectModalBeneficiariesFromDom(){const list=qs('#projectModalBenefList');if(!list)return;list.querySelectorAll('[data-ben-field]').forEach(function(inp){const idx=Number(inp.dataset.benIdx),field=inp.dataset.benField;if(!projectModalBeneficiaries[idx])return;projectModalBeneficiaries[idx][field]=inp.value;});}
function renderProjectModalBeneficiaries(){const list=qs('#projectModalBenefList'),countEl=qs('#projectModalBenefCount');if(!list)return;syncProjectModalBeneficiariesFromDom();if(!projectModalBeneficiaries.length)projectModalBeneficiaries=[defaultProjectBeneficiary(1)];if(countEl)countEl.textContent='Beneficiarios ('+projectModalBeneficiaries.length+')';list.innerHTML=projectModalBeneficiaries.map(function(b,i){return projectBeneficiaryCardHtml(b,i,projectModalBeneficiaries.length);}).join('');list.querySelectorAll('[data-ben-remove]').forEach(function(btn){btn.addEventListener('click',function(){const idx=Number(btn.dataset.benRemove);if(projectModalBeneficiaries.length<=1)return;syncProjectModalBeneficiariesFromDom();projectModalBeneficiaries.splice(idx,1);renderProjectModalBeneficiaries();});});list.querySelectorAll('[data-ben-field]').forEach(function(inp){const handler=function(){const idx=Number(inp.dataset.benIdx),field=inp.dataset.benField;if(projectModalBeneficiaries[idx])projectModalBeneficiaries[idx][field]=inp.value;};inp.addEventListener('input',handler);inp.addEventListener('change',handler);});}
function addProjectModalBeneficiary(){syncProjectModalBeneficiariesFromDom();projectModalBeneficiaries.push(defaultProjectBeneficiary(projectModalBeneficiaries.length+1));renderProjectModalBeneficiaries();showToast('Beneficiario #'+(projectModalBeneficiaries.length)+' agregado');}
function getProjectModalBeneficiaries(){syncProjectModalBeneficiariesFromDom();return projectModalBeneficiaries.map(function(b){return Object.assign({},b);});}
function setProjectModalBeneficiaries(rows){projectModalBeneficiaries=(rows&&rows.length?rows:[defaultProjectBeneficiary(1)]).map(function(b,i){return Object.assign(defaultProjectBeneficiary(i+1),b);});renderProjectModalBeneficiaries();}
function exportProjectModalBeneficiaries(){const rows=getProjectModalBeneficiaries();const lines=[PROJECT_BENEF_HEADERS.map(csvCell).join(',')];rows.forEach(function(r){lines.push(PROJECT_BENEF_KEYS.map(function(k){return csvCell(r[k]||'');}).join(','));});downloadTextFile('beneficiarios_proyecto.csv',lines.join('\n'));showToast('Beneficiarios exportados: '+rows.length);}
function parseProjectBeneficiaryCsv(text){const lines=text.split(/\r?\n/).filter(function(l){return l.trim();});if(lines.length<2)return[];const splitLine=function(line){return line.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map(function(c){return c.replace(/^"|"$/g,'').replace(/""/g,'"').trim();});};return lines.slice(1).map(function(line,i){const cols=splitLine(line);const row={};PROJECT_BENEF_KEYS.forEach(function(k,idx){row[k]=cols[idx]||'';});return Object.assign(defaultProjectBeneficiary(i+1),row);}).filter(function(r){return r.id||r.doc||r.razon||r.tipo;});}
function importProjectModalBeneficiariesFile(file){if(!file)return;const reader=new FileReader();reader.onload=function(){const rows=parseProjectBeneficiaryCsv(String(reader.result||''));if(!rows.length){showToast('No se encontraron beneficiarios en el archivo');return;}setProjectModalBeneficiaries(rows);showToast('Importados '+rows.length+' beneficiario(s)');};reader.readAsText(file);}
function initProjectModalBeneficiaries(){if(window.__projectModalBenefInit)return;window.__projectModalBenefInit=true;qs('#projectModalAddBenefBtn')?.addEventListener('click',addProjectModalBeneficiary);qs('#projectModalExportBtn')?.addEventListener('click',exportProjectModalBeneficiaries);qs('#projectModalImportBtn')?.addEventListener('click',function(){qs('#projectModalImportInput')?.click();});qs('#projectModalImportInput')?.addEventListener('change',function(e){const file=e.target.files&&e.target.files[0];importProjectModalBeneficiariesFile(file);e.target.value='';});}
function openProjectModal(id){editingId=id||null;initProjectModalBeneficiaries();initBonogasBeneficiaryImport();qs('#modalTitle').textContent=qs('.main')?.classList.contains('masificacion-mode')?(id?'Modificar proyecto':'Crear proyecto'):(id?'Modificar agrupación':'Crear agrupación');const f=qs('#projectForm');const p=id?projects.find(x=>x.id===id):{id:'FISE-2026-004',nombre:'Red de Gas Natural - Sector 010101',lider:'',responsables:[],departamento:'Lima',provincia:'Lima',distrito:'Magdalena',tipo:'Masificación de gas FISE',estado:'En evaluación',beneficiarios:0,area:'-'};['id','nombre','lider','departamento','provincia','distrito','tipo','estado','beneficiarios','area'].forEach(k=>f.elements[k].value=p[k]??'');if(f.elements.ubigeo)f.elements.ubigeo.value=p.ubigeo||'010101';f.elements.responsables.value=(p.responsables||[]).join(', ');if(isBonogasBeneficiaryImportMode()){resetBonogasBeneficiaryImport('modal');setBonogasBeneficiaryRows('modal',p.bonogasBeneficiariosList||[]);}else{setProjectModalBeneficiaries(p.beneficiariosList&&p.beneficiariosList.length?p.beneficiariosList:[defaultProjectBeneficiary(1)]);}syncBonogasBeneficiaryUi('modal');openModal('projectModal');if(qs('.main')?.classList.contains('masificacion-mode')){const modal=qs('#projectModal');if(modal){const walker=document.createTreeWalker(modal,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);nodes.forEach(node=>{node.nodeValue=node.nodeValue.replace(/agrupaciones/gi,'proyectos').replace(/agrupación/gi,'proyecto').replace(/de la nueva proyecto/gi,'del nuevo proyecto').replace(/de la proyecto/gi,'del proyecto');});}}}
window.openProjectModal=openProjectModal;
document.addEventListener('click',e=>{if(e.target&&e.target.id==='openFullInstallerRankingBtn'){openInstallerRanking(qs('#valInstallerMiniDetail h4')?.textContent||'Instalaciones del Norte S.A.C.')}if(e.target&&e.target.id==='gnvOpenFullInstallerRankingBtn'){openInstallerRanking(qs('#gnvValInstallerMiniDetail h4')?.textContent||'Instalaciones del Norte S.A.C.')}});
qs('#projectForm').onsubmit=e=>{e.preventDefault();const f=e.target;const bonogasMode=isBonogasBeneficiaryImportMode();const benefList=bonogasMode?getBonogasBeneficiaryRows('modal'):getProjectModalBeneficiaries();if(bonogasMode&&!benefList.length){showToast('Suba un Excel con al menos un beneficiario');return;}const obj={id:f.id.value,nombre:f.nombre.value,lider:f.lider.value,responsables:f.responsables.value.split(',').map(x=>x.trim()).filter(Boolean),departamento:f.departamento.value,provincia:f.provincia.value,distrito:f.distrito.value,tipo:f.tipo.value,estado:f.estado.value,beneficiarios:benefList.length||Number(f.beneficiarios.value||0),beneficiariosList:bonogasMode?[]:benefList,bonogasBeneficiariosList:bonogasMode?benefList:[],area:f.area.value,ubigeo:f.ubigeo?.value||''};const idx=projects.findIndex(p=>p.id===editingId);if(idx>=0){projects[idx]=Object.assign({},projects[idx],obj,{lat:projects[idx].lat,lng:projects[idx].lng});}else{projects.unshift(Object.assign({lat:-12.0464,lng:-77.0428},obj));}selectedId=obj.id;closeModal('projectModal');showToast('Agrupación guardada con '+benefList.length+' beneficiario(s)');renderAll();if(qs('.main')?.classList.contains('project-list-mode'))renderProjectListTable()};

/* Formulario avanzado de agrupaciones: Excel flexible, tabla editable y área GIS. */
let projectBeneficiaryHeaders=['Nombre','Documento','Código','Estado'];
let projectBeneficiaryRows=[];
let projectBeneficiaryPage=1;
const PROJECT_BENEF_PAGE_SIZE=8;
let projectAreaSelectionPending=false;
let projectAreaPolygon=[];

function projectUniqueHeaders(values){
  const used={};
  return (values||[]).map(function(value,index){
    let base=String(value==null?'':value).trim()||('Columna '+(index+1));
    used[base]=(used[base]||0)+1;
    return used[base]>1?base+' '+used[base]:base;
  });
}
function projectRowHasData(row){return projectBeneficiaryHeaders.some(h=>String(row&&row[h]!=null?row[h]:'').trim());}
function projectSyncTableInputs(){
  qsa('#projectBeneficiaryTableBody [data-project-row][data-project-col]').forEach(function(input){
    const index=Number(input.dataset.projectRow),header=decodeURIComponent(input.dataset.projectCol||'');
    if(projectBeneficiaryRows[index])projectBeneficiaryRows[index][header]=input.value;
  });
}
function projectUpdateBeneficiaryCount(){
  const count=projectBeneficiaryRows.length;
  const countEl=qs('#projectModalBenefCount'),input=qs('#projectForm [name="beneficiarios"]');
  if(countEl)countEl.textContent='Beneficiarios ('+count+')';
  if(input)input.value=String(count);
}
function renderEnhancedProjectBeneficiaries(){
  projectSyncTableInputs();
  const table=qs('#projectBeneficiaryTable'),body=qs('#projectBeneficiaryTableBody'),head=table?.querySelector('thead');
  if(!table||!body||!head)return;
  const pages=Math.max(1,Math.ceil(projectBeneficiaryRows.length/PROJECT_BENEF_PAGE_SIZE));
  projectBeneficiaryPage=Math.max(1,Math.min(projectBeneficiaryPage,pages));
  const start=(projectBeneficiaryPage-1)*PROJECT_BENEF_PAGE_SIZE;
  const rows=projectBeneficiaryRows.slice(start,start+PROJECT_BENEF_PAGE_SIZE);
  head.innerHTML='<tr><th>#</th>'+projectBeneficiaryHeaders.map(h=>'<th>'+escHtml(h)+'</th>').join('')+'<th>Acción</th></tr>';
  body.innerHTML=rows.length?rows.map(function(row,offset){
    const absolute=start+offset;
    return '<tr><td class="project-row-number">'+(absolute+1)+'</td>'+projectBeneficiaryHeaders.map(function(header){
      return '<td><input data-project-row="'+absolute+'" data-project-col="'+encodeURIComponent(header)+'" value="'+escAttr(row[header]??'')+'"></td>';
    }).join('')+'<td><button type="button" class="project-table-delete" data-project-delete-row="'+absolute+'">Eliminar</button></td></tr>';
  }).join(''):'<tr><td colspan="'+(projectBeneficiaryHeaders.length+2)+'" class="project-table-empty">Suba un Excel o agregue un registro directamente.</td></tr>';
  const label=qs('#projectBeneficiaryPageLabel'),prev=qs('#projectBeneficiaryPrev'),next=qs('#projectBeneficiaryNext');
  if(label)label.textContent='Página '+projectBeneficiaryPage+' de '+pages;
  if(prev)prev.disabled=projectBeneficiaryPage<=1;
  if(next)next.disabled=projectBeneficiaryPage>=pages;
  qsa('[data-project-delete-row]').forEach(btn=>btn.addEventListener('click',function(){
    projectSyncTableInputs();projectBeneficiaryRows.splice(Number(btn.dataset.projectDeleteRow),1);renderEnhancedProjectBeneficiaries();
  }));
  projectUpdateBeneficiaryCount();
}
function projectSetBeneficiaryData(headers,rows){
  projectBeneficiaryHeaders=projectUniqueHeaders(headers&&headers.length?headers:['Nombre','Documento','Código','Estado']);
  projectBeneficiaryRows=(rows||[]).map(function(values){
    if(Array.isArray(values)){const row={};projectBeneficiaryHeaders.forEach((h,i)=>row[h]=String(values[i]??''));return row;}
    const row={};projectBeneficiaryHeaders.forEach(h=>row[h]=String(values&&values[h]!=null?values[h]:''));return row;
  }).filter(projectRowHasData);
  projectBeneficiaryPage=1;
  renderEnhancedProjectBeneficiaries();
}
function projectParseCsvMatrix(text){
  const lines=String(text||'').split(/\r?\n/).filter(line=>line.trim());
  if(!lines.length)return[];
  const delimiter=(lines[0].match(/;/g)||[]).length>(lines[0].match(/,/g)||[]).length?';':',';
  return lines.map(function(line){return line.split(new RegExp(delimiter+'(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)')).map(cell=>cell.replace(/^\"|\"$/g,'').replace(/\"\"/g,'\"').trim());});
}
function projectImportAnyExcel(file){
  if(!file)return;
  const ext=(file.name.split('.').pop()||'').toLowerCase();
  if(!['xlsx','xls','csv'].includes(ext)){showToast('Use un archivo XLSX, XLS o CSV');return;}
  const reader=new FileReader();
  reader.onerror=()=>showToast('No se pudo leer el archivo');
  reader.onload=function(){
    try{
      let matrix=[];
      if(ext==='csv')matrix=projectParseCsvMatrix(String(reader.result||''));
      else{
        if(!window.XLSX)throw new Error('La librería Excel no está disponible');
        const book=XLSX.read(new Uint8Array(reader.result),{type:'array'});
        if(!book.SheetNames.length)throw new Error('El Excel no contiene hojas');
        matrix=XLSX.utils.sheet_to_json(book.Sheets[book.SheetNames[0]],{header:1,defval:'',raw:false});
      }
      matrix=matrix.filter(row=>Array.isArray(row)&&row.some(cell=>String(cell??'').trim()));
      if(matrix.length<2)throw new Error('El archivo debe incluir encabezados y al menos un registro');
      const width=Math.max(...matrix.map(row=>row.length));
      const headers=projectUniqueHeaders(Array.from({length:width},(_,i)=>matrix[0][i]));
      projectSetBeneficiaryData(headers,matrix.slice(1));
      showToast('Excel cargado: '+projectBeneficiaryRows.length+' beneficiario(s)');
    }catch(err){showToast(err.message||'No se pudo procesar el Excel');}
  };
  if(ext==='csv')reader.readAsText(file);else reader.readAsArrayBuffer(file);
}
function projectExistingBeneficiaryData(project){
  const rows=(project?.beneficiariosList&&project.beneficiariosList.length?project.beneficiariosList:project?.bonogasBeneficiariosList)||[];
  if(!rows.length&&project&&Number(project.beneficiarios)>0){
    const headers=['Nombre','Documento','Código','Estado','Distrito'];
    const generated=Array.from({length:Number(project.beneficiarios)},function(_,index){
      const number=index+1;
      return {
        Nombre:'Beneficiario '+String(number).padStart(3,'0')+' · '+(project.nombre||'Agrupación'),
        Documento:String(70000000+number),
        Código:(project.id||'PROY')+'-BEN-'+String(number).padStart(4,'0'),
        Estado:index%7===0?'Pendiente':'Activo',
        Distrito:project.distrito||''
      };
    });
    return {headers,rows:generated};
  }
  if(!rows.length)return {headers:['Nombre','Documento','Código','Estado'],rows:[]};
  const headers=project?.beneficiaryHeaders&&project.beneficiaryHeaders.length?project.beneficiaryHeaders:Array.from(new Set(rows.flatMap(row=>Object.keys(row||{}))));
  return {headers,rows};
}
function projectLeaderOptions(selected){
  const values=Array.from(new Set(projects.map(p=>p.lider).concat(['Oliver Gonzales','María Quispe','Carlos Mendoza','Ana Torres']).filter(Boolean)));
  return values.map(v=>'<option value="'+escAttr(v)+'"'+(v===selected?' selected':'')+'>'+escHtml(v)+'</option>').join('');
}
function projectTeamOptions(selected){
  const selectedSet=new Set(selected||[]);
  const values=Array.from(new Set(projects.flatMap(p=>p.responsables||[]).concat(['Equipo GIS','Equipo Social','Equipo Técnico','Operaciones','Catastro','Campo','Mesa Técnica'])));
  return values.map(v=>'<option value="'+escAttr(v)+'"'+(selectedSet.has(v)?' selected':'')+'>'+escHtml(v)+'</option>').join('');
}
function projectRefreshTeamPicker(){
  const select=qs('#projectForm [name="equipo"]'),label=qs('#projectTeamPickerLabel');
  if(!select||!label)return;
  const selected=Array.from(select.selectedOptions).map(option=>option.value);
  label.textContent=selected.length?(selected.length+' seleccionado(s): '+selected.join(', ')):'Seleccione uno o varios integrantes';
  qsa('#projectTeamPickerMenu input[type="checkbox"]').forEach(box=>{box.checked=selected.includes(box.value);});
}
function projectRenderTeamPicker(){
  const select=qs('#projectForm [name="equipo"]'),menu=qs('#projectTeamPickerMenu');
  if(!select||!menu)return;
  menu.innerHTML=Array.from(select.options).map(function(option){
    return '<label class="project-team-option"><input type="checkbox" value="'+escAttr(option.value)+'"'+(option.selected?' checked':'')+'><span>'+escHtml(option.textContent)+'</span></label>';
  }).join('');
  qsa('#projectTeamPickerMenu input[type="checkbox"]').forEach(box=>box.addEventListener('change',function(){
    const option=Array.from(select.options).find(item=>item.value===box.value);if(option)option.selected=box.checked;projectRefreshTeamPicker();
  }));
  projectRefreshTeamPicker();
}
function ensureEnhancedProjectModal(){
  const form=qs('#projectForm');if(!form||form.dataset.enhanced==='1')return;
  form.dataset.enhanced='1';
  form.innerHTML=`<div class="form-grid enhanced-project-grid">
    <div class="field"><label>Código de agrupación</label><input name="id" required></div>
    <div class="field"><label>Nombre de la agrupación</label><input name="nombre" required></div>
    <div class="field"><label>Fecha de inicio</label><input name="fechaInicio" type="date"></div>
    <div class="field"><label>Fecha de fin</label><input name="fechaFin" type="date"></div>
    <div class="field"><label>Responsable líder</label><select name="lider" required></select></div>
    <div class="field project-team-field"><label>Equipo</label><select name="equipo" multiple hidden></select><div class="project-team-picker"><button type="button" id="projectTeamPickerBtn" aria-expanded="false"><span id="projectTeamPickerLabel">Seleccione uno o varios integrantes</span><b>▾</b></button><div id="projectTeamPickerMenu" class="project-team-menu"></div></div><small>Marque todos los integrantes que forman parte del equipo.</small></div>
    <div class="field"><label>Departamento</label><input name="departamento"></div>
    <div class="field"><label>Provincia</label><input name="provincia"></div>
    <div class="field"><label>Distrito</label><input name="distrito"></div>
    <div class="field"><label>Tipo de agrupación</label><select name="tipo"><option>Masificación de gas FISE</option><option>Servicio GLP</option><option>Conversión energética</option><option>Validación de beneficiarios</option></select></div>
    <div class="field"><label>Estado</label><select name="estado"><option>En evaluación</option><option>Aprobado</option><option>Observado</option><option>En campo</option><option>En ejecución</option></select></div>
    <div class="field"><label>Beneficiarios estimados</label><input name="beneficiarios" type="number" readonly></div>
    <div class="field project-area-field"><label>Área de influencia</label><div class="project-area-control"><input name="area" readonly placeholder="Sin área definida"><button type="button" class="btn" id="projectDefineAreaBtn">Definir en mapa</button></div></div>
    <div class="field"><label>Localización (centro del polígono)</label><input name="localizacion" readonly placeholder="Latitud, longitud"><input name="lat" type="hidden"><input name="lng" type="hidden"><input name="polygon" type="hidden"></div>
  </div>
  <section class="project-beneficiary-table-section">
    <div class="project-beneficiary-table-head"><div><h3 id="projectModalBenefCount">Beneficiarios (0)</h3><p>Importe cualquier Excel o edite las celdas directamente.</p></div><div class="project-beneficiary-actions"><button type="button" class="btn dark" id="projectExcelBtn">Subir Excel</button><button type="button" class="btn" id="projectAddRowBtn">+ Agregar registro</button><input id="projectExcelInput" type="file" accept=".xlsx,.xls,.csv" hidden></div></div>
    <div class="project-beneficiary-table-scroll"><table id="projectBeneficiaryTable"><thead></thead><tbody id="projectBeneficiaryTableBody"></tbody></table></div>
    <div class="project-beneficiary-pagination"><button type="button" id="projectBeneficiaryPrev">Anterior</button><span id="projectBeneficiaryPageLabel">Página 1 de 1</span><button type="button" id="projectBeneficiaryNext">Siguiente</button></div>
  </section>
  <div class="modal-actions"><button type="button" class="btn dark" id="projectCancelBtn">Cancelar</button><button class="btn" type="submit">Guardar agrupación</button></div>`;
  qs('#projectExcelBtn').addEventListener('click',()=>qs('#projectExcelInput').click());
  qs('#projectExcelInput').addEventListener('change',e=>{projectImportAnyExcel(e.target.files?.[0]);e.target.value='';});
  qs('#projectAddRowBtn').addEventListener('click',()=>{projectSyncTableInputs();const row={};projectBeneficiaryHeaders.forEach(h=>row[h]='');projectBeneficiaryRows.push(row);projectBeneficiaryPage=Math.ceil(projectBeneficiaryRows.length/PROJECT_BENEF_PAGE_SIZE);renderEnhancedProjectBeneficiaries();});
  qs('#projectBeneficiaryPrev').addEventListener('click',()=>{if(projectBeneficiaryPage>1){projectBeneficiaryPage--;renderEnhancedProjectBeneficiaries();}});
  qs('#projectBeneficiaryNext').addEventListener('click',()=>{if(projectBeneficiaryPage*PROJECT_BENEF_PAGE_SIZE<projectBeneficiaryRows.length){projectBeneficiaryPage++;renderEnhancedProjectBeneficiaries();}});
  qs('#projectCancelBtn').addEventListener('click',()=>closeModal('projectModal'));
  qs('#projectTeamPickerBtn').addEventListener('click',function(){const picker=qs('.project-team-picker');const open=picker.classList.toggle('open');this.setAttribute('aria-expanded',String(open));});
  qs('#projectDefineAreaBtn').addEventListener('click',function(){projectSyncTableInputs();projectAreaSelectionPending=true;closeModal('projectModal');setMapTool('polygon');showToast('Marque los vértices del área y pulse Finalizar');});
}
function openEnhancedProjectModal(id){
  editingId=id||null;ensureEnhancedProjectModal();
  const project=id?projects.find(p=>p.id===id):{id:'FISE-2026-'+String(projects.length+1).padStart(3,'0'),nombre:'',lider:'Oliver Gonzales',responsables:[],departamento:'',provincia:'',distrito:'',tipo:'Masificación de gas FISE',estado:'En evaluación',fechaInicio:'',fechaFin:'',area:''};
  const form=qs('#projectForm');const isEdit=!!id;
  const projectMode=!!qs('.main.masificacion-mode');
  const entity=projectMode?'proyecto':'agrupación';
  qs('#modalTitle').textContent=(isEdit?'Modificar ':'Crear ')+entity;
  qs('#projectModal .modal-head p').textContent=isEdit
    ?'Actualice los datos, el equipo, el área y los beneficiarios asociados '+(projectMode?'al proyecto.':'a la agrupación.')
    :'Registre la información inicial '+(projectMode?'del nuevo proyecto.':'de la nueva agrupación.');
  const groupingLabels={id:'Código de agrupación',nombre:'Nombre de la agrupación',tipo:'Tipo de agrupación'};
  const projectLabels={id:'Código de proyecto',nombre:'Nombre del proyecto',tipo:'Tipo de proyecto'};
  const modalLabels=projectMode?projectLabels:groupingLabels;
  Object.keys(modalLabels).forEach(function(name){
    const field=form.elements[name]?.closest('.field');
    const label=field?.querySelector('label');
    if(label)label.textContent=modalLabels[name];
  });
  qs('#projectModal .modal-card').classList.toggle('project-edit-mode',isEdit);
  const submitButton=qs('#projectForm button[type="submit"]');
  if(submitButton)submitButton.textContent=projectMode?'Guardar proyecto':'Guardar agrupación';
  ['id','nombre','fechaInicio','fechaFin','departamento','provincia','distrito','tipo','estado','area'].forEach(k=>{if(form.elements[k])form.elements[k].value=project[k]??'';});
  form.elements.lider.innerHTML='<option value="">-- Seleccione --</option>'+projectLeaderOptions(project.lider||'');
  form.elements.equipo.innerHTML=projectTeamOptions(project.responsables||[]);
  projectRenderTeamPicker();
  form.elements.id.readOnly=isEdit;
  form.elements.lat.value=project.lat??'';form.elements.lng.value=project.lng??'';
  projectAreaPolygon=Array.isArray(project.areaPolygon)?project.areaPolygon:[];
  form.elements.polygon.value=JSON.stringify(projectAreaPolygon);
  form.elements.localizacion.value=(typeof project.lat==='number'&&typeof project.lng==='number')?'Lat: '+project.lat.toFixed(6)+' · Lon: '+project.lng.toFixed(6):'';
  const data=projectExistingBeneficiaryData(project);projectSetBeneficiaryData(data.headers,data.rows);
  openModal('projectModal');
}
openProjectModal=openEnhancedProjectModal;
window.openProjectModal=openEnhancedProjectModal;
const originalRenderProjectDetailsForTeam=renderProjectDetailsPanel;
renderProjectDetailsPanel=function(project){
  originalRenderProjectDetailsForTeam(project);
  qsa('#details dt').forEach(label=>{if(label.textContent.trim()==='Responsables')label.textContent='Equipo';});
};
qs('#projectForm').onsubmit=function(e){
  e.preventDefault();projectSyncTableInputs();
  const form=e.target;
  if(form.fechaInicio.value&&form.fechaFin.value&&form.fechaFin.value<form.fechaInicio.value){showToast('La fecha de fin no puede ser anterior a la fecha de inicio');return;}
  const rows=projectBeneficiaryRows.filter(projectRowHasData);
  const obj={id:form.id.value.trim(),nombre:form.nombre.value.trim(),fechaInicio:form.fechaInicio.value,fechaFin:form.fechaFin.value,lider:form.lider.value,responsables:Array.from(form.equipo.selectedOptions).map(o=>o.value),departamento:form.departamento.value,provincia:form.provincia.value,distrito:form.distrito.value,tipo:form.tipo.value,estado:form.estado.value,beneficiarios:rows.length,beneficiaryHeaders:projectBeneficiaryHeaders.slice(),beneficiariosList:rows.map(r=>Object.assign({},r)),bonogasBeneficiariosList:[],area:form.area.value,lat:Number(form.lat.value)||-12.0464,lng:Number(form.lng.value)||-77.0428,areaPolygon:projectAreaPolygon.slice(),localizacion:form.localizacion.value};
  const index=projects.findIndex(p=>p.id===editingId);
  if(index>=0)projects[index]=Object.assign({},projects[index],obj);else projects.unshift(obj);
  selectedId=obj.id;closeModal('projectModal');renderAll();if(qs('.main')?.classList.contains('project-list-mode'))renderProjectListTable();showToast((qs('.main.masificacion-mode')?'Proyecto':'Agrupación')+' guardado con '+rows.length+' beneficiario(s)');
};
const originalFinishDrawingForProject=finishDrawing;
finishDrawing=function(){
  const capture=projectAreaSelectionPending&&activeMapTool==='polygon'&&drawingPoints.length>2?drawingPoints.map(p=>({lat:p.lat,lng:p.lng})):null;
  originalFinishDrawingForProject();
  if(!capture)return;
  projectAreaSelectionPending=false;projectAreaPolygon=capture;
  const centroid=capture.reduce((sum,p)=>({lat:sum.lat+p.lat,lng:sum.lng+p.lng}),{lat:0,lng:0});centroid.lat/=capture.length;centroid.lng/=capture.length;
  const form=qs('#projectForm'),area=polygonAreaMeters(capture);
  form.elements.area.value=formatArea(area);form.elements.lat.value=centroid.lat.toFixed(6);form.elements.lng.value=centroid.lng.toFixed(6);form.elements.polygon.value=JSON.stringify(capture);form.elements.localizacion.value='Lat: '+centroid.lat.toFixed(6)+' · Lon: '+centroid.lng.toFixed(6);
  openModal('projectModal');showToast('Área de influencia registrada: '+formatArea(area));
};
qs('#projectCreatePageForm')?.addEventListener('submit',e=>{e.preventDefault();const f=e.target;const bonogasMode=isBonogasBeneficiaryImportMode();const benefList=bonogasMode?getBonogasBeneficiaryRows('page'):[];if(bonogasMode&&!benefList.length){showToast('Suba un Excel con al menos un beneficiario');return;}const obj={id:f.elements.id.value||('FISE-2026-'+String(projects.length+1).padStart(3,'0')),nombre:f.elements.nombre.value||'Agrupación sin nombre',lider:'',responsables:[],departamento:f.elements.departamento.value||'Amazonas',provincia:f.elements.provincia.value||'',distrito:f.elements.distrito.value||'',tipo:f.elements.tipo.value||'Masificación de gas FISE',estado:f.elements.estado.value||'En evaluación',beneficiarios:bonogasMode?benefList.length:1,bonogasBeneficiariosList:bonogasMode?benefList:[],area:'-',descripcion:f.elements.descripcion.value||'',ubigeo:f.elements.ubigeo.value||''};projects.unshift(Object.assign({lat:-12.0464,lng:-77.0428},obj));selectedId=obj.id;showToast('Agrupación creado correctamente'+(bonogasMode?' · '+benefList.length+' beneficiario(s)':''));openProjectListFromMenu();});
qs('#cancelProjectCreatePageBtn')?.addEventListener('click',openProjectListFromMenu);
qs('#createPageOpenGisBtn')?.addEventListener('click',openSatcontrolView);
['#downloadProjectFormatBtn','#massProjectGenerateBtn','#createPageAddDocBtn','#createPageViewDocsBtn','#createPageUploadImgBtn','#createPageViewImgsBtn','#createPageImportBtn','#createPageExportBtn','#createPageAddBeneficiaryBtn','#createPageRemoveBeneficiaryBtn'].forEach(id=>qs(id)?.addEventListener('click',()=>showToast('Acción preparada en Crear agrupación')));
qs('#projectListSearch')?.addEventListener('input',()=>{projectListPage=1;renderProjectListTable();});
qs('#projectListField')?.addEventListener('change',()=>{projectListPage=1;renderProjectListTable();});
qs('#projectListPrevBtn')?.addEventListener('click',()=>{if(projectListPage>1){projectListPage--;renderProjectListTable();}});
qs('#projectListNextBtn')?.addEventListener('click',()=>{const total=projectListFiltered().length;const pages=Math.max(1,Math.ceil(total/projectListPageSize));if(projectListPage<pages){projectListPage++;renderProjectListTable();}});
qs('#projectListExportBtn')?.addEventListener('click',()=>showToast('Exportación a Excel preparada'));
qs('#projectDeletePageForm')?.addEventListener('submit',e=>{e.preventDefault();deleteProjectByCode();});
document.addEventListener('click',e=>{const viewDoc=e.target.closest('[data-list-doc]');if(viewDoc){selectedId=viewDoc.dataset.listDoc;openModal('reportsModal');return;}const viewImg=e.target.closest('[data-list-img]');if(viewImg){selectedId=viewImg.dataset.listImg;openProjectFilesModal('Imágenes de la agrupación','images');return;}const edit=e.target.closest('[data-list-edit]');if(edit){selectedId=edit.dataset.listEdit;openProjectModal(selectedId);}});
qs('#confirmDelete')?.addEventListener('click',()=>{const idx=projects.findIndex(p=>p.id===deletingId);if(idx>=0)projects.splice(idx,1);selectedId=projects[0]?.id;closeModal('deleteModal');showToast('Agrupación eliminada');renderAll();if(qs('.main')?.classList.contains('project-list-mode'))renderProjectListTable()});
function showToast(t){const toast=qs('#toast');if(!toast)return;toast.textContent=t;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),1800)}
function buildGeoChatResponse(query){
  const q=String(query||'');
  const normalized=q.toLowerCase();
  const regionMatch=q.match(/\b(Arequipa|Cusco|Puno|Tacna)\b/i);
  const region=regionMatch?regionMatch[1].replace(/^./,c=>c.toUpperCase()):'la zona solicitada';
  let count=18;
  let subject='agrupaciones';
  let state='pendientes';
  if(/observad/i.test(normalized)){count=12;state='observados';}
  if(/instalacion|instalaci[oó]n|instalaciones/i.test(normalized)){count=24;subject='instalaciones';}
  if(/beneficiario/i.test(normalized)){count=36;subject='beneficiarios';state='registrados';}
  if(/finalizad/i.test(normalized)){count=9;state='finalizados';}
  if(/distrito/i.test(normalized)){count=7;subject='instalaciones';state='agrupadas por distrito';}
  if(/fotograf/i.test(normalized)){count=14;subject='agrupaciones';state='con fotografías observadas';}
  if(/expediente/i.test(normalized)){count=21;subject='expedientes';state='pendientes de validación';}
  const scope=region==='la zona solicitada'?'en la zona solicitada':'en la región de '+region;
  return `Se encontraron <b>${count} ${subject} ${state}</b> ${scope}.<br><br>La consulta geográfica fue procesada correctamente.<br><br>¿Desea visualizar los resultados sobre el mapa interactivo?<div class="float-msg-actions"><button type="button" data-chat-action="map">Ver en el mapa</button></div>`;
}
function buildKpiChatResponse(query){
  const q=String(query||'');
  const normalized=q.toLowerCase();
  const regionMatch=q.match(/\b(Arequipa|Cusco|Puno|Tacna|Amazonas|Lima)\b/i);
  const region=regionMatch?regionMatch[1].replace(/^./,c=>c.toUpperCase()):'Todas';
  const departamento=region==='Todas'?'Todos':region;
  const periodMatch=q.match(/\b(20[0-9]{2})(?:\s*-\s*(0?[1-9]|1[0-2]))?\b/);
  const period=periodMatch?(periodMatch[2]?periodMatch[1]+'-'+String(periodMatch[2]).padStart(2,'0'):periodMatch[1]):'2026';
  const provinceMatch=q.match(/provincia\s+de\s+([A-Za-zÁÉÍÓÚáéíóúÑñ ]+)/i);
  const province=provinceMatch?provinceMatch[1].trim():'Todas';
  const program=/bonogas|bono\s*gas/i.test(q)?'BonoGas':'Programas FISE';
  const regionalFactor=region==='Arequipa'?1:region==='Puno'?0.82:region==='Cusco'?0.88:region==='Tacna'?0.76:region==='Amazonas'?0.69:0.94;
  const avance=Math.round(86*regionalFactor);
  const beneficiarios=Math.round(4280*regionalFactor);
  const atendidas=Math.round(1240*regionalFactor);
  const pendientes=Math.max(42,Math.round(210*(1.15-regionalFactor)));
  const metas=Math.round(91*regionalFactor);
  const presupuesto=Math.round(78*regionalFactor);
  const alerts=[];
  if(metas<80)alerts.push('Bajo cumplimiento de metas detectado en el ámbito consultado.');
  if(avance<75)alerts.push('Retraso en avance operativo frente al periodo planificado.');
  if(pendientes>120)alerts.push('Variación importante: solicitudes pendientes por encima del umbral esperado.');
  if(!alerts.length)alerts.push('Sin alertas críticas. Los indicadores se mantienen dentro del rango esperado.');
  const filters=`<div class="chat-kpi-filters"><span>Región: <b>${escHtml(region)}</b></span><span>Departamento: <b>${escHtml(departamento)}</b></span><span>Provincia: <b>${escHtml(province)}</b></span><span>Periodo: <b>${escHtml(period)}</b></span><span>Programa: <b>${escHtml(program)}</b></span></div>`;
  const cards=[
    ['Avance del programa',avance+'%'],
    ['Beneficiarios',beneficiarios.toLocaleString('es-PE')],
    ['Solicitudes atendidas',atendidas.toLocaleString('es-PE')],
    ['Solicitudes pendientes',pendientes.toLocaleString('es-PE')],
    ['Cumplimiento de metas',metas+'%'],
    ['Ejecución presupuestal',presupuesto+'%']
  ].map(item=>`<div class="chat-kpi-card"><span>${item[0]}</span><b>${item[1]}</b></div>`).join('');
  const alertHtml=alerts.map(a=>`<div class="chat-kpi-alert">${escHtml(a)}</div>`).join('');
  return `Monitoreo Inteligente de KPIs procesó la consulta.<br><br>${filters}<div class="chat-kpi-grid">${cards}</div><div class="chat-kpi-section"><b>Alertas inteligentes</b>${alertHtml}</div><div class="float-msg-actions"><button type="button" data-chat-action="dashboard">Abrir Dashboard</button></div>`;
}
const floatingChatFlows=[
  {
    test:q=>/observaci[oó]n|manual|registrar/i.test(q),
    html:'Encontré la información en el Manual de Usuario.<br><br><b>Pasos:</b><br>1. Abrir el agrupación.<br>2. Seleccionar Observaciones.<br>3. Registrar la información.<br>4. Guardar los cambios.<div class="float-msg-actions"><button type="button" data-chat-action="manual">Abrir Manual</button></div>'
  },
  {
    test:q=>/dni|44444444|buscar beneficiario\b/i.test(q),
    html:'Beneficiario encontrado.<br><br><b>Nombre:</b> Juan Pérez<br><b>Programa:</b> Vale FISE<br><b>Estado:</b> Activo<br><b>Distrito:</b> Cerro Colorado'
  },
  {
    test:q=>/reporte|pdf|excel|csv/i.test(q),
    html:'Reporte generado correctamente.<br><br>Seleccione el formato de exportación para descargar la información de la agrupación.<div class="float-msg-actions"><button type="button" data-chat-action="report-menu">Exportar reporte</button></div>'
  },
  {
    test:q=>/validar|evidencia|ubicaci[oó]n|coordenadas/i.test(q),
    html:'La evidencia fue analizada.<br><br>La ubicación coincide con las coordenadas registradas.<br><br><b>Distancia:</b> 12 metros.'
  },
  {
    test:q=>/avance esperado|predicci[oó]n|plazo|finalizar/i.test(q),
    html:'Según el análisis de los datos registrados, el agrupación tiene una probabilidad del <b>91%</b> de finalizar dentro del plazo establecido.'
  },
  {
    test:q=>/kpi|indicador|indicadores|monitoreo|avance actual|beneficiarios atendidos|solicitudes atendidas|solicitudes pendientes|cumplimiento|metas|ejecuci[oó]n presupuestal|presupuesto|periodo/i.test(q),
    html:q=>buildKpiChatResponse(q)
  },
  {
    test:q=>/mapa|geogr[aá]fica|geoespacial|arequipa|cusco|puno|tacna|agrupaciones? (pendientes|observados|finalizados)|instalaciones?|beneficiarios?|distrito|fotograf[ií]as? observadas?|expedientes? pendientes/i.test(q),
    html:q=>buildGeoChatResponse(q)
  }
];
function appendFloatingChatMessage(role,content,asHtml=false){
  const body=qs('#floatingChatBody');
  if(!body)return;
  const div=document.createElement('div');
  div.className='float-msg '+role;
  if(asHtml)div.innerHTML=content;
  else div.textContent=content;
  body.appendChild(div);
  body.scrollTop=body.scrollHeight;
  return div;
}
function showFloatingTyping(){
  return appendFloatingChatMessage('bot typing','<span>Escribiendo</span><i></i><i></i><i></i>',true);
}
function floatingChatResponseFor(value){
  const flow=floatingChatFlows.find(item=>item.test(value));
  if(flow&&typeof flow.html==='function')return Object.assign({},flow,{html:flow.html(value)});
  return flow||{html:'Claro, puedo ayudarte con eso desde SATCONTROL. Para indicadores o KPIs, revisa el Dashboard correspondiente.<div class="float-msg-actions"><button type="button" data-chat-action="dashboard">Abrir Dashboard</button></div>'};
}
function openFloatingReportMenu(anchor){
  let menu=qs('#floatingReportMenu');
  if(menu){menu.remove();return;}
  menu=document.createElement('div');
  menu.id='floatingReportMenu';
  menu.className='export-selection-menu chat-report-menu';
  menu.innerHTML='<button type="button" data-chat-report-format="pdf"><span class="es-ic es-pdf">PDF</span>Exportar a PDF</button><button type="button" data-chat-report-format="xlsx"><span class="es-ic es-xlsx">XLS</span>Exportar a Excel</button><button type="button" data-chat-report-format="csv"><span class="es-ic es-csv">CSV</span>Exportar a CSV</button>';
  document.body.appendChild(menu);
  const r=anchor.getBoundingClientRect();
  menu.style.top=(r.bottom+8)+'px';
  menu.style.left=Math.max(12,Math.min(r.left,window.innerWidth-220))+'px';
  const close=()=>{menu?.remove();document.removeEventListener('click',onDoc,true);};
  const onDoc=e=>{if(!menu.contains(e.target)&&e.target!==anchor)close();};
  setTimeout(()=>document.addEventListener('click',onDoc,true),0);
  menu.querySelectorAll('[data-chat-report-format]').forEach(btn=>btn.addEventListener('click',()=>{
    const format=btn.dataset.chatReportFormat;
    close();
    if(format==='pdf'&&typeof exportSelectionPDF==='function'){exportSelectionPDF();return;}
    if(format==='xlsx'&&typeof exportRightPanelExcel==='function'){exportRightPanelExcel();return;}
    if(format==='csv'&&typeof exportSelectionCSV==='function'){exportSelectionCSV();return;}
    showToast('Exportador no disponible para '+format.toUpperCase());
  }));
}
function sendFloatingChatMessage(text){
  const value=(text||qs('#floatingChatInput')?.value||'').trim();
  if(!value)return;
  appendFloatingChatMessage('user',value);
  const input=qs('#floatingChatInput');
  if(input)input.value='';
  const typing=showFloatingTyping();
  const response=floatingChatResponseFor(value);
  setTimeout(()=>{
    typing?.remove();
    appendFloatingChatMessage('bot',response.html,true);
    response.after?.();
  },620);
}
function handleFloatingChatAction(action){
  if(action==='dashboard'){if(typeof openSatcontrolView==='function')openSatcontrolView();else qs('#navDashboard')?.click();return;}
  if(action==='manual'){showToast('Manual de Usuario preparado para abrir');return;}
  if(action==='map'){qs('#floatingChat')?.classList.remove('open');if(typeof openSatcontrolView==='function')openSatcontrolView();else qs('#navDashboard')?.click();showToast('HU07 · Resultados listos para visualizar en el mapa');return;}
  if(action==='report-menu'){return;}
  if(action?.startsWith('report-')){showToast('Descarga simulada: '+action.replace('report-','').toUpperCase());}
}
function initFloatingChat(){
  const chat=qs('#floatingChat');
  qs('#floatingChatLauncher')?.addEventListener('click',()=>chat?.classList.add('open'));
  qs('#headerChatBtn')?.addEventListener('click',()=>chat?.classList.add('open'));
  qs('#floatingChatClose')?.addEventListener('click',()=>chat?.classList.remove('open'));
  qs('#floatingChatSend')?.addEventListener('click',()=>sendFloatingChatMessage());
  qs('#floatingChatInput')?.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();sendFloatingChatMessage();}});
  qsa('[data-floating-chat]').forEach(btn=>btn.addEventListener('click',()=>sendFloatingChatMessage(btn.dataset.floatingChat)));
  qs('#floatingChatBody')?.addEventListener('click',e=>{const btn=e.target.closest('[data-chat-action]');if(!btn)return;if(btn.dataset.chatAction==='report-menu')openFloatingReportMenu(btn);else handleFloatingChatAction(btn.dataset.chatAction);});
}
function solStatusClass(estado){return estado==='Nueva'?'nueva':estado==='En validación'?'validacion':estado==='Aprobada'?'aprobada':'observada'}
function valRiskClass(riesgo){return normalizeText(riesgo)==='alto'?'alto':normalizeText(riesgo)==='medio'?'medio':'bajo'}
function escHtml(v){return String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function djPhotoState(r,key,label){const st=r[key]||'ok';return {title:label,state:st==='ok'?'done':st==='warn'?'warn':'obs',note:st==='ok'?'Conforme':st==='warn'?'Borrosa / observar':'Faltante o incorrecta'};}
function getFilteredGnvDjRows(){const q=normalizeText(qs('#gnvValSearch')?.value||'');const empresa=qs('#gnvValEmpresaFilter')?.value||'';const estado=qs('#gnvValEstadoFilter')?.value||'';return gnvDjRows.filter(r=>(!empresa||r.empresa===empresa)&&(!estado||r.estado===estado)&&(!q||normalizeText(r.id+' '+r.beneficiario+' '+r.empresa+' '+r.suministro+' '+r.direccion).includes(q)));}
window.getFilteredGnvDjRows=getFilteredGnvDjRows;
window.getFilteredBonogasDjRows=getFilteredGnvDjRows;
function renderGnvDjAiPanel(r){const criteria=qs('#gnvDjAiCriteria'),alerts=qs('#gnvDjAiAlerts'),status=qs('#gnvDjAiStatus');if(!criteria||!alerts)return;const photos=[djPhotoState(r,'fotoFachada','Foto fachada'),djPhotoState(r,'fotoGabinete','Foto gabinete'),djPhotoState(r,'fotoAmbiente','Foto ambiente'),djPhotoState(r,'fotoGas','Gasodoméstico conectado')];const rows=[{title:'Datos de suministro',label:r.suministro+' / '+r.direccion,state:r.alertas.some(a=>/suministro|direcci/i.test(a))?'warn':'done',note:r.alertas.some(a=>/suministro|direcci/i.test(a))?'Dato errado detectado':'Validado'},{title:'Empresa instaladora',label:r.empresa+' / RUC '+r.ruc,state:'done',note:'Validada'},{title:'Representante legal',label:r.representante,state:r.firma==='Detectada'?'done':'warn',note:r.firma}].concat(photos.map(p=>({title:p.title,label:'Evidencia fotográfica',state:p.state,note:p.note})));criteria.innerHTML=rows.map(item=>`<div class="dj-ai-criterion ${item.state}"><i>${item.state==='done'?'✓':'!'}</i><div><b>${escHtml(item.title)}</b><span>${escHtml(item.label)}</span></div><small>${escHtml(item.note)}</small></div>`).join('');let alertHtml='';if(r.estado==='Rechazada')alertHtml='<div class="dj-ai-alert"><b>Alerta inmediata</b> La DJ no cumple criterios de validación y no puede liquidarse hasta subsanación.</div>';else if(r.estado==='Aprobada')alertHtml='<div class="dj-ai-alert ok"><b>Lista para revisión humana</b> Cumple criterios IA. Contrastar en revisión humana previa a liquidación.</div>';else if(r.estado==='Subsanada')alertHtml='<div class="dj-ai-alert"><b>DJ subsanada por instaladora</b> Reingresada tras revisión inicial. Validar correcciones antes de derivar a liquidación.</div>';if(r.alertas?.length)alertHtml+=r.alertas.map(a=>`<div class="dj-ai-alert${r.estado==='Aprobada'?' ok':''}">${escHtml(a)}</div>`).join('');else if(!alertHtml)alertHtml='<div class="dj-ai-alert ok">Sin alertas críticas detectadas por IA.</div>';alerts.innerHTML=alertHtml;if(status){status.textContent=r.estado==='Aprobada'?'Conforme · revisión humana':r.estado==='Subsanada'?'Subsanada':r.estado==='Rechazada'?'Alerta inmediata':'En revisión IA';status.className='dj-ai-status'+(r.estado==='Rechazada'?' rejected':'');}}
function renderGnvDjStatusSummary(rows){const box=qs('#gnvValRedZones');if(!box)return;const rechazadas=rows.filter(r=>r.estado==='Rechazada').length,conformes=rows.filter(r=>r.estado==='Aprobada').length,subsanadas=rows.filter(r=>r.estado==='Subsanada').length;box.innerHTML=[{level:'critical',title:'Alerta inmediata',value:rechazadas,note:'DJ no cumplen criterios'},{level:'medium',title:'Conformes IA',value:conformes,note:'Pendientes revisión humana'},{level:'high',title:'Subsanadas',value:subsanadas,note:'Reingresadas por instaladora'}].map(z=>`<div class="val-zone-card ${z.level}"><span>${z.title}</span><b>${z.value}</b><small>${z.note}</small></div>`).join('');}
function renderPaymentZones(rows){const box=qs('#valRedZones');if(!box)return;const totals=new Map();rows.forEach(r=>{const key=r.distrito||'Sin distrito';const prev=totals.get(key)||{count:0,total:0,manzana:r.manzana||'MZ-00'};prev.count+=1;prev.total+=Number(r.monto||0);totals.set(key,prev);});const zones=[...totals.entries()].sort((a,b)=>b[1].total-a[1].total).slice(0,4);box.innerHTML=zones.map(([district,info],idx)=>{const level=info.total>=1550?'critical':info.total>=1450?'high':'medium';return `<div class="val-zone-card ${level}"><span>Zona roja ${idx+1}</span><b>${info.manzana}</b><small>${district} · ${info.count} expedientes · ${formatMoney(info.total)} pendiente</small></div>`;}).join('')||'<div class="val-zone-card"><span>Zona</span><b>Sin datos</b><small>Aplicar filtros para identificar morosidad</small></div>';}
function renderBonogasPaymentValidaciones(){window.__validacionesContext='bonogas-payment';const q=normalizeText(qs('#valSearch')?.value||'');const empresa=qs('#valEmpresaFilter')?.value||'';const estado=qs('#valEstadoFilter')?.value||'';const fecha=qs('#valFechaFilter')?.value||'';const distrito=qs('#valDistritoFilter')?.value||'';const paymentRows=[
  {id:'FISE-2025-0002489',beneficiario:'Juan Carlos Pérez Gómez',empresa:'Instalaciones del Norte S.A.C.',distrito:'Ate',fecha:'20/05/2025',fechaIso:'2025-05-20',monto:1560,estado:'Pendiente de pago',chip:'pending',manzana:'MZ-01',base:validaciones[0]},
  {id:'FISE-2025-0002441',beneficiario:'María Elena Rodríguez Díaz',empresa:'Gas & Hogar E.I.R.L.',distrito:'San Juan de Lurigancho',fecha:'20/05/2025',fechaIso:'2025-05-20',monto:1520,estado:'Pendiente de pago',chip:'pending',manzana:'MZ-07',base:validaciones[1]},
  {id:'FISE-2025-0002418',beneficiario:'Luis Alberto Quispe Huamaní',empresa:'Conexiones Seguras S.A.C.',distrito:'Villa El Salvador',fecha:'19/05/2025',fechaIso:'2025-05-19',monto:1480,estado:'Pendiente de pago',chip:'pending',manzana:'MZ-04',base:validaciones[2]},
  {id:'FISE-2025-0002387',beneficiario:'Rosa Amelia Torres Flores',empresa:'Instalagas Perú S.A.C.',distrito:'Comas',fecha:'19/05/2025',fechaIso:'2025-05-19',monto:1600,estado:'Observado',chip:'obs',manzana:'MZ-11',base:validaciones[3]},
  {id:'FISE-2025-0002362',beneficiario:'Carmen Julia Ríos Mendoza',empresa:'Gas & Hogar E.I.R.L.',distrito:'Los Olivos',fecha:'19/05/2025',fechaIso:'2025-05-19',monto:1520,estado:'Pendiente de pago',chip:'pending',manzana:'MZ-08',base:validaciones[4]},
  {id:'FISE-2025-0002301',beneficiario:'Pedro Gálvez Rojas',empresa:'TecnoGas Arequipa',distrito:'Ate',fecha:'18/05/2025',fechaIso:'2025-05-18',monto:1380,estado:'Pendiente de pago',chip:'pending',manzana:'MZ-02',base:validaciones[0]},
  {id:'FISE-2025-0002288',beneficiario:'Industrias del Sur S.A.C.',empresa:'GasSur Instalaciones S.A.C.',distrito:'Villa El Salvador',fecha:'18/05/2025',fechaIso:'2025-05-18',monto:4200,estado:'Pendiente de pago',chip:'pending',manzana:'MZ-05',base:validaciones[2]},
  {id:'FISE-2025-0002255',beneficiario:'Ana María López',empresa:'RedGas Perú S.A.C.',distrito:'San Juan de Lurigancho',fecha:'17/05/2025',fechaIso:'2025-05-17',monto:1450,estado:'Observado',chip:'obs',manzana:'MZ-09',base:validaciones[1]},
  {id:'FISE-2025-0002221',beneficiario:'Juan Pérez Quispe',empresa:'Andes Gas Contratistas',distrito:'Comas',fecha:'17/05/2025',fechaIso:'2025-05-17',monto:1600,estado:'Pendiente de pago',chip:'pending',manzana:'MZ-12',base:validaciones[3]},
  {id:'FISE-2025-0002199',beneficiario:'Comercial El Triunfo E.I.R.L.',empresa:'Instalaciones del Norte S.A.C.',distrito:'Los Olivos',fecha:'16/05/2025',fechaIso:'2025-05-16',monto:2100,estado:'Pendiente de pago',chip:'pending',manzana:'MZ-06',base:validaciones[4]},
  {id:'FISE-2025-0002180',beneficiario:'Rosa Paredes Huamán',empresa:'Conexiones Seguras S.A.C.',distrito:'Ate',fecha:'16/05/2025',fechaIso:'2025-05-16',monto:1520,estado:'Observado',chip:'obs',manzana:'MZ-03',base:validaciones[0]},
  {id:'FISE-2025-0002150',beneficiario:'Carlos Mendoza Vega',empresa:'Gas & Hogar E.I.R.L.',distrito:'Villa El Salvador',fecha:'15/05/2025',fechaIso:'2025-05-15',monto:1480,estado:'Pendiente de pago',chip:'pending',manzana:'MZ-10',base:validaciones[2]}
];window.paymentRows=paymentRows;const filtered=paymentRows.filter(r=>(!empresa||r.empresa===empresa)&&(!estado||r.estado===estado)&&(!fecha||r.fechaIso===fecha)&&(!distrito||r.distrito===distrito)&&(!q||normalizeText(r.id+' '+r.beneficiario+' '+r.empresa+' '+r.distrito).includes(q)));window.filteredPaymentRows=filtered;renderPaymentZones(filtered);const k=qsa('#validacionesEnv .val-admin-kpi');if(k[0]){k[0].querySelector('b').textContent=filtered.filter(r=>r.chip!=='obs').length;}if(k[1]){k[1].querySelector('b').textContent=filtered.filter(r=>r.estado==='Pendiente de pago').length;}if(k[2]){k[2].querySelector('b').textContent=filtered.filter(r=>r.chip==='obs').length;}if(k[3]){k[3].querySelector('b').textContent=Math.max(0,filtered.length-3);}const body=qs('#validacionesTableBody');if(body){function findBonogasForVal(beneficiario){var nrm=typeof normalizeText==='function'?normalizeText:function(v){return String(v||'').toLowerCase();};var en=(window._enrichedBeneficiarios||[]).find(function(d){return nrm(d.beneficiario||'')===nrm(beneficiario||'');});if(!en&&typeof bonogasMapRows==='function'){en=bonogasMapRows().find(function(d){return nrm(d.beneficiario||'')===nrm(beneficiario||'');});}return en;}body.innerHTML=filtered.map(r=>{const zoneTotal=filtered.filter(x=>x.distrito===r.distrito).reduce((s,x)=>s+Number(x.monto||0),0);const zoneLevel=zoneTotal>=1550?'critical':zoneTotal>=1450?'high':'medium';const zoneBadge=zoneLevel==='critical'?'Zona roja':'Zona alta';const bdata=findBonogasForVal(r.beneficiario)||{};const sumStr=bdata.suministro?`<small style="display:block;color:#67e8f9;font-weight:900;margin-top:2px">${bdata.suministro}</small>`:'';const estStr=bdata.estrato?`<small style="display:block;color:#94a3b8;font-weight:800;margin-top:1px">Est. ${bdata.estrato}</small>`:'';return `<tr><td><input type="checkbox" aria-label="Seleccionar expediente"></td><td><b>${r.id}</b></td><td>${r.beneficiario}${sumStr}${estStr}</td><td><button class="installer-link" type="button" data-installer-name="${escHtml(r.empresa)}" title="Ver ranking e histórico"><span class="rank-mini">★</span>${escHtml(r.empresa)}</button></td><td><span class="pay-status ${zoneLevel==='critical'?'obs':'pending'}">${escHtml(r.distrito)}</span><small style="display:block;color:${zoneLevel==='critical'?'#fecaca':'#fde68a'};font-weight:900;margin-top:4px">${zoneBadge} · ${r.manzana}</small></td><td>${r.fecha}</td><td>${formatMoney(r.monto)}</td><td><span class="pay-status ${r.chip}">${r.estado}</span></td><td><button class="sol-action-btn" type="button" data-val-id="${escHtml(r.id)}">Ver</button></td></tr>`;}).join('')||'<tr><td colspan="9">No se encontraron expedientes.</td></tr>';}qs('#valPaymentCount')&&(qs('#valPaymentCount').textContent=filtered.length);qsa('#validacionesEnv [data-val-id]').forEach(btn=>btn.addEventListener('click',()=>selectValidacion(btn.dataset.valId)));qsa('#validacionesEnv [data-installer-name]').forEach(btn=>btn.addEventListener('click',e=>{e.stopPropagation();openInstallerRanking(btn.dataset.installerName)}));selectValidacion(selectedValidacionId&&String(selectedValidacionId).startsWith('FISE-')?selectedValidacionId:'FISE-2025-0002489',false);}
function renderGnvDjValidaciones(){window.__validacionesContext='gnv-dj';const rows=getFilteredGnvDjRows();window.filteredDjRows=rows;window.filteredGnvDjRows=rows;const h=qs('#gnvValidacionesEnv .val-table-head h3');if(h)h.innerHTML=`Declaraciones Juradas en validación IA (<span id="gnvValPaymentCount">${rows.length}</span>)`;const k=qsa('#gnvValidacionesEnv .val-admin-kpi');if(k[0]){k[0].querySelector('b').textContent=gnvDjRows.filter(r=>r.estado==='Aprobada').length;}if(k[1]){k[1].querySelector('b').textContent=gnvDjRows.filter(r=>r.estado==='Rechazada').length;}if(k[2]){k[2].querySelector('b').textContent=gnvDjRows.filter(r=>r.alertas.length).length;}if(k[3]){k[3].querySelector('b').textContent=gnvDjRows.filter(r=>r.estado==='Subsanada').length;}const state=qs('#gnvValEstadoFilter');if(state)state.innerHTML='<option value="">Estado IA</option><option>Aprobada</option><option>Rechazada</option><option>Subsanada</option>';const empFilter=qs('#gnvValEmpresaFilter');if(empFilter){const oldEmp=empFilter.value;const empresas=[...new Set(gnvDjRows.map(r=>r.empresa))].sort();empFilter.innerHTML='<option value="">Todas las empresas</option>'+empresas.map(e=>`<option>${escHtml(e)}</option>`).join('');if(oldEmp)empFilter.value=oldEmp;}renderGnvDjStatusSummary(rows);const body=qs('#gnvValidacionesTableBody');if(body)body.innerHTML=rows.map(r=>`<tr><td><input type="checkbox" aria-label="Seleccionar DJ"></td><td><b>${escHtml(r.id)}</b></td><td>${escHtml(r.beneficiario)}</td><td><button class="installer-link" type="button" data-installer-name="${escHtml(r.empresa)}" title="Ver ranking e histórico"><span class="rank-mini">★</span>${escHtml(r.empresa)}</button></td><td>${escHtml(r.suministro)}</td><td>${escHtml(r.fotos)}</td><td><span class="hu-pill ${r.alertas.length?'warn':'ok'}">${escHtml(r.resultado)}</span></td><td><span class="hu-pill ${r.estado==='Aprobada'?'ok':r.estado==='Subsanada'?'warn':'bad'}">${escHtml(r.estado)}</span></td><td><button class="sol-action-btn" type="button" data-gnv-dj-id="${escHtml(r.id)}">Ver</button></td></tr>`).join('')||'<tr><td colspan="9">No se encontraron declaraciones juradas.</td></tr>';qsa('#gnvValidacionesEnv [data-gnv-dj-id]').forEach(btn=>btn.addEventListener('click',()=>selectValidacion(btn.dataset.gnvDjId)));qsa('#gnvValidacionesEnv [data-installer-name]').forEach(btn=>btn.addEventListener('click',e=>{e.stopPropagation();openInstallerRanking(btn.dataset.installerName)}));selectValidacion(selectedGnvDjValidacionId&&String(selectedGnvDjValidacionId).startsWith('DJ-')?selectedGnvDjValidacionId:gnvDjRows[0].id,false);}
const renderBonogasPaymentValidacionesBase=renderBonogasPaymentValidaciones;
function validationMatchesKpi(row,filter){
  if(filter==='conforming')return row.chip!=='obs';
  if(filter==='pending')return row.estado==='Pendiente de pago'&&!BONOGAS_ORDER_IDS.has(row.id);
  if(filter==='observed')return row.chip==='obs';
  if(filter==='orders')return BONOGAS_ORDER_IDS.has(row.id);
  return true;
}
renderBonogasPaymentValidaciones=function(){
  renderBonogasPaymentValidacionesBase();
  const allRows=window.paymentRows||[];
  const filtered=(window.filteredPaymentRows||allRows).filter(function(row){return validationMatchesKpi(row,validacionesKpiFilter);});
  validacionesPage=renderDataPagination('Val',filtered.length,validacionesPage,BONOGAS_PAGE_SIZE);
  const pageRows=filtered.slice((validacionesPage-1)*BONOGAS_PAGE_SIZE,validacionesPage*BONOGAS_PAGE_SIZE);
  const visibleIds=new Set(pageRows.map(function(row){return row.id;}));
  window.filteredPaymentRows=filtered;
  renderPaymentZones(filtered);
  if(qs('#valPaymentCount'))qs('#valPaymentCount').textContent=filtered.length;
  const counts={conforming:allRows.filter(function(row){return validationMatchesKpi(row,'conforming');}).length,pending:allRows.filter(function(row){return validationMatchesKpi(row,'pending');}).length,observed:allRows.filter(function(row){return validationMatchesKpi(row,'observed');}).length,orders:allRows.filter(function(row){return validationMatchesKpi(row,'orders');}).length};
  if(qs('#valPayKpiOk'))qs('#valPayKpiOk').textContent=counts.conforming;
  if(qs('#valPayKpiPending'))qs('#valPayKpiPending').textContent=counts.pending;
  if(qs('#valPayKpiObs'))qs('#valPayKpiObs').textContent=counts.observed;
  if(qs('#valPayKpiOrders'))qs('#valPayKpiOrders').textContent=counts.orders;
  qsa('#validacionesEnv [data-val-kpi]').forEach(function(card){const active=card.dataset.valKpi===validacionesKpiFilter;card.classList.toggle('kpi-active',active);card.setAttribute('aria-pressed',String(active));});
  const body=qs('#validacionesTableBody');
  if(body){
    qsa('#validacionesTableBody tr').forEach(function(tr){const btn=tr.querySelector('[data-val-id]');if(!btn)return;tr.style.display=visibleIds.has(btn.dataset.valId)?'':'none';if(BONOGAS_ORDER_IDS.has(btn.dataset.valId)){const status=tr.querySelector('td:nth-child(8) .pay-status');if(status){status.textContent='Orden emitida';status.className='pay-status ok';}}});
    if(!filtered.length)body.innerHTML='<tr><td colspan="9" style="text-align:center;padding:24px;color:#94a3b8">No hay expedientes relacionados con este KPI y los filtros actuales.</td></tr>';
  }
  if(pageRows[0]&&!visibleIds.has(selectedValidacionId))selectValidacion(pageRows[0].id,false);
};
function renderValidaciones(){renderBonogasPaymentValidaciones();}
document.addEventListener('click',function(event){
  const solKpi=event.target.closest('#solicitudesEnv [data-sol-kpi]');
  if(solKpi){solicitudesKpiFilter=solKpi.dataset.solKpi||'all';solicitudesPage=1;const state=qs('#solEstadoFilter');if(state)state.value='';renderSolicitudes();return;}
  const valKpi=event.target.closest('#validacionesEnv [data-val-kpi]');
  if(valKpi){const next=valKpi.dataset.valKpi||'all';validacionesKpiFilter=validacionesKpiFilter===next?'all':next;validacionesPage=1;const state=qs('#valEstadoFilter');if(state)state.value='';renderValidaciones();return;}
  const solPage=event.target.closest('[data-sol-page]');
  if(solPage){const value=solPage.dataset.solPage;solicitudesPage=value==='prev'?solicitudesPage-1:value==='next'?solicitudesPage+1:Number(value)||1;renderSolicitudes();return;}
  const valPage=event.target.closest('[data-val-page]');
  if(valPage){const value=valPage.dataset.valPage;validacionesPage=value==='prev'?validacionesPage-1:value==='next'?validacionesPage+1:Number(value)||1;renderValidaciones();return;}
  if(event.target.closest('#applyValFiltersBtn'))validacionesPage=1;
});
document.addEventListener('keydown',function(event){if(event.key!=='Enter'&&event.key!==' ')return;const card=event.target.closest('#solicitudesEnv [data-sol-kpi],#validacionesEnv [data-val-kpi]');if(card){event.preventDefault();card.click();}});
document.addEventListener('input',function(event){if(event.target.matches('#solSearch,#solEstadoFilter,#solDistritoFilter,#solOrigenFilter'))solicitudesPage=1;if(event.target.matches('#valSearch,#valEmpresaFilter,#valEstadoFilter,#valFechaFilter,#valDistritoFilter'))validacionesPage=1;});
function selectBonogasPaymentValidacion(id,toast=true){const rows=window.paymentRows||[];const r=rows.find(x=>x.id===id)||rows[0];if(!r)return;selectedValidacionId=r.id;const derecho=200,costo=360,financiado=1980,subsidio=720,total=r.monto;const card=qs('#valDetailCard'),checkBox=qs('#valChecklist'),tags=qs('#valAdminTags'),trace=qs('#valTraceBox');if(card){card.innerHTML=`<div class="pay-row"><span>ID Expediente</span><b>${r.id}</b></div><div class="pay-row"><span>Beneficiario</span><b>${r.beneficiario}</b></div><div class="pay-row"><span>Empresa instaladora</span><b>${r.empresa}</b></div><div class="pay-row"><span>Cuenta / Convenio</span><b>Convenio FISE-2025-IND-0178</b></div><div class="pay-row"><span>Fecha conformidad técnica</span><b>${r.fecha} 09:15</b></div><div class="pay-row"><span>Monto financiado referencial</span><b>${formatMoney(financiado)}</b></div><div class="pay-row"><span>Derecho de conexión</span><b>${formatMoney(derecho)}</b></div><div class="pay-row"><span>Costo de acometida</span><b>${formatMoney(costo)}</b></div><div class="pay-row discount"><span>Subsidio FISE</span><b>- ${formatMoney(subsidio)}</b></div><div class="pay-row money"><span>Monto a pagar</span><b>${formatMoney(total)}</b></div><div class="pay-row"><span>Estado</span><b><span class="pay-status ${r.chip}">${r.estado}</span></b></div>`;}if(checkBox){const docs=['Expediente técnico','Declaración jurada','Fotos de instalación','Acta de conformidad','Validación técnica','Datos bancarios del beneficiario'];checkBox.innerHTML=docs.map(d=>`<div class="pay-doc"><i>▧</i><b>${d}</b><small><svg class="svg-icon" aria-hidden="true"><use href="#i-check"></use></svg> Validado</small><em>◉</em></div>`).join('');}if(tags){tags.innerHTML=['Documentación completa','Monto consistente','Sin duplicidad de pago','Beneficiario elegible','Convenio vigente'].map(t=>`<span><svg class="svg-icon" aria-hidden="true"><use href="#i-check"></use></svg> ${t}</span>`).join('');}if(trace){trace.innerHTML=[['Revisión técnica','19/05/2025<br>15:40','done'],['Generación de expediente','19/05/2025<br>16:05','done'],['Validación administrativa','20/05/2025<br>09:10','done'],['Orden de pago emitida','Pendiente','pending']].map(t=>`<div class="trace-step ${t[2]==='pending'?'pending':''}"><div class="trace-dot">${t[2]==='pending'?'○':'<svg class="svg-icon" aria-hidden="true"><use href="#i-check"></use></svg>'}</div><b>${t[0]}</b><span>${t[1]}</span></div>`).join('');}if(toast!==false)showToast('Expediente seleccionado: '+r.id);}
function selectGnvDjValidacion(id,toast=true){const r=gnvDjRows.find(x=>x.id===id)||gnvDjRows[0];if(!r)return;selectedGnvDjValidacionId=r.id;renderGnvDjAiPanel(r);const card=qs('#gnvValDetailCard'),checkBox=qs('#gnvValChecklist'),tags=qs('#gnvValAdminTags'),trace=qs('#gnvValTraceBox');if(card)card.innerHTML=`<div class="pay-row"><span>Declaración Jurada</span><b>${escHtml(r.id)}</b></div><div class="pay-row"><span>N° suministro</span><b>${escHtml(r.suministro)}</b></div><div class="pay-row"><span>N° instalación</span><b>${escHtml(r.instalacion)}</b></div><div class="pay-row"><span>Empresa instaladora</span><b>${escHtml(r.empresa)}</b></div><div class="pay-row"><span>Representante legal</span><b>${escHtml(r.representante)}</b></div><div class="pay-row"><span>Resultado IA</span><b>${escHtml(r.resultado)}</b></div><div class="pay-row"><span>Estado</span><b>${escHtml(r.estado)}</b></div>`;if(checkBox)checkBox.innerHTML=[['Foto fachada',r.fotoFachada],['Foto gabinete',r.fotoGabinete],['Foto ambiente',r.fotoAmbiente],['Gasodoméstico conectado',r.fotoGas],['DJ hoja 1','ok'],['DJ hoja 2','ok']].map(([d,st])=>{const warn=st==='warn'||st==='obs';return `<div class="pay-doc"><i>${warn?'!':'✓'}</i><b>${d}</b><small>${warn?'Observada / faltante':'Validada'}</small><em></em></div>`}).join('');if(tags)tags.innerHTML=['Datos completos','Datos incorrectos','Foto borrosa','Foto editada','Foto faltante','Caso subsanado','Revisión humana'].map(t=>{const active=(t==='Foto borrosa'&&r.alertas.some(a=>/borrosa/i.test(a)))||(t==='Foto faltante'&&r.fotos!=='6/6')||(t==='Caso subsanado'&&r.estado==='Subsanada')||(t==='Datos incorrectos'&&r.alertas.some(a=>/suministro|direcci/i.test(a)))||(t==='Revisión humana'&&r.estado==='Aprobada');return `<span class="${active?'hu-pill warn':''}">${t}</span>`}).join('');if(trace)trace.innerHTML=[['Carga DJ','Ahorro GNV','done'],['Análisis IA','Suministro, empresa y fotos','done'],['Alerta / resultado',r.resultado,r.alertas.length?'pending':'done'],['Revisión humana','Previo a liquidación',r.estado==='Aprobada'?'pending':'done']].map(t=>`<div class="trace-step ${t[2]==='pending'?'pending':''}"><div class="trace-dot">${t[2]==='pending'?'○':'✓'}</div><b>${escHtml(t[0])}</b><span>${escHtml(t[1])}</span></div>`).join('');if(toast!==false)showToast('Declaración jurada seleccionada: '+r.id);}
function selectValidacion(id,toast=true){if(window.__validacionesContext==='gnv-dj'||String(id||'').startsWith('DJ-'))selectGnvDjValidacion(id,toast);else selectBonogasPaymentValidacion(id,toast);}
function exportBonogasPaymentValidaciones(rows,quiet=false){const now=new Date().toLocaleString('es-PE');const headers=['ID Expediente','Beneficiario','Empresa instaladora GNR','Distrito','Fecha conformidad','Monto a pagar','Estado','Zona roja'];const zoneMap=new Map();rows.forEach(r=>{const key=r.distrito||'Sin distrito';zoneMap.set(key,(zoneMap.get(key)||0)+Number(r.monto||0));});const zoneLevel=d=>{const total=zoneMap.get(d)||0;return total>=1550?'Crítica':total>=1450?'Alta':'Media';};const dataRows=rows.map(r=>[r.id,r.beneficiario,r.empresa,r.distrito,r.fecha,formatMoney(r.monto),r.estado,zoneLevel(r.distrito)]);const workbook=`<html><head><meta charset="utf-8"><style>body{font-family:Arial,sans-serif}h1{color:#0f172a}h2{background:#0f766e;color:white;padding:8px}table{border-collapse:collapse;margin-bottom:14px}th{background:#dbeafe;font-weight:bold}td,th{padding:6px 8px;border:1px solid #94a3b8;mso-number-format:'\@'}</style></head><body><h1>Exportación BONO GAS · Recaudación</h1>${excelTable('Filtros aplicados',['Campo','Valor'],[['Empresa GNR',qs('#valEmpresaFilter')?.value||'Todas'],['Estado',qs('#valEstadoFilter')?.value||'Todos'],['Fecha',qs('#valFechaFilter')?.value||'Todas'],['Distrito',qs('#valDistritoFilter')?.value||'Todos'],['Generado',now]])}${excelTable('Expedientes filtrados',headers,dataRows)}</body></html>`;downloadExcelFile('BONO_GAS_recaudacion_filtrada.xls',workbook);if(!quiet)showToast('Exportación generada con '+rows.length+' expedientes');}
function exportFilteredValidaciones(rows,quiet=false){const useRows=(rows&&rows.length)?rows:(window.filteredPaymentRows||window.paymentRows||[]);exportBonogasPaymentValidaciones(useRows,quiet);}
let validationBrandDataPromise=null;
function validationBrandImage(src,width,height){
  return fetch(src).then(function(response){if(!response.ok)throw new Error('Logo no disponible');return response.blob();}).then(function(blob){return new Promise(function(resolve,reject){const url=URL.createObjectURL(blob),img=new Image();img.onload=function(){const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;const ctx=canvas.getContext('2d');ctx.clearRect(0,0,width,height);const scale=Math.min(width/img.naturalWidth,height/img.naturalHeight);const w=img.naturalWidth*scale,h=img.naturalHeight*scale;ctx.drawImage(img,(width-w)/2,(height-h)/2,w,h);URL.revokeObjectURL(url);resolve(canvas.toDataURL('image/png'));};img.onerror=function(){URL.revokeObjectURL(url);reject(new Error('No se pudo procesar el logo'));};img.src=url;});});
}
function safeValidationBrandImage(primary,fallback,width,height){return validationBrandImage(primary,width,height).catch(function(){return fallback?validationBrandImage(fallback,width,height):null;}).catch(function(){return null;});}
function getValidationBrandData(){
  if(!validationBrandDataPromise)validationBrandDataPromise=Promise.all([safeValidationBrandImage('log_fise.png','fise-logo.svg',480,192),safeValidationBrandImage('logopaulet.png',null,480,280)]).then(function(images){return {fise:images[0],paulet:images[1]};});
  return validationBrandDataPromise;
}
function validationExportRows(rows){
  const zoneMap=new Map();rows.forEach(function(r){const key=r.distrito||'Sin distrito';zoneMap.set(key,(zoneMap.get(key)||0)+Number(r.monto||0));});
  const zoneLevel=function(d){const total=zoneMap.get(d)||0;return total>=1550?'Crítica':total>=1450?'Alta':'Media';};
  return rows.map(function(r){return [r.id,r.beneficiario,r.empresa,r.distrito,r.fecha,formatMoney(r.monto),BONOGAS_ORDER_IDS.has(r.id)?'Orden emitida':r.estado,zoneLevel(r.distrito)];});
}
function validationKpiExportLabel(){return {all:'Todos los expedientes',conforming:'Expedientes conformes',pending:'Pendientes de pago',observed:'Observados',orders:'Órdenes emitidas'}[validacionesKpiFilter]||'Todos los expedientes';}
function validationExportFilterMeta(){return [['KPI activo',validationKpiExportLabel()],['Búsqueda',qs('#valSearch')?.value||'Sin búsqueda'],['Empresa GNR',qs('#valEmpresaFilter')?.value||'Todas'],['Estado',qs('#valEstadoFilter')?.value||'Todos'],['Fecha',qs('#valFechaFilter')?.value||'Todas'],['Distrito',qs('#valDistritoFilter')?.value||'Todos'],['Generado',new Date().toLocaleString('es-PE')]];}
function getCurrentValidationExportRows(){
  const q=normalizeText(qs('#valSearch')?.value||''),empresa=qs('#valEmpresaFilter')?.value||'',estado=qs('#valEstadoFilter')?.value||'',fecha=qs('#valFechaFilter')?.value||'',distrito=qs('#valDistritoFilter')?.value||'';
  return (window.paymentRows||[]).filter(function(r){return (!empresa||r.empresa===empresa)&&(!estado||r.estado===estado)&&(!fecha||r.fechaIso===fecha)&&(!distrito||r.distrito===distrito)&&(!q||normalizeText(r.id+' '+r.beneficiario+' '+r.empresa+' '+r.distrito).includes(q))&&validationMatchesKpi(r,validacionesKpiFilter);});
}
async function exportBrandedValidationXlsx(rows,quiet){
  const brand=await getValidationBrandData();
  const now=new Date().toLocaleString('es-PE');
  const headers=['ID Expediente','Beneficiario','Empresa instaladora GNR','Distrito','Fecha conformidad','Monto a pagar','Estado','Zona roja'];
  const workbook=`<html><head><meta charset="utf-8"><style>body{font-family:Arial,sans-serif;color:#0f172a}.brand{display:flex;align-items:center;gap:5px;height:74px;border-bottom:3px solid #0ea5e9;margin-bottom:18px}.brand img:first-child{width:135px;height:60px;object-fit:contain}.brand img:last-child{width:88px;height:60px;object-fit:contain}h1{font-size:20px}h2{background:#0f766e;color:white;padding:8px}table{border-collapse:collapse;margin-bottom:14px}th{background:#dbeafe;font-weight:bold}td,th{padding:6px 8px;border:1px solid #94a3b8;mso-number-format:'\@'}</style></head><body><div class="brand" data-export-brand>${brand.fise?`<img src="${brand.fise}" alt="FISE">`:''}${brand.paulet?`<img src="${brand.paulet}" alt="Paulet">`:''}</div><h1>Exportación BONO GAS · Validaciones</h1>${excelTable('KPI y filtros aplicados',['Campo','Valor'],validationExportFilterMeta())}${excelTable('Expedientes filtrados',headers,validationExportRows(rows))}</body></html>`;
  downloadExcelFile('BONO_GAS_validaciones.xls',workbook);
  if(!quiet)showToast('Excel institucional generado con '+rows.length+' expedientes');
}
function exportBrandedValidationCsv(rows,quiet){
  const headers=['ID Expediente','Beneficiario','Empresa instaladora GNR','Distrito','Fecha conformidad','Monto a pagar','Estado','Zona roja'];
  const lines=[['FISE','PAULET'].map(csvCell).join(','),['Reporte','BONO GAS · Validaciones'].map(csvCell).join(',')];validationExportFilterMeta().forEach(function(row){lines.push(row.map(csvCell).join(','));});lines.push('',headers.map(csvCell).join(','));
  validationExportRows(rows).forEach(function(row){lines.push(row.map(csvCell).join(','));});
  downloadTextFile('BONO_GAS_validaciones.csv','\ufeff'+lines.join('\n'));
  if(!quiet)showToast('CSV institucional generado con '+rows.length+' expedientes');
}
async function exportBrandedValidationPdf(rows,quiet){
  let jsPDF;try{jsPDF=await ensureJsPdf();}catch(error){showToast('No se pudo cargar la librería PDF');return;}
  if(!jsPDF){showToast('Librería PDF no disponible');return;}
  const brand=await getValidationBrandData();
  const doc=new jsPDF({unit:'pt',format:'a4',orientation:'landscape'}),pageWidth=842,now=new Date().toLocaleString('es-PE');
  function drawHeader(){doc.setFillColor(255,255,255);doc.rect(0,0,pageWidth,112,'F');try{if(brand.fise)doc.addImage(brand.fise,'PNG',36,16,112,45);if(brand.paulet)doc.addImage(brand.paulet,'PNG',158,12,78,48);}catch(error){}doc.setDrawColor(14,165,233);doc.setLineWidth(2);doc.line(36,67,pageWidth-36,67);doc.setTextColor(15,23,42);doc.setFontSize(16);doc.text('BONO GAS · Reporte de Validaciones',36,86);doc.setFontSize(8);doc.setTextColor(100,116,139);doc.text('KPI: '+validationKpiExportLabel()+' · '+rows.length+' registros',36,101);doc.text('Generado: '+now,pageWidth-185,86);}
  drawHeader();
  const headers=[['ID Expediente','Beneficiario','Empresa instaladora GNR','Distrito','Fecha','Monto','Estado','Zona']];
  const body=validationExportRows(rows);
  if(typeof doc.autoTable==='function')doc.autoTable({head:headers,body:body,startY:116,margin:{top:116,left:36,right:36},styles:{fontSize:7.5,cellPadding:5,textColor:[15,23,42]},headStyles:{fillColor:[14,116,144],textColor:[255,255,255]},alternateRowStyles:{fillColor:[240,249,255]},didDrawPage:drawHeader});
  else{let y=118;doc.setFontSize(8);body.slice(0,35).forEach(function(row){doc.text(row.join(' | ').slice(0,165),36,y);y+=12;});}
  doc.save('BONO_GAS_validaciones.pdf');
  if(!quiet)showToast('PDF institucional generado con '+rows.length+' expedientes');
}
exportFilteredValidaciones=function(rows,quiet=false){const useRows=(rows&&rows.length)?rows:(window.filteredPaymentRows||window.paymentRows||[]);return exportBrandedValidationXlsx(useRows,quiet);};
const installerRankingData=[
  {name:'Instalaciones del Norte S.A.C.',score:94,aptitud:'Apta',estado:'Apta para nuevos agrupaciones',expedientes:186,conformidad:97,retrabajos:2.1,plazo:4.2,observaciones:3,capacidad:'Alta',historico:[88,91,93,94],criteria:{calidad:96,plazo:92,documentacion:98,seguridad:95},recomendacion:'Empresa recomendada para nuevos agrupaciones por alta conformidad técnica, baja tasa de retrabajos y cumplimiento sostenido en los últimos trimestres.'},
  {name:'Gas & Hogar E.I.R.L.',score:88,aptitud:'Apta',estado:'Apta con seguimiento',expedientes:142,conformidad:92,retrabajos:4.4,plazo:5.1,observaciones:6,capacidad:'Media',historico:[82,84,87,88],criteria:{calidad:90,plazo:86,documentacion:89,seguridad:87},recomendacion:'Apta para nuevos agrupaciones de volumen medio. Recomendable mantener seguimiento documental y control de plazos.'},
  {name:'Conexiones Seguras S.A.C.',score:91,aptitud:'Apta',estado:'Apta para nuevos agrupaciones',expedientes:158,conformidad:95,retrabajos:3.2,plazo:4.7,observaciones:4,capacidad:'Alta',historico:[85,89,90,91],criteria:{calidad:93,plazo:90,documentacion:94,seguridad:92},recomendacion:'Empresa apta para asignación prioritaria en nuevos frentes por estabilidad trimestral y buen desempeño operativo.'},
  {name:'Instalagas Perú S.A.C.',score:73,aptitud:'Observada',estado:'Observada temporalmente',expedientes:96,conformidad:81,retrabajos:9.8,plazo:7.4,observaciones:15,capacidad:'Media',historico:[79,76,74,73],criteria:{calidad:78,plazo:70,documentacion:74,seguridad:72},recomendacion:'No priorizar para nuevos agrupaciones hasta cerrar observaciones, reducir retrabajos y mejorar tiempos de atención.'},
  {name:'GasSur Instalaciones S.A.C.',score:86,aptitud:'Apta',estado:'Apta con capacidad regional',expedientes:121,conformidad:91,retrabajos:4.9,plazo:5.4,observaciones:7,capacidad:'Media',historico:[80,83,84,86],criteria:{calidad:89,plazo:84,documentacion:87,seguridad:86},recomendacion:'Apta para nuevos agrupaciones regionales con control de carga operativa y supervisión por lote.'},
  {name:'Andes Gas Contratistas',score:68,aptitud:'No apta',estado:'No apta temporal',expedientes:74,conformidad:76,retrabajos:12.5,plazo:8.1,observaciones:18,capacidad:'Baja',historico:[72,70,69,68],criteria:{calidad:70,plazo:65,documentacion:67,seguridad:69},recomendacion:'No asignar nuevos agrupaciones hasta que presente plan de mejora y cierre de observaciones críticas.'},
  {name:'RedGas Perú S.A.C.',score:84,aptitud:'Apta',estado:'Apta condicionada',expedientes:108,conformidad:89,retrabajos:5.6,plazo:5.8,observaciones:8,capacidad:'Media',historico:[78,81,82,84],criteria:{calidad:87,plazo:82,documentacion:85,seguridad:84},recomendacion:'Apta para nuevos agrupaciones con evaluación mensual de cumplimiento y evidencias.'},
  {name:'TecnoGas Arequipa',score:79,aptitud:'Observada',estado:'Observada con mejora reciente',expedientes:83,conformidad:85,retrabajos:7.1,plazo:6.6,observaciones:11,capacidad:'Media',historico:[73,75,77,79],criteria:{calidad:82,plazo:77,documentacion:80,seguridad:78},recomendacion:'Puede participar en agrupaciones pequeños piloto, sujeto a control de calidad y validación documental reforzada.'}
];
function installerClass(item){return item.aptitud==='Apta'?'good':item.aptitud==='Observada'?'warn':'bad'}
function installerStatusClass(item){return item.aptitud==='Apta'?'apta':item.aptitud==='Observada'?'observada':'noapta'}
function renderInstallerRanking(selectedName){const list=qs('#installerRankList');if(!list)return;const sorted=[...installerRankingData].sort((a,b)=>b.score-a.score);const selected=sorted.find(x=>x.name===selectedName)||sorted[0];const aptas=installerRankingData.filter(x=>x.aptitud==='Apta').length;const obs=installerRankingData.filter(x=>x.aptitud!=='Apta').length;const avg=Math.round(installerRankingData.reduce((s,x)=>s+x.score,0)/installerRankingData.length);qs('#installerKpiTotal')&&(qs('#installerKpiTotal').textContent=installerRankingData.length);qs('#installerKpiAptas')&&(qs('#installerKpiAptas').textContent=aptas);qs('#installerKpiScore')&&(qs('#installerKpiScore').textContent=avg);qs('#installerKpiObs')&&(qs('#installerKpiObs').textContent=obs);list.innerHTML=sorted.map((item,idx)=>`<button class="installer-rank-row ${installerClass(item)} ${item.name===selected.name?'selected':''}" type="button" data-installer-select="${item.name}"><span class="installer-rank-pos">${idx+1}</span><span class="installer-rank-name"><b>${item.name}</b><span>${item.estado} · ${item.expedientes} expedientes · capacidad ${item.capacidad}</span></span><span class="installer-rank-score"><b>${item.score}</b><small class="${installerStatusClass(item)}">${item.aptitud}</small></span></button>`).join('');qsa('[data-installer-select]').forEach(btn=>btn.addEventListener('click',()=>renderInstallerRanking(btn.dataset.installerSelect)));renderInstallerDetail(selected);}
function renderInstallerDetail(item){if(!item)return;qs('#installerDetailName')&&(qs('#installerDetailName').textContent=item.name);const kpis=qs('#installerDetailKpis');if(kpis){kpis.innerHTML=`<div class="installer-detail-kpi"><span>Score actual</span><b>${item.score}/100</b></div><div class="installer-detail-kpi"><span>Conformidad</span><b>${item.conformidad}%</b></div><div class="installer-detail-kpi"><span>Retrabajos</span><b>${item.retrabajos}%</b></div><div class="installer-detail-kpi"><span>Plazo promedio</span><b>${item.plazo} días</b></div>`;}const quarters=['2025-I','2025-II','2025-III','2025-IV'];const bars=qs('#installerQuarterBars');if(bars){bars.innerHTML='<h3>Histórico trimestral</h3>'+item.historico.map((v,i)=>`<div class="installer-bar"><span>${quarters[i]}</span><div class="installer-bar-track"><div class="installer-bar-fill" style="width:${v}%"></div></div><b>${v}</b></div>`).join('');}const criteria=qs('#installerCriteria');if(criteria){criteria.innerHTML=`<div class="installer-criterion"><span>Calidad técnica</span><b>${item.criteria.calidad}%</b></div><div class="installer-criterion"><span>Cumplimiento de plazo</span><b>${item.criteria.plazo}%</b></div><div class="installer-criterion"><span>Documentación conforme</span><b>${item.criteria.documentacion}%</b></div><div class="installer-criterion"><span>Seguridad / incidentes</span><b>${item.criteria.seguridad}%</b></div><div class="installer-criterion"><span>Observaciones abiertas</span><b>${item.observaciones}</b></div>`;}const rec=qs('#installerRecommendation');if(rec){rec.className='installer-recommendation '+(item.aptitud==='Apta'?'':item.aptitud==='Observada'?'warn':'bad');rec.textContent=item.recomendacion;}}
function renderInstallerInline(selectedName,scope){scope=scope||(window.__validacionesContext==='gnv-dj'?'gnv':'bonogas');const list=qs(scope==='gnv'?'#gnvValInstallerMiniList':'#valInstallerMiniList'),detail=qs(scope==='gnv'?'#gnvValInstallerMiniDetail':'#valInstallerMiniDetail');if(!list||!detail||!window.installerRankingData)return;const sorted=[...installerRankingData].sort((a,b)=>b.score-a.score).slice(0,6);const selected=installerRankingData.find(x=>x.name===selectedName)||sorted[0];list.innerHTML=sorted.map((item,idx)=>`<button class="val-installer-mini-card ${item.name===selected.name?'selected':''}" type="button" data-mini-installer="${item.name}" data-mini-scope="${scope}"><b>#${idx+1} ${item.name}</b><span>${item.expedientes} expedientes · ${item.conformidad}% conforme</span><small class="${installerStatusClass(item)}">${item.aptitud} · ${item.score}/100</small></button>`).join('');qsa('[data-mini-installer][data-mini-scope="'+scope+'"]').forEach(btn=>btn.addEventListener('click',()=>renderInstallerInline(btn.dataset.miniInstaller,scope)));const recClass=selected.aptitud==='Apta'?'':selected.aptitud==='Observada'?'warn':'bad';detail.innerHTML=`<h4>${selected.name}</h4><div class="mini-score-row"><span>Score actual</span><b>${selected.score}/100</b></div><div class="mini-score-track"><div class="mini-score-fill" style="width:${selected.score}%"></div></div><div class="mini-score-row"><span>Histórico trimestral</span><b>${selected.historico.join(' · ')}</b></div><div class="mini-score-row"><span>Retrabajos</span><b>${selected.retrabajos}%</b></div><div class="mini-score-row"><span>Plazo promedio</span><b>${selected.plazo} días</b></div><div class="mini-recommendation ${recClass}">${selected.recomendacion}</div>`;}
function installerRankingExportRows(){return [...installerRankingData].sort((a,b)=>b.score-a.score).map((item,index)=>[index+1,item.name,item.score,item.aptitud,item.estado,item.expedientes,item.conformidad+'%',item.retrabajos+'%',item.plazo+' días',item.observaciones,item.capacidad,item.historico[0],item.historico[1],item.historico[2],item.historico[3]]);}
function ensureInstallerRankingExportActions(){const dashboard=qs('#installerRankingModal .installer-dashboard');if(!dashboard||qs('#installerRankingExportActions'))return;const block=document.createElement('div');block.id='installerRankingExportActions';block.className='installer-ranking-export';block.innerHTML='<div><b>Exportar ranking de empresas</b><span>Descargue el ranking completo y su histórico trimestral.</span></div><div class="installer-ranking-export-buttons"><button type="button" data-installer-export="xlsx">Excel</button><button type="button" data-installer-export="csv">CSV</button><button type="button" data-installer-export="pdf">PDF</button></div>';dashboard.appendChild(block);}
async function exportInstallerRanking(format){const headers=['Posición','Empresa instaladora','Score','Aptitud','Estado','Expedientes','Conformidad','Retrabajos','Plazo promedio','Observaciones','Capacidad','2025-I','2025-II','2025-III','2025-IV'];const rows=installerRankingExportRows();if(format==='xlsx'){if(!window.XLSX){showToast('Librería Excel no disponible');return;}const workbook=XLSX.utils.book_new(),sheet=XLSX.utils.aoa_to_sheet([headers,...rows]);sheet['!cols']=headers.map((h,i)=>({wch:i===1?34:Math.max(12,h.length+2)}));XLSX.utils.book_append_sheet(workbook,sheet,'Ranking instaladoras');XLSX.writeFile(workbook,'BONOGAS_ranking_instaladoras.xlsx');showToast('Ranking exportado a Excel');return;}if(format==='csv'){const cell=v=>'"'+String(v??'').replace(/"/g,'""')+'"';downloadTextFile('BONOGAS_ranking_instaladoras.csv',[headers.map(cell).join(','),...rows.map(row=>row.map(cell).join(','))].join('\n'));showToast('Ranking exportado a CSV');return;}if(format==='pdf'&&typeof exportInstitutionalSelectionPdf==='function'){await exportInstitutionalSelectionPdf(headers,rows,'BONO GAS · Ranking de empresas instaladoras','BONOGAS_ranking_instaladoras.pdf','Histórico trimestral y aptitud para nuevos agrupaciones · Art. 28');showToast('Ranking exportado a PDF');}}
function openInstallerRanking(companyName){openModal('installerRankingModal');ensureInstallerRankingExportActions();renderInstallerRanking(companyName);renderInstallerInline(companyName);showToast('Ranking abierto: '+companyName)}
document.addEventListener('click',function(e){const btn=e.target.closest('[data-installer-export]');if(btn)exportInstallerRanking(btn.dataset.installerExport);});
document.addEventListener('DOMContentLoaded',function(){const style=document.createElement('style');style.textContent='.installer-ranking-export{margin-top:16px;padding:14px 16px;border:1px solid rgba(56,189,248,.28);border-radius:15px;background:rgba(8,15,33,.72);display:flex;align-items:center;justify-content:space-between;gap:16px}.installer-ranking-export>div:first-child{display:grid;gap:4px}.installer-ranking-export b{color:#fff;font-size:12px}.installer-ranking-export span{color:#94a3b8;font-size:10px}.installer-ranking-export-buttons{display:flex;gap:8px;flex-wrap:wrap}.installer-ranking-export-buttons button{border:1px solid rgba(255,255,255,.2);border-radius:10px;padding:9px 14px;color:#fff;font-size:10px;font-weight:900;cursor:pointer}.installer-ranking-export-buttons button[data-installer-export="xlsx"]{background:#15803d}.installer-ranking-export-buttons button[data-installer-export="csv"]{background:#0e7490}.installer-ranking-export-buttons button[data-installer-export="pdf"]{background:#dc2626}@media(max-width:760px){.installer-ranking-export{align-items:stretch;flex-direction:column}.installer-ranking-export-buttons button{flex:1}}';document.head.appendChild(style);});
function liqNumber(id){return Number(qs(id)?.value||0)}
function updateLiquidationSummary(status){const financiado=liqNumber('#liqFinanciado'),subsidio=liqNumber('#liqSubsidio'),derecho=liqNumber('#liqDerecho'),acometida=liqNumber('#liqAcometida'),penalidad=liqNumber('#liqPenalidad');const bruto=financiado+derecho+acometida;const total=Math.max(0,bruto-subsidio-penalidad);qs('#liqGross')&&(qs('#liqGross').textContent=formatMoney(bruto));qs('#liqTotal')&&(qs('#liqTotal').textContent=formatMoney(total));const badge=qs('#liqStatusBadge');if(badge){badge.textContent=status||qs('#liqEstado')?.value||'Preliquidación';badge.className='sync-status '+(badge.textContent==='Orden de pago emitida'?'ok':badge.textContent==='Observada'?'off':'warn');}const progress=qs('#liqProgress');if(progress)progress.style.width=(badge&&badge.textContent==='Orden de pago emitida'?'100%':badge&&badge.textContent==='Lista para validación'?'72%':'45%');return {bruto,total};}
function addLiquidationLog(action){const box=qs('#liqLogRows');if(!box)return;const exp=qs('#liqExpediente')?.value||'Expediente';const total=updateLiquidationSummary(action).total;box.insertAdjacentHTML('afterbegin',`<div class="sync-log-row"><span>${exp}</span><b>${action} · ${formatMoney(total)}</b></div>`);}
function openLiquidationModal(){openModal('liquidationModal');updateLiquidationSummary();}
function bindBonogasLiquidationUtility(){
  if(window.__bonogasLiquidationUtilityBound)return;
  window.__bonogasLiquidationUtilityBound=true;
  document.addEventListener('click',function(e){
    const btn=e.target.closest('#bonoUtilLiquidationBtn');
    if(!btn)return;
    e.preventDefault();
    openLiquidationModal();
  });
}
let signatureCaptured=false;
let docGenerated=2,docSigned=1,docSentTray=1;
function docEsc(value){return String(value??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function updateDocKpis(){const pending=Math.max(0,docGenerated-docSentTray);qs('#docKpiGenerated')&&(qs('#docKpiGenerated').textContent=docGenerated);qs('#docKpiSigned')&&(qs('#docKpiSigned').textContent=docSigned);qs('#docKpiTray')&&(qs('#docKpiTray').textContent=docSentTray);qs('#docKpiPending')&&(qs('#docKpiPending').textContent=pending);qs('#docTrayCount')&&(qs('#docTrayCount').textContent=docSentTray+' enviado'+(docSentTray===1?'':'s'));}
function currentDocData(){return {type:qs('#docType')?.value||'Informe Técnico',project:qs('#docProject')?.value||'',number:qs('#docNumber')?.value||'',signer:qs('#docSigner')?.value||'',subject:qs('#docSubject')?.value||'',support:qs('#docSupport')?.value||'',conclusion:qs('#docConclusion')?.value||''};}
function refreshDocPreview(stamp){const d=currentDocData();const signedText=signatureCaptured?('Firmado digitalmente por '+d.signer):'Firma pendiente';const stampText=stamp||(signatureCaptured?'FIRMADO':'BORRADOR');const preview=qs('#docPreview');if(!preview)return;preview.innerHTML=`<div class="doc-preview-stamp ${stampText==='ENVIADO'?'sent':''}">${docEsc(stampText)}</div><h4>${docEsc(d.type).toUpperCase()}</h4><p><b>N°:</b> ${docEsc(d.number)}</p><p><b>Expediente / agrupación:</b> ${docEsc(d.project)}</p><p><b>Asunto:</b> ${docEsc(d.subject)}</p><p>${docEsc(d.support)}</p><p><b>Conclusión / resolución:</b> ${docEsc(d.conclusion)}</p><div class="doc-preview-sign ${signatureCaptured?'signed':''}">${docEsc(signedText)}</div>`;}
function clearSignatureCanvas(){const canvas=qs('#signatureCanvas');if(!canvas)return;const ctx=canvas.getContext('2d');ctx.clearRect(0,0,canvas.width,canvas.height);ctx.fillStyle='#f8fafc';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.strokeStyle='#94a3b8';ctx.lineWidth=1;ctx.setLineDash([8,8]);ctx.strokeRect(10,18,canvas.width-20,canvas.height-36);ctx.setLineDash([]);ctx.fillStyle='#64748b';ctx.font='700 13px Arial';ctx.fillText('Firme aquí',24,38);signatureCaptured=false;qs('#signatureStatus')&&(qs('#signatureStatus').textContent='Sin firma registrada');qs('#signatureTimestamp')&&(qs('#signatureTimestamp').textContent='--');refreshDocPreview('BORRADOR');}
function setupSignaturePad(){const canvas=qs('#signatureCanvas');if(!canvas||canvas.dataset.ready==='1')return;canvas.dataset.ready='1';const ctx=canvas.getContext('2d');let drawing=false,last=null;function pos(ev){const rect=canvas.getBoundingClientRect();const p=ev.touches?ev.touches[0]:ev;return {x:(p.clientX-rect.left)*(canvas.width/rect.width),y:(p.clientY-rect.top)*(canvas.height/rect.height)};}function start(ev){drawing=true;last=pos(ev);ev.preventDefault();}function move(ev){if(!drawing)return;const p=pos(ev);ctx.strokeStyle='#0f172a';ctx.lineWidth=3;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();ctx.moveTo(last.x,last.y);ctx.lineTo(p.x,p.y);ctx.stroke();last=p;ev.preventDefault();}function end(){if(drawing){signatureCaptured=true;qs('#signatureStatus')&&(qs('#signatureStatus').textContent='Firma capturada, pendiente de registro');}drawing=false;last=null;}canvas.addEventListener('mousedown',start);canvas.addEventListener('mousemove',move);window.addEventListener('mouseup',end);canvas.addEventListener('touchstart',start,{passive:false});canvas.addEventListener('touchmove',move,{passive:false});window.addEventListener('touchend',end);clearSignatureCanvas();}
function openReportsModal(){openModal('reportsModal');setupSignaturePad();refreshDocPreview();updateDocKpis();}
function bindBonogasReportsUtility(){
  if(window.__bonogasReportsUtilityBound)return;
  window.__bonogasReportsUtilityBound=true;
  document.addEventListener('click',function(e){
    const btn=e.target.closest('#bonoUtilReportsBtn');
    if(!btn)return;
    e.preventDefault();
    openReportsModal();
  });
}
function registerDocumentSignature(){if(!signatureCaptured){showToast('Primero dibuje una firma en el recuadro');return;}const now=new Date().toLocaleString('es-PE');qs('#signatureStatus')&&(qs('#signatureStatus').textContent='Firma registrada');qs('#signatureTimestamp')&&(qs('#signatureTimestamp').textContent=now);docSigned+=1;docGenerated+=1;refreshDocPreview('FIRMADO');updateDocKpis();showToast('Documento firmado digitalmente');}
function sendDocumentToTray(){const d=currentDocData();if(!signatureCaptured){showToast('Debe registrar una firma antes de enviar a bandeja');return;}docSentTray+=1;const rows=qs('#docTrayRows');if(rows){rows.insertAdjacentHTML('afterbegin',`<div class="doc-tray-row"><div><b>${docEsc(d.type)} N° ${docEsc(d.number)}</b><span>Enviada a bandeja · Firmada · ${new Date().toLocaleDateString('es-PE')}</span></div><small>Revisión</small></div>`);}refreshDocPreview('ENVIADO');updateDocKpis();showToast('Documento enviado a bandeja de revisión');}
function renderSolicitudes(){const q=normalizeText(qs('#solSearch')?.value||''),estado=qs('#solEstadoFilter')?.value||'',distrito=qs('#solDistritoFilter')?.value||'',origen=qs('#solOrigenFilter')?.value||'';const filtered=solicitudes.filter(s=>(!estado||s.estado===estado)&&(!distrito||s.distrito===distrito)&&(!origen||s.origen===origen)&&(!q||normalizeText(s.id+' '+s.beneficiario+' '+s.dni+' '+s.distrito).includes(q)));const body=qs('#solicitudesTableBody');if(body){body.innerHTML=filtered.map(s=>{const plazo=Number(s.diasConstruccion||0);const plazoClass=plazo>=90?'bad':'ok';const plazoLabel=plazo>=90?'Fuera de plazo':'Dentro de plazo';return `<tr class="${s.id===selectedSolicitudId?'selected':''}"><td><b>${s.id}</b></td><td>${s.beneficiario}</td><td>${s.dni}</td><td>${s.distrito}</td><td>${s.origen}</td><td><span class="sol-status ${solStatusClass(s.estado)}">${s.estado}</span></td><td>${s.fecha}</td><td><span class="plazo-alert ${plazoClass}">${plazo} días · ${plazoLabel}</span></td><td><button class="sol-action-btn" type="button" data-sol-id="${s.id}">Ver</button></td></tr>`;}).join('')||'<tr><td colspan="9">No se encontraron solicitudes con los filtros seleccionados.</td></tr>';}const total=solicitudes.length;qs('#solKpiTotal')&&(qs('#solKpiTotal').textContent=total);qs('#solKpiValidation')&&(qs('#solKpiValidation').textContent=solicitudes.filter(s=>s.estado==='En validación').length);qs('#solKpiApproved')&&(qs('#solKpiApproved').textContent=solicitudes.filter(s=>s.estado==='Aprobada').length);qs('#solKpiObserved')&&(qs('#solKpiObserved').textContent=solicitudes.filter(s=>s.estado==='Observada').length);qsa('[data-sol-id]').forEach(btn=>btn.addEventListener('click',()=>selectSolicitud(btn.dataset.solId)));selectSolicitud(selectedSolicitudId,false)}
function selectSolicitud(id,toast=true){
  const s=solicitudes.find(x=>x.id===id)||solicitudes[0];
  selectedSolicitudId=s.id;
  const card=qs('#solDetailCard');
  if(card){
    card.innerHTML=`<div class="sol-detail-row"><span>Solicitud</span><b>${s.id}</b></div><div class="sol-detail-row"><span>Beneficiario</span><b>${s.beneficiario}</b></div><div class="sol-detail-row"><span>DNI / RUC</span><b>${s.dni}</b></div><div class="sol-detail-row"><span>Tipo</span><b>${s.tipo}</b></div><div class="sol-detail-row"><span>Distrito</span><b>${s.distrito}</b></div><div class="sol-detail-row"><span>Dirección</span><b>${s.direccion}</b></div><div class="sol-detail-row"><span>Teléfono</span><b>${s.telefono}</b></div><div class="sol-detail-row"><span>Origen</span><b>${s.origen}</b></div><div class="sol-detail-row"><span>Estado</span><b><span class="sol-status ${solStatusClass(s.estado)}">${s.estado}</span></b></div><div class="sol-detail-row"><span>Observación</span><b>${s.observacion}</b></div></div><div class="sol-timeline"><div class="sol-step"><span class="sol-dot done">1</span><div><b>Registro recibido</b><span>${s.fecha} · ${s.origen}</span></div></div><div class="sol-step"><span class="sol-dot ${s.estado==='Nueva'?'current':'done'}">2</span><div><b>Revision documental</b><span>${s.estado==='Nueva'?'Pendiente de iniciar':'En revision / completada'}</span></div></div><div class="sol-step"><span class="sol-dot ${s.estado==='Aprobada'?'done':s.estado==='En validación'?'current':''}">3</span><div><b>Validación técnica</b><span>${s.estado==='Aprobada'?'Conforme':'Cruce con catastro y elegibilidad'}</span></div></div><div class="sol-step"><span class="sol-dot ${s.estado==='Aprobada'?'current':''}">4</span><div><b>Programación de instalación</b><span>${s.estado==='Aprobada'?'Lista para cuadrilla':'Pendiente'}</span></div></div></div><div class="modal-actions" style="margin-top:14px"><button class="btn dark" type="button">Enviar a validación</button><button class="btn" type="button">Aprobar solicitud</button></div>`;
  }
  // Abrir timeline al seleccionar una solicitud desde la tabla
  try{
    const tlRecord = (window.currentSupplyRecords||[]).find(r=>r.suministro===s.suministro||r.beneficiario===s.beneficiario||r.dni===s.dni)||{suministro:s.suministro,beneficiario:s.beneficiario,fecha:s.fecha,estado:s.estado,direccion:s.direccion};
    renderMapTimeline(tlRecord);
  }catch(e){/* noop */}
  if(toast)showToast('Solicitud seleccionada: '+s.id)
}
function openSolicitudesEnvironment(){const main=qs('.main');main?.classList.add('requests-mode');main?.classList.remove('validations-mode','vale-fise-mode','ahorro-gnv-mode','fotovoltaico-mode','electricidad-mode','masificacion-mode','hospital-mode','create-project-mode','project-list-mode','project-delete-mode','spa-mode','bonogas-active','bonogas-satcontrol-mode');qs('#navSolicitudes')?.classList.add('active');qs('#navValidaciones')?.classList.remove('active');qs('#navDashboard')?.classList.remove('active');qs('#navBonoSatcontrol')?.classList.remove('active');qs('#navValeFise')?.classList.remove('active');qs('#navAhorroGnv')?.classList.remove('active');qs('#navFotovoltaico')?.classList.remove('active');qs('#navElectricidad')?.classList.remove('active');qs('#navMasificacionSatcontrol')?.classList.remove('active');const title=qs('.topbar h1'),sub=qs('.topbar p');if(title)title.textContent='SATCONTROL · SOLICITUDES';if(sub){sub.textContent='Bandeja operativa para registro, evaluación y seguimiento de solicitudes BONOGAS2.0';sub.style.display='';}renderSolicitudes();resizeMapAfterLayout();showToast('Solicitudes')}
function triggerMorosityLayer(levelToHighlight) {
  const chk = qs('#layerMorosidad');
  if (chk && !chk.checked) {
    chk.checked = true;
    const layerEstrato = qs('#layerEstrato');
    if (layerEstrato) layerEstrato.checked = false;
    const layerBeneficiarios = qs('#layerBeneficiarios');
    if (layerBeneficiarios) layerBeneficiarios.checked = false;
    ['#layerBenLiquidados', '#layerBenPendLiquid', '#layerBenConstrDentro', '#layerBenConstrFuera'].forEach(id => {
      const el = qs(id);
      if (el) el.checked = false;
    });
    updateOverlayVisibility();
    showToast('Mapa de morosidad activado. Capas de lotes y beneficiarios ocultadas para claridad.');
  }
  if (morosityLayer && leafletMap) {
    const project = currentProject();
    leafletMap.setView([project.lat, project.lng], 15);
    let found = false;
    morosityLayer.eachLayer(layer => {
      if (layer instanceof L.Rectangle) {
        const popup = layer.getPopup();
        if (popup) {
          const content = popup.getContent();
          if (content && content.includes('Nivel de morosidad: <b>' + levelToHighlight + '</b>')) {
            setTimeout(() => {
              leafletMap.panTo(layer.getBounds().getCenter());
              layer.openPopup();
            }, 320);
            found = true;
          }
        }
      }
    });
    if (!found) {
      showToast('No se encontró zona con nivel de morosidad: ' + levelToHighlight);
    }
  }
}

function initValLeafletMap(){
  if(!window.L) return;
  const container = qs('.val-admin-map');
  if(!container) return;
  if(!container.id) {
    container.id = 'valAdminMapDiv';
  }
  if(valLeafletMap) {
    setTimeout(() => {
      valLeafletMap.invalidateSize();
      const valZones = [
        { id: 'MZ-01', lat: -12.0264, lng: -76.9128 },
        { id: 'MZ-07', lat: -11.9686, lng: -76.9920 },
        { id: 'MZ-04', lat: -12.2112, lng: -76.9360 },
        { id: 'MZ-11', lat: -11.9312, lng: -77.0428 },
        { id: 'MZ-08', lat: -11.9680, lng: -77.0680 }
      ];
      const bounds = L.latLngBounds(valZones.map(z => [z.lat, z.lng]));
      valLeafletMap.fitBounds(bounds, { padding: [30, 30] });
    }, 150);
    return;
  }
  valLeafletMap = L.map(container.id, {zoomControl: true, preferCanvas: true, attributionControl: false}).setView([-12.0464, -77.0428], 11);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap · © CARTO'
  }).addTo(valLeafletMap);
  
  valMorosityLayers = L.layerGroup().addTo(valLeafletMap);
  drawValMapData();
}

function drawValMapData() {
  if (!valLeafletMap || !valMorosityLayers) return;
  valMorosityLayers.clearLayers();
  
  const valZones = [
    { id: 'MZ-01', lat: -12.0264, lng: -76.9128, w: 0.007, h: 0.005, district: 'Ate', level: 'Crítica', total: 1560 },
    { id: 'MZ-07', lat: -11.9686, lng: -76.9920, w: 0.008, h: 0.005, district: 'San Juan de Lurigancho', level: 'Crítica', total: 1520 },
    { id: 'MZ-04', lat: -12.2112, lng: -76.9360, w: 0.007, h: 0.005, district: 'Villa El Salvador', level: 'Alta', total: 1480 },
    { id: 'MZ-11', lat: -11.9312, lng: -77.0428, w: 0.008, h: 0.005, district: 'Comas', level: 'Crítica', total: 1600 },
    { id: 'MZ-08', lat: -11.9680, lng: -77.0680, w: 0.007, h: 0.005, district: 'Los Olivos', level: 'Alta', total: 1520 }
  ];
  
  valZones.forEach(z => {
    const bounds = [[z.lat - z.h, z.lng - z.w], [z.lat + z.h, z.lng + z.w]];
    const color = z.level === 'Crítica' ? '#7f1d1d' : (z.level === 'Alta' ? '#ef4444' : '#f59e0b');
    
    const rect = L.rectangle(bounds, {
      color: color,
      weight: 2.5,
      opacity: 0.9,
      fillColor: color,
      fillOpacity: 0.45,
      dashArray: '4 4'
    }).addTo(valMorosityLayers);
    
    rect.bindPopup(`<b>Zona de morosidad ${z.id}</b><br>Distrito: <b>${z.district}</b><br>Nivel de morosidad: <b>${z.level}</b><br>Monto pendiente: <b>S/ ${z.total}</b>`);
    rect.bindTooltip(`${z.id}<br>S/ ${z.total}`, {
      permanent: true,
      direction: 'center',
      className: 'morosity-label'
    });
    
    rect.on('mouseover', function() {
      this.setStyle({ fillOpacity: 0.7, weight: 3.5 });
    });
    rect.on('mouseout', function() {
      this.setStyle({ fillOpacity: 0.45, weight: 2.5 });
    });
    
    rect.on('click', () => {
      const distInput = qs('#valDistritoFilter');
      if (distInput) {
        distInput.value = z.district;
        renderValidaciones();
        showToast(`Filtrado por distrito: ${z.district}`);
      }
    });
  });
  
  const bounds = L.latLngBounds(valZones.map(z => [z.lat, z.lng]));
  valLeafletMap.fitBounds(bounds, { padding: [30, 30] });
}

function openValidacionesEnvironment(){window.__validacionesContext='bonogas-payment';const main=qs('.main');main?.classList.add('validations-mode');main?.classList.remove('requests-mode','vale-fise-mode','ahorro-gnv-mode','fotovoltaico-mode','electricidad-mode','masificacion-mode','hospital-mode','create-project-mode','project-list-mode','project-delete-mode','spa-mode','integrated-module-mode','bonogas-active','bonogas-satcontrol-mode');qs('#navValidaciones')?.classList.add('active');qs('#navSolicitudes')?.classList.remove('active');qs('#navDashboard')?.classList.remove('active');qs('#navBonoSatcontrol')?.classList.remove('active');qs('#navValeFise')?.classList.remove('active');qs('#navAhorroGnv')?.classList.remove('active');qs('#navAhorroGnvSatcontrol')?.classList.remove('active');qs('#navFotovoltaico')?.classList.remove('active');qs('#navElectricidad')?.classList.remove('active');qs('#navMasificacionSatcontrol')?.classList.remove('active');const title=qs('.topbar h1'),sub=qs('.topbar p');if(title)title.textContent='SATCONTROL · VALIDACIONES · BONO GAS';if(sub){sub.textContent='Proceso No Concesionaria / Instaladora · Expedientes FISE conformes, liquidación y trazabilidad de recaudación';sub.style.display='';}renderValidaciones();renderInstallerInline('Instalaciones del Norte S.A.C.');if(typeof initValLeafletMap==='function')initValLeafletMap();resizeMapAfterLayout();showToast('Validaciones · expedientes de pago')}
function closeSolicitudesEnvironment(){const main=qs('.main');main?.classList.remove('requests-mode','validations-mode','vale-fise-mode','ahorro-gnv-mode','fotovoltaico-mode','electricidad-mode','masificacion-mode','hospital-mode','create-project-mode','project-list-mode','project-delete-mode');window.__validacionesContext='bonogas-payment';qs('#navSolicitudes')?.classList.remove('active');qs('#navValidaciones')?.classList.remove('active');qs('#navValeFise')?.classList.remove('active');qs('#navAhorroGnv')?.classList.remove('active');qs('#navAhorroGnvSatcontrol')?.classList.remove('active');qs('#navFotovoltaico')?.classList.remove('active');qs('#navElectricidad')?.classList.remove('active');qs('#navMasificacionSatcontrol')?.classList.remove('active');const title=qs('.topbar h1'),sub=qs('.topbar p');if(title)title.textContent='SATCONTROL AGRUPACIONES';if(sub){sub.textContent='Gestión territorial, documentos, liquidaciones y seguimiento operativo';sub.style.display='';}resizeMapAfterLayout();showToast('SATCONTROL AGRUPACIONES')}
function appendSyncLog(app,msg){const box=qs('#syncLogRows');if(!box)return;const time=new Date().toLocaleTimeString('es-PE',{hour:'2-digit',minute:'2-digit'});box.insertAdjacentHTML('afterbegin',`<div class="sync-log-row"><span>${app} · ${time}</span><b>${msg}</b></div>`);}
function setSyncCardStatus(app,status,msg,progress){const card=qs(`.sync-card[data-app="${app}"]`);if(!card)return;const badge=card.querySelector('.sync-status'),bar=card.querySelector('.sync-progress span'),last=card.querySelector('.last-sync');badge.textContent=status;badge.className='sync-status '+(status==='Conectado'?'ok':status==='Sincronizando'?'warn':status==='Pendiente'?'warn':'off');if(typeof progress==='number')bar.style.width=progress+'%';if(msg)appendSyncLog(app,msg);if(status==='Conectado'&&last)last.textContent='Hoy '+new Date().toLocaleTimeString('es-PE',{hour:'2-digit',minute:'2-digit'});}
function simulateAppSync(app){setSyncCardStatus(app,'Sincronizando','Proceso iniciado',18);showToast('Sincronizando '+app+'...');setTimeout(()=>setSyncCardStatus(app,'Sincronizando','Validando diferencias y registros duplicados',54),650);setTimeout(()=>setSyncCardStatus(app,'Sincronizando','Actualizando beneficiarios, estados y evidencias',82),1250);setTimeout(()=>{setSyncCardStatus(app,'Conectado','Sincronización completada correctamente',100);showToast(app+' sincronizado correctamente');},1900);}
function validateSyncConnection(){const app=qs('#syncTargetApp')?.value||'BONOGAS2.0';setSyncCardStatus(app,'Conectado','Conexión validada contra endpoint configurado',100);showToast('Conexión validada: '+app);}
function syncTargetNow(){const app=qs('#syncTargetApp')?.value||'BONOGAS2.0';simulateAppSync(app);}
function checkSyncDifferences(app){appendSyncLog(app,'Diferencias detectadas: 12 beneficiarios, 4 evidencias y 2 estados por conciliar');showToast('Diferencias calculadas para '+app);}
function svgToData(svg){return 'data:image/svg+xml;base64,'+window.btoa(unescape(encodeURIComponent(svg)))}
const evidenceImageData={
  cabinet:svgToData(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 480"><defs><linearGradient id="w" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#d9d2c0"/><stop offset="1" stop-color="#8a7d68"/></linearGradient><linearGradient id="f" x1="0" x2="1"><stop stop-color="#1f2937"/><stop offset="1" stop-color="#64748b"/></linearGradient></defs><rect width="720" height="480" fill="url(#w)"/><path d="M0 430L720 360v120H0z" fill="#334155" opacity=".65"/><rect x="305" y="90" width="340" height="250" rx="18" fill="#e5e7eb" stroke="#94a3b8" stroke-width="8"/><rect x="330" y="120" width="290" height="150" fill="#f8fafc" stroke="#cbd5e1" stroke-width="6"/><g stroke="#d97706" stroke-width="14" fill="none"><path d="M370 145v70h55"/><path d="M470 145v70h55"/><path d="M570 145v70"/></g><g fill="#e2e8f0" stroke="#334155" stroke-width="6"><circle cx="425" cy="230" r="32"/><circle cx="525" cy="230" r="32"/><circle cx="590" cy="230" r="24"/></g><rect x="330" y="282" width="290" height="34" rx="10" fill="#f1f5f9"/><g transform="translate(135 155)"><circle cx="76" cy="42" r="28" fill="#111827"/><rect x="38" y="67" width="105" height="150" rx="28" fill="#6b7280"/><rect x="62" y="82" width="48" height="126" fill="#1d4ed8" opacity=".85"/><rect x="4" y="180" width="95" height="28" rx="14" fill="#111827"/><rect x="112" y="205" width="92" height="28" rx="14" fill="#111827"/><rect x="130" y="84" width="96" height="70" rx="8" fill="#f8fafc" stroke="#64748b" stroke-width="5"/><path d="M150 104h52M150 124h42M150 144h55" stroke="#334155" stroke-width="6"/></g><rect x="30" y="25" width="260" height="42" rx="21" fill="#0f172a" opacity=".72"/><text x="52" y="53" font-family="Arial" font-size="22" fill="#e0f2fe" font-weight="700">Inspección de gabinete</text></svg>`),
  meter:svgToData(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 480"><defs><linearGradient id="wall" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#e8dec8"/><stop offset="1" stop-color="#b39b73"/></linearGradient><linearGradient id="m" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#f8fafc"/><stop offset="1" stop-color="#94a3b8"/></linearGradient></defs><rect width="720" height="480" fill="url(#wall)"/><rect x="40" y="365" width="680" height="115" fill="#334155" opacity=".35"/><g stroke="#92400e" stroke-width="22" fill="none" stroke-linecap="round"><path d="M160 185H330"/><path d="M490 185H655"/><path d="M330 185v70"/><path d="M490 185v70"/></g><rect x="256" y="250" width="300" height="190" rx="28" fill="url(#m)" stroke="#64748b" stroke-width="8"/><rect x="310" y="302" width="155" height="48" rx="8" fill="#e5e7eb" stroke="#64748b" stroke-width="5"/><rect x="328" y="318" width="80" height="16" rx="4" fill="#111827" opacity=".85"/><circle cx="500" cy="330" r="26" fill="#e2e8f0" stroke="#64748b" stroke-width="5"/><path d="M170 185c0-40 28-66 74-66h300c44 0 70 25 70 66" stroke="#92400e" stroke-width="18" fill="none"/><rect x="300" y="80" width="190" height="100" rx="46" fill="#111827"/><rect x="460" y="145" width="132" height="55" rx="15" fill="#facc15" stroke="#92400e" stroke-width="6"/><path d="M565 120v175" stroke="#6b4f2f" stroke-width="18"/><rect x="30" y="25" width="220" height="42" rx="21" fill="#0f172a" opacity=".72"/><text x="52" y="53" font-family="Arial" font-size="22" fill="#e0f2fe" font-weight="700">Medidor de gas</text></svg>`),
  connection:svgToData(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 480"><defs><linearGradient id="b" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#d8c7a9"/><stop offset="1" stop-color="#7c6a51"/></linearGradient></defs><rect width="720" height="480" fill="url(#b)"/><g stroke="#7c2d12" stroke-width="26" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M70 230H250v-70h150"/><path d="M400 160h210v95"/><path d="M250 230v140"/></g><rect x="380" y="102" width="190" height="115" rx="54" fill="#111827"/><rect x="555" y="130" width="120" height="58" rx="12" fill="#fbbf24" stroke="#78350f" stroke-width="7"/><circle cx="252" cy="230" r="50" fill="#e5e7eb" stroke="#475569" stroke-width="8"/><circle cx="252" cy="230" r="22" fill="#38bdf8" opacity=".85"/><rect x="165" y="354" width="310" height="54" rx="16" fill="#e2e8f0" stroke="#64748b" stroke-width="6"/><path d="M205 381h65M300 381h65M395 381h35" stroke="#334155" stroke-width="8"/><rect x="30" y="25" width="255" height="42" rx="21" fill="#0f172a" opacity=".72"/><text x="52" y="53" font-family="Arial" font-size="22" fill="#e0f2fe" font-weight="700">Conexión técnica</text></svg>`)
};
Object.assign(evidenceImageData,{
  fieldInspection:svgToData(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 480"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#dbeafe"/><stop offset="1" stop-color="#64748b"/></linearGradient></defs><rect width="720" height="480" fill="url(#g)"/><rect x="0" y="335" width="720" height="145" fill="#334155"/><g transform="translate(95 120)"><circle cx="85" cy="45" r="30" fill="#111827"/><rect x="45" y="72" width="115" height="175" rx="28" fill="#94a3b8"/><rect x="74" y="88" width="50" height="140" fill="#0ea5e9"/><rect x="160" y="118" width="120" height="85" rx="10" fill="#f8fafc" stroke="#475569" stroke-width="6"/><path d="M180 145h70M180 170h52" stroke="#334155" stroke-width="8"/></g><rect x="355" y="125" width="260" height="195" rx="20" fill="#e2e8f0" stroke="#475569" stroke-width="8"/><g stroke="#f97316" stroke-width="16" fill="none"><path d="M395 165v80h70"/><path d="M510 165v80h58"/></g><circle cx="465" cy="263" r="28" fill="#38bdf8"/><circle cx="570" cy="263" r="22" fill="#38bdf8"/><rect x="30" y="25" width="250" height="42" rx="21" fill="#0f172a" opacity=".75"/><text x="52" y="53" font-family="Arial" font-size="22" fill="#e0f2fe" font-weight="700">Inspección en campo</text></svg>`),
  valve:svgToData(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 480"><defs><linearGradient id="w" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#f5e7c8"/><stop offset="1" stop-color="#a16207"/></linearGradient></defs><rect width="720" height="480" fill="url(#w)"/><g stroke="#7c2d12" stroke-width="28" fill="none" stroke-linecap="round"><path d="M70 250H280"/><path d="M450 250H670"/><path d="M360 145v105"/></g><rect x="280" y="120" width="170" height="125" rx="54" fill="#111827"/><rect x="500" y="218" width="135" height="62" rx="16" fill="#facc15" stroke="#78350f" stroke-width="7"/><circle cx="360" cy="250" r="62" fill="#e5e7eb" stroke="#475569" stroke-width="9"/><circle cx="360" cy="250" r="25" fill="#38bdf8"/><rect x="30" y="25" width="210" height="42" rx="21" fill="#0f172a" opacity=".75"/><text x="52" y="53" font-family="Arial" font-size="22" fill="#e0f2fe" font-weight="700">Válvula y red</text></svg>`),
  kitchen:svgToData(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 480"><defs><linearGradient id="k" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#e5e7eb"/><stop offset="1" stop-color="#94a3b8"/></linearGradient></defs><rect width="720" height="480" fill="url(#k)"/><rect x="80" y="135" width="520" height="245" rx="28" fill="#f8fafc" stroke="#64748b" stroke-width="9"/><rect x="120" y="170" width="445" height="70" rx="18" fill="#1f2937"/><circle cx="185" cy="275" r="36" fill="#111827"/><circle cx="320" cy="275" r="36" fill="#111827"/><circle cx="455" cy="275" r="36" fill="#111827"/><g stroke="#0ea5e9" stroke-width="8"><path d="M185 275c18-25 32-25 50 0"/><path d="M320 275c18-25 32-25 50 0"/></g><path d="M90 410h520" stroke="#334155" stroke-width="14"/><rect x="30" y="25" width="225" height="42" rx="21" fill="#0f172a" opacity=".75"/><text x="52" y="53" font-family="Arial" font-size="22" fill="#e0f2fe" font-weight="700">Cocina habilitada</text></svg>`),
  street:svgToData(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 480"><rect width="720" height="480" fill="#cbd5e1"/><path d="M0 340L720 185v295H0z" fill="#475569"/><path d="M0 408L720 255" stroke="#f8fafc" stroke-width="12" stroke-dasharray="55 38"/><g fill="#e2e8f0" stroke="#64748b" stroke-width="6"><rect x="55" y="70" width="155" height="180" rx="10"/><rect x="250" y="40" width="180" height="160" rx="10"/><rect x="480" y="85" width="140" height="150" rx="10"/></g><g stroke="#f97316" stroke-width="18" fill="none"><path d="M85 300c100-30 180-35 260-15s150 55 255 20"/></g><circle cx="360" cy="285" r="18" fill="#22d3ee" stroke="#fff" stroke-width="5"/><rect x="30" y="25" width="235" height="42" rx="21" fill="#0f172a" opacity=".75"/><text x="52" y="53" font-family="Arial" font-size="22" fill="#e0f2fe" font-weight="700">Red en vía pública</text></svg>`),
  beneficiaryHome:svgToData(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 480"><defs><linearGradient id="h" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#fde68a"/><stop offset="1" stop-color="#b45309"/></linearGradient></defs><rect width="720" height="480" fill="url(#h)"/><rect x="120" y="190" width="420" height="220" rx="18" fill="#f8fafc" stroke="#92400e" stroke-width="8"/><path d="M85 205L330 85l255 120" fill="#7c2d12"/><rect x="280" y="285" width="95" height="125" fill="#1f2937"/><rect x="160" y="245" width="90" height="65" fill="#bfdbfe" stroke="#475569" stroke-width="7"/><rect x="415" y="245" width="90" height="65" fill="#bfdbfe" stroke="#475569" stroke-width="7"/><g stroke="#78350f" stroke-width="16" fill="none"><path d="M545 300h90v-80"/><path d="M635 220h45"/></g><rect x="30" y="25" width="250" height="42" rx="21" fill="#0f172a" opacity=".75"/><text x="52" y="53" font-family="Arial" font-size="22" fill="#e0f2fe" font-weight="700">Vivienda beneficiaria</text></svg>`),
  contractor:svgToData(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 480"><rect width="720" height="480" fill="#dbeafe"/><rect y="330" width="720" height="150" fill="#334155"/><g transform="translate(120 110)"><circle cx="90" cy="45" r="30" fill="#111827"/><path d="M45 35h110v22H45z" fill="#fbbf24"/><rect x="44" y="78" width="120" height="170" rx="28" fill="#1d4ed8"/><rect x="75" y="92" width="55" height="140" fill="#94a3b8"/><path d="M165 150h130" stroke="#111827" stroke-width="18" stroke-linecap="round"/></g><rect x="365" y="105" width="265" height="210" rx="20" fill="#f8fafc" stroke="#64748b" stroke-width="8"/><path d="M405 160h190M405 210h160M405 260h115" stroke="#334155" stroke-width="12"/><circle cx="585" cy="265" r="30" fill="#22c55e"/><path d="M570 265l14 14 30-38" stroke="#fff" stroke-width="10" fill="none"/><rect x="30" y="25" width="245" height="42" rx="21" fill="#0f172a" opacity=".75"/><text x="52" y="53" font-family="Arial" font-size="22" fill="#e0f2fe" font-weight="700">Acta contratista</text></svg>`)
});
const projectEvidenceMap={
  'FISE-2026-001':[
    {key:'cabinet',label:'Gabinete',title:'Inspección de gabinete',meta:'AGRUPACIÓN SAUNA 1 · Verificación en campo del gabinete y medidores.'},
    {key:'meter',label:'Medidor',title:'Medidor de gas',meta:'AGRUPACIÓN SAUNA 1 · Registro del medidor e instalación de gas.'},
    {key:'connection',label:'Conexión',title:'Validación técnica',meta:'AGRUPACIÓN SAUNA 1 · Evidencia técnica de tubería, válvula y conexión.'}
  ],
  'FISE-2026-002':[
    {key:'fieldInspection',label:'Inspección',title:'Inspección en campo',meta:'PRUEBA ABRIL 2026 · Validación técnica realizada por cuadrilla.'},
    {key:'valve',label:'Válvula',title:'Válvula y red interna',meta:'PRUEBA ABRIL 2026 · Revisión de válvula, regulador y conexión.'},
    {key:'kitchen',label:'Cocina',title:'Cocina habilitada',meta:'PRUEBA ABRIL 2026 · Evidencia de cocina conectada al servicio.'}
  ],
  'FISE-2026-003':[
    {key:'street',label:'Red vial',title:'Red en vía pública',meta:'AGRUPACIÓN ELECTRO 6 · Instalación y trazado de red en vía pública.'},
    {key:'beneficiaryHome',label:'Vivienda',title:'Vivienda beneficiaria',meta:'AGRUPACIÓN ELECTRO 6 · Fachada y punto de conexión del beneficiario.'},
    {key:'contractor',label:'Acta',title:'Acta de contratista',meta:'AGRUPACIÓN ELECTRO 6 · Registro de conformidad de contratista y supervisión.'}
  ]
};
function getProjectEvidences(project){return projectEvidenceMap[project?.id]||projectEvidenceMap['FISE-2026-001'];}
function renderProjectEvidences(project){const box=qs('#evidencePhotos'),count=qs('#evidenceCount');if(!box)return;const evidences=getProjectEvidences(project);if(count)count.textContent=evidences.length+'/5 fotos';box.innerHTML=evidences.map((ev,idx)=>`<button class="photo has-image" type="button" onclick="openEvidencePreviewByIndex('${project.id}',${idx})"><img data-img-key="${ev.key}" alt="${ev.title}"><span class="photo-label">${ev.label}</span></button>`).join('')+'<label class="empty-photo"><svg class="svg-icon" aria-hidden="true"><use href="#i-camera"></use></svg><input type="file" hidden></label><label class="empty-photo"><svg class="svg-icon" aria-hidden="true"><use href="#i-camera"></use></svg><input type="file" hidden></label>';initEvidenceImages();if(evidences[0])applyEvidenceAiAnalysis(project,evidences[0]);}
function applyEvidenceAiAnalysis(project,evidence){const card=qs('#djAiCard'),criteriaBox=qs('#djAiCriteria'),alertsBox=qs('#djAiAlerts'),status=qs('#djAiStatus');if(!card||!criteriaBox||!alertsBox||!status||!evidence)return;const analysisByKey={cabinet:{title:'Inspección de gabinete',status:'Coincide',quality:'Alta',identity:'Coincide',dni:'Apto',firma:'No detectada / alerta',photo:'<svg class="svg-icon" aria-hidden="true"><use href="#i-alert"></use></svg> Baja Resolución / Advertencia',alerts:['La imagen corresponde a un gabinete validable para control técnico.','Se recomienda revisar firma en DJ y corroborar con la declaración jurada.']},meter:{title:'Medidor de gas',status:'Coincide',quality:'Media',identity:'Coincide',dni:'Apto',firma:'No detectada / alerta',photo:'<svg class="svg-icon" aria-hidden="true"><use href="#i-alert"></use></svg> Baja Resolución / Advertencia',alerts:['La evidencia del medidor es útil para el cruce documental.','La firma en DJ no se verifica en esta captura.']},connection:{title:'Conexión técnica',status:'Conforme',quality:'Alta',identity:'Coincide',dni:'Apto',firma:'Detectada',photo:'Correcto: Buena Resolución',alerts:['La conexión luce consistente con la instalación declarada.','El soporte visual es suficiente para continuar el flujo.']},fieldInspection:{title:'Inspección en campo',status:'Coincide',quality:'Alta',identity:'Coincide',dni:'Apto',firma:'No detectada / alerta',photo:'Correcto: Buena Resolución',alerts:['La inspección de campo respalda la validación territorial.','Falta contraste documental de firma.']},valve:{title:'Válvula y red interna',status:'Conforme',quality:'Media',identity:'Coincide',dni:'Apto',firma:'Detectada',photo:'<svg class="svg-icon" aria-hidden="true"><use href="#i-alert"></use></svg> Baja Resolución / Advertencia',alerts:['La válvula respalda la trazabilidad técnica.','Conviene mejorar la calidad visual para archivo.']},kitchen:{title:'Cocina habilitada',status:'Coincide',quality:'Alta',identity:'Coincide',dni:'Apto',firma:'Detectada',photo:'Correcto: Buena Resolución',alerts:['La cocina habilitada valida la conformidad operativa.','La evidencia puede pasar a revisión administrativa.']},beneficiaryHome:{title:'Vivienda beneficiaria',status:'Coincide',quality:'Alta',identity:'Coincide',dni:'Apto',firma:'No detectada / alerta',photo:'Correcto: Buena Resolución',alerts:['La fachada de la vivienda coincide con el expediente.','Falta evidencia de firma en DJ para cierre completo.']},street:{title:'Red en vía pública',status:'Conforme',quality:'Media',identity:'Coincide',dni:'Apto',firma:'No detectada / alerta',photo:'Correcto: Buena Resolución',alerts:['La red pública es consistente con la proyección de extensión.','Se recomienda complementar con foto de gabinete.']},contractor:{title:'Acta de contratista',status:'Conforme',quality:'Media',identity:'Coincide',dni:'Apto',firma:'Detectada',photo:'<svg class="svg-icon" aria-hidden="true"><use href="#i-alert"></use></svg> Baja Resolución / Advertencia',alerts:['El acta de contratista cierra el soporte administrativo.','La calidad de imagen puede mejorar para legibilidad.']}};const data=analysisByKey[evidence.key]||analysisByKey.cabinet;status.textContent='IA vinculada · '+data.status;status.className='dj-ai-status';card.querySelector('.dj-ai-head p').textContent='Evidencia seleccionada: '+(evidence.title||evidence.label||'');criteriaBox.innerHTML=[['Validación de Identidad',data.identity,'done'],['Validación de DNI',data.dni,'done'],['Firma en DJ',data.firma.includes('Correcto:')?'done':'obs'],['Calidad de foto',data.photo.includes('Correcto:')?'done':'warn']].map(([title,result,state])=>`<div class="dj-ai-criterion ${state}"><i>${state==='done'?'<svg class="svg-icon" aria-hidden="true"><use href="#i-check"></use></svg>':state==='warn'?'!':'X'}</i><div><b>${title}</b><span>${evidence.label}</span></div><small>${result}</small></div>`).join('');alertsBox.innerHTML=`<div class="dj-ai-alert ${data.firma.includes('Correcto:')&&data.photo.includes('Correcto:')?'ok':''}"><b>${data.title}</b><br>${data.alerts.join('<br>')}</div>`;showToast(`IA actualizada con ${evidence.label} de ${project.nombre}`);}
function openEvidencePreviewByIndex(projectId,index){const p=projects.find(x=>x.id===projectId)||currentProject();const ev=getProjectEvidences(p)[index];if(!ev)return;qs('#previewTitle').textContent=ev.title||'Vista de evidencia';qs('#previewMeta').textContent=ev.meta||('Registro fotográfico asociado a '+p.nombre);qs('#previewImage').src=evidenceImageData[ev.key]||'';applyEvidenceAiAnalysis(p,ev);openModal('evidencePreviewModal');}
function initEvidenceImages(){qsa('img[data-img-key]').forEach(img=>{img.src=evidenceImageData[img.dataset.imgKey]||''});}
function getBeneficiaryLayerStates(){return {liquidados:qs('#layerBenLiquidados')?.checked??true,pendientes:qs('#layerBenPendLiquid')?.checked??true,dentro:qs('#layerBenConstrDentro')?.checked??true,fuera:qs('#layerBenConstrFuera')?.checked??true};}
function getBeneficiaryColor(estado){const map={'Liquidado':'#22c55e','Pendiente de liquidación':'#f59e0b','Dentro de plazo':'#0ea5e9','Fuera de plazo':'#ef4444','Conectado':'#22d3ee','En construcción':'#4ade80'};return map[estado]||'#94a3b8';}
function beneficiaryStateMatchesLayer(state,layerStates){if(state==='Liquidado')return layerStates.liquidados;if(state==='Pendiente de liquidación')return layerStates.pendientes;if(state==='Dentro de plazo')return layerStates.dentro;if(state==='Fuera de plazo')return layerStates.fuera;if(state==='Conectado')return layerStates.liquidados||layerStates.pendientes;if(state==='En construcción')return layerStates.dentro||layerStates.fuera;return false;}
function beneficiaryStableSeed(record,index=0){const key=(record.suministro||record.beneficiario||'')+'|'+(record.fechaRegistro||record.fechaInstalacion||'')+'|'+(record.empresaInstaladora||'')+'|'+(record.lat||'')+'|'+(record.lng||'')+'|'+(record.projectId||'')+'|'+index;let hash=0;for(let i=0;i<key.length;i++){hash=((hash<<5)-hash)+key.charCodeAt(i);hash|=0;}return Math.abs(hash);}
function buildBeneficiaries(lat,lng,total=24,project=null){const group=L.layerGroup();const layerStates=getBeneficiaryLayerStates();const center=L.latLng(lat,lng);const proj=project||((typeof currentProject==='function')?currentProject():null);const projKey=proj?.id||'PRJ';const names=['Ana Torres','Carlos Paredes','Lucía Vargas','Miguel Salas','Juana Rojas','Pedro Gutiérrez','Elena Chávez','Raúl Medina'];const companies=['GasSur Instalaciones S.A.C.','Andes Gas Contratistas','RedGas Perú S.A.C.','TecnoGas Arequipa'];const count=Math.max(1,Math.min(Number(total)||24,160));const generated=[];for(let i=0;i<count;i++){const seed=beneficiaryStableSeed({suministro:projKey+'-SUM-'+String(1000+i).padStart(4,'0'),beneficiario:names[i%names.length],fechaRegistro:'2026-04-'+String(1+(i%28)).padStart(2,'0'),empresaInstaladora:companies[i%companies.length],lat:lat,lng:lng,projectId:projKey},i);const goldenAngle=Math.PI*(3-Math.sqrt(5));const ring=0.004+Math.sqrt(i+1)*0.0016;const angle=(i*goldenAngle)+(seed%48)*0.014;const pointLat=lat+Math.sin(angle)*ring,pointLng=lng+Math.cos(angle)*ring;const connected=i%4!==0;const delayed=!connected&&(i%8===0||i%11===0);const supply={suministro:projKey+'-SUM-'+String(1000+i).padStart(4,'0'),tipoSuministro:i%5===0?'No residencial':'Residencial',beneficiario:names[i%names.length],fechaInstalacion:connected?'2026-04-'+String(5+(i%24)).padStart(2,'0'):'Pendiente de habilitación',estadoInstalacion:projectSupplyState(i,connected,delayed),inicioConstruccion:connected?'2026-04-'+String(1+(i%26)).padStart(2,'0'):(delayed?'2026-01-'+String(3+(i%18)).padStart(2,'0'):'2026-04-'+String(1+(i%26)).padStart(2,'0')),empresaInstaladora:companies[i%companies.length],servicioElectrico:i%3===0?'Sin servicio':'Con servicio',cocinaGLP:i%4===0?'No':'Sí',tipoCombustible:i%5===0?'GLP':'Gas natural',sexo:i%2===0?'Masculino':'Femenino',lat:pointLat,lng:pointLng,beneficiarios:1,liquidacion:connected?1200+(i%6)*180:650+(i%5)*130,projectId:projKey};supply.montoPendiente=connected?((i%6===0)?260+(i%4)*120:(i%3===0?120:0)):(780+(i%7)*210);supply.nivelMorosidad=supply.montoPendiente>=1700?'Crítica':supply.montoPendiente>=1000?'Alta':supply.montoPendiente>=350?'Media':'Baja';generated.push(supply);}const allRecords=generated;currentSupplyRecords=allRecords.slice();const toRender=allRecords.filter(d=>beneficiaryStateMatchesLayer(d.estadoInstalacion,layerStates));toRender.forEach((d,i)=>{const pos=[Number(d.lat)||center.lat,Number(d.lng)||center.lng];d.lat=pos[0];d.lng=pos[1];const color=getBeneficiaryColor(d.estadoInstalacion)||supplyColorScheme(d).fill;const payload=encodeURIComponent(JSON.stringify(d));const marker=L.circleMarker(pos,{radius:7,fillColor:color,color:'#fff',weight:2,opacity:1,fillOpacity:0.92}).addTo(group);marker.bindTooltip(`<b>${d.beneficiario}</b><br>${d.suministro}<br>${d.estadoInstalacion}`,{direction:'top',offset:[0,-8],className:'modern-tooltip'});marker.bindPopup(`<div style="font-family:Inter,sans-serif;font-size:12px;line-height:1.5"><b style="color:#38bdf8;font-size:13px">${d.beneficiario}</b><br><span style="color:#94a3b8">${d.suministro}</span><br><b>Estado:</b> <span style="color:${color}">${d.estadoInstalacion}</span><br><b>Empresa:</b> ${d.empresaInstaladora}<br><b>Monto pendiente:</b> ${formatMoney(d.montoPendiente||0)}<br><button onclick="closeBeneficiaryPanel();openBeneficiaryPanel(JSON.parse(decodeURIComponent('${payload}')));" style="margin-top:8px;border:none;background:linear-gradient(135deg,#0ea5e9,#22c55e);color:#fff;padding:6px 10px;border-radius:8px;cursor:pointer;font-weight:800">Ver detalle completo</button></div>`);marker.on('mouseover',function(){this.setStyle({radius:10,weight:3});});marker.on('mouseout',function(){this.setStyle({radius:7,weight:2});});marker.on('click',function(e){selectMapObject(d,e.target,e.originalEvent);});d._layer=marker;});return group;}
function syncUploadedMapLayersToLeaflet(){if(!leafletMap)return;uploadedMapLayers.forEach(function(item){if(!item.layer)return;if(item.visible){if(!leafletMap.hasLayer(item.layer))item.layer.addTo(leafletMap);}else if(leafletMap.hasLayer(item.layer))leafletMap.removeLayer(item.layer);});}
function updateOverlayVisibility(){if(!leafletMap)return;if(isBonogasMapContext()){clearProyectosBeneficiaryOverlays();syncUploadedMapLayersToLeaflet();if(typeof window.ensureBonogasMapLayer==='function')window.ensureBonogasMapLayer();updateActiveLayerLabel();return;}[coberturaLayer,troncalLayer,ramalesLayer,concesionariaLayer,districtLayer,selectedDistrictLayer,morosityLayer,estratoLayer,beneficiaryLayer,...Object.values(moduleThematicLayers||{})].forEach(layer=>{if(layer&&leafletMap.hasLayer(layer))leafletMap.removeLayer(layer)});const coberturaOn=qs('#layerCobertura')?.checked??true;const troncalOn=qs('#layerTroncal')?.checked??true;const ramalesOn=qs('#layerRamales')?.checked??true;const concesionariaOn=qs('#layerConcesionaria')?.checked??true;const distritosOn=qs('#layerDistritos')?.checked??false;const morosidadOn=qs('#layerMorosidad')?.checked??false;const estratoOn=qs('#layerEstrato')?.checked??true;const beneficiaryStates=getBeneficiaryLayerStates();const beneficiariesOn=beneficiaryStates.liquidados||beneficiaryStates.pendientes||beneficiaryStates.dentro||beneficiaryStates.fuera;const p=currentProject();if(coberturaLayer&&coberturaOn)coberturaLayer.addTo(leafletMap);if(troncalLayer&&troncalOn)troncalLayer.addTo(leafletMap);if(ramalesLayer&&ramalesOn)ramalesLayer.addTo(leafletMap);if(concesionariaLayer&&concesionariaOn)concesionariaLayer.addTo(leafletMap);if(districtLayer&&distritosOn)districtLayer.addTo(leafletMap);if(selectedDistrictLayer&&selectedDistrictId&&distritosOn)selectedDistrictLayer.addTo(leafletMap);if(estratoLayer&&estratoOn)estratoLayer.addTo(leafletMap);if(beneficiariesOn&&p){const benCount=Math.min(38,Math.max(16,Math.round((p.beneficiarios||24)/6)));beneficiaryLayer=buildBeneficiaries(p.lat,p.lng,benCount,p);lastSyncedProjectId=p.id;if(beneficiaryLayer)beneficiaryLayer.addTo(leafletMap);}if(morosityLayer&&morosidadOn)morosityLayer.addTo(leafletMap);const thematicBindings={layerThemeValeDensity:'vale',layerThemeGnvConsumption:'gnv',layerThemePhotovoltaic:'photovoltaic',layerThemeMasification:'masification',layerThemeElectricity:'electricity',layerThemeMcter:'mcter'};Object.entries(thematicBindings).forEach(([id,key])=>{const layer=moduleThematicLayers[key];if(layer&&qs('#'+id)?.checked)layer.addTo(leafletMap);});qs('#morosityLegend')?.classList.toggle('open',!!morosidadOn);syncUploadedMapLayersToLeaflet();if(projectMarker&&p){projectMarker.setLatLng([p.lat,p.lng]);if(!leafletMap.hasLayer(projectMarker))projectMarker.addTo(leafletMap);}updateActiveLayerLabel();}
function updateActiveLayerLabel(){const label=qs('#activeLayerLabel');if(!label)return;const baseLabels={osm:'OpenStreetMap',dark:'Carto Dark',sat:'Satélite'};const active=[];const coberturaOn=qs('#layerCobertura')?.checked??true;const troncalOn=qs('#layerTroncal')?.checked??true;const ramalesOn=qs('#layerRamales')?.checked??true;const concesionariaOn=qs('#layerConcesionaria')?.checked??true;const morosidadOn=qs('#layerMorosidad')?.checked??false;const estratoOn=qs('#layerEstrato')?.checked??true;const beneficiaryStates=getBeneficiaryLayerStates();const distritosOn=qs('#layerDistritos')?.checked??false;if(estratoOn)active.push('Estrato INEI');if(beneficiaryStates.liquidados)active.push('Habilitados liquidados');if(beneficiaryStates.pendientes)active.push('Pendientes de liquidación');if(beneficiaryStates.dentro)active.push('Construcción dentro de plazo');if(beneficiaryStates.fuera)active.push('Construcción fuera de plazo');if(coberturaOn)active.push('Cobertura');if(troncalOn)active.push('Troncal');if(ramalesOn)active.push('Ramales');if(concesionariaOn)active.push('Redes por concesionaria');if(distritosOn)active.push(selectedDistrictId?'Distrito: '+districtNameById(selectedDistrictId):'Distritos delimitados');if(morosidadOn)active.push('Temático: mapa de morosidad');label.textContent='Base: '+baseLabels[activeBase]+' · '+active.slice(0,3).join(' · ')+(active.length>3?' · +'+(active.length-3)+' más':'');}
function toggleValidationExportMenu(force){const wrapper=qs('#valExportDropdown');if(!wrapper)return;wrapper.classList.toggle('open',typeof force==='boolean'?force:!wrapper.classList.contains('open'));}
function toggleGnvValidationExportMenu(force){const wrapper=qs('#gnvValExportDropdown');if(!wrapper)return;wrapper.classList.toggle('open',typeof force==='boolean'?force:!wrapper.classList.contains('open'));}
document.addEventListener('click',function(e){if(e.target.closest('#gnvValExportBtn')){e.preventDefault();e.stopPropagation();toggleGnvValidationExportMenu();return;}const gnvFmt=e.target.closest('#gnvValidacionesEnv [data-export-format]');if(gnvFmt){exportValidationByFormat(gnvFmt.dataset.exportFormat);toggleGnvValidationExportMenu(false);return;}if(!e.target.closest('#gnvValExportDropdown'))toggleGnvValidationExportMenu(false);},true);
async function exportValidationByFormat(format){
  const rows=getCurrentValidationExportRows();
  if(!rows.length){showToast('No hay expedientes para exportar');return;}
  try{
    if(format==='xlsx')await exportBrandedValidationXlsx(rows,true);
    else if(format==='csv')exportBrandedValidationCsv(rows,true);
    else if(format==='pdf')await exportBrandedValidationPdf(rows,true);
    else{showToast('Formato de exportación no compatible');return;}
    showToast(`Reporte ${format.toUpperCase()} descargado con ${rows.length} expedientes y cabecera FISE · Paulet`);
  }catch(error){console.error('Error al exportar validaciones',error);showToast('No se pudo generar la exportación');}
  toggleValidationExportMenu(false);
}
function openHospitalEnvironment(){
  // Módulo hospitalario deshabilitado por petición del usuario
  showToast('Módulo hospitalario deshabilitado');
  return;
}
async function loadIntegratedModuleSources(){
  await loadShellModules();
  for (const id of Object.keys(window.__MODULE_PATHS || {})) {
    if (!window.__moduleCache[id]) {
      try { await fetchModuleHtml(id); } catch (e) { console.warn('Modulo', id, e); }
    }
  }
  const valeFrame=qs('#valeFiseFrame');
  const gnvFrame=qs('#ahorroGnvFrame');
  const fotoFrame=qs('#fotovoltaicoFrame');
  const elecFrame=qs('#electricidadFrame');
  const masFrame=qs('#masificacionFrame');
  const mcterFrame=qs('#mcterFrame');

  function collectSatPanelToggleCss(){
    const chunks=[];
    const isToggleRule=selector=>String(selector||'').split(',').some(sel=>{
      const s=sel.trim();
      return s==='.sat-panel-toggle'||s==='.sat-panel-toggle:hover'||s==='.sat-panel-toggle::before'||
        s==='.sat-left-toggle'||s==='.sat-left-toggle::before'||s==='.sat-right-toggle'||s==='.sat-right-toggle::before'||
        s==='.content.left-hidden .sat-left-toggle'||s==='.content.left-hidden .sat-left-toggle::before'||
        s==='.content.right-hidden .sat-right-toggle'||s==='.content.right-hidden .sat-right-toggle::before';
    });
    const visitRules=rules=>{
      Array.from(rules||[]).forEach(rule=>{
        if(rule.selectorText&&isToggleRule(rule.selectorText)){
          chunks.push(rule.cssText);
        }else if(rule.cssRules){
          const nested=[];
          Array.from(rule.cssRules||[]).forEach(child=>{
            if(child.selectorText&&isToggleRule(child.selectorText))nested.push(child.cssText);
          });
          if(nested.length&&rule.conditionText)chunks.push('@media '+rule.conditionText+'{'+nested.join('\n')+'}');
        }
      });
    };
    Array.from(document.styleSheets||[]).forEach(sheet=>{
      let rules;
      try{rules=sheet.cssRules;}catch(err){return;}
      visitRules(rules);
    });
    return chunks.join('\n');
  }

  function contentHasLeftPanel(html){
    return /<aside[^>]*\bleft-panel\b/i.test(html||'');
  }
  function contentHasInfoPanel(html){
    return /<aside[^>]*\b(?:info-panel|right-panel)\b/i.test(html||'');
  }
  function stripLegacySatPanelToggles(html){
    if(!html)return html;
    return html
      .replace(/<button[^>]*\bid="toggleProjectsBtn2"[^>]*>[\s\S]*?<\/button>/gi,'')
      .replace(/<button[^>]*\bid="toggleInfoBtn2"[^>]*>[\s\S]*?<\/button>/gi,'')
      .replace(/<button class="sat-panel-toggle sat-left-toggle" id="toggleProjectsMapBtn"[^>]*><\/button>/gi,'')
      .replace(/<button class="sat-panel-toggle sat-right-toggle" id="toggleInfoMapBtn"[^>]*><\/button>/gi,'');
  }
  function ensureSatPanelTogglesAtContent(html,isValeFise){
    if(!html||!html.includes('<section class="content">'))return html;
    let output=stripLegacySatPanelToggles(html);
    if(isValeFise)return output;
    const hasLeft=contentHasLeftPanel(output);
    const hasRight=contentHasInfoPanel(output);
    let inject='';
    if(hasLeft)inject+='<button class="sat-panel-toggle sat-left-toggle" id="toggleProjectsMapBtn" type="button" title="Ocultar agrupaciones" aria-label="Ocultar agrupaciones"></button>';
    if(hasRight)inject+='<button class="sat-panel-toggle sat-right-toggle" id="toggleInfoMapBtn" type="button" title="Ocultar panel derecho" aria-label="Ocultar panel derecho"></button>';
    if(inject)output=output.replace('<section class="content">','<section class="content">'+inject);
    return output;
  }

  function isValeFiseIntegratedHtml(html){
    if(!html)return false;
    const contentChunk=(html.split('<section class="content">')[1]||'').split('</section>')[0]||'';
    return /VALE FISE|fise-dashboard-env|fise-detail-panel/i.test(html)&&!/<aside class="left-panel"/.test(contentChunk);
  }

  function getValeFiseSatcontrolLayoutCss(){
    return 'html,body{height:100%!important;margin:0!important;overflow:hidden!important}'+
      '.app>.sidebar{display:none!important}.app{grid-template-columns:1fr!important;height:100vh!important}'+
      '.main{grid-template-rows:1fr!important;height:100vh!important;min-height:0!important;overflow:hidden!important}'+
      '.main>.topbar{display:none!important}'+
      'section.content,.content{display:none!important;visibility:hidden!important;height:0!important;max-height:0!important;overflow:hidden!important;pointer-events:none!important;position:absolute!important;inset:auto!important;left:-9999px!important;width:0!important}'+
      '.fise-dashboard-env{display:block!important;height:100vh!important;max-height:100vh!important;min-height:0!important;padding:18px!important;box-sizing:border-box!important;overflow:hidden!important}'+
      '#toggleProjectsMapBtn,#toggleInfoMapBtn,.sat-left-toggle,.sat-right-toggle{display:none!important}';
  }

  function getIntegratedSatPanelToggleBaseCss(){
    return '.sat-panel-toggle{position:absolute!important;top:50%!important;z-index:1200!important;width:40px!important;height:58px!important;border-radius:10px!important;border:1px solid rgba(34,211,238,.34)!important;background:rgba(7,16,35,.90)!important;color:#a5f3fc!important;display:grid!important;place-items:center!important;box-shadow:0 16px 40px rgba(0,0,0,.34)!important;backdrop-filter:blur(12px)!important;cursor:pointer!important;transform:translateY(-50%)!important;pointer-events:auto!important;transition:left .25s ease,right .25s ease,background .18s ease,border-color .18s ease,transform .18s ease!important}'+
      '.sat-panel-toggle:hover{background:#10213f!important;border-color:rgba(103,232,249,.72)!important;transform:translateY(-50%) scale(1.03)!important}'+
      '.sat-panel-toggle::before{content:""!important;width:11px!important;height:11px!important;border-top:3px solid currentColor!important;border-right:3px solid currentColor!important}'+
      '.sat-left-toggle::before{transform:rotate(225deg)!important}'+
      '.sat-right-toggle::before{transform:rotate(45deg)!important}'+
      '.content.left-hidden .sat-left-toggle{background:rgba(14,165,233,.92)!important;color:#fff!important;border-color:rgba(255,255,255,.35)!important}'+
      '.content.left-hidden .sat-left-toggle::before{transform:rotate(45deg)!important}'+
      '.content.right-hidden .sat-right-toggle{background:rgba(14,165,233,.92)!important;color:#fff!important;border-color:rgba(255,255,255,.35)!important}'+
      '.content.right-hidden .sat-right-toggle::before{transform:rotate(225deg)!important}';
  }

  function getIntegratedPanelCollapseCss(){
    return '.content.left-hidden .left-panel,.content.left-hidden .card.left-panel{width:0!important;min-width:0!important;max-width:0!important;padding:0!important;margin:0!important;opacity:0!important;visibility:hidden!important;border:0!important;overflow:hidden!important;pointer-events:none!important}'+
      '.content.right-hidden .info-panel,.content.right-hidden .right-panel,.content.right-hidden .card.right-panel{width:0!important;min-width:0!important;max-width:0!important;padding:0!important;margin:0!important;opacity:0!important;visibility:hidden!important;border:0!important;overflow:hidden!important;pointer-events:none!important}'+
      '.content.left-hidden .left-panel *,.content.right-hidden .info-panel *,.content.right-hidden .right-panel *{visibility:hidden!important;pointer-events:none!important}';
  }

  function getIntegratedNativeToggleHideCss(){
    return '#hideLeftPanelBtn,#hideRightPanelBtn,#showLeftPanelBtn,#showRightPanelBtn,.map-side-toggle,.left-panel .toggle-btn,.right-panel .toggle-btn,.title-box .right-hide-btn{display:none!important;visibility:hidden!important;pointer-events:none!important}';
  }

  function getSatcontrolPanelCreateBtnCss(){
    return '.satcontrol-panel-create-btn,.left-panel .panel-head .btn.satcontrol-panel-create-btn,.left-panel .panel-head #createBtn.btn,.left-panel #createBtn.satcontrol-panel-create-btn{'+
      'border:0!important;border-radius:12px!important;padding:12px 15px!important;font-size:12px!important;font-weight:950!important;color:#fff!important;'+
      'background:linear-gradient(135deg,#0ea5e9,#22c55e)!important;box-shadow:0 6px 16px rgba(14,165,233,.25)!important;'+
      'transition:all .2s ease!important;line-height:1.2!important;white-space:nowrap!important;font-family:Inter,Segoe UI,Arial,sans-serif!important;'+
      'letter-spacing:normal!important;text-transform:none!important;cursor:pointer!important}'+
      '.satcontrol-panel-create-btn:hover,.left-panel .panel-head .btn.satcontrol-panel-create-btn:hover,.left-panel .panel-head #createBtn.btn:hover,.left-panel #createBtn.satcontrol-panel-create-btn:hover{'+
      'transform:translateY(-1px)!important;filter:brightness(1.08)!important;box-shadow:0 8px 22px rgba(34,211,238,.28)!important}';
  }

  function getIntegratedSatcontrolLayoutCss(){
    return getIntegratedSatPanelToggleBaseCss()+getIntegratedPanelCollapseCss()+getIntegratedNativeToggleHideCss()+
      'html,body{height:100%!important;margin:0!important;overflow:hidden!important}'+
      ':root{--sat-bg:#11172f;--sat-top:#1c223b;--sat-panel:#1a223d;--sat-card:#2c3967;--sat-border:#32426b;--sat-text:#f7f9ff;--sat-muted:#aebbd3;--sat-cyan:#56c1f2}'+
      'body,.app,.main,#root{background:var(--sat-bg)!important;color:var(--sat-text)!important}'+
      '.app>.sidebar{display:none!important}.app{grid-template-columns:1fr!important;height:100vh!important}'+
      '.main{grid-template-rows:0 1fr!important;height:100vh!important;min-height:0!important;overflow:hidden!important}'+
      '.main>.topbar{display:none!important}'+
      '.content{position:relative!important;display:grid!important;height:100vh!important;max-height:100vh!important;min-height:0!important;'+
      'grid-template-columns:320px minmax(0,1fr) 380px!important;gap:18px!important;padding:18px!important;overflow:hidden!important;background:var(--sat-bg)!important;'+
      'transition:grid-template-columns .25s ease,gap .25s ease,padding .25s ease!important}'+
      '.content.left-hidden{grid-template-columns:0 minmax(0,1fr) 380px!important}'+
      '.content.right-hidden{grid-template-columns:320px minmax(0,1fr) 0!important}'+
      '.content.left-hidden.right-hidden{grid-template-columns:1fr!important;gap:0!important;padding:12px!important}'+
      '.content.left-hidden.right-hidden .left-panel,.content.left-hidden.right-hidden .right-panel,.content.left-hidden.right-hidden .card.left-panel,.content.left-hidden.right-hidden .card.right-panel{display:none!important}'+
      '.content.left-hidden.right-hidden .map-wrap{grid-column:1!important;grid-row:1!important;width:100%!important;min-width:0!important}'+
      '.panel-collapse-btn{display:none!important;visibility:hidden!important;pointer-events:none!important}'+
      '.sat-left-toggle{left:calc(18px + 320px - 10px)!important}'+
      '.sat-right-toggle{right:calc(18px + 380px - 10px)!important}'+
      '.content.left-hidden .sat-left-toggle{left:12px!important}'+
      '.content.right-hidden .sat-right-toggle{right:12px!important}'+
      '.map-wrap,.map-shell{min-height:0!important;height:100%!important;width:100%!important;min-width:0!important}'+
      '.map-shell{border-radius:20px!important;border-color:#35466f!important;background:#0e152c!important;box-shadow:none!important;outline:1px solid rgba(70,91,145,.35)!important}'+
      '.left-panel,.info-panel,.right-panel,.card.left-panel,.card.right-panel{border-radius:18px!important;min-height:0!important;background:var(--sat-panel)!important;border:1px solid var(--sat-border)!important;box-shadow:none!important;color:var(--sat-text)!important}'+
      '.mini,.story,.kpi,.summary-kpi,.summary-total,.photo-wrap,.thumb-card,.details-grid,.circle-config,.mcter-density-legend,.elec-density-legend{background:#151b34!important;border-color:#34436d!important;color:var(--sat-text)!important}'+
      '.project-card{background:var(--sat-card)!important;border:1px solid transparent!important;border-radius:14px!important;box-shadow:none!important;color:#eaf0ff!important}'+
      '.project-card:hover,.project-card.selected{background:#334274!important;border-color:rgba(96,130,204,.42)!important;transform:none!important;box-shadow:none!important}'+
      '.panel-head h2,.info-title h2,.title-box h2,.mini h3,.story b{color:#fff!important}.panel-head p,.info-title p,.story span,.mini p,.detail-row span,.kpi span,.summary-kpi span{color:var(--sat-muted)!important}'+
      '.search input,.search select,.panel-head select,.circle-config input,.circle-config select{background:#151b34!important;border:1px solid #34436d!important;border-radius:14px!important;color:#f8fbff!important}'+
      '.btn.dark,.toggle-btn,.util-btn,.icon-btn{background:#151b34!important;border-color:#34436d!important;color:#eaf0ff!important}'+
      '.title-box{background:#151b34!important;border-color:rgba(86,193,242,.34)!important}'+
      '.masif-satcontrol-section,.masif-instant-shell{padding:18px!important;height:100vh!important;min-height:0!important;box-sizing:border-box!important;overflow:hidden!important;background:var(--sat-bg)!important}'+
      '.masif-satcontrol-grid,.masif-instant-grid{display:grid!important;grid-template-columns:320px minmax(480px,1fr) 380px!important;gap:18px!important;height:100%!important;min-height:0!important;align-items:stretch!important}'+
      '.masif-satcontrol-grid>aside,.masif-satcontrol-grid .masif-right-panel-shell>aside,.masif-instant-grid>aside,.masif-panel,.masif-left-panel,.masif-right-panel{background:var(--sat-panel)!important;border:1px solid var(--sat-border)!important;border-radius:18px!important;box-shadow:none!important;color:var(--sat-text)!important}'+
      '.masif-satcontrol-grid h1,.masif-satcontrol-grid h2,.masif-satcontrol-grid h3,.masif-instant-grid h1,.masif-instant-grid h2,.masif-instant-grid h3{color:#fff!important}'+
      '.masif-satcontrol-grid p,.masif-satcontrol-grid span,.masif-instant-grid p,.masif-instant-grid span{border-color:#34436d}'+
      '.masif-satcontrol-grid>aside{grid-column:1!important;grid-row:1!important}'+
      '.masif-satcontrol-grid .masif-map-shell{grid-column:2!important;grid-row:1!important;width:100%!important;max-width:none!important;min-width:0!important}'+
      '.masif-satcontrol-grid .masif-right-panel-shell{grid-column:3!important;grid-row:1!important;width:380px!important;max-width:380px!important;min-width:0!important}'+
      '.masif-satcontrol-grid .masif-right-panel-shell>aside{width:100%!important;max-width:100%!important}'+
      '.masif-satcontrol-grid.right-collapsed{grid-template-columns:320px minmax(480px,1fr)!important}'+
      '.masif-satcontrol-grid.left-collapsed{grid-template-columns:minmax(480px,1fr) 380px!important}'+
      '.masif-satcontrol-grid.left-collapsed.right-collapsed{grid-template-columns:minmax(480px,1fr)!important}'+
      '.masif-satcontrol-grid.left-collapsed>aside{display:none!important}'+
      '.masif-satcontrol-grid.left-collapsed .masif-map-shell{grid-column:1!important}'+
      '.masif-satcontrol-grid.right-collapsed .masif-right-panel-shell{display:none!important}'+
      '.masif-satcontrol-grid.right-collapsed:not(.left-collapsed) .masif-map-shell{grid-column:2!important}'+
      '.masif-satcontrol-grid.left-collapsed.right-collapsed .masif-map-shell{grid-column:1!important}'+
      '.masif-satcontrol-grid.left-collapsed:not(.right-collapsed) .masif-map-shell{grid-column:1!important}'+
      '.masif-satcontrol-grid.left-collapsed:not(.right-collapsed) .masif-right-panel-shell{grid-column:2!important;width:380px!important;max-width:380px!important}'+
      '.masif-panel-toggle{position:absolute!important;top:50%!important;z-index:3000!important;width:40px!important;height:58px!important;border-radius:10px!important;border:1px solid rgba(34,211,238,.34)!important;background:rgba(7,16,35,.90)!important;color:#a5f3fc!important;display:grid!important;place-items:center!important;box-shadow:0 16px 40px rgba(0,0,0,.34)!important;backdrop-filter:blur(12px)!important;cursor:pointer!important;transform:translateY(-50%)!important;pointer-events:auto!important;transition:left .25s ease,right .25s ease,background .18s ease,border-color .18s ease,transform .18s ease!important}'+
      '.masif-panel-toggle:hover{background:#10213f!important;border-color:rgba(103,232,249,.72)!important;transform:translateY(-50%) scale(1.03)!important}'+
      '.masif-panel-toggle::before{content:""!important;width:11px!important;height:11px!important;border-top:3px solid currentColor!important;border-right:3px solid currentColor!important}'+
      '.masif-left-toggle{left:300px!important}.masif-left-toggle::before{transform:rotate(225deg)!important}'+
      '.masif-right-toggle{right:360px!important}.masif-right-toggle::before{transform:rotate(45deg)!important}'+
      '.masif-satcontrol-grid.left-collapsed .masif-left-toggle{left:12px!important;background:rgba(14,165,233,.92)!important;color:#fff!important;border-color:rgba(255,255,255,.35)!important}'+
      '.masif-satcontrol-grid.left-collapsed .masif-left-toggle::before{transform:rotate(45deg)!important}'+
      '.masif-satcontrol-grid.right-collapsed .masif-right-toggle{right:12px!important;background:rgba(14,165,233,.92)!important;color:#fff!important;border-color:rgba(255,255,255,.35)!important}'+
      '.masif-satcontrol-grid.right-collapsed .masif-right-toggle::before{transform:rotate(225deg)!important}'+
      '.masif-map-shell,.masif-instant-map{min-height:0!important;height:100%!important;width:100%!important;border-radius:24px!important;overflow:hidden!important}'+
      '.masif-map-shell .leaflet-container,.masif-instant-map .leaflet-container{width:100%!important;height:100%!important}'+
      '.left-panel .panel-head{display:flex!important;justify-content:space-between!important;align-items:center!important;gap:12px!important;padding:17px!important;border-bottom:1px solid rgba(34,211,238,.14)!important;background:rgba(15,24,52,.82)!important}'+
      '.left-panel .panel-head h2{color:#fff!important;font-size:17px!important;font-weight:950!important;margin:0!important}'+
      '.left-panel .panel-head p{color:#9fb4d3!important;font-size:12px!important;font-weight:750!important;margin:3px 0 0!important}'+
      getSatcontrolPanelCreateBtnCss()+
      '@media(max-width:1180px){.content{grid-template-columns:minmax(240px,28%) minmax(0,1fr) minmax(280px,34%)!important}.content.left-hidden{grid-template-columns:0 minmax(0,1fr) minmax(280px,34%)!important}.content.right-hidden{grid-template-columns:minmax(240px,28%) minmax(0,1fr) 0!important}.content.left-hidden.right-hidden{grid-template-columns:1fr!important;gap:0!important;padding:12px!important}.content.left-hidden.right-hidden .left-panel,.content.left-hidden.right-hidden .right-panel,.content.left-hidden.right-hidden .card.left-panel,.content.left-hidden.right-hidden .card.right-panel{display:none!important}.content.left-hidden.right-hidden .map-wrap{grid-column:1!important;grid-row:1!important;width:100%!important;min-width:0!important}.info-panel,.right-panel,.left-panel{display:flex!important;min-width:0!important}.sat-left-toggle{left:calc(18px + 28% - 10px)!important}.sat-right-toggle{right:calc(18px + 34% - 10px)!important}.content.left-hidden .sat-left-toggle{left:12px!important}.content.right-hidden .sat-right-toggle{right:12px!important}}';
  }

  function openParentProjectModalFromFrame(frame,projectId){
    try{
      const parentWin=frame&&frame.ownerDocument&&frame.ownerDocument.defaultView?frame.ownerDocument.defaultView:window;
      if(parentWin&&typeof parentWin.openProjectModal==='function'){
        parentWin.openProjectModal(projectId||null);
        if(frame.id==='masificacionFrame'){
          const modal=parentWin.document&&parentWin.document.querySelector('#projectModal');
          if(modal){
            const walker=parentWin.document.createTreeWalker(modal,NodeFilter.SHOW_TEXT);
            const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
            nodes.forEach(function(node){node.nodeValue=node.nodeValue.replace(/agrupaciones/gi,'proyectos').replace(/agrupación/gi,'proyecto');});
          }
        }
        return true;
      }
    }catch(err){}
    return false;
  }
  function wireIntegratedFrameCreateProject(frame){
    if(!frame)return;
    try{
      const doc=frame.contentDocument;
      const win=frame.contentWindow;
      if(!doc||!win)return;
      const bindCreateBtn=function(btn,projectId){
        if(!btn||btn.dataset.parentCreateWired==='1')return;
        btn.dataset.parentCreateWired='1';
        btn.addEventListener('click',function(ev){
          ev.preventDefault();
          ev.stopPropagation();
          if(openParentProjectModalFromFrame(frame,projectId||null))return;
          if(typeof win.openProjectModal==='function')win.openProjectModal(projectId||null);
        },true);
      };
      bindCreateBtn(doc.querySelector('#createBtn'));
      doc.querySelectorAll('[data-edit]').forEach(function(btn){
        if(btn.dataset.parentCreateWired==='1')return;
        btn.dataset.parentCreateWired='1';
        btn.addEventListener('click',function(ev){
          ev.preventDefault();
          ev.stopPropagation();
          const id=btn.dataset.edit||null;
          if(openParentProjectModalFromFrame(frame,id))return;
          if(typeof win.openProjectModal==='function')win.openProjectModal(id);
        },true);
      });
      doc.querySelectorAll('button[title="Crear agrupación"],button[title="Crear proyecto"]').forEach(function(btn){
        if(btn.id==='createBtn')return;
        const label=(btn.textContent||'').trim();
        if(label.indexOf('Crear')<0&&label.indexOf('Nuevo agrupación')<0)return;
        bindCreateBtn(btn);
      });
    }catch(err){}
  }
  window.__wireIntegratedFrameCreateProject=wireIntegratedFrameCreateProject;

  function getFotoStatusToggleCss(){
    return '.details-grid{display:grid!important;gap:7px!important}'+
      '.detail-row{display:flex!important;justify-content:space-between!important;align-items:center!important;gap:12px!important;border-bottom:1px solid #ffffff12!important;padding-bottom:7px!important;font-size:11px!important;font-weight:850!important}'+
      '.detail-row:last-child{border-bottom:0!important;padding-bottom:0!important}'+
      '.detail-row span{color:#93a4c7!important;flex-shrink:0!important}'+
      '.detail-row b{text-align:right!important;color:#fff!important}'+
      'button.foto-status-toggle-btn,.detail-row .foto-status-toggle-btn{display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:6px!important;border-radius:999px!important;padding:7px 14px!important;font-size:10px!important;font-weight:950!important;cursor:pointer!important;font-family:inherit!important;margin-left:auto!important;flex-shrink:0!important;appearance:none!important;-webkit-appearance:none!important;line-height:1!important;min-width:92px!important;box-shadow:0 4px 14px rgba(0,0,0,.22)!important;transition:filter .15s ease,transform .15s ease!important}'+
      'button.foto-status-toggle-btn.ok,button.foto-status-toggle-btn.b-ok{background:#10b98144!important;color:#bbf7d0!important;border:1px solid #22c55e!important}'+
      'button.foto-status-toggle-btn.off,button.foto-status-toggle-btn.b-off{background:#ef444444!important;color:#fecaca!important;border:1px solid #ef4444!important}'+
      'button.foto-status-toggle-btn:hover{filter:brightness(1.12)!important;transform:translateY(-1px)!important}'+
      'button.foto-status-toggle-btn:active{transform:translateY(0)!important}';
  }

  function injectSatPanelToggleCss(html){
    if(!html)return html;
    const css=collectSatPanelToggleCss();
    const isValeFise=isValeFiseIntegratedHtml(html);
    const isFoto=/Programa Fotovoltaico|fotoStatusToggleBtn|SAT CONTROL - FOTOVOLTAICO/i.test(html||'');
    const layoutCss=isValeFise?getValeFiseSatcontrolLayoutCss():getIntegratedSatcontrolLayoutCss();
    const fotoCss=isFoto?getFotoStatusToggleCss():'';
    const typoEl=document.getElementById('satcontrol-typography-bonogas');
    const typo=typoEl?typoEl.textContent:'';
    const panelScript=isValeFise||isFoto?'':'<script id="integrated-sat-panel-toggle-script">(function(){function refreshMap(){setTimeout(function(){try{if(typeof window.resizeMapAfterLayout==="function")window.resizeMapAfterLayout();else{if(window.leafletMap&&window.leafletMap.invalidateSize)window.leafletMap.invalidateSize({pan:true});if(window.__fotoMap&&window.__fotoMap.invalidateSize)window.__fotoMap.invalidateSize();if(window.map&&window.map.invalidateSize)window.map.invalidateSize();}}catch(e){}},260)}function bindBtn(el,fn){if(!el||el.dataset.innerBound)return;el.dataset.innerBound="1";el.addEventListener("click",function(e){e.preventDefault();e.stopPropagation();fn()})}function bind(){var content=document.querySelector(".content");if(!content)return;window.toggleProjects=function(){content.classList.toggle("left-hidden");if(typeof window.updateCollapseIcons==="function")window.updateCollapseIcons();refreshMap()};window.toggleInfo=function(){content.classList.toggle("right-hidden");if(typeof window.updateCollapseIcons==="function")window.updateCollapseIcons();refreshMap()};bindBtn(document.getElementById("toggleProjectsMapBtn"),window.toggleProjects);bindBtn(document.getElementById("toggleInfoMapBtn"),window.toggleInfo)}if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",bind);else bind();window.addEventListener("load",bind);setTimeout(bind,120);setTimeout(bind,480);})();<\/script>';
    const tag='<style id="integrated-sat-panel-toggle-style">'+css+'<\/style>'+
      '<style id="integrated-satcontrol-layout">'+layoutCss+'<\/style>'+
      (fotoCss?'<style id="integrated-foto-status-toggle">'+fotoCss+'<\/style>':'')+
      (typo?'<style id="integrated-sat-typography">'+typo+'<\/style>':'')+
      panelScript;
    let output=html.indexOf('</head>')!==-1?html.replace('</head>',tag+'</head>'):tag+html;
    output=ensureSatPanelTogglesAtContent(output,isValeFise);
    return output;
  }
  window.__injectSatPanelToggleCss=injectSatPanelToggleCss;

  function injectTypographyIntoFrame(frame){
    if(!frame)return;
    const apply=()=>{
      try{
        const doc=frame.contentDocument;
        if(!doc||!doc.head)return;
        const typoEl=document.getElementById('satcontrol-typography-bonogas');
        if(!typoEl)return;
        let style=doc.getElementById('integrated-sat-typography');
        if(!style){
          style=doc.createElement('style');
          style.id='integrated-sat-typography';
          doc.head.appendChild(style);
        }
        style.textContent=typoEl.textContent;
      }catch(err){}
    };
    if(!frame.dataset.typoBound){
      frame.dataset.typoBound='1';
      frame.addEventListener('load',apply);
    }
    apply();
  }
  window.__injectTypographyIntoFrame=injectTypographyIntoFrame;

  function wireGnvMorosityDetailBtn(frame){
    if(!frame)return;
    try{
      const doc=frame.contentDocument;
      doc?.querySelectorAll('.gnv-morosity-detail-btn').forEach(function(btn){
        if(btn.dataset.morWired==='1')return;
        btn.dataset.morWired='1';
        btn.addEventListener('click',function(ev){
          ev.preventDefault();
          if(typeof window.openGnvMorosityModal==='function')window.openGnvMorosityModal();
        });
      });
    }catch(err){}
  }
  function wireGnvReportsUtilBtn(frame){
    if(!frame)return;
    try{
      const doc=frame.contentDocument;
      doc?.querySelectorAll('.utility[title*="Informes técnicos"]').forEach(function(btn){
        if(btn.dataset.gnvInfWired==='1')return;
        btn.dataset.gnvInfWired='1';
        btn.addEventListener('click',function(ev){
          ev.preventDefault();
          if(typeof window.openGnvInformeTecnicoModal==='function')window.openGnvInformeTecnicoModal();
        });
      });
      const docsBtn=doc?.querySelector('#docsBtn');
      if(docsBtn&&!docsBtn.dataset.gnvDocsWired){
        docsBtn.dataset.gnvDocsWired='1';
        docsBtn.addEventListener('click',function(ev){
          ev.preventDefault();
          if(typeof window.openGnvDocumentosGuardadosModal==='function')window.openGnvDocumentosGuardadosModal();
          else if(typeof window.openGnvInformeTecnicoModal==='function')window.openGnvInformeTecnicoModal();
        });
      }
    }catch(err){}
  }
  function wireIntegratedFramePanelToggles(frame){
    if(!frame)return;
    try{
      const win=frame.contentWindow;
      const doc=frame.contentDocument;
      if(!win||!doc)return;
      const content=doc.querySelector('.content');
      if(!content||content.dataset.integratedToggleBound==='1'||content.dataset.fotoSatToggleBound==='1')return;
      content.dataset.integratedToggleBound='1';
      const refresh=()=>{
        if(typeof win.resizeMapAfterLayout==='function')win.resizeMapAfterLayout();
        else [80,280,520].forEach(ms=>setTimeout(()=>{try{win.leafletMap?.invalidateSize?.({animate:false});win.__fotoMap?.invalidateSize?.();win.map?.invalidateSize?.({animate:false});}catch(err){}},ms));
      };
      win.toggleProjects=function(){
        content.classList.toggle('left-hidden');
        if(typeof win.updateCollapseIcons==='function')win.updateCollapseIcons();
        refresh();
        if(typeof win.resizeMapAfterLayout==='function')win.resizeMapAfterLayout();
      };
      win.toggleInfo=function(){
        content.classList.toggle('right-hidden');
        if(typeof win.updateCollapseIcons==='function')win.updateCollapseIcons();
        refresh();
        if(typeof win.resizeMapAfterLayout==='function')win.resizeMapAfterLayout();
      };
      content.addEventListener('click',function(e){
        if(e.target.closest('#toggleProjectsMapBtn,.sat-left-toggle')){
          e.preventDefault();
          e.stopPropagation();
          win.toggleProjects();
          return;
        }
        if(e.target.closest('#toggleInfoMapBtn,.sat-right-toggle')){
          e.preventDefault();
          e.stopPropagation();
          win.toggleInfo();
          return;
        }
      },true);
    }catch(err){}
  }
  function refreshIntegratedFrameMap(frame,extra){
    if(!frame)return;
    const refresh=()=>{
      const win=frame.contentWindow;
      if(!win)return;
      wireIntegratedFramePanelToggles(frame);
      wireIntegratedFrameCreateProject(frame);
      if(typeof extra==='function')extra(frame);
      setTimeout(()=>{try{win.leafletMap?.invalidateSize?.();win.updateOverlayVisibility?.();win.renderAll?.();}catch(err){}},120);
      setTimeout(()=>{try{win.leafletMap?.invalidateSize?.();win.updateOverlayVisibility?.();}catch(err){}},420);
      setTimeout(()=>wireIntegratedFrameCreateProject(frame),600);
      setTimeout(()=>wireIntegratedFrameCreateProject(frame),1600);
    };
    frame.addEventListener('load',refresh,{once:true});
    refresh();
    injectTypographyIntoFrame(frame);
  }
  function refreshGnvFrameMap(frame){
    if(!frame)return;
    const refresh=()=>{
      const win=frame.contentWindow;
      if(!win)return;
      try{
        wireIntegratedFramePanelToggles(frame);
        wireGnvMorosityDetailBtn(frame);
        wireGnvReportsUtilBtn(frame);
        wireIntegratedFrameCreateProject(frame);
      }catch(err){}
      setTimeout(()=>{try{win.leafletMap?.invalidateSize?.();win.updateOverlayVisibility?.();win.renderAll?.();if(typeof win.resizeMapAfterLayout==='function')win.resizeMapAfterLayout();}catch(err){}},120);
      setTimeout(()=>{try{win.leafletMap?.invalidateSize?.();win.updateOverlayVisibility?.();if(typeof win.resizeMapAfterLayout==='function')win.resizeMapAfterLayout();}catch(err){}},420);
      setTimeout(()=>wireIntegratedFramePanelToggles(frame),480);
      setTimeout(()=>wireIntegratedFrameCreateProject(frame),600);
      setTimeout(()=>wireIntegratedFrameCreateProject(frame),1600);
    };
    frame.addEventListener('load',refresh,{once:true});
    refresh();
    injectTypographyIntoFrame(frame);
  }
  window.__refreshGnvFrameMap=refreshGnvFrameMap;
  function refreshMasificacionFrameMap(frame){
    if(!frame)return;
    const refresh=()=>{
      const win=frame.contentWindow;
      if(!win)return;
      wireIntegratedFramePanelToggles(frame);
      setTimeout(()=>{try{if(typeof win.resizeMapAfterLayout==='function')win.resizeMapAfterLayout();else if(typeof win.__masifRefitMap==='function')win.__masifRefitMap();}catch(err){}},120);
      setTimeout(()=>{try{if(typeof win.__masifRefitMap==='function')win.__masifRefitMap();}catch(err){}},480);
      setTimeout(()=>{try{if(typeof win.__masifRefitMap==='function')win.__masifRefitMap();}catch(err){}},1000);
    };
    frame.addEventListener('load',refresh,{once:true});
    refresh();
    injectTypographyIntoFrame(frame);
  }
  window.__refreshMasificacionFrameMap=refreshMasificacionFrameMap;
  window.__refreshIntegratedFrameMap=refreshIntegratedFrameMap;

  function refreshFotoFrame(frame){
    if(!frame)return;
    const refresh=()=>{
      try{
        const win=frame.contentWindow;
        if(typeof win?.bindFotoSatPanelToggles==='function')win.bindFotoSatPanelToggles();
        win?.__fotoMap?.invalidateSize?.();
      }catch(err){}
    };
    frame.addEventListener('load',refresh,{once:true});
    refresh();
    setTimeout(refresh,120);
    setTimeout(refresh,480);
    setTimeout(refresh,1200);
  }
  window.__refreshFotoFrame=refreshFotoFrame;
  window.__wireIntegratedFramePanelToggles=wireIntegratedFramePanelToggles;

  function alignValeFisePanel(){
    if(!valeFrame)return;
    const doc=valeFrame.contentDocument;
    if(!doc)return;
    const panel=doc.querySelector('.fise-detail-panel');
    const mapWrap=doc.querySelector('.fise-map-wrap');
    const mapGrid=doc.querySelector('.fise-dashboard-grid');
    const kpiGrid=doc.querySelector('#fiseKpiGrid')||doc.querySelector('.fise-kpi-grid');
    const shell=doc.querySelector('.fise-dashboard-shell');
    if(!panel||!mapWrap||!shell)return;

    let style=doc.getElementById('vale-fise-panel-sync-style');
    if(!style){
      style=doc.createElement('style');
      style.id='vale-fise-panel-sync-style';
      doc.head.appendChild(style);
    }

    const measure=()=>{
      const win=valeFrame.contentWindow;
      if(win&&typeof win.fiseComputeFillLayout==='function'){
        const layout=win.fiseComputeFillLayout();
        if(layout)return layout;
      }
      const mapH=Math.max(mapGrid?.offsetHeight||0,mapWrap.offsetHeight||0,430);
      const kpiH=kpiGrid?.offsetHeight||0;
      const rowGap=parseFloat(getComputedStyle(shell).rowGap||getComputedStyle(shell).gap||'12');
      return {mapH,blockH:Math.max(kpiH+rowGap+mapH,mapH),kpiH,rowGap};
    };

    const syncLayout=()=>{
      const layout=measure();
      const blockHeight=layout.blockH;
      const mapH=layout.mapH;
      let toggleTop='50%';
      if(kpiGrid){
        const kpiRect=kpiGrid.getBoundingClientRect();
        toggleTop=(kpiRect.top+blockHeight/2)+'px';
      }
      style.textContent=collectSatPanelToggleCss()+'\n'+
        'section.content,.content{display:none!important;visibility:hidden!important;height:0!important;overflow:hidden!important;pointer-events:none!important}'+
        '.fise-dashboard-env{display:block!important;height:100vh!important;max-height:100vh!important;min-height:0!important;overflow:hidden!important}'+
        '.fise-dashboard-shell{position:relative!important;align-items:stretch!important;grid-template-rows:auto minmax(320px,1fr)!important;min-height:calc(100vh - 24px)!important}'+
        '.fise-dashboard-shell > *:not(.fise-detail-panel):not(.fise-panel-toggle){grid-column:1!important}'+
        '.fise-kpi-grid{align-self:stretch!important}'+
        '.fise-dashboard-grid{align-self:stretch!important;width:100%!important;min-width:0!important;min-height:'+mapH+'px!important;display:grid!important;grid-template-columns:1fr!important;grid-template-rows:1fr!important;gap:12px!important}'+
        '.fise-dashboard-grid .fise-card.span-3{grid-column:1 / -1!important;width:100%!important;min-width:0!important;align-self:stretch!important;flex:1!important;min-height:'+mapH+'px!important;height:'+mapH+'px!important;display:flex!important;flex-direction:column!important}'+
        '.fise-map-wrap{width:100%!important;min-width:0!important;flex:1!important;min-height:320px!important;height:'+mapH+'px!important;max-height:none!important;position:relative!important}'+
        '.fise-map-wrap .map,.fise-map-wrap #fiseMap,.fise-map-wrap .leaflet-container{width:100%!important;height:100%!important;min-height:320px!important}'+
        '.fise-detail-panel{grid-column:2!important;grid-row:1 / 3!important;align-self:stretch!important;position:relative!important;top:auto!important;height:'+blockHeight+'px!important;max-height:'+blockHeight+'px!important;min-height:0!important;overflow-y:auto!important;overflow-x:hidden!important}'+
        '.fise-panel-toggle{position:fixed!important;grid-column:2!important;grid-row:1 / 3!important;top:'+toggleTop+'!important;right:calc(clamp(400px,29vw,500px) + 26px)!important;transform:translateY(-50%)!important;width:0!important;height:0!important;overflow:visible!important}'+
        '.fise-panel-toggle.closed{right:24px!important}'+
        '.fise-panel-toggle.closed::before{transform:rotate(225deg)!important}'+
        '@media (max-width:1280px){.fise-panel-toggle{right:424px!important}}'+
        '@media (max-width:1024px){.fise-panel-toggle{right:380px!important}.fise-panel-toggle.closed{right:16px!important}}'+
        '@media (max-width:720px){.fise-detail-panel{height:auto!important;max-height:min(72vh,calc(100vh - 80px))!important}.fise-map-wrap{height:min(52vh,480px)!important}.fise-panel-toggle{right:16px!important;top:50%!important;bottom:auto!important;transform:translateY(-50%)!important}}';
      panel.style.removeProperty('top');
      try{
        const win=valeFrame.contentWindow;
        win?.fiseApplyLayoutHeights?.(layout);
        win?.fiseRefreshMapSize?.();
      }catch(e){}
    };

    syncLayout();
    valeFrame.contentWindow?.requestAnimationFrame(syncLayout);
    setTimeout(syncLayout,120);
    setTimeout(syncLayout,360);
    setTimeout(syncLayout,900);

    if(!valeFrame.dataset.fiseAligned){
      valeFrame.dataset.fiseAligned='true';
      window.addEventListener('resize',()=>setTimeout(syncLayout,60));
      try{
        const ro=new ResizeObserver(()=>syncLayout());
        ro.observe(mapWrap);
        if(mapGrid)ro.observe(mapGrid);
        if(kpiGrid)ro.observe(kpiGrid);
      }catch(e){}
    }
    try{valeFrame.contentWindow?.fiseSyncPanelToMap?.();}catch(e){}
  }
  window.__alignValeFisePanel=alignValeFisePanel;

  if(valeFrame&&valeFrame.dataset.loaded!=='revert-v6-vale'&&getModuleSource('vale-fise-source')){
    valeFrame.srcdoc=injectSatPanelToggleCss(getModuleSource('vale-fise-source'));
    valeFrame.dataset.loaded='revert-v6-vale';
    injectTypographyIntoFrame(valeFrame);
    valeFrame.addEventListener('load',()=>setTimeout(alignValeFisePanel,60),{once:true});
  }else if(valeFrame&&valeFrame.dataset.loaded){
    setTimeout(alignValeFisePanel,60);
  }

  if(gnvFrame&&gnvFrame.dataset.loaded!=='dashboard-filters-v1:graficas'&&getModuleSource('ahorro-gnv-source')){
    gnvFrame.srcdoc=injectSatPanelToggleCss(getModuleSource('ahorro-gnv-source'));
    gnvFrame.dataset.loaded='dashboard-filters-v1:graficas';
    refreshGnvFrameMap(gnvFrame);
    injectTypographyIntoFrame(gnvFrame);
  }
  var fotoCacheKey=window.__FOTO_MODULE_VERSION||'foto-status-toggle-v2';
  if(fotoFrame&&fotoFrame.dataset.loaded!==fotoCacheKey){
    delete window.__moduleCache['fotovoltaico-source'];
    try{
      await fetchModuleHtml('fotovoltaico-source');
      if(getModuleSource('fotovoltaico-source')){
        fotoFrame.srcdoc=injectSatPanelToggleCss(getModuleSource('fotovoltaico-source'));
        fotoFrame.dataset.loaded=fotoCacheKey;
        refreshFotoFrame(fotoFrame);
        injectTypographyIntoFrame(fotoFrame);
      }
    }catch(e){console.warn('Fotovoltaico',e);}
  }
  if(elecFrame&&elecFrame.dataset.loaded!=='elec-remove-selection-state-v1'&&getModuleSource('electricidad-source')){
    elecFrame.srcdoc=injectSatPanelToggleCss(getModuleSource('electricidad-source'));
    elecFrame.dataset.loaded='elec-remove-selection-state-v1';
    if(window.__refreshIntegratedFrameMap)window.__refreshIntegratedFrameMap(elecFrame);
    else injectTypographyIntoFrame(elecFrame);
  }
  if(masFrame&&getModuleSource('masificacion-satcontrol-source')){
    const masifBootCache='masif-potential-visible-v2:SATCONTROL';
    if(masFrame.dataset.loaded!==masifBootCache){
      masFrame.srcdoc=injectSatPanelToggleCss(getModuleSource('masificacion-satcontrol-source'));
      masFrame.dataset.loaded=masifBootCache;
    }
    if(window.__refreshMasificacionFrameMap)window.__refreshMasificacionFrameMap(masFrame);
    else if(window.__refreshGnvFrameMap)window.__refreshGnvFrameMap(masFrame);
  }
  if(mcterFrame&&mcterFrame.dataset.loaded!=='mcter-beneficiarios-v3'&&getModuleSource('mcter-source')){
    mcterFrame.srcdoc=injectSatPanelToggleCss(getModuleSource('mcter-source'));
    mcterFrame.dataset.loaded='mcter-beneficiarios-v3';
    injectTypographyIntoFrame(mcterFrame);
  }
}
(function preloadIntegratedModuleIframes(){
  function run(){try{loadIntegratedModuleSources().catch(function(e){console.warn(e);});}catch(e){}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});
  else run();
})();
function setActiveSidebarModule(id){qsa('.sidebar-nav .nav-link').forEach(link=>link.classList.remove('active'));qs('#'+id)?.classList.add('active')}
function hideProfileOverlay(){const ov=qs('#profileOverlay');if(ov)ov.style.display='none';const main=qs('.main');if(main)main.classList.remove('profile-mode');}
async function openIntegratedModule(moduleName,submodule){hideProfileOverlay();await loadIntegratedModuleSources();const modules={vale:{mode:'vale-fise-mode',nav:'navValeFise',name:'SATCONTROL · VALE FISE',subtitle:'Subsidio digital GLP, asignaciones mensuales, canjes y agentes autorizados',label:'#valeFiseModuleSubtitle'},gnv:{mode:'ahorro-gnv-mode',nav:'navAhorroGnv',name:'SATCONTROL · AHORRO GNV',subtitle:'Financiamiento, conversiones, talleres y control vehicular',label:'#ahorroGnvModuleSubtitle'},fotovoltaico:{mode:'fotovoltaico-mode',nav:'navFotovoltaico',name:'SATCONTROL · FOTOVOLTAICO',subtitle:'Programa Fotovoltaico, cobertura territorial, instalaciones y seguimiento operativo',label:'#fotovoltaicoModuleSubtitle'},electricidad:{mode:'electricidad-mode',nav:'navElectricidad',name:'SATCONTROL · ELECTRICIDAD AL TOQUE',subtitle:'Programa Electricidad al Toque, beneficiarios, conexiones, mapa operativo y control territorial',label:'#electricidadModuleSubtitle'},masificacion:{mode:'masificacion-mode',nav:'navMasificacionSatcontrol',name:'SATCONTROL · MASIFICACIÓN',subtitle:'Masificación de gas, agrupaciones, mapa operativo y seguimiento territorial',label:'#masificacionModuleSubtitle'},mcter:{mode:'mcter-mode',nav:'navMcter',name:'SATCONTROL · MCTER',subtitle:'Medición y compensación de energía eléctrica, mapa operativo y control territorial',label:'#mcterModuleSubtitle'}};const cfg=modules[moduleName]||modules.vale;const view=submodule||'SATCONTROL';if(moduleName==='gnv'){const frame=qs('#ahorroGnvFrame');const sourceId=view==='SATCONTROL'?'ahorro-gnv-satcontrol-source':'ahorro-gnv-source';await ensureModuleSource(sourceId);const rawSource=getModuleSource(sourceId);const source=window.__injectSatPanelToggleCss?window.__injectSatPanelToggleCss(rawSource):rawSource;const cacheKey='upload-label-v2:'+view;if(frame&&source){if(frame.dataset.loaded!==cacheKey){frame.srcdoc=source;frame.dataset.loaded=cacheKey}if(window.__refreshGnvFrameMap)window.__refreshGnvFrameMap(frame)}}if(moduleName==='masificacion'){const frame=qs('#masificacionFrame');const sourceId=view==='SATCONTROL'?'masificacion-satcontrol-source':'masificacion-source';await ensureModuleSource(sourceId);const rawSource=getModuleSource(sourceId);const source=window.__injectSatPanelToggleCss?window.__injectSatPanelToggleCss(rawSource):rawSource;const masifCache='masif-unified-bg-v1:'+view;if(frame&&source){if(frame.dataset.loaded!==masifCache){frame.srcdoc=source;frame.dataset.loaded=masifCache}if(window.__refreshMasificacionFrameMap)window.__refreshMasificacionFrameMap(frame);else if(window.__refreshGnvFrameMap)window.__refreshGnvFrameMap(frame)}}if(moduleName==='fotovoltaico'){const frame=qs('#fotovoltaicoFrame');if(frame&&window.__refreshFotoFrame)window.__refreshFotoFrame(frame)}const main=qs('.main');main?.classList.remove('requests-mode','validations-mode','hospital-mode','create-project-mode','project-list-mode','project-delete-mode','vale-fise-mode','ahorro-gnv-mode','fotovoltaico-mode','electricidad-mode','masificacion-mode','mcter-mode','bonogas-active','bonogas-satcontrol-mode','spa-mode','gnv-graficas-mode','gnv-satcontrol-mode');main?.classList.add(cfg.mode);if(main&&moduleName==='gnv')main.classList.add(view==='SATCONTROL'?'gnv-satcontrol-mode':'gnv-graficas-mode');const navId=moduleName==='gnv'?(view==='SATCONTROL'?'navAhorroGnvSatcontrol':'navAhorroGnv'):cfg.nav;setActiveSidebarModule(navId);const title=qs('.topbar h1'),sub=qs('.topbar p');if(title)title.textContent=cfg.name;if(sub){sub.textContent=cfg.subtitle;sub.style.display='';}const label=qs(cfg.label);if(label)label.textContent=view;qsa('[data-module-subnav="'+moduleName+'"] .subnav-child').forEach(btn=>btn.classList.toggle('active',btn.dataset.submodule===view));showToast(cfg.name+' abierto');if(typeof window.__prepareUtilsDocks==='function')window.__prepareUtilsDocks();document.querySelectorAll('.topbar #toolsBtn,.top-actions #toolsBtn').forEach(function(b){b.classList.remove('active');});setTimeout(()=>placeIntegratedModuleUtils(moduleName),120);setTimeout(()=>placeIntegratedModuleUtils(moduleName),420);if(moduleName==='vale'){const alignVale=()=>{if(typeof window.__alignValeFisePanel==='function')window.__alignValeFisePanel();try{qs('#valeFiseFrame')?.contentWindow?.fiseSyncPanelToMap?.();}catch(e){}};setTimeout(alignVale,180);setTimeout(alignVale,520);setTimeout(alignVale,980);}}
function openSatcontrolView(context){hideProfileOverlay();const cfg=Object.assign({title:'SATCONTROL AGRUPACIONES',sub:'Gestión territorial, documentos, liquidaciones y seguimiento operativo',nav:'navDashboard',toast:'SATCONTROL AGRUPACIONES'},context||{});const main=qs('.main');const content=qs('.content');const app=qs('.app');if(main)main.classList.remove('requests-mode','validations-mode','hospital-mode','vale-fise-mode','ahorro-gnv-mode','fotovoltaico-mode','electricidad-mode','masificacion-mode','create-project-mode','project-list-mode','project-delete-mode','spa-mode','bonogas-active','bonogas-satcontrol-mode','gnv-graficas-mode','gnv-satcontrol-mode','mcter-mode');if(content)content.classList.remove('left-hidden','right-hidden');if(app)app.classList.remove('sidebar-hidden');qs('.sidebar')?.classList.remove('collapsed');clearProyectosForeignMapLayers();ensureProjectLayerToggles();const title=qs('.topbar h1'),sub=qs('.topbar p');if(title)title.textContent=cfg.title;if(sub){sub.textContent=cfg.sub;sub.style.display='';}setActiveSidebarModule(cfg.nav);renderAll();updateCollapseIcons();if(typeof window.__prepareUtilsDocks==='function')window.__prepareUtilsDocks();if(typeof window.initProjectUtilsDockWhenReady==='function')window.initProjectUtilsDockWhenReady();if(typeof setProjectUtilsPinned==='function')setProjectUtilsPinned(true);if(typeof clampProjectUtilsDock==='function')setTimeout(clampProjectUtilsDock,80);showToast(cfg.toast);resizeMapAfterLayout();const p=projects.find(x=>x.id===selectedId)||projects[0];if(p&&isProyectosSatcontrolView())syncMapToProject(p);}
let projectListPage=1;const projectListPageSize=10;
function projectListEsc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function projectListCode(p,i){const digits=String(p.id||'').replace(/\D/g,'');return 'proy-'+String(digits?Number(digits.slice(-6)):776000-i).padStart(6,'0');}
function projectListDisplayStatus(p){const s=String(p.estado||'En ejecución');if(/observ/i.test(s))return 'Deleted';if(/aprob|final/i.test(s))return 'Finalizado';if(/evalu/i.test(s))return 'Planificado';return 'En Ejecución';}
function projectListStatusClass(status){if(status==='Deleted')return 'deleted';if(status==='Finalizado')return 'done';if(status==='Planificado')return 'planned';return 'executing';}
function projectListType(p){return /infra/i.test(p.tipo||'')?'Infraestructura':'Electrico';}
function projectListFiltered(){const field=qs('#projectListField')?.value||'nombre';const term=(qs('#projectListSearch')?.value||'').trim().toLowerCase();return projects.map((p,i)=>({p,i,code:projectListCode(p,i),status:projectListDisplayStatus(p),type:projectListType(p)})).filter(row=>{if(!term)return true;const value=field==='codigo'?row.code:(field==='estado'?row.status:(field==='tipo'?row.type:row.p.nombre));return String(value||'').toLowerCase().includes(term);});}
function renderProjectListTable(){const tbody=qs('#projectListTableBody');if(!tbody)return;const rows=projectListFiltered();const pages=Math.max(1,Math.ceil(rows.length/projectListPageSize));projectListPage=Math.min(projectListPage,pages);const start=(projectListPage-1)*projectListPageSize;const visible=rows.slice(start,start+projectListPageSize);tbody.innerHTML=visible.length?visible.map(row=>`<tr><td>${projectListEsc(row.code)}</td><td>${projectListEsc(row.p.nombre)}</td><td><span class="project-list-status ${projectListStatusClass(row.status)}">${projectListEsc(row.status)}</span></td><td>${projectListEsc(row.type)}</td><td>${Number(row.p.beneficiarios||1)} beneficiario${Number(row.p.beneficiarios||1)===1?'':'s'}</td><td><button class="project-list-action" type="button" data-list-doc="${projectListEsc(row.p.id)}"><svg class="svg-icon" aria-hidden="true"><use href="#i-file-text"></use></svg> Ver</button></td><td><button class="project-list-action image" type="button" data-list-img="${projectListEsc(row.p.id)}"><svg class="svg-icon" aria-hidden="true"><use href="#i-image"></use></svg> Ver</button></td><td><button class="project-list-action edit" type="button" data-list-edit="${projectListEsc(row.p.id)}"><svg class="svg-icon" aria-hidden="true"><use href="#i-edit"></use></svg> Editar</button></td></tr>`).join(''):`<tr><td colspan="8" style="text-align:center;color:#9ba9cc;padding:36px">No se encontraron agrupaciones.</td></tr>`;const prev=qs('#projectListPrevBtn'),next=qs('#projectListNextBtn'),label=qs('#projectListPageLabel');if(prev)prev.disabled=projectListPage<=1;if(next)next.disabled=projectListPage>=pages;if(label)label.textContent='Página '+projectListPage+' de '+pages;}
function openProjectListFromMenu(){const main=qs('.main'),app=qs('.app'),content=qs('.content');main?.classList.remove('requests-mode','validations-mode','hospital-mode','vale-fise-mode','ahorro-gnv-mode','fotovoltaico-mode','electricidad-mode','masificacion-mode','create-project-mode','project-delete-mode','bonogas-active','bonogas-satcontrol-mode','spa-mode');main?.classList.add('project-list-mode');if(app)app.classList.remove('sidebar-hidden');if(content)content.classList.remove('left-hidden','right-hidden');qs('.sidebar')?.classList.remove('collapsed');setActiveSidebarModule('navListProjects');const title=qs('.topbar h1'),sub=qs('.topbar p');if(title)title.textContent='Agrupaciones > Listar';if(sub)sub.textContent='Listado general, búsqueda, documentos e imágenes';projectListPage=1;renderProjectListTable();updateCollapseIcons();setTimeout(()=>qs('#projectListSearch')?.focus(),50);showToast('Listado de agrupaciones visible')}
function resetCreateProjectPage(){const f=qs('#projectCreatePageForm');if(!f)return;f.reset();f.elements.id.value='FISE-2026-'+String(projects.length+1).padStart(3,'0');f.elements.departamento.value='Amazonas';f.elements.estado.value='En evaluación';if(f.elements.benefEstado)f.elements.benefEstado.value='Activo';if(f.elements.benefPrograma)f.elements.benefPrograma.value='GLP';resetBonogasBeneficiaryImport('page');syncBonogasBeneficiaryUi('page');}
function openCreateProjectFromMenu(){const main=qs('.main'),app=qs('.app'),content=qs('.content');main?.classList.remove('requests-mode','validations-mode','hospital-mode','vale-fise-mode','ahorro-gnv-mode','fotovoltaico-mode','electricidad-mode','masificacion-mode','project-list-mode','project-delete-mode','bonogas-active','bonogas-satcontrol-mode','spa-mode');main?.classList.add('create-project-mode');if(app)app.classList.remove('sidebar-hidden');if(content)content.classList.remove('left-hidden','right-hidden');qs('.sidebar')?.classList.remove('collapsed');setActiveSidebarModule('navCreateProject');const title=qs('.topbar h1'),sub=qs('.topbar p');if(title)title.textContent='Agrupaciones > Crear';if(sub)sub.textContent='Registro de agrupación, documentación, geometría y beneficiarios';initBonogasBeneficiaryImport();resetCreateProjectPage();updateCollapseIcons();showToast('Formulario de creación abierto')}
function resetDeleteProjectPage(){const input=qs('#projectDeleteCode'),result=qs('#projectDeleteResult');if(input)input.value='';if(result){result.textContent='';result.className='project-delete-result';}}
function deleteProjectByCode(){const input=qs('#projectDeleteCode'),result=qs('#projectDeleteResult');const code=(input?.value||'').trim();if(result){result.textContent='';result.className='project-delete-result';}if(!code){if(result){result.textContent='Ingresa el código de la agrupación.';result.classList.add('warn');}showToast('Ingresa un código');input?.focus();return;}const normalized=code.toLowerCase();const idx=projects.findIndex((p,i)=>String(p.id||'').toLowerCase()===normalized||projectListCode(p,i).toLowerCase()===normalized);if(idx<0){if(result){result.textContent='No se encontró una agrupación con ese código.';result.classList.add('warn');}showToast('Agrupación no encontrado');input?.focus();return;}const removed=projects.splice(idx,1)[0];selectedId=projects[0]?.id;renderAll();renderProjectListTable();if(result){result.textContent='Agrupación '+(removed?.nombre||code)+' eliminado correctamente.';result.classList.add('ok');}if(input)input.value='';showToast('Agrupación eliminada')}
function openDeleteProjectFromMenu(){const main=qs('.main'),app=qs('.app'),content=qs('.content');main?.classList.remove('requests-mode','validations-mode','hospital-mode','vale-fise-mode','ahorro-gnv-mode','fotovoltaico-mode','electricidad-mode','masificacion-mode','create-project-mode','project-list-mode','bonogas-active','bonogas-satcontrol-mode','spa-mode');main?.classList.add('project-delete-mode');if(app)app.classList.remove('sidebar-hidden');if(content)content.classList.remove('left-hidden','right-hidden');qs('.sidebar')?.classList.remove('collapsed');setActiveSidebarModule('navDeleteProject');const title=qs('.topbar h1'),sub=qs('.topbar p');if(title)title.textContent='Agrupaciones > Eliminar';if(sub)sub.textContent='Eliminación de agrupaciones por código';resetDeleteProjectPage();updateCollapseIcons();setTimeout(()=>qs('#projectDeleteCode')?.focus(),50);showToast('Eliminar agrupación abierto')}
function showSaunaProjectByDefault(){
  const sauna=projects.find(p=>p.nombre==='AGRUPACIÓN 1')||projects[0];
  if(!sauna)return;
  selectProject(sauna.id);
  ['#layerMorosidad','#layerDistritos'].forEach(id=>{const el=qs(id);if(el)el.checked=false;});
  if(typeof clearSatelliteMode==='function')clearSatelliteMode();
  if(leafletMap)setTimeout(()=>{leafletMap.invalidateSize();syncMapToProject(sauna);},320);
}
let projectUtilsPinned=true;
let projectUtilsPosition={left:18,top:18};
let projectFilesMode='documents';
let pendingProjectFile=null;
let pendingProjectFileDeleteId=null;
const projectDocumentRows=[{id:'sample-pdf',name:'Informe tecnico de la agrupación.pdf',meta:'PDF · Documento de ejemplo',type:'pdf',sample:true}];
const projectImageRows=[{id:'sample-image',name:'Fotografia de avance.png',meta:'PNG · Imagen de ejemplo',type:'image',sample:true}];
function setProjectUtilsPinned(pinned){
  /* Garantiza que exista UN SOLO contenedor — nunca clona ni duplica */
  const dock=qs('#projectUtilsDock');
  const mapAnchor=qs('#projectUtilMapAnchor');
  const pinBtn=qs('#utilPinBtn');
  if(!dock||!mapAnchor)return;

  if(pinned){
    /* Anclado: mueve (no clona) el dock al mapa si no está ya ahí */
    projectUtilsPinned=true;
    if(dock.parentElement!==mapAnchor)mapAnchor.appendChild(dock);
    dock.classList.add('is-pinned');
    dock.style.left='';
    dock.style.top='';
    dock.style.removeProperty('position');
    dock.style.removeProperty('right');
    if(pinBtn){
      pinBtn.classList.add('active');
      pinBtn.setAttribute('aria-pressed','true');
      pinBtn.title='Fijar utilitarios en posición actual';
      pinBtn.setAttribute('aria-label',pinBtn.title);
    }
  }else{
    /* Libre/flotante: el dock permanece en el map-shell pero sin is-pinned — arrastrable */
    projectUtilsPinned=false;
    if(dock.parentElement!==mapAnchor)mapAnchor.appendChild(dock);
    dock.classList.remove('is-pinned');
    /* Poner posición inicial si aún no tiene left/top */
    if(!dock.style.left){
      const shell=qs('.map-shell');
      const shellRect=shell?shell.getBoundingClientRect():null;
      const dockRect=dock.getBoundingClientRect();
      dock.style.setProperty('position','absolute','important');
      dock.style.setProperty('right','auto','important');
      dock.style.left=(shellRect?(shellRect.width-dockRect.width-18):18)+'px';
      dock.style.top='18px';
    }
    if(pinBtn){
      pinBtn.classList.remove('active');
      pinBtn.setAttribute('aria-pressed','false');
      pinBtn.title='Fijar utilitarios en esta posición';
      pinBtn.setAttribute('aria-label',pinBtn.title);
    }
  }
}
function clampProjectUtilsDock(){
  const dock=qs('#projectUtilsDock'),shell=qs('.map-shell');
  if(!dock||!shell)return;
  /* Si está anclado sin inline left, CSS right:18px maneja la posición */
  if(dock.classList.contains('is-pinned')&&!dock.style.left)return;
  const shellRect=shell.getBoundingClientRect(),rect=dock.getBoundingClientRect();
  const currentLeft=parseFloat(dock.style.left||18);
  const currentTop=parseFloat(dock.style.top||18);
  const left=Math.max(10,Math.min(currentLeft,Math.max(10,shellRect.width-rect.width-10)));
  const top=Math.max(10,Math.min(currentTop,Math.max(10,shellRect.height-rect.height-10)));
  projectUtilsPosition={left,top};
  dock.style.setProperty('position','absolute','important');
  dock.style.setProperty('right','auto','important');
  dock.style.left=left+'px';
  dock.style.top=top+'px';
}
function enableProjectUtilsDrag(){
  /* Sistema de drag neutralizado — reemplazado por wirePinDrag en tools-flow-override */
  /* El nuevo sistema pu-floating maneja todo el comportamiento del pin */
}
function enableBonogasUtilsDrag(){
  /* Sistema de drag neutralizado — reemplazado por wirePinDrag en tools-flow-override */
}
function openProjectFilesModal(title,mode='documents'){
  projectFilesMode=mode;
  const modalTitle=qs('#projectFilesTitle');
  if(modalTitle)modalTitle.textContent=title||'Documentos de la agrupación';
  const uploadTitle=qs('#projectUploadTitle');
  const selectedName=qs('#projectDocFileName');
  const fileInput=qs('#projectDocInput');
  const nameInput=qs('#projectDocName');
  if(projectFilesMode==='images'){
    if(uploadTitle)uploadTitle.textContent='Subir imagenes';
    if(selectedName)selectedName.textContent='Seleccione una imagen PNG, JPG o JPEG.';
    if(fileInput)fileInput.accept='.png,.jpg,.jpeg';
    if(nameInput){
      nameInput.value='';
      nameInput.placeholder='Nombre de la imagen';
    }
  }else{
    if(uploadTitle)uploadTitle.textContent='Subir documento';
    if(selectedName)selectedName.textContent='Seleccione un archivo PDF, Word o Excel.';
    if(fileInput)fileInput.accept='.pdf,.doc,.docx,.xls,.xlsx';
    if(nameInput){
      nameInput.value='';
      nameInput.placeholder='Nombre del documento';
    }
  }
  pendingProjectFile=null;
  renderProjectFilesRows();
  openModal('docsModal');
}
function currentProjectFilesRows(){
  return projectFilesMode==='images'?projectImageRows:projectDocumentRows;
}
function renderProjectFilesRows(){
  const box=qs('#projectFilesRows');
  if(!box)return;
  const rows=currentProjectFilesRows();
  box.innerHTML=rows.length?rows.map(row=>`<div class="project-files-row" data-project-file="${row.id}"><div><b>${row.name}</b><small>${row.meta}</small></div><div><button class="project-view-btn" type="button" data-view-project-file="${row.id}">Ver</button></div><div><button class="project-delete-btn" type="button" title="Eliminar" aria-label="Eliminar" data-delete-project-file="${row.id}"><svg class="svg-icon" aria-hidden="true"><use href="#i-trash"></use></svg></button></div></div>`).join(''):'<div class="project-files-empty">No se encontraron archivos para esta agrupación.</div>';
  qsa('[data-view-project-file]').forEach(btn=>btn.addEventListener('click',()=>viewProjectFile(btn.dataset.viewProjectFile)));
  qsa('[data-delete-project-file]').forEach(btn=>btn.addEventListener('click',()=>askDeleteProjectFile(btn.dataset.deleteProjectFile)));
}
function projectFileById(id){
  return currentProjectFilesRows().find(row=>row.id===id);
}
function sampleProjectImageDataUrl(){
  const canvas=document.createElement('canvas');
  canvas.width=960;
  canvas.height=560;
  const ctx=canvas.getContext('2d');
  const g=ctx.createLinearGradient(0,0,960,560);
  g.addColorStop(0,'#38bdf8');
  g.addColorStop(.45,'#1d4ed8');
  g.addColorStop(1,'#111827');
  ctx.fillStyle=g;
  ctx.fillRect(0,0,960,560);
  ctx.fillStyle='rgba(255,255,255,.18)';
  ctx.beginPath();ctx.arc(760,120,110,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='rgba(15,23,42,.75)';
  ctx.fillRect(70,360,820,92);
  ctx.fillStyle='#fff';
  ctx.font='700 36px Arial';
  ctx.fillText('Imagen de ejemplo de la agrupación',96,415);
  ctx.font='500 20px Arial';
  ctx.fillText('PNG / JPG / JPEG',96,445);
  return canvas.toDataURL('image/png');
}
function viewProjectFile(id){
  const row=projectFileById(id);
  if(!row)return;
  if(row.type==='image'){
    const img=qs('#projectImagePreview');
    const title=qs('#projectImagePreviewTitle');
    if(title)title.textContent=row.name;
    if(img)img.src=row.url||sampleProjectImageDataUrl();
    openModal('imagePreviewModal');
  }else{
    openSampleProjectPdf(row.name,row.url);
  }
}
function askDeleteProjectFile(id){
  const row=projectFileById(id);
  if(!row)return;
  pendingProjectFileDeleteId=id;
  const text=qs('#deleteProjectPdfText');
  if(text)text.textContent=row.type==='image'?'¿Quiere eliminar esa imagen?':'¿Quiere eliminar ese PDF?';
  openModal('deleteProjectPdfModal');
}
function saveProjectUploadedFile(){
  const file=pendingProjectFile;
  const nameInput=qs('#projectDocName');
  const displayName=(nameInput?.value||'').trim();
  if(!file){showToast('Seleccione un archivo primero');return;}
  if(!displayName){showToast('Ingrese un nombre');return;}
  const ext=(file.name.split('.').pop()||'').toLowerCase();
  const id='project-file-'+Date.now();
  if(projectFilesMode==='images'){
    currentProjectFilesRows().push({id,name:displayName+'.'+ext,meta:ext.toUpperCase()+' · Imagen subida',type:'image',url:URL.createObjectURL(file)});
    showToast('Imagen subida: '+displayName);
  }else{
    const isPdf=ext==='pdf';
    currentProjectFilesRows().push({id,name:displayName+'.'+ext,meta:ext.toUpperCase()+' · Documento subido',type:isPdf?'pdf':'document',url:isPdf?URL.createObjectURL(file):''});
    showToast('Documento subido: '+displayName);
  }
  pendingProjectFile=null;
  if(qs('#projectDocFileName'))qs('#projectDocFileName').textContent=projectFilesMode==='images'?'Seleccione una imagen PNG, JPG o JPEG.':'Seleccione un archivo PDF, Word o Excel.';
  if(nameInput)nameInput.value='';
  if(qs('#projectDocInput'))qs('#projectDocInput').value='';
  renderProjectFilesRows();
}
function sampleProjectPdfDataUrl(){
  const objects=[
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n',
    '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n',
    '5 0 obj\n<< /Length 192 >>\nstream\nBT\n/F1 22 Tf\n50 780 Td\n(Documento de ejemplo) Tj\n/F1 13 Tf\n0 -35 Td\n(Agrupación: BONO_GAS_V1 / SATCONTROL) Tj\n0 -24 Td\n(Contenido referencial para validar la opcion Ver.) Tj\n0 -24 Td\n(Informe tecnico de la agrupación.) Tj\nET\nendstream\nendobj\n'
  ];
  let pdf='%PDF-1.4\n';
  const offsets=[0];
  objects.forEach(obj=>{offsets.push(pdf.length);pdf+=obj;});
  const xref=pdf.length;
  pdf+='xref\n0 '+(objects.length+1)+'\n0000000000 65535 f \n';
  offsets.slice(1).forEach(n=>{pdf+=String(n).padStart(10,'0')+' 00000 n \n';});
  pdf+='trailer\n<< /Size '+(objects.length+1)+' /Root 1 0 R >>\nstartxref\n'+xref+'\n%%EOF';
  return 'data:application/pdf;base64,'+btoa(pdf);
}
function openSampleProjectPdf(title='Informe tecnico de la agrupación.pdf',url=''){
  const frame=qs('#projectPdfFrame');
  const previewTitle=qs('#pdfPreviewModal h2');
  if(previewTitle)previewTitle.textContent=title;
  const {jsPDF}=window.jspdf||{};
  if(frame&&url){
    frame.src=url;
  }else if(frame&&jsPDF){
    const doc=new jsPDF({unit:'pt',format:'a4'});
    doc.setFillColor(17,23,47);
    doc.rect(0,0,595,842,'F');
    doc.setTextColor(255,255,255);
    doc.setFontSize(20);
    doc.text('Documento de ejemplo',48,70);
    doc.setFontSize(13);
    doc.text('Agrupación: BONO_GAS_V1 / SATCONTROL',48,105);
    doc.text('Este PDF se muestra como ejemplo para validar la opcion Ver.',48,132);
    doc.setDrawColor(74,90,134);
    doc.roundedRect(48,165,499,120,10,10,'S');
    doc.setFontSize(11);
    doc.text('Contenido referencial del informe tecnico de la agrupación.',70,205);
    const blob=doc.output('blob');
    frame.src=URL.createObjectURL(blob);
  }else if(frame){
    frame.src=sampleProjectPdfDataUrl();
  }
  openModal('pdfPreviewModal');
}
function focusCurrentProjectLocation(){
  const p=currentProject();
  if(p&&typeof syncMapToProject==='function')syncMapToProject(p);
  if(leafletMap&&p)leafletMap.setView([p.lat,p.lng],15,{animate:true});
  showToast('Ubicación de la agrupación centrada');
}

/* ================================================================
   AGRUPACIONES — Hub de herramientas copiadas por módulo SATCONTROL
   Copias funcionales (proxy) sin alterar docks originales
   ================================================================ */
var PROYECTOS_MODULE_TOOLS_SOURCES=[
  {key:'bonogas',label:'Bono Gas',dock:'#bonogasUtilsDock'},
  {key:'vale-fise',label:'Vale FISE',dock:'#valeFiseUtilsDock'},
  {key:'gnv',label:'Ahorro GNV',dock:'#gnvUtilsDock'},
  {key:'fotovoltaico',label:'Fotovoltaico',dock:'#fotoUtilsDock'},
  {key:'electricidad',label:'Electricidad al Toque',dock:'#elecUtilsDock'},
  {key:'masificacion',label:'Masificación',dock:'#masifUtilsDock'},
  {key:'mcter',label:'MCTER',dock:'#mcterUtilsDock'}
];
function proyToolToneClass(el){
  if(!el)return'proy-tone-default';
  if(el.classList.contains('ref-filters'))return'proy-tone-filter';
  if(el.classList.contains('upload')||el.classList.contains('foto-excel-edr')||/Upload|Dger|Edr|dger/i.test(el.id||''))return'proy-tone-upload';
  if(el.classList.contains('ref-liquidation')||el.classList.contains('extra-liquidation'))return'proy-tone-liquidation';
  if(el.classList.contains('ref-reports')||el.classList.contains('extra-report'))return'proy-tone-report';
  if(el.classList.contains('extra-ai'))return'proy-tone-ai';
  if(el.classList.contains('foto-registro-punto')||/PinTool|RegistroPunto|utilPin/i.test(el.id||''))return'proy-tone-pin';
  if(el.dataset&&el.dataset.fiseTool==='measure'||el.dataset&&el.dataset.gnvTool==='measure'||/Measure|Medir/i.test(el.id||''))return'proy-tone-measure';
  if(el.dataset&&el.dataset.fiseTool==='polygon'||el.dataset&&el.dataset.gnvTool==='polygon'||/Polygon|poligono/i.test(el.title||''))return'proy-tone-polygon';
  if(el.dataset&&el.dataset.masifAction==='measure')return'proy-tone-measure';
  if(el.dataset&&el.dataset.fiseTool==='circle'||el.dataset&&el.dataset.gnvTool==='circle'||el.dataset&&el.dataset.masifAction==='influence'||/Circle|circular|circulo/i.test((el.id||'')+(el.title||'')))return'proy-tone-circle';
  if(el.dataset&&el.dataset.masifAction==='sync')return'proy-tone-sync';
  if(el.dataset&&el.dataset.masifAction==='validate')return'proy-tone-validate';
  if(el.dataset&&el.dataset.masifAction==='housing')return'proy-tone-housing';
  if(el.dataset&&el.dataset.fotoUtil==='utilFit'||el.dataset&&el.dataset.elecUtil==='utilFit'||el.dataset&&el.dataset.mcterUtil==='utilFit'||/Fit|Peru/i.test(el.id||''))return'proy-tone-fit';
  if(el.dataset&&el.dataset.fotoUtil==='utilRandom'||el.dataset&&el.dataset.elecUtil==='utilRandom'||el.dataset&&el.dataset.mcterUtil==='utilRandom')return'proy-tone-random';
  if(el.dataset&&el.dataset.fotoUtil==='utilInventory'||el.dataset&&el.dataset.elecUtil==='utilInventory'||el.dataset&&el.dataset.mcterUtil==='utilInventory')return'proy-tone-inventory';
  if(el.dataset&&el.dataset.elecUtil==='utilAnexo4'||el.dataset&&el.dataset.mcterUtil==='utilAnexo4')return'proy-tone-anexo';
  if(/Charts|chart/i.test(el.id||''))return'proy-tone-charts';
  return'proy-tone-select';
}
function buildProyectosModuleToolsHub(){
  var dock=qs('#projectUtilsDock');
  var host=qs('#proyectosModuleToolsHost');
  if(!dock||!host||host.dataset.built==='1')return;
  host.innerHTML='';
  PROYECTOS_MODULE_TOOLS_SOURCES.forEach(function(mod){
    var sourceDock=qs(mod.dock);
    if(!sourceDock)return;
    var group=document.createElement('div');
    group.className='pu-module-group';
    group.setAttribute('data-module',mod.key);
    var label=document.createElement('span');
    label.className='pu-module-label';
    label.textContent=mod.label;
    group.appendChild(label);
    var toolCount=0;
    Array.from(sourceDock.children).forEach(function(el){
      if(!el.classList||!el.classList.contains('util-btn'))return;
      if(el.classList.contains('more')||el.classList.contains('pin')||el.classList.contains('pu-zoom'))return;
      if(!el.id)return;
      var copy=document.createElement('button');
      copy.type='button';
      copy.className=String(el.className||'util-btn').replace(/\bactive\b/g,'').replace(/\s+/g,' ').trim();
      copy.title=el.title||'';
      copy.setAttribute('aria-label',el.getAttribute('aria-label')||el.title||mod.label);
      copy.innerHTML=el.innerHTML;
      copy.setAttribute('data-proy-tool-proxy','#'+el.id);
      copy.setAttribute('data-proy-module',mod.key);
      copy.classList.add(proyToolToneClass(el));
      group.appendChild(copy);
      toolCount++;
    });
    if(toolCount)host.appendChild(group);
  });
  host.dataset.built='1';
  var dock=qs('#projectUtilsDock');
  if(dock&&dock.getAttribute('data-utils-visible')==='true'&&!dock.classList.contains('pu-zoom-open')&&typeof window.__prepareUtilsDocks==='function'){
    window.__prepareUtilsDocks();
  }
}
window.buildProyectosModuleToolsHub=buildProyectosModuleToolsHub;

function syncProyectosToolCopyActive(source){
  if(!source||!source.id)return;
  var proxySel='[data-proy-tool-proxy="#'+source.id+'"]';
  qsa('#projectUtilsDock '+proxySel).forEach(function(copy){
    copy.classList.toggle('active',source.classList.contains('active'));
  });
}

function wireProyectosModuleToolProxies(){
  if(window.__proyectosToolProxiesWired)return;
  window.__proyectosToolProxiesWired=true;
  document.addEventListener('click',function(e){
    var copy=e.target.closest('#projectUtilsDock [data-proy-tool-proxy]');
    if(!copy)return;
    e.preventDefault();
    e.stopPropagation();
    var sel=copy.getAttribute('data-proy-tool-proxy');
    var source=sel?document.querySelector(sel):null;
    if(!source){
      if(typeof showToast==='function')showToast('Herramienta no disponible en este momento');
      return;
    }
    source.click();
    setTimeout(function(){syncProyectosToolCopyActive(source);},0);
  },true);
}
window.wireProyectosModuleToolProxies=wireProyectosModuleToolProxies;

/* ================================================================
   UTILITARIOS — Módulos Integrados
   Misma lógica de SATCONTROL AGRUPACIONES: PIN drag + three-dots toggle
   ================================================================ */
function initIntegratedModuleUtils(){
  /* Configuración de cada módulo integrado */
  /* Docks flotan sobre el iframe — mismo patron que BONOGAS */
  var modules=[
    {dock:'#valeFiseUtilsDock',  more:'#valeMoreBtn',  pin:'#valePinBtn'},
    {dock:'#gnvUtilsDock',       more:'#gnvMoreBtn',   pin:'#gnvPinBtn'},
    {dock:'#fotoUtilsDock',      more:'#fotoMoreBtn',  pin:'#fotoPinBtn'},
    {dock:'#elecUtilsDock',      more:'#elecMoreBtn',  pin:'#elecPinBtn'},
    {dock:'#masifUtilsDock',     more:'#masifMoreBtn', pin:'#masifPinBtn'},
    {dock:'#mcterUtilsDock',     more:'#mcterMoreBtn', pin:'#mcterPinBtn'}
  ];

  function initOneDock(cfg){
    var dockEl=qs(cfg.dock);
    var moreEl=qs(cfg.more);
    if(!dockEl||!moreEl)return;

    /* El dock arranca con is-pinned — el sistema pu-compact lo controla */
    dockEl.classList.add('is-pinned');

    /* PIN y MORE: gestionados por wirePinDrag / boot en tools-flow-override */

    /* Acciones — mismas funciones que SATCONTROL AGRUPACIONES */
    qs(cfg.pdf)?.addEventListener('click',function(){if(typeof generateSatcontrolPdfReport==='function')generateSatcontrolPdfReport();else showToast('Exportando PDF...');});
    qs(cfg.img)?.addEventListener('click',function(){if(typeof openProjectFilesModal==='function')openProjectFilesModal('Imagenes','images');else showToast('Capturando imagen...');});
    qs(cfg.cloud)?.addEventListener('click',function(){showToast('Sincronizando modulo...');});
    qs(cfg.rpt)?.addEventListener('click',function(){showToast('Generando informe...');});
    qs(cfg.mod)?.addEventListener('click',function(){showToast('Modulos adicionales');});
    qs(cfg.users)?.addEventListener('click',function(){if(typeof exportRightPanelExcel==='function')exportRightPanelExcel();else showToast('Exportando beneficiarios...');});
  }

  modules.forEach(initOneDock);

  function valeFiseWindow(){
    var frame=qs('#valeFiseFrame');
    return frame&&(frame.contentWindow||null);
  }
  qsa('#valeFiseUtilsDock [data-fise-tool]').forEach(function(btn){
    btn.addEventListener('click',function(){
      var tool=btn.getAttribute('data-fise-tool');
      qsa('#valeFiseUtilsDock .fise-floating-tool').forEach(function(x){x.classList.remove('active');});
      btn.classList.add('active');
      var win=valeFiseWindow();
      if(win&&typeof win.fiseSetMapTool==='function')win.fiseSetMapTool(tool);
      else showToast('Herramienta Vale FISE: '+tool);
    });
  });
  qs('#valeFiseChartsBtn')?.addEventListener('click',function(){
    var win=valeFiseWindow();
    if(win&&typeof win.fiseOpenGeneralChartsModal==='function')win.fiseOpenGeneralChartsModal();
    else{
      var doc=qs('#valeFiseFrame')?.contentDocument;
      doc?.querySelector('#fiseGeneralChartsBtn')?.click();
    }
  });

  function gnvWindow(){
    var frame=qs('#ahorroGnvFrame');
    return frame&&(frame.contentWindow||null);
  }
  function gnvDocument(){
    var frame=qs('#ahorroGnvFrame');
    return frame&&(frame.contentDocument||(frame.contentWindow&&frame.contentWindow.document))||null;
  }
  qsa('#gnvUtilsDock [data-gnv-tool]').forEach(function(btn){
    btn.addEventListener('click',function(){
      var tool=btn.getAttribute('data-gnv-tool');
      qsa('#gnvUtilsDock .gnv-floating-tool').forEach(function(x){x.classList.remove('active');});
      btn.classList.add('active');
      var win=gnvWindow();
      if(win&&typeof win.setMapTool==='function')win.setMapTool(tool);
      else showToast('Herramienta Ahorro GNV: '+tool);
    });
  });
  qs('#gnvLiquidationBtn')?.addEventListener('click',function(){
    var m=qs('#gnvLiquidacionModal');
    if(m){
      m.classList.add('open');
      gnvLiqInit();
      // Refrescar tabla y KPIs en cada apertura
      if(window._gnvLiqRefresh)window._gnvLiqRefresh();
    }
  });
  qs('#gnvReportsBtn')?.addEventListener('click',function(){
    if(typeof window.openGnvInformeTecnicoModal==='function')window.openGnvInformeTecnicoModal();
    else showToast('Informes técnicos · Ahorro GNV');
  });
  qs('#gnvValidacionesIaBtn')?.addEventListener('click',function(){
    if(typeof window.openGnvAiValidacionModal==='function')window.openGnvAiValidacionModal();
    else if(typeof openModal==='function')openModal('gnvAiValidacionModal');
  });
  qs('#bonoUtilValidacionesIaBtn')?.addEventListener('click',function(){
    if(typeof window.openBonogasAiValidacionModal==='function')window.openBonogasAiValidacionModal();
    else if(typeof openModal==='function')openModal('bonogasAiValidacionModal');
  });

  function fotoDocument(){
    var frame=qs('#fotovoltaicoFrame');
    return frame&&(frame.contentDocument||(frame.contentWindow&&frame.contentWindow.document))||null;
  }
  function fotoWindow(){
    var frame=qs('#fotovoltaicoFrame');
    return frame&&(frame.contentWindow||null);
  }
  function triggerFotoUtil(action, activeBtn){
    var win=fotoWindow();
    var doc=fotoDocument();
    if(!doc||!win){
      showToast('Módulo Fotovoltaico aún cargando…');
      return;
    }
    if(typeof win.fotoTriggerUtil==='function'){
      win.fotoTriggerUtil(action);
    }else{
      var internalId=action==='pin'?'utilPin':action==='dger'?'utilDger':null;
      if(internalId)doc.querySelector('#'+internalId)?.click();
    }
    qsa('#fotoUtilsDock [data-foto-action]').forEach(function(x){x.classList.remove('active');});
    if(activeBtn)activeBtn.classList.add('active');
    setTimeout(function(){try{win.__fotoMap?.invalidateSize?.();}catch(e){}},120);
  }
  qsa('#fotoUtilsDock [data-foto-action]').forEach(function(btn){
    btn.addEventListener('click',function(){
      triggerFotoUtil(btn.getAttribute('data-foto-action'),btn);
    });
  });
  qsa('#fotoUtilsDock [data-foto-util]').forEach(function(btn){
    btn.addEventListener('click',function(){
      var internalId=btn.getAttribute('data-foto-util');
      qsa('#fotoUtilsDock .foto-floating-tool').forEach(function(x){x.classList.remove('active');});
      qsa('#fotoUtilsDock [data-foto-action]').forEach(function(x){x.classList.remove('active');});
      btn.classList.add('active');
      var target=fotoDocument()?.querySelector('#'+internalId);
      if(target)target.click();
      else showToast('Utilitario Fotovoltaico no disponible: '+internalId);
    });
  });
  function elecDocument(){
    var frame=qs('#electricidadFrame');
    return frame&&(frame.contentDocument||(frame.contentWindow&&frame.contentWindow.document))||null;
  }
  qsa('#elecUtilsDock [data-elec-util]').forEach(function(btn){
    btn.addEventListener('click',function(){
      var internalId=btn.getAttribute('data-elec-util');
      qsa('#elecUtilsDock .elec-floating-tool').forEach(function(x){x.classList.remove('active');});
      btn.classList.add('active');
      var target=elecDocument()?.querySelector('#'+internalId);
      if(target)target.click();
      else showToast('Utilitario Electricidad no disponible: '+internalId);
    });
  });
  function mcterDocument(){
    var frame=qs('#mcterFrame');
    return frame&&(frame.contentDocument||(frame.contentWindow&&frame.contentWindow.document))||null;
  }
  qsa('#mcterUtilsDock [data-mcter-util]').forEach(function(btn){
    btn.addEventListener('click',function(){
      var internalId=btn.getAttribute('data-mcter-util');
      qsa('#mcterUtilsDock .mcter-floating-tool').forEach(function(x){x.classList.remove('active');});
      btn.classList.add('active');
      var target=mcterDocument()?.querySelector('#'+internalId);
      if(target)target.click();
      else showToast('Utilitario MCTER no disponible: '+internalId);
    });
  });
  function masifWindow(){
    var frame=qs('#masificacionFrame');
    return frame&&(frame.contentWindow||null);
  }
  qsa('#masifUtilsDock [data-masif-tool]').forEach(function(btn){
    btn.addEventListener('click',function(){
      var tool=btn.getAttribute('data-masif-tool');
      qsa('#masifUtilsDock .masif-floating-tool').forEach(function(x){x.classList.remove('active');});
      qsa('#masifUtilsDock [data-masif-action]').forEach(function(x){x.classList.remove('active');});
      btn.classList.add('active');
      var win=masifWindow();
      if(win&&typeof win.setMapTool==='function')win.setMapTool(tool);
      else showToast('Herramienta Masificacion: '+tool);
    });
  });
}

function initMasificacionUtilityActions(){
  if(window.__masifUtilityActionsReady)return;
  window.__masifUtilityActionsReady=true;

  var masifDocs=[];
  var masifItems=[
    {codigo:'010210010101',partida:'Tuberia PEAD 200 mm alta densidad - terreno normal afirmado',unidad:'m',cantidad:94.37,costo:123.17185},
    {codigo:'010210010102',partida:'Tuberia PEAD 200 mm alta densidad - pavimento flexible',unidad:'m',cantidad:364.7,costo:150.89658},
    {codigo:'010210010401',partida:'Tuberia PEAD 200 mm alta densidad - terreno rocoso',unidad:'m',cantidad:397.33,costo:178.91137},
    {codigo:'040210010401',partida:'Valvula PEAD 200 mm tipo bola 5 bar',unidad:'und',cantidad:1,costo:1086.02552}
  ];
  var utilityMeta={
    sync:{title:'Sincronizar informacion',subtitle:'Beneficiarios, evidencias moviles, capas GIS y liquidaciones.',button:'Sincronizar ahora',html:function(p){return '<div class="sync-config-row"><label>Codigo de agrupación<input id="masifUtilProject" value="'+h(p.id)+'"></label><label>Ultima sincronizacion<input id="masifUtilLast" value="'+h(new Date().toLocaleString('es-PE'))+'"></label></div><label>Componentes a sincronizar<div class="masif-check-grid"><label><input type="checkbox" checked> Beneficiarios</label><label><input type="checkbox" checked> Evidencias moviles</label><label><input type="checkbox" checked> Capas GIS</label><label><input type="checkbox" checked> Liquidaciones</label></div></label>';}},
    validate:{title:'Validacion de beneficiario',subtitle:'Control de elegibilidad, contacto y observacion de campo.',button:'Guardar validacion',html:function(){return '<div class="sync-config-row"><label>DNI / C.U. beneficiario<input id="masifUtilDni" value="73984521"></label><label>Estado de validacion<select id="masifUtilEstado"><option>Validado en campo</option><option>Pendiente</option><option>Observado</option><option>No elegible</option></select></label></div><div class="sync-config-row"><label>Titular<input value="Usuario residencial FISE"></label><label>Celular<input value="999 888 777"></label></div><label>Observacion de validacion<textarea id="masifUtilObs" rows="4">Se verifica vivienda, medidor, conexion interna y elegibilidad del beneficiario.</textarea></label>';}},
    measure:{title:'Medicion de red y valvulas',subtitle:'Registro tecnico de tramos, diametros y costo estimado.',button:'Calcular medicion',html:function(){return '<div class="sync-config-row masif-three"><label>KM de red<input id="masifUtilKm" type="number" value="4.82" step="0.01"></label><label>Valvulas<input id="masifUtilValvulas" type="number" value="18"></label><label>Diametro nominal<input value="200 mm"></label></div><div class="sync-config-row"><label>Material<select><option>Polietileno PEAD</option><option>Acero</option><option>PVC</option><option>Otro</option></select></label><label>Tipo de tramo<select><option>Red proyectada</option><option>Red ejecutada</option><option>Conexion interna</option><option>Acometida</option></select></label></div><label>Costo estimado<input id="masifUtilCosto" value="US$ 98,291.11"></label>';}},
    influence:{title:'Area de influencia circular',subtitle:'Resumen territorial para priorizacion FISE.',button:'Calcular area',html:function(p){return '<div class="sync-config-row"><label>Radio de influencia<input id="masifUtilRadio" value="500 m"></label><label>Area estimada<input value="'+h(p.area||'0.21 ha')+'"></label></div><div class="sync-config-row"><label>Beneficiarios dentro del area<input value="'+h(p.beneficiarios||100)+'"></label><label>Criterio territorial<select><option>Area de influencia FISE</option><option>Malla de concesion</option><option>Zona priorizada</option><option>Manzana censal</option></select></label></div><label>Resultado<textarea rows="4">El area de influencia permite identificar viviendas, beneficiarios potenciales, redes cercanas y priorizacion territorial para la masificacion de gas.</textarea></label>';}},
    housing:{title:'Ficha de vivienda beneficiaria',subtitle:'Checklist de vivienda, medidor y georreferenciacion.',button:'Guardar ficha',html:function(){return '<div class="sync-config-row"><label>Viviendas beneficiarias<input value="100"></label><label>Tipo de vivienda<select><option>Residencial</option><option>Multifamiliar</option><option>Comercio menor</option><option>Mixto</option></select></label></div><div class="sync-config-row"><label>Direccion referencial<input value="Mz. A Lt. 12 - Sector 010101"></label><label>Servicio actual<select><option>GLP</option><option>Lena</option><option>Electricidad</option><option>Sin servicio</option></select></label></div><label>Checklist de vivienda<div class="masif-check-grid"><label><input type="checkbox" checked> Fachada verificada</label><label><input type="checkbox" checked> Medidor registrado</label><label><input type="checkbox"> Conexion interna pendiente</label><label><input type="checkbox" checked> Georreferenciacion activa</label></div></label>';}}
  };

  function h(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function money(n){return 'US$ '+Number(n||0).toLocaleString('es-PE',{minimumFractionDigits:2,maximumFractionDigits:2});}
  function project(){return (typeof currentProject==='function'?currentProject():projects.find(function(x){return x.id===selectedId;}))||projects[0]||{};}
  function toast(msg){if(typeof showToast==='function')showToast(msg);}
  function download(name,html){var blob=new Blob([html],{type:'text/html;charset=utf-8'});var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();URL.revokeObjectURL(a.href);}
  function bindClose(modal){modal.querySelectorAll('[data-close]').forEach(function(b){b.addEventListener('click',function(){modal.classList.remove('open');});});modal.addEventListener('click',function(e){if(e.target===modal)modal.classList.remove('open');});}

  function ensureModals(){
    if(document.getElementById('masifLiquidacionModal'))return;
    var wrap=document.createElement('div');
    wrap.innerHTML='<div class="modal" id="masifLiquidacionModal"><div class="modal-card modal-xl"><div class="modal-head"><div><h2>Liquidaciones Masificacion</h2><p>ANEXO 1: Liquidacion de inversiones en bienes de capital con recursos del FISE.</p></div><button class="close" type="button" data-close="masifLiquidacionModal">x</button></div><div class="sync-dashboard masif-modal-grid"><section class="sync-config"><h3>Datos de liquidacion</h3><div class="sync-config-row"><label>Codigo de agrupación<input id="masifLiqProyecto"></label><label>Codigo de malla<input id="masifLiqMalla"></label></div><div class="sync-config-row"><label>Concesion<input id="masifLiqConcesion" value="LIMA Y CALLAO"></label><label>Fecha<input id="masifLiqFecha" type="date"></label></div><div class="sync-config-row"><label>Porcentaje parcial (%)<input id="masifLiqPorcentaje" type="number" value="60" min="0" max="100"></label><label>Responsable<input id="masifLiqResponsable" value="Oliver Gonzales - Responsable tecnico"></label></div><div class="modal-actions" style="margin-top:0"><button class="btn dark" id="masifLiqCalcBtn" type="button">Calcular</button><button class="btn" id="masifLiqGenerateBtn" type="button">Generar liquidacion</button><button class="btn" id="masifLiqExportBtn" type="button">Exportar</button></div></section><section class="sync-card"><div class="sync-top"><div class="sync-app"><div class="sync-icon"><svg class="svg-icon" aria-hidden="true"><use href="#i-receipt"></use></svg></div><div><b>Resumen FISE - Redes</b><span>Partidas, subtotal y liquidacion parcial</span></div></div><span class="sync-status warn" id="masifLiqStatus">Preliquidacion</span></div><div class="sync-meta"><div><span>Total inversion</span><b id="masifLiqTotal">US$ 0.00</b></div><div><span>Monto parcial</span><b id="masifLiqParcial">US$ 0.00</b></div></div><div class="sync-progress"><span id="masifLiqProgress" style="width:60%"></span></div></section></div><div class="masif-table-wrap"><table class="masif-table"><thead><tr><th>Codigo VNR</th><th>Partida</th><th>Und.</th><th>Cantidad</th><th>Costo unit.</th><th>Subtotal</th></tr></thead><tbody id="masifLiqRows"></tbody></table></div><div class="sync-log"><h3>Bitacora de liquidacion</h3><div id="masifLiqLog"><div class="sync-log-row"><span>Malla</span><b>Lista para revision tecnica y financiera</b></div></div></div></div></div><div class="modal" id="masifInformeModal"><div class="modal-card modal-xl"><div class="modal-head"><div><h2>Informes tecnicos y resoluciones</h2><p>Plantilla FISE para informe tecnico legal, resolucion, firma y bandeja.</p></div><div class="gnv-inf-head-actions"><button class="btn dark" id="masifDocSaveBtn" type="button">Guardar</button><button class="btn" id="masifDocSignBtn" type="button">Firmar</button><button class="btn" id="masifDocExportBtn" type="button">Exportar</button><button class="btn" id="masifDocTrayBtn" type="button">Enviar a bandeja</button><button class="close" type="button" data-close="masifInformeModal">x</button></div></div><div class="doc-workflow"><div class="doc-workgrid"><section class="doc-editor"><div class="sync-config"><h3>Datos del documento</h3><div class="sync-config-row"><label>Vista<select id="masifDocVista"><option value="informe">Informe Tecnico Legal</option><option value="resolucion">Resolucion</option></select></label><label>Numero de documento<input id="masifDocNumero" value="0218-2026/FISE"></label></div><div class="sync-config-row"><label>Concesionario<input id="masifDocConcesionario" value="Gas Natural de Lima y Callao S.A."></label><label>Monto<input id="masifDocMonto" value="US$ 98,291.11"></label></div><label>Asunto<input id="masifDocAsunto" value="Liquidacion Parcial FISE - Redes para concesionario de gas natural"></label><label>Sustento tecnico<textarea id="masifDocSupport" rows="8">Se verifico codigo, malla, ubicacion, area de influencia, beneficiarios, evidencia fotografica, capas geoespaciales y partidas de liquidacion FISE - Redes.</textarea></label><label>Conclusiones / resolucion<textarea id="masifDocConclusion" rows="6">La informacion tecnica, economica y geoespacial registrada permite sustentar la aprobacion de la liquidacion parcial de la agrupación seleccionada.</textarea></label><div id="masifDocState" class="sync-alert-box"><b>Borrador</b><span>Documento editable listo para guardar, firmar o enviar a bandeja.</span></div></div></section><aside class="doc-preview-panel"><h3>Vista previa</h3><div class="doc-preview" id="masifDocPreview"></div><div class="doc-tray"><div class="doc-tray-head"><h3>Bandeja de documentos</h3><span class="badge" id="masifDocTrayCount">0 enviados</span></div><div id="masifDocTrayRows" class="doc-tray-rows"></div></div></aside></div></div></div></div><div class="modal" id="masifUtilityModal"><div class="modal-card"><div class="modal-head"><div><h2 id="masifUtilTitle">Utilitario Masificacion</h2><p id="masifUtilSubtitle">Operacion del modulo.</p></div><button class="close" type="button" data-close="masifUtilityModal">x</button></div><div class="sync-dashboard"><section class="sync-config" id="masifUtilBody"></section><section class="sync-card"><div class="sync-top"><div class="sync-app"><div class="sync-icon"><svg class="svg-icon" aria-hidden="true"><use href="#i-check-circle"></use></svg></div><div><b>Resultado</b><span id="masifUtilResult">Pendiente de ejecutar</span></div></div><span class="sync-status warn" id="masifUtilStatus">Pendiente</span></div><div class="sync-progress"><span id="masifUtilProgress" style="width:20%"></span></div><div class="sync-actions"><button type="button" id="masifUtilRunBtn">Ejecutar</button></div></section><div class="sync-log"><h3>Bitacora del utilitario</h3><div id="masifUtilLog"><div class="sync-log-row"><span>Sistema</span><b>Utilitario preparado para el agrupación seleccionada</b></div></div></div></div></div></div>';
    Array.from(wrap.children).forEach(function(el){document.body.appendChild(el);bindClose(el);});
    document.getElementById('masifLiqCalcBtn').addEventListener('click',function(){renderLiquidacion('Preliquidacion calculada');toast('Liquidacion Masificacion calculada');});
    document.getElementById('masifLiqGenerateBtn').addEventListener('click',function(){renderLiquidacion('Liquidacion generada');toast('Liquidacion generada');});
    document.getElementById('masifLiqExportBtn').addEventListener('click',exportLiquidacion);
    ['masifLiqPorcentaje','masifLiqProyecto','masifLiqMalla','masifLiqConcesion'].forEach(function(id){document.getElementById(id).addEventListener('input',function(){renderLiquidacion();});});
    ['masifDocVista','masifDocNumero','masifDocConcesionario','masifDocMonto','masifDocAsunto','masifDocSupport','masifDocConclusion'].forEach(function(id){document.getElementById(id).addEventListener('input',renderDoc);});
    document.getElementById('masifDocSaveBtn').addEventListener('click',function(){setDocState('Guardado','Documento guardado como borrador tecnico.');toast('Documento guardado');});
    document.getElementById('masifDocSignBtn').addEventListener('click',function(){setDocState('Firmado','Firma electronica simulada registrada.');toast('Documento firmado');});
    document.getElementById('masifDocExportBtn').addEventListener('click',exportDoc);
    document.getElementById('masifDocTrayBtn').addEventListener('click',sendDocTray);
  }

  function renderLiquidacion(logText){var p=project();var pct=Number(document.getElementById('masifLiqPorcentaje').value||0);var total=masifItems.reduce(function(s,it){return s+(it.cantidad*it.costo);},0);var parcial=total*pct/100;document.getElementById('masifLiqRows').innerHTML=masifItems.map(function(it){return '<tr><td>'+h(it.codigo)+'</td><td>'+h(it.partida)+'</td><td>'+h(it.unidad)+'</td><td>'+it.cantidad.toLocaleString('es-PE')+'</td><td>'+money(it.costo)+'</td><td>'+money(it.cantidad*it.costo)+'</td></tr>';}).join('');document.getElementById('masifLiqTotal').textContent=money(total);document.getElementById('masifLiqParcial').textContent=money(parcial);document.getElementById('masifLiqProgress').style.width=Math.max(6,Math.min(100,pct))+'%';if(logText){document.getElementById('masifLiqStatus').textContent=logText;document.getElementById('masifLiqLog').insertAdjacentHTML('afterbegin','<div class="sync-log-row"><span>'+h(p.id||'Agrupación')+'</span><b>'+h(logText)+' - '+money(parcial)+'</b></div>');}}
  function openLiquidacion(){ensureModals();var p=project();document.getElementById('masifLiqProyecto').value=p.id||'FISE-2026-001';document.getElementById('masifLiqMalla').value='PPEO-25-0594 CL-SECTOR-000100-MALLA-000';document.getElementById('masifLiqFecha').value=new Date().toISOString().slice(0,10);renderLiquidacion();openModal('masifLiquidacionModal');}
  function docHtml(){var vista=document.getElementById('masifDocVista').value;var p=project();var title=vista==='resolucion'?'RESOLUCION DE DIRECCION EJECUTIVA':'INFORME TECNICO LEGAL';return '<div class="doc-preview-stamp">'+(vista==='resolucion'?'RESOLUCION':'INFORME')+'</div><h4>'+title+' N° '+h(document.getElementById('masifDocNumero').value)+'</h4><p><b>Agrupación:</b> '+h(p.id||'-')+' - '+h(p.nombre||'Masificacion de gas')+'</p><p><b>Concesionario:</b> '+h(document.getElementById('masifDocConcesionario').value)+'</p><p><b>Asunto:</b> '+h(document.getElementById('masifDocAsunto').value)+'</p><p><b>Monto referencial:</b> '+h(document.getElementById('masifDocMonto').value)+'</p><p>'+h(document.getElementById('masifDocSupport').value).replace(/\n/g,'<br>')+'</p><p><b>Conclusion:</b> '+h(document.getElementById('masifDocConclusion').value).replace(/\n/g,'<br>')+'</p><div class="doc-preview-sign">Firma electronica pendiente</div>';}
  function renderDoc(){document.getElementById('masifDocPreview').innerHTML=docHtml();}
  function setDocState(title,msg){document.getElementById('masifDocState').innerHTML='<b>'+h(title)+'</b><span>'+h(msg)+'</span>';renderDoc();}
  function openInforme(){ensureModals();var p=project();document.getElementById('masifDocAsunto').value='Liquidacion Parcial FISE - Redes de la agrupación '+(p.id||'FISE-2026-001');renderDoc();openModal('masifInformeModal');}
  function sendDocTray(){var item={codigo:document.getElementById('masifDocNumero').value,vista:document.getElementById('masifDocVista').value,asunto:document.getElementById('masifDocAsunto').value};masifDocs.unshift(item);document.getElementById('masifDocTrayCount').textContent=masifDocs.length+' enviados';document.getElementById('masifDocTrayRows').innerHTML=masifDocs.map(function(d){return '<div class="doc-tray-row"><div><b>'+h(d.codigo)+'</b><span>'+h(d.asunto)+'</span></div><small>'+h(d.vista)+'</small></div>';}).join('');setDocState('En bandeja','Documento enviado a revision tecnica y legal.');toast('Documento enviado a bandeja');}
  function exportDoc(){download('masificacion-documento.html','<!doctype html><html><head><meta charset="utf-8"><title>Documento Masificacion</title></head><body>'+docHtml()+'</body></html>');toast('Documento exportado');}
  function exportLiquidacion(){renderLiquidacion();download('masificacion-liquidacion.html','<!doctype html><html><head><meta charset="utf-8"><title>Liquidacion Masificacion</title></head><body><h1>Liquidacion Masificacion FISE</h1>'+document.querySelector('#masifLiquidacionModal .masif-table-wrap').innerHTML+'</body></html>');toast('Liquidacion exportada');}
  function openUtility(action){ensureModals();var meta=utilityMeta[action]||utilityMeta.influence;var p=project();document.getElementById('masifUtilTitle').textContent=meta.title;document.getElementById('masifUtilSubtitle').textContent=meta.subtitle;document.getElementById('masifUtilBody').innerHTML='<h3>'+h(meta.title)+'</h3>'+meta.html(p);document.getElementById('masifUtilRunBtn').textContent=meta.button;document.getElementById('masifUtilStatus').textContent='Pendiente';document.getElementById('masifUtilStatus').className='sync-status warn';document.getElementById('masifUtilResult').textContent='Pendiente de ejecutar';document.getElementById('masifUtilProgress').style.width='20%';document.getElementById('masifUtilRunBtn').onclick=function(){document.getElementById('masifUtilStatus').textContent='Completado';document.getElementById('masifUtilStatus').className='sync-status ok';document.getElementById('masifUtilResult').textContent=meta.title+' completado para '+(p.id||'agrupación seleccionada');document.getElementById('masifUtilProgress').style.width='100%';document.getElementById('masifUtilLog').insertAdjacentHTML('afterbegin','<div class="sync-log-row"><span>'+h(meta.title)+'</span><b>Operacion completada - '+h(new Date().toLocaleTimeString('es-PE'))+'</b></div>');toast(meta.title+' completado');};openModal('masifUtilityModal');}

  document.addEventListener('click',function(e){var btn=e.target.closest&&e.target.closest('#masifUtilsDock [data-masif-action]');if(!btn)return;e.preventDefault();var action=btn.getAttribute('data-masif-action');document.querySelectorAll('#masifUtilsDock [data-masif-action]').forEach(function(x){x.classList.remove('active');});document.querySelectorAll('#masifUtilsDock .masif-floating-tool').forEach(function(x){x.classList.remove('active');});btn.classList.add('active');if(action==='liquidacion')openLiquidacion();else if(action==='informeTecnico')openInforme();else openUtility(action);});
}

initMasificacionUtilityActions();

(function initMasificacionReferenceModals(){
  if(window.__masifReferenceModalsReady)return;
  window.__masifReferenceModalsReady=true;

  var liqItems=[
    {codigoVNR:'010210010101',partida:'Tuberia de Polietileno de 200 mm Alta Densidad Terreno Normal Pavimento Afirmado',unidad:'m',cantidad:94.37,costoUnitario:123.17185,objetoGIS:'TRON-001',vinculacion:'GIS vinculado'},
    {codigoVNR:'010210010102',partida:'Tuberia de Polietileno de 200 mm Alta Densidad Terreno Normal Pavimento Flexible',unidad:'m',cantidad:364.7,costoUnitario:150.89658,objetoGIS:'RAM-002',vinculacion:'GIS vinculado'},
    {codigoVNR:'010210010401',partida:'Tuberia de Polietileno de 200 mm Alta Densidad Terreno Rocoso Pavimento Afirmado',unidad:'m',cantidad:397.33,costoUnitario:178.91137,objetoGIS:'TRON-003',vinculacion:'GIS vinculado'},
    {codigoVNR:'040210010401',partida:'Valvula de Polietileno de 200mm de Alta densidad de 5 bar de tipo Bola',unidad:'und',cantidad:1,costoUnitario:1086.02552,objetoGIS:'VAL-001',vinculacion:'GIS vinculado'}
  ];
  var savedDocs=[];
  var docSigned=false;
  var docSent=false;
  var docSavedAt='';
  var activeDocView='informe';

  function h(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function q(id){return document.getElementById(id);}
  function project(){return (typeof currentProject==='function'?currentProject():projects.find(function(x){return x.id===selectedId;}))||projects[0]||{};}
  function money(n,d){return 'US$ '+Number(n||0).toLocaleString('es-PE',{minimumFractionDigits:d==null?2:d,maximumFractionDigits:d==null?2:d});}
  function toast(msg){if(typeof showToast==='function')showToast(msg);}
  function close(id){var m=q(id);if(m)m.remove();}
  function modalShell(id,body){
    close(id);
    var div=document.createElement('div');
    div.className='masif-ref-overlay';
    div.id=id;
    div.innerHTML=body;
    document.body.appendChild(div);
    div.addEventListener('click',function(e){if(e.target===div)div.remove();});
    div.querySelectorAll('[data-masif-close]').forEach(function(b){b.addEventListener('click',function(){div.remove();});});
    return div;
  }
  function downloadHtml(filename,inner){
    var blob=new Blob(['<!doctype html><html><head><meta charset="utf-8"><title>'+h(filename)+'</title></head><body style="font-family:Arial,sans-serif;padding:36px;line-height:1.45;color:#111827">'+inner+'</body></html>'],{type:'text/html;charset=utf-8'});
    var a=document.createElement('a');
    a.href=URL.createObjectURL(blob);
    a.download=filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }
  function downloadText(filename,content,type){
    var blob=new Blob([content],{type:type||'text/plain;charset=utf-8'});
    var a=document.createElement('a');
    a.href=URL.createObjectURL(blob);a.download=filename;a.click();URL.revokeObjectURL(a.href);
  }
  function input(label,id,value,type,span){
    return '<label class="masif-ref-field '+(span||'')+'"><span>'+h(label)+'</span><input id="'+h(id)+'" type="'+(type||'text')+'" value="'+h(value||'')+'"></label>';
  }
  function select(label,id,value,opts,span){
    return '<label class="masif-ref-field '+(span||'')+'"><span>'+h(label)+'</span><select id="'+h(id)+'">'+opts.map(function(o){return '<option '+(o===value?'selected':'')+'>'+h(o)+'</option>';}).join('')+'</select></label>';
  }
  function text(label,id,value,rows,span){
    return '<label class="masif-ref-field '+(span||'')+'"><span>'+h(label)+'</span><textarea id="'+h(id)+'" rows="'+(rows||4)+'">'+h(value||'')+'</textarea></label>';
  }

  function openUtility(action){
    var p=project();
    var utility={
      sync:{title:'Sincronizar informacion',icon:'↥'},
      validate:{title:'Validacion de beneficiario',icon:'↗'},
      measure:{title:'Medicion de red y valvulas',icon:'▥'},
      influence:{title:'Area de influencia circular',icon:'○'},
      housing:{title:'Ficha de vivienda beneficiaria',icon:'⌂'}
    }[action]||{title:'Area de influencia circular',icon:'○'};
    var content='';
    if(action==='sync'){
      content='<div class="masif-ref-grid two">'+input('Codigo de agrupación','masifRefSyncProject',p.id||'')+input('Ultima sincronizacion','masifRefSyncLast',new Date().toLocaleString('es-PE'))+'<label class="masif-ref-field full"><span>Componentes a sincronizar</span><div class="masif-ref-checks"><label><input type="checkbox" checked> Beneficiarios</label><label><input type="checkbox" checked> Evidencias moviles</label><label><input type="checkbox" checked> Capas GIS</label><label><input type="checkbox" checked> Liquidaciones</label></div></label></div>';
    }else if(action==='validate'){
      content='<div class="masif-ref-grid two">'+input('DNI / C.U. beneficiario','masifRefDni','73984521')+select('Estado de validacion','masifRefValState','Validado en campo',['Pendiente','Validado en campo','Observado','No elegible'])+input('Titular','masifRefTitular','Usuario residencial FISE')+input('Celular','masifRefCelular','999 888 777')+text('Observacion de validacion','masifRefValObs','Se verifica vivienda, medidor, conexion interna y elegibilidad del beneficiario.',4,'full')+'</div>';
    }else if(action==='measure'){
      content='<div class="masif-ref-grid three">'+input('KM de red','masifRefKm','4.82')+input('Valvulas','masifRefValvulas','18')+input('Diametro nominal','masifRefDiametro','200 mm')+select('Material','masifRefMaterial','Polietileno PEAD',['Polietileno PEAD','Acero','PVC','Otro'])+select('Tipo de tramo','masifRefTramo','Red proyectada',['Red proyectada','Red ejecutada','Conexion interna','Acometida'])+input('Costo estimado','masifRefCosto','US$ 98,291.11')+'</div>';
    }else if(action==='housing'){
      content='<div class="masif-ref-grid two">'+input('Viviendas beneficiarias','masifRefViviendas','100')+select('Tipo de vivienda','masifRefTipoVivienda','Residencial',['Residencial','Multifamiliar','Comercio menor','Mixto'])+input('Direccion referencial','masifRefDireccion','Mz. A Lt. 12 - Sector 010101')+select('Servicio actual','masifRefServicio','GLP',['GLP','Lena','Electricidad','Sin servicio'])+'<label class="masif-ref-field full"><span>Checklist de vivienda</span><div class="masif-ref-checks"><label><input type="checkbox" checked> Fachada verificada</label><label><input type="checkbox" checked> Medidor registrado</label><label><input type="checkbox"> Conexion interna pendiente</label><label><input type="checkbox" checked> Georreferenciacion activa</label></div></label></div>';
    }else{
      content='<div class="masif-ref-grid two">'+input('Radio de influencia','masifRefRadio','500 m')+input('Area estimada','masifRefArea',p.area||'0.21 ha')+input('Beneficiarios dentro del area','masifRefBenef',p.beneficiarios||0)+select('Criterio territorial','masifRefCriterio','Area de influencia FISE',['Area de influencia FISE','Malla de concesion','Zona priorizada','Manzana censal'])+text('Resultado','masifRefResultado','El area de influencia permite identificar viviendas, beneficiarios potenciales, redes cercanas y priorizacion territorial para la masificacion de gas.',4,'full')+'</div>';
    }
    var m=modalShell('masifRefUtilityModal','<div class="masif-ref-card max-4xl"><div class="masif-ref-head"><div class="masif-ref-titleline"><div class="masif-ref-icon">'+utility.icon+'</div><div><h2>'+h(utility.title)+'</h2><p>Funcionalidad BONO_GAS_V1 integrada a la agrupación '+h(p.nombre||'seleccionado')+'.</p></div></div><button class="masif-ref-close" data-masif-close>x</button></div><div class="masif-ref-panel">'+content+'</div><div class="masif-ref-actions"><button class="masif-ref-btn slate" data-masif-close>Cancelar</button><button class="masif-ref-btn blue" id="masifRefSaveUtil">Guardar modulo</button><button class="masif-ref-btn cyan" id="masifRefSendUtil">Enviar a bandeja</button></div></div>');
    q('masifRefSaveUtil').onclick=function(){toast(utility.title+' guardado');};
    q('masifRefSendUtil').onclick=function(){toast(utility.title+' enviado a bandeja');m.remove();};
  }

  function renderLiq(){
    var tbody=q('masifRefLiqRows');
    if(!tbody)return;
    var pct=Number(q('masifRefPct')?.value||60);
    var isTotal=!!q('masifRefTotalCheck')?.checked;
    var amountHead=document.querySelector('#masifRefLiquidacionModal .masif-ref-table thead th:nth-child(8)');
    if(amountHead)amountHead.textContent=isTotal?'Monto Total (US$)':'Monto Parcial '+pct+'% (US$)';
    tbody.innerHTML=liqItems.map(function(it,i){
      var base=Number(it.cantidad||0)*Number(it.costoUnitario||0);
      var liquidado=base*pct/100;
      return '<tr><td><input data-liq-row="'+i+'" data-liq-key="codigoVNR" value="'+h(it.codigoVNR)+'"></td><td><textarea data-liq-row="'+i+'" data-liq-key="partida" rows="3">'+h(it.partida)+'</textarea></td><td><input class="mini" data-liq-row="'+i+'" data-liq-key="unidad" value="'+h(it.unidad)+'"></td><td><input class="num" type="number" step="0.01" data-liq-row="'+i+'" data-liq-key="cantidad" value="'+h(it.cantidad)+'"></td><td><input class="num" type="number" step="0.000001" data-liq-row="'+i+'" data-liq-key="costoUnitario" value="'+h(it.costoUnitario)+'"></td><td><input data-liq-row="'+i+'" data-liq-key="objetoGIS" value="'+h(it.objetoGIS||'')+'" placeholder="ID GIS"></td><td><select data-liq-row="'+i+'" data-liq-key="vinculacion"><option '+(it.vinculacion==='GIS vinculado'?'selected':'')+'>GIS vinculado</option><option '+(it.vinculacion!=='GIS vinculado'?'selected':'')+'>Sin vinculo</option></select></td><td class="masif-ref-amount">'+money(liquidado,6)+'</td><td><button class="masif-ref-mini danger" data-liq-remove="'+i+'">Eliminar</button></td></tr>';
    }).join('');
    var subtotal=liqItems.reduce(function(s,it){return s+Number(it.cantidad||0)*Number(it.costoUnitario||0);},0);
    var igv=subtotal*.18;
    var total=subtotal+igv;
    var parcial=total*pct/100;
    q('masifRefSubtotal').textContent=money(subtotal,6);
    q('masifRefIgv').textContent=money(igv,6);
    q('masifRefTotal').textContent=money(total,6);
    q('masifRefTransferir').textContent=money(total,6);
    q('masifRefParcial').textContent=money(parcial,2);
    q('masifRefParcialLabel').textContent=isTotal?'Liquidación Total (100%)':'Liquidación Parcial ('+pct+'%)';
    var linked=liqItems.filter(function(it){return it.objetoGIS&&it.vinculacion==='GIS vinculado';}).length;
    if(q('masifRefGisSummary'))q('masifRefGisSummary').textContent=linked+' de '+liqItems.length+' partidas vinculadas con objetos espaciales GIS';
  }
  function openLiquidacion(){
    var p=project();
    modalShell('masifRefLiquidacionModal','<div class="masif-ref-card max-7xl tall"><div class="masif-ref-head"><div><h2>Liquidaciones</h2><p>Liquidacion de inversiones en bienes de capital con recursos FISE.</p></div><button class="masif-ref-close" data-masif-close>x</button></div><div class="masif-ref-panel"><div class="masif-ref-center"><p>ANEXO 1: LIQUIDACION DE LAS INVERSIONES EN BIENES DE CAPITAL CON RECURSOS DEL FISE</p><h3>PARA EL SUMINISTRO DE GAS NATURAL DE USUARIOS RESIDENCIALES EN LA CONCESION DE</h3><strong id="masifRefConcesionTitle">LIMA Y CALLAO</strong><span>Reporte de Transferencia - Malla Codigo N° PPEO-25-0594 CL-SECTOR-000100-MALLA-000</span></div><div class="masif-ref-grid five">'+input('Codigo de agrupación','masifRefProyecto',p.id||'')+input('Codigo de malla','masifRefMalla','PPEO-25-0594 CL-SECTOR-000100-MALLA-000','text','span2')+input('Concesion','masifRefConcesion','LIMA Y CALLAO')+input('Fecha','masifRefFecha',new Date().toISOString().slice(0,10),'date')+input('% Liquidacion parcial','masifRefPct','60','number')+'</div></div><div class="masif-ref-toolbar"><div><h3>Reporte de Agrupación - Codigo N° <span id="masifRefProyectoTitle">'+h(p.id||'----')+'</span></h3><p id="masifRefExcelMsg"></p><p id="masifRefGisSummary"></p></div><div><button class="masif-ref-btn slate" id="masifRefTemplate">Descargar formato</button><label class="masif-ref-btn green">Subir Excel (.xls / .xlsx)<input id="masifRefExcel" type="file" accept=".xls,.xlsx" hidden></label><button class="masif-ref-btn cyan" id="masifRefAddItem">+ Agregar partida</button></div></div><div class="masif-ref-table-wrap"><table class="masif-ref-table"><thead><tr><th>Codigo del VNR</th><th>Partida</th><th>Unidad</th><th>Cantidad</th><th>Tarifa Osinergmin (US$)</th><th>Objeto GIS</th><th>Vinculacion GIS</th><th>Monto Parcial (US$)</th><th>Accion</th></tr></thead><tbody id="masifRefLiqRows"></tbody></table></div><div class="masif-ref-bottom"><div class="masif-ref-panel">'+text('Observaciones / validacion','masifRefObs','',8)+'</div><div class="masif-ref-summary"><h4>Resumen de liquidacion</h4><table><tr><td>TOTAL SIN RETENCION</td><td id="masifRefSubtotal"></td></tr><tr><td>IGV (18%)</td><td id="masifRefIgv"></td></tr><tr><td>TOTAL CON IGV</td><td id="masifRefTotal"></td></tr><tr><td>Total Monto a Transferir al Concesionario</td><td id="masifRefTransferir"></td></tr><tr><td id="masifRefParcialLabel">Liquidacion Parcial (60%)</td><td class="emerald" id="masifRefParcial"></td></tr></table><div class="masif-ref-actions two"><button class="masif-ref-btn slate" id="masifRefDraft">Guardar borrador</button><button class="masif-ref-btn cyan" id="masifRefGenLiq">Generar liquidacion</button></div></div></div></div>');
    renderLiq();
    var pctField=q('masifRefPct').closest('.masif-ref-field');
    if(pctField&&!q('masifRefTotalCheck')){
      pctField.insertAdjacentHTML('afterend','<label class="masif-ref-total-check"><input id="masifRefTotalCheck" type="checkbox"><span><b>Liquidación total</b><small>Aplicar el 100% del monto calculado</small></span></label>');
    }
    q('masifRefPct').oninput=function(){q('masifRefParcialLabel').textContent='Liquidación Parcial ('+(this.value||0)+'%)';renderLiq();};
    q('masifRefTotalCheck').onchange=function(){
      var pct=q('masifRefPct');
      pct.disabled=this.checked;
      pct.value=this.checked?100:60;
      var pctLabel=pctField&&pctField.querySelector(':scope > span');
      if(pctLabel)pctLabel.textContent=this.checked?'% Liquidación total':'% Liquidación parcial';
      q('masifRefParcialLabel').textContent=this.checked?'Liquidación Total (100%)':'Liquidación Parcial (60%)';
      renderLiq();
    };
    q('masifRefConcesion').oninput=function(){q('masifRefConcesionTitle').textContent=this.value;};
    q('masifRefProyecto').oninput=function(){q('masifRefProyectoTitle').textContent=this.value||'----';};
    q('masifRefAddItem').onclick=function(){liqItems.push({codigoVNR:'',partida:'',unidad:'m',cantidad:0,costoUnitario:0,objetoGIS:'',vinculacion:'Sin vinculo'});renderLiq();};
    q('masifRefTemplate').onclick=function(){downloadText('formato_liquidacion_masificacion.csv','Codigo VNR;Partida;Unidad;Cantidad;Tarifa Osinergmin;Objeto GIS;Vinculacion GIS\n010210010101;Tuberia PEAD;m;100;123.17185;TRON-001;GIS vinculado','text/csv;charset=utf-8');};
    q('masifRefExcel').onchange=function(e){var f=e.target.files&&e.target.files[0];var msg=q('masifRefExcelMsg');if(!f)return;var ext=(f.name.split('.').pop()||'').toLowerCase();if(['xls','xlsx'].indexOf(ext)<0){msg.className='bad';msg.textContent='Formato no permitido. Solo se aceptan .xls y .xlsx.';e.target.value='';return;}if(!window.XLSX){msg.className='bad';msg.textContent='No fue posible iniciar el lector Excel.';return;}var reader=new FileReader();reader.onload=function(ev){try{var book=XLSX.read(ev.target.result,{type:'array'});var rows=XLSX.utils.sheet_to_json(book.Sheets[book.SheetNames[0]],{header:1,defval:''});var imported=rows.slice(1).filter(function(r){return r.some(function(v){return String(v).trim();});}).map(function(r){return {codigoVNR:String(r[0]||''),partida:String(r[1]||''),unidad:String(r[2]||'m'),cantidad:Number(r[3]||0),costoUnitario:Number(r[4]||0),objetoGIS:String(r[5]||''),vinculacion:String(r[6]||'Sin vinculo')};});if(!imported.length)throw new Error('sin filas');liqItems=imported;renderLiq();msg.className='ok';msg.textContent=imported.length+' partidas importadas desde '+f.name+'.';}catch(err){msg.className='bad';msg.textContent='El Excel no contiene partidas validas. Use el formato descargable.';}};reader.readAsArrayBuffer(f);};
    q('masifRefDraft').onclick=function(){toast('Borrador de liquidacion guardado');};
    q('masifRefGenLiq').onclick=function(){toast('Liquidacion generada');downloadHtml('liquidacion-masificacion.html',q('masifRefLiquidacionModal').querySelector('.masif-ref-card').innerHTML);};
    q('masifRefLiqRows').addEventListener('input',function(e){var el=e.target;var i=Number(el.dataset.liqRow);var key=el.dataset.liqKey;if(!key||!liqItems[i])return;liqItems[i][key]=(key==='cantidad'||key==='costoUnitario')?Number(el.value):el.value;renderLiq();});
    q('masifRefLiqRows').addEventListener('click',function(e){var b=e.target.closest('[data-liq-remove]');if(!b)return;liqItems.splice(Number(b.dataset.liqRemove),1);renderLiq();});
  }

  function docDefaults(){
    var p=project();
    return {
      numeroInforme:'0218-2026/FISE',
      numeroResolucion:'RD-2026/FISE',
      destinatario:'Director Ejecutivo - FISE',
      remitentes:'Analista Tecnico - FISE; Especialista Tecnico - FISE; Coordinador de Masificacion de Gas Natural - FISE; Coordinador de Finanzas - FISE; Especialista Legal - FISE',
      asunto:'Liquidacion Parcial FISE - Redes de la agrupación '+(p.nombre||'seleccionado'),
      referencia:'Expediente N° I-10512-2024',
      lugarFecha:'08 de abril de 2026',
      concesionario:'Gas Natural de Lima y Callao S.A.',
      convenio:'Convenio para ejecutar las inversiones en bienes de capital con recursos del FISE para el suministro de gas natural de usuarios residenciales',
      monto:'US$ 98,291.11',
      malla:'PPE0-25-0594 CIE-SECTOR-000100-MALLA-000',
      objetivo:'Sustentar técnica y legalmente la Liquidación Parcial FISE - Redes correspondiente al proyecto '+(p.nombre||'seleccionado')+', verificando la documentación presentada por el concesionario, las partidas valorizadas, la información geoespacial y el monto solicitado para transferencia.',
      baseLegal:'2.1 Ley N° 29852, Ley que crea el Sistema de Seguridad Energética en Hidrocarburos y el Fondo de Inclusión Social Energético - FISE.\n2.2 Decreto Supremo N° 021-2012-EM, Reglamento de la Ley N° 29852.\n2.3 Resolución Viceministerial N° 035-2023-MINEM/VMH, que aprueba el procedimiento que regula los desembolsos referidos a proyectos de inversiones en bienes de capital financiados con recursos del FISE.\n2.4 Resolución Directoral N° 123-2021-MINEM/DGH, que aprueba el procedimiento de priorización y ejecución de inversiones en bienes de capital para el suministro de gas natural de usuarios residenciales.\n2.5 Ley N° 32315, que establece medidas para impulsar la masificación del gas natural.',
      antecedentes:'3.1 El artículo 5 de la Ley N° 29852 establece que los recursos del FISE se destinan, entre otros fines, a la masificación del uso del gas natural mediante el financiamiento parcial o total de conexiones y redes de distribución.\n3.2 El FISE y '+(p.concesionario||'el concesionario de distribución')+' suscribieron el convenio para ejecutar inversiones en bienes de capital destinadas al suministro de gas natural de usuarios residenciales.\n3.3 El concesionario presentó la solicitud de transferencia correspondiente al proyecto '+(p.id||'FISE-2026-001')+' y la malla PPE0-25-0594 CIE-SECTOR-000100-MALLA-000.\n3.4 La documentación técnica, económica y geoespacial fue registrada en SATCONTROL para su evaluación y trazabilidad.',
      analisis:'4.1 Se verificó la identificación del proyecto, ubicación, área de influencia, cobertura, beneficiarios y documentación sustentatoria presentada por el concesionario.\n4.2 Se revisaron las partidas, cantidades, unidades y tarifas Osinergmin asociadas a sus respectivos códigos VNR.\n4.3 Se validó la vinculación de las partidas con los objetos espaciales GIS correspondientes a la troncal, ramales, válvulas y redes del proyecto.\n4.4 La liquidación se calculó aplicando el porcentaje registrado en el módulo de Liquidaciones sobre el monto total valorizado, incluido el IGV cuando corresponde.\n4.5 De la revisión técnica, económica, documental y geoespacial no se advierten observaciones críticas que impidan continuar con el trámite de aprobación.\n4.6 El monto referencial a transferir asciende a US$ 98,291.11, sujeto a la validación financiera y legal final.',
      conclusiones:'5.1 El concesionario cumplió con presentar la documentación requerida para evaluar la Liquidación Parcial FISE - Redes.\n5.2 Las partidas y cantidades se encuentran valorizadas mediante códigos VNR y tarifas referenciales Osinergmin, con vinculación a la información espacial del proyecto.\n5.3 La información evaluada permite sustentar la aprobación de la liquidación correspondiente al proyecto '+(p.nombre||'seleccionado')+'.\n5.4 El monto resultante deberá transferirse conforme al porcentaje aprobado y al detalle consignado en el cuadro de liquidación.',
      recomendaciones:'6.1 Aprobar la Liquidación Parcial FISE - Redes a favor del concesionario para el proyecto y la malla indicados.\n6.2 Emitir la Resolución de Dirección Ejecutiva correspondiente y disponer la publicación del presente Informe Técnico Legal en el portal institucional del FISE.\n6.3 Remitir el oficio de instrucción al fiduciario para efectuar la transferencia conforme con el monto aprobado.\n6.4 Registrar el informe, la resolución y la constancia de transferencia en la trazabilidad digital del expediente.',
      visto:'El Informe Técnico Legal N° 0218-2026/FISE, que sustenta la Liquidación Parcial FISE - Redes para el concesionario '+(p.concesionario||'Gas Natural de Lima y Callao S.A.')+', por la ejecución de inversiones en bienes de capital financiadas con recursos del FISE.',
      considerando:'Que, mediante la Ley N° 29852, se crea el Sistema de Seguridad Energética en Hidrocarburos y el Fondo de Inclusión Social Energético - FISE, cuyos recursos se destinan, entre otros fines, a la masificación del uso del gas natural.\nQue, conforme al Reglamento de la Ley N° 29852, el FISE puede financiar nuevas inversiones en bienes de capital no incluidas en los compromisos del contrato de concesión, siempre que los usuarios a conectar sean mayoritariamente residenciales.\nQue, el procedimiento que regula los desembolsos de proyectos financiados con recursos del FISE dispone que, luego de verificar la solicitud y su documentación sustentatoria, corresponde elaborar y aprobar la Liquidación Parcial mediante Resolución de Dirección Ejecutiva.\nQue, el concesionario presentó la solicitud de transferencia, las partidas valorizadas mediante códigos VNR, las evidencias y la información geoespacial vinculada a la malla '+(p.malla||'PPE0-25-0594 CIE-SECTOR-000100-MALLA-000')+'.\nQue, mediante el Informe Técnico Legal N° 0218-2026/FISE se concluyó que la documentación técnica, económica y legal permite continuar con la aprobación de la Liquidación Parcial FISE - Redes.',
      articulo1:'Aprobar la Liquidación Parcial FISE - Redes correspondiente a '+(p.nombre||'la agrupación seleccionada')+', código '+(p.id||'FISE-2026-001')+', según el monto consignado en el Informe Técnico Legal N° 0218-2026/FISE.',
      articulo2:'Disponer la publicación de la presente resolución y del Informe Técnico Legal N° 0218-2026/FISE, que forma parte integrante de esta, en el portal institucional del FISE.',
      articulo3:'Remitir el oficio de instrucción al fiduciario para que realice la transferencia a favor del concesionario, conforme con el detalle y las condiciones señaladas en el Informe Técnico Legal.'
    };
  }
  function readDoc(){var ids=['numeroInforme','numeroResolucion','destinatario','remitentes','asunto','referencia','lugarFecha','concesionario','convenio','monto','malla','objetivo','baseLegal','antecedentes','analisis','conclusiones','recomendaciones','visto','considerando','articulo1','articulo2','articulo3'];var d={};ids.forEach(function(k){d[k]=q('masifRefDoc_'+k)?.value||'';});return d;}
  function docSection(label,key,rows){var d=docDefaults();return text(label,'masifRefDoc_'+key,d[key],rows||4);}
  function lines(s){return h(s).split('\n').filter(Boolean).map(function(x){return '<p>'+x+'</p>';}).join('');}
  function renderDoc(){
    var d=readDoc();
    q('masifRefDocStatus').textContent=docSent?'Enviado a bandeja':docSigned?'Firmado electronicamente':docSavedAt?'Guardado':'Borrador';
    q('masifRefDocPreview').innerHTML=activeDocView==='informe'
      ? '<div class="masif-ref-paper"><div class="paper-head"><div><p>FISE - Fondo de Inclusion Social Energetico</p><h2>INFORME TECNICO LEGAL N° '+h(d.numeroInforme)+'</h2></div><b>FISE</b></div><p><b>A:</b> '+h(d.destinatario)+'</p><p><b>De:</b> '+h(d.remitentes)+'</p><p><b>Asunto:</b> '+h(d.asunto)+'</p><p><b>Referencia:</b> '+h(d.referencia)+'</p><p><b>Fecha:</b> '+h(d.lugarFecha)+'</p><h3>1. OBJETIVO</h3><p>'+h(d.objetivo)+'</p><h3>2. BASE LEGAL</h3>'+lines(d.baseLegal)+'<h3>3. ANTECEDENTES</h3>'+lines(d.antecedentes)+'<h3>4. ANALISIS</h3>'+lines(d.analisis)+'<h3>5. CONCLUSIONES</h3>'+lines(d.conclusiones)+'<h3>6. RECOMENDACIONES</h3>'+lines(d.recomendaciones)+signatureHtml()+'</div>'
      : '<div class="masif-ref-paper"><div class="paper-head"><div><p>FISE - Fondo de Inclusión Social Energético</p><h2>RESOLUCIÓN DE DIRECCIÓN EJECUTIVA N° '+h(d.numeroResolucion)+'</h2></div><b>FISE</b></div><p class="right">Lima, '+h(d.lugarFecha)+'</p><h3>VISTO:</h3><p>'+h(d.visto)+'</p><h3>CONSIDERANDO:</h3>'+lines(d.considerando)+'<h3>SE RESUELVE:</h3><p><b>Artículo 1.-</b> '+h(d.articulo1)+'</p><p><b>Artículo 2.-</b> '+h(d.articulo2)+'</p><p><b>Artículo 3.-</b> '+h(d.articulo3)+'</p><p><b>Regístrese y comuníquese.</b></p>'+signatureHtml()+'</div>';
  }
  function signatureHtml(){return '<div class="paper-sign"><div><b>Responsable tecnico</b><p>'+h(project().lider||'Oliver Gonzales')+'</p><small>SATCONTROL - Paulet</small></div><div class="'+(docSigned?'signed':'pending')+'">'+(docSigned?'FIRMADO DIGITALMENTE':'PENDIENTE DE FIRMA')+'</div></div>';}
  function setDocView(view){activeDocView=view;document.querySelectorAll('[data-doc-view]').forEach(function(b){b.classList.toggle('active',b.dataset.docView===view);});q('masifRefInformeFields').hidden=view!=='informe';q('masifRefResolFields').hidden=view!=='resolucion';renderDoc();}
  function registerDoc(state){var d=readDoc();savedDocs.unshift({codigo:activeDocView==='informe'?d.numeroInforme:d.numeroResolucion,tipo:activeDocView==='informe'?'Informe Tecnico Legal':'Resolucion de Direccion Ejecutiva',estado:state,fecha:new Date().toLocaleString('es-PE'),asunto:d.asunto});q('masifRefSavedDocs').innerHTML=savedDocs.map(function(x){return '<div class="doc-tray-row"><div><b>'+h(x.codigo)+'</b><span>'+h(x.asunto)+' - '+h(x.estado)+'</span></div><small>'+h(x.fecha)+'</small></div>';}).join('');}
  function vnrSummaryHtml(){
    var total=liqItems.reduce(function(s,it){return s+Number(it.cantidad||0)*Number(it.costoUnitario||0);},0);
    return '<div class="masif-ref-panel"><h3>Calculo automatico VNR / Osinergmin</h3><p>Partidas y cantidades extraidas de la liquidacion y enlazadas con la informacion espacial GIS.</p><div class="masif-ref-table-wrap"><table class="masif-ref-table"><thead><tr><th>Codigo VNR</th><th>Partida</th><th>Cantidad</th><th>Tarifa</th><th>Objeto GIS</th><th>Subtotal</th></tr></thead><tbody>'+liqItems.map(function(it){return '<tr><td>'+h(it.codigoVNR)+'</td><td>'+h(it.partida)+'</td><td>'+h(it.cantidad)+' '+h(it.unidad)+'</td><td>'+money(it.costoUnitario,6)+'</td><td>'+h(it.objetoGIS||'Sin vinculo')+'</td><td>'+money(Number(it.cantidad||0)*Number(it.costoUnitario||0),2)+'</td></tr>';}).join('')+'</tbody><tfoot><tr><th colspan="5">Total valorizado</th><th>'+money(total,2)+'</th></tr></tfoot></table></div></div>';
  }
  function exportDocWord(){renderDoc();downloadText((activeDocView==='informe'?readDoc().numeroInforme:readDoc().numeroResolucion)+'.doc','<!doctype html><html><head><meta charset="utf-8"></head><body>'+q('masifRefDocPreview').innerHTML+vnrSummaryHtml()+'</body></html>','application/msword');toast('Documento Word exportado');}
  function exportDocPdf(){
    var ctor=window.jspdf&&window.jspdf.jsPDF;
    if(!ctor){toast('El generador PDF no esta disponible');return;}
    var d=readDoc(),pdf=new ctor({orientation:'portrait',unit:'mm',format:'a4'}),y=18,maxY=275;
    function newPage(){pdf.addPage();y=18;}
    function write(value,opts){opts=opts||{};pdf.setFont('helvetica',opts.bold?'bold':'normal');pdf.setFontSize(opts.size||9);var parts=pdf.splitTextToSize(String(value||''),opts.width||180);var lineH=opts.lineH||4.6;if(y+parts.length*lineH>maxY)newPage();pdf.text(parts,opts.align==='center'?105:15,y,{align:opts.align||'left'});y+=parts.length*lineH+(opts.after||2);}
    write('FONDO DE INCLUSIÓN SOCIAL ENERGÉTICO - FISE',{bold:true,size:9,align:'center'});
    write(activeDocView==='informe'?'INFORME TÉCNICO LEGAL N° '+d.numeroInforme:'RESOLUCIÓN DE DIRECCIÓN EJECUTIVA N° '+d.numeroResolucion,{bold:true,size:14,align:'center',after:5});
    if(activeDocView==='informe'){
      write('A: '+d.destinatario,{bold:true});write('DE: '+d.remitentes);write('ASUNTO: '+d.asunto,{bold:true});write('REFERENCIA: '+d.referencia);write('FECHA: '+d.lugarFecha,{after:5});
      [['1. OBJETIVO',d.objetivo],['2. BASE LEGAL',d.baseLegal],['3. ANTECEDENTES',d.antecedentes],['4. ANÁLISIS',d.analisis],['5. CONCLUSIONES',d.conclusiones],['6. RECOMENDACIONES',d.recomendaciones]].forEach(function(s){write(s[0],{bold:true,size:10});write(s[1],{after:3});});
    }else{
      write('Lima, '+d.lugarFecha,{align:'right',after:5});write('VISTO:',{bold:true,size:10});write(d.visto,{after:4});write('CONSIDERANDO:',{bold:true,size:10});String(d.considerando).split('\n').filter(Boolean).forEach(function(x){write(x,{after:3});});write('SE RESUELVE:',{bold:true,size:10});write('Artículo 1.- '+d.articulo1,{after:3});write('Artículo 2.- '+d.articulo2,{after:3});write('Artículo 3.- '+d.articulo3,{after:5});write('Regístrese y comuníquese.',{bold:true});
    }
    write('__________________________________',{align:'center',after:0});write(project().lider||'Oliver Gonzales',{bold:true,align:'center',after:0});write(activeDocView==='informe'?'Responsable técnico FISE':'Director Ejecutivo FISE (d.t.)',{align:'center'});
    pdf.save((activeDocView==='informe'?d.numeroInforme:d.numeroResolucion)+'.pdf');toast('Documento PDF exportado');
  }
  function openInforme(){
    var d=docDefaults();
    modalShell('masifRefInformeModal','<div class="masif-ref-card max-7xl tall"><div class="masif-ref-head"><div><h2>Informes tecnicos y resoluciones</h2><p>Plantilla tipo FISE: Informe Tecnico Legal + Resolucion de Direccion Ejecutiva, con firma, exportacion y bandeja.</p></div><div class="masif-ref-top-actions"><button class="masif-ref-btn slate" id="masifRefWordDoc">Word</button><button class="masif-ref-btn cyan" id="masifRefPdfDoc">PDF</button><button class="masif-ref-iconbtn" id="masifRefSaveDoc" title="Guardar">💾</button><button class="masif-ref-iconbtn green" id="masifRefSignDoc" title="Firmar electronicamente">✓</button><button class="masif-ref-iconbtn cyan" id="masifRefExportDoc" title="Exportar HTML">⬇</button><button class="masif-ref-iconbtn blue" id="masifRefTrayDoc" title="Enviar a bandeja">▣</button><button class="masif-ref-close" data-masif-close>x</button></div></div><div class="masif-ref-doc-layout"><aside class="masif-ref-panel"><h3>Datos del expediente</h3><div class="masif-ref-tabs"><button data-doc-view="informe" class="active">Informe Tecnico Legal</button><button data-doc-view="resolucion">Resolucion</button></div>'+input('N° Informe Tecnico Legal','masifRefDoc_numeroInforme',d.numeroInforme)+input('N° Resolucion de Direccion Ejecutiva','masifRefDoc_numeroResolucion',d.numeroResolucion)+input('Destinatario','masifRefDoc_destinatario',d.destinatario)+text('Remitentes','masifRefDoc_remitentes',d.remitentes,3)+input('Asunto','masifRefDoc_asunto',d.asunto)+input('Referencia','masifRefDoc_referencia',d.referencia)+input('Lugar y fecha','masifRefDoc_lugarFecha',d.lugarFecha)+input('Concesionario','masifRefDoc_concesionario',d.concesionario)+input('Convenio','masifRefDoc_convenio',d.convenio)+input('Monto','masifRefDoc_monto',d.monto)+input('Malla','masifRefDoc_malla',d.malla)+'<div class="masif-ref-status">Estado: <b id="masifRefDocStatus">Borrador</b></div></aside><section class="masif-ref-doc-main"><div id="masifRefInformeFields">'+docSection('1. Objetivo','objetivo',3)+docSection('2. Base legal','baseLegal',6)+docSection('3. Antecedentes','antecedentes',6)+docSection('4. Analisis','analisis',6)+docSection('5. Conclusiones','conclusiones',5)+docSection('6. Recomendaciones','recomendaciones',4)+'</div><div id="masifRefResolFields" hidden>'+docSection('Visto','visto',3)+docSection('Considerando','considerando',7)+docSection('Articulo 1','articulo1',2)+docSection('Articulo 2','articulo2',2)+docSection('Articulo 3','articulo3',2)+'</div>'+vnrSummaryHtml()+'<h3>Vista previa</h3><div id="masifRefDocPreview"></div><div class="doc-tray"><div class="doc-tray-head"><h3>Documentos guardados</h3></div><div id="masifRefSavedDocs" class="doc-tray-rows"></div></div></section></div></div>');
    document.querySelectorAll('#masifRefInformeModal input,#masifRefInformeModal textarea').forEach(function(el){el.addEventListener('input',renderDoc);});
    document.querySelectorAll('[data-doc-view]').forEach(function(b){b.addEventListener('click',function(){setDocView(b.dataset.docView);});});
    q('masifRefSaveDoc').onclick=function(){docSavedAt=new Date().toLocaleString('es-PE');registerDoc('Guardado');renderDoc();toast('Documento guardado');};
    q('masifRefSignDoc').onclick=function(){docSigned=true;docSavedAt=docSavedAt||new Date().toLocaleString('es-PE');registerDoc('Firmado electronicamente');renderDoc();toast('Documento firmado');};
    q('masifRefTrayDoc').onclick=function(){docSent=true;docSavedAt=docSavedAt||new Date().toLocaleString('es-PE');registerDoc('Enviado a bandeja');renderDoc();toast('Documento enviado a bandeja');};
    q('masifRefExportDoc').onclick=function(){renderDoc();downloadHtml((activeDocView==='informe'?readDoc().numeroInforme:readDoc().numeroResolucion)+'.html',q('masifRefDocPreview').innerHTML);toast('Documento exportado');};
    q('masifRefWordDoc').onclick=exportDocWord;
    q('masifRefPdfDoc').onclick=exportDocPdf;
    setDocView('informe');
  }

  document.addEventListener('click',function(e){
    var btn=e.target.closest&&e.target.closest('#masifUtilsDock [data-masif-action]');
    if(!btn)return;
    e.preventDefault();
    e.stopImmediatePropagation();
    var action=btn.getAttribute('data-masif-action');
    document.querySelectorAll('#masifUtilsDock [data-masif-action]').forEach(function(x){x.classList.remove('active');});
    document.querySelectorAll('#masifUtilsDock .masif-floating-tool').forEach(function(x){x.classList.remove('active');});
    btn.classList.add('active');
    if(action==='liquidacion')openLiquidacion();
    else if(action==='informeTecnico')openInforme();
    else if(action==='filters'){
      var frame=document.getElementById('masificacionFrame');
      var win=frame&&frame.contentWindow;
      if(win&&typeof win.openMasifMapFilters==='function')win.openMasifMapFilters();
    }else openUtility(action);
  },true);
})();

function placeIntegratedModuleUtils(moduleName){
  /* Neutralizado — el sistema pu-compact/pu-floating gestiona la posición del dock.
     No se sobreescriben estilos inline para no romper is-pinned ni pu-floating. */
}

window.addEventListener('resize',function(){
  var active=qs('.main.vale-fise-mode')?'vale':qs('.main.ahorro-gnv-mode')?'gnv':qs('.main.fotovoltaico-mode')?'fotovoltaico':qs('.main.electricidad-mode')?'electricidad':qs('.main.masificacion-mode')?'masificacion':qs('.main.mcter-mode')?'mcter':'';
  if(active)placeIntegratedModuleUtils(active);
});

function setupUtilsCarousel(dockSelector,moreSelector,pageSize){
  var dock=qs(dockSelector),more=qs(moreSelector);
  if(!dock||!more)return;
  var size=pageSize||5;
  var buttons=Array.from(dock.querySelectorAll('.util-btn')).filter(function(btn){
    return !btn.classList.contains('more')&&!btn.classList.contains('pin');
  });
  if(!buttons.length)return;
  dock.classList.remove('extras-open');
  dock.dataset.utilPage=dock.dataset.utilPage||'0';
  function render(){
    var page=Math.max(0,parseInt(dock.dataset.utilPage||'0',10)||0);
    var pages=Math.max(1,Math.ceil(buttons.length/size));
    page=((page%pages)+pages)%pages;
    dock.dataset.utilPage=String(page);
    buttons.forEach(function(btn,idx){
      btn.classList.toggle('util-page-hidden',idx<page*size||idx>=page*size+size);
    });
    Array.from(dock.querySelectorAll('.util-separator')).forEach(function(sep){sep.classList.add('util-page-hidden');});
    more.setAttribute('aria-pressed',pages>1?'true':'false');
    more.title=pages>1?'Ver utilitarios '+(page+1)+'/'+pages:'Utilitarios';
    more.setAttribute('aria-label',more.title);
  }
  // [fix] Carousel paging on the `more` button disabled — caused duplicate
  // listeners that conflicted with the extras-open toggle. The expand/collapse
  // is now handled by a single toggle elsewhere.
  dock.dataset.utilPage='0';
  // Ensure no leftover hidden-by-page classes from older runs
  buttons.forEach(function(btn){btn.classList.remove('util-page-hidden');});
  Array.from(dock.querySelectorAll('.util-separator')).forEach(function(sep){sep.classList.remove('util-page-hidden');});
}

function initProjectUtilsDock(){
  buildProyectosModuleToolsHub();
  wireProyectosModuleToolProxies();
  setProjectUtilsPinned(true);
  enableProjectUtilsDrag();
  enableBonogasUtilsDrag();
  /* El carrusel pu-compact (tools-flow-override) reemplaza setupUtilsCarousel + extras-open */
  if(!window.__toolsFlowOverride){
    setupUtilsCarousel('#projectUtilsDock','#utilMoreBtn',5);
    setupUtilsCarousel('#bonogasUtilsDock','#bonoUtilMoreBtn',5);
  }
  if(!window.__toolsFlowOverride){
  (function(){
    const more=qs('#utilMoreBtn');
    if(!more||more.dataset.toggleBound)return;
    more.dataset.toggleBound='true';
    more.addEventListener('click',(e)=>{
      e.preventDefault();
      e.stopPropagation();
      const dock=qs('#projectUtilsDock');
      const opened=!!dock?.classList.toggle('extras-open');
      more.setAttribute('aria-pressed',opened?'true':'false');
      more.title=opened?'Volver a utilitarios principales':'Ver mas utilitarios';
      more.setAttribute('aria-label',more.title);
    });
  })();
  }
  qs('#bonoUtilSelectToolBtn')?.addEventListener('click',()=>setMapTool('select'));
  qs('#bonoUtilMeasureToolBtn')?.addEventListener('click',()=>setMapTool('measure'));
  qs('#bonoUtilPolygonToolBtn')?.addEventListener('click',()=>setMapTool('polygon'));
  qs('#bonoUtilCircleToolBtn')?.addEventListener('click',()=>setMapTool('circle'));
  if(!window.__toolsFlowOverride){
  (function(){
    const more=qs('#bonoUtilMoreBtn');
    if(!more||more.dataset.toggleBound)return;
    more.dataset.toggleBound='true';
    more.addEventListener('click',(e)=>{
      e.preventDefault();
      e.stopPropagation();
      const dock=qs('#bonogasUtilsDock');
      const opened=!!dock?.classList.toggle('extras-open');
      more.setAttribute('aria-pressed',opened?'true':'false');
      more.title=opened?'Volver a utilitarios principales':'Ver mas utilitarios';
      more.setAttribute('aria-label',more.title);
    });
  })();
  }
  qs('#utilLocationBtn')?.addEventListener('click',focusCurrentProjectLocation);
  qs('#utilModulesBtn')?.addEventListener('click',()=>showToast('Módulos de la agrupación disponibles'));
  qs('#utilSelectToolBtn')?.addEventListener('click',()=>setMapTool('select'));
  qs('#utilMeasureToolBtn')?.addEventListener('click',()=>setMapTool('measure'));
  qs('#utilPolygonToolBtn')?.addEventListener('click',()=>setMapTool('polygon'));
  qs('#utilCircleToolBtn')?.addEventListener('click',()=>setMapTool('circle'));
  qs('#bimUploadBtn')?.addEventListener('click',()=>qs('#bimFileInput')?.click());
  qs('#bimFileInput')?.addEventListener('change',e=>{
    const file=e.target.files?.[0];
    if(file)showToast('Archivo BIM seleccionado: '+file.name);
  });
  qs('#projectDocUploadBtn')?.addEventListener('click',()=>qs('#projectDocInput')?.click());
  qs('#projectDocInput')?.addEventListener('change',e=>{
    const file=e.target.files?.[0];
    if(file){
      pendingProjectFile=file;
      qs('#projectDocFileName').textContent=file.name;
      showToast((projectFilesMode==='images'?'Imagen seleccionada: ':'Documento seleccionado: ')+file.name);
    }
  });
  qs('#projectDocSaveBtn')?.addEventListener('click',saveProjectUploadedFile);
  qs('#confirmDeleteProjectPdfBtn')?.addEventListener('click',()=>{
    const rows=currentProjectFilesRows();
    const idx=rows.findIndex(row=>row.id===pendingProjectFileDeleteId);
    if(idx>=0)rows.splice(idx,1);
    pendingProjectFileDeleteId=null;
    renderProjectFilesRows();
    closeModal('deleteProjectPdfModal');
    showToast(projectFilesMode==='images'?'Imagen eliminada':'PDF eliminado');
  });
  bindGeoJsonUploadWorkflowButtons();
}
function initProjectUtilsDockWhenReady(){
  if(!qs('#projectUtilsDock') && !qs('#bonogasUtilsDock')) return;
  if(!window.__projectUtilsDockInited){
    window.__projectUtilsDockInited = true;
    initProjectUtilsDock();
  }else{
    bindGeoJsonUploadWorkflowButtons();
  }
}
window.initProjectUtilsDockWhenReady = initProjectUtilsDockWhenReady;
initEvidenceImages();
initIntegratedModuleUtils();
initFloatingChat();
bindBonogasLiquidationUtility();
bindBonogasReportsUtility();
renderProjectEvidences(currentProject());qs('#createBtn')?.addEventListener('click',()=>openProjectModal());qs('#docsBtn')?.addEventListener('click',()=>openModal('docsModal'));qs('#liquidationBtn')?.addEventListener('click',openLiquidationModal);qs('#reportsBtn')?.addEventListener('click',openReportsModal);qsa('#docType,#docProject,#docNumber,#docSigner,#docSubject,#docSupport,#docConclusion').forEach(el=>el?.addEventListener('input',()=>refreshDocPreview()));qs('#docPreviewBtn')?.addEventListener('click',()=>{refreshDocPreview();showToast('Vista previa actualizada')});qs('#clearSignatureBtn')?.addEventListener('click',clearSignatureCanvas);qs('#docSignBtn')?.addEventListener('click',registerDocumentSignature);qs('#docSendTrayBtn')?.addEventListener('click',sendDocumentToTray);['#liqFinanciado','#liqSubsidio','#liqDerecho','#liqAcometida','#liqPenalidad','#liqEstado'].forEach(id=>qs(id)?.addEventListener('input',()=>updateLiquidationSummary()));qs('#liqCalcBtn')?.addEventListener('click',()=>{updateLiquidationSummary('Preliquidación');showToast('Liquidación calculada')});qs('#liqGenerateBtn')?.addEventListener('click',()=>{if(qs('#liqEstado'))qs('#liqEstado').value='Lista para validación';addLiquidationLog('Liquidación generada');showToast('Liquidación generada y registrada')});qs('#liqPayOrderBtn')?.addEventListener('click',()=>{if(qs('#liqEstado'))qs('#liqEstado').value='Orden de pago emitida';addLiquidationLog('Orden de pago emitida');showToast('Orden de pago emitida')});qs('#liqAttachBtn')?.addEventListener('click',()=>showToast('Sustento adjuntado a la liquidación'));qs('#liqExportBtn')?.addEventListener('click',()=>showToast('Reporte de liquidación exportado'));qs('#syncAppsBtn')?.addEventListener('click',()=>openModal('syncAppsModal'));qs('#validateSyncBtn')?.addEventListener('click',validateSyncConnection);qs('#syncNowBtn')?.addEventListener('click',syncTargetNow);document.addEventListener('click',e=>{const syncBtn=e.target.closest('[data-sync-app]');if(syncBtn)simulateAppSync(syncBtn.dataset.syncApp);const checkBtn=e.target.closest('[data-check-app]');if(checkBtn)checkSyncDifferences(checkBtn.dataset.checkApp);});qs('#profileBtn')?.addEventListener('click',function(){if(window.openProfilePage)window.openProfilePage();});qs('#navSolicitudes')?.addEventListener('click',openSolicitudesEnvironment);qs('#navValidaciones')?.addEventListener('click',openValidacionesEnvironment);qs('#backSatcontrolBtn')?.addEventListener('click',closeSolicitudesEnvironment);qs('#backSatcontrolValidationBtn')?.addEventListener('click',closeSolicitudesEnvironment);qs('#newSolicitudBtn')?.addEventListener('click',()=>{selectedSolicitudId='SOL-2026-0002';renderSolicitudes();selectSolicitud(selectedSolicitudId);showToast('Formulario de nueva solicitud preparado')});qs('#massValidateBtn')?.addEventListener('click',()=>{showToast('Validación masiva preparada para expedientes filtrados')});['#solSearch','#solEstadoFilter','#solDistritoFilter','#solOrigenFilter'].forEach(id=>qs(id)?.addEventListener('input',renderSolicitudes));['#valSearch','#valTipoFilter','#valRiskFilter','#valResponsableFilter'].forEach(id=>qs(id)?.addEventListener('input',renderValidaciones));qs('#uploadedBtn')?.addEventListener('click',()=>qs('#uploadedPop')?.classList.toggle('open'));qs('#aiRobotBtn')?.addEventListener('click',()=>openModal('aiAssistantModal'));qs('#aiSendBtn')?.addEventListener('click',()=>{const input=qs('#aiChatInput');handleAiQuery(input?.value||'');if(input)input.value='';});qs('#aiChatInput')?.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();qs('#aiSendBtn')?.click();}});qsa('[data-ai-query]').forEach(btn=>btn.addEventListener('click',()=>handleAiQuery(btn.dataset.aiQuery)));qsProyectos('#searchInput')?.addEventListener('input',renderProjects);qs('#locationSearchBtn')?.addEventListener('click',searchLocation);qs('#locationSearchInput')?.addEventListener('input',e=>{const value=e.target.value.trim();if(value.length>=2)renderLocationResults(localLocationMatches(value));else qs('#locationSearchResults')?.classList.remove('open');});qs('#locationSearchInput')?.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();searchLocation();}});qs('#mapasBtn')?.addEventListener('click',()=>toggleMapPanel('#mapsPanel','#mapasBtn'));qs('#capasBtn')?.addEventListener('click',()=>toggleMapPanel('#layersPanel','#capasBtn'));qs('#tematicosBtn')?.addEventListener('click',()=>toggleMapPanel('#themesPanel','#tematicosBtn'));qs('#sateliteBtn')?.addEventListener('click',toggleSatellitePanel);qsa('input[name="satelliteMode"]').forEach(radio=>radio.addEventListener('change',e=>setSatelliteLayerMode(e.target.value)));qs('#uploadLayerBtn')?.addEventListener('click',openUploadLayerWorkflow);qs('#chooseLayerFileBtn')?.addEventListener('click',()=>qs('#layerFileInput')?.click());qs('#layerFileInput')?.addEventListener('change',e=>{const file=e.target.files?.[0];if(!file)return;pendingLayerFile=file;const ext=getLayerExtension(file.name);qs('#selectedLayerFileName')&&(qs('#selectedLayerFileName').textContent=file.name);qs('#layerDetectedType')&&(qs('#layerDetectedType').value=friendlyLayerType(ext));if(qs('#layerDisplayName')&&!qs('#layerDisplayName').value)qs('#layerDisplayName').value=baseFilename(file.name);});qs('#confirmLayerUploadBtn')?.addEventListener('click',confirmLayerUpload);qs('#mapPanelToggleBtn')?.addEventListener('click',()=>{clearRightPanelForMapSelection(true);});qs('#compareMapBtn')?.addEventListener('click',()=>{if(leafletMap&&estratoLayer)leafletMap.fitBounds(estratoLayer.getBounds(),{padding:[40,40]});});qsa('input[name="baseMap"]').forEach(radio=>radio.addEventListener('change',e=>{clearSatelliteMode();setBaseLayer(e.target.value);closeMapPanels();showToast('Mapa base: '+e.target.parentElement.innerText.trim())}));['#layerEstrato','#layerBeneficiarios','#layerCobertura','#layerTroncal','#layerRamales','#layerConcesionaria','#layerMorosidad'].forEach(id=>qs(id)?.addEventListener('change',()=>{updateOverlayVisibility();showToast('Capas actualizadas')}));qs('#layerDistritos')?.addEventListener('change',e=>{toggleDistrictsFeature(e.target.checked);showToast(e.target.checked?'Capa Distritos activada':'Capa Distritos desactivada')});qs('#districtDepartmentSelect')?.addEventListener('change',()=>{selectedDistrictId=null;renderDistrictList();refreshDistrictLayer();});qs('#districtProvinceSelect')?.addEventListener('change',()=>{selectedDistrictId=null;renderDistrictList();refreshDistrictLayer();});qs('#closeDistrictsPanelBtn')?.addEventListener('click',()=>{const chk=qs('#layerDistritos');if(chk)chk.checked=false;toggleDistrictsFeature(false);});enableDistrictPanelDrag();renderDistrictList();document.addEventListener('click',e=>{const insideToolbar=e.target.closest('.gis-toolbar');const insidePanel=e.target.closest('.map-floating-panel');if(!insideToolbar&&!insidePanel)closeMapPanels();});const satelliteDateSelect=qs('#dateLayerSelect');
document.addEventListener('click',e=>{const button=e.target?.closest?.('#tematicosBtn');if(!button)return;e.preventDefault();e.stopImmediatePropagation();const panel=document.querySelector('#themesPanel');if(!panel)return;const wasOpen=panel.classList.contains('open');document.querySelectorAll('.map-floating-panel').forEach(item=>item.classList.remove('open'));document.querySelectorAll('.gis-toolbar .ge-action-btn').forEach(item=>item.classList.remove('active'));if(!wasOpen){panel.classList.add('open');button.classList.add('active');}},true);
document.addEventListener('change',e=>{if(e.target?.matches?.('#layerThemeValeDensity,#layerThemeGnvConsumption,#layerThemePhotovoltaic,#layerThemeMasification,#layerThemeElectricity,#layerThemeMcter')){updateOverlayVisibility();showToast('Capa temática actualizada');}});
qsa('input[name="baseMap"]').forEach(radio=>radio.addEventListener('change',e=>{
  if(e.target.value==='sat') openSatelliteIndicesPanel();
}));
qs('#closeSatellitePanelBtn')?.addEventListener('click',e=>{
  e.preventDefault();e.stopPropagation();qs('#satellitePanel')?.classList.remove('open');
});
if(satelliteDateSelect){
  satelliteDateSelect.onchange=e=>{
    if(activeSatelliteMode) refreshSatelliteAnalysisLayer();
    showToast('Fecha de análisis satelital: '+e.target.value);
  };
}qs('#closeTimelineBtn')?.addEventListener('click',()=>renderMapTimeline(null));qs('#timelineDockBottomBtn')?.addEventListener('click',()=>setTimelineDock('bottom'));qs('#timelineDockRightBtn')?.addEventListener('click',()=>setTimelineDock('right'));enableTimelineDrag();qsa('.ge-btn').forEach(btn=>btn.addEventListener('click',()=>{if(btn.id==='uploadLayerBtn')return;qsa('.ge-btn').forEach(x=>x.classList.remove('active'));btn.classList.add('active')}));qs('#selectToolBtn')?.addEventListener('click',()=>setMapTool('select'));qs('#measureToolBtn')?.addEventListener('click',()=>setMapTool('measure'));qs('#polygonToolBtn')?.addEventListener('click',()=>setMapTool('polygon'));qs('#circleToolBtn')?.addEventListener('click',()=>setMapTool('circle'));qs('#finishDrawBtn')?.addEventListener('click',finishDrawing);qs('#clearDrawBtn')?.addEventListener('click',clearDrawings);qsa('.chip-filter').forEach(btn=>btn.addEventListener('click',()=>{qsa('.chip-filter').forEach(x=>x.classList.remove('active'));btn.classList.add('active');currentStatsFilter=btn.dataset.filter;updateStatsByCurrentSelection();}));// qs('#exportExcelBtn')?.addEventListener('click',exportRightPanelExcel); // Reemplazado por modal exportación v1.1
qs('#valExportBtn')?.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();toggleValidationExportMenu();},{capture:true});qsa('[data-export-format]').forEach(btn=>btn.addEventListener('click',()=>exportValidationByFormat(btn.dataset.exportFormat)));document.addEventListener('click',e=>{if(!e.target.closest('#valExportDropdown'))toggleValidationExportMenu(false);});['#layerBenLiquidados','#layerBenPendLiquid','#layerBenConstrDentro','#layerBenConstrFuera'].forEach(id=>qs(id)?.addEventListener('change',()=>{updateOverlayVisibility();showToast('Subcapa de beneficiarios actualizada')}));qs('#notifyPlazoBtn')?.addEventListener('click',()=>showToast('Notificaciones enviadas a las empresas instaladoras fuera de plazo'));qs('#hospitalModuleBtn')?.addEventListener('click',openHospitalEnvironment);qs('#backToSatcontrolHospitalBtn')?.addEventListener('click',openSatcontrolView);qs('#hospitalRefreshBtn')?.addEventListener('click',()=>showToast('Simulación hospitalaria actualizada'));qs('#hospitalExportBtn')?.addEventListener('click',()=>showToast('Simulación hospitalaria exportada'));qs('#hospitalBatchBtn')?.addEventListener('click',()=>showToast('Lote hospitalario marcado como conforme'));function resizeMapAfterLayout(){if(typeof leafletMap!=='undefined'&&leafletMap){setTimeout(()=>leafletMap.invalidateSize(),280)}}
function updateCollapseIcons(){const app=qs('.app'),content=qs('.content'),sidebar=qs('.sidebar'),rail=qs('#bonogasCollapsedRail');if(!app||!content)return;const sidebarHidden=app.classList.contains('sidebar-hidden');if(sidebar)sidebar.classList.toggle('collapsed',sidebarHidden);if(rail){rail.classList.remove('open');rail.setAttribute('aria-hidden','true');}const menuBtn=qs('#toggleSidebarBtn');if(menuBtn){menuBtn.title=sidebarHidden?'Mostrar menú lateral':'Ocultar menú lateral';menuBtn.setAttribute('aria-label',menuBtn.title);}const leftHidden=content.classList.contains('left-hidden');const rightHidden=content.classList.contains('right-hidden');const sb2=qs('#toggleSidebarBtn2'),lp2=qs('#toggleProjectsBtn2'),rp2=qs('#toggleInfoBtn2'),mp=qs('#mapPanelToggleBtn'),sl=qs('#satProjectsToggle'),sr=qs('#satInfoToggle');if(sb2)sb2.textContent=sidebarHidden?'>':'<';if(lp2)lp2.textContent=leftHidden?'>':'<';if(rp2)rp2.textContent=rightHidden?'<':'>';if(sl){sl.title=leftHidden?'Mostrar agrupaciones':'Ocultar agrupaciones';sl.setAttribute('aria-label',sl.title);}if(sr){sr.title=rightHidden?'Mostrar panel derecho':'Ocultar panel derecho';sr.setAttribute('aria-label',sr.title);}if(mp)mp.classList.toggle('active',!rightHidden);}
function toggleSidebar(){const app=qs('.app'),sidebar=qs('.sidebar');app?.classList.toggle('sidebar-hidden');sidebar?.classList.toggle('collapsed',!!app?.classList.contains('sidebar-hidden'));updateCollapseIcons();resizeMapAfterLayout();showToast(app?.classList.contains('sidebar-hidden')?'Menú lateral oculto':'Menú lateral visible')}
function toggleProjects(){qs('.content')?.classList.toggle('left-hidden');updateCollapseIcons();resizeMapAfterLayout();showToast(qs('.content')?.classList.contains('left-hidden')?'Panel de agrupaciones oculto':'Panel de agrupaciones visible')}
function toggleInfo(){qs('.content')?.classList.toggle('right-hidden');updateCollapseIcons();resizeMapAfterLayout();showToast(qs('.content')?.classList.contains('right-hidden')?'Panel derecho oculto':'Panel derecho visible')}
window.toggleProjects=toggleProjects;
window.toggleInfo=toggleInfo;
function bindSatPanelToggles(){
  [['#satProjectsToggle','#toggleProjectsMapBtn',toggleProjects],['#satInfoToggle','#toggleInfoMapBtn',toggleInfo]].forEach(function(pair){
    pair.slice(0,2).forEach(function(sel){
      const el=qs(sel);
      if(!el||el.dataset.panelToggleBound==='1')return;
      el.dataset.panelToggleBound='1';
      el.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();pair[2]();});
    });
  });
  if(typeof updateCollapseIcons==='function')updateCollapseIcons();
}
window.bindSatPanelToggles=bindSatPanelToggles;
qs('#toggleSidebarBtn')?.addEventListener('click',toggleSidebar);qs('#toggleSidebarBtn2')?.addEventListener('click',toggleSidebar);qs('#toggleProjectsBtn2')?.addEventListener('click',toggleProjects);qs('#satProjectsToggle')?.addEventListener('click',toggleProjects);qs('#toggleInfoBtn2')?.addEventListener('click',toggleInfo);qs('#satInfoToggle')?.addEventListener('click',toggleInfo);
// Listeners para celdas del simulador de morosidad
qs('#simCellLow')?.addEventListener('click', () => triggerMorosityLayer('Baja'));
qs('#simCellMid')?.addEventListener('click', () => triggerMorosityLayer('Media'));
qs('#simCellHigh')?.addEventListener('click', () => triggerMorosityLayer('Alta'));
qs('#simCellCritical')?.addEventListener('click', () => triggerMorosityLayer('Crítica'));

function bootApp(){
  if(typeof window.wireShellModuleEvents==='function')window.wireShellModuleEvents();
  if(typeof window.__prepareUtilsDocks==='function') window.__prepareUtilsDocks();
  if(typeof window.initProjectUtilsDockWhenReady==='function') window.initProjectUtilsDockWhenReady();
  const mod=getSessionModule();
  applyModuleFilter(mod);
  if(!window.__moduleThematicOverlayWrapped){const baseUpdateOverlayVisibility=updateOverlayVisibility;updateOverlayVisibility=function(){ensureModuleThematicLayers();return baseUpdateOverlayVisibility();};window.__moduleThematicOverlayWrapped=true;}
  initLeafletMap();
  if(typeof bindMapDrawButtons==='function')bindMapDrawButtons();
  if(mod==='administrador'){
    renderAll();
    showSaunaProjectByDefault();
    setMapTool('select');
    updateStatsByCurrentSelection();
  }else{
    loadIntegratedModuleSources().then(function(){
      openModuleAfterLogin(mod);
    }).catch(function(){
      openModuleAfterLogin(mod);
    });
  }
  updateCollapseIcons();
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',function(){loadShellModules().then(bootApp).catch(bootApp);},{once:true});}else{loadShellModules().then(bootApp).catch(bootApp);}

const validationAiUploads={scorecard:[],dj:[]};
const validationAiSteps={scorecard:'upload',dj:'upload'};
function escapeAiText(value){return String(value??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function buildValidationAiAssessment(row,base){const v=base||validaciones[0]||{};const criteria=[{icon:'▥',title:'Foto Fachada',label:'Validación territorial',state:v.tipo==='Geoespacial'?'done':'warn',note:v.tipo==='Geoespacial'?'Coordenada compatible con portal de habilitaciones':'Revisar coherencia territorial y dirección'},{icon:'▤',title:'Gabinete / Medidor',label:'Lectura de rotulado OCR',state:v.tipo==='Técnica'?'done':(v.riesgo==='Alto'?'warn':'done'),note:v.riesgo==='Alto'?'OCR inconsistentes en gabinete o medidor':'Lectura OCR validada'},{icon:'◫',title:'Ambiente',label:'Ubicación del gasodoméstico',state:v.estado==='Conforme'?'done':'warn',note:v.estado==='Conforme'?'Ubicación adecuada y segura':'Verificar ambiente y ventilación'},{icon:'⬚',title:'Artefacto',label:'Conexión técnica operativa',state:v.avance>=88?'done':(v.avance>=60?'warn':'obs'),note:v.avance>=88?'Conexión operativa':'Requiere subsanación técnica'}];const alerts=[];if(v.riesgo==='Alto'||v.estado==='Observada'||row?.estado==='Observado')alerts.push('Revisión requerida: inconsistencia detectada entre evidencia, trazabilidad y estado administrativo.');if(v.avance<50||/sin firma/i.test(v.nota||''))alerts.push('Rechazo automático: falta firma del representante legal o soporte documental suficiente.');if(v.tipo==='Documental'&&v.avance<60)alerts.push('Rechazo automático: fotos borrosas o evidencia insuficiente para cerrar el expediente.');if(!alerts.length)alerts.push('Sin alertas críticas. El expediente puede continuar a validación administrativa.');return {criteria,alerts,status:row?.estado||'En revisión',summary:[{label:'Expediente',value:row?.id||'Sin expediente'},{label:'Beneficiario',value:row?.beneficiario||'Sin beneficiario'},{label:'Empresa',value:row?.empresa||'Sin empresa'},{label:'Distrito',value:row?.distrito||'Sin distrito'}]};}
function validationAiPhotoMarkup(prefix){const files=validationAiUploads[prefix]||[];const placeholders=[{label:'Fachada',note:'Pendiente de carga'},{label:'Gabinete',note:'Pendiente de carga'},{label:'Conexión',note:'Pendiente de carga'},{label:'DJ',note:'Pendiente de carga'}];if(files.length){return files.slice(0,4).map((file,idx)=>{const url=URL.createObjectURL(file);return `<div class="ai-photo-item"><div class="ai-photo-thumb"><img src="${url}" alt="${escapeAiText(file.name)}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit"></div><b>${escapeAiText(file.name)}</b><span>Foto cargada ${idx+1}</span></div>`;}).join('');}return placeholders.map(item=>`<div class="ai-photo-item"><div class="ai-photo-thumb"><svg class="svg-icon" aria-hidden="true"><use href="#i-camera"></use></svg></div><b>${item.label}</b><span>${item.note}</span></div>`).join('');}
function validationAiFilesMarkup(prefix){
  const files=validationAiUploads[prefix]||[];
  if(!files.length)return '<div class="ai-flow-file"><b>Sin archivos</b><span>Pendiente</span></div>';
  return files.slice(0,4).map((file,idx)=>`<div class="ai-flow-file"><b>${escapeAiText(file.name)}</b><span>Archivo ${idx+1}</span></div>`).join('');
}
function validationAiStepClass(current,step){
  const order={upload:1,analysis:2,results:3};
  if(current===step)return 'active';
  return order[current]>order[step]?'done':'';
}
function startValidationAiAnalysis(prefix,row,base){
  validationAiSteps[prefix]='analysis';
  renderValidationAiSections(row,base);
  setTimeout(()=>{validationAiSteps[prefix]='results';renderValidationAiSections(row,base);},950);
}
function resetValidationAiFlow(prefix,row,base){
  validationAiSteps[prefix]='upload';
  renderValidationAiSections(row,base);
}
function renderValidationAiPanel(prefix,title,subtitle,row,base){
  const card=qs('#'+prefix);
  if(!card)return;
  card.classList.add('compact-flow');
  const assessment=buildValidationAiAssessment(row,base);
  const files=validationAiUploads[prefix]||[];
  const step=validationAiSteps[prefix]||'upload';
  const statusText=step==='upload'?'Subir archivos':step==='analysis'?'Analizando':'Resultados';
  const resultsMarkup=`<div class="ai-flow-results"><div class="ai-results">${assessment.criteria.map(item=>`<div class="ai-result-row ${item.state==='warn'?'warn':'ok'}"><i>${item.state==='warn'?'!':'<svg class="svg-icon" aria-hidden="true"><use href="#i-check"></use></svg>'}</i><div><b>${escapeAiText(item.title)}</b><span>${escapeAiText(item.label)} · ${escapeAiText(item.note)}</span></div></div>`).join('')}</div><div class="ai-alert-stack">${assessment.alerts.map(alert=>`<div class="ai-alert-box"><svg class="svg-icon" aria-hidden="true"><use href="#i-alert"></use></svg><div><b>${escapeAiText(title)}</b><span>${escapeAiText(alert)}</span></div></div>`).join('')}</div><div class="ai-mini-stats"><div class="ai-mini-stat"><span>Expediente</span><b>${escapeAiText(assessment.summary[0].value)}</b></div><div class="ai-mini-stat"><span>Archivos</span><b>${files.length}</b></div><div class="ai-mini-stat"><span>Estado</span><b>${escapeAiText(assessment.status)}</b></div></div></div>`;
  const panelMarkup=step==='analysis'
    ? `<div class="ai-flow-panel"><div class="ai-flow-analyzing"><div class="ai-flow-spinner"></div><div><b>Analizando evidencia</b><span>Validando fotos, DJ y trazabilidad del expediente.</span></div></div></div>`
    : step==='results'
      ? `<div class="ai-flow-panel">${resultsMarkup}<div class="ai-flow-actions"><button class="ai-flow-btn secondary" type="button" data-validation-ai-reset="${prefix}">Volver a cargar</button></div></div>`
      : `<div class="ai-flow-panel"><div class="ai-flow-upload"><div><b>Subir archivos</b><span>Agrega fotos o documentos del expediente y luego presiona Continuar.</span><label class="ai-upload-btn" style="margin-top:10px">Cargar archivos<input type="file" accept="image/*,.pdf" multiple data-validation-ai-input="${prefix}"></label></div></div><div class="ai-flow-files">${validationAiFilesMarkup(prefix)}</div><div class="ai-flow-actions"><button class="ai-flow-btn secondary" type="button" data-validation-ai-clear="${prefix}">Limpiar</button><button class="ai-flow-btn" type="button" data-validation-ai-continue="${prefix}">Continuar</button></div></div>`;
  card.innerHTML=`<div class="ai-section-title"><div><h3>${escapeAiText(title)}</h3></div><span class="ai-badge">${escapeAiText(statusText)} · ${files.length} archivo${files.length===1?'':'s'}</span></div><div class="ai-flow-steps"><div class="ai-flow-step ${validationAiStepClass(step,'upload')}">1. Subir</div><div class="ai-flow-step ${validationAiStepClass(step,'analysis')}">2. Análisis</div><div class="ai-flow-step ${validationAiStepClass(step,'results')}">3. Resultados</div></div>${panelMarkup}`;
  const input=card.querySelector('[data-validation-ai-input="'+prefix+'"]');
  if(input){input.onchange=e=>{validationAiUploads[prefix]=Array.from(e.target.files||[]);validationAiSteps[prefix]='upload';renderValidationAiSections(row,base);};}
  card.querySelector('[data-validation-ai-continue="'+prefix+'"]')?.addEventListener('click',()=>startValidationAiAnalysis(prefix,row,base));
  card.querySelector('[data-validation-ai-reset="'+prefix+'"]')?.addEventListener('click',()=>resetValidationAiFlow(prefix,row,base));
  card.querySelector('[data-validation-ai-clear="'+prefix+'"]')?.addEventListener('click',()=>{validationAiUploads[prefix]=[];resetValidationAiFlow(prefix,row,base);});
}
function renderValidationAiSections(row,base){/* renderValidationAiPanel('validationScorecard','Scorecard de Validación IA','',row,base); */}
const selectValidacionOriginal=selectValidacion;
window.selectValidacion=function(id,toast=true){
  const result=selectValidacionOriginal(id,toast);
  if(String(id||'').startsWith('DJ-'))return result;
  const rows=window.paymentRows||[];
  const r=rows.find(x=>x.id===id)||rows[0];
  if(r){
    renderValidationAiSections(r,r.base||validaciones[0]);
    /* Buscar datos completos BONOGAS por nombre de beneficiario */
    const _nrm=function(v){return String(v||'').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu,'');};
    var bonogasData=(window._enrichedBeneficiarios||[]).find(function(d){return _nrm(d.beneficiario||'')=== _nrm(r.beneficiario||'');});
    if(!bonogasData&&typeof bonogasMapRows==='function'){
      bonogasData=bonogasMapRows().find(function(d){return _nrm(d.beneficiario||'')=== _nrm(r.beneficiario||'');});
    }
    if(bonogasData&&typeof openBeneficiaryPanel==='function')openBeneficiaryPanel(bonogasData);
  }
  return result;
};

// ===== NUEVAS FUNCIONALIDADES v1.1 =====

function toggleMapLegend(){const el=qs('#mapLegendFloat');const icon=qs('#legendToggleIcon');if(!el)return;el.classList.toggle('collapsed');if(icon)icon.textContent=el.classList.contains('collapsed')?'▸':'▾';}

function openBeneficiaryPanel(data){const d=normalizeSelectedRecord(data||{});const panel=qs('#beneficiaryPanel');if(!panel)return;qs('#bpSuministro').textContent=d.suministro||'-';qs('#bpInstalacion').textContent=d.instalacion||d.suministro||'-';qs('#bpBeneficiario').textContent=d.beneficiario||'-';qs('#bpTipo').textContent=d.tipoSuministro||'-';qs('#bpFechaReg').textContent=d.fechaRegistro||d.fechaInstalacion||'-';qs('#bpFechaHab').textContent=d.fechaHabilitacion||d.fechaInstalacion||'-';qs('#bpEstrato').textContent=d.estrato||'-';qs('#bpMaterial').textContent=d.materialInstalacion||'Cobre recocido y PEAD';qs('#bpEmpresa').textContent=d.empresaInstaladora||'-';qs('#bpAcometida').textContent=d.tipoAcometida||'Simple';qs('#bpMedidor').textContent=d.tipoMedidor||'Diafragma residencial G4';qs('#bpCosto').textContent=formatMoney(d.costoInstalacion||2540);qs('#bpSubsidio').textContent=(d.porcentajeSubsidio||72)+'%';qs('#bpFinanciado').textContent=formatMoney(d.montoFinanciado||1980);qs('#bpActivo').textContent=d.suministroActivo==='No'?'No':'Sí';qs('#bpCuota').textContent=formatMoney(d.cuotaMensual||68.50);qs('#bpPagadas').textContent=d.cuotasPagadas||2;qs('#bpPendientes').textContent=d.cuotasPendientes||10;qs('#bpPendiente').textContent=formatMoney(d.montoPendiente||0);const tl=qs('#bpTimeline');if(tl){tl.innerHTML=expedienteTimeline(d).map(s=>`<div style="display:flex;align-items:center;gap:8px;margin:4px 0"><span style="width:18px;height:18px;border-radius:50%;display:grid;place-items:center;font-size:10px;font-weight:950;background:${s.state==='done'?'#22c55e':s.state==='current'?'#0ea5e9':'#1f3156'};color:#fff">${s.icon}</span><div><b style="color:#f8fbff">${s.label}</b><div style="color:#93a4c7;font-size:10px">${s.date}</div></div></div>`).join('');}panel.classList.add('open');}
function closeBeneficiaryPanel(){qs('#beneficiaryPanel')?.classList.remove('open');}

function getSelectedFormats(){const checked=Array.from(document.querySelectorAll('input[name="exportFormat"]:checked'));return checked.map(i=>i.value);} 
function confirmExport(){const main=qs('.main');if(main&&main.classList.contains('masificacion-mode')){try{const masifWin=qs('#masificacionFrame')?.contentWindow;if(masifWin&&typeof masifWin.masifConfirmExport==='function'){masifWin.masifConfirmExport();return;}}catch(e){}}const formats=getSelectedFormats();let rows=[];const isValidations=main&&main.classList.contains('validations-mode');if(isValidations){rows=window.filteredPaymentRows||window.paymentRows||[];}else{const ctx=exportContextRecords();rows=ctx.records;}if(!rows||!rows.length){showToast('No hay registros para exportar');closeModal('exportModal');return;}if(!formats||formats.length===0){showToast('Seleccione al menos un formato para exportar');return;}const started=[];formats.forEach(format=>{if(format==='xlsx'){if(isValidations){exportFilteredValidaciones(rows,true);}else{exportRightPanelExcel();}started.push('XLSX');}else if(format==='csv'){exportToCSV(rows);started.push('CSV');}else if(format==='pdf'){exportToPDF(rows);started.push('PDF');}});showToast('Descargas iniciadas: '+started.join(', '));closeModal('exportModal');}
function exportToCSV(rows){const headers=['N° suministro','N° instalación','Beneficiario','Empresa instaladora','Estrato','Tipo de acometida','Tipo de medidor','Estado instalación','Monto subsidiado','Monto financiado','Cuotas pagadas','Cuotas pendientes','Monto pendiente de recaudación'];const esc=v=>`"${String(v??'').replace(/"/g,'""')}"`;const lines=[];if(isBonogasSatcontrolView()&&typeof window.bonogasExportMeta==='function'){const m=window.bonogasExportMeta();[['Fecha',m.fecha],['Estrato',m.estrato],['Empresa instaladora',m.empresa],['Concesionaria',m.concesionaria],['Registros',rows.length]].forEach(function(pair){lines.push(pair.map(function(c){return esc(c)}).join(','));});lines.push('');}lines.push(headers.join(','));rows.forEach(function(r){const d=deriveExportRecord(r);lines.push([esc(d.suministro),esc(d.numInst),esc(d.beneficiario),esc(d.empresaInstaladora),esc(d.estrato),esc(d.acometida),esc(d.medidor),esc(d.estadoInstalacion),d.montoSubsidiado,d.montoFinanciado,esc(d.cuotasPagadas),d.cuotasPendientes,d.montoPendiente].join(','));});const blob=new Blob([lines.join('\n')],{type:'text/csv;charset=utf-8;'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='BONO_GAS_export.csv';a.click();URL.revokeObjectURL(a.href);showToast('CSV descargado correctamente');}
function exportToPDF(rows){const {jsPDF}=window.jspdf;if(!jsPDF){showToast('Librería PDF no disponible');return;}const doc=new jsPDF({unit:'pt',format:'a4',orientation:'landscape'});const now=new Date().toLocaleString('es-PE');const fechaLine=isBonogasSatcontrolView()&&typeof window.bonogasExportFechaLine==='function'?window.bonogasExportFechaLine():('Generado: '+now);doc.setFillColor(255,255,255);doc.rect(0,0,doc.internal.pageSize.getWidth(),doc.internal.pageSize.getHeight(),'F');doc.setFillColor(14,165,233);doc.roundedRect(40,32,110,28,6,6,'F');doc.setTextColor(255,255,255);doc.setFontSize(11);doc.text('PAULET SPACE',48,50);doc.setTextColor(15,23,42);doc.setFontSize(16);doc.text('BONO GAS · Reporte de Recaudación',40,84);doc.setFontSize(10);doc.setTextColor(100,116,139);doc.text(fechaLine,40,100);doc.setDrawColor(56,189,248);doc.line(40,108,doc.internal.pageSize.getWidth()-40,108);const derived=rows.map(deriveExportRecord);const supplyHead=[['N° sumin.','N° instal.','Beneficiario','Empresa instaladora','Estrato','Acometida','Medidor','Estado']];const supplyBody=derived.map(d=>[d.suministro,d.numInst,d.beneficiario,d.empresaInstaladora,d.estrato,d.acometida,d.medidor,d.estadoInstalacion]);doc.setTextColor(15,23,42);doc.setFontSize(12);doc.text('Datos del Suministro',40,128);doc.autoTable({head:supplyHead,body:supplyBody,startY:136,theme:'grid',styles:{fillColor:[255,255,255],textColor:[15,23,42],fontSize:8,cellPadding:6},headStyles:{fillColor:[14,165,233],textColor:[255,255,255],fontStyle:'bold'},alternateRowStyles:{fillColor:[248,250,252]}});const y=doc.lastAutoTable.finalY+20;doc.setTextColor(15,23,42);doc.setFontSize(12);doc.text('Datos de Recaudación',40,y);const collectionHead=[['N° sumin.','Beneficiario','Monto subsidiado','Monto financiado','Cuotas pagadas','Cuotas pendientes','Pendiente recaudación']];const collectionBody=derived.map(d=>[d.suministro,d.beneficiario,formatMoney(d.montoSubsidiado),formatMoney(d.montoFinanciado),d.cuotasPagadas,d.cuotasPendientes,formatMoney(d.montoPendiente)]);doc.autoTable({head:collectionHead,body:collectionBody,startY:y+8,theme:'grid',styles:{fillColor:[255,255,255],textColor:[15,23,42],fontSize:8,cellPadding:6},headStyles:{fillColor:[14,165,233],textColor:[255,255,255],fontStyle:'bold'},alternateRowStyles:{fillColor:[248,250,252]}});doc.save('BONO_GAS_reporte.pdf');showToast('PDF descargado correctamente');}
function exportToHTML(rows){const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));const now=new Date().toLocaleString('es-PE');const p=(typeof currentProject==='function')?currentProject():{};const metaLine=isBonogasSatcontrolView()&&typeof window.bonogasExportMeta==='function'?(function(){const m=window.bonogasExportMeta();return 'Estrato: '+esc(m.estrato)+' · Empresa: '+esc(m.empresa)+' · Concesionaria: '+esc(m.concesionaria)+' · Fecha: '+esc(m.fecha);})():('Agrupación: '+esc(p.nombre||'-')+' · Generado: '+esc(now));const derived=rows.map(deriveExportRecord);const supplyHead=['#','N° suministro','N° instalación','Beneficiario','Empresa instaladora','Estrato','Tipo de acometida','Tipo de medidor','Estado instalación'];const supplyRows=derived.map((d,i)=>`<tr><td>${i+1}</td><td>${esc(d.suministro)}</td><td>${esc(d.numInst)}</td><td>${esc(d.beneficiario)}</td><td>${esc(d.empresaInstaladora)}</td><td>${esc(d.estrato)}</td><td>${esc(d.acometida)}</td><td>${esc(d.medidor)}</td><td>${esc(d.estadoInstalacion)}</td></tr>`).join('');const collHead=['#','N° suministro','Beneficiario','Monto subsidiado','Monto financiado','Cuotas pagadas','Cuotas pendientes','Monto pendiente de recaudación'];const collRows=derived.map((d,i)=>`<tr><td>${i+1}</td><td>${esc(d.suministro)}</td><td>${esc(d.beneficiario)}</td><td>${esc(formatMoney(d.montoSubsidiado))}</td><td>${esc(formatMoney(d.montoFinanciado))}</td><td>${esc(d.cuotasPagadas)}</td><td>${esc(d.cuotasPendientes)}</td><td>${esc(formatMoney(d.montoPendiente))}</td></tr>`).join('');const html=`<!doctype html><html lang="es"><head><meta charset="utf-8"><title>BONO GAS · Reporte</title><style>body{font-family:Inter,Arial,sans-serif;background:#fff;color:#0f172a;margin:0;padding:32px}h1{margin:0 0 4px;font-size:22px}.meta{color:#64748b;font-size:13px;margin-bottom:24px}h2{font-size:15px;margin:24px 0 10px;padding:8px 12px;background:#0ea5e9;color:#fff;border-radius:6px}table{width:100%;border-collapse:collapse;font-size:13px;margin-bottom:8px}th,td{border:1px solid #cbd5e1;padding:8px 10px;text-align:left}th{background:#f1f5f9;font-weight:600}tr:nth-child(even) td{background:#f8fafc}.brand{display:inline-block;background:#0ea5e9;color:#fff;padding:4px 10px;border-radius:6px;font-weight:700;font-size:12px;margin-bottom:12px}</style></head><body><div class="brand">PAULET SPACE</div><h1>BONO GAS · Reporte de Recaudación</h1><div class="meta">${metaLine}</div><h2>Datos del Suministro</h2><table><thead><tr>${supplyHead.map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${supplyRows}</tbody></table><h2>Datos de Recaudación</h2><table><thead><tr>${collHead.map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${collRows}</tbody></table></body></html>`;const blob=new Blob([html],{type:'text/html;charset=utf-8;'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='BONO_GAS_reporte.html';a.click();URL.revokeObjectURL(a.href);showToast('HTML descargado correctamente');}

// Sobrescribir click del botón exportar principal — enlazado vía js/shared/shell-events.js tras carga de módulos
qs('#confirmExportBtn')?.addEventListener('click',confirmExport);

// Hook para abrir panel de beneficiario al seleccionar en mapa o tabla
const originalRenderSupplyDetails=renderSupplyDetails;
renderSupplyDetails=function(data){const full=data&&typeof isBonogasSatcontrolView==='function'&&isBonogasSatcontrolView()?resolveBonogasDetailRecord(data):data;originalRenderSupplyDetails(full);if(full&&typeof openBeneficiaryPanel==='function')openBeneficiaryPanel(full);};

// Agregar nuevos filtros visuales en panel derecho si existe
(function addNewFilters(){const statsFilters=qs('#statsFilters');if(!statsFilters)return;const newFiltersHtml=`<button class="chip-filter" data-filter="estadoBeneficiario">Estado beneficiario</button><button class="chip-filter" data-filter="empresaInstaladora">Empresa instaladora</button><button class="chip-filter" data-filter="tipoBeneficiario">Tipo beneficiario</button><button class="chip-filter" data-filter="fechaHabilitacion">Fecha habilitación</button><button class="chip-filter" data-filter="estrato">Estrato</button><button class="chip-filter" data-filter="estadoRecaudacion">Estado recaudación</button>`;statsFilters.insertAdjacentHTML('beforeend',newFiltersHtml);qsa('.chip-filter').forEach(btn=>btn.addEventListener('click',()=>{qsa('.chip-filter').forEach(x=>x.classList.remove('active'));btn.classList.add('active');currentStatsFilter=btn.dataset.filter;updateStatsByCurrentSelection();}));})();

// Datos ampliados de beneficiarios con campos nuevos
(function enrichData(){const estados=['Liquidado','Pendiente de liquidación','Dentro de plazo','Fuera de plazo'];const empresas=['Instalaciones del Norte S.A.C.','Gas & Hogar E.I.R.L.','Conexiones Seguras S.A.C.','Instalagas Perú S.A.C.','GasSur Instalaciones S.A.C.','TecnoGas Arequipa'];const materiales=['Cobre recocido y PEAD','Acero galvanizado','PVC alta presión','Cobre tipo L'];const acometidas=['Simple','Múltiple'];const medidores=['Diafragma residencial G4','Turbina industrial T10','Diafragma comercial G6','Ultrasónico U1'];window._enrichedBeneficiarios=(window._enrichedBeneficiarios||[]).concat([{suministro:'SUM-ARQ-0101',beneficiario:'María Quispe Huamán',tipoSuministro:'Residencial',estadoInstalacion:'Liquidado',lat:-16.3989,lng:-71.5350,empresaInstaladora:'Instalaciones del Norte S.A.C.',montoPendiente:0,costoInstalacion:2540,porcentajeSubsidio:72,montoFinanciado:1980,suministroActivo:'Sí',cuotaMensual:68.50,cuotasPagadas:12,cuotasPendientes:0,materialInstalacion:'Cobre recocido y PEAD',tipoAcometida:'Simple',tipoMedidor:'Diafragma residencial G4',fechaRegistro:'2024-08-15',fechaHabilitacion:'2025-01-20',estrato:'Bajo'},{suministro:'SUM-ARQ-0102',beneficiario:'José Mamani Flores',tipoSuministro:'Residencial',estadoInstalacion:'Pendiente de liquidación',lat:-16.4012,lng:-71.5325,empresaInstaladora:'Gas & Hogar E.I.R.L.',montoPendiente:820,costoInstalacion:2400,porcentajeSubsidio:68,montoFinanciado:1850,suministroActivo:'Sí',cuotaMensual:72,cuotasPagadas:8,cuotasPendientes:4,materialInstalacion:'Acero galvanizado',tipoAcometida:'Simple',tipoMedidor:'Diafragma residencial G4',fechaRegistro:'2024-09-10',fechaHabilitacion:'2025-02-14',estrato:'Bajo'},{suministro:'SUM-ARQ-0103',beneficiario:'Bodega San Lázaro',tipoSuministro:'Comercial',estadoInstalacion:'Dentro de plazo',lat:-16.3955,lng:-71.5400,empresaInstaladora:'Conexiones Seguras S.A.C.',montoPendiente:1540,costoInstalacion:3800,porcentajeSubsidio:55,montoFinanciado:3200,suministroActivo:'No',cuotaMensual:150,cuotasPagadas:2,cuotasPendientes:18,materialInstalacion:'Acero galvanizado',tipoAcometida:'Múltiple',tipoMedidor:'Diafragma comercial G6',fechaRegistro:'2025-01-05',fechaHabilitacion:'Pendiente de habilitación',estrato:'Medio'},{suministro:'SUM-ARQ-0104',beneficiario:'Rosa Condori Arias',tipoSuministro:'Residencial',estadoInstalacion:'Fuera de plazo',lat:-16.4020,lng:-71.5280,empresaInstaladora:'Instalagas Perú S.A.C.',montoPendiente:1200,costoInstalacion:2600,porcentajeSubsidio:70,montoFinanciado:2100,suministroActivo:'No',cuotaMensual:80,cuotasPagadas:4,cuotasPendientes:8,materialInstalacion:'Cobre tipo L',tipoAcometida:'Simple',tipoMedidor:'Diafragma residencial G4',fechaRegistro:'2024-11-20',fechaHabilitacion:'Pendiente de habilitación',estrato:'Bajo'},{suministro:'SUM-ARQ-0105',beneficiario:'Luis Apaza Quispe',tipoSuministro:'Residencial',estadoInstalacion:'Dentro de plazo',lat:-16.3970,lng:-71.5385,empresaInstaladora:'GasSur Instalaciones S.A.C.',montoPendiente:980,costoInstalacion:2500,porcentajeSubsidio:75,montoFinanciado:1900,suministroActivo:'Sí',cuotaMensual:65,cuotasPagadas:6,cuotasPendientes:6,materialInstalacion:'Cobre recocido y PEAD',tipoAcometida:'Simple',tipoMedidor:'Diafragma residencial G4',fechaRegistro:'2024-10-12',fechaHabilitacion:'2025-03-01',estrato:'Bajo'},{suministro:'SUM-ARQ-0106',beneficiario:'Elena Chávez Rojas',tipoSuministro:'Residencial',estadoInstalacion:'Liquidado',lat:-16.3995,lng:-71.5335,empresaInstaladora:'TecnoGas Arequipa',montoPendiente:0,costoInstalacion:2450,porcentajeSubsidio:73,montoFinanciado:1950,suministroActivo:'Sí',cuotaMensual:70,cuotasPagadas:12,cuotasPendientes:0,materialInstalacion:'PVC alta presión',tipoAcometida:'Simple',tipoMedidor:'Diafragma residencial G4',fechaRegistro:'2024-07-22',fechaHabilitacion:'2024-12-10',estrato:'Bajo'},{suministro:'SUM-LIM-0201',beneficiario:'Pedro Gálvez Rojas',tipoSuministro:'Comercial',estadoInstalacion:'Pendiente de liquidación',lat:-12.0464,lng:-77.0428,empresaInstaladora:'RedGas Perú S.A.C.',montoPendiente:640,costoInstalacion:3200,porcentajeSubsidio:60,montoFinanciado:2800,suministroActivo:'Sí',cuotaMensual:120,cuotasPagadas:10,cuotasPendientes:2,materialInstalacion:'Acero galvanizado',tipoAcometida:'Múltiple',tipoMedidor:'Diafragma comercial G6',fechaRegistro:'2024-06-18',fechaHabilitacion:'2024-11-30',estrato:'Medio'},{suministro:'SUM-LIM-0202',beneficiario:'Industrias del Sur S.A.C.',tipoSuministro:'Industrial',estadoInstalacion:'Fuera de plazo',lat:-12.0480,lng:-77.0450,empresaInstaladora:'Andes Gas Contratistas',montoPendiente:3200,costoInstalacion:8500,porcentajeSubsidio:40,montoFinanciado:7200,suministroActivo:'No',cuotaMensual:350,cuotasPagadas:3,cuotasPendientes:15,materialInstalacion:'Acero galvanizado',tipoAcometida:'Múltiple',tipoMedidor:'Turbina industrial T10',fechaRegistro:'2025-02-01',fechaHabilitacion:'Pendiente de habilitación',estrato:'Alto'},{suministro:'SUM-LIM-0203',beneficiario:'Ana María López',tipoSuministro:'Residencial',estadoInstalacion:'Dentro de plazo',lat:-12.0440,lng:-77.0400,empresaInstaladora:'Instalaciones del Norte S.A.C.',montoPendiente:1100,costoInstalacion:2550,porcentajeSubsidio:72,montoFinanciado:1980,suministroActivo:'Sí',cuotaMensual:68,cuotasPagadas:5,cuotasPendientes:7,materialInstalacion:'Cobre recocido y PEAD',tipoAcometida:'Simple',tipoMedidor:'Diafragma residencial G4',fechaRegistro:'2024-09-05',fechaHabilitacion:'2025-02-20',estrato:'Bajo'},{suministro:'SUM-LIM-0204',beneficiario:'Juan Pérez Quispe',tipoSuministro:'Residencial',estadoInstalacion:'Fuera de plazo',lat:-12.0500,lng:-77.0380,empresaInstaladora:'Gas & Hogar E.I.R.L.',montoPendiente:1350,costoInstalacion:2480,porcentajeSubsidio:70,montoFinanciado:1900,suministroActivo:'No',cuotaMensual:75,cuotasPagadas:3,cuotasPendientes:9,materialInstalacion:'Cobre tipo L',tipoAcometida:'Simple',tipoMedidor:'Diafragma residencial G4',fechaRegistro:'2024-08-30',fechaHabilitacion:'Pendiente de habilitación',estrato:'Bajo'},{suministro:'SUM-LIM-0205',beneficiario:'Comercial El Triunfo E.I.R.L.',tipoSuministro:'Comercial',estadoInstalacion:'Pendiente de liquidación',lat:-12.0420,lng:-77.0460,empresaInstaladora:'Conexiones Seguras S.A.C.',montoPendiente:890,costoInstalacion:3400,porcentajeSubsidio:58,montoFinanciado:2900,suministroActivo:'Sí',cuotaMensual:130,cuotasPagadas:9,cuotasPendientes:3,materialInstalacion:'PVC alta presión',tipoAcometida:'Múltiple',tipoMedidor:'Ultrasónico U1',fechaRegistro:'2024-05-14',fechaHabilitacion:'2024-10-22',estrato:'Medio'},{suministro:'SUM-LIM-0206',beneficiario:'Rosa Paredes Huamán',tipoSuministro:'Residencial',estadoInstalacion:'Liquidado',lat:-12.0475,lng:-77.0440,empresaInstaladora:'Instalagas Perú S.A.C.',montoPendiente:0,costoInstalacion:2520,porcentajeSubsidio:74,montoFinanciado:1960,suministroActivo:'Sí',cuotaMensual:69,cuotasPagadas:12,cuotasPendientes:0,materialInstalacion:'Cobre recocido y PEAD',tipoAcometida:'Simple',tipoMedidor:'Diafragma residencial G4',fechaRegistro:'2024-04-10',fechaHabilitacion:'2024-09-15',estrato:'Bajo'}]);})();

// Añadir registros extra para visualización en mapa (más dispersos geográficamente)
window._enrichedBeneficiarios=(window._enrichedBeneficiarios||[]).concat([
  {suministro:'SUM-EXT-0301',beneficiario:'Carlos Ruiz',tipoSuministro:'Residencial',estadoInstalacion:'Dentro de plazo',lat:-12.0505,lng:-77.0312,empresaInstaladora:'Instalaciones del Norte S.A.C.',montoPendiente:150,costoInstalacion:2400,porcentajeSubsidio:70,montoFinanciado:1680,suministroActivo:'Sí',cuotaMensual:68,cuotasPagadas:3,cuotasPendientes:9,materialInstalacion:'Cobre recocido y PEAD',tipoAcometida:'Simple',tipoMedidor:'Diafragma residencial G4',fechaRegistro:'2024-12-01',fechaHabilitacion:'2025-02-10',estrato:'Bajo'},
  {suministro:'SUM-EXT-0302',beneficiario:'María Torres',tipoSuministro:'Residencial',estadoInstalacion:'Pendiente de liquidación',lat:-8.1084,lng:-79.0215,empresaInstaladora:'GasSur Instalaciones S.A.C.',montoPendiente:760,costoInstalacion:2600,porcentajeSubsidio:65,montoFinanciado:1690,suministroActivo:'Sí',cuotaMensual:88,cuotasPagadas:4,cuotasPendientes:8,materialInstalacion:'Acero galvanizado',tipoAcometida:'Simple',tipoMedidor:'Diafragma residencial G4',fechaRegistro:'2025-01-12',fechaHabilitacion:'2025-03-05',estrato:'Medio'},
  {suministro:'SUM-EXT-0303',beneficiario:'Luis Herrera',tipoSuministro:'Comercial',estadoInstalacion:'Fuera de plazo',lat:-6.7714,lng:-79.8409,empresaInstaladora:'Conexiones Seguras S.A.C.',montoPendiente:1840,costoInstalacion:4200,porcentajeSubsidio:50,montoFinanciado:2100,suministroActivo:'No',cuotaMensual:140,cuotasPagadas:2,cuotasPendientes:18,materialInstalacion:'PVC alta presión',tipoAcometida:'Múltiple',tipoMedidor:'Diafragma comercial G6',fechaRegistro:'2024-11-02',fechaHabilitacion:'Pendiente',estrato:'Medio'},
  {suministro:'SUM-EXT-0304',beneficiario:'Ana Paredes',tipoSuministro:'Residencial',estadoInstalacion:'Liquidado',lat:-13.5319,lng:-71.9675,empresaInstaladora:'Instalagas Perú S.A.C.',montoPendiente:0,costoInstalacion:2500,porcentajeSubsidio:75,montoFinanciado:1875,suministroActivo:'Sí',cuotaMensual:72,cuotasPagadas:12,cuotasPendientes:0,materialInstalacion:'Cobre tipo L',tipoAcometida:'Simple',tipoMedidor:'Diafragma residencial G4',fechaRegistro:'2024-06-10',fechaHabilitacion:'2024-12-01',estrato:'Bajo'},
  {suministro:'SUM-EXT-0305',beneficiario:'Fernando Vega',tipoSuministro:'Residencial',estadoInstalacion:'Dentro de plazo',lat:-16.4090,lng:-71.5375,empresaInstaladora:'TecnoGas Arequipa',montoPendiente:420,costoInstalacion:2700,porcentajeSubsidio:68,montoFinanciado:1836,suministroActivo:'Sí',cuotaMensual:76,cuotasPagadas:5,cuotasPendientes:7,materialInstalacion:'Cobre recocido y PEAD',tipoAcometida:'Simple',tipoMedidor:'Diafragma residencial G4',fechaRegistro:'2024-09-20',fechaHabilitacion:'2025-01-18',estrato:'Medio'},
  {suministro:'SUM-EXT-0306',beneficiario:'Lucía Quispe',tipoSuministro:'Comercial',estadoInstalacion:'Pendiente de liquidación',lat:-5.1945,lng:-80.6328,empresaInstaladora:'RedGas Perú S.A.C.',montoPendiente:980,costoInstalacion:3300,porcentajeSubsidio:60,montoFinanciado:1980,suministroActivo:'No',cuotaMensual:120,cuotasPagadas:2,cuotasPendientes:16,materialInstalacion:'Acero galvanizado',tipoAcometida:'Múltiple',tipoMedidor:'Ultrasónico U1',fechaRegistro:'2025-02-05',fechaHabilitacion:'Pendiente',estrato:'Medio'},
  {suministro:'SUM-EXT-0307',beneficiario:'Pedro Salinas',tipoSuministro:'Residencial',estadoInstalacion:'Dentro de plazo',lat:-12.0464,lng:-77.0428,empresaInstaladora:'Lima Centro Gas',montoPendiente:210,costoInstalacion:2450,porcentajeSubsidio:70,montoFinanciado:1715,suministroActivo:'Sí',cuotaMensual:66,cuotasPagadas:4,cuotasPendientes:8,materialInstalacion:'Cobre recocido y PEAD',tipoAcometida:'Simple',tipoMedidor:'Diafragma residencial G4',fechaRegistro:'2024-10-08',fechaHabilitacion:'2025-02-12',estrato:'Bajo'},
  {suministro:'SUM-EXT-0308',beneficiario:'Rosa Medina',tipoSuministro:'Residencial',estadoInstalacion:'Liquidado',lat:-12.0475,lng:-77.0440,empresaInstaladora:'Instalagas Perú S.A.C.',montoPendiente:0,costoInstalacion:2520,porcentajeSubsidio:74,montoFinanciado:1960,suministroActivo:'Sí',cuotaMensual:69,cuotasPagadas:12,cuotasPendientes:0,materialInstalacion:'PVC alta presión',tipoAcometida:'Simple',tipoMedidor:'Diafragma residencial G4',fechaRegistro:'2024-05-02',fechaHabilitacion:'2024-10-15',estrato:'Bajo'},
  {suministro:'SUM-EXT-0309',beneficiario:'Javier López',tipoSuministro:'Comercial',estadoInstalacion:'Pendiente de liquidación',lat:-7.1636,lng:-78.5122,empresaInstaladora:'Cajamarca Gas',montoPendiente:560,costoInstalacion:2350,porcentajeSubsidio:69,montoFinanciado:1623,suministroActivo:'Sí',cuotaMensual:64,cuotasPagadas:5,cuotasPendientes:7,materialInstalacion:'Acero galvanizado',tipoAcometida:'Simple',tipoMedidor:'Diafragma residential G4',fechaRegistro:'2024-11-20',fechaHabilitacion:'Pendiente',estrato:'Medio'},
  {suministro:'SUM-EXT-0310',beneficiario:'Marta Ruiz',tipoSuministro:'Residencial',estadoInstalacion:'Fuera de plazo',lat:-9.9312,lng:-76.2428,empresaInstaladora:'Huanuco Gas',montoPendiente:980,costoInstalacion:2480,porcentajeSubsidio:71,montoFinanciado:1755,suministroActivo:'No',cuotaMensual:82,cuotasPagadas:2,cuotasPendientes:10,materialInstalacion:'Cobre recocido y PEAD',tipoAcometida:'Simple',tipoMedidor:'Diafragma residencial G4',fechaRegistro:'2025-01-11',fechaHabilitacion:'Pendiente',estrato:'Medio'},
  {suministro:'SUM-EXT-0311',beneficiario:'Angela Poma',tipoSuministro:'Residencial',estadoInstalacion:'Dentro de plazo',lat:-11.7765,lng:-75.2045,empresaInstaladora:'Chimbote Gas',montoPendiente:410,costoInstalacion:2100,porcentajeSubsidio:66,montoFinanciado:1386,suministroActivo:'Sí',cuotaMensual:58,cuotasPagadas:4,cuotasPendientes:8,materialInstalacion:'PVC alta presión',tipoAcometida:'Múltiple',tipoMedidor:'Ultrasónico U1',fechaRegistro:'2024-10-30',fechaHabilitacion:'2025-03-05',estrato:'Bajo'},
  {suministro:'SUM-EXT-0312',beneficiario:'Roberto Chunga',tipoSuministro:'Comercial',estadoInstalacion:'Dentro de plazo',lat:-3.7450,lng:-73.2536,empresaInstaladora:'Iquitos Gas S.A.C.',montoPendiente:200,costoInstalacion:2600,porcentajeSubsidio:68,montoFinanciado:1768,suministroActivo:'Sí',cuotaMensuales:72,cuotasPagadas:4,cuotasPendientes:8,materialInstalacion:'Cobre tipo L',tipoAcometida:'Simple',tipoMedidor:'Diafragma residencial G4',fechaRegistro:'2024-11-11',fechaHabilitacion:'2025-03-02',estrato:'Medio'},
  {suministro:'SUM-EXT-0313',beneficiario:'Patricia Salas',tipoSuministro:'Residencial',estadoInstalacion:'Pendiente de liquidación',lat:-15.8400,lng:-70.0195,empresaInstaladora:'Puno Instalaciones S.A.C.',montoPendiente:740,costoInstalacion:2500,porcentajeSubsidio:70,montoFinanciado:1750,suministroActivo:'No',cuotaMensual:75,cuotasPagadas:2,cuotasPendientes:10,materialInstalacion:'PVC alta presión',tipoAcometida:'Simple',tipoMedidor:'Diafragma residencial G4',fechaRegistro:'2024-09-03',fechaHabilitacion:'Pendiente',estrato:'Bajo'},
  {suministro:'SUM-EXT-0314',beneficiario:'Mario Esteban',tipoSuministro:'Residencial',estadoInstalacion:'Liquidado',lat:-18.0081,lng:-70.2464,empresaInstaladora:'Tacna Gas S.A.C.',montoPendiente:0,costoInstalacion:3300,porcentajeSubsidio:60,montoFinanciado:1980,suministroActivo:'Sí',cuotaMensual:110,cuotasPagadas:5,cuotasPendientes:11,materialInstalacion:'Acero galvanizado',tipoAcometida:'Múltiple',tipoMedidor:'Diafragma comercial G6',fechaRegistro:'2024-06-25',fechaHabilitacion:'2024-12-20',estrato:'Medio'},
  {suministro:'SUM-EXT-0315',beneficiario:'Verónica Luna',tipoSuministro:'Residencial',estadoInstalacion:'Dentro de plazo',lat:-12.0460,lng:-77.0300,empresaInstaladora:'Lima Centro Gas',montoPendiente:300,costoInstalacion:2450,porcentajeSubsidio:70,montoFinanciado:1715,suministroActivo:'Sí',cuotaMensual:66,cuotasPagadas:5,cuotasPendientes:7,materialInstalacion:'Cobre tipo L',tipoAcometida:'Simple',tipoMedidor:'Diafragma residencial G4',fechaRegistro:'2024-09-07',fechaHabilitacion:'2025-02-02',estrato:'Bajo'},
  {suministro:'SUM-EXT-0316',beneficiario:'Raul Vicente',tipoSuministro:'Residencial',estadoInstalacion:'Fuera de plazo',lat:-12.0485,lng:-77.0405,empresaInstaladora:'RedGas Perú S.A.C.',montoPendiente:1450,costoInstalacion:2600,porcentajeSubsidio:68,montoFinanciado:1768,suministroActivo:'No',cuotaMensual:77,cuotasPagadas:2,cuotasPendientes:10,materialInstalacion:'Acero galvanizado',tipoAcometida:'Simple',tipoMedidor:'Diafragma residencial G4',fechaRegistro:'2024-11-02',fechaHabilitacion:'Pendiente',estrato:'Medio'},
  {suministro:'SUM-EXT-0317',beneficiario:'Luz Mendez',tipoSuministro:'Residencial',estadoInstalacion:'Dentro de plazo',lat:-12.0505,lng:-77.0355,empresaInstaladora:'Conexiones Seguras S.A.C.',montoPendiente:0,costoInstalacion:2420,porcentajeSubsidio:72,montoFinanciado:1742,suministroActivo:'Sí',cuotaMensual:67,cuotasPagadas:8,cuotasPendientes:4,materialInstalacion:'Cobre recocido y PEAD',tipoAcometida:'Simple',tipoMedidor:'Diafragma residencial G4',fechaRegistro:'2024-08-18',fechaHabilitacion:'2024-12-30',estrato:'Bajo'},
  {suministro:'SUM-EXT-0318',beneficiario:'Óscar Poma',tipoSuministro:'Comercial',estadoInstalacion:'Pendiente de liquidación',lat:-12.0490,lng:-77.0455,empresaInstaladora:'Instalaciones del Norte S.A.C.',montoPendiente:620,costoInstalacion:3100,porcentajeSubsidio:60,montoFinanciado:1860,suministroActivo:'Sí',cuotaMensual:115,cuotasPagadas:9,cuotasPendientes:3,materialInstalacion:'Acero galvanizado',tipoAcometida:'Múltiple',tipoMedidor:'Diafragma comercial G6',fechaRegistro:'2024-07-01',fechaHabilitacion:'2024-11-25',estrato:'Medio'},
  {suministro:'SUM-EXT-0319',beneficiario:'Nora Delgado',tipoSuministro:'Residencial',estadoInstalacion:'Liquidado',lat:-12.0470,lng:-77.0420,empresaInstaladora:'Instalagas Perú S.A.C.',montoPendiente:0,costoInstalacion:2490,porcentajeSubsidio:73,montoFinanciado:1927,suministroActivo:'Sí',cuotaMensual:70,cuotasPagadas:12,cuotasPendientes:0,materialInstalacion:'PVC alta presión',tipoAcometida:'Simple',tipoMedidor:'Diafragma residencial G4',fechaRegistro:'2024-05-02',fechaHabilitacion:'2024-10-15',estrato:'Bajo'},
  {suministro:'SUM-EXT-0320',beneficiario:'Héctor Gonzales',tipoSuministro:'Residencial',estadoInstalacion:'Dentro de plazo',lat:-12.0488,lng:-77.0433,empresaInstaladora:'Gas & Hogar E.I.R.L.',montoPendiente:350,costoInstalacion:2380,porcentajeSubsidio:69,montoFinanciado:1647,suministroActivo:'Sí',cuotaMensual:65,cuotasPagadas:4,cuotasPendientes:8,materialInstalacion:'Cobre recocido y PEAD',tipoAcometida:'Simple',tipoMedidor:'Diafragma residencial G4',fechaRegistro:'2024-10-12',fechaHabilitacion:'2025-02-28',estrato:'Medio'}
]);

// Inicializar leyenda y estilos adicionales
document.addEventListener('DOMContentLoaded',function(){
  const style=document.createElement('style');
  style.textContent=''
    +'.modern-tooltip{background:rgba(13,22,48,.95)!important;border:1px solid rgba(56,189,248,.25)!important;border-radius:10px!important;color:#dbeafe!important;box-shadow:0 8px 24px rgba(0,0,0,.35)!important;padding:8px 10px!important;font-size:11px!important;font-weight:800!important;}'
    +'.layer-label{position:absolute;left:18px;right:auto;bottom:46px;top:auto;z-index:600;max-width:390px;background:#09101fdc;border:1px solid #334155;border-radius:16px;padding:10px 13px;color:#e2e8f0;font-size:11px;font-weight:950;box-shadow:0 8px 24px rgba(0,0,0,.24);backdrop-filter:blur(8px)!important;}'
    +'.heat-legend{position:absolute;left:18px;bottom:72px;z-index:640;transform:none;display:none;align-items:center;gap:10px;background:rgba(255,255,255,.96);color:#0f172a;border-radius:16px;padding:9px 12px;box-shadow:0 2px 8px rgba(0,0,0,.18),0 12px 28px rgba(0,0,0,.14);backdrop-filter:blur(10px)!important;font-size:11px;font-weight:900;}'
    +'.heat-legend.open{display:flex!important;}'
    +'.hospital-hidden{display:none!important}'
    +'#hospitalModuleBtn,#backToSatcontrolHospitalBtn,#hospitalRefreshBtn,#hospitalExportBtn,#hospitalBatchBtn{display:none!important}'
    +'.app.sidebar-hidden{grid-template-columns:0 minmax(0,1fr)!important;}'
    +'.app.sidebar-hidden .sidebar,.sidebar.collapsed{display:block!important;width:0!important;min-width:0!important;max-width:0!important;opacity:0!important;visibility:hidden!important;transform:none!important;overflow:hidden!important;border-right:0!important;box-shadow:none!important;pointer-events:none!important;}'
    +'.app.sidebar-hidden .sidebar *,.sidebar.collapsed *{display:none!important;opacity:0!important;visibility:hidden!important;pointer-events:none!important;}'
    +'.bonogas-collapsed-rail,.bonogas-collapsed-rail.open{display:none!important;opacity:0!important;visibility:hidden!important;pointer-events:none!important;}'
    +'/* Paulet Space final sidebar contrast */'
    +'.sidebar{background:linear-gradient(180deg,#081428 0%,#050b18 100%)!important;border-right:1px solid rgba(56,189,248,.16)!important;box-shadow:12px 0 34px rgba(0,0,0,.30)!important;}'
    +'.sidebar .nav-link{min-height:48px!important;border-radius:14px!important;background:transparent!important;border:1px solid transparent!important;color:#9eb4d3!important;}'
    +'.sidebar .nav-link:hover,.sidebar .nav-link.active{background:rgba(90,184,255,.14)!important;border-color:rgba(90,184,255,.26)!important;color:#f5f9ff!important;box-shadow:inset 0 0 0 1px rgba(137,209,255,.08)!important;}'
    +'.sidebar .nav-icon{color:#f5f9ff!important;text-shadow:0 0 16px rgba(90,184,255,.45)!important;filter:drop-shadow(0 0 8px rgba(90,184,255,.32))!important;}'
    +'.sidebar .nav-link.active .nav-icon{color:#89d1ff!important;filter:drop-shadow(0 0 10px rgba(137,209,255,.50))!important;}'
    +'.sidebar .nav-icon svg,.sidebar .nav-icon .svg-icon{stroke:#f5f9ff!important;color:#f5f9ff!important;opacity:1!important;visibility:visible!important;}'
    +'.sidebar .nav-link.active .nav-icon svg,.sidebar .nav-link.active .nav-icon .svg-icon{stroke:#89d1ff!important;color:#89d1ff!important;}'
    +'.app.sidebar-hidden .sidebar .nav-link,.sidebar.collapsed .nav-link{min-height:46px!important;border-radius:14px!important;background:rgba(255,255,255,.035)!important;}'
    +'.app.sidebar-hidden .sidebar .nav-link:hover,.app.sidebar-hidden .sidebar .nav-link.active,.sidebar.collapsed .nav-link:hover,.sidebar.collapsed .nav-link.active{background:rgba(90,184,255,.18)!important;border-color:rgba(137,209,255,.32)!important;}'
    +'.app.sidebar-hidden .sidebar .nav-icon,.sidebar.collapsed .nav-icon{color:#f5f9ff!important;filter:drop-shadow(0 0 10px rgba(90,184,255,.45))!important;}'
    +'.app.sidebar-hidden .sidebar .nav-icon svg,.app.sidebar-hidden .sidebar .nav-icon .svg-icon,.sidebar.collapsed .nav-icon svg,.sidebar.collapsed .nav-icon .svg-icon{stroke:#f5f9ff!important;color:#f5f9ff!important;}'
    +'.app.sidebar-hidden .sidebar .nav-link.active .nav-icon svg,.app.sidebar-hidden .sidebar .nav-link.active .nav-icon .svg-icon,.sidebar.collapsed .nav-link.active .nav-icon svg,.sidebar.collapsed .nav-link.active .nav-icon .svg-icon{stroke:#89d1ff!important;color:#89d1ff!important;}'
    +'.sidebar-nav .rail-icon{display:none;font-family:"Material Symbols Rounded";font-size:25px;line-height:1;font-variation-settings:"FILL" 0,"wght" 500,"GRAD" 0,"opsz" 24;}'
    +'.app.sidebar-hidden .sidebar-nav .nav-icon svg,.app.sidebar-hidden .sidebar-nav .nav-icon .svg-icon,.sidebar.collapsed .sidebar-nav .nav-icon svg,.sidebar.collapsed .sidebar-nav .nav-icon .svg-icon{display:none!important;opacity:0!important;visibility:hidden!important;}'
    +'.app.sidebar-hidden .sidebar-nav .rail-icon,.sidebar.collapsed .sidebar-nav .rail-icon{display:block!important;opacity:1!important;visibility:visible!important;color:#f8fbff!important;text-shadow:0 0 14px rgba(90,184,255,.55)!important;}'
    +'.app.sidebar-hidden .sidebar-nav .nav-link.active .rail-icon,.sidebar.collapsed .sidebar-nav .nav-link.active .rail-icon{color:#89d1ff!important;}'
    +'/* BonoGas v2: menu lateral cerrado totalmente */'
    +'.app.sidebar-hidden{grid-template-columns:0 minmax(0,1fr)!important;}'
    +'.app.sidebar-hidden .sidebar,.sidebar.collapsed{display:block!important;width:0!important;min-width:0!important;max-width:0!important;opacity:0!important;visibility:hidden!important;transform:none!important;overflow:hidden!important;border-right:0!important;box-shadow:none!important;pointer-events:none!important;}'
    +'.app.sidebar-hidden .sidebar *,.sidebar.collapsed *{display:none!important;opacity:0!important;visibility:hidden!important;pointer-events:none!important;}'
    +'.bonogas-collapsed-rail,.bonogas-collapsed-rail.open{display:none!important;opacity:0!important;visibility:hidden!important;pointer-events:none!important;}'
    +'.topbar-menu-toggle{display:grid!important;place-items:center!important;flex:0 0 34px!important;width:34px!important;height:34px!important;border:0!important;background:transparent!important;color:#fff!important;border-radius:0!important;padding:0!important;box-shadow:none!important;transform:none!important;}'
    +'.topbar-menu-toggle:hover{background:transparent!important;color:#fff!important;transform:none!important;filter:none!important;}'
    +'.topbar-menu-toggle .svg-icon{width:18px!important;height:18px!important;stroke-width:2.4!important;}'
    +'.sidebar-header .sidebar-toggler{display:none!important;}'
    +'body,body *:not(.material-symbols-rounded):not(.rail-icon),button,input,select,textarea{font-family:Inter,Arial,sans-serif!important;letter-spacing:0!important;}'
    +'.brand,.logo-text,.logo-sub{font-family:Inter,Arial,sans-serif!important;font-style:normal!important;}'
    +'.sidebar-nav .nav-icon.material-symbols-rounded{display:inline-flex!important;align-items:center!important;justify-content:center!important;font-family:"Material Symbols Rounded"!important;font-size:22px!important;line-height:1!important;color:#f5f9ff!important;font-feature-settings:"liga"!important;-webkit-font-feature-settings:"liga"!important;font-variation-settings:"FILL" 0,"wght" 500,"GRAD" 0,"opsz" 24!important;opacity:1!important;visibility:visible!important;overflow:visible!important;}'
    +'.sidebar-nav .nav-link.active .nav-icon.material-symbols-rounded{color:#89d1ff!important;}';
  document.head.appendChild(style);
});

/* === Sidebar v2 handlers === */
qs('#sidebarToggler')?.addEventListener('click',toggleSidebar);
qsa('[data-rail-target]').forEach(btn=>btn.addEventListener('click',()=>qs('#'+btn.dataset.railTarget)?.click()));
qs('#navDashboard')?.addEventListener('click',function(e){e.preventDefault();openSatcontrolView();});
qs('#navCreateProject')?.addEventListener('click',function(e){e.preventDefault();const main=qs('.main');if(main&&(main.classList.contains('gnv-satcontrol-mode')||main.classList.contains('masificacion-mode')||main.classList.contains('bonogas-satcontrol-mode')||main.classList.contains('bonogas-active'))){openProjectModal();return;}openCreateProjectFromMenu();});
qs('#navListProjects')?.addEventListener('click',function(e){e.preventDefault();openProjectListFromMenu();});
qs('#navDeleteProject')?.addEventListener('click',function(e){e.preventDefault();openDeleteProjectFromMenu();});
qs('#navSolicitudes')?.addEventListener('click',function(e){e.preventDefault();openSolicitudesEnvironment();qs('#navDashboard')?.classList.remove('active');});
qs('#navValidaciones')?.addEventListener('click',function(e){e.preventDefault();openValidacionesEnvironment();qs('#navDashboard')?.classList.remove('active');});
qs('#navValeFise')?.addEventListener('click',function(e){e.preventDefault();openIntegratedModule('vale','SATCONTROL');});
qs('#navAhorroGnv')?.addEventListener('click',function(e){e.preventDefault();openIntegratedModule('gnv','Graficas');});
qs('#navAhorroGnvSatcontrol')?.addEventListener('click',function(e){e.preventDefault();openIntegratedModule('gnv','SATCONTROL');});
qs('#navFotovoltaico')?.addEventListener('click',function(e){e.preventDefault();openIntegratedModule('fotovoltaico','SATCONTROL');});
qs('#navElectricidad')?.addEventListener('click',function(e){e.preventDefault();openIntegratedModule('electricidad','SATCONTROL');});
qs('#navMasificacionSatcontrol')?.addEventListener('click',function(e){e.preventDefault();openIntegratedModule('masificacion','SATCONTROL');});
qsa('.nav-accordion-toggle').forEach(btn=>btn.addEventListener('click',function(){const item=btn.closest('.nav-accordion');const isOpen=item?.classList.toggle('open');btn.setAttribute('aria-expanded',isOpen?'true':'false');const chevron=btn.querySelector('.nav-chevron');if(chevron)chevron.textContent=isOpen?'expand_more':'chevron_right';}));
qsa('[data-open-module]').forEach(btn=>btn.addEventListener('click',function(e){e.preventDefault();openIntegratedModule(btn.dataset.openModule,btn.dataset.submodule||'SATCONTROL');}));
qsa('[data-back-satcontrol]').forEach(btn=>btn.addEventListener('click',function(e){e.preventDefault();openSatcontrolView();}));
qs('#logoutBtn')?.addEventListener('click',doLogout);
document.addEventListener('DOMContentLoaded',function(){
  const style=document.createElement('style');
  style.textContent='body,.app{background:#11172f!important;color:#f7f9ff!important}.main{background:#11172f!important}.project-card small{font-size:14px!important;font-weight:700!important}.map-shell,.map{border-radius:20px!important;border-color:#35466f!important;background:#0e152c!important;box-shadow:none!important}.map-shell{outline:1px solid rgba(70,91,145,.35)!important}.project-utils-dock{background:rgba(17,26,52,.92)!important;border:1px solid rgba(103,232,249,.22)!important;border-radius:13px!important;box-shadow:0 14px 32px rgba(0,0,0,.34)!important;backdrop-filter:blur(14px)!important}.project-utils-dock .util-btn.pdf{background:#ef4d42!important;color:#fff!important}.project-utils-dock .util-btn.image{background:#47b867!important;color:#fff!important}.project-utils-dock .util-btn.upload{background:#52d5a6!important;color:#071826!important}.project-utils-dock .util-btn.pdf.secondary{background:#4269df!important;color:#fff!important}.project-utils-dock .util-btn.icon-plain{color:#8b96b1!important;background:transparent!important}.project-utils-dock .util-separator{background:#304166!important}.project-utils-dock.is-pinned{position:absolute!important;right:18px!important;left:auto!important;top:18px!important;background:rgba(17,26,52,.92)!important;border:1px solid rgba(103,232,249,.22)!important;border-radius:13px!important;box-shadow:0 14px 32px rgba(0,0,0,.34)!important}.project-utils-dock.is-pinned .util-btn.pin{color:#67e8f9!important;background:#111a31!important}.project-files-card{width:min(1420px,94vw)!important;height:min(1040px,88vh)!important;max-height:88vh!important;background:#1c223b!important;background-image:none!important;border:1px solid #4a5a86!important;border-radius:44px!important;padding:54px 42px!important;box-shadow:0 28px 80px rgba(0,0,0,.48)!important;color:#fff!important}.project-files-card .modal-head{border-bottom:0!important;margin:0 0 52px!important;padding:0!important;align-items:flex-start!important}.project-files-card .modal-head h2{color:#fff!important;font-size:30px!important;font-weight:900!important;letter-spacing:0!important}.project-files-card .modal-head p{display:none!important}.project-files-card .close{width:58px!important;height:58px!important;border-radius:50%!important;background:#222a47!important;border:3px solid rgba(255,255,255,.92)!important;color:#9db0da!important;font-size:38px!important;font-weight:300!important;line-height:1!important}.project-files-table{border:2px solid #2f3c66!important;border-radius:22px!important;min-height:230px!important;padding:30px 30px!important;background:#141a33!important}.project-files-head{display:grid!important;grid-template-columns:1fr 1fr 1fr!important;color:#b8c4de!important;font-size:22px!important;font-weight:900!important;padding-bottom:24px!important;border-bottom:2px solid #304069!important}.project-files-empty{min-height:126px!important;display:grid!important;place-items:center!important;color:rgba(178,187,209,.16)!important;font-size:22px!important;font-weight:850!important;text-align:center!important}';
  document.head.appendChild(style);
});
document.addEventListener('DOMContentLoaded',function(){
  const style=document.createElement('style');
  style.textContent='.project-utils-dock,.bonogas-map-utils,.integrated-map-utils{min-width:0!important;min-height:0!important}.project-utils-dock .util-page-hidden,.bonogas-map-utils .util-page-hidden,.integrated-map-utils .util-page-hidden{display:none!important}.project-utils-dock .util-separator:not(.pu-controls-sep),.bonogas-map-utils .util-separator:not(.pu-controls-sep),.integrated-map-utils .util-separator:not(.pu-controls-sep){display:none!important}.project-utils-dock .util-btn.more,.bonogas-map-utils .util-btn.more,.integrated-map-utils .util-btn.more{background:#243150!important;color:#facc15!important;font-size:13px!important}.project-utils-dock .util-btn.pin,.bonogas-map-utils .util-btn.pin,.integrated-map-utils .util-btn.pin{background:#0f766e!important;color:#ecfeff!important}.project-utils-dock .util-btn.more:hover,.bonogas-map-utils .util-btn.more:hover,.integrated-map-utils .util-btn.more:hover,.project-utils-dock .util-btn.pin:hover,.bonogas-map-utils .util-btn.pin:hover,.integrated-map-utils .util-btn.pin:hover{transform:none!important}.project-utils-dock .util-btn[data-fise-tool="select"],.project-utils-dock .util-btn[data-gnv-tool="select"],.project-utils-dock .util-btn[data-foto-util="utilSelect"],.project-utils-dock .util-btn[data-elec-util="utilSelect"],.project-utils-dock .util-btn[data-mcter-util="utilSelect"],.bonogas-map-utils .util-btn#bonoUtilSelectToolBtn{background:#06b6d4!important;color:#06202a!important}.project-utils-dock .util-btn[data-fise-tool="measure"],.project-utils-dock .util-btn[data-gnv-tool="measure"],.bonogas-map-utils .util-btn#bonoUtilMeasureToolBtn,.project-utils-dock .util-btn#masifMedirBtn{background:#f59e0b!important;color:#241200!important}.project-utils-dock .util-btn[data-fise-tool="polygon"],.project-utils-dock .util-btn[data-gnv-tool="polygon"],.bonogas-map-utils .util-btn#bonoUtilPolygonToolBtn{background:#ec4899!important;color:#fff!important}.project-utils-dock .util-btn[data-fise-tool="circle"],.project-utils-dock .util-btn[data-gnv-tool="circle"],.project-utils-dock .util-btn[data-foto-util="utilCircle"],.project-utils-dock .util-btn[data-elec-util="utilCircle"],.project-utils-dock .util-btn[data-mcter-util="utilCircle"],.project-utils-dock .util-btn#masifCircleBtn,.bonogas-map-utils .util-btn#bonoUtilCircleToolBtn{background:#8b5cf6!important;color:#fff!important}.project-utils-dock .util-btn[data-foto-util="utilFit"],.project-utils-dock .util-btn[data-elec-util="utilFit"],.project-utils-dock .util-btn[data-mcter-util="utilFit"]{background:#0ea5e9!important;color:#05202c!important}.project-utils-dock .util-btn[data-foto-util="utilRandom"],.project-utils-dock .util-btn[data-elec-util="utilRandom"],.project-utils-dock .util-btn[data-mcter-util="utilRandom"]{background:#f97316!important;color:#fff!important}.project-utils-dock .util-btn[data-foto-util="utilInventory"],.project-utils-dock .util-btn[data-elec-util="utilInventory"],.project-utils-dock .util-btn[data-mcter-util="utilInventory"],.project-utils-dock .util-btn#masifFichaBtn{background:#14b8a6!important;color:#041b1a!important}.project-utils-dock .util-btn[data-foto-util="utilPin"],.project-utils-dock .util-btn[data-elec-util="utilPin"],.project-utils-dock .util-btn[data-mcter-util="utilPin"],.project-utils-dock .util-btn#masifValidarBtn{background:#22c55e!important;color:#052e16!important}.project-utils-dock .util-btn[data-foto-util="utilDger"],.project-utils-dock .util-btn[data-elec-util="utilDger"],.project-utils-dock .util-btn[data-mcter-util="utilDger"]{background:#3b82f6!important;color:#fff!important}.project-utils-dock .util-btn[data-elec-util="utilAnexo4"],.project-utils-dock .util-btn[data-mcter-util="utilAnexo4"],.project-utils-dock .util-btn#valeFiseChartsBtn{background:#ef4444!important;color:#fff!important}';
  document.head.appendChild(style);
});

(function(){
  'use strict';

  /* ── Datos mock ─────────────────────────────────────────────── */
  var GNV_LIQ_DATA=[
    {id:1,placa:'ABC-123',propietario:'Carlos Quispe Huamaní',taller:'AutoGas Norte S.A.C.',fechaConv:'2025-01-15',fechaLiq:'2025-02-10',monto:2800,subsidio:720,penalidad:0,estado:'Liquidado',obs:'Conversión conforme.'},
    {id:2,placa:'DEF-456',propietario:'María Torres Flores',taller:'GNV Conversiones E.I.R.L.',fechaConv:'2025-02-20',fechaLiq:'2025-03-18',monto:3100,subsidio:720,penalidad:150,estado:'Aprobado',obs:'Pendiente emisión de pago.'},
    {id:3,placa:'GHI-789',propietario:'Luis Paredes Vega',taller:'Taller Central GNV S.A.C.',fechaConv:'2025-03-05',fechaLiq:'',monto:2650,subsidio:720,penalidad:0,estado:'En revisión',obs:'Documentación en verificación.'},
    {id:4,placa:'JKL-012',propietario:'Rosa Mamani Ccori',taller:'Mecánica Trujillo GNV',fechaConv:'2025-03-22',fechaLiq:'',monto:2900,subsidio:720,penalidad:200,estado:'Observado',obs:'Falta certificado de conformidad.'},
    {id:5,placa:'MNO-345',propietario:'Pedro Salas Córdova',taller:'AutoGas Norte S.A.C.',fechaConv:'2025-04-01',fechaLiq:'',monto:2750,subsidio:720,penalidad:0,estado:'Pendiente',obs:'Esperando validación técnica.'},
    {id:6,placa:'PQR-678',propietario:'Elena Chávez Ruiz',taller:'GNV Conversiones E.I.R.L.',fechaConv:'2025-04-10',fechaLiq:'',monto:3050,subsidio:720,penalidad:100,estado:'Pendiente',obs:'Revisión de documentos de propiedad.'},
    {id:7,placa:'STU-901',propietario:'Javier López Mendoza',taller:'Taller Central GNV S.A.C.',fechaConv:'2025-04-15',fechaLiq:'2025-05-02',monto:2800,subsidio:720,penalidad:0,estado:'Liquidado',obs:'Liquidación completada.'},
    {id:8,placa:'VWX-234',propietario:'Ana Gutierrez Pinto',taller:'Mecánica Trujillo GNV',fechaConv:'2025-05-03',fechaLiq:'',monto:2600,subsidio:720,penalidad:50,estado:'Aprobado',obs:'Listo para emisión.'}
  ];

  var gnvLiqFiltered=GNV_LIQ_DATA.slice();
  var gnvLiqInitialized=false;
  var gnvLiqSignatureCaptured=false;
  var gnvLiqSignatureRegistered=false;
  var gnvLiqSignatureImg='';

  /* ── Firma digital simulada (misma lógica que Informes / reportsModal) ── */
  function gnvLiqClearSignatureCanvas(){
    var canvas=qs('#gnvLiqSignatureCanvas');
    if(!canvas)return;
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle='#f8fafc';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.strokeStyle='#94a3b8';
    ctx.lineWidth=1;
    ctx.setLineDash([8,8]);
    ctx.strokeRect(10,18,canvas.width-20,canvas.height-36);
    ctx.setLineDash([]);
    ctx.fillStyle='#64748b';
    ctx.font='700 13px Arial';
    ctx.fillText('Firme aquí',24,38);
    gnvLiqSignatureCaptured=false;
    gnvLiqSignatureRegistered=false;
    gnvLiqSignatureImg='';
    var st=qs('#gnvLiqSignatureStatus');
    if(st)st.textContent='Sin firma registrada';
    var ts=qs('#gnvLiqSignatureTimestamp');
    if(ts)ts.textContent='--';
  }

  function gnvLiqSetupSignaturePad(){
    var canvas=qs('#gnvLiqSignatureCanvas');
    if(!canvas||canvas.dataset.ready==='1')return;
    canvas.dataset.ready='1';
    var ctx=canvas.getContext('2d');
    var drawing=false,last=null;
    function pos(ev){
      var rect=canvas.getBoundingClientRect();
      var p=ev.touches?ev.touches[0]:ev;
      return {x:(p.clientX-rect.left)*(canvas.width/rect.width),y:(p.clientY-rect.top)*(canvas.height/rect.height)};
    }
    function start(ev){drawing=true;last=pos(ev);ev.preventDefault();}
    function move(ev){
      if(!drawing)return;
      var p=pos(ev);
      ctx.strokeStyle='#0f172a';
      ctx.lineWidth=3;
      ctx.lineCap='round';
      ctx.lineJoin='round';
      ctx.beginPath();
      ctx.moveTo(last.x,last.y);
      ctx.lineTo(p.x,p.y);
      ctx.stroke();
      last=p;
      ev.preventDefault();
    }
    function end(){
      if(drawing){
        gnvLiqSignatureCaptured=true;
        gnvLiqSignatureRegistered=false;
        var st=qs('#gnvLiqSignatureStatus');
        if(st)st.textContent='Firma capturada, pendiente de registro';
      }
      drawing=false;
      last=null;
    }
    canvas.addEventListener('mousedown',start);
    canvas.addEventListener('mousemove',move);
    window.addEventListener('mouseup',end);
    canvas.addEventListener('touchstart',start,{passive:false});
    canvas.addEventListener('touchmove',move,{passive:false});
    window.addEventListener('touchend',end);
    gnvLiqClearSignatureCanvas();
  }

  function gnvLiqRegisterSignature(){
    if(!gnvLiqSignatureCaptured){
      if(window.showToast)showToast('Primero dibuje una firma en el recuadro');
      return false;
    }
    var canvas=qs('#gnvLiqSignatureCanvas');
    if(canvas)gnvLiqSignatureImg=canvas.toDataURL('image/png');
    var now=new Date().toLocaleString('es-PE');
    var st=qs('#gnvLiqSignatureStatus');
    if(st)st.textContent='Firma registrada';
    var ts=qs('#gnvLiqSignatureTimestamp');
    if(ts)ts.textContent=now;
    gnvLiqSignatureRegistered=true;
    if(window.showToast)showToast('Liquidación GNV firmada digitalmente');
    return true;
  }

  function gnvLiqSignatureExportHtml(){
    if(gnvLiqSignatureRegistered&&gnvLiqSignatureImg){
      return '<div style="margin-top:28px;padding-top:12px;border-top:1px solid #cbd5e1;text-align:center">'
        +'<p style="font-weight:700;margin:0 0 8px">Firma digital simulada: '+gnvLiqSignatureLabel()+'</p>'
        +'<img src="'+gnvLiqSignatureImg+'" alt="Firma digital" style="max-width:280px;border:1px solid #cbd5e1;border-radius:8px;background:#fff">'
        +'</div>';
    }
    return '<p class="sign">Firma digital simulada: '+gnvLiqSignatureLabel()+'</p>';
  }

  function gnvLiqExportCurrentReport(){
    var placa=(qs('#gnvLiqPlaca')?.value)||'—';
    var prop=(qs('#gnvLiqPropietario')?.value)||'—';
    var taller=(qs('#gnvLiqTaller')?.value)||'—';
    var monto=parseFloat(qs('#gnvLiqMonto')?.value)||0;
    var subsidio=parseFloat(qs('#gnvLiqSubsidio')?.value)||0;
    var penalidad=parseFloat(qs('#gnvLiqPenalidad')?.value)||0;
    var totalPagar=Math.max(0,monto-subsidio-penalidad);
    var estado=(qs('#gnvLiqEstado')?.value)||'Pendiente';
    var obs=(qs('#gnvLiqObs')?.value)||'';
    var html='<!doctype html><html><head><meta charset="utf-8"><title>Liquidación GNV · '+placa+'</title>'
      +'<style>body{font-family:Arial,sans-serif;font-size:12px;color:#111;padding:28px;line-height:1.5}h1{font-size:16px;margin:0 0 6px}p{color:#64748b;margin:0 0 16px}table{width:100%;border-collapse:collapse;margin:16px 0}td{padding:8px 10px;border-bottom:1px solid #e2e8f0}td:first-child{color:#64748b;width:38%}b{color:#0f172a}</style>'
      +'</head><body><h1>Liquidación Ahorro GNV · SATCONTROL</h1><p>Reporte generado el '+new Date().toLocaleDateString('es-PE')+'</p>'
      +'<table><tbody>'
      +'<tr><td>Placa</td><td><b>'+placa+'</b></td></tr>'
      +'<tr><td>Beneficiario</td><td><b>'+prop+'</b></td></tr>'
      +'<tr><td>Taller</td><td><b>'+taller+'</b></td></tr>'
      +'<tr><td>Monto liquidación</td><td><b>'+fmt(monto)+'</b></td></tr>'
      +'<tr><td>Subsidio FISE</td><td><b>'+fmt(subsidio)+'</b></td></tr>'
      +'<tr><td>Penalidad</td><td><b>'+fmt(penalidad)+'</b></td></tr>'
      +'<tr><td>Total a pagar</td><td><b>'+fmt(totalPagar)+'</b></td></tr>'
      +'<tr><td>Estado</td><td><b>'+estado+'</b></td></tr>'
      +'<tr><td>Observaciones</td><td>'+obs+'</td></tr>'
      +'</tbody></table>'
      +gnvLiqSignatureExportHtml()
      +'</body></html>';
    var win=window.open('','_blank','width=900,height=760');
    if(!win){if(window.showToast)showToast('Permita ventanas emergentes para exportar el reporte');return;}
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(function(){win.print();},400);
    if(window.showToast)showToast('Reporte de liquidación exportado');
  }

  function gnvLiqSignatureLabel(){
    if(gnvLiqSignatureRegistered){
      var signer=(qs('#gnvLiqSigner')?.value||'Responsable técnico GNV').trim();
      return 'Firmado digitalmente por '+signer;
    }
    if(gnvLiqSignatureCaptured)return 'Firma capturada, pendiente de registro';
    return 'Firma pendiente';
  }

  /* ── helpers ─────────────────────────────────────────────────── */
  function fmt(n){return'S/ '+Number(n||0).toLocaleString('es-PE',{minimumFractionDigits:2,maximumFractionDigits:2});}
  function total(r){return Math.max(0,Number(r.monto)-Number(r.subsidio)-Number(r.penalidad));}
  function estadoClass(e){
    var m={Liquidado:'ok','En revisión':'warn',Pendiente:'off',Aprobado:'ok',Observado:'obs'};
    return m[e]||'off';
  }
  function qs(s){return document.querySelector(s);}

  /* ── KPIs ─────────────────────────────────────────────────────── */
  function gnvLiqRenderKpis(data){
    var total_monto=data.reduce(function(a,r){return a+total(r);},0);
    var pend=data.filter(function(r){return r.estado==='Pendiente';}).length;
    var aprov=data.filter(function(r){return r.estado==='Aprobado'||r.estado==='Liquidado';}).length;
    var kTotal=qs('#gnvLiqKpiTotal');  if(kTotal)kTotal.textContent=data.length;
    var kPend=qs('#gnvLiqKpiPend');    if(kPend)kPend.textContent=pend;
    var kAprov=qs('#gnvLiqKpiAprov');  if(kAprov)kAprov.textContent=aprov;
    var kMonto=qs('#gnvLiqKpiMonto');  if(kMonto)kMonto.textContent=fmt(total_monto);
  }

  /* ── Tabla ──────────────────────────────────────────────────── */
  function gnvLiqBadge(e){
    return'<span class="sync-status '+estadoClass(e)+'">'+e+'</span>';
  }
  function gnvLiqRenderTable(data){
    var tbody=qs('#gnvLiqTbody');
    if(!tbody)return;
    if(!data.length){tbody.innerHTML='<tr><td colspan="11" style="text-align:center;color:#64748b;padding:20px">Sin registros para los filtros aplicados.</td></tr>';return;}
    tbody.innerHTML=data.map(function(r){
      return'<tr>'
        +'<td><b>'+r.placa+'</b></td>'
        +'<td>'+r.propietario+'</td>'
        +'<td>'+r.taller+'</td>'
        +'<td>'+(r.fechaConv||'—')+'</td>'
        +'<td>'+(r.fechaLiq||'—')+'</td>'
        +'<td>'+fmt(r.monto)+'</td>'
        +'<td>'+fmt(r.subsidio)+'</td>'
        +'<td>'+(r.penalidad?fmt(r.penalidad):'—')+'</td>'
        +'<td><b>'+fmt(total(r))+'</b></td>'
        +'<td>'+gnvLiqBadge(r.estado)+'</td>'
        +'<td><button type="button" class="gnv-liq-sel-btn" data-gnv-liq-id="'+r.id+'" style="font-size:11px;padding:4px 9px;border:none;border-radius:8px;background:#1b6f8a;color:#fff;cursor:pointer;font-weight:800">Cargar</button></td>'
        +'</tr>';
    }).join('');
    /* cargar registro al formulario */
    tbody.querySelectorAll('.gnv-liq-sel-btn').forEach(function(btn){
      btn.addEventListener('click',function(){
        var id=Number(btn.getAttribute('data-gnv-liq-id'));
        var r=GNV_LIQ_DATA.find(function(x){return x.id===id;});
        if(r)gnvLiqLoadRecord(r);
      });
    });
  }

  /* ── Cargar registro en formulario ────────────────────────────── */
  function gnvLiqLoadRecord(r){
    var set=function(id,v){var el=qs('#'+id);if(el)el.value=v;};
    set('gnvLiqPlaca',r.placa);
    set('gnvLiqPropietario',r.propietario);
    set('gnvLiqTaller',r.taller);
    set('gnvLiqMonto',r.monto);
    set('gnvLiqSubsidio',r.subsidio);
    set('gnvLiqPenalidad',r.penalidad);
    set('gnvLiqEstado',r.estado);
    set('gnvLiqFechaConv',r.fechaConv);
    set('gnvLiqFechaLiq',r.fechaLiq||'');
    set('gnvLiqObs',r.obs);
    gnvLiqClearSignatureCanvas();
    gnvLiqUpdateSummary();
  }

  /* ── Resumen del panel derecho ─────────────────────────────────── */
  function gnvLiqUpdateSummary(nuevoEstado){
    var monto=parseFloat(qs('#gnvLiqMonto')?.value)||0;
    var subsidio=parseFloat(qs('#gnvLiqSubsidio')?.value)||0;
    var penalidad=parseFloat(qs('#gnvLiqPenalidad')?.value)||0;
    var totalPagar=Math.max(0,monto-subsidio-penalidad);
    var pct=monto>0?Math.round((totalPagar/monto)*100):0;
    var estado=nuevoEstado||(qs('#gnvLiqEstado')?.value)||'Pendiente';

    var g=qs('#gnvLiqGross');     if(g)g.textContent=fmt(monto);
    var t=qs('#gnvLiqTotal');     if(t)t.textContent=fmt(totalPagar);
    var p=qs('#gnvLiqProgress');  if(p)p.style.width=pct+'%';
    var b=qs('#gnvLiqStatusBadge');
    if(b){b.textContent=estado;b.className='sync-status '+estadoClass(estado);}
    var f=qs('#gnvLiqFormula');
    if(f)f.textContent='Monto ('+fmt(monto)+') − Subsidio ('+fmt(subsidio)+') − Penalidad ('+fmt(penalidad)+') = '+fmt(totalPagar);
  }

  /* ── Agregar al log ──────────────────────────────────────────── */
  function gnvLiqAddLog(msg){
    var placa=(qs('#gnvLiqPlaca')?.value)||'—';
    var container=qs('#gnvLiqLogRows');
    if(!container)return;
    var row=document.createElement('div');
    row.className='sync-log-row';
    row.innerHTML='<span>'+placa+'</span><b>'+msg+'</b>';
    container.insertBefore(row,container.firstChild);
  }

  /* ── Filtros y búsqueda ─────────────────────────────────────── */
  function gnvLiqApplyFilters(){
    var search=(qs('#gnvLiqSearch')?.value||'').toLowerCase().trim();
    var fEstado=qs('#gnvLiqFilterEstado')?.value||'';
    var fTaller=qs('#gnvLiqFilterTaller')?.value||'';
    var fDesde=qs('#gnvLiqFechaDesde')?.value||'';
    var fHasta=qs('#gnvLiqFechaHasta')?.value||'';
    gnvLiqFiltered=GNV_LIQ_DATA.filter(function(r){
      if(search&&!r.placa.toLowerCase().includes(search)&&!r.propietario.toLowerCase().includes(search))return false;
      if(fEstado&&r.estado!==fEstado)return false;
      if(fTaller&&r.taller!==fTaller)return false;
      if(fDesde&&r.fechaConv&&r.fechaConv<fDesde)return false;
      if(fHasta&&r.fechaConv&&r.fechaConv>fHasta)return false;
      return true;
    });
    gnvLiqRenderTable(gnvLiqFiltered);
    gnvLiqRenderKpis(gnvLiqFiltered);
  }

  /* ── Exportar CSV ────────────────────────────────────────────── */
  function gnvLiqExportCsv(){
    var headers=['Placa','Propietario','Taller','F.Conversión','F.Liquidación','Monto Liq.','Subsidio','Penalidad','Total a pagar','Estado'];
    var rows=gnvLiqFiltered.map(function(r){
      return[r.placa,r.propietario,r.taller,r.fechaConv,r.fechaLiq||'',r.monto,r.subsidio,r.penalidad,total(r),r.estado].join(',');
    });
    var csv=[headers.join(',')].concat(rows).join('\n');
    var blob=new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8;'});
    var url=URL.createObjectURL(blob);
    var a=document.createElement('a');
    a.href=url;a.download='liquidaciones-gnv.csv';
    document.body.appendChild(a);a.click();
    document.body.removeChild(a);
    setTimeout(function(){URL.revokeObjectURL(url);},800);
    if(window.showToast)showToast('CSV exportado correctamente');
  }

  /* ── Exportar PDF (impresión) ─────────────────────────────────── */
  function gnvLiqExportPdf(){
    var rows=gnvLiqFiltered.map(function(r){
      return'<tr><td>'+r.placa+'</td><td>'+r.propietario+'</td><td>'+r.taller+'</td>'
        +'<td>'+r.fechaConv+'</td><td>'+(r.fechaLiq||'—')+'</td>'
        +'<td>'+fmt(r.monto)+'</td><td>'+fmt(r.subsidio)+'</td>'
        +'<td>'+fmt(r.penalidad)+'</td><td>'+fmt(total(r))+'</td><td>'+r.estado+'</td></tr>';
    }).join('');
    var html='<!doctype html><html><head><meta charset="utf-8"><title>Liquidaciones Ahorro GNV</title>'
      +'<style>body{font-family:Arial,sans-serif;font-size:11px;color:#111}table{width:100%;border-collapse:collapse}th{background:#0f172a;color:#fff;padding:6px 8px;text-align:left}td{padding:5px 8px;border-bottom:1px solid #e2e8f0}h1{font-size:15px;margin-bottom:4px}p{color:#64748b;margin:0 0 12px}.sign{margin-top:28px;padding-top:12px;border-top:1px solid #cbd5e1;font-weight:700;color:#0f172a}</style>'
      +'</head><body><h1>Liquidaciones Ahorro GNV · SATCONTROL</h1><p>Exportación generada el '+new Date().toLocaleDateString('es-PE')+'</p>'
      +'<table><thead><tr><th>Placa</th><th>Propietario</th><th>Taller</th><th>F.Conv.</th><th>F.Liq.</th><th>Monto</th><th>Subsidio</th><th>Penalidad</th><th>Total</th><th>Estado</th></tr></thead><tbody>'+rows+'</tbody></table>'
      +gnvLiqSignatureExportHtml()+'</body></html>';
    var win=window.open('','_blank','width=1000,height=700');
    if(!win){if(window.showToast)showToast('Permita ventanas emergentes para exportar PDF');return;}
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(function(){win.print();},400);
  }

  /* ── Inicialización ─────────────────────────────────────────── */
  window.gnvLiqInit=function(){
    if(gnvLiqInitialized)return;
    gnvLiqInitialized=true;

    /* Valores de fecha por defecto */
    var today=new Date().toISOString().slice(0,10);
    var fc=qs('#gnvLiqFechaConv'); if(fc&&!fc.value)fc.value=today;
    var fl=qs('#gnvLiqFechaLiq');  if(fl&&!fl.value)fl.value=today;

    gnvLiqRenderTable(GNV_LIQ_DATA);
    gnvLiqRenderKpis(GNV_LIQ_DATA);
    gnvLiqUpdateSummary();
    gnvLiqSetupSignaturePad();

    /* Listeners de campos numéricos → actualizar resumen */
    ['gnvLiqMonto','gnvLiqSubsidio','gnvLiqPenalidad','gnvLiqEstado'].forEach(function(id){
      qs('#'+id)?.addEventListener('input',function(){gnvLiqUpdateSummary();});
    });

    /* Filtrar */
    var fBtn=qs('#gnvLiqFilterBtn');
    if(fBtn)fBtn.addEventListener('click',gnvLiqApplyFilters);
    qs('#gnvLiqSearch')?.addEventListener('input',gnvLiqApplyFilters);

    /* Calcular */
    var calcBtn=qs('#gnvLiqCalcBtn');
    if(calcBtn)calcBtn.addEventListener('click',function(){
      gnvLiqUpdateSummary('Pendiente');
      if(window.showToast)showToast('Liquidación GNV calculada');
    });

    /* Generar liquidación */
    var genBtn=qs('#gnvLiqGenerateBtn');
    if(genBtn)genBtn.addEventListener('click',function(){
      var el=qs('#gnvLiqEstado');if(el)el.value='Aprobado';
      gnvLiqUpdateSummary('Aprobado');
      gnvLiqAddLog('Liquidación generada · '+fmt((parseFloat(qs('#gnvLiqMonto')?.value)||0)-(parseFloat(qs('#gnvLiqSubsidio')?.value)||0)-(parseFloat(qs('#gnvLiqPenalidad')?.value)||0)));
      if(window.showToast)showToast('Liquidación GNV generada y registrada');
    });

    /* Emitir orden de pago */
    var payBtn=qs('#gnvLiqPayBtn');
    if(payBtn)payBtn.addEventListener('click',function(){
      if(!gnvLiqSignatureRegistered){
        if(window.showToast)showToast('Debe registrar una firma antes de emitir la orden de pago');
        return;
      }
      var el=qs('#gnvLiqEstado');if(el)el.value='Liquidado';
      gnvLiqUpdateSummary('Liquidado');
      gnvLiqAddLog('Orden de pago emitida · '+fmt((parseFloat(qs('#gnvLiqMonto')?.value)||0)-(parseFloat(qs('#gnvLiqSubsidio')?.value)||0)-(parseFloat(qs('#gnvLiqPenalidad')?.value)||0)));
      if(window.showToast)showToast('Orden de pago GNV emitida');
    });

    /* Firma digital simulada */
    qs('#gnvLiqClearSignatureBtn')?.addEventListener('click',gnvLiqClearSignatureCanvas);
    qs('#gnvLiqSignRegisterBtn')?.addEventListener('click',gnvLiqRegisterSignature);

    /* Adjuntar sustento */
    var attBtn=qs('#gnvLiqAttachBtn');
    if(attBtn)attBtn.addEventListener('click',function(){if(window.showToast)showToast('Sustento adjuntado a la liquidación GNV');});

    /* Reporte */
    var rptBtn=qs('#gnvLiqReportBtn');
    if(rptBtn)rptBtn.addEventListener('click',gnvLiqExportCurrentReport);

    /* Exportar CSV / PDF */
    var csvBtn=qs('#gnvLiqExportCsvBtn');
    if(csvBtn)csvBtn.addEventListener('click',gnvLiqExportCsv);
    var pdfBtn=qs('#gnvLiqExportPdfBtn');
    if(pdfBtn)pdfBtn.addEventListener('click',gnvLiqExportPdf);
  };

  /* Exponer refresh para re-render al re-abrir el modal */
  window._gnvLiqRefresh=function(){
    gnvLiqFiltered=GNV_LIQ_DATA.slice();
    gnvLiqRenderTable(gnvLiqFiltered);
    gnvLiqRenderKpis(gnvLiqFiltered);
    gnvLiqUpdateSummary();
  };

  /* ── CSS de la tabla ────────────────────────────────────────── */
  (function injectGnvLiqStyles(){
    if(document.getElementById('gnv-liq-styles'))return;
    var s=document.createElement('style');
    s.id='gnv-liq-styles';
    s.textContent=
      '.gnv-liq-table{width:100%;border-collapse:separate;border-spacing:0;background:#0d1630;border:1px solid #293b67;font-size:12px;font-weight:700;color:#f8fbff}'
      +'.gnv-liq-table th{background:#111a31;color:#93a4c7;font-weight:900;text-transform:uppercase;letter-spacing:.04em;font-size:10.5px;padding:10px 12px;text-align:left;border-bottom:1px solid #293b67;white-space:nowrap}'
      +'.gnv-liq-table td{padding:9px 10px;border-bottom:1px solid #1f3156;white-space:nowrap}'
      +'.gnv-liq-table tr:last-child td{border-bottom:0}'
      +'.gnv-liq-table tr:hover td{background:rgba(34,211,238,.06)}'
      +'#gnvLiquidacionModal .sync-status.obs{background:#7c3aed20;color:#a78bfa;border-color:#7c3aed40}'
      +'#gnvLiquidacionModal .doc-kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:14px}'
      +'@media(max-width:900px){#gnvLiquidacionModal .doc-kpis{grid-template-columns:repeat(2,1fr)}}'
      +'@media(max-width:600px){#gnvLiquidacionModal .doc-kpis{grid-template-columns:1fr}}';
    document.head.appendChild(s);
  })();

})();

(function(){
  'use strict';

  var gnvInfInitialized=false;
  var gnvInfActiveView='informe';
  var gnvInfSavedAt='';
  var gnvInfSigned=false;
  var gnvInfSent=false;
  var gnvInfSavedDocs=[];
  var gnvInfSelectedSaved=null;
  var gnvInfSignatureCaptured=false;
  var gnvInfSignatureRegistered=false;
  var gnvInfSignatureImg='';
  var gnvInfSignatureAt='';

  var gnvInfMeta={
    destinatario:'Director Ejecutivo – FISE',
    remitentes:'Analista Técnico – FISE; Especialista Conversión GNV – FISE; Coordinador de Ahorro GNV – FISE; Coordinador de Finanzas – FISE; Especialista Legal – FISE',
    lugarFecha:'',
    monto:'S/ 2,080.00'
  };

  function qs(s,root){return (root||document).querySelector(s);}
  function esc(v){return String(v??'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function plainLines(text){return String(text||'').split('\n').filter(Boolean);}

  /* ── Firma digital simulada (misma lógica que BONO GAS / reportsModal) ── */
  function gnvInfClearSignatureCanvas(){
    var canvas=qs('#gnvInfSignatureCanvas');
    if(!canvas)return;
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle='#f8fafc';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.strokeStyle='#94a3b8';
    ctx.lineWidth=1;
    ctx.setLineDash([8,8]);
    ctx.strokeRect(10,18,canvas.width-20,canvas.height-36);
    ctx.setLineDash([]);
    ctx.fillStyle='#64748b';
    ctx.font='700 13px Arial';
    ctx.fillText('Firme aquí',24,38);
    gnvInfSignatureCaptured=false;
    gnvInfSignatureRegistered=false;
    gnvInfSigned=false;
    gnvInfSignatureImg='';
    gnvInfSignatureAt='';
    var st=qs('#gnvInfSignatureStatus');
    if(st)st.textContent='Sin firma registrada';
    var ts=qs('#gnvInfSignatureTimestamp');
    if(ts)ts.textContent='--';
    gnvInfRenderBadges();
    gnvInfRenderPreview();
  }

  function gnvInfSetupSignaturePad(){
    var canvas=qs('#gnvInfSignatureCanvas');
    if(!canvas||canvas.dataset.ready==='1')return;
    canvas.dataset.ready='1';
    var ctx=canvas.getContext('2d');
    var drawing=false,last=null;
    function pos(ev){
      var rect=canvas.getBoundingClientRect();
      var p=ev.touches?ev.touches[0]:ev;
      return {x:(p.clientX-rect.left)*(canvas.width/rect.width),y:(p.clientY-rect.top)*(canvas.height/rect.height)};
    }
    function start(ev){drawing=true;last=pos(ev);ev.preventDefault();}
    function move(ev){
      if(!drawing)return;
      var p=pos(ev);
      ctx.strokeStyle='#0f172a';
      ctx.lineWidth=3;
      ctx.lineCap='round';
      ctx.lineJoin='round';
      ctx.beginPath();
      ctx.moveTo(last.x,last.y);
      ctx.lineTo(p.x,p.y);
      ctx.stroke();
      last=p;
      ev.preventDefault();
    }
    function end(){
      if(drawing){
        gnvInfSignatureCaptured=true;
        gnvInfSignatureRegistered=false;
        gnvInfSigned=false;
        var st=qs('#gnvInfSignatureStatus');
        if(st)st.textContent='Firma capturada, pendiente de registro';
      }
      drawing=false;
      last=null;
    }
    canvas.addEventListener('mousedown',start);
    canvas.addEventListener('mousemove',move);
    window.addEventListener('mouseup',end);
    canvas.addEventListener('touchstart',start,{passive:false});
    canvas.addEventListener('touchmove',move,{passive:false});
    window.addEventListener('touchend',end);
    gnvInfClearSignatureCanvas();
  }

  function gnvInfRegisterSignature(){
    if(!gnvInfSignatureCaptured){
      if(window.showToast)showToast('Primero dibuje una firma en el recuadro');
      return false;
    }
    var canvas=qs('#gnvInfSignatureCanvas');
    if(canvas)gnvInfSignatureImg=canvas.toDataURL('image/png');
    gnvInfSignatureAt=new Date().toLocaleString('es-PE');
    gnvInfSignatureRegistered=true;
    gnvInfSigned=true;
    if(!gnvInfSavedAt)gnvInfSavedAt=gnvInfSignatureAt;
    var st=qs('#gnvInfSignatureStatus');
    if(st)st.textContent='Firma registrada';
    var ts=qs('#gnvInfSignatureTimestamp');
    if(ts)ts.textContent=gnvInfSignatureAt;
    gnvInfRegisterDoc(gnvInfBuildRecord('Firmado digitalmente'));
    gnvInfRefreshUi();
    if(window.showToast)showToast('Documento firmado digitalmente');
    return true;
  }

  function gnvInfSignerName(){
    return (qs('#gnvInfSigner')?.value||'Oliver Gonzales · Responsable técnico GNV').trim();
  }

  function gnvInfDefaultDoc(){
    var fecha=new Date().toISOString().slice(0,10);
    gnvInfMeta.lugarFecha='San Borja, '+fecha;
    return {
      numeroInforme:'0218-2026/GNV-FISE',
      numeroResolucion:'0106-2026-GNV-FISE',
      asunto:'Liquidación Parcial FISE - Conversión Vehicular GNV',
      referencia:'Expediente N° GNV-I-10512-2026',
      placaTaller:'ABC-123 · AutoGas Norte S.A.C.',
      objetivo:'Elaborar y sustentar la Liquidación Parcial FISE - Conversión Vehicular GNV correspondiente a la agrupación seleccionada, verificando la consistencia técnica, económica, documental y geoespacial de la conversión registrada por el beneficiario y el taller autorizado.',
      baseLegal:[
        '2.1 Ley N° 29852, Ley que crea el Sistema de Seguridad Energética en Hidrocarburos y el Fondo de Inclusión Social Energético - FISE.',
        '2.2 Decreto Supremo N° 021-2012-EM, Reglamento de la Ley N° 29852.',
        '2.3 Resolución Vice Ministerial N° 035-2023-MINEM-VMH, que aprueba el procedimiento que regula los desembolsos referidos a agrupaciones de inversiones en bienes de capital financiados con recursos del FISE.',
        '2.4 Normativa aplicable al Programa Ahorro GNV y al financiamiento de conversiones vehiculares con recursos del FISE.'
      ].join('\n'),
      antecedentes:[
        '3.1 El FISE tiene por finalidad promover el acceso universal a la energía, incluyendo el financiamiento de conversiones vehiculares a gas natural vehicular mediante el Programa Ahorro GNV.',
        '3.2 El beneficiario y el taller autorizado presentaron la solicitud de liquidación y la documentación sustentatoria correspondiente a la agrupación seleccionada.',
        '3.3 La información fue registrada y revisada en la plataforma Paulet SATCONTROL, considerando placa vehicular, taller autorizado, beneficiarios, evidencia fotográfica, capas geoespaciales y partidas de liquidación GNV.'
      ].join('\n'),
      analisis:[
        '4.1 Se verificó que el agrupación cuenta con código, placa vehicular, taller autorizado, beneficiarios registrados y evidencia mínima obligatoria.',
        '4.2 Se revisó la información de partidas de conversión, montos de liquidación, subsidio FISE, penalidades y total a pagar, conforme al esquema Ahorro GNV.',
        '4.3 De la revisión técnica y geoespacial, no se advierten observaciones críticas que impidan continuar con el trámite, sin perjuicio de la validación documental final.',
        '4.4 La liquidación parcial se calcula sobre el porcentaje aprobado y considera los montos a transferir al taller autorizado según la información registrada.'
      ].join('\n'),
      conclusiones:[
        '5.1 El beneficiario y el taller autorizado cumplieron con presentar la documentación correspondiente para la evaluación de la Liquidación Parcial FISE - Conversión Vehicular GNV.',
        '5.2 La información técnica, económica y geoespacial registrada permite sustentar la aprobación de la liquidación parcial de la agrupación.',
        '5.3 El monto referencial a transferir asciende a S/ 2,080.00, sujeto a validación financiera y legal final.'
      ].join('\n'),
      recomendaciones:[
        '6.1 Aprobar la Liquidación Parcial FISE - Conversión Vehicular GNV a favor del taller autorizado, correspondiente a la agrupación y placa indicados.',
        '6.2 Disponer la publicación del informe técnico legal y la resolución correspondiente en el portal institucional.',
        '6.3 Instruir al fiduciario para que efectúe la transferencia correspondiente conforme al informe aprobado.'
      ].join('\n'),
      visto:'El Informe Técnico Legal que sustenta la Liquidación Parcial FISE - Conversión Vehicular GNV de la agrupación seleccionada, correspondiente a conversiones vehiculares financiadas con recursos del FISE.',
      considerando:[
        'Que, mediante la Ley N° 29852, se crea el Fondo de Inclusión Social Energético - FISE, destinado, entre otros fines, al financiamiento de conversiones vehiculares a GNV.',
        'Que, conforme al procedimiento aplicable al Programa Ahorro GNV, corresponde aprobar la liquidación parcial mediante resolución, siempre que la documentación técnica, económica y legal se encuentre sustentada.',
        'Que, el Informe Técnico Legal recomienda aprobar la Liquidación Parcial FISE - Conversión Vehicular GNV por el monto consignado en el informe.'
      ].join('\n'),
      articulo1:'Aprobar la Liquidación Parcial FISE - Conversión Vehicular GNV de la agrupación indicada, según el monto consignado en el Informe Técnico Legal correspondiente.',
      articulo2:'Disponer la publicación de la presente resolución y del Informe Técnico Legal que forma parte integrante de esta, en el portal institucional del FISE.',
      articulo3:'Remitir oficio de instrucción al fiduciario para que realice la transferencia conforme al informe aprobado.'
    };
  }

  function gnvInfGetProject(){
    var frame=qs('#ahorroGnvFrame');
    var win=frame&&frame.contentWindow;
    if(win&&typeof win.currentProject==='function'){
      try{return win.currentProject();}catch(err){}
    }
    return {id:'GNV-2026-001',nombre:'CONVERSIÓN GNV AREQUIPA CENTRO',lider:'Coordinador Ahorro GNV Sur',estado:'En evaluación'};
  }

  function gnvInfApplyProject(project){
    var doc=gnvInfDefaultDoc();
    if(project&&project.id){
      doc.numeroInforme='ITL-'+project.id;
      doc.numeroResolucion='RD-'+project.id;
      doc.asunto='Liquidación Parcial FISE - Conversión Vehicular GNV de la agrupación '+project.nombre;
      doc.conclusiones='5.1 El beneficiario y el taller autorizado cumplieron con presentar la documentación correspondiente para la evaluación de la Liquidación Parcial FISE - Conversión Vehicular GNV.\n5.2 La información técnica, económica y geoespacial registrada permite sustentar la aprobación de la liquidación parcial de la agrupación '+project.nombre+'.\n5.3 El monto referencial a transferir asciende a S/ 2,080.00, sujeto a validación financiera y legal final.';
    }
    return doc;
  }

  function gnvInfLoadDoc(doc){
    var set=function(id,v){var el=qs('#'+id);if(el)el.value=v;};
    set('gnvInfNumInforme',doc.numeroInforme);
    set('gnvInfNumResolucion',doc.numeroResolucion);
    set('gnvInfAsunto',doc.asunto);
    set('gnvInfReferencia',doc.referencia);
    set('gnvInfPlacaTaller',doc.placaTaller);
    set('gnvInfObjetivo',doc.objetivo);
    set('gnvInfBaseLegal',doc.baseLegal);
    set('gnvInfAntecedentes',doc.antecedentes);
    set('gnvInfAnalisis',doc.analisis);
    set('gnvInfConclusiones',doc.conclusiones);
    set('gnvInfRecomendaciones',doc.recomendaciones);
    set('gnvInfVisto',doc.visto);
    set('gnvInfConsiderando',doc.considerando);
    set('gnvInfArticulo1',doc.articulo1);
    set('gnvInfArticulo2',doc.articulo2);
    set('gnvInfArticulo3',doc.articulo3);
  }

  function gnvInfReadDoc(){
    var get=function(id){var el=qs('#'+id);return el?el.value:'';};
    return {
      numeroInforme:get('gnvInfNumInforme'),
      numeroResolucion:get('gnvInfNumResolucion'),
      asunto:get('gnvInfAsunto'),
      referencia:get('gnvInfReferencia'),
      placaTaller:get('gnvInfPlacaTaller'),
      objetivo:get('gnvInfObjetivo'),
      baseLegal:get('gnvInfBaseLegal'),
      antecedentes:get('gnvInfAntecedentes'),
      analisis:get('gnvInfAnalisis'),
      conclusiones:get('gnvInfConclusiones'),
      recomendaciones:get('gnvInfRecomendaciones'),
      visto:get('gnvInfVisto'),
      considerando:get('gnvInfConsiderando'),
      articulo1:get('gnvInfArticulo1'),
      articulo2:get('gnvInfArticulo2'),
      articulo3:get('gnvInfArticulo3')
    };
  }

  function gnvInfStatusText(){
    if(gnvInfSent)return 'Enviado a bandeja';
    if(gnvInfSigned)return 'Firmado digitalmente';
    if(gnvInfSavedAt)return 'Guardado';
    return 'Borrador';
  }

  function gnvInfRenderMeta(project){
    var box=qs('#gnvInfProjectMeta');
    if(!box)return;
    box.innerHTML='<p><span>Agrupación:</span> <b>'+esc(project?.nombre||'—')+'</b></p>'
      +'<p><span>Código:</span> <b>'+esc(project?.id||'—')+'</b></p>'
      +'<p><span>Estado documento:</span> <b>'+esc(gnvInfStatusText())+'</b></p>'
      +(gnvInfSavedAt?'<p><span>Último guardado:</span> <b>'+esc(gnvInfSavedAt)+'</b></p>':'');
  }

  function gnvInfRenderBadges(){
    var box=qs('#gnvInfBadges');
    if(!box)return;
    var html='<span class="gnv-inf-badge draft">Borrador</span>';
    if(gnvInfSavedAt)html+='<span class="gnv-inf-badge saved">Guardado</span>';
    if(gnvInfSigned)html+='<span class="gnv-inf-badge signed">Firmado</span>';
    if(gnvInfSent)html+='<span class="gnv-inf-badge tray">En bandeja</span>';
    box.innerHTML=html;
  }

  function gnvInfDocSection(title,text,prefix){
    var lines=plainLines(text);
    var body=lines.length?lines.map(function(line){
      var pref=(prefix&&line.indexOf('Que')!==0)?prefix:'';
      return '<p>'+esc(pref+line)+'</p>';
    }).join(''):'<p>-</p>';
    return '<div class="gnv-inf-doc-section"><h4>'+esc(title)+'</h4><div>'+body+'</div></div>';
  }

  function gnvInfSignatureHtml(lider){
    var signer=gnvInfSignerName();
    if(gnvInfSignatureRegistered&&gnvInfSignatureImg){
      return '<div class="gnv-inf-sign-grid">'
        +'<div><p class="gnv-inf-sign-title">Responsable técnico</p><p>'+esc(lider||signer)+'</p><p class="gnv-inf-sign-note">SATCONTROL · Paulet</p></div>'
        +'<div class="gnv-inf-sign-box-wrap">'
        +'<div class="gnv-inf-sign-box signed">Firmado digitalmente por '+esc(signer)+'</div>'
        +'<img src="'+gnvInfSignatureImg+'" alt="Firma digital" style="display:block;margin:8px 0 0 auto;max-width:220px;border:1px solid #cbd5e1;border-radius:8px;background:#fff">'
        +'<p class="gnv-inf-sign-note">'+esc(gnvInfSignatureAt||new Date().toLocaleString('es-PE'))+'</p>'
        +'</div></div>';
    }
    var pendingText=gnvInfSignatureCaptured?'Firma capturada, pendiente de registro':'Firma pendiente';
    return '<div class="gnv-inf-sign-grid">'
      +'<div><p class="gnv-inf-sign-title">Responsable técnico</p><p>'+esc(lider||signer)+'</p><p class="gnv-inf-sign-note">SATCONTROL · Paulet</p></div>'
      +'<div class="gnv-inf-sign-box-wrap"><div class="gnv-inf-sign-box">'+esc(pendingText)+'</div></div>'
      +'</div>';
  }

  function gnvInfRenderPreview(){
    var host=qs('#gnvInfPreviewHost');
    if(!host)return;
    var doc=gnvInfReadDoc();
    var project=gnvInfGetProject();
    var stamp='FISE';
    if(gnvInfActiveView==='informe'){
      host.innerHTML='<div class="gnv-inf-paper">'
        +'<div class="gnv-inf-paper-head"><div><p class="gnv-inf-paper-kicker">FISE · Fondo de Inclusión Social Energético · Ahorro GNV</p><h4>INFORME TÉCNICO LEGAL N° '+esc(doc.numeroInforme)+'</h4></div><span class="gnv-inf-paper-stamp">'+stamp+'</span></div>'
        +'<div class="gnv-inf-paper-meta"><p><b>A:</b> '+esc(gnvInfMeta.destinatario)+'</p><p><b>De:</b> '+esc(gnvInfMeta.remitentes)+'</p><p><b>Asunto:</b> '+esc(doc.asunto)+'</p><p><b>Referencia:</b> '+esc(doc.referencia)+'</p><p><b>Fecha:</b> '+esc(gnvInfMeta.lugarFecha)+'</p></div>'
        +gnvInfDocSection('1. OBJETIVO',doc.objetivo)
        +gnvInfDocSection('2. BASE LEGAL',doc.baseLegal)
        +gnvInfDocSection('3. ANTECEDENTES',doc.antecedentes)
        +gnvInfDocSection('4. ANÁLISIS',doc.analisis)
        +gnvInfDocSection('5. CONCLUSIONES',doc.conclusiones)
        +gnvInfDocSection('6. RECOMENDACIONES',doc.recomendaciones)
        +gnvInfSignatureHtml(project?.lider)
        +'</div>';
    }else{
      host.innerHTML='<div class="gnv-inf-paper">'
        +'<div class="gnv-inf-paper-head"><div><p class="gnv-inf-paper-kicker">FISE · Fondo de Inclusión Social Energético · Ahorro GNV</p><h4>RESOLUCIÓN DE DIRECCIÓN EJECUTIVA N° '+esc(doc.numeroResolucion)+'</h4></div><span class="gnv-inf-paper-stamp">'+stamp+'</span></div>'
        +'<p class="gnv-inf-paper-date">Lima, '+esc(gnvInfMeta.lugarFecha)+'</p>'
        +gnvInfDocSection('VISTO:',doc.visto)
        +gnvInfDocSection('CONSIDERANDO:',doc.considerando,'Que, ')
        +'<div class="gnv-inf-doc-section"><h4>SE RESUELVE:</h4><p><b>Artículo 1.-</b> '+esc(doc.articulo1)+'</p><p><b>Artículo 2.-</b> '+esc(doc.articulo2)+'</p><p><b>Artículo 3.-</b> '+esc(doc.articulo3)+'</p></div>'
        +'<p class="gnv-inf-paper-strong">Regístrese y comuníquese.</p>'
        +gnvInfSignatureHtml(project?.lider)
        +'</div>';
    }
  }

  function gnvInfSetView(view){
    gnvInfActiveView=view==='resolucion'?'resolucion':'informe';
    qsa('.gnv-inf-tab').forEach(function(btn){
      btn.classList.toggle('active',btn.getAttribute('data-gnv-inf-view')===gnvInfActiveView);
    });
    var inf=qs('#gnvInfFieldsInforme');
    var res=qs('#gnvInfFieldsResolucion');
    if(inf)inf.hidden=gnvInfActiveView!=='informe';
    if(res)res.hidden=gnvInfActiveView!=='resolucion';
    gnvInfRenderPreview();
  }

  function qsa(sel,root){return Array.prototype.slice.call((root||document).querySelectorAll(sel));}

  function gnvInfBuildRecord(estado){
    var doc=gnvInfReadDoc();
    var project=gnvInfGetProject();
    return {
      id:gnvInfActiveView+'-'+Date.now(),
      tipo:gnvInfActiveView==='informe'?'Informe Técnico Legal':'Resolución de Dirección Ejecutiva',
      codigo:gnvInfActiveView==='informe'?doc.numeroInforme:doc.numeroResolucion,
      asunto:doc.asunto,
      agrupación:project?.nombre||'',
      estado:estado,
      fecha:new Date().toLocaleString(),
      vista:gnvInfActiveView,
      contenido:gnvInfActiveView==='informe'?{
        destinatario:gnvInfMeta.destinatario,
        remitentes:gnvInfMeta.remitentes,
        asunto:doc.asunto,
        referencia:doc.referencia,
        lugarFecha:gnvInfMeta.lugarFecha,
        objetivo:doc.objetivo,
        baseLegal:doc.baseLegal,
        antecedentes:doc.antecedentes,
        analisis:doc.analisis,
        conclusiones:doc.conclusiones,
        recomendaciones:doc.recomendaciones
      }:{
        asunto:doc.asunto,
        lugarFecha:gnvInfMeta.lugarFecha,
        visto:doc.visto,
        considerando:doc.considerando,
        articulo1:doc.articulo1,
        articulo2:doc.articulo2,
        articulo3:doc.articulo3
      }
    };
  }

  function gnvInfRegisterDoc(item){
    var idx=gnvInfSavedDocs.findIndex(function(d){return d.codigo===item.codigo&&d.vista===item.vista;});
    if(idx>=0)gnvInfSavedDocs[idx]=item;
    else gnvInfSavedDocs.unshift(item);
  }

  function gnvInfRefreshUi(){
    var project=gnvInfGetProject();
    gnvInfRenderMeta(project);
    gnvInfRenderBadges();
    gnvInfRenderPreview();
    var tray=qs('#gnvInfTrayMsg');
    if(tray)tray.hidden=!gnvInfSent;
  }

  function gnvInfSave(){
    gnvInfSavedAt=new Date().toLocaleString();
    gnvInfRegisterDoc(gnvInfBuildRecord('Guardado'));
    gnvInfRefreshUi();
    if(window.showToast)showToast('Informe GNV guardado');
  }

  function gnvInfSendTray(){
    if(!gnvInfSignatureCaptured){
      if(window.showToast)showToast('Debe registrar una firma antes de enviar a bandeja');
      return;
    }
    if(!gnvInfSavedAt)gnvInfSavedAt=new Date().toLocaleString();
    gnvInfSent=true;
    gnvInfRegisterDoc(gnvInfBuildRecord('Enviado a bandeja'));
    gnvInfRefreshUi();
    if(window.showToast)showToast('Documento enviado a bandeja de revisión');
  }

  function gnvInfExportSignatureBlock(){
    var signer=gnvInfSignerName();
    if(gnvInfSignatureRegistered&&gnvInfSignatureImg){
      return '<div style="margin-top:40px;border-top:1px solid #cbd5e1;padding-top:14px;text-align:center">'
        +'<p><b>Firma digital simulada:</b> Firmado digitalmente por '+esc(signer)+'</p>'
        +'<img src="'+gnvInfSignatureImg+'" alt="Firma digital" style="display:block;margin:10px auto 0;max-width:280px;border:1px solid #cbd5e1;border-radius:8px">'
        +'<p style="font-size:12px;color:#64748b">'+esc(gnvInfSignatureAt)+'</p></div>';
    }
    return '<p style="margin-top:40px"><b>Firma digital simulada:</b> '+(gnvInfSignatureCaptured?'Firma capturada, pendiente de registro':'Firma pendiente')+'</p>';
  }

  function gnvInfExport(){
    var doc=gnvInfReadDoc();
    var informeHtml='<h1>INFORME TÉCNICO LEGAL N° '+esc(doc.numeroInforme)+'</h1>'
      +'<p><b>A:</b> '+esc(gnvInfMeta.destinatario)+'</p>'
      +'<p><b>De:</b> '+esc(gnvInfMeta.remitentes)+'</p>'
      +'<p><b>Asunto:</b> '+esc(doc.asunto)+'</p>'
      +'<p><b>Referencia:</b> '+esc(doc.referencia)+'</p>'
      +'<p><b>Fecha:</b> '+esc(gnvInfMeta.lugarFecha)+'</p>'
      +'<h2>1. OBJETIVO</h2><p>'+esc(doc.objetivo)+'</p>'
      +'<h2>2. BASE LEGAL</h2>'+plainLines(doc.baseLegal).map(function(x){return '<p>'+esc(x)+'</p>';}).join('')
      +'<h2>3. ANTECEDENTES</h2>'+plainLines(doc.antecedentes).map(function(x){return '<p>'+esc(x)+'</p>';}).join('')
      +'<h2>4. ANÁLISIS</h2>'+plainLines(doc.analisis).map(function(x){return '<p>'+esc(x)+'</p>';}).join('')
      +'<h2>5. CONCLUSIONES</h2>'+plainLines(doc.conclusiones).map(function(x){return '<p>'+esc(x)+'</p>';}).join('')
      +'<h2>6. RECOMENDACIONES</h2>'+plainLines(doc.recomendaciones).map(function(x){return '<p>'+esc(x)+'</p>';}).join('');
    var resolucionHtml='<h1>RESOLUCIÓN DE DIRECCIÓN EJECUTIVA N° '+esc(doc.numeroResolucion)+'</h1>'
      +'<p style="text-align:right">Lima, '+esc(gnvInfMeta.lugarFecha)+'</p>'
      +'<h2>VISTO:</h2><p>'+esc(doc.visto)+'</p>'
      +'<h2>CONSIDERANDO:</h2>'+plainLines(doc.considerando).map(function(x){return '<p>'+esc(x)+'</p>';}).join('')
      +'<h2>SE RESUELVE:</h2>'
      +'<p><b>Artículo 1.-</b> '+esc(doc.articulo1)+'</p>'
      +'<p><b>Artículo 2.-</b> '+esc(doc.articulo2)+'</p>'
      +'<p><b>Artículo 3.-</b> '+esc(doc.articulo3)+'</p>'
      +'<p><b>Regístrese y comuníquese.</b></p>';
    var body=gnvInfActiveView==='informe'?informeHtml:resolucionHtml;
    var html='<!DOCTYPE html><html><head><meta charset="utf-8"><title>'+esc(gnvInfActiveView==='informe'?doc.numeroInforme:doc.numeroResolucion)+'</title></head>'
      +'<body style="font-family:Arial,sans-serif;padding:36px;color:#111827;line-height:1.45">'+body
      +gnvInfExportSignatureBlock()+'</body></html>';
    var blob=new Blob([html],{type:'text/html;charset=utf-8'});
    var url=URL.createObjectURL(blob);
    var link=document.createElement('a');
    link.href=url;
    link.download=(gnvInfActiveView==='informe'?doc.numeroInforme:doc.numeroResolucion)+'.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(function(){URL.revokeObjectURL(url);},800);
    if(window.showToast)showToast('Documento GNV exportado');
  }

  function gnvInfRenderSavedPreview(item){
    var host=qs('#gnvInfSavedPreviewHost');
    if(!host)return;
    if(!item){host.innerHTML='<div class="gnv-inf-saved-empty">Selecciona un documento para visualizarlo.</div>';return;}
    var c=item.contenido||{};
    var inner='';
    if(item.vista==='informe'){
      inner=gnvInfDocSection('A',c.destinatario)
        +gnvInfDocSection('DE',c.remitentes)
        +gnvInfDocSection('REFERENCIA',c.referencia)
        +gnvInfDocSection('1. OBJETIVO',c.objetivo)
        +gnvInfDocSection('2. BASE LEGAL',c.baseLegal)
        +gnvInfDocSection('3. ANTECEDENTES',c.antecedentes)
        +gnvInfDocSection('4. ANÁLISIS',c.analisis)
        +gnvInfDocSection('5. CONCLUSIONES',c.conclusiones)
        +gnvInfDocSection('6. RECOMENDACIONES',c.recomendaciones);
    }else{
      inner=gnvInfDocSection('VISTO',c.visto)
        +gnvInfDocSection('CONSIDERANDO',c.considerando)
        +gnvInfDocSection('ARTÍCULO 1',c.articulo1)
        +gnvInfDocSection('ARTÍCULO 2',c.articulo2)
        +gnvInfDocSection('ARTÍCULO 3',c.articulo3);
    }
    host.innerHTML='<div class="gnv-inf-paper"><div class="gnv-inf-paper-head"><div><p class="gnv-inf-paper-kicker">FISE · Documento almacenado · Ahorro GNV</p><h4>'+esc(item.tipo)+'</h4><p class="gnv-inf-paper-code">'+esc(item.codigo)+'</p></div></div>'
      +'<div class="gnv-inf-paper-meta"><p><b>Agrupación:</b> '+esc(item.agrupación)+'</p><p><b>Asunto:</b> '+esc(item.asunto)+'</p><p><b>Estado:</b> '+esc(item.estado)+'</p><p><b>Fecha:</b> '+esc(item.fecha)+'</p></div>'
      +inner+'</div>';
  }

  function gnvInfRenderSavedList(){
    var list=qs('#gnvInfSavedList');
    if(!list)return;
    if(!gnvInfSavedDocs.length){
      list.innerHTML='<div class="gnv-inf-saved-empty">No hay documentos guardados todavía.</div>';
      gnvInfRenderSavedPreview(null);
      return;
    }
    list.innerHTML=gnvInfSavedDocs.map(function(item){
      var active=gnvInfSelectedSaved&&gnvInfSelectedSaved.id===item.id?' active':'';
      return '<button type="button" class="gnv-inf-saved-item'+active+'" data-gnv-inf-saved="'+esc(item.id)+'">'
        +'<div class="gnv-inf-saved-item-top"><div><b>'+esc(item.tipo)+'</b><span>'+esc(item.codigo)+'</span></div><em>'+esc(item.estado)+'</em></div>'
        +'<p>'+esc(item.asunto)+'</p><small>'+esc(item.fecha)+'</small></button>';
    }).join('');
    list.querySelectorAll('[data-gnv-inf-saved]').forEach(function(btn){
      btn.addEventListener('click',function(){
        var id=btn.getAttribute('data-gnv-inf-saved');
        gnvInfSelectedSaved=gnvInfSavedDocs.find(function(x){return x.id===id;})||null;
        gnvInfRenderSavedList();
        gnvInfRenderSavedPreview(gnvInfSelectedSaved);
      });
    });
    if(!gnvInfSelectedSaved)gnvInfSelectedSaved=gnvInfSavedDocs[0];
    gnvInfRenderSavedPreview(gnvInfSelectedSaved);
  }

  function gnvInfOpenSavedDocsModal(){
    if(!gnvInfInitialized&&typeof window.gnvInfInit==='function')window.gnvInfInit();
    if(!gnvInfSelectedSaved&&gnvInfSavedDocs.length)gnvInfSelectedSaved=gnvInfSavedDocs[0];
    gnvInfRenderSavedList();
    var modal=qs('#gnvDocumentosGuardadosModal');
    if(modal)modal.classList.add('open');
  }

  function gnvInfResetSession(){
    var project=gnvInfGetProject();
    gnvInfSavedAt='';
    gnvInfSigned=false;
    gnvInfSent=false;
    gnvInfActiveView='informe';
    gnvInfLoadDoc(gnvInfApplyProject(project));
    gnvInfClearSignatureCanvas();
    gnvInfSetView('informe');
    gnvInfRefreshUi();
  }

  window.openGnvInformeTecnicoModal=function(){
    if(!gnvInfInitialized)gnvInfInit();
    gnvInfResetSession();
    gnvInfSetupSignaturePad();
    var modal=qs('#gnvInformeTecnicoModal');
    if(modal)modal.classList.add('open');
  };
  window.openGnvDocumentosGuardadosModal=gnvInfOpenSavedDocsModal;

  window.gnvInfInit=function(){
    if(gnvInfInitialized)return;
    gnvInfInitialized=true;

    qsa('.gnv-inf-tab').forEach(function(btn){
      btn.addEventListener('click',function(){gnvInfSetView(btn.getAttribute('data-gnv-inf-view'));});
    });
    qs('#gnvInfSaveBtn')?.addEventListener('click',gnvInfSave);
    qs('#gnvInfExportBtn')?.addEventListener('click',gnvInfExport);
    qs('#gnvInfTrayBtn')?.addEventListener('click',gnvInfSendTray);
    qs('#gnvInfSavedDocsBtn')?.addEventListener('click',gnvInfOpenSavedDocsModal);
    qs('#gnvInfClearSignatureBtn')?.addEventListener('click',gnvInfClearSignatureCanvas);
    qs('#gnvInfSignRegisterBtn')?.addEventListener('click',gnvInfRegisterSignature);

    qsa('#gnvInformeTecnicoModal textarea, #gnvInformeTecnicoModal input').forEach(function(el){
      el.addEventListener('input',function(){
        gnvInfRenderPreview();
        gnvInfRenderMeta(gnvInfGetProject());
      });
    });

    injectGnvInfStyles();
  };

  function injectGnvInfStyles(){
    if(document.getElementById('gnv-inf-styles'))return;
    var s=document.createElement('style');
    s.id='gnv-inf-styles';
    s.textContent=
      '#gnvInformeTecnicoModal .modal-card{width:min(1280px,96vw);max-height:92vh}'
      +'#gnvDocumentosGuardadosModal .modal-card{width:min(1100px,96vw);max-height:88vh}'
      +'.gnv-inf-head-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap}'
      +'.gnv-inf-icon-btn{min-width:42px;padding:10px 12px;font-size:16px}'
      +'.gnv-inf-layout{display:grid;grid-template-columns:360px 1fr;gap:14px;align-items:start}'
      +'.gnv-inf-sidebar,.gnv-inf-main{border:1px solid #293b67;background:#0d1630;border-radius:18px;padding:14px;min-width:0}'
      +'.gnv-inf-field{display:grid;gap:6px;margin-bottom:12px}'
      +'.gnv-inf-field.block{margin-bottom:14px}'
      +'.gnv-inf-field span{color:#93a4c7;font-size:10px;font-weight:950;text-transform:uppercase;letter-spacing:.04em}'
      +'.gnv-inf-field input,.gnv-inf-field textarea{width:100%;border:1px solid #293b67;background:#111a31;color:#fff;border-radius:12px;padding:10px 12px;font-weight:800;font-size:12px;line-height:1.45;outline:none}'
      +'.gnv-inf-field textarea{resize:vertical;min-height:72px}'
      +'.gnv-inf-tabs{display:grid;grid-template-columns:1fr 1fr;gap:8px}'
      +'.gnv-inf-tab{border:1px solid #293b67;background:#111a31;color:#cbd5e1;border-radius:12px;padding:10px;font-size:11px;font-weight:900;cursor:pointer}'
      +'.gnv-inf-tab.active{background:#0ea5e9;border-color:#22d3ee;color:#fff}'
      +'.gnv-inf-meta{border:1px solid #293b67;background:#111a31;border-radius:14px;padding:12px;font-size:12px;font-weight:800;color:#cbd5e1}'
      +'.gnv-inf-meta p{margin:0 0 8px}.gnv-inf-meta p:last-child{margin-bottom:0}.gnv-inf-meta span{color:#64748b}'
      +'.gnv-inf-main-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px}'
      +'.gnv-inf-main-head h3{margin:0;color:#e0f2fe;font-size:15px}'
      +'.gnv-inf-badges{display:flex;flex-wrap:wrap;gap:6px}'
      +'.gnv-inf-badge{border-radius:999px;padding:5px 10px;font-size:10px;font-weight:950}'
      +'.gnv-inf-badge.draft{background:#334155;color:#e2e8f0}'
      +'.gnv-inf-badge.saved{background:rgba(34,211,238,.15);color:#a5f3fc}'
      +'.gnv-inf-badge.signed{background:rgba(16,185,129,.15);color:#86efac}'
      +'.gnv-inf-badge.tray{background:rgba(245,158,11,.15);color:#fde68a}'
      +'.gnv-inf-preview-wrap{margin-top:14px}'
      +'.gnv-inf-preview{border:1px solid #334155;border-radius:16px;padding:10px;background:#09101f;max-height:420px;overflow:auto}'
      +'.gnv-inf-paper{background:#fff;color:#0f172a;border-radius:14px;padding:22px;box-shadow:0 14px 35px rgba(0,0,0,.18)}'
      +'.gnv-inf-paper-head{display:flex;justify-content:space-between;gap:12px;border-bottom:1px solid #cbd5e1;padding-bottom:12px;margin-bottom:12px}'
      +'.gnv-inf-paper-kicker{margin:0;color:#64748b;font-size:10px;font-weight:950;text-transform:uppercase}'
      +'.gnv-inf-paper-head h4{margin:8px 0 0;font-size:18px;font-weight:950}'
      +'.gnv-inf-paper-stamp{border:1px solid #0ea5e9;color:#0e7490;border-radius:12px;padding:8px 12px;font-size:12px;font-weight:950;height:fit-content}'
      +'.gnv-inf-paper-meta p{margin:0 0 6px;font-size:12px;font-weight:700}'
      +'.gnv-inf-paper-date{text-align:right;font-size:12px;font-weight:800;margin:0 0 12px}'
      +'.gnv-inf-doc-section{margin-top:14px}'
      +'.gnv-inf-doc-section h4{margin:0 0 8px;font-size:12px;font-weight:950;text-transform:uppercase}'
      +'.gnv-inf-doc-section p{margin:0 0 6px;font-size:12px;line-height:1.45}'
      +'.gnv-inf-paper-strong{font-weight:950;font-size:12px;margin-top:12px}'
      +'.gnv-inf-sign-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;border-top:1px solid #cbd5e1;margin-top:18px;padding-top:14px}'
      +'.gnv-inf-sign-title{font-weight:950;margin:0 0 4px}'
      +'.gnv-inf-sign-note{font-size:10px;color:#64748b;margin:4px 0 0}'
      +'.gnv-inf-sign-box-wrap{text-align:right}'
      +'.gnv-inf-sign-box{display:inline-block;border:1px solid #cbd5e1;background:#f8fafc;color:#64748b;border-radius:12px;padding:10px 14px;font-size:10px;font-weight:950}'
      +'.gnv-inf-sign-box.signed{border-color:#10b981;background:#ecfdf5;color:#047857}'
      +'.gnv-inf-tray-msg{margin-top:12px;border:1px solid rgba(245,158,11,.35);background:rgba(245,158,11,.12);color:#fde68a;border-radius:14px;padding:12px;font-size:12px;font-weight:800}'
      +'.gnv-inf-saved-layout{display:grid;grid-template-columns:340px 1fr;gap:0;min-height:520px;border:1px solid #293b67;border-radius:18px;overflow:hidden}'
      +'.gnv-inf-saved-list{border-right:1px solid #293b67;background:#0d1630;padding:12px;overflow:auto;max-height:calc(88vh - 120px)}'
      +'.gnv-inf-saved-preview{padding:16px;background:#17233f;overflow:auto;max-height:calc(88vh - 120px)}'
      +'.gnv-inf-saved-empty{border:1px dashed #475569;border-radius:14px;padding:18px;color:#94a3b8;font-size:12px;font-weight:800}'
      +'.gnv-inf-saved-item{width:100%;text-align:left;border:1px solid #334155;background:#111a31;color:#e2e8f0;border-radius:14px;padding:12px;margin-bottom:8px;cursor:pointer}'
      +'.gnv-inf-saved-item.active{border-color:#22d3ee;background:rgba(14,165,233,.12)}'
      +'.gnv-inf-saved-item-top{display:flex;justify-content:space-between;gap:8px;margin-bottom:6px}'
      +'.gnv-inf-saved-item b{display:block;font-size:12px}'
      +'.gnv-inf-saved-item span{display:block;margin-top:3px;color:#67e8f9;font-size:11px;font-weight:800}'
      +'.gnv-inf-saved-item em{font-style:normal;border-radius:999px;background:#334155;padding:4px 8px;font-size:9px;font-weight:950}'
      +'.gnv-inf-saved-item p{margin:0;font-size:11px;font-weight:700;color:#cbd5e1}'
      +'.gnv-inf-saved-item small{display:block;margin-top:6px;color:#64748b;font-size:10px;font-weight:800}'
      +'.gnv-inf-paper-code{margin:4px 0 0;color:#0e7490;font-size:12px;font-weight:900}'
      +'@media(max-width:1100px){.gnv-inf-layout{grid-template-columns:1fr}.gnv-inf-saved-layout{grid-template-columns:1fr}}';
    document.head.appendChild(s);
  }
})();

/* getModuleSource definido en bootstrap modular */
(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));
  const fmt = n => 'S/ ' + Number(n || 0).toLocaleString('es-PE');
  const popup = r => Object.entries(r.popup || {}).map(([k, v]) => `<b>${k}:</b> ${v}`).join('<br>');
  let spaLayer = null;
  let heatLayer = null;
  let selectedMarker = null;
  let activeModule = 'bonogas';

  const modules = {
    bonogas: {
      nav: ['#navDashboard', '[title*="Bono"]', '[data-open-module="bonogas"]'],
      top: 'SATCONTROL · BONO GAS',
      sub: 'Control de redes, instalaciones, plazos Art. 25.9 y beneficiarios',
      side: 'Control de Plazos e Instalaciones - BonoGas',
      label: 'Instalaciones y plazos',
      center: [-9.19, -75.02],
      filters: `<select id="spaEstratoFilter"><option value="todos">Estratos 1, 2 y 3</option><option value="1">Estrato 1</option><option value="2">Estrato 2</option><option value="3">Estrato 3</option></select><button data-spa-heat="bonogas">Mapa calor morosidad</button>`,
      kpis: [
        ['Costo de instalación', 482000],
        ['Monto subsidiado', 219000],
        ['Monto a financiar', 182500],
        ['Monto pendiente', 79400]
      ],
      rows: [
        { id: 'BG-001', name: 'SUM-100438', lat: -12.0458, lng: -77.0442, state: 'Habilitado liquidado', color: '#22c55e', type: 'Residencial', alert: false, popup: { 'N° Suministro': 'SUM-100438', 'N° Instalación': 'INS-9021', Tipo: 'Residencial', 'Fecha de habilitación': '2026-05-12', Estrato: '2', Material: 'PEAD 32 mm', Empresa: 'GasSur Instalaciones' } },
        { id: 'BG-002', name: 'SUM-100512', lat: -12.0491, lng: -77.0418, state: 'Pendiente de liquidación', color: '#f59e0b', type: 'Residencial', alert: false, popup: { 'N° Suministro': 'SUM-100512', 'N° Instalación': 'INS-9077', Tipo: 'Residencial', 'Fecha de habilitación': '2026-05-19', Estrato: '1', Material: 'PEAD 20 mm', Empresa: 'Andes Gas' } },
        { id: 'BG-003', name: 'SUM-100620', lat: -12.0431, lng: -77.0396, state: 'Construcción dentro de plazo', color: '#0ea5e9', type: 'Comercial', alert: false, popup: { 'N° Suministro': 'SUM-100620', 'N° Instalación': 'INS-9110', Tipo: 'Comercial', 'Fecha de habilitación': 'Pendiente', Estrato: '3', Material: 'Acero galvanizado', Empresa: 'TecnoGas Perú' } },
        { id: 'BG-004', name: 'SUM-100731', lat: -12.0508, lng: -77.0465, state: 'Construcción fuera de plazo', color: '#ef4444', type: 'Residencial', alert: true, popup: { 'N° Suministro': 'SUM-100731', 'N° Instalación': 'INS-9172', Tipo: 'Residencial', 'Fecha de habilitación': 'Pendiente', Estrato: '2', Material: 'PEAD 32 mm', Empresa: 'RedGas Contratistas' } }
      ],
      extra: () => `
        <div class="spa-section"><h3>Art. 25.9 · Construcción >=90 días</h3><table class="spa-table"><tbody>
          <tr><td>RedGas Contratistas</td><td>7 suministros</td><td><button data-spa-toast="Notificación de penalidad enviada">Enviar notificación de penalidad</button></td></tr>
          <tr><td>Andes Gas</td><td>4 suministros</td><td><button data-spa-toast="Notificación de penalidad enviada">Enviar notificación de penalidad</button></td></tr>
        </tbody></table></div>
        <div class="spa-section"><h3>Validación Inteligente IA · DJ 2 hojas</h3><label class="spa-dropzone">Cargar Declaración Jurada<input id="spaAiUpload" type="file" accept=".pdf,image/*"></label><div id="spaAiResult" class="spa-log">Pendiente de archivo.</div></div>`
    },
    gnv: {
      nav: ['#navAhorroGnv', '[data-open-module="gnv"]'],
      top: 'SATCONTROL · AHORRO GNV',
      sub: 'Financiamiento, conversiones vehiculares, talleres y control de estaciones GNV',
      side: 'Detalle de Recaudación y Estaciones - Ahorro GNV',
      label: 'Conversiones y estaciones',
      center: [-12.071, -77.034],
      filters: `<input type="date" value="2026-06-01"><select><option>GNV</option><option>Dual</option></select><select><option>1 cilindro</option><option>2 cilindros</option></select><select><option>COFIDE</option><option>Financiera aliada</option></select><button id="spaExportGnv">Exportar Resumen</button>`,
      kpis: [['Mes', 1280], ['Año', 9420], ['Región Lima', 5140], ['Meta vs Real', '88%']],
      rows: [
        { id: 'GNV-001', name: 'EST-Primax Javier Prado', lat: -12.086, lng: -77.032, state: 'Alta recarga', color: '#22c55e', type: 'Estación', alert: false, popup: { Placa: 'A8K-392', Estación: 'Primax Javier Prado', Región: 'Lima', Recargas: '49', Financiera: 'COFIDE' } },
        { id: 'GNV-002', name: 'VH-Bono Provincia', lat: -12.062, lng: -77.05, state: 'Permanencia Lima >30 días', color: '#ef4444', type: 'Vehículo', alert: true, popup: { Placa: 'B7P-102', Alerta: 'Pierde Bono Provincia', Permanencia: '37 días', Ciudad: 'Lima' } },
        { id: 'GNV-003', name: 'EST-Surco GNV', lat: -12.119, lng: -76.991, state: 'Densidad media', color: '#f59e0b', type: 'Estación', alert: false, popup: { Placa: 'C3M-771', Estación: 'Surco GNV', Región: 'Lima', Recargas: '24', Financiera: 'Entidad aliada' } }
      ],
      extra: () => `
        <div class="spa-section"><h3>Meta vs. Real</h3><div class="spa-bars"><span style="height:78%"></span><span style="height:88%"></span><span style="height:64%"></span><span style="height:92%"></span></div></div>
        <div class="spa-section"><h3>Firma digital de liquidaciones</h3><button id="spaSignBatch">Firmar en lote</button><div id="spaSignState" class="spa-log">3 expedientes listos para director.</div></div>
        <div class="spa-section"><h3>API COFIDE · Amazon</h3><button id="spaRunApi">Ejecutar ping API</button><pre id="spaApiLog" class="spa-console">[08:30] XML manual reemplazado por integración API.</pre></div>`
    },
    vale: {
      nav: ['#navValeFise', '[data-open-module="vale"]'],
      top: 'SATCONTROL · VALE FISE',
      sub: 'Subsidio digital GLP, asignaciones mensuales, canjes, agentes y fiscalización',
      side: 'Cobertura Regional y Fiscalización - Vale FISE',
      label: 'Canjes, padrón y agentes GLP',
      center: [-12.055, -77.02],
      filters: `<select id="spaEdeFilter"><option>Todas las EDE</option><option>Luz del Sur</option><option>Electro Oriente</option></select><input id="spaPadronSearch" placeholder="DNI 8 dígitos o código suministro"><button id="spaPadronBtn">Buscar</button>`,
      kpis: [['Canjes API grandes EDE', 18420], ['EDE pequeñas pendientes', 7], ['Alertas fraude', 18], ['Baja cobertura', 11]],
      rows: [
        { id: 'VF-001', name: 'DNI 45892103', lat: -12.051, lng: -77.018, state: 'Canje normal', color: '#22c55e', type: 'Beneficiario', alert: false, popup: { DNI: '45892103', Suministro: 'FISE-90217', EDE: 'Luz del Sur', Agente: 'GLP San Pedro' } },
        { id: 'VF-002', name: 'Agente GLP Norte', lat: -12.061, lng: -77.028, state: '>50 canjes por hora', color: '#ef4444', type: 'Fraude', alert: true, popup: { Agente: 'GLP Norte', Regla: '>50 canjes/hora', Histórico: 'Alerta almacenada', Distrito: 'Rímac' } },
        { id: 'VF-003', name: 'SUM FISE-7712', lat: -12.046, lng: -77.011, state: 'Canje múltiple <30 días', color: '#f59e0b', type: 'Anomalía', alert: true, popup: { Suministro: 'FISE-7712', Regla: 'Canjes múltiples', EDE: 'Electro Oriente', Agente: 'GLP Autorizado Central' } }
      ],
      extra: () => `
        <div class="spa-section"><h3>Reporte diario 25 EDE</h3><table class="spa-table"><tbody><tr><td>Grandes EDE</td><td>API automática</td><td>18,420 registros</td></tr><tr><td>EDE pequeñas</td><td><button data-spa-toast="Carga .xlsx simulada">Cargar archivo .xlsx</button></td><td>7 pendientes</td></tr></tbody></table></div>
        <div class="spa-section"><h3>Histórico de alertas</h3><div class="spa-log">Fraude #1042 almacenado · Agente con 64 canjes/hora<br>Fraude #1043 almacenado · Beneficiario con doble canje</div></div>`
    }
  };

  modules.bonogas.rows.push(
    { id: 'BG-005', name: 'SUM-100884', lat: -12.0419, lng: -77.0479, state: 'Habilitado liquidado', color: '#22c55e', type: 'Residencial', alert: false, popup: { 'N° Suministro': 'SUM-100884', 'N° Instalación': 'INS-9214', Tipo: 'Residencial', 'Fecha de habilitación': '2026-05-23', Estrato: '1', Material: 'PEAD 25 mm', Empresa: 'NorteGas SAC', Subsidio: '82%', 'Monto pendiente': fmt(180) } },
    { id: 'BG-006', name: 'SUM-101020', lat: -12.0522, lng: -77.0371, state: 'Construcción fuera de plazo', color: '#ef4444', type: 'Multifamiliar', alert: true, popup: { 'N° Suministro': 'SUM-101020', 'N° Instalación': 'INS-9288', Tipo: 'Multifamiliar', 'Fecha de habilitación': 'Pendiente', Estrato: '3', Material: 'Acero + PEAD', Empresa: 'RedGas Contratistas', Alerta: '26 días hábiles' } },
    { id: 'BG-007', name: 'SUM-101104', lat: -12.0397, lng: -77.041, state: 'Pendiente de liquidación', color: '#f59e0b', type: 'Residencial', alert: false, popup: { 'N° Suministro': 'SUM-101104', 'N° Instalación': 'INS-9302', Tipo: 'Residencial', 'Fecha de habilitación': '2026-05-28', Estrato: '2', Material: 'PEAD 20 mm', Empresa: 'GasSur Instalaciones', 'Monto pendiente': fmt(620) } },
    { id: 'BG-008', name: 'TRONCAL-SJL-04', lat: -12.0473, lng: -77.0507, state: 'Agrupación nuevo troncal', color: '#8b5cf6', type: 'Red troncal', alert: false, popup: { Tramo: 'TRONCAL-SJL-04', Longitud: '1.8 km', Estado: 'Programado', Empresa: 'Consorcio Redes Lima', Articulo: '25.9' } }
  );
  modules.bonogas.kpis.push(['Instalaciones fuera de plazo', 11], ['Empresas notificadas', 3]);

  modules.gnv.rows.push(
    { id: 'GNV-004', name: 'Taller GNV Callao', lat: -12.055, lng: -77.118, state: 'Meta mensual 94%', color: '#38bdf8', type: 'Taller', alert: false, popup: { Taller: 'GNV Callao Motors', Conversiones: '312', Mes: 'Junio 2026', Financiera: 'COFIDE', Estado: 'Operativo' } },
    { id: 'GNV-005', name: 'VH-Cusco desplazado', lat: -12.073, lng: -77.071, state: 'Bono Provincia en riesgo', color: '#ef4444', type: 'Vehículo', alert: true, popup: { Placa: 'X4Q-880', Origen: 'Cusco', Permanencia: '29 días', Regla: 'Seguimiento preventivo', ÚltimaRecarga: 'Lima Centro' } },
    { id: 'GNV-006', name: 'EST-La Molina GNV', lat: -12.082, lng: -76.943, state: 'Densidad alta', color: '#22c55e', type: 'Estación', alert: false, popup: { Estación: 'La Molina GNV', Recargas: '78', Región: 'Lima Este', Cilindros: '2', Combustible: 'GNV' } },
    { id: 'GNV-007', name: 'API COFIDE Lote 06', lat: -12.034, lng: -77.01, state: 'Sincronización parcial', color: '#f59e0b', type: 'API', alert: false, popup: { Servicio: 'Amazon COFIDE', Lote: '06', Resultado: '42 OK / 3 retry', Hora: '17:15', XML: 'No requerido' } }
  );
  modules.gnv.kpis.push(['Alertas Bono Provincia', 9], ['Expedientes por firmar', 34]);

  modules.vale.rows.push(
    { id: 'VF-004', name: 'DNI 70451288', lat: -12.033, lng: -77.036, state: 'Baja cobertura distrital', color: '#38bdf8', type: 'Beneficiario', alert: false, popup: { DNI: '70451288', Suministro: 'FISE-11044', EDE: 'Enel', Distrito: 'Los Olivos', Cobertura: '42%' } },
    { id: 'VF-005', name: 'EDE pequeña Norte', lat: -12.075, lng: -77.021, state: 'Pendiente .xlsx', color: '#f59e0b', type: 'EDE pequeña', alert: false, popup: { EDE: 'Electro Norte Chico', Estado: 'Pendiente de carga', Archivo: 'canjes_junio.xlsx', Registros: '1,240' } },
    { id: 'VF-006', name: 'Agente GLP Central', lat: -12.066, lng: -77.006, state: '72 canjes por hora', color: '#ef4444', type: 'Fraude', alert: true, popup: { Agente: 'GLP Central', Regla: '>50 canjes/hora', Hora: '10:00-11:00', Histórico: 'Fraude #1044' } },
    { id: 'VF-007', name: 'SUM FISE-8840', lat: -12.038, lng: -77.004, state: 'Canje duplicado', color: '#ef4444', type: 'Anomalía', alert: true, popup: { Suministro: 'FISE-8840', DNI: '61294022', Regla: '2 canjes en 18 días', Agente: 'GLP San Pedro' } },
    { id: 'VF-008', name: 'Zona baja cobertura', lat: -12.089, lng: -77.042, state: 'Heatmap padrón GLP', color: '#8b5cf6', type: 'Cobertura', alert: false, popup: { Distrito: 'Chorrillos', Beneficiarios: '2,812', EDE: 'Luz del Sur', Cobertura: '58%' } }
  );
  modules.vale.kpis.push(['Beneficiarios padrón', 128400], ['Agentes GLP activos', 842]);

  function ensureCss() {
    if ($('#spaRefinedCss')) return;
    const style = document.createElement('style');
    style.id = 'spaRefinedCss';
    style.textContent = `
      .spa-mode .left-panel .panel-head h2{font-size:22px!important}
      .main.spa-mode .content{display:grid!important;visibility:visible!important;opacity:1!important}
      .main.spa-mode .integrated-module-env,.main.spa-mode .solicitudes-env,.main.spa-mode .validaciones-env,.main.spa-mode .hospital-env,.main.spa-mode .project-create-env,.main.spa-mode .project-list-env,.main.spa-mode .project-delete-env{display:none!important}
      .main.spa-mode .left-panel,.main.spa-mode .map-wrap,.main.spa-mode .info-panel{display:flex!important;visibility:visible!important;opacity:1!important}
      .main.spa-mode .map-wrap{display:block!important}
      .spa-card{border:1px solid rgba(103,232,249,.16);background:#111a31;border-radius:12px;padding:12px;color:#eaf2ff}
      .spa-card h3,.spa-section h3{margin:0 0 10px;font-size:13px;color:#e0f2fe}
      .spa-kpis{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;margin:12px 0}
      .spa-kpi{border:1px solid #32426b;background:#151d35;border-radius:10px;padding:10px}
      .spa-kpi span{display:block;color:#aebbd3;font-size:10px;font-weight:850}.spa-kpi b{font-size:16px;color:#fff}
      .spa-controls{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0}.spa-controls input,.spa-controls select,.spa-controls button,.spa-section button,.spa-table button{height:34px;border:1px solid #33446f;background:#101830;color:#eaf2ff;border-radius:8px;padding:0 10px;font-size:11px;font-weight:900}
      .spa-controls button,.spa-section button,.spa-table button{background:#1b6f8a;border:0;color:#fff}
      .spa-table{width:100%;border-collapse:separate;border-spacing:0 7px}.spa-table th{color:#93a4c7;text-align:left;font-size:10px;text-transform:uppercase}.spa-table td{background:#151d35;border-top:1px solid #ffffff10;border-bottom:1px solid #ffffff10;padding:9px 8px;font-size:11px;font-weight:850}.spa-table tr{cursor:pointer}.spa-table tr:hover td{background:#1b2a4f}.spa-alert td{box-shadow:inset 3px 0 #ef4444}
      .spa-section{border:1px solid rgba(103,232,249,.14);background:#0d1630;border-radius:12px;padding:12px;margin-top:10px}.spa-log,.spa-console{border:1px solid #33446f;background:#080f21;color:#b7c7e6;border-radius:10px;padding:10px;font-size:11px;line-height:1.45;white-space:pre-wrap}.spa-dropzone{display:grid;place-items:center;min-height:86px;border:1px dashed #38bdf8;border-radius:12px;background:#101830;color:#e0f2fe;font-weight:950}.spa-dropzone input{display:none}.spa-bars{height:120px;display:flex;align-items:end;gap:10px}.spa-bars span{flex:1;background:linear-gradient(180deg,#38bdf8,#22c55e);border-radius:8px 8px 0 0}.spa-map-dot{width:18px;height:18px;border-radius:999px;border:3px solid #fff;box-shadow:0 8px 24px #0008}.spa-heat{filter:blur(1px)}
    `;
    document.head.appendChild(style);
  }

  function mapReady() {
    return typeof L !== 'undefined' && typeof leafletMap !== 'undefined' && leafletMap;
  }

  function clearMap() {
    if (!mapReady()) return;
    if (spaLayer) leafletMap.removeLayer(spaLayer);
    if (heatLayer) leafletMap.removeLayer(heatLayer);
    if (selectedMarker) leafletMap.removeLayer(selectedMarker);
    spaLayer = L.layerGroup().addTo(leafletMap);
    heatLayer = null;
    selectedMarker = null;
  }

  function paintMap(mod) {
    if (!mapReady()) return;
    clearMap();
    mod.rows.forEach(row => {
      const marker = L.circleMarker([row.lat, row.lng], {
        radius: row.alert ? 10 : 8,
        color: '#fff',
        weight: 2,
        fillColor: row.color,
        fillOpacity: .92
      }).addTo(spaLayer);
      marker.bindPopup(`<b>${row.name}</b><br>${row.state}<br>${popup(row)}`);
      marker.on('click', () => selectRow(row));
    });
    const network = L.polyline(mod.rows.map(r => [r.lat, r.lng]), { color: '#38bdf8', weight: 4, opacity: .55, dashArray: '8 8' }).addTo(spaLayer);
    network.bindPopup(`<b>${mod.label}</b><br>Capa geográfica específica del módulo`);
    leafletMap.flyTo(mod.center, 13, { duration: .7 });
  }

  function paintHeat(mod) {
    if (!mapReady()) return;
    if (heatLayer) leafletMap.removeLayer(heatLayer);
    heatLayer = L.layerGroup().addTo(leafletMap);
    mod.rows.forEach((r, i) => {
      L.circle([r.lat, r.lng], {
        radius: 420 + i * 180,
        color: r.alert ? '#ef4444' : '#f59e0b',
        fillColor: r.alert ? '#ef4444' : '#f59e0b',
        fillOpacity: r.alert ? .28 : .18,
        weight: 0,
        className: 'spa-heat'
      }).addTo(heatLayer);
    });
    toast('Mapa calórico activado para ' + mod.label);
  }

  function renderPanel(key) {
    activeModule = key;
    const mod = modules[key];
    const main = $('.main');
    main?.classList.remove('requests-mode','validations-mode','hospital-mode','vale-fise-mode','ahorro-gnv-mode','fotovoltaico-mode','electricidad-mode','masificacion-mode','create-project-mode','project-list-mode','project-delete-mode');
    main?.classList.add('spa-mode');
    $('.content')?.classList.remove('left-hidden','right-hidden');
    $('.app')?.classList.remove('sidebar-hidden');
    $('.sidebar')?.classList.remove('collapsed');
    const title = $('.topbar h1'); if (title) title.textContent = mod.top;
    const sub = $('.topbar p'); if (sub) { sub.textContent = mod.sub || 'Control territorial, documentos, liquidaciones y seguimiento operativo'; sub.style.display = ''; }
    const head = $('.left-panel .panel-head h2'); if (head) head.textContent = mod.label;
    const hint = $('.left-panel .panel-head p'); if (hint) hint.textContent = 'Filtre, seleccione una fila y el mapa hará flyTo con popup.';
    const list = $('#projectList');
    if (list) list.innerHTML = `
      <div class="spa-card"><h3>${mod.side}</h3><div class="spa-controls">${mod.filters}</div></div>
      <div class="spa-kpis">${mod.kpis.map(([a,b]) => `<div class="spa-kpi"><span>${a}</span><b>${typeof b === 'number' ? fmt(b) : b}</b></div>`).join('')}</div>
      <table class="spa-table"><thead><tr><th>Registro</th><th>Tipo</th><th>Estado</th><th>Detalle</th><th>Alerta</th></tr></thead><tbody>${mod.rows.map(r => `<tr class="${r.alert ? 'spa-alert' : ''}" data-spa-row="${r.id}"><td>${r.name}</td><td>${r.type}</td><td>${r.state}</td><td>${Object.entries(r.popup || {}).slice(0,2).map(([k,v]) => `${k}: ${v}`).join(' · ')}</td><td>${r.alert ? 'Crítica' : 'Normal'}</td></tr>`).join('')}</tbody></table>
      ${mod.extra()}
    `;
    $('#infoContextLabel').textContent = 'Módulo:';
    $('#infoName').textContent = mod.side.toUpperCase();
    $('#infoPlace').textContent = 'SATCONTROL · SPA';
    $('#details').innerHTML = `<div class="spa-card"><h3>Detalle dinámico</h3><p>Seleccione una fila para desplazar el mapa y abrir el popup técnico.</p></div>`;
    $('#supplyDetails').innerHTML = `<h3>${mod.side}</h3><p class="supply-hint">Capas del mapa limpiadas y repintadas para este programa.</p>`;
    paintMap(mod);
    bindDynamicControls();
  }

  function forceGeneralContentVisible() {
    const main = $('.main');
    const content = $('.content');
    main?.classList.remove('requests-mode','validations-mode','hospital-mode','vale-fise-mode','ahorro-gnv-mode','fotovoltaico-mode','electricidad-mode','masificacion-mode','create-project-mode','project-list-mode','project-delete-mode');
    if (content) {
      content.classList.remove('left-hidden','right-hidden');
      content.style.display = 'grid';
    }
    ['#valeFiseEnv','#ahorroGnvEnv','#solicitudesEnv','#validacionesEnv','#hospitalEnv','#projectListEnv','#projectCreateEnv','#projectDeleteEnv'].forEach(sel => {
      const el = $(sel);
      if (el) el.style.display = 'none';
    });
  }

  function showSpaModule(key) {
    forceGeneralContentVisible();
    renderPanel(key);
  }

  function selectRow(row) {
    if (mapReady()) {
      leafletMap.flyTo([row.lat, row.lng], 16, { duration: .8 });
      setTimeout(() => {
        L.popup().setLatLng([row.lat, row.lng]).setContent(`<b>${row.name}</b><br>${row.state}<br>${popup(row)}`).openOn(leafletMap);
        if (selectedMarker) leafletMap.removeLayer(selectedMarker);
        selectedMarker = L.marker([row.lat, row.lng]).addTo(leafletMap);
      }, 420);
    }
    $('#details').innerHTML = `<div class="spa-card"><h3>${row.name}</h3><p>${row.state}</p><div class="spa-log">${Object.entries(row.popup).map(([k,v]) => `${k}: ${v}`).join('\n')}${row.alert ? '\nALERTA ROJA: supera regla crítica.' : ''}</div></div>`;
    $('#supplyDetails').innerHTML = `<h3>Popup técnico</h3><p class="supply-hint">${row.type} · ${row.state}</p>`;
  }

  function bindDynamicControls() {
    $$('[data-spa-row]').forEach(tr => tr.addEventListener('click', () => selectRow(modules[activeModule].rows.find(r => r.id === tr.dataset.spaRow))));
    $$('[data-spa-heat]').forEach(btn => btn.addEventListener('click', () => paintHeat(modules[activeModule])));
    $$('[data-spa-toast]').forEach(btn => btn.addEventListener('click', () => toast(btn.dataset.spaToast)));
    $('#spaAiUpload')?.addEventListener('change', e => {
      const file = e.target.files?.[0];
      $('#spaAiResult').textContent = file ? `IA: ${file.name}\nNitidez fachada: OK\nGabinete: OK\nAmbiente: advertencia leve\nGasodoméstico: OK\nDatos DJ: consistentes` : 'Pendiente de archivo.';
    });
    $('#spaExportGnv')?.addEventListener('click', () => openExportModal());
    $('#spaSignBatch')?.addEventListener('click', () => { $('#spaSignState').textContent = 'Firmado en lote · Estado: Registrado en Blockchain'; toast('Liquidaciones registradas en Blockchain'); });
    $('#spaRunApi')?.addEventListener('click', () => {
      const log = $('#spaApiLog');
      const stamp = new Date().toLocaleTimeString('es-PE');
      log.textContent += `\n[${stamp}] GET /cofide/amazon/conversions 200 OK\n[${stamp}] Cola horaria XML omitida correctamente`;
    });
    $('#spaPadronBtn')?.addEventListener('click', () => {
      const val = ($('#spaPadronSearch')?.value || '').trim();
      if (!/^\d{8}$/.test(val) && val.length < 5) { toast('Ingrese DNI de 8 dígitos o código de suministro'); return; }
      selectRow(modules.vale.rows[0]);
      toast('Agente autorizado más cercano resaltado');
    });
  }

  function openExportModal() {
    const modal = document.createElement('div');
    modal.className = 'modal open';
    modal.innerHTML = `<div class="modal-card modal-sm"><div class="modal-head"><div><h2>Exportar Resumen</h2><p>Ahorro GNV</p></div><button class="close" type="button">×</button></div><div class="modal-actions"><button class="btn">.xlsx</button><button class="btn">.csv</button><button class="btn">.pdf</button></div></div>`;
    document.body.appendChild(modal);
    modal.querySelector('.close').onclick = () => modal.remove();
    modal.querySelectorAll('.btn').forEach(btn => btn.onclick = () => { toast('Descarga simulada ' + btn.textContent); modal.remove(); });
  }

  function toast(msg) {
    if (typeof showToast === 'function') showToast(msg);
    else console.log(msg);
  }

  function bindNav() {
    const clearSpaMode = () => {
      $('.main')?.classList.remove('spa-mode');
      const content = $('.content');
      if (content) content.style.display = '';
    };
    ['#navValidaciones', '#navSolicitudes', '#navValeFise', '#navAhorroGnv', '#navFotovoltaico', '#navElectricidad','#navMasificacionSatcontrol'].forEach(sel => {
      $(sel)?.addEventListener('click', clearSpaMode, true);
    });
    $('#navBonoSatcontrol')?.addEventListener('click', e => {
      e.preventDefault();
      e.stopImmediatePropagation();
      if(typeof openBonogasSatcontrol === 'function') openBonogasSatcontrol();
      else if(typeof alignSatcontrol === 'function') alignSatcontrol();
      else if(typeof openSatcontrolView === 'function') openSatcontrolView({title:'SATCONTROL · BONO GAS',sub:'Control de suministros, plazos Art. 25.9, instalaciones y beneficiarios',nav:'navBonoSatcontrol',toast:'SATCONTROL · BONO GAS'});
    }, true);
    $('#navDashboard')?.addEventListener('click', () => {
      clearSpaMode();
      setTimeout(restoreSatcontrolGeneral, 80);
    });
  }

  function restoreSatcontrolGeneral() {
    $('.main')?.classList.remove('spa-mode');
    if (mapReady()) {
      if (spaLayer) leafletMap.removeLayer(spaLayer);
      if (heatLayer) leafletMap.removeLayer(heatLayer);
      if (selectedMarker) leafletMap.removeLayer(selectedMarker);
      spaLayer = null;
      heatLayer = null;
      selectedMarker = null;
      if (typeof updateOverlayVisibility === 'function') updateOverlayVisibility();
      if (typeof resizeMapAfterLayout === 'function') resizeMapAfterLayout();
    }
  }

  function init() {
    ensureCss();
    bindNav();
    restoreSatcontrolGeneral();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

(function(){
  function $(sel){return document.querySelector(sel)}
  function $$(sel){return Array.from(document.querySelectorAll(sel))}
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function money(n){return (typeof formatMoney==='function')?formatMoney(n):('S/ '+Math.round(Number(n)||0).toLocaleString('es-PE'))}
  function norm(v){return (typeof normalizeText==='function')?normalizeText(v):String(v||'').toLowerCase()}

  const huStyle=document.createElement('style');
  huStyle.textContent=[
    '.main.bonogas-satcontrol-mode #tematicosBtn,.main.bonogas-satcontrol-mode #sateliteBtn,.main.bonogas-satcontrol-mode #themesPanel,.main.bonogas-satcontrol-mode #satellitePanel,.main.bonogas-satcontrol-mode #hospitalModuleBtn,#newSolicitudBtn{display:none!important}',
    '.main.bonogas-satcontrol-mode #satProjectsToggle{display:none!important}',
    '.main.bonogas-satcontrol-mode #statsFilters{display:none!important}',
    '.main.bonogas-satcontrol-mode .scroll-section .bonogas-filters-block{display:none!important}',
    '.main.bonogas-satcontrol-mode #bonogasFiltersFloatPanel.open{display:grid!important;gap:10px;background:#0f1b3d!important;color:#fff!important;border:1px solid #24365e!important;box-shadow:0 12px 32px rgba(0,0,0,.35)!important}',
    '.main.bonogas-satcontrol-mode #bonogasFiltersFloatPanel{max-height:min(72vh,620px)!important;overflow-y:auto!important;overflow-x:hidden!important;padding-right:8px!important;scrollbar-width:thin;scrollbar-color:#22d3ee #111a31}',
    '.main.bonogas-satcontrol-mode #bonogasFiltersFloatPanel::-webkit-scrollbar{width:9px}',
    '.main.bonogas-satcontrol-mode #bonogasFiltersFloatPanel::-webkit-scrollbar-track{background:#111a31;border-radius:999px}',
    '.main.bonogas-satcontrol-mode #bonogasFiltersFloatPanel::-webkit-scrollbar-thumb{background:linear-gradient(180deg,#22d3ee,#3b82f6);border:2px solid #111a31;border-radius:999px}',
    '.main.bonogas-satcontrol-mode #bonogasFiltersFloatPanel::-webkit-scrollbar-thumb:hover{background:linear-gradient(180deg,#67e8f9,#60a5fa)}',
    '.main.bonogas-satcontrol-mode #bonogasFiltersFloatPanel .floating-title{color:#67e8f9!important;font-weight:950}',
    '.main.bonogas-satcontrol-mode #bonogasFiltersFloatPanel .bonogas-filters-block{border:0;background:transparent;padding:0;margin:0}',
    '.main.bonogas-satcontrol-mode #bonogasFiltersFloatPanel .bonogas-filters-grid label{color:#e0f2fe!important;text-transform:none;letter-spacing:0;font-size:11px;font-weight:850}',
    '.main.bonogas-satcontrol-mode #bonogasFiltersFloatPanel .bonogas-filters-grid select,.main.bonogas-satcontrol-mode #bonogasFiltersFloatPanel .bonogas-filters-grid input[type="date"]{border:1px solid #31496e!important;background:#111a31!important;color:#fff!important;border-radius:12px!important}',
    '.main.bonogas-satcontrol-mode #bonogasFiltersFloatPanel .bonogas-filters-grid input[type="date"]::-webkit-calendar-picker-indicator{filter:invert(1)}',
    '.main.bonogas-satcontrol-mode #bonogasFiltersFloatPanel .bonogas-apply-filters-btn{width:100%;margin-top:2px;background:linear-gradient(135deg,#0ea5e9,#1b6f8a)!important;border:1px solid rgba(103,232,249,.34)!important;box-shadow:0 10px 22px rgba(14,165,233,.22)!important}',
    '.main.bonogas-satcontrol-mode #bonoUtilFiltersBtn{background:linear-gradient(135deg,#fde047,#f97316,#ec4899,#8b5cf6)!important;color:#fff!important;border:2px solid rgba(255,255,255,.85)!important;box-shadow:0 4px 16px rgba(236,72,153,.5)!important}',
    '.main.bonogas-satcontrol-mode #bonoUtilFiltersBtn .svg-icon{width:17px!important;height:17px!important;fill:currentColor!important}',
    '.main.bonogas-satcontrol-mode #bonoUtilFiltersBtn.active{background:linear-gradient(135deg,#22d3ee,#0ea5e9,#6366f1,#a855f7)!important;color:#fff!important;outline:2px solid #fde047!important;outline-offset:2px!important;box-shadow:0 6px 20px rgba(14,165,233,.6)!important}',
    '.main.bonogas-satcontrol-mode #details{display:block!important;margin-top:12px}',
    '.main.bonogas-satcontrol-mode #details.bonogas-general-hidden{display:none!important}',
    '.main.bonogas-satcontrol-mode #supplyDetails.bonogas-record-visible{display:block!important}',
    '.main.bonogas-satcontrol-mode .project-details-card{border-color:rgba(56,189,248,.34)!important;box-shadow:0 12px 32px rgba(2,8,23,.42),inset 0 1px 0 rgba(255,255,255,.08)!important}',
    '.main.bonogas-satcontrol-mode .project-status-item.no-dot{grid-template-columns:1fr auto!important}',
    '.main.bonogas-satcontrol-mode .project-status-item.no-dot>i{display:none!important}',
    '.bonogas-general-chart{margin-top:12px;padding:12px;border:1px solid rgba(56,189,248,.18);border-radius:14px;background:rgba(8,18,40,.42)}',
    '.bonogas-pac-summary{margin-top:12px;padding:12px;border:1px solid rgba(74,222,128,.24);border-radius:14px;background:linear-gradient(145deg,rgba(20,83,45,.2),rgba(8,18,40,.5))}',
    '.bonogas-realtime-sync{margin-top:12px;padding:12px;border:1px solid rgba(34,211,238,.28);border-radius:14px;background:linear-gradient(145deg,rgba(8,47,73,.34),rgba(8,18,40,.56))}',
    '.bonogas-realtime-sync-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:9px}.bonogas-realtime-sync-head h4{margin:0;color:#e0f2fe;font-size:12px;font-weight:950}.bonogas-realtime-sync-head p{margin:3px 0 0;color:#94a3b8;font-size:9px;line-height:1.35;font-weight:750}.bonogas-realtime-sync-status{flex:none;padding:4px 7px;border-radius:999px;background:rgba(34,197,94,.16);border:1px solid rgba(34,197,94,.3);color:#86efac;font-size:8px;font-weight:950;text-transform:uppercase}',
    '.bonogas-realtime-sync-grid{display:grid;grid-template-columns:1fr 1fr;gap:7px}.bonogas-realtime-sync-item{padding:8px;border-radius:10px;background:rgba(15,23,42,.65);border:1px solid rgba(148,163,184,.14);display:grid;gap:3px}.bonogas-realtime-sync-item span{color:#94a3b8;font-size:8px;font-weight:850}.bonogas-realtime-sync-item b{color:#f8fafc;font-size:10px;line-height:1.25}.bonogas-realtime-sync-foot{margin:8px 0 0;color:#67e8f9;font-size:8px;font-weight:850}',
    '.bonogas-pac-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:9px}.bonogas-pac-head h4{margin:0;color:#dcfce7;font-size:12px;font-weight:950}.bonogas-pac-head small{color:#86efac;font-size:9px;font-weight:850}',
    '.bonogas-pac-values{display:grid;grid-template-columns:repeat(3,1fr);gap:7px}.bonogas-pac-value{padding:8px;border:1px solid rgba(255,255,255,.08);border-radius:10px;background:rgba(8,15,33,.55)}.bonogas-pac-value span{display:block;color:#94a3b8;font-size:8px;font-weight:900}.bonogas-pac-value b{display:block;margin-top:3px;color:#fff;font-size:11px}.bonogas-pac-value.saldo b{color:#86efac}',
    '.bonogas-pac-track{height:7px;margin-top:9px;overflow:hidden;border-radius:999px;background:#1d2948}.bonogas-pac-track span{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#22c55e,#38bdf8)}',
    '.bonogas-general-chart h4{margin:0 0 10px;color:#dbeafe;font-size:12px;font-weight:950}',
    '.bonogas-general-bars{display:grid;gap:10px}',
    '.bonogas-general-bar-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:5px;color:#cbd5e1;font-size:10px;font-weight:850}',
    '.bonogas-general-bar-head span{display:flex;align-items:center;gap:7px}',
    '.bonogas-general-bar-head i{width:10px;height:10px;border-radius:50%;display:inline-block;box-shadow:0 0 0 3px rgba(255,255,255,.08)}',
    '.bonogas-general-bar-head b{color:#fff;font-size:11px}',
    '.bonogas-general-track{height:9px;overflow:hidden;border-radius:999px;background:#1d2948;box-shadow:inset 0 1px 2px rgba(0,0,0,.35)}',
    '.bonogas-general-track span{display:block;height:100%;min-width:4px;border-radius:inherit;box-shadow:0 0 12px currentColor}',
    '.main.bonogas-satcontrol-mode #statsFilters{display:none!important}',
    '.main.bonogas-satcontrol-mode .stats #donutTitle,.main.bonogas-satcontrol-mode .stats #donutSubtitle,.main.bonogas-satcontrol-mode .stats #donutChart,.main.bonogas-satcontrol-mode .stats #donutLegend{display:none!important}',
    '.main.bonogas-satcontrol-mode .stats{padding:0;margin-top:8px;background:transparent;border:0}',
    '.main.bonogas-satcontrol-mode .stats .export-excel-btn{display:flex!important;width:100%;margin:0}',
    '.main.bonogas-satcontrol-mode #areaStatsDetails{display:none!important}',
    '.main.bonogas-satcontrol-mode #activeLayerLabel{display:none!important}',
    '.main.bonogas-satcontrol-mode .location-search{display:none!important}',
    '.bonogas-project-beneficiaries{margin-top:12px;border-top:1px solid rgba(56,189,248,.2);padding-top:11px}',
    '.bonogas-project-beneficiaries h4{margin:0 0 8px;color:#e0f2fe;font-size:12px;font-weight:950}',
    '.bonogas-beneficiary-table-wrap{max-height:220px;overflow:auto;border:1px solid rgba(56,189,248,.18);border-radius:12px}',
    '.bonogas-beneficiary-table{width:100%;border-collapse:collapse;font-size:10px;color:#dbeafe}',
    '.bonogas-beneficiary-table th{position:sticky;top:0;z-index:2;background:#132447;color:#a5f3fc;text-align:left;padding:9px 8px;font-weight:950;letter-spacing:.02em}',
    '.bonogas-beneficiary-table td{padding:9px 8px;border-top:1px solid rgba(255,255,255,.07);font-weight:800;vertical-align:middle}',
    '.bonogas-beneficiary-table tbody tr:nth-child(even){background:rgba(56,189,248,.045)}',
    '.bonogas-beneficiary-table tbody tr:hover{background:rgba(56,189,248,.11)}',
    '.bonogas-beneficiary-table .beneficiary-supply{color:#7dd3fc;font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:9px}',
    '.bonogas-beneficiary-table .beneficiary-name{color:#f8fafc;font-weight:900}',
    '.bonogas-beneficiary-table td:last-child{text-align:right}',
    '.bonogas-table-status{display:inline-flex;align-items:center;justify-content:center;border-radius:999px;padding:4px 7px;font-size:9px;font-weight:950;white-space:nowrap;border:1px solid transparent}',
    '.bonogas-table-status.liquidado{background:#22c55e1f;color:#86efac;border-color:#22c55e45}',
    '.bonogas-table-status.pendiente{background:#f59e0b1f;color:#fde68a;border-color:#f59e0b45}',
    '.bonogas-table-status.dentro{background:#38a9e81f;color:#bae6fd;border-color:#38a9e845}',
    '.bonogas-table-status.fuera{background:#ef44441f;color:#fecaca;border-color:#ef444445}',
    '.main.has-plazo-area-selection:not(.bonogas-satcontrol-mode) #areaStatsDetails{display:none!important}',
    '.main:not(.bonogas-satcontrol-mode):not(.has-plazo-area-selection) .corrections-suite{display:none!important}',
    '.main.bonogas-satcontrol-mode .corrections-suite,.main.has-plazo-area-selection .corrections-suite{display:grid!important}',
    '.main.bonogas-satcontrol-mode #morosityLegend,.main.bonogas-satcontrol-mode .heat-legend{display:none!important}',
    '.val-installer-inline,.val-zone-strip{display:none!important}',
    '.val-admin-side>.pay-card:nth-of-type(1){display:none!important}',
    '.val-bottom-actions{grid-template-columns:1fr 1fr!important}',
    '.val-bottom-actions .emit{display:none!important}',
    '.hu-deadline-card{border:1px solid rgba(56,189,248,.22);background:#0d1630;border-radius:14px;padding:12px;margin-top:12px}',
    '.hu-deadline-card h3{margin:0 0 8px;color:#e0f2fe;font-size:13px}',
    '.hu-deadline-table{width:100%;border-collapse:separate;border-spacing:0 6px;font-size:11px}',
    '.hu-deadline-table th{color:#93a4c7;text-align:left;font-size:10px;text-transform:uppercase}',
    '.hu-deadline-table td{background:#111a31;border-top:1px solid #ffffff12;border-bottom:1px solid #ffffff12;padding:7px 8px;color:#dbeafe;font-weight:850}',
    '.hu-pill{display:inline-flex;border-radius:999px;padding:4px 7px;font-size:10px;font-weight:950}',
    '.hu-pill.bad{background:#ef444422;color:#fecaca}.hu-pill.ok{background:#10b98122;color:#86efac}.hu-pill.warn{background:#f59e0b22;color:#fde68a}',
    '.bonogas-dj-alert-strip{display:grid;gap:8px;margin:0 0 4px}',
    '.bonogas-dj-alert-strip .dj-ai-alert{margin:0}',
    '.plazo-art259-info-btn{flex:0 0 auto;width:36px;height:36px;border:1px solid rgba(56,189,248,.35);background:linear-gradient(180deg,#132447,#0d1630);color:#67e8f9;border-radius:11px;display:grid;place-items:center;cursor:pointer;box-shadow:0 4px 14px rgba(14,165,233,.18);transition:transform .15s ease,box-shadow .15s ease,border-color .15s ease}',
    '.plazo-art259-info-btn:hover{border-color:#38bdf8;box-shadow:0 6px 18px rgba(56,189,248,.28);transform:translateY(-1px)}',
    '.plazo-art259-info-btn .svg-icon{width:17px;height:17px;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}',
    '.bonogas-left{height:100%;display:flex;flex-direction:column;min-height:0}',
    '.bonogas-left-head{padding:18px 48px 12px 16px;border-bottom:1px solid #293b67;position:relative}',
    '.bonogas-left-head h2{margin:0;color:#fff;font-size:19px;font-weight:950}.bonogas-left-head p{margin:5px 0 0;color:#93a4c7;font-size:11px;font-weight:800;line-height:1.35}',
    '.bonogas-panel-toggle{position:absolute;right:12px;top:14px;width:30px;height:30px;border:1px solid #334155;background:#111a31;color:#e0f2fe;border-radius:9px;font-size:18px;font-weight:950;display:grid;place-items:center}',
    '.bonogas-panel-open{display:none!important}',
    '.bonogas-left-body{padding:14px 14px 16px;overflow:auto;display:grid;gap:12px}',
    '.bonogas-search input,.bonogas-filters select{width:100%;height:40px;border:1px solid #293b67;background:#0d1630;color:#f8fbff;border-radius:11px;padding:0 10px;font-size:11px;font-weight:850;outline:none}',
    '.bonogas-filters{display:grid;grid-template-columns:1fr 1fr;gap:8px}',
    '.bonogas-left-kpis{display:grid;grid-template-columns:1fr 1fr;gap:8px}.bonogas-left-kpi{border:1px solid #ffffff16;background:#111a31;border-radius:12px;padding:9px}.bonogas-left-kpi span{display:block;color:#93a4c7;font-size:9px;font-weight:900}.bonogas-left-kpi b{display:block;margin-top:3px;color:#fff;font-size:18px;font-weight:950}',
    '.bonogas-block{border:1px solid #24365e;background:#0d1630;border-radius:13px;padding:11px}.bonogas-block h3{margin:0 0 9px;color:#e0f2fe;font-size:12px;font-weight:950}',
    '.bonogas-alert-list{display:grid;gap:8px}.bonogas-alert-item{border:1px solid #ffffff12;background:#111a31;border-radius:11px;padding:9px;display:grid;gap:6px}.bonogas-alert-item b{color:#fff;font-size:12px}.bonogas-alert-item span{color:#93a4c7;font-size:10px;font-weight:800}.bonogas-alert-meta{display:flex;gap:5px;flex-wrap:wrap}',
    '.bonogas-mini-table{width:100%;border-collapse:separate;border-spacing:0 6px;font-size:10px}.bonogas-mini-table td{background:#111a31;padding:7px;color:#dbeafe;font-weight:850}.bonogas-mini-table td:first-child{border-radius:8px 0 0 8px}.bonogas-mini-table td:last-child{border-radius:0 8px 8px 0;text-align:right}',
    '.bonogas-sync{display:grid;grid-template-columns:1fr 1fr;gap:8px}.bonogas-sync div{border:1px solid #ffffff12;background:#111a31;border-radius:10px;padding:8px}.bonogas-sync span{display:block;color:#93a4c7;font-size:9px;font-weight:900}.bonogas-sync b{display:block;margin-top:3px;color:#e0f2fe;font-size:11px}'
    ,'.hu-ai-combined{display:grid;grid-template-columns:1fr;gap:12px;align-items:start}'
    ,'.hu-ai-combined,.hu-ai-combined *{min-width:0;box-sizing:border-box}.validation-ai-card.compact-flow{overflow-x:hidden!important;max-width:100%!important}'
    ,'.hu-ai-flow-card{width:100%;max-width:100%;overflow:hidden;border:1px solid rgba(56,189,248,.18);background:linear-gradient(180deg,rgba(15,27,53,.76),rgba(8,15,31,.76));border-radius:16px;padding:13px;min-height:360px;display:grid;align-content:start;gap:10px}'
    ,'.hu-ai-flow-card .ai-section-title{margin-bottom:0}.hu-ai-flow-card .ai-section-title h3{font-size:14px}.hu-ai-flow-card .ai-section-title p{font-size:10px;line-height:1.3}'
    ,'.hu-ai-upload{min-height:118px;border:1px dashed #3c4f7b;border-radius:13px;background:#111a31;display:grid;place-items:center;text-align:center;padding:12px}.hu-ai-upload b{display:block;color:#fff;font-size:12px}.hu-ai-upload span{display:block;color:#91a2c1;font-size:10px;font-weight:800;margin-top:4px}'
    ,'.hu-ai-files{display:grid;grid-template-columns:repeat(auto-fit,minmax(118px,1fr));gap:7px;max-width:100%}.hu-ai-file{border:1px solid rgba(148,163,184,.14);background:#101a32;border-radius:10px;padding:8px;min-width:0}.hu-ai-file b{display:block;color:#eaf2ff;font-size:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.hu-ai-file span{display:block;color:#91a2c1;font-size:9px;font-weight:800;margin-top:3px}'
    ,'.hu-ai-actions{display:flex;justify-content:flex-end;gap:8px}.hu-ai-btn{border:0;border-radius:10px;background:#2563eb;color:#fff;padding:8px 11px;font-size:11px;font-weight:950}.hu-ai-btn.secondary{background:#17233f;color:#cbd5e1;border:1px solid rgba(148,163,184,.18)}'
    ,'.hu-ai-analyzing{min-height:190px;display:grid;place-items:center;text-align:center;gap:10px}.hu-ai-spinner{width:48px;height:48px;border-radius:50%;border:5px solid #1f3156;border-top-color:#38bdf8;animation:aiSpin .85s linear infinite}'
    ,'.hu-ai-results{display:grid;gap:8px;max-width:100%}.hu-ai-result{display:grid;grid-template-columns:22px minmax(0,1fr);gap:8px;align-items:start;border:1px solid #ffffff12;background:#111a31;border-radius:10px;padding:8px}.hu-ai-result i{width:22px;height:22px;border-radius:50%;display:grid;place-items:center;font-style:normal;font-weight:950}.hu-ai-result.ok i{background:#10b98122;color:#86efac}.hu-ai-result.warn i{background:#f59e0b22;color:#fde68a}.hu-ai-result.bad i{background:#ef444422;color:#fecaca}.hu-ai-result b{display:block;color:#fff;font-size:11px;white-space:normal;overflow-wrap:anywhere}.hu-ai-result span{display:block;color:#93a4c7;font-size:9px;font-weight:800;white-space:normal;overflow-wrap:anywhere}.hu-ai-result small{grid-column:2;color:#cbd5e1;font-size:9px;font-weight:950;white-space:normal;overflow-wrap:anywhere}'
    ,'.hu-ai-summary{display:grid;grid-template-columns:repeat(auto-fit,minmax(105px,1fr));gap:7px;max-width:100%}.hu-ai-summary div{border:1px solid #ffffff12;background:#101a32;border-radius:10px;padding:8px;min-width:0}.hu-ai-summary span{display:block;color:#93a4c7;font-size:9px;font-weight:900}.hu-ai-summary b{display:block;color:#e0f2fe;font-size:11px;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
    ,'@media(max-width:1100px){.hu-ai-flow-card{min-height:0}}'
    ,'.bonogas-filters-block{margin-top:12px;border:1px solid #24365e;background:#0d1630;border-radius:14px;padding:12px;display:grid;gap:10px}'
    ,'.bonogas-filters-block h4{margin:0;color:#e0f2fe;font-size:12px;font-weight:950;letter-spacing:.02em}'
    ,'.bonogas-filters-grid{display:grid;grid-template-columns:1fr;gap:8px}'
    ,'.bonogas-filters-grid label{display:grid;gap:5px;color:#93a4c7;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.04em}'
    ,'.bonogas-filters-grid select,.bonogas-filters-grid input[type="date"]{width:100%;min-width:0;border:1px solid #31496e;background:#111a31;color:#fff;border-radius:12px;padding:10px 11px;font-size:11px;font-weight:850;outline:none;cursor:pointer}'
    ,'.bonogas-filters-grid select:focus,.bonogas-filters-grid input[type="date"]:focus{border-color:#38bdf8;box-shadow:0 0 0 2px rgba(56,189,248,.18)}'
    ,'.bonogas-apply-filters-btn{width:100%;justify-content:center}'
    ,'.supply-item{align-items:center}'
    ,'.supply-item b .installer-link{max-width:min(220px,46vw);margin-left:auto}'
  ].join('\n');
  document.head.appendChild(huStyle);
  let bonogasHuLayer=null;
  const BONOGAS_CONCESIONARIAS=['Cálidda','Gas Natural del Perú','Naturgy Lima','Promigas Perú','GNLC'];
  const BONOGAS_CONCESIONARIA_BY_REGION={
    Piura:'Cálidda',Lambayeque:'Cálidda','La Libertad':'Cálidda',Cajamarca:'Cálidda',Tumbes:'Cálidda',
    Lima:'Cálidda',Callao:'Cálidda',Ica:'Naturgy Lima',Ancash:'Naturgy Lima',
    Arequipa:'Gas Natural del Perú',Moquegua:'Gas Natural del Perú',Tacna:'Gas Natural del Perú',Loreto:'Gas Natural del Perú',
    Cusco:'Promigas Perú',Puno:'Promigas Perú','Madre de Dios':'Promigas Perú',
    Junin:'GNLC',Huanuco:'GNLC','San Martin':'GNLC',Ayacucho:'GNLC'
  };
  window.bonogasSatFilters=window.bonogasSatFilters||{estrato:'',empresaInstaladora:'',concesionaria:'',fechaDesde:'',fechaHasta:''};
  const BONOGAS_MESES=['','Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const BONOGAS_FECHA_POOL=['2025-10','2025-11','2025-12','2026-01','2026-02','2026-03','2026-04','2026-05'];
  const BONOGAS_ESTRATO_LABELS={'1':'Muy bajo','2':'Bajo','3':'Medio','4':'Alto','5':'Muy Alto'};
  const BONOGAS_ESTRATO_COLORS={'1':'#e31a1c','2':'#fd8d3c','3':'#ffeb3b','4':'#b7e75a','5':'#69c7e8'};
  const BONOGAS_DEPT_CODE_NAMES={'02':'Áncash','04':'Arequipa','13':'La Libertad','15':'Lima'};
  const BONOGAS_DISTRICT_CODE_NAMES={
    '021801':'Chimbote',
    '040104':'Cerro Colorado',
    '130101':'Trujillo',
    '130102':'El Porvenir',
    '130103':'Florencia de Mora',
    '130105':'La Esperanza',
    '130112':'Víctor Larco Herrera',
    '150133':'San Juan de Miraflores'
  };
  const BONOGAS_PROVINCE_CODE_NAMES={
    '0218':'Santa',
    '0401':'Arequipa',
    '1301':'Trujillo',
    '1501':'Lima'
  };
  const BONOGAS_DISTRICTS_BY_DEPT={
    Arequipa:['Cerro Colorado','Yanahuara','Cayma','Paucarpata','Miraflores','Sauna'],
    Lima:['Ate','San Juan de Lurigancho','Villa El Salvador','Comas','Los Olivos','San Juan de Miraflores'],
    Callao:['Callao','Ventanilla','Bellavista','La Perla'],
    Piura:['Piura','Castilla','Veintiseis de Octubre','Catacaos'],
    Lambayeque:['Chiclayo','La Victoria','Jose Leonardo Ortiz','Pimentel'],
    'La Libertad':['Trujillo','El Porvenir','La Esperanza','Victor Larco Herrera'],
    Cajamarca:['Cajamarca','Los Baños del Inca','Llacanora'],
    Tumbes:['Tumbes','Corrales','Zarumilla'],
    Ica:['Ica','Parcona','La Tinguiña','Subtanjalla'],
    Ancash:['Huaraz','Independencia','Nuevo Chimbote','Chimbote'],
    Huanuco:['Huanuco','Amarilis','Pillco Marca'],
    Junin:['Huancayo','El Tambo','Chilca'],
    Cusco:['Cusco','San Sebastian','Wanchaq','Santiago'],
    Puno:['Puno','Juliaca','Ilave'],
    Tacna:['Tacna','Gregorio Albarracin','Alto de la Alianza'],
    Loreto:['Iquitos','Punchana','Belen','San Juan Bautista'],
    'San Martin':['Tarapoto','Morales','La Banda de Shilcayo'],
    Ayacucho:['Ayacucho','San Juan Bautista','Carmen Alto'],
    'Madre de Dios':['Tambopata','Laberinto','Las Piedras'],
    Moquegua:['Moquegua','Samegua','Ilo']
  };
  let bonogasRealManzanaRows=[];
  let bonogasRealManzanasLoading=false;
  let bonogasRealManzanasLoaded=false;
  const BONOGAS_EMBEDDED_MANZANAS_EXAMPLE={
    type:'FeatureCollection',
    features:[
      {type:'Feature',properties:{tipo_geoportal:'manzana',Departamento_nombre:'Arequipa',Distrito:'Cerro Colorado',ESTRATOS:'1',ESTRATOS_LABEL:'Muy bajo',ID_SQUARE:'AQP-CC-001',NAME:'MZ-001',Contratista_asignado:'GasSur Instalaciones S.A.C.',Numero_predios:74,Numero_habilitados:22},geometry:{type:'Polygon',coordinates:[[[-71.573880,-16.374880],[-71.573360,-16.374760],[-71.572790,-16.374720],[-71.572260,-16.374810],[-71.571740,-16.375020],[-71.571250,-16.375360],[-71.571040,-16.375770],[-71.571210,-16.376170],[-71.571760,-16.376420],[-71.572460,-16.376520],[-71.573070,-16.376390],[-71.573560,-16.376050],[-71.573900,-16.375520],[-71.574030,-16.375130],[-71.573880,-16.374880]]]}},
      {type:'Feature',properties:{tipo_geoportal:'manzana',Departamento_nombre:'Arequipa',Distrito:'Cerro Colorado',ESTRATOS:'2',ESTRATOS_LABEL:'Bajo',ID_SQUARE:'AQP-CC-002',NAME:'MZ-002',Contratista_asignado:'Andes Gas Contratistas',Numero_predios:58,Numero_habilitados:18},geometry:{type:'Polygon',coordinates:[[[-71.571040,-16.375770],[-71.570640,-16.375600],[-71.569990,-16.375540],[-71.569330,-16.375660],[-71.568840,-16.376000],[-71.568620,-16.376480],[-71.568820,-16.376920],[-71.569370,-16.377160],[-71.570030,-16.377230],[-71.570700,-16.377060],[-71.571230,-16.376720],[-71.571760,-16.376420],[-71.571210,-16.376170],[-71.571040,-16.375770]]]}},
      {type:'Feature',properties:{tipo_geoportal:'manzana',Departamento_nombre:'Arequipa',Distrito:'Cerro Colorado',ESTRATOS:'2',ESTRATOS_LABEL:'Bajo',ID_SQUARE:'AQP-CC-003',NAME:'MZ-003',Contratista_asignado:'TecnoGas Arequipa',Numero_predios:81,Numero_habilitados:31},geometry:{type:'Polygon',coordinates:[[[-71.573070,-16.376390],[-71.572460,-16.376520],[-71.571760,-16.376420],[-71.571230,-16.376720],[-71.570700,-16.377060],[-71.570920,-16.377600],[-71.571460,-16.377920],[-71.572170,-16.378020],[-71.572850,-16.377850],[-71.573420,-16.377460],[-71.573680,-16.376940],[-71.573560,-16.376050],[-71.573070,-16.376390]]]}},
      {type:'Feature',properties:{tipo_geoportal:'manzana',Departamento_nombre:'Arequipa',Distrito:'Cerro Colorado',ESTRATOS:'3',ESTRATOS_LABEL:'Medio',ID_SQUARE:'AQP-CC-004',NAME:'MZ-004',Contratista_asignado:'RedGas Peru S.A.C.',Numero_predios:96,Numero_habilitados:51},geometry:{type:'Polygon',coordinates:[[[-71.570700,-16.377060],[-71.570030,-16.377230],[-71.569370,-16.377160],[-71.568820,-16.376920],[-71.568330,-16.377180],[-71.568080,-16.377680],[-71.568280,-16.378170],[-71.568840,-16.378480],[-71.569580,-16.378560],[-71.570220,-16.378360],[-71.570920,-16.377600],[-71.570700,-16.377060]]]}},
      {type:'Feature',properties:{tipo_geoportal:'manzana',Departamento_nombre:'Arequipa',Distrito:'Cerro Colorado',ESTRATOS:'4',ESTRATOS_LABEL:'Alto',ID_SQUARE:'AQP-CC-005',NAME:'MZ-005',Contratista_asignado:'GasSur Instalaciones S.A.C.',Numero_predios:52,Numero_habilitados:44},geometry:{type:'Polygon',coordinates:[[[-71.570920,-16.377600],[-71.570220,-16.378360],[-71.569580,-16.378560],[-71.569840,-16.379020],[-71.570480,-16.379320],[-71.571300,-16.379350],[-71.572020,-16.379070],[-71.572450,-16.378590],[-71.572850,-16.377850],[-71.572170,-16.378020],[-71.571460,-16.377920],[-71.570920,-16.377600]]]}}
    ]
  };

  function bonogasEstratoLabel(num){
    return BONOGAS_ESTRATO_LABELS[String(num)]||('Estrato '+num);
  }

  function bonogasEstratoOptionsHtml(selected,allowed){
    let html='<option value="">Todos</option>';
    const keys=(allowed&&allowed.length?allowed:Object.keys(BONOGAS_ESTRATO_LABELS)).map(String).sort();
    keys.forEach(function(k){
      html+='<option value="'+k+'"'+(String(selected)===k?' selected':'')+'>'+BONOGAS_ESTRATO_LABELS[k]+'</option>';
    });
    return html;
  }

  function bonogasDistrictForDept(departamento,idx){
    const list=BONOGAS_DISTRICTS_BY_DEPT[departamento]||['Distrito Central','Distrito Norte','Distrito Sur'];
    return list[Math.abs(Number(idx)||0)%list.length];
  }

  function bonogasRowsForScope(baseRows,scope){
    const f=normalizeBonogasSatFilters(Object.assign({},window.bonogasSatFilters||{},scope||{}));
    return (baseRows||[]).filter(function(r){
      const dept=r.departamento||r.region||'';
      if(f.departamento&&dept!==f.departamento)return false;
      if(f.distrito&&(r.distrito||'')!==f.distrito)return false;
      if(f.estrato&&normalizeBonogasEstratoNum(r,r.idx!=null?Number(r.idx)-1:0)!==f.estrato)return false;
      return true;
    });
  }

  function bonogasFeatureEstrato(props,idx){
    const raw=props.ESTRATOS||props.estrato||props.ESTRATO||props.estratoSocioeconomico;
    return normalizeBonogasEstratoNum({estratoSocioeconomico:raw},idx);
  }

  function bonogasGeometryCenter(geometry){
    const pts=[];
    function walk(coords){
      if(!Array.isArray(coords))return;
      if(typeof coords[0]==='number'&&typeof coords[1]==='number'){
        pts.push([Number(coords[1]),Number(coords[0])]);
        return;
      }
      coords.forEach(walk);
    }
    walk(geometry&&geometry.coordinates);
    if(!pts.length)return null;
    const sum=pts.reduce(function(acc,p){acc[0]+=p[0];acc[1]+=p[1];return acc;},[0,0]);
    return [sum[0]/pts.length,sum[1]/pts.length];
  }

  function bonogasGeometryBbox(geometry){
    const box={minLng:Infinity,minLat:Infinity,maxLng:-Infinity,maxLat:-Infinity};
    function walk(coords){
      if(!Array.isArray(coords))return;
      if(typeof coords[0]==='number'&&typeof coords[1]==='number'){
        const lng=Number(coords[0]),lat=Number(coords[1]);
        if(Number.isFinite(lng)&&Number.isFinite(lat)){
          box.minLng=Math.min(box.minLng,lng);
          box.maxLng=Math.max(box.maxLng,lng);
          box.minLat=Math.min(box.minLat,lat);
          box.maxLat=Math.max(box.maxLat,lat);
        }
        return;
      }
      coords.forEach(walk);
    }
    walk(geometry&&geometry.coordinates);
    return Number.isFinite(box.minLng)?box:null;
  }

  function bonogasPointInRing(lng,lat,ring){
    let inside=false;
    for(let i=0,j=ring.length-1;i<ring.length;j=i++){
      const xi=Number(ring[i][0]),yi=Number(ring[i][1]);
      const xj=Number(ring[j][0]),yj=Number(ring[j][1]);
      const intersect=((yi>lat)!==(yj>lat))&&(lng<(xj-xi)*(lat-yi)/(yj-yi)+xi);
      if(intersect)inside=!inside;
    }
    return inside;
  }

  function bonogasPointInGeoJsonGeometry(lng,lat,geometry){
    if(!geometry||!Array.isArray(geometry.coordinates))return false;
    const polygons=geometry.type==='MultiPolygon'?geometry.coordinates:(geometry.type==='Polygon'?[geometry.coordinates]:[]);
    return polygons.some(function(poly){
      if(!Array.isArray(poly)||!poly.length||!bonogasPointInRing(lng,lat,poly[0]))return false;
      return !poly.slice(1).some(function(hole){return bonogasPointInRing(lng,lat,hole);});
    });
  }

  function bonogasBlockPolygonInsideGeometry(cx,cy,w,h,geometry,skew){
    const left=cx-w/2,right=cx+w/2,top=cy+h/2,bottom=cy-h/2;
    const s=(skew||0)*w;
    const coords=[
      [left+s,bottom],
      [right+s*.35,bottom+h*.06],
      [right-s,top],
      [left-s*.35,top-h*.05],
      [left+s,bottom]
    ];
    const allInside=coords.slice(0,-1).every(function(p){return bonogasPointInGeoJsonGeometry(p[0],p[1],geometry);});
    return allInside?{type:'Polygon',coordinates:[coords]}:null;
  }

  function bonogasBuildAdminBoundedDemoFeatures(adminFeature,target){
    const geometry=adminFeature&&adminFeature.geometry;
    const bbox=bonogasGeometryBbox(geometry);
    if(!geometry||!bbox)return [];
    const count=Number(target.count||60);
    const width=Number(target.blockLng||Math.max((bbox.maxLng-bbox.minLng)/34,0.00085));
    const height=Number(target.blockLat||Math.max((bbox.maxLat-bbox.minLat)/44,0.00065));
    const gapLng=width*1.36;
    const gapLat=height*1.42;
    const cols=Math.max(1,Math.floor((bbox.maxLng-bbox.minLng)/gapLng));
    const rows=Math.max(1,Math.floor((bbox.maxLat-bbox.minLat)/gapLat));
    const features=[];
    let seq=0;
    for(let r=1;r<rows&&features.length<count;r++){
      for(let c=1;c<cols&&features.length<count;c++){
        const cx=bbox.minLng+c*gapLng+(r%2)*gapLng*.46;
        const cy=bbox.maxLat-r*gapLat;
        if(!bonogasPointInGeoJsonGeometry(cx,cy,geometry))continue;
        const skew=((seq%5)-2)*0.08;
        const poly=bonogasBlockPolygonInsideGeometry(cx,cy,width*(.86+(seq%3)*.09),height*(.92+(seq%4)*.08),geometry,skew);
        if(!poly)continue;
        const i=features.length;
        const estrato=String(((i+(target.estratoShift||0))%5)+1);
        const props={
          tipo_geoportal:'manzana',
          Departamento:target.deptCode,
          Departamento_nombre:target.departamento,
          ID_DISTRICT:target.districtCode,
          Distrito:target.distrito,
          Provincia:target.provinciaCode||target.districtCode.slice(0,4),
          Codigo_ubigeo:target.districtCode+String(7000+i).slice(-4),
          ID_proyecto:target.projectCode,
          Nombre_proyecto:target.projectName+' · MALLA '+String(i+1).padStart(2,'0'),
          Campanna_comercial:target.campanna||target.distrito.toUpperCase(),
          Contratista_asignado:target.contratista||'Contratista demo',
          ESTRATOS:estrato,
          ESTRATOS_LABEL:bonogasEstratoLabel(estrato),
          ID_SQUARE:target.prefix+'-'+String(i+1).padStart(3,'0'),
          OBJECTID:target.objectBase+i,
          NAME:'MZ-'+String(i+1).padStart(3,'0'),
          SQUARE_PROPERTY_CODE:target.prefix+'-'+String(i+1).padStart(3,'0'),
          Numero_predios:34+(i%7)*8,
          Numero_habilitados:14+(i%6)*5,
          Numero_unidades_prediales:38+(i%8)*7
        };
        features.push({type:'Feature',id:props.ID_SQUARE,properties:props,geometry:poly});
        seq++;
      }
    }
    return features;
  }

  function bonogasGeometryVertexCount(geometry){
    let n=0;
    function walk(coords){
      if(!Array.isArray(coords))return;
      if(typeof coords[0]==='number'&&typeof coords[1]==='number'){n++;return;}
      coords.forEach(walk);
    }
    walk(geometry&&geometry.coordinates);
    return n;
  }

  function bonogasPolygonApproxArea(geometry){
    const box=bonogasGeometryBbox(geometry);
    if(!box)return 0;
    return Math.abs((box.maxLng-box.minLng)*(box.maxLat-box.minLat));
  }

  function bonogasOverpassWayToFeature(element,target,index){
    const geom=(element.geometry||[]).map(function(p){return [Number(p.lon),Number(p.lat)];}).filter(function(p){return Number.isFinite(p[0])&&Number.isFinite(p[1]);});
    if(geom.length<4)return null;
    const first=geom[0],last=geom[geom.length-1];
    if(first[0]!==last[0]||first[1]!==last[1])geom.push([first[0],first[1]]);
    const geometry={type:'Polygon',coordinates:[geom]};
    const center=bonogasGeometryCenter(geometry);
    if(!center||!bonogasPointInGeoJsonGeometry(center[1],center[0],target.adminGeometry))return null;
    const minArea=Number(target.minArea||0.00000055);
    const maxArea=Number(target.maxArea||0.0000085);
    const approxArea=bonogasPolygonApproxArea(geometry);
    if(approxArea<minArea||approxArea>maxArea)return null;
    const estrato=String(((index+(target.estratoShift||0))%5)+1);
    const idBase=element.id||index;
    const props={
      tipo_geoportal:'manzana',
      fuente_geometria:'OpenStreetMap · geometría real',
      Departamento:target.deptCode,
      Departamento_nombre:target.departamento,
      ID_DISTRICT:target.districtCode,
      Distrito:target.distrito,
      Provincia:target.provinciaCode||target.districtCode.slice(0,4),
      Codigo_ubigeo:target.districtCode+String(7000+index).slice(-4),
      ID_proyecto:target.projectCode,
      Nombre_proyecto:target.projectName+' · OSM '+String(index+1).padStart(3,'0'),
      Campanna_comercial:target.campanna||target.distrito.toUpperCase(),
      Contratista_asignado:target.contratista||'Consorcio Redes Lima',
      ESTRATOS:estrato,
      ESTRATOS_LABEL:bonogasEstratoLabel(estrato),
      ID_SQUARE:target.prefix+'-OSM-'+String(idBase).slice(-7),
      OBJECTID:Number(target.objectBase||910001)+index,
      NAME:'MZ-OSM-'+String(index+1).padStart(3,'0'),
      SQUARE_PROPERTY_CODE:target.prefix+'-OSM-'+String(index+1).padStart(3,'0'),
      Numero_predios:Math.max(8,Math.round(bonogasGeometryVertexCount(geometry)*2.2)+(index%7)*3),
      Numero_habilitados:Math.max(4,Math.round(bonogasGeometryVertexCount(geometry)*1.1)+(index%5)*2),
      Numero_unidades_prediales:Math.max(10,Math.round(bonogasGeometryVertexCount(geometry)*2.6)+(index%6)*4)
    };
    return {type:'Feature',id:props.ID_SQUARE,properties:props,geometry:geometry};
  }

  async function bonogasFetchOsmRealManzanasForDistrict(adminFeature,target){
    const bbox=bonogasGeometryBbox(adminFeature&&adminFeature.geometry);
    if(!bbox)return [];
    const key='bonogas-osm-real-manzanas-'+target.districtCode+'-v3';
    try{
      const cached=localStorage.getItem(key);
      if(cached){
        const parsed=JSON.parse(cached);
        if(parsed&&Array.isArray(parsed.features)&&parsed.features.length)return parsed.features;
      }
    }catch(e){}
    const south=bbox.minLat,west=bbox.minLng,north=bbox.maxLat,east=bbox.maxLng;
    const query='[out:json][timeout:25];('+
      'way["landuse"="residential"]('+south+','+west+','+north+','+east+');'+
      'way["landuse"="commercial"]('+south+','+west+','+north+','+east+');'+
      'way["landuse"="retail"]('+south+','+west+','+north+','+east+');'+
      'way["landuse"="industrial"]('+south+','+west+','+north+','+east+');'+
      'way["amenity"="marketplace"]('+south+','+west+','+north+','+east+');'+
      ');out geom;';
    const endpoints=[
      'https://overpass-api.de/api/interpreter',
      'https://overpass.kumi.systems/api/interpreter'
    ];
    let elements=[];
    for(const endpoint of endpoints){
      try{
        const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'},body:'data='+encodeURIComponent(query)});
        if(!response.ok)throw new Error('Overpass no disponible');
        const json=await response.json();
        elements=(json&&json.elements)||[];
        if(elements.length)break;
      }catch(e){}
    }
    const features=[];
    const seen=new Set();
    elements.forEach(function(element){
      if(features.length>=Number(target.count||120))return;
      if(!element||seen.has(element.id)||!Array.isArray(element.geometry))return;
      const feature=bonogasOverpassWayToFeature(element,Object.assign({},target,{adminGeometry:adminFeature.geometry}),features.length);
      if(feature){seen.add(element.id);features.push(feature);}
    });
    try{
      if(features.length)localStorage.setItem(key,JSON.stringify({features:features.slice(0,Number(target.count||120))}));
    }catch(e){}
    return features;
  }

  function bonogasTranslateGeometryForDemo(geometry,deltaLng,deltaLat){
    if(!geometry||!geometry.coordinates)return geometry;
    function walk(coords){
      if(!Array.isArray(coords))return coords;
      if(typeof coords[0]==='number'&&typeof coords[1]==='number'){
        return [Number(coords[0])+deltaLng,Number(coords[1])+deltaLat].concat(coords.slice(2));
      }
      return coords.map(walk);
    }
    return {type:geometry.type,coordinates:walk(geometry.coordinates)};
  }

  function bonogasBuildGeoJsonDemoFeatures(sourceFeatures,target){
    const base=(sourceFeatures||[]).filter(function(f){
      const type=String((f.properties||{}).tipo_geoportal||'').toLowerCase();
      return type==='manzana'&&f.geometry&&/Polygon/i.test(String(f.geometry.type||''));
    }).slice(target.offset||0,(target.offset||0)+(target.count||18));
    const firstCenter=bonogasGeometryCenter(base[0]&&base[0].geometry)||[-8.111,-79.03];
    const deltaLat=Number(target.lat)-firstCenter[0];
    const deltaLng=Number(target.lng)-firstCenter[1];
    return base.map(function(feature,i){
      const props=Object.assign({},feature.properties||{});
      const estrato=String(((i+(target.estratoShift||0))%5)+1);
      props.Departamento=target.deptCode;
      props.Departamento_nombre=target.departamento;
      props.ID_DISTRICT=target.districtCode;
      props.Distrito=target.distrito;
      props.Provincia=target.provinciaCode||target.districtCode.slice(0,4);
      props.Codigo_ubigeo=target.districtCode+String(7000+i).slice(-4);
      props.ID_proyecto=target.projectCode;
      props.Nombre_proyecto=target.projectName+' · MALLA '+String(i+1).padStart(2,'0');
      props.Campanna_comercial=target.campanna||target.distrito.toUpperCase();
      props.Contratista_asignado=target.contratista||props.Contratista_asignado||'Contratista demo';
      props.ESTRATOS=estrato;
      props.ESTRATOS_LABEL=bonogasEstratoLabel(estrato);
      props.ID_SQUARE=target.prefix+'-'+String(i+1).padStart(3,'0');
      props.OBJECTID=target.objectBase+i;
      props.NAME='MZ-'+String(i+1).padStart(3,'0');
      props.SQUARE_PROPERTY_CODE=target.prefix+'-'+String(i+1).padStart(3,'0');
      props.Numero_predios=Number(props.Numero_predios||24)+(i%6)*4;
      props.Numero_habilitados=Number(props.Numero_habilitados||10)+(i%5)*3;
      props.Numero_unidades_prediales=Number(props.Numero_unidades_prediales||props.Numero_predios||24)+(i%7)*5;
      return {
        type:'Feature',
        id:target.prefix+'-'+String(feature.id||i),
        bbox:null,
        properties:props,
        geometry:bonogasTranslateGeometryForDemo(feature.geometry,deltaLng,deltaLat)
      };
    });
  }

  function bonogasCloneFeatureNear(feature,opts){
    opts=opts||{};
    const props=Object.assign({},feature.properties||{});
    const seq=Number(opts.seq||0);
    props.ID_SQUARE=(opts.prefix||'TRU-EXTRA')+'-'+String(seq+1).padStart(3,'0');
    props.OBJECTID=Number(opts.objectBase||960000)+seq;
    props.NAME='MZ-'+String(seq+1).padStart(3,'0');
    props.SQUARE_PROPERTY_CODE=props.ID_SQUARE;
    props.ESTRATOS=String((seq%5)+1);
    props.ESTRATOS_LABEL=bonogasEstratoLabel(props.ESTRATOS);
    props.Numero_predios=Number(props.Numero_predios||30)+(seq%8)*3;
    props.Numero_habilitados=Number(props.Numero_habilitados||12)+(seq%6)*2;
    props.tipo_geoportal='manzana';
    props.Departamento='13';
    props.Departamento_nombre='La Libertad';
    props.ID_DISTRICT='130101';
    props.Distrito='Trujillo';
    props.Provincia='1301';
    props.ID_proyecto='PY-DEMO-TRU-EXP';
    props.Nombre_proyecto='TRU - NUCLEO ESTRATIFICACION DEMO · '+String(seq+1).padStart(2,'0');
    props.Campanna_comercial='TRUJILLO';
    return {
      type:'Feature',
      id:props.ID_SQUARE,
      properties:props,
      geometry:bonogasTranslateGeometryForDemo(feature.geometry,Number(opts.deltaLng)||0,Number(opts.deltaLat)||0)
    };
  }

  function bonogasBuildTrujilloExtraFeatures(sourceFeatures){
    const base=(sourceFeatures||[]).filter(function(f){
      const p=f.properties||{};
      return String(p.tipo_geoportal||'').toLowerCase()==='manzana'&&f.geometry&&/Polygon/i.test(String(f.geometry.type||''))&&String(p.ID_DISTRICT||'')==='130101';
    }).slice(0,36);
    const offsets=[
      [0.0000,0.0000],[0.0018,0.0008],[-0.0017,0.0011],[0.0024,-0.0014],[-0.0022,-0.0011],
      [0.0042,0.0017],[-0.0040,0.0014],[0.0037,-0.0026],[-0.0036,-0.0023],
      [0.0060,0.0004],[-0.0062,-0.0005],[0.0008,0.0034],[-0.0009,-0.0033]
    ];
    const out=[];
    offsets.forEach(function(offset,oi){
      base.slice(oi%3,oi%3+8).forEach(function(feature,fi){
        out.push(bonogasCloneFeatureNear(feature,{seq:out.length,prefix:'TRU-MZ',objectBase:970000,deltaLng:offset[0],deltaLat:offset[1]}));
      });
    });
    return out;
  }

  function bonogasApplyFiveEstratosToDistrict(features,districtCode,shift){
    let n=0;
    (features||[]).forEach(function(feature){
      const p=feature.properties||{};
      const isManzana=String(p.tipo_geoportal||'').toLowerCase()==='manzana'&&feature.geometry&&/Polygon/i.test(String(feature.geometry.type||''));
      if(!isManzana||String(p.ID_DISTRICT||'')!==String(districtCode))return;
      const estrato=String(((n+(shift||0))%5)+1);
      p.ESTRATOS=estrato;
      p.ESTRATOS_LABEL=bonogasEstratoLabel(estrato);
      n++;
    });
  }

  function bonogasNormalizeRealFeature(feature,idx){
    const p=feature.properties||{};
    const estrato=bonogasFeatureEstrato(p,idx);
    const dept=BONOGAS_DEPT_CODE_NAMES[String(p.Departamento||p.departamento||'')]||p.Departamento_nombre||p.departamento_nombre||p.departamento||p.region||'La Libertad';
    const district=BONOGAS_DISTRICT_CODE_NAMES[String(p.ID_DISTRICT||p.id_district||'')]||p.Distrito||p.distrito||'Trujillo';
    const provinciaCode=String(p.Provincia||p.provincia||'');
    const provinciaName=BONOGAS_PROVINCE_CODE_NAMES[provinciaCode]||p.Provincia_nombre||p.provincia_nombre||p.provincia||provinciaCode||'';
    const center=bonogasGeometryCenter(feature.geometry)||[-8.111,-79.03];
    return ensureBonogasRecord({
      idx:idx+1,
      suministro:'MZ-'+(p.ID_SQUARE||p.OBJECTID||feature.id||idx),
      numeroInstalacion:p.ID_SQUARE||p.OBJECTID||feature.id||'',
      beneficiario:'Manzana '+(p.NAME||p.SQUARE_PROPERTY_CODE||p.ID_SQUARE||feature.id||idx),
      departamento:dept,
      region:dept,
      provincia:provinciaName,
      provinciaCode:provinciaCode,
      distrito:district,
      empresaInstaladora:p.Contratista_asignado||'Sin empresa',
      concesionaria:'Quavii / Geoportal',
      estadoInstalacion:'Manzana geoportal',
      lat:center[0],
      lng:center[1],
      fuente:'Geoportal · geometría real',
      estratoSocioeconomico:estrato,
      estratoLabel:bonogasEstratoLabel(estrato),
      _geoJsonFeature:true,
      _geoJsonGeometry:feature.geometry,
      _geoJsonProperties:p,
      _geoJsonId:feature.id||p.OBJECTID||p.ID_SQUARE||idx,
      predios:Number(p.Numero_predios||p.Numero_unidades_prediales||0),
      habilitados:Number(p.Numero_habilitados||0)
    },idx);
  }

  BONOGAS_EMBEDDED_MANZANAS_EXAMPLE.features=[
    {type:'Feature',properties:{tipo_geoportal:'manzana',Departamento_nombre:'Arequipa',Distrito:'Cerro Colorado',ESTRATOS:'1',ESTRATOS_LABEL:'Muy bajo',ID_SQUARE:'AQP-CC-101',NAME:'MZ-101',Contratista_asignado:'GasSur Instalaciones S.A.C.',Numero_predios:26,Numero_habilitados:8},geometry:{type:'Polygon',coordinates:[[[-71.57372,-16.37494],[-71.57324,-16.37486],[-71.57292,-16.37506],[-71.57298,-16.37542],[-71.57350,-16.37552],[-71.57382,-16.37528],[-71.57372,-16.37494]]]}},
    {type:'Feature',properties:{tipo_geoportal:'manzana',Departamento_nombre:'Arequipa',Distrito:'Cerro Colorado',ESTRATOS:'1',ESTRATOS_LABEL:'Muy bajo',ID_SQUARE:'AQP-CC-102',NAME:'MZ-102',Contratista_asignado:'GasSur Instalaciones S.A.C.',Numero_predios:22,Numero_habilitados:7},geometry:{type:'Polygon',coordinates:[[[-71.57278,-16.37502],[-71.57228,-16.37496],[-71.57192,-16.37520],[-71.57202,-16.37556],[-71.57252,-16.37562],[-71.57286,-16.37538],[-71.57278,-16.37502]]]}},
    {type:'Feature',properties:{tipo_geoportal:'manzana',Departamento_nombre:'Arequipa',Distrito:'Cerro Colorado',ESTRATOS:'2',ESTRATOS_LABEL:'Bajo',ID_SQUARE:'AQP-CC-103',NAME:'MZ-103',Contratista_asignado:'Andes Gas Contratistas',Numero_predios:34,Numero_habilitados:13},geometry:{type:'Polygon',coordinates:[[[-71.57172,-16.37518],[-71.57126,-16.37508],[-71.57088,-16.37530],[-71.57098,-16.37570],[-71.57148,-16.37580],[-71.57182,-16.37552],[-71.57172,-16.37518]]]}},
    {type:'Feature',properties:{tipo_geoportal:'manzana',Departamento_nombre:'Arequipa',Distrito:'Cerro Colorado',ESTRATOS:'2',ESTRATOS_LABEL:'Bajo',ID_SQUARE:'AQP-CC-104',NAME:'MZ-104',Contratista_asignado:'Andes Gas Contratistas',Numero_predios:29,Numero_habilitados:10},geometry:{type:'Polygon',coordinates:[[[-71.57068,-16.37542],[-71.57018,-16.37534],[-71.56978,-16.37558],[-71.56988,-16.37596],[-71.57038,-16.37606],[-71.57076,-16.37580],[-71.57068,-16.37542]]]}},
    {type:'Feature',properties:{tipo_geoportal:'manzana',Departamento_nombre:'Arequipa',Distrito:'Cerro Colorado',ESTRATOS:'1',ESTRATOS_LABEL:'Muy bajo',ID_SQUARE:'AQP-CC-105',NAME:'MZ-105',Contratista_asignado:'GasSur Instalaciones S.A.C.',Numero_predios:31,Numero_habilitados:11},geometry:{type:'Polygon',coordinates:[[[-71.57356,-16.37576],[-71.57304,-16.37566],[-71.57268,-16.37590],[-71.57276,-16.37630],[-71.57328,-16.37642],[-71.57364,-16.37614],[-71.57356,-16.37576]]]}},
    {type:'Feature',properties:{tipo_geoportal:'manzana',Departamento_nombre:'Arequipa',Distrito:'Cerro Colorado',ESTRATOS:'2',ESTRATOS_LABEL:'Bajo',ID_SQUARE:'AQP-CC-106',NAME:'MZ-106',Contratista_asignado:'TecnoGas Arequipa',Numero_predios:38,Numero_habilitados:17},geometry:{type:'Polygon',coordinates:[[[-71.57246,-16.37586],[-71.57196,-16.37578],[-71.57158,-16.37604],[-71.57168,-16.37642],[-71.57220,-16.37652],[-71.57256,-16.37624],[-71.57246,-16.37586]]]}},
    {type:'Feature',properties:{tipo_geoportal:'manzana',Departamento_nombre:'Arequipa',Distrito:'Cerro Colorado',ESTRATOS:'3',ESTRATOS_LABEL:'Medio',ID_SQUARE:'AQP-CC-107',NAME:'MZ-107',Contratista_asignado:'RedGas Peru S.A.C.',Numero_predios:42,Numero_habilitados:24},geometry:{type:'Polygon',coordinates:[[[-71.57134,-16.37600],[-71.57086,-16.37592],[-71.57048,-16.37618],[-71.57058,-16.37658],[-71.57108,-16.37666],[-71.57144,-16.37638],[-71.57134,-16.37600]]]}},
    {type:'Feature',properties:{tipo_geoportal:'manzana',Departamento_nombre:'Arequipa',Distrito:'Cerro Colorado',ESTRATOS:'3',ESTRATOS_LABEL:'Medio',ID_SQUARE:'AQP-CC-108',NAME:'MZ-108',Contratista_asignado:'RedGas Peru S.A.C.',Numero_predios:39,Numero_habilitados:21},geometry:{type:'Polygon',coordinates:[[[-71.57022,-16.37620],[-71.56972,-16.37612],[-71.56932,-16.37638],[-71.56942,-16.37676],[-71.56994,-16.37686],[-71.57030,-16.37658],[-71.57022,-16.37620]]]}},
    {type:'Feature',properties:{tipo_geoportal:'manzana',Departamento_nombre:'Arequipa',Distrito:'Cerro Colorado',ESTRATOS:'2',ESTRATOS_LABEL:'Bajo',ID_SQUARE:'AQP-CC-109',NAME:'MZ-109',Contratista_asignado:'TecnoGas Arequipa',Numero_predios:44,Numero_habilitados:19},geometry:{type:'Polygon',coordinates:[[[-71.57332,-16.37664],[-71.57280,-16.37654],[-71.57242,-16.37682],[-71.57252,-16.37724],[-71.57304,-16.37734],[-71.57342,-16.37704],[-71.57332,-16.37664]]]}},
    {type:'Feature',properties:{tipo_geoportal:'manzana',Departamento_nombre:'Arequipa',Distrito:'Cerro Colorado',ESTRATOS:'3',ESTRATOS_LABEL:'Medio',ID_SQUARE:'AQP-CC-110',NAME:'MZ-110',Contratista_asignado:'RedGas Peru S.A.C.',Numero_predios:47,Numero_habilitados:28},geometry:{type:'Polygon',coordinates:[[[-71.57218,-16.37674],[-71.57170,-16.37666],[-71.57130,-16.37694],[-71.57140,-16.37734],[-71.57192,-16.37742],[-71.57228,-16.37714],[-71.57218,-16.37674]]]}},
    {type:'Feature',properties:{tipo_geoportal:'manzana',Departamento_nombre:'Arequipa',Distrito:'Cerro Colorado',ESTRATOS:'4',ESTRATOS_LABEL:'Alto',ID_SQUARE:'AQP-CC-111',NAME:'MZ-111',Contratista_asignado:'GasSur Instalaciones S.A.C.',Numero_predios:35,Numero_habilitados:31},geometry:{type:'Polygon',coordinates:[[[-71.57106,-16.37690],[-71.57056,-16.37682],[-71.57018,-16.37710],[-71.57030,-16.37750],[-71.57082,-16.37758],[-71.57116,-16.37728],[-71.57106,-16.37690]]]}},
    {type:'Feature',properties:{tipo_geoportal:'manzana',Departamento_nombre:'Arequipa',Distrito:'Cerro Colorado',ESTRATOS:'4',ESTRATOS_LABEL:'Alto',ID_SQUARE:'AQP-CC-112',NAME:'MZ-112',Contratista_asignado:'GasSur Instalaciones S.A.C.',Numero_predios:32,Numero_habilitados:29},geometry:{type:'Polygon',coordinates:[[[-71.56992,-16.37708],[-71.56940,-16.37698],[-71.56902,-16.37728],[-71.56914,-16.37768],[-71.56966,-16.37776],[-71.57002,-16.37746],[-71.56992,-16.37708]]]}}
  ];

  BONOGAS_EMBEDDED_MANZANAS_EXAMPLE.features=[];
  const BONOGAS_REAL_MANZANAS_SOURCE='assets/geo/bonogas-manzanas-urbanas.geojson?v=urban-blocks-real-v1';
  bonogasRealManzanaRows=[];
  bonogasRealManzanasLoaded=false;
  window.__bonogasRealManzanaCount=0;

  function bonogasLoadRealManzanas(){
    if(bonogasRealManzanasLoaded)return Promise.resolve(bonogasRealManzanaRows);
    if(bonogasRealManzanasLoading)return window.__bonogasRealManzanasPromise||Promise.resolve(bonogasRealManzanaRows);
    bonogasRealManzanasLoading=true;
    const sources=[BONOGAS_REAL_MANZANAS_SOURCE];
    window.__bonogasRealManzanasPromise=Promise.all(sources.map(function(url){
      return fetch(url).then(function(r){if(!r.ok)throw new Error('No se pudo cargar '+url);return r.json();}).catch(function(){return {features:[]};});
    }))
      .then(function(collections){
        const features=[];
        collections.forEach(function(json){features.push.apply(features,json.features||[]);});
        Array.from(new Set(features.map(function(f){return String((f.properties||{}).ID_DISTRICT||'');}).filter(Boolean))).forEach(function(districtCode,di){
          bonogasApplyFiveEstratosToDistrict(features,districtCode,di);
        });
        bonogasRealManzanaRows=features.filter(function(f){
          const type=String((f.properties||{}).tipo_geoportal||'').toLowerCase();
          return type==='manzana'&&f.geometry&&/Polygon/i.test(String(f.geometry.type||''));
        }).map(bonogasNormalizeRealFeature);
        const seen=new Set();
        bonogasRealManzanaRows=bonogasRealManzanaRows.filter(function(r){
          const key=String(r.suministro||r._geoJsonId||'');
          if(seen.has(key))return false;
          seen.add(key);
          return true;
        });
        bonogasRealManzanasLoaded=true;
        window.__bonogasRealManzanaCount=bonogasRealManzanaRows.length;
        return bonogasRealManzanaRows;
      })
      .catch(function(){
        bonogasRealManzanaRows=[];
        bonogasRealManzanasLoaded=true;
        window.__bonogasRealManzanaCount=bonogasRealManzanaRows.length;
        return bonogasRealManzanaRows;
      })
      .finally(function(){bonogasRealManzanasLoading=false;});
    return window.__bonogasRealManzanasPromise;
  }

  function bonogasFechaLabel(ym){
    if(!ym)return 'Todas las fechas';
    const parts=String(ym).split('-');
    if(parts.length<2)return ym;
    return BONOGAS_MESES[parseInt(parts[1],10)]+' '+parts[0];
  }

  function bonogasFechaRangeLabel(desde,hasta){
    if(!desde&&!hasta)return 'Todas las fechas';
    if(desde&&hasta&&desde===hasta)return bonogasFechaLabel(desde.slice(0,7))+' · '+desde.slice(8);
    if(desde&&hasta)return desde+' — '+hasta;
    if(desde)return 'Desde '+desde;
    return 'Hasta '+hasta;
  }

  function normalizeBonogasSatFilters(f){
    f=Object.assign({departamento:'',distrito:'',estrato:'',tipoBeneficiario:'',subtipoBeneficiario:'',empresaInstaladora:'',concesionaria:'',fechaDesde:'',fechaHasta:''},f||{});
    if(f.fecha&&!f.fechaDesde&&!f.fechaHasta){
      const ym=String(f.fecha);
      f.fechaDesde=ym+'-01';
      const parts=ym.split('-');
      const y=parseInt(parts[0],10),m=parseInt(parts[1],10);
      const last=new Date(y,m,0).getDate();
      f.fechaHasta=ym+'-'+String(last).padStart(2,'0');
    }
    delete f.fecha;
    return f;
  }
  window.bonogasSatFilters=normalizeBonogasSatFilters(window.bonogasSatFilters);

  function bonogasRecordFechaKey(r){
    const raw=r.fechaFiltro||r.fechaHabilitacion||r.fechaRegistro||r.fechaRegistroPortal||'';
    const m=String(raw).match(/^(\d{4}-\d{2})/);
    return m?m[1]:'';
  }

  function bonogasRecordFullDate(r){
    const raw=r.fechaHabilitacion||r.fechaRegistro||r.fechaRegistroPortal||'';
    const m=String(raw).match(/^(\d{4}-\d{2}-\d{2})/);
    return m?m[1]:'';
  }

  window.bonogasExportMeta=function(){
    const f=normalizeBonogasSatFilters(window.bonogasSatFilters||{});
    return {
      estrato:f.estrato?bonogasEstratoLabel(f.estrato):'Todos los estratos',
      departamento:f.departamento||'Todos los departamentos',
      distrito:f.distrito||'Todos los distritos',
      empresa:f.empresaInstaladora||'Todas las empresas',
      concesionaria:f.concesionaria||'Todas las concesionarias',
      fecha:bonogasFechaRangeLabel(f.fechaDesde,f.fechaHasta)
    };
  };
  window.bonogasExportFechaLine=function(){
    return 'Fecha: '+window.bonogasExportMeta().fecha;
  };

  function normalizeBonogasEstratoNum(r,idx){
    const raw=r.estratoSocioeconomico!=null?r.estratoSocioeconomico:(r.estrato!=null?r.estrato:'');
    const s=String(raw).trim().toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu,'');
    if(/^1$|^estrato\s*1$|muy bajo/.test(s))return '1';
    if(/^2$|^estrato\s*2$|^bajo$/.test(s))return '2';
    if(/^3$|^estrato\s*3$|^medio$/.test(s))return '3';
    if(/^4$|^estrato\s*4$|^alto$/.test(s))return '4';
    if(/^5$|^estrato\s*5$|muy alto/.test(s))return '5';
    const n=parseInt(s,10);
    if(n>=1&&n<=5)return String(n);
    if(typeof idx==='number')return String((idx%5)+1);
    return '3';
  }

  function ensureRecordEstrato(r,idx){
    const d=Object.assign({},r);
    const estrato=normalizeBonogasEstratoNum(d,typeof idx==='number'?idx:(Number(d.idx||1)-1));
    d.estratoSocioeconomico=estrato;
    d.estratoLabel=bonogasEstratoLabel(estrato);
    d.estrato=d.estratoLabel;
    return d;
  }

  function ensureBonogasRecord(r,idx){
    const d=ensureRecordEstrato(r,typeof idx==='number'?idx:(Number(r.idx||1)-1));
    const recordIndex=typeof idx==='number'?idx:(Number(r.idx||1)-1);
    const rawType=String(d.tipoBeneficiario||d.tipoSuministro||'Residencial');
    const isNonResidential=/no residencial|comercial|instituci[oó]n|industrial|otros?/i.test(rawType);
    d.tipoBeneficiario=isNonResidential?'No residencial':'Residencial';
    if(d.tipoBeneficiario==='No residencial'){
      if(!d.subtipoBeneficiario){
        if(/comercial/i.test(rawType))d.subtipoBeneficiario='Comercial';
        else if(/instituci[oó]n/i.test(rawType))d.subtipoBeneficiario='Institución pública';
        else if(/industrial/i.test(rawType))d.subtipoBeneficiario='Industrial';
        else d.subtipoBeneficiario=['Comercial','Institución pública','Industrial','Otros'][Math.abs(recordIndex)%4];
      }
    }else d.subtipoBeneficiario='No aplica';
    if(!d.empresaInstaladora)d.empresaInstaladora='Sin empresa';
    if(!d.concesionaria){
      d.concesionaria=BONOGAS_CONCESIONARIA_BY_REGION[d.region]||BONOGAS_CONCESIONARIAS[(typeof idx==='number'?idx:0)%BONOGAS_CONCESIONARIAS.length];
    }
    d.departamento=d.departamento||d.region||'Lima';
    d.region=d.region||d.departamento;
    d.distrito=d.distrito||d.district||d.provincia||bonogasDistrictForDept(d.departamento,idx);
    const fidx=typeof idx==='number'?idx:0;
    if(!d.fechaHabilitacion||/pendiente/i.test(String(d.fechaHabilitacion))){
      const ym=BONOGAS_FECHA_POOL[fidx%BONOGAS_FECHA_POOL.length];
      const day=String((fidx%27)+1).padStart(2,'0');
      d.fechaHabilitacion=ym+'-'+day;
    }
    if(!d.fechaRegistro){
      const hab=new Date(String(d.fechaHabilitacion).slice(0,10));
      hab.setDate(hab.getDate()-45-(fidx%30));
      d.fechaRegistro=hab.toISOString().slice(0,10);
    }
    d.fechaFiltro=bonogasRecordFechaKey(d);
    return d;
  }

  function bonogasRecordMatchesFilters(r){
    const f=normalizeBonogasSatFilters(window.bonogasSatFilters||{});
    if(f.departamento&&(r.departamento||r.region||'')!==f.departamento)return false;
    if(f.distrito&&(r.distrito||'')!==f.distrito)return false;
    if(f.estrato&&normalizeBonogasEstratoNum(r,r.idx!=null?Number(r.idx)-1:0)!==f.estrato)return false;
    if(f.tipoBeneficiario&&(r.tipoBeneficiario||'Residencial')!==f.tipoBeneficiario)return false;
    if(f.subtipoBeneficiario&&(r.subtipoBeneficiario||'No aplica')!==f.subtipoBeneficiario)return false;
    if(f.empresaInstaladora&&(r.empresaInstaladora||'Sin empresa')!==f.empresaInstaladora)return false;
    if(f.concesionaria&&(r.concesionaria||'')!==f.concesionaria)return false;
    if(f.fechaDesde||f.fechaHasta){
      const d=bonogasRecordFullDate(r);
      if(!d)return false;
      if(f.fechaDesde&&d<f.fechaDesde)return false;
      if(f.fechaHasta&&d>f.fechaHasta)return false;
    }
    return true;
  }

  function getBonogasFilteredRows(){
    const main=typeof qs==='function'?qs('.main'):document.querySelector('.main');
    const inBonogas=main&&(main.classList.contains('bonogas-satcontrol-mode')||main.classList.contains('bonogas-active'));
    const f=normalizeBonogasSatFilters(window.bonogasSatFilters||{});
    const useGeoJsonRows=!!(f.departamento||f.distrito||f.estrato);
    if(inBonogas&&useGeoJsonRows){
      const realRows=bonogasRealManzanaRows.filter(bonogasRecordMatchesFilters);
      if(realRows.length)return realRows;
      return bonogasMapRowsAll().filter(bonogasRecordMatchesFilters);
    }
    const rows=inBonogas?bonogasMapRowsAll():bonogasMapRows();
    return rows.filter(bonogasRecordMatchesFilters);
  }
  function getBonogasEstratoFilteredRows(){return getBonogasFilteredRows();}

  function bonogasHasSpatialFilter(){
    const f=normalizeBonogasSatFilters(window.bonogasSatFilters||{});
    return !!(f.departamento||f.distrito||f.estrato);
  }

  function bonogasRowsForMapRender(rows){
    rows=Array.isArray(rows)?rows:[];
    if(!bonogasHasSpatialFilter()){
      return rows.filter(function(r){return !r._geoJsonGeometry;}).slice(0,220);
    }
    const geo=rows.filter(function(r){return !!r._geoJsonGeometry;});
    const nonGeo=rows.filter(function(r){return !r._geoJsonGeometry;}).slice(0,120);
    const maxGeo=Number((window.bonogasSatFilters&&window.bonogasSatFilters.distrito)?900:450);
    return geo.slice(0,maxGeo).concat(nonGeo);
  }

  function enrichBonogasDatasetFields(){
    const legacy={'muy bajo':'1','bajo':'2','medio':'3','alto':'4','muy alto':'5'};
    (window._enrichedBeneficiarios||[]).forEach(function(r,i){
      if(!r.estratoSocioeconomico){
        const leg=legacy[String(r.estrato||'').toLowerCase().trim().normalize('NFD').replace(/\p{Diacritic}/gu,'')];
        r.estratoSocioeconomico=leg||String((i%5)+1);
      }
      Object.assign(r,ensureBonogasRecord(r,i));
    });
  }
  enrichBonogasDatasetFields();

  function supplyRows(){
    const source=(typeof currentSupplyRecords!=='undefined'&&currentSupplyRecords&&currentSupplyRecords.length)?currentSupplyRecords:((window.currentSupplyRecords&&window.currentSupplyRecords.length)?window.currentSupplyRecords:[]);
    const rows=source.map(function(r,i){
      const d=(typeof normalizeSelectedRecord==='function')?normalizeSelectedRecord(r):r;
      const info=(typeof supplyDeadlineInfo==='function')?supplyDeadlineInfo(d):{days:Number(d.diasConstruccion||0),limit:90,within:Number(d.diasConstruccion||0)<90};
      return ensureBonogasRecord(Object.assign({},d,{idx:i+1,days:info.days==null?0:info.days,limit:info.limit||90,within:!!info.within}),i);
    });
    return rows.length?rows:[
      {idx:1,suministro:'5208079',numeroInstalacion:'INS-5208079',beneficiario:'Maria Quispe Huaman',dni:'43567891',region:'Piura',empresaInstaladora:'Instalaciones del Norte S.A.C.',concesionaria:'Cálidda',estadoInstalacion:'En construccion',days:96,limit:90,within:false,lat:-5.1945,lng:-80.6328,fuente:'Portal de Habilitaciones',estratoSocioeconomico:'1'},
      {idx:2,suministro:'913777',numeroInstalacion:'INS-913777',beneficiario:'Jose Mamani Flores',dni:'40221876',region:'Arequipa',empresaInstaladora:'Gas & Hogar E.I.R.L.',concesionaria:'Gas Natural del Perú',estadoInstalacion:'En construccion',days:74,limit:90,within:true,lat:-16.409,lng:-71.537,fuente:'BonoGas 2.0',estratoSocioeconomico:'2'},
      {idx:3,suministro:'5410777',numeroInstalacion:'INS-5410777',beneficiario:'Rosa Condori Arias',dni:'46123988',region:'La Libertad',empresaInstaladora:'Instalagas Peru S.A.C.',concesionaria:'Cálidda',estadoInstalacion:'Liquidado',days:0,limit:90,within:true,lat:-8.1084,lng:-79.0215,fuente:'BonoGas 2.0',estratoSocioeconomico:'3'},
      {idx:4,suministro:'100512',numeroInstalacion:'INS-9077',beneficiario:'Ana Torres Medina',dni:'45892103',region:'Cusco',empresaInstaladora:'Andes Gas Contratistas',concesionaria:'Promigas Perú',estadoInstalacion:'Pendiente de liquidacion',days:0,limit:90,within:true,lat:-13.532,lng:-71.967,fuente:'Portal de Habilitaciones',estratoSocioeconomico:'1'},
      {idx:5,suministro:'100731',numeroInstalacion:'INS-9172',beneficiario:'Luis Herrera Rios',dni:'70451288',region:'Lambayeque',empresaInstaladora:'RedGas Contratistas',concesionaria:'Cálidda',estadoInstalacion:'En construccion',days:112,limit:90,within:false,lat:-6.7714,lng:-79.8409,fuente:'Portal de Habilitaciones',estratoSocioeconomico:'2'},
      {idx:6,suministro:'101104',numeroInstalacion:'INS-9302',beneficiario:'Elena Chavez Rojas',dni:'61294022',region:'Ica',empresaInstaladora:'GasSur Instalaciones',concesionaria:'Naturgy Lima',estadoInstalacion:'Pendiente de liquidacion',days:0,limit:90,within:true,lat:-14.0678,lng:-75.7286,fuente:'BonoGas 2.0',estratoSocioeconomico:'3'},
      {idx:7,suministro:'101020',numeroInstalacion:'INS-9288',beneficiario:'Pedro Salinas Gomez',dni:'47001288',region:'Callao',empresaInstaladora:'RedGas Contratistas',concesionaria:'Cálidda',estadoInstalacion:'En construccion',days:91,limit:90,within:false,lat:-12.062,lng:-77.118,fuente:'Portal de Habilitaciones',estratoSocioeconomico:'1'},
      {idx:8,suministro:'101241',numeroInstalacion:'INS-9344',beneficiario:'Patricia Salas Vera',dni:'41880922',region:'Lima',empresaInstaladora:'Consorcio Redes Lima',concesionaria:'Cálidda',estadoInstalacion:'Conectado',days:0,limit:90,within:true,lat:-12.0458,lng:-77.0442,fuente:'BonoGas 2.0',estratoSocioeconomico:'2'},
      {idx:9,suministro:'101388',numeroInstalacion:'INS-9388',beneficiario:'Carlos Ruiz Poma',dni:'44500192',region:'Tacna',empresaInstaladora:'Tacna Gas S.A.C.',concesionaria:'Gas Natural del Perú',estadoInstalacion:'Liquidado',days:0,limit:90,within:true,lat:-18.0081,lng:-70.2464,fuente:'BonoGas 2.0',estratoSocioeconomico:'3'},
      {idx:10,suministro:'101452',numeroInstalacion:'INS-9452',beneficiario:'Marta Ruiz Lazo',dni:'46723491',region:'Huanuco',empresaInstaladora:'Huanuco Gas',concesionaria:'GNLC',estadoInstalacion:'En construccion',days:105,limit:90,within:false,lat:-9.9312,lng:-76.2428,fuente:'Portal de Habilitaciones',estratoSocioeconomico:'1'},
      {idx:11,suministro:'101533',numeroInstalacion:'INS-9533',beneficiario:'Angela Poma Torres',dni:'43881230',region:'Junin',empresaInstaladora:'Centro Gas Peru',concesionaria:'GNLC',estadoInstalacion:'En construccion',days:83,limit:90,within:true,lat:-11.7765,lng:-75.2045,fuente:'Portal de Habilitaciones',estratoSocioeconomico:'2'},
      {idx:12,suministro:'101604',numeroInstalacion:'INS-9604',beneficiario:'Roberto Chunga Rios',dni:'48001922',region:'Loreto',empresaInstaladora:'Iquitos Gas S.A.C.',concesionaria:'Gas Natural del Perú',estadoInstalacion:'Pendiente de liquidacion',days:0,limit:90,within:true,lat:-3.745,lng:-73.2536,fuente:'BonoGas 2.0',estratoSocioeconomico:'3'},
      {idx:13,suministro:'101677',numeroInstalacion:'INS-9677',beneficiario:'Nora Delgado Perez',dni:'42150980',region:'Puno',empresaInstaladora:'Puno Instalaciones S.A.C.',concesionaria:'Promigas Perú',estadoInstalacion:'En construccion',days:118,limit:90,within:false,lat:-15.84,lng:-70.0195,fuente:'Portal de Habilitaciones',estratoSocioeconomico:'1'},
      {idx:14,suministro:'101742',numeroInstalacion:'INS-9742',beneficiario:'Hector Gonzales Vega',dni:'41008731',region:'Cajamarca',empresaInstaladora:'Cajamarca Gas',concesionaria:'Cálidda',estadoInstalacion:'Conectado',days:0,limit:90,within:true,lat:-7.1636,lng:-78.5122,fuente:'BonoGas 2.0',estratoSocioeconomico:'2'}
    ].map(function(r,i){return ensureBonogasRecord(r,i)});
  }

  function bonogasDeadlineDays(r){
    if(Number.isFinite(Number(r.days)))return Number(r.days);
    if(typeof daysSince==='function'&&r.inicioConstruccion)return daysSince(r.inicioConstruccion);
    return Number(r.diasConstruccion||0);
  }

  function bonogasStatus(r){
    const s=String(r.estadoInstalacion||r.estado||'');
    if(/construcci/i.test(s)&&bonogasDeadlineDays(r)>=90)return 'Fuera de plazo';
    if(/construcci/i.test(s))return 'Dentro de plazo';
    if(/pendiente/i.test(s))return 'Pendiente liquidacion';
    if(/liquid|conect|habil/i.test(s))return 'Habilitado/Liquidado';
    return s||'Sin estado';
  }

  function bonogasMapRowsAll(){
    const base=supplyRows();
    const cities=[
      ['Piura',-5.1945,-80.6328,'Instalaciones del Norte S.A.C.','Cálidda'],
      ['Lambayeque',-6.7714,-79.8409,'RedGas Contratistas','Cálidda'],
      ['La Libertad',-8.1084,-79.0215,'NorteGas SAC','Cálidda'],
      ['Cajamarca',-7.1636,-78.5122,'Cajamarca Gas','Cálidda'],
      ['Lima',-12.0458,-77.0442,'Consorcio Redes Lima','Cálidda'],
      ['Callao',-12.062,-77.118,'Consorcio Redes Callao','Cálidda'],
      ['Ica',-14.0678,-75.7286,'GasSur Instalaciones','Naturgy Lima'],
      ['Huanuco',-9.9312,-76.2428,'Huanuco Gas','GNLC'],
      ['Junin',-11.7765,-75.2045,'Centro Gas Peru','GNLC'],
      ['Cusco',-13.532,-71.967,'Andes Gas Contratistas','Promigas Perú'],
      ['Arequipa',-16.409,-71.537,'TecnoGas Peru','Gas Natural del Perú'],
      ['Puno',-15.84,-70.0195,'Puno Instalaciones S.A.C.','Promigas Perú'],
      ['Tacna',-18.0081,-70.2464,'Tacna Gas S.A.C.','Gas Natural del Perú'],
      ['Loreto',-3.745,-73.2536,'Iquitos Gas S.A.C.','Gas Natural del Perú'],
      ['Tumbes',-3.5669,-80.4515,'NorteGas SAC','Cálidda'],
      ['Ancash',-9.5278,-77.5275,'Ancash Gas S.A.C.','Naturgy Lima'],
      ['San Martin',-6.4869,-76.3652,'Oriente Gas Peru','GNLC'],
      ['Ayacucho',-13.1631,-74.2236,'Andes Gas Contratistas','GNLC'],
      ['Madre de Dios',-12.5933,-69.1891,'Selva Gas S.A.C.','Promigas Perú'],
      ['Moquegua',-17.1938,-70.9351,'Sur Gas Instalaciones','Gas Natural del Perú']
    ];
    const states=['Conectado','Liquidado','Pendiente de liquidacion','En construccion','En construccion'];
    const extra=[];
    cities.forEach(function(c,ci){
      for(let j=0;j<7;j++){
        const days=(j===3?95+((ci*7)%34):(j===2?0:48+((ci+j)*5)%38));
        const estado=states[(ci+j)%states.length];
        const angle=((ci*47+j*71)%360)*Math.PI/180;
        const radius=.045+(((ci+j*3)%7)*.032);
        extra.push(ensureBonogasRecord({
          suministro:'BG-'+String(2026000+ci*10+j),
          numeroInstalacion:'INS-BG-'+String(26000+ci*10+j),
          beneficiario:['Maria Torres','Carlos Ruiz','Rosa Medina','Luis Herrera','Elena Chavez','Pedro Salinas','Nora Delgado'][j]+' '+c[0],
          dni:String(43000000+ci*137+j*29),
          region:c[0],
          empresaInstaladora:c[3],
          concesionaria:c[4],
          estadoInstalacion:estado,
          days:estado==='En construccion'?days:0,
          limit:90,
          within:estado!=='En construccion'||days<90,
          lat:c[1]+Math.sin(angle)*radius,
          lng:c[2]+Math.cos(angle)*radius,
          fuente:j%2?'BonoGas 2.0':'Portal de Habilitaciones',
          estratoSocioeconomico:String(((ci*7+j)%5)+1)
        },ci*7+j));
      }
    });
    const seen=new Set(base.map(function(r){return String(r.suministro)}));
    extra.forEach(function(r){if(!seen.has(String(r.suministro)))base.push(r)});
    bonogasRealManzanaRows.forEach(function(r){if(!seen.has(String(r.suministro))){base.push(r);seen.add(String(r.suministro));}});
    return base;
  }

  function buildBonogasRowsForProject(p){
    if(!p||typeof p.lat!=='number'||typeof p.lng!=='number')return [];
    const count=Math.min(40,Math.max(16,Math.round((p.beneficiarios||24)/4)));
    const states=['Liquidado','Pendiente de liquidación','Dentro de plazo','Fuera de plazo'];
    const names=['Ana Torres','Carlos Paredes','Lucía Vargas','Miguel Salas','Juana Rojas','Pedro Gutiérrez','Elena Chávez','Raúl Medina'];
    const companies=['GasSur Instalaciones S.A.C.','Andes Gas Contratistas','RedGas Perú S.A.C.','TecnoGas Arequipa'];
    const rows=[];
    for(let i=0;i<count;i++){
      const estadoInstalacion=states[i%4];
      const seed=(typeof beneficiaryStableSeed==='function')?beneficiaryStableSeed({suministro:p.id+'-SUM-'+i,projectId:p.id},i):i;
      const goldenAngle=Math.PI*(3-Math.sqrt(5));
      const ring=0.015+Math.sqrt(i+1)*0.005;
      const angle=(i*goldenAngle)+(seed%48)*0.014;
      const pointLat=p.lat+Math.sin(angle)*ring;
      const pointLng=p.lng+Math.cos(angle)*ring;
      let days=0,within=true,inicioConstruccion='2026-01-15',fechaInstalacion='2026-04-'+String(5+(i%24)).padStart(2,'0');
      if(estadoInstalacion==='Dentro de plazo'){
        days=48+(i%35);within=true;inicioConstruccion='2026-01-'+String(5+(i%20)).padStart(2,'0');fechaInstalacion='Pendiente de habilitación';
      }else if(estadoInstalacion==='Fuera de plazo'){
        days=96+(i%40);within=false;inicioConstruccion='2025-10-'+String(5+(i%20)).padStart(2,'0');fechaInstalacion='Pendiente de habilitación';
      }
      rows.push(ensureBonogasRecord({
        suministro:p.id+'-SUM-'+String(1000+i).padStart(4,'0'),
        tipoSuministro:i%5===0?'No residencial':'Residencial',
        beneficiario:names[i%names.length],
        fechaInstalacion:fechaInstalacion,
        estadoInstalacion:estadoInstalacion,
        inicioConstruccion:inicioConstruccion,
        empresaInstaladora:companies[i%companies.length],
        lat:pointLat,
        lng:pointLng,
        region:p.departamento||p.provincia||'Agrupación',
        projectId:p.id,
        fuente:'Agrupación '+(p.nombre||''),
        days:days,
        within:within,
        limit:90
      },i));
    }
    return rows;
  }

  function bonogasMapRows(){
    const p=(typeof currentProject==='function')?currentProject():null;
    const main=typeof qs==='function'?qs('.main'):document.querySelector('.main');
    const inBonogas=main&&(main.classList.contains('bonogas-satcontrol-mode')||main.classList.contains('bonogas-active'));
    if(inBonogas&&p&&typeof p.lat==='number'&&typeof p.lng==='number'){
      if((currentSupplyRecords||[]).length&&typeof activeMapProjectId!=='undefined'&&activeMapProjectId===p.id){
        const scoped=(currentSupplyRecords||[]).filter(function(r){return !r.projectId||r.projectId===p.id;});
        if(scoped.length)return scoped;
      }
      return buildBonogasRowsForProject(p);
    }
    return bonogasMapRowsAll();
  }

  function syncBonogasMapToProject(p){
    if(!p||typeof leafletMap==='undefined'||!leafletMap)return;
    if(typeof p.lat!=='number'||typeof p.lng!=='number'){p.lat=-12.0464;p.lng=-77.0428;}
    const coords=[p.lat,p.lng];
    activeMapProjectId=p.id;
    if(typeof projectMarker!=='undefined'&&projectMarker){
      if(leafletMap.hasLayer(projectMarker))leafletMap.removeLayer(projectMarker);
    }
    const rows=buildBonogasRowsForProject(p);
    currentSupplyRecords=rows.slice();
    window.currentSupplyRecords=rows.slice();
    if(!geoPortalMapActive())ensureBonogasMapLayer();
    updateBonogasCorrectionCard(rows);
    setTimeout(function(){
      if(!leafletMap)return;
      if(typeof shouldSkipBonogasAutoMapZoom==='function'&&shouldSkipBonogasAutoMapZoom())return;
      const pts=rows.filter(function(r){return Number.isFinite(Number(r.lat))&&Number.isFinite(Number(r.lng));}).map(function(r){return [Number(r.lat),Number(r.lng)]});
      pts.push(coords);
      try{
        if(pts.length>1)leafletMap.fitBounds(pts,{padding:[52,52],maxZoom:15,animate:true});
        else leafletMap.setView(coords,14,{animate:true});
      }catch(e){leafletMap.setView(coords,14,{animate:true});}
      leafletMap.invalidateSize();
    },100);
  }
  window.syncBonogasMapToProject=syncBonogasMapToProject;

  function geoPortalMapActive(){
    return false;
  }

  function updateBonogasLayerLabel(rows){
    const label=$('#activeLayerLabel');
    if(!label)return;
    rows=rows||[];
    const f=normalizeBonogasSatFilters(window.bonogasSatFilters||{});
    const parts=[];
    if(f.departamento)parts.push('Dep. '+f.departamento);
    if(f.distrito)parts.push('Dist. '+f.distrito);
    parts.push(f.estrato?bonogasEstratoLabel(f.estrato):'Todos estratos');
    parts.push(f.empresaInstaladora||'Todas empresas');
    parts.push(f.concesionaria||'Todas concesionarias');
    parts.push(typeof bonogasFechaRangeLabel==='function'?bonogasFechaRangeLabel(f.fechaDesde,f.fechaHasta):'Todas las fechas');
    const geo=geoPortalMapActive();
    const visibleEstratos=Array.from(new Set(rows.map(function(r,i){return normalizeBonogasEstratoNum(r,r.idx!=null?Number(r.idx)-1:i);}))).sort();
    const legend=(visibleEstratos.length?visibleEstratos:['']).map(function(k){
      if(!k)return '<span style="color:#94a3b8">Sin estratos visibles</span>';
      return '<span style="display:inline-flex;align-items:center;gap:5px;margin-right:10px"><i style="width:12px;height:12px;border-radius:3px;background:'+BONOGAS_ESTRATO_COLORS[k]+';border:1px solid rgba(255,255,255,.55);display:inline-block"></i>Estrato '+k+'</span>';
    }).join('');
    label.innerHTML='Capa activa: <span style="color:#67e8f9">'+(geo?'Geoportal BONOGAS':'Manzanas BONOGAS')+'</span> · '+esc(parts.join(' · '))+' · '+rows.length+' reg.<div style="margin-top:8px;font-size:11px;color:#c8d4ef;line-height:1.6">'+legend+'</div>';
  }

  function updateBonogasEmptyState(rows){
    if(rows.length)return;
    const box=$('#supplyDetails');
    if(box){
      box.className='supply-card empty';
      box.innerHTML='<h3>Sin registros para los filtros seleccionados</h3><p class="supply-hint">Ajuste estrato, empresa instaladora, concesionaria o rango de fechas para visualizar suministros en el mapa.</p>';
    }
    const area=$('#areaStatsDetails');
    const hasArea=(window.activeAreaRecords&&activeAreaRecords.length)||(window.activeSelectionRecords&&activeSelectionRecords.length);
    if(area&&!hasArea){
      area.className='area-summary empty';
      area.innerHTML='<h3>Sin registros en el filtro actual</h3><p class="area-sub">No hay suministros que coincidan con la combinación de filtros activa.</p>';
    }
    if(typeof renderDonutChart==='function'){
      renderDonutChart([],'estratoSocioeconomico','Filtros · sin datos');
    }
  }

  function bonogasStatsBaseRows(){
    const filtered=getBonogasFilteredRows();
    if(window.activeSelectionRecords&&activeSelectionRecords.length){
      return activeSelectionRecords.filter(bonogasRecordMatchesFilters);
    }
    if(window.activeAreaRecords&&activeAreaRecords.length){
      return activeAreaRecords.filter(bonogasRecordMatchesFilters);
    }
    return filtered;
  }

  function getBonogasFilterOptions(){
    const main=typeof qs==='function'?qs('.main'):document.querySelector('.main');
    const inBonogas=main&&(main.classList.contains('bonogas-satcontrol-mode')||main.classList.contains('bonogas-active'));
    const rows=inBonogas?bonogasRealManzanaRows:bonogasMapRows();
    const departamentos=Array.from(new Set(rows.map(function(r){return r.departamento||r.region}).filter(Boolean))).sort();
    const filtros=normalizeBonogasSatFilters(window.bonogasSatFilters||{});
    const deptRows=rows.filter(function(r){return !filtros.departamento||(r.departamento||r.region)===filtros.departamento;});
    const distRows=deptRows.filter(function(r){return !filtros.distrito||(r.distrito||'')===filtros.distrito;});
    const estratoRows=distRows.filter(function(r){return !filtros.estrato||normalizeBonogasEstratoNum(r,r.idx!=null?Number(r.idx)-1:0)===filtros.estrato;});
    const distritos=Array.from(new Set(deptRows.map(function(r){return r.distrito}).filter(Boolean))).sort();
    const estratos=Array.from(new Set(distRows.map(function(r,i){return normalizeBonogasEstratoNum(r,r.idx!=null?Number(r.idx)-1:i);}).filter(Boolean))).sort();
    const empresas=Array.from(new Set(estratoRows.map(function(r){return r.empresaInstaladora||'Sin empresa'}))).sort();
    const concesionarias=Array.from(new Set(estratoRows.map(function(r){return r.concesionaria}).filter(Boolean))).sort();
    const fechas=Array.from(new Set(estratoRows.map(bonogasRecordFechaKey).filter(Boolean))).sort();
    return {departamentos:departamentos,distritos:distritos,estratos:estratos,empresas:empresas,concesionarias:concesionarias,fechas:fechas};
  }

  function readBonogasFiltersFromUi(){
    const estratoEl=$('#bonogasFilterEstrato');
    const departamentoEl=$('#bonogasFilterDepartamento');
    const distritoEl=$('#bonogasFilterDistrito');
    const empresaEl=$('#bonogasFilterEmpresa');
    const concesionariaEl=$('#bonogasFilterConcesionaria');
    const tipoBeneficiarioEl=$('#bonogasFilterTipoBeneficiario');
    const subtipoBeneficiarioEl=$('#bonogasFilterSubtipoBeneficiario');
    const desdeEl=$('#bonogasFilterFechaDesde');
    const hastaEl=$('#bonogasFilterFechaHasta');
    let fechaDesde=desdeEl?desdeEl.value:'';
    let fechaHasta=hastaEl?hastaEl.value:'';
    if(fechaDesde&&fechaHasta&&fechaDesde>fechaHasta){
      const tmp=fechaDesde;fechaDesde=fechaHasta;fechaHasta=tmp;
      if(desdeEl)desdeEl.value=fechaDesde;
      if(hastaEl)hastaEl.value=fechaHasta;
    }
    window.bonogasSatFilters=normalizeBonogasSatFilters({
      estrato:estratoEl?estratoEl.value:'',
      departamento:departamentoEl?departamentoEl.value:'',
      distrito:distritoEl?distritoEl.value:'',
      empresaInstaladora:empresaEl?empresaEl.value:'',
      concesionaria:concesionariaEl?concesionariaEl.value:'',
      tipoBeneficiario:tipoBeneficiarioEl?tipoBeneficiarioEl.value:'',
      subtipoBeneficiario:subtipoBeneficiarioEl?subtipoBeneficiarioEl.value:'',
      fechaDesde:fechaDesde,
      fechaHasta:fechaHasta
    });
  }

  function toggleBonogasFiltersPanel(force){
    const panel=$('#bonogasFiltersFloatPanel');
    const btn=$('#bonoUtilFiltersBtn');
    if(!panel)return;
    const open=typeof force==='boolean'?force:!panel.classList.contains('open');
    panel.classList.toggle('open',open);
    if(open){
      panel.removeAttribute('hidden');
      panel.setAttribute('aria-hidden','false');
    }else{
      panel.setAttribute('hidden','');
      panel.setAttribute('aria-hidden','true');
    }
    if(btn)btn.classList.toggle('active',open);
  }

  function prioritizeBonogasFiltersUtil(){
    const btn=$('#bonoUtilFiltersBtn');
    if(!btn||btn.dataset.bonogasFiltersBound==='1')return;
    btn.dataset.bonogasFiltersBound='1';
    btn.addEventListener('click',function(e){
      e.preventDefault();
      e.stopPropagation();
      toggleBonogasFiltersPanel();
    });
    if(!window.__bonogasFiltersOutsideBound){
      window.__bonogasFiltersOutsideBound=true;
      document.addEventListener('click',function(e){
        const panel=$('#bonogasFiltersFloatPanel');
        if(!panel||!panel.classList.contains('open'))return;
        if(e.target.closest('#bonogasFiltersFloatPanel')||e.target.closest('#bonoUtilFiltersBtn'))return;
        toggleBonogasFiltersPanel(false);
      });
    }
  }

  function applyBonogasFilters(){
    const main=$('.main');
    if(!main||(!main.classList.contains('bonogas-satcontrol-mode')&&!main.classList.contains('bonogas-active')))return;
    if(!bonogasRealManzanasLoaded&&!bonogasRealManzanasLoading){
      bonogasLoadRealManzanas().then(function(){renderBonogasFiltersPanel();applyBonogasFilters();});
      return;
    }
    readBonogasFiltersFromUi();
    activeAreaRecords=[];
    window.activeAreaRecords=[];
    const rows=getBonogasFilteredRows();
    currentSupplyRecords=rows.slice();
    window.currentSupplyRecords=rows.slice();
    if(!geoPortalMapActive())ensureBonogasMapLayer({zoomToResults:true});
    updateBonogasLayerLabel(rows);
    updateBonogasCorrectionCard(rows);
    if(typeof window.renderPlazo20HabilesCard==='function')window.renderPlazo20HabilesCard();
    const statsRows=bonogasStatsBaseRows();
    if(typeof renderDonutChart==='function'&&!isBonogasMapContext()){
      renderDonutChart(statsRows,'estratoSocioeconomico','Filtros activos');
    }
    if(!rows.length)updateBonogasEmptyState(rows);
    else if(window.activeAreaRecords&&activeAreaRecords.length){
      const areaRows=activeAreaRecords.filter(bonogasRecordMatchesFilters);
      activeAreaRecords=areaRows;
      currentSupplyRecords=areaRows.slice();
      window.currentSupplyRecords=areaRows.slice();
      const stats=areaRows.length?bonogasSummarizeRecords(areaRows):null;
      if(areaRows.length)updateBonogasAreaSelectionPanel(areaRows,'Area seleccionada',null,stats);
      updateBonogasCorrectionCard(areaRows.length?areaRows:rows,areaRows.length?'Area seleccionada':null);
    }
  }
  function applyBonogasEstratoFilter(){applyBonogasFilters();}

  function renderBonogasFiltersPanel(){
    if(!bonogasRealManzanasLoaded&&!bonogasRealManzanasLoading){
      bonogasLoadRealManzanas().then(function(){renderBonogasFiltersPanel();});
    }
    const oldWrap=$('#bonogasEstratoFilters');
    if(oldWrap)oldWrap.remove();
    const rightBlock=$('#bonogasFiltersBlock');
    if(rightBlock&&rightBlock.closest('.scroll-section'))rightBlock.remove();
    const mount=$('#bonogasFiltersMount');
    if(!mount)return;
    let wrap=mount.querySelector('#bonogasFiltersBlock');
    if(!wrap){
      wrap=document.createElement('div');
      wrap.id='bonogasFiltersBlock';
      wrap.className='bonogas-filters-block';
      wrap.innerHTML=
        '<div class="bonogas-filters-grid">'
          +'<label for="bonogasFilterDepartamento">Departamento<select id="bonogasFilterDepartamento" aria-label="Departamento"></select></label>'
          +'<label for="bonogasFilterDistrito">Distrito<select id="bonogasFilterDistrito" aria-label="Distrito"></select></label>'
          +'<label for="bonogasFilterEstrato">Estrato socioeconómico<select id="bonogasFilterEstrato" aria-label="Estrato socioeconómico"></select></label>'
          +'<label for="bonogasFilterTipoBeneficiario">Tipo de beneficiario<select id="bonogasFilterTipoBeneficiario" aria-label="Tipo de beneficiario"><option value="">Todos</option><option value="Residencial">Residencial</option><option value="No residencial">No residencial</option></select></label>'
          +'<label for="bonogasFilterSubtipoBeneficiario">Subtipo de beneficiario<select id="bonogasFilterSubtipoBeneficiario" aria-label="Subtipo de beneficiario"><option value="">Todos</option><option value="Comercial">Comercial</option><option value="Institución pública">Institución pública</option><option value="Industrial">Industrial</option><option value="Otros">Otros</option></select></label>'
          +'<label for="bonogasFilterEmpresa">Empresa instaladora<select id="bonogasFilterEmpresa" aria-label="Empresa instaladora"></select></label>'
          +'<label for="bonogasFilterConcesionaria">Concesionaria<select id="bonogasFilterConcesionaria" aria-label="Concesionaria"></select></label>'
          +'<label for="bonogasFilterFechaDesde">Fecha desde<input type="date" id="bonogasFilterFechaDesde" aria-label="Fecha desde"></label>'
          +'<label for="bonogasFilterFechaHasta">Fecha hasta<input type="date" id="bonogasFilterFechaHasta" aria-label="Fecha hasta"></label>'
        +'</div><button class="btn bonogas-apply-filters-btn" type="button" id="bonogasApplyFiltersBtn">Aplicar filtro</button>';
      mount.innerHTML='';
      mount.appendChild(wrap);
    }
    const f=normalizeBonogasSatFilters(window.bonogasSatFilters||{});
    let opts=getBonogasFilterOptions();
    if(f.distrito&&opts.distritos.indexOf(f.distrito)===-1){
      f.distrito='';
      window.bonogasSatFilters=normalizeBonogasSatFilters(Object.assign({},window.bonogasSatFilters||{},f));
      opts=getBonogasFilterOptions();
    }
    if(f.estrato&&opts.estratos.indexOf(String(f.estrato))===-1){
      f.estrato='';
      window.bonogasSatFilters=normalizeBonogasSatFilters(Object.assign({},window.bonogasSatFilters||{},f));
      opts=getBonogasFilterOptions();
    }
    const departamentoSel=$('#bonogasFilterDepartamento');
    const distritoSel=$('#bonogasFilterDistrito');
    const estratoSel=$('#bonogasFilterEstrato');
    const tipoBeneficiarioSel=$('#bonogasFilterTipoBeneficiario');
    const subtipoBeneficiarioSel=$('#bonogasFilterSubtipoBeneficiario');
    const empresaSel=$('#bonogasFilterEmpresa');
    const concesionariaSel=$('#bonogasFilterConcesionaria');
    const desdeEl=$('#bonogasFilterFechaDesde');
    const hastaEl=$('#bonogasFilterFechaHasta');
    if(departamentoSel){
      departamentoSel.innerHTML='<option value="">Todos</option>'+opts.departamentos.map(function(d){return '<option value="'+esc(d)+'">'+esc(d)+'</option>'}).join('');
      departamentoSel.value=f.departamento||'';
    }
    if(distritoSel){
      distritoSel.innerHTML='<option value="">Todos</option>'+opts.distritos.map(function(d){return '<option value="'+esc(d)+'">'+esc(d)+'</option>'}).join('');
      distritoSel.value=f.distrito||'';
    }
    if(estratoSel){
      estratoSel.innerHTML=bonogasEstratoOptionsHtml(f.estrato||'',opts.estratos);
      estratoSel.value=f.estrato||'';
    }
    if(tipoBeneficiarioSel)tipoBeneficiarioSel.value=f.tipoBeneficiario||'';
    if(subtipoBeneficiarioSel){
      subtipoBeneficiarioSel.value=f.subtipoBeneficiario||'';
      subtipoBeneficiarioSel.disabled=f.tipoBeneficiario==='Residencial';
    }
    if(empresaSel){
      empresaSel.innerHTML='<option value="">Todas</option>'+opts.empresas.map(function(e){return '<option value="'+esc(e)+'">'+esc(e)+'</option>'}).join('');
      empresaSel.value=f.empresaInstaladora||'';
    }
    if(concesionariaSel){
      concesionariaSel.innerHTML='<option value="">Todas</option>'+opts.concesionarias.map(function(c){return '<option value="'+esc(c)+'">'+esc(c)+'</option>'}).join('');
      concesionariaSel.value=f.concesionaria||'';
    }
    if(desdeEl)desdeEl.value=f.fechaDesde||'';
    if(hastaEl)hastaEl.value=f.fechaHasta||'';
    if(!wrap.dataset.bound){
      wrap.dataset.bound='1';
      wrap.addEventListener('change',function(ev){
        const id=ev.target&&ev.target.id;
        if(id==='bonogasFilterDepartamento'){
          const old=window.bonogasSatFilters;
          window.bonogasSatFilters=normalizeBonogasSatFilters(Object.assign({},old,{departamento:ev.target.value,distrito:'',estrato:'',empresaInstaladora:'',concesionaria:'',fechaDesde:'',fechaHasta:''}));
          renderBonogasFiltersPanel();
          applyBonogasFilters();
          return;
        }
        if(id==='bonogasFilterDistrito'){
          const old=window.bonogasSatFilters;
          window.bonogasSatFilters=normalizeBonogasSatFilters(Object.assign({},old,{distrito:ev.target.value,estrato:'',empresaInstaladora:'',concesionaria:'',fechaDesde:'',fechaHasta:''}));
          renderBonogasFiltersPanel();
          applyBonogasFilters();
          return;
        }
        if(id==='bonogasFilterEstrato'){
          applyBonogasFilters();
        }
        if(id==='bonogasFilterTipoBeneficiario'){
          const old=window.bonogasSatFilters;
          window.bonogasSatFilters=normalizeBonogasSatFilters(Object.assign({},old,{tipoBeneficiario:ev.target.value,subtipoBeneficiario:''}));
          renderBonogasFiltersPanel();
          applyBonogasFilters();
        }
        if(id==='bonogasFilterSubtipoBeneficiario')applyBonogasFilters();
      });
      const applyBtn=wrap.querySelector('#bonogasApplyFiltersBtn');
      if(applyBtn)applyBtn.addEventListener('click',function(e){
        e.preventDefault();
        applyBonogasFilters();
        toggleBonogasFiltersPanel(false);
      });
    }
  }
  function renderBonogasEstratoFilters(){renderBonogasFiltersPanel();}

  function bonogasIsLate(r){
    if(!/construcci/i.test(String(r.estadoInstalacion||'')))return false;
    if(r.within===false)return true;
    return bonogasDeadlineDays(r)>=(r.limit||90);
  }
  function bonogasIsWithinConstruction(r){
    return /construcci/i.test(String(r.estadoInstalacion||''))&&!bonogasIsLate(r);
  }

  function bonogasSummarizeRecords(records){
    records=records||[];
    const total=records.length;
    const geoTotal=records.filter(function(r){return !!r._geoJsonGeometry;}).length;
    const conectados=records.filter(function(r){return /Conectado|Liquidado|Pendiente de liquidaci/i.test(r.estadoInstalacion||'');}).length;
    const construccion=records.filter(function(r){return /construcci/i.test(r.estadoInstalacion||'');}).length;
    const penalizados=records.filter(bonogasIsLate).length;
    const dentroPlazo=records.filter(bonogasIsWithinConstruction).length;
    const beneficiarios=records.reduce(function(s,r){return s+(r.beneficiarios||1);},0);
    const liquidacion=records.reduce(function(s,r){return s+(r.liquidacion||0);},0);
    const pendiente=records.reduce(function(s,r){return s+(r.montoPendiente||0);},0);
    return {total:total,conectados:conectados,construccion:construccion,penalizados:penalizados,dentroPlazo:dentroPlazo,beneficiarios:beneficiarios,liquidacion:liquidacion,pendiente:pendiente};
  }

  function updateBonogasAreaSelectionPanel(records,title,extraInfo,stats){
    if(typeof ensureRightPanelVisible==='function')ensureRightPanelVisible();
    const areaLabel=extraInfo||'Area delimitada por utilitario GIS';
    if(typeof updateSelectionPanelHeader==='function')updateSelectionPanelHeader('Selección GIS:',title||'Area seleccionada',areaLabel);
    const generalBox=$('#details');
    const box=$('#supplyDetails');
    if(!box)return;
    if(generalBox){
      generalBox.classList.add('bonogas-general-hidden');
      generalBox.style.display='none';
    }
    box.classList.add('bonogas-record-visible');
    box.style.display='';
    if(!records.length){
      box.className='supply-card empty bonogas-record-visible';
      box.innerHTML='<div class="selection-head"><h3>Informacion de la seleccion</h3><button class="selection-clear" type="button" onclick="clearDrawings()">Limpiar</button></div><p class="supply-hint">No se encontraron suministros BONOGAS dentro del area. Amplie el circulo o poligono sobre los puntos del mapa.</p>';
      return;
    }
    const rowsHtml=records.slice(0,12).map(function(r){
      const bad=bonogasIsLate(r);
      return '<div class="selection-mini"><b>'+esc(r.suministro||'-')+'</b><span>'
        +esc(r.beneficiario||'-')+' · '+esc(r.empresaInstaladora||'-')
        +' · <span class="plazo-alert '+(bad?'bad':'ok')+'">'+(bad?'Fuera de plazo':'Dentro / habilitado')+'</span></span></div>';
    }).join('');
    box.className='supply-card bonogas-record-visible';
    box.innerHTML='<div class="selection-head"><h3>Informacion de la seleccion</h3><button class="selection-clear" type="button" onclick="clearDrawings()">Limpiar</button></div>'
      +'<p class="selection-note">'+esc(title||'Area seleccionada')+' · '+stats.total+' suministros. Revise la tarjeta <b>Control de plazos Art. 25.9</b> debajo para los indicadores del area.</p>'
      +'<div class="selection-list">'+rowsHtml+'</div>';
  }

  function appendBonogasRealtimeSyncCard(host,record){
    if(!host)return;
    host.querySelector('.bonogas-realtime-sync')?.remove();
    const installation=record&&(record.numeroInstalacion||record.numInst||record.nroInstalacion||record.suministro);
    const section=document.createElement('section');
    section.className='bonogas-realtime-sync';
    section.innerHTML='<div class="bonogas-realtime-sync-head"><div><h4>Sincronización en tiempo real</h4><p>BonoGas 2.0 conectado con el Portal de Habilitaciones.</p></div><span class="bonogas-realtime-sync-status">Operativa</span></div>'
      +'<div class="bonogas-realtime-sync-grid">'
      +'<div class="bonogas-realtime-sync-item"><span>Actualización máxima</span><b>Hasta 24 horas</b></div>'
      +'<div class="bonogas-realtime-sync-item"><span>Clave única</span><b>'+(installation?'N° '+esc(installation):'Número de Instalación')+'</b></div>'
      +'<div class="bonogas-realtime-sync-item"><span>Duplicidades</span><b>0 detectadas</b></div>'
      +'<div class="bonogas-realtime-sync-item"><span>Última sincronización</span><b>Hoy · 08:30</b></div>'
      +'</div><p class="bonogas-realtime-sync-foot">API BonoGas 2.0 ↔ Portal de Habilitaciones · Sincronización asíncrona activa</p>';
    host.appendChild(section);
  }

  function renderBonogasProjectBeneficiaryTable(project,records){
    if(!selectedId)return;
    const card=document.querySelector('#details .project-details-card');
    if(!card||!project)return;
    card.classList.add('bonogas-selected-project');
    const repeatedTitle=card.querySelector('.project-details-card-head h3');
    if(repeatedTitle)repeatedTitle.remove();
    const old=card.querySelector('.bonogas-project-beneficiaries');
    if(old)old.remove();
    const rows=(records||[]).filter(function(r){return !r.projectId||r.projectId===project.id;}).slice(0,12);
    if(!rows.length)return;
    const hasDni=rows.some(function(r){const dni=String(r.dni||'').trim();return dni&&dni!=='-'&&!/^0+$/.test(dni);});
    const statusClass=function(r){const state=bonogasLegendState(r);if(state==='Liquidado')return 'liquidado';if(/pendiente/i.test(state))return 'pendiente';if(/fuera/i.test(state))return 'fuera';return 'dentro';};
    const section=document.createElement('section');
    section.className='bonogas-project-beneficiaries';
    section.innerHTML='<h4>Beneficiarios de la agrupación · '+rows.length+' visibles</h4><div class="bonogas-beneficiary-table-wrap"><table class="bonogas-beneficiary-table"><thead><tr><th>Suministro</th><th>Beneficiario</th>'+(hasDni?'<th>DNI</th>':'')+'<th>Estado</th></tr></thead><tbody>'
      +rows.map(function(r){return '<tr><td class="beneficiary-supply">'+esc(r.suministro||'-')+'</td><td class="beneficiary-name">'+esc(r.beneficiario||'-')+'</td>'+(hasDni?'<td>'+esc(r.dni||'-')+'</td>':'')+'<td><span class="bonogas-table-status '+statusClass(r)+'">'+esc(bonogasLegendState(r))+'</span></td></tr>';}).join('')
      +'</tbody></table></div>';
    card.appendChild(section);
    appendBonogasRealtimeSyncCard(card,rows[0]);
  }
  window.renderBonogasProjectBeneficiaryTable=renderBonogasProjectBeneficiaryTable;

  if(typeof renderSupplyDetails==='function'&&!renderSupplyDetails.bonogasPanelSwap){
    const baseRenderSupplyDetails=renderSupplyDetails;
    renderSupplyDetails=function(data){
      const generalBox=$('#details'),recordBox=$('#supplyDetails');
      const main=$('.main'),isBono=!!(main&&main.classList.contains('bonogas-satcontrol-mode'));
      if(isBono&&!data&&typeof window.renderBonogasGeneralPanel==='function'){
        if(generalBox)generalBox.classList.remove('bonogas-general-hidden');
        if(recordBox)recordBox.classList.remove('bonogas-record-visible');
        if(generalBox)generalBox.style.display='';
        window.renderBonogasGeneralPanel();
        if(typeof renderMapTimeline==='function')renderMapTimeline(null);
        return;
      }
      if(isBono&&data){if(generalBox){generalBox.classList.add('bonogas-general-hidden');generalBox.style.display='none';}if(recordBox)recordBox.classList.add('bonogas-record-visible');}
      baseRenderSupplyDetails(data);
      if(isBono&&data&&recordBox){
        recordBox.style.display='';
        const head=recordBox.querySelector('.selection-head');
        if(head&&!head.querySelector('.selection-clear'))head.insertAdjacentHTML('beforeend','<button class="selection-clear" type="button" onclick="clearObjectSelection()">Limpiar</button>');
        appendBonogasRealtimeSyncCard(recordBox,data);
      }
    };
    renderSupplyDetails.bonogasPanelSwap=true;
    window.renderSupplyDetails=renderSupplyDetails;
  }

  function renderBonogasGeneralPanel(){
    const generalPanel=$('#details'),recordPanel=$('#supplyDetails');if(generalPanel)generalPanel.classList.remove('bonogas-general-hidden');if(recordPanel)recordPanel.classList.remove('bonogas-record-visible');
    const allRows=(typeof getBonogasRows==='function'?getBonogasRows():window.currentSupplyRecords||[]).map(function(r,i){return ensureBonogasRecord(r,i);});
    const summary=bonogasSummarizeRecords(allRows);
    const projectCount=Array.isArray(projects)?projects.length:0;
    const projectBeneficiaries=(Array.isArray(projects)?projects:[]).reduce(function(total,p){return total+Number(p.beneficiarios||0);},0);
    const departamentos=new Set((allRows.length?allRows:(Array.isArray(projects)?projects:[])).map(function(r){return r.departamento||r.region||'';}).filter(Boolean)).size;
    const distritos=new Set(allRows.map(function(r){return r.distrito||'';}).filter(Boolean)).size;
    const empresas=new Set(allRows.map(function(r){return r.empresaInstaladora||'';}).filter(Boolean)).size;
    const legendCounts={'Liquidados':0,'Pendientes de liquidación':0,'Dentro de plazo':0,'Fuera de plazo':0};
    allRows.forEach(function(r){let state=bonogasLegendState(r);if(state==='Liquidado')state='Liquidados';if(Object.prototype.hasOwnProperty.call(legendCounts,state))legendCounts[state]++;});
    if(!legendCounts['Pendientes de liquidación']&&summary.conectados>legendCounts.Liquidados){
      legendCounts['Pendientes de liquidación']=summary.conectados-legendCounts.Liquidados;
    }
    const legendTotal=Math.max(1,Object.keys(legendCounts).reduce(function(total,key){return total+legendCounts[key];},0));
    const legendRows=[
      ['Liquidados','#22c55e'],
      ['Pendientes de liquidación','#f59e0b'],
      ['Dentro de plazo','#38a9e8'],
      ['Fuera de plazo','#ef4444']
    ];
    const label=$('#infoContextLabel'),name=$('#infoName'),place=$('#infoPlace'),details=$('#details'),box=$('#supplyDetails');
    if(label)label.textContent='Información general';
    if(name)name.textContent='BONO GAS';
    if(place)place.textContent='Resumen nacional del programa';
    if(details){
      details.style.display='';
      details.className='project-details project-details-bordered';
      details.innerHTML='<div class="project-details-card"><div class="project-status-breakdown project-status-breakdown-compact">'
          +'<div class="project-status-item no-dot"><i aria-hidden="true"></i><span>Registros</span><b>'+(summary.total||projectBeneficiaries)+'</b></div>'
          +'<div class="project-status-item no-dot"><i aria-hidden="true"></i><span>Beneficiarios</span><b>'+(summary.beneficiarios||projectBeneficiaries)+'</b></div>'
          +'<div class="project-status-item no-dot"><i aria-hidden="true"></i><span>Departamentos</span><b>'+departamentos+'</b></div>'
          +'<div class="project-status-item no-dot"><i aria-hidden="true"></i><span>Distritos</span><b>'+distritos+'</b></div>'
          +'<div class="project-status-item no-dot"><i aria-hidden="true"></i><span>Empresas</span><b>'+empresas+'</b></div>'
          +'<div class="project-status-item no-dot"><i aria-hidden="true"></i><span>Iniciativas</span><b>'+projectCount+'</b></div>'
        +'</div>'
        +'<section class="bonogas-general-chart"><h4>Estado de los registros</h4><div class="bonogas-general-bars">'
          +legendRows.map(function(item){const value=legendCounts[item[0]]||0;const pct=Math.round(value*100/legendTotal);return '<div class="bonogas-general-bar"><div class="bonogas-general-bar-head"><span><i style="background:'+item[1]+'"></i>'+item[0]+'</span><b>'+value+' · '+pct+'%</b></div><div class="bonogas-general-track"><span style="width:'+pct+'%;background:'+item[1]+';color:'+item[1]+'"></span></div></div>';}).join('')
        +'</div></section>'
        +'<section class="bonogas-pac-summary"><div class="bonogas-pac-head"><h4>Ejecución PAC 2026</h4><small>65.2% ejecutado</small></div><div class="bonogas-pac-values"><div class="bonogas-pac-value"><span>Asignado</span><b>S/ 12.80 M</b></div><div class="bonogas-pac-value"><span>Ejecutado</span><b>S/ 8.35 M</b></div><div class="bonogas-pac-value saldo"><span>Saldo disponible</span><b>S/ 4.45 M</b></div></div><div class="bonogas-pac-track" title="65.2% ejecutado"><span style="width:65.2%"></span></div></section></div>';
      appendBonogasRealtimeSyncCard(details,null);
    }
    if(box){box.className='supply-card empty';box.innerHTML='';box.style.display='none';}
  }
  window.renderBonogasGeneralPanel=renderBonogasGeneralPanel;

  function updateBonogasMapFilterInfo(records,title,selected){
    if(typeof ensureRightPanelVisible==='function')ensureRightPanelVisible();
    records=(records||[]).map(function(r,i){return ensureBonogasRecord(r,i);});
    const box=$('#supplyDetails');
    if(!box)return;
    const f=normalizeBonogasSatFilters(window.bonogasSatFilters||{});
    const project=selectedId&&typeof currentProject==='function'?currentProject():null;
    const hasFilters=!!(f.departamento||f.distrito||f.estrato||f.empresaInstaladora||f.concesionaria||f.fechaDesde||f.fechaHasta);
    if(!project&&!selected&&!hasFilters){renderBonogasGeneralPanel();return;}
    if(project)renderBonogasProjectBeneficiaryTable(project,records);
    const projectOnly=project&&!selected&&!f.departamento&&!f.distrito&&!f.estrato&&!f.empresaInstaladora&&!f.concesionaria&&!f.fechaDesde&&!f.fechaHasta;
    if(projectOnly){box.className='supply-card empty';box.innerHTML='';box.style.display='none';return;}
    box.style.display='';
    if(!records.length){
      box.className='supply-card empty';
      if(typeof updateSelectionPanelHeader==='function')updateSelectionPanelHeader('Filtro seleccionado:',f.distrito||f.departamento||'Sin resultados','No hay manzanas visibles');
      box.innerHTML='<h3>Filtro seleccionado</h3><p class="supply-hint">No hay manzanas o suministros para la combinación seleccionada. Ajuste Departamento, Distrito o Estrato.</p>';
      return;
    }
    const byEstrato={};
    records.forEach(function(r,i){
      const e=normalizeBonogasEstratoNum(r,r.idx!=null?Number(r.idx)-1:i);
      byEstrato[e]=(byEstrato[e]||0)+1;
    });
    const total=records.length;
    const geoTotal=records.filter(function(r){return !!r._geoJsonGeometry;}).length;
    const sample=selected||records[0];
    const visibleEstratos=Object.keys(byEstrato).sort();
    const chips=visibleEstratos.map(function(e){
      return '<div class="selection-kpi"><span><i style="width:9px;height:9px;border-radius:3px;background:'+BONOGAS_ESTRATO_COLORS[e]+';display:inline-block;margin-right:5px"></i>Estrato '+e+'</span><b>'+Number(byEstrato[e]||0)+'</b></div>';
    }).join('');
    const distritos=Array.from(new Set(records.map(function(r){return r.distrito}).filter(Boolean))).sort();
    let contextTitle=title||'Filtro seleccionado';
    let contextSubtitle=total+' registros visibles';
    if(selected){
      contextTitle='Estrato '+normalizeBonogasEstratoNum(selected,0)+' · Manzana seleccionada';
      contextSubtitle=(selected.departamento||selected.region||'-')+' · '+(selected.distrito||'-');
    }else if(f.estrato){
      contextTitle='Estrato socioeconómico '+f.estrato;
      contextSubtitle=(f.distrito?f.distrito+' · ':'')+(f.departamento||'Ámbito filtrado');
    }else if(f.distrito){
      contextTitle='Distrito seleccionado';
      contextSubtitle=f.distrito+' · '+(f.departamento||sample.departamento||sample.region||'');
    }else if(f.departamento){
      contextTitle='Departamento seleccionado';
      contextSubtitle=f.departamento+' · '+distritos.length+' distritos disponibles';
    }else if(project){
      contextTitle='Agrupación seleccionada';
      contextSubtitle=(project.nombre||'Agrupación')+' · '+(project.departamento||sample.departamento||sample.region||'');
    }
    if(typeof updateSelectionPanelHeader==='function')updateSelectionPanelHeader('Filtro seleccionado:',contextTitle,contextSubtitle);
    const details=[];
    if(project&&!f.departamento&&!f.distrito&&!f.estrato){details.push(['Agrupación',project.nombre||'-']);}
    details.push(['Departamento',f.departamento||sample.departamento||sample.region||'-']);
    if(f.departamento&&!f.distrito)details.push(['Distritos disponibles',String(distritos.length)]);
    if(f.distrito||sample.distrito)details.push(['Distrito',f.distrito||sample.distrito||'-']);
    if(f.estrato||selected)details.push(['Estrato',f.estrato||normalizeBonogasEstratoNum(selected,0)]);
    details.push(['Registros visibles',String(total)]);
    details.push(['Manzanas con geometría real',String(geoTotal)]);
    if(f.empresaInstaladora)details.push(['Empresa instaladora',f.empresaInstaladora]);
    if(f.concesionaria)details.push(['Concesionaria',f.concesionaria]);
    const detailHtml=details.map(function(item){return '<p><span>'+esc(item[0])+':</span> '+esc(item[1])+'</p>';}).join('');
    box.className='supply-card';
    box.innerHTML='<div class="selection-head"><h3>'+esc(contextTitle)+'</h3><button class="selection-clear" type="button" onclick="clearDrawings()">Limpiar</button></div>'
      +'<p class="selection-note">'+esc(contextSubtitle)+'. Manzanas coloreadas por estrato socioeconómico; la leyenda muestra solo los estratos presentes.</p>'
      +'<div class="selection-kpis">'+chips+'</div>'
      +'<div class="project-details" style="margin-top:10px">'
        +detailHtml
      +'</div>';
  }

  function patchBonogasAreaSelection(){
    if(typeof setActiveAreaRecords!=='function'||setActiveAreaRecords.bonogasPatched)return;
    const orig=setActiveAreaRecords;
    setActiveAreaRecords=function(records,title,extraInfo){
      const main=$('.main');
      if(!main||!main.classList.contains('bonogas-satcontrol-mode'))return orig.apply(this,arguments);
      if(typeof clearObjectSelection==='function')clearObjectSelection(false);
      activeAreaRecords=(records||[]).map(function(r,i){return ensureBonogasRecord(r,i);});
      syncActiveAreaRecordsGlobal();
      window.currentSupplyRecords=activeAreaRecords.slice();
      if(typeof currentSupplyRecords!=='undefined')currentSupplyRecords=activeAreaRecords.slice();
      const stats=bonogasSummarizeRecords(activeAreaRecords);
      updateBonogasAreaSelectionPanel(activeAreaRecords,title,extraInfo,stats);
      updateBonogasCorrectionCard(activeAreaRecords,extraInfo||title||'Area seleccionada');
      if(typeof syncPlazoAreaSelectionUi==='function')syncPlazoAreaSelectionUi();
      if(typeof renderDonutChart==='function'){
        renderDonutChart(activeAreaRecords,'plazoConstruccion',title||'Area seleccionada');
      }
    };
    setActiveAreaRecords.bonogasPatched=true;
    window.setActiveAreaRecords=setActiveAreaRecords;
    if(typeof clearDrawings==='function'&&!clearDrawings.bonogasPatched){
      const origClear=clearDrawings;
      clearDrawings=function(){
        const m=$('.main');
        const isBonogas=!!(m&&m.classList.contains('bonogas-satcontrol-mode'));
        if(isBonogas)selectedId=null;
        origClear.apply(this,arguments);
        if(isBonogas){
          if(typeof renderProjects==='function')renderProjects();
          if(typeof window.renderBonogasGeneralPanel==='function')window.renderBonogasGeneralPanel();
          updateBonogasCorrectionCard(getBonogasFilteredRows(),null);
        }
      };
      clearDrawings.bonogasPatched=true;
      window.clearDrawings=clearDrawings;
    }
  }

  function updateBonogasCorrectionCard(rows,selectionLabel){
    const card=$('#bonogasDeadlineCard')||$('.corrections-suite .correction-card');
    if(!card)return;
    rows=(rows||[]).map(function(r,i){
      const d=(typeof normalizeSelectedRecord==='function')?normalizeSelectedRecord(r):r;
      const info=(typeof supplyDeadlineInfo==='function')?supplyDeadlineInfo(d):{days:Number(d.diasConstruccion||0),limit:90,within:Number(d.diasConstruccion||0)<90};
      return ensureBonogasRecord(Object.assign({},d,{days:info.days==null?0:info.days,limit:info.limit||90,within:!!info.within}),i);
    });
    if(!rows.length){
      if(typeof isBonogasSatcontrolView==='function'&&isBonogasSatcontrolView())rows=getBonogasFilteredRows();
      else return;
    }
    const stats=bonogasSummarizeRecords(rows);
    const areaNote=selectionLabel&&rows.length
      ? esc(selectionLabel)+' · '+rows.length+' suministros en el area.'
      : 'Reporte de suministros sin instalacion interna finalizada en plazo mayor o igual a 90 dias calendario.';
    card.innerHTML='<div class="correction-head"><div><h3>Control de plazos Art. 25.9</h3><p>'+areaNote+'</p></div><button class="plazo-art259-info-btn" id="plazoArt259InfoBtn" type="button" title="Ver reporte de suministros" aria-label="Ver reporte de suministros"><svg class="svg-icon" aria-hidden="true"><use href="#i-search"></use></svg></button></div><div class="kpi-strip"><div class="mini-kpi"><span>Fuera de plazo</span><b>'+stats.penalizados+'</b><small>>= 90 dias calendario</small></div><div class="mini-kpi"><span>Dentro de plazo</span><b>'+stats.dentroPlazo+'</b><small>En construccion</small></div><div class="mini-kpi"><span>Habilitados</span><b>'+stats.conectados+'</b><small>Solo referencia estadistica</small></div></div>';
    window.plazoArt259ReportRows=rows.slice();
    window.plazoArt259ReportLabel=selectionLabel||null;
    if(typeof renderPlazoArt259InfoModal==='function')renderPlazoArt259InfoModal(rows,selectionLabel);
    if(typeof window.ensureBonogasStratButtonInDock==='function')setTimeout(window.ensureBonogasStratButtonInDock,0);
    if(selectionLabel&&rows.length){
      if(typeof ensureRightPanelVisible==='function')ensureRightPanelVisible();
      card.scrollIntoView({behavior:'smooth',block:'nearest'});
    }
  }
  function plazoArt259ModalRowHtml(r){
    const inConstruction=/construcci/i.test(String(r.estadoInstalacion||''));
    const late=bonogasIsLate(r);
    const days=bonogasDeadlineDays(r);
    const limit=r.limit||90;
    let plazoLabel,plazoClass;
    if(!inConstruction){
      plazoLabel='Habilitado / no aplica';
      plazoClass='ok';
    }else if(late){
      plazoLabel='Fuera de plazo';
      plazoClass='bad';
    }else{
      plazoLabel='Dentro de plazo';
      plazoClass='ok';
    }
    const fecha=r.fechaRegistroPortal||r.fechaRegistro||r.fecha||'-';
    const diasCell=inConstruction?(days+' / '+limit):'—';
    return '<tr class="'+(late?'plazo-row-late':'')+'"><td><b>'+esc(r.suministro||r.id||'-')+'</b></td><td>'+esc(r.beneficiario||'-')+'</td><td>'+esc(fecha)+'</td><td>'+esc(diasCell)+'</td><td>'+esc(r.estadoInstalacion||'-')+'</td><td><span class="plazo-alert '+plazoClass+'">'+esc(plazoLabel)+'</span></td><td>'+esc(r.empresaInstaladora||'-')+'</td></tr>';
  }

  function renderPlazoArt259InfoModal(rows,selectionLabel){
    const subtitle=$('#plazoArt259InfoSubtitle');
    const tbody=$('#plazoArt259InfoRows');
    const summary=$('#plazoArt259InfoSummary');
    if(!tbody)return;
    rows=(rows||window.plazoArt259ReportRows||[]).slice();
    selectionLabel=selectionLabel!=null?selectionLabel:window.plazoArt259ReportLabel;
    const sorted=rows.slice().sort(function(a,b){
      const la=bonogasIsLate(a)?1:0,lb=bonogasIsLate(b)?1:0;
      if(lb!==la)return lb-la;
      return bonogasDeadlineDays(b)-bonogasDeadlineDays(a);
    });
    const stats=bonogasSummarizeRecords(sorted);
    if(subtitle){
      subtitle.textContent=selectionLabel
        ? selectionLabel+' · '+sorted.length+' suministros en el reporte'
        : 'Reporte de suministros sin instalación interna finalizada en plazo ≥ 90 días desde registro en portal · Art. 25.9';
    }
    if(summary){
      summary.innerHTML='<div class="plazo-art259-kpi"><span>Fuera de plazo</span><b>'+stats.penalizados+'</b></div><div class="plazo-art259-kpi"><span>Dentro de plazo</span><b>'+stats.dentroPlazo+'</b></div><div class="plazo-art259-kpi"><span>Habilitados</span><b>'+stats.conectados+'</b></div><div class="plazo-art259-kpi"><span>Total</span><b>'+stats.total+'</b></div>';
    }
    if(!sorted.length){
      tbody.innerHTML='<tr><td colspan="7">No hay registros en la selección actual. Dibuje un círculo o polígono sobre el mapa.</td></tr>';
      return;
    }
    tbody.innerHTML=sorted.map(plazoArt259ModalRowHtml).join('');
  }
  window.renderPlazoArt259InfoModal=renderPlazoArt259InfoModal;

  window.updatePlazoArt259Card=updateBonogasCorrectionCard;
  window.updateBonogasCorrectionCard=updateBonogasCorrectionCard;
  if(!window.plazoArt259InfoBound){
    window.plazoArt259InfoBound=1;
    document.addEventListener('click',function(e){
      const btn=e.target.closest('#plazoArt259InfoBtn');
      if(!btn)return;
      e.preventDefault();
      e.stopPropagation();
      renderPlazoArt259InfoModal(window.plazoArt259ReportRows,window.plazoArt259ReportLabel);
      if(typeof openModal==='function')openModal('plazoArt259InfoModal');
      else{const modal=document.getElementById('plazoArt259InfoModal');if(modal)modal.classList.add('open');}
    });
  }
  function syncPlazoAreaSelectionUi(){
    const main=typeof qs==='function'?qs('.main'):document.querySelector('.main');
    if(!main)return;
    const rows=(window.activeAreaRecords||[]);
    const hasArea=!!rows.length;
    const showCard=hasArea&&(typeof isMapPlazoCardContext==='function'?isMapPlazoCardContext():false);
    main.classList.toggle('has-plazo-area-selection',showCard);
  }
  window.syncPlazoAreaSelectionUi=syncPlazoAreaSelectionUi;

  function bonogasLegendState(r){
    const s=String(r.estadoInstalacion||r.estado||'').trim();
    if(/^liquidado$/i.test(s)||(/conectado|habil/i.test(s)&&!/pendiente/i.test(s)))return 'Liquidado';
    if(/pendiente.*liquid/i.test(s))return 'Pendiente de liquidación';
    if(/pendiente/i.test(s))return 'Pendiente de liquidación';
    if(/fuera de plazo/i.test(s))return 'Fuera de plazo';
    if(/dentro de plazo/i.test(s))return 'Dentro de plazo';
    if(/construc/i.test(s)){
      const days=bonogasDeadlineDays(r);
      const limit=Number(r.limit)||90;
      return days>=limit||r.within===false?'Fuera de plazo':'Dentro de plazo';
    }
    return s||'Liquidado';
  }

  function bonogasRecordMatchesLayerStates(r){
    const layerStates=(typeof getBeneficiaryLayerStates==='function')?getBeneficiaryLayerStates():{liquidados:true,pendientes:true,dentro:true,fuera:true};
    const state=bonogasLegendState(r);
    return (typeof beneficiaryStateMatchesLayer==='function')?beneficiaryStateMatchesLayer(state,layerStates):true;
  }

  function bonogasHexToRgb(hex){
    const value=String(hex||'#94a3b8').replace('#','').trim();
    const full=value.length===3?value.split('').map(function(c){return c+c;}).join(''):value;
    const n=parseInt(full,16);
    return [n>>16&255,n>>8&255,n&255];
  }

  function bonogasGeometryRings(geometry){
    const rings=[];
    function walk(coords,depth){
      if(!Array.isArray(coords))return;
      if(coords.length&&Array.isArray(coords[0])&&typeof coords[0][0]==='number'){
        rings.push(coords);
        return;
      }
      coords.forEach(function(child){walk(child,(depth||0)+1);});
    }
    walk(geometry&&geometry.coordinates,0);
    return rings.filter(function(r){return r.length>=3;});
  }

  function bonogasRowsForEstratificationPdf(){
    if(Array.isArray(window.__bonogasStratWizardRows)&&window.__bonogasStratWizardRows.length){
      return window.__bonogasStratWizardRows.filter(function(r){return !!r._geoJsonGeometry;});
    }
    const f=normalizeBonogasSatFilters(window.bonogasSatFilters||{});
    let rows=[];
    if(window.activeAreaRecords&&activeAreaRecords.length){
      rows=activeAreaRecords.filter(function(r){return !!r._geoJsonGeometry;});
    }
    if(!rows.length&&(f.departamento||f.distrito||f.estrato)){
      rows=getBonogasFilteredRows().filter(function(r){return !!r._geoJsonGeometry;});
    }
    return rows;
  }

  function bonogasGeoRowsBounds(rows){
    let minLng=Infinity,minLat=Infinity,maxLng=-Infinity,maxLat=-Infinity;
    rows.forEach(function(r){
      bonogasGeometryRings(r._geoJsonGeometry).forEach(function(ring){
        ring.forEach(function(pt){
          const lng=Number(pt[0]),lat=Number(pt[1]);
          if(!Number.isFinite(lng)||!Number.isFinite(lat))return;
          minLng=Math.min(minLng,lng);maxLng=Math.max(maxLng,lng);
          minLat=Math.min(minLat,lat);maxLat=Math.max(maxLat,lat);
        });
      });
    });
    if(!Number.isFinite(minLng))return null;
    return {minLng:minLng,minLat:minLat,maxLng:maxLng,maxLat:maxLat};
  }

  function bonogasDrawGeoRowsOnPdf(doc,rows,box){
    const bounds=bonogasGeoRowsBounds(rows);
    if(!bounds)return;
    const pad=12;
    const spanLng=Math.max(bounds.maxLng-bounds.minLng,0.00001);
    const spanLat=Math.max(bounds.maxLat-bounds.minLat,0.00001);
    const scale=Math.min((box.w-pad*2)/spanLng,(box.h-pad*2)/spanLat);
    const drawW=spanLng*scale,drawH=spanLat*scale;
    const offsetX=box.x+(box.w-drawW)/2;
    const offsetY=box.y+(box.h-drawH)/2;
    function project(pt){
      const lng=Number(pt[0]),lat=Number(pt[1]);
      return [offsetX+(lng-bounds.minLng)*scale,offsetY+(bounds.maxLat-lat)*scale];
    }
    rows.forEach(function(r,i){
      const estrato=normalizeBonogasEstratoNum(r,r.idx!=null?Number(r.idx)-1:i);
      const rgb=bonogasHexToRgb(BONOGAS_ESTRATO_COLORS[estrato]||'#facc15');
      doc.setFillColor(rgb[0],rgb[1],rgb[2]);
      doc.setDrawColor(0,0,0);
      doc.setLineWidth(0.45);
      bonogasGeometryRings(r._geoJsonGeometry).forEach(function(ring){
        const pts=ring.map(project);
        if(pts.length<3)return;
        const vectors=[];
        for(let j=1;j<pts.length;j++)vectors.push([pts[j][0]-pts[j-1][0],pts[j][1]-pts[j-1][1]]);
        doc.lines(vectors,pts[0][0],pts[0][1],[1,1],'FD',true);
      });
    });
  }

  function bonogasDrawGeoRowsOnPdfWithLeafletBounds(doc,rows,box,bounds,options){
    options=options||{};
    if(!bounds||!bounds.isValid||!bounds.isValid())return false;
    const west=bounds.getWest(),east=bounds.getEast(),south=bounds.getSouth(),north=bounds.getNorth();
    const spanLng=Math.max(east-west,0.00001),spanLat=Math.max(north-south,0.00001);
    const visibleRows=(rows||[]).filter(function(r){
      const b=bonogasGeoRowsBounds([r]);
      return b&&b.maxLng>=west&&b.minLng<=east&&b.maxLat>=south&&b.minLat<=north;
    });
    let oldGState=null;
    if(options.opacity&&typeof doc.GState==='function'&&typeof doc.setGState==='function'){
      try{oldGState=new doc.GState({opacity:options.opacity,strokeOpacity:Math.min(1,options.opacity+.22)});doc.setGState(oldGState);}catch(e){}
    }
    function project(pt){
      const lng=Number(pt[0]),lat=Number(pt[1]);
      return [box.x+((lng-west)/spanLng)*box.w,box.y+((north-lat)/spanLat)*box.h];
    }
    visibleRows.forEach(function(r,i){
      const estrato=normalizeBonogasEstratoNum(r,r.idx!=null?Number(r.idx)-1:i);
      const rgb=bonogasHexToRgb(BONOGAS_ESTRATO_COLORS[estrato]||'#facc15');
      doc.setFillColor(rgb[0],rgb[1],rgb[2]);
      doc.setDrawColor(0,0,0);
      doc.setLineWidth(.62);
      bonogasGeometryRings(r._geoJsonGeometry).forEach(function(ring){
        const pts=ring.map(project).filter(function(p){return Number.isFinite(p[0])&&Number.isFinite(p[1]);});
        if(pts.length<3)return;
        const vectors=[];
        for(let j=1;j<pts.length;j++)vectors.push([pts[j][0]-pts[j-1][0],pts[j][1]-pts[j-1][1]]);
        doc.lines(vectors,pts[0][0],pts[0][1],[1,1],'FD',true);
      });
    });
    if(oldGState&&typeof doc.setGState==='function'){
      try{doc.setGState(new doc.GState({opacity:1,strokeOpacity:1}));}catch(e){}
    }
    doc.setDrawColor(0,0,0);
    doc.setLineWidth(options.boundaryWidth||.5);
    visibleRows.forEach(function(r){
      bonogasGeometryRings(r._geoJsonGeometry).forEach(function(ring){
        const pts=ring.map(project).filter(function(p){return Number.isFinite(p[0])&&Number.isFinite(p[1]);});
        if(pts.length<3)return;
        const vectors=[];
        for(let j=1;j<pts.length;j++)vectors.push([pts[j][0]-pts[j-1][0],pts[j][1]-pts[j-1][1]]);
        doc.lines(vectors,pts[0][0],pts[0][1],[1,1],'S',true);
      });
    });
    return true;
  }

  function bonogasDrawFeatureOutlineOnPdfWithLeafletBounds(doc,feature,box,bounds,options){
    options=Object.assign({color:[0,0,0],width:2.6},options||{});
    if(!feature||!feature.geometry||!bounds||!bounds.isValid||!bounds.isValid())return false;
    const west=bounds.getWest(),east=bounds.getEast(),south=bounds.getSouth(),north=bounds.getNorth();
    const spanLng=Math.max(east-west,0.00001),spanLat=Math.max(north-south,0.00001);
    function project(pt){
      const lng=Number(pt[0]),lat=Number(pt[1]);
      return [box.x+((lng-west)/spanLng)*box.w,box.y+((north-lat)/spanLat)*box.h];
    }
    doc.setDrawColor(options.color[0],options.color[1],options.color[2]);
    doc.setLineWidth(options.width);
    bonogasGeometryRings(feature.geometry).forEach(function(ring){
      const pts=ring.map(project).filter(function(p){return Number.isFinite(p[0])&&Number.isFinite(p[1]);});
      if(pts.length<2)return;
      const vectors=[];
      for(let j=1;j<pts.length;j++)vectors.push([pts[j][0]-pts[j-1][0],pts[j][1]-pts[j-1][1]]);
      doc.lines(vectors,pts[0][0],pts[0][1],[1,1],'S',true);
    });
    return true;
  }

  function bonogasPdfOutlinedText(doc,text,x,y,size){
    doc.setFontSize(size||16);
    doc.setTextColor(0,0,0);
    [[-0.9,0], [0.9,0], [0,-0.9], [0,0.9], [-0.7,-0.7], [0.7,-0.7], [-0.7,0.7], [0.7,0.7]].forEach(function(o){
      doc.text(text,x+o[0],y+o[1]);
    });
    doc.setTextColor(255,255,255);
    doc.text(text,x,y);
  }

  async function bonogasCaptureCurrentMapForPdf(){
    try{
      const html2canvasFn=await ensureHtml2Canvas();
      const el=document.getElementById('map')||document.querySelector('.map');
      if(!html2canvasFn||!el)return null;
      if(leafletMap&&leafletMap.invalidateSize)leafletMap.invalidateSize();
      await new Promise(function(resolve){setTimeout(resolve,350);});
      const canvas=await html2canvasFn(el,{useCORS:true,allowTaint:false,backgroundColor:'#d9d5c8',scale:1.35,logging:false});
      return canvas.toDataURL('image/jpeg',0.86);
    }catch(e){return null;}
  }

  function bonogasFitLeafletMapToPdfRows(rows){
    if(typeof L==='undefined'||typeof leafletMap==='undefined'||!leafletMap)return null;
    const geometryRows=(rows||[]).filter(function(r){return !!r._geoJsonGeometry;});
    if(!geometryRows.length)return null;
    let bounds=null;
    geometryRows.forEach(function(r){
      try{
        const b=L.geoJSON({type:'Feature',geometry:r._geoJsonGeometry,properties:{}}).getBounds();
        if(b&&b.isValid&&b.isValid())bounds=bounds?bounds.extend(b):b;
      }catch(e){}
    });
    if(!bounds||!bounds.isValid||!bounds.isValid())return null;
    const previous={center:leafletMap.getCenter(),zoom:leafletMap.getZoom(),bounds:leafletMap.getBounds()};
    try{
      leafletMap.fitBounds(bounds,{padding:[36,36],maxZoom:16.8,animate:false});
      leafletMap.invalidateSize();
      return previous;
    }catch(e){return null;}
  }

  const BONOGAS_ADMIN_GEOJSON_URLS={
    adm0:[
      'assets/geo/natural_earth_countries_50m.geojson'
    ],
    adm1:[
      'assets/geo/peru_departamentos_gadm41.json',
      'https://geodata.ucdavis.edu/gadm/gadm4.1/json/gadm41_PER_1.json'
    ],
    adm3:[
      'assets/geo/peru_distritos_gadm41.json',
      'https://geodata.ucdavis.edu/gadm/gadm4.1/json/gadm41_PER_3.json'
    ]
  };
  const BONOGAS_ADMIN_GEOJSON_CACHE={};
  function bonogasNormName(value){
    return String(value||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[_\-./]+/g,' ').replace(/\s+/g,' ').trim();
  }
  function bonogasCompactName(value){
    return bonogasNormName(value).replace(/\s+/g,'');
  }
  function bonogasAdminName(feature){
    const p=(feature&&feature.properties)||{};
    return p.shapeName||p.shapeName_es||p.NOMBDEP||p.NOMB_DIST||p.DISTRICT||p.ADM1_ES||p.ADM3_ES||p.NAME_3||p.NAME_2||p.NAME_1||p.NAME_EN||p.ADMIN||p.name||p.NAME||p.nombre||'';
  }
  async function bonogasLoadAdminGeoJson(level){
    if(BONOGAS_ADMIN_GEOJSON_CACHE[level])return BONOGAS_ADMIN_GEOJSON_CACHE[level];
    const urls=[].concat(BONOGAS_ADMIN_GEOJSON_URLS[level]||[]);
    const promise=(async function(){
      let lastError=null;
      for(const url of urls){
        try{
          if('caches' in window){
            const cache=await caches.open('bonogas-admin-boundaries-v1');
            const cached=await cache.match(url);
            if(cached)return cached.clone().json();
            const response=await fetch(url,{cache:'force-cache'});
            if(!response.ok)throw new Error('No se pudo cargar límites '+level);
            await cache.put(url,response.clone());
            return response.json();
          }
          const response=await fetch(url,{cache:'force-cache'});
          if(!response.ok)throw new Error('No se pudo cargar límites '+level);
          return response.json();
        }catch(error){lastError=error;}
      }
      throw lastError||new Error('No se pudo cargar límites '+level);
    })();
    BONOGAS_ADMIN_GEOJSON_CACHE[level]=promise;
    return promise;
  }
  function bonogasAdminPropsText(feature){
    const p=(feature&&feature.properties)||{};
    return bonogasNormName(Object.keys(p).map(function(k){return p[k];}).join(' '));
  }
  function bonogasAdminPaletteColor(index){
    const colors=['#e8b7aa','#c8bddf','#d7b98e','#d89ab0','#c8ddec','#d6a4df','#aeb9d8','#e4cfb4','#b7d1c3','#cfa4c7','#d8bddc','#b8c8e4'];
    return colors[Math.abs(index||0)%colors.length];
  }
  function bonogasInsetLabel(text,options){
    options=Object.assign({size:24,color:'#111827',bg:'transparent',shadow:true,weight:900,align:'center'},options||{});
    return L.divIcon({
      className:'',
      html:'<div style="font:'+options.weight+' '+options.size+'px Arial;color:'+options.color+';background:'+options.bg+';padding:2px 8px;border-radius:4px;white-space:nowrap;text-align:'+options.align+';'+(options.shadow?'text-shadow:0 1px 3px #fff;':'')+'">'+text+'</div>',
      iconSize:[260,38],
      iconAnchor:[130,19]
    });
  }
  function bonogasCountryDisplayName(feature){
    const p=(feature&&feature.properties)||{};
    return p.NAME_ES||p.NAME_EN||p.NAME||p.ADMIN||'';
  }
  function bonogasNeighborCountryCollection(admin0){
    const allowed=['peru','ecuador','colombia','brazil','brasil','bolivia','chile'];
    return {type:'FeatureCollection',features:((admin0&&admin0.features)||[]).filter(function(feature){
      return allowed.includes(bonogasNormName(bonogasCountryDisplayName(feature)));
    })};
  }
  function bonogasAddPeruContextLabels(map){
    [
      ['Ecuador',[-2.1,-79.2],24],
      ['Colombia',[0.0,-73.2],22],
      ['Brasil',[-8.3,-68.9],24],
      ['Bolivia',[-16.0,-68.8],24],
      ['Chile',[-18.4,-70.1],23],
      ['OCEANO PACIFICO',[-12.9,-81.1],22]
    ].forEach(function(item){
      L.marker(item[1],{interactive:false,icon:bonogasInsetLabel(item[0],{size:item[2],weight:900})}).addTo(map);
    });
  }
  function bonogasFeatureCenter(feature){
    try{return L.geoJSON(feature).getBounds().getCenter();}catch(e){return null;}
  }
  function bonogasAddDistrictNeighborLabels(map,features,selected){
    const selectedName=bonogasAdminName(selected);
    (features||[]).forEach(function(feature){
      const name=bonogasAdminName(feature);
      if(!name||name===selectedName)return;
      const c=bonogasFeatureCenter(feature);
      if(!c)return;
      const clean=String(name).replace(/([a-z])([A-Z])/g,'$1 $2').toUpperCase();
      L.marker(c,{interactive:false,icon:bonogasInsetLabel(clean,{size:17,weight:800,shadow:false,color:'#111827'})}).addTo(map);
    });
  }
  function bonogasFindAdminFeature(collection,name,parentName){
    const wanted=bonogasNormName(name);
    const aliases={
      'lima':['lima province','limaprovince','lima','provincia de lima','departamento de lima'],
      'la libertad':['la libertad','lalibertad'],
      'arequipa':['arequipa'],
      'trujillo':['trujillo'],
      'cerro colorado':['cerro colorado','cerrocolorado'],
      'san juan de miraflores':['san juan de miraflores','sanjuandemiraflores']
    }[wanted]||[wanted];
    const parent=bonogasNormName(parentName);
    const parentCompact=bonogasCompactName(parentName);
    const features=(collection&&collection.features)||[];
    let candidates=[];
    aliases.some(function(alias){
      const aliasNorm=bonogasNormName(alias);
      const aliasCompact=bonogasCompactName(alias);
      const exactName=features.filter(function(feature){
        const n=bonogasNormName(bonogasAdminName(feature));
        const nc=bonogasCompactName(bonogasAdminName(feature));
        return n===aliasNorm||nc===aliasCompact;
      });
      if(exactName.length){candidates=exactName;return true;}
      const nameContains=features.filter(function(feature){
        const n=bonogasNormName(bonogasAdminName(feature));
        const nc=bonogasCompactName(bonogasAdminName(feature));
        return n.includes(aliasNorm)||nc.includes(aliasCompact);
      });
      if(nameContains.length){candidates=nameContains;return true;}
      candidates=features.filter(function(feature){
        const props=bonogasAdminPropsText(feature);
        const propsCompact=bonogasCompactName(props);
        return props.includes(aliasNorm)||propsCompact.includes(aliasCompact);
      });
      return candidates.length>0;
    });
    if(parent){
      const scoped=candidates.find(function(feature){
        const props=bonogasAdminPropsText(feature),propsCompact=bonogasCompactName(props);
        return props.includes(parent)||propsCompact.includes(parentCompact);
      });
      if(scoped)return scoped;
    }
    return candidates[0]||null;
  }

  async function bonogasCapturePeruLocationMapForPdf(meta){
    try{
      if(typeof L==='undefined')return null;
      const html2canvasFn=await ensureHtml2Canvas();
      if(!html2canvasFn)return null;
      const adm1=await bonogasLoadAdminGeoJson('adm1').catch(function(){return null;});
      const adm3=await bonogasLoadAdminGeoJson('adm3').catch(function(){return null;});
      const adm0=await bonogasLoadAdminGeoJson('adm0').catch(function(){return null;});
      const wrap=document.createElement('div');
      wrap.style.cssText='position:fixed;left:-99999px;top:0;width:900px;height:720px;background:#dbeafe;z-index:-1;';
      const mapDiv=document.createElement('div');
      mapDiv.style.cssText='width:900px;height:720px;background:#cfeefa;';
      wrap.appendChild(mapDiv);
      document.body.appendChild(wrap);
      const mini=L.map(mapDiv,{zoomControl:false,attributionControl:false,fadeAnimation:false,zoomAnimation:false,preferCanvas:true,zoomSnap:.1,zoomDelta:.1}).setView([-9.65,-74.95],5);
      const dept=String(meta&&meta.departamento||'').toLowerCase();
      const districtForDept=(meta&&meta.distrito&&String(meta.distrito)!=='-')?bonogasFindAdminFeature(adm3,meta.distrito,meta.departamento):null;
      const districtAdm1=(districtForDept&&districtForDept.properties&&(districtForDept.properties.NAME_1||districtForDept.properties.ADM1_ES))||'';
      const selected=bonogasFindAdminFeature(adm1,districtAdm1||dept);
      let all=null;
      if(!adm1||!selected){
        mini.remove();
        wrap.remove();
        showToast('No se encontró geometría oficial del departamento para LOCALIZACIÓN.');
        return null;
      }
      let contextLayer=null;
      if(adm0){
        const context=bonogasNeighborCountryCollection(adm0);
        contextLayer=L.geoJSON(context,{
          interactive:false,
          style:function(feature){
            const n=bonogasNormName(bonogasCountryDisplayName(feature));
            return {color:'#5f6260',weight:n==='peru'?1.45:1.15,fillColor:n==='peru'?'#f7f5e8':'#eef7f3',fillOpacity:n==='peru'?.42:.78};
          }
        }).addTo(mini);
      }
      if(adm1){
        all=L.geoJSON(adm1,{
          interactive:false,
          style:function(feature){
            const isSelected=selected&&bonogasAdminName(feature)===bonogasAdminName(selected);
            const idx=((adm1.features||[]).indexOf(feature));
            return {color:'#5f6260',weight:isSelected?2.4:1.05,opacity:1,fillColor:isSelected?'#ef0000':bonogasAdminPaletteColor(idx),fillOpacity:isSelected?.95:.82};
          }
        }).addTo(mini);
      }
      const selLayer=L.geoJSON(selected,{interactive:false,style:{color:'#ffffff',weight:2.8,fillColor:'#ef0000',fillOpacity:.98}}).addTo(mini);
      const center=selLayer.getBounds().getCenter();
      const displayDept=String(meta.departamento||districtAdm1||'').replace(/Province$/,'');
      L.marker(center,{interactive:false,icon:bonogasInsetLabel(displayDept.toUpperCase(),{size:25,bg:'rgba(255,255,255,.82)'})}).addTo(mini);
      bonogasAddPeruContextLabels(mini);
      try{
        if(contextLayer){
          const zoomBounds=L.latLngBounds([[-19.8,-82.8],[1.7,-66.2]]);
          mini.fitBounds(zoomBounds,{padding:[0,0],animate:false});
          mini.setZoom(mini.getZoom()+.45,{animate:false});
        }else if(all){
          mini.fitBounds(all.getBounds(),{padding:[0,0],animate:false});
          mini.setZoom(mini.getZoom()+.45,{animate:false});
        }
      }catch(e){}
      await new Promise(function(resolve){setTimeout(resolve,1100);});
      mini.invalidateSize();
      const canvas=await html2canvasFn(wrap,{useCORS:true,allowTaint:false,backgroundColor:'#cfeefa',scale:1,logging:false});
      mini.remove();
      wrap.remove();
      return canvas.toDataURL('image/png');
    }catch(e){return null;}
  }

  async function bonogasCaptureDistrictLocationMapForPdf(meta){
    try{
      if(typeof L==='undefined')return null;
      const html2canvasFn=await ensureHtml2Canvas();
      if(!html2canvasFn)return null;
      const adm3=await bonogasLoadAdminGeoJson('adm3').catch(function(){return null;});
      const wrap=document.createElement('div');
      wrap.style.cssText='position:fixed;left:-99999px;top:0;width:900px;height:560px;background:#f8fafc;z-index:-1;';
      const mapDiv=document.createElement('div');
      mapDiv.style.cssText='width:900px;height:560px;background:#ef0000;';
      wrap.appendChild(mapDiv);
      document.body.appendChild(wrap);
      const dept=String(meta&&meta.departamento||'').toLowerCase();
      const dist=String(meta&&meta.distrito||'').toLowerCase();
      let center=[-12.1636,-76.9630],zoom=11,label=String(meta&&meta.distrito||'SAN JUAN DE MIRAFLORES').toUpperCase();
      if(/libertad/.test(dept)||/trujillo/.test(dist)){center=[-8.1116,-79.0288];zoom=11;label='TRUJILLO';}
      else if(/arequipa/.test(dept)||/cerro/.test(dist)){center=[-16.376,-71.574];zoom=11;label='CERRO COLORADO';}
      const mini=L.map(mapDiv,{zoomControl:false,attributionControl:false,fadeAnimation:false,zoomAnimation:false,preferCanvas:true,zoomSnap:.1,zoomDelta:.1}).setView(center,zoom);
      if(/libertad|trujillo|lima|miraflores|callao/.test(dept+' '+dist)){
        L.rectangle([[-90,-180],[90,-79.05]],{interactive:false,color:'#8ecae6',weight:0,fillColor:'#8ecae6',fillOpacity:1}).addTo(mini);
        L.marker([-8.15,-79.18],{interactive:false,icon:bonogasInsetLabel('OCEANO PACIFICO',{size:24,weight:900,shadow:false,color:'#0f172a'})}).addTo(mini);
      }
      const selected=bonogasFindAdminFeature(adm3,label,dept);
      let selectedBounds=null;
      if(!adm3||!selected){
        mini.remove();
        wrap.remove();
        showToast('No se encontró geometría oficial del distrito para UBICACIÓN.');
        return null;
      }
      selectedBounds=L.geoJSON(selected).getBounds();
      const nearby=(adm3.features||[]).filter(function(feature){
        try{return L.geoJSON(feature).getBounds().intersects(selectedBounds.pad(1.25));}catch(e){return false;}
      });
      L.geoJSON({type:'FeatureCollection',features:nearby},{interactive:false,style:function(feature){
        const isSelected=bonogasAdminName(feature)===bonogasAdminName(selected);
        return {color:'#111827',weight:isSelected?2.6:1.1,fillColor:isSelected?'#fff200':'#ef0000',fillOpacity:isSelected?.98:.96};
      }}).addTo(mini);
      bonogasAddDistrictNeighborLabels(mini,nearby,selected);
      const selLayer=L.geoJSON(selected,{interactive:false,style:{color:'#111827',weight:3,fillColor:'#fff200',fillOpacity:1}}).addTo(mini);
      center=selLayer.getBounds().getCenter();
      mini.fitBounds(selLayer.getBounds().pad(.42),{animate:false});
      mini.panTo(center,{animate:false});
      try{mini.setZoom(Math.min(mini.getZoom()+.35,15.8),{animate:false});}catch(e){}
      L.marker(center,{interactive:false,icon:L.divIcon({className:'',html:'<div style="font:900 28px Arial;color:#0f172a;background:rgba(224,247,250,.92);border:2px solid #67e8f9;padding:4px 12px;border-radius:4px;white-space:nowrap">'+label+'</div>',iconSize:[330,44],iconAnchor:[165,22]})}).addTo(mini);
      await new Promise(function(resolve){setTimeout(resolve,1100);});
      mini.invalidateSize();
      const canvas=await html2canvasFn(wrap,{useCORS:true,allowTaint:false,backgroundColor:'#ef0000',scale:1,logging:false});
      mini.remove();
      wrap.remove();
      return canvas.toDataURL('image/png');
    }catch(e){return null;}
  }

  function bonogasPdfMeta(rows){
    const f=normalizeBonogasSatFilters(window.bonogasSatFilters||{});
    const wizard=window.__bonogasStratWizardState||{};
    const sample=rows[0]||{};
    const departamento=wizard.departamento||f.departamento||sample.departamento||sample.region||'';
    const distrito=f.distrito||sample.distrito||'';
    const provincia=wizard.provincia||sample.provincia||(departamento==='Lima'?'Lima':departamento==='Arequipa'?'Arequipa':departamento==='La Libertad'?'Trujillo':'');
    const concesionaria=sample.concesionaria||'Quavii / Geoportal';
    const zona=distrito||departamento||'Ambito filtrado';
    const potencial=rows.reduce(function(sum,r){return sum+Number(r.predios||r.Numero_predios||r.habilitados||1);},0);
    return {departamento:departamento||'-',provincia:provincia||'-',distrito:distrito||'-',concesionaria:concesionaria,zona:zona,potencial:potencial};
  }

  function bonogasEstratoSummary(rows){
    const total=Math.max(rows.length,1),map={};
    rows.forEach(function(r,i){
      const e=normalizeBonogasEstratoNum(r,r.idx!=null?Number(r.idx)-1:i);
      map[e]=(map[e]||0)+1;
    });
    return Object.keys(map).sort().map(function(e){return {estrato:e,label:bonogasEstratoLabel(e),count:map[e],pct:Math.round((map[e]/total)*100)};});
  }

  function bonogasWizardCleanLabel(value){
    return String(value||'').replace(/([a-z])([A-Z])/g,'$1 $2').replace(/Province$/i,'').replace(/\s+/g,' ').trim();
  }

  function ensureBonogasStratButtonInDock(){
    const main=typeof qs==='function'?qs('.main'):document.querySelector('.main');
    const inBonogas=!!(main&&(main.classList.contains('bonogas-satcontrol-mode')||main.classList.contains('bonogas-active')));
    document.querySelectorAll('.project-utils-dock #bonogasEstratificationMapPdfBtn,.bonogas-map-utils #bonogasEstratificationMapPdfBtn').forEach(function(btn){btn.remove();});
    if(!inBonogas){
      document.querySelectorAll('#bonogasEstratificationMapPdfBtn,.bonogas-strat-right-actions').forEach(function(el){el.remove();});
      return;
    }
    const panel=document.querySelector('.main.bonogas-satcontrol-mode .info-panel')||document.querySelector('.info-panel');
    if(!panel)return;
    const exportBtn=panel.querySelector('#exportExcelBtn,.export-excel-btn')||Array.from(panel.querySelectorAll('button')).find(function(btn){
      const text=(btn.textContent||btn.title||btn.getAttribute('aria-label')||'').toLowerCase();
      return text.indexOf('exportar')>-1;
    });
    let holder=panel.querySelector('.bonogas-strat-right-actions');
    let btn=panel.querySelector('#bonogasEstratificationMapPdfBtn');
    if(!holder){
      holder=document.createElement('div');
      holder.className='bonogas-strat-right-actions';
    }
    if(!btn){
      btn=document.createElement('button');
      btn.type='button';
      btn.id='bonogasEstratificationMapPdfBtn';
      btn.className='export-excel-btn bonogas-strat-panel-btn';
      btn.title='Generar mapa de estratificación';
      btn.setAttribute('aria-label','Generar mapa de estratificación');
      btn.innerHTML='<svg class="svg-icon" aria-hidden="true"><use href="#i-file-text"></use></svg> Generar mapa de estratificación';
    }
    if(btn.parentElement!==holder)holder.appendChild(btn);
    if(exportBtn){
      const anchor=exportBtn.closest('.stats')&&exportBtn.parentElement===exportBtn.closest('.stats')?exportBtn:exportBtn;
      if(anchor.nextElementSibling!==holder)anchor.insertAdjacentElement('afterend',holder);
    }else{
      (panel.querySelector('.stats')||panel).appendChild(holder);
    }
  }
  window.ensureBonogasStratButtonInDock=ensureBonogasStratButtonInDock;

  function bonogasWizardRowMatches(row,state){
    state=state||{};
    if(state.departamento&&bonogasNormName(row.departamento||row.region)!==bonogasNormName(state.departamento))return false;
    if(state.provincia&&bonogasNormName(row.provincia)!==bonogasNormName(state.provincia))return false;
    if(state.estrato&&normalizeBonogasEstratoNum(row,row.idx!=null?Number(row.idx)-1:0)!==state.estrato)return false;
    if(state.empresaInstaladora&&(row.empresaInstaladora||'Sin empresa')!==state.empresaInstaladora)return false;
    if(state.concesionaria&&(row.concesionaria||'')!==state.concesionaria)return false;
    if(state.fechaDesde||state.fechaHasta){
      const d=bonogasRecordFullDate(row);
      if(!d)return false;
      if(state.fechaDesde&&d<state.fechaDesde)return false;
      if(state.fechaHasta&&d>state.fechaHasta)return false;
    }
    return true;
  }

  function bonogasWizardRows(){
    const state=window.__bonogasStratWizardState||{};
    if(!state.departamento)return [];
    return (bonogasRealManzanaRows||[]).filter(function(row){return bonogasWizardRowMatches(row,state);});
  }

  function bonogasWizardEnsureStyles(){
    if(document.getElementById('bonogasStratWizardStyles'))return;
    const style=document.createElement('style');
    style.id='bonogasStratWizardStyles';
    style.textContent=[
      '.bonogas-strat-wizard-overlay{position:fixed;inset:0;z-index:5000;background:rgba(2,6,23,.72);display:grid;place-items:center;padding:18px;backdrop-filter:blur(8px)}',
      '.bonogas-strat-wizard{width:min(1180px,96vw);height:min(780px,92vh);display:grid;grid-template-rows:auto 1fr auto;background:#111a31;border:1px solid #34507b;border-radius:24px;box-shadow:0 28px 90px rgba(0,0,0,.55);overflow:hidden;color:#f8fbff}',
      '.bonogas-strat-wizard-head{display:flex;justify-content:space-between;align-items:flex-start;gap:14px;padding:18px 20px;border-bottom:1px solid rgba(148,163,184,.22);background:linear-gradient(135deg,#17233f,#111a31)}',
      '.bonogas-strat-wizard-head h2{margin:0;font-size:21px;font-weight:950}.bonogas-strat-wizard-head p{margin:5px 0 0;color:#a9bad6;font-size:12px;font-weight:800}',
      '.bonogas-strat-wizard-close{border:0;border-radius:14px;background:#0d1630;color:#fff;width:42px;height:42px;font-size:24px;font-weight:950}',
      '.bonogas-strat-wizard-body{min-height:0;display:grid;grid-template-columns:1.2fr .8fr;gap:14px;padding:14px;overflow:hidden}',
      '.bonogas-strat-card{min-height:0;background:#0d1630;border:1px solid #294267;border-radius:18px;padding:14px;overflow:auto}.bonogas-strat-card h3{margin:0 0 10px;font-size:14px;color:#67e8f9;font-weight:950}',
      '.bonogas-strat-map{height:330px;border-radius:16px;overflow:hidden;border:1px solid #31517c;background:#0b1328}.bonogas-strat-breadcrumb{margin:10px 0;padding:10px 12px;border-radius:12px;background:#17233f;color:#dbeafe;font-size:12px;font-weight:900}',
      '.bonogas-strat-province-row{display:grid;grid-template-columns:130px 1fr;gap:10px;align-items:center;color:#cbd5e1;font-size:12px;font-weight:850}.bonogas-strat-province-row select,.bonogas-strat-filter-grid select,.bonogas-strat-filter-grid input{height:38px;border:1px solid #36527b;background:#111a31;color:#fff;border-radius:12px;padding:0 10px;font-weight:850}',
      '.bonogas-strat-filter-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.bonogas-strat-filter-grid label{display:grid;gap:5px;color:#cbd5e1;font-size:11px;font-weight:900}',
      '.bonogas-strat-actions{display:flex;gap:10px;margin-top:12px}.bonogas-strat-actions button,.bonogas-strat-foot button{border:0;border-radius:13px;padding:10px 14px;font-weight:950}.bonogas-strat-clear{background:#17233f;color:#dbeafe}.bonogas-strat-apply{background:#0ea5e9;color:#fff}',
      '.bonogas-strat-preview-box{display:grid;gap:10px}.bonogas-strat-count{font-size:32px;font-weight:950;color:#fff}.bonogas-strat-summary{border:1px solid #294267;border-radius:14px;background:#111a31;padding:12px;color:#cbd5e1;font-size:12px;font-weight:850;line-height:1.55}',
      '.bonogas-strat-preview-map{height:220px;border-radius:14px;overflow:hidden;border:1px solid #31517c;background:#0b1328}.bonogas-strat-status{min-height:22px;color:#86efac;font-size:12px;font-weight:900}',
      '.bonogas-strat-foot{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 18px;border-top:1px solid rgba(148,163,184,.22);background:#0d1630}.bonogas-strat-pdf{background:linear-gradient(135deg,#0ea5e9,#22c55e);color:#fff}.bonogas-strat-secondary{background:#17233f;color:#dbeafe}'
    ].join('');
    document.head.appendChild(style);
  }

  function bonogasOpenEstratificationWizard(){
    bonogasWizardEnsureStyles();
    if(!bonogasRealManzanasLoaded){
      showToast('Cargando manzanas urbanas...');
      bonogasLoadRealManzanas().then(bonogasOpenEstratificationWizard);
      return;
    }
    window.__bonogasStratWizardState={departamento:'',provincia:'',estrato:'',empresaInstaladora:'',concesionaria:'',fechaDesde:'',fechaHasta:''};
    window.__bonogasStratWizardRows=[];
    const old=document.getElementById('bonogasStratWizardOverlay');
    if(old)old.remove();
    const overlay=document.createElement('div');
    overlay.id='bonogasStratWizardOverlay';
    overlay.className='bonogas-strat-wizard-overlay';
    overlay.innerHTML=
      '<div class="bonogas-strat-wizard" role="dialog" aria-modal="true" aria-label="Generar mapa de estratificación">'
        +'<div class="bonogas-strat-wizard-head"><div><h2>Generar mapa de estratificación</h2><p>Seleccione ubicación, revise filtros y genere el PDF con el formato actual.</p></div><button class="bonogas-strat-wizard-close" type="button" data-close>×</button></div>'
        +'<div class="bonogas-strat-wizard-body">'
          +'<section class="bonogas-strat-card"><h3>Selección de ubicación</h3><div id="bonogasStratWizardMap" class="bonogas-strat-map"></div><div id="bonogasStratBreadcrumb" class="bonogas-strat-breadcrumb">Perú</div><div class="bonogas-strat-province-row"><span>Provincia</span><select id="bonogasStratProvinceSelect"><option value="">Seleccione departamento</option></select></div></section>'
          +'<section class="bonogas-strat-card"><h3>Filtros opcionales</h3><div class="bonogas-strat-filter-grid">'
            +'<label>Estrato<select id="bonogasWizardEstrato"><option value="">Todas</option>'+[1,2,3,4,5].map(function(n){return '<option value="'+n+'">'+n+' · '+bonogasEstratoLabel(String(n))+'</option>';}).join('')+'</select></label>'
            +'<label>Empresa instaladora<select id="bonogasWizardEmpresa"><option value="">Todas</option></select></label>'
            +'<label>Concesionaria<select id="bonogasWizardConcesionaria"><option value="">Todas</option></select></label>'
            +'<label>Fecha desde<input id="bonogasWizardFechaDesde" type="date"></label>'
            +'<label>Fecha hasta<input id="bonogasWizardFechaHasta" type="date"></label>'
          +'</div><div class="bonogas-strat-actions"><button class="bonogas-strat-clear" id="bonogasWizardClear" type="button">Limpiar</button><button class="bonogas-strat-apply" id="bonogasWizardApply" type="button">Aplicar filtros</button></div>'
          +'<h3 style="margin-top:16px">Vista previa</h3><div class="bonogas-strat-preview-box"><div><span class="bonogas-strat-count" id="bonogasWizardCount">0</span><span style="color:#a9bad6;font-weight:900"> registros encontrados</span></div><div class="bonogas-strat-summary" id="bonogasWizardSummary">Seleccione un departamento en el mapa.</div><div id="bonogasWizardPreviewMap" class="bonogas-strat-preview-map"></div><div id="bonogasWizardStatus" class="bonogas-strat-status"></div></div></section>'
        +'</div><div class="bonogas-strat-foot"><span style="color:#a9bad6;font-size:12px;font-weight:850">El PDF conserva mapa grande, LOCALIZACIÓN, UBICACIÓN y ficha.</span><div><button class="bonogas-strat-secondary" type="button" data-close>Cerrar modal</button> <button class="bonogas-strat-pdf" id="bonogasWizardGeneratePdf" type="button">📄 Generar PDF</button></div></div>'
      +'</div>';
    document.body.appendChild(overlay);
    overlay.addEventListener('click',function(e){if(e.target===overlay||e.target.closest('[data-close]'))overlay.remove();});
    bonogasInitEstratificationWizardMaps();
    bonogasWizardRefreshOptions();
    bonogasWizardRefreshPreview();
    overlay.querySelector('#bonogasStratProvinceSelect').addEventListener('change',function(e){window.__bonogasStratWizardState.provincia=e.target.value;bonogasWizardRefreshPreview();});
    ['bonogasWizardEstrato','bonogasWizardEmpresa','bonogasWizardConcesionaria','bonogasWizardFechaDesde','bonogasWizardFechaHasta'].forEach(function(id){
      const el=overlay.querySelector('#'+id);
      if(el)el.addEventListener('change',function(){bonogasWizardReadFilters();});
    });
    overlay.querySelector('#bonogasWizardApply').addEventListener('click',function(){bonogasWizardReadFilters();bonogasWizardRefreshPreview();showToast('Filtros aplicados');});
    overlay.querySelector('#bonogasWizardClear').addEventListener('click',function(){window.__bonogasStratWizardState={departamento:'',provincia:'',estrato:'',empresaInstaladora:'',concesionaria:'',fechaDesde:'',fechaHasta:''};window.__bonogasStratWizardRows=[];bonogasWizardRefreshOptions();bonogasWizardRefreshPreview();bonogasInitEstratificationWizardMaps(true);});
    overlay.querySelector('#bonogasWizardGeneratePdf').addEventListener('click',async function(){
      bonogasWizardReadFilters();
      if(!(window.__bonogasStratWizardState&&window.__bonogasStratWizardState.departamento)){
        showToast('Seleccione primero un departamento en el mapa');
        return;
      }
      const rows=bonogasWizardRows();
      if(!rows.length){showToast('No hay registros para generar el PDF');return;}
      window.__bonogasStratWizardRows=rows;
      const st=overlay.querySelector('#bonogasWizardStatus');
      if(st)st.textContent='Generando PDF...';
      this.disabled=true;
      await exportBonogasEstratificationMapPdf();
      this.disabled=false;
      if(st)st.textContent='✅ PDF generado correctamente';
    });
  }

  function bonogasWizardReadFilters(){
    const root=document.getElementById('bonogasStratWizardOverlay');
    if(!root)return;
    const s=window.__bonogasStratWizardState||{};
    s.estrato=(root.querySelector('#bonogasWizardEstrato')||{}).value||'';
    s.empresaInstaladora=(root.querySelector('#bonogasWizardEmpresa')||{}).value||'';
    s.concesionaria=(root.querySelector('#bonogasWizardConcesionaria')||{}).value||'';
    s.fechaDesde=(root.querySelector('#bonogasWizardFechaDesde')||{}).value||'';
    s.fechaHasta=(root.querySelector('#bonogasWizardFechaHasta')||{}).value||'';
    window.__bonogasStratWizardState=s;
  }

  function bonogasWizardRefreshOptions(){
    const root=document.getElementById('bonogasStratWizardOverlay');
    if(!root)return;
    const state=window.__bonogasStratWizardState||{};
    const rows=(bonogasRealManzanaRows||[]).filter(function(r){return (!state.departamento||bonogasNormName(r.departamento)===bonogasNormName(state.departamento))&&(!state.provincia||bonogasNormName(r.provincia)===bonogasNormName(state.provincia));});
    const fill=function(sel,all,values){const el=root.querySelector(sel);if(!el)return;el.innerHTML='<option value="">'+all+'</option>'+Array.from(new Set(values.filter(Boolean))).sort().map(function(v){return '<option value="'+esc(v)+'">'+esc(v)+'</option>';}).join('');};
    fill('#bonogasWizardEmpresa','Todas',rows.map(function(r){return r.empresaInstaladora||'Sin empresa';}));
    fill('#bonogasWizardConcesionaria','Todas',rows.map(function(r){return r.concesionaria;}));
  }

  function bonogasWizardRefreshPreview(){
    const root=document.getElementById('bonogasStratWizardOverlay');
    if(!root)return;
    const state=window.__bonogasStratWizardState||{};
    const rows=bonogasWizardRows();
    window.__bonogasStratWizardRows=rows;
    const bc=['Perú'];
    if(state.departamento)bc.push(state.departamento);
    if(state.provincia)bc.push(state.provincia);
    const bcEl=root.querySelector('#bonogasStratBreadcrumb');
    if(bcEl)bcEl.textContent=bc.join(' > ');
    const count=root.querySelector('#bonogasWizardCount');
    if(count)count.textContent=String(rows.length);
    const summary=root.querySelector('#bonogasWizardSummary');
    if(summary)summary.innerHTML='Ubicación: <b>'+esc(bc.join(' > '))+'</b><br>Estrato: <b>'+esc(state.estrato?bonogasEstratoLabel(state.estrato):'Todas')+'</b><br>Empresa: <b>'+esc(state.empresaInstaladora||'Todas')+'</b><br>Concesionaria: <b>'+esc(state.concesionaria||'Todas')+'</b><br>Fechas: <b>'+esc(bonogasFechaRangeLabel(state.fechaDesde,state.fechaHasta))+'</b>';
    bonogasWizardRenderPreviewMap(rows);
  }

  function bonogasWizardProvinceOptions(deptName,adm3){
    const deptNorm=bonogasCompactName(deptName);
    return Array.from(new Set(((adm3&&adm3.features)||[]).filter(function(f){
      const p=f.properties||{};
      return bonogasCompactName(p.NAME_1||p.shapeGroup||'')===deptNorm||bonogasCompactName(bonogasWizardCleanLabel(p.NAME_1||''))===deptNorm;
    }).map(function(f){return bonogasWizardCleanLabel((f.properties||{}).NAME_2||'');}).filter(Boolean))).sort();
  }

  function bonogasInitEstratificationWizardMaps(reset){
    const mapEl=document.getElementById('bonogasStratWizardMap');
    if(!mapEl||typeof L==='undefined')return;
    if(window.__bonogasStratWizardMap&&!reset){setTimeout(function(){try{window.__bonogasStratWizardMap.invalidateSize();}catch(e){}},80);return;}
    if(window.__bonogasStratWizardMap){try{window.__bonogasStratWizardMap.remove();}catch(e){}}
    const map=L.map(mapEl,{zoomControl:true,attributionControl:false}).setView([-9.19,-75.02],5);
    window.__bonogasStratWizardMap=map;
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:12}).addTo(map);
    Promise.all([bonogasLoadAdminGeoJson('adm1'),bonogasLoadAdminGeoJson('adm3')]).then(function(data){
      const adm1=data[0],adm3=data[1];
      L.geoJSON(adm1,{style:function(f){const name=bonogasWizardCleanLabel(bonogasAdminName(f));const selected=bonogasNormName(name)===bonogasNormName((window.__bonogasStratWizardState||{}).departamento);return {color:selected?'#67e8f9':'#1e293b',weight:selected?3:1,fillColor:selected?'#0ea5e9':'#94a3b8',fillOpacity:selected?.42:.16};},onEachFeature:function(f,layer){
        const raw=bonogasAdminName(f);
        const name=bonogasWizardCleanLabel(raw);
        layer.bindTooltip(name,{sticky:true});
        layer.on('click',function(){
          window.__bonogasStratWizardState=Object.assign({},window.__bonogasStratWizardState||{},{departamento:name,provincia:''});
          const provs=bonogasWizardProvinceOptions(raw,adm3).concat(bonogasWizardProvinceOptions(name,adm3));
          const unique=Array.from(new Set(provs));
          const sel=document.getElementById('bonogasStratProvinceSelect');
          if(sel)sel.innerHTML='<option value="">Todas las provincias</option>'+unique.map(function(p){return '<option value="'+esc(p)+'">'+esc(p)+'</option>';}).join('');
          bonogasWizardRefreshOptions();
          bonogasWizardRefreshPreview();
          map.eachLayer(function(l){if(l.setStyle&&l.feature)l.setStyle({color:'#1e293b',weight:1,fillColor:'#94a3b8',fillOpacity:.16});});
          layer.setStyle({color:'#67e8f9',weight:3,fillColor:'#0ea5e9',fillOpacity:.42});
          try{map.fitBounds(layer.getBounds(),{padding:[20,20],maxZoom:7});}catch(e){}
        });
      }}).addTo(map);
      setTimeout(function(){try{map.invalidateSize();}catch(e){}},80);
    });
  }

  function bonogasWizardRenderPreviewMap(rows){
    const el=document.getElementById('bonogasWizardPreviewMap');
    if(!el||typeof L==='undefined')return;
    if(window.__bonogasStratPreviewMap){try{window.__bonogasStratPreviewMap.remove();}catch(e){}}
    const map=L.map(el,{zoomControl:false,attributionControl:false,interactive:false}).setView([-9.19,-75.02],5);
    window.__bonogasStratPreviewMap=map;
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:16}).addTo(map);
    const layer=L.layerGroup().addTo(map);
    (rows||[]).slice(0,180).forEach(function(r,i){
      if(!r._geoJsonGeometry)return;
      const e=normalizeBonogasEstratoNum(r,r.idx!=null?Number(r.idx)-1:i);
      L.geoJSON({type:'Feature',geometry:r._geoJsonGeometry,properties:{}},{style:{color:'#111827',weight:.6,fillColor:BONOGAS_ESTRATO_COLORS[e]||'#ffeb3b',fillOpacity:.78}}).addTo(layer);
    });
    try{if(layer.getLayers().length)map.fitBounds(layer.getBounds(),{padding:[12,12],maxZoom:14});}catch(e){}
    setTimeout(function(){try{map.invalidateSize();}catch(e){}},80);
  }

  function bonogasDrawPdfNorthArrow(doc,x,y,size){
    doc.setDrawColor(0,0,0);doc.setFillColor(255,255,255);doc.rect(x,y,size,size*1.45,'FD');
    doc.setFontSize(18);doc.setTextColor(0,0,0);doc.text('N',x+size/2,y+15,{align:'center'});
    doc.setFillColor(0,0,0);doc.triangle(x+size/2,y+24,x+7,y+size*1.32,x+size-7,y+size*1.32,'F');
    doc.setFillColor(255,255,255);doc.triangle(x+size/2,y+34,x+size/2-6,y+size*1.05,x+size/2+6,y+size*1.05,'F');
  }

  function bonogasPeruLocationMapImage(meta){
    try{
      const canvas=document.createElement('canvas');
      canvas.width=900;canvas.height=720;
      const ctx=canvas.getContext('2d');
      ctx.fillStyle='#cfeefa';ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.strokeStyle='rgba(80,98,105,.42)';ctx.lineWidth=1;
      for(let xg=0;xg<=canvas.width;xg+=150){ctx.beginPath();ctx.moveTo(xg,0);ctx.lineTo(xg,canvas.height);ctx.stroke();}
      for(let yg=0;yg<=canvas.height;yg+=150){ctx.beginPath();ctx.moveTo(0,yg);ctx.lineTo(canvas.width,yg);ctx.stroke();}
      ctx.fillStyle='#eef7f3';
      ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(312,0);ctx.lineTo(260,122);ctx.lineTo(190,220);ctx.lineTo(175,338);ctx.lineTo(225,493);ctx.lineTo(292,720);ctx.lineTo(0,720);ctx.closePath();ctx.fill();
      ctx.beginPath();ctx.moveTo(523,0);ctx.lineTo(900,0);ctx.lineTo(900,720);ctx.lineTo(620,720);ctx.lineTo(670,542);ctx.lineTo(618,424);ctx.lineTo(680,315);ctx.lineTo(663,205);ctx.lineTo(592,113);ctx.closePath();ctx.fill();
      const minLon=-82.7,maxLon=-68.0,minLat=-19.2,maxLat=0.5;
      function p(lon,lat){
        return [108+((lon-minLon)/(maxLon-minLon))*665,34+((maxLat-lat)/(maxLat-minLat))*618];
      }
      const peru=[[-80.48,-3.39],[-80.05,-4.28],[-80.62,-5.06],[-79.88,-6.26],[-79.15,-7.35],[-78.35,-9.28],[-77.20,-11.25],[-76.34,-13.42],[-75.13,-15.56],[-73.98,-17.38],[-72.29,-18.28],[-70.85,-17.74],[-69.80,-16.40],[-69.52,-14.65],[-68.86,-13.38],[-69.35,-12.18],[-70.42,-11.15],[-70.02,-9.55],[-70.70,-8.08],[-72.02,-7.25],[-72.78,-6.12],[-73.85,-5.22],[-73.35,-4.25],[-74.62,-3.20],[-76.34,-2.22],[-78.12,-1.65],[-79.38,-2.08],[-80.48,-3.39]];
      ctx.beginPath();
      peru.forEach(function(pt,i){const q=p(pt[0],pt[1]);if(i)ctx.lineTo(q[0],q[1]);else ctx.moveTo(q[0],q[1]);});
      ctx.closePath();ctx.fillStyle='#f7f5e8';ctx.fill();ctx.strokeStyle='#5f6260';ctx.lineWidth=4;ctx.stroke();
      ctx.strokeStyle='rgba(120,122,115,.32)';ctx.lineWidth=2;
      [[[-79.7,-4.5],[-75.5,-7.2],[-70.5,-10.2]],[[-78.8,-8.0],[-75.3,-11.5],[-70.2,-14.0]],[[-76.6,-13.2],[-73.5,-15.7],[-71.3,-17.3]],[[-76.5,-2.8],[-76.0,-8.8],[-75.0,-15.6]]].forEach(function(line){
        ctx.beginPath();line.forEach(function(pt,i){const q=p(pt[0],pt[1]);if(i)ctx.lineTo(q[0],q[1]);else ctx.moveTo(q[0],q[1]);});ctx.stroke();
      });
      const dept=String(meta&&meta.departamento||'').toLowerCase();
      let poly=[[-77.95,-11.35],[-76.55,-11.55],[-76.42,-12.55],[-77.20,-13.22],[-77.98,-12.56]],label='LIMA',labelPoint=[-76.75,-12.3];
      if(/arequipa/.test(dept)){poly=[[-73.7,-14.7],[-71.4,-14.9],[-70.8,-16.3],[-72.0,-17.5],[-73.8,-16.5]];label='AREQUIPA';labelPoint=[-72.1,-16.2];}
      else if(/libertad/.test(dept)){poly=[[-79.7,-6.7],[-78.2,-6.85],[-77.5,-7.85],[-78.45,-8.9],[-79.75,-8.2]];label='LA LIBERTAD';labelPoint=[-78.65,-8.0];}
      ctx.beginPath();
      poly.forEach(function(pt,i){const q=p(pt[0],pt[1]);if(i)ctx.lineTo(q[0],q[1]);else ctx.moveTo(q[0],q[1]);});
      ctx.closePath();ctx.fillStyle='#f00000';ctx.fill();ctx.strokeStyle='#ffffff';ctx.lineWidth=4;ctx.stroke();
      ctx.font='700 28px Arial';ctx.fillStyle='#111827';ctx.fillText('Ecuador',170,150);ctx.fillText('Colombia',610,86);ctx.fillText('Brasil',710,315);ctx.fillText('Bolivia',705,485);ctx.fillText('Chile',695,625);ctx.fillText('OCEANO PACIFICO',65,425);
      ctx.font='800 26px Arial';const lp=p(labelPoint[0],labelPoint[1]);ctx.fillText(label,lp[0]+10,lp[1]+8);
      ctx.strokeStyle='#111827';ctx.lineWidth=6;ctx.strokeRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle='rgba(0,0,0,.82)';ctx.fillRect(38,canvas.height-105,450,72);
      ctx.font='900 48px Arial';ctx.fillStyle='#ffffff';ctx.fillText('LOCALIZACION',58,canvas.height-54);
      return canvas.toDataURL('image/png');
    }catch(e){return null;}
  }

  function bonogasDrawPdfInsets(doc,x,y,w,h,meta,locationMapImage,districtMapImage){
    const localH=h;
    const localImg=locationMapImage;
    if(localImg)doc.addImage(localImg,'PNG',x,y,w,localH);
    else{doc.setDrawColor(0,0,0);doc.setLineWidth(1.2);doc.setFillColor(220,244,252);doc.rect(x,y,w,localH,'FD');doc.setTextColor(0,0,0);doc.text('MAPA DEL PERU',x+60,y+localH/2);}
    doc.setDrawColor(0,0,0);doc.setLineWidth(1.1);doc.rect(x,y,w,localH,'S');
    bonogasPdfOutlinedText(doc,'LOCALIZACION',x+12,y+localH-13,16);
    bonogasDrawPdfNorthArrow(doc,x+4,y+4,15);

    const y2=y+localH+10,ubH=h*.72;
    if(districtMapImage){
      doc.addImage(districtMapImage,'PNG',x,y2,w,ubH);
      doc.setDrawColor(0,0,0);doc.setLineWidth(1.2);doc.rect(x,y2,w,ubH,'S');
      bonogasPdfOutlinedText(doc,'UBICACION',x+12,y2+ubH-13,16);
      bonogasDrawPdfNorthArrow(doc,x+4,y2+4,15);
      return;
    }
    doc.setFillColor(248,250,252);doc.setDrawColor(0,0,0);doc.setLineWidth(1.2);doc.rect(x,y2,w,ubH,'FD');
    doc.setFontSize(8);doc.setTextColor(15,23,42);doc.text('Geometría oficial no disponible',x+w/2,y2+ubH/2,{align:'center'});
    bonogasDrawPdfNorthArrow(doc,x+4,y2+4,15);
    bonogasPdfOutlinedText(doc,'UBICACION',x+12,y2+ubH-12,16);
  }

  function bonogasDrawSatelliteBackdrop(doc,box){
    doc.setFillColor(92,96,70);doc.rect(box.x,box.y,box.w,box.h,'F');
    const patches=[
      [74,86,58,44,112,112,82],[162,40,86,70,123,105,78],[272,70,98,62,92,105,76],
      [390,34,126,86,71,94,72],[34,184,116,86,84,111,75],[188,174,126,92,134,119,82],
      [340,166,146,78,83,100,70],[70,326,132,84,120,106,72],[246,318,154,96,91,105,69],
      [420,286,118,118,72,91,67]
    ];
    patches.forEach(function(p){doc.setFillColor(p[4],p[5],p[6]);doc.rect(box.x+p[0],box.y+p[1],p[2],p[3],'F');});
    doc.setDrawColor(72,72,64);doc.setLineWidth(5);
    [[20,55,540,105],[35,228,530,186],[80,410,536,332],[122,0,176,510],[310,0,356,510],[472,0,430,510]].forEach(function(l){doc.line(box.x+l[0],box.y+l[1],box.x+l[2],box.y+l[3]);});
    doc.setDrawColor(190,168,125);doc.setLineWidth(2);
    [[22,58,538,108],[36,231,528,189],[82,413,534,335],[125,0,179,510],[313,0,359,510],[475,0,433,510]].forEach(function(l){doc.line(box.x+l[0],box.y+l[1],box.x+l[2],box.y+l[3]);});
    doc.setDrawColor(28,32,28);doc.setLineWidth(1.5);
    for(let i=0;i<18;i++){
      const xx=box.x+28+(i%6)*88,yy=box.y+28+Math.floor(i/6)*126;
      doc.rect(xx,yy,42+(i%3)*10,26+(i%2)*8,'S');
    }
  }

  async function exportBonogasEstratificationMapPdf(){
    try{
      if(!bonogasRealManzanasLoaded)await bonogasLoadRealManzanas();
      const rows=bonogasRowsForEstratificationPdf();
      if(!rows.length){
        showToast('Seleccione un departamento, distrito, estrato o área antes de generar el PDF.');
        return;
      }
      showToast('Generando mapa de estratificacion...');
      const jsPDF=await ensureJsPdf();
      const doc=new jsPDF({orientation:'landscape',unit:'pt',format:'a4'});
      const pageW=doc.internal.pageSize.getWidth(),pageH=doc.internal.pageSize.getHeight();
      const meta=bonogasPdfMeta(rows);
      const summary=bonogasEstratoSummary(rows);
      const brand=typeof getValidationBrandData==='function'?await getValidationBrandData():{};
      const locationMapImage=await bonogasCapturePeruLocationMapForPdf(meta);
      const districtMapImage=await bonogasCaptureDistrictLocationMapForPdf(meta);
      const pdfAdm3=await bonogasLoadAdminGeoJson('adm3').catch(function(){return null;});
      const pdfDistrictFeature=bonogasFindAdminFeature(pdfAdm3,meta.distrito,meta.departamento);
      if(!locationMapImage){
        showToast('No se pudo generar LOCALIZACIÓN: falta geometría oficial del departamento.');
        return;
      }
      if(!districtMapImage){
        showToast('No se pudo generar UBICACIÓN: falta geometría oficial del distrito.');
        return;
      }
      const previousBase=typeof activeBase!=='undefined'?activeBase:null;
      if(typeof ensureBonogasMapLayer==='function'){
        try{ensureBonogasMapLayer({zoomToResults:false});}catch(e){}
      }
      const previousView=bonogasFitLeafletMapToPdfRows(rows);
      const pdfMapBounds=(typeof leafletMap!=='undefined'&&leafletMap&&leafletMap.getBounds)?leafletMap.getBounds():null;
      if(typeof setBaseLayer==='function'){
        try{setBaseLayer('sat');await new Promise(function(resolve){setTimeout(resolve,650);});}catch(e){}
      }
      const mapImage=await bonogasCaptureCurrentMapForPdf();
      if(previousView&&leafletMap){
        try{leafletMap.setView(previousView.center,previousView.zoom,{animate:false});}catch(e){}
      }
      if(previousBase&&previousBase!=='sat'&&typeof setBaseLayer==='function'){
        try{setBaseLayer(previousBase);}catch(e){}
      }
      const pagePad=12;
      const gap=10;
      const rightW=210;
      const main={x:pagePad,y:18,w:pageW-(pagePad*2)-gap-rightW,h:500};
      const rightX=main.x+main.w+gap,rightY=18;
      doc.setFillColor(246,241,220);doc.rect(0,0,pageW,pageH,'F');
      doc.setDrawColor(0,0,0);doc.setLineWidth(1.2);
      doc.rect(main.x,main.y,main.w,main.h,'S');
      if(mapImage)doc.addImage(mapImage,'JPEG',main.x,main.y,main.w,main.h);
      else bonogasDrawSatelliteBackdrop(doc,main);
      if(mapImage&&pdfMapBounds){
        bonogasDrawGeoRowsOnPdfWithLeafletBounds(doc,rows,main,pdfMapBounds,{opacity:.58});
        bonogasDrawFeatureOutlineOnPdfWithLeafletBounds(doc,pdfDistrictFeature,main,pdfMapBounds,{color:[0,0,0],width:2.4});
      }
      if(!mapImage){
        doc.setDrawColor(190,190,190);doc.setLineWidth(.35);
        for(let gx=main.x+80;gx<main.x+main.w;gx+=95)doc.line(gx,main.y,gx,main.y+main.h);
        for(let gy=main.y+82;gy<main.y+main.h;gy+=95)doc.line(main.x,gy,main.x+main.w,gy);
        bonogasDrawGeoRowsOnPdf(doc,rows,main);
        const rb=bonogasGeoRowsBounds(rows);
        const fallbackBounds=(typeof L!=='undefined'&&L&&typeof L.latLngBounds==='function'&&rb)?L.latLngBounds([[rb.minLat,rb.minLng],[rb.maxLat,rb.maxLng]]):null;
        if(fallbackBounds)bonogasDrawFeatureOutlineOnPdfWithLeafletBounds(doc,pdfDistrictFeature,main,fallbackBounds,{color:[0,0,0],width:2.4});
      }
      bonogasDrawPdfNorthArrow(doc,main.x+8,main.y+2,28);
      doc.setFontSize(15);doc.setTextColor(255,255,255);doc.setDrawColor(0,0,0);doc.setLineWidth(1);
      doc.text('MAPA DE ESTRATIFICACION DE '+String(meta.distrito||meta.departamento).toUpperCase(),main.x+main.w/2,main.y+20,{align:'center'});
      doc.setTextColor(15,23,42);doc.setFontSize(7);
      doc.text('Coordinate System: WGS 1984 UTM Zone 18S',main.x+main.w-8,main.y+main.h-10,{align:'right'});

      const legX=main.x+12,legY=main.y+main.h-136,legW=118,legH=120;
      doc.setFillColor(255,255,255);doc.setDrawColor(0,0,0);doc.rect(legX,legY,legW,legH,'FD');
      doc.setFontSize(11);doc.setTextColor(0,0,0);doc.text('LEYENDA',legX+10,legY+16);
      doc.setFontSize(10);doc.text('ESTRATO',legX+10,legY+36);
      summary.forEach(function(s,i){
        const rgb=bonogasHexToRgb(BONOGAS_ESTRATO_COLORS[s.estrato]);
        const y=legY+52+i*13;
        doc.setFillColor(rgb[0],rgb[1],rgb[2]);doc.setDrawColor(255,255,255);doc.rect(legX+12,y-8,12,8,'FD');
        doc.setTextColor(0,0,0);doc.setFontSize(8);doc.text(s.estrato+': '+s.label,legX+30,y);
      });
      doc.setDrawColor(0,0,0);doc.rect(legX+12,legY+106,12,8,'S');doc.text('LIMITE DISTRITAL',legX+30,legY+113);
      const tableX=main.x+148,tableY=main.y+main.h-76,tableW=230,tableH=62;
      doc.setFillColor(255,255,255);doc.setDrawColor(0,0,0);doc.rect(tableX,tableY,tableW,tableH,'FD');
      doc.setFontSize(6.7);doc.setTextColor(0,0,0);
      const headers=['AGRUPACIÓN','# de Manzanas','% de Manzanas','Estrato INEI'];
      [0,64,122,176,230].forEach(function(dx){doc.line(tableX+dx,tableY,tableX+dx,tableY+tableH);});
      [0,13,23,33,43,53,62].forEach(function(dy){doc.line(tableX,tableY+dy,tableX+tableW,tableY+dy);});
      headers.forEach(function(h,i){doc.text(h,tableX+[4,68,126,180][i],tableY+9);});
      summary.slice(0,5).forEach(function(s,i){const y=tableY+21+i*10;doc.text('BONO-GAS',tableX+4,y);doc.text(String(s.count),tableX+104,y,{align:'right'});doc.text(s.pct+'%',tableX+160,y,{align:'right'});doc.text((s.estrato+': '+s.label).slice(0,14),tableX+180,y);});
      const miniY=tableY+34;
      doc.rect(main.x+main.w-112,miniY,92,32,'FD');doc.line(main.x+main.w-66,miniY,main.x+main.w-66,miniY+32);doc.line(main.x+main.w-112,miniY+13,main.x+main.w-20,miniY+13);doc.text('AGRUPACIÓN',main.x+main.w-108,miniY+9);doc.text('Potencial',main.x+main.w-58,miniY+9);doc.text('BONO-GAS',main.x+main.w-104,miniY+25);doc.text(String(meta.potencial||rows.length),main.x+main.w-38,miniY+25,{align:'right'});

      const rightLocationH=200;
      const rightUbicationH=rightLocationH*.72;
      const blockY=rightY+rightLocationH+10+rightUbicationH+10;
      const blockH=(main.y+main.h)-blockY;
      bonogasDrawPdfInsets(doc,rightX,rightY,rightW,rightLocationH,meta,locationMapImage,districtMapImage);
      doc.setDrawColor(0,0,0);doc.setFillColor(255,255,255);doc.rect(rightX,blockY,rightW,blockH,'FD');
      if(brand&&brand.fise)doc.addImage(brand.fise,'PNG',rightX+66,blockY+5,78,27);
      doc.line(rightX,blockY+34,rightX+rightW,blockY+34);
      doc.setFontSize(11);doc.setTextColor(0,0,0);doc.text('MAPA DE ESTRATIFICACIÓN',rightX+rightW/2,blockY+49,{align:'center'});
      doc.line(rightX,blockY+57,rightX+rightW,blockY+57);
      doc.setFontSize(7.4);doc.text('CONCESIÓN:',rightX+8,blockY+75);
      doc.setFontSize(9.2);doc.text(String(meta.concesionaria||'-').toUpperCase().slice(0,30),rightX+62,blockY+75);
      doc.line(rightX,blockY+86,rightX+rightW,blockY+86);
      doc.line(rightX+rightW*.32,blockY+86,rightX+rightW*.32,blockY+116);
      doc.line(rightX+rightW*.62,blockY+86,rightX+rightW*.62,blockY+116);
      doc.setFontSize(7.2);
      doc.text('DEPARTAMENTO:',rightX+6,blockY+98);
      doc.text('PROVINCIA:',rightX+rightW*.32+6,blockY+98);
      doc.text('DISTRITO:',rightX+rightW*.62+6,blockY+98);
      doc.setFontSize(8);
      doc.text(String(meta.departamento).toUpperCase().slice(0,13),rightX+rightW*.16,blockY+111,{align:'center'});
      doc.text(String(meta.provincia).toUpperCase().slice(0,13),rightX+rightW*.47,blockY+111,{align:'center'});
      doc.text(String(meta.distrito).toUpperCase().slice(0,18),rightX+rightW*.81,blockY+111,{align:'center'});
      doc.line(rightX,blockY+116,rightX+rightW,blockY+116);
      doc.line(rightX+rightW*.49,blockY+116,rightX+rightW*.49,blockY+blockH);
      doc.setFontSize(7.6);
      doc.text('ZONA:',rightX+7,blockY+blockH-12);
      doc.text(String(meta.zona).toUpperCase().slice(0,18),rightX+34,blockY+blockH-12);
      const potX=rightX+rightW*.51;
      doc.setFontSize(6.6);
      doc.text('N° DE POTENCIAL',potX+5,blockY+blockH-17);
      doc.text('DE USUARIOS:',potX+5,blockY+blockH-8);
      doc.setFontSize(11);doc.text(String(meta.potencial||rows.length),rightX+rightW-8,blockY+blockH-10,{align:'right'});
      doc.save('MAPA_DE_ESTRATIFICACION_BONOGAS.pdf');
      showToast('Mapa de estratificacion PDF generado');
    }catch(error){
      console.error(error);
      showToast('No se pudo generar el mapa de estratificacion');
    }
  }
  window.exportBonogasEstratificationMapPdf=exportBonogasEstratificationMapPdf;

  function ensureBonogasMapLayer(options){
    options=options||{};
    if(geoPortalMapActive())return;
    if(document.body.classList.contains('bonogas-heat-active'))return;
    if(typeof L==='undefined'||typeof leafletMap==='undefined'||!leafletMap)return;
    if(!bonogasRealManzanasLoaded){
      bonogasLoadRealManzanas().then(function(){ensureBonogasMapLayer(Object.assign({},options,{zoomToResults:true}));renderBonogasFiltersPanel();});
      return;
    }
    if(bonogasHuLayer&&leafletMap.hasLayer(bonogasHuLayer))leafletMap.removeLayer(bonogasHuLayer);
    if(window.bonogasManzanaLayer&&leafletMap.hasLayer(window.bonogasManzanaLayer))leafletMap.removeLayer(window.bonogasManzanaLayer);
    if(window.bonogasAdminBoundaryLayer&&leafletMap.hasLayer(window.bonogasAdminBoundaryLayer))leafletMap.removeLayer(window.bonogasAdminBoundaryLayer);
    bonogasHuLayer=L.layerGroup();
    window.bonogasHuLayer=bonogasHuLayer;
    window.bonogasManzanaLayer=L.layerGroup();
    const allRows=getBonogasFilteredRows().filter(function(r){
      return Number.isFinite(Number(r.lat))&&Number.isFinite(Number(r.lng))&&(r._geoJsonGeometry||bonogasRecordMatchesLayerStates(r));
    });
    const rows=bonogasRowsForMapRender(allRows);
    const geometryRows=rows.filter(function(r){return !!r._geoJsonGeometry;});
    if(allRows.length!==rows.length){
      showToast('Mostrando '+rows.length+' de '+allRows.length+' registros. Use Departamento/Distrito/Estrato para afinar el mapa.');
    }
    geometryRows.forEach(function(r,i){
      const estrato=normalizeBonogasEstratoNum(r,r.idx!=null?Number(r.idx)-1:i);
      const color=BONOGAS_ESTRATO_COLORS[estrato]||'#ffeb3b';
      const label=r.estratoLabel||bonogasEstratoLabel(estrato);
      if(!r._geoJsonGeometry)return;
      const feature={type:'Feature',geometry:r._geoJsonGeometry,properties:Object.assign({},r._geoJsonProperties||{},r)};
      const geoLayer=L.geoJSON(feature,{
        renderer:(typeof L.svg==='function'?L.svg({padding:.35}):undefined),
        smoothFactor:0,
        noClip:true,
        style:function(){
          return {color:'#111827',weight:1.25,opacity:1,fillColor:color,fillOpacity:.76,lineJoin:'round',smoothFactor:0,noClip:true};
        },
        onEachFeature:function(f,layer){
          const squareId=esc((r._geoJsonProperties&&r._geoJsonProperties.ID_SQUARE)||r.numeroInstalacion||r.suministro||'-');
          layer.on('mouseover',function(){try{layer.setStyle({weight:2.4,fillOpacity:.92,color:'#020617'});layer.bringToFront();}catch(e){}});
          layer.on('mouseout',function(){try{layer.setStyle({weight:1.25,fillOpacity:.76,color:'#111827'});}catch(e){}});
          layer.on('click',function(e){
            if(typeof activeMapTool!=='undefined'&&(activeMapTool==='circle'||activeMapTool==='polygon'||activeMapTool==='measure')){
              if(typeof handleMapToolClick==='function')handleMapToolClick(e);
              return;
            }
            if(typeof renderSupplyDetails==='function')renderSupplyDetails(r);
            updateBonogasMapFilterInfo(rows,'Manzana real seleccionada · Estrato '+estrato,r);
            layer.bindPopup('<b>Manzana urbana real</b><br>ID manzana: '+squareId+'<br>Estrato: '+esc(label)+'<br>Departamento: '+esc(r.departamento||r.region||'-')+'<br>Distrito: '+esc(r.distrito||'-')+'<br>Predios: '+esc(r.predios||0)+'<br>Habilitados: '+esc(r.habilitados||0)+'<br>Agrupación: '+esc((r._geoJsonProperties&&r._geoJsonProperties.Nombre_proyecto)||r.beneficiario||'-')+'<br>Fuente: '+esc(r.fuente||'-')).openPopup();
          });
        }
      });
      geoLayer.addTo(window.bonogasManzanaLayer);
    });
    window.bonogasManzanaLayer.addTo(leafletMap);
    if(window.bonogasAdminBoundaryLayer&&leafletMap.hasLayer(window.bonogasAdminBoundaryLayer)){
      leafletMap.removeLayer(window.bonogasAdminBoundaryLayer);
    }
    rows.forEach(function(r){
      if(r._geoJsonFeature)return;
      const status=bonogasLegendState(r);
      const color=(typeof getBeneficiaryColor==='function')?getBeneficiaryColor(status):(status==='Fuera de plazo'?'#ef4444':status==='Dentro de plazo'?'#0ea5e9':status==='Pendiente de liquidación'?'#f59e0b':'#22c55e');
      const estratoLabel=r.estratoLabel||bonogasEstratoLabel(normalizeBonogasEstratoNum(r,r.idx!=null?Number(r.idx)-1:0));
      const marker=L.circleMarker([Number(r.lat),Number(r.lng)],{radius:6.5,fillColor:color,color:'#fff',weight:2,opacity:1,fillOpacity:.9});
      marker.bindTooltip('<b>'+esc(r.suministro)+'</b><br>'+esc(r.region||'')+' · '+esc(estratoLabel)+'<br>'+esc(status),{direction:'top',offset:[0,-8],className:'modern-tooltip'});
      marker.bindPopup('<b>'+esc(r.beneficiario||'-')+'</b><br>Suministro: '+esc(r.suministro||'-')+'<br>'+esc(estratoLabel)+'<br>Empresa: '+esc(r.empresaInstaladora||'-')+'<br>Concesionaria: '+esc(r.concesionaria||'-')+'<br>Fuente: '+esc(r.fuente||'-')+'<br>Plazo: '+Number(r.days||0)+' dias');
      marker.on('click',function(e){
        if(typeof activeMapTool!=='undefined'&&(activeMapTool==='circle'||activeMapTool==='polygon'||activeMapTool==='measure')){
          if(typeof handleMapToolClick==='function')handleMapToolClick(e);
          return;
        }
        if(typeof renderSupplyDetails==='function')renderSupplyDetails(r);
      });
      marker.on('mouseover',function(){try{marker.setStyle({radius:9,weight:3,fillOpacity:1});marker.bringToFront();}catch(e){}});
      marker.on('mouseout',function(){try{marker.setStyle({radius:6.5,weight:2,fillOpacity:.9});}catch(e){}});
      marker.addTo(bonogasHuLayer);
    });
    bonogasHuLayer.addTo(leafletMap);
    updateBonogasMapFilterInfo(allRows,'Filtros aplicados',null);
    updateBonogasLayerLabel(allRows);
    const hasVisibleUpload=typeof shouldSkipBonogasAutoMapZoom==='function'?shouldSkipBonogasAutoMapZoom():(uploadedMapLayers||[]).some(function(x){return x.layer&&x.visible;});
    if(!hasVisibleUpload&&rows.length&&options.zoomToResults){
      try{
        const bounds=window.bonogasManzanaLayer&&typeof window.bonogasManzanaLayer.getBounds==='function'&&window.bonogasManzanaLayer.getLayers().length?window.bonogasManzanaLayer.getBounds():L.latLngBounds(rows.map(function(r){return [Number(r.lat),Number(r.lng)]}));
        if(bounds&&bounds.isValid&&bounds.isValid()){
          leafletMap.fitBounds(bounds,{padding:[72,72],maxZoom:15,animate:true});
          setTimeout(function(){try{leafletMap.invalidateSize();}catch(e){}},120);
        }
      }catch(e){}
    }
  }
  window.ensureBonogasMapLayer=ensureBonogasMapLayer;

  function bonogasRefreshAdminBoundaryLayer(rows){
    if(typeof L==='undefined'||typeof leafletMap==='undefined'||!leafletMap)return;
    Promise.all([
      bonogasLoadAdminGeoJson('adm1').catch(function(){return null;}),
      bonogasLoadAdminGeoJson('adm3').catch(function(){return null;})
    ]).then(function(data){
      const adm1=data[0],adm3=data[1];
      if(window.bonogasAdminBoundaryLayer&&leafletMap.hasLayer(window.bonogasAdminBoundaryLayer))leafletMap.removeLayer(window.bonogasAdminBoundaryLayer);
      const layer=L.layerGroup();
      const seenDept=new Set();
      const seenDistrict=new Set();
      (rows||[]).forEach(function(r){
        const dept=r.departamento||r.region||'';
        if(dept&&!seenDept.has(dept)){
          seenDept.add(dept);
          const f=bonogasFindAdminFeature(adm1,dept);
          if(f)L.geoJSON(f,{interactive:false,style:{color:'#0f172a',weight:2.2,opacity:.7,fill:false,dashArray:'8 6'}}).addTo(layer);
        }
        const district=r.distrito||'';
        const districtKey=dept+'|'+district;
        if(district&&!seenDistrict.has(districtKey)){
          seenDistrict.add(districtKey);
          const f=bonogasFindAdminFeature(adm3,district,dept);
          if(f)L.geoJSON(f,{interactive:false,style:{color:'#000000',weight:3.2,opacity:.92,fill:false}}).addTo(layer);
        }
      });
      window.bonogasAdminBoundaryLayer=layer;
      layer.addTo(leafletMap);
      try{if(window.bonogasManzanaLayer)window.bonogasManzanaLayer.bringToFront();layer.bringToFront();}catch(e){}
    });
  }

  function renderBonogasLeftPanel(){
    const panel=$('.left-panel');if(!panel)return;
    /* Panel izquierdo "Agrupaciones" (homologado a BonoGas_rev0) */
    panel.innerHTML=
      '<div class="panel-head">'
        +'<div><h2>Agrupaciones</h2><p style="margin:4px 0 0;color:#94a3b8;font-size:12px;font-weight:750">Seleccione agrupación, lote, c\u00edrculo o \u00e1rea GIS</p></div>'
        +'<button class="btn satcontrol-panel-create-btn" id="createBtn">+ Crear</button>'
      +'</div>'
      +'<div class="search"><input id="searchInput" placeholder="Buscar selecci\u00f3n, distrito o responsable" /></div>'
      +'<div class="project-list" id="projectList"></div>';

    var oldOpenBtn=$('#bonogasOpenPanel');
    if(oldOpenBtn)oldOpenBtn.remove();

    /* Render de tarjetas y wiring de eventos reutilizando lo que ya existe */
    try{ if(typeof renderProjects==='function') renderProjects(); }catch(e){}
    var si=$('#searchInput');
    if(si && typeof renderProjects==='function'){ si.oninput=renderProjects; }
    var cb=$('#createBtn');
    if(cb && typeof openProjectModal==='function'){
      cb.addEventListener('click',function(){ try{ openProjectModal(); }catch(e){} });
    }
  }

  function exitIntegratedModulesForBonogas(){
    const main=$('.main');
    const content=$('.content');
    const app=$('.app');
    if(main){
      main.classList.remove(
        'requests-mode','validations-mode','hospital-mode',
        'vale-fise-mode','ahorro-gnv-mode','fotovoltaico-mode',
        'electricidad-mode','masificacion-mode','mcter-mode',
        'create-project-mode','project-list-mode','project-delete-mode',
        'spa-mode','gnv-graficas-mode','gnv-satcontrol-mode',
        'integrated-module-mode','usuarios-mode','profile-mode'
      );
    }
    if(app)app.classList.remove('sidebar-hidden');
    const sidebar=$('.sidebar');
    if(sidebar)sidebar.classList.remove('collapsed');
    if(content){
      content.classList.remove('left-hidden','right-hidden');
      content.style.display='';
      content.style.removeProperty('visibility');
      content.style.removeProperty('opacity');
      content.style.removeProperty('height');
      content.style.removeProperty('pointer-events');
    }
    ['#valeFiseEnv','#ahorroGnvEnv','#fotovoltaicoEnv','#electricidadEnv','#masificacionEnv','#mcterEnv','#solicitudesEnv','#validacionesEnv'].forEach(function(sel){
      const el=$(sel);
      if(el)el.style.display='';
    });
    if(typeof hideProfileOverlay==='function')hideProfileOverlay();
    const usuariosOv=$('#usuariosOverlay');
    if(usuariosOv){
      usuariosOv.classList.remove('active');
      usuariosOv.setAttribute('aria-hidden','true');
    }
  }

  function refreshBonogasSatcontrolMap(){
    if(typeof ensureProjectLayerToggles==='function')ensureProjectLayerToggles();
    if(typeof clearObjectSelection==='function')clearObjectSelection(false);
    if(typeof activeAreaRecords!=='undefined')activeAreaRecords=[];
    window.activeAreaRecords=[];
    const repaint=function(){
      if(typeof leafletMap!=='undefined'&&leafletMap){
        try{leafletMap.invalidateSize({animate:false});}catch(e){leafletMap.invalidateSize();}
      }
      if(typeof applyBonogasFilters==='function')applyBonogasFilters();
      if(typeof resizeMapAfterLayout==='function')resizeMapAfterLayout();
    };
    setTimeout(repaint,160);
  }
  window.refreshBonogasSatcontrolMap=refreshBonogasSatcontrolMap;

  function alignSatcontrol(){
    const main=$('.main');
    if(main)main.classList.add('bonogas-satcontrol-mode','bonogas-active');
    if(typeof clearProyectosBeneficiaryOverlays==='function')clearProyectosBeneficiaryOverlays();
    if(typeof leafletMap!=='undefined'&&leafletMap){
      [typeof projectMarker!=='undefined'?projectMarker:null,typeof selectedDistrictLayer!=='undefined'?selectedDistrictLayer:null,typeof gasLayer!=='undefined'?gasLayer:null,typeof coberturaLayer!=='undefined'?coberturaLayer:null,typeof troncalLayer!=='undefined'?troncalLayer:null,typeof ramalesLayer!=='undefined'?ramalesLayer:null,typeof concesionariaLayer!=='undefined'?concesionariaLayer:null,typeof estratoLayer!=='undefined'?estratoLayer:null].forEach(function(layer){try{if(layer&&leafletMap.hasLayer(layer))leafletMap.removeLayer(layer);}catch(e){}});
      try{if(typeof drawLayer!=='undefined'&&drawLayer)drawLayer.clearLayers();}catch(e){}
    }
    if(typeof ensureProjectLayerToggles==='function')ensureProjectLayerToggles();
    const content=$('.content');
    if(content){
      content.classList.remove('right-hidden');
      content.classList.add('left-hidden');
      content.style.display='';
      content.style.removeProperty('visibility');
      content.style.removeProperty('opacity');
    }
    /* Topbar */
    const topTitle=$('.topbar h1'),topSub=$('.topbar p');
    if(topTitle)topTitle.textContent='SATCONTROL · BONO GAS';
    if(topSub){topSub.textContent='Control de suministros, plazos Art. 25.9, instalaciones y beneficiarios';topSub.style.display='';}
    if(typeof setActiveSidebarModule==='function')setActiveSidebarModule('navBonoSatcontrol');
    renderBonogasLeftPanel();
    prioritizeBonogasFiltersUtil();
    const themes=$('#themesPanel');
    if(themes)themes.classList.remove('open');
    const satellite=$('#satellitePanel');
    if(satellite)satellite.classList.remove('open');
    const label=$('#activeLayerLabel');
    if(label)label.innerHTML='Capa activa: <span style="color:#67e8f9">Control de plazos Art. 25.9</span>';
    const area=$('#areaStatsDetails');
    if(area&&area.classList.contains('empty')){
      area.innerHTML='<h3>Resumen de plazo de construccion</h3><p class="area-sub">Seleccione o dibuje un area para calcular habilitados liquidados, pendientes de liquidacion, suministros en construccion dentro/fuera de plazo y empresas instaladoras responsables.</p>';
    }
    renderBonogasFiltersPanel();
    selectedId=null;
    if(typeof renderProjects==='function')renderProjects();
    renderBonogasGeneralPanel();
    if(typeof window.ensureBonogasHuExtras==='function')window.ensureBonogasHuExtras();
    syncUploadedMapLayersToLeaflet();
    if(typeof resizeMapAfterLayout==='function')setTimeout(resizeMapAfterLayout,80);
    setTimeout(function(){
      if(typeof leafletMap==='undefined'||!leafletMap)return;
      if(typeof shouldSkipBonogasAutoMapZoom==='function'&&shouldSkipBonogasAutoMapZoom())return;
      const rows=getBonogasFilteredRows().filter(function(r){return Number.isFinite(Number(r.lat))&&Number.isFinite(Number(r.lng))});
      if(rows.length>1){
        try{leafletMap.fitBounds(rows.map(function(r){return [Number(r.lat),Number(r.lng)]}),{padding:[50,50]});return;}catch(e){}
      }
      leafletMap.setView([-9.19,-75.02],5,{animate:true});
    },120);
    if(typeof ensureSupplyInstallerLinks==='function')ensureSupplyInstallerLinks();
    if(typeof bindSatPanelToggles==='function')bindSatPanelToggles();
    if(typeof updateCollapseIcons==='function')updateCollapseIcons();
    if(typeof bindGeoJsonUploadWorkflowButtons==='function')bindGeoJsonUploadWorkflowButtons();
  }

  function openBonogasSatcontrol(){
    exitIntegratedModulesForBonogas();
    alignSatcontrol();
    refreshBonogasSatcontrolMap();
    if(typeof window.__prepareUtilsDocks==='function')window.__prepareUtilsDocks();
    if(typeof window.ensureBonogasStratButtonInDock==='function')setTimeout(window.ensureBonogasStratButtonInDock,80);
    if(typeof showToast==='function')showToast('SATCONTROL · BONO GAS');
  }
  window.alignSatcontrol=alignSatcontrol;
  window.openBonogasSatcontrol=openBonogasSatcontrol;
  window.bonogasMapRows=bonogasMapRows;
  window.getBonogasFilteredRows=getBonogasFilteredRows;
  window.getBonogasEstratoFilteredRows=getBonogasFilteredRows;
  window.applyBonogasFilters=applyBonogasFilters;
  window.applyBonogasEstratoFilter=applyBonogasFilters;
  document.addEventListener('click',function(event){
    const btn=event.target&&event.target.closest?event.target.closest('#bonogasEstratificationMapPdfBtn'):null;
    if(!btn)return;
    event.preventDefault();
    event.stopPropagation();
    bonogasOpenEstratificationWizard();
  });

  window.getChartDataset=function(records,filterKey){
    records=(Array.isArray(records)?records:getBonogasFilteredRows()).map(function(r){return (typeof normalizeSelectedRecord==='function')?normalizeSelectedRecord(r):r});
    if(filterKey==='estratoSocioeconomico'||filterKey==='estrato'){
      let low=0,high=0;
      records.forEach(function(r){
        const e=normalizeBonogasEstratoNum(r,r.idx!=null?Number(r.idx)-1:0);
        if(e==='1'||e==='2')low++;else high++;
      });
      return {title:'Estrato socioeconómico',leftLabel:'Muy bajo + Bajo',rightLabel:'Medio + Alto + Muy Alto',leftValue:low,rightValue:high};
    }
    if(filterKey==='empresaInstaladora'){
      const companies={};records.forEach(function(r){const k=r.empresaInstaladora||'Sin empresa';companies[k]=(companies[k]||0)+1});
      const top=Object.keys(companies).sort(function(a,b){return companies[b]-companies[a]})[0]||'Sin empresa';
      return {title:'Empresa instaladora',leftLabel:top,rightLabel:'Otras empresas',leftValue:companies[top]||0,rightValue:Math.max(0,records.length-(companies[top]||0))};
    }
    if(filterKey==='plazoConstruccion'){
      let late=0,ok=0;records.forEach(function(r){const i=(typeof supplyDeadlineInfo==='function')?supplyDeadlineInfo(r):{within:true}; if(r.estadoInstalacion==='En construccion'&&!i.within)late++; else if(r.estadoInstalacion==='En construccion')ok++;});
      return {title:'Plazo Art. 25.9',leftLabel:'Dentro de plazo',rightLabel:'Fuera de plazo',leftValue:ok,rightValue:late};
    }
    if(filterKey==='beneficiarios')return {title:'Beneficiarios',leftLabel:'Habilitados',rightLabel:'En construccion',leftValue:records.filter(function(r){return /Conectado|Liquidado/.test(r.estadoInstalacion||'')}).length,rightValue:records.filter(function(r){return r.estadoInstalacion==='En construccion'}).length};
    return {title:'Estado de instalacion',leftLabel:'Liquidados / habilitados',rightLabel:'Pendientes / construccion',leftValue:records.filter(function(r){return /Conectado|Liquidado/.test(r.estadoInstalacion||'')}).length,rightValue:records.filter(function(r){return !/Conectado|Liquidado/.test(r.estadoInstalacion||'')}).length};
  };

  var renderAreaStatsProyectos=renderAreaStats;
  window.renderAreaStats=function(stats,title){
    const box=$('#areaStatsDetails');if(!box)return;
    const main=$('.main');
    if(main&&main.classList.contains('bonogas-satcontrol-mode'))return;
    if(main&&main.classList.contains('has-plazo-area-selection'))return;
    return renderAreaStatsProyectos(stats,title);
  };

  const huAiUploads={dj:[],photos:[]};
  const huAiSteps={dj:'upload',photos:'upload'};
  const projectSatOriginal={};

  function getFilteredDjRows(){
    return typeof getFilteredGnvDjRows==='function'?getFilteredGnvDjRows():[];
  }

  function djExportHeaders(){
    return ['Declaracion Jurada','Beneficiario','DNI','Empresa instaladora','RUC','N suministro','N instalacion','Direccion','Representante legal','Firma','Fotos DJ','Resultado IA','Estado','Alertas IA'];
  }

  function djExportRow(r){
    return [r.id,r.beneficiario,r.dni,r.empresa,r.ruc,r.suministro,r.instalacion,r.direccion,r.representante,r.firma,r.fotos,r.resultado,r.estado,(r.alertas||[]).join('; ')];
  }

  function exportFilteredDjValidaciones(rows,format,quiet){
    if(!rows||!rows.length){
      if(typeof showToast==='function')showToast('No hay registros para exportar');
      return;
    }
    const fmt=format||'xlsx';
    const now=new Date().toLocaleString('es-PE');
    const empresa=($('#gnvValEmpresaFilter')&&$('#gnvValEmpresaFilter').value)||($('#valEmpresaFilter')&&$('#valEmpresaFilter').value)||'Todas';
    const estado=($('#gnvValEstadoFilter')&&$('#gnvValEstadoFilter').value)||($('#valEstadoFilter')&&$('#valEstadoFilter').value)||'Todos';
    const headers=djExportHeaders();
    const dataRows=rows.map(djExportRow);
    const cell=function(v){
      if(typeof csvCell==='function')return csvCell(v);
      const s=String(v==null?'':v);
      return /[",\n;]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s;
    };
    if(fmt==='xlsx'){
      const meta=[['Modulo','Validaciones · DJ IA'],['Empresa filtro',empresa],['Estado filtro',estado],['Registros',rows.length],['Generado',now]];
      const tableFn=typeof excelTable==='function'?excelTable:function(title,h,rs){return '<h2>'+title+'</h2>';};
      const workbook='<html><head><meta charset="utf-8"><style>body{font-family:Arial,sans-serif}h1{color:#0f172a}h2{background:#0f766e;color:white;padding:8px}table{border-collapse:collapse;margin-bottom:14px}th{background:#dbeafe;font-weight:bold}td,th{padding:6px 8px;border:1px solid #94a3b8;mso-number-format:\'\\@\'}</style></head><body><h1>Exportacion · Declaraciones Juradas en validacion IA</h1>'+tableFn('Filtros aplicados',['Campo','Valor'],meta)+tableFn('Declaraciones Juradas filtradas',headers,dataRows)+'</body></html>';
      if(typeof downloadExcelFile==='function')downloadExcelFile('SATCONTROL_DJ_validacion_IA.xls',workbook);
    }else if(fmt==='csv'){
      const lines=[];
      [['Empresa filtro',empresa],['Estado filtro',estado],['Registros',rows.length],['Generado',now]].forEach(function(pair){lines.push(pair.map(cell).join(','));});
      lines.push('');
      lines.push(headers.map(cell).join(','));
      dataRows.forEach(function(r){lines.push(r.map(cell).join(','));});
      if(typeof downloadTextFile==='function')downloadTextFile('SATCONTROL_DJ_validacion_IA.csv',lines.join('\n'));
    }else if(fmt==='pdf'){
      const jsPDF=window.jspdf&&window.jspdf.jsPDF;
      if(!jsPDF){if(typeof showToast==='function')showToast('Libreria PDF no disponible');return;}
      const doc=new jsPDF({orientation:'landscape',unit:'pt',format:'a4'});
      doc.setFillColor(15,118,110);
      doc.rect(0,0,doc.internal.pageSize.getWidth(),64,'F');
      doc.setTextColor(255,255,255);
      doc.setFontSize(16);
      doc.text('SATCONTROL · Declaraciones Juradas · Validacion IA',40,30);
      doc.setFontSize(10);
      doc.text('Empresa: '+empresa+' · Estado: '+estado+' · '+rows.length+' registros · '+now,40,48);
      doc.setTextColor(15,23,42);
      if(typeof doc.autoTable==='function'){
        doc.autoTable({head:[headers],body:dataRows.map(function(r){return r.map(function(v){return String(v==null?'':v)});}),startY:78,styles:{fontSize:7,cellPadding:3},headStyles:{fillColor:[14,165,233]},alternateRowStyles:{fillColor:[239,246,255]},margin:{left:28,right:28}});
      }
      doc.save('SATCONTROL_DJ_validacion_IA.pdf');
    }
    if(!quiet&&typeof showToast==='function')showToast('Exportacion DJ generada: '+rows.length+' registro(s)');
  }

  function patchDjValidacionesExport(){
    window.getFilteredDjRows=getFilteredDjRows;
    window.exportFilteredDjValidaciones=exportFilteredDjValidaciones;
    if(typeof exportValidationByFormat==='function'&&!window._origExportValidationByFormat)window._origExportValidationByFormat=exportValidationByFormat;
    window.exportValidationByFormat=function(format){
      const main=document.querySelector('.main');
      if(main&&main.classList.contains('gnv-dj-validations-mode')){
        const rows=window.filteredDjRows||getFilteredDjRows();
        if(!rows.length){
          if(typeof showToast==='function')showToast('No hay DJ para exportar');
          if(typeof toggleValidationExportMenu==='function')toggleValidationExportMenu(false);
          return;
        }
        exportFilteredDjValidaciones(rows,format||'xlsx',true);
        const empresa=($('#gnvValEmpresaFilter')&&$('#gnvValEmpresaFilter').value)||'Todas';
        const estado=($('#gnvValEstadoFilter')&&$('#gnvValEstadoFilter').value)||'Todos';
        if(typeof showToast==='function')showToast('Reporte '+(format||'xlsx').toUpperCase()+' descargado · '+empresa+' / '+estado+' · '+rows.length+' DJ');
        if(typeof toggleValidationExportMenu==='function')toggleValidationExportMenu(false);
        return;
      }
      if(typeof window._origExportValidationByFormat==='function')return window._origExportValidationByFormat(format);
    };
    if(typeof confirmExport==='function'&&!window.confirmExport.djPatched){
      window._origConfirmExport=confirmExport;
      window.confirmExport=function(){
        const main=document.querySelector('.main');
        const isGnvDj=main&&main.classList.contains('gnv-dj-validations-mode');
        const djRowsFiltered=window.filteredDjRows||getFilteredDjRows();
        if(isGnvDj&&djRowsFiltered.length){
          const getFormats=typeof getSelectedFormats==='function'?getSelectedFormats:function(){return Array.from(document.querySelectorAll('input[name="exportFormat"]:checked')).map(function(i){return i.value});};
          const formats=getFormats();
          if(!formats.length){if(typeof showToast==='function')showToast('Seleccione al menos un formato para exportar');if(typeof closeModal==='function')closeModal('exportModal');return;}
          formats.forEach(function(format){exportFilteredDjValidaciones(djRowsFiltered,format,true);});
          if(typeof showToast==='function')showToast('Descargas iniciadas: '+formats.map(function(f){return f.toUpperCase();}).join(', '));
          if(typeof closeModal==='function')closeModal('exportModal');
          return;
        }
        return window._origConfirmExport();
      };
      window.confirmExport.djPatched=true;
    }
  }

  function huAiFileList(prefix){
    const files=huAiUploads[prefix]||[];
    if(!files.length)return '<div class="hu-ai-file"><b>Sin archivos</b><span>Pendiente de carga</span></div>';
    return files.slice(0,4).map(function(file,i){return '<div class="hu-ai-file"><b>'+esc(file.name||('Archivo '+(i+1)))+'</b><span>Archivo '+(i+1)+'</span></div>'}).join('');
  }

  function huAiStepClass(prefix,step){
    const current=huAiSteps[prefix]||'upload',order={upload:1,analysis:2,results:3};
    if(current===step)return 'active';
    return order[current]>order[step]?'done':'';
  }

  function huAiCriteria(prefix,row){
    if(prefix==='dj'){
      return [
        ['Empresa instaladora',row.empresa+' / RUC '+row.ruc,'Validada','ok'],
        ['Beneficiario',row.beneficiario+' / '+row.dni,'Validado','ok'],
        ['Suministro y direccion',row.suministro+' / '+row.direccion,row.alertas.some(a=>/Direccion|direcci/i.test(a))?'Alerta':'Validado',row.alertas.some(a=>/Direccion|direcci/i.test(a))?'warn':'ok'],
        ['Firma representante legal',row.representante,row.firma,row.firma==='Detectada'?'ok':'warn']
      ];
    }
    return [
      ['Fachada','Vivienda del beneficiario','OK','ok'],
      ['Gabinete','Nitidez, rotulado y ubicación',row.alertas.some(a=>/gabinete|borrosa/i.test(a))?'Borrosa':'OK',row.alertas.some(a=>/gabinete|borrosa/i.test(a))?'warn':'ok'],
      ['Ambiente','Ambiente de instalación','OK','ok'],
      ['Gasodomestico','Artefacto conectado y visible',row.fotos==='5/6'?'Foto faltante':'OK',row.fotos==='5/6'?'warn':'ok']
    ];
  }

  function renderHuAiFlow(prefix,title,subtitle,row){
    const step=huAiSteps[prefix]||'upload';
    const files=huAiUploads[prefix]||[];
    const badge=step==='upload'?'Subir archivos':step==='analysis'?'Analizando':'Resultados';
    let body='';
    if(step==='analysis'){
      body='<div class="hu-ai-analyzing"><div class="hu-ai-spinner"></div><div><b>Analizando evidencia</b><span>Validando datos, DJ, fotografias obligatorias y trazabilidad.</span></div></div>';
    }else if(step==='results'){
      const rows=huAiCriteria(prefix,row);
      body='<div class="hu-ai-results">'+rows.map(function(item){return '<div class="hu-ai-result '+item[3]+'"><i>'+(item[3]==='ok'?'✓':'!')+'</i><div><b>'+esc(item[0])+'</b><span>'+esc(item[1])+'</span></div><small>'+esc(item[2])+'</small></div>'}).join('')+'</div><div class="hu-ai-summary"><div><span>Expediente</span><b>'+esc(row.id)+'</b></div><div><span>Archivos</span><b>'+files.length+'</b></div><div><span>Estado</span><b>'+esc(row.estado)+'</b></div></div><div class="hu-ai-actions"><button class="hu-ai-btn secondary" type="button" data-hu-ai-reset="'+prefix+'">Volver a cargar</button></div>';
    }else{
      body='<div class="hu-ai-upload"><div><b>Subir archivos</b><span>'+esc(subtitle)+'</span><label class="ai-upload-btn" style="margin-top:10px">Cargar archivos<input type="file" accept="image/*,.pdf" multiple data-hu-ai-input="'+prefix+'"></label></div></div><div class="hu-ai-files">'+huAiFileList(prefix)+'</div><div class="hu-ai-actions"><button class="hu-ai-btn secondary" type="button" data-hu-ai-clear="'+prefix+'">Limpiar</button><button class="hu-ai-btn" type="button" data-hu-ai-continue="'+prefix+'">Continuar</button></div>';
    }
    return '<section class="hu-ai-flow-card"><div class="ai-section-title"><div><h3>'+esc(title)+'</h3><p>'+esc(subtitle)+'</p></div><span class="ai-badge">'+esc(badge)+' · '+files.length+' archivo'+(files.length===1?'':'s')+'</span></div><div class="ai-flow-steps"><div class="ai-flow-step '+huAiStepClass(prefix,'upload')+'">1. Subir</div><div class="ai-flow-step '+huAiStepClass(prefix,'analysis')+'">2. Analisis</div><div class="ai-flow-step '+huAiStepClass(prefix,'results')+'">3. Resultados</div></div>'+body+'</section>';
  }

  function bindHuAiFlow(row){
    $$('[data-hu-ai-input]').forEach(function(input){input.onchange=function(e){const p=input.dataset.huAiInput;huAiUploads[p]=Array.from(e.target.files||[]);huAiSteps[p]='upload';selectValidacion(row.id,false)}});
    $$('[data-hu-ai-continue]').forEach(function(btn){btn.onclick=function(){const p=btn.dataset.huAiContinue;huAiSteps[p]='analysis';selectValidacion(row.id,false);setTimeout(function(){huAiSteps[p]='results';selectValidacion(row.id,false)},850)}});
    $$('[data-hu-ai-reset]').forEach(function(btn){btn.onclick=function(){huAiSteps[btn.dataset.huAiReset]='upload';selectValidacion(row.id,false)}});
    $$('[data-hu-ai-clear]').forEach(function(btn){btn.onclick=function(){const p=btn.dataset.huAiClear;huAiUploads[p]=[];huAiSteps[p]='upload';selectValidacion(row.id,false)}});
  }

  function captureProjectSatOriginal(){
    if(projectSatOriginal.ready)return;
    const pairs={label:'#activeLayerLabel',area:'#areaStatsDetails',chips:'#statsFilters',correction:'#bonogasDeadlineCard',left:'.left-panel'};
    Object.keys(pairs).forEach(function(key){
      const el=$(pairs[key]);
      if(el)projectSatOriginal[key]=el.innerHTML;
    });
    projectSatOriginal.ready=true;
  }

  function isBonoSatcontrolContext(context){
    if(context&&(context.nav==='navBonoSatcontrol'||/Bono Gas/i.test(context.title||'')))return true;
    const active=$('.sidebar-nav .nav-link.active');
    const title=$('.topbar h1');
    return (active&&active.id==='navBonoSatcontrol')||(title&&/Bono\s*Gas/i.test(title.textContent||''));
  }

  function restoreProjectSatcontrol(){
    const main=$('.main');
    if(main)main.classList.remove('bonogas-satcontrol-mode','bonogas-active');
    const filtersWrap=$('#bonogasFiltersBlock');
    if(filtersWrap)filtersWrap.remove();
    const filtersMount=$('#bonogasFiltersMount');
    if(filtersMount)filtersMount.innerHTML='';
    toggleBonogasFiltersPanel(false);
    const oldEstrato=$('#bonogasEstratoFilters');
    if(oldEstrato)oldEstrato.remove();
    window.bonogasSatFilters=normalizeBonogasSatFilters({});
    if(typeof window.clearProyectosForeignMapLayers==='function')window.clearProyectosForeignMapLayers();
    else if(bonogasHuLayer&&typeof leafletMap!=='undefined'&&leafletMap&&leafletMap.hasLayer(bonogasHuLayer))leafletMap.removeLayer(bonogasHuLayer);
    window.bonogasHuLayer=null;
    const content=$('.content');
    if(content)content.classList.remove('left-hidden');
    if(!projectSatOriginal.ready)return;
    const pairs={label:'#activeLayerLabel',area:'#areaStatsDetails',chips:'#statsFilters',correction:'#bonogasDeadlineCard'};
    Object.keys(pairs).forEach(function(key){
      const el=$(pairs[key]);
      if(el&&projectSatOriginal[key]!=null)el.innerHTML=projectSatOriginal[key];
    });
    if(typeof renderProjects==='function')renderProjects();
    if(typeof renderInfo==='function')renderInfo();
    if(typeof qsProyectos==='function'){
      const search=qsProyectos('#searchInput');
      if(search&&!search.dataset.proyectosBound){search.dataset.proyectosBound='1';search.addEventListener('input',renderProjects);}
    }
  }

  function solicitudRows(){
    const base=(typeof solicitudes!=='undefined'&&solicitudes&&solicitudes.length?solicitudes:((window.solicitudes&&window.solicitudes.length)?window.solicitudes:[]));
    const extras=[
      {id:'SOL-2026-0013',beneficiario:'Carlos Ruiz Poma',dni:'44500192',distrito:'Tacna',origen:'BonoGas 2.0',estado:'Aprobada',fecha:'2026-04-30',diasConstruccion:0,telefono:'+51 955 110 220',direccion:'Av. Bolognesi 220',tipo:'Residencial',suministro:'101388',instalacion:'INS-9388',empresaInstaladora:'Tacna Gas S.A.C.'},
      {id:'SOL-2026-0014',beneficiario:'Marta Ruiz Lazo',dni:'46723491',distrito:'Huanuco',origen:'Portal de Habilitaciones',estado:'En validacion',fecha:'2026-04-29',diasConstruccion:105,telefono:'+51 944 230 811',direccion:'Jr. Dos de Mayo 410',tipo:'Residencial',suministro:'101452',instalacion:'INS-9452',empresaInstaladora:'Huanuco Gas'},
      {id:'SOL-2026-0015',beneficiario:'Angela Poma Torres',dni:'43881230',distrito:'Huancayo',origen:'Portal de Habilitaciones',estado:'En validacion',fecha:'2026-04-28',diasConstruccion:83,telefono:'+51 943 661 502',direccion:'Pasaje Los Andes 118',tipo:'Residencial',suministro:'101533',instalacion:'INS-9533',empresaInstaladora:'Centro Gas Peru'},
      {id:'SOL-2026-0016',beneficiario:'Roberto Chunga Rios',dni:'48001922',distrito:'Iquitos',origen:'BonoGas 2.0',estado:'Aprobada',fecha:'2026-04-27',diasConstruccion:0,telefono:'+51 965 321 700',direccion:'Calle Putumayo 540',tipo:'Comercial',suministro:'101604',instalacion:'INS-9604',empresaInstaladora:'Iquitos Gas S.A.C.'},
      {id:'SOL-2026-0017',beneficiario:'Nora Delgado Perez',dni:'42150980',distrito:'Puno',origen:'Portal de Habilitaciones',estado:'Observada',fecha:'2026-04-26',diasConstruccion:118,telefono:'+51 932 770 106',direccion:'Av. El Sol 300',tipo:'Residencial',suministro:'101677',instalacion:'INS-9677',empresaInstaladora:'Puno Instalaciones S.A.C.'},
      {id:'SOL-2026-0018',beneficiario:'Hector Gonzales Vega',dni:'41008731',distrito:'Cajamarca',origen:'BonoGas 2.0',estado:'Aprobada',fecha:'2026-04-25',diasConstruccion:0,telefono:'+51 976 223 009',direccion:'Jr. Belen 760',tipo:'Residencial',suministro:'101742',instalacion:'INS-9742',empresaInstaladora:'Cajamarca Gas'},
      {id:'SOL-2026-0019',beneficiario:'Veronica Luna Cardenas',dni:'47339011',distrito:'Chiclayo',origen:'Portal de Habilitaciones',estado:'Nueva',fecha:'2026-04-24',diasConstruccion:62,telefono:'+51 911 882 300',direccion:'Urb. Santa Victoria 19',tipo:'Residencial',suministro:'101809',instalacion:'INS-9809',empresaInstaladora:'RedGas Contratistas'},
      {id:'SOL-2026-0020',beneficiario:'Oscar Poma Huanca',dni:'46500918',distrito:'Piura',origen:'Portal de Habilitaciones',estado:'En validacion',fecha:'2026-04-23',diasConstruccion:97,telefono:'+51 919 005 772',direccion:'AA.HH. Los Algarrobos Mz C',tipo:'Residencial',suministro:'101866',instalacion:'INS-9866',empresaInstaladora:'Instalaciones del Norte S.A.C.'}
    ];
    const rows=base.map(function(s,i){
      const d=Object.assign({},s);
      d.origen=/BONOGAS|BonoGas/i.test(d.origen)?'BonoGas 2.0':'Portal de Habilitaciones';
      d.estado=d.estado==='En validación'?'En validacion':d.estado;
      d.suministro=d.suministro||String(5208000+i*173);
      d.instalacion=d.instalacion||('INS-'+d.suministro);
      d.empresaInstaladora=d.empresaInstaladora||['Instalaciones del Norte S.A.C.','Gas & Hogar E.I.R.L.','Instalagas Peru S.A.C.','RedGas Contratistas'][i%4];
      return d;
    });
    const seen=new Set(rows.map(function(s){return s.id}));
    extras.forEach(function(s){if(!seen.has(s.id))rows.push(s)});
    window.solicitudes=rows;
    if(!window.selectedSolicitudId&&rows[0])window.selectedSolicitudId=rows[0].id;
    return rows;
  }

  function solEnrichFromBonogas(s){
    /* Busca datos completos de _enrichedBeneficiarios para la solicitud */
    var found=(window._enrichedBeneficiarios||[]).find(function(r){return String(r.suministro)===String(s.suministro)});
    if(!found&&typeof bonogasMapRows==='function'){found=bonogasMapRows().find(function(r){return String(r.suministro)===String(s.suministro)});}
    return found?Object.assign({},found,s):s;
  }
  function solStatusCls(e){if(/aprobada/i.test(e))return 'aprobada';if(/observada/i.test(e))return 'observada';if(/nueva/i.test(e))return 'nueva';return 'validacion';}
  function solFmtMoney(n){return typeof formatMoney==='function'?formatMoney(n):('S/ '+Math.round(Number(n)||0).toLocaleString('es-PE'));}

  window.renderSolicitudes=function(){
    const rows=solicitudRows();
    const q=norm($('#solSearch')&&$('#solSearch').value);
    const estado=($('#solEstadoFilter')&&$('#solEstadoFilter').value)||'';
    const distrito=($('#solDistritoFilter')&&$('#solDistritoFilter').value)||'';
    const origen=($('#solOrigenFilter')&&$('#solOrigenFilter').value)||'';
    let filtered=rows.filter(function(s){
      return (!estado||s.estado===estado)&&(!distrito||s.distrito===distrito)&&(!origen||s.origen===origen)
        &&(!q||norm(s.id+' '+s.beneficiario+' '+s.dni+' '+s.distrito+' '+s.suministro+' '+s.instalacion+' '+s.empresaInstaladora).includes(q));
    });
    if(solicitudesKpiFilter==='overdue')filtered=filtered.filter(function(s){return Number(s.diasConstruccion||0)>=90;});
    if(solicitudesKpiFilter==='approved')filtered=filtered.filter(function(s){return /aprobada/i.test(s.estado||'');});
    if(solicitudesKpiFilter==='observed')filtered=filtered.filter(function(s){return /observada/i.test(s.estado||'');});
    solicitudesPage=renderDataPagination('Sol',filtered.length,solicitudesPage,BONOGAS_PAGE_SIZE);
    const pageRows=filtered.slice((solicitudesPage-1)*BONOGAS_PAGE_SIZE,solicitudesPage*BONOGAS_PAGE_SIZE);
    /* Cabecera */
    /* titulo dinamico desactivado */
    /* Filtros dinámicos */
    const sf=$('#solEstadoFilter');if(sf){const old=sf.value;sf.innerHTML='<option value="">Todos los estados</option><option>Nueva</option><option>En validacion</option><option>Aprobada</option><option>Observada</option>';sf.value=old;}
    const df=$('#solDistritoFilter');if(df){const old=df.value;const ds=Array.from(new Set(rows.map(function(s){return s.distrito}).filter(Boolean))).sort();df.innerHTML='<option value="">Todos los distritos</option>'+ds.map(function(d){return '<option>'+esc(d)+'</option>'}).join('');df.value=old;}
    const of=$('#solOrigenFilter');if(of){of.innerHTML='<option value="">Todas las fuentes</option><option>BonoGas 2.0</option><option>Portal de Habilitaciones</option>';if(origen)of.value=origen;}
    /* KPIs actualizados */
    if($('#solKpiTotal'))$('#solKpiTotal').textContent=rows.length;
    if($('#solKpiValidation'))$('#solKpiValidation').textContent=rows.filter(function(s){return Number(s.diasConstruccion||0)>=90;}).length;
    if($('#solKpiApproved'))$('#solKpiApproved').textContent=rows.filter(function(s){return /aprobada/i.test(s.estado||'');}).length;
    if($('#solKpiObserved'))$('#solKpiObserved').textContent=rows.filter(function(s){return /observada/i.test(s.estado||'');}).length;
    const labs=$$('.sol-kpi span');
    if(labs[0])labs[0].textContent='Solicitudes totales';
    if(labs[1])labs[1].textContent='Fuera de plazo (>=90d)';
    if(labs[2])labs[2].textContent='Aprobadas';
    if(labs[3])labs[3].textContent='Observadas';
    $$('#solicitudesEnv [data-sol-kpi]').forEach(function(card){const active=card.dataset.solKpi===solicitudesKpiFilter;card.classList.toggle('kpi-active',active);card.setAttribute('aria-pressed',String(active));});
    /* Cabecera de tabla — mismos campos que BONOGAS */
    const table=$('.solicitudes-table');
    if(table&&table.tHead)table.tHead.innerHTML='<tr><th>Solicitud</th><th>Suministro</th><th>Instalacion</th><th>Beneficiario</th><th>Empresa instaladora</th><th>Tipo</th><th>Estado</th><th>Fecha</th><th>Plazo Art. 25.9</th><th></th></tr>';
    /* Filas de tabla */
    const body=$('#solicitudesTableBody');
    if(body)body.innerHTML=pageRows.map(function(s){
      const plazo=Number(s.diasConstruccion||0),bad=plazo>=90;
      const tipo=s.tipo||'Residencial';
      return '<tr>'
        +'<td><b style="color:#e0f2fe">'+esc(s.id)+'</b></td>'
        +'<td>'+esc(s.suministro||'-')+'</td>'
        +'<td style="color:#94a3b8">'+esc(s.instalacion||'-')+'</td>'
        +'<td>'+esc(s.beneficiario)+'<br><small style="color:#94a3b8">'+esc(s.dni)+'</small></td>'
        +'<td><button class="installer-link" type="button" data-installer-name="'+esc(s.empresaInstaladora||'-')+'" title="Ver ranking e histórico" onclick="if(typeof openInstallerRanking===\'function\')openInstallerRanking(this.dataset.installerName)"><span class="rank-mini">★</span>'+esc(s.empresaInstaladora||'-')+'</button></td>'
        +'<td><span class="pill eval" style="font-size:9px">'+esc(tipo)+'</span></td>'
        +'<td><span class="sol-status '+solStatusCls(s.estado||'')+'">'+esc(s.estado||'-')+'</span></td>'
        +'<td style="color:#94a3b8;font-size:11px">'+esc(s.fecha||'-')+'</td>'
        +'<td><span class="plazo-alert '+(bad?'bad':'ok')+'">'+plazo+'d '+(bad?'Fuera':'Dentro')+'</span></td>'
        +'<td><button class="sol-action-btn" type="button" data-sol-id="'+esc(s.id)+'">Ver</button></td>'
        +'</tr>';
    }).join('')||'<tr><td colspan="10" style="text-align:center;color:#94a3b8;padding:24px">Sin solicitudes con los filtros actuales.</td></tr>';
    $$('[data-sol-id]').forEach(function(b){b.addEventListener('click',function(){selectSolicitud(b.dataset.solId);});});
    if(typeof selectSolicitud==='function')selectSolicitud(window.selectedSolicitudId||((filtered[0]||rows[0]||{}).id),false);
  };

  window.selectSolicitud=function(id,toast){
    const rows=solicitudRows();
    const s=rows.find(function(x){return x.id===id;})||rows[0];
    if(!s)return;
    window.selectedSolicitudId=s.id;
    /* Buscar datos completos de BONOGAS para esta solicitud */
    const full=solEnrichFromBonogas(s);
    const plazo=Number(s.diasConstruccion||0),bad=plazo>=90;
    /* Panel de detalle con mismos campos que beneficiary-panel de BONOGAS */
    const card=$('#solDetailCard');
    if(card)card.innerHTML=
      '<div class="beneficiary-section" style="margin-bottom:8px">'
        +'<h4 style="margin:0 0 8px;color:#67e8f9;font-size:12px;font-weight:950">Datos del Suministro</h4>'
        +'<div class="sol-detail-row"><span>Solicitud portal</span><b>'+esc(s.id)+'</b></div>'
        +'<div class="sol-detail-row"><span>N° Suministro</span><b>'+esc(s.suministro||'-')+'</b></div>'
        +'<div class="sol-detail-row"><span>N° Instalacion</span><b>'+esc(s.instalacion||'-')+'</b></div>'
        +'<div class="sol-detail-row"><span>Beneficiario</span><b>'+esc(s.beneficiario||'-')+'</b></div>'
        +'<div class="sol-detail-row"><span>DNI / RUC</span><b>'+esc(s.dni||'-')+'</b></div>'
        +'<div class="sol-detail-row"><span>Tipo</span><b>'+esc(s.tipo||'Residencial')+'</b></div>'
        +'<div class="sol-detail-row"><span>Empresa instaladora</span><b>'+esc(s.empresaInstaladora||'-')+'</b></div>'
        +(full.estrato?'<div class="sol-detail-row"><span>Estrato</span><b>'+esc(full.estrato)+'</b></div>':'')
        +(full.materialInstalacion?'<div class="sol-detail-row"><span>Material</span><b>'+esc(full.materialInstalacion)+'</b></div>':'')
        +(full.tipoAcometida?'<div class="sol-detail-row"><span>Tipo acometida</span><b>'+esc(full.tipoAcometida)+'</b></div>':'')
        +(full.tipoMedidor?'<div class="sol-detail-row"><span>Tipo medidor</span><b>'+esc(full.tipoMedidor)+'</b></div>':'')
        +'<div class="sol-detail-row"><span>Fuente</span><b>'+esc(s.origen||'-')+'</b></div>'
        +'<div class="sol-detail-row"><span>Fecha registro portal</span><b>'+esc(s.fecha||'-')+'</b></div>'
      +'</div>'
      +'<div class="beneficiary-section" style="margin-bottom:8px">'
        +'<h4 style="margin:0 0 8px;color:#67e8f9;font-size:12px;font-weight:950">Datos de Recaudacion</h4>'
        +(full.costoInstalacion?'<div class="sol-detail-row"><span>Costo instalacion</span><b>'+solFmtMoney(full.costoInstalacion)+'</b></div>':'')
        +(full.porcentajeSubsidio?'<div class="sol-detail-row"><span>% Subsidio FISE</span><b>'+esc(full.porcentajeSubsidio)+'%</b></div>':'')
        +(full.montoFinanciado?'<div class="sol-detail-row"><span>Monto financiado</span><b>'+solFmtMoney(full.montoFinanciado)+'</b></div>':'')
        +(full.montoPendiente>0?'<div class="sol-detail-row"><span>Monto pendiente</span><b style="color:#fde68a">'+solFmtMoney(full.montoPendiente)+'</b></div>':'')
        +(full.cuotasPagadas!=null?'<div class="sol-detail-row"><span>Cuotas pagadas</span><b>'+esc(full.cuotasPagadas)+'</b></div>':'')
        +(full.cuotasPendientes!=null?'<div class="sol-detail-row"><span>Cuotas pendientes</span><b>'+esc(full.cuotasPendientes)+'</b></div>':'')
        +(full.suministroActivo?'<div class="sol-detail-row"><span>Suministro activo</span><b>'+esc(full.suministroActivo)+'</b></div>':'')
      +'</div>'
      +'<div class="beneficiary-section">'
        +'<h4 style="margin:0 0 8px;color:#67e8f9;font-size:12px;font-weight:950">Control de plazo Art. 25.9</h4>'
        +'<div class="sol-detail-row"><span>Dias en construccion</span><b class="plazo-alert '+(bad?'bad':'ok')+'">'+plazo+' dias — '+(bad?'Fuera de plazo':'Dentro de plazo')+'</b></div>'
        +'<div class="sol-detail-row"><span>Limite regulatorio</span><b>90 dias calendario</b></div>'
        +'<div class="sol-timeline" style="margin-top:10px">'
          +'<div class="sol-step"><span class="sol-dot done">1</span><div><b>Registro en Portal</b><span>'+esc(s.fecha||'-')+'</span></div></div>'
          +'<div class="sol-step"><span class="sol-dot done">2</span><div><b>Sincronizacion BonoGas 2.0</b><span>Clave: N° suministro / instalacion</span></div></div>'
          +'<div class="sol-step"><span class="sol-dot '+(bad?'current':'done')+'">3</span><div><b>Monitoreo Art. 25.9</b><span>'+(bad?'ALERTA: supera 90 dias':'Dentro de plazo')+'</span></div></div>'
        +'</div>'
      +'</div>';
    /* Abrir beneficiary panel si hay datos BonoGas completos */
    if(typeof openBeneficiaryPanel==='function'&&full&&full.suministro)openBeneficiaryPanel(full);
    if(toast!==false&&typeof showToast==='function')showToast('Solicitud: '+s.id);
  };

  function rebindFilters(){
    ['#solSearch','#solEstadoFilter','#solDistritoFilter','#solOrigenFilter'].forEach(function(id){const el=$(id);if(el&&!el.dataset.huBound){el.dataset.huBound='1';el.addEventListener('input',window.renderSolicitudes);el.addEventListener('change',window.renderSolicitudes);}});
    ['#valSearch','#valEmpresaFilter','#valEstadoFilter','#valFechaFilter','#valDistritoFilter','#gnvValSearch','#gnvValEmpresaFilter','#gnvValEstadoFilter','#gnvValFechaFilter','#gnvValDistritoFilter'].forEach(function(id){const el=$(id);if(el&&!el.dataset.huBound){el.dataset.huBound='1';el.addEventListener('input',renderValidaciones);el.addEventListener('change',renderValidaciones);}});
  }

  function openAiFlow(){
    if(typeof window.openBonogasAiValidacionModal==='function')window.openBonogasAiValidacionModal();
    else if(typeof openModal==='function')openModal('bonogasAiValidacionModal');
    if(typeof showToast==='function')showToast('Validación IA · Bono Gas');
  }

  function initHuAlignment(){
    captureProjectSatOriginal();
    patchBonogasAreaSelection();
    if(typeof exportFilteredValidaciones==='function'&&!window._origExportFilteredValidaciones)window._origExportFilteredValidaciones=exportFilteredValidaciones;
    patchDjValidacionesExport();
    if(isBonoSatcontrolContext())alignSatcontrol();
    rebindFilters();
    document.addEventListener('click',function(e){
      if(e.target.closest('[data-open-bonogas-ai-flow]'))openAiFlow();
    });
    const oldOpenSat=window.openSatcontrolView;
    if(typeof oldOpenSat==='function'&&!oldOpenSat.huWrapped){
      window.openSatcontrolView=function(context){oldOpenSat(context);setTimeout(function(){if(isBonoSatcontrolContext(context))alignSatcontrol();else restoreProjectSatcontrol();},30)};
      window.openSatcontrolView.huWrapped=true;
    }
    const oldOpenVal=window.openValidacionesEnvironment;
    window.openValidacionesEnvironment=function(){if(typeof oldOpenVal==='function')oldOpenVal();setTimeout(rebindFilters,30)};
    const oldOpenSol=window.openSolicitudesEnvironment;
    window.openSolicitudesEnvironment=function(){if(typeof oldOpenSol==='function')oldOpenSol();setTimeout(rebindFilters,30)};
    if($('.main')&&$('.main').classList.contains('validations-mode'))renderValidaciones();
    if($('.main')&&$('.main').classList.contains('requests-mode'))renderSolicitudes();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initHuAlignment);else initHuAlignment();
})();

(function(){
  var USUARIOS = [
    {nombre:'Pablo', apellido:'Panchez', correo:'PANCHES123@GMAIL.COM', region:'AMAZONAS', enabled:false},
    {nombre:'LUCI', apellido:'PEREZ', correo:'darkliberal04@gmail.com', region:'AMAZONAS', enabled:true},
    {nombre:'Test', apellido:'FISE-SAS', correo:'test_fiseSaas2@gmail.com', region:'AREQUIPA', enabled:true},
    {nombre:'Test', apellido:'FISE-SAS', correo:'test_fiseSaas@gmail.com', region:'AMAZONAS', enabled:true},
    {nombre:'Pruebas', apellido:'Infoagro', correo:'pruebas@infoagro.global', region:'AMAZONAS', enabled:true},
    {nombre:'Paolo test', apellido:'Guerrero', correo:'paolo@paulet4.com', region:'AMAZONAS', enabled:true},
    {nombre:'FERNANDO', apellido:'FERNANDEZ', correo:'cajiheb538@fermiro.com', region:'AMAZONAS', enabled:true},
    {nombre:'Ursuario 2', apellido:'Apellido 2', correo:'correo@correo.com', region:'AMAZONAS', enabled:true},
    {nombre:'Usuario', apellido:'pruebas', correo:'noxol56595@burangir.com', region:'AMAZONAS', enabled:true},
    {nombre:'PABLITO', apellido:'PEREZ', correo:'oliver.gz@hotmail.com', region:'AMAZONAS', enabled:true}
  ];
  var usuariosPage = 1;
  var usuariosPageSize = 5;

  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]})}

  function renderTabla(){
    var tb = document.getElementById('usuariosTBody');
    if(!tb) return;
    var total = USUARIOS.length;
    var pages = Math.max(1, Math.ceil(total / usuariosPageSize));
    usuariosPage = Math.max(1, Math.min(usuariosPage, pages));
    var start = (usuariosPage - 1) * usuariosPageSize;
    var visible = USUARIOS.slice(start, start + usuariosPageSize);
    tb.innerHTML = visible.map(function(u,offset){
      var i = start + offset;
      var estado = u.enabled
        ? '<span class="us-badge enabled">Habilitado</span>'
        : '<span class="us-badge disabled">Deshabilitado</span>';
      var btn = u.enabled
        ? '<button class="us-btn-action disable" data-i="'+i+'">Deshabilitar</button>'
        : '<button class="us-btn-action enable" data-i="'+i+'">Habilitar</button>';
      var perfiles=['Administrador de Plataforma - Nodo FISE','FISE TIC / Auditor','Coordinador de Programa','Supervisor de Campo','Analista FISE','Operador Mesa de Ayuda','Beneficiario','Concesionaria / Instaladora / Taller','Servicio IA'];
      var perfil=u.perfil||perfiles[i%perfiles.length];
      return '<tr><td>'+esc(u.nombre)+'</td><td>'+esc(u.apellido)+'</td><td>'+esc(u.correo)+'</td><td>'+esc(u.region)+'</td><td><span class="us-profile-badge">'+esc(perfil)+'</span></td><td>'+estado+'</td><td>'+btn+'</td></tr>';
    }).join('');
    var info = document.getElementById('usuariosPageInfo');
    var prev = document.getElementById('usuariosPrevPage');
    var next = document.getElementById('usuariosNextPage');
    var nums = document.getElementById('usuariosPageNumbers');
    if(info){
      var end = total ? Math.min(start + visible.length, total) : 0;
      info.textContent = total ? ('Mostrando '+(start+1)+'-'+end+' de '+total+' usuarios') : 'Mostrando 0 de 0 usuarios';
    }
    if(prev) prev.disabled = usuariosPage <= 1;
    if(next) next.disabled = usuariosPage >= pages;
    if(nums){
      nums.innerHTML = Array.from({length: pages}, function(_,idx){
        var page = idx + 1;
        return '<button class="us-page-btn '+(page===usuariosPage?'active':'')+'" type="button" data-us-page="'+page+'">'+page+'</button>';
      }).join('');
    }
  }

  function prepareUsuariosEnv(){
    var ov = document.getElementById('usuariosOverlay');
    var main = document.querySelector('.main');
    if(ov && main && ov.parentElement !== main) main.appendChild(ov);
    return {ov:ov, main:main};
  }

  function setUsuariosMode(view){
    var env = prepareUsuariosEnv();
    var main = env.main;
    if(main){
      main.classList.remove('create-project-mode','project-list-mode','project-delete-mode','requests-mode','validations-mode','dashboard-mode','dashboard-fise-mode','hospital-mode','integrated-module-mode','vale-fise-mode','ahorro-gnv-mode','fotovoltaico-mode','electricidad-mode','masificacion-mode','mcter-mode','spa-mode','bonogas-active','bonogas-satcontrol-mode');
      main.classList.add('usuarios-mode');
    }
    document.querySelectorAll('.sidebar-nav .nav-link.active').forEach(function(a){a.classList.remove('active')});
    var active = document.getElementById(view === 'listar' ? 'navListarUsuarios' : 'navCrearUsuario');
    if(active) active.classList.add('active');
    var title = document.querySelector('.topbar h1');
    var sub = document.querySelector('.topbar p');
    if(title) title.textContent = view === 'listar' ? 'Usuarios > Listar usuarios' : 'Usuarios > Crear usuario';
    if(sub) sub.textContent = 'Administración de cuentas y permisos del sistema';
  }

  window.__openUsuarios = function(view){
    var env = prepareUsuariosEnv();
    var ov = env.ov;
    var crear = document.getElementById('usuariosCrearView');
    var listar = document.getElementById('usuariosListarView');
    var title = document.getElementById('usuariosTitle');
    var nuevoBtn = document.getElementById('usuariosNuevoBtn');
    if(view === 'listar'){
      crear.style.display = 'none';
      listar.style.display = '';
      title.textContent = 'Usuarios > Listar usuarios';
      nuevoBtn.style.display = '';
      usuariosPage = Math.min(usuariosPage, Math.max(1, Math.ceil(USUARIOS.length / usuariosPageSize)));
      renderTabla();
    } else {
      crear.style.display = '';
      listar.style.display = 'none';
      title.textContent = 'Usuarios > Crear usuario';
      nuevoBtn.style.display = 'none';
    }
    setUsuariosMode(view);
    ov.classList.add('active');
    ov.setAttribute('aria-hidden','false');
  };

  window.__closeUsuarios = function(){
    var ov = document.getElementById('usuariosOverlay');
    var main = document.querySelector('.main');
    ov.classList.remove('active');
    ov.setAttribute('aria-hidden','true');
    if(main) main.classList.remove('usuarios-mode');
  };

  window.__guardarUsuario = function(e){
    e.preventDefault();
    var f = e.target;
    USUARIOS.unshift({
      nombre: f.nombres.value || 'Sin nombre',
      apellido: f.apellidos.value || '',
      correo: f.correo.value,
      region: f.region.value,
      perfil: f.perfil.value,
      enabled: true
    });
    f.reset();
    f.correo.value = 'admin@paulet.com';
    f.password.value = '12345678';
    alert('Usuario guardado correctamente');
    window.__openUsuarios('listar');
  };

  document.addEventListener('click', function(e){
    var nav = e.target.closest && e.target.closest('.sidebar-nav .nav-link');
    if(nav && nav.id !== 'navCrearUsuario' && nav.id !== 'navListarUsuarios'){
      var ov = document.getElementById('usuariosOverlay');
      var main = document.querySelector('.main');
      if(ov){ ov.classList.remove('active'); ov.setAttribute('aria-hidden','true'); }
      if(main) main.classList.remove('usuarios-mode');
    }
    var b = e.target.closest && e.target.closest('.us-btn-action');
    if(b){
      var i = parseInt(b.getAttribute('data-i'),10);
      if(!isNaN(i) && USUARIOS[i]){
        USUARIOS[i].enabled = !USUARIOS[i].enabled;
        renderTabla();
      }
    }
    var pageBtn = e.target.closest && e.target.closest('[data-us-page]');
    if(pageBtn){
      var page = parseInt(pageBtn.getAttribute('data-us-page'),10);
      if(!isNaN(page)){
        usuariosPage = page;
        renderTabla();
      }
    }
    var prev = e.target.closest && e.target.closest('#usuariosPrevPage');
    if(prev){
      usuariosPage = Math.max(1, usuariosPage - 1);
      renderTabla();
    }
    var next = e.target.closest && e.target.closest('#usuariosNextPage');
    if(next){
      usuariosPage += 1;
      renderTabla();
    }
    var n = e.target.closest && e.target.closest('#usuariosNuevoBtn');
    if(n){ window.__openUsuarios('crear'); }
  });
})();

window.openProfilePage = function openProfilePage(){
  var page = document.getElementById('profilePage');
  if(!page) return;
  page.classList.add('active');
  var t = document.querySelector('.topbar h1');
  var s = document.querySelector('.topbar p');
  if(t) t.textContent = 'Perfil';
  if(s){ s.textContent = ''; s.style.display = 'none'; }
};
window.closeProfilePage = function closeProfilePage(){
  var page = document.getElementById('profilePage');
  if(!page) return;
  page.classList.remove('active');
  var s = document.querySelector('.topbar p');
  if(s) s.style.display = '';
  if(typeof showToast === 'function') showToast('Perfil cerrado');
};
(function(){
  var backBtn=document.getElementById('profileBackBtn');
  if(backBtn)backBtn.addEventListener('click',window.closeProfilePage);
})();

(function(){
  if(window.__toolsFlowOverride)return; window.__toolsFlowOverride=true;

  const PAGE_SIZE=5;
  const pageState=new WeakMap();

  function getDocks(){
    const main=document.querySelector('.main');
    if(!main) return [];
    const modeMap={
      'vale-fise-mode':'valeFiseUtilsDock',
      'ahorro-gnv-mode':'gnvUtilsDock',
      'fotovoltaico-mode':'fotoUtilsDock',
      'electricidad-mode':'elecUtilsDock',
      'masificacion-mode':'masifUtilsDock',
      'mcter-mode':'mcterUtilsDock'
    };
    for(const [mode,id] of Object.entries(modeMap)){
      if(main.classList.contains(mode)){
        const d=document.getElementById(id);
        return d?[d]:[];
      }
    }
    if(main.classList.contains('bonogas-active')||main.classList.contains('bonogas-satcontrol-mode')){
      const d=document.getElementById('bonogasUtilsDock');
      return d?[d]:[];
    }
    if(main.classList.contains('project-list-mode')||main.classList.contains('create-project-mode')||main.classList.contains('project-delete-mode')||main.classList.contains('requests-mode')||main.classList.contains('validations-mode')||main.classList.contains('hospital-mode')){
      return [];
    }
    const d=document.getElementById('projectUtilsDock');
    return d?[d]:[];
  }
  function getTools(dock){
    if(dock.id==='projectUtilsDock'){
      return Array.from(dock.querySelectorAll('.pu-module-group .util-btn, .pu-module-tools-host .util-btn')).filter(el=>
        !el.classList.contains('more') &&
        !el.classList.contains('pin') &&
        !el.classList.contains('pu-zoom')
      );
    }
    return Array.from(dock.children).filter(el=>
      el.classList.contains('util-btn') &&
      !el.classList.contains('more') &&
      !el.classList.contains('pin') &&
      !el.classList.contains('pu-zoom')
    );
  }
  function applyPage(dock){
    const tools=getTools(dock);
    if(!tools.length)return;
    const pages=Math.max(1,Math.ceil(tools.length/PAGE_SIZE));
    let p=pageState.get(dock)||0; if(p>=pages)p=0; pageState.set(dock,p);
    tools.forEach((b,i)=>{
      const onPage=Math.floor(i/PAGE_SIZE)===p;
      b.classList.toggle('pu-page-visible', onPage);
      // Clear legacy carousel class so it doesn't keep buttons hidden
      if(onPage) b.classList.remove('util-page-hidden');
    });

  }
  function nextPage(dock){
    const tools=getTools(dock);
    const pages=Math.max(1,Math.ceil(tools.length/PAGE_SIZE));
    const p=((pageState.get(dock)||0)+1)%pages;
    pageState.set(dock,p);
    applyPage(dock);
  }
  function ensureSeparator(dock){
    let sep=dock.querySelector(':scope > .pu-controls-sep');
    if(!sep){
      sep=dock.querySelector(':scope > .pu-page-sep');
      if(sep)sep.classList.add('pu-controls-sep');
    }
    if(sep)return;
    const more=dock.querySelector(':scope > .util-btn.more');
    if(!more)return;
    sep=document.createElement('span');
    sep.className='util-separator pu-page-sep pu-controls-sep';
    sep.setAttribute('aria-hidden','true');
    more.before(sep);
  }
  function expandAllTools(dock){
    dock.classList.remove('extras-open');
    dock.querySelectorAll('.util-btn').forEach(function(b){
      if(b.classList.contains('more')||b.classList.contains('pin')||b.classList.contains('pu-zoom')) return;
      b.classList.remove('util-page-hidden');
    });
  }
  function ensureZoomBtn(dock){
    if(dock.querySelector('.util-btn.pu-zoom'))return;
    const pin=dock.querySelector(':scope > .util-btn.pin')||dock.querySelector(':scope > .pu-controls-row > .util-btn.pin');
    const btn=document.createElement('button');
    btn.type='button';
    btn.className='util-btn icon-plain pu-zoom';
    btn.title='Mostrar todas las herramientas';
    btn.setAttribute('aria-label','Mostrar todas las herramientas');
    btn.innerHTML='<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/><path d="M11 8v6M8 11h6"/></svg>';
    btn.addEventListener('click',(e)=>{
      e.preventDefault();e.stopPropagation();
      const open=dock.classList.toggle('pu-zoom-open');
      btn.classList.toggle('active',open);
      if(open){
        dock.classList.remove('pu-compact');
        expandAllTools(dock);
      }else{
        dock.classList.add('pu-compact');
        applyPage(dock);
      }
    });
    const row=dock.querySelector(':scope > .pu-controls-row');
    if(row){ row.appendChild(btn); }
    else if(pin && pin.parentNode===dock){ pin.after(btn); }
    else { dock.appendChild(btn); }
  }
  function ensureControlsRow(dock){
    ensureSeparator(dock);
    ensureZoomBtn(dock);
    const more=dock.querySelector(':scope > .util-btn.more')||dock.querySelector(':scope > .pu-controls-row > .util-btn.more');
    const pin=dock.querySelector(':scope > .util-btn.pin')||dock.querySelector(':scope > .pu-controls-row > .util-btn.pin');
    const zoom=dock.querySelector(':scope > .util-btn.pu-zoom')||dock.querySelector(':scope > .pu-controls-row > .util-btn.pu-zoom');
    if(!more&&!pin)return;
    let row=dock.querySelector(':scope > .pu-controls-row');
    if(!row){
      row=document.createElement('div');
      row.className='pu-controls-row';
      row.setAttribute('aria-label','Controles del panel');
      const sep=dock.querySelector(':scope > .pu-controls-sep');
      if(sep){ sep.after(row); }
      else if(more){ more.before(row); }
      else { dock.appendChild(row); }
    }
    [more,pin,zoom].filter(Boolean).forEach(function(btn){
      if(btn.parentNode!==row) row.appendChild(btn);
    });
  }

  function prepareUtilsDock(d){
    if(!d) return;
    d.classList.remove('extras-open');
    d.querySelectorAll('.util-page-hidden').forEach(function(el){el.classList.remove('util-page-hidden');});
    if(d.dataset.puPrepared!=='1'){
      d.dataset.puPrepared='1';
      d.classList.add('pu-hidden','is-pinned');
      d.classList.remove('pu-compact','pu-zoom-open','pu-floating','pu-dragging');
      d.style.removeProperty('--pu-x');
      d.style.removeProperty('--pu-y');
    }
    ensureControlsRow(d);
    applyPage(d);
  }
  function prepareAllUtilsDocks(){
    document.querySelectorAll('.project-utils-dock').forEach(prepareUtilsDock);
    if(typeof window.ensureBonogasStratButtonInDock==='function')window.ensureBonogasStratButtonInDock();
    wireToolsBtns();
  }
  window.__prepareUtilsDocks=prepareAllUtilsDocks;

  function setHidden(hidden){
    getDocks().forEach(d=>{
      ensureControlsRow(d);
      d.classList.remove('extras-open');
      if(hidden){
        d.classList.add('pu-hidden');
        d.classList.remove('pu-compact','pu-zoom-open','pu-floating','pu-dragging');
        d.removeAttribute('data-utils-visible');
        d.classList.add('is-pinned');
        d.style.removeProperty('--pu-x');
        d.style.removeProperty('--pu-y');
        const z=d.querySelector('.util-btn.pu-zoom'); if(z)z.classList.remove('active');
        const pin=d.querySelector('.util-btn.pin');
        if(pin){pin.classList.add('active');pin.setAttribute('aria-pressed','true');}
      }else{
        d.classList.remove('pu-hidden');
        d.classList.add('pu-compact','is-pinned');
        d.setAttribute('data-utils-visible','true');
        if(d.id==='projectUtilsDock'&&typeof window.buildProyectosModuleToolsHub==='function'){
          window.buildProyectosModuleToolsHub();
        }
        applyPage(d);
      }
    });
  }

  function toggleUtilsDock(){
    if(typeof window.__prepareUtilsDocks==='function') window.__prepareUtilsDocks();
    let docks=getDocks();
    if(!docks.length){
      if(typeof showToast==='function') showToast('Utilitarios no disponibles en esta vista. Use http://localhost (no file://).');
      return;
    }
    const anyVisible=docks.some(d=>d.getAttribute('data-utils-visible')==='true'&&!d.classList.contains('pu-hidden'));
    setHidden(anyVisible);
    document.querySelectorAll('#toolsBtn').forEach(function(btn){
      if(!btn.closest('.topbar')) return;
      btn.classList.toggle('active',!anyVisible);
    });
  }
  window.toggleUtilsDock=toggleUtilsDock;

  function wireToolsBtns(){
    document.querySelectorAll('#toolsBtn').forEach(function(btn){
      if(!btn.closest('.topbar')||btn.dataset.toolsBound==='1') return;
      btn.dataset.toolsBound='1';
      btn.addEventListener('click',function(e){
        e.preventDefault();
        e.stopImmediatePropagation();
        toggleUtilsDock();
      },true);
    });
  }
  window.wireToolsBtns=wireToolsBtns;


  /* Free-viewport drag via pin — sistema único para todos los docks.
     FIX v2.4: los módulos integrados (Vale FISE → MCTER) renderizan un <iframe>
     debajo del dock. Cuando el cursor cruza el iframe durante el drag, los
     eventos pointermove/pointerup se los queda el iframe (otro documento) y el
     arrastre se rompe. Solución:
       1) setPointerCapture en el botón pin para que TODOS los pointer events
          sigan llegando al pin aunque el cursor pase sobre el iframe.
       2) Deshabilitar pointer-events en los iframes mientras dura el drag
          (cinturón y tirantes, por si el navegador rompe la captura). */
  function wirePinDrag(){
    function setIframesPassthrough(on){
      document.querySelectorAll('iframe').forEach(function(f){
        if(on){
          if(!f.dataset.puPrevPe){f.dataset.puPrevPe=f.style.pointerEvents||'__empty__';}
          f.style.pointerEvents='none';
        }else{
          var prev=f.dataset.puPrevPe;
          if(prev!=null){
            f.style.pointerEvents = (prev==='__empty__'?'':prev);
            delete f.dataset.puPrevPe;
          }
        }
      });
    }

    document.addEventListener('pointerdown',function(ev){
      const pin=ev.target.closest('.util-btn.pin');
      if(!pin)return;
      const dock=pin.closest('.project-utils-dock');
      if(!dock)return;
      ev.preventDefault(); ev.stopPropagation();

      // Capturar el puntero en el pin: garantiza que pointermove/pointerup
      // sigan llegando aunque el cursor pase sobre un iframe u otro elemento.
      try{ pin.setPointerCapture(ev.pointerId); }catch(_){}

      let dragged=false;
      const pointerId=ev.pointerId;
      const ptrStartX=ev.clientX, ptrStartY=ev.clientY;
      let offX=0, offY=0;

      function move(e){
        if(e.pointerId!==pointerId)return;
        if(!dragged && Math.abs(e.clientX-ptrStartX)<5 && Math.abs(e.clientY-ptrStartY)<5)return;

        if(!dragged){
          dragged=true;
          // Bloquear iframes para que no se traguen los pointer events
          setIframesPassthrough(true);
          const r=dock.getBoundingClientRect();
          dock.classList.add('pu-floating','pu-dragging');
          dock.classList.remove('is-pinned');
          dock.style.setProperty('--pu-x', r.left+'px');
          dock.style.setProperty('--pu-y', r.top+'px');
          offX = ptrStartX - r.left;
          offY = ptrStartY - r.top;
        }

        const w=dock.offsetWidth, h=dock.offsetHeight;
        let x=e.clientX - offX;
        let y=e.clientY - offY;
        x=Math.max(4, Math.min(x, window.innerWidth  - w - 4));
        y=Math.max(4, Math.min(y, window.innerHeight - h - 4));
        dock.style.setProperty('--pu-x', x+'px');
        dock.style.setProperty('--pu-y', y+'px');
      }

      function cleanup(){
        dock.classList.remove('pu-dragging');
        setIframesPassthrough(false);
        try{ pin.releasePointerCapture(pointerId); }catch(_){}
        pin.removeEventListener('pointermove', move);
        pin.removeEventListener('pointerup', up);
        pin.removeEventListener('pointercancel', up);
        window.removeEventListener('pointermove', move, true);
        window.removeEventListener('pointerup',   up,   true);
        window.removeEventListener('pointercancel', up, true);
      }

      function up(e){
        if(e && e.pointerId!==pointerId)return;
        cleanup();

        if(!dragged){
          // Click puro (sin drag): toggle anclado ↔ flotante
          if(dock.classList.contains('pu-floating')){
            dock.classList.remove('pu-floating');
            dock.classList.add('is-pinned');
            dock.style.removeProperty('--pu-x');
            dock.style.removeProperty('--pu-y');
            pin.classList.add('active');
            pin.setAttribute('aria-pressed','true');
            pin.title='Fijar utilitarios en esta posición';
          }else{
            const r=dock.getBoundingClientRect();
            dock.classList.add('pu-floating');
            dock.classList.remove('is-pinned');
            dock.style.setProperty('--pu-x', r.left+'px');
            dock.style.setProperty('--pu-y', r.top+'px');
            pin.classList.remove('active');
            pin.setAttribute('aria-pressed','false');
            pin.title='Mover utilitarios';
          }
        }
      }

      // Listeners en el pin (pointer capture) + fallback en window
      pin.addEventListener('pointermove', move);
      pin.addEventListener('pointerup', up);
      pin.addEventListener('pointercancel', up);
      window.addEventListener('pointermove', move, true);
      window.addEventListener('pointerup',   up,   true);
      window.addEventListener('pointercancel', up, true);
    }, true);
  }

  function boot(){
    /* Ocultar TODOS los docks al inicio sin importar el modo */
    document.querySelectorAll('.project-utils-dock').forEach(d=>{
      d.classList.add('pu-hidden','is-pinned');
      d.classList.remove('pu-compact','pu-zoom-open','pu-floating','pu-dragging','extras-open');
      d.removeAttribute('data-utils-visible');
      d.style.removeProperty('--pu-x');
      d.style.removeProperty('--pu-y');
    });
    prepareAllUtilsDocks();
    wirePinDrag();

    /* Al cambiar de modo (navegación entre módulos), ocultar el dock anterior
       y preparar el nuevo con pu-hidden para que toolsBtn lo controle */
    function onModeChange(){
      document.querySelectorAll('.project-utils-dock').forEach(d=>{
        d.classList.add('pu-hidden');
        d.classList.remove('pu-compact','pu-zoom-open','pu-floating','pu-dragging','extras-open');
        d.removeAttribute('data-utils-visible');
        d.style.removeProperty('--pu-x');
        d.style.removeProperty('--pu-y');
      });
      document.querySelectorAll('#toolsBtn').forEach(function(b){
        if(b.closest('.topbar')) b.classList.remove('active');
      });
      wireToolsBtns();
    }

    /* Observar cambios de clase en .main para detectar cambio de modo */
    const mainEl=document.querySelector('.main');
    if(mainEl){
      let lastClasses=mainEl.className;
      new MutationObserver(()=>{
        if(mainEl.className!==lastClasses){
          lastClasses=mainEl.className;
          onModeChange();
        }
      }).observe(mainEl,{attributes:true,attributeFilter:['class']});
    }

    // 3-dots (more) acts as page carousel in compact mode.
    document.addEventListener('click',function(ev){
      const more=ev.target.closest('.project-utils-dock .util-btn.more');
      if(!more)return;
      const dock=more.closest('.project-utils-dock');
      if(!dock)return;
      if(dock.classList.contains('pu-zoom-open'))return;
      if(!dock.classList.contains('pu-compact'))return;
      ev.preventDefault(); ev.stopPropagation(); ev.stopImmediatePropagation();
      nextPage(dock);
    },true);
    // Re-wire when DOM mutates (administrador.html inyecta docks después del boot)
    new MutationObserver(()=>{
      let added=false;
      document.querySelectorAll('.project-utils-dock').forEach(function(d){
        if(d.dataset.puPrepared!=='1'){ prepareUtilsDock(d); added=true; }
      });
      if(added){
        wireToolsBtns();
        if(typeof window.buildProyectosModuleToolsHub==='function') window.buildProyectosModuleToolsHub();
        if(typeof window.wireProyectosModuleToolProxies==='function') window.wireProyectosModuleToolProxies();
        if(typeof window.bindGeoJsonUploadWorkflowButtons==='function')window.bindGeoJsonUploadWorkflowButtons();
      }
    }).observe(document.body||document.documentElement,{childList:true,subtree:true});
  }


  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',boot,{once:true});
  }else{ boot(); }
})();

(function(){
  function gnvAiSetStep(n){
    document.querySelectorAll('#gnvAiValidacionModal .ai-step').forEach(function(el){
      el.classList.toggle('active',el.dataset.step==String(n));
    });
    document.querySelectorAll('#gnvAiStepper .st').forEach(function(el){
      var s=Number(el.dataset.st);
      el.classList.toggle('active',s===n);
      el.classList.toggle('done',s<n);
    });
  }
  function gnvAiReset(){gnvAiSetStep(1);}
  function gnvAiClose(){
    if(typeof closeModal==='function')closeModal('gnvAiValidacionModal');
    else{
      var m=document.querySelector('#gnvAiValidacionModal');
      if(m)m.classList.remove('open');
    }
    setTimeout(gnvAiReset,200);
  }
  function openGnvAiValidacionModal(){
    gnvAiReset();
    if(typeof openModal==='function')openModal('gnvAiValidacionModal');
    else{
      var m=document.querySelector('#gnvAiValidacionModal');
      if(m)m.classList.add('open');
    }
    if(typeof showToast==='function')showToast('Validaciones IA · Ahorro GNV');
  }
  window.openGnvAiValidacionModal=openGnvAiValidacionModal;
  document.addEventListener('click',function(e){
    if(e.target.closest('#gnvAiGoScanBtn')){
      gnvAiSetStep(2);
      setTimeout(function(){gnvAiSetStep(3);},2000);
      return;
    }
    if(e.target.closest('#gnvAiBackUploadBtn')){gnvAiReset();return;}
    if(e.target.closest('[data-open-gnv-ai-flow]')){openGnvAiValidacionModal();return;}
    if(e.target.closest('[data-close="gnvAiValidacionModal"]')){gnvAiClose();return;}
    if(e.target.id==='gnvAiValidacionModal'){gnvAiClose();}
  });
  document.querySelectorAll('#gnvAiValidacionModal [data-close]').forEach(function(btn){
    btn.addEventListener('click',function(e){e.preventDefault();gnvAiClose();});
  });
})();

(function(){
  function bonogasAiSetStep(n){
    document.querySelectorAll('#bonogasAiValidacionModal .ai-step').forEach(function(el){
      el.classList.toggle('active',el.dataset.step==String(n));
    });
    document.querySelectorAll('#bonogasAiStepper .st').forEach(function(el){
      var s=Number(el.dataset.st);
      el.classList.toggle('active',s===n);
      el.classList.toggle('done',s<n);
    });
  }
  function bonogasAiReset(){bonogasAiSetStep(1);}
  function bonogasAiClose(){
    if(typeof closeModal==='function')closeModal('bonogasAiValidacionModal');
    else{
      var m=document.querySelector('#bonogasAiValidacionModal');
      if(m)m.classList.remove('open');
    }
    setTimeout(bonogasAiReset,200);
  }
  function openBonogasAiValidacionModal(){
    bonogasAiReset();
    if(typeof openModal==='function')openModal('bonogasAiValidacionModal');
    else{
      var m=document.querySelector('#bonogasAiValidacionModal');
      if(m)m.classList.add('open');
    }
    if(typeof showToast==='function')showToast('Validación IA · Bono Gas');
  }
  window.openBonogasAiValidacionModal=openBonogasAiValidacionModal;
  document.addEventListener('click',function(e){
    if(e.target.closest('#bonogasAiGoScanBtn')){
      bonogasAiSetStep(2);
      setTimeout(function(){bonogasAiSetStep(3);},2000);
      return;
    }
    if(e.target.closest('#bonogasAiBackUploadBtn')){bonogasAiReset();return;}
    if(e.target.closest('[data-open-bonogas-ai-flow]')){openBonogasAiValidacionModal();return;}
    if(e.target.closest('[data-close="bonogasAiValidacionModal"]')){bonogasAiClose();return;}
    if(e.target.id==='bonogasAiValidacionModal'){bonogasAiClose();}
  });
  document.querySelectorAll('#bonogasAiValidacionModal [data-close]').forEach(function(btn){
    btn.addEventListener('click',function(e){e.preventDefault();bonogasAiClose();});
  });
})();

(function(){
'use strict';
var qs=function(s){return document.querySelector(s);};

/* ── Datos mock de morosidad ─────────────────────────────── */
var GNV_MOR_DATA=[
  {placa:'ABC-123',nombre:'Carlos Quispe Huamaní',taller:'AutoGas Norte S.A.C.',cuotas:3,monto:840,estado:'Atrasado'},
  {placa:'DEF-456',nombre:'María Torres Flores',taller:'GNV Conversiones E.I.R.L.',cuotas:1,monto:280,estado:'Con mora'},
  {placa:'GHI-789',nombre:'Luis Paredes Vega',taller:'Taller Central GNV S.A.C.',cuotas:0,monto:0,estado:'Al día'},
  {placa:'JKL-012',nombre:'Rosa Mamani Ccori',taller:'Mecánica Trujillo GNV',cuotas:5,monto:1400,estado:'Atrasado'},
  {placa:'MNO-345',nombre:'Pedro Salas Córdova',taller:'AutoGas Norte S.A.C.',cuotas:2,monto:560,estado:'Con mora'},
  {placa:'PQR-678',nombre:'Elena Chávez Ruiz',taller:'GNV Conversiones E.I.R.L.',cuotas:0,monto:0,estado:'Al día'},
  {placa:'STU-901',nombre:'Javier López Mendoza',taller:'Taller Central GNV S.A.C.',cuotas:4,monto:1120,estado:'Atrasado'},
  {placa:'VWX-234',nombre:'Ana Gutierrez Pinto',taller:'Mecánica Trujillo GNV',cuotas:1,monto:280,estado:'Con mora'},
  {placa:'YZA-567',nombre:'Roberto Cáceres Díaz',taller:'AutoGas Norte S.A.C.',cuotas:0,monto:0,estado:'Al día'},
  {placa:'BCD-890',nombre:'Sandra Quispe Lima',taller:'GNV Conversiones E.I.R.L.',cuotas:6,monto:1680,estado:'Atrasado'}
];
var gnvMorFiltered=GNV_MOR_DATA.slice();
var gnvMorPage=1;
var gnvMorPageSize=5;
var gnvOperationalView='weekly';
var gnvCurrentMessage=null;
var GNV_OPERATION_META=[
  ['Semana 27','Primax Javier Prado','BCP','Lima','Lima',18,'2026-07-08',420,4],['Semana 27','Petroperú Arequipa','Interbank','Arequipa','Arequipa',5,'2026-07-09',280,1],['Semana 28','Grifo El Sol','BCP','Cusco','Cusco',24,'2026-07-10',0,2],['Semana 28','Primax Trujillo','Interbank','La Libertad','Trujillo',22,'2026-07-11',560,5],['Semana 28','Petroperú Arequipa','BCP','Arequipa','Cerro Colorado',3,'2026-07-12',280,2],['Semana 28','Grifo Norte GNV','Interbank','Amazonas','Bagua',8,'2026-07-12',0,3],['Semana 29','Primax Javier Prado','BCP','Lima','San Isidro',37,'2026-07-13',280,6],['Semana 29','Primax Trujillo','Interbank','La Libertad','Trujillo',12,'2026-07-14',140,2],['Semana 29','Grifo El Sol','BCP','Cusco','Cusco',31,'2026-07-15',0,1],['Semana 29','Primax Javier Prado','Interbank','Lima','Lima',45,'2026-07-16',0,6]
];
GNV_MOR_DATA.forEach(function(row,index){var meta=GNV_OPERATION_META[index];row.semana=meta[0];row.grifo=meta[1];row.banco=meta[2];row.region=meta[3];row.distrito=meta[4];row.diasSinAbastecer=meta[5];row.fechaAbono=meta[6];row.montoAbono=meta[7];row.recargas=meta[8];row.bonoProvincia=row.region!=='Lima'&&row.diasSinAbastecer>30?'Perdido':row.region!=='Lima'&&row.diasSinAbastecer>=21?'En riesgo':'Vigente';});

/* ── formato moneda ─────────────────────────────────────── */
function fmt(n){return'S/ '+Number(n||0).toLocaleString('es-PE',{minimumFractionDigits:2,maximumFractionDigits:2});}
function escCsv(value){var s=String(value==null?'':value);return /[",\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s;}
function opTable(headers,rows){return '<div class="gnv-op-table-wrap"><table class="gnv-op-table"><thead><tr>'+headers.map(function(h){return'<th>'+h+'</th>';}).join('')+'</tr></thead><tbody>'+rows.map(function(row){return'<tr>'+row.map(function(cell){return'<td>'+cell+'</td>';}).join('')+'</tr>';}).join('')+'</tbody></table></div>';}
function opKpis(items){return'<div class="gnv-op-kpis">'+items.map(function(item){return'<div class="gnv-op-kpi"><span>'+item[0]+'</span><b>'+item[1]+'</b></div>';}).join('')+'</div>';}
function operationalRows(){return GNV_MOR_DATA.slice();}
function renderOperationalReport(){var box=qs('#gnvOperationalReport');if(!box)return;var rows=operationalRows(),html='';
  if(gnvOperationalView==='weekly'){var weeks=['Semana 27','Semana 28','Semana 29'];var weekly=weeks.map(function(w){var set=rows.filter(function(r){return r.semana===w;}),debt=set.reduce(function(s,r){return s+r.monto;},0),paid=set.reduce(function(s,r){return s+r.montoAbono;},0);return[w,set.length,fmt(debt),fmt(paid),set.reduce(function(s,r){return s+r.recargas;},0)];});html=opKpis([['Semanas reportadas',weeks.length],['Morosidad',fmt(rows.reduce(function(s,r){return s+r.monto;},0))],['Cobrado',fmt(rows.reduce(function(s,r){return s+r.montoAbono;},0))],['Recargas',rows.reduce(function(s,r){return s+r.recargas;},0)]])+opTable(['Semana','Vehículos','Morosidad','Abonos','Recargas'],weekly);}
  else if(gnvOperationalView==='consumption'){html=opKpis([['Grifos',new Set(rows.map(function(r){return r.grifo;})).size],['Bancos',new Set(rows.map(function(r){return r.banco;})).size],['Recargas',rows.reduce(function(s,r){return s+r.recargas;},0)],['Distritos',new Set(rows.map(function(r){return r.distrito;})).size]])+opTable(['Placa','Grifo','Banco / canal','Distrito','Recargas'],rows.map(function(r){return[r.placa,r.grifo,r.banco,r.distrito,r.recargas];}));}
  else if(gnvOperationalView==='payments'){html=opKpis([['Abonos registrados',rows.filter(function(r){return r.montoAbono>0;}).length],['Total abonado',fmt(rows.reduce(function(s,r){return s+r.montoAbono;},0))],['Talleres',new Set(rows.map(function(r){return r.taller;})).size],['Entidades',2]])+opTable(['Fecha','Placa','Beneficiario','Entidad','Monto abonado'],rows.map(function(r){return[r.fechaAbono,r.placa,r.nombre,r.banco,fmt(r.montoAbono)];}));}
  else{var lost=rows.filter(function(r){return r.bonoProvincia==='Perdido';}),risk=rows.filter(function(r){return r.bonoProvincia==='En riesgo';});html=opKpis([['Bono perdido',lost.length],['En riesgo',risk.length],['Límite Lima','30 días'],['Sin abastecer >3 sem.',rows.filter(function(r){return r.diasSinAbastecer>21;}).length]])+'<div class="gnv-op-alert">Alerta automática: vehículos convertidos fuera de Lima que permanecen más de 30 días calendario en Lima o superan tres semanas sin abastecimiento.</div>'+opTable(['Placa','Región de conversión','Días','Último grifo','Estado'],lost.concat(risk).map(function(r){return[r.placa,r.region,r.diasSinAbastecer,r.grifo,r.bonoProvincia];}));}
  box.innerHTML=html;
}
function exportOperationalReport(){var rows=operationalRows(),headers=['Semana','Placa','Beneficiario','Región','Distrito','Grifo','Banco','Recargas','Fecha abono','Monto abono','Días sin abastecer','Bono Provincia','Cuotas vencidas','Monto moroso'];var lines=[headers.map(escCsv).join(',')].concat(rows.map(function(r){return[r.semana,r.placa,r.nombre,r.region,r.distrito,r.grifo,r.banco,r.recargas,r.fechaAbono,r.montoAbono,r.diasSinAbastecer,r.bonoProvincia,r.cuotas,r.monto].map(escCsv).join(',');}));var blob=new Blob(['\uFEFF'+lines.join('\n')],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='reporte_'+gnvOperationalView+'_ahorro_gnv.csv';a.click();setTimeout(function(){URL.revokeObjectURL(url);},800);if(window.showToast)showToast('Reporte operativo GNV exportado');}

/* ── badge de estado ─────────────────────────────────────── */
function morBadge(e){
  var map={Atrasado:'background:#ef444420;color:#ef4444;border:1px solid #ef444440',
           'Con mora':'background:#f59e0b20;color:#f59e0b;border:1px solid #f59e0b40',
           'Al día':'background:#22c55e20;color:#22c55e;border:1px solid #22c55e40'};
  var s=map[e]||map['Al día'];
  return '<span style="display:inline-block;border-radius:999px;padding:3px 9px;font-size:10px;font-weight:950;'+s+'">'+e+'</span>';
}

/* ── KPIs ─────────────────────────────────────────────────── */
function renderMorKpis(data){
  var total=data.length;
  var atrasados=data.filter(function(r){return r.estado==='Atrasado';}).length;
  var montoTotal=data.reduce(function(a,r){return a+r.monto;},0);
  var enMora=data.filter(function(r){return r.estado==='Con mora';}).length;
  var box=qs('#gnvMorDetKpis');
  if(!box)return;
  box.innerHTML=[
    {l:'Total beneficiarios',v:total,s:'Registros activos',c:''},
    {l:'Atrasados',v:atrasados,s:'Requieren gestión inmediata',c:'color:#ef4444'},
    {l:'Con mora',v:enMora,s:'Seguimiento activo',c:'color:#f59e0b'},
    {l:'Monto moroso total',v:fmt(montoTotal),s:'S/ acumulado',c:'color:#ef4444'}
  ].map(function(k){
    return '<div class="doc-kpi"><span>'+k.l+'</span><b style="'+k.c+'">'+k.v+'</b><small>'+k.s+'</small></div>';
  }).join('');
}

/* ── Tabla ──────────────────────────────────────────────── */
function renderMorTable(data){
  var tbody=qs('#gnvMorDetTbody');
  if(!tbody)return;
  if(!data.length){
    tbody.innerHTML='<tr><td colspan="7" style="text-align:center;color:#64748b;padding:20px">Sin registros para los filtros aplicados.</td></tr>';
    gnvMorPage=1;renderMorPagination(0,1);
    return;
  }
  var totalPages=Math.max(1,Math.ceil(data.length/gnvMorPageSize));
  gnvMorPage=Math.min(Math.max(1,gnvMorPage),totalPages);
  var pageRows=data.slice((gnvMorPage-1)*gnvMorPageSize,gnvMorPage*gnvMorPageSize);
  tbody.innerHTML=pageRows.map(function(r){
    var msgBtn=r.monto>0
      ?'<button type="button" class="gnv-mor-row-msg-btn" data-placa="'+r.placa+'" data-nombre="'+r.nombre.replace(/"/g,'&quot;')+'" data-monto="'+r.monto+'" data-cuotas="'+r.cuotas+'" style="height:30px;padding:0 10px;border:0;border-radius:8px;background:#0ea5e9;color:#fff;font-weight:950;font-size:11px;cursor:pointer;display:inline-flex;align-items:center;gap:5px;white-space:nowrap"><svg style="width:12px;height:12px;stroke:currentColor;stroke-width:2;fill:none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg> Mensaje</button>'
      :'<span style="color:#64748b;font-size:11px">—</span>';
    return '<tr>'
      +'<td style="padding:9px 10px;border-bottom:1px solid #1f3156"><b>'+r.placa+'</b></td>'
      +'<td style="padding:9px 10px;border-bottom:1px solid #1f3156">'+r.nombre+'</td>'
      +'<td style="padding:9px 10px;border-bottom:1px solid #1f3156;color:#93a4c7">'+r.taller+'</td>'
      +'<td style="padding:9px 10px;border-bottom:1px solid #1f3156;text-align:center">'+(r.cuotas>0?'<b style="color:#ef4444">'+r.cuotas+'</b>':'0')+'</td>'
      +'<td style="padding:9px 10px;border-bottom:1px solid #1f3156">'+(r.monto>0?'<b style="color:#ef4444">'+fmt(r.monto)+'</b>':'<span style="color:#22c55e">—</span>')+'</td>'
      +'<td style="padding:9px 10px;border-bottom:1px solid #1f3156">'+morBadge(r.estado)+'</td>'
      +'<td style="padding:9px 10px;border-bottom:1px solid #1f3156;text-align:center">'+msgBtn+'</td>'
      +'</tr>';
  }).join('');
  renderMorPagination(data.length,totalPages);
}

function renderMorPagination(total,totalPages){
  var first=total?((gnvMorPage-1)*gnvMorPageSize)+1:0,last=Math.min(gnvMorPage*gnvMorPageSize,total),summary=qs('#gnvMorDetPageSummary'),numbers=qs('#gnvMorDetPageNumbers'),prev=qs('#gnvMorDetPrev'),next=qs('#gnvMorDetNext');
  if(summary)summary.textContent=total?'Mostrando '+first+'–'+last+' de '+total+' registros':'Sin registros';
  if(numbers)numbers.innerHTML=Array.from({length:totalPages},function(_,index){var page=index+1,active=page===gnvMorPage;return '<button type="button" data-gnv-mor-page="'+page+'" style="width:30px;height:30px;border:1px solid '+(active?'#22d3ee':'#33476f')+';background:'+(active?'#0891b2':'#111d36')+';color:#fff;border-radius:8px;font-weight:900;cursor:pointer">'+page+'</button>';}).join('');
  if(prev){prev.disabled=gnvMorPage<=1;prev.style.opacity=prev.disabled?'.4':'1';}
  if(next){next.disabled=gnvMorPage>=totalPages;next.style.opacity=next.disabled?'.4':'1';}
}

/* ── Filtros ─────────────────────────────────────────────── */
function applyMorFilters(){
  var search=(qs('#gnvMorDetSearch')?.value||'').toLowerCase().trim();
  var fEstado=qs('#gnvMorDetFilterEstado')?.value||'';
  gnvMorFiltered=GNV_MOR_DATA.filter(function(r){
    if(search&&!r.nombre.toLowerCase().includes(search)&&!r.placa.toLowerCase().includes(search))return false;
    if(fEstado&&r.estado!==fEstado)return false;
    return true;
  });
  gnvMorPage=1;
  renderMorTable(gnvMorFiltered);
  renderMorKpis(gnvMorFiltered);
}

/* ── Exportar CSV morosidad ──────────────────────────────── */
function exportMorCsv(){
  var headers=['Placa','Beneficiario','Taller','Cuotas atrasadas','Monto atrasado (S/)','Estado'];
  var rows=gnvMorFiltered.map(function(r){
    return[r.placa,r.nombre,r.taller,r.cuotas,r.monto,r.estado].join(',');
  });
  var csv=[headers.join(',')].concat(rows).join('\n');
  var blob=new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8;'});
  var url=URL.createObjectURL(blob);
  var a=document.createElement('a');
  a.href=url;a.download='morosidad-gnv.csv';
  document.body.appendChild(a);a.click();
  document.body.removeChild(a);
  setTimeout(function(){URL.revokeObjectURL(url);},800);
  if(window.showToast)showToast('CSV de morosidad exportado');
}

/* ── Abrir modal de mensaje ──────────────────────────────── */
function openMsgModal(placa,nombre,monto,cuotas){
  gnvCurrentMessage={placa:placa,nombre:nombre,monto:monto,cuotas:cuotas};
  var msg=
    'Estimado(a) Beneficiario(a) del Programa Ahorro GNV – '+nombre+'\n\n'
   +'Reciba un cordial saludo. A través de la presente, le comunicamos que, a la fecha, presenta un monto atrasado de pago por S/ '+Number(monto).toLocaleString('es-PE')+' correspondiente al financiamiento otorgado para la conversión a GNV de su vehículo con placa '+placa+' realizado con recursos del Fondo de Inclusión Social Energético (FISE).\n\n'
   +'Para conocer el detalle de su deuda, puede ingresar a la plataforma de Consultas de Pagos FISE mediante el siguiente enlace:\n'
   +'https://fise.minem.gob.pe:23308/consulta-taller/pages/consultaTaller/inicio\n\n'
   +'El pago del monto atrasado puede efectuarse en los bancos BCP (por ventanilla, agente, Banca por Internet o Banca Móvil) o INTERBANK (a través de Banca por Internet, Interbank APP, agente INTERBANK o IzipayYA). Los pasos para realizar el pago se encuentran disponibles en el siguiente enlace:\n'
   +'https://fise.pe/ahorro-gnv/\n\n'
   +'Le solicitamos efectuar la regularización del pago a la brevedad posible. En caso de no realizarlo, la deuda será reportada a la central de riesgos correspondiente.';

  var nb=qs('#gnvMsgNombre'); if(nb)nb.textContent=nombre;
  var pb=qs('#gnvMsgPlaca');  if(pb)pb.textContent=placa;
  var mb=qs('#gnvMsgMonto');  if(mb)mb.textContent=fmt(monto);
  var cb=qs('#gnvMsgCuotas'); if(cb)cb.textContent=cuotas+' cuota'+(cuotas!=1?'s':'');
  var ta=qs('#gnvMsgTexto');  if(ta)ta.value=msg;
  var template=qs('#gnvMsgTemplate');if(template)template.value=cuotas>=3?'three':'automatic';

  var m=qs('#gnvMorMsgModal');
  if(m)m.classList.add('open');
}
function refreshCollectionTemplate(){if(!gnvCurrentMessage)return;var r=gnvCurrentMessage,type=qs('#gnvMsgTemplate')?.value||'automatic',intro=type==='three'?'Hemos detectado tres o más cuotas vencidas, por lo que su cuenta requiere regularización inmediata.':type==='factor'?'Se detectó un incremento del factor de recaudo y un saldo pendiente que requiere revisión.':type==='reminder'?'Le recordamos que mantiene una cuota próxima o pendiente de regularización.':'Se ha detectado un saldo pendiente en su financiamiento Ahorro GNV.';var text='Estimado(a) '+r.nombre+',\n\n'+intro+'\n\nPlaca: '+r.placa+'\nCuotas vencidas: '+r.cuotas+'\nMonto exacto adeudado: '+fmt(r.monto)+'\n\nPuede pagar mediante BCP o Interbank por ventanilla, agente, banca web o aplicación móvil. Consulte el detalle en https://fise.pe/ahorro-gnv/.\n\nSi ya realizó el pago, omita este mensaje.';var ta=qs('#gnvMsgTexto');if(ta)ta.value=text;}

/* ── Exportar dashboard (CSV y PDF) ─────────────────────── */
function exportDashboardCsv(){
  var headers=['Ámbito','Conversiones','Liquidadas','Morosidad (S/)','Avance (%)','Estado operativo'];
  var rows=[];
  var tbody=qs('#gnvScopeTableBody');
  if(tbody){
    tbody.querySelectorAll('tr').forEach(function(tr){
      var cells=tr.querySelectorAll('td');
      if(cells.length>=5){
        rows.push([cells[0].textContent,cells[1].textContent,cells[2].textContent,cells[3].textContent,cells[4].textContent,(cells[5]?cells[5].textContent:'')].join(','));
      }
    });
  }
  if(!rows.length){rows.push('Sin datos disponibles');}
  var csv=[headers.join(',')].concat(rows).join('\n');
  var blob=new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8;'});
  var url=URL.createObjectURL(blob);
  var a=document.createElement('a');
  a.href=url;a.download='dashboard-ahorro-gnv.csv';
  document.body.appendChild(a);a.click();
  document.body.removeChild(a);
  setTimeout(function(){URL.revokeObjectURL(url);},800);
  if(window.showToast)showToast('CSV del dashboard exportado');
}

function exportDashboardPdf(){
  var rows='';
  var tbody=qs('#gnvScopeTableBody');
  if(tbody){
    tbody.querySelectorAll('tr').forEach(function(tr){
      var cells=tr.querySelectorAll('td');
      rows+='<tr>';
      cells.forEach(function(td){rows+='<td>'+td.textContent+'</td>';});
      rows+='</tr>';
    });
  }
  var kpiText='';
  var kgrid=qs('#gnvKpiGrid');
  if(kgrid){
    kgrid.querySelectorAll('.gnv-kpi-card').forEach(function(card){
      var label=card.querySelector('span')?.textContent||'';
      var value=card.querySelector('b')?.textContent||'';
      kpiText+='<div style="display:inline-block;margin:4px 8px;padding:10px 14px;border:1px solid #e2e8f0;border-radius:10px;min-width:140px"><b style="display:block;font-size:20px;color:#1e3a8a">'+value+'</b><span style="font-size:11px;color:#64748b">'+label+'</span></div>';
    });
  }
  var html='<!doctype html><html><head><meta charset="utf-8"><title>Dashboard Ahorro GNV</title>'
    +'<style>body{font-family:Arial,sans-serif;font-size:11px;color:#111;padding:20px}h1{font-size:17px;margin:0 0 4px;color:#1e3a8a}p{color:#64748b;margin:0 0 16px;font-size:12px}.kpis{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px}table{width:100%;border-collapse:collapse}th{background:#0f172a;color:#fff;padding:7px 10px;text-align:left;font-size:11px}td{padding:6px 10px;border-bottom:1px solid #e2e8f0}</style>'
    +'</head><body><h1>Dashboard Ahorro GNV · SATCONTROL</h1><p>Exportación generada el '+new Date().toLocaleDateString('es-PE')+'</p>'
    +'<div class="kpis">'+kpiText+'</div>'
    +'<table><thead><tr><th>Ámbito</th><th>Conversiones</th><th>Liquidadas</th><th>Morosidad</th><th>Avance</th><th>Estado</th></tr></thead><tbody>'+rows+'</tbody></table>'
    +'</body></html>';
  var win=window.open('','_blank','width=1050,height=720');
  if(!win){if(window.showToast)showToast('Permite ventanas emergentes para exportar PDF');return;}
  win.document.write(html);win.document.close();win.focus();
  setTimeout(function(){win.print();},450);
}

/* ── función central para abrir el modal de morosidad ────── */
function openGnvMorosityModal(){
  gnvMorFiltered=GNV_MOR_DATA.slice();
  gnvMorPage=1;
  var s=qs('#gnvMorDetSearch');if(s)s.value='';
  var f=qs('#gnvMorDetFilterEstado');if(f)f.value='';
  renderMorKpis(gnvMorFiltered);
  renderMorTable(gnvMorFiltered);
  gnvOperationalView='weekly';document.querySelectorAll('[data-gnv-operational-report]').forEach(function(btn){btn.classList.toggle('active',btn.dataset.gnvOperationalReport==='weekly');});renderOperationalReport();
  var modal=qs('#gnvMorosityDetailModal');
  if(modal){modal.classList.add('open');}
}
window.openGnvMorosityModal=openGnvMorosityModal;

/* ── Delegación de eventos en document ──────────────────── */
document.addEventListener('click',function(e){
  var op=e.target.closest('[data-gnv-operational-report]');if(op){gnvOperationalView=op.dataset.gnvOperationalReport;document.querySelectorAll('[data-gnv-operational-report]').forEach(function(btn){btn.classList.toggle('active',btn===op);});renderOperationalReport();return;}
  if(e.target.closest('#gnvOperationalReportExport')){exportOperationalReport();return;}
  var morPageBtn=e.target.closest('[data-gnv-mor-page]');
  if(morPageBtn){gnvMorPage=Number(morPageBtn.getAttribute('data-gnv-mor-page'))||1;renderMorTable(gnvMorFiltered);return;}
  if(e.target.closest('#gnvMorDetPrev')){if(gnvMorPage>1){gnvMorPage--;renderMorTable(gnvMorFiltered);}return;}
  if(e.target.closest('#gnvMorDetNext')){if(gnvMorPage*gnvMorPageSize<gnvMorFiltered.length){gnvMorPage++;renderMorTable(gnvMorFiltered);}return;}
  /* — "Ver morosidad" (delegado: funciona aunque el botón se renderice después) — */
  if(e.target.closest('.gnv-morosity-detail-btn')){
    openGnvMorosityModal();
    return;
  }

  /* — Botón exportar dashboard: toggle menú — */
  var expBtn=e.target.closest('#gnvExportDashBtn');
  if(expBtn){
    e.stopPropagation();
    var menu=qs('#gnvExportDashMenu');
    if(menu)menu.style.display=menu.style.display==='none'||menu.style.display===''?'block':'none';
    return;
  }

  /* — Clicks dentro del menú de exportación — */
  if(e.target.closest('#gnvDashExcelBtn')){
    var m2=qs('#gnvExportDashMenu');if(m2)m2.style.display='none';
    exportDashboardCsv();return;
  }
  if(e.target.closest('#gnvDashPdfBtn')){
    var m3=qs('#gnvExportDashMenu');if(m3)m3.style.display='none';
    exportDashboardPdf();return;
  }

  /* — Cerrar menú al hacer click fuera — */
  if(!e.target.closest('#gnvExportDashBtn')&&!e.target.closest('#gnvExportDashMenu')){
    var m4=qs('#gnvExportDashMenu');if(m4&&m4.style.display==='block')m4.style.display='none';
  }

  /* — Botón Mensaje por fila en tabla de morosidad — */
  var rowMsgBtn=e.target.closest('.gnv-mor-row-msg-btn');
  if(rowMsgBtn){
    openMsgModal(
      rowMsgBtn.getAttribute('data-placa')||'',
      rowMsgBtn.getAttribute('data-nombre')||'',
      Number(rowMsgBtn.getAttribute('data-monto')||0),
      Number(rowMsgBtn.getAttribute('data-cuotas')||0)
    );
    return;
  }

  /* — data-close para los nuevos modales — */
  var closer=e.target.closest('[data-close]');
  if(closer){
    var id=closer.getAttribute('data-close');
    var mm=qs('#'+id);if(mm)mm.classList.remove('open');
  }

  /* — Click fuera de modal (overlay) — */
  if(e.target.id==='gnvMorosityDetailModal'||e.target.id==='gnvMorMsgModal'){
    e.target.classList.remove('open');
  }
});

/* ── Filtros del modal morosidad (directos, los elementos son estáticos) — */
function bootGnvStaticListeners(){
  var srch=qs('#gnvMorDetSearch');
  if(srch)srch.addEventListener('input',applyMorFilters);
  var fest=qs('#gnvMorDetFilterEstado');
  if(fest)fest.addEventListener('change',applyMorFilters);
  var exp=qs('#gnvMorDetExportBtn');
  if(exp)exp.addEventListener('click',exportMorCsv);
  var template=qs('#gnvMsgTemplate');if(template)template.addEventListener('change',refreshCollectionTemplate);

  /* — Botones del modal mensaje — */
  var sendBtn=qs('#gnvMsgSendBtn');
  if(sendBtn)sendBtn.addEventListener('click',function(){
    if(window.showToast)showToast('Mensaje de cobranza enviado al beneficiario');
    var mm=qs('#gnvMorMsgModal');if(mm)mm.classList.remove('open');
  });
}

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',bootGnvStaticListeners,{once:true});
}else{
  bootGnvStaticListeners();
}

})();

/* SATCONTROL Agrupaciones · completar fecha de registro en portal. */
(function(){
  function addPortalDates(rows){
    (rows||[]).forEach(function(row,index){
      if(!row||row._geoJsonFeature)return;
      var fallback=row.inicioConstruccion||('2026-04-'+String(1+(index%28)).padStart(2,'0'));
      row.fechaRegistroPortal=row.fechaRegistroPortal||row.fechaRegistro||String(fallback).slice(0,10);
      row.fechaRegistro=row.fechaRegistro||row.fechaRegistroPortal;
    });
    return rows;
  }
  if(typeof buildBeneficiaries==='function'&&!buildBeneficiaries.portalDateEnhanced){
    var originalBuildBeneficiaries=buildBeneficiaries;
    buildBeneficiaries=function(){
      var layer=originalBuildBeneficiaries.apply(this,arguments);
      if(typeof currentSupplyRecords!=='undefined')addPortalDates(currentSupplyRecords);
      if(window.currentSupplyRecords)addPortalDates(window.currentSupplyRecords);
      return layer;
    };
    buildBeneficiaries.portalDateEnhanced=true;
    window.buildBeneficiaries=buildBeneficiaries;
  }
  if(typeof currentSupplyRecords!=='undefined')addPortalDates(currentSupplyRecords);
  if(window.currentSupplyRecords)addPortalDates(window.currentSupplyRecords);
  if(window.plazoArt259ReportRows)addPortalDates(window.plazoArt259ReportRows);
  window.ensureProjectPortalDates=addPortalDates;
})();

document.addEventListener('DOMContentLoaded', function(){
  applyModuleFilter(getSessionModule());
});

document.addEventListener('click', function(ev){
  var t = ev.target.closest && ev.target.closest('#logoutBtn');
  if(t) doLogout(ev);
});

/* SATCONTROL Agrupaciones · reporte Art. 25.9 con búsqueda, paginación y exportación. */
(function(){
  var page=1,pageSize=8,filteredRows=[],kpiFilter='all';
  function escValue(value){return String(value==null?'':value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function sourceRows(){
    var rows=(window.plazoArt259ReportRows||[]).slice();
    if(!rows.length&&typeof currentSupplyRecords!=='undefined')rows=(currentSupplyRecords||[]).slice();
    return rows;
  }
  function deadlineDays(row){
    if(Number.isFinite(Number(row.days)))return Number(row.days);
    if(Number.isFinite(Number(row.diasConstruccion)))return Number(row.diasConstruccion);
    if(typeof supplyDeadlineInfo==='function'){var info=supplyDeadlineInfo(row);return info&&info.days!=null?Number(info.days):0;}
    return 0;
  }
  function isConstruction(row){return /construcci|fuera de plazo|dentro de plazo/i.test(String(row.estadoInstalacion||row.estado||''));}
  function isLate(row){return isConstruction(row)&&(/fuera de plazo/i.test(String(row.estadoInstalacion||row.estado||''))||deadlineDays(row)>=Number(row.limit||90)||row.within===false);}
  function isEnabled(row){return /liquidado|conectado|habilitado/i.test(String(row.estadoInstalacion||row.estado||''));}
  function summarize(rows){return {total:rows.length,late:rows.filter(isLate).length,inside:rows.filter(r=>isConstruction(r)&&!isLate(r)).length,enabled:rows.filter(isEnabled).length};}
  function penaltyHistory(){var companies=Array.from(new Set(sourceRows().map(function(row){return row.empresaInstaladora||'Empresa sin identificar';}))).sort();return companies.map(function(company,index){var companyRows=sourceRows().filter(function(row){return (row.empresaInstaladora||'Empresa sin identificar')===company;}),currentLate=companyRows.filter(isLate).length,applied=Math.max(currentLate,index%4)+(index%3),amount=applied*(650+index*75),month=String(1+(index%6)).padStart(2,'0'),day=String(8+(index%18)).padStart(2,'0');return {empresa:company,convenio:'GNR-2026 · Vigente',aplicadas:applied,fueraActual:currentLate,ultima:'2026-'+month+'-'+day,monto:amount,estado:currentLate>=3?'Seguimiento crítico':currentLate>0?'Con plan de mejora':'Regular'};});}
  function renderPenaltyHistory(){var body=document.getElementById('plazoPenaltyHistoryRows'),rows=penaltyHistory();if(!body)return;body.innerHTML=rows.length?rows.map(function(row){var cls=row.estado==='Regular'?'ok':'bad';return '<tr><td><b>'+escValue(row.empresa)+'</b></td><td><span class="plazo-alert ok">'+escValue(row.convenio)+'</span></td><td><b>'+row.aplicadas+'</b></td><td>'+row.fueraActual+'</td><td>'+escValue(row.ultima)+'</td><td>'+formatMoney(row.monto)+'</td><td><span class="plazo-alert '+cls+'">'+escValue(row.estado)+'</span></td></tr>';}).join(''):'<tr><td colspan="7">No hay empresas instaladoras en el reporte actual.</td></tr>';}
  function rowHtml(row){
    var construction=isConstruction(row),late=isLate(row),days=deadlineDays(row),limit=Number(row.limit||90);
    var status=!construction?'Habilitado / no aplica':late?'Fuera de plazo':'Dentro de plazo';
    return '<tr class="'+(late?'plazo-row-late':'')+'"><td><b>'+escValue(row.suministro||row.id||'-')+'</b></td><td>'+escValue(row.beneficiario||'-')+'</td><td>'+escValue(row.fechaRegistroPortal||row.fechaRegistro||row.fecha||'-')+'</td><td>'+escValue(construction?(days+' / '+limit):'—')+'</td><td>'+escValue(row.estadoInstalacion||row.estado||'-')+'</td><td><span class="plazo-alert '+(late?'bad':'ok')+'">'+escValue(status)+'</span></td><td>'+escValue(row.empresaInstaladora||'-')+'</td></tr>';
  }
  function renderModal(resetPage){
    if(resetPage)page=1;
    var query=(document.getElementById('plazoArt259Search')?.value||'').trim().toLowerCase();
    var queriedRows=sourceRows().filter(function(row){return !query||[row.suministro,row.id,row.beneficiario,row.empresaInstaladora,row.estadoInstalacion,row.estado].some(v=>String(v||'').toLowerCase().includes(query));});
    var stats=summarize(queriedRows);
    filteredRows=queriedRows.filter(function(row){if(kpiFilter==='late')return isLate(row);if(kpiFilter==='inside')return isConstruction(row)&&!isLate(row);if(kpiFilter==='enabled')return isEnabled(row);return true;}).sort(function(a,b){return Number(isLate(b))-Number(isLate(a))||deadlineDays(b)-deadlineDays(a);});
    var pages=Math.max(1,Math.ceil(filteredRows.length/pageSize));page=Math.max(1,Math.min(page,pages));
    var visible=filteredRows.slice((page-1)*pageSize,page*pageSize),tbody=document.getElementById('plazoArt259InfoRows'),summary=document.getElementById('plazoArt259InfoSummary'),label=document.getElementById('plazoArt259PageLabel');
    if(summary)summary.innerHTML='<button type="button" data-plazo-kpi="late" class="plazo-art259-kpi '+(kpiFilter==='late'?'active':'')+'"><span>Fuera de plazo</span><b>'+stats.late+'</b></button><button type="button" data-plazo-kpi="inside" class="plazo-art259-kpi '+(kpiFilter==='inside'?'active':'')+'"><span>Dentro de plazo</span><b>'+stats.inside+'</b></button><button type="button" data-plazo-kpi="enabled" class="plazo-art259-kpi '+(kpiFilter==='enabled'?'active':'')+'"><span>Habilitados</span><b>'+stats.enabled+'</b></button><button type="button" data-plazo-kpi="all" class="plazo-art259-kpi '+(kpiFilter==='all'?'active':'')+'"><span>Total</span><b>'+stats.total+'</b></button>';
    if(tbody)tbody.innerHTML=visible.length?visible.map(rowHtml).join(''):'<tr><td colspan="7">No se encontraron registros.</td></tr>';
    renderPenaltyHistory();
    if(label)label.textContent='Página '+page+' de '+pages;
    var prev=document.getElementById('plazoArt259Prev'),next=document.getElementById('plazoArt259Next');if(prev)prev.disabled=page<=1;if(next)next.disabled=page>=pages;
  }
  function exportRows(format){
    var rows=filteredRows.slice();
    if(!rows.length){showToast('No hay registros en el filtro actual para exportar');return;}
    var penaltyMode=kpiFilter==='late';
    var data=rows.map(function(row){return {'N° Suministro':row.suministro||row.id||'','Beneficiario':row.beneficiario||'','Fecha registro':row.fechaRegistroPortal||row.fechaRegistro||row.fecha||'','Días':deadlineDays(row),'Estado instalación':row.estadoInstalacion||row.estado||'','Plazo Art. 25.9':!isConstruction(row)?'Habilitado / no aplica':isLate(row)?'Fuera de plazo':'Dentro de plazo','Empresa instaladora':row.empresaInstaladora||''};});
    if(format==='csv'){
      var headers=Object.keys(data[0]||{'N° Suministro':''});var lines=[headers.map(csvCell).join(',')].concat(data.map(r=>headers.map(h=>csvCell(r[h])).join(',')));if(penaltyMode){lines.push('');lines.push('HISTÓRICO DE PENALIDADES POR EMPRESA GNR');var historyHeaders=['Empresa instaladora','Convenio GNR','Penalidades aplicadas','Fuera de plazo actual','Última aplicación','Monto acumulado','Estado'];lines.push(historyHeaders.map(csvCell).join(','));penaltyHistory().forEach(function(row){lines.push([row.empresa,row.convenio,row.aplicadas,row.fueraActual,row.ultima,row.monto,row.estado].map(csvCell).join(','));});}downloadTextFile(penaltyMode?'reporte_penalidades_art_25_9.csv':'reporte_art_25_9.csv',lines.join('\n'));showToast(penaltyMode?'Reporte de penalidades CSV exportado':'Reporte CSV exportado');return;
    }
    if(format==='xlsx'&&window.XLSX){var wb=XLSX.utils.book_new(),ws=XLSX.utils.json_to_sheet(data);XLSX.utils.book_append_sheet(wb,ws,penaltyMode?'Fuera de plazo':'Control de plazos');if(penaltyMode){var history=XLSX.utils.json_to_sheet(penaltyHistory().map(function(row){return {'Empresa instaladora':row.empresa,'Convenio GNR':row.convenio,'Penalidades aplicadas':row.aplicadas,'Fuera de plazo actual':row.fueraActual,'Última aplicación':row.ultima,'Monto acumulado':row.monto,'Estado':row.estado};}));XLSX.utils.book_append_sheet(wb,history,'Histórico penalidades');}XLSX.writeFile(wb,penaltyMode?'reporte_penalidades_art_25_9.xlsx':'reporte_art_25_9.xlsx');showToast(penaltyMode?'Reporte XLSX e histórico exportados':'Reporte XLSX exportado');return;}
    if(format==='pdf'){
      (async function(){try{var jsPDF=await ensureJsPdf(),doc=new jsPDF({orientation:'landscape',unit:'pt',format:'a4'});doc.setFontSize(16);doc.text(penaltyMode?'BONO GAS · Reporte de Penalidades y Control de Plazos':'BONO GAS · Reporte Art. 25.9',38,38);doc.setFontSize(9);doc.text(penaltyMode?'Suministros con más de 90 días sin habilitar · Histórico de penalidades GNR':'Control de suministros según Art. 25.9',38,52);var headers=Object.keys(data[0]||{}),body=data.map(r=>headers.map(h=>String(r[h]??'')));if(typeof doc.autoTable==='function'){doc.autoTable({head:[headers],body:body,startY:64,styles:{fontSize:7}});if(penaltyMode){var historyRows=penaltyHistory(),historyHeaders=['Empresa','Convenio GNR','Aplicadas','Fuera actual','Última aplicación','Monto acumulado','Estado'];doc.setFontSize(12);doc.text('Histórico de penalidades aplicadas por empresa instaladora',38,doc.lastAutoTable.finalY+22);doc.autoTable({head:[historyHeaders],body:historyRows.map(function(row){return [row.empresa,row.convenio,row.aplicadas,row.fueraActual,row.ultima,formatMoney(row.monto),row.estado];}),startY:doc.lastAutoTable.finalY+30,styles:{fontSize:7}});}}doc.save(penaltyMode?'reporte_penalidades_art_25_9.pdf':'reporte_art_25_9.pdf');showToast(penaltyMode?'Reporte de penalidades PDF exportado':'Reporte PDF exportado');}catch(e){showToast('No se pudo generar el PDF');}})();return;
    }
    showToast('Formato de exportación no disponible');
  }
  function notifyLateInstallers(button){
    var base=filteredRows.length?filteredRows:sourceRows();
    var late=base.filter(isLate);
    if(!late.length){showToast('No hay suministros fuera de plazo para notificar');return;}
    var companies=Array.from(new Set(late.map(function(row){return row.empresaInstaladora||'Empresa sin identificar';}))).sort();
    var original=button.textContent;
    button.disabled=true;
    button.textContent='Enviando...';
    setTimeout(function(){
      button.disabled=false;
      button.textContent='Notificaciones enviadas';
      var toolbar=document.querySelector('#plazoArt259InfoModal .plazo-art259-toolbar');
      var result=document.getElementById('plazoArt259NotificationResult');
      if(!result&&toolbar){result=document.createElement('div');result.id='plazoArt259NotificationResult';result.className='plazo-art259-notification-result';toolbar.insertAdjacentElement('afterend',result);}
      if(result)result.innerHTML='<b>Envío automático simulado completado</b><span>'+companies.length+' empresa(s) notificadas por '+late.length+' suministro(s) fuera de plazo: '+companies.join(', ')+'.</span>';
      showToast('Notificaciones enviadas a '+companies.length+' empresas instaladoras');
      setTimeout(function(){if(button.textContent==='Notificaciones enviadas')button.textContent=original;},2600);
    },900);
  }
  function isProjectContext(){return typeof isProyectosSatcontrolView==='function'&&isProyectosSatcontrolView();}
  function renderDefaultCard(){
    if(!isProjectContext())return;
    var card=document.getElementById('bonogasDeadlineCard');if(!card)return;
    var rows=typeof currentSupplyRecords!=='undefined'?(currentSupplyRecords||[]).slice():[];window.plazoArt259ReportRows=rows;window.plazoArt259ReportLabel=null;
    card.innerHTML='<div class="correction-head"><div><h3>Control de plazos Art. 25.9</h3><p>Reporte de suministros sin instalacion interna finalizada en plazo mayor o igual a 90 dias calendario.</p></div><button class="plazo-art259-info-btn" id="plazoArt259InfoBtn" type="button" title="Ver reporte de suministros" aria-label="Ver reporte de suministros"><svg class="svg-icon" aria-hidden="true"><use href="#i-search"></use></svg></button></div><div class="kpi-strip"><div class="mini-kpi"><span>Fuera de plazo</span><b>0</b><small>>= 90 dias calendario</small></div><div class="mini-kpi"><span>Dentro de plazo</span><b>0</b><small>En construccion</small></div><div class="mini-kpi"><span>Habilitados</span><b>16</b><small>Solo referencia estadistica</small></div></div>';
  }
  if(typeof renderInfo==='function'&&!renderInfo.art259Enhanced){var originalRenderInfo=renderInfo;renderInfo=function(){var result=originalRenderInfo.apply(this,arguments);setTimeout(renderDefaultCard,0);return result;};renderInfo.art259Enhanced=true;window.renderInfo=renderInfo;}
  document.addEventListener('click',function(event){
    var info=event.target.closest&&event.target.closest('#plazoArt259InfoBtn');if(info){event.preventDefault();event.stopImmediatePropagation();renderModal(true);if(typeof openModal==='function')openModal('plazoArt259InfoModal');else document.getElementById('plazoArt259InfoModal')?.classList.add('open');return;}
    var exp=event.target.closest&&event.target.closest('[data-plazo-export]');if(exp){event.preventDefault();exportRows(exp.dataset.plazoExport);}
    var kpi=event.target.closest&&event.target.closest('[data-plazo-kpi]');if(kpi){event.preventDefault();kpiFilter=kpi.dataset.plazoKpi||'all';renderModal(true);}
    var notify=event.target.closest&&event.target.closest('[data-plazo-notify]');if(notify){event.preventDefault();notifyLateInstallers(notify);}
  },true);
  document.getElementById('plazoArt259Search')?.addEventListener('input',function(){renderModal(true);});
  document.getElementById('plazoArt259Prev')?.addEventListener('click',function(){if(page>1){page--;renderModal(false);}});
  document.getElementById('plazoArt259Next')?.addEventListener('click',function(){if(page*pageSize<filteredRows.length){page++;renderModal(false);}});
  setTimeout(renderDefaultCard,0);
  window.renderProjectPlazoArt259Card=renderDefaultCard;
})();

document.addEventListener('DOMContentLoaded',function(){var style=document.createElement('style');style.textContent='.plazo-art259-export-actions .plazo-notify-installers{background:linear-gradient(135deg,#f59e0b,#ea580c)!important;color:#fff!important;border-color:rgba(251,191,36,.55)!important;min-width:142px}.plazo-art259-export-actions .plazo-notify-installers:disabled{opacity:.65;cursor:wait}.plazo-art259-notification-result{margin:0 0 12px;padding:11px 13px;border:1px solid rgba(34,197,94,.35);border-radius:12px;background:rgba(22,101,52,.16);display:grid;gap:4px}.plazo-art259-notification-result b{color:#86efac;font-size:11px}.plazo-art259-notification-result span{color:#cbd5e1;font-size:10px;line-height:1.45}.plazo-penalty-history{margin-top:16px;padding-top:15px;border-top:1px solid rgba(148,163,184,.22)}.plazo-penalty-history-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:10px}.plazo-penalty-history-head h3{margin:0;color:#fff;font-size:13px}.plazo-penalty-history-head p{margin:4px 0 0;color:#94a3b8;font-size:10px}.plazo-penalty-history-head>span{padding:5px 9px;border:1px solid rgba(248,113,113,.36);border-radius:999px;background:rgba(127,29,29,.24);color:#fecaca;font-size:9px;font-weight:900}';document.head.appendChild(style);});

async function exportInstitutionalSelectionPdf(headers,rows,title,filename,metaLine){
  let jsPDF;try{jsPDF=await ensureJsPdf();}catch(error){}if(!jsPDF){showToast('Librería PDF no disponible');return;}
  const brand=await getValidationBrandData(),doc=new jsPDF({orientation:'landscape',unit:'pt',format:'a4'}),pageWidth=842;
  function header(){doc.setFillColor(255,255,255);doc.rect(0,0,pageWidth,108,'F');try{if(brand.fise)doc.addImage(brand.fise,'PNG',38,14,105,42);if(brand.paulet)doc.addImage(brand.paulet,'PNG',148,13,70,43);}catch(error){}doc.setDrawColor(14,165,233);doc.setLineWidth(2);doc.line(38,64,pageWidth-38,64);doc.setTextColor(15,23,42);doc.setFontSize(16);doc.text(title,38,84);doc.setFontSize(9);doc.setTextColor(100,116,139);doc.text(metaLine||('Generado: '+new Date().toLocaleString('es-PE')),38,100);}
  header();
  if(typeof doc.autoTable==='function')doc.autoTable({head:[headers],body:rows.map(row=>row.map(value=>String(value??''))),startY:114,margin:{top:114,left:38,right:38},styles:{fontSize:7,cellPadding:4,textColor:[15,23,42]},headStyles:{fillColor:[14,116,144],textColor:[255,255,255]},alternateRowStyles:{fillColor:[240,249,255]},didDrawPage:header});
  doc.save(filename);
}
exportSelectionPDF=async function(){const p=currentProject(),data=exportSelectionRows();if(!data.rows.length){showToast('No hay registros en la selección para exportar');return;}await exportInstitutionalSelectionPdf(data.headers,data.rows,'SATCONTROL · Exportación de selección','SATCONTROL_seleccion.pdf',`${p.nombre||'-'} · ${data.ctx.sourceLabel} · ${data.rows.length} registros · ${new Date().toLocaleString('es-PE')}`);showToast('PDF exportado: '+data.rows.length+' registros');};
exportToPDF=async function(rows){const derived=rows.map(deriveExportRecord),headers=['N° suministro','N° instalación','Beneficiario','Empresa instaladora','Estrato','Acometida','Medidor','Estado','Pendiente recaudación'],body=derived.map(d=>[d.suministro,d.numInst,d.beneficiario,d.empresaInstaladora,d.estrato,d.acometida,d.medidor,d.estadoInstalacion,formatMoney(d.montoPendiente)]);await exportInstitutionalSelectionPdf(headers,body,'BONO GAS · Reporte de selección','BONO_GAS_reporte.pdf',(typeof window.bonogasExportFechaLine==='function'?window.bonogasExportFechaLine():'Generado: '+new Date().toLocaleString('es-PE')));showToast('PDF descargado correctamente');};
exportToCSV=function(rows){const headers=['FISE','PAULET','','N° suministro','N° instalación','Beneficiario','Empresa instaladora','Estrato','Acometida','Medidor','Estado','Pendiente recaudación'],esc=value=>`"${String(value??'').replace(/"/g,'""')}"`,lines=[headers.slice(0,2).map(esc).join(','),'',headers.slice(3).map(esc).join(',')];rows.map(deriveExportRecord).forEach(d=>lines.push([d.suministro,d.numInst,d.beneficiario,d.empresaInstaladora,d.estrato,d.acometida,d.medidor,d.estadoInstalacion,d.montoPendiente].map(esc).join(',')));downloadTextFile('SATCONTROL_seleccion.csv',lines.join('\n'));showToast('CSV descargado correctamente');};

/* BONO GAS · HU: control de 20 días hábiles y temático de morosidad. */
(function(){
  const style=document.createElement('style');
  style.textContent=`
    .main.bonogas-satcontrol-mode #tematicosBtn{display:flex!important}
    .main.bonogas-satcontrol-mode #themesPanel{display:none!important;flex-direction:column!important}
    .main.bonogas-satcontrol-mode #themesPanel.open{display:flex!important}
    .main.bonogas-satcontrol-mode #themesPanel > :not(#bonogasThemesContent){display:none!important}
    .main.bonogas-satcontrol-mode #bonogasThemesContent{display:grid;gap:10px}
    .plazo20-control-card{margin-top:12px;border:1px solid rgba(245,158,11,.38);border-radius:16px;padding:14px;background:linear-gradient(145deg,rgba(120,53,15,.28),rgba(13,22,48,.96));box-shadow:0 14px 32px rgba(2,8,23,.32)}
    .plazo20-control-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.plazo20-control-head h3{margin:0;color:#fff;font-size:13px;font-weight:950}.plazo20-control-head p{margin:5px 0 0;color:#cbd5e1;font-size:10px;line-height:1.4;font-weight:750}
    .plazo20-open{width:38px;height:38px;display:grid;place-items:center;border:1px solid rgba(251,191,36,.55);border-radius:12px;background:#f59e0b;color:#111827;cursor:pointer}.plazo20-open .svg-icon{width:17px;height:17px}
    .plazo20-kpis{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:12px}.plazo20-kpi{padding:10px;border:1px solid rgba(255,255,255,.1);border-radius:12px;background:rgba(8,15,33,.65)}.plazo20-kpi span{display:block;color:#94a3b8;font-size:9px;font-weight:900}.plazo20-kpi b{display:block;margin-top:4px;color:#fff;font-size:19px}.plazo20-kpi.critical b{color:#fb7185}.plazo20-kpi.late b{color:#fbbf24}.plazo20-kpi.ok b{color:#4ade80}
    .plazo20-calendar-note{margin:0 0 12px;padding:10px 12px;border:1px solid rgba(56,189,248,.22);border-radius:11px;background:rgba(14,165,233,.08);color:#cbd5e1;font-size:10px}.plazo20-calendar-note b{color:#7dd3fc}
    .plazo20-level{display:inline-flex;padding:5px 8px;border-radius:999px;font-size:9px;font-weight:950}.plazo20-level.critical{background:#ef444425;color:#fecaca;border:1px solid #ef444455}.plazo20-level.late{background:#f59e0b25;color:#fde68a;border:1px solid #f59e0b55}
    .bonogas-theme-card{display:grid;gap:10px;margin-top:8px;padding:13px;border:1px solid rgba(239,68,68,.28);border-radius:14px;background:linear-gradient(145deg,rgba(127,29,29,.18),rgba(15,27,61,.96));color:#fff}.bonogas-theme-card h4{margin:0;font-size:12px}.bonogas-theme-card p{margin:0;color:#b8c5dc;font-size:10px;line-height:1.4}.bonogas-theme-scale{height:10px;border-radius:999px;background:linear-gradient(90deg,#22c55e 0 33%,#facc15 33% 66%,#ef4444 66%);box-shadow:0 0 14px rgba(239,68,68,.18)}.bonogas-theme-labels{display:flex;justify-content:space-between;color:#cbd5e1;font-size:9px;font-weight:900}.bonogas-theme-action{border:0;border-radius:11px;padding:10px 12px;background:linear-gradient(135deg,#ef4444,#f59e0b);color:#fff;font-size:10px;font-weight:950;cursor:pointer}
    .bonogas-morosity-legend{position:absolute;left:18px;bottom:24px;z-index:740;display:none;width:230px;padding:13px;border:1px solid rgba(255,255,255,.72);border-radius:16px;background:rgba(13,22,48,.94);color:#fff;box-shadow:0 18px 40px rgba(0,0,0,.38);backdrop-filter:blur(12px)}.bonogas-morosity-legend.open{display:block}.bonogas-morosity-legend b{display:block;margin-bottom:8px;font-size:11px}.bonogas-morosity-legend span{display:flex;align-items:center;gap:8px;margin:6px 0;color:#dbeafe;font-size:9px;font-weight:850}.bonogas-morosity-legend i{width:12px;height:12px;border-radius:50%;box-shadow:0 0 0 3px rgba(255,255,255,.1)}
  `;
  document.head.appendChild(style);
  let modalRows=[],heatLayer=null,activeHeatMetric='';
  const esc=v=>String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function sourceRows(){if(typeof window.getBonogasFilteredRows==='function')return window.getBonogasFilteredRows().slice();return (window.plazoArt259ReportRows||window.currentSupplyRecords||[]).slice()}
  function businessDays(row){if(Number.isFinite(Number(row.diasHabiles)))return Number(row.diasHabiles);const days=Number(row.days!=null?row.days:row.diasConstruccion||0);return Math.floor(days/7)*5+Math.min(days%7,5)}
  function applicable(row){return /construcci|proceso|fuera de plazo|dentro de plazo/i.test(String(row.estadoInstalacion||row.estado||''))}
  function lateRows(){return sourceRows().filter(r=>applicable(r)&&businessDays(r)>20)}
  function ensureCard(){const host=document.getElementById('bonogasDeadlineCard');if(!host||!document.querySelector('.main.bonogas-satcontrol-mode'))return;let card=document.getElementById('plazo20ControlCard');if(!card){card=document.createElement('section');card.id='plazo20ControlCard';card.className='plazo20-control-card';host.insertAdjacentElement('afterend',card)}const rows=sourceRows().filter(applicable),late=rows.filter(r=>businessDays(r)>20),critical=rows.filter(r=>businessDays(r)>=30),signature=[rows.length,late.length,critical.length].join(':');if(card.dataset.signature===signature)return;card.dataset.signature=signature;card.innerHTML=`<div class="plazo20-control-head"><div><h3>Control de 20 días hábiles</h3><p>Alerta visual de instalaciones internas que exceden el plazo máximo. Cálculo simulado de lunes a viernes.</p></div><button class="plazo20-open" id="plazo20OpenBtn" type="button" title="Ver suministros fuera de plazo"><svg class="svg-icon" aria-hidden="true"><use href="#i-search"></use></svg></button></div><div class="plazo20-kpis"><div class="plazo20-kpi critical"><span>Retraso crítico</span><b>${critical.length}</b></div><div class="plazo20-kpi late"><span>Fuera de plazo</span><b>${late.length}</b></div><div class="plazo20-kpi ok"><span>Dentro del plazo</span><b>${Math.max(0,rows.length-late.length)}</b></div></div>`}
  function renderModal(){const q=(document.getElementById('plazo20Search')?.value||'').trim().toLowerCase();modalRows=lateRows().filter(r=>!q||[r.suministro,r.id,r.beneficiario,r.empresaInstaladora].some(v=>String(v||'').toLowerCase().includes(q))).sort((a,b)=>businessDays(b)-businessDays(a));const critical=modalRows.filter(r=>businessDays(r)>=30).length;const summary=document.getElementById('plazo20Summary'),body=document.getElementById('plazo20Rows');if(summary)summary.innerHTML=`<div class="plazo-art259-kpi"><span>Fuera de plazo</span><b>${modalRows.length}</b></div><div class="plazo-art259-kpi"><span>Retraso crítico</span><b>${critical}</b></div><div class="plazo-art259-kpi"><span>Límite</span><b>20</b></div><div class="plazo-art259-kpi"><span>Calendario</span><b>L–V</b></div>`;if(body)body.innerHTML=modalRows.length?modalRows.map(r=>{const d=businessDays(r),critical=d>=30;return `<tr class="plazo-row-late"><td><b>${esc(r.suministro||r.id||'-')}</b></td><td>${esc(r.beneficiario||'-')}</td><td>${esc(r.inicioConstruccion||r.fechaRegistroPortal||r.fechaRegistro||r.fecha||'-')}</td><td><b>${d}</b> / 20</td><td><span class="plazo20-level ${critical?'critical':'late'}">${critical?'Crítico':'Fuera de plazo'}</span></td><td>${esc(r.empresaInstaladora||'-')}</td></tr>`}).join(''):'<tr><td colspan="6">No hay suministros fuera del plazo de 20 días hábiles con los filtros actuales.</td></tr>'}
  function export20(format){renderModal();const data=modalRows.map(r=>({'N° Suministro':r.suministro||r.id||'','Beneficiario':r.beneficiario||'','Fecha inicio':r.inicioConstruccion||r.fechaRegistroPortal||r.fechaRegistro||r.fecha||'','Días hábiles':businessDays(r),'Nivel':businessDays(r)>=30?'Crítico':'Fuera de plazo','Empresa instaladora':r.empresaInstaladora||''}));if(!data.length){showToast('No hay suministros fuera de plazo para exportar');return}if(format==='xlsx'&&window.XLSX){const wb=XLSX.utils.book_new(),ws=XLSX.utils.json_to_sheet(data);XLSX.utils.book_append_sheet(wb,ws,'Fuera de plazo');XLSX.writeFile(wb,'bonogas_20_dias_habiles.xlsx');showToast('Reporte XLSX exportado');return}if(format==='csv'){const headers=Object.keys(data[0]),cell=v=>'"'+String(v??'').replace(/"/g,'""')+'"';downloadTextFile('bonogas_20_dias_habiles.csv',[headers.map(cell).join(','),...data.map(r=>headers.map(h=>cell(r[h])).join(','))].join('\n'));showToast('Reporte CSV exportado');return}if(format==='pdf'&&typeof exportInstitutionalSelectionPdf==='function'){const headers=Object.keys(data[0]);exportInstitutionalSelectionPdf(headers,data.map(r=>headers.map(h=>r[h])),'BONO GAS · Control de 20 días hábiles','bonogas_20_dias_habiles.pdf','Calendario institucional simulado · lunes a viernes');showToast('Reporte PDF exportado')}}
  function ensureTheme(){const panel=document.getElementById('themesPanel');if(!panel||document.getElementById('bonogasThemesContent'))return;const content=document.createElement('div');content.id='bonogasThemesContent';content.innerHTML='<div class="floating-title">Mapas de calor · BonoGas</div>'
    +'<div class="bonogas-theme-card"><h4>Morosidad por monto pendiente</h4><p>Identifica manzanas y suministros con mayor deuda pendiente de recaudación.</p><div class="bonogas-theme-scale"></div><div class="bonogas-theme-labels"><span>Baja</span><span>Media</span><span>Crítica</span></div><button class="bonogas-theme-action" data-bonogas-heat="morosidad" type="button">Activar mapa de morosidad</button></div>'
    +'<div class="bonogas-theme-card"><h4>Nivel de recaudación</h4><p>Representa las zonas según cuotas pagadas y avance de recaudación.</p><div class="bonogas-theme-scale"></div><div class="bonogas-theme-labels"><span>Baja</span><span>Media</span><span>Alta</span></div><button class="bonogas-theme-action" data-bonogas-heat="recaudacion" type="button">Activar mapa de recaudación</button></div>'
    +'<div class="bonogas-theme-card"><h4>Estado de pago</h4><p>Diferencia suministros activos y beneficiarios que no están pagando.</p><div class="bonogas-theme-scale"></div><div class="bonogas-theme-labels"><span>Activo</span><span>Seguimiento</span><span>No pagando</span></div><button class="bonogas-theme-action" data-bonogas-heat="estadoPago" type="button">Activar mapa de estado de pago</button></div>';panel.appendChild(content)}
  function ensureLegend(metric){const shell=document.querySelector('.map-shell');if(!shell)return null;let legend=document.getElementById('bonogasMorosityLegend');if(!legend){legend=document.createElement('div');legend.id='bonogasMorosityLegend';legend.className='bonogas-morosity-legend';shell.appendChild(legend)}const html=metric==='recaudacion'?'<b>Nivel de recaudación</b><span><i style="background:#22c55e"></i>Baja recaudación</span><span><i style="background:#facc15"></i>Recaudación media</span><span><i style="background:#ef4444"></i>Alta recaudación</span>':metric==='estadoPago'?'<b>Estado de pago</b><span><i style="background:#22c55e"></i>Suministro activo</span><span><i style="background:#facc15"></i>Requiere seguimiento</span><span><i style="background:#ef4444"></i>No está pagando</span>':'<b>Morosidad por suministro</b><span><i style="background:#22c55e"></i>Baja · hasta S/ 300</span><span><i style="background:#facc15"></i>Media · S/ 301 a S/ 900</span><span><i style="background:#ef4444"></i>Crítica · más de S/ 900</span>';legend.innerHTML=html;return legend}
  function toggleHeat(){if(!window.L||typeof leafletMap==='undefined'||!leafletMap)return;const btn=document.getElementById('bonogasMorosityThemeBtn'),legend=ensureLegend();if(heatLayer&&leafletMap.hasLayer(heatLayer)){leafletMap.removeLayer(heatLayer);heatLayer=null;legend?.classList.remove('open');if(btn)btn.textContent='Activar mapa de calor';if(typeof window.ensureBonogasMapLayer==='function')window.ensureBonogasMapLayer();return}if(typeof clearProyectosBeneficiaryOverlays==='function')clearProyectosBeneficiaryOverlays();heatLayer=L.layerGroup().addTo(leafletMap);const rows=sourceRows().filter(r=>Number.isFinite(Number(r.lat))&&Number.isFinite(Number(r.lng)));rows.forEach((r,i)=>{const debt=Number(r.montoPendiente!=null?r.montoPendiente:((i%5)*280)),color=debt>900?'#ef4444':debt>300?'#facc15':'#22c55e',radius=debt>900?18:debt>300?14:10;L.circleMarker([Number(r.lat),Number(r.lng)],{radius,color,weight:2,fillColor:color,fillOpacity:.5}).bindPopup(`<b>${esc(r.suministro||'Suministro')}</b><br>${esc(r.beneficiario||'-')}<br>Monto pendiente: <b>${typeof formatMoney==='function'?formatMoney(debt):'S/ '+debt}</b><br>Empresa: ${esc(r.empresaInstaladora||'-')}`).addTo(heatLayer)});if(rows.length){try{leafletMap.fitBounds(rows.map(r=>[Number(r.lat),Number(r.lng)]),{padding:[45,45],maxZoom:14})}catch(e){}}legend?.classList.add('open');if(btn)btn.textContent='Desactivar mapa de calor';showToast('Mapa de morosidad activado con los filtros BonoGas')}
  document.addEventListener('click',e=>{const open=e.target.closest('#plazo20OpenBtn');if(open){renderModal();if(typeof openModal==='function')openModal('plazo20HabilesModal');else document.getElementById('plazo20HabilesModal')?.classList.add('open')}const exp=e.target.closest('[data-plazo20-export]');if(exp)export20(exp.dataset.plazo20Export);const heat=e.target.closest('[data-bonogas-heat]');if(heat)toggleHeat(heat.dataset.bonogasHeat)});
  document.getElementById('plazo20Search')?.addEventListener('input',renderModal);
  toggleHeat=function(metric){
    metric=metric||'morosidad';
    if(!window.L||typeof leafletMap==='undefined'||!leafletMap){if(typeof showToast==='function')showToast('El mapa todavía está cargando');return;}
    const buttons=Array.from(document.querySelectorAll('[data-bonogas-heat]'));
    const btn=document.querySelector('[data-bonogas-heat="'+metric+'"]'),legend=ensureLegend(metric);
    if(heatLayer){
      try{if(leafletMap.hasLayer(heatLayer))leafletMap.removeLayer(heatLayer);}catch(e){}heatLayer=null;
      const sameMetric=activeHeatMetric===metric;
      activeHeatMetric='';
      document.body.classList.remove('bonogas-heat-active');
      legend?.classList.remove('open');
      buttons.forEach(b=>{b.classList.remove('active');b.textContent=b.dataset.bonogasHeat==='morosidad'?'Activar mapa de morosidad':b.dataset.bonogasHeat==='recaudacion'?'Activar mapa de recaudación':'Activar mapa de estado de pago'});
      if(sameMetric){if(typeof window.ensureBonogasMapLayer==='function')window.ensureBonogasMapLayer({zoomToResults:false});if(typeof showToast==='function')showToast('Mapa de calor desactivado');return;}
    }
    [window.bonogasManzanaLayer,window.bonogasHuLayer,typeof beneficiaryLayer!=='undefined'?beneficiaryLayer:null,typeof morosityLayer!=='undefined'?morosityLayer:null,typeof projectMarker!=='undefined'?projectMarker:null].forEach(layer=>{try{if(layer&&leafletMap.hasLayer(layer))leafletMap.removeLayer(layer);}catch(e){}});
    document.body.classList.add('bonogas-heat-active');
    const source=sourceRows().filter(r=>Number.isFinite(Number(r.lat))&&Number.isFinite(Number(r.lng)));
    const rows=source.length>180?source.filter((r,i)=>i%Math.ceil(source.length/180)===0).slice(0,180):source;
    if(!rows.length){document.body.classList.remove('bonogas-heat-active');if(typeof window.ensureBonogasMapLayer==='function')window.ensureBonogasMapLayer({zoomToResults:false});if(typeof showToast==='function')showToast('No hay registros georreferenciados con los filtros actuales');return;}
    const values=rows.map((r,i)=>{if(metric==='recaudacion')return Number(r.cuotasPagadas!=null?r.cuotasPagadas:((i%12)+1));if(metric==='estadoPago')return String(r.suministroActivo||'').toLowerCase()==='no'||Number(r.cuotasPendientes||0)>=8?100:Number(r.cuotasPendientes||0)>=4?55:18;return Number(r.montoPendiente!=null?r.montoPendiente:((i%5)*280));});
    const cells=new Map();
    rows.forEach((r,i)=>{const lat=Number(r.lat),lng=Number(r.lng),key=(Math.round(lat*5)/5).toFixed(1)+','+(Math.round(lng*5)/5).toFixed(1),prev=cells.get(key)||{lat:0,lng:0,value:0,count:0};prev.lat+=lat;prev.lng+=lng;prev.value+=values[i];prev.count++;cells.set(key,prev);});
    const zones=Array.from(cells.values()).slice(0,100),maxZoneValue=Math.max(1,...zones.map(cell=>cell.value/Math.max(1,cell.count)));
    const heatPoints=zones.map(cell=>{const value=cell.value/Math.max(1,cell.count);return [cell.lat/cell.count,cell.lng/cell.count,Math.max(.14,Math.min(1,value/maxZoneValue))];});
    heatLayer=createNativeHeatLayer(heatPoints,{radius:34,maxOpacity:.52});
    heatLayer.addTo(leafletMap);
    try{leafletMap.fitBounds(rows.map(r=>[Number(r.lat),Number(r.lng)]),{padding:[55,55],maxZoom:11,animate:true});}catch(e){}
    legend?.classList.add('open');
    activeHeatMetric=metric;
    if(btn){btn.textContent='Desactivar este mapa de calor';btn.classList.add('active');}
    const metricLabel=metric==='recaudacion'?'recaudación':metric==='estadoPago'?'estado de pago':'morosidad';
    if(typeof showToast==='function')showToast('Mapa de '+metricLabel+' activado · '+source.length+' registros filtrados');
  };

  function ensureExtras(){ensureCard();ensureTheme();ensureLegend()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(ensureExtras,300),{once:true});
  else setTimeout(ensureExtras,300);
  window.renderPlazo20HabilesCard=ensureCard;
  window.ensureBonogasHuExtras=ensureExtras;
})();
