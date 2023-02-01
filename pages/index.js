import Head from "next/head";

import Layout from "@/components/Layout";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Content from "@/components/Content";

export default function Index() {
  return (
    <Layout>
      <Head>
        <title>Topotrack</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Content>Content</Content>
      <Footer />
    </Layout>
  );
}
