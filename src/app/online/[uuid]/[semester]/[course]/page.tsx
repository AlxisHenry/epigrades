"use client";

import "@/styles/pages/course.scss";
import { type Semester } from "@/services/semesters";
import {
  type Course as CourseType,
  calculateAverage,
} from "@/services/courses";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PageTitle from "@/components/PageTitle";
import Loading from "@/components/Loading";
import CourseTable from "@/components/CourseTable";
import Layout from "@/components/Layout";
import Cards from "@/components/Cards";
import Card from "@/components/Card";
import { getCourseAssignementsCount } from "@/services/assignements";
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
import { getCourseGrade } from "@/services/grades";
import { isGradedDay } from "@/services/days";
import { getReport } from "@/services/api";
import { NotFound } from "@/components/NotFound";

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
  const [semester, setSemester] = useState<Semester | null>(null);
  const [course, setCourse] = useState<CourseType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [student, setStudent] = useState<string>("");
  const [courseGrade, setCourseGrade] = useState<string>("");
  const [courseGradeAverage, setCourseGradeAverage] = useState<string>("");
  const [courseAssignementsCount, setCourseAssignementsCount] =
    useState<number>(0);

  useEffect(() => {
    (async () => {
      const { success, report } = await getReport(uuid);
      if (!success || !report) {
        return;
      }

      setSemester(
        report.semesters.find(
          (s) => s.name.toLowerCase() === params.semester
        ) ?? null
      );
      setCourse(
        report.semesters
          .find((s) => s.name.toLowerCase() === params.semester)
          ?.courses.find((c) => c.id === params.course) ?? null
      );
      setStudent(report?.student?.name || "");
      setCourseGrade(getCourseGrade(course));
      setCourseGradeAverage(calculateAverage(course));
      setCourseAssignementsCount(getCourseAssignementsCount(course));
      setLoading(false);
    })();
  }, [params.semester, params.course, course, uuid]);

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

  if (!loading && course) {
    for (const day of course!.days) {
      if (!isGradedDay(day)) continue;
      data.labels.push(day.name);
      data.datasets[0].data.push(day.grade);
    }
  }

  return (
    <Layout>
      {loading ? (
        <Loading />
      ) : !semester || !course ? (
        <NotFound />
      ) : (
        <>
          <PageTitle
            parts={[student, semester!.name, course!.name]}
            clickable={[0]}
            customLink={`online/${uuid}`}
          />
          <Cards>
            <Card title="Grade" subtitle={courseGrade} />
            <Card title="Average" subtitle={courseGradeAverage} />
            <Card
              title="Assignments"
              subtitle={courseAssignementsCount.toString()}
            />
          </Cards>
          <div className="table__container">
            <CourseTable days={course!.days} />
          </div>
          {data.labels.length > 0 ? (
            <div className="charts">
              <Bar data={data} options={options} />
            </div>
          ) : null}
        </>
      )}
    </Layout>
  );
}
