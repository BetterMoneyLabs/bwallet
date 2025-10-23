//import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
//import vueDevTools from 'vite-plugin-vue-devtools'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import wasm from "vite-plugin-wasm";

// https://vite.dev/config/
export default defineConfig({
    publicDir: "public",
    base: './',
    plugins: [
        vue(),
        nodePolyfills({
            include: ['buffer']
        }),
        wasm(),
        //vueDevTools(),
    ],
    //resolve: {
    //  alias: {
    //    '@': fileURLToPath(new URL('./src', import.meta.url))
    //  },
    //},
})
