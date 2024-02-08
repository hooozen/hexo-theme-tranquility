HTMLElement.prototype.wrap = function (wrapper) {
  this.parentNode.insertBefore(wrapper, this);
  this.parentNode.removeChild(this);
  wrapper.appendChild(this);
}

const figures = document.querySelectorAll('figure.highlight')

figures.forEach((element) => {
  let container = element.querySelector('.code-container')
  if (!container) {
    const table = element.querySelector('table') || element
    container = document.createElement('div')
    container.className = 'code-container'
    table.wrap(container)
  }
  let target = container
  target.insertAdjacentHTML('afterbegin', '<div class="copy-btn" style="position:absolute; top:4px; right:4px;"><i class="fa fa-copy fa-fw"></i></div>')

  const button = target.querySelector('.copy-btn')
  button.addEventListener('click', () => {
    const lines = target.querySelector('.code') || target.querySelector('code');
    const code = lines.innerText;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).then(
        () => { button.querySelector('i').className = 'fa fa-check-circle fa-fw' },
        () => { button.querySelector('i').className = 'fa fa-times-circle fa-fw' }
      )
    } else {
      const textarea = document.createElement('textarea')
      textarea.style.top = window.scrollY + 'px'
      textarea.style.position = 'absolute'
      textarea.style.opacity = '0'
      textarea.readOnly = true
      textarea.value = code
      document.body.append(textarea)

      textarea.select()
      textarea.setSelectionRange(0, code.length)

      const result = document.execCommand('copy')
      button.querySelector('i').className = (result) ? 'fa fa-check-circle fa-fw' : 'fa fa-times-circle fa-fw'
      textarea.blur()
      button.blur()

      document.body.removeChild(textarea)
    }
  })

  target.addEventListener('mouseleave', () => {
    setTimeout(() => {
      button.querySelector('i').className = 'fa fa-copy fa-fw';
    }, 300)
  })
})
