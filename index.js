import express from 'express';
const app = express();

import dotenv from 'dotenv';
dotenv.config();

// Middleware for parsing JSON bodies
app.use(express.json());

import { registerUser, loginUser } from './controller/user_controller.js';

// User Registration Endpoint
app.post('/register', async (req, res, next) => {
      registerUser(req,res,next);
});

// User Login Endpoint
app.post('/login', async (req, res, next) => {
      loginUser(req, res, next);
});

const PORT = process.env.PORT || 1122;

app.listen(PORT,()=>{
      console.log(' Server is listening on port '+PORT)
})