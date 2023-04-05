import { A, Outlet } from '@resolid/run';
import ResolidBanner from '~/assets/images/resolid-banner.svg';
import { createSignal, For } from 'solid-js';
import { Github } from '~/common/icons/Github';
import { System } from '~/common/icons/System';
import { Menu } from '~/common/icons/Menu';
import { Close } from '~/common/icons/Close';
import { cx } from '@resolid/utils';

const Header = () => {
  const [opened, setOpened] = createSignal(false);

  return (
    <header class={'fixed inset-x-0 z-20 w-full border-b bg-white/75 backdrop-blur'}>
      <nav class={'desktop:max-w-7xl mx-auto flex h-16 items-center justify-between px-4'}>
        <div class={'tablet:hidden flex flex-1'}>
          <button class={'p-2'} onClick={() => setOpened((prev) => !prev)}>
            {opened() ? <Close size={'sm'} /> : <Menu size={'sm'} />}
          </button>
        </div>
        <div class={'tablet:justify-between flex flex-1 items-center justify-center'}>
          <A href={'/'}>
            <img height={32} width={129} alt={'Resolid Nxt'} src={ResolidBanner} />
          </A>
        </div>
        <div class={'flex flex-1 items-center justify-end gap-4'}>
          <div
            class={cx(
              'tablet:block tablet:relative tablet:top-0 tablet:h-auto absolute inset-x-0 top-[calc(4rem+1px)] z-20 h-screen bg-white p-0',
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
                fallback={<div>Loading...</div>}
              >
                {(link) => (
                  <li>
                    <A
                      end={link.end}
                      activeClass={'text-blue-600'}
                      inactiveClass={'text-gray-600'}
                      href={link.href}
                      onClick={() => setOpened(false)}
                      class="tablet:px-4 block p-2 hover:text-blue-500"
                    >
                      <span>{link.name}</span>
                    </A>
                  </li>
                )}
              </For>
            </ul>
          </div>
          <div class={'flex flex-row items-center gap-1'}>
            <button title={'Change Color Theme'} class={'p-2 text-gray-600 hover:text-blue-500'}>
              <System size={'sm'} />
            </button>
            <a
              class={'p-2 text-gray-600 hover:text-blue-500'}
              rel="noreferrer"
              target="_blank"
              href="https://github.com/resolid/nxt"
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
        <Outlet />
      </div>
    </>
  );
};

export default SiteLayout;
