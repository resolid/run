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
          'background-color': '#FABBB4',
          color: '#A1160A',
          'border-radius': '5px',
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
            color: '#FADCD9',
            'background-color': '#A1160A',
            'border-radius': '5px',
            padding: '5px 10px',
          }}
        >
          Clear errors and retry
        </button>
        <pre style={{ 'margin-top': '8px', width: '100%', 'white-space': 'pre-line' }}>{props.error.stack}</pre>
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
