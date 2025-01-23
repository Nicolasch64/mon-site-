const express = require("express");
const Order = require("../model/Order");
const Product = require("../model/Product");
const router = express.Router();

// Route pour passer une commande
router.post("/placeOrder", async (req, res) => {
	try {
		const {
			customerName,
			customerEmail,
			customerPhone,
			shippingAddress,
			orderItems,
		} = req.body;

		// Calculer le montant total de la commande
		let totalAmount = 0;
		const products = [];

		for (const item of orderItems) {
			const product = await Product.findById(item.productId);
			if (!product) {
				return res.status(404).json({ message: "Produit non trouvé" });
			}

			// Ajouter le produit au tableau des produits et calculer le total
			products.push({
				product: product._id,
				quantity: item.quantity,
				price: product.price,
			});
			totalAmount += product.price * item.quantity;
		}

		// Créer une nouvelle commande
		const order = new Order({
			customerName,
			customerEmail,
			customerPhone,
			shippingAddress,
			products,
			totalAmount,
		});

		// Sauvegarder la commande
		await order.save();

		res.status(201).json({ message: "Commande passée avec succès", order });
	} catch (err) {
		console.error(err);
		res.status(500).json({
			message: "Une erreur est survenue lors de la commande",
			error: err.message,
		});
	}
});

module.exports = router;
