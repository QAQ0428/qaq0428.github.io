let href = window.location.href;
let fileName = href.substring(href.lastIndexOf("/") + 1);
let noteIndex = +fileName.split(".")[0];
let path = href.split(`${noteIndex}.html`)[0];
let selectedTheme = 2;
const themes = ["note_light", "note_dark", "note_pink"];
function e(id) {
    return document.getElementById(id);
}
function lastNote() {
    window.location.href = path + (noteIndex - 1) + ".html";
}
function nextNote() {
    window.location.href = path + (noteIndex + 1) + ".html";
}
function switchTheme() {
    selectedTheme = selectedTheme == 0 ? (themes.length - 1) : selectedTheme - 1;
    document.documentElement.className = themes[selectedTheme];
    e("theme").href = selectedTheme == 1 ? "../css/atom-one-dark.min.css" : "../css/atom-one-light.min.css";
}
function getSections() {
    return document.getElementsByClassName("note_subtitle");
}
function scrollToAnElement(id) {
    e("main").scrollTo(
            {
                top: e(id).offsetTop + 74, //修正偏差
                behavior: "smooth"
        }
    )
}
function initMenu() {
    const sections = getSections();
    for (let i = 0; i < sections.length; i++) {
        const subtitle = sections[i].textContent;
        const id = subtitle.replaceAll(" ", "")
        sections[i].id = id;
        let section = `
            <div class="note_section" onclick="
                scrollToAnElement('${id}')
            ">
                ${subtitle}
            </div>`;
        e("menu").insertAdjacentHTML("beforeend", section);
    }
}
function scrollToTop() {
    e('main').scrollTo({ left: 0, top: 0, behavior: 'smooth' });
}