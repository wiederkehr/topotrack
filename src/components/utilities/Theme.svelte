<script>
  import { onMount, afterUpdate, createEventDispatcher } from 'svelte';

  export let theme = 'light';
  export let key = 'theme';

  const SCHEME = '(prefers-color-scheme: dark)';
  const THEME = { dark: 'dark', light: 'light' };
  const dispatch = createEventDispatcher();

  const validTheme = theme => theme in THEME;
  const handleChange = event =>
    (theme = event.matches ? THEME.dark : THEME.light);

  onMount(() => {
    const darkMode = matchMedia(SCHEME);
    const persisted_theme = localStorage.getItem(key);
    if (validTheme(persisted_theme)) {
      theme = persisted_theme;
    } else {
      theme = darkMode.matches ? THEME.dark : THEME.light;
    }
    darkMode.addEventListener('change', handleChange);
    return () => darkMode.removeEventListener('change', handleChange);
  });

  afterUpdate(() => {
    if (validTheme(theme)) {
      dispatch('change', theme);
      localStorage.setItem(key, theme);
    }
  });
</script>
