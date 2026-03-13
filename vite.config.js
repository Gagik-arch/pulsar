import { defineConfig } from 'vite';
import path from 'path';
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
        lib: {
            entry: path.resolve(__dirname, 'src/main.js'),
            name: 'pulse',
            formats: ["es", "cjs", "umd"],
            fileName: (format) => `pulsar.${format}.js`,
        },
        rollupOptions: {
            external: []
        },
        sourcemap: true,
    },
    plugins: [dts()]
});