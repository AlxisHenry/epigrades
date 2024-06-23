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
import { getCourseGrade } from "@/services/grades";
import { isGradedDay } from "@/services/days";
import { getReport } from "@/services/api";
import { calculateAverage } from "@/services/courses";
import type { Course as CourseType, Report, Semester } from "@/services/online";

import {
  PageTitle,
  Loading,
  Table,
  Layout,
  Cards,
  Card,
  NotFound,
} from "@/components";
import { Activity, Award, Flag } from "react-feather";

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

  const [semester, setSemester] = useState<Semester | null>(null);
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

      const currentSemester =
        report.semesters.find(
          (s) => s.name.toLowerCase() === params.semester
        ) ?? null;

      setSemester(currentSemester);

      const currentCourse =
        report.semesters
          .find((s) => s.name.toLowerCase() === params.semester)
          ?.courses.find((c) => c.id === params.course) ?? null;

      setCourse(currentCourse);

      setStats({
        average: calculateAverage(currentCourse),
        grade: getCourseGrade(currentCourse),
        assignements: getCourseAssignementsCount(currentCourse).toString(),
      });
      setIsLoading(false);
    };

    initialize();
  }, [uuid]);

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
      ) : !semester || !course ? (
        <NotFound />
      ) : (
        <>
          <PageTitle
            parts={[
              currentReport?.student?.name ?? "",
              semester!.name,
              course!.name,
            ]}
            clickable={[0]}
            customLink={`online/${uuid}`}
          />
          <Cards>
            <Card title="Grade" subtitle={stats.grade} icon={Flag} />
            <Card title="Average" subtitle={stats.average} icon={Activity} />
            <Card title="Credits*" subtitle={stats.assignements} icon={Award} />
          </Cards>
          <div className="table__container">
            <Table days={course!.days} />
          </div>
          {data.labels.length > 0 && (
            <div className="charts">
              <Bar data={data} options={options} />
            </div>
          )}
        </>
      )}
    </Layout>
  );
}
