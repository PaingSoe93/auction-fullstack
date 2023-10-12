import "./App.css";
import AppRoutes from "./routes/appRoutes";
import AppLayout from "./layout";
import { useRoutes } from "react-router-dom";

function App() {
  const appRouting = useRoutes(AppRoutes);
  return (
    <>
      <AppLayout>{appRouting}</AppLayout>
    </>
  );
}

export default App;
