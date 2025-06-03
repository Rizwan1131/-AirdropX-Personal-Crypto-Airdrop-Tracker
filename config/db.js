import mongoose from "mongoose";
const URI = process.env.MONGO_URI
const connectWithDB = async () => {
    mongoose.connect(URI)
    .then(()=>{console.log("Successfully connect to Db")})
    .catch((err)=>console.log("Error in connecting Db", err))
}

export default connectWithDB;