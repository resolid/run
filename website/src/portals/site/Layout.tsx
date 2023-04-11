import { A, Outlet } from '@resolid/run';
import { useColorMode } from '@resolid/ui';
import { cx } from '@resolid/utils';
import { For, Show, Suspense, createSignal } from 'solid-js';
import ResolidBannerDark from '~/assets/images/resolid-banner-dark.svg';
import ResolidBanner from '~/assets/images/resolid-banner.svg';
import { ThemeSwitcher } from '~/common/components/ThemeSwitcher';
import { Close } from '~/common/icons/Close';
import { Github } from '~/common/icons/Github';
import { Menu } from '~/common/icons/Menu';

const Banner = () => {
  const { darkMode } = useColorMode();

  return (
    <Show when={darkMode()} fallback={<img height={32} width={129} alt={'Resolid Run'} src={ResolidBanner} />}>
      <img height={32} width={129} alt={'Resolid Run'} src={ResolidBannerDark} />
    </Show>
  );
};

const Header = () => {
  const [opened, setOpened] = createSignal(false);

  return (
    <header class={'bg-bg-default/75 fixed inset-x-0 z-20 w-full border-b backdrop-blur'}>
      <nav class={'desktop:max-w-7xl mx-auto flex h-16 items-center justify-between px-4'}>
        <div class={'tablet:hidden flex flex-1'}>
          <button
            title={opened() ? 'Close Menu' : 'Open Menu'}
            class={'p-2'}
            onClick={() => setOpened((prev) => !prev)}
          >
            {opened() ? <Close size={'sm'} /> : <Menu size={'sm'} />}
          </button>
        </div>
        <div class={'tablet:justify-between flex flex-1 items-center justify-center'}>
          <A href={'/'}>
            <Banner />
          </A>
        </div>
        <div class={'flex flex-1 items-center justify-end gap-4'}>
          <div
            class={cx(
              'tablet:block tablet:relative tablet:top-0 tablet:h-auto tablet:bg-inherit bg-bg-default absolute inset-x-0 top-[calc(4rem+1px)] z-20 h-screen p-0',
              opened() ? 'block' : 'hidden'
            )}
          >
            <ul class="tablet:flex-row tablet:max-w-none tablet:p-0 mx-auto flex max-w-xs flex-col p-4 font-medium tracking-wide">
              <For
                each={[
                  { name: 'Home', href: '/', end: true },
                  { name: 'Docs', href: '/docs' },
                  { name: 'UI', href: '/ui' },
                  { name: 'Forum', href: '/forum' },
                  { name: 'Blog', href: '/blog' },
                  { name: 'About', href: '/about' },
                ]}
              >
                {(link) => (
                  <li>
                    <A
                      end={link.end}
                      activeClass={'text-link'}
                      inactiveClass={''}
                      href={link.href}
                      onClick={() => setOpened(false)}
                      class="tablet:px-4 block p-2 hover:text-link-pressed"
                    >
                      <span>{link.name}</span>
                    </A>
                  </li>
                )}
              </For>
            </ul>
          </div>
          <div class={'flex flex-row items-center gap-1'}>
            <ThemeSwitcher />
            <a
              class={'p-2 hover:text-blue-500'}
              rel="noreferrer"
              target="_blank"
              href="https://github.com/resolid/run"
              title={'Go to Resolid Run on Github'}
            >
              <Github size={'sm'} />
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
};

const SiteLayout = () => {
  return (
    <>
      <Header />
      <div class={'desktop:max-w-7xl mx-auto pt-16'}>
        <Suspense>
          <Outlet />
        </Suspense>
      </div>
    </>
  );
};

export default SiteLayout;
