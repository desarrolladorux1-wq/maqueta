(function(){
  try{
    var activeModule=new URLSearchParams(location.search).get('modulo')||sessionStorage.getItem('maqueteo_modulo');
    if(activeModule==='vale-fise'){
      document.querySelector('.app')?.classList.remove('sidebar-hidden');
      document.getElementById('sidebar')?.classList.remove('collapsed');
    }
  }catch(ex){}
  var modal=document.getElementById('myAppsModal');
  var home=document.getElementById('myAppsHome');
  var request=document.getElementById('myAppsRequest');
  function show(view){[home,request].forEach(function(el){if(el)el.hidden=el!==view});}
  function open(){show(home);modal.classList.add('open');document.body.style.overflow='hidden';}
  function close(){modal.classList.remove('open');document.body.style.overflow='';}
  document.getElementById('navMyApps')?.addEventListener('click',function(e){e.preventDefault();open();});
  document.getElementById('myAppsOpenVale')?.addEventListener('click',close);
  document.getElementById('myAppsOpenGnv')?.addEventListener('click',function(){
    try{sessionStorage.setItem('maqueteo_modulo','ahorro-gnv');}catch(ex){}
    location.href='index.html?modulo=ahorro-gnv';
  });
  document.getElementById('myAppsRequestAccess')?.addEventListener('click',function(){
    document.getElementById('myAppsRequestSuccess')?.classList.remove('open');
    show(request);
  });
  document.getElementById('myAppsAuthVale')?.addEventListener('click',close);
  document.querySelectorAll('[data-myapps-service]').forEach(function(btn){
    btn.addEventListener('click',function(){
      document.querySelectorAll('[data-myapps-service]').forEach(function(item){item.classList.toggle('selected',item===btn);});
      var select=document.getElementById('myAppsRequestedModule');
      if(select)select.value=btn.getAttribute('data-myapps-service');
      var user=document.getElementById('myAppsServiceUser');
      if(user)user.value=btn.getAttribute('data-service-user')||'renzo';
      document.getElementById('myAppsServicePwd')?.focus();
    });
  });
  document.querySelectorAll('[data-myapps-back]').forEach(function(btn){btn.addEventListener('click',function(){show(home);});});
  document.querySelectorAll('[data-myapps-close]').forEach(function(btn){btn.addEventListener('click',close);});
  modal?.addEventListener('click',function(e){if(e.target===modal)close();});
  document.getElementById('myAppsRequestForm')?.addEventListener('submit',function(e){
    e.preventDefault();
    var password=document.getElementById('myAppsServicePwd');
    if(password&&password.value!=='123456'){
      password.setCustomValidity('Use la contraseña de demostración: 123456');
      password.reportValidity();
      return;
    }
    if(password)password.setCustomValidity('');
    document.getElementById('myAppsRequestSuccess').classList.add('open');
    try{sessionStorage.setItem('maqueteo_authenticated_service',document.getElementById('myAppsRequestedModule').value);}catch(ex){}
  });
  try{
    if(new URLSearchParams(location.search).get('showApps')==='auth'){
      show(request);
      modal.classList.add('open');
      document.body.style.overflow='hidden';
      history.replaceState({},'',location.pathname+'?modulo=vale-fise');
    }
  }catch(ex){}
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&modal?.classList.contains('open'))close();});
})();
