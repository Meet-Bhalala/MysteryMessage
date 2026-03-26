import { resend } from "@/lib/resend";
import { render } from "@react-email/render";

import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";


export async function sendVerificationEmail(
    email:string,
    username:string,
    verifyCode:string
): Promise<ApiResponse> {
    try {
        const html = await render(
            VerificationEmail({ username, otp: verifyCode })
        );

        await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Verification Code from Mystery Message',
        html,
});
        return {success: true, message: "Verification email sent successfully"};
    } catch (error) {
        console.error("Error sending verification email:", error);
        return {
            success: false,
            message: "Failed to send verification email",
        };
    }

}