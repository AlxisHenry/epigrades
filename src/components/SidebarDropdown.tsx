import "@/styles/components/SidebarDropdown.scss";
import SidebarItem, { type SidebarItemProps } from "./SidebarItem";
import React, { useState } from "react";
import Icon from "./Icon";

export type SidebarDropdownProps = {
  text: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  items: SidebarItemProps[];
};

export default function SidebarDropdown({
  text,
  icon,
  items,
}: SidebarDropdownProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  return (
    <div
      className={
        "sidebar__dropdown" + (isDropdownOpen ? " sidebar__dropdown--open" : "")
      }
      onMouseEnter={() => setIsDropdownOpen(!isDropdownOpen)}
      onMouseLeave={() => setIsDropdownOpen(!isDropdownOpen)}
    >
      <div className="sidebar__dropdown__header">
        {icon && (
          <>
            <div className="sidebar__dropdown__icon">
              <Icon icon={icon} />
            </div>
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
          <>
            <SidebarItem key={index} route={item.route} text={item.text} />
          </>
        ))}
      </div>
    </div>
  );
}
