import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { initNative } from "./lib/native";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// Až po vykreslení: `initNative` mimo jiné schovává splash a ten má zmizet
// ve chvíli, kdy je co ukázat. Na webu se funkce hned vrátí a nic nenačte.
void initNative();
