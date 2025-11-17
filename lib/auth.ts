import { jwtVerify, SignJWT } from "jose"
import { cookies } from "next/headers"
import type { User } from "@prisma/client"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
const secretKey = new TextEncoder().encode(JWT_SECRET)

export async function signJwtToken(payload: any) {
  try {
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1d")  // Token expiry set to 1 day
      .sign(secretKey)

    return token
  } catch (error) {
    console.error("Error signing JWT token:", error)
    throw new Error("Failed to sign JWT token")
  }
}

export async function verifyJwtToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secretKey)
    return payload
  } catch (error) {
    console.error("Error verifying JWT token:", error)
    if (error instanceof Error && error.message.includes("jwt expired")) {
      throw new Error("Token expired")
    }
    throw new Error("Invalid token")
  }
}

export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    console.log("No token found in cookies")
    return null
  }

  try {
    const payload = await verifyJwtToken(token)
    return payload
  } catch (error) {
    console.error("Failed to verify token:", error)
    return null
  }
}

export type UserWithoutPassword = Omit<User, "password">

export function sanitizeUser(user: User): UserWithoutPassword {
  const { password, ...userWithoutPassword } = user
  return userWithoutPassword
}
