const Experiment = require('../models/Experiment');
const externalDataService = require('./externalDataService');
const advancedAnalysisService = require('./advancedAnalysisService');

class ExperimentSuggestionService {
  async generateSuggestions(userId) {
    const pastExperiments = await Experiment.find({ user: userId, status: 'completed' });
    const suggestions = [];

    for (const experiment of pastExperiments) {
      const analysis = await advancedAnalysisService.performAdvancedAnalysis(experiment._id);
      const externalData = await externalDataService.getExternalData(experiment.location, experiment.startDate);
      
      const suggestion = this.createSuggestionFromAnalysis(experiment, analysis, externalData);
      if (suggestion) {
        suggestions.push(suggestion);
      }
    }

    return this.rankAndFilterSuggestions(suggestions);
  }

  createSuggestionFromAnalysis(experiment, analysis, externalData) {
    // Λογική για τη δημιουργία προτάσεων βάσει της ανάλυσης και των εξωτερικών δεδομένων
    // Αυτό θα μπορούσε να περιλαμβάνει:
    // - Προτάσεις για βελτίωση των παραλλαγών που απέδωσαν καλά
    // - Νέες ιδέες βασισμένες σε τάσεις από τα εξωτερικά δεδομένα
    // - Συνδυασμούς επιτυχημένων στοιχείων από διαφορετικά πειράματα
    
    // Παράδειγμα:
    if (analysis.conversionRate > 0.1 && externalData.weather.condition === 'sunny') {
      return {
        type: 'variation',
        baseExperiment: experiment._id,
        description: `Δοκιμάστε μια παραλλαγή του "${experiment.name}" που στοχεύει σε ηλιόλουστες ημέρες`,
        suggestedChanges: [
          { type: 'targeting', value: 'weather.condition = sunny' },
          { type: 'content', value: 'Προσθέστε εικόνες με ηλιόλουστα τοπία' }
        ]
      };
    }

    return null;
  }

  rankAndFilterSuggestions(suggestions) {
    // Λογική για την κατάταξη και το φιλτράρισμα των προτάσεων
    // Αυτό θα μπορούσε να βασίζεται σε παράγοντες όπως:
    // - Πιθανότητα επιτυχίας
    // - Δυνητικός αντίκτυπος
    // - Ευκολία υλοποίησης
    
    return suggestions
      .sort((a, b) => this.calculatePotentialImpact(b) - this.calculatePotentialImpact(a))
      .slice(0, 5); // Επιστροφή των top 5 προτάσεων
  }

  calculatePotentialImpact(suggestion) {
    // Λογική για τον υπολογισμό του δυνητικού αντίκτυπου μιας πρότασης
    // Αυτό θα μπορούσε να βασίζεται σε ιστορικά δεδομένα, τύπο πρότασης, κλπ.
    // ...
  }
}

module.exports = new ExperimentSuggestionService();
