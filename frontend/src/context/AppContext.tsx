"use client";

import React, { use, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";
export const user_service = process.env.NEXT_PUBLIC_USER_SERVICE!;
export const author_service = process.env.NEXT_PUBLIC_AUTHOR_SERVICE!;
export const blog_service = process.env.NEXT_PUBLIC_BLOG_SERVICE!;

export interface User {
  _id: string;
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
  title: string;
  description: string;
  blogcontent: string;
  image: string;
  category: string;
  author: string;
  create_at: string;
}

interface SavedBlogType {
  id: string;
  userid: string;
  blogid: string;
  create_at: string;
}

interface AppContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isauth: boolean;
  setIsauth: React.Dispatch<React.SetStateAction<boolean>>;
  logoutUser: () => Promise<void>;
  blogs: Blog[];
  blogLoading: boolean;
  category: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  fetchBlogs: () => Promise<void>;
  savedBlogs: SavedBlogType[] | null;
  getSavedBlogs: () => Promise<void>;
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

  ///fetch  blogs
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [blogLoading, setBlogLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  async function fetchBlogs() {
    setBlogLoading(true);
    try {
      const { data } = await axios.get<{ message: string; blogs: Blog[] }>(
        `${blog_service}/api/v1/blogs/all?category=${category}&searchQuery=${searchQuery}`,
      );
      // console.log(data);
      setBlogs(data.blogs || []);
    } catch (error) {
      console.log(error);
    } finally {
      setBlogLoading(false);
    }
  }

  const [savedBlogs, setSavedBlogs] = useState<SavedBlogType[] | null>(null);

  async function getSavedBlogs() {
    const token = Cookies.get("token");
    try {
      const { data } = await axios.get<any>(
        `${blog_service}/api/v1/blog/saved/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setSavedBlogs(data);
    } catch (error) {
      console.log(error);
    }
  }

  async function logoutUser() {
    Cookies.remove("token");
    setUser(null);
    setIsauth(false);

    toast.success("Logged out successfully");
  }

  useEffect(() => {
    fetchUser();
    fetchBlogs();
    getSavedBlogs();
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [category, searchQuery]);
  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        loading,
        setLoading,
        isauth,
        setIsauth,
        logoutUser,
        blogs,
        blogLoading,
        searchQuery,
        setSearchQuery,
        category,
        setCategory,
        fetchBlogs,
        savedBlogs,
        getSavedBlogs,
      }}
    >
      <GoogleOAuthProvider clientId="350967861092-j1srrfa5e9rkuv1atoa8aeqn3gr32c8d.apps.googleusercontent.com">
        {" "}
        {children}
      </GoogleOAuthProvider>
      <Toaster />
    </AppContext.Provider>
  );
};

//this is a custom hook to use the app context

export const useAppData = (): AppContextType => {
  const context = React.useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppData must be used within an AppProvider");
  }
  return context;
};
