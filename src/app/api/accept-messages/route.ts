import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {User} from "next-auth";
import { success } from "zod";

export async function POST(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user:User= session?.user as User;

    if(!session || !user){
        return Response.json(
            {
                success: false,
                message: "Unauthorized"
            },
            { status: 401 }
        )
    }
    
    const UserId=user._id
    const {acceptMessages}=await request.json()

    try {
        const updatedUser=await UserModel.findByIdAndUpdate(
            UserId,
            {
                isAccecptingMessages: acceptMessages
            },
            {new:true}
        )

        if(!updatedUser)
        {
            return Response.json(
                {
                    success: false,
                    message: "failed to update acceptMessages"
                },
                { status: 404 }
            )
        }

        return Response.json(
            {
                success: true,
                message: "Message acceptance status updated successfully",
                data: updatedUser,
            },
            { status: 200 }
        )
        
    } catch (error) {
        console.log("failed to update acceptMessages", error);
        return Response.json(
            {
                success: false,
                message: "Failed to update acceptMessages"
            },
            { status: 500 }
        )
    }

}

export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user:User= session?.user as User;

    if(!session || !user){
        return Response.json(
            {
                success: false,
                message: "Unauthorized"
            },
            { status: 401 }
        )
    }

    const UserId=user._id

    try {
        const foundUser= await UserModel.findById(UserId)
    
        if(!foundUser)    {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                { status: 404 }
            )
        }
    
        return Response.json(
            {
                success: true,
                message: "Message acceptance status retrieved successfully",
                isAccecptingMessages : foundUser.isAccecptingMessages,
            },
            { status: 200 }
        )
    } catch (error) {
        console.log("failed to retrieve acceptMessages", error);
        return Response.json(
            {
                success: false,
                message: "Failed to retrieve acceptMessages"
            },
            { status: 500 }
        )
    }
}