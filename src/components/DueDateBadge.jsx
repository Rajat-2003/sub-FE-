// src/components/DueDateBadge.jsx
import React from "react";
import { differenceInCalendarDays, isToday, isPast } from "date-fns";

const DueDateBadge = ({ dueDate }) => {
  const today = new Date();
  const targetDate = new Date(dueDate);

  let label = "";
  let colorClass = "";

  if (isToday(targetDate)) {
    label = "Due Today";
    colorClass = "bg-yellow-100 text-yellow-800 border-yellow-400";
  } else if (isPast(targetDate)) {
    const overdueDays = differenceInCalendarDays(today, targetDate);
    label = `Overdue by ${overdueDays} day${overdueDays > 1 ? "s" : ""}`;
    colorClass = "bg-red-100 text-red-800 border-red-400";
  } else {
    const daysLeft = differenceInCalendarDays(targetDate, today);
    label = `Due in ${daysLeft} day${daysLeft > 1 ? "s" : ""}`;
    colorClass = "bg-green-100 text-green-800 border-green-400";
  }

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium border ${colorClass}`}
    >
      {label}
    </span>
  );
};

export default DueDateBadge;
