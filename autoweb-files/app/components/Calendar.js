"use client";

import { useState } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

export default function Calendar({ onDateSelect }) {
  const months = [
    "Janvāris",
    "Februāris",
    "Marts",
    "Aprīlis",
    "Maijs",
    "Jūnijs",
    "Jūlijs",
    "Augusts",
    "Septembris",
    "Oktobris",
    "Novembris",
    "Decembris",
  ];

  const weekDays = ["P", "O", "T", "C", "P", "S", "Sv"];

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set time to beginning of day for accurate comparison

  const [currentMonthIndex, setCurrentMonthIndex] = useState(
    new Date().getMonth()
  );
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    let day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const isWeekend = (dayNumber) => {
    if (dayNumber <= 0) return false;
    const date = new Date(currentYear, currentMonthIndex, dayNumber);
    const day = date.getDay();
    return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
  };

  const isToday = (dayNumber) => {
    if (dayNumber <= 0) return false;
    const date = new Date(currentYear, currentMonthIndex, dayNumber);
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };

  const isPastDate = (dayNumber) => {
    if (dayNumber <= 0) return false;
    const date = new Date(currentYear, currentMonthIndex, dayNumber);
    return date < today;
  };

  const handlePrevMonth = () => {
    setCurrentMonthIndex((prev) => {
      if (prev === 0) {
        setCurrentYear((year) => year - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonthIndex((prev) => {
      if (prev === 11) {
        setCurrentYear((year) => year + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  // Disable previous month button if it would navigate to a past month
  const isPrevMonthDisabled = () => {
    const prevMonth = currentMonthIndex === 0 
      ? { month: 11, year: currentYear - 1 }
      : { month: currentMonthIndex - 1, year: currentYear };
    
    return (prevMonth.year < today.getFullYear()) || 
           (prevMonth.year === today.getFullYear() && prevMonth.month < today.getMonth());
  };

  const daysInMonth = getDaysInMonth(currentMonthIndex, currentYear);
  const firstDayOfMonth = getFirstDayOfMonth(currentMonthIndex, currentYear);
  const totalDays = firstDayOfMonth + daysInMonth;
  const totalCells = Math.ceil(totalDays / 7) * 7;

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button 
          className="calendar-nav" 
          onClick={handlePrevMonth}
          disabled={isPrevMonthDisabled()}
          style={{ opacity: isPrevMonthDisabled() ? 0.5 : 1, cursor: isPrevMonthDisabled() ? 'not-allowed' : 'pointer' }}
        >
          <IoChevronBack />
        </button>
        <h3>
          {months[currentMonthIndex]} {currentYear}
        </h3>
        <button className="calendar-nav" onClick={handleNextMonth}>
          <IoChevronForward />
        </button>
      </div>
      <div className="calendar-weekdays">
        {weekDays.map((day, index) => (
          <div key={index} className="weekday">
            {day}
          </div>
        ))}
      </div>
      <div className="calendar-grid">
        {Array.from({ length: totalCells }, (_, i) => {
          const dayNumber = i - firstDayOfMonth + 1;
          const isValidDay = dayNumber > 0 && dayNumber <= daysInMonth;
          const isWeekendDay = isWeekend(dayNumber);
          const isTodayDate = isToday(dayNumber);
          const isPastDateDay = isPastDate(dayNumber);
          const isDisabled = !isValidDay || isWeekendDay || isPastDateDay;

          return (
            <button
              key={i}
              className={`calendar-day ${
                !isValidDay ? "calendar-day-disabled" : ""
              } ${isWeekendDay ? "calendar-day-weekend" : ""} ${
                isPastDateDay && isValidDay ? "calendar-day-past" : ""
              } ${isTodayDate ? "calendar-day-today" : ""}`}
              disabled={isDisabled && !isTodayDate}
              onClick={() => {
                if (isValidDay) {
                  if (isTodayDate) {
                    // Pass today's date with isToday flag
                    const selectedDate = new Date(currentYear, currentMonthIndex, dayNumber);
                    onDateSelect(selectedDate, true);
                  } else if (!isDisabled) {
                    const selectedDate = new Date(currentYear, currentMonthIndex, dayNumber);
                    onDateSelect(selectedDate, false);
                  }
                }
              }}
            >
              {isValidDay ? dayNumber : ""}
            </button>
          );
        })}
      </div>
    </div>
  );
}
