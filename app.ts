import express from 'express';
import { apiRouter } from './routes';
import { Database } from './db';

const app = express();
const port = 3000; // Port number as seen on PostMan request

// Configure bodyparser to handle post requests
app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	})
);

// Connect to database
Database.getInstance().connect();

// Use router from 'routes.ts' file
app.use('/', apiRouter);

// Start the Express server
app.listen(port, () => {
	console.log(`Server started at http://localhost:${port}`);
});
