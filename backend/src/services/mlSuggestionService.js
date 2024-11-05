const tf = require('@tensorflow/tfjs');

// Υποθετικό μοντέλο για προτάσεις
let model;

// Συνάρτηση για τη δημιουργία και εκπαίδευση του μοντέλου
const createAndTrainModel = async (trainingData) => {
  model = tf.sequential();
  model.add(tf.layers.dense({ units: 64, activation: 'relu', inputShape: [10] }));
  model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 5, activation: 'softmax' }));

  model.compile({ optimizer: 'adam', loss: 'categoricalCrossentropy', metrics: ['accuracy'] });

  const xs = tf.tensor2d(trainingData.inputs);
  const ys = tf.tensor2d(trainingData.outputs);

  await model.fit(xs, ys, {
    epochs: 100,
    batchSize: 32,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        console.log(`Epoch ${epoch}: loss = ${logs.loss}`);
      }
    }
  });

  xs.dispose();
  ys.dispose();
};

// Συνάρτηση για τη δημιουργία προτάσεων με βάση το μοντέλο
const generateMLSuggestions = async (userInfo, programInfo) => {
  if (!model) {
    console.log('Model not trained yet. Using default suggestions.');
    return ['Αύξηση της έντασης της άσκησης', 'Προσθήκη περισσότερων λαχανικών στη διατροφή'];
  }

  // Μετατροπή των πληροφοριών χρήστη και προγράμματος σε tensor
  const input = tf.tensor2d([
    [
      userInfo.age,
      userInfo.weight,
      userInfo.height,
      userInfo.activityLevel,
      programInfo.duration,
      programInfo.intensity,
      programInfo.frequency,
      programInfo.dietType,
      programInfo.sleepHours,
      programInfo.stressLevel
    ]
  ]);

  const prediction = model.predict(input);
  const suggestionIndex = prediction.argMax(1).dataSync()[0];

  input.dispose();
  prediction.dispose();

  const suggestions = [
    'Αύξηση της έντασης της άσκησης',
    'Προσθήκη περισσότερων λαχανικών στη διατροφή',
    'Βελτίωση της ποιότητας του ύπνου',
    'Ενσωμάτωση τεχνικών διαχείρισης άγχους',
    'Αύξηση της πρόσληψης πρωτεΐνης'
  ];

  return [suggestions[suggestionIndex]];
};

// Συνάρτηση για την προσθήκη νέων δεδομένων και επανεκπαίδευση του μοντέλου
const updateModel = async (newData) => {
  const trainingData = {
    inputs: [...(model ? existingData.inputs : []), ...newData.inputs],
    outputs: [...(model ? existingData.outputs : []), ...newData.outputs]
  };

  await createAndTrainModel(trainingData);
};

module.exports = {
  generateMLSuggestions,
  updateModel
};
