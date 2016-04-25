function removePhrase(phraseToRemove){
  chrome.storage.sync.get({phrases:[]}, function(items) {
    var userPhrases = items.phrases;
    var index = userPhrases.indexOf(phraseToRemove);
    while(index != -1)
    {
      userPhrases.splice(index, 1);
      index = userPhrases.indexOf(phraseToRemove);
    }
    chrome.storage.sync.set({phrases:userPhrases}, function() {});
    restore_phrases();
  })
}

function clear_current_phrases(){
  var phrasesDiv = document.getElementById('phrasesList');
  while (phrasesDiv.firstChild) {
      phrasesDiv.removeChild(phrasesDiv.firstChild);
  }
}

function restore_phrases() {
  clear_current_phrases();  

  chrome.storage.sync.get({
    phrases: []
  }, function(items) {
    for(i = 0;i < items.phrases.length;i++)
    {
      var div = document.createElement('div');
      
      var phrase = document.createElement('input');
      phrase.value = items.phrases[i];
      phrase.disabled = true;
      div.appendChild(phrase);

      // var checkbox_should_reload = document.createElement('input');
      // checkbox_should_reload.type = "checkbox";
      // checkbox_should_reload.value = "Should reload on click";
      // checkbox_should_reload.textContent = "asas"
      // div.appendChild(checkbox_should_reload);

      var removePhraseBtn = document.createElement('button');
      removePhraseBtn.textContent = 'Remove';
      removePhraseBtn.className = 'btn';
      (function(i){
        removePhraseBtn.addEventListener('click', function() {
        removePhrase(items.phrases[i]);
        });
      }(i))
      div.appendChild(removePhraseBtn);

      document.getElementById('phrasesList').appendChild(div);
    }
  });
}

// function isEmpty(str) {
//     return (!str || 0 === str.length);
// }

function add_phrase(){
  var phraseToAddText = document.getElementById('addNewPhraseInput').value;

  // if(isEmpty(phraseToAddText))
  // {
  //   return;
  // }

  chrome.storage.sync.get({phrases:[]}, function(items) {
    var userPhrases = items.phrases;
    //var index = userPhrases.indexOf(phraseToAddText);

    // if(index != -1)
    // {
    //   renderStatus("Phrase you want to add already exists!");
    //   return;
    // }

    userPhrases.push(phraseToAddText);
    chrome.storage.sync.set({phrases:userPhrases}, function() {});
  })
}

// function renderStatus(statusText) {
//     var status = document.getElementById('status');
//     status.textContent = statusText;
//     //setTimeout nie działa!!!
//     setTimeout(function(){
//       status.textContent = '';
//     }, 1250);
// }


document.addEventListener('DOMContentLoaded', function() {
  restore_phrases();
  document.getElementById("addNewPhraseButton").addEventListener('click', add_phrase);
  // document.getElementById("addNewPhraseButton").addEventListener('click',save_options);
});