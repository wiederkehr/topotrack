<script>
  import { onMount } from 'svelte';
  import * as Plot from '@observablehq/plot';
  import { colors } from '$styles/constants.js';

  const data = [
    { name: 'Tollak', height: 100 },
    { name: 'Anna', height: 165 },
    { name: 'Benji', height: 175 },
  ];

  let chart;

  onMount(() => {
    chart = Plot.plot({
      marks: [Plot.barX(data, { x: 'height', y: 'name', fill: colors.accent })],
      style: { color: 'var(--color-base)', backgroundColor: 'transparent' },
    }).outerHTML;
  });
</script>

<markup>
  {@html chart}
</markup>
