import React, { createContext, useContext, useState, useEffect } from 'react';

const LogContext = createContext();

// Mock historical logs to give a rich experience on first visit
const defaultLogs = [
  { date: "2026-06-13", hours: 11, sleep: 6.5, pain: 6, earnings: 850 },
  { date: "2026-06-14", hours: 12, sleep: 5.5, pain: 7, earnings: 950 },
  { date: "2026-06-15", hours: 10, sleep: 7.0, pain: 5, earnings: 800 },
  { date: "2026-06-16", hours: 13, sleep: 5.0, pain: 8, earnings: 1100 },
  { date: "2026-06-17", hours: 9,  sleep: 7.5, pain: 4, earnings: 750 },
  { date: "2026-06-18", hours: 12, sleep: 6.0, pain: 6, earnings: 980 }
];

export const LogProvider = ({ children }) => {
  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('rahat_logs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing logs from localStorage", e);
      }
    }
    return defaultLogs;
  });

  const [streak, setStreak] = useState(0);

  useEffect(() => {
    localStorage.setItem('rahat_logs', JSON.stringify(logs));
    calculateStreak(logs);
  }, [logs]);

  const addLog = (newLog) => {
    // Prevent duplicate entries for the same date by overwriting or adding
    setLogs((prevLogs) => {
      const filtered = prevLogs.filter(log => log.date !== newLog.date);
      const updated = [...filtered, newLog].sort((a, b) => new Date(a.date) - new Date(b.date));
      return updated;
    });
  };

  const calculateStreak = (logArray) => {
    if (logArray.length === 0) {
      setStreak(0);
      return;
    }
    
    // Sort logs by date descending
    const sorted = [...logArray].sort((a, b) => new Date(b.date) - new Date(a.date));
    let currentStreak = 1;
    let today = new Date();
    today.setHours(0, 0, 0, 0);

    // Let's trace consecutive dates
    let prevDate = new Date(sorted[0].date);
    prevDate.setHours(0, 0, 0, 0);

    // Check if the most recent log is today or yesterday
    const diffTimeToday = Math.abs(today - prevDate);
    const diffDaysToday = Math.ceil(diffTimeToday / (1000 * 60 * 60 * 24));
    
    if (diffDaysToday > 1) {
      // Last log was more than 1 day ago
      setStreak(0);
      return;
    }

    for (let i = 1; i < sorted.length; i++) {
      const currentDate = new Date(sorted[i].date);
      currentDate.setHours(0, 0, 0, 0);
      const diffTime = Math.abs(prevDate - currentDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        currentStreak++;
        prevDate = currentDate;
      } else if (diffDays === 0) {
        // Same day, ignore
        continue;
      } else {
        break; // Streak broken
      }
    }
    setStreak(currentStreak);
  };

  const getAveragePain = () => {
    if (logs.length === 0) return 0;
    const sum = logs.reduce((acc, curr) => acc + curr.pain, 0);
    return (sum / logs.length).toFixed(1);
  };

  return (
    <LogContext.Provider value={{ logs, addLog, streak, averagePain: getAveragePain() }}>
      {children}
    </LogContext.Provider>
  );
};

export const useLog = () => {
  const context = useContext(LogContext);
  if (!context) {
    throw new Error('useLog must be used within a LogProvider');
  }
  return context;
};
