import { redirect } from "next/navigation";

import { auth } from "@/auth";
import Content from "@/components/content";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Cell from "@/components/layout/cell";
import Composer from "@/features/composer";

export default async function Page() {
  const session = await auth();
  if (!session) redirect("/");
  const user = session?.user;
  return (
    <Cell>
      <Header user={user} />
      <Content>
        <Composer />
      </Content>
      <Footer />
    </Cell>
  );
}
