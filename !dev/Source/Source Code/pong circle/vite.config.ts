import { defineConfig } from 'vite';
import path from 'path';
import copy from 'rollup-plugin-copy';

export default defineConfig({
  root: './src',
  base: './',
  publicDir: '../public',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'src/index.html'),
      plugins: [
        copy({
          targets: [
            { src: path.resolve(__dirname, 'public/manifest.json'), dest: path.resolve(__dirname, 'dist') }
          ],
          hook: 'buildEnd' // Ensure files are copied after the build completes
        })
      ]
    },
  },
  server: {
    port: 9001,
    host: '::',
    open: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.ts', '.js'],
  },
});
