<script>
  import Header from '$components/interface/Header.svelte';
  import Main from '$components/interface/Main.svelte';
  import Footer from '$components/interface/Footer.svelte';
  import '$styles/app.scss';
</script>

<markup>
  <Header />
  <Main>
    <slot />
  </Main>
  <Footer />
</markup>
