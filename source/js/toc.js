const tocEl = document.querySelector('#toc')
const contentEl = document.querySelector('#postBody')

window.addEventListener('scroll', adjustToc)
window.addEventListener('resize', adjustToc)
window.addEventListener('resize', updateData)
window.addEventListener('load', updateData)


let tocOffsetTop = getOffsetTop(tocEl)
let articleHeight = contentEl.offsetHeight;
let tocHeight = tocEl.offsetHeight;

let breakPoint1 = tocOffsetTop
let breakPoint2 = articleHeight + tocOffsetTop - tocHeight

function updateData() {
  tocOffsetTop = getOffsetTop(tocEl)
  articleHeight = contentEl.offsetHeight;
  tocHeight = tocEl.offsetHeight;

  breakPoint1 = tocOffsetTop
  breakPoint2 = articleHeight + tocOffsetTop - tocHeight
}

function getOffsetTop(el) {
  let offsetTop = 0
  while (el != null) {
    offsetTop += el.offsetTop
    el = el.offsetParent
  }
  return offsetTop
}


function adjustToc() {
  if (window.scrollY < breakPoint1) {
    tocEl.className = 'post-toc'
    tocEl.style.top = '0'
  } else if (window.scrollY < breakPoint2) {
    tocEl.className = 'post-toc--attached'
    tocEl.style.top = '0'
  } else {
    tocEl.className = 'post-toc--bottom'
    tocEl.style.top = articleHeight - tocHeight + 'px'
  }
}