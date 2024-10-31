import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const PersonalPrograms = () => {
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    // Fetch personal programs when component mounts
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const response = await fetch('/api/personal-programs');
      if (!response.ok) throw new Error('Failed to fetch programs');
      const data = await response.json();
      setPrograms(data);
    } catch (error) {
      console.error('Error fetching personal programs:', error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader>
        <h2 className="text-2xl font-bold">Personal Programs</h2>
      </CardHeader>
      <CardContent>
        {programs.length === 0 ? (
          <p>You don't have any personal programs yet.</p>
        ) : (
          <ul>
            {programs.map((program) => (
              <li key={program.id} className="mb-4 p-4 border rounded">
                <h3 className="text-xl font-semibold">{program.name}</h3>
                <p>{program.description}</p>
                <Button className="mt-2">View Details</Button>
              </li>
            ))}
          </ul>
        )}
        <Button className="mt-4">Create New Program</Button>
      </CardContent>
    </Card>
  );
};

export default PersonalPrograms;
