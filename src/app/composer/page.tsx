import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { Content } from "@/components/content";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Cell } from "@/components/layout/cell";
import { Composer } from "@/features/composer";

export default async function Page() {
  const session = await auth();
  if (!session) redirect("/");
  const user = session?.user || null;
  const token = session?.access_token || "";

  return (
    <Cell>
      <Header user={user} />
      <Content>
        <Composer token={token} />
      </Content>
      <Footer />
    </Cell>
  );
}
