import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Header } from "./components/Header";
import { ProgressProvider } from "./hooks/useProgress";
import { Bookmarks } from "./pages/Bookmarks";
import { Dashboard } from "./pages/Dashboard";
import { Home } from "./pages/Home";
import { Quiz } from "./pages/Quiz";
import { QuizSetup } from "./pages/QuizSetup";
import { Results } from "./pages/Results";

export function App() {
  return (
    <ProgressProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-[#FAFAFA] text-[#1D1D1F]">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/setup/:countParam" element={<QuizSetup />} />
            <Route path="/quiz/:sessionId" element={<Quiz />} />
            <Route path="/results/:sessionId" element={<Results />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ProgressProvider>
  );
}

export default App;

