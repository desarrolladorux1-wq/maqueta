import fs from 'node:fs/promises';
import path from 'node:path';
import { FileBlob, SpreadsheetFile } from '@oai/artifact-tool';

const sourcePath = path.resolve('outputs/inventario_modulos_satcontrol/Inventario_funcional_modulos_SATCONTROL.xlsx');
const outputDir = path.resolve('outputs/inventario_modulos_satcontrol_v2');
await fs.mkdir(outputDir, { recursive: true });

const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(sourcePath));

const navy = '#101A36';
const navy2 = '#18264A';
const cyan = '#47C8E8';
const blue = '#5B7CFA';
const pale = '#EDF4FF';
const white = '#FFFFFF';
const muted = '#9DABCC';
const border = '#34466F';
const pending = '#F4B942';

const items = [
  ['V2-001','Vale FISE','Definir y validar el alcance funcional de la versión 2','Pendiente de definir',0,'Media','Por asignar',null,'Se conserva V1 como referencia funcional.'],
  ['V2-002','Ahorro GNV','Definir mejoras de seguimiento territorial y operativo','Pendiente de definir',0,'Media','Por asignar',null,'Contenido V2 pendiente de validación.'],
  ['V2-003','BonoGas','Definir mejoras de monitoreo, plazos y sincronización','Pendiente de definir',0,'Media','Por asignar',null,'Contenido V2 pendiente de validación.'],
  ['V2-004','Masificación','Definir mejoras GIS, proyectos y trazabilidad','Pendiente de definir',0,'Alta','Por asignar',null,'Contenido V2 pendiente de validación.'],
  ['V2-005','Electricidad al Toque','Definir mejoras de beneficiarios, evidencias y estados','Pendiente de definir',0,'Media','Por asignar',null,'Contenido V2 pendiente de validación.'],
  ['V2-006','MCTER','Definir mejoras de beneficiarios, resoluciones y desembolsos','Pendiente de definir',0,'Media','Por asignar',null,'Contenido V2 pendiente de validación.'],
  ['V2-007','Fotovoltaico','Definir mejoras de inventario y procesamiento DGER','Pendiente de definir',0,'Media','Por asignar',null,'Contenido V2 pendiente de validación.'],
  ['V2-008','Administrador','Definir mejoras de usuarios, perfiles y permisos','Pendiente de definir',0,'Alta','Por asignar',null,'Contenido V2 pendiente de validación.'],
  ['V2-009','Acceso y Mis Apps','Definir mejoras de autenticación y accesos','Pendiente de definir',0,'Alta','Por asignar',null,'Contenido V2 pendiente de validación.']
];

const tracking = wb.worksheets.add('Tracking V2');
tracking.mergeCells('A1:I1');
tracking.getRange('A1').values = [['TRACKING FUNCIONAL SATCONTROL · VERSIÓN 2']];
tracking.getRange('A1:I1').format = {fill:navy,font:{bold:true,color:white,size:18},horizontalAlignment:'center',verticalAlignment:'center'};
tracking.getRange('A1:I1').format.rowHeight = 34;
tracking.mergeCells('A2:I2');
tracking.getRange('A2').values = [['Versión 2 en planificación · estructura preparada para registrar decisiones, responsables y avance']];
tracking.getRange('A2:I2').format = {fill:navy2,font:{italic:true,color:muted,size:11},horizontalAlignment:'center',verticalAlignment:'center'};
tracking.getRange('A2:I2').format.rowHeight = 24;

tracking.getRange('A4:B4').merge(); tracking.getRange('A4').values=[['Versión base']];
tracking.getRange('C4:D4').merge(); tracking.getRange('C4').values=[['Versión objetivo']];
tracking.getRange('E4:F4').merge(); tracking.getRange('E4').values=[['Estado general']];
tracking.getRange('G4:H4').merge(); tracking.getRange('G4').values=[['Avance general']];
tracking.getRange('I4').values=[['Actualizado']];
tracking.getRange('A4:I4').format={fill:cyan,font:{bold:true,color:navy},horizontalAlignment:'center',verticalAlignment:'center'};
tracking.getRange('A5:B5').merge(); tracking.getRange('A5').values=[['V1 operativa']];
tracking.getRange('C5:D5').merge(); tracking.getRange('C5').values=[['V2']];
tracking.getRange('E5:F5').merge(); tracking.getRange('E5').values=[['En planificación']];
tracking.getRange('G5:H5').merge(); tracking.getRange('G5').values=[[0]]; tracking.getRange('G5:H5').format.numberFormat='0%';
tracking.getRange('I5').values=[[new Date(2026,7,7)]]; tracking.getRange('I5').format.numberFormat='dd/mm/yyyy';
tracking.getRange('A5:I5').format={fill:pale,font:{bold:true,color:navy},horizontalAlignment:'center',verticalAlignment:'center',borders:{top:{color:border,style:'thin'},bottom:{color:border,style:'thin'},left:{color:border,style:'thin'},right:{color:border,style:'thin'}}};

const headers=['ID','Módulo','Componente / mejora V2','Estado','Avance','Prioridad','Responsable','Fecha objetivo','Observaciones'];
tracking.getRange('A7:I7').values=[headers];
tracking.getRange('A7:I7').format={fill:blue,font:{bold:true,color:white},horizontalAlignment:'center',verticalAlignment:'center',wrapText:true};
tracking.getRange(`A8:I${7+items.length}`).values=items;
tracking.getRange(`A8:I${7+items.length}`).format={font:{color:navy,size:10},verticalAlignment:'center',wrapText:true,borders:{top:{color:'#D6DFF2',style:'thin'},bottom:{color:'#D6DFF2',style:'thin'},left:{color:'#D6DFF2',style:'thin'},right:{color:'#D6DFF2',style:'thin'}}};
for(let r=8;r<=7+items.length;r++){
  tracking.getRange(`A${r}:I${r}`).format.fill = r%2===0 ? '#F8FAFF' : pale;
  tracking.getRange(`D${r}`).format = {fill:'#FFF4D6',font:{bold:true,color:'#8A5A00'},horizontalAlignment:'center',verticalAlignment:'center'};
  tracking.getRange(`E${r}`).format.numberFormat='0%';
  tracking.getRange(`E${r}:H${r}`).format.horizontalAlignment='center';
}
tracking.getRange(`D8:D${7+items.length}`).dataValidation={rule:{type:'list',formula1:'"Pendiente de definir,En análisis,En diseño,En desarrollo,En validación,Completado"'}};
tracking.getRange(`F8:F${7+items.length}`).dataValidation={rule:{type:'list',formula1:'"Alta,Media,Baja"'}};
tracking.getRange(`H8:H${7+items.length}`).format.numberFormat='dd/mm/yyyy';
tracking.getRange('A7:I16').format.autofitRows();
const widths=[12,22,42,23,12,12,18,16,42];
for(let c=0;c<widths.length;c++) tracking.getRangeByIndexes(0,c,16,1).format.columnWidth=widths[c];
tracking.freezePanes.freezeRows(7);
tracking.tables.add('A7:I16',true,'TrackingV2');

const summary = wb.worksheets.getItem('Resumen');
summary.getRange('I4:L4').values=[['Estado V2','Avance V2','Responsable V2','Observación V2']];
summary.getRange('I4:L4').format={fill:blue,font:{bold:true,color:white},horizontalAlignment:'center',verticalAlignment:'center',wrapText:true};
for(let r=5;r<=12;r++){
  summary.getRange(`I${r}:L${r}`).values=[['Pendiente de definir',0,'Por asignar','V1 se mantiene como referencia.']];
  summary.getRange(`I${r}:L${r}`).format={fill:r%2===1?'#F8FAFF':pale,font:{color:navy,size:10},verticalAlignment:'center',wrapText:true,borders:{top:{color:'#D6DFF2',style:'thin'},bottom:{color:'#D6DFF2',style:'thin'},left:{color:'#D6DFF2',style:'thin'},right:{color:'#D6DFF2',style:'thin'}}};
  summary.getRange(`I${r}`).format={fill:'#FFF4D6',font:{bold:true,color:'#8A5A00'},horizontalAlignment:'center',verticalAlignment:'center'};
  summary.getRange(`J${r}`).format.numberFormat='0%';
}
summary.getRange('I5:I12').dataValidation={rule:{type:'list',formula1:'"Pendiente de definir,En análisis,En diseño,En desarrollo,En validación,Completado"'}};
summary.getRange('I1:L20').format.columnWidth=18;
summary.getRange('L1:L20').format.columnWidth=34;

const sheetRows={
  'Vale FISE':16,'Ahorro GNV':18,'BonoGas':19,'Masificación':19,
  'Electricidad al Toque':17,'MCTER':18,'Fotovoltaico':16,'Administrador':14,'Acceso y Mis Apps':13
};
for(const [name,lastRow] of Object.entries(sheetRows)){
  const sh=wb.worksheets.getItem(name);
  sh.getRange('E4:H4').values=[['Estado V2','Avance V2','Mejora / cambio V2','Observaciones V2']];
  sh.getRange('E4:H4').format={fill:blue,font:{bold:true,color:white},horizontalAlignment:'center',verticalAlignment:'center',wrapText:true};
  for(let r=5;r<=lastRow;r++){
    sh.getRange(`E${r}:H${r}`).values=[['Pendiente de definir',0,'Por validar con el área usuaria','La funcionalidad de V1 se conserva como referencia.']];
    sh.getRange(`E${r}:H${r}`).format={fill:r%2===1?'#F8FAFF':pale,font:{color:navy,size:10},verticalAlignment:'center',wrapText:true,borders:{top:{color:'#D6DFF2',style:'thin'},bottom:{color:'#D6DFF2',style:'thin'},left:{color:'#D6DFF2',style:'thin'},right:{color:'#D6DFF2',style:'thin'}}};
    sh.getRange(`E${r}`).format={fill:'#FFF4D6',font:{bold:true,color:'#8A5A00'},horizontalAlignment:'center',verticalAlignment:'center'};
    sh.getRange(`F${r}`).format.numberFormat='0%';
  }
  sh.getRange(`E5:E${lastRow}`).dataValidation={rule:{type:'list',formula1:'"Pendiente de definir,En análisis,En diseño,En desarrollo,En validación,Completado"'}};
  sh.getRange(`E1:E${lastRow}`).format.columnWidth=22;
  sh.getRange(`F1:F${lastRow}`).format.columnWidth=12;
  sh.getRange(`G1:G${lastRow}`).format.columnWidth=31;
  sh.getRange(`H1:H${lastRow}`).format.columnWidth=38;
  sh.getRange(`A4:H${lastRow}`).format.autofitRows();
}

const sheets=['Tracking V2','Resumen',...Object.keys(sheetRows)];
for(const name of sheets){
  const preview=await wb.render({sheetName:name,autoCrop:'all',scale:1,format:'png'});
  const safe=name.replace(/[^A-Za-z0-9_-]+/g,'_');
  await fs.writeFile(path.join(outputDir,`preview_${safe}.png`),new Uint8Array(await preview.arrayBuffer()));
}

const outPath=path.join(outputDir,'Inventario_funcional_modulos_SATCONTROL_V2_tracking.xlsx');
await (await SpreadsheetFile.exportXlsx(wb)).save(outPath);

const inspect=await wb.inspect({kind:'table',range:'Tracking V2!A1:I16',include:'values,formulas',tableMaxRows:20,tableMaxCols:12});
await fs.writeFile(`${outPath}.inspect.json`,JSON.stringify(inspect,null,2),'utf8');
console.log(outPath);
