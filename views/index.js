require('dotenv').config({
    path: __dirname + '/.env'
})

const express = require('express')
const router= express.Router()
const {BOT_TOKEN, BOT_GROUP_ID} = process.env

router.get('/home', (req,res) => {
    res.render('pages/index');
})

router.get('/message', (req, res) => {
    res.render('pages/message')
})

module.exports = router