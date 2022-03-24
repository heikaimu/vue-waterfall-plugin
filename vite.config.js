/*
 * @Author: Yaowen Liu
 * @Date: 2022-03-24 09:35:56
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2022-03-24 13:40:52
 */
// vite.config.js
import path from 'path'
import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'

const target = process.env.TARGET

let buildConfig = {
  outDir: 'netlify-page',
}

if (target === 'npm') {
  buildConfig = {
    lib: {
      entry: path.resolve(__dirname, 'lib/index.js'),
      name: 'MyLib',
      fileName: (format) => `my-lib.${format}.js`,
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  }
}

export default defineConfig({
  build: { ...buildConfig },
  plugins: [
    createVuePlugin(/* options */)
  ],
  server: {
    open: true,
  },
})