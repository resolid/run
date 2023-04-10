import { cx } from '@resolid/utils';
import { For, createEffect, createSignal, onCleanup, type Accessor } from 'solid-js';

export type TocItem = {
  depth: number;
  text: string;
  slug: string;
};

const getHeadingsFromToc = (toc: TocItem[]) => {
  return toc.map(({ slug }) => {
    const el = document.getElementById(slug);

    if (!el) {
      return;
    }

    const style = window.getComputedStyle(el);

    const scrollMt = parseFloat(style.scrollMarginTop) + 1;

    const top = window.scrollY + el.getBoundingClientRect().top - scrollMt;

    return { slug, top };
  });
};

export const TocSection = (props: { toc: Accessor<TocItem[]> }) => {
  const [currentSection, setCurrentSection] = createSignal();

  const filterToc = () => props.toc().filter((item) => item.depth > 1 && item.depth <= 3);

  createEffect(() => {
    const toc = filterToc();

    if (toc.length === 0) {
      return;
    }

    const headings = getHeadingsFromToc(toc);

    const onScroll = () => {
      const top = window.scrollY;

      let current = headings[0]?.slug;

      for (const heading of headings) {
        if (heading == null) {
          continue;
        }

        if (top >= heading.top) {
          current = heading.slug;
        } else {
          break;
        }
      }

      setCurrentSection(current);
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    onScroll();

    onCleanup(() => {
      // @ts-expect-error No overload matches this call.
      window.removeEventListener('scroll', onScroll, { passive: true });
    });
  });

  return (
    <ul class={'sticky top-20 space-y-1 border-l'}>
      <For each={filterToc()}>
        {(item) => (
          <li>
            <a
              class={cx(
                '-ml-px block border-l py-1',
                item.depth == 2 ? 'pl-4' : 'pl-8',
                item.slug == currentSection()
                  ? 'border-l-blue-300 text-link'
                  : 'hover:border-l-gray-300 hover:text-fg-muted'
              )}
              href={'#' + item.slug}
            >
              {item.text}
            </a>
          </li>
        )}
      </For>
    </ul>
  );
};
