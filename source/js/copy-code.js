const copyText = {
  get copy() {
    return document.documentElement.lang === "en" ? "copy" : "复制代码";
  },
  get copyError() {
    return document.documentElement.lang === "en" ? "error" : "发生错误";
  },
  get copied() {
    return document.documentElement.lang === "en" ? "copied!" : "已复制";
  },
};

document.addEventListener("DOMContentLoaded", () => {
  const getCopyButton = () => {
    const button = document.createElement("div");
    button.innerHTML = copyText.copy;
    button.className = "copy-button";
    return button;
  };

  const codeBlocks = document.querySelectorAll("figure.highlight");

  codeBlocks.forEach((codeBlock) => {
    const copyButton = getCopyButton();
    copyButton.onclick = () => {
      try {
        const code = codeBlock.querySelector("code").innerText;
        navigator.clipboard.writeText(code);
        copyButton.innerText = copyText.copied;
      } catch {
        copyButton.innerText = copyText.copyError;
      } finally {
        setTimeout(() => {
          copyButton.innerText = copyText.copy;
        }, 1000);
      }
    };
    codeBlock.appendChild(copyButton);
  });
});
