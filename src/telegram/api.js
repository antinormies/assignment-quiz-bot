require('dotenv').config({
    path: __dirname + '/.env'
})

const express = require('express');
const TelegramBot = require('node-telegram-bot-api')
const FormData = require('form-data')
const axios = require('axios')
const fs = require('fs')
const multer = require('multer')
const response = require('../components/response');
const {BOT_TOKEN, BOT_GROUP_ID} = process.env
const router= express.Router();
const upload = multer()

const botInstance = new TelegramBot(BOT_TOKEN, {
    polling : true,
})

botInstance.onText(/\/cat/, msg =>{
    botInstance.sendPhoto(BOT_GROUP_ID, "https://cataas.com/cat", {
        reply_to_message_id: msg.chat.id,
    })
})

botInstance.on('polling_error', (error) => {
    console.log(error);  // => 'EFATAL'
});

botInstance.on('webhook_error', (error) => {
    console.log(error);  // => 'EPARSE'
});

router.get('/keyboard-1', async(req, res) => {
    botInstance.sendPoll(BOT_GROUP_ID, 
        "Berapakah hasil dari <b>1+1*0</b> ?", 
        ["1", "0", "Yo ndak tau kok tanya saya"],{
            correct_option_id: 0,
            type: 'quiz',
            explanation: 'why you need explanation for that kind of question?',
            open_period: 90,
            protect_content: true,
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

router.get('/message', async(req, res) => {
    const message = req.query.pesan
    botInstance.sendMessage(BOT_GROUP_ID, (message=="")?"Hi!":message)
    response.SUCCESS("Well done, all is okay", null, res)
})

router.post('/push-1', upload.single('image'), async(req, res) =>{
    if(req.body.type=='soal'){
        const hasImage = req.body.hasImage
        if(hasImage) {
            const image = req.file
            let form = new FormData()
            form.append("photo", image.buffer, image.originalname)
            
            await axios({
                url:`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto?chat_id=${BOT_GROUP_ID}`,
                method: 'POST',
                data: form,
                headers: {
                    'Content-Type': "multipart/form-data",
                }
            })
            .then((res)=> console.log(res))
            .catch((err)=> console.log(err))
        }

        const question = req.body.question
        const hint = req.body.hint
        const options = [
            `${req.body.option_1}`,
            `${req.body.option_2}`,
            `${req.body.option_3}`,
            `${req.body.option_4}`,
            `${req.body.option_5}`
        ]
        const answer = req.body.answer

        if(question=="" || options.length == 0 || hint == ""){
            return response.ERROR("Check Again", res)
        }

        botInstance.sendPoll(BOT_GROUP_ID, question, options, {
            correct_option_id: ((answer==0)?0:(answer-1)),
            type: 'quiz',
            explanation: hint,
            open_period: 90,
            protect_content: true
        })

    }else{
        // currently not supported yet
        return response.ERROR("Not supported yet")
        const file = req.body.image
        if(file === null) return response.ERROR("File should not be empty", res)
    }
    res.redirect('/page/home')
})

module.exports = router;