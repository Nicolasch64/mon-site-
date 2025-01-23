// server.js
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");

require("dotenv").config();

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
		productName: String,
		price: Number,
		date: { type: Date, default: Date.now },
	})
);

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: "chapellen10@gmail.com",
		pass: "bikz bbsy ttok bbdk ",
	},
});
const sendEmail = (to, subject, text, html) => {
	const mailOptions = {
		from: "chapellen10@gmail.com",
		to,
		subject,
		text,
		html,
	};

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.log("Error:", error);
		} else {
			console.log("Email sent: " + info.response);
		}
	});
};
app.post("/submit", async (req, res) => {
	const { name, email, address, paymentMethod, productName, price } = req.body;

	const purchase = new Purchase({
		name,
		email,
		address,
		paymentMethod,
		productName,
		price,
	});

	try {
		const savedPurchase = await purchase.save();
		const userMessage = `
		<h3>Merci beacoup pour votre commande,${name}</h3>
		<p>j'ai bien reçu votre commande pour "${productName}"</p>
		<p>Prix:${price}€</p>
		<p>Adresse de livraison:${address}</p>
		<p>Méthode de paiment:${paymentMethod}</p>
		<p>Je vous envoie un e-mail lorsque votre commande sera expédiée.Merci encore pour votre soutien</p>`;

		sendEmail(
			email,
			"Confirmation de votre commande",
			"Merci beaucoup pour votre achat et votre soutien!",
			userMessage
		);

		const adminMessage = `
<h3>Nouvelle vente</h3>
			<p>Un utilisateur a acheté  "${productName}".</p>
			<p><strong>Nom:</strong> ${name}</p>
			<p><strong>Email:</strong> ${email}</p>
			<p><strong>Adresse de livraison:</strong> ${address}</p>
			<p><strong>Prix:</strong> ${price} €</p>
			<p><strong>Méthode de paiement:</strong> ${paymentMethod}</p>
		`;
		sendEmail(
			"chapellen10@gmail.com",
			"Nouvelle vente",
			"Une nouvelle vente a été effectuée",
			adminMessage
		);

		res.status(200).json({
			message: "Purchase recorded successfully!",
			date: savedPurchase.date,
		});
	} catch (error) {
		res.status(500).json({ message: "Error saving purchase data" });
	}
});

app.listen(5001, () => {
	console.log("Server is running on http://localhost:5001");
});
