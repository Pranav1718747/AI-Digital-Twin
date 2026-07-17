import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Development Login",
      credentials: {
        username: { label: "Username (admin)", type: "text", placeholder: "admin" },
        password: { label: "Password (admin)", type: "password", placeholder: "admin" }
      },
      async authorize(credentials) {
        if (credentials?.username === "admin" && credentials?.password === "admin") {
          return {
            id: "703489c2-45bd-443d-b31b-987a3d5d3e74",
            name: "Enterprise Admin",
            email: "admin@sentinelos.com",
          };
        }
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.accessToken = "mock-developer-access-token-jwt-keycloak-bypass";
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id
        },
        accessToken: token.accessToken,
      };
    },
  },
  session: {
    strategy: "jwt",
  },
});

export { handler as GET, handler as POST };
