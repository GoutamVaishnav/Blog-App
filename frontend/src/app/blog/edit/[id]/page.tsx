// "use client";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { RefreshCcw, Sparkles, Upload, FileText } from "lucide-react";
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
// import { author_service, Blog, blog_service } from "@/context/AppContext";
// import toast from "react-hot-toast";
// import { blogCategory } from "../../new/page";
// import { useParams, useRouter } from "next/navigation";
// import { Author } from "next/dist/lib/metadata/types/metadata-types";
// const JoditEditor = dynamic(() => import("jodit-react"), {
//   ssr: false,
// });

// // getSingleBlog.interface.ts

// export interface GetSingleBlogResponse {
//   message: string;
//   blog: {
//     blog: Blog;
//     author: Author;
//   };
// }

// const EditBlogPage = () => {
//   const editor = useRef(null);
//   const [content, setContent] = useState("");
//   const [loading, setLoading] = useState(false);

//   const [titleInput, setTitleInput] = useState("");
//   const [descriptionInput, setDescriptionInput] = useState("");
//   const { id } = useParams();
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     category: "",
//     image: null,
//     blogcontent: "",
//   });

//   useEffect(() => {
//     setTitleInput(formData.title);
//   }, [formData.title]);

//   useEffect(() => {
//     setDescriptionInput(formData.description);
//   }, [formData.description]);

//   const handleTitleChange = (e: any) => {
//     const newTitle = e.target.value;
//     setTitleInput(newTitle);
//     setFormData((prev) => ({ ...prev, title: newTitle }));
//   };

//   const handleDescriptionChange = (e: any) => {
//     const newDescription = e.target.value;
//     setDescriptionInput(newDescription);
//     setFormData((prev) => ({ ...prev, description: newDescription }));
//   };

//   const handlerFileChange = (e: any) => {
//     const file = e.target.files[0];
//     setFormData({ ...formData, image: file });
//   };

//   const config = useMemo(
//     () => ({ readonly: false, placeholder: "Start typing..." }),
//     [],
//   );

//   const [existingImage, setExistingImage] = useState("");

//   useEffect(() => {
//     const fetchBlog = async () => {
//       setLoading(true);
//       try {
//         const { data } = await axios.get<GetSingleBlogResponse>(
//           `${blog_service}/api/v1/blog/${id}`,
//         );
//         const blog = data.blog.blog;

//         setFormData({
//           title: blog.title,
//           description: blog.description,
//           category: blog.category,
//           image: null,
//           blogcontent: blog.blogcontent,
//         });

//         setContent(blog.blogcontent);
//         setExistingImage(blog.image);
//       } catch (error) {
//         console.log(error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (id) fetchBlog();
//   }, [id]);

//   const handleSubmit = () => {};

//   return (
//     <div className="min-h-screen relative py-8 px-4 sm:px-6 lg:px-8">
//       {/* Background */}
//       <div className="fixed inset-0 -z-10">
//         <img
//           src="https://images.unsplash.com/photo-1557683316-973673baf926?w=1920&q=80"
//           alt="background"
//           className="w-full h-full object-cover"
//         />
//         <div className="absolute inset-0 bg-linear-to-br from-white/95 via-amber-50/90 to-stone-100/95 backdrop-blur-sm"></div>
//       </div>

//       <div className="max-w-4xl mx-auto">
//         <Card className="shadow-2xl border-0 rounded-3xl bg-white/90 backdrop-blur-md overflow-hidden">
//           <CardHeader className="bg-linear-to-r from-amber-500 to-orange-500 text-white p-8">
//             <div className="flex items-center gap-3">
//               <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
//                 <FileText className="w-7 h-7" />
//               </div>
//               <div>
//                 <CardTitle className="text-3xl font-serif">
//                   Create New Blog
//                 </CardTitle>
//                 <p className="text-sm opacity-90 mt-1">
//                   Share your story with the world
//                 </p>
//               </div>
//             </div>
//           </CardHeader>

//           <CardContent className="p-6 sm:p-8">
//             <form onSubmit={handleSubmit} className="space-y-6">
//               {/* Title */}
//               <div className="space-y-2">
//                 <Label
//                   htmlFor="title"
//                   className="text-stone-700 font-semibold flex items-center gap-2"
//                 >
//                   <span>Title</span>
//                   <span className="text-red-500">*</span>
//                 </Label>
//                 <div className="flex gap-2">
//                   <Input
//                     name="title"
//                     required
//                     value={titleInput}
//                     onChange={handleTitleChange}
//                     placeholder="Enter an engaging title..."
//                   />
//                 </div>
//               </div>

//               {/* Description */}
//               <div className="space-y-2">
//                 <Label
//                   htmlFor="description"
//                   className="text-stone-700 font-semibold flex items-center gap-2"
//                 >
//                   <span>Description</span>
//                   <span className="text-red-500">*</span>
//                 </Label>
//                 <div className="flex gap-2">
//                   <Input
//                     name="description"
//                     required
//                     value={descriptionInput}
//                     onChange={handleDescriptionChange}
//                     placeholder="Brief description of your blog..."
//                   />
//                 </div>
//               </div>

//               {/* Category & Image */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <Label
//                     htmlFor="category"
//                     className="text-stone-700 font-semibold flex items-center gap-2"
//                   >
//                     <span>Category</span>
//                     <span className="text-red-500">*</span>
//                   </Label>
//                   <Select
//                     required
//                     onValueChange={(value) =>
//                       setFormData((prev) => ({ ...prev, category: value }))
//                     }
//                   >
//                     <SelectTrigger className="border-stone-300 focus:border-amber-400 focus:ring-amber-400 rounded-lg">
//                       <SelectValue
//                         placeholder={formData.category || "Select Category"}
//                       />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectGroup>
//                         <SelectLabel>Categories</SelectLabel>
//                         {blogCategory.map((category) => (
//                           <SelectItem key={category} value={category}>
//                             {category}
//                           </SelectItem>
//                         ))}
//                       </SelectGroup>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="space-y-2">
//                   <Label
//                     htmlFor="image"
//                     className="text-stone-700 font-semibold flex items-center gap-2"
//                   >
//                     <span>Cover Image</span>
//                     <span className="text-red-500">*</span>
//                   </Label>
//                   {existingImage && !formData.image && (
//                     <img
//                       src={existingImage}
//                       className="w-40 h-40 object-cover rounded mb-2"
//                       alt=""
//                     />
//                   )}
//                   <div className="relative">
//                     <Input
//                       type="file"
//                       name="image"
//                       accept="image/*"
//                       required
//                       onChange={handlerFileChange}
//                       className="border-stone-300 focus:border-amber-400 focus:ring-amber-400 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Content Editor */}
//               <div className="space-y-2">
//                 <div className="flex items-center justify-between">
//                   <Label
//                     htmlFor="content"
//                     className="text-stone-700 font-semibold flex items-center gap-2"
//                   >
//                     <span>Content</span>
//                     <span className="text-red-500">*</span>
//                   </Label>
//                 </div>
//                 <p className="text-xs text-stone-500">
//                   💡 Write your blog content using the rich text editor below
//                 </p>
//                 <div className="border-2 border-stone-200 rounded-lg overflow-hidden">
//                   <JoditEditor
//                     ref={editor}
//                     value={content}
//                     config={config}
//                     tabIndex={1}
//                     onBlur={(newContent) => {
//                       setContent(newContent);
//                       setFormData((prev) => ({
//                         ...prev,
//                         blogcontent: newContent,
//                       }));
//                     }}
//                   />
//                 </div>
//               </div>

//               {/* Submit Button */}
//               <Button
//                 type="submit"
//                 className="w-full py-6 bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <>
//                     <RefreshCcw className="w-5 h-5 mr-2 animate-spin" />
//                     Publishing...
//                   </>
//                 ) : (
//                   <>
//                     <Upload className="w-5 h-5 mr-2" />
//                     Publish Blog
//                   </>
//                 )}
//               </Button>
//             </form>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default EditBlogPage;

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
import {
  author_service,
  Blog,
  blog_service,
  useAppData,
} from "@/context/AppContext";
import toast from "react-hot-toast";
import { blogCategory } from "../../new/page";
import { useParams, useRouter } from "next/navigation";
import { Author } from "next/dist/lib/metadata/types/metadata-types";

const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
});

// Correct interface based on actual API response
export interface GetSingleBlogResponse {
  message: string;
  blogs: {
    // Note: it's "blogs" not "blog"
    blog: Blog;
    author: Author;
  };
}

const EditBlogPage = () => {
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const router = useRouter();
  const { fetchBlogs } = useAppData();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    image: null as File | null,
    blogcontent: "",
  });

  const [existingImage, setExistingImage] = useState("");

  const config = useMemo(
    () => ({ readonly: false, placeholder: "Start typing..." }),
    [],
  );

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setFormData((prev) => ({ ...prev, title: newTitle }));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDescription = e.target.value;
    setFormData((prev) => ({ ...prev, description: newDescription }));
  };

  const handlerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
    }
  };

  // Fetch blog data when component mounts
  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const { data } = await axios.get<GetSingleBlogResponse>(
          `${blog_service}/api/v1/blog/${id}`,
        );

        // Correct structure: data.blogs.blog (note: "blogs" not "blog")
        const blog = data.blogs.blog;

        if (!blog) {
          toast.error("Blog not found");
          return;
        }

        // Set form data with fetched values
        setFormData({
          title: blog.title || "",
          description: blog.description || "",
          category: blog.category || "",
          image: null,
          blogcontent: blog.blogcontent || "",
        });

        // Set content for editor
        setContent(blog.blogcontent || "");

        // Set existing image
        setExistingImage(blog.image || "");

        toast.success("Blog loaded successfully");
      } catch (error: any) {
        console.error("Error fetching blog:", error);
        toast.error(error.response?.data?.message || "Failed to load blog");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, blog_service]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (
      !formData.title ||
      !formData.description ||
      !formData.category ||
      !formData.blogcontent
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      const token = Cookies.get("token");

      if (!token) {
        toast.error("Please login to update blog");
        router.push("/login");
        return;
      }

      const formDataToSend = new FormData();

      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("blogcontent", formData.blogcontent);

      // Only append image if a new one is selected
      if (formData.image) {
        formDataToSend.append("file", formData.image);
      }

      const response = await axios.post(
        `${author_service}/api/v1/blog/update/${id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Blog updated successfully!");
      fetchBlogs();
    } catch (error: any) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Failed to update blog");
    } finally {
      setLoading(false);
    }
  };

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
                <CardTitle className="text-3xl font-serif">Edit Blog</CardTitle>
                <p className="text-sm opacity-90 mt-1">Update your story</p>
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
                <Input
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleTitleChange}
                  placeholder="Enter an engaging title..."
                  className="border-stone-300 focus:border-amber-400 focus:ring-amber-400 rounded-lg"
                />
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
                <Input
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleDescriptionChange}
                  placeholder="Brief description of your blog..."
                  className="border-stone-300 focus:border-amber-400 focus:ring-amber-400 rounded-lg"
                />
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
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger className="border-stone-300 focus:border-amber-400 focus:ring-amber-400 rounded-lg">
                      <SelectValue placeholder="Select Category" />
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
                    {!existingImage && <span className="text-red-500">*</span>}
                  </Label>
                  {existingImage && !formData.image && (
                    <div className="mb-2">
                      <p className="text-xs text-stone-500 mb-1">
                        Current image:
                      </p>
                      <img
                        src={existingImage}
                        className="w-full h-32 object-cover rounded-lg border-2 border-stone-200"
                        alt="Current blog cover"
                      />
                    </div>
                  )}
                  <div className="relative">
                    <Input
                      type="file"
                      name="image"
                      accept="image/*"
                      required={!existingImage}
                      onChange={handlerFileChange}
                      className="border-stone-300 focus:border-amber-400 focus:ring-amber-400 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                    />
                    {existingImage && (
                      <p className="text-xs text-stone-500 mt-1">
                        Leave empty to keep current image
                      </p>
                    )}
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
                    Updating...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5 mr-2" />
                    Update Blog
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

export default EditBlogPage;
