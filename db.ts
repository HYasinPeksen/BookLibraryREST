import mongoose from 'mongoose';

export class Database {
	private static instance: Database; // Singleton
	connect() {
		mongoose.connect('mongodb://localhost/BookLibraryAPI', (err) => {
			// Test purposes
			if (err) console.error(err);
		});

		// Test purposes
		mongoose.connection.on('open', () => {
			console.log('Connected to MongoDB database.');
		});
		mongoose.connection.on('error', (err) => {
			console.log('Database connection error: ', err);
		});
	}

	// Singeton so only one instance can be created (OOP)
	// Memory and CPU optimization
	public static getInstance(): Database {
		if (!Database.instance) {
			Database.instance = new Database();
		}

		return Database.instance;
	}
}
