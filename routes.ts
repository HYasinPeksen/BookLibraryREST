import express from 'express';
import * as userController from './controllers/userController'
import * as bookController from './controllers/bookController'

const apiRouter = express.Router();

// Get users & Create a user
apiRouter.route('/users')
	.get(userController.getAllUsers)
	.post(userController.createUser);

// Get books & Create a book
apiRouter.route('/books')
	.get(bookController.getAllBooks)
	.post(bookController.createBook);

// Borrow a book (userId and bookId in params)
apiRouter.post('/users/:user_id/borrow/:book_id', userController.borrowBook);

// Return a book (userId and bookId in params)
apiRouter.post('/users/:user_id/return/:book_id', userController.returnBook);

// Find a book with given id
apiRouter.get('/books/:id', bookController.getBook);

// Find a user with given id
apiRouter.get('/users/:id', userController.getUser);

export { apiRouter };
