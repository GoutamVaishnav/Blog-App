"use client";
import React from "react";
import Loadingg from "@/components/Loadingg";
import { Button } from "@/components/ui/button";
import { Filter, Newspaper } from "lucide-react";
import { useAppData } from "@/context/AppContext";
import { useSidebar } from "@/components/ui/sidebar";
import BlogCard from "@/components/BlogCard";

const Blogs = () => {
  const { loading, blogLoading, blogs } = useAppData();
  const { toggleSidebar } = useSidebar();

  return (
    <div className="min-h-screen relative">
      {/* Background Image with Overlay - matching profile */}
      <div className="fixed inset-0 -z-10">
        <img
          src="https://images.unsplash.com/photo-1557683316-973673baf926?w=1920&q=80"
          alt="background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-br from-white/95 via-amber-50/90 to-stone-100/95 backdrop-blur-sm"></div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <Loadingg />
        </div>
      ) : (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mb-8 sm:mb-12">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-800">
                Latest Blog
              </h1>
              <p className="text-sm sm:text-base text-stone-600">
                Explore our collection of {blogs?.length || 0} articles
              </p>
            </div>

            <Button
              onClick={toggleSidebar}
              className="flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 font-medium"
            >
              <Filter size={18} className="sm:w-5 sm:h-5" />
              <span>Filter Blogs</span>
            </Button>
          </div>

          {/* Blog Grid Section */}
          {blogLoading ? (
            <div className="flex items-center justify-center py-16 sm:py-24">
              <Loadingg />
            </div>
          ) : (
            <>
              {blogs?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 sm:py-24 px-4">
                  <div className="bg-linear-to-br from-amber-100 to-stone-100 rounded-full p-8 sm:p-10 mb-6 shadow-md border border-amber-200">
                    <Newspaper
                      size={48}
                      className="sm:w-16 sm:h-16 text-amber-600"
                    />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-800 mb-3 text-center">
                    No Blogs Yet
                  </h3>
                  <p className="text-sm sm:text-base text-stone-600 text-center max-w-md">
                    Check back soon for exciting new content and stories!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                  {blogs.map((blog, index) => (
                    <div
                      key={blog.id}
                      className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <BlogCard
                        image={blog.image}
                        title={blog.title}
                        desc={blog.description}
                        id={blog.id}
                        time={blog.create_at}
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Blogs;
