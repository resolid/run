import { A, Outlet } from '@resolid/run';

const BaseLayout = () => {
  return (
    <div>
      <h3>Site Layout</h3>
      <ul>
        <li>
          <A href={'/'}>Site Home</A>
        </li>
        <li>
          <A href={'/about'}>Site About</A>
        </li>
      </ul>
      <Outlet />
    </div>
  );
};

export default BaseLayout;
