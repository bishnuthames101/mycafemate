import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cafe theme colors
        coffee: {
          50: "#FAF6F3",
          100: "#F5EDE7",
          200: "#E8D5C4",
          300: "#DBBDA1",
          400: "#C8945C",
          500: "#B67B3D",
          600: "#9A6633",
          700: "#7D5229",
          800: "#5E3E1F",
          900: "#3F2915",
        },
        cream: {
          50: "#FFFCFA",
          100: "#FFF8F3",
          200: "#FFF0E6",
          300: "#FFE8D9",
          400: "#FFD8BF",
          500: "#FFC8A6",
          600: "#E5B495",
          700: "#CCA084",
        },
        tea: {
          50: "#F7F5F0",
          100: "#EBE6D9",
          200: "#D7CDBA",
          300: "#C3B49B",
          400: "#AF9B7C",
          500: "#8B7355",
          600: "#6F5C44",
        },
        // shadcn/ui theme colors
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        cafe: "0 4px 20px rgba(182, 123, 61, 0.1)",
        "cafe-lg": "0 10px 40px rgba(182, 123, 61, 0.15)",
      },
      backgroundImage: {
        "cafe-gradient": "linear-gradient(135deg, #B67B3D 0%, #8B7355 100%)",
        "cream-gradient": "linear-gradient(135deg, #FFF8F3 0%, #FFE8D9 100%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
