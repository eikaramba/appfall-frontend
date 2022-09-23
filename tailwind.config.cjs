/** @type {import('tailwindcss').Config} */

import daisyui from "daisyui";
import typography from "@tailwindcss/typography";

export default {
  content: ['./src/**/*.{svelte,js,ts}'],
  plugins: [daisyui,typography],
  daisyui: {
    themes: [
      {
        abtheme: {
          primary: "#36AB68",
          "primary-content": "#ffffff",
          secondary: "#5A3A31",
          "secondary-content": "#ffffff",
          accent: "#E96A56",
          "accent-content": "#E96A56",
          neutral: "#393E41",
          "neutral-content": "#f9fafb",
          "base-100": "#F0EEED",
          "base-content": "#393E41",
          "--animation-btn": "0",
          "--animation-input": "0",
          "--btn-focus-scale": "1",
        },
      },
    ],
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Verdana','sans-serif'],
        serif: ['Inter', 'Verdana','serif']
      },
    },
  },
  darkmode: false
}