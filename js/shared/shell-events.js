/**
 * Eventos de módulos shell cargados por fetch (administrador.html, bonogas.html).
 * Clicks: delegación en document (funciona aunque el DOM se inyecte después).
 * Inputs/change e inits: bind directo tras loadShellModules().
 */
(function () {
  'use strict';

  function bindShellOnce(sel, event, handler, options) {
    var el = typeof sel === 'string' ? document.querySelector(sel) : sel;
    if (!el || el.dataset.shellBound === '1') return el;
    el.dataset.shellBound = '1';
    el.addEventListener(event, handler, options);
    return el;
  }

  function bindShellInputFilters(ids, handler) {
    ids.forEach(function (id) {
      var el = document.querySelector(id);
      if (!el || el.dataset.shellFilterBound === '1') return;
      el.dataset.shellFilterBound = '1';
      el.addEventListener('input', handler);
      el.addEventListener('change', handler);
    });
  }

  function extendStatsFilters() {
    if (window.__statsFiltersExtended) return;
    var statsFilters = document.querySelector('#statsFilters');
    if (!statsFilters) return;
    window.__statsFiltersExtended = true;
    var html =
      '<button class="chip-filter" data-filter="estadoBeneficiario">Estado beneficiario</button>' +
      '<button class="chip-filter" data-filter="empresaInstaladora">Empresa instaladora</button>' +
      '<button class="chip-filter" data-filter="tipoBeneficiario">Tipo beneficiario</button>' +
      '<button class="chip-filter" data-filter="fechaHabilitacion">Fecha habilitación</button>' +
      '<button class="chip-filter" data-filter="estrato">Estrato</button>' +
      '<button class="chip-filter" data-filter="estadoRecaudacion">Estado recaudación</button>';
    statsFilters.insertAdjacentHTML('beforeend', html);
    wireChipFilters();
  }

  function wireChipFilters() {
    document.querySelectorAll('.chip-filter').forEach(function (btn) {
      if (btn.dataset.shellChipBound === '1') return;
      btn.dataset.shellChipBound = '1';
      btn.addEventListener('click', function () {
        document.querySelectorAll('.chip-filter').forEach(function (x) {
          x.classList.remove('active');
        });
        btn.classList.add('active');
        if (typeof currentStatsFilter !== 'undefined') currentStatsFilter = btn.dataset.filter;
        if (typeof updateStatsByCurrentSelection === 'function') updateStatsByCurrentSelection();
      });
    });
  }

  /** Bind directo post-carga: inputs, change, inits (no clicks duplicados con delegación) */
  function wireShellModuleEvents() {
    var searchInput = document.querySelector('#searchInput');
    if (searchInput && searchInput.dataset.shellBound !== '1') {
      searchInput.dataset.shellBound = '1';
      searchInput.addEventListener('input', function () {
        if (typeof renderProjects === 'function') renderProjects();
      });
    }

    bindShellOnce('#locationSearchInput', 'input', function (e) {
      var value = e.target.value.trim();
      if (value.length >= 2 && typeof renderLocationResults === 'function' && typeof localLocationMatches === 'function') {
        renderLocationResults(localLocationMatches(value));
      } else {
        document.querySelector('#locationSearchResults')?.classList.remove('open');
      }
    });
    bindShellOnce('#locationSearchInput', 'keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (typeof searchLocation === 'function') searchLocation();
      }
    });

    bindShellOnce('#layerFileInput', 'change', function (e) {
      var file = e.target.files && e.target.files[0];
      if (!file) return;
      if (typeof pendingLayerFile !== 'undefined') pendingLayerFile = file;
      var ext = typeof getLayerExtension === 'function' ? getLayerExtension(file.name) : '';
      var nameEl = document.querySelector('#selectedLayerFileName');
      if (nameEl) nameEl.textContent = file.name;
      var typeEl = document.querySelector('#layerDetectedType');
      if (typeEl && typeof friendlyLayerType === 'function') typeEl.value = friendlyLayerType(ext);
      var displayEl = document.querySelector('#layerDisplayName');
      if (displayEl && !displayEl.value && typeof baseFilename === 'function') {
        displayEl.value = baseFilename(file.name);
      }
      var geoNameEl = document.querySelector('#geoJsonFileName');
      if (geoNameEl) geoNameEl.textContent = file.name;
    });

    document.querySelectorAll('input[name="baseMap"]').forEach(function (radio) {
      if (radio.dataset.shellBound === '1') return;
      radio.dataset.shellBound = '1';
      radio.addEventListener('change', function (e) {
        if (typeof clearSatelliteMode === 'function') clearSatelliteMode();
        if (typeof setBaseLayer === 'function') setBaseLayer(e.target.value);
        if (typeof closeMapPanels === 'function') closeMapPanels();
        if (typeof showToast === 'function') {
          showToast('Mapa base: ' + e.target.parentElement.innerText.trim());
        }
      });
    });

    ['#layerEstrato', '#layerBeneficiarios', '#layerCobertura', '#layerTroncal', '#layerRamales', '#layerConcesionaria', '#layerMorosidad'].forEach(function (id) {
      bindShellOnce(id, 'change', function () {
        if (typeof updateOverlayVisibility === 'function') updateOverlayVisibility();
        if (typeof showToast === 'function') showToast('Capas actualizadas');
      });
    });

    bindShellOnce('#layerDistritos', 'change', function (e) {
      if (typeof toggleDistrictsFeature === 'function') toggleDistrictsFeature(e.target.checked);
      if (typeof showToast === 'function') {
        showToast(e.target.checked ? 'Capa Distritos activada' : 'Capa Distritos desactivada');
      }
    });

    bindShellOnce('#districtDepartmentSelect', 'change', function () {
      if (typeof selectedDistrictId !== 'undefined') selectedDistrictId = null;
      if (typeof renderDistrictList === 'function') renderDistrictList();
      if (typeof refreshDistrictLayer === 'function') refreshDistrictLayer();
    });
    bindShellOnce('#districtProvinceSelect', 'change', function () {
      if (typeof selectedDistrictId !== 'undefined') selectedDistrictId = null;
      if (typeof renderDistrictList === 'function') renderDistrictList();
      if (typeof refreshDistrictLayer === 'function') refreshDistrictLayer();
    });

    if (!window.__districtPanelDragReady) {
      if (typeof enableDistrictPanelDrag === 'function') enableDistrictPanelDrag();
      window.__districtPanelDragReady = true;
    }
    if (typeof renderDistrictList === 'function') renderDistrictList();

    var satelliteDateSelect = document.querySelector('#dateLayerSelect');
    if (satelliteDateSelect && satelliteDateSelect.dataset.shellBound !== '1') {
      satelliteDateSelect.dataset.shellBound = '1';
      satelliteDateSelect.onchange = function (e) {
        if (typeof activeSatelliteMode !== 'undefined' && activeSatelliteMode && typeof refreshSatelliteAnalysisLayer === 'function') {
          refreshSatelliteAnalysisLayer();
        }
        if (typeof showToast === 'function') showToast('Fecha de análisis satelital: ' + e.target.value);
      };
    }

    if (!window.__timelineDragReady) {
      if (typeof enableTimelineDrag === 'function') enableTimelineDrag();
      window.__timelineDragReady = true;
    }

    document.querySelectorAll('.ge-btn').forEach(function (btn) {
      if (btn.dataset.shellGeBound === '1') return;
      btn.dataset.shellGeBound = '1';
      btn.addEventListener('click', function () {
        if (btn.id === 'uploadLayerBtn') return;
        document.querySelectorAll('.ge-btn').forEach(function (x) {
          x.classList.remove('active');
        });
        btn.classList.add('active');
      });
    });

    wireChipFilters();
    extendStatsFilters();

    ['#satProjectsToggle', '#toggleProjectsMapBtn'].forEach(function (id) {
      bindShellOnce(id, 'click', function (e) {
        e.preventDefault();
        if (typeof toggleProjects === 'function') toggleProjects();
        else if (typeof window.toggleProjects === 'function') window.toggleProjects();
      });
    });
    ['#satInfoToggle', '#toggleInfoMapBtn'].forEach(function (id) {
      bindShellOnce(id, 'click', function (e) {
        e.preventDefault();
        if (typeof toggleInfo === 'function') toggleInfo();
        else if (typeof window.toggleInfo === 'function') window.toggleInfo();
      });
    });
    if (typeof updateCollapseIcons === 'function') updateCollapseIcons();

    ['#layerBenLiquidados', '#layerBenPendLiquid', '#layerBenConstrDentro', '#layerBenConstrFuera'].forEach(function (id) {
      bindShellOnce(id, 'change', function () {
        if (typeof updateOverlayVisibility === 'function') updateOverlayVisibility();
        if (typeof showToast === 'function') showToast('Subcapa de beneficiarios actualizada');
      });
    });

    document.querySelectorAll('input[name="satelliteMode"]').forEach(function (radio) {
      if (radio.dataset.shellBound === '1') return;
      radio.dataset.shellBound = '1';
      radio.addEventListener('change', function (e) {
        if (typeof setSatelliteLayerMode === 'function') setSatelliteLayerMode(e.target.value);
      });
    });

    if (typeof renderSolicitudes === 'function') {
      bindShellInputFilters(['#solSearch', '#solEstadoFilter', '#solDistritoFilter', '#solOrigenFilter'], renderSolicitudes);
    }
    if (typeof renderValidaciones === 'function') {
      bindShellInputFilters(
        ['#valSearch', '#valTipoFilter', '#valRiskFilter', '#valResponsableFilter', '#valEmpresaFilter', '#valEstadoFilter', '#valFechaFilter', '#valDistritoFilter'],
        renderValidaciones
      );
    }

    window.__shellModuleEventsWired = true;
  }

  /** Delegación global para botones inyectados async */
  function initShellEventDelegation() {
    if (window.__shellDelegationInit) return;
    window.__shellDelegationInit = true;

    document.addEventListener(
      'click',
      function (e) {
        if (e.target.closest('#capasBtn')) {
          e.preventDefault();
          if (typeof toggleMapPanel === 'function') toggleMapPanel('#layersPanel', '#capasBtn');
          return;
        }
        if (e.target.closest('#mapasBtn')) {
          if (typeof toggleMapPanel === 'function') toggleMapPanel('#mapsPanel', '#mapasBtn');
          return;
        }
        if (e.target.closest('#tematicosBtn')) {
          if (typeof toggleMapPanel === 'function') toggleMapPanel('#themesPanel', '#tematicosBtn');
          return;
        }
        if (e.target.closest('#sateliteBtn')) {
          if (typeof toggleSatellitePanel === 'function') toggleSatellitePanel();
          return;
        }
        if (e.target.closest('#valExportBtn')) {
          e.preventDefault();
          e.stopPropagation();
          if (typeof toggleValidationExportMenu === 'function') toggleValidationExportMenu();
          return;
        }
        var fmtBtn = e.target.closest('[data-export-format]');
        if (fmtBtn && e.target.closest('#valExportDropdown, #validacionesEnv')) {
          if (typeof exportValidationByFormat === 'function') exportValidationByFormat(fmtBtn.dataset.exportFormat);
          return;
        }
        if (e.target.closest('#applyValFiltersBtn')) {
          if (typeof renderValidaciones === 'function') renderValidaciones();
          return;
        }
        if (e.target.closest('#exportExcelBtn')) {
          if (typeof openModal === 'function') openModal('exportModal');
          return;
        }
        if (e.target.closest('#createBtn')) {
          if (typeof openProjectModal === 'function') openProjectModal();
          return;
        }
        if (e.target.closest('#locationSearchBtn')) {
          if (typeof searchLocation === 'function') searchLocation();
          return;
        }
        if (e.target.closest('#uploadLayerBtn')) {
          if (typeof window.openUploadLayerWorkflow === 'function') window.openUploadLayerWorkflow();
          else if (typeof openUploadLayerWorkflow === 'function') openUploadLayerWorkflow();
          return;
        }
        if (e.target.closest('#geoJsonChooseBtn, #chooseLayerFileBtn')) {
          e.preventDefault();
          e.stopPropagation();
          document.querySelector('#layerFileInput')?.click();
          return;
        }
        if (e.target.closest('#geoJsonLoadBtn')) {
          e.preventDefault();
          e.stopPropagation();
          if (typeof confirmGeoJsonFileUpload === 'function') confirmGeoJsonFileUpload();
          else if (typeof confirmLayerUpload === 'function') confirmLayerUpload();
          return;
        }
        if (e.target.closest('#geoJsonCancelBtn')) {
          if (typeof closeModal === 'function') closeModal('uploadLayerModal');
          return;
        }
        if (e.target.closest('#confirmLayerUploadBtn')) {
          if (typeof confirmLayerUpload === 'function') confirmLayerUpload();
          return;
        }
        if (e.target.closest('#mapPanelToggleBtn')) {
          if (typeof clearRightPanelForMapSelection === 'function') clearRightPanelForMapSelection(true);
          return;
        }
        if (e.target.closest('#compareMapBtn')) {
          if (typeof leafletMap !== 'undefined' && leafletMap && typeof estratoLayer !== 'undefined' && estratoLayer) {
            leafletMap.fitBounds(estratoLayer.getBounds(), { padding: [40, 40] });
          }
          return;
        }
        if (e.target.closest('#closeDistrictsPanelBtn')) {
          var chk = document.querySelector('#layerDistritos');
          if (chk) chk.checked = false;
          if (typeof toggleDistrictsFeature === 'function') toggleDistrictsFeature(false);
          return;
        }
        if (e.target.closest('#closeTimelineBtn')) {
          if (typeof renderMapTimeline === 'function') renderMapTimeline(null);
          return;
        }
        if (e.target.closest('#timelineDockBottomBtn')) {
          if (typeof setTimelineDock === 'function') setTimelineDock('bottom');
          return;
        }
        if (e.target.closest('#timelineDockRightBtn')) {
          if (typeof setTimelineDock === 'function') setTimelineDock('right');
          return;
        }
        if (e.target.closest('#selectToolBtn')) {
          if (typeof setMapTool === 'function') setMapTool('select');
          return;
        }
        if (e.target.closest('#measureToolBtn')) {
          if (typeof setMapTool === 'function') setMapTool('measure');
          return;
        }
        if (e.target.closest('#polygonToolBtn')) {
          if (typeof setMapTool === 'function') setMapTool('polygon');
          return;
        }
        if (e.target.closest('#circleToolBtn')) {
          if (typeof setMapTool === 'function') setMapTool('circle');
          return;
        }
        if (e.target.closest('#bonoUtilSelectToolBtn, #utilSelectToolBtn')) {
          if (typeof setMapTool === 'function') setMapTool('select');
          return;
        }
        if (e.target.closest('#bonoUtilMeasureToolBtn, #utilMeasureToolBtn')) {
          if (typeof setMapTool === 'function') setMapTool('measure');
          return;
        }
        if (e.target.closest('#bonoUtilPolygonToolBtn, #utilPolygonToolBtn')) {
          if (typeof setMapTool === 'function') setMapTool('polygon');
          return;
        }
        if (e.target.closest('#bonoUtilCircleToolBtn, #utilCircleToolBtn')) {
          if (typeof setMapTool === 'function') setMapTool('circle');
          return;
        }
        if (e.target.closest('#finishDrawBtn')) {
          e.preventDefault();
          e.stopPropagation();
          if (typeof window.finishDrawing === 'function') window.finishDrawing();
          return;
        }
        if (e.target.closest('#clearDrawBtn')) {
          e.preventDefault();
          e.stopPropagation();
          if (typeof window.clearDrawings === 'function') window.clearDrawings();
          return;
        }
        if (e.target.closest('#satProjectsToggle, #toggleProjectsMapBtn')) {
          e.preventDefault();
          if (typeof toggleProjects === 'function') toggleProjects();
          else if (typeof window.toggleProjects === 'function') window.toggleProjects();
          return;
        }
        if (e.target.closest('#satInfoToggle, #toggleInfoMapBtn')) {
          e.preventDefault();
          if (typeof toggleInfo === 'function') toggleInfo();
          else if (typeof window.toggleInfo === 'function') window.toggleInfo();
          return;
        }
        if (e.target.closest('#newSolicitudBtn')) {
          if (typeof selectedSolicitudId !== 'undefined') selectedSolicitudId = 'SOL-2026-0002';
          if (typeof renderSolicitudes === 'function') renderSolicitudes();
          if (typeof selectSolicitud === 'function') selectSolicitud(selectedSolicitudId);
          if (typeof showToast === 'function') showToast('Formulario de nueva solicitud preparado');
          return;
        }
        if (e.target.closest('#massValidateBtn')) {
          if (typeof showToast === 'function') showToast('Validación masiva preparada para expedientes filtrados');
          return;
        }
        if (e.target.closest('#backSatcontrolBtn') || e.target.closest('#backSatcontrolValidationBtn')) {
          if (typeof closeSolicitudesEnvironment === 'function') closeSolicitudesEnvironment();
          return;
        }
        if (e.target.closest('#notifyPlazoBtn')) {
          if (typeof showToast === 'function') showToast('Notificaciones enviadas a las empresas instaladoras fuera de plazo');
          return;
        }
        if (e.target.closest('#simCellLow')) {
          if (typeof triggerMorosityLayer === 'function') triggerMorosityLayer('Baja');
          return;
        }
        if (e.target.closest('#simCellMid')) {
          if (typeof triggerMorosityLayer === 'function') triggerMorosityLayer('Media');
          return;
        }
        if (e.target.closest('#simCellHigh')) {
          if (typeof triggerMorosityLayer === 'function') triggerMorosityLayer('Alta');
          return;
        }
        if (e.target.closest('#simCellCritical')) {
          if (typeof triggerMorosityLayer === 'function') triggerMorosityLayer('Crítica');
          return;
        }
      },
      true
    );

    if (!window.__valExportCloseBound) {
      window.__valExportCloseBound = true;
      document.addEventListener('click', function (e) {
        if (!e.target.closest('#valExportDropdown') && typeof toggleValidationExportMenu === 'function') {
          toggleValidationExportMenu(false);
        }
      });
    }

    if (!window.__mapPanelCloseBound) {
      window.__mapPanelCloseBound = true;
      document.addEventListener('click', function (e) {
        var insideToolbar = e.target.closest('.gis-toolbar');
        var insidePanel = e.target.closest('.map-floating-panel');
        if (!insideToolbar && !insidePanel && typeof closeMapPanels === 'function') closeMapPanels();
      });
    }
  }

  window.wireShellModuleEvents = wireShellModuleEvents;
  window.initShellEventDelegation = initShellEventDelegation;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initShellEventDelegation, { once: true });
  } else {
    initShellEventDelegation();
  }
})();
