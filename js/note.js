
!function () {
    const href = window.location.href
    const domian = window.location.origin
    const themeEle = document.querySelector("#theme")
    const fileName = href.substring(href.lastIndexOf("/") + 1)
    const noteIndex = +fileName.split(".")[0]
    const path = href.split(`${noteIndex}.html`)[0]
    const themes = ["note_light", "note_dark", "note_pink"]
    let selectedTheme = 2
    if ((selectedTheme = +localStorage.getItem("selectedNoteTheme")) === void 0) {
        selectedTheme = 2
    }
    setTheme(selectedTheme)
    const mainEle = document.querySelector(".note_main")
    const menuEle = document.querySelector(".note_menu")
    const bar = document.querySelector(".note_bar")
    const nextUrl = path + (noteIndex + 1) + ".html";
    let hasNextNote = true
    const xhr = new XMLHttpRequest()
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 404) {
                hasNextNote = false
            } else {
                hasNextNote = true
            }
        }
    }
    function nextNote() {
        if (hasNextNote) {
            window.location.href = nextUrl
        }
        else {
            alert("没有下一篇啦!")
        }
    }

    xhr.open("GET", nextUrl, true)
    xhr.send()
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
                navigator.clipboard.writeText(encodeURI(href + "#" + sections[i].id))
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
        if (noteIndex == 0) {
            alert("没有上一篇了!")
        }
        else {
            window.location.href = path + (noteIndex - 1) + ".html"
        }
    }
    function setTheme(index) {
        document.documentElement.setAttribute("class", themes[index])
        themeEle.href = index === 1 ? (domian + "/css/atom-one-dark.min.css") : (domian + "/css/atom-one-light.min.css")
    }
    function switchTheme() {
        selectedTheme = selectedTheme === 0 ? (themes.length - 1) : selectedTheme - 1
        localStorage.setItem("selectedNoteTheme", selectedTheme)
        console.log(selectedTheme, localStorage.getItem("selectedNoteTheme"));
        setTheme(selectedTheme)
    }
    function processElements(selecter, func) {
        const elements = document.querySelectorAll(selecter)
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            func(element)
        }
    }
    initMenu()
    const processes = {
        ".note_last": (element) => element.addEventListener("click", lastNote),
        ".note_next": (element) => element.addEventListener("click", nextNote),
        ".note_switch_theme": (element) => element.addEventListener("click", switchTheme),
        ".note_btt": (element) => element.addEventListener("click", scrollToTop),
        "code": (element) => element.addEventListener("click", () => navigator.clipboard.writeText(element.innerText)),
        "i.note_icon": (element) => {
            element.innerHTML = "&nbsp;&nbsp;&nbsp;"
            element.style.backgroundImage = `url(${element.dataset["emojiurl"]})`
        }
    }
    for (const key in processes) {
        if (Object.hasOwnProperty.call(processes, key)) {
            processElements(key, processes[key])
        }
    }

    mainEle.addEventListener("scroll", () => {
        const st = mainEle.scrollTop
        bar.style.opacity = +(st > offset)
    })

}()