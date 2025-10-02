import { User, InsertUser, insertUserSchema } from "@shared/schema";
import { localStorageService } from "./storage";

const CURRENT_USER_KEY = 'reentry_buddy_current_user';

export class AuthService {
  getCurrentUser(): User | null {
    try {
      const currentUserData = localStorage.getItem(CURRENT_USER_KEY);
      if (!currentUserData) return null;
      const { firstName, lastName } = JSON.parse(currentUserData);
      return localStorageService.getUserByName(firstName, lastName);
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  async signIn(userData: InsertUser): Promise<User> {
    // Validate the user data
    const validatedData = insertUserSchema.parse(userData);
    
    // Check if user already exists by name
    const existingUser = localStorageService.getUserByName(
      validatedData.firstName, 
      validatedData.lastName
    );
    
    let user: User;
    if (existingUser) {
      user = existingUser;
    } else {
      // Create new user
      user = localStorageService.createUser(validatedData);
    }

    // Store current user reference
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({
      firstName: user.firstName,
      lastName: user.lastName
    }));

    return user;
  }

  signOut(): void {
    localStorage.removeItem(CURRENT_USER_KEY);
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }
}

export const authService = new AuthService();
