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
      socket.on("input-change", (msg, room, username) => {
        console.log({
          huddle_id: Number(room),
          message: msg,
          username: username,
        });

        try {
          fetch(
            "https://u4pwei0jaf.execute-api.eu-west-3.amazonaws.com/test/messages",
            {
              method: "POST",
              mode: "no-cors",
              body: JSON.stringify({
                huddle_id: Number(room),
                message: msg,
                username: username,
              }),
              headers: {
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "*",
              },
            }
          );
          room
            ? socket.to(room).emit("update-input", {
                huddle_id: Number(room),
                message: msg,
                username: username.username,
              })
            : socket.broadcast.emit("update-input", msg);
        } catch (error) {
          console.log("error posting message", error);
        }
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
