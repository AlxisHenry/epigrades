import "@/styles/components/SidebarItem.scss";
import Icon from "./Icon";

export type SidebarItemProps = {
  route: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  text: string;
};

export default function SidebarItem({ route, icon, text }: SidebarItemProps) {
  return (
    <div className="sidebar__item">
      {icon && (
        <>
          <div className="sidebar__item__icon">
            <Icon icon={icon} />
          </div>
        </>
      )}
      <div className="sidebar__item__text">
        <a href={route}>{text}</a>
      </div>
    </div>
  );
}
