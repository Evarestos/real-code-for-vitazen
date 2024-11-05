const axios = require('axios');
const { generateMealPlan } = require('./nutritionService');

const AI_MODEL_ENDPOINT = process.env.AI_MODEL_ENDPOINT || 'https://your-ai-model-endpoint.com/generate';

exports.generateProgram = async (userInfo, aiSuggestion) => {
  try {
    const response = await axios.post(AI_MODEL_ENDPOINT, {
      userInfo,
      aiSuggestion,
    });

    const generatedProgram = response.data;

    const processedProgram = processProgram(generatedProgram, userInfo);
    const weeklySchedule = createWeeklySchedule(processedProgram.exercises, userInfo.availability);
    const mealPlan = await generateMealPlan(userInfo);

    return {
      ...processedProgram,
      weeklySchedule,
      mealPlan
    };
  } catch (error) {
    console.error('Error generating program:', error);
    throw new Error('Failed to generate program');
  }
};

function processProgram(program, userInfo) {
  return {
    ...program,
    exercises: adjustExercises(program.exercises, userInfo),
    nutrition: adjustNutrition(program.nutrition, userInfo),
  };
}

function adjustExercises(exercises, userInfo) {
  return Object.entries(exercises).reduce((acc, [type, exerciseList]) => {
    acc[type] = exerciseList.map(exercise => ({
      ...exercise,
      intensity: adjustIntensity(exercise.intensity, userInfo.fitnessLevel),
      duration: adjustDuration(exercise.duration, userInfo.fitnessLevel, userInfo.goals)
    }));
    return acc;
  }, {});
}

function adjustIntensity(intensity, fitnessLevel) {
  const intensityLevels = ['low', 'medium', 'high'];
  const currentIndex = intensityLevels.indexOf(intensity);
  const adjustment = Math.floor(fitnessLevel / 3) - 1; // -1, 0, or 1
  const newIndex = Math.max(0, Math.min(currentIndex + adjustment, intensityLevels.length - 1));
  return intensityLevels[newIndex];
}

function adjustDuration(duration, fitnessLevel, goals) {
  let adjustedDuration = duration;
  if (goals.includes('weight loss')) {
    adjustedDuration *= 1.2; // Increase duration for weight loss
  }
  if (fitnessLevel < 3) {
    adjustedDuration *= 0.8; // Decrease duration for beginners
  }
  return Math.round(adjustedDuration);
}

function adjustNutrition(nutrition, userInfo) {
  // This function can be expanded based on user's specific nutritional needs
  return nutrition;
}

function createWeeklySchedule(exercises, userAvailability) {
  const weeklySchedule = {
    Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: []
  };

  const exerciseTypes = Object.keys(exercises);
  let currentType = 0;

  Object.keys(weeklySchedule).forEach(day => {
    if (userAvailability[day]) {
      const availableSlots = userAvailability[day];
      const dailyExercises = [];

      for (let i = 0; i < availableSlots; i++) {
        const exerciseType = exerciseTypes[currentType];
        const exercise = exercises[exerciseType][Math.floor(Math.random() * exercises[exerciseType].length)];
        dailyExercises.push({...exercise, type: exerciseType});
        currentType = (currentType + 1) % exerciseTypes.length;
      }

      weeklySchedule[day] = dailyExercises;
    }
  });

  return weeklySchedule;
}
