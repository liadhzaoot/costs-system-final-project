const express = require("express")
const Cost = require("../models/cost") // new
const router = express.Router()

// create cost
router.post('/costs',(req,res)=>{
        cost = new Cost({
            description: req.body.description,
            sum: req.body.sum,
            userId: req.body.userId
        })
        cost.save().then(
            (result) => res.send(result)
        )
    }
)
module.exports = router