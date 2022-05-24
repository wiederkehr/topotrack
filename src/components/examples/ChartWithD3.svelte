<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';

  const data = [
    { name: 'Tollak', height: 100 },
    { name: 'Anna', height: 165 },
    { name: 'Benji', height: 175 },
  ];

  let chart;

  onMount(() => {
    d3.select(chart)
      .selectAll('div')
      .data(data)
      .enter()
      .append('div')
      .style('width', function (d) {
        return d.height + 'px';
      })
      .text(function (d) {
        return d.name;
      });
  });
</script>

<style lang="scss">
  .chart :global(div) {
    font-family: $font-family-mono;
    background-color: $color-accent;
    text-align: right;
    padding: 4px;
    margin: 1px;
    color: white;
  }
</style>

<markup>
  <div bind:this={chart} class="chart" />
</markup>
