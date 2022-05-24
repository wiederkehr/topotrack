<script>
  import clickOutside from '$actions/clickOutside.js';
  let clickedOutside = false;
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
    use:clickOutside={{
      enabled: true,
      callback: () => (clickedOutside = true),
    }}
  >
    Has the user clicked outside this component?
    <span class={clickedOutside ? 'positive' : 'negative'}>
      {clickedOutside ? 'Yes' : 'No'}
    </span>
  </div>
</markup>
