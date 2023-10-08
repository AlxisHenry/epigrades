"use client";

import { getSemester } from "@/services/semesters";
import { type Course as CourseType } from "@/services/courses";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Course from "@/components/Course";

type Params = {
  semester: string;
}

export default function Home() {
  const params: Params = useParams();
  const [courses, setCourses] = useState<CourseType[]>([]);

  useEffect(() => {
    setCourses(getSemester(params.semester)?.courses || []);
  }, []);

  return (
    <>
      {
        courses.length > 0 ? courses.map((course) => <Course {...course} />) : <div>No courses found</div>
      }
    </>
  );
}
