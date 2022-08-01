import roomSaika from '../models/room.model.js' // roomSaika
const crypto = require("crypto"); // generate id room

const buatRoom = async (req, res) => {
  const cekRoom = await roomSaika.findOne({ kategori: req.body.kategori });
  if (cekRoom) {
    let dataAnggota = cekRoom.anggota.filter((el) => el.iduser !== req.body.iduser);
    const dataUser = {
      iduser: req.body.iduser,
      fotoUser: req.body.fotoUser,
      namauser: req.body.namauser,
      usernameuser: req.body.usernameuser,
    };
    // tambah anggota room di batabase
    roomSaika.updateOne(
      { kategori: req.body.kategori },
      {
        $set: {
          anggota: [...dataAnggota, dataUser],
        },
      }
    ).then(() => {
      res.send(cekRoom.idroom);
    });
  } else {
    const dataMasuk = {
      idroom: crypto.randomBytes(64).toString("hex"),
      kategori: req.body.kategori,
      anggota: [
        {
          iduser: req.body.iduser,
          fotoUser: req.body.fotoUser,
          namauser: req.body.namauser,
          usernameuser: req.body.usernameuser,
        },
      ],
    };
    roomSaika.insertMany(dataMasuk, (error, result) => {
      res.send(dataMasuk.idroom);
    });
  }
};

const getRoom = async (req, res) => {
  const cekRoom = await roomSaika.findOne({ idroom: req.params.idroom });
  if (cekRoom) {
    res.send(cekRoom);
  }
};

const addPesan = () => {};

const keluarRoom = async (req, res) => {
  const cekRoom = await roomSaika.findOne({ idroom: req.params.idroom });
  if (cekRoom) {
    let sisaAnggota = cekRoom.anggota.filter((el) => el.iduser !== req.body.iduser); // result all member exclude the iduser
    // let sisaAnggota =
    roomSaika.updateOne(
      { idroom: req.params.idroom },
      {
        $set: {
          anggota: [...sisaAnggota],
        },
      }
    ).then(async () => {
      const cekAnggotaRoom = await roomSaika.findOne({ idroom: req.params.idroom }); // roomnya ngga ada orang, maka hapus room
      if (cekAnggotaRoom.anggota.length === 0) {
        roomSaika.deleteOne({ idroom: req.params.idroom });
      }
    });
  }
};

const hapusRoom = () => {};

export { buatRoom, addPesan, hapusRoom, getRoom, keluarRoom }
