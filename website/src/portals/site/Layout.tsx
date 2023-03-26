import { A, Outlet } from '@resolid/run';
import ResolidBanner from '~/assets/images/resolid-banner.svg';
import { cx } from '@resolid/twind';
import { For } from 'solid-js';
import { Github } from '~/core/icons/Github';
import { System } from '~/core/icons/System';

const SiteLayout = () => {
  return (
    <>
      <header>
        <nav class={'fixed inset-x-0 z-20 w-full border-b border-gray-100 bg-white/80 backdrop-blur'}>
          <div class={'mx-auto px-4 mobile:px-12 desktop:px-0 desktop:max-w-6xl'}>
            <div class={'relative flex flex-wrap items-center justify-between gap-6 desktop:gap-0 desktop:py-4'}>
              <div class={'relative z-20 flex w-full justify-between tablet:px-0 desktop:w-max'}>
                <A href={'/'}>
                  <img height={32} width={129} alt={'Resolid Run'} src={ResolidBanner} />
                </A>
              </div>
              <div
                class={cx(
                  'invisible absolute top-full left-0 z-20 origin-top-right translate-y-1 scale-90',
                  'flex-col flex-wrap justify-end gap-6',
                  'desktop:visible desktop:relative desktop:flex desktop:w-auto desktop:translate-y-0 desktop:scale-100 desktop:flex-row',
                  'desktop:items-center desktop:gap-0 desktop:p-0 desktop:opacity-100'
                )}
              >
                <div class={'text-gray-600 laptop:pr-4'}>
                  <ul class="list-none m-0 space-y-6 text-base font-medium tracking-wide laptop:flex laptop:space-y-0">
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
                            href={link.href}
                            class="block no-underline transition hover:text-blue-500 tablet:px-4"
                          >
                            <span>{link.name}</span>
                          </A>
                        </li>
                      )}
                    </For>
                  </ul>
                </div>
                <div class={'block flex gap-3'}>
                  <button class={'block text-gray-500 hover:(text-gray-600)'}>
                    <System class={'h-5 w-5'} />
                  </button>
                  <a
                    class={'block text-gray-500 hover:(text-gray-600)'}
                    rel="noreferrer"
                    target="_blank"
                    href="https://github.com/resolid/run"
                  >
                    <Github class={'h-5 w-5'} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
      <div class={'pt-16'}>
        <div class={'mx-auto px-4 mobile:px-12 laptop:max-w-6xl laptop:px-0'}>
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default SiteLayout;
