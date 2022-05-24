<script lang="ts">
  export let title: string = '';
</script>

<style lang="scss">
  section {
    background-color: var(--color-foreground);
    border-radius: $radius-3;
    box-shadow: $shadow-1;
    margin-bottom: $space-4;
    padding: $space-4;
    &:last-of-type {
      margin-bottom: 0;
    }
  }
  h2 {
    font-size: $font-size-3;
    margin-bottom: $space-2;
  }
</style>

<markup>
  <section>
    <h2>{title}</h2>
    <slot />
  </section>
</markup>
