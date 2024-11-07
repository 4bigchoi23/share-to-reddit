// Function to generate URL
function getFinalURL(reddit, link, text, body) {
  var url = ''
  url = 'https://www.reddit.com/' + reddit + '/submit/?type=LINK&title=' + encodeURIComponent(text + (body ? ` - ${body}` : ``)) + '&url=' + encodeURIComponent(link)
  // url = 'https://www.reddit.com/' + reddit + '/submit/?type=' + (body ? 'TEXT' : 'LINK') + '&title=' + encodeURIComponent(text) + '&url=' + encodeURIComponent(link) + (body ? '&body=' + encodeURIComponent(`${body} ${link}`) : '')
  return url
}

// Function to initialize UI and redirects
async function init() {
  // Generate links to options page
  document.querySelectorAll('.extension-settings-link').forEach(function(el) {
    el.addEventListener('click', function() {
      chrome.runtime.openOptionsPage()
      window.close()
    })
    return
  })
  // Get data from URL and storage
  var inputParams = new URL((window.location.href)).searchParams
  var shareLink = inputParams.get('link')
  var shareText = inputParams.get('text')
  var shareBody = inputParams.get('body')
  var data = await chrome.storage.sync.get()
  // Show warning if no servers are saved
  if ((!data.serverList) || (data.serverList.length === 0)) {
    document.querySelector('#server-warning').classList.remove('d-none')
    return false
  }
  // If there's only one server, or if the server was picked from the context menu, redirect to that one
  if (inputParams.get('server') != 'generic') {
    document.querySelector('#server-loading').classList.remove('d-none')
    window.location = getFinalURL(inputParams.get('server'), shareLink, shareText, shareBody)
    return false
  } else if (data.serverList.length === 1) {
    document.querySelector('#server-loading').classList.remove('d-none')
    window.location = getFinalURL(data.serverList[0], shareLink, shareText, shareBody)
    return false
  }
  console.log(inputParams.get('server'))
  // Create list of servers
  var serverListEl = document.querySelector('#server-list')
  for (server in data.serverList) {
    // Create link list element
    var serverUrl = data.serverList[server]
    var linkEl = document.createElement('a')
    linkEl.classList.add('list-group-item', 'list-group-item', 'list-group-item-action')
    linkEl.innerText = serverUrl
    linkEl.href = getFinalURL(serverUrl, shareLink, shareText, shareBody)
    linkEl.rel = 'preconnect'
    // Add server icon to list
    // var serverImg = document.createElement('img')
    // var src = chrome.runtime.getURL('img/x.svg')
    // switch (true) {
    //   case serverUrl.indexOf('r/') === 0:
    //     var src = chrome.runtime.getURL('img/r.svg')
    //     break;
    //   case serverUrl.indexOf('u/') === 0:
    //     var src = chrome.runtime.getURL('img/u.svg')
    //     break;
    // }
    // serverImg.setAttribute('src', src)
    // serverImg.setAttribute('alt', serverUrl + ' icon')
    // serverImg.ariaHidden = 'true'
    var serverImg = document.createElement('span');
    serverImg.innerHTML = `<svg fill="currentColor" width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve"><g><path d="M16,16.1c-0.9,0-9.1-0.1-9.1-3.3C6.9,8,11,4,16,4s9.1,4,9.1,8.9C25.1,16,16.9,16.1,16,16.1z"/></g><path d="M27,11.6c0.1,0.4,0.1,0.9,0.1,1.3c0,4.7-7.7,5.3-11.1,5.3S4.9,17.6,4.9,12.9c0-0.4,0-0.9,0.1-1.3C1.8,13,0,15,0,17.3 C0,21.6,7,25,16,25s16-3.4,16-7.8C32,15,30.2,13,27,11.6z M18,22h-4c-0.6,0-1-0.4-1-1s0.4-1,1-1h4c0.6,0,1,0.4,1,1S18.6,22,18,22z" /></svg>`;
    switch (true) {
      case serverUrl.indexOf('r/') === 0:
        serverImg.innerHTML = `<svg rpl="" fill="currentColor" width="32" height="32" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0ZM8.016 8.633a1.616 1.616 0 0 0-.2.806V13.5H5.931V6.172h1.8v.9h.039a3.009 3.009 0 0 1 1.018-.732 3.45 3.45 0 0 1 1.449-.284c.246-.003.491.02.732.068.158.024.309.08.444.164l-.759 1.832a2.09 2.09 0 0 0-1.093-.26c-.33-.01-.658.062-.954.208a1.422 1.422 0 0 0-.591.565Zm2.9 6.918H9.355L14.7 2.633c.426.272.828.58 1.2.922l-4.984 11.996Z"></path></svg>`;
        break;
      case serverUrl.indexOf('u/') === 0:
        serverImg.innerHTML = `<svg fill="currentColor" width="32" height="32" viewBox="0 0 24 24" role="img" xmlns="http://www.w3.org/2000/svg"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/></svg>`;
        break;
    }
    linkEl.prepend(serverImg)
    // Inject element
    serverListEl.appendChild(linkEl)
  }
  // Show list
  serverListEl.classList.remove('d-none')
}

// Show loading animation when a link is clicked
window.addEventListener('beforeunload', function() {
  document.querySelector('#server-list').classList.add('d-none')
  document.querySelector('#server-loading').classList.remove('d-none')
})

window.addEventListener('DOMContentLoaded', function(){
  init()
})