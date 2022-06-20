const express = require("express")
const User = require("../models/user") // new
const router = express.Router()

// create cost
router.post('/user',(req,res)=>{
    user = new User({
            id: req.body.id,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            birthday: req.body.birthday,
            marital_status: req.body.marital_status
        })
        user.save().then(
            (result) => res.send(result)
        )
    }
)

router.get("/user/:id", (req, res) => {
    const user = User.findOne({ _id: req.params.id }).then((result) => res.send(result))
})

router.get("/user", (req, res) => {
    const users = User.find().then((result) => res.send(result))
})

router.patch("/user/:id",  (req, res) => {
    try {
        const post = User.findOne({ _id: req.params.id }).then((result)=>{
            if (req.body.first_name) {
                result.first_name = req.body.first_name
            }
            if(req.body.last_name){
                result.last_name = req.body.last_name
            }
            if(req.body.birthday)
            {
                result.birthday = req.body.birthday
            }
            if(req.body.marital_status)
            {
                result.marital_status = req.body.marital_status
            }
            result.save().then((result)=> res.send(result))
        })

    } catch {
        res.status(404)
        res.send({ error: "Post doesn't exist!" })
    }
})
router.delete("/user/:id",  (req, res) => {
    try {
        User.deleteOne({ _id: req.params.id }).then((result) => res.status(204).send())
    } catch {
        res.status(404)
        res.send({ error: "Post doesn't exist!"})
    }
})

module.exports = router