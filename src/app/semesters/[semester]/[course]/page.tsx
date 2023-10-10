"use client";

import "@/styles/pages/[course].scss";
import { type Semester, getSemester } from "@/services/semesters";
import {
  type Course as CourseType,
  getCourse,
  getCourseGrade,
  calculateCourseGradeAverage,
} from "@/services/courses";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PageTitle from "@/components/PageTitle";
import Loading from "@/components/Loading";
import CourseTable from "@/components/CourseTable";
import Layout from "@/components/Layout";
import Cards from "@/components/Cards";
import Card from "@/components/Card";
import { getCourseAssignementsCount } from "@/services/assignements";

type Params = {
  semester: string;
  course: string;
};

export default function Home() {
  const params: Params = useParams();

  const [semester, setSemester] = useState<Semester | null>(null);
  const [course, setCourse] = useState<CourseType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [courseGrade, setCourseGrade] = useState<string>("");
  const [courseGradeAverage, setCourseGradeAverage] = useState<string>("");
  const [courseAssignementsCount, setCourseAssignementsCount] =
    useState<number>(0);

  useEffect(() => {
    setSemester(getSemester(params.semester));
    setCourse(getCourse(params.course));
    setCourseGrade(getCourseGrade(course));
    setCourseGradeAverage(calculateCourseGradeAverage(course));
    setCourseAssignementsCount(getCourseAssignementsCount(course));
    setLoading(false);
  });

  return (
    <Layout>
      {loading ? (
        <Loading />
      ) : (
        <>
          <PageTitle
            parts={["Semesters", semester!.name, course!.name]}
            clickable={[1]}
          />
          <Cards>
            <Card title="Grade" subtitle={courseGrade} />
            <Card title="Average" subtitle={courseGradeAverage} />
            <Card
              title="Assignments"
              subtitle={courseAssignementsCount.toString()}
            />
          </Cards>
          <div className="table__container">
            <CourseTable days={course!.days} />
          </div>
        </>
      )}
    </Layout>
  );
}
