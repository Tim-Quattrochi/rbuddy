import { useState, useEffect } from 'react';
import { CheckIn, User } from '@shared/schema';
import { localStorageService } from '@/lib/storage';

export function useCheckIns(user?: User) {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [todaysCheckIn, setTodaysCheckIn] = useState<CheckIn | null>(null);
  const [streak, setStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const loadCheckIns = () => {
    if (!user) {
      setCheckIns([]);
      setTodaysCheckIn(null);
      setStreak(0);
      return;
    }

    setIsLoading(true);
    try {
      const userCheckIns = localStorageService.getCheckIns(user.firstName, user.lastName);
      const todayCheckIn = localStorageService.getTodaysCheckIn(user.firstName, user.lastName);
      const currentStreak = localStorageService.getStreak(user.firstName, user.lastName);

      setCheckIns(userCheckIns);
      setTodaysCheckIn(todayCheckIn);
      setStreak(currentStreak);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCheckIns();
  }, [user?.id]);

  const addCheckIn = async (checkInData: { feeling: string; goal: string; journal?: string }): Promise<CheckIn> => {
    if (!user) throw new Error('User is required');

    setIsLoading(true);
    try {
      const newCheckIn = localStorageService.addCheckIn(
        user.firstName,
        user.lastName,
        checkInData
      );
      
      // Reload data to update all states
      loadCheckIns();
      
      return newCheckIn;
    } finally {
      setIsLoading(false);
    }
  };

  const isNewUser = checkIns.length === 0;
  const hasCheckedInToday = todaysCheckIn !== null;

  return {
    checkIns,
    todaysCheckIn,
    streak,
    isLoading,
    addCheckIn,
    isNewUser,
    hasCheckedInToday,
    refreshData: loadCheckIns
  };
}
