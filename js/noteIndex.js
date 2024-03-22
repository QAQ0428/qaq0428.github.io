class Note {
    title = "Untitled"
    time = ""
    status = 0
    constructor(type, index) {
        this.type = type
        this.index = index
        this.url = `${window.location.origin}/note/${type}/${index}.html`
        allNotes[type][index] = this
    }
    init(callbackfn) {
        const xhr = new XMLHttpRequest()
        xhr.open("GET", this.url)
        xhr.responseType = "document"
        xhr.onreadystatechange = () => {
            this.status = xhr.status
            if (xhr.readyState === 4) {
                if (this.status === 200) {
                    const doc = xhr.response
                    this.title = doc.title
                    this.time = doc.querySelector(".note_time").innerText
                }
                else {
                    let sameType = allNotes[this.type]
                    sameType = sameType.splice(sameType.indexOf(this), 1)
                }
                callbackfn(this)
            }

        }
        xhr.send()
    }
}
const tablist = document.querySelector(".ni_tablist")
const tablistPointer = document.querySelector(".ni_tablist_selected")
const firstItem = document.querySelector(".ni_tablist_item:first-child .ni_tablist_text")
const promptEle = document.querySelector(".ni_prompt")
const main = document.querySelector("main")
const noteList = document.querySelector(".ni_note_list")
const textToNoteType = {
    前端: "web",
    数学: "math",
    Python: "python",
    非技术性的: "non-technical"
}
let allNotes = {
    math: [],
    web: [],
    python: [],
    "non-technical": []
}
let selected = "math"
tablistPointer.style.bottom = firstItem.offsetTop + "px"
tablistPointer.style.left = firstItem.offsetLeft + "px"
let textEle
tablist.addEventListener("mouseenter", function (e) {
    const target = e.target
    if (target.classList.contains("ni_tablist_item")) {
        textEle = target.children[0]
        selected = textToNoteType[textEle.innerText]
        tablistPointer.style.left = textEle.offsetLeft + "px"
        tablistPointer.style.width = textEle.offsetWidth + "px"
        promptEle.innerText = `总共有${allNotes[selected].length}篇`
    }

    renderNotes(selected)
}, true)
window.addEventListener("resize", () => {
    tablistPointer.style.left = textEle.offsetLeft + "px"
})
function renderNote(note) {
    if (note === "" || note.status === 404) {
        return ""
    }

    return ` <div class="ni_note" onclick="window.open('${note.url}', '_blank')">
    <div class="ni_note_index flex_center_both">
        <div class="flex_center_both">${note.index}</div>
    </div>
    <div class="ni_note_preview">
        <div class="ni_note_title">${note.title}</div>
        <div class="ni_note_time">${note.time}</div>
    </div>
</div>`
}
function renderNotes(type) {
    // noteList.innerHTML = allNotes[type].reduce((a, b) => renderNote(a) + renderNote(b), "")
    let html = ""
    const notes = allNotes[type]
    for (let i = 0; i < notes.length; i++) {
        const note = notes[i];
        html += renderNote(note)
    }
    noteList.innerHTML = html
}
(function () {
    // load notes
    function f(start, type) {
        const note = new Note(type, start)
        note.init((nt) => {
            if (nt.status === 200) {
                f(start + 1, type)
            }
            else {
                return
            }
        })
    }
    for (const key in allNotes) {
        f(0, key)
    }
})()