import testDAO from '../dao/testDAO.js'

export default class testController{
    static apiTestData(req, res, next) {
       console.log(testDAO) 
       res.status(201).json(testDAO)
    }
}