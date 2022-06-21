const express = require("express")
const User = require("../models/user") // new
const Cost = require("../models/cost") // new
const router = express.Router()

// create user
router.post('/user', (req, res) => {
    User.findOne({id: req.body.id}).then((result) => {
        try {
            if (result)
                res.status(400).send({msg: "user already exist"})
            else {
                if (!Date.parse(req.body.birthday)) {
                    res.status(400)
                    res.send({msg: "wrong date"})
                } else {

                    user = new User({
                        id: req.body.id,
                        first_name: req.body.first_name,
                        last_name: req.body.last_name,
                        birthday: req.body.birthday,
                        marital_status: req.body.marital_status,
                        sum: 0
                    })
                    res.status(201)
                    user.save().then(
                        (result) => res.send(result))
                }
            }
        } catch (err) {
            res.status(400)
            res.send({error: "Somthing went wrong..."})
        }
    })


})

// ger user by id
router.get("/user/:id", (req, res) => {
    const user = User.findOne({_id: req.params.id}).then((result) => res.send(result))
})

// get all users
router.get("/user", (req, res) => {
    const users = User.find().then((result) => res.send(result))
})

// update user
router.patch("/user/:id", (req, res) => {
    try {
        const post = User.findOne({_id: req.params.id}).then((result) => {
            if (req.body.first_name) {
                result.first_name = req.body.first_name
            }
            if (req.body.last_name) {
                result.last_name = req.body.last_name
            }
            if (req.body.birthday) {
                result.birthday = req.body.birthday
            }
            if (req.body.marital_status) {
                result.marital_status = req.body.marital_status
            }
            result.save().then((result) => res.send(result))
        })

    } catch {
        res.status(404)
        res.send({error: "User doesn't exist!"})
    }
})

//delete user
router.delete("/user/:id", (req, res) => {
    try {
        User.findOne({_id: req.params.id}).then((result) => {
            if (result !== null) {
                Cost.find({user_id: result._doc.id}).then((result) => {
                    let cost_id_arr = result.map((doc) => doc._id)
                    Cost.deleteMany({_id: {"$in": cost_id_arr}}).then((result) => {
                        if (result !== null) {
                            User.deleteOne({_id: req.params.id}).then((result) => res.status(204).send())
                        }
                    })
                })
            }
        })
    } catch {
        res.status(404)
        res.send({error: "User doesn't exist!"})
    }
})

module.exports = router