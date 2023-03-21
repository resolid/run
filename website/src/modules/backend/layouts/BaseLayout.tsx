import { A, Outlet } from '@resolid/run';

const BaseLayout = () => {
  return (
    <div>
      <h3>Admin Layout</h3>
      <ul>
        <li>
          <A href={'/admin'}>Admin Home</A>
        </li>
        <li>
          <A href={'/admin/about'}>Admin About</A>
        </li>
      </ul>
      <Outlet />
    </div>
  );
};

export default BaseLayout;
