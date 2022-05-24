<script>
  import chroma from 'chroma-js';
  const squares = [1, 2, 3, 4, 5, 6];
  const scale = chroma.scale(['#eee', '#999']).domain(squares);
</script>

<style lang="scss">
  .squares {
    display: flex;
  }
  .square {
    background-color: $color-mono-1;
    color: $color-black;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
    height: 3rem;
  }
</style>

<markup>
  <div class="squares">
    {#each squares as square}
      <div class="square" style={`background-color:${scale([square])}`}>
        {scale([square])}
      </div>
    {/each}
  </div>
</markup>
