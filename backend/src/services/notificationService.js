import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  // Ρυθμίσεις για το email service σας
});

export const sendNotification = async (subject, message) => {
  try {
    await transporter.sendMail({
      from: 'your-app@example.com',
      to: 'admin@example.com',
      subject,
      text: message,
    });
    console.log('Notification sent successfully');
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

export const notifySignificantChange = (params, performance, threshold = 0.1) => {
  const performanceDifference = Math.abs(performance.rlPerformance - performance.mlPerformance);
  if (performanceDifference > threshold) {
    const subject = 'Significant Performance Change Detected';
    const message = `
      A significant change in model performance has been detected.
      RL Performance: ${performance.rlPerformance}
      ML Performance: ${performance.mlPerformance}
      Current Hyperparameters:
      - Learning Rate: ${params.learningRate}
      - Discount Factor: ${params.discountFactor}
      - Exploration Rate: ${params.explorationRate}
    `;
    sendNotification(subject, message);
  }
};

