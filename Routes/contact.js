const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Contact = require('../Models/Contact')
const jwt = require('jsonwebtoken')
const User = require('../Models/User')
const cloudinary=require('cloudinary').v2



cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET
})

router.post('/addContact', async (req, res) => {
    try {
        //  console.log(req);

        const token = req.headers.authorization.split(" ")[1]
        const tokenData = jwt.verify(token, process.env.SECRET_KEY)

        console.log(tokenData);
        const uploadResult=await cloudinary.uploader.upload(req.files.image.tempFilePath)
        console.log("uploadResult : ",uploadResult);
        
        const newContact = new Contact({
            fullname: req.body.fullname,
            phone: req.body.phone,
            gender: req.body.gender,
            userId: tokenData.userId,
            image:uploadResult.public_id,
            url:uploadResult.secure_url
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
        const allContacts = await Contact.find({ userId: tokenData.userId }).select("_id fullName email phone  gender userId url")
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