const express = require("express");
const app = express();
const http = require("http").createServer(app);

const cors = require('cors');
  
// CORS is enabled for all origins
app.use(cors({
    origin: '*'
}));

const PORT = process.env.PORT || 8000;

http.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});

// Socket
const io = require("socket.io")(http);

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
