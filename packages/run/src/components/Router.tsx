import {
  A as BaseA,
  Outlet as BaseOutlet,
  Router as BaseRouter,
  Routes as BaseRoutes,
  useLocation as useBaseLocation,
  useNavigate as useBaseNavigate,
  type LinkProps,
} from '@solidjs/router';

// noinspection JSUnusedGlobalSymbols
const A = (props: LinkProps) => {
  return <BaseA activeClass={''} inactiveClass={''} {...props} />;
};

const Router = BaseRouter;

// noinspection JSUnusedGlobalSymbols
const Routes = BaseRoutes;

// noinspection JSUnusedGlobalSymbols
const Outlet = BaseOutlet;

// noinspection JSUnusedGlobalSymbols
const useLocation = useBaseLocation;

// noinspection JSUnusedGlobalSymbols
const useNavigate = useBaseNavigate;

export { A, Router, Outlet, Routes, useLocation, useNavigate };
