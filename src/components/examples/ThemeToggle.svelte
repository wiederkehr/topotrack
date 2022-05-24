<script>
  import { browser } from '$app/env';
  import theme from '$stores/theme.js';
  import Theme from '$components/utilities/Theme.svelte';
  import Button from '$components/interface/Button.svelte';
  const toggleTheme = () => ($theme = $theme === 'dark' ? 'light' : 'dark');
  $: if (browser) document.body.className = $theme;
</script>

<markup>
  <Theme bind:theme={$theme} />
  <Button on:click={toggleTheme}>Toggle theme</Button>
</markup>
