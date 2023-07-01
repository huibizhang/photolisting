import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

const getConfig = () => {
  if (process.env.NODE_ENV === "production")
    return {
      base: path.resolve(__dirname, "./dist/"),
      plugins: [vue()],
    };
  else if (process.env.NODE_ENV === "github")
    return {
      base: "./",
      plugins: [vue()],
    };
  else
    return {
      plugins: [vue()],
    };
};

// https://vitejs.dev/config/
export default defineConfig(getConfig());
