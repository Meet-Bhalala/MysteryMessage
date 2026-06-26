import mongoose from "mongoose";


type ConnectionObject={
    isConnected?:number
}


const connection:ConnectionObject={}

async function dbConnect():Promise<void>{
    if(connection.isConnected){
        console.log("Already connected to database")
        return
    }

    const mongoUrl = process.env.MONGODB_URL;

    if(!mongoUrl){
        throw new Error("MONGODB_URL is not configured")
    }

    try {
        const db=await mongoose.connect(mongoUrl,{})
        connection.isConnected=db.connections[0].readyState

        console.log("DB Connected to database successfully")

    } catch (error) {
        console.log("Database connection failed",error)
        throw error
    }
}

export default dbConnect