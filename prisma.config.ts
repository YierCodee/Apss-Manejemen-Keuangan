import { config } from "dotenv";
import { resolve } from "path";
import { defineConfig, env } from "prisma/config";

config({ path: resolve(__dirname, ".env.local") });

export default defineConfig({
  schema: "src/prisma/schema.prisma",
  datasource: {
    url: env("DIRECT_URL"),
  },
});
