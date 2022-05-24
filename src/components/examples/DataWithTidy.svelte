<script>
  import {
    tidy,
    max,
    min,
    mean,
    median,
    summarize,
    distinct,
    map,
    mutate,
  } from '@tidyjs/tidy';
  import data from '$data/womens-hockey-teams-gamescores.csv';

  const teams = tidy(
    data,
    distinct(['NAT']),
    map(d => d.NAT)
  );
  const stats = tidy(
    data,
    mutate({
      GS: d => parseFloat(d.GS),
    }),
    summarize({
      max: max('GS'),
      min: min('GS'),
      mean: mean('GS'),
      median: median('GS'),
    })
  )[0];
</script>

<markup>
  <code>
    Teams: {teams}<br />
    Score Max: {stats.max}<br />
    Score Min: {stats.min}<br />
    Score Mean: {stats.mean}<br />
    Score Median: {stats.median}<br />
  </code>
</markup>
