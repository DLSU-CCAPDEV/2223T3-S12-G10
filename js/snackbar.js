function snackbar(sb) {
    if (document.getElementById('snackbar-container') == null) {
        let sb_container = document.createElement("div");
        sb_container.setAttribute("id", "snackbar-container");
        document.querySelector("body").appendChild(sb_container);
    }

    let snackbar_el = document.createElement("div");
    snackbar_el.classList.add("snackbar");
    snackbar_el.innerText = sb.text;

    switch (sb.status) {
        case 'error':
            snackbar_el.classList.add("sb-error");
            break;
        default:
            snackbar_el.classList.add("sb-primary");
            break;
    }

    document.getElementById('snackbar-container').appendChild(snackbar_el);

    setTimeout(() => {
        snackbar_el.classList.add("sb-out");
    }, 4000);

    setTimeout(() => {
        snackbar_el.remove();
    }, 4300);
}