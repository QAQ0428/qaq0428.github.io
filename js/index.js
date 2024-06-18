import { randint } from "./utils.js"

!function () {
  const bg = document.querySelector(".index_bg")
  const icons = document.querySelectorAll(".index_icon")
  const links = document.querySelectorAll(".index_link")
  bg.style.backgroundImage = `url(/images/bg${randint(1, 9)}.png)`
  icons.forEach(element => {
    element.style.backgroundImage = `url(/images/${element.dataset.icon}.png)`
  })
  links.forEach(element => {
    element.addEventListener("click", function () {
      if (!this.innerText.includes("wechat")) {
        window.open(this.dataset.url, "_blank")
      } else {
        location.href = this.dataset.url
      }
    })
  })
}()
