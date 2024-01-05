import SidebarItem from "./SidebarItem";
import SidebarDropdown, { type DropdownItemProps } from "./SidebarDropdown";
import SidebarToggle from "./SidebarToggle";
import { getSemester, getSemestersNames } from "@/services/semesters";
import { useEffect, useState } from "react";
import BarChartIcon from "./Icons/BarChartIcon";
import HomeIcon from "./Icons/HomeIcon";
import SchoolIcon from "./Icons/SchoolIcon";
import { usePathname } from "next/navigation";
import MagicIcon from "./Icons/MagicIcon";

export default function Sidebar() {
  const [semesters, setSemesters] = useState<DropdownItemProps[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const pathname = usePathname();

  useEffect(() => {
    const initialize = async () => {
      const semestersNames = await getSemestersNames();
      const semesters = semestersNames
        .filter(async (semestersName) => {
          let semester = await getSemester(semestersName);
          return semester?.courses.length;
        })
        .map((semesterName) => ({
          text: semesterName,
          route: `/semesters/${semesterName}`,
        }));
      setSemesters(semesters);
    };

    initialize();
  }, []);

  return (
    <>
      <SidebarToggle
        setIsSidebarOpen={setIsSidebarOpen}
        isSidebarOpen={isSidebarOpen}
      />
      <nav className={"sidebar" + (isSidebarOpen ? " sidebar--open" : "")}>
        <SidebarToggle
          setIsSidebarOpen={setIsSidebarOpen}
          isSidebarOpen={isSidebarOpen}
        />
        <div className="sidebar__items">
          <SidebarItem
            pathname={pathname}
            route="/"
            icon={<HomeIcon />}
            text="Home"
          />
          <SidebarDropdown
            pathname={pathname}
            text="Semesters"
            icon={<SchoolIcon />}
            items={semesters}
          />
          <SidebarItem
            pathname={pathname}
            route="/stats"
            icon={<BarChartIcon />}
            text="Statistics"
          />
          <SidebarItem
            pathname={pathname}
            route="/online"
            icon={<MagicIcon />}
            text="Online"
          />
        </div>
      </nav>
    </>
  );
}
