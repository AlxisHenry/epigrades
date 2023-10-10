import "@/styles/components/SidebarItem.scss";
import Icon from "./Icon";
import Link from "next/link";

export type SidebarItemProps = {
  route: string;
  pathname: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  text: string;
};

export default function SidebarItem({ route, pathname, icon, text }: SidebarItemProps) {
  return (
    <Link href={route.toLowerCase()} className={"sidebar__item" + (pathname === route ? " sidebar__item--active" : "")}>
      {icon && (
        <>
          <div className="sidebar__item__icon">
            <Icon icon={icon} />
          </div>
        </>
      )}
      <div className="sidebar__item__text">
        {text}
      </div>
    </Link>
  );
}
