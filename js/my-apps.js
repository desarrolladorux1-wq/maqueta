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
  var accountHome=document.getElementById('myAppsAccountHome');
  var request=document.getElementById('myAppsRequest');
  var returnView=home;
  function show(view){[home,accountHome,request].forEach(function(el){if(el)el.hidden=el!==view});}
  function open(){show(home);modal.classList.add('open');document.body.style.overflow='hidden';}
  function openAccount(){returnView=accountHome;show(accountHome);modal.classList.add('open');document.body.style.overflow='hidden';}
  function close(){modal.classList.remove('open');document.body.style.overflow='';}
  function wikiAuthenticated(){try{return sessionStorage.getItem('maqueteo_wiki_fise_authenticated')==='1';}catch(ex){return false;}}
  function goWiki(){location.href='wiki-fise.html';}
  function selectServiceAuth(serviceName,userName){
    show(request);
    var match=null;
    document.querySelectorAll('[data-myapps-service]').forEach(function(item){
      var selected=item.getAttribute('data-myapps-service')===serviceName;
      item.classList.toggle('selected',selected);
      if(selected)match=item;
    });
    var select=document.getElementById('myAppsRequestedModule');
    if(select)select.value=serviceName;
    var user=document.getElementById('myAppsServiceUser');
    if(user)user.value=userName||(match?.getAttribute('data-service-user'))||'renzo';
    var password=document.getElementById('myAppsServicePwd');
    if(password){password.value='';password.setCustomValidity('');}
    var submit=document.getElementById('myAppsAuthSubmit');
    if(submit){submit.textContent='Autenticar';submit.type='submit';submit.onclick=null;}
    document.getElementById('myAppsRequestSuccess')?.classList.remove('open');
    password?.focus();
  }
  function selectWikiAuth(){
    selectServiceAuth('Wiki FISE','');
    document.getElementById('myAppsServiceUser')?.focus();
  }
  function refreshWikiAccess(){
    var ok=wikiAuthenticated(),button=document.getElementById('myAppsOpenWiki'),status=document.getElementById('myAppsWikiStatus');
    if(button)button.textContent=ok?'Ingresar a Wiki FISE':'Autenticar';
    if(status)status.textContent=ok?'Autenticado':'Requiere autenticación';
    var service=document.querySelector('#myAppsWikiService small');if(service)service.textContent=ok?'Autenticado':'Autenticar';
  }
  document.getElementById('navMyApps')?.addEventListener('click',function(e){e.preventDefault();openAccount();});
  document.getElementById('myAppsOpenVale')?.addEventListener('click',close);
  document.getElementById('myAppsAccountVale')?.addEventListener('click',close);
  document.getElementById('myAppsOpenWiki')?.addEventListener('click',function(){
    if(wikiAuthenticated())goWiki();else selectWikiAuth();
  });
  document.querySelectorAll('[data-main-service]').forEach(function(tile){
    tile.addEventListener('click',function(e){
      if(e.target.closest('button')||e.target===tile)selectServiceAuth(tile.getAttribute('data-main-service'),tile.getAttribute('data-main-user'));
    });
  });
  document.getElementById('myAppsAccountWiki')?.addEventListener('click',goWiki);
  document.getElementById('myAppsRequestAccess')?.addEventListener('click',function(){
    returnView=accountHome;
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
      var submit=document.getElementById('myAppsAuthSubmit');if(submit){submit.textContent='Autenticar';submit.type='submit';submit.onclick=null;}
      document.getElementById('myAppsRequestSuccess')?.classList.remove('open');
      document.getElementById('myAppsServicePwd')?.focus();
    });
  });
  document.querySelectorAll('[data-myapps-back]').forEach(function(btn){btn.addEventListener('click',function(){show(returnView||home);});});
  document.querySelectorAll('[data-myapps-close]').forEach(function(btn){btn.addEventListener('click',close);});
  modal?.addEventListener('click',function(e){if(e.target===modal)close();});
  document.getElementById('myAppsRequestForm')?.addEventListener('submit',function(e){
    e.preventDefault();
    var selected=document.getElementById('myAppsRequestedModule').value;
    var user=document.getElementById('myAppsServiceUser');
    var password=document.getElementById('myAppsServicePwd');
    if(selected==='Wiki FISE'){
      if(!user?.value.trim()||!password?.value.trim()){
        password?.setCustomValidity('Ingrese cualquier usuario y contraseña para la demostración.');
        password?.reportValidity();
        return;
      }
      password.setCustomValidity('');
      try{sessionStorage.setItem('maqueteo_wiki_fise_authenticated','1');sessionStorage.setItem('maqueteo_authenticated_service','Wiki FISE');}catch(ex){}
      refreshWikiAccess();
      returnView=home;
      show(home);
      return;
    }
    if(password&&password.value!=='123456'){
      password.setCustomValidity('Use la contraseña de demostración: 123456');
      password.reportValidity();
      return;
    }
    if(password)password.setCustomValidity('');
    document.getElementById('myAppsRequestSuccess').classList.add('open');
    try{sessionStorage.setItem('maqueteo_authenticated_service',document.getElementById('myAppsRequestedModule').value);}catch(ex){}
  });
  refreshWikiAccess();
  try{
    var showApps=new URLSearchParams(location.search).get('showApps');
    if(showApps==='auth'||showApps==='home'){
      returnView=home;
      show(showApps==='auth'?request:home);
      modal.classList.add('open');
      document.body.style.overflow='hidden';
      history.replaceState({},'',location.pathname+'?modulo=vale-fise');
    }
  }catch(ex){}
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&modal?.classList.contains('open'))close();});
})();
