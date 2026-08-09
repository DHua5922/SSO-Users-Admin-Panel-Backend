import { JwtToken } from "js-ts-kit";
import jsonwebtoken from "jsonwebtoken";

export const jwtToken = new JwtToken(
	jsonwebtoken,
	process.env.JWT_SECRET || "",
);
