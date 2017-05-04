//  SkypeCatcher - сокращение SkCtch
//
//  ФУНКЦИЯ    получает объект mes - приводит его к нормальному виду
//  и сохраняет его в базу
//  

'use strict';

let saveMessageOnDb = function (mes, DBNAME, STORE) {
    
    return new Promise(function(resolve, reject) {

        if(!DBNAME) reject('Нет базы');
        if(!STORE) reject('Нет хранилища');
        if(!mes.language) reject('Нет языка сообщения');
        if(!mes.word) reject('Нет текста сообщения');
        if(!mes.translation) reject('Нет перевода сообщения');

        if(!mes.author) mes.author = 'anonimus';
        if(!mes.category) mes.category = [];
        if(!mes.notes) mes.notes = [];
        if(!mes.time) mes.time = ''+ Date.now();
        

        let request = indexedDB.open(DBNAME);
        request.onerror = (event) => reject('Ошибка открытия базы '+ event.target.errorCode);
        request.onsuccess = () => {    
            let db = request.result;  
            let tx = db.transaction(STORE, "readwrite");
            let store = tx.objectStore(STORE);
            let request2 = store.put(mes);

            tx.oncomplete = () => {
                db.close();
                resolve('Все запросы выполнены успешно');
            }; 
            tx.onabort = () => reject('Ошибка транзакции '+ tx.error.message);
        };
 
    });

};

export {saveMessageOnDb};