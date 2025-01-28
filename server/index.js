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

const app = express();
dotenv.config();
const server = http.createServer(app);

const port = process.env.PORT;

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("Database connected successfully");
    app.listen(port, () => {
        console.log("Server started at port ", port);
    })
}).catch((error) => {
    console.log("Error : ", error.message);
})

app.use(morgan());
app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());

app.use(cors(
    {origin:['*'],credentials:true}
));

app.use("/api", routes.baseRoutes);
app.use("/api/books", routes.bookRoutes);

server.listen(port, () => {
 console.log(`Server is running on port ${port}`);
});
