import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { getSemester, getSemestersNames } from "@/services/semesters";

import {
  BarChartIcon,
  HomeIcon,
  MagicIcon,
  MenuIcon,
  SchoolIcon,
} from "@/components/icons";

interface DropdownItem {
  route: string;
  text: string;
}

interface Item {
  route: string;
  text: string;
  pathname?: string;
  icon?: JSX.Element;
  isDropdown?: boolean;
  items?: DropdownItem[];
}

export function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [items, setItems] = useState<Item[]>([]);
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

      setItems([
        {
          route: "/",
          text: "Home",
          icon: <HomeIcon />,
        },
        {
          route: "/semesters",
          text: "Semesters",
          icon: <SchoolIcon />,
          items: semesters,
          isDropdown: true
        },
        {
          route: "/stats",
          text: "Statistics",
          icon: <BarChartIcon />,
        },
        {
          route: "/online",
          text: "Online",
          icon: <MagicIcon />,
        },
      ]);
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
          {items.map((item, index) => {
            return item.isDropdown ? (
              <SidebarDropdown
                pathname={pathname}
                key={index}
                text={item.text}
                icon={item.icon}
                items={item.items || []}
              />
            ) : (
              <SidebarItem
                pathname={pathname}
                key={index}
                route={item.route}
                text={item.text}
                icon={item.icon}
              />
            );
          })}
        </div>
      </nav>
    </>
  );
}

function SidebarItem({
  route,
  pathname,
  icon,
  text,
}: {
  route: string;
  pathname?: string;
  icon?: JSX.Element;
  text: string;
}) {
  return (
    <Link
      href={route.toLowerCase()}
      className={
        "sidebar__item" + (pathname === route ? " sidebar__item--active" : "")
      }
    >
      {icon && (
        <>
          <div className="sidebar__item__icon">{icon}</div>
        </>
      )}
      <div className="sidebar__item__text">{text}</div>
    </Link>
  );
}

function SidebarDropdown({
  pathname,
  text,
  icon,
  items,
}: {
  pathname?: string;
  text: string;
  icon?: JSX.Element;
  items: DropdownItem[];
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [disableMouseEvents, setDisableMouseEvents] = useState<boolean>(false);

  return (
    <div
      className={
        "sidebar__dropdown" + (isDropdownOpen ? " sidebar__dropdown--open" : "")
      }
      onMouseEnter={
        disableMouseEvents ? undefined : () => setIsDropdownOpen(true)
      }
      onMouseLeave={
        disableMouseEvents ? undefined : () => setIsDropdownOpen(false)
      }
    >
      <div className="sidebar__dropdown__header">
        {icon && (
          <>
            <div className="sidebar__dropdown__icon">{icon}</div>
          </>
        )}
        <div className="sidebar__dropdown__text">{text}</div>
      </div>
      <div
        className={
          "sidebar__dropdown__items" +
          (isDropdownOpen ? " sidebar__dropdown__items--open" : "")
        }
      >
        {items.map((item, index) => (
          <SidebarItem
            pathname={pathname}
            key={index}
            route={item.route}
            text={item.text}
          />
        ))}
      </div>
    </div>
  );
}

function SidebarToggle({
  setIsSidebarOpen,
  isSidebarOpen,
}: {
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSidebarOpen: boolean;
}) {
  return (
    <div className="sidebar__toggle">
      <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        <MenuIcon />
      </button>
    </div>
  );
}
