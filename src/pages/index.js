import Head from "next/head";
import { useSession } from "next-auth/react";

import Layout from "@/components/Layout";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Content from "@/components/Content";
import Welcome from "@/components/Welcome";
import Creator from "@/components/Creator";

export default function Index() {
  const { data: session } = useSession();
  return (
    <Layout>
      <Head>
        <title>Topotrack</title>
      </Head>
      <Header />
      <Content>{session ? <Creator /> : <Welcome />}</Content>
      <Footer />
    </Layout>
  );
}
