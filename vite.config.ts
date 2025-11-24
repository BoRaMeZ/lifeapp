
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Permite acceso desde la red local
  },
  define: {
    // Inyectamos tu API Key directamente para que funcione en Vercel sin configuración extra
    'process.env.API_KEY': JSON.stringify("AIzaSyD9lsVMXwFZZIScX0OZ-II6dyu0UT3bGJI"),
    // Previene errores con otras librerías que busquen process.env
    'process.env': {} 
  }
});