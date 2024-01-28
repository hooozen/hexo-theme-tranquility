const searchBtn = document.querySelector("#search-btn")
const searchIpt = document.querySelector("#search-input")
const searchResult = document.querySelector("#search-result")
const searchClearBtn = document.querySelector("#search-clear")

const searchMask = document.querySelector("#search-mask")

let searchStatus = 0

function showSearchDialog() {
  if (searchStatus) return
  searchMask.style.display = 'block'
  document.body.style.overflow = 'hidden'
  searchIpt.focus()
  searchStatus = 1
}

function closeSearchDialog() {
  if (!searchStatus) return
  searchMask.style.display = 'None'
  document.body.style.overflow = 'inherit'
  searchIpt.value = ""
  searchStatus = 0
}

function searchInitialize(url) {
  fetch(url).then(res => res.json()).then(res => {
    const inputHandler = debounce(doSearch)

    searchBtn.style.display = "flex"

    document.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && e.key == "k") {
        if (searchStatus) closeSearchDialog()
        else showSearchDialog()
      }
      if (e.key == 'Escape') closeSearchDialog()
    })

    searchClearBtn.addEventListener('click', () => {
      searchIpt.value = ""
      clearResult()
    })

    searchBtn.addEventListener('click', () => {
      showSearchDialog()
    })

    searchMask.addEventListener('click', e => {
      if (e.target !== searchMask) return
      closeSearchDialog()
    }, true)

    searchIpt.addEventListener('input', inputHandler.bind(searchIpt, res))
  })
}

function clearResult() {
  searchResult.innerHTML = ''
}

function doSearch(data) {
  if (this.value.trim().length <= 0) return clearResult()

  var keywords = this.value.trim().toLowerCase().split(/[\s\-]+/);

  const result = search(data, keywords)

  renderSearchResult(result, searchResult)
}

function search(data, keywords) {
  const matchedPost = []

  data
    .filter(post => post.content)
    .forEach(post => {
      let postTitle = post.title && post.title.trim()
      postTitle = (postTitle && postTitle.length > 0) ? postTitle : "Untitled"

      const postContent = post.content.trim().replace(/<[^>]+>/g, "")

      const matchedContentIdices = []

      keywords.forEach((keyword, i) => {
        const index_title = postTitle.toLowerCase().indexOf(keyword);
        const index_content = postContent.toLowerCase().indexOf(keyword);

        if (index_title < 0 && index_content < 0) return

        matchedContentIdices.push(Math.max(index_content, 0))
      });

      if (matchedContentIdices.length) matchedPost.push({
        url: post.url,
        content: trimeContent(matchedContentIdices, postContent, keywords),
        title: postTitle
      })
    });

  return matchedPost
}

function renderSearchResult(result, el) {
  el.innerHTML = ''

  if (!result || result.length <= 0) {
    el.innerHTML = '<div class="search-result-empty">无结果</div>'
  }

  const list = document.createDocumentFragment()
  result.forEach(res => {
    const item = document.createElement('a')
    item.className = 'search-result-item'
    item.href = res.url

    const title = document.createElement('DIV')
    title.className = 'search-result__head'
    title.innerText = res.title

    const content = document.createElement('DIV')
    content.className = 'search-result__body'
    res.content.forEach(contentText => {
      const contentItem = document.createElement('DIV')
      contentItem.innerHTML = contentText
      content.appendChild(contentItem)
    })

    item.append(title, content)
    list.append(item)
  })

  el.appendChild(list)
}

function trimeContent(keyIndexs, content, keywords, wordLen = 20) {
  const reg = /[\u4e00-\u9fa5]|\w+/gd
  const splitIndex = []
  let arr
  while ((arr = reg.exec(content)) !== null)
    splitIndex.push(arr.indices[0])

  return keyIndexs.map(key => {
    let pos = binaryFind(splitIndex, key)
    const wordStart = Math.max(0, pos - 10)
    const wordEnd = Math.min(wordLen + wordStart, splitIndex.length - 1)
    const start = splitIndex[wordStart][0]
    const end = splitIndex[wordEnd][1]

    keywords.forEach(keyword => {
      content = content
        .slice(start, end)
        .replace(new RegExp(keyword, 'ig'),
          `<span class="search-keyword">${keyword}</span>`)
    })

    return content
  })
}

function binaryFind(arr, value) {
  let i = 0, j = arr.length - 1, mid = j
  while (i <= j) {
    if (value < arr[mid][0]) j = mid - 1;
    else if (value > arr[mid][1]) i = mid + 1
    else return mid
    mid = Math.floor((i + j) / 2)
  }
  return mid
}

function debounce(fn, t = 400) {
  let timer = null
  return function (...args) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.call(this, ...args)
    }, t)
  }
}