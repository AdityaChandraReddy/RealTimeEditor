const express = require("express");
const app = express();
var cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");
const Actions = require("./Actions");

const server = http.createServer(app);
const io = new Server(server);

const userSocketMap = {};
const getAllConnectedClients = (roomId) => {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    }
  );
};

io.on("connection", (socket) => {
  console.log("socket connection", socket.id);
  socket.on(Actions.JOIN, ({ roomId, username }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);
    const clients = getAllConnectedClients(roomId);
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(Actions.Joined, {
        clients,
        username,
        socketId: socket.id,
      });
    });
  });

  socket.on(Actions.CODE_CHANGE, ({ roomId, code }) => {
    // console.log("receing on server ", code);
    socket.in(roomId).emit(Actions.CODE_CHANGE, {
      code,
    });
  });

  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];

    rooms.forEach((roomId) => {
      socket.in(roomId).emit(Actions.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });
    delete userSocketMap[socket.id];
    socket.leave();
  });
});

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var router = express.Router();
const getProjects = require("./getProjects");
const newProject = require("./helpers/NewProject");
const UploadImages = require("./helpers/UploadImages");
// const fileUpload = require("express-fileupload");
const path = require("path");
const multer = require("multer");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
// app.use(fileUpload());
// var public = path.join("images");

app.use(express.static("images"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

app.use("/api", router);

router.use((req, res, next) => {
  console.log("middleware");
  next();
});

router.route("");

router.route("/projects/:company").get(async (req, res) => {
  let response;
  try {
    response = { status: 200, ...(await getProjects(req.params.company)) };
  } catch (e) {
    // res.json("Error Fetching Projects")
    response = { status: 400, ...e };
  }
  res.json(response);
});

router.route("/Addproject/").post(async (req, res) => {
  console.log("cccccc");
  let response;
  try {
    response = { status: 200, ...(await newProject(req.body)) };
  } catch (e) {
    // res.json("Error Fetching Projects")
    response = { status: 400, ...e };
  }
  res.json(response);
});

router
  .route("/uploadProfilePic/")
  .post(upload.single("files"), async function (req, res) {
    // console.log(req, "rewsfsdfsdf");
    // res.json({ status: "mmmdmfmsdfdf" });
    console.log(req.file);
    let response;
    try {
      response = { status: 200, ...(await UploadImages(req.file)) };
    } catch (e) {
      // res.json("Error Fetching Projects")
      response = { status: 400, ...e };
    }
    res.json(response);
  });

server.listen(4500, () => console.log("socket in 4500"));
// var port = process.env.Port || 8000;
// app.listen(port);
// console.log("port runnin at po", port);
