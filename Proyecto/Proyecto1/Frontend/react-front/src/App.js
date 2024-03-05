import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import HistoryMonitor from "./components/HistoryMonitor";
import RealTimeMonitor from "./components/RealTimeMonitor";
import ProcessTree from "./components/ProcessTree";
import SimulateProcess from "./components/SimulateProcess";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/realtimemonitor" element={<RealTimeMonitor />} />
        <Route path="/historymonitor" element={<HistoryMonitor />} />
        <Route path="/processtree" element={<ProcessTree />} />
        <Route path="/simulate" element={<SimulateProcess />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
