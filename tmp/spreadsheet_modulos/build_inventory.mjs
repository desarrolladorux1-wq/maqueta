import fs from 'node:fs/promises';
import path from 'node:path';
import { Workbook, SpreadsheetFile } from '@oai/artifact-tool';

const outputDir = path.resolve('outputs/inventario_modulos_satcontrol');
await fs.mkdir(outputDir, { recursive: true });

const modules = [
  {
    name: 'Vale FISE', short: 'Vale FISE', purpose: 'Seguimiento de beneficiarios, vales GLP, canjes y alertas territoriales.',
    rows: [
      ['Panel izquierdo','Beneficiarios de Vale y agrupaciones','Permite revisar y seleccionar registros o agrupaciones disponibles.','Panel izquierdo'],
      ['Mapa','Puntos de beneficiarios y agentes','Ubica beneficiarios y lugares relacionados con el canje del vale.','Centro'],
      ['Mapas base','OSM y estilos alternativos','Cambia la presentación del mapa base.','Botón Mapas'],
      ['Capas','Beneficiarios y elementos operativos','Activa u oculta información territorial sobre el mapa.','Botón Capas'],
      ['Temáticos','Densidad de beneficiarios','Muestra un mapa de calor y oculta los puntos para facilitar la lectura.','Botón Temáticos'],
      ['Filtros','EDE, periodo y datos territoriales','Reduce la información mostrada según los criterios elegidos.','Panel de filtros'],
      ['Consulta','DNI o código de suministro','Busca un beneficiario y permite localizar un agente autorizado cercano.','Panel izquierdo'],
      ['Panel derecho','Detalle de suministro','Presenta la información del registro seleccionado.','Panel derecho'],
      ['Reporte de canjes','Canjes al corte del día','Muestra el consolidado diario y admite carga de Excel para EDE pequeñas.','Panel derecho / modal'],
      ['Alertas','Anomalías de canje','Presenta reglas por canjes excesivos, duplicidad y registro histórico.','Panel derecho'],
      ['Exportación','Selección y reportes','Permite descargar información filtrada para análisis externo.','Botones de exportación'],
      ['Selección GIS','Punto, círculo y área','Calcula información de los registros incluidos en una selección territorial.','Herramientas del mapa']
    ]
  },
  {
    name: 'Ahorro GNV', short: 'Ahorro GNV', purpose: 'Monitoreo de conversiones vehiculares, recargas, talleres, grifos, cobranza y financiamiento.',
    rows: [
      ['Panel izquierdo','Expedientes vehiculares','Lista y busca los registros vinculados al programa Ahorro GNV.','Panel izquierdo'],
      ['Mapa','Vehículos, talleres y grifos','Ubica registros y puntos de atención dentro del área de trabajo.','Centro'],
      ['Capas','Talleres autorizados y grifos','Activa los puntos de interés requeridos para el programa.','Botón Capas'],
      ['Capa temática','Grifos con halos de alerta','Usa verde, amarillo y rojo para representar alertas de tanqueo.','Mapa'],
      ['Temáticos','Mapas de calor GNV','Representa concentraciones de conversiones, recargas o alertas.','Botón Temáticos'],
      ['Filtros','Periodo, región, ubicación, grifo, combustible y cilindros','Refina registros por tiempo, territorio y características del vehículo.','Panel de filtros'],
      ['Panel derecho','Detalle de suministro o beneficiario','Muestra datos personales, técnicos, instalación y estado del registro seleccionado.','Panel derecho'],
      ['Taller seleccionado','Información del taller','Carga la información del taller directamente en el panel derecho.','Panel derecho'],
      ['Grifo seleccionado','Estado, dirección y placas asociadas','Muestra alertas de tanqueo y vehículos relacionados.','Panel derecho'],
      ['Reporte recargas','Recargas y Bono Provincia','Consolida semanalmente por ciudad y grifo, con paginación.','Botón bajo Exportar selección'],
      ['Morosidad y cobranza','Cuotas, mensajes y exportación','Permite revisar deuda, seguimiento y comunicación simulada.','Utilitarios / modal'],
      ['COFIDE','Sincronización de recaudos y financiamientos','Muestra estado de la conexión y bitácora simulada de la API.','Parte inferior del panel derecho'],
      ['IA documental','DNI, TIV y firmas','Simula alertas por alteraciones y comparación de firmas.','Herramienta flotante'],
      ['Exportación','CSV y XLSX','Descarga información de registros y selecciones.','Botón Exportar']
    ]
  },
  {
    name: 'BonoGas', short: 'BonoGas', purpose: 'Monitoreo de suministros, instalaciones, liquidaciones, plazos y penalidades.',
    rows: [
      ['Vista general','Resumen nacional BonoGas','Muestra total de registros, beneficiarios, territorios, empresas y estados.','Panel derecho al iniciar'],
      ['Mapa','Beneficiarios y manzanas','Representa los registros del programa y permite seleccionarlos.','Centro'],
      ['Capas','Elementos BonoGas','Activa la información geográfica disponible para el programa.','Botón Capas'],
      ['Temáticos','Mapas de calor BonoGas','Muestra densidad por beneficiarios, instalaciones o estados del programa.','Botón Temáticos'],
      ['Filtros','Departamento, distrito, estrato, empresa, concesionaria y fechas','Permite limitar los registros visibles.','Panel de filtros'],
      ['Filtros de beneficiario','Tipo y subtipo','Distingue residencial, no residencial, comercial, institución pública, industrial u otros.','Panel de filtros'],
      ['Panel derecho','Información del beneficiario','Al seleccionar un punto reemplaza el resumen general por la ficha del registro.','Panel derecho'],
      ['Datos del registro','Beneficiario, estrato, material y empresa','Presenta la información principal solicitada para cada suministro.','Panel derecho'],
      ['Plazo de 20 días','Control de instalación','Identifica suministros que exceden el plazo de instalación.','Modal bajo Artículo 25'],
      ['Artículo 25.9','Penalidades por más de 90 días','Lista casos, histórico de penalidades y empresas instaladoras.','Modal de control de plazos'],
      ['KPIs de plazos','Fuera de plazo, dentro de plazo, habilitados y total','Filtra la tabla al seleccionar cada indicador.','Modal de plazos'],
      ['Notificaciones','Aviso a empresas instaladoras','Simula el envío de notificaciones automáticas.','Botón junto a exportación'],
      ['Ranking','Empresas instaladoras','Compara resultados y permite exportar en Excel, CSV y PDF.','Sección Ranking'],
      ['Sincronización','Portal de Habilitaciones','Simula actualización por número de instalación y control de duplicidad.','Parte inferior del panel derecho'],
      ['Exportación','Datos filtrados y reportes','Descarga la información según los filtros y estados seleccionados.','Botones de exportación']
    ]
  },
  {
    name: 'Masificación', short: 'Masificación', purpose: 'Seguimiento GIS de proyectos de redes de gas, beneficiarios potenciales, liquidaciones y expedientes.',
    rows: [
      ['Panel izquierdo','Proyectos','Lista, busca, crea, edita y elimina proyectos de masificación.','Panel izquierdo'],
      ['Mapa','Área del proyecto y objetos GIS','Muestra el límite del proyecto, redes, predios y beneficiarios.','Centro'],
      ['Capas','Estratos y lotes, beneficiarios, troncal, ramales y concesionarias','Permite superponer información geográfica relacionada con el proyecto.','Botón Capas'],
      ['Estratos','Estratos 1 a 5','Activa o desactiva cada estrato y colorea los lotes catastrales.','Panel Capas'],
      ['Subir capas','KML, GPX y GeoJSON','Simula la incorporación de archivos GIS al mapa.','Botón Subir capas'],
      ['Filtros','Ubicación del proyecto','Filtra por departamento, provincia y distrito desde una herramienta del mapa.','Herramienta Filtros'],
      ['Panel derecho','Información completa del proyecto','Presenta estado, tipo, área, red, beneficiarios, viviendas, inversión y válvulas.','Panel derecho'],
      ['Beneficiarios potenciales','Cálculo por predios y área de influencia','Estima viviendas residenciales y posibles beneficiarios dentro del proyecto.','Modal / herramienta'],
      ['Liquidaciones','Partidas VNR y objetos GIS','Relaciona partidas, cantidades, tarifas y objetos espaciales.','Herramienta flotante'],
      ['Liquidación total','Casilla de 100%','Cambia la liquidación parcial a liquidación total.','Modal Liquidaciones'],
      ['Informe técnico','Informe y resolución simulados','Genera documentos técnicos con información del proyecto.','Herramienta flotante'],
      ['Trazabilidad','Nueve fases del expediente','Permite revisar fases, fechas, usuario, estados y acciones.','Herramienta flotante'],
      ['Registro de expediente','Consultar, cargar PDF y guardar','Carga datos existentes o permite registrar un expediente nuevo.','Modal Trazabilidad'],
      ['Historial','Editar, eliminar y subir PDF','Administra los registros de cada fase desde iconos de acción.','Tabla de historial'],
      ['Exportación','Auditoría y beneficiarios potenciales','Descarga información del proyecto y su trazabilidad.','Botones de exportación']
    ]
  },
  {
    name: 'Electricidad al Toque', short: 'Electricidad', purpose: 'Seguimiento de beneficiarios, estado del trámite, brechas eléctricas y liquidación Anexo 4.',
    rows: [
      ['Panel izquierdo','Buscador por DNI o suministro','Localiza un beneficiario usando un único buscador.','Panel izquierdo'],
      ['KPIs','Total, instalación, finalizado y liquidado','Resume los registros según el estado del trámite.','Panel izquierdo'],
      ['Filtro','Estado del trámite','Filtra por Instalación, Finalizado o Liquidado.','Panel izquierdo'],
      ['Mapa','Puntos de beneficiarios','Ubica beneficiarios y permite abrir su ficha.','Centro'],
      ['Capa','Beneficiarios','Activa u oculta los puntos de beneficiarios.','Botón Capas'],
      ['Capa','Hogares sin electricidad','Muestra viviendas priorizadas que aún no cuentan con servicio.','Botón Capas'],
      ['Temático','Mapa de calor de montos desembolsados por zona','Representa intensidad de desembolsos y oculta temporalmente los puntos.','Botón Temáticos'],
      ['Panel derecho','Información del beneficiario','Muestra suministro, región, provincia, distrito, nombres, apellidos, dirección y documento.','Panel derecho'],
      ['Datos técnicos','Conexión, medidor, potencia y comprobantes','Presenta información técnica y económica complementaria.','Panel derecho'],
      ['Expedientes digitales','Carga de PDF y fotografías para sedes manuales','Simula el registro de documentación digital.','Panel derecho / modal'],
      ['Anexo 4','Validación contra FICEF','Carga Excel, cruza suministros y coordenadas y muestra inconsistencias.','Herramienta flotante'],
      ['Liquidación','Reporte de liquidación Anexo 4','Genera el sustento simulado para reembolso.','Modal Anexo 4'],
      ['Selección GIS','Punto y círculo','Permite seleccionar uno o varios beneficiarios sobre el mapa.','Herramientas del mapa']
    ]
  },
  {
    name: 'MCTER', short: 'MCTER', purpose: 'Cobertura de compensación tarifaria, resoluciones, desembolsos y saldos por empresa.',
    rows: [
      ['Panel izquierdo','Control de beneficiarios','Busca y filtra los beneficiarios compensados.','Panel izquierdo'],
      ['Filtros territoriales','Regional, provincial y distrital','Cambia el nivel de análisis del mapa.','Panel izquierdo'],
      ['Filtros','Empresa distribuidora y periodo','Refina beneficiarios y compensaciones visibles.','Panel izquierdo'],
      ['Mapa','Beneficiarios MCTER','Ubica los suministros compensados a nivel nacional.','Centro'],
      ['Capas','Beneficiarios y capas operativas','Controla la información territorial visible.','Botón Capas'],
      ['Temáticos','Densidad de suministros compensados','Muestra mapa de calor con niveles de muy baja a muy alta densidad.','Botón Temáticos'],
      ['Leyenda','Densidad por rangos','Explica los colores del mapa según la cantidad de suministros.','Mapa'],
      ['Panel derecho','Información del beneficiario','Muestra la ficha completa del registro seleccionado.','Panel derecho'],
      ['Filtros aplicados','Zonas, suministros y compensación','Resume el resultado de los filtros.','Panel derecho'],
      ['Reporte de saldos','Detalle por empresa distribuidora','Presenta montos, resoluciones y saldos pendientes.','Panel derecho / modal'],
      ['Resoluciones','Registro de resoluciones Osinergmin','Guarda montos por distribuidora en la maqueta.','Herramienta flotante'],
      ['Desembolsos','Vinculación a resoluciones','Asocia desembolsos y muestra su seguimiento.','Modal Resoluciones y desembolsos'],
      ['Exportación','Reporte de saldos y detalle','Descarga información para revisión contable.','Modal de reportes'],
      ['Evidencias','No se muestra','La sección fotográfica fue retirada de este módulo.','No aplica']
    ]
  },
  {
    name: 'Fotovoltaico', short: 'Fotovoltaico', purpose: 'Inventario geográfico de sistemas solares, mantenimiento, estados y procesamiento DGER.',
    rows: [
      ['Panel izquierdo','Inventario de sistemas fotovoltaicos','Busca registros y muestra sus estados principales.','Panel izquierdo'],
      ['KPIs','Total, operativos, observados e inactivos','Resume el inventario cargado.','Panel izquierdo'],
      ['Mapa','Puntos de sistemas solares','Ubica instalaciones fotovoltaicas y permite seleccionarlas.','Centro'],
      ['Capas','Sistemas y capas de apoyo','Activa información geográfica relevante para el inventario.','Botón Capas'],
      ['Temáticos','Densidad o estado de sistemas','Representa concentraciones y condiciones del inventario.','Botón Temáticos'],
      ['Panel derecho','Ficha del panel solar','Muestra coordenadas, tecnología, capacidad, batería y mantenimiento.','Panel derecho'],
      ['Cambio de ubicación','Bitácora de movimientos','Registra cambios simulados de coordenadas.','Panel izquierdo / modal'],
      ['Cambio de estado','Operativo, observado o inactivo','Actualiza el estado del sistema seleccionado.','Modal'],
      ['Evidencias','Fotografías de instalación','Permite cargar o reemplazar imágenes asociadas al sistema.','Panel derecho'],
      ['DGER','Carga de Excel de resoluciones','Procesa información de instalaciones, morosidad e IGV.','Herramienta flotante'],
      ['Reporte técnico','Sustento para transferencia','Genera un reporte simulado en Excel o PDF.','Modal DGER'],
      ['Selección GIS','Punto, círculo y conjunto','Resume sistemas incluidos dentro de una selección.','Herramientas del mapa']
    ]
  },
  {
    name: 'Administrador', short: 'Administrador', purpose: 'Administración de usuarios, perfiles, permisos, proyectos y configuración general.',
    rows: [
      ['Usuarios','Crear usuario','Registra datos básicos y asigna un perfil.','Menú Usuarios'],
      ['Perfiles','Selector de rol o perfil','Asigna el nivel de acceso funcional del usuario.','Formulario de usuario'],
      ['Listado','Usuarios y perfil asignado','Muestra los usuarios existentes y su perfil.','Tabla de usuarios'],
      ['Proyectos','Crear proyectos','Registra proyectos desde el módulo administrativo.','Menú Proyectos'],
      ['Proyectos','Listar proyectos','Consulta los proyectos registrados.','Menú Proyectos'],
      ['Proyectos','Eliminar proyectos','Permite retirar un proyecto de la maqueta.','Menú Proyectos'],
      ['SATCONTROL','Acceso al visor','Abre los módulos GIS y sus paneles.','Menú principal'],
      ['Permisos','Acceso por módulo','Relaciona perfiles con los módulos habilitados.','Configuración de usuario'],
      ['Perfil','Información de cuenta','Permite revisar la información del usuario autenticado.','Menú de perfil'],
      ['Sesión','Cerrar sesión','Finaliza el acceso y vuelve al inicio de sesión.','Menú de perfil']
    ]
  },
  {
    name: 'Acceso y Mis Apps', short: 'Acceso', purpose: 'Ingreso a la maqueta, elección de módulo y accesos habilitados para el usuario.',
    rows: [
      ['Inicio de sesión','Usuario, contraseña y módulo inicial','Valida las credenciales de demostración y conserva el selector de módulos.','Login'],
      ['Credenciales de demostración','renzo / 123456','Permite ingresar a la maqueta para realizar pruebas.','Login'],
      ['Pantalla de accesos','Aplicaciones disponibles','Muestra Vale FISE con ingreso directo y otros servicios para autenticación.','Después del login'],
      ['Vale FISE','Ingreso directo','Abre el módulo sin una segunda autenticación.','Pantalla de accesos'],
      ['Otros servicios','Autenticación por aplicación','Abre una ventana breve de autenticación antes de ingresar.','Pantalla de accesos'],
      ['Mis Apps','Accesos habilitados','Muestra Vale FISE, Ahorro GNV y la opción de solicitar nuevos servicios.','Menú de perfil'],
      ['Solicitud de acceso','Nuevos servicios o módulos','Simula el autoservicio para pedir accesos futuros.','Modal Mis Apps'],
      ['Perfil','Ver perfil','Muestra información de la cuenta.','Menú de perfil'],
      ['Sesión','Cerrar sesión','Regresa a la pantalla inicial.','Menú de perfil']
    ]
  }
];

const wb = Workbook.create();
const navy = '#12203A';
const blue = '#1F6FEB';
const cyan = '#29B6D1';
const pale = '#EAF3FF';
const soft = '#F5F8FC';
const border = '#CBD7E6';
const text = '#24324A';

function titleBand(sheet, title, subtitle, endCol='D') {
  sheet.showGridLines = false;
  sheet.mergeCells(`A1:${endCol}1`);
  sheet.getRange('A1').values = [[title]];
  sheet.getRange(`A1:${endCol}1`).format = {fill:navy,font:{bold:true,color:'#FFFFFF',size:18},verticalAlignment:'center'};
  sheet.getRange('A1').format.rowHeight = 32;
  sheet.mergeCells(`A2:${endCol}2`);
  sheet.getRange('A2').values = [[subtitle]];
  sheet.getRange(`A2:${endCol}2`).format = {fill:pale,font:{color:text,italic:true,size:10},wrapText:true,verticalAlignment:'center'};
  sheet.getRange('A2').format.rowHeight = 30;
}

const summary = wb.worksheets.add('Resumen');
titleBand(summary,'Inventario funcional de módulos SATCONTROL','Contenido visible y funciones principales de la maqueta, descritos en lenguaje no técnico.','H');
summary.getRange('A4:H4').values = [['Módulo','Objetivo funcional','Panel izquierdo','Mapa y registros','Capas / temáticos','Panel derecho','Herramientas / reportes','N.º componentes']];
const summaryRows = modules.slice(0,8).map(m => {
  const find = k => m.rows.filter(r=>r[0].toLowerCase().includes(k)).map(r=>r[1]).slice(0,3).join(' · ') || 'Según selección';
  return [m.short,m.purpose,find('panel izquierdo'),find('mapa'),[find('capa'),find('temático')].filter(Boolean).join(' · '),find('panel derecho'),m.rows.filter(r=>/reporte|exportación|herramienta|liquidación|resoluciones|anexo/i.test(r[0])).map(r=>r[1]).slice(0,4).join(' · '),m.rows.length];
});
summary.getRange(`A5:H${4+summaryRows.length}`).values = summaryRows;
summary.getRange('A4:H4').format = {fill:blue,font:{bold:true,color:'#FFFFFF'},wrapText:true,verticalAlignment:'center'};
summary.getRange(`A5:H${4+summaryRows.length}`).format = {font:{color:text,size:10},wrapText:true,verticalAlignment:'top',borders:{insideHorizontal:{style:'thin',color:border}}};
summary.getRange(`A5:A${4+summaryRows.length}`).format = {fill:pale,font:{bold:true,color:navy}};
summary.getRange(`H5:H${4+summaryRows.length}`).format.numberFormat = '0';
summary.getRange('A4:H12').format.autofitRows();
const summaryWidths = [18,38,25,27,32,30,36,15];
summaryWidths.forEach((w,i)=>summary.getRangeByIndexes(0,i,12,1).format.columnWidth=w);
summary.freezePanes.freezeRows(4);
summary.tables.add('A4:H12',true,'ResumenModulosTable').style='TableStyleMedium2';

for (const mod of modules) {
  const sheetName = mod.name.length > 31 ? mod.short : mod.name;
  const sh = wb.worksheets.add(sheetName);
  titleBand(sh,mod.name,mod.purpose,'D');
  sh.getRange('A4:D4').values = [['Sección','Qué contiene','Para qué sirve','Dónde aparece']];
  sh.getRange(`A5:D${4+mod.rows.length}`).values = mod.rows;
  sh.getRange('A4:D4').format = {fill:cyan,font:{bold:true,color:'#FFFFFF'},verticalAlignment:'center'};
  sh.getRange(`A5:D${4+mod.rows.length}`).format = {font:{color:text,size:10},wrapText:true,verticalAlignment:'top',borders:{insideHorizontal:{style:'thin',color:border}}};
  sh.getRange(`A5:A${4+mod.rows.length}`).format = {fill:pale,font:{bold:true,color:navy}};
  for(let row=6;row<=4+mod.rows.length;row+=2) sh.getRange(`B${row}:D${row}`).format.fill=soft;
  sh.getRange(`A4:D${4+mod.rows.length}`).format.autofitRows();
  [22,36,54,25].forEach((w,i)=>sh.getRangeByIndexes(0,i,4+mod.rows.length,1).format.columnWidth=w);
  sh.freezePanes.freezeRows(4);
  sh.tables.add(`A4:D${4+mod.rows.length}`,true,`T_${mod.short.replace(/[^A-Za-z0-9]/g,'')}`).style='TableStyleMedium2';
}

const check = await wb.inspect({kind:'table',range:'Resumen!A1:H12',include:'values,formulas',tableMaxRows:15,tableMaxCols:10,maxChars:7000});
console.log(check.ndjson);
const errors = await wb.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A',options:{useRegex:true,maxResults:100},summary:'formula scan'});
console.log(errors.ndjson);

for (const sh of ['Resumen',...modules.map(m=>m.name.length>31?m.short:m.name)]) {
  const preview = await wb.render({sheetName:sh,autoCrop:'all',scale:1,format:'png'});
  const safe=sh.replace(/[^A-Za-z0-9_-]+/g,'_');
  await fs.writeFile(path.join(outputDir,`preview_${safe}.png`),new Uint8Array(await preview.arrayBuffer()));
}

const xlsx = await SpreadsheetFile.exportXlsx(wb);
const outPath = path.join(outputDir,'Inventario_funcional_modulos_SATCONTROL.xlsx');
await xlsx.save(outPath);
console.log(`OUTPUT=${outPath}`);
