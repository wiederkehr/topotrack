<style lang="scss">
  button {
    align-items: center;
    appearance: none;
    background: var(--color-foreground);
    border: 2px solid var(--color-base);
    border-radius: $radius-2;
    color: var(--color-base);
    cursor: pointer;
    display: inline-flex;
    font-family: inherit;
    font-size: inherit;
    justify-content: center;
    line-height: $line-height-base;
    margin: 0;
    outline: 0;
    padding: $space-1 $space-2;
    text-align: center;
    &:hover {
      background: var(--color-base);
      color: var(--color-foreground);
    }
    &:focus {
      border-color: $color-component-focus-border;
      outline: 2px solid $color-component-focus-outline;
    }
  }
</style>

<markup>
  <button on:click><slot /></button>
</markup>
