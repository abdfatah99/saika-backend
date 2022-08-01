import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from 'dotenv'

import { namesSetMonth, setIndeksHours } from "./utils/numberFormat.js";
import roomSaika from './models/room.model.js'
import User from "./models/user.model.js";

import eventAPI from "./api-route/event.route.js";
import userAPI from "./api-route/user.route.js"
import chatAPI from "./api-route/chat.route.js"
//import testAPI from "./api-route/test.route.js"

import { Server } from 'socket.io'

const app = express();
import http from 'http'
const server = http.createServer(app);

const corsOption = {
    origin: "http://localhost:3000",
    creadentials: true,
    optionSuccessStatus: 200
}

app.use(cors(corsOption));
app.use(express.json());
app.use(morgan("dev"));
app.use("/event-image", express.static("./public/event-image"));
dotenv.config();

// connect to database
mongoose.connect("mongodb://0.0.0.0:27017/saikaDatabase");

// initial root for service
//app.use("/test", testAPI)
app.use("/event", eventAPI);
app.use("/user", userAPI);
app.use("/chat", chatAPI);


const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });
  
  io.on("connection", (socket) => { // on -> nerima 
    socket.on("join_room", (data) => {
      socket.join(data);
    });
  
    socket.on("send_message", async (data) => {
      const dataChat = await roomSaika.findOne({ idroom: data.idroom });
      const dataUser = await User.findOne({ _id: Object(data.iduser) }); // id user
      let bulan = new Date().getMonth();
      let tahun = new Date().getFullYear();
      let tanggal = new Date().getDate();
      let jam = new Date().getHours();
      let menit = new Date().getMinutes();
      let tanggalKirim = `${tanggal} ${namesSetMonth(bulan, "id-ID")} ${tahun}`;
      let jamKirim = `${setIndeksHours(jam.toString())}:${setIndeksHours(menit.toString())}`;
      let dataKirim = {
        iduser: data.iduser,
        usernameuser: dataUser.username,
        waktu: jamKirim,
        tanggal: tanggalKirim,
        pesan: data.pesanKirim,
      };
      if (dataChat) {
        roomSaika.updateOne(
          { idroom: data.idroom },
          {
            $set: {
              chats: [dataKirim, ...dataChat.chats],
            },
          }
        ).then(async () => {
          const dataChatNew = await roomSaika.findOne({ idroom: data.idroom });
          socket.to(data.idroom).emit("pesan_terima", dataChatNew);
        });
      }
    });
  
    socket.on("data_anggota", async (data) => {
      const cekRoom = await roomSaika.findOne({ idroom: data });
      if (cekRoom) {
        socket.to(data).emit("data_anggota", cekRoom);
      }
    });
  
    socket.on("anggota_keluar", async (data) => {
      const cekUser = await User.findOne({ iduser: Object(data.iduser) });
      if (cekUser) {
        socket.to(data.idroom).emit("anggota_keluar_notif", cekUser.nama);
      }
    });
  
    socket.on("keluar_room", async (data) => {
      console.log(data);
      const cekRoom = await roomSaika.findOne({ idroom: data.idroom });
      if (cekRoom) {
        let sisaAnggota = cekRoom.anggota.filter((el) => el.iduser !== data.iduser);
        // let sisaAnggota =
        roomSaika.updateOne(
          { idroom: data.idroom },
          {
            $set: {
              anggota: [...sisaAnggota],
            },
          }
        ).then(async () => {
          const cekAnggotaRoom = await roomSaika.findOne({ idroom: data.idroom });
          if (cekAnggotaRoom.anggota.length === 0) {
            roomSaika.deleteOne({ idroom: data.idroom }).then(() => {
              const dataChatNew = null;
              socket.to(data.idroom).emit("data_anggota", dataChatNew);
            });
          } else {
            socket.to(data.idroom).emit("data_anggota", cekAnggotaRoom);
          }
        });
      }
    });
  });
  

//error route handler
app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
});
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
        },
    });
});

export default app;
