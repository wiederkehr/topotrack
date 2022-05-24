<script>
  import Meta from '$components/utilities/Meta.svelte';
  import Scroller from '@sveltejs/svelte-scroller';
  let index, offset, progress;
</script>

<style lang="scss">
  section {
    height: 80vh;
  }
</style>

<markup>
  <Meta />
  <Scroller top={0.2} bottom={0.8} bind:index bind:offset bind:progress>
    <div slot="background">
      <p>
        This is the background content. It will stay fixed in place while the
        foreground scrolls over the top.
      </p>

      <p>Section {index + 1} is currently active.</p>
    </div>

    <div slot="foreground">
      <section>This is the first section.</section>
      <section>This is the second section.</section>
      <section>This is the third section.</section>
    </div>
  </Scroller>
</markup>
