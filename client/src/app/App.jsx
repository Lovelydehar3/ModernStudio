import AppRouter from "../routes/AppRouter";
import { ToastProvider } from "../components/ui/ToastContext";

function App() {
  return (
    <ToastProvider>
      <AppRouter />
    </ToastProvider>
  );
}

export default App;
