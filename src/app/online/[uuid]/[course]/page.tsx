"use client";

import "@/styles/pages/course.scss";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  PointElement,
  LineElement,
  Legend,
} from "chart.js";

import { getCourseAssignementsCount } from "@/services/assignements";
import { getCourseGrade, getCreditsFromGrade } from "@/services/grades";
import { isGradedDay } from "@/services/days";
import { getReport } from "@/services/api";
import { calculateAverage, findSemesterByCourseId } from "@/services/courses";
import type { Course as CourseType, Report } from "@/services/online";

import {
  PageTitle,
  Loading,
  Table,
  Layout,
  Cards,
  Card,
  NotFound,
  Alert,
  SemesterTitle,
  Notification,
  Icon,
  Highlight,
} from "@/components";
import {
  Activity,
  Award,
  Calendar,
  Flag,
  PieChart,
  Users,
} from "react-feather";
import moment from "moment";

type Params = {
  semester: string;
  course: string;
  uuid: string;
};

export default function Home() {
  const params: Params = useParams();

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    PointElement,
    LineElement,
    Tooltip,
    Legend
  );

  const uuid = params.uuid;

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentReport, setCurrentReport] = useState<Report | null>(null);
  const [view, setView] = useState<"stats" | "members" | "events">("stats");
  const [course, setCourse] = useState<CourseType | null>(null);

  const [stats, setStats] = useState<{
    average: string;
    grade: string;
    assignements: string;
  }>({
    average: "",
    grade: "",
    assignements: "",
  });

  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);

      const { success, report } = await getReport(uuid);

      if (!success || !report) {
        return;
      }

      setCurrentReport(report);

      const currentSemester = findSemesterByCourseId(
        report.semesters,
        params.course
      );

      const currentCourse =
        currentSemester?.courses.find((c) => c.id === params.course) ?? null;

      setCourse(currentCourse);

      setStats({
        average: calculateAverage(currentCourse),
        grade: getCourseGrade(currentCourse),
        assignements: getCourseAssignementsCount(currentCourse).toString(),
      });
      setIsLoading(false);
    };

    initialize();
  }, [uuid, params.course]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.5)",
        },
      },
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.5)",
        },
      },
    },
  };

  const data: {
    labels: string[];
    datasets: {
      label: string;
      data: string[];
      backgroundColor: string[];
      borderColor: string[];
      borderWidth: number;
      tension: number;
    }[];
  } = {
    labels: [],
    datasets: [
      {
        label: "Grade",
        data: [],
        backgroundColor: ["#fdfdfd10"],
        borderColor: ["#FFF"],
        borderWidth: 1,
        tension: 0.2,
      },
    ],
  };

  if (!isLoading && course) {
    for (const day of course!.days) {
      if (!isGradedDay(day)) continue;
      data.labels.push(day.name);
      data.datasets[0].data.push(day.grade);
    }
  }

  return (
    <Layout>
      {isLoading ? (
        <Loading />
      ) : !course ? (
        <NotFound />
      ) : (
        <>
          <PageTitle
            parts={[currentReport?.student?.name ?? "", course!.title]}
            clickable={[0]}
            customLink={`online/${uuid}`}
          />
          {stats.average === "-" && stats.grade === "-" && (
            <Alert
              type="danger"
              title="Not graded"
              customCss={{
                marginBottom: "2rem",
              }}
            >
              This course does not have any graded assignements for now. This is
              because Epitech has not already graded this course.
            </Alert>
          )}
          {stats.average !== "-" && stats.grade === "-" && (
            <Alert
              type="warning"
              title="Not graded"
              customCss={{
                marginBottom: "2rem",
              }}
            >
              The grade for this course is not available yet. Wait for Epitech
              to calculate it.
            </Alert>
          )}
          {stats.grade !== "-" && stats.average === "-" && (
            <Alert
              type="warning"
              title="Not graded"
              customCss={{
                marginBottom: "2rem",
              }}
            >
              Epitech sucks and calculated the grade but not the average. Wait
              for Epitech to calculate it...
            </Alert>
          )}
          <Cards>
            <Card title="Grade" subtitle={stats.grade} icon={Flag} />
            <Card title="Average" subtitle={stats.average} icon={Activity} />
            <Card
              title="Credits*"
              subtitle={getCreditsFromGrade(stats.grade)}
              icon={Award}
            />
          </Cards>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "3rem",
              gap: "1rem",
              overflowX: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "1rem",
              }}
            >
              <Icon
                icon={PieChart}
                size={28}
                onClick={() => setView("stats")}
                className={view === "stats" ? "active" : ""}
              />
              <Icon
                icon={Users}
                size={28}
                onClick={() => setView("members")}
                className={view === "members" ? "active" : ""}
              />
              <Icon
                icon={Calendar}
                size={28}
                onClick={() => setView("events")}
                className={view === "events" ? "active" : ""}
              />
            </div>
          </div>
          {view === "stats" && (
            <StatisticsView course={course} data={data} options={options} />
          )}
          {view === "members" && <MembersView course={course} />}
          {view === "events" && <EventsView course={course} />}
        </>
      )}
    </Layout>
  );
}

interface ViewProps {
  course: CourseType;
}

const MembersView = (props: ViewProps) => {
  const { course } = props;

  return (
    <div
      style={{
        marginTop: "3rem",
      }}
    >
      <p style={{ marginBottom: "3rem", color: "#FFF", fontSize: "1.4rem" }}>
        For the <Highlight>{course.title}</Highlight> project{" "}
        <span
          style={{
            color: "#FFF",
            fontSize: "1rem",
            fontWeight: "bold",
          }}
        >
          ({course.name})
        </span>{" "}
        you were part of the <Highlight>{course.team}</Highlight> team.
      </p>
      {course?.members.length > 0 ? (
        <div>
          {course?.members.map((member) => {
            return (
              <li
                key={member}
                style={{
                  padding: "1rem",
                  color: "#FFF",
                }}
              >
                {member}
              </li>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

const EventsView = (props: ViewProps) => {
  const { course } = props;

  return (
    <div
      style={{
        marginTop: "3rem",
      }}
    >
      {course.events && course.events.length > 0 ? (
        <>
          <div
            style={{
              marginBottom: "3rem",
              display: "flex",
              overflowX: "auto",
              gap: "1rem",
            }}
          >
            {course?.events.map((event) => {
              return (
                <Notification
                  key={event.activity}
                  title={event.activity}
                  date={moment(event.date, "DD/MM/YYYY").format("DD/MM/YYYY")}
                  inSevenDaysOrLess={event.enrolled !== "Yes"}
                />
              );
            })}
          </div>
        </>
      ) : null}
    </div>
  );
};

interface StatisticsViewProps {
  course: CourseType;
  data: any;
  options: any;
}

const StatisticsView = (props: StatisticsViewProps) => {
  const { course, options, data } = props;

  return (
    <>
      <SemesterTitle title="Days" />
      <div className="table__container">
        <Table days={course!.days} />
      </div>
      {data.labels.length > 0 && (
        <>
          <SemesterTitle title="Statistics" />
          <div className="charts">
            <Bar data={data} options={options} />
          </div>
        </>
      )}
    </>
  );
};
