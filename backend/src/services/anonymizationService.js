const crypto = require('crypto');

class AnonymizationService {
  anonymizeData(data) {
    const anonymizedData = { ...data };
    
    // Ανωνυμοποίηση προσωπικών δεδομένων
    if (anonymizedData.userInfo) {
      anonymizedData.userInfo.id = this.hashValue(anonymizedData.userInfo.id);
      anonymizedData.userInfo.email = this.hashValue(anonymizedData.userInfo.email);
      // Αφαίρεση άλλων προσωπικών στοιχείων
      delete anonymizedData.userInfo.name;
      delete anonymizedData.userInfo.age;
    }

    // Ανωνυμοποίηση δεδομένων συμπεριφοράς
    if (anonymizedData.behavioralData) {
      anonymizedData.behavioralData = anonymizedData.behavioralData.map(item => ({
        ...item,
        userId: this.hashValue(item.userId),
        // Διατήρηση μόνο των απαραίτητων πληροφοριών
        timestamp: item.timestamp,
        action: item.action
      }));
    }

    return anonymizedData;
  }

  hashValue(value) {
    return crypto.createHash('sha256').update(value).digest('hex');
  }
}

module.exports = new AnonymizationService();
