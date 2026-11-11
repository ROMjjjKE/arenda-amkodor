
(function(){
  'use strict';
  var WA='https://wa.me/375296181353';
  var burger=document.getElementById('burger'), drawer=document.getElementById('drawer'),
      closeBtn=document.getElementById('drawerClose'), lastFocus=null;
  function openDrawer(){ if(!drawer) return; lastFocus=document.activeElement;
    drawer.hidden=false; document.body.classList.add('is-locked');
    burger.setAttribute('aria-expanded','true'); if(closeBtn) closeBtn.focus(); }
  function closeDrawer(){ if(!drawer||drawer.hidden) return;
    drawer.hidden=true; document.body.classList.remove('is-locked');
    if(burger) burger.setAttribute('aria-expanded','false');
    if(lastFocus) lastFocus.focus(); }
  if(burger) burger.addEventListener('click',openDrawer);
  if(closeBtn) closeBtn.addEventListener('click',closeDrawer);
  if(drawer) drawer.addEventListener('click',function(e){ if(e.target===drawer) closeDrawer(); });
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape') closeDrawer();
    if(e.key==='Tab' && drawer && !drawer.hidden){
      var f=drawer.querySelectorAll('a,button'), first=f[0], last=f[f.length-1];
      if(e.shiftKey && document.activeElement===first){ e.preventDefault(); last.focus(); }
      else if(!e.shiftKey && document.activeElement===last){ e.preventDefault(); first.focus(); }
    }
  });
  window.addEventListener('resize',function(){ if(window.innerWidth>1000) closeDrawer(); });

  /* подбор навесного */
  var PICK = window.__PICK__ || [];
  var pickRoot=document.getElementById('pick');
  if(pickRoot && PICK.length){
    var chips=pickRoot.querySelectorAll('.chip'), out=pickRoot.querySelector('#pickOut');
    function show(i){
      var p=PICK[i];
      chips.forEach(function(c,j){ c.setAttribute('aria-pressed', j===i?'true':'false'); });
      out.innerHTML='<p class="mono">'+p[3]+'</p><h3 style="margin:10px 0 8px">'+p[1]+'</h3><p class="note" style="font-size:15px;color:var(--ink2)">'+p[2]+'</p>'+
        '<a class="btn btn--acc" style="margin-top:16px" href="'+WA+'?text='+encodeURIComponent('Здравствуйте! Интересует: '+p[1]+'. Подскажите по машине и срокам.')+'" target="_blank" rel="noopener">Уточнить в WhatsApp</a>';
    }
    chips.forEach(function(c,i){ c.addEventListener('click',function(){ show(i); }); });
    show(0);
  }

  /* расчёт объёма */
  var calc=document.getElementById('calc');
  if(calc){
    var v=calc.querySelector('#calcV'), b=calc.querySelector('#calcB'),
        m=calc.querySelector('#calcM'), t=calc.querySelector('#calcT'),
        oC=calc.querySelector('#outCycles'), oH=calc.querySelector('#outHours'),
        oM=calc.querySelector('#outMin'), out=calc.querySelector('#calcSum');
    var FILL={sand:0.9,rubble:0.9,soil:0.85,trash:0.55,snow:0.8};
    function fmt(n){ return n.toLocaleString('ru-RU'); }
    function run(){
      var vol=Math.max(0,parseFloat(v.value)||0);
      var bucket=parseFloat(b.value)||2.0;
      var fill=FILL[m.value]||0.9;
      var sec=parseFloat(t.value)||45;
      var per=bucket*fill;
      var cycles=vol>0?Math.ceil(vol/per):0;
      var hours=cycles*sec/3600*1.25;
      var hh=Math.floor(hours), mm=Math.round((hours-hh)*60);
      if(mm===60){ hh++; mm=0; }
      oC.textContent=fmt(cycles)+' × '+per.toFixed(1).replace('.',',')+' м³';
      oH.textContent=hh+' ч '+(mm<10?'0':'')+mm+' мин';
      oM.textContent=Math.max(4, Math.ceil(hours+0.3))+' ч (минимум 4)';
      var txt='Здравствуйте! Нужен погрузчик: объём '+fmt(vol)+' м³, материал — '+m.options[m.selectedIndex].text.toLowerCase()+', ковш '+bucket.toString().replace('.',',')+' м³, площадка — '+t.options[t.selectedIndex].text.toLowerCase()+'.';
      out.href=WA+'?text='+encodeURIComponent(txt);
    }
    ['input','change'].forEach(function(ev){ calc.addEventListener(ev,run); });
    run();
  }

  /* форма */
  var form=document.getElementById('leadForm'), msg=document.getElementById('formMsg');
  if(form){
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var d=new FormData(form), name=(d.get('name')||'').toString().trim(),
          phone=(d.get('phone')||'').toString().trim();
      if(name.length<2||phone.length<6){
        msg.textContent='Напишите имя и телефон, чтобы мы могли ответить.';
        return;
      }
      var lines=['Заявка с сайта аренды погрузчика','Имя: '+name,'Телефон: '+phone];
      ['task','obj','msg'].forEach(function(k){
        var val=(d.get(k)||'').toString().trim();
        if(val){ lines.push((k==='task'?'Задача':k==='obj'?'Объект':'Комментарий')+': '+val); }
      });
      msg.textContent='Открываю WhatsApp с готовым сообщением.';
      window.open(WA+'?text='+encodeURIComponent(lines.join('\n')),'_blank');
    });
  }
})();
