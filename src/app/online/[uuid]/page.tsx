"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import download from "downloadjs";

import { calculateAverage, sortSemesters } from "@/services/semesters";
import { getGlobalAssignementsCount } from "@/services/assignements";
import { getCourses, sortCourses, sortFutureCourses } from "@/services/courses";
import { getReport, getReportInBase64 } from "@/services/api";
import {
  base64ToBlob,
  type Course as CourseType,
  type Report,
} from "@/services/online";
import { sortEvents } from "@/services/events";
import {
  DownloadCloud,
  Layout as LayoutIcon,
  Grid,
  RefreshCcw,
  Calendar,
  BarChart2,
  BarChart,
  Clipboard,
  Award,
  Activity,
  Zap,
} from "react-feather";

import {
  Loading,
  Course,
  NotFound,
  PageTitle,
  Layout,
  Cards,
  Card,
  SemesterTitle,
  Event,
  Spinner,
  FutureCourse,
  Icon,
} from "@/components";

type Params = {
  uuid: string;
};

export default function Home() {
  const params: Params = useParams();
  const uuid = params.uuid;

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [currentReport, setCurrentReport] = useState<Report | null>(null);
  const [courses, setCourses] = useState<CourseType[]>([]);

  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);

      const { success, report } = await getReport(uuid);

      if (!success || !report) {
        setIsLoading(false);
        return;
      }

      setCurrentReport(report);
      setIsLoading(false);
    };

    initialize();
  }, [uuid]);

  useEffect(() => {
    if (!currentReport) return;
    currentReport.semesters.map((semester) => {
      console.log(semester.courses);
      setCourses((courses) => [...courses, ...semester.courses]);
    });
  }, [currentReport]);

  const isValid = (array: any[]) => array && array.length > 0;

  return (
    <Layout>
      {isLoading ? (
        <Loading />
      ) : !currentReport?.semesters ? (
        <NotFound />
      ) : (
        <>
          <PageTitle parts={[currentReport?.student?.name]} />
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "1rem",
            }}
          >
            <Icon
              icon={RefreshCcw}
              size={28}
              onClick={() => {
                location.href = encodeURI(
                  `/online?email=${currentReport?.student.email}`
                );
              }}
            />
            <Icon
              icon={DownloadCloud}
              size={28}
              onClick={async () => {
                setIsDownloading(true);

                const { filename, base64 } = await getReportInBase64(uuid);

                if (!base64 || !filename) {
                  setIsDownloading(false);
                  return;
                }

                download(base64ToBlob(base64), filename, "application/pdf");
                setIsDownloading(false);
              }}
              loading={isDownloading}
            />
          </div>
          <div
            style={{
              marginTop: "2rem",
              marginBottom: "2rem",
            }}
          >
            <Cards>
              <Card
                title="Average"
                subtitle={calculateAverage(currentReport?.semesters)}
                icon={Activity}
              />
              <Card
                title="Assignments"
                subtitle={`${getGlobalAssignementsCount(
                  currentReport?.semesters
                )}`}
                icon={Zap}
              />
              <Card
                title="Credits*"
                subtitle={`${getGlobalAssignementsCount(
                  currentReport?.semesters
                )}`}
                icon={Award}
                iconSize={36}
              />
            </Cards>
          </div>
          <div>
            {isValid(currentReport?.upcoming_events) ? (
              <div
                style={{
                  marginBottom: "2rem",
                  display: "flex",
                  overflowX: "auto",
                  gap: "1rem",
                }}
              >
                {sortEvents(currentReport?.upcoming_events).map((event) => {
                  return <Event event={event} key={event.id} />;
                })}
              </div>
            ) : null}
          </div>
          <div>
            {isValid(currentReport?.future_courses) ? (
              <div
                style={{
                  marginBottom: "2rem",
                }}
              >
                <SemesterTitle title="Incoming courses" />
                {sortFutureCourses(currentReport?.future_courses).map(
                  (course) => {
                    return <FutureCourse course={course} key={course.id} />;
                  }
                )}
              </div>
            ) : null}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "1rem",
            }}
          >
            <Icon icon={Grid} size={28} />
            <Icon icon={LayoutIcon} size={28} />
          </div>
          <div
            style={{
              marginTop: "2rem",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gridAutoRows: "minmax(100px, auto)",
              gap: "1rem",
            }}
          >
            {sortCourses(courses).map((course) => {
              return (
                <Course
                  isOnline={true}
                  uuid={uuid}
                  course={course}
                  semester={currentReport.semesters[0]}
                  key={course.id}
                />
              );
            })}
          </div>
        </>
      )}
    </Layout>
  );
}
