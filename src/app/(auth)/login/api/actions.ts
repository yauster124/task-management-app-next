import { LoginFormData } from "./types";

export async function loginUser(data: LoginFormData) {
  try {
    const res = await fetch(`http://localhost:8080/api/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error(`Failed to log in: ${res.status} ${res.statusText}`);
    }

    return await res.text();
  } catch (error) {
    console.error("Error logging in:", error);
    throw new Error("Failed to log in");
  }
}