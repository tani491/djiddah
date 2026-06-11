import NextAuth from "next-auth";
import authOptions from "@/lib/auth";

const handler = NextAuth(authOptions);

type RouteContext = {
  params: Promise<{ nextauth: string }> | { nextauth: string };
};

async function withNextAuthParams(context: RouteContext) {
  const params = await context.params;

  return {
    params: {
      nextauth: [params.nextauth],
    },
  };
}

export async function GET(request: Request, context: RouteContext) {
  return handler(request, await withNextAuthParams(context));
}

export async function POST(request: Request, context: RouteContext) {
  return handler(request, await withNextAuthParams(context));
}
