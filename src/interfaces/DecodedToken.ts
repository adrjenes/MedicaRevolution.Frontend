import { JwtPayload } from "jwt-decode";

 export interface DecodedToken extends JwtPayload {
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname": string;
  }