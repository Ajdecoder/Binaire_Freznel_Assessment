const http = require("http");
const WebSocket = require("ws");

const app = require("./app");

const PORT = process.env.PORT || 9002;

const server = http.createServer(app);

const wss = new WebSocket.Server({
  server,
  path: "/ws",
});

const broadcastJobUpdate = (job) => {
  const message = JSON.stringify({
    type: "job:update",
    job,
  });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};

app.set("broadcastJobUpdate", broadcastJobUpdate);

wss.on("connection", (socket) => {
  console.log("WebSocket client connected");

  const queueManager = app.get("queueManager");

  if (queueManager) {
    socket.send(
      JSON.stringify({
        type: "jobs:snapshot",
        jobs: queueManager.getAllJobs(),
      })
    );
  }

  socket.on("close", () => {
    console.log("WebSocket client disconnected");
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});