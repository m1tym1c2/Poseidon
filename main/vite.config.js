import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  const processEnv = {};
  for (const key in env) {
    if (key.startsWith('VITE_')) {
      processEnv[`import.meta.env.${key}`] = JSON.stringify(env[key]);
    }
    processEnv[`process.env.${key}`] = JSON.stringify(env[key]);
  }

  return {
    define: {
      ...processEnv,
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
    plugins: [react()],
    server: {
      watch: {
        usePolling: true,
      },
    },
    optimizeDeps: {
      include: [],
    },
  };
});