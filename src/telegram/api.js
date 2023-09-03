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

    res.redirect('/page/message')
})

router.post('/push-1', upload.single('image'), async(req, res) =>{
    const hasImage = req.body.hasImage
    if(hasImage) {
        const image = req.file
        if(image == undefined) return response.ERROR("File should not be empty, press back", res)

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

    const question = (req.body.question === "")?"what's the answer?":req.body.question
    const hint = (req.body.hint === "")?"nothing":req.body.hint
    const options = [
        `${req.body.option_1}`,
        `${req.body.option_2}`,
        `${req.body.option_3}`,
        `${req.body.option_4}`,
        `${req.body.option_5}`
    ]
    const answer = (req.body.answer == undefined)?0:req.body.answer

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

    res.redirect('/page/home')
})


router.post('/push-2', upload.single('file'), async(req, res) => {
    const type = req.body.type // three option [image, document, audio]
    const file = req.file
    if(file == undefined) return response.ERROR("File should not be empty, press back", res)

    let form = new FormData()
    const message = req.body.message
    switch (type) {
        case "image":
            form.append("photo", file.buffer, file.originalname)
            await axios({
                url:`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto?chat_id=${BOT_GROUP_ID}`,
                method: 'POST',
                data: form,
                headers: {
                    'Content-Type': "multipart/form-data",
                }
            })
            break;
        case "document":
            form.append("document", file.buffer, file.originalname)
            await axios({
                url:`https://api.telegram.org/bot${BOT_TOKEN}/sendDocument?chat_id=${BOT_GROUP_ID}`,
                method: 'POST',
                data: form,
                headers: {
                    'Content-Type': "multipart/form-data",
                }
            })
            break;

        case "audio":
            form.append("audio", file.buffer, file.originalname)
            await axios({
                url:`https://api.telegram.org/bot${BOT_TOKEN}/sendAudio?chat_id=${BOT_GROUP_ID}`,
                method: 'POST',
                data: form,
                headers: {
                    'Content-Type': "multipart/form-data",
                }
            })
            break;
    }

    if(message != ""){
        botInstance.sendMessage(BOT_GROUP_ID, message, {
            protect_content: true
        });
    }
    
    res.redirect('/page/message')
})


module.exports = router;
