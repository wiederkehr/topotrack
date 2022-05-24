<script>
  import Button from '$components/interface/Button.svelte';
  import { downloadSVG, downloadPNG } from '$functions/download';
  import { colors } from '$styles/constants.js';
</script>

<style lang="scss">
  .buttons {
    margin: $space-1 0;
  }
</style>

<markup>
  <div class="svg">
    <svg height="100" width="250" viewBox="0 0 250 100" id="svg-to-download">
      <circle cx="50" cy="50" r="50" style={`fill: ${colors.accent}`} />
      <rect x="150" height="100" width="100" style={`fill: ${colors.accent}`} />
    </svg>
  </div>
  <div class="buttons">
    <Button on:click={() => downloadSVG('#svg-to-download')}
      >Download SVG</Button
    >
    <Button on:click={() => downloadPNG('#svg-to-download')}
      >Download PNG</Button
    >
  </div>
</markup>
