import { jwtDecode } from "jwt-decode";

type DecodedToken = {
  exp: number; // expiration timestamp in seconds
};

export function isTokenExpired(token: string): boolean {
  try {
    const decoded: DecodedToken = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true; // treat invalid as expired
  }
}