import "@/styles/components/Course.scss";
import ArrowIcon from "./Icons/Arrow";
import { type Day as DayType } from "@/services/days";
import { useState } from "react";
import CourseLink from "./CourseLink";
import { type Semester } from "@/services/semesters";
import CourseTable from "./CourseTable";

type Props = {
  name: string;
  semester: Semester | null;
  days: DayType[];
  isOpen: boolean;
  toggleDropdown: () => void;
};

export default function Course({
  name,
  semester,
  days,
  isOpen,
  toggleDropdown,
}: Props) {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.target instanceof HTMLAnchorElement) return;
    toggleDropdown();
  };

  return (
    <div className={`course ${isOpen ? "course--open" : ""}`}>
      <div className="course__header" onClick={handleClick}>
        <CourseLink
          semester={semester?.name}
          courseName={name}
          content={name}
          title={true}
        />
        <div className="course__arrow">
          <ArrowIcon />
        </div>
      </div>
      <div className="course__days">
        <CourseTable days={days} />
        <CourseLink
          semester={semester?.name}
          courseName={name}
          content="View Course"
          title={false}
        />
      </div>
    </div>
  );
}
