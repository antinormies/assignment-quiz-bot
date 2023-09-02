require('dotenv').config({
    path: __dirname + '/.env'
})

const {APPLICATION_NAME, APPLICATION_VERSION}  = process.env

exports.SUCCESS = (message,payload,res)=>{
    res.status(200).json({
        "VERSION": APPLICATION_VERSION,
        "SENDER": APPLICATION_NAME,
        "STATUS": "SUCCESS",
        "MESSAGE": message,
        "PAYLOAD": payload
    });
}

exports.ERROR = (message,res)=>{
    res.status(202).json({
        VERSION : APPLICATION_VERSION,
        SENDER : APPLICATION_NAME,
        STATUS : "ERROR",
        MESSAGE : message,
        PAYLOAD : null
    });
}

exports.ERROR_ACTION = (message,action,res)=>{
    res.status(202).json({
        VERSION : APPLICATION_VERSION,
        SENDER : APPLICATION_NAME,
        STATUS : "ERROR",
        MESSAGE : message,
        PAYLOAD : {
            ACTION : action
        }
    });
}

exports.UNAUTHENTICATED = (res)=>{
    res.status(201).json({
        VERSION : APPLICATION_VERSION,
        SENDER : APPLICATION_NAME,
        STATUS : "ERROR",
        MESSAGE : "Akses ditolak",
        PAYLOAD : {
            ACTION : "RELOG"
        }
    });
}

exports.TO_DAFTAR = (res)=>{
    res.status(201).json({
        VERSION : APPLICATION_VERSION,
        SENDER : APPLICATION_NAME,
        STATUS : "ERROR",
        MESSAGE : "Harap mendaftar terlebih dahulu",
        PAYLOAD : {
            ACTION : "DAFTAR"
        }
    });
}

exports.TO_OTP_PHONE = (res)=>{
    res.status(201).json({
        VERSION : APPLICATION_VERSION,
        SENDER : APPLICATION_NAME,
        STATUS : "ERROR",
        MESSAGE : "Harap Verifikasi Nomor Ponsel",
        PAYLOAD : {
            ACTION : "OTP_PHONE"
        }
    });
}

