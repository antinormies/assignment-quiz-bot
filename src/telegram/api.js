require('dotenv').config({
    path: __dirname + '/.env'
})

const express = require('express');
const TelegramBot = require('node-telegram-bot-api')
const response = require('../components/response')
const {BOT_TOKEN, BOT_GROUP_ID} = process.env
const router= express.Router();

const botInstance = new TelegramBot(BOT_TOKEN, {
    polling : true,
})

router.get('/testing', async(req, res) => {
    botInstance.sendMessage(BOT_GROUP_ID, "P.")
    response.SUCCESS("Well done, all is okay", null, res)
})

router.get('/keyboard-1', async(req, res) => {
    botInstance.sendPoll(BOT_GROUP_ID, 
        "Berapakah hasil dari <b>1+1*0</b> ?", 
        ["1", "0", "Yo ndak tau kok tanya saya"],{
            correct_option_id: 0,
            type: 'quiz',
            explanation: 'why you need explanation for that kind of question?',
        }
    )

    response.SUCCESS("Message has been sent", null, res)
})

router.get('/keyboard-2', async(req, res) => {
    botInstance.sendMessage(BOT_GROUP_ID, "Berapakah hasil dari <b>1+1*0</b> ?",{
        reply_markup: {
            keyboard: [["1"], ["0"], ["Yo ndak tau kok tanya saya"]]
        }
    })

    response.SUCCESS("Message has been sent", null, res)
})

botInstance.on('polling_error', (error) => {
    console.log(error);  // => 'EFATAL'
});

botInstance.on('webhook_error', (error) => {
    console.log(error);  // => 'EPARSE'
});

module.exports = router;