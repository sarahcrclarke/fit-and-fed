import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// The app is published to GitHub Pages at https://<user>.github.io/fit-and-fed/, so every
// built URL needs that prefix. Override with BASE_PATH=/ when serving from a domain root.
const base = process.env.BASE_PATH ?? '/fit-and-fed/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
})
