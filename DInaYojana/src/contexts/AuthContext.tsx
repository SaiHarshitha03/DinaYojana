import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  role: 'teacher' | 'hod';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role?: 'teacher' | 'hod') => Promise<boolean>;
  signup: (userData: Omit<User, 'id'> & { password: string }) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setIsAuthenticated(true);
      console.log('User loaded from localStorage:', userData);
    }
  }, []);

  const login = async (email: string, password: string, role: 'teacher' | 'hod' = 'teacher'): Promise<boolean> => {
    try {
      console.log('Attempting login for:', email, 'as', role);
      
      // Simulate API call - in real app, this would be actual authentication
      const storedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const foundUser = storedUsers.find((u: any) => u.email === email && u.password === password && u.role === role);
      
      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        console.log('Login successful for user:', userWithoutPassword);
        return true;
      }
      
      console.log('Login failed: Invalid credentials or role mismatch');
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (userData: Omit<User, 'id'> & { password: string }): Promise<boolean> => {
    try {
      console.log('Attempting signup for:', userData.email);
      
      const storedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      
      // Check if user already exists
      if (storedUsers.find((u: any) => u.email === userData.email)) {
        console.log('Signup failed: User already exists');
        return false;
      }
      
      const newUser = {
        ...userData,
        id: Date.now().toString(),
        role: userData.role || 'teacher',
      };
      
      storedUsers.push(newUser);
      localStorage.setItem('registeredUsers', JSON.stringify(storedUsers));
      
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      console.log('Signup successful for user:', userWithoutPassword);
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    console.log('User logged out');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};