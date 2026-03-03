"use client";

"use client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { useAppData, User, user_service } from "@/context/AppContext";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

import {
  Facebook,
  Instagram,
  Linkedin,
  Camera,
  Edit,
  LogOut,
  Plus,
} from "lucide-react";

import { redirect, useParams, useRouter } from "next/navigation";
import Loadingg from "@/components/Loadingg";

const UserProfile = () => {
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState<User | null>(null);

  const { id } = useParams();

  async function fetchUser() {
    try {
      const { data } = await axios.get<any>(
        `${user_service}/api/v1/user/${id}`,
      );
      setUser(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchUser();
  }, [id]);

  if (!user) {
    return <Loadingg />;
  }
  return (
    <div className="min-h-screen relative py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Image with Overlay */}
      <div className="fixed inset-0 -z-10">
        <img
          src="https://img.freepik.com/premium-photo/modern-blog-shopping-business-etc-website-background-template_830188-6432.jpg"
          alt="background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-br from-white/0 via-amber-40/90 to-stone-100/95 backdrop-blur-sm"></div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <Loadingg />
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          {/* Profile Card */}
          <Card className="overflow-hidden shadow-xl border border-stone-200 rounded-3xl bg-white/90 backdrop-blur-md">
            {/* Cover Image with Pattern */}
            <div className="relative h-48 bg-linear-to-r from-amber-100 via-stone-100 to-amber-100 overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div
                  className="absolute top-0 left-0 w-full h-full"
                  style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, rgba(0,0,0,0.15) 1px, transparent 0)`,
                    backgroundSize: "32px 32px",
                  }}
                ></div>
              </div>
              <div className="absolute bottom-6 left-8">
                <h2 className="text-2xl font-serif text-stone-700">
                  My Profile
                </h2>
                <p className="text-sm text-stone-500 mt-1">
                  Manage your personal information
                </p>
              </div>
            </div>

            <CardContent className="relative pt-0 pb-8">
              {/* Avatar */}
              <div className="flex justify-center -mt-20 mb-6">
                <div className="relative group">
                  <Avatar className="w-40 h-40 border-8 border-white shadow-xl ring-4 ring-amber-100 cursor-pointer">
                    <AvatarImage src={user?.image} alt="profile pic" />
                  </Avatar>
                </div>
              </div>

              {/* User Info */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-serif font-bold text-stone-800 mb-2">
                  {user?.name}
                </h1>
                {user?.bio && (
                  <p className="text-stone-600 max-w-2xl mx-auto px-4 text-base leading-relaxed">
                    {user.bio}
                  </p>
                )}
              </div>

              {/* Social Links */}
              {(user?.instagram || user?.facebook || user?.linkedin) && (
                <div className="flex justify-center gap-4 mb-8">
                  {user?.instagram && (
                    <a
                      href={user.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group"
                    >
                      <div className="p-4 bg-linear-to-br from-pink-100 to-rose-100 border border-pink-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110">
                        <Instagram className="w-6 h-6 text-pink-600" />
                      </div>
                    </a>
                  )}
                  {user?.facebook && (
                    <a
                      href={user.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group"
                    >
                      <div className="p-4 bg-linear-to-br from-blue-100 to-indigo-100 border border-blue-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110">
                        <Facebook className="w-6 h-6 text-blue-600" />
                      </div>
                    </a>
                  )}
                  {user?.linkedin && (
                    <a
                      href={user.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group"
                    >
                      <div className="p-4 bg-linear-to-br from-sky-100 to-blue-100 border border-sky-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110">
                        <Linkedin className="w-6 h-6 text-sky-700" />
                      </div>
                    </a>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
