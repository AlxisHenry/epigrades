"use client";

import "@/styles/pages/[semester].scss";
import {
  type Semester,
  getSemester,
  calculateSemesterGradeAverage,
} from "@/services/semesters";
import { type Course as CourseType } from "@/services/courses";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Course from "@/components/Course";
import PageTitle from "@/components/PageTitle";
import Loading from "@/components/Loading";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Cards from "@/components/Cards";
import { getSemesterAssignementsCount } from "@/services/assignements";

type Params = {
  semester: string;
};

export default function Home() {
  const params: Params = useParams();

  const [loading, setLoading] = useState<boolean>(true);
  const [semester, setSemester] = useState<Semester | null>(null);
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number>(-1);
  const [semesterGradeAverage, setSemesterGradeAverage] = useState<string>("");
  const [semesterAsssignementsCount, setSemesterAsssignementsCount] =
    useState<number>(0);

  useEffect(() => {
    setSemester(getSemester(params.semester));
    setCourses(semester?.courses || []);
    setSemesterGradeAverage(calculateSemesterGradeAverage(semester));
    setSemesterAsssignementsCount(getSemesterAssignementsCount(semester));
    setLoading(false);
  }, [params.semester, semester]);

  const toggleDropdown = (i: number) => {
    setOpenDropdownIndex(i === openDropdownIndex ? -1 : i);
  };

  return (
    <Layout>
      {loading ? (
        <Loading />
      ) : (
        <>
          <PageTitle parts={["Semesters", semester?.name ?? ""]} />
          <Cards className="is-semester-cards">
            <Card title="Average" subtitle={semesterGradeAverage} />
            <Card
              title="Assignments"
              subtitle={semesterAsssignementsCount.toString()}
            />
          </Cards>
          <div className="courses__items">
            {courses.length > 0 ? (
              courses.map((course, index) => (
                <Course
                  {...course}
                  key={index}
                  semester={semester}
                  isOpen={index === openDropdownIndex}
                  toggleDropdown={() => toggleDropdown(index)}
                />
              ))
            ) : (
              <div className="error">No courses found for this semester.</div>
            )}
          </div>
        </>
      )}
    </Layout>
  );
}
