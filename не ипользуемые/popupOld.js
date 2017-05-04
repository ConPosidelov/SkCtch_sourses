//
//
'use strict';

$(document).ready(function() {

  // счетчик слов - в бейджике расширения
  localStorage["myWords_wordsCounter"] = ''; // обнуляем при загрузке
  //выводим циферку сверху иконки расширения
  chrome.browserAction.setBadgeText({text:"" + localStorage["myWords_wordsCounter"]});
  //----------------------------
  let lastWord= {// временное старого слова
        time:"",
        date:"",
        word:"",
        context:"",
        translation:"",
        category:[]
      };
  let lastWordNew = {// временное хранилище нового  слова
    word:"",
    translation:"",
    category:[]
  };
  let categoryListNew = []; // временное хранилище нового списка категорий слова
  let wordsListFromDb = [];
  /*
    {
        time:"",
        date:"", // теперь поле 'checked'
        word:"",
        context:"",
        translation:"",
        category:[]
    }
  */
  // все что касается настроек оформления
  // стили элементов таблицы
  let recSettins = {
    wordFontSize: '18px',
    translationFontSize: '18px',
    contextFontSize: '14px',
    lengthPoint : '25', // длина фразы смены интерфейса
    widthPoint :  '50%'
  };
// длина страниц при выводе слов
let wordsPageStep = 5;
let startPageIndex = 0;
let finishPageIndex = 37;
let getFinPageIndx = (start, step) => start + step - 1;

  //--------------------------------------------

  let catRebildStorage = {};
  // объект имеет свойства с именами = id категорий
  // заполняется при запросе списка категорий
  // каждое свойство объекта = массив id слов для удаления
 //---------------------------------------------------------------------
 // временное хранение данных при создании - модификации категорий
  let categoryToCreate = {
    keyId: '4',
    name: '1',
    iconName: '2',
    color: '3',
    counter: '0',
    elIdList: []
 };
 // категории для удаления
 let categoryToRemove = {
    keyId: '',  
 };

 let PERMITDELCAT = 0; // разрешение для удаления не пустых категорий(для отладки)
// массив категорий из базы
 let categoryListFromDb = [];// объект с категориями получ из базы
 let catNameList = {}; // вспомог объект для поиска по именам категорий
 let catNameForEdit; // временное хранение имени категории для редактирования

/*
categoryListFromDb =
 [
  {
    keyId: '',
    name: '',
    iconName: '',
    color: '',
    elIdList: []
  }
];

*/
// переменные управления выборкой




//  база данных и хранилища
 let myDbName = "DictionaryDb3",
     wordStore = "myWords",
     catStore = "category";
    
 // ========= RUN ================= START ===========================

// получаем список категорий из базы  - в массив categoryListFromDb
//

rebuildWordTable ();




// !!!!!     фУНКЦИЯ   !!!!!!!!!  СЛОВА !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 
//
//  перезагружаем таблицу и окружение заново
//
function rebuildWordTable () {

// получаем объект со словами
  getStoreListFromDb (wordStore, "by_time")
  .then(result => {
    wordsListFromDb = result;
    //console.log('wordsListFromDb   ', wordsListFromDb.join('; '));
    // получаем объект с категориями
    return getCategoryListFromDb (catStore, "by_keyId");
  })
  .then(result => {
    // заполняем catRebildStorage
    setcatRebildStorage(result);
    // заполняем categoryListNew 
    setCatListNew(result);
     
    

    //
    // сдесь должна быть вставлена функция поиска по категориям и так далее
    // на выходе она должна отдать массив selectRecOfWords
    //
    let selectRecOfWords = [];
    selectRecOfWords = wordsListFromDb; // временно пока нет функции
    setPageSelControls (startPageIndex, wordsPageStep, selectRecOfWords);

   

    
  
  }); 

}

 


 //-------------------------------------------------------------
 // !!!!   фУНКЦИЯ   !!!!!!!!!  СЛОВА !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 //
 // фУНКЦИЯ создает и выводит список элементов СЛОВ полученный 
 // из базы в массиве records[]
 // 
 // использует setDelBtnHandler(k); - навешивает обработчики на чекбокс DEL

 function createWordElList (records, recSet) {

    let removeList = [];
    let recLength = records.length;
    let k = 0;

    $(".body_table").text('');

    for ( let i = 0; i < recLength; i++){
      k++;
                         
      $(".body_table").append(
            
       `<div class= "body_table_el  body_table_el${k}" >`+
         
         `<div class= "el_main  el_main${k}" >`+
           `<div class= "el_check  el_check${k}" ></div>`+
           "<div class='main_wrap'>"+

              "<div class='word_wrap'>"+
                `<div class= "el_word  el_word${k}" ></div>`+
                `<textarea wrap="soft"></textarea>`+
              "</div>"+

              "<div class='translation_wrap'>"+
                `<div class= "el_translation  el_translation${k}" ></div>`+
                `<textarea wrap="soft"></textarea>`+
              "</div>"+

             `<div class= "el_context  el_context${k}" ></div>`+
             
             
           "</div>"+   

           `<div class = "el_ctrl_panel  el_ctrl_panel${k}" >`+ 

             `<div class = "add_to_category  add_to_category${k}" ></div>`+
             `<div class = "el_ctgr_list  el_ctgr_list${k}" >`+
             "</div>"+
             `<div class = "remove_el  remove_el${k}" ></div>`+
             
             `<div class = "edit_el  edit_el${k}" ></div>`+
              
             `<div class = "hide"  id = "hide${k}" ></div>`+
           "</div>"+
                  
          "</div>"+

          '<div class="editKategoryBar">'+
            
          "</div>"+
        "</div>"

      );    

      // вставляем CSS
      $(".el_word"+k).parent().css({
          "width": '29%'
       });

       $(".el_word"+k).css({
         "font-size": recSet.wordFontSize,
       });

      $(".el_translation"+k).parent().css({
         "width": '25%'
       });

      $(".el_translation"+k).css({
          "font-size": recSet.translationFontSize,
       });

      $(".el_context"+k).css({
         'display': 'block',
         "font-size": recSet.contextFontSize,
         "width": '45%'
         
      });

      // проверяем длину строки и перестраиваем количество колонок в отбражении
      //
      //console.log("Проверяем theRecords[i].context   ", theRecords[i].context); 
      if (+recSet.lengthPoint < records[i].word.length){

        $(".el_word"+k).parent().css({
          "width": '50%' 
        });

        $(".el_translation"+k).parent().css({
          "width": '50%'
        });

        $(".el_context"+k).css({
          'display': 'none'
        });

      } // end if  проверяем длину строки

      // заполняем шаблон значениями из базы

      let textAriaWord =  $(".el_word"+k).next('textarea');
      let textAriaTranslation =  $(".el_translation"+k).next('textarea');

      $(".el_word"+k).text(records[i].word);
      textAriaWord.text(records[i].word);

      $(".el_translation"+k).text(records[i].translation);
      textAriaTranslation.text(records[i].translation);

      $("#hide"+k).text(records[i].time);
      //$("#hide1"+k).text(records[i].time);  // времмено надо один удалить

      if(records[i].context != 'undefined'){ // бывают случаи когда нет анкора
         $(".el_context"+k).text(records[i].context);
      } else {
         $(".el_context"+k).text('Анкор получить не удалось');
      }


      let categoryArr = records[i].category;
      // устанавливаем обработчики клика на чек боксы удаления
     // console.log('categoryArr.length    ', categoryArr);
      setDelBtnHandler(k, removeList, records[i].category);
      //  устанавливаем обработчики клика на кнопку "edit"
      setEditBtnHdlr();
      //   заполняет елемент с elName  иконками категорий
      let elCtgrList = `.el_ctgr_list${k}`; 
      //console.log('categoryArr    ', categoryArr);
      fillELcategoryIcon(elCtgrList, categoryArr, categoryListFromDb);

    } // end for ( let i = 0; i < theRecords.length; i++){
     console.log('Построили талицу'); 

 }


//    !!!!  фУНКЦИЯ  !!!!!!!!!!!!!  СЛОВА !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//
// устанавливаем обработчики клика на чек боксы удаления 
// и обрабатываем нажатие на них
//  показываем кнопку "удалить отмеченное" и прячем если нечего удалять
// использует setRemoveCheckHandler() 

function setDelBtnHandler (k, removeList, categoryArr) {

  $(".remove_el"+k).off("click").on('click', function(){
    console.log(" Кликнули по  ", $(this).parent().find('.hide').text());
    // достаем строку с Id
    let theRecordId = $(this).parent().find('.hide').text();
    let categoryArrLength;
    //
     //----------- все что касается перестроения таблицы категорий ---------------
    if(categoryArr){
      categoryArrLength = categoryArr.length;

    } else {
      categoryArrLength = 0;

    }

    //console.log('categoryArrLength1    ', categoryArrLength);
    //----------------------------------------------------------
    //
    // проверяем класс del на кнопке удаления
    if($(this).is('.del')) {   // если птичку удаления снимаем
       $(this).removeClass('del');
       //
      //----------- все что касается перестроения таблицы категорий ---------------
        if(categoryArrLength){
          for(let j = 0; j < categoryArrLength; j++){
            let keyId = categoryArr[j];
            if (catRebildStorage[keyId]){
              // получаем позицию элемента в массиве Id
              let i;
              if(catRebildStorage[keyId] && theRecordId){
                i = catRebildStorage[keyId].indexOf(theRecordId);
              } else {
                i = -1;
              }
              // вырезаем id элем со снятой птичкой 
              if(i >= 0) {
                catRebildStorage[keyId].splice(i, 1);
              }

            } else {
              console.log("Такой категории не существует !!!");
            }
            
          }
        }


       //------------ все что касается перестроения таблицы слов  -------------
       //
       // получаем позицию элемента в массиве Id
       let ii;
       if(removeList && theRecordId){
          ii = removeList.indexOf(theRecordId);
       } else {
          ii = -1;
       }
       
       // вырезаем id элем со снятой птичкой 
       if(ii >= 0) {
          removeList.splice(ii, 1);
       }
       console.log("removeList.length  ", removeList.length );
       // если это был последний остававшийся в списке 
       //то убираем кнопку "удалить все"  
       if(removeList.length === 0) {$('.status_panel').removeClass('del');}

    } else {       // если птичку удаления устанавливаем
        //----------- все что касается перестроения таблицы категорий ---------------

        if(categoryArrLength){
          for(let j = 0; j < categoryArrLength; j++){
            let keyId = categoryArr[j];
            if (catRebildStorage[keyId]){
              catRebildStorage[keyId].push(theRecordId);
            } else {
              console.log("Такой категории не существует !!!");
            }
            
          }
        }

        //------------ все что касается перестроения таблицы слов  -------------
        
        removeList.push(theRecordId); // пушим ID в массив на удаление

        //------------------------------------------------------
        $(this).addClass('del');
        //
        if(!($('.status_panel').is('.del'))) {
          // показываем кнопку "удалить все" если ее небыло
          $('.status_panel').addClass('del');
        }
        //console.log(' removeList   ', removeList.join(', '));
        // устанавливаем обработчик нажатия на "удалить все" кнопку  
        setRemoveCheckHandler(".remove_all_butt", removeList);

    }

  });

}


  // !!   фУНКЦИЯ   !!!!!!!!!!!!!!!!  СЛОВА !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  //-----------------------------------------
  //  устанавливает обработчик на кнопку удалить отмеченные
  //
  // использует функцию removeCheckEl                               ===========
  //   + перегружает                           скорректировать базу категорий
  function setRemoveCheckHandler(removeBattEl, delList){      

    $(removeBattEl).off("click").on('click', function(){

            
      $('.status_panel').removeClass('del');
       
      //removeCheckEl (myDbName, wordStore, delList)
      removeElListFromDb(myDbName, wordStore, delList)
      .then(result => {
        // очищаем таблицу категорий
        return clearCatStorage(catRebildStorage);
      })
      .then(result => {
        // очистим CatRebildStorage
        setCatRebildStorageTwo();                                                       // !!!
        // перезагрузим таблицу слов
        //getArrRecordsFromDb (wordStore, "by_time", 1, 10, 0, recSettins);
        rebuildWordTable ();

      });  
      
          
         
         
    });
  } 



  //!!!   фУНКЦИЯ   !!!!!!!!!!!!!!  СЛОВА !!!!!!    РАБОТА С БАЗОЙ      !!!!!!!!!
  //
  // удаляет группу элементов (слов )    из базы
  //  removeList - массив ID элементов для удаления   возвращает промис
  //  
  //использует   openDb();

function removeElListFromDb(dbName, storage, removeList){

  return new Promise(function(resolve, reject) {

    let listLength = removeList.length;
    let request = openDb(dbName);

    request.onsuccess = function (){
        let db = request.result;
        console.log('открываем хранилище', storage);
        let tx = db.transaction(storage, "readwrite");
        let store = tx.objectStore(storage);
        
        for(let i =0; i < listLength; i++){
          let id = removeList[i];
          store.delete(id);
        }

        tx.oncomplete= function(){
          //Все запросы выполнены успешно, можно закрыть соединение:
          db.close();
          resolve('Все запросы выполнены успешно');
        }
        tx.onabort= function(){
          //Во время транзакции произошла ошибка
          console.log(tx.error.message);
        }

    };

  });
}




//!!   ФУНКЦИЯ   !!!!!!!!    СЛОВА    !!!!!!!!!!!!!!!!!!!
//
// ------------ обрабатывает нажатие кнопкки "EDIT"  "save"--
// - в меню редактирования слова
//  добавляет класс edit к ".body_table_el"
// 
//
// 
function setEditBtnHdlr() {

  $('.body_table').find('.edit_el').each(function(){

    $(this).off("click").on('click', function(){ 

      let bodyTableEl = $(this).parent().parent().parent();
      let bodyTable = bodyTableEl.parent();
      let container = bodyTable.parent();
      let editKategoryBar = bodyTableEl.find('.editKategoryBar');
      let addToCategory = $(this).siblings('.add_to_category');
      //let bodyTable = bodyTableEl.parent();

      if(bodyTableEl.is('.edit')){
        bodyTableEl.removeClass('edit');
        bodyTable.removeClass('edit');
        container.removeClass('edit');
        // режим сохранения
        // надо вызвать функцию сохранения нового состояния элемента в ней:
        console.log('вызвать функцию  wordEditSaveBtnHdlr');
         //wordEditSaveBtnHdlr(bodyTableEl); ненадо все автоматически записывается        // сравнить  lastWord и lastWordNew
        console.log('сравнить  lastWord и lastWordNew');
        console.log('lastWordNew.category ', lastWordNew.category.join(';'));

        let testWordArr;
        testWordArr = compareLastWordArr();// 'changed'  или 'equal'      //  =====
         console.log('testWordArr   ', testWordArr);
        if(testWordArr === 'changed'){
          // заполняем categoryListNew
          rewriteCatListNew();
          // перезаписать слово в базу
          console.log('Перезаписываем базу');
          editWordRecord(lastWordNew)                                       //   =====
          .then(function(result){
            //  перезаписать таблицу категорий
            console.log('Перезаписываем таблицу категорий');
            return rewriteCatStorage(); // функция должна веpнуть промис
           
          })  
          .then(function(result){
            //  перегрузить таблицу
            console.log('Перезагружаем таблицу слов');
           // getArrRecordsFromDb (wordStore, "by_time", 1, 10, 0, recSettins);  //  ====
           rebuildWordTable ();

          });  

        }
     
      } else {        // вход в редактирование

        bodyTableEl.addClass('edit');
         bodyTable.addClass('edit');
         container.addClass('edit');
        // надо записать текущее состояние слова в lastWord и lastWordNew
        //    console.log('записать текущее состояние слова в lastWord');
        saveWordCarrentState(bodyTableEl);
        //console.log('lastWordNew.category ', lastWordNew.category.join(';'));
        // обнуляем готовый catRebildStorage
        //setCatRebildStorageTwo();
        setCatListNewTwo();
        // навесить обработчик на text area
            //console.log('навесить обработчик на text area');
        onChangeTextAreas(bodyTableEl);
        // вызвать функцию обработчика клика на кнопку add category
          console.log('вызвать функцию обработчика клика на кнопку add category');
        setAddToCatBtnHdlr(addToCategory, editKategoryBar);
   

      }

    }); 

  });

} 


// ++ ФУНКЦИЯ ++++++++++++++++  СЛОВА ++++++++++++++++++++++++++++++++++++++
//  навешивает обработчики клика на  el     .el_ctrl_panel => .add_to_category
//  при клике заполняется target     .editKategoryBar    списком категорий
//  el и  target  - JQuery объекты
// 
//   +  навешиваем обработчик на нажатие delButton при клике на кот.
//     перезапишем состояние временного объекта lastWordNew и
//     добавить или убираем значек отображения категории в статус панели
//  испьзует  getCatArrFromElCtgrList
function setAddToCatBtnHdlr (el, target ) {

  let bodyTableEl = target.parent();
  let wordId = ''+ bodyTableEl.find('.hide').text();
  let elCtgrList = target.parent().find('.el_ctgr_list');
  let redColor = 'rgb(255, 0, 0)';
  let greenColor = 'RGB(46, 204, 113)';

  el.off('click').on('click', function(){
    //console.log('кликнули на .add_to_category');
    let catListLenth = categoryListFromDb.length;// общее число катег. в базе
     
    if(bodyTableEl.is('.add')){
      bodyTableEl.removeClass('add');

    } else {  // открытие меню
      bodyTableEl.addClass('add');
      console.log('catListLenth   ', catListLenth);                                                                          
      target.text('');
      // перебираем все категории и для каждой строим элемент
      for(let i = 0; i < catListLenth; i++){

        let currKey = ''+ categoryListFromDb[i].keyId;
        let currCatName =  ''+ categoryListFromDb[i].name;
        let currIconName =  ''+ categoryListFromDb[i].iconName;
        let currColor =  ''+ categoryListFromDb[i].color;
        let currElIdList =  categoryListFromDb[i].elIdList;

        let elIdListLength; // ????
        if(currElIdList){
          elIdListLength =  currElIdList.length;
        } else {
          elIdListLength = 0;
        }


        // console.log('target.append');
        target.append(
          `<div class="ecbCatRecords catRecords_${i}">`+
            `<div class="ecbAddDelButton">`+
              `<div class="ecblId">${currKey}</div>`+
            '</div>'+
            `<div class="ecbName">${currCatName}</div>`+
            `<div class="ecbIcon">${currIconName}</div>`+
          '</div>'
        );

        let carrRec = target.find(`.catRecords_${i}`); // текущий элемент с категорией
        carrRec.find('.ecbIcon').css('color', ''+ currColor);

        let delButton = carrRec.find('.ecbAddDelButton');
      
        // оформляем для начала delButton зеленым и рисуем туда add
        delButton.text('add');
        delButton.css('color', greenColor);
        
        // проверяем есть ли категория в  lastWordNew.category
        let lastWordNewCatLength = lastWordNew.category.length;

        if(!lastWordNewCatLength){
          lastWordNewCatLength = 0;
        } else {

          for(let i = 0; i < lastWordNewCatLength; i++){
            let category = lastWordNew.category[i];
            if (category === currKey ){
              delButton.text('clear');
              delButton.css('color', redColor);
            }
          }
        } 
       
        // --------------------------------------------------- 
        // навешиваем обработчик на нажатие add - delButton                           // слева возле названия категории
        // ---------------------------------------------------
        
     
        delButton.off('click').on('click', function(){

          let buttonColor = delButton.css('color');
        
          if(buttonColor === redColor){
            //console.log('redColor    ', redColor);
            // надо удалить категорию у слова 
            // для этого перезапишем состояние временного объекта lastWordNew
            console.log('lastWordNew.category1 ', lastWordNew.category.join(';'));
            console.log('currKey    ', currKey);

            var k = lastWordNew.category.indexOf(currKey);
            console.log('k =       ', k);
            if(k >= 0){
              lastWordNew.category.splice(k, 1);
            }
            // перезапишем состояние кнопки
            delButton.text('add');
            delButton.css('color', greenColor);
            // надо удалить значек категории из отображения
            elCtgrList.find('.cl_it').each(function(){
              let clitName = $(this).find('.clit_name').text();
              if(clitName === currCatName){
                $(this).remove();
              }
            }); 

          } else {
            // надо добавить категорию к слову
            // для этого перезапишем состояние временного объекта lastWordNew
            lastWordNew.category.push(currKey);
            // перезапишем состояние кнопки
            delButton.text('clear');
            delButton.css('color', redColor);

            // надо добавить значек отображения категории в статус панель
            elCtgrList.append(
              `<li class="cl_it" style ="color: ${currColor};">${currIconName}`+
                `<span class="clit_name">${currCatName}</span>`+
                `<span class="cl_cat_id">${currKey}</span>`+ 
              '</li>'
            );
          }
        });// end delButton.off('click')


      }// end for

    }// end if  

  });// end el.off('click')
 
}
//   ФУНКЦИЯ ++++++++++++++++  СЛОВА +++++++   НЕ ИСПОЛЬЗУЕТСЯ
//  
//  достает id категорий из списка иконок элемента и возвращает массив с ними
//

function getCatArrFromElCtgrList(ctgrList) {
 
  let catArrFromEl = [];

  ctgrList.find('.cl_cat_id').each(function(indx){
    let id = $(this).text();

    catArrFromEl.push(id);
  });

  return catArrFromEl;
}

// ++ ФУНКЦИЯ ++++++++++++++++  СЛОВА ++++++++++++++++++++++++++++++++++++++
//
//  записать текущее состояние слова в lastWord и lastWordNew
//  
//
function saveWordCarrentState(carrEl) {
  lastWord.category = [];
  lastWordNew.category = [];

  let time = carrEl.find('.hide').text();
  let word = carrEl.find('.el_word').text();
  let translation = carrEl.find('.el_translation').text();
  let context = carrEl.find('.el_context').text();
  
  let carrElIt = carrEl.find('.el_ctgr_list .cl_it');

  carrElIt.each(function(){
    let id = $(this).find('.cl_cat_id').text();
    lastWord.category.push(id);
    lastWordNew.category.push(id);
  });

  lastWord.time = time;
  lastWord.word = word;
  lastWord.translation = translation;
  lastWord.context = context;

  lastWordNew.time = time;
  lastWordNew.word = word;
  lastWordNew.translation = translation;
  lastWordNew.context = context;
}

// ++ ФУНКЦИЯ ++++++++++++++++  СЛОВА ++++++++++++++++++++++++++++++++++++++
//
// 
//  обрабатывает ввод в text aria и перезаписывает lastWordNew
//

function onChangeTextAreas(carrEl) {
  
  let wordTextAreaEl = carrEl.find('.word_wrap textarea');
  let translationTextAreaEl = carrEl.find('.translation_wrap textarea');

  wordTextAreaEl.on('change',  function(){  //'paste input' ???
    lastWordNew.word = wordTextAreaEl.val();
  }); 

  translationTextAreaEl.on('change',  function(){
    lastWordNew.translation = translationTextAreaEl.val();
  });

}

// ++ ФУНКЦИЯ ++++++++++++++++  СЛОВА ++++++++++++++++++++++++++++++++++++++
//  сравнивая lastWord и lastWordNew
//  проверяет изменились ли параметры после редактирования 
//  
//
function compareLastWordArr() {
   
    let lWord = lastWord.word;
    let lTranslation = lastWord.translation;
 
    let nWord = lastWordNew.word;
    let nTranslation = lastWordNew.translation;
    let length1 = lastWord.category.length;
    let length2 = lastWordNew.category.length;

    if(lWord === nWord && lTranslation === nTranslation){

      if(length1){
        lastWord.category.sort();
      } else {
        length1 = 0;
      }
      
       if(length2){
        lastWordNew.category.sort();
      } else {
        length2 = 0;
      }
      
      if(length1 === 0 && length2 === 0){
        return 'equal';
      }

      if(length1 === length2){
        for(let i = 0; i < length1; i++){
          if(lastWord.category[i] != lastWordNew.category[i]){
            return 'changed';
          }
        }
      } else {
        return 'changed';
      }

    } else {
      return 'changed';
    }

    return 'equal';

}

// ++ ФУНКЦИЯ ++++++++++++++++  СЛОВА ++++++++++++++++++++++++++++++++++++++
//
//   редактирует слова в базе                         возвращает промис 
//  
//   использует  openDb(dbName)

function editWordRecord(obj) {

  return new Promise(function(resolve, reject) {

    let request = openDb(myDbName);

    request.onsuccess = function (){
      let db = request.result;
      let tx = db.transaction(wordStore, "readwrite");
      let store = tx.objectStore(wordStore);
          
      let request2 = store.put({
        time: ''+ obj.time,
        word: obj.word,
        translation: obj.translation,
        category: obj.category,
        context: obj.context
      });
      request2.onsuccess = function() {
        resolve('слово отредактировано');
      };
      request2.onerror = function() {
        console.log(request2.error.message);
      };
      tx.oncomplete= function(){
        db.close();
        console.log('База закрывается - редактирование слова');
      };
  
    };// end request.onsuccess
  });
}

// !!!!!     фУНКЦИЯ   !!!!!!!!!  СЛОВА !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// инициализируем catRebildStorage  хранит массив слов для ПЕРЕСТРОЕНИЯ таблицы категорий
//  объект имеет свойства с именами = id категорий
// 
// каждое свойство объекта = массив id слов для удаления
// 

function setcatRebildStorage(catRec) {
  
      let catRecLength = catRec.length;

      for(let i = 0; i < catRecLength; i++){
        let keyId = catRec[i].keyId;
        catRebildStorage[keyId] = [];
      }

}
// обнуляем готовый catRebildStorage
function setCatRebildStorageTwo() {
 
      for(let i in catRebildStorage){
        catRebildStorage[i] = [];
      }

}




// ++ ФУНКЦИЯ ++++++++++++++++  СЛОВА ++++++++++++++++++++++++++++++++++++++
//   заполняет елемент с elName  иконками категорий
//
//   categoryIdArr - массив со списком Id категорий в слове
//     let categoryArr = records[i].elIdList;
//
//   categoryList - временный массив категорий из базы

function fillELcategoryIcon (elName, categoryArr, categoryList){
    //console.log('fillELcategoryIcon  ');
    if(!categoryList){
      return console.log('Нет массива категорий');
    } 
    if(!categoryArr){
      return console.log('Нет массива со списком Id категорий');
    }
    let catListLength = categoryList.length;
    let catArrlength = categoryArr.length;
    //console.log('catArrlength  ', catArrlength);
    for(let i = 0; i < catArrlength; i++){
      let id = ''+ categoryArr[i];
      let name,
          iconName,
          color;
     // console.log('catListLength  ', catListLength);    
      for(let j = 0; j < catListLength; j++){

        let carrId = ''+ categoryList[j].keyId;
        if(carrId === id){
          name = categoryList[j].name;
          color = ''+ categoryList[j].color;
          iconName = categoryList[j].iconName;
        }

      }
      // вставляем в элемент иконку
      $(elName).append(
        `<li class="cl_it cl_it${i}">${iconName}`+
          `<span class="clit_name">${name}</span>`+
          `<span class="cl_cat_id">${id}</span>`+ 
        '</li>'
      );
      $(elName).find(`.cl_it${i}`).css('color', color);

    }


} 

//-----------------------------------------------------------
 // !!!!   фУНКЦИЯ   !!!!!!!!!  РАБОТА СО страницами слов   !!!!!!!!!!!!!!!
 //
 // управляет листанием страниц, устанавливает обработчики на кнопки
 // и выводит индикацию состояния 
 //  arrRec - массив записей  startIndx - начальный индекс, step - шаг
 // 

function setPageSelControls (startIndx, step, arrRec){
  console.log('setPageSelControls');

  let indxDisplayEl = $('#play_state');

  let digitListEl = $('.sp_pages');
  let startButt = $('.skip_prev');
  let finishButt = $('.skip_next');
  let nextButt = $('.fast_forward');
  let prevButt = $('.fast_rewind');

  let recLength = arrRec.length;
  let start = startIndx;
  let finish = start + step -1;
  let last = recLength -1;

  let selRecOfWords = [];
  indxDisplayEl.text(''+(start + 1)+ ' - '+ (finish+1));
  selRecOfWords = getSelectionFromArr (arrRec, start, finish);
  createWordElList (selRecOfWords, recSettins);

  nextButt.off("click").on('click', function(){
   // console.log('nextButt');
    if(finish < last ){
      start = start + step;
      if((finish + step) <= last){
        finish = finish + step;
      } else {
        finish = last;
      }
    }
    // вызываем функцию обновления индикаторов
    indxDisplayEl.text(''+(start + 1)+ ' - '+ (finish+1));
    // вызываем функцию действия - вывод другой таблицы
    selRecOfWords = getSelectionFromArr (arrRec, start, finish);
    createWordElList (selRecOfWords, recSettins);
    

  });

  prevButt.off("click").on('click', function(){
    //console.log('prevButt');
    if(start > 0){
      finish = start - 1;
      if((start -step) >= 0 ){
        start = start -step;
        
      } else {
        start = 0;
      }
    }  
     // вызываем функцию обновления индикаторов
     indxDisplayEl.text(''+(start + 1)+ ' - '+ (finish+1));
     // вызываем функцию действия - вывод другой таблицы
     selRecOfWords = getSelectionFromArr (arrRec, start, finish);
     createWordElList (selRecOfWords, recSettins);

  }); 

  startButt.off("click").on('click', function(){
    console.log('startButt');
    start = 0;
    finish = start + step -1;
     // вызываем функцию обновления индикаторов
     indxDisplayEl.text(''+(start + 1)+ ' - '+ (finish+1));
     // вызываем функцию действия - вывод другой таблицы
    selRecOfWords = getSelectionFromArr (arrRec, start, finish);
    createWordElList (selRecOfWords, recSettins);

  });

  finishButt.off("click").on('click', function(){
    console.log('finishButt');

    let nam = Math.floor(recLength / step);
   
    start = nam * step ;
    finish = last;
    if(recLength / step - nam === 0){
      start = start -step;
    }
     // вызываем функцию обновления индикаторов
     indxDisplayEl.text(''+(start + 1)+ ' - '+ (finish+1));
     // вызываем функцию действия - вывод другой таблицы
    selRecOfWords = getSelectionFromArr (arrRec, start, finish);
    createWordElList (selRecOfWords, recSettins);

  });
 
}







//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++     КАТЕГОРИИ     +++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ 


//------------------------------------------------------

// 2   КАТЕГОРИИ   +++++++++++    RUN       +++++++++++++++++++++++++++++++++++
//
// получаем список категорий из базы и заполняем меню
//
  getAndDisplayCategory(myDbName, catStore, "by_keyId", ".cm_cat_list");              // 2222


  
//----------------------------------------------------------------------------
//  1  КАТЕГОРИИ   ++++++++++    RUN    ++++++++++++++++++++++++++++++++++++++++ 
//--------------------------------------------------------------------------
  // устанавливаем обработчики на  меню категорий
  // ------------------------------------------------
  // просто выдвигает задвигает меню 

  $("#category_menu_button").off("click").on('click', function(){

    if ($("#category_menu").hasClass('active')){
      $("#category_menu").removeClass('active');
      $(".category_button").removeClass('active');  
    } else {
      $("#category_menu").addClass('active');
      $(".category_button").addClass('active');
      
    }
    
  });
  // 2  КАТЕГОРИИ +++++++++++++++    RUN    +++++++++++++++++++++++++++++++++++
  // устанавливаем обработчики на подменю добавления категорий
  // ------------------------------------------------
  //  использует   clearFildsEditCat()

  $(".return_btn").off("click").on('click', function(){

    if ($(".add_category_menu").hasClass('active')){
      clearFildsEditCat();
      $(".add_category_menu").removeClass('active');

      // --------------------------------------------------
       
    } else {
      $(".add_category_menu").addClass('active');
      $(".add_category_menu").removeClass('save');
      clearFildsEditCat();
      $("#add_name").focus();
    }
    
  });
  // 3  КАТЕГОРИИ   +++++++++++++    RUN    +++++++++++++++++++++++++++++++++++++
  //------------------------------------------------
  // навешиваем обработчик на кнопку добавление  категории
  // 
  // использует createNewCategory ();  clearFildsEditCat();

  $(".add_save_btn").off("click").on('click', function(){

    if ($(".add_category_menu").hasClass('save')){
      

      // тут надо вставить функцию создания категории
      // берем параметры по факту
      categoryToCreate.name = $('.asm_name').text();
      categoryToCreate.iconName = $('.asm_icon').text();
      categoryToCreate.color = $('.asm_icon').css('color');

      let catMenu = $(".add_category_menu");
     
      if(catMenu.hasClass('del')){
        createNewCategory (categoryToCreate, 'edit')
        .then(response => {
          //clearFildsEditCat();
          return getAndDisplayCategory(myDbName, catStore, "by_keyId", ".cm_cat_list");
        })
        .then(response => {
          return getCategoryListFromDb (catStore, "by_keyId");
        })
        .then(result => {
          setcatRebildStorage(result); // заполняем catRebildStorage
          setCatListNew(result);// заполняем categoryListNew
        }); 

      } else {
        createNewCategory (categoryToCreate, 'new')
        .then(response => {
          clearFildsEditCat();
          return getAndDisplayCategory(myDbName, catStore, "by_keyId", ".cm_cat_list");
        })
        .then(response => {
          return getCategoryListFromDb (catStore, "by_keyId");
        })
        .then(result => {
          setcatRebildStorage(result); // заполняем catRebildStorage
          setCatListNew(result);// заполняем categoryListNew
        }); 

      }

      catMenu.removeClass('del');
      catMenu.removeClass('active');
      catMenu.removeClass('save');
      clearFildsEditCat();

    } 
    
  });

  // 7  КАТЕГОРИИ ++++++++++++++    RUN    ++++++++++++++++++++++++++++++++++++
  //------------------------------------------------
  // навешиваем обработчик на добавление имени категории
  // использует   checkNewCategory (newCategory);
  //
    let inputNameNewCategory =  $("#add_name");

    inputNameNewCategory.on('input paste', function(){
      let newCategory = ''+ inputNameNewCategory.val();
      $('.asm_name').text('').text(newCategory);
      categoryToCreate.name = newCategory;

      let catMenu = $(".add_category_menu");
      if(catMenu.hasClass('del')){ // режим редактирования требует другую проверку
       checkNewCategory (newCategory, 'edit');
      } else {
        checkNewCategory (newCategory, 'new');
      }
      
      

    });

  // 8  КАТЕГОРИИ +++++++++++++++    RUN    +++++++++++++++++++++++++++++++++++    
  //------------------------------------------------
  // навешиваем обработчик на добавление иконки категории
  //
    let acmIconListItem =  $(".acm_icon_list li");

      acmIconListItem.each(function(indx){

      $(this).off("click").on('click', function(){

        let newIcon = $(this).text();
        $('.asm_icon').text(newIcon);
        categoryToCreate.iconName = $('.asm_icon').text();

      });  

    });

  // 9  КАТЕГОРИИ ++++++++++++++++    RUN    ++++++++++++++++++++++++++++++++++    
  //------------------------------------------------
  // навешиваем обработчик на добавление цвета категории
  //

    let acmColorListItem =  $(".acm_color_list li");

    acmColorListItem.each(function(){

      $(this).off("click").on('click', function(){

        let newColor = $(this).css('background-color');

        //console.log(' newColor   ', newColor);
        $('.asm_icon').css('color',''+ newColor);
        $('.asm_name').css('color',''+ newColor);
        categoryToCreate.color = $('.asm_icon').css('color');
       
      });  

    });
//-------------------------------------------------------------------



  //   ФУНКЦИЯ   +++++++++  КАТЕГОРИИ ++++++++++++++++++++++++++++++++++++++ 
  //
  // ФУНКЦИЯ создает или редактирует категорию       возвращает промис
  //   
  // type = 'new'  или 'edit'
  // использует   openDb();                                pp
  //
function createNewCategory (obj, type) {

  return new Promise(function(resolve, reject) {

    if(type && type === 'new'){
      obj.keyId = ''+ Date.now();
      console.log('Создаем новую  категорию  obj.keyId ');
    } else if (type && type === 'edit'){
      obj.keyId = ''+ categoryToRemove.keyId;
      console.log('Редактируем категорию  obj.keyId ', obj.keyId);
    } else {
      console.log('Режим создания категории не определен');
    }

    let request = openDb(myDbName);

    request.onsuccess = function (){
      let db = request.result;
        //console.log('открываем хранилище', storage);
      let tx = db.transaction(catStore, "readwrite");
      let store = tx.objectStore(catStore);
      let request2 = store.put(obj);

      request2.onsuccess = function() {
        console.log('категория создана  ', obj.name + '   '+ obj.keyId);
        
      };

      request2.onerror = function() {
        console.log(request2.error.message);
      };
       
      tx.oncomplete= function(){
        db.close();
        console.log('База закрывается - создание категории');
        resolve('База закрывается  - создание категории');
      };
    };// end getRequest.onsuccess
  });
}


  //   ФУНКЦИЯ   +++++++++  КАТЕГОРИИ ++++++++++++++++++++++++++++++++++++++ 
  //------------------------------------------   возвращает промис
  // ФУНКЦИЯ получает список категорий из базы и отображает их
  // el -    ".cm_cat_list" куда кидать список категорий
  // + навешиваем обработчик на кнопку "редактировать"
  //  использует openDb();
function getAndDisplayCategory(dbName, storage, indexx, el) {

  return new Promise(function(resolve, reject) {

    let request = openDb(dbName);
    let records = [];
    request.onsuccess = function (){
      let db = request.result;
    
      let tx = db.transaction(storage, "readwrite");
      let store = tx.objectStore(storage);
       console.log('indexx    =   ',indexx);
      let index = store.index(indexx);
     
      let request1 = index.openCursor();  // прямая выборка
     
      request1.onsuccess = function(event) {
        let cursor = event.target.result;
      
        if(cursor) { 
          records.push(cursor.value);
         
          cursor.continue();
     
        } else {

          $(".cm_cat_list").text('');
          for ( let i = 0; i < records.length; i++){

            let key = ''+ records[i].keyId;
            let name = records[i].name;
            let iconName = records[i].iconName;
            let color = records[i].color;
            let counter = '';
            if(records[i].elIdList){
              counter = ''+ records[i].elIdList.length;
            } else {
              counter = '0';
         
            }
            
            $(".cm_cat_list").prepend(

                `<li class="cl_item" id ="cat_${key}">` +
                    '<i>edit</i>'+
                    `<span class="cl_name">${name}</span>`+
                    `<span class="cl_icon">${iconName}</span>`+
                    `<span class="cl_number">${counter}</span>`+
                    `<span class="cl_id">${key}</span>`+
                '</li>'
            );

            $(`#cat_${key} .cl_name`).css('color', color);
            $(`#cat_${key} .cl_icon`).css('color', color);

            // нажатие на кнопку редактировать---------------
            setEditCategoryBtnHdlr(records[i], counter, PERMITDELCAT);
            //----------------------------------------------------------
            

          }//end for


        }//end if(cursor)



      };//end request1.onsuccess

      tx.oncomplete= function(){
          //Все запросы выполнены успешно, можно закрыть соединение:
        db.close();
        resolve('Все запросы выполнены успешно');
      };

      request1.onerror = function() {
        console.log(request1.error.message);
      };

    };//end request.onsuccess

  });

}//end function

 //   ФУНКЦИЯ   ++++++++++  КАТЕГОРИИ ++++++++++++++++ кат+++++ 
  // проверяет наличие имени категории в объекте категорий
  // categoryListFromDb[i].name - результат в добавлении класса 'save'
  // к .add_category_menu  если сохранение с таким именем разрешено
  //    НОВАЯ 
  // type :  'new' || 'edit'
 
function checkNewCategory (newCategory, type) {

  
  let nameElText = $('.asm_name').text();
  let iconElText = $('.asm_icon').text();
 
  if(nameElText  && (newCategory != '') ){
    
    if(type === 'new') {
      if(catNameList[newCategory]){
        $(".add_category_menu").removeClass('save');
      } else {
        $(".add_category_menu").addClass('save');
        console.log('Запись с таким name не была найдена');
      }
    } else {

      if(catNameList[newCategory] && (newCategory != catNameForEdit)){
        $(".add_category_menu").removeClass('save');
      } else {
        $(".add_category_menu").addClass('save');
        console.log('Запись с таким name не была найдена');
      }

    }

   

  } else {
    $(".add_category_menu").removeClass('save');
    console.log('Не все задано');
  } 

}



  //   ФУНКЦИЯ   +++++++++  КАТЕГОРИИ ++++++++++++++++++++++++++++++++++++++ 
  //
  // Обработчик кнопки "удалить категорию"                 возвращает промис
  // удаляет категорию  из базы
  // использует openDb()   

function setdelCatBtnHdlr(){

  return new Promise(function(resolve, reject) {

    $('.acm_status_panel .del_btn').off('click').on('click', function(){

      let catMenu = $(".add_category_menu");
      let delId = ''+ categoryToRemove.keyId;
      let request = openDb(myDbName);
      
      request.onsuccess = function (){
        let db = request.result;
        let tx = db.transaction(catStore, "readwrite");
        let store = tx.objectStore(catStore);
            //console.log(' Принято removeId ', delId);
        let request2 = store.delete(delId);

        request2.onsuccess = function() {
          catMenu.removeClass('active');
          catMenu.removeClass('del');
          //console.log('Категория удалена');
        };

        request2.onerror = function() {
        console.log(request2.error.message);
        };
            
        tx.oncomplete= function(){
          db.close();
          console.log('База закрывается - функция удаления категорий');
          resolve('База закрывается  - функция удаления категорий');
        }

      };// end getRequest.onsuccess
 
    });
  });  
}

  //   ФУНКЦИЯ   +++++++++++  КАТЕГОРИИ ++++++++++++++++++++++++++++++++++++++ 
  //
  //  очищаем содержимое полей создания категорий
  //
  function clearFildsEditCat () {
      
      let input =  $("#add_name");
      input.val('');
      $('.asm_name').text('');
      $('.asm_icon').text('');

  }

//   ФУНКЦИЯ   +++++++++  КАТЕГОРИИ ++++++++++++++++++++++++++++++++++++++
//  обработчики клика  на кнопку редактировать  категорию
//  обрабатыват результат ввода в инпут - проверяет можно ли удалять 
//  запускает функцию установки обр нажатия на кнопку удаления категории 
// obj - список категорий из базы
// использует setdelCatBtnHdlr(); 

function setEditCategoryBtnHdlr (obj, counter, permit) {
  let color = obj.color;
  let icon = obj.iconName;    
  let key = obj.keyId;
  let name = obj.name;
  $(`#cat_${key} i`).off('click').on('click', function(){

    let input =  $("#add_name");
    let catMenu = $(".add_category_menu");
    let nameEl = $('.asm_name');
    let iconEl = $('.asm_icon');
    catNameForEdit = name; // сохраняем имя категории чтобы разрешить его редактирование
    $("#add_name").focus();
    $(".add_category_menu").addClass('save');
    input.val(name);
    iconEl.text(icon).css('color', color);
    nameEl.text(name).css('color', color);

    categoryToRemove.keyId = key;

    if (!catMenu.hasClass('active')){
      
      catMenu.addClass('active').addClass('del');
      //catMenu.removeClass('save');
  
      // проверить перед удалением содержаться ли слова в категории 
      if (permit || counter === '0'){  // удалять можно

        setdelCatBtnHdlr()
        .then(response => {
         // clearFildsEditCat();
          return  getAndDisplayCategory(myDbName, catStore, "by_keyId", ".cm_cat_list");//---
        })
        .then(response => {
          return getCategoryListFromDb (catStore, "by_keyId");
        })
        .then(result => {
          setcatRebildStorage(result); // заполняем catRebildStorage
          setCatListNew(result);// заполняем categoryListNew
        });

      } else {
        console.log('Удалять нельзя там слова');
      }

    } else {
      
      if (counter === '0'){
        setdelCatBtnHdlr()
        .then(response => {
         // clearFildsEditCat();
          return  getAndDisplayCategory(myDbName, catStore, "by_keyId", ".cm_cat_list");
        })
        .then(response => {
          return getCategoryListFromDb (catStore, "by_keyId");
        })
        .then(result => {
          setcatRebildStorage(result); // заполняем catRebildStorage
          setCatListNew(result);// заполняем categoryListNew
        });

      } else {
        console.log('Удалять нельзя там слова');
      }
                  
    }

  });

}



//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//%%%%%%%%%%%%%%%%%%%%%%%%%      НАСТРОЙКИ      %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%



// 3   НАСТРОЙКИ %%%%%%%%%%%%%%%    RUN    %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  //--------------------------------------------------------------------------
  // устанавливаем обработчики на  меню настроек
  //

  $(".setting_button").off("click").on('click', function(){

    if ($(".setting_menu").hasClass('active')){
      $(".setting_menu").removeClass('active');
    } else {
      $(".setting_menu").addClass('active');
    }
    
  });



  // 10  НАСТРОЙКИ %%%%%%%%%%%%%%%%%    RUN    %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  //-------------------------------------------------------------------
  // создание меню настроек

  var createMenu = function (){
     
    var menu = this,
        body = menu.body,
  
        listElId = menu.listElId,                       //'set_menu_button'
        listEl = document.getElementById(menu.listElId),
        listType = menu.listType,         //'click'
        
        outer = '#'+ menu.outerEl,             //'outer' эл внутри которого будет меню
        menuOuterEl = document.getElementById(menu.outerEl),
        
        targetElId = menu.targetElId,     // 'set_menu'
        itemElid = targetElId + '_item',  // 'set_menu_item'
        target = '#'+ targetElId;         // '#set_menu' пока элемента НЕТ
    
    // создаем само меню  '#set_menu' если его нет
    if(!document.getElementById(targetElId)) {
      let newUl = document.createElement('ul'); // создаем элемент
      newUl.id = targetElId;
      menuOuterEl.appendChild(newUl); // вставляем его в DOM

    }
    
  
    // теперь получаем '#set_menu'
    let setMenu = document.getElementById(targetElId);
    
    addToggle(listType, listEl, setMenu); // ставим обработчик вызова меню
  
    // заполняем меню
  
    if(!body && body.length === 0){
      console.log('Меню пока пустое');
      return 'Меню пока пустое';
    } else {
      
      for(var i = 0; i < body.length; i++){
        // console.log('body.length',body.length);
        if(body[i].state){
           
          createStateIt(i,  body[i], setMenu, itemElid );// создаем пункт меню state
          
          (function(){
            var j = i,
                obj = body[j],
                stateEl = document.getElementById(itemElid+ j);
            // ставим обработчик на клик пункта меню и
            // перезаписываем state при срабатывании обработчика
            addStateToggle(listType, stateEl, stateEl, obj); 
            
           })();
                 
         } else if(body[i].selector && body[i].selector.length > 0){
            //  создаем СЕЛЕКТОР
            createSelectorIt(i, body[i], setMenu, itemElid, body.length );
           
           (function(){
            var j = i,
                obj = body[j],
                selectorEl = document.getElementById(itemElid+ j);
            // ставим обработчик на клик пункта меню и
            // перезаписываем selector при срабатывании обработчика
            addSelectorToggle(listType, selectorEl, obj, itemElid);
                          
           })();
                 
         
         } else if(body[i].carrentAnalVal){
           //  создаем 'аналоговый' элемент 
                
          
         } // end if
            
      } // end for
      
    }// end if(!body && body.length === 0)
  };

  // 11  НАСТРОЙКИ %%%%%%%%%%%%%%%%%%    RUN    %%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  //  ФУНКЦИЯ просто переключает класс active --- новая
  // добавляет слушатель listType (click например)
  // на элемент listEl  
  // при срабатывании к елементу target добавляется и убирается 
  // класс active
  //
  var addToggle = function (listType, listEl, target ){
    
      listEl.addEventListener(listType, function(){
        if(target.classList.contains('active')) {
           rewriteMenuSettins();

        }
        //rewriteMenuSettins(); //----------------------------------------------------------------------
        target.classList.toggle('active');
        listEl.classList.toggle('active');
      });
  };

  // 12  НАСТРОЙКИ %%%%%%%%%%%%%%%%%%% %%%%%%%%%%%%%%%%%%%%%%%%%%%%
  // НОВАЯ
  // ФУНКЦИЯ обслуживает state, требует для работы recreateStateIt()
  // добавляет слушатель listType на элемент listEl  
  // при срабатывании к елементу target добавляется и убирается 
  // класс active и меняется состояние state
  //
  var addStateToggle = function (listType, listEl, target, obj){
            
       listEl.addEventListener(listType, function(){
        target.classList.toggle('active');
         
        if (obj.state === 'on'){
          //target.removeClass('active');

          obj.state = 'off';
          universalToggHandler(obj);
          recreateStateIt(obj, target);
          
        } else if(obj.state === 'off'){
         // target.addClass('active');
          obj.state = 'on';
          universalToggHandler(obj);
          recreateStateIt(obj,  target);
        } 
         
         
      });
     
    
  };

  // 13  НАСТРОЙКИ %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  // ФУНКЦИЯ новая --------------------------
  // создает пункт меню state
  //
  var createStateIt = function (i, obj, outerEl, itemElid ){
     
    var newLi = document.createElement('li'); // создаем элемент
      newLi.id = itemElid + i;
      //outerEl.appendChild(newLi);
      //newElLi =  document.getElementById(itemElid + i);
    if(obj.state === 'on'){
      newLi.textContent = obj.nameOn; // innerHTML
      outerEl.appendChild(newLi);
    } else if(obj.state === 'off') {
      newLi.textContent = obj.nameOff;
      outerEl.appendChild(newLi);
    } else {
      return console.log('Не допустимое значение state ');
    }
    
  };

  // 14  НАСТРОЙКИ %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  // ФУНКЦИЯ новая
  // обновляет пункт меню state
  //
  var recreateStateIt = function (obj, outerEl ){
     
    if(obj.state === 'on'){
      outerEl.textContent = obj.nameOn;
    } else if(obj.state === 'off') {
      outerEl.textContent = obj.nameOff;
    } else {
      return console.log('recreateStateIt: Не допустимое значение state ');
    }
  };

  // 15  НАСТРОЙКИ %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  // функция новая
  //  должна создавать элемент селектор
  // вначале просто создать заголовок
  // i - индекс элемента в массиве body
  // obj - сам объект body[i]
  // outerEl - куда вставлять пункт меню - сам элемент
  // itemElid - имя (id) будущего элемента без индекса

  var createSelectorIt = function ( i, obj,  outerEl, itemElid, bodyLength ) {
      console.log('SELECTOR 1 ', i);
      // вначале надо отыскать тот элемент меню после которого надо
      // всунуть этот селектор
      var afterElId = itemElid + (i +1) ; // это id следующего элемента
      var afterEl;

       if( document.getElementById(afterElId)){
           afterEl =  document.getElementById(afterElId);
       }
      var newLi = document.createElement('li'); // создаем элемент
      newLi.id = itemElid + i;
      // контент который будет вставлятся в селектор
      // вариант без поля name
      var simpleContent = '<span class = "'+ itemElid + '_selector" >'+
                             '<i>'+
                             obj.selValue +
                             '</i>'+
                             '<ul>' +
                             '</ul>'+ 
                          '</span>';
      // полный вариант                    
      var fullContent = '<span>'+
                          obj.name + 
                         '</span>'+
                         '<span class = "'+ itemElid + '_selector" >'+
                         '<i>'+
                          obj.selValue +
                         '</i>'+ 
                         '<ul>' +
                         '</ul>'+
                       '</span>';
      if(i < bodyLength ) { // вставляем перед следующим элементом
   
        if(obj.name && obj.selValue){ // у селектора есть поле name
          newLi.innerHTML = fullContent;
          outerEl.insertBefore(newLi, afterEl);
               
        } else if(obj.selValue) {
          newLi.innerHTML = simpleContent;
          outerEl.insertBefore(newLi, afterEl);
              
        } else {
          console.log('Ошибка в заполнении SELECTOR ', i);
        } // end if

      } else  { // вставляем в конце

        if(obj.name && obj.selValue){ // у селектора есть поле name
          newLi.innerHTML = fullContent;
          outerEl.appendChild(newLi);
        } else if(obj.selValue) {
          newLi.innerHTML = fullContent;
          outerEl.appendChild(newLi);
        } else {
          console.log('Ошибка в заполнении SELECTOR ', i);
        } // end if

      } // end if
       // 
      // заполняем тег ul селектора элементами li
      //
      var selEl =  document.getElementById(itemElid + i);
    
      for (var j = 0; j < obj.selector.length; j++) {
        
          var newSelLiIt = document.createElement('li');
          newSelLiIt.innerHTML = obj.selector[j];
          var selClass = itemElid + '_selector';
          selEl.querySelector('span.'+ selClass+ ' > ul' ).appendChild(newSelLiIt);
        /*  
          if(obj.name && obj.selValue){ // у селектора есть поле name
         
              selEl.querySelector('span:last-child > ul' ).appendChild(newSelLiIt);
          } else if(obj.selValue) { // у селектора нет поля name
        
              selEl.querySelector('span:first-child > ul' ).appendChild(newSelLiIt);
          }
        */
      } // end for
  
  };


  // 16  НАСТРОЙКИ %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  //  ФУНКЦИЯ  навешивает слушателя и обработчик на selector
  //  var obj = body[j];
  // listType = 'click'
  // selectorEl = document.getElementById(itemElid+ j)  
  // addSelectorToggle(listType, selectorEl, obj);
  //
  var addSelectorToggle = function (listType, selectorEl, obj, itemElid){
      // вначале надо получить именно тот span на котором висит селектор

      var selClass = itemElid + '_selector';
      var listEl = selectorEl.querySelector('span.'+ selClass);
      // и поставить на него слушатель и триггер переключения класса active
      listEl.addEventListener(listType, function(){
          listEl.classList.toggle('active');
      });
      // навешиваем обработчики клика на элементы селектора
      if(obj.selector.length > 0) {
        for (var i = 0; i < obj.selector.length; i++) {

          (function(){
            var j = i;
            var itContent = obj.selector[j];
            var itEl = listEl.querySelector('ul > li:nth-child('+(j+1)+')');
                
            itEl.addEventListener('click', function() {
                    
              obj.selValue = itContent; // перезаписываем свойство selValue
              // перезаписываем содержимое тега i
              listEl.querySelector('i').textContent = itContent;
              // закрываем селектор
              // любое изменение класса
              // приведет к срабатыванию listEl.classList.toggle('active');
              listEl.classList.add('any'); 
            });

          })();

        }
      }

  };


  // 15  НАСТРОЙКИ %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  // настройки меню настроек
  // получаем настройку языка
  var languageStr = localStorage["myWords_language"] || 'Английский - русский';
  var carrentLanguagesName = localStorage["myWords_allLanguagesName"].split(';');
  var contentWindState = localStorage["myWords_contentWindState"] || 'on';

  var menuSettins = {

    listElId : 'set_menu_button',
    listType : 'click',
    targetElId : 'set_menu',
    outerEl :  'container',
    isCreate : createMenu,

    body : [
        { 
        name : 'contentWindState',
        nameOn : "Выключить окно на страницах",
        nameOff : 'Включить окно на страницах',
        state : contentWindState
      
      },       
      // елемент типа селектор
      {  
        name : 'Направление перевода',
        selValue : languageStr || 'Английский - русский',
        activType : 'click', 
        
        selector : [
            'Английский - русский'       
        ]
      }
    ]
  };
  // добавляем в объект настроек языки перевода
  for(var i = 0; i < carrentLanguagesName.length; i++){
    menuSettins.body[1].selector[i] = carrentLanguagesName[i];
  }

  menuSettins.isCreate(); // создаем меню

  // 16  НАСТРОЙКИ %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  // функция перезаписывает текущий язык перевода

  function rewriteMenuSettins() {
    localStorage["myWords_language"] = menuSettins.body[1].selValue ; // направление перевода
    
  }

  // 17  НАСТРОЙКИ %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  //
  // универсальный обработчик триггеров (меню)
  //
  var activateFF = {};
  activateFF.pop = 0;

  function universalToggHandler(obj){
    
    if(obj.name && obj.name === 'contentWindState') {
      localStorage["myWords_contentWindState"] = obj.state;
      activateFF.pop++;
      activateFF.key = 'contentWindState';
      activateFF.content = localStorage["myWords_contentWindState"];
      // chrome.tabs.sendMessage ( activeTab.tabId , activateFF);

      chrome.tabs.query ({ currentWindow :  true , active :  true }, function(tabArray){
        chrome.tabs.sendMessage ( tabArray[0].id ,activateFF); 
      }); 

    }


  }

  //    ФУНКЦИЯ   WWWWWWWWW  ОБЩИЕ  WWWWWWWWWW   РАБОТА С БАЗОЙ   WWWWWWWWWWWWWWW
  //
  // ФУНКЦИЯ открывает бызу и возвращает request
  //
    
  function openDb (dbName) {
   
      let request = indexedDB.open(dbName);
      console.log('соединяемся с базой');
      request.onerror = function(event){
        console.log(' Какая то ошибка !!! ' + event.target.errorCode);
        //Сюда надо написать обработчик ошибки
      };
      return request;

  }
// WWW    ФУНКЦИЯ   WWWWWWWWW  ОБЩИЕ WWWWWWWW   РАБОТА С БАЗОЙ  WWWWWWWWWWWWWWWWWWWWWWWW 
//
// получает полный список записей  из базы и сохраняет их в массив объектов  target
// objStore - хранилище, storeIndex- имя индекса       возвр промис
// возвращает промис с объектом target
//  выборка прямая
// использует openDb(myDbName);

function getStoreListFromDb (objStore, storeIndex){

  return new Promise(function(resolve, reject) {

    let target = []; // очищаем 
    let request2;
    let request = openDb(myDbName);

    request.onsuccess = function (){
      let db = request.result;
      let tx = db.transaction(objStore, "readwrite");
      let store = tx.objectStore(objStore);
      let index = store.index(storeIndex);
      //request2 = index.openCursor();  // прямая выборка
      request2 = index.openCursor(null,'prev'); // обратная выборка
      request2.onsuccess = function(event) {
        let cursor = event.target.result;
        if (cursor)  {
          target.push(cursor.value);

          cursor.continue();
        } else {
          resolve(target);
        } // end  if (cursor) else
   
      }; // request2.onsuccess 
                          
      request2.onerror= function(){
        console.log(' Во время получения данных произошла ошибка');
      };

      tx.oncomplete= function(){
        db.close();
        console.log('База закрывается - создание категории');
      };
 
    }; // request.onsuccess

  });
}






// WWW    ФУНКЦИЯ   WWWWWWWWW  ОБЩИЕ WWWWWWWW   РАБОТА С БАЗОЙ  WWWWWWWWWWWWWWWWWWWWWWWW 
//
// получает полный список записей  из базы и сохраняет их в массив объектов  allRecords
// objStore - хранилище, storeIndex- имя индекса
// возвращает промис с объектом allRecords
//  выборка прямая
// использует openDb(myDbName);

function getCategoryListFromDb (objStore, storeIndex){

  return new Promise(function(resolve, reject) {

    categoryListFromDb = []; // очищаем 
    let request2;
    let request = openDb(myDbName);

    request.onsuccess = function (){
      let db = request.result;
      let tx = db.transaction(objStore, "readwrite");
      let store = tx.objectStore(objStore);
      let index = store.index(storeIndex);
      request2 = index.openCursor();  // прямая выборка
      
      request2.onsuccess = function(event) {
        let cursor = event.target.result;
        if (cursor)  {
          categoryListFromDb.push(cursor.value);
          cursor.continue();
        } else {
          // заполняем специальный объект с именами категорий в кач свойств
          let catLength = categoryListFromDb.length;
          for(let i = 0; i < catLength; i++){
            let name = categoryListFromDb[i].name;
            catNameList[name] = true;
          }
          resolve(categoryListFromDb);
        } // end  if (cursor) else
   
      }; // request2.onsuccess 
                          
      request2.onerror= function(){
        console.log(' Во время получения данных произошла ошибка');
      };

      tx.oncomplete= function(){
        db.close();
        console.log('База закрывается - создание категории');
      };
 
    }; // request.onsuccess

  });
}

// WWW    ФУНКЦИЯ   WWWWWWWWW  ОБЩИЕ WWWWWWWW   РАБОТА С БАЗОЙ  WWWWWWWWWWWWWWWWWWWWWWWW 
//  
// инициализируем categoryListNew
//
function setCatListNew(listFromDb) {
  
  let listFromDbLength = listFromDb.length;

  for(let i = 0; i < listFromDbLength; i++){
    let id = ''+ listFromDb[i].keyId;
    //console.log(' id     = ', id);
    
    categoryListNew[id] = {};
    categoryListNew[id].add = ''; //                                        ppp
    categoryListNew[id].remove = '';
  }

}
// очищаем готовый объект
function setCatListNewTwo() {

  for(let i in categoryListNew){
   
    categoryListNew[i] = {};
    categoryListNew[i].add = ''; //                                        ppp
    categoryListNew[i].remove = '';
  }

}

// WWW    ФУНКЦИЯ   WWWWWWWWW  ОБЩИЕ WWWWWWWW   РАБОТА С БАЗОЙ  WWWWWWWWWWWWWWWWWWWWWWWW 
//  
// заполняем categoryListNew
// на выходе имеем объект со свойствами в виде id категорий
// каждое свойство имеет ключ add и remove содержащие id слова
// 

function rewriteCatListNew() {
  
  let wordId = ''+ lastWordNew.time;
  let lastWordCatLength = lastWord.category.length;
  let lastWordNewCatLength = lastWordNew.category.length;

  for(let i = 0; i < lastWordCatLength; i++){
    let id = lastWord.category[i];
    categoryListNew[id].remove = wordId;
   }

  for(let i = 0; i < lastWordNewCatLength; i++){
    let id = lastWordNew.category[i];
    categoryListNew[id].add = wordId;
  }

  for(let id in categoryListNew){

    let add = categoryListNew[id].add;
    let remove = categoryListNew[id].remove;
    
    if(add === remove){

      categoryListNew[id].add = '';   //                                        ppppp
      categoryListNew[id].remove = '';
    }
  }

}

//   ФУНКЦИЯ   --  ОБЩИЕ WWWWWWWW  РАБОТА С БАЗОЙ    WWWWWWWWWWWWWWWWWWWWWWWW
//
//    перезаписываем  категорию
//
//   использует   openDb();

function rewriteCatStorage(){

  return new Promise(function(resolve, reject) {

    let request = openDb(myDbName);
    request.onsuccess = function (){

      let db = request.result;
      let tx = db.transaction(catStore, "readwrite");
      let store = tx.objectStore(catStore);
        //let index = store.index('by_keyId');

      for(let id in categoryListNew){

        let add = categoryListNew[id].add;
        let remove = categoryListNew[id].remove;

        if(add != ''){
          
          let getRequest1 = store.get( ''+ id);
          getRequest1.onsuccess = function(event){

            let category = event.target.result;
            category.elIdList.push(add);

            let putRequest1 = store.put(category);

            putRequest1.onsuccess = function(event){

            };
          };// end getRequest1.onsuccess

        } else if(remove != '') {
          
          let getRequest2 = store.get( ''+ id);
          getRequest2.onsuccess = function(event){

            let category = event.target.result;
            let j;
            if(remove && category.elIdList){
                j = category.elIdList.indexOf(remove);
              } else {
                j = -1;
              }
            
            if(j >= 0){
              category.elIdList.splice(j, 1);
            }
            let putRequest2 = store.put(category);
            putRequest2.onsuccess = function(event){

            };
          };// end getRequest2.onsuccess
        } 
       }// end for

      tx.oncomplete= function(){
          //Все запросы выполнены успешно, можно закрыть соединение:
        db.close();
        resolve('Все запросы выполнены успешно');
      }
      tx.onabort= function(){
          //Во время транзакции произошла ошибка
        console.log(tx.error.message);
      }

    };// end getRequest.onsuccess

  });

}

//   ФУНКЦИЯ   --  ОБЩИЕ WWWWWWWW  РАБОТА С БАЗОЙ    WWWWWWWWWWWWWWWWWWWWWWWW
//
//   очищает таблицу категорий от id  удаленных слов
//

function clearCatStorage(catRebild){

  return new Promise(function(resolve, reject) {

    let request = openDb(myDbName);
    request.onsuccess = function (){

      let db = request.result;
      let tx = db.transaction(catStore, "readwrite");
      let store = tx.objectStore(catStore);

      for(let catId in catRebild){
        let catIdLength = catRebild[catId].length;

        if(catIdLength > 0){

          let getRequest1 = store.get( ''+ catId);
          getRequest1.onsuccess = function(event){

            let category = event.target.result;
            for(let i = 0; i < catIdLength; i++){
              let wordId = catRebild[catId][i];
              let j;
              if(wordId && category.elIdList){
                j = category.elIdList.indexOf(wordId);
              } else {
                j = -1;
              }
              if(j >= 0){
                category.elIdList.splice(j, 1);
              }
            }
       
            let putRequest1 = store.put(category);

            putRequest1.onsuccess = function(event){


            };
          };// end getRequest1.onsuccess

        }

      } // end for 

      tx.oncomplete= function(){
          //Все запросы выполнены успешно, можно закрыть соединение:
        db.close();
        resolve('Все запросы выполнены успешно');
      }
      tx.onabort= function(){
          //Во время транзакции произошла ошибка
        console.log(tx.error.message);
      }
    };// end getRequest.onsuccess  
  });

}

//--------------------------------------------------------------------

 // !!!!   фУНКЦИЯ   !!!!!!!!!  РАБОТА С БАЗОЙ !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 //
 // фУНКЦИЯ получает массив объектов и делает из него выборку
 // от n до m включительно - возвращает массив с выборкой
 // 
 // 

function getSelectionFromArr (arr, n, m){

  let result = [];
  let lengthArr = arr.length;
  if(!arr) return console.log('Нет массива');
  if(n > lengthArr) return result;
  if(m <= 0) return result;
  if(n < 0) n = 0;
  if(m > (lengthArr - 1)) m = lengthArr - 1;

  for(let i = n; i <= m; i++){
    result.push(arr[i]);
  }

    return result;
}




});
