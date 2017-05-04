//
//  SkypeCatcher - сокращение SkCtch
//
//  ФУНКЦИЯ     инициализирует таблицы в базе
//
//import {DBNAME, MESSTORE, MESCAT, TEMPSTORE, TEMPCAT} from "./backMain";
'use strict'

let setDbStorages = function (DBNAME, MESSTORE, MESCAT, TEMPSTORE, TEMPCAT) {



    let request = indexedDB.open(DBNAME);

    request.onerror = function(event){
        console.log(' Какая то ошибка !!! ' + event.target.errorCode);
        //Сюда надо написать обработчик ошибки
    };

    request.onsuccess = function(event) {
        let db = request.result; 
        console.log(  'версия БД =    ',  db.version);
        db.close();
    };

    // создание хранилища
      request.onupgradeneeded = function(){
        console.log('onupgradeneeded  сработал');
        let db = request.result;
        let store1 = db.createObjectStore(MESSTORE, {
            keyPath: "time",
            autoIncrement: false
        });
        store1.createIndex("by_time", "time");
        store1.createIndex("by_author", "author");
        store1.createIndex("by_language", "language");

        console.log('Создано   ', MESSTORE );
        //-----------------------------------------
        let store2 = db.createObjectStore(MESCAT, {
            keyPath: "keyId",
            autoIncrement: false
        });
        store2.createIndex("by_keyId", "keyId");
        store2.createIndex("by_name", "name");
         console.log('Создано   ', MESCAT );
         //----------------------------------------- 
        let store3 = db.createObjectStore(TEMPSTORE, {
            keyPath: "time",
            autoIncrement: false
        });
        store3.createIndex("by_time", "time");
        store3.createIndex("by_language", "language");
         console.log('Создано   ', TEMPSTORE );
         //-----------------------------------------
         let store4 = db.createObjectStore(TEMPCAT, {
            keyPath: "keyId",
            autoIncrement: false
        });
        store4.createIndex("by_keyId", "keyId");
        store4.createIndex("by_name", "name");
         console.log('Создано   ', TEMPCAT );

      };
    //-----------------------------------------


};
export {setDbStorages};
/*-----------------------------------------
 MESSTORE {
     time
     author
     language  = {'ru-en' ....}
     word
     translation
     category [], category [0] = {'in'; 'out'}
     notes []

   }
-----------------------------------------
   MESCAT {
    keyId
    name
    iconName
    color
    messIdList: []

   } 
-----------------------------------------
   TEMPSTORE {
    time
    language
    text
    translation
    category []
    notes []

   } 
-----------------------------------------
   TEMPCAT{
    keyId
    name
    iconName
    color
    tempIdList: []
   }
-----------------------------------------


*/