//import userDAO from "../data-access-object/user.dao.js"
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

class userController {
    static async userRegister(req, res, next) {
        User.find({ email: req.body.email })
            .exec()
            .then((user) => {
                console.log(`User result: ${user}`);
                // if user exist
                if (user.length >= 1) {
                    return res.status(409).json({
                        message: "Email Sudah Tersedia",
                    });
                } else {
                    if (req.body.password !== req.body.confirmPassword){
                        return res.status(200).json({
                            message: "password dan konfirmasi password tidak sama"
                        })
                    }
                    // if user email is not exist
                    bcrypt.hash(req.body.password, 10, (err, hash) => {
                        if (err) {
                            return res.status(500).json({
                                error: err,
                            });
                        } else {
                            const user = new User({
                                _id: new mongoose.Types.ObjectId(),
                                namaLengkap: req.body.namaLengkap,
                                username: req.body.username,
                                email: req.body.email,
                                password: hash,
                            });
                            user.save()
                                .then((result) => {
                                    console.log(result);
                                    res.status(201).json({
                                        message: "User Created",
                                    });
                                })
                                .catch((err) => {
                                    console.log(err);
                                    res.status(500).json({
                                        error: err.errors.email.message,
                                    });
                                });
                        }
                    });
                }
            })
            .catch();
    }

    static async userLogin(req, res, next) {
        User.find({ email: req.body.email })
            .exec()
            .then((user) => {
                if (user.length < 1) {
                    return res.status(404).json({
                        message: "Auth Failed",
                    });
                }
                console.log("find user: ");
                console.log(user);
                bcrypt.compare(
                    // bcrypt(reqPass, dbPass, (err, result) => {})
                    req.body.password,
                    user[0].password,
                    (err, result) => {
                        if (err) {
                            return res.status(401).json({
                                message: "Auth Failed",
                            });
                        }
                        if (result) {
                            console.log(user)
                            const token = jwt.sign(
                                {
                                    email: user[0].email,
                                    userId: user[0]._id,
                                },
                                process.env.KEY_TOKEN,
                            );
                            return res.status(200).json({
                                body: {
                                    _id: user[0].id,
                                    email: user[0].email
                                },
                                token: token, // tambah userId, emai. 
                            });
                        }
                        res.status(401).json({
                            message: "Auth Failed",
                        });
                    }
                );
            })
            .catch((error) => {
                console.log(error);
                res.status(500).json({
                    error: error,
                });
            });
    }

    static async deleteUser(req, res, next) {
        User.deleteOne({ _id: req.params.userId })
            .exec()
            .then((result) => {
                console.log(result);
                res.status(200).json({
                    message: "User deleted",
                });
            })
            .catch((err) => {
                res.status(200).json({
                    error: err,
                });
            });
    }
}

export default userController;
