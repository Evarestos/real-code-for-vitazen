const { getProgressData } = require('./progressService');

const analyzeProgress = async (userId, goal) => {
  if (!userId || !goal) throw new Error('User ID and goal are required for progress analysis');

  const progressData = await getProgressData(userId);
  const latestProgress = progressData[progressData.length - 1];

  if (!latestProgress) return { status: 'No progress data available' };
  if (latestProgress.value >= goal) return { status: 'Goal achieved' };
  return { status: 'In progress' };
};

const generateProgressReport = async (userId) => {
  try {
    const progressData = await getProgressData(userId);
    // Εδώ θα μπορούσατε να προσθέσετε πιο περίπλοκη λογική ανάλυσης
    return {
      totalEntries: progressData.length,
      latestValue: progressData[progressData.length - 1]?.value,
      averageValue: progressData.reduce((sum, entry) => sum + entry.value, 0) / progressData.length
    };
  } catch (error) {
    console.error('Error generating progress report:', error);
    throw error;
  }
};

module.exports = {
  analyzeProgress,
  generateProgressReport
};
