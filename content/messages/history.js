// SkypeCatcher - сокращение SkCtch
//
// 
//
'use strict';





// ФУНКЦИЯ    
// user - юзер
// length - колич записей
// key - ссылка на объект с ключами
//
export let getHistory = (author, number, key) => {

    let mess = {};
    mess.key = key.giveUserHistory;
    mess.author = author;
    mess.number = number;

    chrome.runtime.sendMessage(mess);
};

// ФУНКЦИЯ    
// чистит хистори
// 

export let clearHistoryEls = () => {

     // вставляем пустые месс контейнеры

    let messContainer = "<div class='messCont my_hide'>"+
                          "<div class='mess_inner in_mess'>"+
                          
                          "</div>"+
                        "</div>"+
                        "<div class='messCont my_hide'>"+
                          "<div class='mess_inner out_mess'></div>"+
                        "</div>";
    $('#SkCtchInBody').text('');                    

    for(let i=0; i < 6 ; i++){
      $('#SkCtchInBody').prepend(messContainer);
    }



};
// ФУНКЦИЯ    
// заполняем сообщениями из хистори
// 
// 
//

export let createHistoryEls = (history, author, inBodyEl) => {

    clearHistoryEls();

    if(!history[author]) return console.log('пока нет истории');

    let timeList = [];
   
    for(let key in history[author]){

       timeList.push(+key); 

    }

    timeList.sort((a,b) => {return a-b;});
  
    let idEl;

    timeList.forEach((item) => {

       let itemStr = ''+ item;
       idEl = `SkCtch${itemStr}`;
       let word = history[author][itemStr].word; 
       let translation = history[author][itemStr].translation;
       let category = history[author][itemStr].category;
       
       if(category === 'in'){

          let  messContainer = `<div class='messCont' id ='${idEl}'>`+
                                 `<div class='mess_inner in_mess'>${translation}</div>`+
                                "</div>";

          $(inBodyEl).append(messContainer);

       } else if (category === 'out'){

            let  messContainer = `<div class='messCont' id ='${idEl}'>`+
                                  `<div class='mess_inner out_mess'>${translation}</div>`+
                                "</div>";

          $(inBodyEl).append(messContainer); 

       } else {

       }

    });

    let newEl = document.getElementById(idEl);
    newEl = newEl.querySelector('.mess_inner');
    if(newEl){
       newEl.scrollIntoView(false); 
   } else {

    console.log('элемента newEl нет  -  createHistoryEls');
    console.log('idEl   ', idEl);
   }
    


};
