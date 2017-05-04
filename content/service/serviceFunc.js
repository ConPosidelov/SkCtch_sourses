// SkypeCatcher - сокращение SkCtch
//
// Вспомогательные ФУНКЦИИ
//
'use strict';



// ФУНКЦИЯ    
// shellMainStage
//

export let waitLoad = (targetEl, time) => {
  console.log('waitLoad');
  let opts = {
    lines: 11 // The number of lines to draw
    , length: 0 // The length of each line
    , width: 27 // The line thickness
    , radius: 50 // The radius of the inner circle
    , scale: 1 // Scales overall size of the spinner
    , corners: 1 // Corner roundness (0..1)
    , color: '#22A7F0' // #rgb or #rrggbb or array of colors
    , opacity: 0.15 // Opacity of the lines
    , rotate: 17 // The rotation offset
    , direction: 1 // 1: clockwise, -1: counterclockwise
    , speed: 0.9 // Rounds per second
    , trail: 49 // Afterglow percentage
    , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
    , zIndex: 99999 // The z-index (defaults to 2000000000)
    , className: 'spinner' // The CSS class to assign to the spinner
    , top: '50%' // Top position relative to parent
    , left: '50%' // Left position relative to parent
    , shadow: false // Whether to render a shadow
    , hwaccel: false // Whether to use hardware acceleration
    , position: 'absolute' // Element positioning
  };
  //let targetEl = document.getElementsByTagName(target);
  let spinner = new Spinner(opts).spin(targetEl);
 // targetEl.style.background = '#000';
  //targetEl.style.zIndex = '9999';

  let blind = document.createElement('div');
  blind.style.background = '#89C4F4';
  blind.style.zIndex = '999';
  blind.style.position = 'absolute';
  blind.style.top = '0';
  blind.style.left = '0';
  blind.style.width = '100%';
  blind.style.height = '100%';

  targetEl.insertBefore(blind, targetEl.firstChild);

  setTimeout(function(){
    spinner.stop();
   // targetEl.style.background = '#FFFFF';
   // targetEl.style.zIndex = '0';

   targetEl.removeChild(targetEl.firstChild);


  }, time);

};
























// ФУНКЦИЯ    
// 
//
/*
let setInputText = (inEl, outEl, obj) => {

   console.log('inEl  ', inEl);
    
   let proxy = new Proxy(obj, {
     
      set(target, prop, value) {
        $(outEl).text('');
        $(outEl).text(value);
        console.log('value  ', value);
        target[prop] = value;
        return true;
      }

    }); 

   $(inEl).on('input', () => { 

     proxy.val =''+ $(inEl).val();
     
     console.log('proxy.val  ', proxy.val);
     console.log('obj.val  ', obj.val);   
   });




};

export {setInputText};

*/

