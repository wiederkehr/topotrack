<script>
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { forEach, trim } from 'lodash';
  import { getParameter, setParameter } from '$functions/urlParameters.js';

  export let stores = [];

  const storesToUrl = () => {
    if (stores.length > 0) {
      forEach(stores, store => {
        switch (store.type) {
          case 'collection':
            setParameter(store.key, JSON.stringify(get(store.value)));
            break;
          case 'array':
            setParameter(store.key, get(store.value).join(','));
            break;
          case 'boolean':
            setParameter(store.key, get(store.value));
            break;
          case 'number':
            setParameter(store.key, get(store.value));
            break;
          case 'string':
            setParameter(store.key, get(store.value));
            break;
          default:
            setParameter(store.key, get(store.value));
            break;
        }
      });
    }
  };

  const urlToStores = () => {
    if (stores.length > 0) {
      forEach(stores, store => {
        const value = getParameter(store.key);
        if (value === null) return;
        switch (store.type) {
          case 'collection':
            store.value.set(JSON.parse(decodeURI(value)));
            break;
          case 'array':
            store.value.set(trim(decodeURI(value)).split(','));
            break;
          case 'boolean':
            store.value.set(value === 'true');
            break;
          case 'number':
            store.value.set(+value);
            break;
          case 'string':
            store.value.set(decodeURI(value));
            break;
          default:
            store.value.set(decodeURI(value));
            break;
        }
      });
    }
  };

  const onHashChange = () => {
    urlToStores();
  };

  onMount(() => {
    urlToStores();
    stores.forEach(store => store.value.subscribe(storesToUrl));
  });
</script>

<svelte:window on:hashchange={onHashChange} />
