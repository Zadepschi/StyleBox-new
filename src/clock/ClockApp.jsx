import "./ClockApp.css";
import { useState, useEffect } from "react";
import Clock from "./Clock";

function ClockApp() {
  // Состояния для отсчета времени
  const [timerDays, setTimerDays] = useState();
  const [timerHours, setTimerHours] = useState();
  const [timerMinutes, setTimerMinutes] = useState();
  const [timerSeconds, setTimerSeconds] = useState();

  useEffect(() => {
    // Дата окончания акции
    const countDownDate = new Date("December 31, 2025 23:59:59").getTime();

    // Запускаем таймер
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = countDownDate - now;

      // Если время вышло — останавливаем таймер
      if (distance < 0) {
        clearInterval(interval);
      } else {
        // Вычисляем оставшееся время
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (distance % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Обновляем состояние
        setTimerDays(days);
        setTimerHours(hours);
        setTimerMinutes(minutes);
        setTimerSeconds(seconds);
      }
    }, 1000); // Каждую секунду

    // Очистка таймера при размонтировании компонента
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <div className="line">
        <h2 className="sale">BIG SALE</h2>
        <Clock
          timerDays={timerDays}
          timerHours={timerHours}
          timerMinutes={timerMinutes}
          timerSeconds={timerSeconds}
        />
      </div>
    </div>
  );
}

export default ClockApp;
