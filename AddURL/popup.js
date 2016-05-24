function addURL(textToAdd) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var currentURL = tabs[0].url;
    chrome.tabs.update(tabs[0].id, { url: currentURL + textToAdd });
  });

}

function createButtons() {
  chrome.storage.sync.get({
    phrases: []
  }, function (items) {
    for (i = 0; i < items.phrases.length; i++) {

      var phraseBtn = document.createElement('button');
      phraseBtn.textContent = items.phrases[i];
      phraseBtn.className = "btn";

      (function (i) {
        phraseBtn.addEventListener('click', function () {
          addURL(items.phrases[i]);
        });
      } (i))
      document.getElementById("phrases").appendChild(phraseBtn);
    }
  });
}

function goToOptionsPage() {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL('options.html'));
  }
}

document.addEventListener('DOMContentLoaded', function () {
  createButtons();
  document.getElementById("go_to_options_page").addEventListener('click', goToOptionsPage);
});

