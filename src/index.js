import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path : './.env'
})

connectDB().then(()=>{
    app.on("err" ,(error)=>{
            console.log("ERR ", error);
            throw error;
         })
    app.listen(process.env.PORT || 8000, ()=>{
        console.log("app is listening on port ", process.env.PORT);
    });
}
).catch((err) => {
    console.error(`Unable to connect to database ${err}`)
});

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