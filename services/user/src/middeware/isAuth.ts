import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User, { IUser } from "../model/User.js";

export interface AuthenticatedRequest extends Request {
  user?: IUser | null;
}

export const isAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      res.status(401).json({
        message: "Please Login - No auth header",
      });
      return;
    }
    const token = authHeader.split(" ")[1];

    const decodeValue = jwt.verify(
      token,
      process.env.JWT_SEC as string
    ) as JwtPayload; // decodeValue me user id hoti hai
    if (!decodeValue || !decodeValue.userId) {
      res.status(401).json({
        message: "Invalid Token",
      });
      return;
    }
    const user = await User.findById(decodeValue.userId);
    req.user = user;

    next();
  } catch (error) {
    console.log("jwt verification error: ", error);
    res.status(401).json({
      message: "please login - jwt error",
    });
  }
};
