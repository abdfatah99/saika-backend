import express from 'express'
import { buatRoom, getRoom, keluarRoom } from '../controller/room.controller'
const router = express.Router()

router
    .route("/")
    .post(buatRoom)

router
    .router("/:idroom")
    .get(getRoom)
    .put(keluarRoom)

export default router 