import { User, CheckIn, InsertUser, InsertCheckIn } from "@shared/schema";

const STORAGE_PREFIX = 'reentry_buddy';

export class LocalStorageService {
  // Helper to create user key from name
  private getUserKey(firstName: string, lastName: string): string {
    return `${STORAGE_PREFIX}_user_${firstName.toLowerCase()}_${lastName.toLowerCase()}`;
  }

  private getCheckInsKey(firstName: string, lastName: string): string {
    return `${STORAGE_PREFIX}_checkins_${firstName.toLowerCase()}_${lastName.toLowerCase()}`;
  }

  // User methods
  getUserByName(firstName: string, lastName: string): User | null {
    try {
      const userKey = this.getUserKey(firstName, lastName);
      const userData = localStorage.getItem(userKey);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user from localStorage:', error);
      return null;
    }
  }

  setUser(user: User): void {
    try {
      const userKey = this.getUserKey(user.firstName, user.lastName);
      localStorage.setItem(userKey, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user to localStorage:', error);
    }
  }

  createUser(userData: InsertUser): User {
    const user: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...userData
    };
    this.setUser(user);
    return user;
  }

  clearUser(firstName: string, lastName: string): void {
    const userKey = this.getUserKey(firstName, lastName);
    const checkInsKey = this.getCheckInsKey(firstName, lastName);
    localStorage.removeItem(userKey);
    localStorage.removeItem(checkInsKey);
  }

  // Check-in methods
  getCheckIns(firstName: string, lastName: string): CheckIn[] {
    try {
      const checkInsKey = this.getCheckInsKey(firstName, lastName);
      const checkInsData = localStorage.getItem(checkInsKey);
      return checkInsData ? JSON.parse(checkInsData) : [];
    } catch (error) {
      console.error('Error getting check-ins from localStorage:', error);
      return [];
    }
  }

  addCheckIn(firstName: string, lastName: string, checkInData: Omit<InsertCheckIn, 'userId' | 'date'>): CheckIn {
    const user = this.getUserByName(firstName, lastName);
    if (!user) {
      throw new Error('User not found');
    }

    const checkIn: CheckIn = {
      id: `checkin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      ...checkInData
    };

    try {
      const checkInsKey = this.getCheckInsKey(firstName, lastName);
      const checkIns = this.getCheckIns(firstName, lastName);
      checkIns.push(checkIn);
      localStorage.setItem(checkInsKey, JSON.stringify(checkIns));
      return checkIn;
    } catch (error) {
      console.error('Error saving check-in to localStorage:', error);
      throw error;
    }
  }

  getTodaysCheckIn(firstName: string, lastName: string): CheckIn | null {
    const today = new Date().toDateString();
    const checkIns = this.getCheckIns(firstName, lastName);
    return checkIns.find(checkIn => {
      const checkInDate = new Date(checkIn.date).toDateString();
      return checkInDate === today;
    }) || null;
  }

  getStreak(firstName: string, lastName: string): number {
    const checkIns = this.getCheckIns(firstName, lastName)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (checkIns.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    let currentDate = new Date(today);
    
    // Check if today has a check-in
    const todayString = today.toDateString();
    const hasToday = checkIns.some(checkIn => 
      new Date(checkIn.date).toDateString() === todayString
    );

    // If today doesn't have a check-in, start from yesterday
    if (!hasToday) {
      currentDate.setDate(currentDate.getDate() - 1);
    }

    for (const checkIn of checkIns) {
      const checkInDate = new Date(checkIn.date);
      if (checkInDate.toDateString() === currentDate.toDateString()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }
}

export const localStorageService = new LocalStorageService();
