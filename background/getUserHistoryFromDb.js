//  SkypeCatcher - сокращение SkCtch
//
//  ФУНКЦИЯ    
//  получает последние numberRec элементов из базы
//
'use strict'

export let getUserHistoryFromDb = (author, numberRec, DBNAME, STORE, storeIndex) => {

    return new Promise((resolve, reject) => {

        if(!DBNAME) reject('Нет базы');
        if(!STORE) reject('Нет хранилища');
        if(!author) reject('Нет author');
        if(!numberRec) reject('Нет lengthRec');

        let theRecords = []; 

        let request = indexedDB.open(DBNAME);
        request.onerror = (event) => reject('Ошибка открытия базы '+ event.target.errorCode);

        request.onsuccess = () => {    
            let db = request.result;  
            let tx = db.transaction(STORE, "readwrite");
            let store = tx.objectStore(STORE);
            let index = store.index(storeIndex);
//console.log('openCursor(author)', author);
            let request2 = index.openCursor(author);// прямая выборка
            //let request2 = index.openCursor(null,'prev'); // обратная выборка
            request2.onsuccess = function(event) {
              let cursor = event.target.result;  
              if (cursor ) {
                theRecords.push(cursor.value);
                cursor.continue();

              } else {

               if(!theRecords.length) resolve('none');
              
               theRecords = _.sortBy(theRecords, (obj) => { return obj.time;});
               numberRec = +numberRec;
               theRecords = theRecords.splice(-numberRec, numberRec);
               
               resolve(theRecords);

              }  

            }; // request2.onsuccess     


            tx.oncomplete = () => {
                db.close();
                
            }; 
            tx.onabort = () => reject('Ошибка транзакции '+ tx.error.message);
        };





    });    
};

