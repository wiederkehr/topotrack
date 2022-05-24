<script>
  import { parse, format, sub, add } from 'date-fns';
</script>

<markup>
  <code>
    // parse<br />
    {parse('31.12.1999', 'dd.MM.yyyy', new Date())}<br />
    <br />
    // display<br />
    {format(new Date(), 'dd MMMM yyyy')}<br />
    <br />
    // manipulate<br />
    {add(sub(new Date(), { years: 1 }), { day: 1 })}<br />
  </code>
</markup>
