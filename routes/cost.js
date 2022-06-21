const moment = require('moment');
const express = require("express")
const Cost = require("../models/cost");
const Category = require("../models/category");
const User = require("../models/user");
const mongoose = require("mongoose");
const router = express.Router()

function updateRecord(recordId, valuesToSet) {
    mongo_filter = {'id': recordId}
    new_values = {'$set': valuesToSet}
    return User.updateOne(mongo_filter, new_values)
}
function setUserSum(newSum,userId,res,costRes,method,lastCostSum){
    if (method === "POST") {
        User.findOne({id: userId}).then((result) => {
            let userNewSum = result.sum + newSum
            return updateRecord(userId, {sum: userNewSum}).then((userRes)=>res.send(costRes))
        })
    }
    else if (method === "PATCH"){
        User.findOne({id: userId}).then((result) => {
            let userNewSum = result.sum - lastCostSum + newSum
            updateRecord(userId, {sum: userNewSum}).then((userRes)=>console.log(costRes))
        })
    }
    else if(method === "DELETE"){
        User.findOne({id: userId}).then((result) => {
            let userNewSum = result.sum - newSum
            updateRecord(userId, {sum: userNewSum}).then((userRes)=>console.log(costRes))
        })
    }
}

// get cost by id
router.get("/report/:month/:year/:user_id", (req, res) => {
    try {
        if (!Date.parse(`${req.params.year}-${req.params.month}-01`)) {
            res.status(400)
            res.send({msg: "wrong month or year"})
        } else {
            Cost.find({
                user_id: req.params.user_id,
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
    } catch (err) {
        res.status(400)
        res.send({error: "Error"})
    }
})

// create cost
router.post('/costs', (req, res) => {

    Category.findOne({_id: req.body.category}).then((result) => {
            if (result === null) {
                res.status(400)
                res.send({msg: "wrong category"})
            }
            else {
                var today = moment(new Date()).format('YYYY-MM-DD[T00:00:00.000Z]');
                cost = new Cost({
                    description: req.body.description,
                    sum: req.body.sum,
                    user_id: req.body.user_id,
                    category: req.body.category,
                    date: today
                })
                cost.save().then(
                    (result) => {
                        setUserSum(req.body.sum,req.body.user_id,res,result,"POST",null)
                    }
                )
            }
        }
    )
})

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

// get costs by user_id
router.get("/costs/get_cost_by_user_id/:user_id", (req, res) => {
    const cost = Cost.find({user_id: req.params.user_id}).then((result) => {
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
            if (result === null) {
                res.status(400).send({msg: "cost not found"})
            }
            else {
                if (req.body.description) {
                    result.description = req.body.description
                }
                if (req.body.sum) {
                    setUserSum(req.body.sum,result.user_id,res,result,"PATCH",result.sum)
                    result.sum = req.body.sum
                }
                if (req.body.user_id) {
                    result.user_id = req.body.user_id
                }
                if (req.body.category) {
                    result.category = req.body.category
                }
                result.save().then((result) => {
                    res.send(result)
                })
            }
        })

    } catch {
        res.status(404)
        res.send({error: "Cost doesn't exist!"})
    }
})

// delete cost by id
router.delete("/costs/:id", (req, res) => {
    try {
        Cost.findOne({_id: req.params.id}).then((costResult)=>{
            Cost.deleteOne({_id: req.params.id}).then((result) =>{
                setUserSum(costResult.sum,costResult.user_id,res,costResult,"DELETE",null)
                res.status(204).send()
            } )
        })

    } catch {
        res.status(404)
        res.send({error: "Cost doesn't exist!"})
    }
})


module.exports = router