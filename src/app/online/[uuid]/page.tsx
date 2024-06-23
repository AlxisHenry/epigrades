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
  Alert,
} from "@/components";
import moment from "moment";

type Params = {
  uuid: string;
};

export default function Home() {
  const params: Params = useParams();
  const uuid = params.uuid;

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [currentReport, setCurrentReport] = useState<Report | null>(null);
  const [creationDate, setCreationDate] = useState<moment.Moment | null>(null);

  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);

      const { success, report } = await getReport(uuid);

      if (!success || !report) {
        setIsLoading(false);
        return;
      }

      setCreationDate(moment(report.created_at));
      setCurrentReport(report);
      setIsLoading(false);
    };

    initialize();
  }, [uuid]);

  const isValid = (array: any[]) => array && array.length > 0;

  return (
    <Layout>
      {isLoading ? (
        <Loading />
      ) : !currentReport?.semesters ? (
        <NotFound />
      ) : (
        <>
          <PageTitle parts={["adznaj"]} />
          {
            creationDate && creationDate.isValid() && (
              creationDate.isBefore(moment().subtract(4, "weeks")) ? (
                <Alert type="danger" title={"Important"}>
                  The report you are viewing was generated 2 weeks ago. Please
                  consider generating a new report to get the most up-to-date
                  information.
                </Alert>
              ) :
                creationDate.isBefore(moment().subtract(1, "weeks")) ? (
                  <Alert type="warning" title={"Important"}>
                    The report you are viewing was generated 1 week ago. Please
                    consider generating a new report to get the most up-to-date
                    information.
                  </Alert>
                ) :
                  creationDate.isBefore(moment().subtract(3, "days")) ? (
                    <Alert type="warning" title={"Important"}>
                      The report you are viewing was generated 3 days ago. Please
                      consider generating a new report to get the most up-to-date
                      information.
                    </Alert>
                  ) : <Alert type="tips" title={"Important"}>
                    The report you are viewing was generated less than 3 days ago.
                  </Alert>
            )
          }
          <Alert type="tips" title={"Important"}>
            The report you are viewing was generated less than 3 days ago.
          </Alert>
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
              <>
                <SemesterTitle title="Upcoming events and courses" />
                <div
                  style={{
                    marginBottom: "3rem",
                    display: "flex",
                    overflowX: "auto",
                    gap: "1rem",
                  }}
                >
                  {sortEvents(currentReport?.upcoming_events).map((event) => {
                    return <Event event={event} key={event.id} />;
                  })}
                  {isValid(currentReport?.future_courses) && (
                    sortFutureCourses(currentReport?.future_courses).map(
                      (course) => {
                        return <FutureCourse course={course} key={course.id} />;
                      }
                    ))}
                </div>
              </>

            ) : null}
          </div>
          <div>

          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "1rem",
              overflowX: "auto",
            }}
          >
            <select>
              <option value="all" selected>All semesters</option>
              {
                currentReport?.semesters.map((semester) => {
                  return (
                    <option value={semester.name} key={semester.name}>
                      Semester {semester.name}
                    </option>
                  );
                })
              }
            </select>
            <div
              style={{
                display: "flex",
                gap: "1rem",
              }}>
              <Icon icon={Grid} size={28} />
              <Icon icon={LayoutIcon} size={28} />
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
            {sortSemesters(currentReport?.semesters).map((semester) => {
              return sortCourses(semester.courses).map((course) => {
                return (
                  <Course
                    isOnline={true}
                    uuid={uuid}
                    course={course}
                    semester={semester}
                    key={course.id}
                  />
                );
              });
            })}
          </div>
        </>
      )}
    </Layout>
  );
}
