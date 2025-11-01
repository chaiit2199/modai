import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    // Desktop-first: thay thế hoàn toàn breakpoints mặc định
    // Không dùng extend để tránh giữ lại breakpoints min-width
    screens: {
      'xl': { 'max': '1280px' },
      'lg': { 'max': '1024px' },
      'md': { 'max': '768px' },
      'sm': { 'max': '640px' },
    },
  },
  plugins: [],
};

export default config;