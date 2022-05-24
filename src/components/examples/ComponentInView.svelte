<script>
  import inView from '$actions/inView.js';
  let isInView = false;
</script>

<style lang="scss">
  .positive {
    color: $color-positive;
  }
  .negative {
    color: $color-negative;
  }
</style>

<markup>
  <div
    use:inView={{ bottom: 200, top: 200 }}
    on:enter={() => (isInView = true)}
    on:exit={() => (isInView = false)}
  >
    Is this component 200px into the viewport from the bottom or top?
    <span class:positive={isInView} class:negative={!isInView}>
      {isInView ? 'Yes' : 'No'}
    </span>
  </div>
</markup>
