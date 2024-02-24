const href = window.location.href
const fileName = href.substring(href.lastIndexOf("/") + 1)
const noteIndex = +fileName.split(".")[0]
const path = href.split(`${noteIndex}.html`)[0]
let selectedTheme = 2
const themes = ["note_light", "note_dark", "note_pink"]
const mainEle = document.querySelector(".note_main")
const menuEle = document.querySelector("#menu")
const themeEle = document.querySelector("#theme");
const bar = document.querySelector(".note_bar");
(function () {
const offset = document.querySelector(".note_main_body").offsetTop
    function getSections() {
        return document.querySelectorAll(".note_subtitle")
    }
    function initMenu() {
        const sections = getSections()
        for (let i = 0; i < sections.length; i++) {
            const content = sections[i].textContent
            const id = content.replaceAll(" ", "")
            sections[i].id = id
            sections[i].addEventListener("click", () => {
                navigator.clipboard.writeText(href + "#" + sections[i].id)
            })
            const sect = document.createElement("div")
            sect.classList.add("note_section")
            sect.innerText = content
            sect.addEventListener("click", () => {
                scrollToAnElement(id)
            })
            menuEle.appendChild(sect)
        }
    }
    function scrollToTop() {
        mainEle.scrollTo({ left: 0, top: 0, behavior: 'smooth' })
        window.scrollTo({ left: 0, top: 0, behavior: 'smooth' })
    }
    function scrollToAnElement(id) {
        mainEle.scrollTo(
            {
                top: document.getElementById(id).offsetTop + offset, //修正偏差
                behavior: "smooth"
            }
        )
        window.scrollTo({ left: 0, top: 0, behavior: 'smooth' })
    }
    function lastNote() {
        window.location.href = path + (noteIndex - 1) + ".html"
    }
    function nextNote() {
        window.location.href = path + (noteIndex + 1) + ".html"
    }
    function switchTheme() {
        selectedTheme = selectedTheme === 0 ? (themes.length - 1) : selectedTheme - 1
        document.documentElement.className = themes[selectedTheme]
        themeEle.href = selectedTheme === 1 ? "../css/atom-one-dark.min.css" : "../css/atom-one-light.min.css"
    }
    initMenu()
    const classNames = ["last", "next", "switch_theme", "btt"]
    for (let i = 0; i < classNames.length; i++) {
        const clsName = classNames[i];
        const btns = document.querySelectorAll(".note_" + clsName)
        for (let j = 0; j < btns.length; j++) {
            const btn = btns[j];
            btn.addEventListener("click", [lastNote, nextNote, switchTheme, scrollToTop][i])
        }
    }


    const codeblocks = document.querySelectorAll("code")
    for (let i = 0; i < codeblocks.length; i++) {
        const ele = codeblocks[i];
        ele.addEventListener("click", () => {
            navigator.clipboard.writeText(ele.innerText)
        })
    }

    const icons = document.querySelectorAll("i.note_icon")
    for (let i = 0; i < icons.length; i++) {
        const ele = icons[i];
        ele.innerHTML = "&nbsp;&nbsp;&nbsp;"
    }
    mainEle.addEventListener("scroll", () => {
        const st = mainEle.scrollTop
        bar.style.opacity = +(st > offset)
    })
})()
