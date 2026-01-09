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
import { RefreshCcw } from "lucide-react";
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
import { author_service } from "@/context/AppContext";
import toast from "react-hot-toast";

const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
});

const blogCategory = [
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

  // ✅ Separate state for title input
  const [titleInput, setTitleInput] = useState("");
  
  // ✅ Separate state for description input
  const [descriptionInput, setDescriptionInput] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    image: null,
    blogcontent: "",
  });

  // ✅ Sync titleInput with formData.title
  useEffect(() => {
    setTitleInput(formData.title);
  }, [formData.title]);

  // ✅ Sync descriptionInput with formData.description
  useEffect(() => {
    setDescriptionInput(formData.description);
  }, [formData.description]);

  const handleInputChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Separate handler for title
  const handleTitleChange = (e: any) => {
    const newTitle = e.target.value;
    setTitleInput(newTitle);
    setFormData((prev) => ({
      ...prev,
      title: newTitle,
    }));
  };

  // ✅ Separate handler for description
  const handleDescriptionChange = (e: any) => {
    const newDescription = e.target.value;
    setDescriptionInput(newDescription);
    setFormData((prev) => ({
      ...prev,
      description: newDescription,
    }));
  };

  const handlerFileChange = (e: any) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      image: file,
    });
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
      const { data } = await axios.post(
        `${author_service}/api/v1/blog/new`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
        {
          text: formData.title,
        }
      );

      console.log("AI RESPONSE 👉", data);
      console.log("Type of data:", typeof data);

      // ✅ FIX: API direct string return karta hai, not object
      const newTitle = typeof data === 'string' ? data : data.title;

      // ✅ Update formData
      setFormData((prevState) => ({
        ...prevState,
        title: newTitle,
      }));

      toast.success("Title generated!");
    } catch (error: any) {
      if (error?.response?.data?.message?.includes("quota")) {
        toast.error("Daily AI limit reached. Try again tomorrow!");
      } else {
        toast.error("Problem while fetching data from AI");
      }
      console.log(error);
    } finally {
      setAiTitle(false);
    }
  };

  const aiDescriptionResponse = async () => {
    try {
      setAiDescription(true);
      const { data } = await axios.post<string | AiDescriptionResponse>(
        `${author_service}/api/v1/ai/description`,
        {
          title: formData.title,
          description: formData.description,
        }
      );

      console.log("AI RESPONSE 👉", data);
      console.log("Type of data:", typeof data);

      // ✅ FIX: API direct string return karta hai, not object
      const newDescription = typeof data === 'string' ? data : data.description;

      // ✅ Update formData
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
      console.log(error);
    } finally {
      setAiDescription(false);
    }
  };

  const aiBlogResponse = async () => {
    try {
      setAiBlogLoading(true);
      const { data } = await axios.post<string | AiBlogContentResponse>(
        `${author_service}/api/v1/ai/aiblog`,
        {
          blog: content,
        }
      );

      console.log("AI RESPONSE 👉", data);
      console.log("Type of data:", typeof data);

      // ✅ FIX: API direct string return karta hai, not object
      const newContent = typeof data === 'string' ? data : data.html;

      // ✅ Update both content and formData
      setContent(newContent);
      setFormData((prevState) => ({
        ...prevState,
        blogcontent: newContent,
      }));

      toast.success("Content generated!");
    } catch (error: any) {
      if (error?.response?.data?.message?.includes("quota")) {
        toast.error("Daily AI limit reached. Try again tomorrow!");
      } else {
        toast.error("Problem while fetching data from AI");
      }
      console.log(error);
    } finally {
      setAiBlogLoading(false);
    }
  };

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "Start typings...",
    }),
    []
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Add New Blog</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Label htmlFor="title">Title</Label>
            <div className="flex justify-center items-center gap-2">
              <Input
                name="title"
                required
                value={titleInput}
                onChange={handleTitleChange}
                placeholder="Enter Blog Title"
                className={
                  aiTitle ? "animate-pulse placeholder:opacity-60" : ""
                }
                disabled={aiTitle}
              />
              {titleInput !== "" && (
                <Button
                  type="button"
                  onClick={aiTitleResponse}
                  disabled={aiTitle}
                >
                  <RefreshCcw className={aiTitle ? "animate-spin" : ""} />
                </Button>
              )}
            </div>

            <Label htmlFor="description">Description</Label>
            <div className="flex justify-center items-center gap-2">
              <Input
                name="description"
                required
                value={descriptionInput}
                onChange={handleDescriptionChange}
                placeholder="Enter Blog Description"
                className={
                  aiDescription ? "animate-pulse placeholder:opacity-60" : ""
                }
                disabled={aiDescription}
              />
              {formData.title !== "" && (
                <Button
                  type="button"
                  onClick={aiDescriptionResponse}
                  disabled={aiDescription}
                >
                  <RefreshCcw className={aiDescription ? "animate-spin" : ""} />
                </Button>
              )}
            </div>

            <Label htmlFor="category">Category</Label>
            <Select
              name="category"
              required
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, category: value }))
              }
            >
              <SelectTrigger className="w-45">
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

            <div>
              <Label htmlFor="image">Image Upload</Label>
              <Input
                type="file"
                name="image"
                accept="image/*"
                required
                onChange={handlerFileChange}
              />
            </div>

            <div>
              <Label htmlFor="content">Content</Label>
              <div className="flex justify-center item-center mb-2">
                <p className="text-sm text-muted-foreground">
                  Type your blog content here 💬....You can use rich text
                  editing. Please add image after improving your content😊.
                </p>
                <Button 
                  type="button" 
                  className="ml-2" 
                  onClick={aiBlogResponse} 
                  disabled={aiBlogLoading || !content}
                >
                  <RefreshCcw className={aiBlogLoading ? "animate-spin" : ""} />
                  <span>Fix Grammar</span>
                </Button>
              </div>
            </div>
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
            <Button type="submit" className="w-full mt-4" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddBlog;