import { A, Outlet } from '@resolid/run';
import ResolidBanner from '~/assets/images/resolid-banner.svg';
import { For } from 'solid-js';
import { Github } from '~/core/icons/Github';
import { System } from '~/core/icons/System';

const SiteLayout = () => {
  return (
    <>
      <header class={'fixed z-10 w-full inset-x-0 border-b border-gray-100 bg-white/80 backdrop-blur'}>
        <nav class={'mx-auto p-4 desktop:max-w-7xl flex items-center justify-between'}>
          <div class={'flex flex-row items-center'}>
            <A href={'/'}>
              <img height={32} width={129} alt={'Resolid Run'} src={ResolidBanner} />
            </A>
          </div>
          <div class={'flex flex-row items-center gap-4'}>
            <div class={'invisible absolute top-full left-0 z-20 w-full laptop:(visible relative)'}>
              <ul class="space-y-6 font-medium tracking-wide laptop:(flex space-y-0)">
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
                        class="hover:text-blue-500 tablet:px-4"
                      >
                        <span>{link.name}</span>
                      </A>
                    </li>
                  )}
                </For>
              </ul>
            </div>
            <div class={'flex flex-row items-center gap-4'}>
              <button class={'text-gray-600 hover:(text-blue-500)'}>
                <System class={'h-5 w-5'} />
              </button>
              <a
                class={'text-gray-600 hover:(text-blue-500)'}
                rel="noreferrer"
                target="_blank"
                href="https://github.com/resolid/run"
              >
                <Github class={'h-5 w-5'} />
              </a>
            </div>
          </div>
        </nav>
      </header>
      <div class={'pt-16 mx-auto desktop:max-w-7xl'}>
        <Outlet />
      </div>
    </>
  );
};

export default SiteLayout;
