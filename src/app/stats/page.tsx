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
  const [datasets, setDatasets] = useState<
    {
      label: string;
      data: string[];
      backgroundColor: string[];
      borderColor: string[];
      borderWidth: number;
    }[]
  >([]);

  useEffect(() => {
    const initialize = async () => {
      const semestersNames = await getSemestersNames();
      const updatedDatasets = [];

      for (const semesterName of semestersNames) {
        let semester = await getSemester(semesterName);
        let randomColor = Math.floor(Math.random() * 16777215).toString(16);
        updatedDatasets.push({
          label: semesterName,
          data: [calculateSemesterGradeAverage(semester)],
          backgroundColor: [`#${randomColor}`],
          borderColor: [`#${randomColor}`],
          borderWidth: 1,
        });
      }
      
      setLabels(semestersNames);
      setDatasets(updatedDatasets);
    };

    initialize();
  }, []);

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
        <Bar
          data={{
            labels: labels,
            datasets: datasets,
          }}
          options={options}
        />
      </div>
    </Layout>
  );
}
