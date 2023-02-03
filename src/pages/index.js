import Head from "next/head";
import { useSession } from "next-auth/react";

import Layout from "@/components/Layout";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Content from "@/components/Content";
import Instruction from "@/components/Instruction";
import Activities from "@/components/Activities";

export default function Index() {
  const { data: session } = useSession();
  return (
    <Layout>
      <Head>
        <title>Topotrack</title>
      </Head>
      <Header />
      <Content>{session ? <Activities /> : <Instruction />}</Content>
      <Footer />
    </Layout>
  );
}
