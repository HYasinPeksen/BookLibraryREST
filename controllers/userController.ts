import { Request, Response } from 'express';
import { BookModel } from '../models/bookModel';
import { UserModel, User } from '../models/userModel';

export async function getAllUsers(req: Request, res: Response) {
	try {
		const users = await UserModel.find();
		res.json(
			users.map((user) => {
				return { id: user.id, name: user.name };
			})
		);
	} catch (error) {
		// Error handling for now
		res.status(500).json({ error: error });
	}
}

export async function getUser(req: Request, res: Response) {
	const id = req.params.id;
	try {
		const user = await UserModel.findById(id)
			.populate('books.past.book')
			.populate('books.present.book');
		if (!user) {
			return res
				.status(500)
				.json({ error: 'Could not found a user with given Id.' });
		}

		// BookModel to wanted Json type
		const result = {
			id: user.id,
			name: user.name,
			books: {
				past: user.books.past.map((past) => {
					return {
						name: past.book.name,
						userScore: past.userScore,
					};
				}),
				present: user.books.present.map((present) => {
					return {
						name: present.book.name,
					};
				}),
			},
		};
		res.json(result);
	} catch (error) {
		// Error handling (for now)
		res.status(500).json({ error: error });
	}
}

export async function createUser(req: Request, res: Response) {
	try {
		const name = req.body.name;
		const user = new UserModel({ name, books: { past: [], present: [] } });
		await user.save();
		res.sendStatus(200);
	} catch (error) {
		// Error handling for now
		res.status(500).json({ error: error });
	}
}

export async function borrowBook(req: Request, res: Response) {
	try {
		// Destructuring declaration
		const { user_id, book_id } = req.params;
		const book = await BookModel.findById(book_id);
		if (!book) {
			return res
				.status(404)
				.json({ error: 'Could not found a book with given Id.' });
		}
		const user = await UserModel.findById(user_id);
		if (!user) {
			return res
				.status(404)
				.json({ error: 'Could not found a user with given Id.' });
		}
		if (book.borrowered) {
			return res
				.status(403)
				.json({ error: 'You can not borrow this book right now.' });
		}
		book.borrowered = true;
		user.books.present.push({ book: book._id });
		await book.save();
		await user.save();
		res.sendStatus(200);
	} catch (error) {
		// Error handling
		res.status(500).json({ error: error });
	}
}

export async function returnBook(req: Request, res: Response) {
	try {

		// Destructuring declaration
		const { user_id, book_id } = req.params;
		const score = req.body.score;
		const user = await UserModel.findById(user_id);
		if (!user) {
			return res
				.status(404)
				.json({ error: 'Could not found a user with given Id.' });
		}

		// User doesn't have the book
		if (!user.books.present.some(present => present.book == book_id)) {
			return res
				.status(403)
				.json({ error: 'User does\'t have that book.' });
		}

		const book = await BookModel.findById(book_id);
		if (!book) {
			return res
				.status(404)
				.json({ error: 'Could not found a book with given Id.' });
		}
		// Book returned
		book.borrowered = false;
		// Delete book drom present
		user.books.present = user.books.present = user.books.present.filter(
			(p, index) => p.book != book_id
		);
		// Add to past
		user.books.past.push({ book: book_id, userScore: score });
		await book.save();
		await user.save();
		res.sendStatus(200);
	} catch (error) {
		// Error handling
		res.status(500).json({ error: error });
	}
}
