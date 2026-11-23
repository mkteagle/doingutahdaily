import { auth } from "@/auth";

export const GET = (request: Request) => auth.handler(request);
export const HEAD = GET;
