import { Inter, JetBrains_Mono, Manrope } from "next/font/google";

/** Site fonts — shared by the site layout and the global 404 page */
const manrope = Manrope({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-manrope", display: "swap" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-inter", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-jetbrains", display: "swap" });

export const fontVariables = `${manrope.variable} ${inter.variable} ${jetbrains.variable}`;
