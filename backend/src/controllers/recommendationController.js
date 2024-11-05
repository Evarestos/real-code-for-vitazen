const recommendationService = require('../services/recommendationService');

exports.getRecommendations = async (req, res) => {
  try {
    const { userId } = req.params;
    const recommendations = await recommendationService.getRecommendations(userId);
    res.json(recommendations);
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({ message: 'Error getting recommendations' });
  }
};

exports.initializeContentBasedFiltering = async (req, res) => {
  try {
    await recommendationService.initializeContentBasedFiltering();
    res.json({ message: 'Content-based filtering initialized successfully' });
  } catch (error) {
    console.error('Error initializing content-based filtering:', error);
    res.status(500).json({ message: 'Error initializing content-based filtering' });
  }
};

// Θα χρειαστούμε επίσης ένα endpoint για την εκπαίδευση του collaborative model,
// αλλά αυτό θα πρέπει να γίνεται σε ένα ξεχωριστό process λόγω του χρόνου που απαιτείται
