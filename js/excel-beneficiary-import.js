(function (global) {
  'use strict';

  var BONOGAS_BENEF_HEADERS = ['DATOS_TITULAR', 'CODIGO_USUARIO', 'DNI', 'ZONA', 'REGIONES', 'DEPARTAMENTO', 'PROVINCIA', 'DISTRITO', 'CENTROPOBLADO', 'UBIGEO', 'ESTRATO', 'TIPO_BENEFICIARIO', 'NUM_SUMINISTRO', 'NUM_INSTALACION', 'CONCESIONARIA', 'EMPRESA_INSTALADORA', 'ESTADO_INSTALACION', 'FECHA_REGISTRO', 'FECHA_HABILITACION', 'FUENTE'];
  var BONOGAS_BENEF_KEYS = ['datosTitular', 'codigoUsuario', 'dni', 'zona', 'regiones', 'departamento', 'provincia', 'distrito', 'centroPoblado', 'ubigeo', 'estrato', 'tipoBeneficiario', 'numSuministro', 'numInstalacion', 'concesionaria', 'empresaInstaladora', 'estadoInstalacion', 'fechaRegistro', 'fechaHabilitacion', 'fuente'];
  var BONOGAS_BENEF_HEADER_ALIASES = { datos_titular: 'datosTitular', codigo_usuario: 'codigoUsuario', dni: 'dni', zona: 'zona', regiones: 'regiones', departamento: 'departamento', provincia: 'provincia', distrito: 'distrito', centropoblado: 'centroPoblado', centro_poblado: 'centroPoblado', ubigeo: 'ubigeo', estrato: 'estrato', tipo_beneficiario: 'tipoBeneficiario', num_suministro: 'numSuministro', n_suministro: 'numSuministro', numero_suministro: 'numSuministro', num_instalacion: 'numInstalacion', n_instalacion: 'numInstalacion', numero_instalacion: 'numInstalacion', concesionaria: 'concesionaria', empresa_instaladora: 'empresaInstaladora', empresa_instaladora_gnr: 'empresaInstaladora', estado_instalacion: 'estadoInstalacion', estado: 'estadoInstalacion', fecha_registro: 'fechaRegistro', fecha_habilitacion: 'fechaHabilitacion', fuente: 'fuente', origen: 'fuente' };
  var BONOGAS_BENEF_SAMPLE_ROWS = [['Maria Elena Quispe Flores', 'BG-2026-000145', '45892103', 'Urbana', 'Costa', 'Arequipa', 'Arequipa', 'Yanahuara', 'Centro urbano', '040101', '2', 'Residencial', '5208079', 'INS-5208079', 'Cálidda', 'Instalaciones del Norte S.A.C.', 'En construcción', '2025-11-15', '2026-01-20', 'BonoGas 2.0'], ['Carlos Alberto Mendoza Rojas', 'BG-2026-000146', '40221876', 'Rural', 'Sierra', 'Cajamarca', 'San Marcos', 'San Marcos', 'Comunidad San Jose', '060901', '1', 'Residencial', '913777', 'INS-913777', 'Gas Natural del Perú', 'Gas & Hogar E.I.R.L.', 'En construcción', '2025-10-02', '2025-12-18', 'Portal de Habilitaciones'], ['Rosa Isabel Torres Vega', 'BG-2026-000147', '46123988', 'Periurbana', 'Selva', 'Amazonas', 'Bagua', 'Bagua', 'Anexo Nuevo Horizonte', '010501', '3', 'Residencial', '5410777', 'INS-5410777', 'Cálidda', 'Instalagas Perú S.A.C.', 'Liquidado', '2025-08-20', '2025-11-05', 'BonoGas 2.0'], ['Juan Carlos Perez Gomez', 'BG-2026-000148', '70451288', 'Urbana', 'Costa', 'Lima', 'Lima', 'Ate', 'Pueblo Joven Los Olivos', '150103', '2', 'Residencial', '101241', 'INS-9344', 'Cálidda', 'Consorcio Redes Lima', 'Conectado', '2025-09-10', '2025-12-01', 'BonoGas 2.0'], ['Ana Lucia Huaman Soto', 'BG-2026-000149', '43567891', 'Rural', 'Sierra', 'Ayacucho', 'Huamanga', 'San Juan Bautista', 'Centro urbano', '050101', '1', 'Residencial', '100512', 'INS-9077', 'Promigas Perú', 'Andes Gas Contratistas', 'Pendiente de liquidación', '2025-12-01', '2026-02-14', 'Portal de Habilitaciones']];

  var modalRows = [];
  var pageRows = [];
  var moduleLabel = 'Bono Gas';
  var toastFn = function () {};

  function qs(sel, root) { return (root || document).querySelector(sel); }

  function excelSafe(value) {
    return String(value == null ? '' : value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function csvCell(v) {
    var s = String(v == null ? '' : v);
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }

  function downloadTextFile(name, text) {
    var blob = new Blob([text], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    setTimeout(function () { URL.revokeObjectURL(url); }, 500);
  }

  function normalizeBonogasHeaderKey(value) {
    return String(value || '').trim().toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/[\s_-]+/g, '_');
  }

  function mapBonogasBeneficiaryRow(raw) {
    var row = {};
    Object.keys(raw || {}).forEach(function (key) {
      var mapped = BONOGAS_BENEF_HEADER_ALIASES[normalizeBonogasHeaderKey(key)];
      if (mapped) row[mapped] = String(raw[key] == null ? '' : raw[key]).trim();
    });
    BONOGAS_BENEF_KEYS.forEach(function (k) { if (row[k] == null) row[k] = ''; });
    return row;
  }

  function bonogasBeneficiaryHasData(row) {
    return BONOGAS_BENEF_KEYS.some(function (k) { return String(row[k] || '').trim(); });
  }

  function parseBonogasBeneficiaryWorkbook(workbook) {
    if (!workbook || !workbook.SheetNames || !workbook.SheetNames.length) return [];
    var sheet = workbook.Sheets[workbook.SheetNames[0]];
    var matrix = global.XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
    if (!matrix.length) return [];
    var headerRow = matrix[0].map(function (cell) { return normalizeBonogasHeaderKey(cell); });
    var colMap = {};
    headerRow.forEach(function (header, idx) {
      var mapped = BONOGAS_BENEF_HEADER_ALIASES[header];
      if (mapped) colMap[mapped] = idx;
    });
    if (!Object.keys(colMap).length) return [];
    return matrix.slice(1).map(function (cells) {
      var raw = {};
      BONOGAS_BENEF_KEYS.forEach(function (key) {
        var idx = colMap[key];
        raw[key] = idx == null ? '' : cells[idx];
      });
      return mapBonogasBeneficiaryRow(raw);
    }).filter(bonogasBeneficiaryHasData);
  }

  function parseBonogasBeneficiaryCsv(text) {
    var lines = String(text || '').split(/\r?\n/).filter(function (line) { return line.trim(); });
    if (lines.length < 2) return [];
    var splitLine = function (line) {
      return line.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map(function (cell) {
        return cell.replace(/^"|"$/g, '').replace(/""/g, '"').trim();
      });
    };
    var headerRow = splitLine(lines[0]).map(normalizeBonogasHeaderKey);
    var colMap = {};
    headerRow.forEach(function (header, idx) {
      var mapped = BONOGAS_BENEF_HEADER_ALIASES[header];
      if (mapped) colMap[mapped] = idx;
    });
    if (!Object.keys(colMap).length) return [];
    return lines.slice(1).map(function (line) {
      var cells = splitLine(line);
      var raw = {};
      BONOGAS_BENEF_KEYS.forEach(function (key) {
        var idx = colMap[key];
        raw[key] = idx == null ? '' : cells[idx];
      });
      return mapBonogasBeneficiaryRow(raw);
    }).filter(bonogasBeneficiaryHasData);
  }

  function readBonogasBeneficiaryFile(file) {
    return new Promise(function (resolve, reject) {
      if (!file) { resolve([]); return; }
      var ext = (file.name.split('.').pop() || '').toLowerCase();
      var reader = new FileReader();
      reader.onerror = function () { reject(new Error('No se pudo leer el archivo')); };
      reader.onload = function () {
        try {
          if (ext === 'csv') { resolve(parseBonogasBeneficiaryCsv(String(reader.result || ''))); return; }
          if (!global.XLSX) { reject(new Error('Libreria Excel no disponible')); return; }
          var data = new Uint8Array(reader.result);
          resolve(parseBonogasBeneficiaryWorkbook(global.XLSX.read(data, { type: 'array' })));
        } catch (err) { reject(err); }
      };
      if (ext === 'csv') reader.readAsText(file);
      else reader.readAsArrayBuffer(file);
    });
  }

  function ids(scope) {
    var p = scope === 'page' ? 'createPage' : 'projectModal';
    return {
      count: '#' + p + 'BenefCount',
      wrap: '#' + p + 'BonogasWrap',
      table: '#' + p + 'BonogasTable',
      tbody: '#' + p + 'BonogasTableBody',
      tableWrap: '#' + p + 'BonogasTableWrap',
      msg: '#' + p + 'BonogasExcelMsg',
      actions: '#' + p + 'BonogasActions',
      defaultWrap: '#' + p + 'BenefDefaultWrap'
    };
  }

  function renderTable(scope, rows) {
    var id = ids(scope);
    var countEl = qs(id.count);
    var table = qs(id.table);
    var tbody = qs(id.tbody);
    var wrap = qs(id.tableWrap);
    var msg = qs(id.msg);
    if (table) {
      var thead = table.querySelector('thead');
      if (thead) thead.innerHTML = '<tr>' + BONOGAS_BENEF_HEADERS.map(function (h) { return '<th>' + excelSafe(h) + '</th>'; }).join('') + '</tr>';
    }
    if (countEl) countEl.textContent = 'Beneficiarios (' + (rows.length || 0) + ')';
    if (tbody) {
      tbody.innerHTML = rows.length ? rows.map(function (row) {
        return '<tr>' + BONOGAS_BENEF_KEYS.map(function (key) { return '<td>' + excelSafe(row[key] || '') + '</td>'; }).join('') + '</tr>';
      }).join('') : '';
    }
    if (wrap) wrap.hidden = !rows.length;
    if (msg) {
      msg.className = 'bonogas-benef-upload-hint' + (rows.length ? ' ok' : '');
      msg.textContent = rows.length
        ? ('Excel cargado: ' + rows.length + ' beneficiario(s) listos para guardar.')
        : ('Suba un archivo Excel (.xlsx / .xls) con los beneficiarios de la agrupación ' + moduleLabel + '.');
    }
  }

  function syncUi(scope, enabled) {
    var id = ids(scope);
    var excel = enabled !== false;
    var defaultWrap = qs(id.defaultWrap);
    var excelWrap = qs(id.wrap);
    var excelActions = qs(id.actions);
    if (defaultWrap) defaultWrap.hidden = excel;
    if (excelWrap) excelWrap.hidden = !excel;
    if (excelActions) excelActions.hidden = !excel;
    if (excel) renderTable(scope, scope === 'page' ? pageRows : modalRows);
  }

  function setRows(scope, rows) {
    var list = (rows || []).map(mapBonogasBeneficiaryRow);
    if (scope === 'page') { pageRows = list; renderTable('page', list); }
    else { modalRows = list; renderTable('modal', list); }
  }

  function getRows(scope) {
    return (scope === 'page' ? pageRows : modalRows).map(function (row) { return Object.assign({}, row); });
  }

  function reset(scope) {
    if (scope === 'page') pageRows = [];
    else modalRows = [];
    syncUi(scope);
  }

  function downloadFormat() {
    if (global.XLSX) {
      var wb = global.XLSX.utils.book_new();
      var ws = global.XLSX.utils.aoa_to_sheet([BONOGAS_BENEF_HEADERS].concat(BONOGAS_BENEF_SAMPLE_ROWS));
      global.XLSX.utils.book_append_sheet(wb, ws, 'Beneficiarios');
      global.XLSX.writeFile(wb, 'formato_beneficiarios_bonogas.xlsx');
      toastFn('Formato Excel descargado');
      return;
    }
    var lines = [BONOGAS_BENEF_HEADERS.map(csvCell).join(',')];
    BONOGAS_BENEF_SAMPLE_ROWS.forEach(function (row) { lines.push(row.map(csvCell).join(',')); });
    downloadTextFile('formato_beneficiarios_bonogas.csv', lines.join('\n'));
    toastFn('Formato CSV descargado');
  }

  function importFile(scope, file) {
    if (!file) return Promise.resolve();
    var ext = (file.name.split('.').pop() || '').toLowerCase();
    if (['xls', 'xlsx', 'csv'].indexOf(ext) < 0) {
      toastFn('Formato no permitido. Use .xlsx, .xls o .csv');
      return Promise.resolve();
    }
    return readBonogasBeneficiaryFile(file).then(function (rows) {
      if (!rows.length) { toastFn('No se encontraron beneficiarios validos en el Excel'); return; }
      setRows(scope, rows);
      toastFn('Importados ' + rows.length + ' beneficiario(s) desde Excel');
    }).catch(function (err) {
      toastFn(err && err.message ? err.message : 'No se pudo procesar el Excel');
    });
  }

  function init(options) {
    options = options || {};
    if (options.moduleLabel) moduleLabel = options.moduleLabel;
    if (typeof options.showToast === 'function') toastFn = options.showToast;
    if (global.__excelBenefImportInit) return;
    global.__excelBenefImportInit = true;
    ['modal', 'page'].forEach(function (scope) {
      var p = scope === 'page' ? 'createPage' : 'projectModal';
      qs('#' + p + 'BonogasExcelBtn')?.addEventListener('click', function () { qs('#' + p + 'BonogasExcelInput')?.click(); });
      qs('#' + p + 'BonogasFormatBtn')?.addEventListener('click', downloadFormat);
      qs('#' + p + 'BonogasExcelInput')?.addEventListener('change', function (e) {
        var file = e.target.files && e.target.files[0];
        importFile(scope, file);
        e.target.value = '';
      });
    });
  }

  function setModuleLabel(label) { moduleLabel = label || moduleLabel; }

  function getModuleLabelFromDom() {
    var main = qs('.main');
    if (main && main.classList.contains('gnv-satcontrol-mode')) return 'Ahorro GNV';
    if (main && main.classList.contains('masificacion-mode')) return 'Masificación';
    if (main && main.classList.contains('bonogas-satcontrol-mode') && main.classList.contains('bonogas-active')) return 'Bono Gas';
    var scope = document.documentElement.getAttribute('data-module-scope');
    if (scope === 'ahorro-gnv') return 'Ahorro GNV';
    if (scope === 'masificacion') return 'Masificación';
    return 'Bono Gas';
  }

  global.ExcelBeneficiaryImport = {
    HEADERS: BONOGAS_BENEF_HEADERS,
    KEYS: BONOGAS_BENEF_KEYS,
    init: init,
    syncUi: syncUi,
    setRows: setRows,
    getRows: getRows,
    reset: reset,
    importFile: importFile,
    readFile: readBonogasBeneficiaryFile,
    downloadFormat: downloadFormat,
    renderTable: renderTable,
    mapRow: mapBonogasBeneficiaryRow,
    setModuleLabel: setModuleLabel,
    getModuleLabelFromDom: getModuleLabelFromDom,
    excelSafe: excelSafe
  };
})(window);
