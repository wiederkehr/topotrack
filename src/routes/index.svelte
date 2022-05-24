<script>
  // Helper components
  import Meta from '$components/utilities/Meta.svelte';
  // Interface components
  import Card from '$components/interface/Card.svelte';
  // Example components
  import ChartWithD3 from '$components/examples/ChartWithD3.svelte';
  import ChartWithPlot from '$components/examples/ChartWithPlot.svelte';
  import ColorsWithChroma from '$components/examples/ColorsWithChroma.svelte';
  import ComponentClickOutside from '$components/examples/ComponentClickOutside.svelte';
  import ComponentInView from '$components/examples/ComponentInView.svelte';
  import DataDownloading from '$components/examples/DataDownloading.svelte';
  import DataLoading from '$components/examples/DataLoading.svelte';
  import DataWithTidy from '$components/examples/DataWithTidy.svelte';
  import DatesWithDateFNS from '$components/examples/DatesWithDateFNS.svelte';
  import GeometryWithFlatten from '../components/examples/GeometryWithFlatten.svelte';
  import Markdown from '$components/examples/Markdown.md';
  import Math from '$components/examples/Math.svelte';
  import StoreToUrl from '$components/examples/StoreToUrl.svelte';
  import SVGDownloading from '$components/examples/SVGDownloading.svelte';
  import SVGIcons from '$components/examples/SVGIcons.svelte';
  import SVGTextures from '$components/examples/SVGTextures.svelte';
  import ThemeToggle from '$components/examples/ThemeToggle.svelte';
</script>

<markup>
  <Meta title="Data Visualization Toolkit: Examples" />
  <Card title="Theme Toggle">
    <ThemeToggle />
  </Card>
  <Card title="Store to URL">
    <StoreToUrl />
  </Card>
  <Card title="Chart with D3.js">
    <ChartWithD3 />
  </Card>
  <Card title="Chart with Plot.js">
    <ChartWithPlot />
  </Card>
  <Card title="Data loading">
    <DataLoading />
  </Card>
  <Card title="Data downloading">
    <DataDownloading />
  </Card>
  <Card title="Data with Tidy.js">
    <DataWithTidy />
  </Card>
  <Card title="Dates with Date-fns.js">
    <DatesWithDateFNS />
  </Card>
  <Card title="Math with Math.js">
    <Math />
  </Card>
  <Card title="Geometry with Flatten.js">
    <GeometryWithFlatten />
  </Card>
  <Card title="Colors with Chroma.js">
    <ColorsWithChroma />
  </Card>
  <Card title="Feather icons">
    <SVGIcons />
  </Card>
  <Card title="SVG with Textures.js">
    <SVGTextures />
  </Card>
  <Card title="SVG downloading">
    <SVGDownloading />
  </Card>
  <Card title="Markdown">
    <Markdown />
  </Card>
  <Card title="Component in view">
    <ComponentInView />
  </Card>
  <Card title="Component click outside">
    <ComponentClickOutside />
  </Card>
</markup>
