"use client";

import { getDays, type Day } from "@/services/days";
import { useEffect, useState } from "react";

export default function Home() {
  const [days, setDays] = useState<Day[]>([]);

  useEffect(() => {
    setDays(getDays());
  }, []);

  return (
    <>
      {days.map((d, i) => (
        <>
          <div key={i}>{d.name}</div>
          <div>{d.grade}</div>
        </>
      ))}
    </>
  );
}
