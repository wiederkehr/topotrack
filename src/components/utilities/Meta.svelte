<script lang="ts">
  export let title: string = 'Title';
  export let description: string = 'Description';
  export let author: string = 'Author';
  export let url: string = '';
  export let keywords: string = '';
  export let preloadFont: Array<string> = [];
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta name="author" content={author} />
  <meta name="news_keywords" content={keywords} />

  <meta property="og:title" content={title} />
  <meta property="og:site_name" content="FIXME: site_name" />
  <meta property="og:url" content={url} />
  <meta property="og:description" content={description} />
  <meta property="og:type" content="article" />
  <meta property="og:locale" content="en_US" />

  <meta property="og:image" content="{url}/assets/social-default.jpg" />
  <meta property="og:image:type" content="image/jpeg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="600" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="FIXME: site" />
  <meta name="twitter:creator" content="FIXME: creator" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image:src" content="{url}/assets/social-twitter.jpg" />

  <meta name="robots" content="max-image-preview:large" />

  <link rel="canonical" href="{url}/" />

  {#each preloadFont as href}
    <link
      rel="preload"
      {href}
      as="font"
      type="font/woff2"
      crossorigin="anonymous"
    />
  {/each}
</svelte:head>
