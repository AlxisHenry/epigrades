"use client";

import "@/styles/pages/online.scss";
import Layout from "@/components/Layout";
import PageTitle from "@/components/PageTitle";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { retrieveGradeWithUUID } from "@/services/online";
import { Semester, calculateSemesterGradeAverage } from "@/services/semesters";
import Course from "@/components/Course";
import SemesterTitle from "@/components/SemesterTitle";
import Cards from "@/components/Cards";
import Card from "@/components/Card";
import { getSemesterAssignementsCount } from "@/services/assignements";
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
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number>(-1);

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      const response = await retrieveGradeWithUUID(uuid);
      if (!response.success || !response.semesters) {
        setIsLoading(false);
        return;
      }
      setStudent(response?.student?.name || "");
      setSemesters(response.semesters);
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
          {semesters.map((semester) => {
            return semester.courses.length > 0 ? (
              <div key={semester.name}>
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
                      key={index}
                      isOpen={index === openDropdownIndex}
                      toggleDropdown={() => toggleDropdown(index)}
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
