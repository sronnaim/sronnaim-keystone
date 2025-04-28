import { createAuth } from "@keystone-6/auth";
import { statelessSessions } from "@keystone-6/core/session";
import 'dotenv/config'

const { withAuth } = createAuth({
  listKey: "User",
  identityField: "email",
  sessionData: "name email id isAdmin",
  secretField: "password",

  // initFirstItem: {
  //   fields: ["name", "email", "password"],
  // },
});

// statelessSessions uses cookies for session tracking
//   these cookies have an expiry, in seconds
//   we use an expiry of 30 days for this starter
const sessionMaxAge = 60 * 60 * 24 * 30;

// you can find out more at https://keystonejs.com/docs/apis/session#session-api
const session = statelessSessions({
  maxAge: sessionMaxAge,
  secret: process.env.SESSION_SECRET,
  secure: true,
  sameSite: process.env.NODE_ENV === "production" ? "strict" : "none",
});

export { withAuth, session };
