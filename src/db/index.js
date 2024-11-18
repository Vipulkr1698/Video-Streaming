import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected !! DB_HOST ${connectionInstance.connection.host}`) //TODO: check consolle.log connectionInstance
    } catch (error) {
        console.error("Unable to connect DB", error);
        process.exit(1) //TODO: learn about process failures
    }
}

export default connectDB;