let links = document.getElementsByClassName('footer_mod_item');
for (let i = 0; i < links.length; i++) {
    const link = links[i];
    link.addEventListener('click', () => window.location.href = link.getAttribute('href'))
}