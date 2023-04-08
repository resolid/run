import { A, Outlet } from '@resolid/run';
import { Suspense } from 'solid-js';

const AdminLayout = () => {
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
      <Suspense>
        <Outlet />
      </Suspense>
    </div>
  );
};

export default AdminLayout;
