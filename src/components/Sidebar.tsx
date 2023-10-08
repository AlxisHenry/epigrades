import "@/styles/components/Sidebar.scss";
import SidebarItem from "./SidebarItem";
import SidebarDropdown, { type DropdownItemProps } from "./SidebarDropdown";
import SidebarToggle from "./SidebarToggle";
import { getSemesterNames } from "@/services/semesters";
import { useEffect, useState } from "react";
import BarChartIcon from "./Icons/BarChartIcon";
import InfoIcon from "./Icons/InfoIcon";
import HomeIcon from "./Icons/HomeIcon";
import SchoolIcon from "./Icons/SchoolIcon";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const [semesters, setSemesters] = useState<DropdownItemProps[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const pathname = usePathname();

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
          <SidebarItem pathname={pathname} route="/" icon={HomeIcon} text="Home" />
          <SidebarDropdown
            pathname={pathname}
            text="Semesters"
            icon={SchoolIcon}
            items={semesters}
          />
          <SidebarItem pathname={pathname} route="/alerts" icon={InfoIcon} text="Alerts" />
          <SidebarItem pathname={pathname} route="/stats" icon={BarChartIcon} text="Statistics" />
        </div>
      </nav>
    </>
  );
}
