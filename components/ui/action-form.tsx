"use client";

import { startTransition, type ComponentProps } from "react";

/**
 * <form> for a useActionState dispatcher that does NOT auto-reset its fields.
 * React resets uncontrolled inputs after every `action` submission, which loses
 * the user's input on validation errors and shows stale defaults after an edit.
 *
 * `action` is also passed to the <form> so that a submit before hydration still
 * POSTs to the server action (never a GET that would put fields in the URL).
 * Once hydrated, onSubmit takes over and React skips its own handling because
 * the event is default-prevented.
 */
export function ActionForm({ action, ...props }: Omit<ComponentProps<"form">, "action" | "onSubmit"> & { action: (fd: FormData) => void }) {
  return (
    <form
      {...props}
      action={action}
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget, (e.nativeEvent as SubmitEvent).submitter);
        startTransition(() => action(fd));
      }}
    />
  );
}
