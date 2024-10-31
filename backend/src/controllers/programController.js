const Program = require('../models/Program');
const User = require('../models/User');
const { sendMessageToAI } = require('../services/aiService');
const cacheService = require('../services/cacheService');
const logger = require('../utils/logger');
const programService = require('../services/programService');

exports.getPersonalPrograms = async (req, res) => {
  try {
    const programs = await Program.find({ user: req.user.id });
    res.json(programs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createProgram = async (req, res) => {
  try {
    const program = new Program({
      ...req.body,
      user: req.user.id
    });
    await program.save();
    res.status(201).json(program);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateProgram = async (req, res) => {
  try {
    const program = await Program.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }
    res.json(program);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteProgram = async (req, res) => {
  try {
    const program = await Program.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }
    res.json({ message: 'Program deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.generateProgram = async (req, res) => {
  try {
    const generatedContent = await aiService.generateWellnessProgram(req.body.prompt);
    const program = new Program({
      user: req.user._id,
      content: generatedContent
    });
    await program.save();
    res.status(201).send(program);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.searchPrograms = async (req, res) => {
  try {
    const searchTerm = req.query.q;
    if (!searchTerm) {
      return res.status(400).send({ error: 'Απαιτείται όρος αναζήτησης' });
    }

    const programs = await Program.find({
      user: req.user._id,
      content: { $regex: searchTerm, $options: 'i' }
    });

    res.send(programs);
  } catch (error) {
    res.status(500).send();
  }
};

exports.getProgramDetails = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);

    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }

    // Έλεγχος αν ο χρήστης είναι ο ιδιοκτήτης του προγράμματος
    if (program.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(program);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserPrograms = async (req, res) => {
  try {
    const { userId } = req.user;
    const programs = await programService.getUserPrograms(userId);
    res.json(programs);
  } catch (error) {
    console.error('Σφάλμα στο getUserPrograms endpoint:', error);
    res.status(500).json({ error: 'Εσωτερικό σφάλμα διακομιστή' });
  }
};

exports.getProgramById = async (req, res) => {
  try {
    const { id } = req.params;
    const program = await programService.getProgramById(id);
    res.json(program);
  } catch (error) {
    console.error('Σφάλμα στο getProgramById endpoint:', error);
    if (error.message === 'Το πρόγραμμα δεν βρέθηκε') {
      res.status(404).json({ error: 'Το πρόγραμμα δεν βρέθηκε' });
    } else {
      res.status(500).json({ error: 'Εσωτερικό σφάλμα διακομιστή' });
    }
  }
};

exports.getProgramsByCategory = async (req, res) => {
  try {
    const { userId } = req.user;
    const { category } = req.params;
    const programs = await programService.getProgramsByCategory(userId, category);
    res.json(programs);
  } catch (error) {
    console.error('Σφάλμα στο getProgramsByCategory endpoint:', error);
    res.status(500).json({ error: 'Εσωτερικό σφάλμα διακομιστή' });
  }
};

exports.toggleFavorite = async (req, res) => {
  try {
    const program = await Program.findOne({ _id: req.params.id, user: req.user.id });
    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }
    program.isFavorite = !program.isFavorite;
    await program.save();
    res.json(program);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.addProgress = async (req, res) => {
  try {
    const program = await Program.findOne({ _id: req.params.id, user: req.user.id });
    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }
    program.progress.push(req.body);
    await program.save();
    res.json(program);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.shareProgram = async (req, res) => {
  try {
    const program = await Program.findOne({ _id: req.params.id, user: req.user.id });
    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }
    // Implement sharing logic here (e.g., generate a share link)
    const shareLink = `${process.env.FRONTEND_URL}/shared-program/${program._id}`;
    res.json({ shareLink });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
