"use client";

import { useEffect, useState } from "react";
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
  calculateAverage,
  getSemester,
  getSemestersNames,
} from "@/services/semesters";

import { Layout, PageTitle } from "@/components";

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

      let data: string[] = [];
      let colors: string[] = [];

      for (const semesterName of semestersNames) {
        let semester = await getSemester(semesterName);
        colors.push(
          `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
            Math.random() * 255
          )}, ${Math.floor(Math.random() * 255)}, 0.5)`
        );
        data.push(calculateAverage(semester));
      }

      setDatasets([
        {
          label: "Semester",
          data: data,
          backgroundColor: colors,
          borderColor: colors,
          borderWidth: 1,
        },
      ]);
      setLabels(semestersNames);
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
            labels,
            datasets,
          }}
          options={options}
        />
      </div>
    </Layout>
  );
}
