import {
  A as BaseA,
  type LinkProps,
  Outlet as BaseOutlet,
  Router as BaseRouter,
  Routes as BaseRoutes,
  useLocation as useBaseLocation,
  useNavigate as useBaseNavigate,
} from '@solidjs/router';

const A = (props: LinkProps) => {
  return <BaseA activeClass={''} inactiveClass={''} {...props} />;
};

const Router = BaseRouter;

const Routes = BaseRoutes;

const Outlet = BaseOutlet;

const useLocation = useBaseLocation;

const useNavigate = useBaseNavigate;

export { A, Router, Outlet, Routes, useLocation, useNavigate };
