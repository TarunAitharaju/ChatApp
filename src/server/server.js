const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

const PORT = 3231;
app.use(express.static(__dirname + "/build"));
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
