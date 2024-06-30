
// !function () {
    const href = window.location.href
    const themeEle = document.querySelector("#theme") || {}
    const fileName = href.substring(href.lastIndexOf("/") + 1)
    const noteIndex = +fileName.split(".")[0]
    const themes = ["note_light", "note_dark", "note_pink"]
    let selectedTheme = +(localStorage.getItem("selectedNoteTheme") || 2)
    const mainEle = document.querySelector(".note_main")
    const menuEle = document.querySelector(".note_menu")
    const bar = document.querySelector(".note_bar")
    const nextUrl = (noteIndex + 1) + ".html";
    const xhr = new XMLHttpRequest()
    setTheme(selectedTheme)
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            const nextbtns = document.querySelectorAll(".note_next")
            if (xhr.status === 404) {
                nextbtns.forEach(btn => btn.addEventListener("click", () => alert("没有下一篇啦!")))

            } else {
                nextbtns.forEach(btn => btn.addEventListener("click", () => { window.location.href = nextUrl }))
            }
        }
    }

    xhr.open("GET", nextUrl, true)
    xhr.send()
    const offset = document.querySelector(".note_main_body").offsetTop
    
    function level(titleElement) {
        return +titleElement.tagName[1]
    }
    function scrollToTop() {
        mainEle.scrollTo({ left: 0, top: 0, behavior: 'smooth' })
    }
    function scrollToAnElement(id) {
        mainEle.scrollTo(
            {
                top: document.getElementById(id).offsetTop + offset,
                behavior: "smooth"
            }
        )
        window.scrollTo({ left: 0, top: 0, behavior: 'smooth' })
    }
    const lastNote = (function () {
        if (noteIndex === 0) {
            return () => alert("没有上一篇啦!")
        } else {
            return () => window.location.href = (noteIndex - 1) + ".html"
        }
    })()
    function setTheme(index) {
        document.documentElement.setAttribute("class", themes[index])
        themeEle.href = index === 1 ? "/css/atom-one-dark.min.css" :  "/css/atom-one-light.min.css"
    }
    function switchTheme() {
        selectedTheme = selectedTheme === 0 ? (themes.length - 1) : selectedTheme - 1
        localStorage.setItem("selectedNoteTheme", selectedTheme)
        setTheme(selectedTheme)
    }
    function processElements(selecter, func) {
        document.querySelectorAll(selecter).forEach(func)
    }
    
    /**
    * @param {HTMLElement} subtitle 
    * @returns {Array} 返回subtitle下的所有标题
    */
    function getSubtitlesFrom(subtitle) {
        let result = []
        const selfLevel = level(subtitle)
        for (let next = subtitle.nextElementSibling; next; next = next.nextElementSibling) {
            const nextLevel = level(next)
            if (next.classList.contains("note_subtitle")) {
                if (nextLevel === selfLevel) {
                    // 遇到同级的, 返回
                    return result
                }
                if (nextLevel === selfLevel + 1) {
                    result.push(next)
                }
            }
        }
        return result
    }
    
    /**
     * @param {string} id 所指向的页面中的子标题的id
     * @returns 一个.note_section元素
     */
    function createMenuElement(id) {
        const refer = document.getElementById(id)
        const result = document.createElement("details")
        const inner = document.createElement("summary")
        const sub = getSubtitlesFrom(refer)
        const levelOfTitle = level(refer)
        inner.innerText = refer.innerText
        inner.classList.add("note_section")
        result.appendChild(inner)
        result.style.paddingLeft = levelOfTitle / 2 + "rem"
        result.style.fontSize = 20 - 1.5 * levelOfTitle + "px"
        inner.dataset.refer = id
        inner.addEventListener("click", () => scrollToAnElement(refer.id))
        if (sub.length === 0) {
            inner.style.paddingLeft = "1em"
            inner.classList.add("no_marker")
        } else {
            // inner.style.marginLeft = "-1em"
            sub.forEach(element => result.appendChild(createMenuElement(element.id)))
        }
        return result
    }
    
    const processes = {
        ".note_last": element => element.addEventListener("click", lastNote),
        ".note_switch_theme": element => element.addEventListener("click", switchTheme),
        ".note_btt": element => element.addEventListener("click", scrollToTop),
        "code": element => element.addEventListener("click", () => navigator.clipboard.writeText(element.innerText)),
        "i.note_icon": element => {
            element.innerHTML = "&nbsp;&nbsp;&nbsp;"
            element.style.backgroundImage = `url(${element.dataset["emojiurl"]})`
        },
        ".note_subtitle": element => {
            element.id = element.innerText.replaceAll(" ", "")
            element.addEventListener("click", function() {
                navigator.clipboard.writeText(encodeURI(href + "#" + this.id))
            })
        }
    }
    for (const key in processes) {
        if (Object.hasOwnProperty.call(processes, key)) {
            processElements(key, processes[key])
        }
    }
    function initMenu() {
        const subtitles = document.querySelectorAll("h2.note_subtitle")
        subtitles.forEach(element => {
            menuEle.appendChild(createMenuElement(element.id))
        })
    }
    initMenu()
    mainEle.addEventListener("scroll", () => {
        const st = mainEle.scrollTop
        bar.style.opacity = +(st > offset)
    })

// }()