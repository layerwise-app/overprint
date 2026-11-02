import { useSyncExternalStore } from 'react';

export const VIEW_KEY = 'overprint:view';

/** Runs before first paint so a saved choice never flashes the wrong view. */
export const VIEW_BOOT_SCRIPT = `try{var v=localStorage.getItem('${VIEW_KEY}');if(v==='list'||v==='canvas')document.documentElement.dataset.homeView=v}catch(e){}`;

type View = 'canvas' | 'list';

function currentView(): View {
  const chosen = document.documentElement.dataset.homeView;
  if (chosen === 'list' || chosen === 'canvas') return chosen;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ? 'list'
    : 'canvas';
}

function subscribe(onChange: () => void) {
  window.addEventListener('overprint:view', onChange);
  return () => window.removeEventListener('overprint:view', onChange);
}

/** Switches Home between the canvas (a collage on phones) and the plain index. */
export function ViewSwitch() {
  const view = useSyncExternalStore<View>(subscribe, currentView, () => 'canvas');

  const choose = (next: View) => {
    document.documentElement.dataset.homeView = next;
    try {
      localStorage.setItem(VIEW_KEY, next);
    } catch {
      // Private browsing: the choice just lasts until the page reloads.
    }
    window.dispatchEvent(new CustomEvent('overprint:view'));
  };

  return (
    <fieldset className='view-switch'>
      <legend className='sr-only'>View work as</legend>
      <button
        type='button'
        aria-pressed={view === 'canvas'}
        onClick={() => choose('canvas')}
      >
        <span className='only-wide'>Canvas</span>
        <span className='only-narrow'>Collage</span>
      </button>
      <button
        type='button'
        aria-pressed={view === 'list'}
        onClick={() => choose('list')}
      >
        List
      </button>
    </fieldset>
  );
}
