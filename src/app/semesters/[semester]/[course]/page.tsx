"use client";

import "@/styles/pages/course.scss";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Bar } from "react-chartjs-2";

import { type Semester, getSemester } from "@/services/semesters";
import {
  type Course as CourseType,
  getCourse,
  calculateAverage,
} from "@/services/courses";
import { getCourseAssignementsCount } from "@/services/assignements";

import {
  NotFound,
  PageTitle,
  Loading,
  Table,
  Layout,
  Cards,
  Card,
} from "@/components";

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

type Params = {
  semester: string;
  course: string;
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

  const [semester, setSemester] = useState<Semester | null>(null);
  const [course, setCourse] = useState<CourseType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [courseGrade, setCourseGrade] = useState<string>("");
  const [courseGradeAverage, setCourseGradeAverage] = useState<string>("");
  const [courseAssignementsCount, setCourseAssignementsCount] =
    useState<number>(0);

  useEffect(() => {
    const initialize = async () => {
      let s = await getSemester(params.semester);
      let c = await getCourse(params.course);

      setSemester(s);
      setCourse(c);
      setCourseGrade(getCourseGrade(course));
      setCourseGradeAverage(calculateAverage(course));
      setCourseAssignementsCount(getCourseAssignementsCount(course));
      setLoading(false);
    };

    initialize();
  }, [params.semester, params.course, course]);

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
            parts={["Semesters", semester!.name, course!.name]}
            clickable={[1]}
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
            <Table days={course!.days} />
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
