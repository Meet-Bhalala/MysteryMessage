import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import moongoose from "mongoose";

export async function DELETE(request: Request, { params }: { params: Promise<{ messageId: string }> }) {
    try {
        await dbConnect();

        const { messageId } = await params;
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

        const updateResult=await UserModel.updateOne({
            _id: new moongoose.Types.ObjectId(user._id)
        },{
            $pull: {
                messages:{_id:new moongoose.Types.ObjectId(messageId)}
            }
        })

        if(updateResult.modifiedCount==0){
            return Response.json(
                {
                    success: false,
                    message: "Message not found or you are not authorized to delete this message"
                },
                { status: 404 }
            )
        }

        return Response.json(
            {
                success: true,
                message: "Message deleted successfully"
            },
            { status: 200 }
        )

    } catch (error) {
        console.log("Failed to delete message", error);
        return Response.json(
            {
                success: false,
                message: "An error occurred while deleting the message"
            },
            { status: 500 }
        )
    }
    

}