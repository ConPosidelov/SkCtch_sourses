// SkypeCatcher - сокращение SkCtch
// 
// 
//

'use strict';

//import * as KEY from "./variables/queryKeys";
import {outTranslationHdlr} from "./outMessages";
import {sendTransButtHdlr} from "./outMessages";
import {showNewMess} from "./showNewMess";
import {createHistoryEls} from "./history";
import {clearHistoryEls} from "./history";
// 
// KEY - ссылка на объект с ключами
// EL  - ссылка на объект с елементами
// history - объект с хистори  (theHistory)
// showHistMess - функция заполнения контейнера сообщениями из истории
// (createHistoryEls)
// messObj - объект с сообщениями (theMessages)
// showMess - функция создающая новое сообщение
//

export let onMessFromBgLstr = (KEY, EL, history, messObj) => {

  chrome.runtime.onMessage.addListener((req) => {
  
    if (req.key === KEY.getUserHistory) {
        let author = req.author;
        //console.log('onMessage getHistory  req.records',req.records);
        if(req.records != 'none'){

            if(!history[author]) history[author] = [];
            
            req.records.forEach((item) => {

               let time = item.time;
               
               if(!history[author][time]) history[author][time] = {};

               history[author][time].time = time;
               
               history[author][time].language = item.language;
               history[author][time].word = item.word;
               history[author][time].translation = item.translation;
               history[author][time].category = item.category[0];

            });
            
            createHistoryEls(history, author, EL.inBody);
 
        } else if(req.records === 'none') {
            console.log(`${req.author} - не имеет истории` );
            clearHistoryEls();
        }


    } else if (req.key === KEY.reqInTranslate) {
    
        let author = req.author;
        let time = req.time;
        
        if(author){

            if(!messObj[author]) messObj[author] = [];
            if(!messObj[author][time]) messObj[author][time] = {};

            messObj[author][time].time = time;
            messObj[author][time].language = req.language;
            messObj[author][time].word = req.word;
            messObj[author][time].translation = req.translation;
            messObj[author][time].category = req.category[0];

            showNewMess(EL, author, time, messObj);

        } else {

        }





    } else if (req.key === KEY.reqTranslate) {

        outTranslationHdlr(req, EL);
        sendTransButtHdlr(EL);

    } else if (req.key === KEY.getTemplates) {

    


    }    




  });  

};