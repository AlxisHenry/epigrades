"use client";

import "@/styles/pages/[course].scss";
import { type Semester, getSemester } from "@/services/semesters";
import {
  type Course as CourseType,
  getCourse,
  getCourseGrade,
  calculateCourseGradeAverage,
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
import { Line } from "react-chartjs-2";
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
    setSemester(getSemester(params.semester));
    setCourse(getCourse(params.course));
    setCourseGrade(getCourseGrade(course));
    setCourseGradeAverage(calculateCourseGradeAverage(course));
    setCourseAssignementsCount(getCourseAssignementsCount(course));
    setLoading(false);
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
        }
      },
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.5)",
        }
      }
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
        backgroundColor: ["#FFF"],
        borderColor: ["#FFF"],
        borderWidth: 1,
        tension: 0.2,
      },
    ],
  };

  if (!loading) {
    for (const c of course!.days) {
      if (c.grade === null || c.grade === "-") continue;
      data.labels.push(c.name);
      data.datasets[0].data.push(c.grade);
    }
  }

  return (
    <Layout>
      {loading ? (
        <Loading />
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
            <CourseTable days={course!.days} />
          </div>
          {
            data.labels.length > 0 ? (
              <div className="charts">
                <Line data={data} options={options} />
              </div>
            ) : null
          }
        </>
      )}
    </Layout>
  );
}
