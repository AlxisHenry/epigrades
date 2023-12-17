"use client";

import "@/styles/pages/online.scss";
import Layout from "@/components/Layout";
import PageTitle from "@/components/PageTitle";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getName, retrieveGradeWithUUID } from "@/services/online";
import { Semester, calculateSemesterGradeAverage } from "@/services/semesters";
import Course from "@/components/Course";
import SemesterTitle from "@/components/SemesterTitle";
import Cards from "@/components/Cards";
import Card from "@/components/Card";
import { getSemesterAssignementsCount } from "@/services/assignements";
import { sortCourses } from "@/services/courses";

type Params = {
  uuid: string;
};

export default function Home() {
  const params: Params = useParams();
  const uuid = params.uuid;
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number>(-1);

  useEffect(() => {
    (async () => {
      const response = await retrieveGradeWithUUID(uuid);
      console.log(response);
      if (!response.success || !response.semesters) {
        return;
      }
      setSemesters(response.semesters);
    })();
  }, [uuid]);

  const toggleDropdown = (i: number) => {
    setOpenDropdownIndex(i === openDropdownIndex ? -1 : i);
  };

  return (
    <Layout>
      <PageTitle parts={[getName(uuid), "Semesters"]} />
      {semesters ? (
        semesters.map((semester) => {
          return (
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
          );
        })
      ) : (
        <></>
      )}
    </Layout>
  );
}
