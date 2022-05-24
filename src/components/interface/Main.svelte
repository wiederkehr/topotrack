<script>
  import Container from '$components/interface/Container.svelte';
</script>

<style lang="scss">
  main {
    padding: $space-4 0;
  }
</style>

<markup>
  <main>
    <Container>
      <slot />
    </Container>
  </main>
</markup>
