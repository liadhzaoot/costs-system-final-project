const moment =  require('moment');
const express = require("express")
const Cost = require("../models/cost");
const mongoose = require("mongoose"); // new
const router = express.Router()


// get cost by id
router.get("/report/:month/:year", (req, res) => {
    try {
        Cost.find({
            $expr: {
                $and: [
                    {
                        "$eq": [
                            {
                                "$month": "$date"
                            },
                            req.params.month
                        ]
                    },
                    {
                        "$eq": [
                            {
                                "$year": "$date"
                            },
                            req.params.year
                        ]
                    }
                ]
            }
        }).then(
            (result) => res.send(result)
        )
    }
    catch(err) {
        console.log("lad")
        res.status(400)
        res.send({ error: "Error" })
    }})

// create cost
router.post('/costs',(req,res)=>{
    var today = moment(new Date()).format('YYYY-MM-DD[T00:00:00.000Z]');
    cost = new Cost({
            description: req.body.description,
            sum: req.body.sum,
            userId: req.body.userId,
            category: req.body.category,
            date: today
        })
        cost.save().then(
            (result) => res.send(result)
        )
    }
)

// get cost by id
router.get("/costs/:id", (req, res) => {
    const cost = Cost.findOne({ _id: req.params.id }).then((result) => {
        if(result === null) {
            res.send({msg: "there is no cost"})
        }
        else
            res.send(result)})
})

// get all costs
router.get("/costs", (req, res) => {
    const cost = Cost.find().then((result) => res.send(result))
})

router.patch("/costs/:id",  (req, res) => {
    try {
        const cost = Cost.findOne({ _id: req.params.id }).then((result)=>{
            if (req.body.description) {
                result.description = req.body.description
            }
            if (req.body.sum) {
                result.sum = req.body.sum
            }
            if (req.body.userId) {
                result.userId = req.body.userId
            }
            if (req.body.category) {
                result.category = req.body.category
            }
            result.save().then((result)=> res.send(result))
        })

    } catch {
        res.status(404)
        res.send({ error: "Cost doesn't exist!" })
    }
})
router.delete("/costs/:id",  (req, res) => {
    try {
        Cost.deleteOne({ _id: req.params.id }).then((result) => res.status(204).send())
    } catch {
        res.status(404)
        res.send({ error: "Cost doesn't exist!"})
    }
})


module.exports = router