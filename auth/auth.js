import jwt from 'jsonwebtoken'

export default (req, res, next) => {
    try{
        const token = req.headers.authorization.split(" ")[1]
        const decode = jwt.verify(token, process.env.KEY_TOKEN)
        req.userData = decode
        next()
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            message: "Auth Failed "
        })
    }
}