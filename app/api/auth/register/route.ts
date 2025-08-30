// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '@/models/user';

async function connectDB() {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.DATABASE_URL as string);
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { firstName, lastName, email, password } = await request.json();
    
    // Validation
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }
    
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User already exists with this email" },
        { status: 400 }
      );
    }
    
    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create user
    const user = new User({
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      email,
      password: hashedPassword,
      provider: 'local',
      isActive: true
    });
    
    await user.save();
    
    return NextResponse.json(
      { 
        success: true, 
        message: "User registered successfully",
        user: {
          id: user._id,
          email: user.email,
          name: user.name
        }
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}