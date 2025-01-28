import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import http from "http";
import * as routes from "./routes/index.js";

//creating a express app.
const app = express();
//loading environment variables.
dotenv.config();

//creating a server. this is requried for express to listen to specific port.
const server = http.createServer(app);

const port = process.env.PORT;

//connecting to database.
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("Database connected successfully");
    app.listen(port, () => {
        console.log("Server started at port ", port);
    })
}).catch((error) => {
    console.log("Error : ", error.message);
})

// adding morgan middleware for logging.
app.use(morgan());

// adding helmet middleware for security.
app.use(helmet());

// adding cookie parser middleware this is requried when we work with cookies.
app.use(cookieParser());
// adding body parser middleware for parsing the request body. we can use express

app.use(bodyParser.json()); //express.json() is alternative to bodyParser.json()
app.use(bodyParser.urlencoded({ extended: true })); //express.urlencoded() is alternative to bodyParser.urlencoded()
app.use(bodyParser.text()); //express.text() is alternative to bodyParser.text()

// adding cors middleware for enabling cross origin requests.
// www.abc.com -> api.abc.com
app.use(cors(
    {
        origin:['*'],
        credentials:true
    }
));

// adding routes to the app.
app.use("/api", routes.baseRoutes);
app.use("/api/books", routes.bookRoutes);

// starting the server. with port 3000 which is defined in .env file.
server.listen(port, () => {
 console.log(`Server is running on port ${port}`);
});
