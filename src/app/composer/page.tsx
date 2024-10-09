import { auth } from "@/auth";
import Composer from "@/components/composer";
import Content from "@/components/content";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Column from "@/components/layout/column";
import { redirect } from "next/navigation";

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
