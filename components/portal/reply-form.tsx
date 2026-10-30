"use client";

import { useActionState, useEffect, useMemo, useRef } from "react";
import { Button, FormMessage, Textarea } from "@/components/ui/form";
import { replyToIssue } from "@/lib/actions/issues";
import { ActionForm } from "@/components/ui/action-form";

export function ReplyForm({ issueId, realm }: { issueId: string; realm: "customer" | "staff" }) {
  const reply = useMemo(() => replyToIssue.bind(null, realm), [realm]);
  const [state, action, pending] = useActionState(reply, null);
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok) form.current?.reset();
  }, [state]);
  return (
    <ActionForm action={action} className="space-y-3" ref={form}>
      <input name="issueId" type="hidden" value={issueId} />
      <label className="block text-sm font-semibold text-fg" htmlFor={`reply-${issueId}`}>
        Хариулт бичих
      </label>
      <Textarea id={`reply-${issueId}`} name="content" required rows={4} />
      {state && !state.ok && <FormMessage state={state} />}
      <div className="flex justify-end">
        <Button disabled={pending}>{pending ? "Илгээж байна…" : "Илгээх"}</Button>
      </div>
    </ActionForm>
  );
}
