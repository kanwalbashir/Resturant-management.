
const mongoose = require('mongoose');
require('dotenv').config();
const connectDb= async () =>{
    try{
await mongoose.connect(process.env.MONGO_URL);
console.log(`Connected to database: ${mongoose.connection.host}`);
    } catch(error){
console.log("db error",error)
console.log(" DB connection error:", error.message);
    }
}
module.exports =  {connectDb };