/**
 * Call callback when user clicks outside a given element
 *
 * Usage:
 * <div use:clickOutside={{ enabled: open, callback: () => open = false }}>
 *
 * Demo: https://svelte.dev/repl/dae848c2157e48ab932106779960f5d5?version=3.19.2
 */
export default function clickOutside(node, params) {
  const { enabled: initialEnabled, callback } = params;

  const handleOutsideClick = ({ target }) => {
    if (!node.contains(target)) callback(node);
  };

  function update({ enabled }) {
    if (enabled) {
      window.addEventListener('click', handleOutsideClick);
    } else {
      window.removeEventListener('click', handleOutsideClick);
    }
  }
  update({ enabled: initialEnabled });
  return {
    update,
    destroy() {
      window.removeEventListener('click', handleOutsideClick);
    },
  };
}
