import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  base: '',
  server: {
    port: 3000,
    host: '0.0.0.0'
  },
});