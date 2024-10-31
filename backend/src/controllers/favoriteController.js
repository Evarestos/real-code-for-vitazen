const Favorite = require('../models/Favorite');
const Content = require('../models/Content');

exports.addFavorite = async (req, res) => {
  try {
    const { userId, contentId } = req.body;
    const favorite = new Favorite({ userId, contentId });
    await favorite.save();
    res.status(201).json({ message: 'Προστέθηκε στα αγαπημένα' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Το περιεχόμενο είναι ήδη στα αγαπημένα' });
    }
    res.status(500).json({ message: 'Σφάλμα κατά την προσθήκη στα αγαπημένα' });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    const { userId, contentId } = req.params;
    await Favorite.findOneAndDelete({ userId, contentId });
    res.json({ message: 'Αφαιρέθηκε από τα αγαπημένα' });
  } catch (error) {
    res.status(500).json({ message: 'Σφάλμα κατά την αφαίρεση από τα αγαπημένα' });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const { userId } = req.params;
    const favorites = await Favorite.find({ userId }).populate('contentId');
    res.json(favorites.map(fav => fav.contentId));
  } catch (error) {
    res.status(500).json({ message: 'Σφάλμα κατά την ανάκτηση των αγαπημένων' });
  }
};
