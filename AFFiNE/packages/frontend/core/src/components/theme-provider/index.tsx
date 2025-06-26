import { AppThemeService } from '@affine/core/modules/theme';
import { useService } from '@toeverything/infra';
import { ThemeProvider as NextThemeProvider, useTheme } from 'next-themes';
import type { PropsWithChildren } from 'react';
import { useEffect } from 'react';
// import ./index.css;
import { useTenant } from '../context/tenant-context';

const themes = ['dark', 'light','tangerine', 'mint','dark-mint', 'dark-tangerine'];

function ThemeObserver() {
  const { resolvedTheme,setTheme } = useTheme();
  const service = useService(AppThemeService);
  const tenant = useTenant();

  useEffect(() => {
    service.appTheme.theme$.next(resolvedTheme);
    if(tenant?.tenant?.theme) {
      setTheme(tenant.tenant.theme);
      console.log('Applied theme:', tenant?.tenant?.theme);
    }
  }, [resolvedTheme, service.appTheme.theme$,tenant]);

  return null;
}

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  return (
    <NextThemeProvider themes={themes} enableSystem={true}>
      {children}
      <ThemeObserver />
    </NextThemeProvider>
  );
};
