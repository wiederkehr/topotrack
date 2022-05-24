<script>
  import feather from 'feather-icons';
  const directions = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'];
  export let name;
  export let direction = 'n';
  export let size = '1em';
  export let color = undefined;
  export let weight = undefined;
  $: icon = feather.icons[name];
  $: rotation = directions.indexOf(direction) * 45;
  $: if (icon) {
    if (color) icon.attrs['stroke'] = color;
    if (weight) icon.attrs['stroke-width'] = weight;
  }
</script>

<style>
  svg {
    overflow: visible;
    transform-origin: 50% 50%;
  }
</style>

<markup>
  {#if icon}
    <svg
      {...icon.attrs}
      style="width: {size}; height: {size}; transform: rotate({rotation}deg);"
    >
      <g>
        {@html icon.contents}
      </g>
    </svg>
  {/if}
</markup>
