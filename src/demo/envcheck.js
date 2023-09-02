require('dotenv').config({path:'../../.env'})
const {DB_NAME, DB_CLUSTER, DB_USERNAME, DB_PASSWORD} = process.env

console.log(DB_NAME, DB_CLUSTER, DB_USERNAME, DB_PASSWORD);