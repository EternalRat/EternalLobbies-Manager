var previewBtns = document.getElementsByClassName("previewBtn");
var downloadBtns = document.getElementsByClassName("downloadBtn");

for (i = 0; i < previewBtns.length; i++) {
	if (previewBtns.item(i).addEventListener) {
		previewBtns.item(i).addEventListener("click", (e) => {
			index = Number(e.target.dataset.index);
			ipc.send("previewHTMLFiles", index);
		}, false);
	} else if (previewBtns.item(i).attachEvent) {
		previewBtns.item(i).attachEvent("onclick", (e) => {
			index = Number(e.target.dataset.index);
			ipc.send("previewHTMLFiles", index);
		});
	}
}
for (i = 0; i < downloadBtns.length; i++) {
	if (downloadBtns.item(i).addEventListener) {
		downloadBtns.item(i).addEventListener("click", (e) => {
			index = Number(e.target.dataset.index);
			ipc.send("downloadHTMLFile", index);
		}, false);
	} else if (downloadBtns.item(i).attachEvent) {
		downloadBtns.item(i).attachEvent("onclick", (e) => {
			index = Number(e.target.dataset.index);
			ipc.send("downloadHTMLFile", index);
		});
	}
}