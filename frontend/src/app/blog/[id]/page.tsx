// "use client";

// import Loadingg from "@/components/Loadingg";
// import { Blog, blog_service, useAppData, User } from "@/context/AppContext";
// import { useParams } from "next/navigation";
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// interface BlogApiResponse {
//   message: string;
//   blog: {
//     blog: Blog;
//     author: User;
//   };
// }

// const BlogPage = () => {
//   const { isauth, user } = useAppData();
//   const { id } = useParams();

//   const [blog, setBlog] = useState<Blog | null>(null);
//   const [author, setAuthor] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   async function fetchSingleBlog() {
//     try {
//       setLoading(true);

//       const { data } = await axios.get<BlogApiResponse>(
//         `${blog_service}/api/v1/blog/${id}`
//       );

//       // ✅ Correct nesting
//       setBlog(data.blog.blog);
//       setAuthor(data.blog.author);
//       console.log("single");
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     fetchSingleBlog();
//   }, [id]);

//   if (!blog) {
//     return <Loadingg />;
//   }

//   return <div>blogpahe </div>;
// };

// export default BlogPage;

"use client";

import Loadingg from "@/components/Loadingg";
import {
  author_service,
  Blog,
  blog_service,
  useAppData,
  User,
} from "@/context/AppContext";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Bookmark,
  BookmarkCheck,
  Edit,
  Trash2,
  TrashIcon,
  User2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
interface BlogApiResponse {
  message: string;
  blogs: {
    blog: Blog;
    author: User;
  };
}

interface Comment {
  id: string;
  userid: string;
  comment: string;
  create_at: string;
  username: string;
}

const BlogPage = () => {
  const { isauth, user, fetchBlogs, getSavedBlogs, savedBlogs } = useAppData();
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [blog, setBlog] = useState<Blog | null>(null);
  const [author, setAuthor] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchBlog = async () => {
      try {
        setLoading(true);

        const { data } = await axios.get<BlogApiResponse>(
          `${blog_service}/api/v1/blog/${id}`,
        );

        if (data?.blogs?.blog) {
          setBlog(data.blogs.blog);
          setAuthor(data.blogs.author);
        } else {
          setBlog(null);
        }
      } catch (err) {
        console.error(err);
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  async function deletBlog() {
    if (confirm("Are you sure you want to delete this blog")) {
      try {
        setLoading(true);
        const token = Cookies.get("token");
        const { data } = await axios.delete<any>(
          `${author_service}/api/v1/blog/delete/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        toast.success(data.message);
        router.push("/blogs");
        setTimeout(() => {
          fetchBlogs();
        }, 4000);
      } catch (error) {
        toast.error("Problem while deleting comment");
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  }

  const deleteComment = async (id: string) => {
    if (confirm("Are you sure you want to delete this comment")) {
      try {
        setLoading(true);
        const token = Cookies.get("token");
        const { data } = await axios.delete<any>(
          `${blog_service}/api/v1/comment/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        toast.success(data.message);
        fetchComment();
      } catch (error) {
        toast.error("Problem while deleting comment");
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const [comments, setComments] = useState<Comment[]>([]);

  async function fetchComment() {
    try {
      setLoading(true);
      const { data } = await axios.get<any>(
        `${blog_service}/api/v1/comment/${id}`,
      );
      setComments(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchComment();
  }, [id]);

  const [comment, setComment] = useState("");

  async function addComment() {
    try {
      setLoading(true);
      const token = Cookies.get("token");
      const { data } = await axios.post<any>(
        `${blog_service}/api/v1/comment/${id}`,
        { comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success(data.message);
      setComment("");
    } catch (error) {
      toast.error("Problem while adding comment");
    } finally {
      setLoading(false);
    }
  }

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (savedBlogs && savedBlogs.some((b) => b.blogid === id)) {
      setSaved(true);
    } else {
      setSaved(false);
    }
  }, [savedBlogs, id]);

  async function saveBlog() {
    const token = Cookies.get("token");
    try {
      setLoading(true);
      const { data } = await axios.post<any>(
        `${blog_service}/api/v1/save/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success(data.message);
      setSaved(!saved);
      getSavedBlogs();
    } catch (error) {
      toast.error("Problem while saving blog");
    } finally {
      setLoading(false);
    }
  }

  // ⏳ Loading
  if (loading) return <Loadingg />;

  // ❌ Blog not found
  if (!blog)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-lg font-semibold text-gray-600">
          Blog not found 😢
        </h2>
      </div>
    );

  // ✅ Blog Found
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">
      {/* BLOG */}
      <Card className="shadow-sm border border-gray-200">
        <CardHeader className="pb-3 space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Author */}
            <Link
              href={`/profile/${author?._id}`}
              className="flex items-center gap-2 text-gray-700 hover:text-black"
            >
              <img
                src={author?.image}
                className="w-8 h-8 rounded-full object-cover"
                alt=""
              />
              <span className="font-medium">{author?.name}</span>
            </Link>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {isauth && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={saveBlog}
                  disabled={loading}
                >
                  {saved ? <BookmarkCheck /> : <Bookmark />}
                </Button>
              )}

              {blog.author === user?._id && (
                <>
                  <Button
                    size="icon"
                    onClick={() => router.push(`/blog/edit/${id}`)}
                  >
                    <Edit />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={deletBlog}
                    disabled={loading}
                  >
                    <TrashIcon />
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Blog Image */}
          <img
            src={blog.image}
            alt=""
            className="w-full max-h-80 object-contain rounded-md bg-gray-50 mb-4"
          />

          <p className="text-gray-700 mb-4">{blog.description}</p>

          <div
            className="prose prose-sm sm:prose-base max-w-none"
            dangerouslySetInnerHTML={{ __html: blog.blogcontent }}
          />
        </CardContent>
      </Card>

      {/* ADD COMMENT */}
      {isauth && (
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <h3 className="text-lg font-semibold">Leave a comment</h3>
          </CardHeader>

          <CardContent className="space-y-3">
            <Input
              placeholder="Write your comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button onClick={addComment} disabled={loading}>
              {loading ? "Posting..." : "Post Comment"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* COMMENTS */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-2">
          <h3 className="text-lg font-medium">All Comments</h3>
        </CardHeader>

        <CardContent className="space-y-4">
          {comments && comments.length > 0 ? (
            comments.map((e, i) => (
              <div
                key={i}
                className="flex items-start justify-between gap-3 border-b pb-3 last:border-none"
              >
                <div className="flex gap-3">
                  {/* USER ICON + LINK */}
                  <Link
                    href={`/profile/${e.userid}`} // 🔁 tum baad me update kar sakte ho
                    className="flex-shrink-0"
                  >
                    <div className="border border-gray-400 rounded-full p-2 hover:bg-gray-100 transition">
                      <User2 size={16} />
                    </div>
                  </Link>

                  <div>
                    <Link
                      href={`/profile/${e.userid}`}
                      className="font-semibold text-gray-800 hover:underline"
                    >
                      {e.username}
                    </Link>

                    <p className="text-sm text-gray-700 mt-1">{e.comment}</p>

                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(e.create_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                {e.userid === user?._id && (
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => deleteComment(e.id)}
                    disabled={loading}
                  >
                    <Trash2 size={16} />
                  </Button>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No comments yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogPage;

////// ye purana wala ui hai sahi chalta hai

// <div className="max-w-4xl mx-auto p-6 space-y-6">
//       <Card>
//         <CardHeader>
//           <h1 className="text-3xl text-gray-900 font-bold">{blog.title}</h1>
//           <p className="text-gray-600 mt-2 flex items-center">
//             <Link
//               href={`/profile/${author?._id}`}
//               className="flex item-center gap-2"
//             >
//               <img
//                 src={author?.image}
//                 className="w-8 h-8 rounded-full"
//                 alt=""
//               />
//               {author?.name}
//             </Link>
//             {isauth && (
//               <Button
//                 variant={"ghost"}
//                 className="mx-3 cursor-pointer"
//                 size={"lg"}
//                 onClick={saveBlog}
//                 disabled={loading}
//               >
//                 {" "}
//                 {saved ? <BookmarkCheck /> : <Bookmark />}
//               </Button>
//             )}
//             {blog.author === user?._id && (
//               <>
//                 <Button
//                   className="cursor-pointer"
//                   size={"sm"}
//                   onClick={() => {
//                     router.push(`/blog/edit/${id}`);
//                   }}
//                 >
//                   <Edit />
//                 </Button>
//                 <Button
//                   variant={"destructive"}
//                   size={"sm"}
//                   className="mx-2 cursor-pointer"
//                   onClick={deletBlog}
//                   disabled={loading}
//                 >
//                   <TrashIcon />
//                 </Button>
//               </>
//             )}
//           </p>
//         </CardHeader>
//         <CardContent>
//           <img
//             src={blog.image}
//             alt=""
//             className="w-full h-64 object-cover  rounded-lg mb-4"
//           />
//           <p className="text-lg text-gray-700 mb-4">{blog.description}</p>
//           <div
//             className="prose max-w-none"
//             dangerouslySetInnerHTML={{ __html: blog.blogcontent }}
//           />
//         </CardContent>
//       </Card>

//       {isauth && (
//         <Card>
//           <CardHeader>
//             <h3 className="text-xl font-semibold">Leave a comment</h3>
//           </CardHeader>

//           <CardContent>
//             <Label htmlFor="comment">Your Comment</Label>
//             <Input
//               id="comment"
//               placeholder="Type your comment here"
//               className="my-2"
//               value={comment}
//               onChange={(e) => setComment(e.target.value)}
//             />
//             <Button onClick={addComment} disabled={loading}>
//               {loading ? "Addding Comment...." : "Post Comment"}
//             </Button>
//           </CardContent>
//         </Card>
//       )}

//       <Card>
//         <CardHeader>
//           <h3 className="text-lg font-medium">All Comments</h3>
//         </CardHeader>
//         <CardContent>
//           {comments && comments.length > 0 ? (
//             comments.map((e, i) => {
//               return (
//                 <div key={i} className="border-b py-2 flex items-center gap-3">
//                   <div>
//                     <p className="font-semibold flex items-center gap-1">
//                       <span className="user border border-gray-400 rounded-full p-1">
//                         <User2 />
//                       </span>
//                       {e.username}
//                     </p>
//                     <p>{e.comment}</p>
//                     <p className="text-xs text-gray-500">
//                       {new Date(e.create_at).toLocaleString()}
//                     </p>
//                   </div>
//                   {e.userid === user?._id && (
//                     <Button
//                       onClick={() => deleteComment(e.id)}
//                       variant={"destructive"}
//                       disabled={loading}
//                     >
//                       <Trash2 />
//                     </Button>
//                   )}
//                 </div>
//               );
//             })
//           ) : (
//             <p>No Comments Yet</p>
//           )}
//         </CardContent>
//       </Card>
//     </div>
