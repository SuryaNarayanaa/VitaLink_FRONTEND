/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./app/**/*.{js,jsx,ts,tsx}","./components/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
      extend: {
        fontFamily: {
          primary: ["Inter", "sans-serif"],
          secondary: ["Roboto Mono", "monospace"],
          primaryBold: ["Inter-Bold", "sans-serif"],
          secondaryBold: ["Roboto Mono Bold", "monospace"],
          primarySemibold: ["Inter-SemiBold", "sans-serif"],
          secondarySemibold: ["Roboto Mono SemiBold", "monospace"],
        },
        colors: {
          primary: "#648FFF",       
          secondary: "#785EF0",    
          accent: "#DC267F",      
          warning: "#FE6100",     
          info: "#FFB000",        
          background: {
            primary: "#ffffff99",   
            missed: "lightblue",  
          },
        },
      },
    },
    plugins: [],
  }