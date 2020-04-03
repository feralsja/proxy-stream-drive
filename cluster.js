'use strict'

const cluster = require("cluster")
const os = require("os")

if (cluster.isMaster) {	
	for (var i = 0; i < os.cpus().length; i++) {
		var worker = cluster.fork()
	}

	cluster.on(
		"exit",
		function handleExit(worker, code, signal) {
			console.log("[Cluster] Worker end: %s", worker.process.pid);
			console.log("[Cluster] Dead: %s", worker.exitedAfterDisconnect);

			if (!worker.exitedAfterDisconnect)
				var worker = cluster.fork();
		}
	);
} else {
	require("./server");
	console.log("[Worker] Worker start: %s", process.pid);
}