import { NextRequest, NextResponse } from "next/server";
import connectionToDatabase from "@/lib/db";
import User from "@/models/User";

export async function POST(request: Request) {
  //get data

  try {
    const { email, password } = await request.json();

    //validation
    if (!email || !password) {
      return NextResponse.json(
        {
          error: "Email and Password are required",
        },
        { status: 400 }
      );
    }

    await connectionToDatabase();

    //exting User
    const existingUser = await User.findOne(email);
    if (existingUser) {
      return NextResponse.json(
        {
          error: "User already exist with this email",
        },
        { status: 409 }
      );
    }

    //create user

    const user = await User.create({
      email,
      password,
    });
    //return reponse

    return NextResponse.json(
      {
        message: "user created successfully",
        user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Registration Failed");
    return NextResponse.json(
      {
        error: "failed to register user",
      },
      { status: 400 }
    );
  }
}
