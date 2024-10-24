import { redirect } from "next/navigation";

import { auth } from "@/auth";
import Content from "@/components/content";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Column from "@/components/layout/column";
import Welcome from "@/components/welcome";

export default async function Page() {
  const session = await auth();
  if (session) redirect("/composer");
  return (
    <Column>
      <Header user={session?.user} />
      <Content>
        <Welcome />
      </Content>
      <Footer />
    </Column>
  );
}
