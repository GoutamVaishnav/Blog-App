// "use client";
// import React from "react";
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarGroup,
//   SidebarGroupLabel,
//   SidebarHeader,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
// } from "./ui/sidebar";
// import { Input } from "./ui/input";
// import { BoxSelect } from "lucide-react";
// import { blogCategory } from "@/app/blog/new/page";
// import { useAppData } from "@/context/AppContext";

// const Sidebarr = () => {
//   const { category, setCategory, searchQuery, setSearchQuery } = useAppData();
//   console.log("Current category:", category); // ✅ Check
//   console.log("Current searchQuery:", searchQuery); // ✅ Check
//   return (
//     <Sidebar >
//       <SidebarHeader className="text-2xl bg-[#ef750a]">The Reading Retreat</SidebarHeader>
//       <SidebarContent className="bg-[#FFE5CE]">
//         <SidebarGroup>
//           <SidebarGroupLabel>Search</SidebarGroupLabel>
//           <Input
//             placeholder="Search Here..."
//             className="w-full"
//             type="text"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />

//           <SidebarGroupLabel>Categories</SidebarGroupLabel>
//           <SidebarMenu>
//             {/* ✅ All button */}
//             <SidebarMenuItem>
//               <SidebarMenuButton onClick={() => setCategory("")}>
//                 <BoxSelect />
//                 <span>All</span>
//               </SidebarMenuButton>
//             </SidebarMenuItem>

//             {/* ✅ Category buttons */}
//             {blogCategory.map((e, i) => (
//               <SidebarMenuItem key={i}>
//                 <SidebarMenuButton onClick={() => setCategory(e)}>
//                   <BoxSelect />
//                   <span>{e}</span>
//                 </SidebarMenuButton>
//               </SidebarMenuItem>
//             ))}
//           </SidebarMenu>
//         </SidebarGroup>
//       </SidebarContent>
//     </Sidebar>
//   );
// };

// export default Sidebarr;

"use client";
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { Input } from "./ui/input";
import { Search, Tag, BookOpen } from "lucide-react";
import { blogCategory } from "@/app/blog/new/page";
import { useAppData } from "@/context/AppContext";

const Sidebarr = () => {
  const { category, setCategory, searchQuery, setSearchQuery } = useAppData();

  return (
    <Sidebar className="border-r border-stone-200">
      {/* Header */}
      <SidebarHeader className="bg-linear-to-r from-amber-500 to-orange-500 text-white p-6 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-serif font-bold">The Reading</h2>
            <p className="text-sm font-light opacity-90">Retreat</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-linear-to-b from-amber-50 to-orange-50/30">
        <SidebarGroup className="p-4">
          {/* Search Section */}
          <SidebarGroupLabel className="text-stone-700 font-semibold mb-3 flex items-center gap-2">
            <Search className="w-4 h-4" />
            Search Blogs
          </SidebarGroupLabel>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <Input
              placeholder="Search here..."
              className="w-full pl-10 bg-white border-stone-200 focus:border-amber-400 focus:ring-amber-400 rounded-lg shadow-sm"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Categories Section */}
          <SidebarGroupLabel className="text-stone-700 font-semibold mb-3 flex items-center gap-2">
            <Tag className="w-4 h-4" />
            Categories
          </SidebarGroupLabel>

          {/* Active Category Indicator */}
          {category && (
            <div className="mb-3 p-3 bg-amber-100 border border-amber-200 rounded-lg">
              <p className="text-xs text-amber-700 font-medium">
                Active Filter:
              </p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm font-semibold text-amber-800">
                  {category}
                </span>
                <button
                  onClick={() => setCategory("")}
                  className="text-xs text-amber-600 hover:text-amber-800 font-medium underline"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          <SidebarMenu className="space-y-1">
            {/* All Categories Button */}
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setCategory("")}
                className={`
                  w-full rounded-lg transition-all duration-200 hover:bg-white hover:shadow-md
                  ${
                    category === ""
                      ? "bg-linear-to-r from-amber-500 to-orange-500 text-white shadow-md hover:from-amber-600 hover:to-orange-600"
                      : "bg-white/60 text-stone-700 hover:text-amber-600"
                  }
                `}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    category === "" ? "bg-white" : "bg-amber-500"
                  }`}
                ></div>
                <span className="font-medium">All Categories</span>
                {category === "" && (
                  <span className="ml-auto text-xs opacity-80">✓</span>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Category Buttons */}
            {blogCategory.map((cat, i) => (
              <SidebarMenuItem key={i}>
                <SidebarMenuButton
                  onClick={() => setCategory(cat)}
                  className={`
                    w-full rounded-lg transition-all duration-200 hover:bg-white hover:shadow-md
                    ${
                      category === cat
                        ? "bg-linear-to-r from-amber-500 to-orange-500 text-white shadow-md hover:from-amber-600 hover:to-orange-600"
                        : "bg-white/60 text-stone-700 hover:text-amber-600"
                    }
                  `}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      category === cat ? "bg-white" : "bg-amber-500"
                    }`}
                  ></div>
                  <span className="font-medium">{cat}</span>
                  {category === cat && (
                    <span className="ml-auto text-xs opacity-80">✓</span>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* Footer Info */}
        <div className="p-4 mt-auto">
          <div className="bg-white/80 rounded-lg p-4 shadow-sm border border-stone-200">
            <p className="text-xs text-stone-600 text-center">
              Discover amazing stories and insights
            </p>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default Sidebarr;
