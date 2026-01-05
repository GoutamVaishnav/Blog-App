import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
const LoginPage = () => {
  return (
    <div className="flex mt-[200px] items-center justify-center  p-4">
      {" "}
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login to The Reading Retreat</CardTitle>
          <CardDescription>You are going to blog app!</CardDescription>
        </CardHeader>
        <CardContent>
          <Button>Login with Google <img src="/google.png" alt="Google Icon" className="ml-2 w-5 h-5" /></Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
