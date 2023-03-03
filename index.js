const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
	cors: {
		origin: "*",

		credentials: true,
	},
});

// app.use(cors({ origin: ["*", "http://127.0.0.1:5500"] }));

const PORT = process.env.PORT || 8000;

http.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});

// Socket

const users = {};

io.on("connection", (socket) => {
	socket.on("new-user-joined", (name) => {
		// console.log("new user", name);
		users[socket.id] = name;
		socket.broadcast.emit("user-joined", name);
	});

	socket.on("send", (message) => {
		socket.broadcast.emit("receive", {
			message: message,
			name: users[socket.id],
		});
	});

	socket.on("disconnect", (message) => {
		socket.broadcast.emit("left", users[socket.id]);
		delete users[socket.id];
	});
});
