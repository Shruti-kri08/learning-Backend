const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Contact = require('../Models/Contact')
const jwt = require('jsonwebtoken')
const User = require('../Models/User')
router.post('/addContact', async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        const tokenData = jwt.verify(token, process.env.SECRET_KEY)

        console.log(tokenData);
        const newContact = new Contact({
            fullname: req.body.fullname,
            phone: req.body.phone,
            gender: req.body.gender,
            userId: tokenData.userId
        })

        const saved = await newContact.save()
        console.log("saved data: ", saved);

        res.status(200).json({
            Contact: saved
        })
    }
    catch (err) {
        res.status(500).json({

            msg: "Add new contact failed"
        })
        console.log(err);

    }

})

//get contact
router.get('/getContact', async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        const tokenData = jwt.verify(token, process.env.SECRET_KEY)
        const allContacts = await Contact.find({ userId: tokenData.userId })
        res.status(200).json({
            allContacts: allContacts
        })
    }
    catch (err) {
        res.status(500).json({

            error: err

        })
        console.log(err);

    }
})

module.exports = router