import NextAuth from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";

const handler = NextAuth({
  providers: [
    KeycloakProvider({
      clientId: "sentinel-frontend",
      clientSecret: "sentinel-frontend-secret-key-mock", // In a real app, this should match the Keycloak client secret if access type is confidential. For public clients, we can omit it, but next-auth expects something here.
      issuer: "http://localhost:8080/realms/sentinelos",
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        accessToken: token.accessToken,
      };
    },
  },
  session: {
    strategy: "jwt",
  },
});

export { handler as GET, handler as POST };
