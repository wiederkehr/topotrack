import { redirect } from "next/navigation";

import { auth } from "@/auth";
import Content from "@/components/content";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Column from "@/components/layout/column";
import Composer from "@/features/composer";

export default async function Page() {
  const session = await auth();
  if (!session) redirect("/");
  return (
    <Column>
      <Header user={session?.user} />
      <Content>
        <Composer />
      </Content>
      <Footer />
    </Column>
  );
}
