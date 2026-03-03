// "use client";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { RefreshCcw } from "lucide-react";
// import React, { useMemo, useRef, useState, useEffect } from "react";
// import axios from "axios";

// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import dynamic from "next/dynamic";

// import Cookies from "js-cookie";
// import { author_service } from "@/context/AppContext";
// import toast from "react-hot-toast";

// const JoditEditor = dynamic(() => import("jodit-react"), {
//   ssr: false,
// });

// const blogCategory = [
//   "Technology",
//   "Health",
//   "Travel",
//   "Food",
//   "Lifestyle",
//   "Education",
//   "Finance",
//   "Entertainment",
//   "Sports",
//   "Science",
//   "Art",
//   "History",
//   "Politics",
//   "Environment",
//   "Culture",
//   "Business",
//   "Fashion",
//   "Music",
//   "Movies",
//   "Books",
// ];

// interface AiTitleResponse {
//   title: string;
// }
// interface AiDescriptionResponse {
//   description: string;
// }

// const AddBlog = () => {
//   const editor = useRef(null);
//   const [content, setContent] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [aiTitle, setAiTitle] = useState(false);

//   // ✅ Separate state for title input
//   const [titleInput, setTitleInput] = useState("");

//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     category: "",
//     image: null,
//     blogcontent: "",
//   });

//   // ✅ Sync titleInput with formData.title
//   useEffect(() => {
//     setTitleInput(formData.title);
//   }, [formData.title]);

//   const handleInputChange = (e: any) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   // ✅ Separate handler for title
//   const handleTitleChange = (e: any) => {
//     const newTitle = e.target.value;
//     setTitleInput(newTitle);
//     setFormData((prev) => ({
//       ...prev,
//       title: newTitle,
//     }));
//   };

//   const handlerFileChange = (e: any) => {
//     const file = e.target.files[0];
//     setFormData({
//       ...formData,
//       image: file,
//     });
//   };

//   const handleSubmit = async (e: any) => {
//     e.preventDefault();
//     setLoading(true);
//     const formDataToSend = new FormData();
//     formDataToSend.append("title", formData.title);
//     formDataToSend.append("description", formData.description);
//     formDataToSend.append("category", formData.category);
//     formDataToSend.append("blogcontent", content);

//     if (formData.image) {
//       formDataToSend.append("file", formData.image);
//     }

//     try {
//       const token = Cookies.get("token");
//       const { data } = await axios.post(
//         `${author_service}/api/v1/blog/new`,
//         formDataToSend,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       toast.success("Blog created successfully");
//       setFormData({
//         title: "",
//         description: "",
//         category: "",
//         image: null,
//         blogcontent: "",
//       });
//       setContent("");
//       setTitleInput(""); // ✅ Reset title input
//     } catch (error) {
//       console.log("Error submitting blog:", error);
//       toast.error("Error creating blog");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const aiTitleResponse = async () => {
//     try {
//       setAiTitle(true);
//       const { data } = await axios.post<AiTitleResponse>(
//         `${author_service}/api/v1/ai/title`,
//         {
//           text: formData.title,
//         }
//       );

//       console.log("AI RESPONSE 👉", data);
//       console.log("AI Title:", data.title);
//       console.log("Full API Response:", data);
//       console.log("Type of data:", typeof data);
//       console.log("Data keys:", Object.keys(data));

//       // ✅ Update formData
//       setFormData((prevState) => ({
//         ...prevState,
//         title: data.title,
//       }));

//       // ✅ useEffect automatically titleInput ko update kar dega
//       toast.success("Title generated!");
//     } catch (error: any) {
//       if (error?.response?.data?.message?.includes("quota")) {
//         toast.error("Daily AI limit reached. Try again tomorrow!");
//       } else {
//         toast.error("Problem while fetching data from AI");
//       }
//       console.log(error);
//     } finally {
//       setAiTitle(false);
//     }
//   };

//   const [aiDescription, setAiDescription] = useState(false);

//   const aiDescriptionResponse = async () => {
//     try {
//       setAiDescription(true);
//       const { data } = await axios.post<AiDescriptionResponse>(
//         `${author_service}/api/v1/ai/description`,
//         {
//           title: formData.title,
//           description: formData.description,
//         }
//       );

//       console.log("AI RESPONSE 👉", data);
//       console.log("AI Description:", data.description);

//       // ✅ Update formData
//       setFormData((prevState) => ({
//         ...prevState,
//         description: data.description,
//       }));

//       // ✅ useEffect automatically titleInput ko update kar dega
//       toast.success("Description generated!");
//     } catch (error: any) {
//       if (error?.response?.data?.message?.includes("quota")) {
//         toast.error("Daily AI limit reached. Try again tomorrow!");
//       } else {
//         toast.error("Problem while fetching data from AI");
//       }
//       console.log(error);
//     } finally {
//       setAiDescription(false);
//     }
//   };

//   const config = useMemo(
//     () => ({
//       readonly: false,
//       placeholder: "Start typings...",
//     }),
//     []
//   );

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <Card className="w-full max-w-sm">
//         <CardHeader>
//           <CardTitle>Add New Blog</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <Label htmlFor="title">Title</Label>
//             <div className="flex justify-center items-center gap-2">
//               <Input
//                 name="title"
//                 required
//                 value={titleInput} // ✅ Use titleInput instead of formData.title
//                 onChange={handleTitleChange} // ✅ Use separate handler
//                 placeholder="Enter Blog Title"
//                 className={
//                   aiTitle ? "animate-pulse placeholder:opacity-60" : ""
//                 }
//                 disabled={aiTitle}
//               />
//               {titleInput !== "" && (
//                 <Button
//                   type="button"
//                   onClick={aiTitleResponse}
//                   disabled={aiTitle}
//                 >
//                   <RefreshCcw className={aiTitle ? "animate-spin" : ""} />
//                 </Button>
//               )}
//             </div>

//             <Label htmlFor="description">Description</Label>
//             <div className="flex justify-center items-center gap-2">
//               <Input
//                 name="description"
//                 required
//                 value={formData.description}
//                 onChange={handleInputChange}
//                 placeholder="Enter Blog Description"
//               />
//               {formData.title === "" ? (
//                 ""
//               ) : (
//                 <Button
//                   type="button"
//                   onClick={aiDescriptionResponse}
//                   disabled={aiDescription}
//                 >
//                   <RefreshCcw className={aiDescription ? "animate-spin" : ""} />
//                 </Button>
//               )}
//             </div>

//             <Label htmlFor="category">Category</Label>
//             <Select
//               name="category"
//               required
//               onValueChange={(value) =>
//                 setFormData((prev) => ({ ...prev, category: value }))
//               }
//             >
//               <SelectTrigger className="w-45">
//                 <SelectValue
//                   placeholder={formData.category || "Select Category"}
//                 />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectGroup>
//                   <SelectLabel>Categories</SelectLabel>
//                   {blogCategory.map((category) => (
//                     <SelectItem key={category} value={category}>
//                       {category}
//                     </SelectItem>
//                   ))}
//                 </SelectGroup>
//               </SelectContent>
//             </Select>

//             <div>
//               <Label htmlFor="image">Image Upload</Label>
//               <Input
//                 type="file"
//                 name="image"
//                 accept="image/*"
//                 required
//                 onChange={handlerFileChange}
//               />
//             </div>

//             <div>
//               <Label htmlFor="content">Content</Label>
//               <div className="flex justify-center item-center mb-2">
//                 <p className="text-sm text-muted-foreground">
//                   Type your blog content here 💬....You can use rich text
//                   editing. Please add image after improving your content😊.
//                 </p>
//                 <Button type="button" className="ml-2">
//                   <RefreshCcw />
//                   <span>Fix Grammer</span>
//                 </Button>
//               </div>
//             </div>
//             <JoditEditor
//               ref={editor}
//               value={content}
//               config={config}
//               tabIndex={1}
//               onBlur={(newContent) => {
//                 setContent(newContent);
//                 setFormData((prev) => ({
//                   ...prev,
//                   blogcontent: newContent,
//                 }));
//               }}
//             />
//             <Button type="submit" className="w-full mt-4" disabled={loading}>
//               {loading ? "Submitting..." : "Submit"}
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default AddBlog;

"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCcw, Sparkles, Upload, FileText } from "lucide-react";
import React, { useMemo, useRef, useState, useEffect } from "react";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import dynamic from "next/dynamic";
import Cookies from "js-cookie";
import { author_service, useAppData } from "@/context/AppContext";
import toast from "react-hot-toast";

const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
});

export const blogCategory = [
  "Technology",
  "Health",
  "Travel",
  "Food",
  "Lifestyle",
  "Education",
  "Finance",
  "Entertainment",
  "Sports",
  "Science",
  "Art",
  "History",
  "Politics",
  "Environment",
  "Culture",
  "Business",
  "Fashion",
  "Music",
  "Movies",
  "Books",
];

interface AiTitleResponse {
  title: string;
}
interface AiDescriptionResponse {
  description: string;
}
interface AiBlogContentResponse {
  html: string;
}

const AddBlog = () => {
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiTitle, setAiTitle] = useState(false);
  const [aiDescription, setAiDescription] = useState(false);
  const [aiBlogLoading, setAiBlogLoading] = useState(false);
  const [titleInput, setTitleInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");
  const { fetchBlogs } = useAppData();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    image: null as File | null,
    blogcontent: "",
  });

  useEffect(() => {
    setTitleInput(formData.title);
  }, [formData.title]);

  useEffect(() => {
    setDescriptionInput(formData.description);
  }, [formData.description]);

  const handleTitleChange = (e: any) => {
    const newTitle = e.target.value;
    setTitleInput(newTitle);
    setFormData((prev) => ({ ...prev, title: newTitle }));
  };

  const handleDescriptionChange = (e: any) => {
    const newDescription = e.target.value;
    setDescriptionInput(newDescription);
    setFormData((prev) => ({ ...prev, description: newDescription }));
  };

  const handlerFileChange = (e: any) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("blogcontent", content);
    if (formData.image) {
      formDataToSend.append("file", formData.image);
    }

    try {
      const token = Cookies.get("token");
      await axios.post(`${author_service}/api/v1/blog/new`, formDataToSend, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Blog created successfully");
      setFormData({
        title: "",
        description: "",
        category: "",
        image: null,
        blogcontent: "",
      });
      setContent("");
      setTitleInput("");
      setDescriptionInput("");
      setTimeout(() => {
        fetchBlogs();
      }, 4000);
    } catch (error) {
      console.log("Error submitting blog:", error);
      toast.error("Error creating blog");
    } finally {
      setLoading(false);
    }
  };

  const aiTitleResponse = async () => {
    try {
      setAiTitle(true);
      const { data } = await axios.post<string | AiTitleResponse>(
        `${author_service}/api/v1/ai/title`,
        { text: formData.title },
      );
      const newTitle = typeof data === "string" ? data : data.title;
      setFormData((prevState) => ({ ...prevState, title: newTitle }));
      toast.success("Title generated!");
    } catch (error: any) {
      if (error?.response?.data?.message?.includes("quota")) {
        toast.error("Daily AI limit reached. Try again tomorrow!");
      } else {
        toast.error("Problem while fetching data from AI");
      }
    } finally {
      setAiTitle(false);
    }
  };

  const aiDescriptionResponse = async () => {
    try {
      setAiDescription(true);
      const { data } = await axios.post<string | AiDescriptionResponse>(
        `${author_service}/api/v1/ai/description`,
        { title: formData.title, description: formData.description },
      );
      const newDescription = typeof data === "string" ? data : data.description;
      setFormData((prevState) => ({
        ...prevState,
        description: newDescription,
      }));
      toast.success("Description generated!");
    } catch (error: any) {
      if (error?.response?.data?.message?.includes("quota")) {
        toast.error("Daily AI limit reached. Try again tomorrow!");
      } else {
        toast.error("Problem while fetching data from AI");
      }
    } finally {
      setAiDescription(false);
    }
  };

  const aiBlogResponse = async () => {
    try {
      setAiBlogLoading(true);
      const { data } = await axios.post<string | AiBlogContentResponse>(
        `${author_service}/api/v1/ai/aiblog`,
        { blog: content },
      );
      const newContent = typeof data === "string" ? data : data.html;
      setContent(newContent);
      setFormData((prevState) => ({ ...prevState, blogcontent: newContent }));
      toast.success("Content generated!");
    } catch (error: any) {
      if (error?.response?.data?.message?.includes("quota")) {
        toast.error("Daily AI limit reached. Try again tomorrow!");
      } else {
        toast.error("Problem while fetching data from AI");
      }
    } finally {
      setAiBlogLoading(false);
    }
  };

  const config = useMemo(
    () => ({ readonly: false, placeholder: "Start typing..." }),
    [],
  );

  return (
    <div className="min-h-screen relative py-8 px-4 sm:px-6 lg:px-8">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <img
          src="https://images.unsplash.com/photo-1557683316-973673baf926?w=1920&q=80"
          alt="background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-br from-white/95 via-amber-50/90 to-stone-100/95 backdrop-blur-sm"></div>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card className="shadow-2xl border-0 rounded-3xl bg-white/90 backdrop-blur-md overflow-hidden">
          <CardHeader className="bg-linear-to-r from-amber-500 to-orange-500 text-white p-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <FileText className="w-7 h-7" />
              </div>
              <div>
                <CardTitle className="text-3xl font-serif">
                  Create New Blog
                </CardTitle>
                <p className="text-sm opacity-90 mt-1">
                  Share your story with the world
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label
                  htmlFor="title"
                  className="text-stone-700 font-semibold flex items-center gap-2"
                >
                  <span>Title</span>
                  <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-2">
                  <Input
                    name="title"
                    required
                    value={titleInput}
                    onChange={handleTitleChange}
                    placeholder="Enter an engaging title..."
                    className={`flex-1 border-stone-300 focus:border-amber-400 focus:ring-amber-400 rounded-lg ${
                      aiTitle ? "animate-pulse" : ""
                    }`}
                    disabled={aiTitle}
                  />
                  {titleInput !== "" && (
                    <Button
                      type="button"
                      onClick={aiTitleResponse}
                      disabled={aiTitle}
                      className="bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg shadow-md"
                    >
                      {aiTitle ? (
                        <RefreshCcw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4" />
                      )}
                    </Button>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-stone-700 font-semibold flex items-center gap-2"
                >
                  <span>Description</span>
                  <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-2">
                  <Input
                    name="description"
                    required
                    value={descriptionInput}
                    onChange={handleDescriptionChange}
                    placeholder="Brief description of your blog..."
                    className={`flex-1 border-stone-300 focus:border-amber-400 focus:ring-amber-400 rounded-lg ${
                      aiDescription ? "animate-pulse" : ""
                    }`}
                    disabled={aiDescription}
                  />
                  {formData.title !== "" && (
                    <Button
                      type="button"
                      onClick={aiDescriptionResponse}
                      disabled={aiDescription}
                      className="bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg shadow-md"
                    >
                      {aiDescription ? (
                        <RefreshCcw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4" />
                      )}
                    </Button>
                  )}
                </div>
              </div>

              {/* Category & Image */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="category"
                    className="text-stone-700 font-semibold flex items-center gap-2"
                  >
                    <span>Category</span>
                    <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    required
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger className="border-stone-300 focus:border-amber-400 focus:ring-amber-400 rounded-lg">
                      <SelectValue
                        placeholder={formData.category || "Select Category"}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Categories</SelectLabel>
                        {blogCategory.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="image"
                    className="text-stone-700 font-semibold flex items-center gap-2"
                  >
                    <span>Cover Image</span>
                    <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      type="file"
                      name="image"
                      accept="image/*"
                      required
                      onChange={handlerFileChange}
                      className="border-stone-300 focus:border-amber-400 focus:ring-amber-400 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                    />
                  </div>
                </div>
              </div>

              {/* Content Editor */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="content"
                    className="text-stone-700 font-semibold flex items-center gap-2"
                  >
                    <span>Content</span>
                    <span className="text-red-500">*</span>
                  </Label>
                  <Button
                    type="button"
                    onClick={aiBlogResponse}
                    disabled={aiBlogLoading || !content}
                    size="sm"
                    className="bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg shadow-md"
                  >
                    {aiBlogLoading ? (
                      <RefreshCcw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4 mr-2" />
                    )}
                    <span>Fix Grammar</span>
                  </Button>
                </div>
                <p className="text-xs text-stone-500">
                  💡 Write your blog content using the rich text editor below
                </p>
                <div className="border-2 border-stone-200 rounded-lg overflow-hidden">
                  <JoditEditor
                    ref={editor}
                    value={content}
                    config={config}
                    tabIndex={1}
                    onBlur={(newContent) => {
                      setContent(newContent);
                      setFormData((prev) => ({
                        ...prev,
                        blogcontent: newContent,
                      }));
                    }}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full py-6 bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <RefreshCcw className="w-5 h-5 mr-2 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5 mr-2" />
                    Publish Blog
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddBlog;
