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
module.exports = router