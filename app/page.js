import { auth } from "@/auth";
import Column from "@/components/layout/column";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Content from "@/components/content";
import Welcome from "@/components/welcome";
import Composer from "@/components/composer";

const dev = false;

export default async function Page() {
  const session = await auth();
  const renderContent = () => {
    if (dev) {
      return <Composer />;
    }
    if (session) {
      return <Composer />;
    } else {
      return <Welcome />;
    }
  };
  return (
    <Column>
      <Header dev={dev} />
      <Content>{renderContent()}</Content>
      <Footer />
    </Column>
  );
}
