import User from '../Models/modelUser.js'
import jwt from 'jsonwebtoken'
import { z } from "zod";
export async function CreateUser(req, res) {
    try {
      // Define the Zod schema
      const userSchema = z.object({
        username: z.string().min(3).max(15),
        email: z.string().email(),
        password: z.string().min(6), // You can adjust this as needed
      });
  
      // Validate the request body using Zod
      const validatedData = userSchema.parse(req.body);  
      // Extract validated fields
      const { username, email, password } = validatedData;
      // Check if the username already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(422).json({ message: "Username already taken. Please choose a different one." });
      }
  
      // Create and save the new user
      const newUser = new User({ username, email, password });
      await newUser.save();
  
      // Respond with success message
      res.status(201).json({ message: "User successfully created." });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(422).json({ message: `Invalid request data: ${error.errors[0].path}` , errors: error.errors[0].message});
      }
      // General error handling
      return res.status(500).json({ message: `Internal server error: ${error.message}` });
    }
  }

export async function GetUser() {
    try {
        const { id } = req.params
        const item = await User.findById(id)
        if(!item){
            return res.status(422).json({message:"id is not found"})
        }
        return res.status(200).json({item})
    } catch (error) {
        return res.status(422).json({message:"problem required"})
    }
    
}

// export async function Signin(req,res) {
//     try {
//         const loginschema = z.object({
//           username: z.string().min(3).max(15),
//           password: z.string().min(6),
//         })
//         const validate = loginschema.parse(req.body)
//         const {username, password} = validate
//         if(!username || !password){
//             return res.status(422).json({message:"body is not required"})
//         }
//         const verify = await User.findOne({username})
//         if(!verify){
//             return res.status(422).json({message:"user or password is not correct"})
//         }
//         if(!verify.password){
//             return res.status(422).json({message:"user or password is not correct"})
//         }
//         const token = jwt.sign({user : username},process.env.SECRET_KEY,{expiresIn:"1h"})

//         return res.status(200).json({message:"login is ok!",token})
//     } catch (error) {
//       if (error instanceof z.ZodError) {
//         return res.status(422).json({ message: `Invalid request data: ${error.errors[0].path}` , errors: error.errors[0].message});
//       }
//         return res.status(422).json({message:`error: ${error}`})
//     }
// }

export async function Signin(req, res) {
  try {
      const loginschema = z.object({
          username: z.string().min(3).max(15),
          password: z.string().min(6),
      });
      
      const validate = loginschema.parse(req.body);
      const { username, password } = validate;
      
      if (!username || !password) {
          return res.status(422).json({ message: "Username and password are required" });
      }

      const user = await User.findOne({ username });
      if (!user) {
          return res.status(401).json({ message: "Invalid credentials" });
      }

      // Assuming you have a method to verify password (e.g., using bcrypt)
      if (!user.password) {
          return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
          { userId: user._id, username: user.username },
          process.env.SECRET_KEY,
          { expiresIn: "1h" }
      );

      // Set HTTP-only secure cookie with the token
      res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.SECRET_COOKIES// HTTPS only in production
          // sameSite: 'strict', // Prevent CSRF
          // maxAge: 3600000, // 1 hour (matches token expiry)
          // path: '/', // Accessible across all routes
      });

      return res.status(200).json({
          message: "Login successful!",
          user: {
              username: user.username,
              displayName: user.displayName,
              // Other non-sensitive user data
          }
      });

  } catch (error) {
      if (error instanceof z.ZodError) {
          return res.status(422).json({ 
              message: `Validation error: ${error.errors[0].path}`,
              error: error.errors[0].message
          });
      }
      console.error('Login error:', error);
      return res.status(500).json({ message: "Internal server error" });
  }
}





// export const Profile = (req,res) => {
//     const user = req.cookie()
// }