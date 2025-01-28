import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";

// this is a secret key to create a jwt token
const userSecret = "SECRET123";

export const userGenerateToken = (id) => {
	return jwt.sign({ id}, userSecret, {
		expiresIn: "1d",// the token will expire in 1 day
	});
};


export const userProtectBearer = asyncHandler(async (req, res, next) => {
    let token = req.headers.authorization;
	// console.log("token", token);
	//extracting token from req headers 

	// "Bearer token"

    if (!token) {
		// if no token is provided we reject the request
        return res.status(401).json({ message: "No token, authorization denied" });
    }
	if (req.headers.authorization?.startsWith("Bearer")) {

    try {
			token = req.headers.authorization.split(" ")[1];
		// decode token to get user id

        const decoded_token = jwt.verify(token, userSecret);
		// the decode token the user id is stored
		
		//  decode -> {id: "ObjectId" , userName: "username"}

        req.user = await User.findById(decoded_token.id).select("-password");
    
		// console.log("req.user", req.user);
        next();
    } catch (error) {
		console.log(error);
        res.status(401);
        throw new Error("Not authorized, token failed");
    }}else{
		res.status(401);
		throw new Error("Not authorized, No token");
	}
});


export const userProtectCookie = asyncHandler(async (req, res, next) => {
	const accessToken = req.cookies.accessToken;
	console.log("accessToken", accessToken);
	if (!accessToken) {
		return res.status(401).json({ message: "No token, authorization denied" });
	}

	//user request give token and bearer
	try {
		//decode token user id
		const decoded = jwt.verify(accessToken, userSecret);

		//find user by id without password => .select("-password")
		req.user = await User.findById(decoded.id).select("-password");
		console.log("req.user", req.user);
		next();
	} catch (error) {
		console.log(error);
		res.status(401);
		throw new Error("Not authorized, TOKEN FAILED");
	}
});


