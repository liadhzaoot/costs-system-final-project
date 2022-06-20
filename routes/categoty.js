const express = require("express")
const Category = require("../models/category") // new
const router = express.Router()

// create category
router.post('/category',(req,res)=>{
    const category = new Category({
            name: req.body.name,
        })
    category.save().then(
            (result) => res.send(result)
        )
    }
)

router.get("/category/:id", (req, res) => {
    const category = Category.findOne({ _id: req.params.id }).then((result) => res.send(result))
})

router.get("/category", (req, res) => {
    const categories = Category.find().then((result) => res.send(result))
})

router.patch("/category/:id",  (req, res) => {
    try {
        const post = Category.findOne({ _id: req.params.id }).then((result)=>{
            if (req.body.name) {
                result.name = req.body.name
            }
            result.save().then((result)=> res.send(result))
        })

    } catch {
        res.status(404)
        res.send({ error: "Post doesn't exist!" })
    }
})
router.delete("/category/:id",  (req, res) => {
    try {
        Category.deleteOne({ _id: req.params.id }).then((result) => res.status(204).send())
    } catch {
        res.status(404)
        res.send({ error: "Post doesn't exist!"})
    }
})


module.exports = router