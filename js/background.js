const isFirefox = chrome.runtime.getURL('').startsWith('moz-extension://')

// Initialize welcome message and context menu entry on extension load
chrome.runtime.onInstalled.addListener(function (details) {
  // Show welcome message
  if (details.reason === 'install' || details.reason === 'update') {
    // chrome.tabs.create({ 'url': chrome.runtime.getURL('welcome.html') });
  };
  // Initialize context menu
  createContextMenu()
})

// Function for creating context menu entries
async function createContextMenu() {
  // Remove existing entries if they exist
  await chrome.contextMenus.removeAll()
  // Create a menu entry for each saved server
  var data = await chrome.storage.sync.get()
  if ((!data.serverList) || (data.serverList.length === 0)) {
    // Create generic menu item because no servers are set yet
    chrome.contextMenus.create({
      id: "generic",
      title: 'Share to Reddit',
      contexts: ['selection', 'link', 'page']
    })
  } else {
    // Create menu item for each saved server
    for (server in data.serverList) {
      var serverUrl = data.serverList[server]
      chrome.contextMenus.create({
        id: serverUrl,
        title: 'Share to ' + serverUrl,
        contexts: ['selection', 'link', 'page']
      })
    }
    // Add seperator and link to settings, but only if there's more than one server saved
    if (data.serverList.length > 1) {
      chrome.contextMenus.create({
        id: 'none',
        type: 'separator',
        contexts: ['selection', 'link', 'page']
      })
      chrome.contextMenus.create({
        id: 'edit-servers',
        title: 'Edit server list...',
        contexts: ['selection', 'link', 'page']
      })
    }
  }
}

// Function for handling context menu clicks
chrome.contextMenus.onClicked.addListener(async function (info, tab) {
  // Open settings page if requested
  if (info.menuItemId === 'edit-servers') {
    chrome.runtime.openOptionsPage()
    return false
  }
  // Set link and description
  var shareLink = ''
  var shareText = ''
  var shareBody = ''
  if (info.selectionText) {
    shareLink = tab.url
    shareText = tab.title
    shareBody = info.selectionText
  } else {
    shareLink = tab.url
    shareText = tab.title
  }
  // Open popup
  createPopup(info.menuItemId, shareLink, shareText, shareBody, tab)
})

// Reload context menu options on storage change (e.g. when added or removed on settings page)
chrome.storage.onChanged.addListener(function () {
  createContextMenu()
})

// Function for creating share popup
function createPopup(serverUrl, shareLink, shareText, shareBody, tab) {
  var popupPage = chrome.runtime.getURL('share.html') + '?server=' + serverUrl + '&link=' + encodeURIComponent(shareLink) + '&text=' + encodeURIComponent(shareText) + '&body=' + encodeURIComponent(shareBody)
  var popupWidth = 500
  var popupHeight = 500
  var y = Math.round((tab.height / 2) - (popupHeight / 2))
  var x = Math.round((tab.width / 2) - (popupWidth / 2))
  console.log('Popup dimensions:', popupWidth, popupHeight, y, x)
  chrome.windows.create({
    url: popupPage,
    width: popupWidth,
    height: popupHeight,
    left: x,
    top: y,
    type: 'popup'
  })
}

// Function for action button
chrome.action.onClicked.addListener(async function (tab) {
  createPopup('generic', tab.url, tab.title, '', tab)
})