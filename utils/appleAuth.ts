import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { PrismaClient } from '@prisma/client';
import { getToken, updateToken } from './appleMusicToken';

const prisma = new PrismaClient();

export async function getAppleToken(): Promise<string> {
  try {
    // Try to get the token from the database
    const storedToken = await getToken();

    // If a token exists and is not expired, return it
    if (storedToken && new Date(storedToken.expiresAt) > new Date()) {
      return storedToken.token;
    }

    // If no valid token exists, generate a new one
    const newToken = await generateAppleToken();

    // Store the new token in the database
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 180); // 180 days from now
    await updateToken(newToken, expirationDate);

    return newToken;
  } catch (error) {
    console.error("Error getting Apple Music token:", error);
    throw error;
  }
}

async function generateAppleToken(): Promise<string> {
  try {
    const privateKeyPath = path.join(process.cwd(), "private_key.p8");
    const privateKey = fs.readFileSync(privateKeyPath, "utf8");

    const teamId = process.env.APPLE_TEAM_ID || "";
    const keyId = process.env.APPLE_KEY_ID || "";

    const token = jwt.sign({}, privateKey, {
      algorithm: "ES256",
      expiresIn: "180d",
      issuer: teamId,
      header: {
        alg: "ES256",
        kid: keyId,
      },
    });

    return token;
  } catch (error) {
    console.error("Error generating Apple Music token:", error);
    throw error;
  }
}
