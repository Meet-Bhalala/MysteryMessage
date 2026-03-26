import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import moongoose from "mongoose";
import { success } from "zod";

export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user:User = session?.user as User;

    if (!session||!user) {
        return Response.json(
            {
                success: false,
                message: "Unauthorized"
            },
            { status: 401 }
        )
    }

    const userId = new moongoose.Types.ObjectId(user._id);
    try {
        const user=await UserModel.aggregate([
            {
                $match:{_id:userId}
            },
            {
                $unwind:'$messages'
            },
            {$sort:{'messages.createdAt':-1}},
            {$group:{_id:'$_id',messages:{$push:'$messages'}}}

        ])

        if(!user ||user.length===0)
        {
            return Response.json(
                {
                    success: false,
                    message: "No messages found for the user"
                },
                { status: 404 }
            )
        }

        return Response.json(
            {
                success: true,
                message: "Messages retrieved successfully",
                messages: user[0].messages,
            },
            { status: 200 }
        )


    } catch (error) {
        console.log("Failed to retrieve messages", error);
        return Response.json(
            {
                success: false,
                message: "Failed to retrieve messages"
            },
            { status: 500 }
        )
    }


}