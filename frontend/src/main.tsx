
  import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
  import "./index.css";
  import "leaflet/dist/leaflet.css";
  import "./utils/leafletFix";



  createRoot(document.getElementById("root")!).render(<App />);
  