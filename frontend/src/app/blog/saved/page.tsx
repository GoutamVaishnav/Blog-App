// "use client";
// import BlogCard from "@/components/BlogCard";
// import Loadingg from "@/components/Loadingg";

// import { useAppData } from "@/context/AppContext";
// import React from "react";

// const SavedBlogs = () => {
//   const { blogs, savedBlogs } = useAppData();

//   if (!blogs || !savedBlogs) {
//     return <Loadingg />;
//   }

//   const filteredBlogs = blogs.filter((blog) =>
//     savedBlogs.some((saved) => saved.blogid === blog.id.toString()),
//   );

//   return (
//     <div className="container mx-auto px-4">
//       <h1 className="text-3xl font-bold mt-2">Saved Blogs</h1>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
//         {filteredBlogs.length > 0 ? (
//           filteredBlogs.map((e, i) => {
//             return (
//               <BlogCard
//                 key={i}
//                 image={e.image}
//                 title={e.title}
//                 desc={e.description}
//                 id={e.id}
//                 time={e.create_at}
//               />
//             );
//           })
//         ) : (
//           <p>No saved blogs yet!</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SavedBlogs;
"use client";
import BlogCard from "@/components/BlogCard";
import Loadingg from "@/components/Loadingg";
import { useAppData } from "@/context/AppContext";
import React from "react";

const SavedBlogs = () => {
  const { blogs, savedBlogs } = useAppData();

  if (!blogs || !savedBlogs) {
    return <Loadingg />;
  }

  const filteredBlogs = blogs.filter((blog) =>
    savedBlogs.some((saved) => saved.blogid === blog.id.toString())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-100 to-orange-100">
      <div className="container mx-auto px-4 py-8">

        <h1 className="text-3xl font-bold mb-6 text-amber-900">
          ⭐ Saved Blogs
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredBlogs.length > 0 ? (
            filteredBlogs.map((e) => (
              <BlogCard
                key={e.id}
                image={e.image}
                title={e.title}
                desc={e.description}
                id={e.id}
                time={e.create_at}
              />
            ))
          ) : (
            <p className="text-amber-800 text-lg">
              No saved blogs yet!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedBlogs;
