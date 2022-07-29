import mongoose from "mongoose";
import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'

export default class UserDAO {
    static async addUser(data) {
        // hash password
        const hashedPassword = await bcrypt.hash(data.password, 10)

        const userData = new User({
            _id: new mongoose.Types.ObjectId,
            namaLengkap: data.namaLengkap,
            username: data.username,
            email: data.email,
            password: hashedPassword
        })

        const saveUser = await userData
            .save()
            .then(data => {
                console.log(data)
            })
            .catch(err => {
                console.log(err)
            })

        console.log(saveUser)
        return saveUser
    }
}
