var parent = document.getElementById("previewBtn");

if (parent.addEventListener) {
	parent.addEventListener("click", preview, false);
} else if (parent.attachEvent) {
	parent.attachEvent("onclick", preview);
}