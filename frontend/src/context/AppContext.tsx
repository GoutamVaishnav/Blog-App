"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";

export const user_service = "http://localhost:5000";
export const author_service = "http://localhost:5001";
export const blog_service = "http://localhost:5002";

export interface User {
  name: string;
  email: string;
  image: string;
  instagram: string;
  facebook: string;
  linkedin: string;
  bio: string;
}
export interface Blog {
  id: string;
  name: string;
  description: string;
  blogcontent: string;
  image: string;
  category: string;
  author: string;
  created_at: string;
}
interface AppContextType {
  user: User | null;
}

const AppContext = React.createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isauth, setIsauth] = useState(false);
  const [loading, setLoading] = useState(true);
  async function fetchUser() {
    console.log("🔥 fetchUser called");
    try {
      const token = Cookies.get("token");
      if (!token) {
        console.log("client side me token nahi aa raha hai");
      }

      const { data } = await axios.get<User>(`${user_service}/api/v1/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("✅ API success");
      setUser(data);
      setIsauth(true);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);
  return <AppContext.Provider value={{ user }}>{children}</AppContext.Provider>;
};

//this is a custom hook to use the app context

export const useAppData = (): AppContextType => {
  const context = React.useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppData must be used within an AppProvider");
  }
  return context;
};
