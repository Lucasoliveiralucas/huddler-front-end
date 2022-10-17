import { Server } from "socket.io";

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      // socket.join(`room ${id}`);
      socket.on("input-change", (msg, room) => {
        console.log(room);
        room
          ? socket.to(room).emit("update-input", msg)
          : socket.broadcast.emit("update-input", msg);
      });
      socket.on("join-room", async (room) => {
        console.log("joined", room);
        await socket.join(room);
        console.log("socket now in ", socket.rooms);
      });
    });
  }
  res.end();
};

export default SocketHandler;
