"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { FiTrash2, FiPlusCircle } from "react-icons/fi";
import axios from "axios";
import { useRouter } from "next/navigation";

interface TimerSession {
  startTime: Date;
  endTime?: Date;
}

interface Timer {
  _id: string;
  title: string;
  sessions: TimerSession[];
}

const calculateElapsedTime = (timer: Timer | null): number => {
  if (!timer) return 0;

  return timer.sessions.reduce((total, session) => {
    const start = new Date(session.startTime).getTime();
    const end = session.endTime
      ? new Date(session.endTime).getTime()
      : Date.now();
    return total + (end - start) / 1000;
  }, 0);
};

const TimerPage: React.FC = () => {
  const session = useSession();
  const router = useRouter();

  const [timers, setTimers] = useState<Timer[]>([]);
  const [selectedTimer, setSelectedTimer] = useState<Timer | null>(null);
  const [elapsed, setElapsed] = useState<number>(0);
  const [title, setTitle] = useState<string>("");

  useEffect(() => {
    const checkSession = async () => {
      if (session?.status !== "loading" && !session.data) {
        router.push("/auth/signin");
      } else {
        fetchTimers();
      }
    };

    checkSession();
  }, [session]);

  useEffect(() => {
    if (!selectedTimer) return;
    const interval = setInterval(() => {
      setElapsed(calculateElapsedTime(selectedTimer));
    }, 1000);
    return () => clearInterval(interval);
  }, [selectedTimer]);

  const fetchTimers = async () => {
    const { data } = await axios.get<Timer[]>("/api/timers");
    setTimers(data);
  };

  const addTimer = async () => {
    if (!title.trim()) return;
    await axios.post<Timer>("/api/timers", { title });
    setTitle("");
    fetchTimers();
  };

  const toggleNewSession = async (id: string) => {
    await axios.put(`/api/timers/${id}`);
    fetchTimers();
  };

  const deleteTimer = async (id: string) => {
    await axios.delete(`/api/timers/${id}`);
    setSelectedTimer(null);
    fetchTimers();
  };

  return (
    <div className="relative flex min-h-screen bg-gradient-to-br from-purple-700 to-blue-500 p-8">
      <aside className="w-80 bg-black/60 backdrop-blur-md rounded-lg p-4 z-30">
        <h2 className="text-white text-lg font-bold mb-4">تایمر‌ها</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="عنوان تایمر را وارد کنید..."
          className="w-full p-2 text-black rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
        />
        <button
          onClick={addTimer}
          className="flex items-center gap-2 text-white bg-green-500 p-2 rounded-lg w-full hover:scale-105 transition"
        >
          <FiPlusCircle /> ایجاد تایمر
        </button>
        <ul className="mt-4 space-y-3">
          {timers.map((timer) => (
            <li
              key={timer._id}
              className="flex justify-between items-center bg-black/30 p-3 rounded-lg cursor-pointer hover:scale-105 transition"
              onClick={() => setSelectedTimer(timer)}
            >
              <span className="text-white">{timer.title}</span>
              <FiTrash2
                onClick={() => deleteTimer(timer._id)}
                className="text-red-500 cursor-pointer hover:text-red-700 transition"
              />
            </li>
          ))}
        </ul>
      </aside>

      <div className="flex-1 flex items-center justify-center text-white text-6xl font-bold">
        {selectedTimer ? `${elapsed} ثانیه` : "یک تایمر را انتخاب کنید"}
      </div>

      <div
        className="absolute inset-0"
        onClick={() => selectedTimer && toggleNewSession(selectedTimer._id)}
      />
    </div>
  );
};

export default TimerPage;
