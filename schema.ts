import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import {
  text,
  relationship,
  password,
  timestamp,
  integer,
  checkbox,
} from "@keystone-6/core/fields";
import { document } from "@keystone-6/fields-document";
import { cloudinaryImage } from "@keystone-6/cloudinary";
import { type Lists } from ".keystone/types";
import { BaseListTypeInfo } from "@keystone-6/core/types";
import { BaseAccessArgs } from "@keystone-6/core/dist/declarations/src/types/config/access-control";
import { componentBlocks } from "./component-blocks";

const isAdmin = <T extends BaseListTypeInfo>({ session }: BaseAccessArgs<T>) =>
  Boolean(session?.data.isAdmin);
const isReadClient = <T extends BaseListTypeInfo>({ session }: BaseAccessArgs<T>) =>
  Boolean(session?.data.email === "read.client")
import 'dotenv/config'

const isOnProduction = process.env.NODE_ENV === "production"

export const lists = {
  User: list({
    access: !isOnProduction
      ? allowAll
      : {
          operation: {
            query: ({ session }) => !!session,
            create: isAdmin<Lists.User.TypeInfo>,
            update: isAdmin<Lists.User.TypeInfo>,
            delete: isAdmin<Lists.User.TypeInfo>,
          },
        },

    fields: {
      name: text({ validation: { isRequired: true } }),

      email: text({
        validation: { isRequired: true },
        isIndexed: "unique",
      }),

      password: password({ validation: { isRequired: true } }),
      posts: relationship({ ref: "Post.author", many: true }),
      createdAt: timestamp({
        defaultValue: { kind: "now" },
      }),
      isAdmin: checkbox({
        defaultValue: false,
      }),
    },
  }),

  Post: list({
    access: !isOnProduction
      ? allowAll
      : {
          operation: {
            query: ({ session }) => !!session,
            create: isAdmin<Lists.Post.TypeInfo>,
            update: ({ session }) => {
              return session.data.isAdmin || session.data.email === 'read.client'
            },
            delete: isAdmin<Lists.Post.TypeInfo>,
          },
        },

    fields: {
      title: text({ validation: { isRequired: true } }),

      slug: text({
        validation: { isRequired: true },
        isIndexed: "unique",
        isFilterable: true,
      }),
      content: document({
        formatting: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1],
        ],
        links: true,
        dividers: true,
        ui: {
          views: "./component-blocks.tsx",
        },
        componentBlocks,
      }),
      author: relationship({
        // we could have used 'User', but then the relationship would only be 1-way
        ref: "User.posts",

        // this is some customisations for changing how this will look in the AdminUI
        ui: {
          displayMode: "cards",
          cardFields: ["name", "email"],
          inlineEdit: { fields: ["name", "email"] },
          linkToItem: true,
          inlineConnect: true,
        },

        // a Post can only have one author
        //   this is the default, but we show it here for verbosity
        many: false,
      }),

      // with this field, you can add some Tags to Posts
      tags: relationship({
        // we could have used 'Tag', but then the relationship would only be 1-way
        ref: "Tag.posts",

        // a Post can have many Tags, not just one
        many: true,

        // this is some customisations for changing how this will look in the AdminUI
        ui: {
          displayMode: "cards",
          cardFields: ["name"],
          inlineEdit: { fields: ["name"] },
          linkToItem: true,
          inlineConnect: true,
          inlineCreate: { fields: ["name"] },
        },
      }),

      lastUpdated: timestamp({
        defaultValue: { kind: "now" },
        db: { updatedAt: true },
      }),

      createdAt: timestamp({
        // this sets the timestamp to Date.now() when the user is first created
        defaultValue: { kind: "now" },
      }),

      viewCount: integer({
        defaultValue: 0,
        isOrderable: true,
        ui: {
          createView: {
            fieldMode: "hidden",
          },
          itemView: {
            fieldMode: "read",
          },
          listView: {
            fieldMode: "read",
          },
        },
      }),
    },
  }),

  // this last list is our Tag list, it only has a name field for now
  Tag: list({
    access: !isOnProduction
      ? allowAll
      : {
          operation: {
            query: ({ session }) => !!session,
            create: isAdmin<Lists.Tag.TypeInfo>,
            update: isAdmin<Lists.Tag.TypeInfo>,
            delete: isAdmin<Lists.Tag.TypeInfo>,
          },
        },

    // setting this to isHidden for the user interface prevents this list being visible in the Admin UI
    ui: {
      isHidden: true,
    },

    // this is the fields for our Tag list
    fields: {
      name: text(),
      // this can be helpful to find out all the Posts associated with a Tag
      posts: relationship({ ref: "Post.tags", many: true }),
    },
  }),

  Project: list({
    access: !isOnProduction
      ? allowAll
      : {
          operation: {
            query: ({ session }) => !!session,
            create: isAdmin<Lists.Project.TypeInfo>,
            update: isAdmin<Lists.Project.TypeInfo>,
            delete: isAdmin<Lists.Project.TypeInfo>,
          },
        },
    fields: {
      name: text({
        validation: { isRequired: true },
        isFilterable: true,
      }),
      stacks: text({
        isFilterable: true,
      }),
      content: document({
        formatting: {
          softBreaks: true,
          blockTypes: {
            code: true,
          },
          inlineMarks: true,
        },
      }),
      image: cloudinaryImage({
        cloudinary: {
          apiKey: process.env.CLOUDINARY_KEY!,
          apiSecret: process.env.CLOUDINARY_SECRET!,
          cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
          folder: "@sronnaim",
        },
      }),
      githubUrl: text({
        db: {
          isNullable: true,
        },
      }),
      demoUrl: text({
        db: {
          isNullable: true,
        },
      }),
    },
  }),
} satisfies Lists;
