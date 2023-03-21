import {
  createEffect,
  ErrorBoundary as ErrorBoundaryBase,
  type JSX,
  type ParentProps,
  resetErrorBoundaries,
  Show,
} from 'solid-js';

const ErrorMessage = (props: { error: Error }) => {
  createEffect(() => console.error(props.error));

  return (
    <div style={{ padding: '16px' }}>
      <div
        style={{
          'background-color': 'rgba(252, 165, 165)',
          color: 'rgb(153, 27, 27)',
          'border-radius': '5px',
          overflow: 'scroll',
          padding: '16px',
          'margin-bottom': '8px',
        }}
      >
        <p style={{ 'font-weight': 'bold' }} id="error-message">
          {props.error.message}
        </p>
        <button
          id="reset-errors"
          onClick={resetErrorBoundaries}
          style={{
            color: 'rgba(252, 165, 165)',
            'background-color': 'rgb(153, 27, 27)',
            'border-radius': '5px',
            padding: '4px 8px',
          }}
        >
          Clear errors and retry
        </button>
        <pre style={{ 'margin-top': '8px', width: '100%' }}>{props.error.stack}</pre>
      </div>
    </div>
  );
};

// noinspection JSUnusedGlobalSymbols
export const ErrorBoundary = (props: ParentProps<{ fallback?: (e: Error, reset: () => void) => JSX.Element }>) => {
  return (
    <ErrorBoundaryBase
      fallback={(e, reset) => {
        return (
          <Show when={!props.fallback} fallback={props.fallback && props.fallback(e, reset)} keyed>
            <ErrorMessage error={e} />
          </Show>
        );
      }}
    >
      {props.children}
    </ErrorBoundaryBase>
  );
};
