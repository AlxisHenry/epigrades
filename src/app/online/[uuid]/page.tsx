"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import moment from "moment";
import download from "downloadjs";

import { calculateAverage, sortSemesters } from "@/services/semesters";
import { getGlobalAssignementsCount } from "@/services/assignements";
import { sortCourses, sortFutureCourses } from "@/services/courses";
import { getReport, getReportInBase64 } from "@/services/api";
import { base64ToBlob, type Report } from "@/services/online";
import { sortEvents } from "@/services/events";

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
} from "@/components";
import { SyncIcon, DownloadIcon } from "@/components/icons";

type Params = {
  uuid: string;
};

export default function Home() {
  const params: Params = useParams();
  const uuid = params.uuid;

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [currentReport, setCurrentReport] = useState<Report | null>(null);
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number>(-1);

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

  const toggleDropdown = (i: number) => {
    setOpenDropdownIndex(i === openDropdownIndex ? -1 : i);
  };

  const isValid = (array: any[]) => array && array.length > 0;

  return (
    <Layout>
      {isLoading ? (
        <Loading />
      ) : !currentReport?.semesters ? (
        <NotFound />
      ) : (
        <>
          <PageTitle parts={[currentReport?.student.name, "Semesters"]} />
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "1rem",
            }}
          >
            {currentReport?.created_at && (
              <p
                style={{
                  fontSize: "1rem",
                  color: "#888",
                  marginBottom: "1rem",
                }}
              >
                Generated&nbsp;
                {moment(
                  currentReport?.created_at,
                  "DD-MM-YYYY hh:mm:ss"
                ).fromNow()}
              </p>
            )}
            <div
              onClick={() => {
                setIsSyncing(true);
                setTimeout(() => {
                  setIsSyncing(false);
                  location.href = encodeURI(
                    `/online?email=${currentReport?.student.email}`
                  );
                }, 1000);
              }}
            >
              <SyncIcon size={24} isSyncing={isSyncing} />
            </div>
            <div
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
            >
              {isDownloading ? (
                <Spinner
                  customCss={{
                    width: "24px",
                    height: "24px",
                  }}
                />
              ) : (
                <DownloadIcon size={24} />
              )}
            </div>
          </div>
          <div
            style={{
              marginTop: "2rem",
              marginBottom: "2rem",
            }}
          >
            <Cards className="is-semester-cards">
              <Card
                title="Global Average"
                subtitle={calculateAverage(currentReport?.semesters)}
              />
              <Card
                title="Assignments"
                subtitle={`${getGlobalAssignementsCount(
                  currentReport?.semesters
                )}`}
              />
            </Cards>
          </div>{" "}
          <div>
            {isValid(currentReport?.upcoming_events) ? (
              <div
                style={{
                  marginBottom: "2rem",
                }}
              >
                <SemesterTitle title="Upcoming events" />
                {sortEvents(currentReport?.upcoming_events).map((event) => {
                  return <Event event={event} key={event.id} />;
                })}
              </div>
            ) : null}
          </div>{" "}
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
          {sortSemesters(currentReport?.semesters).map((semester) => {
            return semester.courses.length > 0 ? (
              <div
                key={semester.name}
                style={{
                  marginBottom: "2rem",
                }}
              >
                <SemesterTitle title={semester.name} />
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
