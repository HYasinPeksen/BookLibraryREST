import { Schema, model, PopulatedDoc, Document } from 'mongoose';
import { Book } from './bookModel';

// Create an interface representing a document in MongoDB
export interface User {
	name: string;
	books: {
		past: {
			book: PopulatedDoc<Book & Document>;
			userScore: number;
		}[];
		present: {
			book: PopulatedDoc<Book & Document>;
		}[];
	};
}

// Create a Schema corresponding to the document interface
export const UserSchema = new Schema<User>({
	name: { type: String, required: true },
	books: {
		past: [
			{
				book: { type: 'ObjectId', ref: 'Book' },
				userScore: Number,
			},
		],
		present: [
			{
				book: { type: 'ObjectId', ref: 'Book' },
			},
		],
	},
});

// 3. Create a Model.
export const UserModel = model<User>('User', UserSchema);
