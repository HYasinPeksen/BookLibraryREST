import { Request, Response } from 'express';
import { BookModel } from '../models/bookModel';
import { UserModel, User } from '../models/userModel';

export async function getAllBooks(req: Request, res: Response) {
	try {
		const books = await BookModel.find();
		res.json(
			books.map((book) => {
				return { id: book.id, name: book.name };
			})
		);
	} catch (error) {
		// Error handling for now
		res.status(500).json({ error: error });
	}
}

export async function getBook(req: Request, res: Response) {
	const id = req.params.id;
	try {
		const book = await BookModel.findById(id);
		const users = await UserModel.find().where('books.past.book', id);
		let score = '10';
		if (!book) {
			return res
				.status(500)
				.json({ error: 'Could not found a book with given Id.' });
		}

		// Find all books users have returned, calculate avarage
		if (users.length) {
			let scores: number[] = [];
			users.forEach((user) => {
				user.books.past
					.filter((past) => past.book == id)
					.forEach((past) => scores.push(past.userScore));
			});

			// Get the avarage by sum of all divided by length and make it only 1 decimal place
			score = (
				scores.reduce((prev, curr) => prev + curr) / scores.length
			).toFixed(1);
		}

		// BookModel to wanted Json type
		const result = {
			id: book.id,
			name: book.name,
			score: score,
		};
		res.json(result);
	} catch (error) {
		// Error handling
		res.status(500).json({ error: error });
	}
}

export async function createBook(req: Request, res: Response) {
	try {
		const name = req.body.name;
		const book = new BookModel({ name, borrowered: false });
		await book.save();
		res.sendStatus(200);
	} catch (error) {
		// Error handling for now
		res.status(500).json({ error: error });
	}
}
