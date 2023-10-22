import Head from "next/head";
import { useSession } from "next-auth/react";

import Column from "@/components/layout/column";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Content from "@/components/content";
import Welcome from "@/components/welcome";
import Composer from "@/components/composer";

// FIXME: Read environment variables from process
const ENV = "DEV";
const dev = ENV === "DEV";

export default function Index() {
  const { data: session } = useSession();
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
      <Head>
        <title>Topotrack</title>
      </Head>
      <Header dev={dev} />
      <Content>{renderContent()}</Content>
      <Footer />
    </Column>
  );
}
