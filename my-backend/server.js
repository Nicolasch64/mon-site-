// server.js
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(bodyParser.json());

mongoose
	.connect("mongodb://localhost:27017/purchaseDB", {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("Connected to MongoDB"))
	.catch((error) => console.log("Error connecting to MongoDB:", error));

const Purchase = mongoose.model(
	"Purchase",
	new mongoose.Schema({
		name: String,
		email: String,
		address: String,
		paymentMethod: String,

		price: Number,
	})
);

app.post("/submit", async (req, res) => {
	const { name, email, address, paymentMethod, price } = req.body;

	const purchase = new Purchase({
		name,
		email,
		address,
		paymentMethod,

		price,
	});

	try {
		await purchase.save();
		res.status(200).json({ message: "Purchase recorded successfully!" });
	} catch (error) {
		res.status(500).json({ message: "Error saving purchase data" });
	}
});

app.listen(5000, () => {
	console.log("Server is running on http://localhost:5000");
});
