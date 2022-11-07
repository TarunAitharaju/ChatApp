const express = require("express");
const path = require("path");
// const cors = require("cors");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

const PORT = process.env.PORT || 5000;
app.use(express.static(path.join(__dirname, "..", "build")));
// app.use(cors());
io.on("connection", (socket) => {
  const id = socket.handshake.query.id;
  socket.join(id);

  socket.on("send-message", ({ recepients, message, id }) => {
    recepients.forEach((recipient) => {
      const newRecipients = recepients.map((r) => {
        return r.id == recipient.id
          ? { ...r, id: id, name: "" }
          : { ...r, name: "" };
      });
      socket.broadcast.to(recipient.id).emit("receive-message", {
        message,
        recepients: newRecipients,
        sender: id,
      });
    });
  });

  socket.on("typing", ({ typing, recepients }) => {
    recepients.forEach((recipient) => {
      console.log("curreny user", recipient);
      console.log("typing", typing);
      const newRecipients = recepients.map((r) => {
        return r.id == recipient.id
          ? { ...r, id: id, name: "", status: typing }
          : r;
      });
      console.log("newUsers", newRecipients);
      socket.broadcast.to(recipient.id).emit("receive-typing", {
        recepients: newRecipients,
        sender: id,
        typing,
      });
    });
  });

  socket.on("read", ({ recepients, sender }) => {
    recepients.forEach((recipient) => {
      const newRecipients = recepients.map((r) => {
        return r.id == recipient.id ? { ...r, id: id, name: "" } : r;
      });
      console.log("new", newRecipients);
      socket.broadcast.to(recipient.id).emit("receive-read", {
        recepients: newRecipients,
        sender: id,
      });
    });
  });
});

server.listen(PORT, () => {
  console.log("Connected to PORT:" + PORT);
});
