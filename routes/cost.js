const moment = require('moment');
const express = require("express")
const Cost = require("../models/cost");
const mongoose = require("mongoose"); 
const router = express.Router()


// get cost by id
router.get("/report/:month/:year/:userId", (req, res) => {
    try {
        if (!Date.parse(`${req.params.year}-${req.params.month}-01`)) {
            res.status(400)
            res.send({msg: "wrong month or year"})
        } else {
            Cost.find({userId: req.params.userId ,
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
    } 
    catch(err) {
        res.status(400)
        res.send({error: "Error"})
    }
})

// create cost
router.post('/costs', (req, res) => {
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
    console.log(req.params.id)
    const cost = Cost.findOne({_id: req.params.id}).then((result) => {
        if (result === null) {
            res.send({msg: "there is no cost"})
        } else
            res.send(result)
    })
})

// get costs by userId
router.get("/costs/get_cost_by_userId/:userId", (req, res) => {
    const cost = Cost.find({userId: req.params.userId}).then((result) => {
        if (result === null) {
            res.send({msg: "there is no cost"})
        } else
            res.send(result)
    })
})

// get costs by category
router.get("/costs/get_cost_by_category/:categoryId", (req, res) => {
    const cost = Cost.find({category: req.params.categoryId}).then((result) => {
        if (result === null) {
            res.send({msg: "there is no cost"})
        } else
            res.send(result)
    })
})

// get all costs
router.get("/costs", (req, res) => {
    const cost = Cost.find().then((result) => res.send(result))
})

// update cost by id
router.patch("/costs/:id", (req, res) => {
    try {
        const cost = Cost.findOne({_id: req.params.id}).then((result) => {
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
            result.save().then((result) => res.send(result))
        })

    } catch {
        res.status(404)
        res.send({error: "Cost doesn't exist!"})
    }
})

// delete cost by id
router.delete("/costs/:id", (req, res) => {
    try {
        Cost.deleteOne({_id: req.params.id}).then((result) => res.status(204).send())
    } catch {
        res.status(404)
        res.send({error: "Cost doesn't exist!"})
    }
})


module.exports = router