function setHeaderHeight() {
    const header = document.querySelector('header');
    const root = document.documentElement;
    if (header) {
        root.style.setProperty('--header-height', `${header.offsetHeight}px`);
    }
}
window.addEventListener('load', setHeaderHeight);
window.addEventListener('resize', setHeaderHeight);
