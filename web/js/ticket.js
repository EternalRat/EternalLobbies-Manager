const { ipcRenderer, IpcRendererEvent } = require("electron");
const ipc = ipcRenderer;

ipc.on('previewHTMLFile',
    /**
     * 
     * @param {IpcRendererEvent} evt 
     * @param {String} args 
     */
    (evt, args) => {
        var preview = document.getElementsByClassName('preview')[0];
        if (preview.childElementCount !== 0)
            preview.innerHTML = "";
        var html = args.slice(args.indexOf('<div class="ticket">'), args.lastIndexOf('</div>') + '</div>'.length);
		preview.innerHTML = html;
});

minimizeTicketBtn.addEventListener('click', () => {
    ipc.send('minimizeTicketApp');
});

closeTicketBtn.addEventListener('click', () => {
    ipc.send('closeTicketApp');
});