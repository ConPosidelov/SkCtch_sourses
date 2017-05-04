//
//  SkypeCatcher - сокращение SkCtch
//
//
'use strict';
import {setLanguages} from "./setLanguages";
import {getLanguageAbr} from "./setLanguages";
import {yandexUrl} from "./getYandexUrl";
import {setDbStorages} from "./setDbStorages";
import {setContentScriptSettings} from "./setContentScriptSettings";

import {getTranslation} from "./getTranslation";


import {sendMessages} from "./messages/sendMessages";

import {saveMessageOnDb} from "./saveMessageOnDb";
import {getUserHistoryFromDb} from "./getUserHistoryFromDb";



(function backgroundFunction ()  {

    // ------------------- variables -----------------------------------
    // 
    let theMess = {}; // объект c текущей запись в таблицу слов
    theMess.category = [];
    theMess.notes = [];
    let theMesCat = {}; // объект с текущей запись в таблицу категорий слов
    let theTemplate = {}; // объект с текущей запись в таблицу темплейтов
    let theTempCat = {}; // объект с текущей запись в таблицу категорий темплейтов

    let reqObj = {};
    reqObj.records = [];

    //база данных
    let DBNAME = 'SkypeCatcher',
        MESSTORE  = 'MessStore',
        MESCAT    = 'MessCategoryStore',
        TEMPSTORE  = 'TemplateStore',
        TEMPCAT    = 'TemplateCategory';

    // ------------------- execution -------------------------------------------
    //
    //-- 1 -- устанавливаем языки 
    setLanguages();
    //--------------------------------
    //-- 2 -- создаем базу и таблицы
    setDbStorages(DBNAME, MESSTORE, MESCAT, TEMPSTORE, TEMPCAT);
    //--------------------------------
    //-- 3 -- получаем настройки контент скрипта
    let conScriptSettings = setContentScriptSettings();
    //--------------------------------
    //-- 4 -- слушаем сообщения из других окон и проверяем ключ каждого

    chrome.extension.onMessage.addListener(function(requestMess, sender, sendResponse){
        // ключи запросов
        let keyGiveSettings = 'giveSettings'; // запросить настройки окна и получить ответ
        let keyChangeSettings = 'changeSettings';// изменить настройки окна

        let keyUserHistory = 'giveUserHistory';// запросить юзер хистори
        let keyTranslate = 'giveTranslate'; // перевести и вернуть перевод
        let keyTranslateAndSave = 'giveTranslateAndSave';// перевести, сохранить и вернуть перевод
        let keySaveMess = 'saveMess';// сохранить без перевода
        let keyGiveMess = 'giveMess';// получить слово из хранилища
        let keyGiveTemplates = 'giveTemplates';// запросить темплейты и получить
        let keyCreateTemplate= 'createTemplate';// создать новый темплейт
        let keyDelTemplate = 'delTemplate';// удалить темплейт
        //ключи ответов
        let keyGetSettings = 'getSettings'; // получите настройки
        let keyReqTranslate = 'getTranslate'; // получите перевод
         
        let reqInTranslate = 'getInTranslate';// получите перевод входящего
        let keyGetTemplates = 'getTemplates'; // получите темплейты
        let keyReqHistory = 'getHistory'; // получите хистори

        if(requestMess.key === keyGiveSettings){

          sendResponse(conScriptSettings);  
         
        }  else if(requestMess.key === keyChangeSettings) {
            
          // rewriteContentScriptSettings();

        }  else if(requestMess.key === keyUserHistory) {
          
          let author = requestMess.author;
          let numberRec = requestMess.number;
         
          getUserHistoryFromDb(author, numberRec, DBNAME, MESSTORE, 'by_author')
          .then(result => {
            reqObj.records = result;
            reqObj.key = keyReqHistory;
            reqObj.author = author;
            sendMessages(reqObj);
            

          }).catch((error) => alert(error));  
          
        } else if(requestMess.key === keyTranslate) {
          console.log('keyTranslate');
           theMess.word = requestMess.word;
           theMess.language = requestMess.language;

           getTranslation(theMess, yandexUrl)
           .then(result => {
                result.key = keyReqTranslate;
                sendMessages(result);
           }); 

        } else if(requestMess.key === keyTranslateAndSave) {

          console.log('keyTranslateAndSave');
           theMess.time = ''+ Date.now(); 
           theMess.word = requestMess.word;
           theMess.author = requestMess.author;
           theMess.language = requestMess.language;
           theMess.category[0] = requestMess.category[0];

           getTranslation(theMess, yandexUrl)
           .then(result => {
              console.log('getTranslation.then');
              result.key = reqInTranslate;
              return sendMessages(result);
           }) 
           .then(result => {
               return saveMessageOnDb(theMess, DBNAME, MESSTORE);
           }).catch((error) => alert(error)); // добавить обработчик 
          
        } else if(requestMess.key === keySaveMess) {

          saveMessageOnDb(theMess, DBNAME, MESSTORE)  
          .catch((error) => alert(error)); // добавить обработчик 

        } else if(requestMess.key === keyGiveMess) {
          // getMessageFromDb();  
            
            
        } else if(requestMess.key === keyGiveTemplates) {
          // getTemplatesFromDb();
          // sendTemplates();  
            
        } else if(requestMess.key === keyCreateTemplate) {
          // createTemplateOnDb();  
            
        } else if(requestMess.key === keyDelTemplate) {
          // delTemplateOnDb();  
        }


    }); 
  





})();


