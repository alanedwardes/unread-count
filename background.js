var worker = new Worker();
worker.setCanvas(document.getElementById('canvas'));
worker.work();

window.setInterval(function() {
	worker.work();
}, 500);