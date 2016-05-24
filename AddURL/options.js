function removePhrase(phraseToRemove) {
  chrome.storage.sync.get({ phrases: []}, function (items) {
    var userPhrases = items.phrases;
    var index = userPhrases.indexOf(phraseToRemove);
    while (index != -1) {
      userPhrases.splice(index, 1);
      index = userPhrases.indexOf(phraseToRemove);
    }
    chrome.storage.sync.set({ phrases: userPhrases}, function () { });
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
  tblHead.appendChild(headRow);
  return tblHead;
}

function createTextTableCell(text) {
  var cellString = document.createElement("td");
  var phrase = document.createElement('input');
  phrase.value = text;
  phrase.disabled = true;
  cellString.appendChild(phrase);
  return cellString;
}

function createTableCellWithRemoveBtn(phraseName) {
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

function createOptionsTableBody(userPhrases) {
  var tblBody = document.createElement("tbody");

  for (i = 0; i < userPhrases.length; i++) {
    var row = document.createElement("tr");

    row.appendChild(createTextTableCell(userPhrases[i]));
    row.appendChild(createTableCellWithRemoveBtn(userPhrases[i]));

    tblBody.appendChild(row);
  }
  return tblBody;
}

function restore_phrases() {
  clear_current_phrases();

  chrome.storage.sync.get({
    phrases: []
  }, function (items) {
    var settingsTable = document.createElement("table");
    settingsTable.appendChild(createOptionsTableHead());
    settingsTable.appendChild(createOptionsTableBody(items.phrases));
    document.getElementById('phrasesList').appendChild(settingsTable);
  });

}

function isEmpty(str) {
  return (!str || 0 === str.trim().length);
}

function addPhraseToStorage() {
  clearElement("status")
  var phraseToAddText = document.getElementById('addNewPhraseInput').value;

  if (isEmpty(phraseToAddText)) {
    return;
  }

  chrome.storage.sync.get({ phrases: []}, function (items) {
    var userPhrases = items.phrases;
    var index = userPhrases.indexOf(phraseToAddText);

    if (index != -1) {
      showMessage("Phrase you want to add already exists!", "status");
      return;
    }

    userPhrases.push(phraseToAddText);
    
    chrome.storage.sync.set({ phrases: userPhrases}, function () { });
      location.reload();
  })

}

function clearElement(elementName) {
  var element = document.getElementById(elementName);
  element.textContent = '';
}

function showMessage(message, elementID) {
  var status = document.getElementById(elementID);
  status.innerText = message;
  setTimeout(function () {
    clearElement();
  }, 2500);
}

document.addEventListener('DOMContentLoaded', function () {
  restore_phrases();
  document.getElementById("addNewPhraseButton").addEventListener('click', addPhraseToStorage);
});