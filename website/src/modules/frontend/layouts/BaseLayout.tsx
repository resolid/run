import { A, Outlet } from '@resolid/run';
import ResolidBanner from '../../../assets/images/resolid-banner.svg';
import { cx } from '@resolid/twind';

const BaseLayout = () => {
  return (
    <>
      <header>
        <nav class={'fixed inset-x-0 z-20 w-full border-b border-gray-100 bg-white/80 backdrop-blur'}>
          <div class={'mx-auto px-4 mobile:px-12 desktop:px-0 desktop:max-w-6xl'}>
            <div class={'relative flex flex-wrap items-center justify-between gap-6 desktop:gap-0 desktop:py-4'}>
              <div class={'relative z-20 flex w-full justify-between tablet:px-0 desktop:w-max'}>
                <A href={'/'}>
                  <img class={'h-8 w-auto'} height="32" width="129" alt={'Resolid Run'} src={ResolidBanner} />
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
                    <li>
                      <A href={'/solution'} class="block no-underline transition hover:text-blue-500 tablet:px-4">
                        <span>Solution</span>
                      </A>
                    </li>
                    <li>
                      <A href={'/customers'} class="block no-underline transition hover:text-blue-500 tablet:px-4">
                        <span>Customers</span>
                      </A>
                    </li>
                    <li>
                      <A href={'/pricing'} class="block no-underline transition hover:text-blue-500 tablet:px-4">
                        <span>Pricing</span>
                      </A>
                    </li>
                    <li>
                      <A href={'/blog'} class="block no-underline transition hover:text-blue-500 tablet:px-4">
                        <span>Blog</span>
                      </A>
                    </li>
                    <li>
                      <A href={'/about'} class="block no-underline transition hover:text-blue-500 tablet:px-4">
                        <span>About</span>
                      </A>
                    </li>
                  </ul>
                </div>
                <div />
              </div>
            </div>
          </div>
        </nav>
      </header>
      <section class={'pt-20'}>
        <div class={'mx-auto px-4 mobile:px-12 laptop:max-w-6xl laptop:px-0'}>
          <Outlet />
        </div>
      </section>
    </>
  );
};

export default BaseLayout;
