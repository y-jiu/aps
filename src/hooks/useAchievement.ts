import { useState, useEffect } from 'react';

interface Achievement {
  id: string;
  workdate: string;
  performance: string;
  notes: string;
  worker: string;
  eventId: string;
}

// Mock data
const mockAchievements: Achievement[] = [
  {
    id: '1',
    workdate: '2024-03-20',
    performance: '90%',
    notes: '정상 진행',
    worker: '김철수',
    eventId: 'event1'
  },
  {
    id: '2',
    workdate: '2024-03-21',
    performance: '85%',
    notes: '장비 점검 필요',
    worker: '박영희',
    eventId: 'event1'
  }
];

export const useAchievement = (eventId: string) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    // Simulate API call delay
    const fetchAchievements = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      const filteredAchievements = mockAchievements.filter(
        achievement => achievement.eventId === eventId
      );
      setAchievements(filteredAchievements);
    };

    fetchAchievements();
  }, [eventId]);

  const updateAchievement = async (id: string, field: string, value: any) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setAchievements(prev => 
      prev.map(achievement => 
        achievement.id === id 
          ? { ...achievement, [field]: value }
          : achievement
      )
    );
  };

  const deleteAchievement = async (id: string) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setAchievements(prev => 
      prev.filter(achievement => achievement.id !== id)
    );
  };

  const addAchievement = async (achievementData: Omit<Achievement, 'id'>) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newAchievement = {
      id: Math.random().toString(36).substr(2, 9),
      ...achievementData,
      eventId
    };
    
    setAchievements(prev => [...prev, newAchievement]);
  };

  return {
    achievements,
    updateAchievement,
    deleteAchievement,
    addAchievement
  };
}; 