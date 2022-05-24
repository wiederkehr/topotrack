<script>
  import textures from 'textures';
  import * as d3 from 'd3';
  import { onMount } from 'svelte';

  let svg;
  const texture = textures.lines().thicker().stroke('var(--color-base)');

  const drawTexture = () => {
    svg = d3.select(svg);
    texture(svg);
  };

  onMount(() => {
    drawTexture();
  });
</script>

<markup>
  <svg bind:this={svg} height="100" width="250" viewBox="0 0 250 100">
    <circle cx="50" cy="50" r="50" style={`fill: ${texture.url()}`} />
    <rect x="150" height="100" width="100" style={`fill: ${texture.url()}`} />
  </svg>
</markup>
