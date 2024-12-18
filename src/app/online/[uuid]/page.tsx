"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import download from "downloadjs";
import {
  DownloadCloud,
  Layout as LayoutIcon,
  Grid,
  RefreshCcw,
  Award,
  Activity,
  Zap,
  Calendar,
} from "react-feather";
import moment from "moment";

import { calculateAverage } from "@/services/semesters";
import { getGlobalAssignementsCount } from "@/services/assignements";
import {
  getCoursesByModules,
  sortCourses,
  sortFutureCourses,
} from "@/services/courses";
import { getReport, getReportInBase64 } from "@/services/api";
import {
  base64ToBlob,
  type Course as CourseType,
  type Report,
} from "@/services/online";
import { sortEvents } from "@/services/events";
import { getCreditsCount } from "@/services/grades";

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
  FutureCourse,
  Icon,
  Alert,
} from "@/components";

type Params = {
  uuid: string;
};

export default function Home() {
  const params: Params = useParams();
  const uuid = params.uuid;

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [report, setReport] = useState<Report | null>(null);
  const [creationDate, setCreationDate] = useState<moment.Moment | null>(null);
  const [currentSemester, setCurrentSemester] = useState<string>("");
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [view, setView] = useState<"flat" | "events" | "modules">("flat");

  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);

      const { success, report } = await getReport(uuid);

      if (!success || !report) {
        setIsLoading(false);
        return;
      }

      setCreationDate(moment(report.created_at, "DD-MM-YYYY HH:mm:ss"));
      setReport(report);
      setCourses(
        report.semesters.flatMap((semester) =>
          semester.courses.map((course) => {
            return {
              ...course,
              semester: semester.name,
            };
          })
        )
      );
      setIsLoading(false);
    };

    initialize();
  }, [uuid]);

  useEffect(() => {
    if (!report) return;

    if (currentSemester === "") {
      setCourses(
        report.semesters.flatMap((semester) =>
          semester.courses.map((course) => {
            return {
              ...course,
              semester: semester.name,
            };
          })
        )
      );
    } else {
      setCourses(
        report?.semesters.find((semester) => semester.name === currentSemester)
          ?.courses || []
      );
    }
  }, [currentSemester, report]);

  return (
    <Layout>
      {isLoading ? (
        <Loading />
      ) : !report?.semesters ? (
        <NotFound />
      ) : (
        <>
          <PageTitle parts={[report?.student?.name]} />
          {creationDate &&
            creationDate.isValid() &&
            !creationDate.isSame(moment(), "day") && (
              <Alert type="danger" title={"Outdated"}>
                The report can be outdated and may not reflect the current state
                of your courses. Please run a new report to be sure to have the
                up-to-date information. Your report was generated{" "}
                {creationDate.fromNow()}.
              </Alert>
            )}
          <div
            style={{
              marginTop: "2rem",
              marginBottom: "2rem",
            }}
          >
            <Cards>
              <Card
                title="Average"
                subtitle={calculateAverage(report?.semesters)}
                icon={Activity}
              />
              <Card
                title="Assignments"
                subtitle={`${getGlobalAssignementsCount(report?.semesters)}`}
                icon={Zap}
              />
              <Card
                title="Credits*"
                subtitle={getCreditsCount(report)}
                icon={Award}
                iconSize={36}
              />
            </Cards>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "1rem",
              overflowX: "auto",
            }}
          >
            <select onChange={(e) => setCurrentSemester(e.target.value)}>
              <option value="" selected>
                All semesters
              </option>
              {report?.semesters.map((semester) => {
                return (
                  <option value={semester.name} key={semester.name}>
                    Semester {semester.name}
                  </option>
                );
              })}
            </select>
            <div
              style={{
                display: "flex",
                gap: "1rem",
              }}
            >
              <Icon
                icon={Grid}
                size={28}
                onClick={() => setView("flat")}
                className={view === "flat" ? "active" : ""}
              />
              <Icon
                icon={LayoutIcon}
                size={28}
                onClick={() => setView("modules")}
                className={view === "modules" ? "active" : ""}
              />
              <Icon
                icon={Calendar}
                size={28}
                onClick={() => setView("events")}
                className={view === "events" ? "active" : ""}
              />
              <Icon
                icon={RefreshCcw}
                size={28}
                onClick={() => {
                  location.href = encodeURI(
                    `/online?email=${report?.student.email}`
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
          {view === "flat" ? (
            <FlatView courses={courses} uuid={uuid} />
          ) : view === "events" ? (
            <EventsView report={report} />
          ) : (
            <CoursesByModuleView
              uuid={uuid}
              courses={getCoursesByModules(courses)}
            />
          )}
        </>
      )}
    </Layout>
  );
}

interface FlatViewProps {
  courses: CourseType[];
  uuid: string;
}

function FlatView(props: FlatViewProps) {
  const { courses, uuid } = props;

  return (
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
            key={course.id}
          />
        );
      })}
    </div>
  );
}

interface EventsViewProps {
  report: Report;
}

function EventsView(props: EventsViewProps) {
  const { report } = props;

  const isValid = (array: any[]) => array && array.length > 0;

  return (
    <div>
      {isValid(report?.upcoming_events) || isValid(report?.future_courses) ? (
        <>
          <div
            style={{
              display: "flex",
              overflowX: "auto",
              gap: "1rem",
              marginBlock: "3rem"
            }}
          >
            {sortEvents(report?.upcoming_events).map((event) => {
              return <Event event={event} key={event.id} />;
            })}
            {isValid(report?.future_courses) &&
              sortFutureCourses(report?.future_courses).map((course) => {
                return <FutureCourse course={course} key={course.id} />;
              })}
          </div>
        </>
      ) : null}
    </div>
  );
}

interface CoursesByModuleViewProps {
  uuid: string;
  courses: { [key: string]: CourseType[] };
}

function CoursesByModuleView(props: CoursesByModuleViewProps) {
  const { uuid, courses } = props;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        marginTop: "2rem",
        gap: "3rem",
      }}
    >
      {Object.entries(courses).map(([module, courses]) => {
        return (
          <div
            key={module}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gridAutoRows: "minmax(100px, auto)",
              gap: "1rem",
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              paddingBottom: "3rem",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "rgba(255, 255, 255, 0.796)",
                fontSize: "1.5rem",
                fontWeight: "bold",
              }}
            >
              <h2
                style={{
                  textAlign: "center",
                }}
              >
                {module}
              </h2>
            </div>
            {courses.map((course) => {
              return (
                <Course
                  isOnline={true}
                  uuid={uuid}
                  course={course}
                  key={course.id}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
