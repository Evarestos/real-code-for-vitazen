const tf = require('@tensorflow/tfjs');

class ReinforcementLearningAgent {
  constructor(stateSize, actionSize) {
    this.stateSize = stateSize;
    this.actionSize = actionSize;
    this.model = this.buildModel();
    this.epsilon = 1.0;  // Exploration rate
    this.epsilon_min = 0.01;
    this.epsilon_decay = 0.995;
    this.gamma = 0.95;  // Discount factor
  }

  buildModel() {
    const model = tf.sequential();
    model.add(tf.layers.dense({ inputShape: [this.stateSize], units: 24, activation: 'relu' }));
    model.add(tf.layers.dense({ units: 24, activation: 'relu' }));
    model.add(tf.layers.dense({ units: this.actionSize, activation: 'linear' }));
    model.compile({ loss: 'meanSquaredError', optimizer: 'adam' }); // Αλλαγή από 'mse' σε 'meanSquaredError'
    return model;
  }

  getAction(state) {
    if (Math.random() <= this.epsilon) {
      return Math.floor(Math.random() * this.actionSize);
    }
    const stateTensor = tf.tensor2d([state]);
    const actionValues = this.model.predict(stateTensor);
    return tf.argMax(actionValues, 1).dataSync()[0];
  }

  async train(state, action, reward, nextState, done) {
    const stateTensor = tf.tensor2d([state]);
    const nextStateTensor = tf.tensor2d([nextState]);

    const target = this.model.predict(stateTensor);
    const targetNext = this.model.predict(nextStateTensor);

    const targetVal = target.dataSync();
    if (done) {
      targetVal[action] = reward;
    } else {
      targetVal[action] = reward + this.gamma * Math.max(...targetNext.dataSync());
    }

    const updatedTarget = tf.tensor2d([targetVal]);

    await this.model.fit(stateTensor, updatedTarget, { epochs: 1, verbose: 0 });

    if (this.epsilon > this.epsilon_min) {
      this.epsilon *= this.epsilon_decay;
    }
  }
}

const agent = new ReinforcementLearningAgent(10, 5);  // Adjust state and action sizes as needed

function getAction(state) {
  return agent.getAction(state);
}

async function trainAgent(state, action, reward, nextState, done) {
  await agent.train(state, action, reward, nextState, done);
}

module.exports = {
  getAction,
  trainAgent
};
