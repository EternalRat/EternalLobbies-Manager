const { ipcRenderer } = require("electron");
const mySideBar = document.getElementById("mySideBar");
const sideBtns = document.getElementsByClassName("sideBtns")[0];
const homePage = document.getElementsByClassName("homePage")[0];
const ticketPage = document.getElementsByClassName("ticketPage")[0];
const accountPage = document.getElementsByClassName("accountPage")[0];
const ipc = ipcRenderer;
const displayedPage = {
    HOME: 1,
    TICKET: 2,
    ACCOUNT: 3
};
var oldDisplayedPage = displayedPage.HOME;
var isLeftMenuActive = false;

ipc.on("ticket", (evt, args) => {
    ticketPage.innerHTML = args.html;
    if (!args.error) {
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.src = "js/filesManager.js";
        document.body.append(s);
    }
});

/**
 *
 * @param {?} e
 */
function preview(e) {
	index = Number(e.target.dataset.index);
	ipc.send("previewHTMLFiles", index);
}

minimizeBtn.addEventListener('click', () => {
    ipc.send('minimizeApp');
});

closeBtn.addEventListener('click', () => {
    ipc.send('closeApp');
});

showHideMenu.addEventListener('click', () => {
    if (isLeftMenuActive) {
        mySideBar.style.width = '0px';
        isLeftMenuActive = false;
        sideBtns.style.visibility = 'hidden';
    } else {
        mySideBar.style.width = '280px';
        isLeftMenuActive = true;
        sideBtns.style.visibility = 'visible';
    }
});

homeBtn.addEventListener('click', () => {
    mySideBar.style.width = '0px';
    isLeftMenuActive = false;
    sideBtns.style.visibility = 'hidden';
    if (oldDisplayedPage !== displayedPage.HOME)
        removeElem();
    homePage.style.visibility = 'visible';
    ticketPage.style.visibility = 'hidden';
    accountPage.style.visibility = 'hidden';
    oldDisplayedPage = displayedPage.HOME;
});

ticketBtn.addEventListener('click', () => {
    mySideBar.style.width = '0px';
    isLeftMenuActive = false;
    sideBtns.style.visibility = 'hidden';
    if (oldDisplayedPage !== displayedPage.HOME)
        removeElem();
    homePage.style.visibility = 'hidden';
    ticketPage.style.visibility = 'visible';
    accountPage.style.visibility = 'hidden';
    oldDisplayedPage = displayedPage.TICKET; 
    ipc.send("createTicketsApp");
});

accountBtn.addEventListener('click', () => {
    mySideBar.style.width = '0px';
    isLeftMenuActive = false;
    sideBtns.style.visibility = 'hidden';
    if (oldDisplayedPage !== displayedPage.HOME)
        removeElem();
    homePage.style.visibility = 'hidden';
    ticketPage.style.visibility = 'hidden';
    accountPage.style.visibility = 'visible';
    oldDisplayedPage = displayedPage.ACCOUNT;
    ipc.send("displayAccounts");
});

function removeElem() {
    if (oldDisplayedPage === displayedPage.TICKET)
        ticketPage.innerHTML = "";
    else
        accountPage.innerHTML = "";
}