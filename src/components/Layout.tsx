import { Sidebar } from "@/components";

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
