import { type ComponentProps, createEffect, mergeProps, onCleanup, splitProps } from 'solid-js';

export type FormAction<Data> = {
  action: string;
  method: string;
  formData: Data;
  encType: string;
};

export { FormError } from './FormError';
export { FormImpl as Form };

type FormEncType = 'application/x-www-form-urlencoded' | 'multipart/form-data';

export interface SubmitOptions {
  method?: FormMethod;
  action?: string;
  encType?: FormEncType;
  replace?: boolean;
}

export type SubmitFunction = {
  (
    target:
      | HTMLFormElement
      | HTMLButtonElement
      | HTMLInputElement
      | FormData
      | URLSearchParams
      | { [name: string]: string }
      | null,

    options?: SubmitOptions
  ): void;
};

export type FormMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export type FormProps = Omit<ComponentProps<'form'>, 'method' | 'onSubmit'> & {
  method?: FormMethod;
  action?: string;
  reloadDocument?: boolean;
  replace?: boolean;
  onSubmit?: (event: SubmitEvent) => void;
  onSubmission?: (submission: FormAction<FormData>) => void;
};

type FormImplProps = FormProps & {
  onSubmission?: (submission: FormAction<FormData>) => void;
};

export const FormImpl = (_props: FormImplProps) => {
  const [props, rest] = splitProps(
    // eslint-disable-next-line solid/reactivity
    mergeProps(
      {
        reloadDocument: false,
        replace: false,
        method: 'post' as FormMethod,
        action: '/',
        encType: 'application/x-www-form-urlencoded' as FormEncType,
      },
      _props
    ),
    ['reloadDocument', 'replace', 'method', 'action', 'encType', 'onSubmission', 'onSubmit', 'children', 'ref']
  );
  const submit = useSubmitImpl((submission) => {
    props.onSubmission && props.onSubmission(submission);
  });

  // eslint-disable-next-line solid/reactivity
  const formMethod: FormMethod = props.method.toLowerCase() === 'get' ? 'get' : 'post';

  let clickedButtonRef: HTMLButtonElement | HTMLInputElement | null = null;
  let form: HTMLFormElement | null = null;

  createEffect(() => {
    if (!form) return;

    function handleClick(event: MouseEvent) {
      if (!(event.target instanceof HTMLElement || event.target instanceof SVGElement)) {
        return;
      }

      const submitButton = event.target.closest<HTMLButtonElement | HTMLInputElement>('button,input[type=submit]');

      if (submitButton && submitButton.type === 'submit') {
        clickedButtonRef = submitButton;
      }
    }

    form.addEventListener('click', handleClick);

    onCleanup(() => {
      form && form.removeEventListener('click', handleClick);
    });
    // eslint-disable-next-line solid/no-react-deps
  }, []);
  return (
    <form
      ref={(f) => {
        form = f;
        if (typeof props.ref === 'function') props.ref(f);
      }}
      method={formMethod}
      action={_props.action}
      enctype={props.encType}
      onSubmit={
        // eslint-disable-next-line solid/reactivity
        props.reloadDocument
          ? undefined
          : // eslint-disable-next-line solid/reactivity
            (event) => {
              props.onSubmit && props.onSubmit(event);
              if (event.defaultPrevented) {
                return;
              }

              event.preventDefault();
              submit(clickedButtonRef || event.currentTarget, {
                method: props.method,
                replace: props.replace,
              });
              clickedButtonRef = null;
            }
      }
      {...rest}
    >
      {props.children}
    </form>
  );
};

export interface SubmitOptions {
  method?: FormMethod;
  action?: string;
  replace?: boolean;
}

export function useSubmitImpl(onSubmission: (sub: FormAction<FormData>) => void): SubmitFunction {
  return (target, options = {}) => {
    let method: string;
    let action: string;
    let encType: string;
    let formData: FormData;

    if (isFormElement(target)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const submissionTrigger: HTMLButtonElement | HTMLInputElement = (options as any).submissionTrigger;

      method = options.method || target.method;
      action = options.action || target.action;
      encType = options.encType || target.enctype;
      formData = new FormData(target);

      if (submissionTrigger && submissionTrigger.name) {
        formData.append(submissionTrigger.name, submissionTrigger.value);
      }
    } else if (
      isButtonElement(target) ||
      (isInputElement(target) && (target.type === 'submit' || target.type === 'image'))
    ) {
      const form = target.form;

      if (form == null) {
        throw new Error(`Cannot submit a <button> without a <form>`);
      }

      method = options.method || target.getAttribute('formmethod') || form.method;
      action = options.action || target.getAttribute('formaction') || form.action;
      encType = options.encType || target.getAttribute('formenctype') || form.enctype;

      formData = new FormData(form);

      // Include name + value from a <button>
      if (target.name) {
        formData.set(target.name, target.value);
      }
    } else {
      if (isHtmlElement(target)) {
        // noinspection HtmlWrongAttributeValue
        throw new Error(`Cannot submit element that is not <form>, <button>, or ` + `<input type="submit|image">`);
      }

      method = options.method || 'get';
      action = options.action || '/';
      encType = options.encType || 'application/x-www-form-urlencoded';

      if (target instanceof FormData) {
        formData = target;
      } else {
        formData = new FormData();

        if (target instanceof URLSearchParams) {
          for (const [name, value] of target) {
            formData.append(name, value);
          }
        } else if (target != null) {
          for (const name of Object.keys(target)) {
            formData.append(name, target[name]);
          }
        }
      }
    }

    const { protocol, host } = window.location;
    const url = new URL(isButtonElement(action) ? '/' : action, `${protocol}//${host}`);

    if (method.toLowerCase() === 'get') {
      for (const [name, value] of formData) {
        if (typeof value === 'string') {
          url.searchParams.append(name, value);
        } else {
          throw new Error(`Cannot submit binary form data using GET`);
        }
      }
    }

    const submission: FormAction<FormData> = {
      formData,
      action: url.pathname + url.search,
      method: method.toUpperCase(),
      encType,
    };

    onSubmission(submission);
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isHtmlElement = (object: any): object is HTMLElement => object != null && typeof object.tagName === 'string';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isButtonElement = (object: any): object is HTMLButtonElement =>
  isHtmlElement(object) && object.tagName.toLowerCase() === 'button';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isFormElement = (object: any): object is HTMLFormElement =>
  isHtmlElement(object) && object.tagName.toLowerCase() === 'form';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isInputElement = (object: any): object is HTMLInputElement =>
  isHtmlElement(object) && object.tagName.toLowerCase() === 'input';
