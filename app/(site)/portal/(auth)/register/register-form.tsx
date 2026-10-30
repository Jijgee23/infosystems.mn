"use client";

import { Fragment, useActionState, useRef, useState } from "react";
import { Lock } from "@/components/site/icons";
import { ActionForm } from "@/components/ui/action-form";
import {
  ErrorAlert,
  PasswordInput,
  useFieldErrors,
} from "@/components/ui/auth-fields";
import { Button, Field, FormMessage, Input } from "@/components/ui/form";
import { register } from "@/lib/actions/auth";
import {
  COMPANY_REGISTER,
  normalizePersonalRegister,
  PERSONAL_REGISTER,
} from "@/lib/register-number";

type CustomerType = "company" | "individual";
type Lookup =
  | { status: "idle" | "loading" | "notfound" }
  | { status: "found"; name: string }
  | { status: "error"; message: string };

export function RegisterForm() {
  const [state, action, pending] = useActionState(register, null);
  const { error, onEdit, attempt } = useFieldErrors(state);

  // Register numbers and the names they look up are controlled so the lookup can fill the name in.
  const [type, setType] = useState<CustomerType>(
    state?.values?.customerType === "individual" ? "individual" : "company",
  );
  const [regno, setRegno] = useState(state?.values?.companyRegister ?? "");
  const [companyName, setCompanyName] = useState(
    state?.values?.companyName ?? "",
  );
  const [personalRegister, setPersonalRegister] = useState(
    state?.values?.personalRegister ?? "",
  );
  const [personName, setPersonName] = useState(
    state?.values?.customerType === "individual"
      ? (state.values.username ?? "")
      : "",
  );
  const [lastValues, setLastValues] = useState(state?.values);
  if (state?.values !== lastValues) {
    // Restore what the server echoed back (covers a submit made before hydration).
    setLastValues(state?.values);
    if (state?.values) {
      const individual = state.values.customerType === "individual";
      setType(individual ? "individual" : "company");
      setRegno(state.values.companyRegister);
      setCompanyName(state.values.companyName);
      setPersonalRegister(state.values.personalRegister);
      if (individual) setPersonName(state.values.username);
    }
  }

  const [lookup, setLookup] = useState<Lookup>({ status: "idle" });
  const autoName = useRef(""); // last name the lookup filled in; replaced on the next lookup, unlike a typed one
  const pendingLookup = useRef<{
    timer?: ReturnType<typeof setTimeout>;
    abort?: AbortController;
  }>({});

  /**
   * Looks the register number up on ebarimt (debounced) and fills the name field,
   * unless the user typed a name of their own. `complete` is false while the number
   * is still being typed.
   */
  function lookUp(
    value: string,
    complete: boolean,
    name: string,
    setName: (update: (current: string) => string) => void,
    field: string,
  ) {
    // A name filled in for the previous number no longer applies.
    if (autoName.current && name === autoName.current) setName(() => "");
    autoName.current = "";
    clearTimeout(pendingLookup.current.timer);
    pendingLookup.current.abort?.abort();
    if (!complete) {
      setLookup({ status: "idle" });
      return;
    }
    setLookup({ status: "loading" });
    const abort = new AbortController();
    const failed = "Регистр шалгаж чадсангүй. Нэрийг гараар оруулна уу.";
    pendingLookup.current = {
      abort,
      timer: setTimeout(async () => {
        try {
          const res = await fetch(
            `/api/ebarimt/lookup?regno=${encodeURIComponent(value)}`,
            { signal: abort.signal },
          );
          const data = (await res.json()) as {
            found?: boolean;
            name?: string | null;
            error?: string;
          };
          if (!res.ok)
            return setLookup({
              status: "error",
              message: data.error ?? failed,
            });
          if (!data.found || !data.name)
            return setLookup({ status: "notfound" });
          const found = data.name;
          setLookup({ status: "found", name: found });
          setName((current) => {
            if (current.trim() && current !== autoName.current) return current; // keep a name the user typed
            autoName.current = found;
            return found;
          });
          onEdit(field)();
        } catch {
          if (!abort.signal.aborted)
            setLookup({ status: "error", message: failed });
        }
      }, 350),
    };
  }

  function onRegnoChange(value: string) {
    const clean = value.replace(/\D+/g, "").slice(0, 7);
    if (clean === regno) return;
    setRegno(clean);
    onEdit("companyRegister")();
    lookUp(
      clean,
      COMPANY_REGISTER.test(clean),
      companyName,
      setCompanyName,
      "companyName",
    );
  }

  function onPersonalRegisterChange(value: string) {
    const clean = normalizePersonalRegister(value).slice(0, 10);
    if (clean === personalRegister) return;
    setPersonalRegister(clean);
    onEdit("personalRegister")();
    lookUp(
      clean,
      PERSONAL_REGISTER.test(clean),
      personName,
      setPersonName,
      "username",
    );
  }

  function onTypeChange(next: CustomerType) {
    setType(next);
    clearTimeout(pendingLookup.current.timer);
    pendingLookup.current.abort?.abort();
    autoName.current = "";
    setLookup({ status: "idle" });
  }

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  if (state?.ok) return <FormMessage state={state} />;

  const regnoHint = {
    idle: "Нэр автоматаар бөглөгдөнө",
    loading: "Шалгаж байна…",
    found: type === "company" ? "Байгууллага олдлоо" : "Иргэн олдлоо",
    notfound: "Олдсонгүй, нэрийг гараар оруулна уу",
    error: lookup.status === "error" ? lookup.message : "",
  }[lookup.status];

  const hintTone =
    lookup.status === "found"
      ? "text-accent-ink"
      : lookup.status === "notfound" || lookup.status === "error"
        ? "text-amber-600 dark:text-amber-400"
        : undefined;
  const latinInRegister = /[a-z]/i.test(personalRegister);

  return (
    <ActionForm action={action} className="space-y-4" noValidate>
      {state?.message && <ErrorAlert key={attempt}>{state.message}</ErrorAlert>}

      <fieldset
        className="grid items-start gap-4 sm:grid-cols-2"
        disabled={pending}
      >
        <div
          aria-label="Харилцагчийн төрөл"
          className="grid grid-cols-2 sm:col-span-2 gap-1 rounded-full border border-line bg-surface p-1"
          role="radiogroup"
        >
          {(
            [
              ["company", "Байгууллага"],
              ["individual", "Хувь хүн"],
            ] as const
          ).map(([value, label]) => (
            <label
              className="cursor-pointer rounded-full px-4 py-2 text-center text-sm font-semibold text-fg-muted transition-colors has-checked:bg-card has-checked:text-fg has-checked:shadow-sm has-focus-visible:outline-2 has-focus-visible:outline-brand"
              key={value}
            >
              <input
                checked={type === value}
                className="sr-only"
                name="customerType"
                onChange={() => onTypeChange(value)}
                type="radio"
                value={value}
              />
              {label}
            </label>
          ))}
        </div>

        {type === "individual" ? (
          <Fragment key="individual">
            <Field
              error={error("personalRegister")}
              hint={
                latinInRegister ? (
                  <span className="text-amber-600 dark:text-amber-400">
                    Кирилл үсгээр бичнэ үү (УБ, UB биш)
                  </span>
                ) : (
                  <span className={hintTone}>
                    {lookup.status === "idle"
                      ? "2 үсэг, 8 тоо. Нэр автоматаар бөглөгдөнө"
                      : regnoHint}
                  </span>
                )
              }
              label="Регистр"
            >
              <span className="relative block">
                <Input
                  autoComplete="off"
                  autoFocus
                  className="pr-12 font-mono tracking-widest uppercase"
                  invalid={!!error("personalRegister")}
                  maxLength={10}
                  name="personalRegister"
                  onChange={(e) => onPersonalRegisterChange(e.target.value)}
                  placeholder="УБ12345678"
                  spellCheck={false}
                  value={personalRegister}
                />
                <LookupIcon status={lookup.status} />
              </span>
            </Field>
            <Field error={error("username")} label="Овог нэр">
              <Input
                autoComplete="name"
                invalid={!!error("username")}
                name="username"
                onChange={(e) => {
                  setPersonName(e.target.value);
                  onEdit("username")();
                }}
                placeholder={
                  lookup.status === "loading"
                    ? "Татаж байна…"
                    : "Автоматаар бөглөгдөнө"
                }
                value={personName}
              />
            </Field>
          </Fragment>
        ) : (
          <Fragment key="company">
            <Field
              error={error("companyRegister")}
              hint={<span className={hintTone}>{regnoHint}</span>}
              label="Регистр"
            >
              <span className="relative block">
                <Input
                  autoComplete="off"
                  autoFocus
                  className="pr-12 font-mono tracking-widest"
                  inputMode="numeric"
                  invalid={!!error("companyRegister")}
                  maxLength={7}
                  name="companyRegister"
                  onChange={(e) => onRegnoChange(e.target.value)}
                  placeholder="1234567"
                  value={regno}
                />
                <LookupIcon status={lookup.status} />
              </span>
            </Field>

            <Field error={error("companyName")} label="Байгууллагын нэр">
              <Input
                autoComplete="organization"
                invalid={!!error("companyName")}
                name="companyName"
                onChange={(e) => {
                  setCompanyName(e.target.value);
                  onEdit("companyName")();
                }}
                placeholder={
                  lookup.status === "loading"
                    ? "Татаж байна…"
                    : "Автоматаар бөглөгдөнө"
                }
                value={companyName}
              />
            </Field>

            <Field error={error("username")} label="Холбогдох хүн">
              <Input
                autoComplete="name"
                defaultValue={state?.values?.username}
                invalid={!!error("username")}
                name="username"
                onChange={onEdit("username")}
              />
            </Field>
          </Fragment>
        )}
        <Field
          className={type === "individual" ? "sm:col-span-2" : undefined}
          error={error("email")}
          label="И-мэйл"
        >
          <Input
            autoCapitalize="none"
            autoComplete="email"
            defaultValue={state?.values?.email}
            invalid={!!error("email")}
            name="email"
            onChange={onEdit("email")}
            spellCheck={false}
            type="email"
          />
        </Field>
        <Field error={error("password")} hint="8+ тэмдэгт" label="Нууц үг">
          <PasswordInput
            autoComplete="new-password"
            icon={Lock}
            invalid={!!error("password")}
            name="password"
            onChange={(e) => {
              setPassword(e.target.value);
              onEdit("password")();
            }}
          />
        </Field>
        <Field
          error={error("confirm")}
          hint={
            confirm &&
            (confirm === password ? (
              <span className="text-accent-ink">Таарч байна</span>
            ) : (
              <span className="text-amber-600 dark:text-amber-400">
                Таарахгүй байна
              </span>
            ))
          }
          label="Нууц үг давтах"
        >
          <PasswordInput
            autoComplete="new-password"
            icon={Lock}
            invalid={!!error("confirm")}
            name="confirm"
            onChange={(e) => {
              setConfirm(e.target.value);
              onEdit("confirm")();
            }}
          />
        </Field>
      </fieldset>

      <input
        aria-hidden="true"
        autoComplete="off"
        className="hidden"
        name="website"
        tabIndex={-1}
        type="text"
      />
      <Button className="w-full" disabled={pending}>
        {pending ? (
          <>
            <span
              aria-hidden="true"
              className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            />
            Илгээж байна…
          </>
        ) : (
          "Бүртгүүлэх"
        )}
      </Button>
    </ActionForm>
  );
}

/** Spinner while the register number is being looked up, a check mark once found. */
function LookupIcon({ status }: { status: Lookup["status"] }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute top-1/2 right-4 mt-0.75 -translate-y-1/2"
    >
      {status === "loading" && (
        <span className="block size-4.5 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      )}
      {status === "found" && (
        <svg
          className="size-5 text-accent-ink"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      )}
    </span>
  );
}
