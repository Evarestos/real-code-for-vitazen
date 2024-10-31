import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select } from '@/components/ui/select';

const UserInfoForm = ({ onSubmit }) => {
  const [userInfo, setUserInfo] = useState({
    name: '',
    age: '',
    height: '',
    weight: '',
    fitnessLevel: '1',
    goals: [],
    availability: {
      Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0, Sunday: 0
    },
    dietaryRestrictions: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleGoalChange = (goal) => {
    setUserInfo(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const handleAvailabilityChange = (day, value) => {
    setUserInfo(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: value
      }
    }));
  };

  const handleDietaryRestrictionChange = (restriction) => {
    setUserInfo(prev => ({
      ...prev,
      dietaryRestrictions: prev.dietaryRestrictions.includes(restriction)
        ? prev.dietaryRestrictions.filter(r => r !== restriction)
        : [...prev.dietaryRestrictions, restriction]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(userInfo);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        name="name"
        placeholder="Όνομα"
        value={userInfo.name}
        onChange={handleChange}
      />
      <Input
        name="age"
        type="number"
        placeholder="Ηλικία"
        value={userInfo.age}
        onChange={handleChange}
      />
      <Input
        name="height"
        type="number"
        placeholder="Ύψος (cm)"
        value={userInfo.height}
        onChange={handleChange}
      />
      <Input
        name="weight"
        type="number"
        placeholder="Βάρος (kg)"
        value={userInfo.weight}
        onChange={handleChange}
      />
      
      <Select
        name="fitnessLevel"
        value={userInfo.fitnessLevel}
        onChange={handleChange}
      >
        <option value="1">Αρχάριος</option>
        <option value="2">Μέτριος</option>
        <option value="3">Προχωρημένος</option>
      </Select>

      <div>
        <h3>Στόχοι</h3>
        {['weight loss', 'muscle gain', 'endurance', 'flexibility'].map(goal => (
          <Checkbox
            key={goal}
            checked={userInfo.goals.includes(goal)}
            onCheckedChange={() => handleGoalChange(goal)}
            label={goal}
          />
        ))}
      </div>

      <div>
        <h3>Διαθεσιμότητα ανά ημέρα</h3>
        {Object.keys(userInfo.availability).map(day => (
          <div key={day} className="flex items-center space-x-2">
            <label>{day}</label>
            <Input
              type="number"
              min="0"
              max="3"
              value={userInfo.availability[day]}
              onChange={(e) => handleAvailabilityChange(day, parseInt(e.target.value))}
            />
          </div>
        ))}
      </div>

      <div>
        <h3>Διατροφικοί Περιορισμοί</h3>
        {['vegetarian', 'vegan', 'gluten-free', 'lactose-free'].map(restriction => (
          <Checkbox
            key={restriction}
            checked={userInfo.dietaryRestrictions.includes(restriction)}
            onCheckedChange={() => handleDietaryRestrictionChange(restriction)}
            label={restriction}
          />
        ))}
      </div>

      <Button type="submit">Υποβολή</Button>
    </form>
  );
};

export default UserInfoForm;
