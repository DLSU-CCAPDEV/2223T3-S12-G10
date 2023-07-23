function openTabs(evt, tab) {
    var i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("currenttab");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace("currenttab", "tablinks");
    }

    document.getElementById(tab).style.display = "block";
    evt.currentTarget.className.replace("tablinks", "currenttabs");
  }