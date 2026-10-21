
import "./App.css";

import ClockApp from "./widgets/sale-countdown/ui/ClockApp";
import Header from "./widgets/header/ui/Header";
import AppRouter from "./app/router/router";

export default function App() {
  return (
    <div>
      <div className="clockFix">
        <ClockApp />
      </div>

      <Header />

      <AppRouter />
    </div>
  );
}
