import { config, createSchema } from "@keystone-next/keystone/schema";
import { withItemData, statelessSessions } from '@keystone-next/keystone/session';
import { createAuth } from '@keystone-next/auth'
import "dotenv/config";
import { User } from "./schemas/User";
import { Product } from "./schemas/Product";
import { ProductImage } from "./schemas/ProductImage";
import { CartItem } from "./schemas/CartItem";
import { OrderItem } from "./schemas/OrderItem";
import { Order } from "./schemas/Order";
import { Role } from "./schemas/Role";
import { insertSeedData } from "./seed-data";
import { sendPasswordResetEmail } from "./lib/mail";
import { extendGraphqlSchema } from "./mutations/index";
import { permissionsList } from "./schemas/PermissionFields";

const databaseURL =
  process.env.DATABASE_URL || "mongodb://localhost/keystone-tutorial";

const sessionConfig = {
  maxAge: 60 * 60 * 24 * 360, // How long they stay signed in? 360days
  secret: process.env.COOKIE_SECRET,
};

const { withAuth } = createAuth({
  listKey: 'User',
  identityField: 'email',
  secretField: 'password',
  initFirstItem: {
    fields: ['name', 'email', 'password'],
    // TODO: add initial roles
  },
  passwordResetLink: {
    async sendToken(args) {
      await sendPasswordResetEmail(args.token, args.identity)
    }
  }
})

export default withAuth(config({
  // @ts-ignore
  server: {
    cors: {
      origin: [process.env.FRONTEND_URL],
      credentials: true,
    }
  },
  db: {
    adapter: 'mongoose',
    url: databaseURL,
    async onConnect(keystone) {
      if (process.argv.includes('--seed-data')) {
        await insertSeedData(keystone);
      }
    },
  },
  lists: createSchema({
    // schema items
    User,
    Product,
    ProductImage,
    CartItem,
    OrderItem,
    Order,
    Role,
  }),
  extendGraphqlSchema,
  ui: {
    // Only for logged users
    isAccessAllowed: ({ session }) => {
      // console.log(session);
      return !!session?.data;
    },
  },
  session: withItemData(statelessSessions(sessionConfig), {
    // Graphql Query
    User: `id name email role { ${permissionsList.join(' ')} }`,
  })
}));
