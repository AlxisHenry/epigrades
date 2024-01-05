"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  calculateSemesterGradeAverage,
  getSemester,
  getSemestersNames,
} from "@/services/semesters";
import Layout from "@/components/Layout";
import PageTitle from "@/components/PageTitle";
import { useEffect, useState } from "react";

export default function Home() {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  const [labels, setLabels] = useState<string[]>([]);
  const data: {
    labels: string[];
    datasets: {
      label: string;
      data: string[];
      backgroundColor: string[];
      borderColor: string[];
      borderWidth: number;
    }[];
  } = {
    labels: labels,
    datasets: [
      {
        label: "Semester average",
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
      },
    ],
  };

  useEffect(() => {
    const initialize = async () => {
      const semestersNames = await getSemestersNames();
      setLabels(semestersNames);

      for (const semestersName of semestersNames) {
        let semester = await getSemester(semestersName);
        let average = calculateSemesterGradeAverage(semester);
        let randomColor = Math.floor(Math.random() * 16777215).toString(16);
        data.datasets[0].data.push(average);
        data.datasets[0].backgroundColor.push(`#${randomColor}`);
        data.datasets[0].borderColor.push(`#${randomColor}`);
      }
    };

    initialize();
  }, [data.datasets]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Average per semester",
      },
    },
  };

  return (
    <Layout>
      <PageTitle parts={["Stats 📈"]} />
      <div className="charts">
        <Bar data={data} options={options} />
      </div>
    </Layout>
  );
}
