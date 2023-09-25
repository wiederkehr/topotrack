import Head from "next/head";
import { useSession } from "next-auth/react";

import { Column } from "@/components/Layout";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Content from "@/components/Content";
import Welcome from "@/components/Welcome";
import Creator from "@/components/Creator";
import CreatorDev from "@/components/CreatorDev";

const ENV = "DEV";
const dev = ENV === "DEV";

export default function Index() {
  const { data: session } = useSession();
  const renderContent = () => {
    if (dev) {
      return <CreatorDev />;
    }
    if (session) {
      return <Creator />;
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
