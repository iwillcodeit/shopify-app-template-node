import * as AppBridge from "@shopify/app-bridge-react";

function makeHookClientOnly<HookType extends Function = Function>(
  hook: HookType
): HookType | ((...args: any[]) => null) {
  if (import.meta.env.SSR) {
    return () => null;
  }

  return hook;
}

function makeComponentClientOnly<ComponentType = any>(
  Component: ComponentType
): ComponentType {
  if (import.meta.env.SSR) {
    return (() => null) as ComponentType;
  }

  return Component;
}
export type {
  History,
  ContextualSaveBarProps,
  ToastProps,
  FeaturesAvailable,
  ProviderProps,
  ModalProps,
  LocationOrHref,
  NavigationMenuProps,
  ResourcePickerProps,
} from "@shopify/app-bridge-react";

export {
  // TitleBar,
  // Modal,
  // ContextualSaveBar,
  // Toast,
  // ClientRouter,
  // Loading,
  // ModalContent,
  // NavigationMenu,
  // Provider,
  // ResourcePicker,
  // RoutePropagator,
  // unstable_Picker
  // useAuthenticatedFetch,
  // useToast,
  // useLocale,
  // useNavigate,
  // useFeaturesAvailable,
  // useNavigationHistory,
  // useAppBridge,
  // useAppBridgeState,
  // useClientRouting,
  // useRoutePropagation,
  // useContextualSaveBar,
  // useFeatureRequest,
  Context,
} from "@shopify/app-bridge-react";

// Components

export const TitleBar = makeComponentClientOnly(AppBridge.TitleBar);
export const Modal = makeComponentClientOnly(AppBridge.Modal);
export const ContextualSaveBar = makeComponentClientOnly(
  AppBridge.ContextualSaveBar
);
export const Toast = makeComponentClientOnly(AppBridge.Toast);
export const ClientRouter = makeComponentClientOnly(AppBridge.ClientRouter);
export const Loading = makeComponentClientOnly(AppBridge.Loading);
export const ModalContent = makeComponentClientOnly(AppBridge.ModalContent);
export const NavigationMenu = makeComponentClientOnly(AppBridge.NavigationMenu);
export const Provider = makeComponentClientOnly(AppBridge.Provider);
export const ResourcePicker = makeComponentClientOnly(AppBridge.ResourcePicker);
export const RoutePropagator = makeComponentClientOnly(
  AppBridge.RoutePropagator
);
export const unstable_Picker = makeComponentClientOnly(
  AppBridge.unstable_Picker
);

// Hooks

export const useAuthenticatedFetch = makeHookClientOnly(
  AppBridge.useAuthenticatedFetch
);
export const useToast = makeHookClientOnly(AppBridge.useToast);
export const useLocale = makeHookClientOnly(AppBridge.useLocale);
export const useNavigate = makeHookClientOnly(AppBridge.useNavigate);
export const useFeaturesAvailable = makeHookClientOnly(
  AppBridge.useFeaturesAvailable
);
export const useNavigationHistory = makeHookClientOnly(
  AppBridge.useNavigationHistory
);
export const useAppBridge = makeHookClientOnly(AppBridge.useAppBridge);
export const useAppBridgeState = makeHookClientOnly(
  AppBridge.useAppBridgeState
);
export const useClientRouting = makeHookClientOnly(AppBridge.useClientRouting);
export const useRoutePropagation = makeHookClientOnly(
  AppBridge.useRoutePropagation
);
export const useContextualSaveBar = makeHookClientOnly(
  AppBridge.useContextualSaveBar
);
export const useFeatureRequest = makeHookClientOnly(
  AppBridge.useFeatureRequest
);
