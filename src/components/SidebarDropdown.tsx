import SidebarItem from "./SidebarItem";
import React, { useState } from "react";

export type SidebarDropdownProps = {
  pathname: string;
  text: string;
  icon?: JSX.Element;
  items: DropdownItemProps[];
};

export type DropdownItemProps = {
  route: string;
  text: string;
}

export default function SidebarDropdown({
  pathname,
  text,
  icon,
  items,
}: SidebarDropdownProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [disableMouseEvents, setDisableMouseEvents] = useState<boolean>(false);

  return (
    <div
      className={
        "sidebar__dropdown" + (isDropdownOpen ? " sidebar__dropdown--open" : "")
      }
      onMouseEnter={disableMouseEvents ? undefined : () => setIsDropdownOpen(true)}
      onMouseLeave={disableMouseEvents ? undefined : () => setIsDropdownOpen(false)}
    >
      <div className="sidebar__dropdown__header">
        {icon && (
          <>
            <div className="sidebar__dropdown__icon">
              {icon}
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
          <SidebarItem pathname={pathname} key={index} route={item.route} text={item.text} />
        ))}
      </div>
    </div>
  );
}
