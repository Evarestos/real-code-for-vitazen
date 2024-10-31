export interface UserPreferences {
  fitnessLevel?: 'beginner' | 'intermediate' | 'advanced';
  goals?: string[];
  limitations?: string[];
  dietaryRestrictions?: string[];
  calories?: number;
}

export interface AIResponse {
  role: 'user' | 'assistant' | 'error';
  content: string;
}

export interface WorkoutProgram {
  program: string;
  type: 'workout';
}

export interface NutritionPlan {
  plan: string;
  type: 'nutrition';
} 