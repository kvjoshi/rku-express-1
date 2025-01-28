import expressAsyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import { userGenerateToken } from "../middlewares/userProtect.js";


// login request controller function
export const loginUser = expressAsyncHandler(async (req, res) => {
    const {email, password} = req.body;
    try{
        //first check if email exists 
        const user = await User.findOne({email});

		const cookieArgs = {
			httpOnly: false,
			secure: true,
			sameSite: "none",
			maxAge: 2 * 60 * 60 * 1000, // 2 hours
		};

        if(user){
            //use schema method matchPassword to compare password

            if( (await user.matchPassword(password))) {
            // create token (JWT) and send it to the user
                const token = userGenerateToken(user._id , user.userName);
            //this is a server side cookie this is not going to be accessible by the client application
            //this is a secure way to store the token
                res.cookie("accessToken", token, cookieArgs);
            
                res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                //token added here needs to be managed mannually by the client app
                // for bearer token authentication. needs to be added to authorization header
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
    // sendinng everything in body and in plaintext
    try{
        // saveing this as plaintext
        const user = new User({name, email, password});

        // now we call save method on the user object , password is automatically hashed and stored
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
    res.send(user);
    //if im addign the user object to the request object then i can access it here
    
    // try{
    //     const user = await User.findById(id);
    //     if(user){
    //         res.json(user);
    //     }
    //     else{
    //         res.status(404).json({ message: "User not found" });
    //     }
    //     }catch (e){
    //         res.status(500).json({ message: e.message });
    //     }
})

export const listUsers = expressAsyncHandler(async (_req, res) => {
    try{
        const users = await User.find({});
        res.json(users);
    }catch (e) {
        res.status(500).json({ message: e.message });
    }
})