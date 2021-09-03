import { Schema, model } from 'mongoose';

// Create an interface representing a document in MongoDB
export interface Book {
	name: string;
	borrowered: boolean;
}

// Create a Schema corresponding to the document interface
export const BookSchema = new Schema<Book>({
	name: { type: String, required: true },
	borrowered: Boolean,
});

// 3. Create a Model.
export const BookModel = model<Book>('Book', BookSchema);
