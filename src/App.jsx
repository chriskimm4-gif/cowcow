
import { useEffect, useMemo, useState } from "react";
import "./App.css";

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const pad = (value) => String(value).padStart(2, "0");

const dateKey = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const createEmptyEntry = () => ({
  isHoliday: false,
  holidayName: "",
  memo: "",
  diary: "",
});

function CowLogo() {
  return (
    <svg
      className="cow-logo-svg"
      viewBox="0 0 180 110"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="COW COW cow logo"
    >
      <g fill="currentColor">
        <path d="
          M22 43
          C15 42 8 37 8 29
          C8 21 15 16 25 16
          C35 16 43 21 51 29
          C57 25 65 22 75 22
          L113 22
          C130 22 141 30 145 44
          L151 57
          C155 68 151 77 143 79
          L140 100
          C139 105 132 107 128 102
          L126 78
          L116 78
          L112 100
          C111 105 104 107 100 102
          L100 78
          L75 78
          L72 100
          C71 105 64 107 60 102
          L60 78
          L48 78
          L45 100
          C44 105 37 107 33 102
          L34 73
          C27 65 24 55 22 43
          Z
        "/>

        <path d="
          M48 30
          C38 25 32 17 34 9
          C36 3 43 5 48 12
          L59 27 Z
        "/>

        <path d="
          M72 24
          C68 17 69 10 74 7
          C78 5 81 10 80 16
          L84 24 Z
        "/>

        <path d="
          M143 39
          C154 42 157 52 154 62
          C152 69 157 74 164 78
          C168 81 165 87 161 87
          C151 83 144 76 144 66
          L138 50 Z
        "/>
      </g>
    </svg>
  );
}

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("cowcow-theme") || "light";
  });

  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const [selectedDate, setSelectedDate] = useState(() => new Date());

  const [entries, setEntries] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cowcow-entries") || "{}");
    } catch {
      return {};
    }
  });

  const [panelOpen, setPanelOpen] = useState(true);
  const [detailsVisible, setDetailsVisible] = useState(true);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("cowcow-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("cowcow-entries", JSON.stringify(entries));
  }, [entries]);

  const todayKey = dateKey(new Date());
  const selectedKey = dateKey(selectedDate);

  const selectedEntry = {
    ...createEmptyEntry(),
    ...(entries[selectedKey] || {}),
  };

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let day = 1; day <= lastDate; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  }, [currentMonth]);

  const monthName = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const selectedDateLabel = selectedDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const changeMonth = (amount) => {
    setCurrentMonth(
      (previous) =>
        new Date(
          previous.getFullYear(),
          previous.getMonth() + amount,
          1
        )
    );
  };

  const goToday = () => {
    const today = new Date();

    setCurrentMonth(
      new Date(today.getFullYear(), today.getMonth(), 1)
    );

    setSelectedDate(today);
    setPanelOpen(true);
  };

  const updateEntry = (field, value) => {
    setEntries((previous) => ({
      ...previous,
      [selectedKey]: {
        ...createEmptyEntry(),
        ...previous[selectedKey],
        [field]: value,
      },
    }));
  };

  return (
    <main className="app">
      <header className="header">
        <div className="brand">
          <div className="logo-wrap">
            <CowLogo />
          </div>

          <div className="brand-text">
            <h1>COW COW</h1>
            <p>YOUR LITTLE DAILY SPACE</p>
          </div>
        </div>

        <button
          className="theme-toggle"
          onClick={() =>
            setTheme((previous) =>
              previous === "light" ? "dark" : "light"
            )
          }
          aria-label="Toggle theme"
          title="Toggle theme"
        >
          {theme === "light" ? "☾" : "☀"}
        </button>
      </header>

      <section className={`workspace ${panelOpen ? "" : "panel-closed"}`}>
        <section className="calendar-section">
          <div className="calendar-heading">
            <div>
              <p className="section-label">MY CALENDAR</p>
              <h2>{monthName}</h2>
            </div>

            <div className="month-controls">
              <button
                className="today-button"
                onClick={goToday}
              >
                Today
              </button>

              <button
                className="month-button"
                onClick={() => changeMonth(-1)}
                aria-label="Previous month"
                title="Previous month"
              >
                ‹
              </button>

              <button
                className="month-button"
                onClick={() => changeMonth(1)}
                aria-label="Next month"
                title="Next month"
              >
                ›
              </button>
            </div>
          </div>

          <div className="calendar">
            <div className="weekdays">
              {WEEKDAYS.map((day, index) => (
                <div
                  className={`weekday ${
                    index === 0
                      ? "sunday"
                      : index === 6
                      ? "saturday"
                      : ""
                  }`}
                  key={day}
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="calendar-grid">
              {calendarDays.map((date, index) => {
                if (!date) {
                  return (
                    <div
                      className="day-cell empty"
                      key={`empty-${index}`}
                    />
                  );
                }

                const key = dateKey(date);
                const entry = entries[key];
                const isToday = key === todayKey;
                const isSelected = key === selectedKey;
                const dayOfWeek = date.getDay();

                return (
                  <button
                    className={[
                      "day-cell",
                      isToday ? "today" : "",
                      isSelected ? "selected" : "",
                      entry?.isHoliday ? "holiday" : "",
                      dayOfWeek === 0 ? "sunday" : "",
                      dayOfWeek === 6 ? "saturday" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    key={key}
                    onClick={() => {
                      setSelectedDate(date);
                      setPanelOpen(true);
                    }}
                  >
                    <span className="day-number">
                      {date.getDate()}
                    </span>

                    {entry?.isHoliday && entry?.holidayName && (
                      <span className="holiday-label">
                        {entry.holidayName}
                      </span>
                    )}

                    {(entry?.memo || entry?.diary) && (
                      <span className="day-indicator" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="calendar-footer">
            <span>
              <span className="legend-dot today-dot" />
              Today
            </span>

            <span>
              <span className="legend-dot memo-dot" />
              Has notes
            </span>
          </div>
        </section>

        {panelOpen ? (
          <aside className="detail-panel">
            <div className="detail-header">
              <div>
                <p className="section-label">DAILY RECORD</p>
                <h2>{selectedDateLabel}</h2>
              </div>

              <button
                className="close-button"
                onClick={() => setPanelOpen(false)}
                aria-label="Close details"
                title="Close details"
              >
                ×
              </button>
            </div>

            <div className="detail-divider" />

            <button
              className="details-toggle"
              onClick={() =>
                setDetailsVisible((previous) => !previous)
              }
            >
              {detailsVisible ? "− Hide Details" : "+ Show Details"}
            </button>

            {detailsVisible && (
              <div className="detail-content">
                <label className="holiday-option">
                  <input
                    type="checkbox"
                    checked={selectedEntry.isHoliday}
                    onChange={(event) =>
                      updateEntry("isHoliday", event.target.checked)
                    }
                  />
                  <span>Mark as holiday</span>
                </label>

                {selectedEntry.isHoliday && (
                  <div className="field-group">
                    <label htmlFor="holidayName">
                      Holiday name
                    </label>

                    <input
                      id="holidayName"
                      type="text"
                      placeholder="e.g. Christmas"
                      value={selectedEntry.holidayName}
                      onChange={(event) =>
                        updateEntry("holidayName", event.target.value)
                      }
                    />
                  </div>
                )}

                <div className="field-group">
                  <label htmlFor="memo">Quick Memo</label>

                  <textarea
                    id="memo"
                    className="memo-input"
                    placeholder="Write something to remember..."
                    value={selectedEntry.memo}
                    onChange={(event) =>
                      updateEntry("memo", event.target.value)
                    }
                  />
                </div>

                <div className="field-group diary-group">
                  <label htmlFor="diary">Daily Journal</label>

                  <textarea
                    id="diary"
                    className="diary-input"
                    placeholder="How was your day?"
                    value={selectedEntry.diary}
                    onChange={(event) =>
                      updateEntry("diary", event.target.value)
                    }
                  />
                </div>

                <p className="save-status">
                  <span className="save-dot" />
                  All changes saved
                </p>
              </div>
            )}
          </aside>
        ) : (
          <button
            className="show-panel-button"
            onClick={() => setPanelOpen(true)}
          >
            Open Journal <span>＋</span>
          </button>
        )}
      </section>

      {!panelOpen && (
        <button
          className="floating-panel-button"
          onClick={() => setPanelOpen(true)}
        >
          Open Journal
        </button>
      )}

      <footer className="footer">
        <span>COW COW</span>
        <span>A LITTLE SPACE FOR EVERY DAY</span>
      </footer>
    </main>
  );
}

export default App;
