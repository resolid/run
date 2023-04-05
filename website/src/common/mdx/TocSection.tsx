import { type Accessor, createEffect, createSignal, For, onCleanup } from 'solid-js';
import { cx } from '@resolid/utils';
import { useLocation } from '@resolid/run';

type TocItem = {
  depth: number;
  text: string;
  slug: string;
};

export type GetMdxPath = (pathname: string) => string;

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

  return currentSection;
};

export const TocSection = (props: { getMdxPath: GetMdxPath }) => {
  const location = useLocation();

  const [toc, setToc] = createSignal<TocItem[]>([]);

  createEffect(() => {
    const paths = props.getMdxPath(location.pathname).split('/');

    (async () => {
      try {
        const { getHeadings } =
          paths.length == 5
            ? await import(`../../modules/${paths[0]}/${paths[1]}/${paths[2]}/${paths[3]}/${paths[4]}.mdx`)
            : paths.length == 4
            ? await import(`../../modules/${paths[0]}/${paths[1]}/${paths[2]}/${paths[3]}.mdx`)
            : paths.length == 3
            ? await import(`../../modules/${paths[0]}/${paths[1]}/${paths[2]}.mdx`)
            : paths.length == 2
            ? await import(`../../modules/${paths[0]}/${paths[1]}.mdx`)
            : await import(`../../modules/${paths[0]}.mdx`);

        const headings = (getHeadings() as TocItem[]).filter((h) => h.depth > 1 && h.depth <= 3);

        setToc(headings);
      } catch (ex) {
        setToc([]);
      }
    })();
  });

  const currentSection = useCurrentSection(toc);

  return (
    <ul class={'sticky top-20 space-y-1 border-l border-gray-200'}>
      <For each={toc()}>
        {(item) => (
          <li>
            <a
              class={cx(
                '-ml-px block border-l py-1',
                item.depth == 2 ? 'pl-4' : 'pl-8',
                item.slug == currentSection()
                  ? 'border-l-blue-300 text-blue-600'
                  : 'text-gray-600 hover:border-l-gray-300 hover:text-gray-700'
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
