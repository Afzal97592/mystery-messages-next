import { resend } from "../lib/resend";
import VerificationEmail from "../../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifiedCode: string
): Promise<ApiResponse> {
  try {
    const res = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Mystery Message | Verification Code",
      react: VerificationEmail({ username, otp: verifiedCode }),
    });

    return { success: true, message: "Verification email send successfully" };
  } catch (emailErr) {
    console.error("error sending verification email", emailErr);
    return { success: false, message: "Failed to send verification email" };
  }
}
