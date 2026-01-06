"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { useAppData } from "@/context/AppContext";
import Loadingg from "@/components/Loadingg";

const Home = () => {
  const { loading } = useAppData();

  return (
    <div>
      {loading ? (
        <Loadingg />
      ) : (
        <Button variant="destructive">Destructive</Button>
      )}
    </div>
  );
};

export default Home;
