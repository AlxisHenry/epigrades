type SidebarToggleProps = {
	setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
	isSidebarOpen: boolean;
}

export default function SidebarToggle({ setIsSidebarOpen, isSidebarOpen }: SidebarToggleProps) {
  return (
    <div className="sidebar__toggle">
      <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        <svg
          width="50"
          height="50"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#F2F2F2"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
    </div>
  );
}
