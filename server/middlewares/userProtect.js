const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

const userSecret = "SECRET123";

export const userGenerateToken = (id) => {
	return jwt.sign({ id }, userSecret, {
		expiresIn: "1d",
	});
};


export const userProtectBearer = asyncHandler(async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }
    try {
        const decoded = jwt.verify(token, userSecret);
        req.user = await User.findById(decoded.id).select("-password");
        console.log("req.user", req.user);
        next();
    } catch (error) {
        res.status(401);
        throw new Error("Not authorized, token failed");
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


