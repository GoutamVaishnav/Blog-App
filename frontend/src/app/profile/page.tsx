"use client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppData, User, user_service } from "@/context/AppContext";
import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import Loadingg from "@/components/Loadingg";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { redirect, useRouter } from "next/navigation";

interface UpdateProfilePicResponse {
  user: User;
  message: string;
  token: string;
}

const ProfilePage = () => {
  const { user, setUser, logoutUser } = useAppData();
  const [loading, setLoading] = useState(false);
  const [Open, setOpen] = useState(false);
  const router = useRouter();
  // console.log("👤 USER:", user);

  if (!user) redirect("/login");

  const logoutHandler = async () => {
    logoutUser();
  };

  const [formData, setFormData] = useState({
    name: user?.name || "",
    instagram: user?.instagram || "",
    facebook: user?.facebook || "",
    linkedin: user?.linkedin || "",
    bio: user?.bio || "",
  });

  const handleFormSubmit = async () => {
    try {
      setLoading(true);
      const token = Cookies.get("token");
      const { data } = await axios.post<UpdateProfilePicResponse>(
        `${user_service}/api/v1/user/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Profile updated successfully");
      Cookies.set("token", data.token, {
        expires: 7,
        path: "/",
        secure: process.env.NODE_ENV === "production",
      });
      setUser(data.user);
      setLoading(false);
    } catch (error) {
      toast.error("Error updating profile.");
      setLoading(false);
      console.error("Error updating profile:", error);
    }
  };
  const clickHandler = () => {
    inputRef.current?.click();
  };

  const inputRef = React.useRef<HTMLInputElement>(null);
  const changeHandler = async (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        setLoading(true);
        const token = Cookies.get("token");
        const { data } = await axios.post<UpdateProfilePicResponse>(
          `${user_service}/api/v1/user/updatepic`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success(data.message);
        Cookies.set("token", data.token, {
          expires: 7,
          path: "/",
          secure: process.env.NODE_ENV === "production",
        });
        setUser(data.user);
        setLoading(false);
      } catch (error) {
        toast.error("Error updating profile picture.");
        setLoading(false);
        console.error("Error updating profile picture:", error);
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      {loading ? (
        <Loadingg />
      ) : (
        <Card className="w-full max-w-xl shadow-lg border rounded-2xl p-2">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold">Profile</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4 ">
            <Avatar
              className="w-28 h-28 border-4 border-gray-200 shadow-md cursor-pointer"
              onClick={clickHandler}
            >
              <AvatarImage src={user?.image} alt="profile pic" />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                ref={inputRef}
                onChange={changeHandler}
              />
            </Avatar>
            <div className="w-full space-y-2 text-center">
              <label className="font-medium">Name</label>
              <p>{user?.name}</p>
            </div>
            {user?.bio && (
              <div className="w-full space-y-2 text-center">
                <label className="font-medium">Bio</label>
                <p>{user.bio}</p>
              </div>
            )}

            <div className="flex gap-4 mt-3">
              {user?.instagram && (
                <a
                  href={user.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram className="text-pink-500 text-2xl" />
                </a>
              )}

              {user?.facebook && (
                <a
                  href={user.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Facebook className="text-blue-500 text-2xl" />
                </a>
              )}

              {user?.linkedin && (
                <a
                  href={user.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="text-blue-700 text-2xl" />
                </a>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-2 mt-6 w-full justify-center">
              <Button onClick={logoutHandler}>Logout</Button>
              <Button>Add Blog</Button>

              <Dialog open={Open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">Open Dialog</Button>
                </DialogTrigger>
                {/* Dialog Content for editing profile would go here */}

                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>
                      Make changes to your profile here. Click save when
                      you&apos;re done.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3">
                    {/* Form fields for editing profile would go here */}
                    <div className="grid gap-3">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name-1"
                        name="name"
                        defaultValue="Pedro Duarte"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                        }}
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="bio">Bio</Label>
                      <Input
                        id="bio"
                        name="bio"
                        defaultValue="Pedro Duarte"
                        value={formData.bio}
                        onChange={(e) => {
                          setFormData({ ...formData, bio: e.target.value });
                        }}
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="instagram">Instagram</Label>
                      <Input
                        id="instagram"
                        name="instagram"
                        defaultValue="Pedro Duarte"
                        value={formData.instagram}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            instagram: e.target.value,
                          });
                        }}
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="facebook">Facebook</Label>
                      <Input
                        id="facebook"
                        name="facebook"
                        defaultValue="Pedro Duarte"
                        value={formData.facebook}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            facebook: e.target.value,
                          });
                        }}
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="linkedin">Linkedin</Label>
                      <Input
                        id="linkedin"
                        name="linkedin"
                        defaultValue="Pedro Duarte"
                        value={formData.linkedin}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            linkedin: e.target.value,
                          });
                        }}
                      />
                    </div>
                  </div>
                  <Button className="mt-4 w-full" onClick={handleFormSubmit}>
                    Save changes
                  </Button>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProfilePage;
