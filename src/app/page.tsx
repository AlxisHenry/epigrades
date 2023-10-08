"use client";

import { type Semester, getSemesters } from "@/services/semesters";
import { useEffect, useState } from "react";

export default function Home() {
  const [semesters, setSemesters] = useState<Semester[]>([]);

  useEffect(() => {
    setSemesters(getSemesters());
  }, []);

  return (
    <>
    </>
  );
}
