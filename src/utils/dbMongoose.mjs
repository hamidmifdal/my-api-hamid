import mongoose from "mongoose";

export default async function DB(){
    try {
        if (process.env.NODE_ENV === "production") {
            mongoose.set("debug", false);
        }
        const db = await mongoose.connect(process.env.MONGOURL)
        console.log("hello bro", db.connection.host)
    } catch (error) {
        console.error(error)
    }
}