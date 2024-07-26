import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/app/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await request.json();
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingUserVerifiedByUsername) {
      return Response.json(
        { success: false, message: "Username already taken" },
        { status: 400 }
      );
    }
    const existingUserByEmail = await UserModel.findOne({ email });
    const verifiedCode = Math.floor(
      1000000 + Math.random() * 9000000
    ).toString();
    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exists with this email",
          },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifiedCode = verifiedCode;
        existingUserByEmail.verifiedCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    } else {
      const hashPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
      const newUser = new UserModel({
        username,
        email,
        password: hashPassword,
        verifiedCode,
        verifiedCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });
      await newUser.save();
    }
    // send verification email
    const emailRes = await sendVerificationEmail(email, username, verifiedCode);
    if (!emailRes.success) {
      return Response.json(
        {
          success: false,
          message: emailRes.message,
        },
        { status: 500 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "User registered successfully, please verified your email",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering user", error);
    return Response.json(
      {
        success: false,
        message: "Error Registering User",
      },
      {
        status: 500,
      }
    );
  }
}
