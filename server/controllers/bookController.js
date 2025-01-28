import expressAsyncHandler from "express-async-handler";
import  Book  from "../models/bookModel.js";


// _req is suggested when we are not refrenceing the request object
// req can be used but eslint will give a warning
// expressAsyncHandler is used to handle async errors
export const listBooks = expressAsyncHandler(async (_req, res) => {
    try{
        const books = await Book.find({});
        res.json(books);
    }catch (e) {
        res.status(500).json({ message: e.message });
    }
});

export const createBook = expressAsyncHandler(async (req, res) => {
    const {book_name, info} = req.body;

    try{
        const book = new Book({book_name,info});
        const createdBook = await book.save();
        res.status(201).json(createdBook);
    }catch (e) {
        res.status(500).json({ message: e.message });
    }
});

export const getBook = expressAsyncHandler(async (req, res) => {
    const id = req.params.id;

    // can also use req.query.id
    // can also use req.body

    try{
        const book = await Book.findById(id);
        if(book){
            res.json(book);
        }
        else{
            res.status(404).json({ message: "Book not found" });
        }
    }catch (e) {
        res.status(500).json({ message: e.message });
    }
});

export const booksByUser = expressAsyncHandler(async (req, res) => {
    const user = req.user;
    const id = user._id;
    try{
        const books = await Book.find({added_by:id});
        res.json(books);
    }catch (e) {
        res.status(500).json({ message: e.message });
    }
});