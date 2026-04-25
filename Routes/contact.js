const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Contact = require('../Models/Contact')
const jwt = require('jsonwebtoken')
const User = require('../Models/User')
const cloudinary = require('cloudinary').v2



cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

//Add new contact API
router.post('/addContact', async (req, res) => {
    try {
        //  console.log(req);
        const token = req.headers.authorization.split(" ")[1]
        const tokenData = jwt.verify(token, process.env.SECRET_KEY)

        console.log(tokenData);
        const uploadResult = await cloudinary.uploader.upload(req.files.image.tempFilePath)
        console.log("uploadResult : ", uploadResult);

        const newContact = new Contact({
            fullname: req.body.fullname,
            phone: req.body.phone,
            gender: req.body.gender,
            userId: tokenData.userId,
            imgId: uploadResult.public_id,
            imgUrl: uploadResult.secure_url
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

router.get('/getContact', async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        const tokenData = jwt.verify(token, process.env.SECRET_KEY)
        const allContacts = await Contact.find({ userId: tokenData.userId }).select("_id fullname email phone  gender userId url").populate('userId', 'fullname email')
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

// router.delete('/byId/:id',async(req,res)=>{
// try{
//             const token=req.headers.authorization.split(" ")[1]
//             const tokenData=await jwt.verify(token,process.env.SECRET_KEY)
//             const deletedContact=await Contact.findByIdAndDelete(req.params.id)
//             console.log("deletedContact : ",deletedContact);
//              if(deletedContact==null)
//             {
//                 return res.status(200).json({msg:"No contacts"})
//             }
//             res.status(200).json({
//                 msg:"data deleted"
//             })
// }   
// catch(err) {
//         res.status(500).json({
//             error: err
//         })
// }
// })


router.delete('/:id', async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        const tokenData = await jwt.verify(token, process.env.SECRET_KEY)
        const contact = await Contact.findById(req.params.id)
        if (contact.userId != tokenData.userId) {
            return res.status(500).json({ error: 'Invalid User' })
        }
        await cloudinary.uploader.destroy(contact.imgId)
        await Contact.deleteOne({ _id: req.params.id })
        res.status(200).json({ msg: "data deleted" })
    }
    catch (err) {
        res.status(500).json({
            error: err

        })

    }
})


// router.delete('/byUserId/:userId',async(req,res)=>{
// try{
//             const token=req.headers.authorization.split(" ")[1]
//             const tokenData=await jwt.verify(token,process.env.SECRET_KEY)
//             const deletedContact=await Contact.findmanyAndDelete(req.params.userId)
//             console.log("deletedContact : ",deletedContact);
//             if(deletedContact==null)
//             {
//                 return res.status(200).json({msg:"No contacts"})
//             }
//             res.status(200).json({
//                 msg:"data deleted"
//             })
// }   
// catch(err) {
//         res.status(500).json({
//             error: err
//         })
// }

// })


router.put('/update/:id', async (req, res) => {
    try {

        const token = req.headers.authorization.split(" ")[1]
        const tokenData = await jwt.verify(token, process.env.SECRET_KEY)
        const contact = await Contact.findById(req.params.id)

        if (tokenData.userId != contact.userId) {
            return res.status(400).json({ msg: "you are not allowed to update data" })
        }

        // const updatedContact = new Contact({
        //     fullname: req.body.fullname,
        //     phone: req.body.phone,
        //     gender: req.body.gender,
        //     userId: tokenData.userId,
        // })

        //     if(req.files){
        //         await cloudinary.uploader.destroy(contact.imgId)
        //         const newImg=await cloudinary.uploader.upload(req.files.tempFilePath)
        //         updatedContact["imgId"]=newImg.public_id
        //         updatedContact["imgUrl"]=newImg.secure_url

        //     }
        //      else{
        //         updatedContact["imgId"]=newImg.public_id
        //        updatedContact["imgUrl"]=newImg.secure_url  
        //      }   
        //      const result=updatedContact.save()    
        //      res.status(200).json({
        //         updatedContact:result
        //      })



        const updateContact = new Contact({
            fullname: req.body.fullname,
            phone: req.body.phone,
            gender: req.body.gender,
            userId: tokenData.userId,
            imgId: contact.imgId,
            imgUrl: contact.imgUrl

        })
        console.log("hello");

        if (req.files) {
            await cloudinary.uploader.destroy(contact.imgId)
            const updatedImg = await cloudinary.uploader.upload(req.files.image.tempFilePath)
            updateContact["imgId"] = updatedImg.public_id,
                updateContact["imgUrl"] = updatedImg.secure_url

        }

        const result = await updateContact.save()
        res.status(200).json({ updatedData: result })
    }
    catch (err) {
        console.log(err);

        res.status(500).json({
            error: err

        })

    }
})



router.get('/count', async (req, res) => {
    try {
        token = await req.headers.authorization.split(" ")[1]
        const tokenData = jwt.verify(token, process.env.SECRET_KEY)
        const count = await Contact.countDocuments({ userId: tokenData.userId })
        console.log(count);
    }
    catch (err) {
        console.log(err);

        res.status(500).json({
            error: err
        })
    }
})


module.exports = router