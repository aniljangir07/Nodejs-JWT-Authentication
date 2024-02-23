
import bcrypt from "bcrypt";
import jwt  from 'jsonwebtoken';
import fs from 'fs';
import responseMessage from "../constants/message.js";
import statusCode from "../constants/status.js"

import dotenv from 'dotenv';
dotenv.config();

const USER_FILE_PATH = 'user.json';

export const registerUser = async (req,res,next)=>{
      
      try {
            const { username, password } = req.body;

            if (!username || !password) return res.status(400).json({ message: 'Username and password are required' });

            // Read user data from file
            let users = [];
            if (fs.existsSync(USER_FILE_PATH)) {
                  const userData = fs.readFileSync(USER_FILE_PATH, 'utf8');

                  // Check if userData is not empty
                  if (userData.trim() !== '') users = JSON.parse(userData);
            };

            if (users.find(user => user.username === username)) return res.status(statusCode.BAD_REQUEST).json({ message: responseMessage.ALREADY_EXIST });

            const hashedPassword = await bcrypt.hash(password, 10);

            // Save user to file
            users.push({ username, password: hashedPassword });
            fs.writeFileSync(USER_FILE_PATH, JSON.stringify(users));

            res.status(statusCode.SUCCESS).json({ message: responseMessage.REGSITERATION_SUCCESSFULL });
      } catch (error) {
            console.error('Error registering user:', error);
            res.status(statusCode.ERROR).json({ message: responseMessage.INTERNAL_SERVER_ERR });
      };
};

export const loginUser = async (req,res,next)=>{
      try {
            const { username, password } = req.body;

            // Check if username and password are provided
            if (!username || !password) {
                  return res.status(statusCode.BAD_REQUEST).json({ message: 'Username and password are required' });
            }

            // Read user data from file
            let users = [];
            if (fs.existsSync(USER_FILE_PATH)) {
                  users = JSON.parse(fs.readFileSync(USER_FILE_PATH, 'utf8'));
            }

            // Find user in the file
            const user = users.find(user => user.username === username);
            if (!user) return res.status(statusCode.UNAUTHORIZED).json({ message: responseMessage.UNAUTHORIZED });

            // Compare passwords
            if (!await bcrypt.compare(password, user.password)) return res.status(statusCode.UNAUTHORIZED).json({ message: responseMessage.UNAUTHORIZED });

            // Generate JWT token
            const secretKey = process.env.SECRET_KEY;
            const token = jwt.sign({ username }, secretKey);

            res.json({ token });
      } catch (error) {
            console.error('Error logging in:', error);
            res.status(statusCode.ERROR).json({ message: responseMessage.INTERNAL_SERVER_ERR });
      }
};