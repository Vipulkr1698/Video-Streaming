import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({
    path : './env'
})

connectDB();

// const app = express();

// ;( async() => {
//     try {
//          await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//          app.on("err" ,(error)=>{
//             console.log("ERR ", error);
//             throw error;
//          })
//          app.listen( process.env.PORT, ()=> {
//             console.log("app is listening on port ", process.env.PORT);
//          })
//     } catch (error) {
//         console.error(`Unable to connect to database ${error}`)
//         throw err;
//     }
// })() //TODO: learn about iffe and async await in js