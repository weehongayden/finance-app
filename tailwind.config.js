/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        haffer: ["var(--font-haffer)"],
        roobert: ["var(--font-roobert)"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
