// "use client";
// import { Avatar, AvatarImage } from "@/components/ui/avatar";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useAppData, User, user_service } from "@/context/AppContext";
// import React, { useState } from "react";
// import axios from "axios";
// import Cookies from "js-cookie";
// import toast from "react-hot-toast";
// import Loadingg from "@/components/Loadingg";
// import { Facebook, Instagram, Linkedin } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { DialogTrigger } from "@radix-ui/react-dialog";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { redirect, useRouter } from "next/navigation";

// interface UpdateProfilePicResponse {
//   user: User;
//   message: string;
//   token: string;
// }

// const ProfilePage = () => {
//   const { user, setUser, logoutUser } = useAppData();
//   const [loading, setLoading] = useState(false);
//   const [Open, setOpen] = useState(false);
//   const router = useRouter();
//   // console.log("👤 USER:", user);

//   if (!user) redirect("/login");

//   const logoutHandler = async () => {
//     logoutUser();
//   };

//   const [formData, setFormData] = useState({
//     name: user?.name || "",
//     instagram: user?.instagram || "",
//     facebook: user?.facebook || "",
//     linkedin: user?.linkedin || "",
//     bio: user?.bio || "",
//   });

//   const handleFormSubmit = async () => {
//     try {
//       setLoading(true);
//       const token = Cookies.get("token");
//       const { data } = await axios.post<UpdateProfilePicResponse>(
//         `${user_service}/api/v1/user/update`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       toast.success("Profile updated successfully");
//       Cookies.set("token", data.token, {
//         expires: 7,
//         path: "/",
//         secure: process.env.NODE_ENV === "production",
//       });
//       setUser(data.user);
//       setLoading(false);
//     } catch (error) {
//       toast.error("Error updating profile.");
//       setLoading(false);
//       console.error("Error updating profile:", error);
//     }
//   };
//   const clickHandler = () => {
//     inputRef.current?.click();
//   };

//   const inputRef = React.useRef<HTMLInputElement>(null);
//   const changeHandler = async (e: any) => {
//     const file = e.target.files[0];
//     if (file) {
//       const formData = new FormData();
//       formData.append("file", file);
//       try {
//         setLoading(true);
//         const token = Cookies.get("token");
//         const { data } = await axios.post<UpdateProfilePicResponse>(
//           `${user_service}/api/v1/user/updatepic`,
//           formData,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         toast.success(data.message);
//         Cookies.set("token", data.token, {
//           expires: 7,
//           path: "/",
//           secure: process.env.NODE_ENV === "production",
//         });
//         setUser(data.user);
//         setLoading(false);
//       } catch (error) {
//         toast.error("Error updating profile picture.");
//         setLoading(false);
//         console.error("Error updating profile picture:", error);
//       }
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen p-4">
//       {loading ? (
//         <Loadingg />
//       ) : (
//         <Card className="w-full max-w-xl shadow-lg border rounded-2xl p-2">
//           <CardHeader className="text-center">
//             <CardTitle className="text-2xl font-semibold">Profile</CardTitle>
//           </CardHeader>
//           <CardContent className="flex flex-col items-center space-y-4 ">
//             <Avatar
//               className="w-28 h-28 border-4 border-gray-200 shadow-md cursor-pointer"
//               onClick={clickHandler}
//             >
//               <AvatarImage src={user?.image} alt="profile pic" />
//               <input
//                 type="file"
//                 className="hidden"
//                 accept="image/*"
//                 ref={inputRef}
//                 onChange={changeHandler}
//               />
//             </Avatar>
//             <div className="w-full space-y-2 text-center">
//               <label className="font-medium">Name</label>
//               <p>{user?.name}</p>
//             </div>
//             {user?.bio && (
//               <div className="w-full space-y-2 text-center">
//                 <label className="font-medium">Bio</label>
//                 <p>{user.bio}</p>
//               </div>
//             )}

//             <div className="flex gap-4 mt-3">
//               {user?.instagram && (
//                 <a
//                   href={user.instagram}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   <Instagram className="text-pink-500 text-2xl" />
//                 </a>
//               )}

//               {user?.facebook && (
//                 <a
//                   href={user.facebook}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   <Facebook className="text-blue-500 text-2xl" />
//                 </a>
//               )}

//               {user?.linkedin && (
//                 <a
//                   href={user.linkedin}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   <Linkedin className="text-blue-700 text-2xl" />
//                 </a>
//               )}
//             </div>
//             <div className="flex flex-col sm:flex-row gap-2 mt-6 w-full justify-center">
//               <Button onClick={logoutHandler}>Logout</Button>
//               <Button onClick={() => router.push("/blog/new")}>Add Blog</Button>

//               <Dialog open={Open} onOpenChange={setOpen}>
//                 <DialogTrigger asChild>
//                   <Button variant="outline">Open Dialog</Button>
//                 </DialogTrigger>
//                 {/* Dialog Content for editing profile would go here */}

//                 <DialogContent className="sm:max-w-125">
//                   <DialogHeader>
//                     <DialogTitle>Edit profile</DialogTitle>
//                     <DialogDescription>
//                       Make changes to your profile here. Click save when
//                       you&apos;re done.
//                     </DialogDescription>
//                   </DialogHeader>
//                   <div className="space-y-3">
//                     {/* Form fields for editing profile would go here */}
//                     <div className="grid gap-3">
//                       <Label htmlFor="name">Name</Label>
//                       <Input
//                         id="name-1"
//                         name="name"
//                         defaultValue="Pedro Duarte"
//                         value={formData.name}
//                         onChange={(e) => {
//                           setFormData({ ...formData, name: e.target.value });
//                         }}
//                       />
//                     </div>
//                     <div className="grid gap-3">
//                       <Label htmlFor="bio">Bio</Label>
//                       <Input
//                         id="bio"
//                         name="bio"
//                         defaultValue="Pedro Duarte"
//                         value={formData.bio}
//                         onChange={(e) => {
//                           setFormData({ ...formData, bio: e.target.value });
//                         }}
//                       />
//                     </div>
//                     <div className="grid gap-3">
//                       <Label htmlFor="instagram">Instagram</Label>
//                       <Input
//                         id="instagram"
//                         name="instagram"
//                         defaultValue="Pedro Duarte"
//                         value={formData.instagram}
//                         onChange={(e) => {
//                           setFormData({
//                             ...formData,
//                             instagram: e.target.value,
//                           });
//                         }}
//                       />
//                     </div>
//                     <div className="grid gap-3">
//                       <Label htmlFor="facebook">Facebook</Label>
//                       <Input
//                         id="facebook"
//                         name="facebook"
//                         defaultValue="Pedro Duarte"
//                         value={formData.facebook}
//                         onChange={(e) => {
//                           setFormData({
//                             ...formData,
//                             facebook: e.target.value,
//                           });
//                         }}
//                       />
//                     </div>
//                     <div className="grid gap-3">
//                       <Label htmlFor="linkedin">Linkedin</Label>
//                       <Input
//                         id="linkedin"
//                         name="linkedin"
//                         defaultValue="Pedro Duarte"
//                         value={formData.linkedin}
//                         onChange={(e) => {
//                           setFormData({
//                             ...formData,
//                             linkedin: e.target.value,
//                           });
//                         }}
//                       />
//                     </div>
//                   </div>
//                   <Button className="mt-4 w-full" onClick={handleFormSubmit}>
//                     Save changes
//                   </Button>
//                 </DialogContent>
//               </Dialog>
//             </div>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// };

// export default ProfilePage;



"use client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { useAppData, User, user_service } from "@/context/AppContext";
import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import Loadingg from "@/components/Loadingg";
import { Facebook, Instagram, Linkedin, Camera, Edit, LogOut, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  const [open, setOpen] = useState(false);
  const router = useRouter();

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
      setOpen(false);
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
                <div className="absolute top-0 left-0 w-full h-full" style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, rgba(0,0,0,0.15) 1px, transparent 0)`,
                  backgroundSize: '32px 32px'
                }}></div>
              </div>
              <div className="absolute bottom-6 left-8">
                <h2 className="text-2xl font-serif text-stone-700">My Profile</h2>
                <p className="text-sm text-stone-500 mt-1">Manage your personal information</p>
              </div>
            </div>
            
            <CardContent className="relative pt-0 pb-8">
              {/* Avatar */}
              <div className="flex justify-center -mt-20 mb-6">
                <div className="relative group">
                  <Avatar className="w-40 h-40 border-8 border-white shadow-xl ring-4 ring-amber-100 cursor-pointer">
                    <AvatarImage src={user?.image} alt="profile pic" />
                  </Avatar>
                  <button
                    onClick={clickHandler}
                    className="absolute bottom-2 right-2 bg-linear-to-r from-amber-500 to-amber-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    ref={inputRef}
                    onChange={changeHandler}
                  />
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

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto px-4">
                <Button
                  onClick={() => router.push("/blog/new")}
                  className="flex-1 bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white py-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 font-semibold"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create New Blog
                </Button>

                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex-1 bg-linear-to-r from-stone-600 to-stone-700 hover:from-stone-700 hover:to-stone-800 text-white py-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 font-semibold">
                      <Edit className="w-5 h-5 mr-2" />
                      Edit Profile
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-md rounded-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold">Edit Profile</DialogTitle>
                      <DialogDescription>
                        Update your profile information
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-semibold">Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="rounded-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio" className="text-sm font-semibold">Bio</Label>
                        <Input
                          id="bio"
                          name="bio"
                          value={formData.bio}
                          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                          className="rounded-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instagram" className="text-sm font-semibold">Instagram</Label>
                        <Input
                          id="instagram"
                          name="instagram"
                          value={formData.instagram}
                          onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                          className="rounded-lg"
                          placeholder="https://instagram.com/username"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="facebook" className="text-sm font-semibold">Facebook</Label>
                        <Input
                          id="facebook"
                          name="facebook"
                          value={formData.facebook}
                          onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                          className="rounded-lg"
                          placeholder="https://facebook.com/username"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="linkedin" className="text-sm font-semibold">LinkedIn</Label>
                        <Input
                          id="linkedin"
                          name="linkedin"
                          value={formData.linkedin}
                          onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                          className="rounded-lg"
                          placeholder="https://linkedin.com/in/username"
                        />
                      </div>
                    </div>
                    <Button
                      onClick={handleFormSubmit}
                      className="w-full bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white py-6 rounded-xl shadow-md font-semibold"
                    >
                      Save Changes
                    </Button>
                  </DialogContent>
                </Dialog>

                <Button
                  onClick={logoutHandler}
                  variant="outline"
                  className="flex-1 sm:flex-none border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;