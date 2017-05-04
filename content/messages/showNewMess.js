// SkypeCatcher - сокращение SkCtch
//
// 
//
'use strict';

// ФУНКЦИЯ    
// показывает новое сообщение в ленте
// EL  - ссылка на объект с елементами
// messObj - объект с сообщениями (theMessages)
//

export let showNewMess = (EL, author, time, messObj) => {

    let category = messObj[author][time].category;

    let itemStr = ''+ messObj[author][time].time;
    let idEl = `SkCtch${itemStr}`;

    let word = messObj[author][itemStr].word; 
    let translation = messObj[author][itemStr].translation;

    if(category === 'in'){

        let  messContainer = `<div class='messCont' id ='${idEl}'>`+
                                 `<div class='mess_inner in_mess'>${translation}</div>`+
                                "</div>";

        $(EL.inBody).append(messContainer);

    } else if (category === 'out'){

        let  messContainer = `<div class='messCont' id ='${idEl}'>`+
                                  `<div class='mess_inner out_mess'>${translation}</div>`+
                                "</div>";

        $(EL.inBody).append(messContainer); 

    } else {

    }
    
    let newEl = document.getElementById(idEl);
    newEl = newEl.querySelector('.mess_inner');
    newEl.scrollIntoView(false);


};