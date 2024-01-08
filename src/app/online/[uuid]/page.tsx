"use client";

import "@/styles/pages/online.scss";
import Layout from "@/components/Layout";
import PageTitle from "@/components/PageTitle";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  getTimeElapsed,
  isValidTimeElapsed,
  retrieveGradeWithUUID,
} from "@/services/online";
import {
  Semester,
  calculateGlobalGradeAverage,
  calculateSemesterGradeAverage,
  sortSemesters,
} from "@/services/semesters";
import Course from "@/components/Course";
import SemesterTitle from "@/components/SemesterTitle";
import Cards from "@/components/Cards";
import Card from "@/components/Card";
import {
  getGlobalAssignementsCount,
  getSemesterAssignementsCount,
} from "@/services/assignements";
import { sortCourses } from "@/services/courses";
import { NotFound } from "@/components/NotFound";
import Loading from "@/components/Loading";

type Params = {
  uuid: string;
};

export default function Home() {
  const params: Params = useParams();
  const uuid = params.uuid;
  const [student, setStudent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [semesters, setSemesters] = useState<Semester[] | null>(null);
  const [createdAt, setCreatedAt] = useState<null | string>(null);
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number>(-1);

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      const response = await retrieveGradeWithUUID(uuid);
      if (!response.success || !response.semesters || !response.student) {
        setIsLoading(false);
        return;
      }

      if (response.created_at) {
        setCreatedAt(getTimeElapsed(response.created_at));
      }

      setStudent(response.student.name);
      setSemesters(sortSemesters(response.semesters));
      setIsLoading(false);
    })();
  }, [uuid]);

  const toggleDropdown = (i: number) => {
    setOpenDropdownIndex(i === openDropdownIndex ? -1 : i);
  };

  return (
    <Layout>
      {isLoading ? (
        <Loading />
      ) : !semesters ? (
        <NotFound />
      ) : (
        <>
          <PageTitle parts={[student, "Semesters"]} />
          {createdAt && isValidTimeElapsed(createdAt) && (
            <p
              style={{
                textAlign: "right",
                fontSize: "1rem",
                color: "#888",
                marginBottom: "1rem",
              }}
            >
              Generated {createdAt} ago
            </p>
          )}
          {semesters.filter((semester) => semester.courses.length > 0).length >
          1 ? (
            <div
              style={{
                marginTop: "2rem",
                marginBottom: "2rem",
              }}
            >
              <Cards className="is-semester-cards">
                <Card
                  title="Global Average"
                  subtitle={calculateGlobalGradeAverage(semesters)}
                />
                <Card
                  title="Assignments"
                  subtitle={`${getGlobalAssignementsCount(semesters)}`}
                />
              </Cards>
            </div>
          ) : null}
          {semesters.map((semester) => {
            return semester.courses.length > 0 ? (
              <div
                key={semester.name}
                style={{
                  marginBottom: "2rem",
                }}
              >
                <SemesterTitle title={semester.name} />
                <Cards className="is-semester-cards">
                  <Card
                    title="Average"
                    subtitle={calculateSemesterGradeAverage(semester)}
                  />
                  <Card
                    title="Assignments"
                    subtitle={getSemesterAssignementsCount(semester).toString()}
                  />
                </Cards>
                {sortCourses(semester.courses).map((course, index) => {
                  return (
                    <Course
                      isOnline={true}
                      uuid={uuid}
                      course={course}
                      semester={semester}
                      key={course.id}
                      isOpen={+course.id === openDropdownIndex}
                      toggleDropdown={() => toggleDropdown(+course.id)}
                    />
                  );
                })}
              </div>
            ) : null;
          })}
        </>
      )}
    </Layout>
  );
}
