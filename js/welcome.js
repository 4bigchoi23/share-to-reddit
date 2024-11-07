// Add version number to welcome page
window.addEventListener('DOMContentLoaded', function(){
  document.querySelector('.version').innerHTML = chrome.runtime.getManifest().version;
})