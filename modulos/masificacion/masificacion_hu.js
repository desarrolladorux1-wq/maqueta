(function(){
  'use strict';
  const $=s=>document.querySelector(s), esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const money=v=>'US$ '+Number(v||0).toLocaleString('es-PE',{minimumFractionDigits:2,maximumFractionDigits:2});
  const current=()=>typeof currentProject==='function'?currentProject():(window.projects||[])[0];
  function modal(id,title,subtitle,body){let el=$('#'+id);if(!el){el=document.createElement('div');el.id=id;el.className='masif-hu-modal';document.body.appendChild(el);}el.innerHTML=`<section class="masif-hu-card"><header class="masif-hu-head"><div><h2>${title}</h2><p>${subtitle}</p></div><button class="masif-hu-close" data-hu-close="${id}">×</button></header><div>${body}</div></section>`;el.classList.add('open');}
  function close(id){$('#'+id)?.classList.remove('open');}
  function download(name,text,type='text/csv;charset=utf-8'){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['\ufeff'+text],{type}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),800);}
  function projectProfile(){const p=current();return typeof getMasifProjectSummary==='function'?getMasifProjectSummary(p):{beneficiarios:p?.beneficiarios||0,viviendas:100,kmRed:4.82,inversion:98291.11,valvulas:14};}
  function addLocationFilter(){const host=$('.info-panel .info-top');if(!host||$('#masifLocationFilter'))return;host.insertAdjacentHTML('afterbegin',`<section class="masif-location-filter" id="masifLocationFilter"><h3>Filtrar agrupaciones por ubicación</h3><div class="masif-location-grid"><label>Departamento<select id="masifDept"></select></label><label>Provincia<select id="masifProv"></select></label><label class="wide">Distrito<select id="masifDist"></select></label></div><button id="masifApplyLocation" type="button">Aplicar filtro y centrar mapa</button></section>`);populateGeo();$('#masifDept').addEventListener('change',()=>populateGeo('department'));$('#masifProv').addEventListener('change',()=>populateGeo('province'));$('#masifApplyLocation').addEventListener('click',applyGeo);
  }
  function geoRows(){const list=typeof projects!=='undefined'?projects:[];return list.map(p=>({d:p.departamento||'Sin departamento',p:p.provincia||'Sin provincia',x:p.distrito||'Sin distrito',id:p.id}));}
  function fill(sel,vals,old){sel.innerHTML=[...new Set(vals)].map(v=>`<option>${esc(v)}</option>`).join('');if(old&&[...sel.options].some(o=>o.value===old))sel.value=old;}
  function populateGeo(level){const rows=geoRows(),d=$('#masifDept'),p=$('#masifProv'),x=$('#masifDist');if(!d)return;const cur=current();fill(d,rows.map(r=>r.d),level?d.value:cur?.departamento);const r1=rows.filter(r=>r.d===d.value);fill(p,r1.map(r=>r.p),level==='department'?null:(p.value||cur?.provincia));const r2=r1.filter(r=>r.p===p.value);fill(x,r2.map(r=>r.x),level?null:cur?.distrito);}
  function applyGeo(){const row=geoRows().find(r=>r.d===$('#masifDept').value&&r.p===$('#masifProv').value&&r.x===$('#masifDist').value);if(row&&typeof selectProject==='function')selectProject(row.id);else if(typeof leafletMap!=='undefined'&&leafletMap&&typeof getMasifProjectCenter==='function'){const g=getMasifProjectCenter({departamento:$('#masifDept').value,provincia:$('#masifProv').value,distrito:$('#masifDist').value});leafletMap.setView([g.lat,g.lng],g.zoom||14);}if(window.showToast)showToast('Filtro geográfico aplicado');}
  const vnrRows=()=>[{c:'VNR-PEAD-200',p:'Tubería PEAD 200 mm',u:'m',q:856.4,t:42.80},{c:'VNR-PEAD-160',p:'Tubería PEAD 160 mm',u:'m',q:420.2,t:34.60},{c:'VNR-VAL-SEC',p:'Válvula de seccionamiento',u:'und',q:8,t:1280},{c:'VNR-ACOM-DOM',p:'Acometida domiciliaria',u:'und',q:100,t:315}];
  function reportRows(){return vnrRows().map(r=>Object.assign({},r,{s:r.q*r.t}));}
  function openTechnical(){const rows=reportRows(),total=rows.reduce((s,r)=>s+r.s,0),p=current();modal('masifTechnicalModal','Informe técnico automático','Partidas VNR, cantidades GIS y tarifas referenciales Osinergmin.',`<div class="masif-hu-kpis"><div class="masif-hu-kpi"><span>Agrupación</span><b>${esc(p?.id)}</b></div><div class="masif-hu-kpi"><span>Partidas VNR</span><b>${rows.length}</b></div><div class="masif-hu-kpi"><span>KM de red</span><b>${projectProfile().kmRed}</b></div><div class="masif-hu-kpi"><span>Total calculado</span><b>${money(total)}</b></div></div>${table(['Código VNR','Partida','Unidad','Cantidad GIS','Tarifa Osinergmin','Subtotal'],rows.map(r=>[r.c,r.p,r.u,r.q,money(r.t),money(r.s)]))}<div class="masif-hu-toolbar" style="margin-top:14px"><button class="masif-hu-btn green" id="masifTechPdf">Generar PDF</button><button class="masif-hu-btn" id="masifTechWord">Generar Word</button></div>`);$('#masifTechPdf').onclick=()=>technicalPdf(rows,total);$('#masifTechWord').onclick=()=>technicalWord(rows,total);}
  function technicalPdf(rows,total){let J=window.jspdf?.jsPDF;try{J=J||parent.jspdf?.jsPDF}catch(e){}if(!J){window.print();return;}const p=current(),doc=new J({orientation:'landscape',unit:'pt',format:'a4'});doc.setFontSize(17);doc.text('INFORME TÉCNICO AUTOMÁTICO · MASIFICACIÓN',38,40);doc.setFontSize(10);doc.text(`Agrupación: ${p?.nombre||'-'} · ${p?.id||'-'} · ${p?.distrito||'-'}, ${p?.provincia||'-'}`,38,58);doc.text('Fuente: cantidades GIS y tarifas referenciales Osinergmin · Códigos VNR',38,73);if(doc.autoTable)doc.autoTable({startY:88,head:[['Código VNR','Partida','Unidad','Cantidad GIS','Tarifa','Subtotal']],body:rows.map(r=>[r.c,r.p,r.u,String(r.q),money(r.t),money(r.s)]),headStyles:{fillColor:[14,116,144]}});const y=(doc.lastAutoTable?.finalY||180)+24;doc.setFontSize(12);doc.text('Total valorizado: '+money(total),38,y);doc.text('Conclusión: metrados y valorización listos para revisión técnica y liquidación.',38,y+20);doc.save('informe_tecnico_vnr_masificacion.pdf');}
  function technicalWord(rows,total){const p=current(),trs=rows.map(r=>`<tr><td>${r.c}</td><td>${r.p}</td><td>${r.u}</td><td>${r.q}</td><td>${money(r.t)}</td><td>${money(r.s)}</td></tr>`).join('');download('informe_tecnico_vnr_masificacion.doc',`<html><meta charset="utf-8"><body><h1>Informe técnico automático · Masificación</h1><p><b>Agrupación:</b> ${esc(p?.nombre)} · ${esc(p?.id)}</p><p>Partidas VNR valorizadas con tarifas referenciales Osinergmin.</p><table border="1" cellspacing="0" cellpadding="6"><tr><th>Código VNR</th><th>Partida</th><th>Unidad</th><th>Cantidad GIS</th><th>Tarifa</th><th>Subtotal</th></tr>${trs}</table><h3>Total: ${money(total)}</h3><p>Conclusión: información integrada y lista para revisión del área técnica.</p></body></html>`,'application/msword');}
  function table(headers,rows){return `<div class="masif-hu-table-wrap"><table class="masif-hu-table"><thead><tr>${headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;}
  let liquidationRows=[['VNR-PEAD-200','TRON-001','856.40','GIS vinculado','Conforme'],['VNR-PEAD-160','RAM-002','420.20','GIS vinculado','Conforme'],['VNR-VAL-SEC','VAL-003','8','GIS vinculado','Conforme'],['VNR-ACOM-DOM','MZ-01','100','GIS vinculado','Por revisar']];
  function openLiquidation(){renderLiquidationModal();}
  function renderLiquidationModal(){const linked=liquidationRows.filter(r=>/vinculado/i.test(r[3])).length;modal('masifLiquidationModal','Automatización de liquidaciones','Carga del modelo Excel y enlace de partidas con objetos espaciales GIS.',`<div class="masif-hu-toolbar"><label>Modelo de liquidación<input id="masifLiqFile" type="file" accept=".xlsx,.xls,.csv"></label><button class="masif-hu-btn alt" id="masifLiqTemplate">Descargar formato</button><button class="masif-hu-btn green" id="masifLiqExport">Generar cuadro integrado</button></div><div class="masif-hu-kpis"><div class="masif-hu-kpi"><span>Filas importadas</span><b>${liquidationRows.length}</b></div><div class="masif-hu-kpi"><span>Vinculadas al GIS</span><b>${linked}</b></div><div class="masif-hu-kpi"><span>Observadas</span><b>${liquidationRows.length-linked}</b></div><div class="masif-hu-kpi"><span>Estado</span><b>${linked===liquidationRows.length?'Conforme':'En revisión'}</b></div></div>${table(['Código VNR','Objeto GIS','Cantidad','Vinculación espacial','Validación'],liquidationRows.map(r=>[r[0],r[1],r[2],`<span class="${/vinculado/i.test(r[3])?'masif-link-ok':'masif-link-warn'}">${r[3]}</span>`,r[4]]))}`);$('#masifLiqTemplate').onclick=()=>download('formato_liquidacion_masificacion.csv','Codigo VNR,Objeto GIS,Cantidad,Unidad,Estado\nVNR-PEAD-200,TRON-001,0,m,Pendiente');$('#masifLiqExport').onclick=()=>download('liquidacion_integrada_gis.csv','Codigo VNR,Objeto GIS,Cantidad,Vinculacion,Validacion\n'+liquidationRows.map(r=>r.join(',')).join('\n'));$('#masifLiqFile').onchange=readLiquidation;}
  function readLiquidation(e){const file=e.target.files?.[0];if(!file)return;const reader=new FileReader();reader.onload=ev=>{try{let rows=[];if(/\.csv$/i.test(file.name)){rows=String(ev.target.result).split(/\r?\n/).slice(1).filter(Boolean).map(x=>x.split(',').slice(0,5));}else{let X=window.XLSX;try{X=X||parent.XLSX}catch(err){}if(X){const wb=X.read(ev.target.result,{type:'array'});rows=X.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]],{header:1}).slice(1).filter(r=>r.length).map(r=>[r[0]||'',r[1]||'',r[2]||0,r[1]?'GIS vinculado':'Sin vínculo',r[1]?'Conforme':'Observado']);}}if(rows.length)liquidationRows=rows;renderLiquidationModal();}catch(err){if(window.showToast)showToast('No se pudo leer el formato de liquidación');}};if(/\.csv$/i.test(file.name))reader.readAsText(file);else reader.readAsArrayBuffer(file);}
  function potentialContext(){
    const selected=(typeof activeSelectionRecords!=='undefined'&&activeSelectionRecords.length)?activeSelectionRecords:
      ((typeof activeAreaRecords!=='undefined'&&activeAreaRecords.length)?activeAreaRecords:[]);
    const p=current(),profile=projectProfile();
    const base=selected.length?selected:[];
    const predios=base.length?base.reduce((sum,r)=>sum+Number(r.hogares||r.predios||r.beneficiarios||1),0):Math.max(Number(profile.viviendas||p?.beneficiarios||0),1);
    const rows=base.length?base.map((r,i)=>{
      const count=Math.max(1,Number(r.hogares||r.predios||r.beneficiarios||1));
      const covered=Math.max(0,Math.round(count*(String(r.estadoInstalacion||'').toLowerCase().includes('conect')?.92:.72)));
      const concession=Math.max(0,Math.round(count*.24));
      return [r.manzana||r.suministro||('SELECCIÓN-'+(i+1)),count,covered,concession,Math.max(covered,covered+concession-Math.round(count*.12))];
    }):Array.from({length:Math.min(4,Math.max(1,Math.ceil(predios/30)))},(_,i)=>{
      const count=i===Math.ceil(predios/30)-1?Math.max(1,predios-(i*30)):Math.min(30,predios);
      const covered=Math.round(count*.78),concession=Math.round(count*.24);
      return ['MZ-'+String(i+1).padStart(2,'0'),count,covered,concession,Math.max(covered,covered+concession-Math.round(count*.12))];
    });
    return {rows,predios,source:base.length?(typeof activeAreaRecords!=='undefined'&&activeAreaRecords.length?'Área dibujada':'Objetos seleccionados'):'Proyecto '+(p?.nombre||p?.id||'actual')};
  }
  function openPotential(){const ctx=potentialContext(),res=Math.round(ctx.predios*.82),con=Math.round(ctx.predios*.24),potential=ctx.rows.reduce((sum,r)=>sum+Number(r[4]||0),0);modal('masifPotentialModal','Identificación de beneficiarios potenciales','Cálculo dinámico según '+ctx.source+'.',`<div class="masif-hu-kpis"><div class="masif-hu-kpi"><span>Predios analizados</span><b>${ctx.predios}</b></div><div class="masif-hu-kpi"><span>Residenciales</span><b>${res}</b></div><div class="masif-hu-kpi"><span>Proyección concesionario</span><b>${con}</b></div><div class="masif-hu-kpi"><span>Potenciales únicos</span><b>${potential}</b></div></div>${table(['Manzana / selección','Predios','Con cobertura FISE','Proyección concesionario','Beneficiarios potenciales'],ctx.rows)}<p style="color:#aebbd3;font-size:10px;line-height:1.5">Fuente activa: ${esc(ctx.source)}. El resultado se recalcula al seleccionar un proyecto, un objeto, un círculo o un polígono.</p><div class="masif-hu-toolbar"><button class="masif-hu-btn green" id="masifPotentialExport">Exportar potencial de abastecimiento</button></div>`);$('#masifPotentialExport').onclick=()=>download('potencial_abastecimiento_masificacion.csv','Manzana o seleccion,Predios,Cobertura FISE,Proyeccion concesionario,Beneficiarios potenciales\n'+ctx.rows.map(r=>r.join(',')).join('\n'));}
  const phases=['Planificación','Registro de la agrupación','Evaluación GIS','Validación técnica','Validación concesionaria','Programación de obra','Ejecución de red','Liquidación','Monitoreo'];
  function openTrace(){
    const phaseDates=[
      ['01/07/2026','02/07/2026'],['03/07/2026','04/07/2026'],['05/07/2026','07/07/2026'],
      ['08/07/2026','10/07/2026'],['11/07/2026','14/07/2026'],['15/07/2026','En curso'],
      ['Pendiente','Pendiente'],['Pendiente','Pendiente'],['Pendiente','Pendiente']
    ];
    const owners=['Equipo de planificación','Mesa de partes','Equipo GIS','Analista técnico','Concesionaria','Operaciones','Supervisor de obra','Equipo de liquidaciones','Equipo de monitoreo'];
    const currentUser='Renzo';
    const statusOptions=['Completado','En avance','No completado'];
    const headers=['Fecha de inicio','Fecha de fin','Usuario','Estado anterior','Nuevo estado','Estado','Acciones'];
    const histories=phases.map((phase,i)=>{
      const state=i<5?'Completado':i===5?'En avance':'No completado';
      const previous=i===0?'Registro':phases[i-1];
      return [[phaseDates[i][0],phaseDates[i][1],i===0?currentUser:owners[i],previous,phase,state]];
    });
    const rows=phases.map((n,i)=>`<button type="button" class="masif-phase ${i<5?'done':i===5?'current':''} ${i===0?'selected':''}" data-trace-phase="${i}"><i>${i<5?'✓':i+1}</i><div><b>${i+1}. ${n}</b><span>${i<5?'Completado':i===5?'Avance no completado · Responsable: Operaciones':'No completado'} · Inicio: ${phaseDates[i][0]} · Fin: ${phaseDates[i][1]}</span></div></button>`).join('');
    modal('masifTraceModal','Trazabilidad desde registros de expedientes','Consulte un expediente existente o registre uno nuevo; seleccione cada fase para revisar su historial.',`<div class="masif-hu-toolbar"><label>Tipo de expediente<select id="masifTraceType">${phases.map(p=>`<option>${p}</option>`).join('')}</select></label><label>Zona de análisis<select id="masifTraceZone"><option>Zona concesionada</option><option>Zona no concesionada</option></select></label><label>Expediente<input id="masifTraceCode" value="${esc(current()?.id||'FISE-2026-001')}" readonly></label><button class="masif-hu-btn" id="masifTraceRegister">Registrar expediente</button><button class="masif-hu-btn alt" id="masifTraceExport">Exportar auditoría</button></div><div class="masif-trace-register-panel" id="masifTraceRegisterPanel" hidden><div class="masif-trace-register-head"><div><b id="masifTraceRegisterTitle">Nuevo expediente</b><span id="masifTraceRegisterHint">No se encontró información. Complete los campos y guarde el registro.</span></div><button type="button" id="masifTraceRegisterClose" title="Cerrar registro">×</button></div><div class="masif-hu-toolbar"><label>Código<input id="masifRegCode" readonly></label><label>Tipo<select id="masifRegType">${phases.map(p=>`<option>${p}</option>`).join('')}</select></label><label>Zona<select id="masifRegZone"><option>Zona concesionada</option><option>Zona no concesionada</option></select></label><label>Fecha inicial<input id="masifRegStart" type="date"></label><label>Fecha final<input id="masifRegEnd" type="date"></label><label>Usuario<input id="masifRegUser" value="${currentUser}" readonly></label><label>Estado<select id="masifRegStatus">${statusOptions.map(s=>`<option>${s}</option>`).join('')}</select></label><label class="masif-trace-pdf">Documento PDF<input id="masifRegPdf" type="file" accept="application/pdf,.pdf"><small id="masifRegPdfName">Ningún PDF seleccionado</small></label><button class="masif-hu-btn green" id="masifRegSave">Guardar expediente</button></div></div><div class="masif-trace">${rows}</div><div class="masif-trace-history-head"><b id="masifTraceHistoryTitle">Historial · 1. ${phases[0]}</b><span>Toque otra fase para actualizar el detalle</span></div><div id="masifTraceHistory">${table(headers,histories[0])}</div>`);
    let selectedPhase=0;
    let editingHistory=null;
    function statusCell(value,i){return `<select class="masif-trace-status" data-trace-status="${i}">${statusOptions.map(s=>`<option${s===value?' selected':''}>${s}</option>`).join('')}</select>`;}
    function renderHistory(i){
      const displayRows=histories[i].map((row,index)=>{
        const isEditing=editingHistory&&editingHistory.phase===i&&editingHistory.row===index;
        if(isEditing)return [
          `<input class="masif-trace-inline" type="date" data-inline-field="inicio" value="${/^\d{2}\/\d{2}\/\d{4}$/.test(row[0])?row[0].split('/').reverse().join('-'):''}">`,
          `<input class="masif-trace-inline" type="date" data-inline-field="fin" value="${/^\d{2}\/\d{2}\/\d{4}$/.test(row[1])?row[1].split('/').reverse().join('-'):''}">`,
          `<input class="masif-trace-inline" data-inline-field="usuario" value="${esc(row[2]||currentUser)}">`,
          `<input class="masif-trace-inline" data-inline-field="anterior" value="${esc(row[3]||'Registro')}">`,
          `<select class="masif-trace-inline" data-inline-field="nuevo">${phases.map(p=>`<option${p===row[4]?' selected':''}>${p}</option>`).join('')}</select>`,
          `<select class="masif-trace-inline" data-inline-field="estado">${statusOptions.map(s=>`<option${s===row[5]?' selected':''}>${s}</option>`).join('')}</select>`,
          `<div class="masif-trace-row-actions"><button type="button" class="save" data-trace-save="${index}">Guardar</button><button type="button" data-trace-cancel="${index}">Cancelar</button><button type="button" data-trace-pdf="${index}">${row[6]?'PDF ✓':'Subir PDF'}</button></div>`
        ];
        return row.slice(0,5).concat(statusCell(row[5],index),`<div class="masif-trace-row-actions"><button type="button" data-trace-edit="${index}" title="Editar">Editar</button><button type="button" class="danger" data-trace-delete="${index}" title="Eliminar">Eliminar</button><button type="button" data-trace-pdf="${index}" title="Subir PDF">${row[6]?'PDF ✓':'Subir PDF'}</button></div>`);
      });
      $('#masifTraceHistory').innerHTML=table(headers,displayRows);
      document.querySelectorAll('#masifTraceHistory [data-trace-status]').forEach(el=>el.onchange=()=>{
        histories[i][Number(el.dataset.traceStatus)][5]=el.value;
        window.showToast&&showToast('Estado actualizado: '+el.value);
      });
      document.querySelectorAll('#masifTraceHistory [data-trace-edit]').forEach(el=>el.onclick=()=>{
        editingHistory={phase:i,row:Number(el.dataset.traceEdit)};
        renderHistory(i);
      });
      document.querySelectorAll('#masifTraceHistory [data-trace-cancel]').forEach(el=>el.onclick=()=>{editingHistory=null;renderHistory(i);});
      document.querySelectorAll('#masifTraceHistory [data-trace-save]').forEach(el=>el.onclick=()=>{
        const rowIndex=Number(el.dataset.traceSave),host=el.closest('tr');
        const value=name=>host.querySelector(`[data-inline-field="${name}"]`).value;
        const inicio=value('inicio'),fin=value('fin');
        if(!inicio||!fin){window.showToast&&showToast('Ingrese la fecha inicial y final');return;}
        if(fin<inicio){window.showToast&&showToast('La fecha final debe ser posterior a la inicial');return;}
        const nextPhase=Math.max(0,phases.indexOf(value('nuevo'))),pdf=histories[i][rowIndex][6]||'';
        const updated=[inicio.split('-').reverse().join('/'),fin.split('-').reverse().join('/'),value('usuario')||currentUser,value('anterior'),value('nuevo'),value('estado'),pdf];
        histories[i].splice(rowIndex,1);
        histories[nextPhase].push(updated);
        editingHistory=null;
        selectPhase(nextPhase);
        window.showToast&&showToast('Registro actualizado en la tabla');
      });
      document.querySelectorAll('#masifTraceHistory [data-trace-delete]').forEach(el=>el.onclick=()=>{
        const rowIndex=Number(el.dataset.traceDelete);
        histories[i].splice(rowIndex,1);
        renderHistory(i);
        window.showToast&&showToast('Registro eliminado del historial');
      });
      document.querySelectorAll('#masifTraceHistory [data-trace-pdf]').forEach(el=>el.onclick=()=>{
        const rowIndex=Number(el.dataset.tracePdf),input=document.createElement('input');
        input.type='file';input.accept='application/pdf,.pdf';
        input.onchange=()=>{
          const file=input.files&&input.files[0];
          if(!file)return;
          if(file.type!=='application/pdf'&&!/\.pdf$/i.test(file.name)){window.showToast&&showToast('Seleccione únicamente un archivo PDF');return;}
          histories[i][rowIndex][6]=file.name;
          renderHistory(i);
          window.showToast&&showToast('PDF asociado al registro');
        };
        input.click();
      });
    }
    function selectPhase(i){
      selectedPhase=i;
      document.querySelectorAll('#masifTraceModal [data-trace-phase]').forEach((el,index)=>el.classList.toggle('selected',index===i));
      $('#masifTraceHistoryTitle').textContent=`Historial · ${i+1}. ${phases[i]}`;
      renderHistory(i);
      $('#masifTraceType').value=phases[i];
    }
    document.querySelectorAll('#masifTraceModal [data-trace-phase]').forEach(el=>el.onclick=()=>selectPhase(Number(el.dataset.tracePhase)));
    $('#masifTraceType').onchange=e=>selectPhase(Math.max(0,phases.indexOf(e.target.value)));
    $('#masifTraceZone').onchange=e=>{
      $('#masifRegZone').value=e.target.value;
      window.showToast&&showToast('Transición de análisis: '+e.target.value);
    };
    $('#masifTraceRegisterClose').onclick=()=>{$('#masifTraceRegisterPanel').hidden=true;editingHistory=null;};
    let selectedPdfName='';
    $('#masifRegPdf').onchange=e=>{
      const file=e.target.files&&e.target.files[0];
      if(!file){selectedPdfName='';$('#masifRegPdfName').textContent='Ningún PDF seleccionado';return;}
      if(file.type!=='application/pdf'&&!/\.pdf$/i.test(file.name)){e.target.value='';selectedPdfName='';$('#masifRegPdfName').textContent='Formato no permitido';window.showToast&&showToast('Seleccione únicamente un archivo PDF');return;}
      selectedPdfName=file.name;
      $('#masifRegPdfName').textContent='PDF cargado: '+file.name;
    };
    $('#masifTraceRegister').onclick=()=>{
      editingHistory=null;
      $('#masifRegSave').textContent='Guardar expediente';
      const code=$('#masifTraceCode').value;
      const key='satcontrol-expediente-'+code;
      let saved=null;
      try{saved=JSON.parse(localStorage.getItem(key)||'null');}catch(e){}
      $('#masifTraceRegisterPanel').hidden=false;
      $('#masifRegCode').value=code;
      if(saved){
        $('#masifTraceRegisterTitle').textContent='Expediente encontrado';
        $('#masifTraceRegisterHint').textContent='La información existente fue consultada y cargada correctamente.';
        $('#masifRegType').value=saved.tipo||phases[0];
        $('#masifRegStart').value=saved.inicio||'';
        $('#masifRegEnd').value=saved.fin||'';
        $('#masifRegUser').value=saved.usuario||currentUser;
        $('#masifRegStatus').value=statusOptions.includes(saved.estado)?saved.estado:'No completado';
        $('#masifRegZone').value=saved.zona||$('#masifTraceZone').value;
        selectedPdfName=saved.pdfNombre||'';
        $('#masifRegPdfName').textContent=selectedPdfName?'PDF guardado: '+selectedPdfName:'Sin PDF asociado';
        const idx=Math.max(0,phases.indexOf(saved.tipo));
        histories[idx]=[[saved.inicio?saved.inicio.split('-').reverse().join('/'):'Pendiente',saved.fin?saved.fin.split('-').reverse().join('/'):'Pendiente',saved.usuario||currentUser,'Registro',saved.tipo||phases[0],saved.estado||'No completado']];
        selectPhase(idx);
        window.showToast&&showToast('Información del expediente cargada');
      }else{
        editingHistory=null;
        $('#masifRegSave').textContent='Guardar expediente';
        $('#masifTraceRegisterTitle').textContent='Generar nuevo expediente';
        $('#masifTraceRegisterHint').textContent='No existe información previa. Complete los campos y guarde el expediente.';
        $('#masifRegType').value=phases[0];$('#masifRegStart').value='';$('#masifRegEnd').value='';$('#masifRegUser').value=currentUser;$('#masifRegStatus').value='No completado';$('#masifRegPdf').value='';selectedPdfName='';$('#masifRegPdfName').textContent='Ningún PDF seleccionado';
        window.showToast&&showToast('Expediente no encontrado: puede generar uno nuevo');
      }
    };
    $('#masifRegSave').onclick=()=>{
      const data={codigo:$('#masifRegCode').value,tipo:$('#masifRegType').value,zona:$('#masifRegZone').value,inicio:$('#masifRegStart').value,fin:$('#masifRegEnd').value,usuario:$('#masifRegUser').value,estado:$('#masifRegStatus').value,pdfNombre:selectedPdfName};
      if(!data.inicio||!data.fin){window.showToast&&showToast('Ingrese la fecha inicial y final');return;}
      if(data.fin<data.inicio){window.showToast&&showToast('La fecha final debe ser posterior a la fecha inicial');return;}
      if(editingHistory){
        const phaseIndex=Math.max(0,phases.indexOf(data.tipo));
        const updated=[data.inicio.split('-').reverse().join('/'),data.fin.split('-').reverse().join('/'),data.usuario,'Registro',data.tipo,data.estado,data.pdfNombre];
        histories[editingHistory.phase].splice(editingHistory.row,1);
        histories[phaseIndex].push(updated);
        editingHistory=null;
        $('#masifRegSave').textContent='Guardar expediente';
        selectPhase(phaseIndex);
        window.showToast&&showToast('Registro del historial actualizado');
        return;
      }
      localStorage.setItem('satcontrol-expediente-'+data.codigo,JSON.stringify(data));
      const idx=Math.max(0,phases.indexOf(data.tipo));
      phaseDates[idx]=[data.inicio.split('-').reverse().join('/'),data.fin.split('-').reverse().join('/')];
      histories[idx]=[[phaseDates[idx][0],phaseDates[idx][1],data.usuario,'Registro',data.tipo,data.estado]];
      $('#masifTraceRegisterTitle').textContent='Expediente guardado';
      $('#masifTraceRegisterHint').textContent='La información quedó disponible para futuras consultas.';
      selectPhase(idx);
      window.showToast&&showToast('Expediente guardado correctamente');
    };
    $('#masifTraceExport').onclick=()=>download('auditoria_trazabilidad_9_fases.csv','Fase,Fecha inicio,Fecha fin,Estado,Responsable\n'+phases.map((p,i)=>`${i+1} - ${p},${phaseDates[i][0]},${phaseDates[i][1]},${i<5?'Completado':i===5?'En avance':'No completado'},${i===5?'Operaciones':'Equipo responsable'}`).join('\n'));
    selectPhase(0);
  }
  function addActions(){const exportBtn=$('#exportExcelBtn');if(!exportBtn)return;if(!$('#masifHuActions'))exportBtn.insertAdjacentHTML('afterend',`<div class="masif-hu-actions" id="masifHuActions"><button type="button" id="masifPotentialBtn">Beneficiarios potenciales</button><button type="button" id="masifTraceBtn">Trazabilidad · 9 fases</button></div>`);const potential=$('#masifPotentialBtn'),trace=$('#masifTraceBtn');if(potential)potential.onclick=openPotential;if(trace)trace.onclick=openTrace;}
  document.addEventListener('click',e=>{const b=e.target.closest('[data-hu-close]');if(b)close(b.dataset.huClose);if(e.target.classList.contains('masif-hu-modal'))e.target.classList.remove('open');});
  window.openMasifTechnicalHu=openTechnical;
  window.openMasifLiquidationHu=openLiquidation;
  function applyProjectTerminology(){
    const replacements=[
      ['#infoName','AGRUPACIÓN SAUNA 1','PROYECTO SAUNA 1'],
      ['#modalTitle','Crear agrupación','Crear proyecto']
    ];
    replacements.forEach(([selector,from,to])=>{const el=$(selector);if(el&&el.textContent.trim()===from)el.textContent=to;});
    const modal=$('#projectModal');
    if(modal){
      const walker=document.createTreeWalker(modal,NodeFilter.SHOW_TEXT);
      const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
      nodes.forEach(node=>{node.nodeValue=node.nodeValue.replace(/agrupaciones/gi,'proyectos').replace(/agrupación/gi,'proyecto');});
    }
  }
  function enhanceBeneficiaryDetails(){
    const original=window.renderMasifSelectedDetail;
    if(typeof original!=='function'||window.__masifBeneficiaryDetailsEnhanced)return;
    window.__masifBeneficiaryDetailsEnhanced=true;
    window.renderMasifSelectedDetail=function(records,selectedRecord){
      original(records,selectedRecord);
      const record=typeof normalizeSelectedRecord==='function'?normalizeSelectedRecord(selectedRecord||records?.[records.length-1]||{}):(selectedRecord||{});
      if(!record.suministro||!record.beneficiario)return;
      const potential=record.esPotencial||record.tipoBeneficiario==='Potencial';
      const box=$('#masifProjectDetail');
      const head=box?.querySelector('.masif-card-head');
      box?.querySelectorAll('.masif-mini').forEach(card=>{const label=card.querySelector('span')?.textContent.trim();if(label==='KM red'||label==='Válvulas')card.remove();});
      if(head)head.insertAdjacentHTML('afterend',`<div style="margin:10px 0;padding:10px 12px;border-radius:12px;border:1px solid ${potential?'#f59e0b':'#3b82f6'};background:${potential?'rgba(245,158,11,.14)':'rgba(59,130,246,.14)'};color:#fff;font-size:11px;font-weight:900"><span style="color:${potential?'#fbbf24':'#60a5fa'}">Clasificación:</span> ${potential?'Beneficiario potencial':'Beneficiario registrado'}<br><span style="color:#94a3b8">Empresa instaladora:</span> ${esc(record.empresaInstaladora||'Por asignar')}</div>`);
    };
  }
  function syncBeneficiaryLegend(){
    const layer=$('#layerBeneficiarios'),legend=$('#masifBeneficiaryLegend');
    if(!layer||!legend)return;
    const update=()=>{legend.style.display=layer.checked?'grid':'none';};
    layer.addEventListener('change',update);update();
  }
  function initMapFilters(){
    const button=$('#mapFiltersBtn'),panel=$('#filtersPanel'),department=$('#districtDepartmentSelect'),province=$('#districtProvinceSelect'),district=$('#mapDistrictFilter'),apply=$('#applyMapFiltersBtn');
    if(!panel||!department||!province||!district)return;
    const list=()=>typeof projects!=='undefined'?projects:[];
    const fill=(select,values,allLabel)=>{const previous=select.value;select.innerHTML=(allLabel?`<option value="">${allLabel}</option>`:'')+[...new Set(values.filter(Boolean))].map(v=>`<option>${esc(v)}</option>`).join('');if([...select.options].some(o=>o.value===previous))select.value=previous;};
    const populate=level=>{
      const rows=list();
      if(level==='all')fill(department,rows.map(p=>p.departamento),'Todos');
      const byDepartment=rows.filter(p=>!department.value||p.departamento===department.value);
      fill(province,byDepartment.map(p=>p.provincia),'Todas');
      const byProvince=byDepartment.filter(p=>!province.value||p.provincia===province.value);
      fill(district,byProvince.map(p=>p.distrito),'Todos');
    };
    populate('all');
    department.addEventListener('change',()=>populate('department'));
    province.addEventListener('change',()=>populate('province'));
    const openFilters=()=>{const wasOpen=panel.classList.contains('open');document.querySelectorAll('.map-floating-panel.open').forEach(x=>x.classList.remove('open'));document.querySelectorAll('.gis-toolbar .active').forEach(x=>x.classList.remove('active'));if(!wasOpen){panel.classList.add('open');button?.classList.add('active');}return !wasOpen;};
    window.openMasifMapFilters=openFilters;
    button?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();openFilters();});
    ['mapasBtn','capasBtn','tematicosBtn'].forEach(id=>$('#'+id)?.addEventListener('click',()=>{panel.classList.remove('open');button?.classList.remove('active');}));
    apply?.addEventListener('click',()=>{
      const match=list().find(p=>(!department.value||p.departamento===department.value)&&(!province.value||p.provincia===province.value)&&(!district.value||p.distrito===district.value));
      if(match&&typeof selectProject==='function')selectProject(match.id);
      panel.classList.remove('open');button?.classList.remove('active');
      if(window.showToast)showToast(match?'Filtro aplicado: '+(match.nombre||match.id):'No hay proyectos con esos filtros');
    });
  }
  function init(){applyProjectTerminology();enhanceBeneficiaryDetails();syncBeneficiaryLegend();$('#masifLocationFilter')?.remove();initMapFilters();addActions();const p=current();if(p&&typeof renderMasifProjectDetail==='function')renderMasifProjectDetail(p,projectProfile());}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else setTimeout(init,0);
})();
