



let bindObj = {};
           let input1 = '#'+ 'SkCtchOutOrigTextarea';
           let outPut1 = '#'+'SkCtchInBody'+ '>'+ '.messCont'+ '>'+'.mess_inner';

           setInputText(input1, outPut1, bindObj);






// ФУНКЦИЯ    
// 
//

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