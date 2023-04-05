import { A, Outlet } from '@resolid/run';
import ResolidBanner from '~/assets/images/resolid-banner.svg';
import { createSignal, For, Show } from 'solid-js';
import { Github } from '~/common/icons/Github';
import { System } from '~/common/icons/System';
import { Menu } from '~/common/icons/Menu';
import { Close } from '~/common/icons/Close';
import { cx } from '@resolid/utils';

const SiteLayout = () => {
  const [collapsed, setCollapsed] = createSignal(true);

  return (
    <>
      <header class={'fixed inset-x-0 z-10 w-full border-b border-gray-100 bg-white/80 backdrop-blur'}>
        <nav class={'desktop:max-w-7xl mx-auto flex items-center justify-between p-4'}>
          <div class={'flex flex-row items-center'}>
            <A href={'/'}>
              <img height={32} width={129} alt={'Resolid Run'} src={ResolidBanner} />
            </A>
          </div>
          <div class={'flex flex-row items-center gap-4'}>
            <div
              class={cx(
                'fixed left-0 right-0 top-full z-20 h-screen w-full bg-white p-5',
                'transition-opacity duration-300',
                'laptop:opacity-100 laptop:relative laptop:p-0 laptop:h-auto laptop:block',
                collapsed() ? 'block' : 'hidden'
              )}
            >
              <ul class="laptop:flex laptop:space-y-0 laptop:max-w-none mx-auto max-w-[288px] space-y-5 font-medium tracking-wide">
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
                        onClick={() => setCollapsed(false)}
                        class="tablet:px-4 block hover:text-blue-500"
                      >
                        <span>{link.name}</span>
                      </A>
                    </li>
                  )}
                </For>
              </ul>
            </div>
            <div class={'flex flex-row items-center gap-4'}>
              <button class={'text-gray-600 hover:text-blue-500'}>
                <System size={'sm'} />
              </button>
              <a
                class={'text-gray-600 hover:text-blue-500'}
                rel="noreferrer"
                target="_blank"
                href="https://github.com/resolid/run"
              >
                <Github size={'sm'} />
              </a>
            </div>
            <button onClick={() => setCollapsed((prev) => !prev)} class={'laptop:hidden block'}>
              <Show when={!collapsed()} fallback={<Close class={'h-5 w-5'} />} keyed>
                <Menu class={'h-5 w-5'} />
              </Show>
            </button>
          </div>
        </nav>
      </header>
      <div class={'desktop:max-w-7xl mx-auto pt-16'}>
        <Outlet />
      </div>
    </>
  );
};

export default SiteLayout;
