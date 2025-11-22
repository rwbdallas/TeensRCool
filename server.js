const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static("public"));

const users = {};
const bannedUsers = new Set();
const mods = new Set();
const OWNER = "Jerome";

app.post("/login", (req, res) => {
  const { nickname, password } = req.body;
  if (!nickname || !password) {
    return res.json({ success: false, message: "Bitte Nickname und Passwort eingeben." });
  }

  if (bannedUsers.has(nickname)) {
    return res.json({ success: false, message: "Du wurdest aus dem Chat ausgeschlossen." });
  }

  if (!users[nickname]) {
    users[nickname] = password;
  }

  const role = nickname === OWNER ? "owner" : (mods.has(nickname) ? "mod" : "user");
  return res.json({ success: true, role });
});

app.post("/make-mod", (req, res) => {
  const { requester, target } = req.body;
  if (requester === OWNER && users[target]) {
    mods.add(target);
    return res.json({ success: true });
  }
  return res.json({ success: false, message: "Du bist nicht berechtigt." });
});

app.post("/ban-user", (req, res) => {
  const { requester, target } = req.body;
  if ((requester === OWNER || mods.has(requester)) && users[target]) {
    bannedUsers.add(target);
    return res.json({ success: true });
  }
  return res.json({ success: false, message: "Du bist nicht berechtigt oder Nutzer existiert nicht." });
});

app.get("/admin-info", (req, res) => {
  const userRoles = {};
  for (const name of Object.keys(users)) {
    if (name === OWNER) userRoles[name] = "owner";
    else if (mods.has(name)) userRoles[name] = "mod";
    else userRoles[name] = "user";
  }

  res.json({
    users: userRoles,
    banned: Array.from(bannedUsers)
  });
});

io.on("connection", (socket) => {
  console.log("Ein Nutzer ist verbunden");

  socket.on("chat message", (data) => {
    if (!bannedUsers.has(data.nickname)) {
      io.emit("chat message", data);
    }
  });

  socket.on("mod message", (data) => {
    if (data && (mods.has(data.nickname) || data.nickname === OWNER)) {
      io.emit("mod message", data);
    }
  });
});

http.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
