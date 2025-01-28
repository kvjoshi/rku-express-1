import expressAsyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import { userGenerateToken } from "../middlewares/userProtect.js";

export const loginUser = expressAsyncHandler(async (req, res) => {
    const {email, password} = req.body;
    try{
        const user = await User.findOne({email});

		const cookieArgs = {
			httpOnly: false,
			secure: true,
			sameSite: "none",
			maxAge: 2 * 60 * 60 * 1000, // 2 hours
		};
        if(user){
            if( (await user.matchPassword(password))) {
            const token = userGenerateToken(user._id);
            res.cookie("accessToken", token, cookieArgs);
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: token,
            });
        }
        else{
            res.status(401).json({ message: "Invalid password" });
        }
    }
    else{
            res.status(404).json({ message: "User not found" });
        }
    }catch (e) {
        res.status(500).json({ message: e.message });
    }
})

export const createUser = expressAsyncHandler(async (req, res) => {
    const {name, email, password} = req.body;
    try{
        const user = new User({name, email, password});
        const createdUser = await user.save();
        res.status(201).json(createdUser);
    }catch (e) {
        res.status(500).json({ message: e.message });
    }
});

export const getUser = expressAsyncHandler(async (req, res) => {
    // const id = req.params.id;
    const user = req.user;
    const id = user._id;
    try{
        const user = await User.findById(id);
        if(user){
            res.json(user);
        }
        else{
            res.status(404).json({ message: "User not found" });
        }
        }catch (e){
            res.status(500).json({ message: e.message });
        }
})

export const listUsers = expressAsyncHandler(async (_req, res) => {
    try{
        const users = await User.find({});
        res.json(users);
    }catch (e) {
        res.status(500).json({ message: e.message });
    }
})