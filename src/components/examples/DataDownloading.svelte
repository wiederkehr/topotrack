<script>
  import Button from '$components/interface/Button.svelte';
  import { downloadCSV, downloadJSON } from '$functions/download';
  import data from '$data/womens-hockey-teams-gamescores.csv';
  import { groupBy } from 'lodash';
  const csv = data;
  const json = groupBy(data, 'NAT');
</script>

<markup>
  <Button on:click={() => downloadCSV(csv)}>Download CSV</Button>
  <Button on:click={() => downloadJSON(json)}>Download JSON</Button>
</markup>
