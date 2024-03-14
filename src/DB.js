require('dotenv').config();
const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = process.env.PORT || 3001;
const cors = require("cors");

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://user:pass@cluster0.tin9cy0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverApi: ServerApiVersion.v1,
});

async function startServer() {
	try {
		await client.connect();
		console.log("Database connection successful");
		const db = client.db("wallets");

		app.post("/vote", async (req, res) => {
			try {
				const votes = db.collection("votes");

				const doc = {
					signerAddress: req.body.signerAddress,
					voteFor: req.body.voteFor,
					timestamp: new Date(),
				};

				await votes.insertOne(doc);
				res.status(200).json({ message: "Vote recorded" });
			} catch (err) {
				console.error("Error recording vote:", err);
				res.status(500).json({ error: "Error recording vote", details: err.message });
			}
		});

		app.get("/", (req, res) => {
			res.send("Server is up and running!");
		});

		app.listen(port, () => {
			console.log(`Server running on port ${port}`);
		});

	} catch (err) {
		console.error('Database connection failed', err);
		process.exit();
	}
}

startServer();
