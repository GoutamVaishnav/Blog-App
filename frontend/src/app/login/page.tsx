// "use client";
// import React from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardAction,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import axios from "axios";
// import Cookies from "js-cookie";
// import { user_service } from "@/context/AppContext";
// import toast from "react-hot-toast";
// import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";

// const LoginPage = () => {
//   const responseGoogle = async (authResult: any) => {
//     try {
//       const result = await axios.post(`${user_service}/api/v1/login`, {
//         code: authResult["code"],
//       });
//       Cookies.set("token", result.data.token, {
//         expires: 7,
//         secure: true,
//         path: "/",
//       });
//     toast.success(result.data.message);
//     } catch (error) {
//       console.log("error", error)
//       toast.error("problem while login .");
//     }
//   };

//   const googleLogin= useGoogleLogin({
//     onSuccess: responseGoogle,
//     onError: responseGoogle,
//     flow: 'auth-code',
//   })

//   return (
//     <div className="flex mt-50 items-center justify-center  p-4">
//       {" "}
//       <Card className="w-full max-w-sm">
//         <CardHeader>
//           <CardTitle className="text-2xl">
//             Login to The Reading Retreat
//           </CardTitle>
//           <CardDescription>You are going to blog app!</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Button onClick={googleLogin}>
//             Login with Google{" "}
//             <img src="/google.png" alt="Google Icon" className="ml-2 w-5 h-5" />
//           </Button>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default LoginPage;

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import Cookies from "js-cookie";
import { useAppData, user_service } from "@/context/AppContext";
import toast from "react-hot-toast";
import { useGoogleLogin } from "@react-oauth/google";
import { redirect } from "next/dist/client/components/navigation";
import Loadingg from "@/components/Loadingg";


interface LoginResponse {
  user: any;
  message: string;
  token: string;
}

const LoginPage = () => {
  const {  setUser, isauth, loading, setLoading, setIsauth } = useAppData();

  if (isauth) {
    return redirect("/");
  }
  const responseGoogle = async (authResult: any) => {
    setLoading(true);
    try {
      const result = await axios.post<LoginResponse>(
        `${user_service}/api/v1/login`,
        {
          code: authResult.code,
        }
      );

      Cookies.set("token", result.data.token, {
        expires: 7,
        secure: true,
        path: "/",
      });

      toast.success(result.data.message);
      setIsauth(true);
      setLoading(false);
      setUser(result.data.user);
    } catch (error) {
      console.log("error", error);
      toast.error("problem while login.");
      setLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  return (
    <>
      {loading ? (
        <Loadingg />
      ) : (
        <div className="flex mt-50 items-center justify-center p-4">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle className="text-2xl">
                Login to The Reading Retreat
              </CardTitle>
              <CardDescription>You are going to blog app!</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={googleLogin}>
                Login with Google
                <img
                  src="/google.png"
                  alt="Google Icon"
                  className="ml-2 w-5 h-5"
                />
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default LoginPage;
