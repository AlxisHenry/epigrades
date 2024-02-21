import { Sidebar } from "./Sidebar";

interface Props {
  children: React.ReactNode;
}

export function Layout({ children }: Props) {
  return (
    <>
      <Sidebar />
      <main>{children}</main>
    </>
  );
}
