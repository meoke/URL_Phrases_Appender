function removePhrase(phraseToRemove) {
  chrome.storage.sync.get({ phrases: [], reloadsSettings: [] }, function (items) {
    var userPhrases = items.phrases;
    var index = userPhrases.indexOf(phraseToRemove);
    while (index != -1) {
      userPhrases.splice(index, 1);
      var userReloadsSettings = items.reloadsSettings;
      userReloadsSettings.splice(index, 1);
      index = userPhrases.indexOf(phraseToRemove);
    }
    chrome.storage.sync.set({ phrases: userPhrases, reloadsSettings: userReloadsSettings}, function () { });
    restore_phrases();
  })
}

function clear_current_phrases() {
  var phrasesDiv = document.getElementById('phrasesList');
  while (phrasesDiv.firstChild) {
    phrasesDiv.removeChild(phrasesDiv.firstChild);
  }
}

function createOptionsTableHead() {
  var tblHead = document.createElement("thead");
  var headRow = document.createElement("tr");
  var colName = document.createElement("td");
  colName.innerHTML = "Phrase";
  headRow.appendChild(colName);
  var colRemoveBtn = document.createElement("td");
  colRemoveBtn.innerHTML = "";
  headRow.appendChild(colRemoveBtn);
  var colReloadCheckbox = document.createElement("td");
  colReloadCheckbox.innerHTML = "Auto-reload";
  headRow.appendChild(colReloadCheckbox);
  tblHead.appendChild(headRow);
  return tblHead;
}

function createCellWithString(stringName) {
  var cellString = document.createElement("td");
  var phrase = document.createElement('input');
  phrase.value = stringName;
  phrase.disabled = true;
  cellString.appendChild(phrase);
  return cellString;
}

function createCellWithRemoveBtn(phraseName) {
  var cellRemoveButton = document.createElement("td");
  var removePhraseBtn = document.createElement('button');
  removePhraseBtn.textContent = 'Remove';
  removePhraseBtn.className = 'btn';
  removePhraseBtn.addEventListener('click', function () {
    removePhrase(phraseName);
  })
  cellRemoveButton.appendChild(removePhraseBtn);
  return cellRemoveButton;
}

function changeReloadsSettings(phraseName) {
  chrome.storage.sync.get({ phrases: [], reloadsSettings: [] }, function (items) {
    var userPhrases = items.phrases;
    var index = userPhrases.indexOf(phraseName);

    if (index == -1) {
      return;
    }

    var userReloadsSettings = items.reloadsSettings;
    var currentSetting = userReloadsSettings[index];
    userReloadsSettings[index] = !currentSetting;
    
    chrome.storage.sync.set({ phrases: userPhrases, reloadsSettings: userReloadsSettings }, function () { });
      location.reload();
  })
}

function createCellWithReloadCheckbox(phraseName, reloadSettingValue) {
  var cellReloadCheckbox = document.createElement("td");
  var reloadCheckbox = document.createElement('input');
  reloadCheckbox.type = "checkbox";
  reloadCheckbox.addEventListener('click', function () {
    changeReloadsSettings(phraseName);
  })
  reloadSettingValue ? reloadCheckbox.checked = true : reloadCheckbox.checked = false;
  cellReloadCheckbox.className = "tdcenter"; 
  cellReloadCheckbox.appendChild(reloadCheckbox);
  return cellReloadCheckbox;
}

function createOptionsTableBody(userPhrases, userReloadsSettings) {
  var tblBody = document.createElement("tbody");

  for (i = 0; i < userPhrases.length; i++) {
    var row = document.createElement("tr");

    row.appendChild(createCellWithString(userPhrases[i]));
    row.appendChild(createCellWithRemoveBtn(userPhrases[i]));
    row.appendChild(createCellWithReloadCheckbox(userPhrases[i], userReloadsSettings[i]));

    tblBody.appendChild(row);
  }
  return tblBody;
}

function restore_phrases() {
  clear_current_phrases();

  chrome.storage.sync.get({
    phrases: [], reloadsSettings: []
  }, function (items) {
    var tbl = document.createElement("table");
    tbl.appendChild(createOptionsTableHead());
    tbl.appendChild(createOptionsTableBody(items.phrases, items.reloadsSettings));
    document.getElementById('phrasesList').appendChild(tbl);
  });

}

function isEmpty(str) {
  return (!str || 0 === str.trim().length);
}

function add_phrase() {
  clearStatus()
  var phraseToAddText = document.getElementById('addNewPhraseInput').value;

  if (isEmpty(phraseToAddText)) {
    return;
  }

  chrome.storage.sync.get({ phrases: [], reloadsSettings: [] }, function (items) {
    var userPhrases = items.phrases;
    var index = userPhrases.indexOf(phraseToAddText);

    if (index != -1) {
      renderStatus("Phrase you want to add already exists!");
      return;
    }

    var userReloadsSettings = items.reloadsSettings;
    userPhrases.push(phraseToAddText);
    userReloadsSettings.push(false);
    
    chrome.storage.sync.set({ phrases: userPhrases, reloadsSettings: userReloadsSettings }, function () { });
      location.reload();
  })

}

function clearStatus() {
  var status = document.getElementById('status');
  status.textContent = '';
}

function renderStatus(statusText) {
  var status = document.getElementById('status');
  status.innerText = statusText;
  //status.textContent = statusText;
  setTimeout(function () {
    clearStatus();
  }, 2500);
}

document.addEventListener('DOMContentLoaded', function () {
  restore_phrases();
  document.getElementById("addNewPhraseButton").addEventListener('click', add_phrase);
});