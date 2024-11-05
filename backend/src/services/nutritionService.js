const NUTRITION_AI_ENDPOINT = process.env.NUTRITION_AI_ENDPOINT || 'https://your-nutrition-ai-endpoint.com/generate';

const generateMealPlan = async (userInfo) => {
  try {
    const response = await fetch(NUTRITION_AI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userInfo),
    });

    if (!response.ok) {
      throw new Error('Failed to generate meal plan');
    }

    const mealPlan = await response.json();
    return adaptMealPlan(mealPlan, userInfo.dietaryRestrictions);
  } catch (error) {
    console.error('Error generating meal plan:', error);
    throw error;
  }
};

const adaptMealPlan = (mealPlan, dietaryRestrictions) => {
  return mealPlan.map(meal => {
    let adaptedMeal = { ...meal };

    dietaryRestrictions.forEach(restriction => {
      switch (restriction) {
        case 'vegetarian':
          adaptedMeal = replaceNonVegetarian(adaptedMeal);
          break;
        case 'vegan':
          adaptedMeal = replaceNonVegan(adaptedMeal);
          break;
        case 'gluten-free':
          adaptedMeal = replaceGluten(adaptedMeal);
          break;
        case 'lactose-free':
          adaptedMeal = replaceLactose(adaptedMeal);
          break;
      }
    });

    return adaptedMeal;
  });
};

const replaceNonVegetarian = (meal) => {
  const vegetarianAlternatives = {
    'beef': 'tofu',
    'chicken': 'seitan',
    'pork': 'tempeh',
    'fish': 'jackfruit'
  };

  meal.ingredients = meal.ingredients.map(ingredient => {
    const lowerIngredient = ingredient.toLowerCase();
    for (const [meat, alternative] of Object.entries(vegetarianAlternatives)) {
      if (lowerIngredient.includes(meat)) {
        return ingredient.replace(new RegExp(meat, 'gi'), alternative);
      }
    }
    return ingredient;
  });

  return meal;
};

const replaceNonVegan = (meal) => {
  const veganAlternatives = {
    'milk': 'almond milk',
    'cheese': 'vegan cheese',
    'egg': 'flax egg',
    'yogurt': 'coconut yogurt'
  };

  meal.ingredients = meal.ingredients.map(ingredient => {
    const lowerIngredient = ingredient.toLowerCase();
    for (const [dairy, alternative] of Object.entries(veganAlternatives)) {
      if (lowerIngredient.includes(dairy)) {
        return ingredient.replace(new RegExp(dairy, 'gi'), alternative);
      }
    }
    return ingredient;
  });

  return meal;
};

const replaceGluten = (meal) => {
  const glutenFreeAlternatives = {
    'wheat flour': 'almond flour',
    'bread': 'gluten-free bread',
    'pasta': 'gluten-free pasta',
    'couscous': 'quinoa'
  };

  meal.ingredients = meal.ingredients.map(ingredient => {
    const lowerIngredient = ingredient.toLowerCase();
    for (const [gluten, alternative] of Object.entries(glutenFreeAlternatives)) {
      if (lowerIngredient.includes(gluten)) {
        return ingredient.replace(new RegExp(gluten, 'gi'), alternative);
      }
    }
    return ingredient;
  });

  return meal;
};

const replaceLactose = (meal) => {
  const lactoseFreeAlternatives = {
    'milk': 'lactose-free milk',
    'cheese': 'lactose-free cheese',
    'yogurt': 'lactose-free yogurt',
    'cream': 'coconut cream'
  };

  meal.ingredients = meal.ingredients.map(ingredient => {
    const lowerIngredient = ingredient.toLowerCase();
    for (const [lactose, alternative] of Object.entries(lactoseFreeAlternatives)) {
      if (lowerIngredient.includes(lactose)) {
        return ingredient.replace(new RegExp(lactose, 'gi'), alternative);
      }
    }
    return ingredient;
  });

  return meal;
};

export { generateMealPlan };
