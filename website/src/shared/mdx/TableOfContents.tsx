import { createRouteData } from '@resolid/run';
import { server$ } from '@resolid/run/server';
import { type Accessor, createEffect, createSignal, For, onCleanup } from 'solid-js';
import { cx } from '@resolid/twind';

type TocItem = {
  depth: number;
  text: string;
  slug: string;
};

const getHeadingsFromToc = (tableOfContents: TocItem[]) => {
  return tableOfContents.map(({ slug }) => {
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

const useCurrentSection = (tableOfContents: Accessor<TocItem[] | undefined>) => {
  const [currentSection, setCurrentSection] = createSignal(tableOfContents()?.[0]?.slug);

  createEffect(() => {
    const toc = tableOfContents();

    if (toc == null || toc.length === 0) {
      return;
    }

    const headings = getHeadingsFromToc(toc);

    function onScroll() {
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
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    onScroll();

    onCleanup(() => {
      // @ts-expect-error No overload matches this call.
      window.removeEventListener('scroll', onScroll, { passive: true });
    });
  });

  return currentSection;
};

export const TableOfContents = (props: { module: string; path: string }) => {
  const toc = createRouteData(
    server$(async (payload) => {
      const paths = payload[1].split('/');

      try {
        const { getHeadings } =
          paths.length == 3
            ? await import(`../../modules/${payload[0]}/${paths[0]}/${paths[1]}/${paths[2]}.mdx`)
            : paths.length == 2
            ? await import(`../../modules/${payload[0]}/${paths[0]}/${paths[1]}.mdx`)
            : await import(`../../modules/${payload[0]}/${paths[0]}.mdx`);

        return (getHeadings() as TocItem[]).filter((h) => h.depth > 1 && h.depth <= 3);
      } catch (ex) {
        return [];
      }
    }),
    {
      key: () => [props.module, props.path],
    }
  );

  const currentSection = useCurrentSection(toc);

  return (
    <ul class={'space-y-1 border-l border-gray-200 sticky top-20'}>
      <For each={toc()}>
        {(item) => (
          <li>
            <a
              class={cx(
                '-ml-px block pl-4 py-1 border-l',
                item.slug == currentSection()
                  ? 'border-l-blue-300 text-blue-500'
                  : 'hover:(border-l-gray-300 text-gray-700) border-l-transparent text-gray-500'
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
