import { config } from "@keystone-6/core";
import { lists } from "./schema";
import { withAuth, session } from "./auth";
import "dotenv/config";

export default withAuth(
  config({
    db: {
      provider: "postgresql",
      url: process.env.DATABASE_URL!,
    },
    lists,
    session,
    server: {
      port: Number(process.env.APP_PORT) || 3000
    },
    graphql: {
      cors: {
        credentials: true,
        origin: [process.env.FRONTEND_URL!],
      },
    },
  }),
);
