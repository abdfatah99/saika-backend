import mongoose from "mongoose";

const roomSaika = mongoose.Schema({
  idroom: {
    type: String,
    required: true,
  },
  kategori: {
    type: String,
    required: true,
  },
  anggota: [
    {
      iduser: { type: String },
      fotoUser: { type: String },
      namauser: { type: String },
      usernameuser: { type: String },
    },
  ],
  chats: [
    {
      iduser: { type: String },
      usernameuser: { type: String },
      waktu: {
        type: String,
      },
      tanggal: {
        type: String,
      },
      pesan: {
        type: String,
      },
    },
  ],
});

export default mongoose.model("roomSaika", roomSaika);

