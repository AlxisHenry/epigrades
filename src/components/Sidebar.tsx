import "@/styles/components/Sidebar.scss";
import SidebarItem, { type SidebarItemProps } from "./SidebarItem";
import SidebarDropdown from "./SidebarDropdown";
import SidebarToggle from "./SidebarToggle";
import { getSemesterNames } from "@/services/semesters";
import { useEffect, useState } from "react";
import BarChartIcon from "./Icons/BarChartIcon";
import InfoIcon from "./Icons/InfoIcon";
import HomeIcon from "./Icons/HomeIcon";
import SchoolIcon from "./Icons/SchoolIcon";

export default function Sidebar() {
  const [semesters, setSemesters] = useState<SidebarItemProps[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  useEffect(() => {
    setSemesters(
      getSemesterNames().map((name) => ({
        route: `/semesters/${name}`,
        text: name,
      }))
    );
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
          <SidebarItem route="/" icon={HomeIcon} text="Home" />
          <SidebarDropdown
            text="Semesters"
            icon={SchoolIcon}
            items={semesters}
          />
          <SidebarItem route="/" icon={InfoIcon} text="Alerts" />
          <SidebarItem route="/stats" icon={BarChartIcon} text="Statistics" />
        </div>
      </nav>
    </>
  );
}
