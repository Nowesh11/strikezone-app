"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2, Clock, Dumbbell, HandFist, Mail, MapPin, MessageCircle, Send, Zap } from "lucide-react";
import { WhatsAppIcon } from "@/components/social-icons";
import { ACADEMY, WHATSAPP_NUMBER, whatsappUrl } from "@/lib/site";
import { BeltIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

/* --------------------------------- Options -------------------------------- */

const disciplineOptions = [
  { value: "boxing", label: "Boxing", icon: HandFist },
  { value: "muay-thai", label: "Muay Thai", icon: Zap },
  { value: "taekwondo", label: "Taekwondo", icon: BeltIcon },
  { value: "fitness", label: "Martial Arts & Fitness", icon: Dumbbell },
  { value: "not-sure", label: "Not sure yet", icon: MessageCircle },
] as const;

const experienceOptions = ["Complete beginner", "Some experience", "Experienced"] as const;
const ageOptions = ["Kids (under 13)", "Teens (13–17)", "Adults (18+)"] as const;
const timeOptions = ["Weekday mornings", "Weekday evenings", "Weekends", "Flexible"] as const;
const formatOptions = ["Group class", "Private group class", "Private class (1-to-1)"] as const;

type Discipline = (typeof disciplineOptions)[number]["value"];

interface FormState {
  name: string;
  phone: string;
  discipline: Discipline | "";
  experience: string;
  age: string;
  time: string;
  format: string;
  message: string;
}

const emptyForm: FormState = { name: "", phone: "", discipline: "", experience: "", age: "", time: "", format: "", message: "" };

type Errors = Partial<Record<keyof FormState, string>>;

function validate(f: FormState): Errors {
  const e: Errors = {};
  if (f.name.trim().length < 2) e.name = "Please enter your name.";
  if (f.phone.trim() && !/^\+?[\d\s-]{7,16}$/.test(f.phone.trim())) e.phone = "Enter a valid phone number, or leave it blank.";
  if (!f.discipline) e.discipline = "Choose what you'd like to train.";
  if (!f.experience) e.experience = "Let us know your experience level.";
  if (!f.age) e.age = "Select an age group.";
  return e;
}

function buildMessage(f: FormState) {
  const discipline = disciplineOptions.find((d) => d.value === f.discipline)?.label ?? "";
  // null = optional line left out; "" = intentional blank line
  const lines: (string | null)[] = [
    "Hi StrikeZone! I'd like to start training.",
    "",
    `*Name:* ${f.name.trim()}`,
    f.phone.trim() ? `*Phone:* ${f.phone.trim()}` : null,
    `*Interested in:* ${discipline}`,
    f.format ? `*Session type:* ${f.format}` : null,
    `*Experience:* ${f.experience}`,
    `*Age group:* ${f.age}`,
    f.time ? `*Preferred time:* ${f.time}` : null,
    f.message.trim() ? `*Message:* ${f.message.trim()}` : null,
    "",
    "(Sent from the StrikeZone website)",
  ];
  return lines.filter((l): l is string => l !== null).join("\n");
}

/* ------------------------------- Form pieces ------------------------------ */

const fieldLabel = "text-[11px] font-semibold uppercase tracking-[0.22em] text-stone";
const inputBase =
  "mt-2.5 w-full rounded-xl border bg-charcoal/60 px-4 py-3.5 text-[15px] text-bone placeholder:text-stone/50 outline-none transition-colors duration-300 focus:border-gold focus:bg-charcoal focus:ring-2 focus:ring-gold/20";

function FieldError({ id, msg }: { id: string; msg?: string }) {
  return (
    <AnimatePresence>
      {msg && (
        <motion.p
          id={id}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mt-2 text-xs font-medium text-[#ff7a9c]"
        >
          {msg}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

/** Radio group styled as pills. Native radios keep keyboard + screen-reader support. */
function PillGroup({
  legend,
  name,
  options,
  value,
  onChange,
  error,
  optional,
  columns = "flex flex-wrap",
  renderIcon,
}: {
  legend: string;
  name: string;
  options: readonly { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  error?: string;
  optional?: boolean;
  columns?: string;
  renderIcon?: (value: string) => ReactNode;
}) {
  const errId = `${name}-error`;
  return (
    <fieldset aria-describedby={error ? errId : undefined}>
      <legend className={fieldLabel}>
        {legend} {optional && <span className="normal-case tracking-normal text-stone/60">(optional)</span>}
      </legend>
      <div className={cn("mt-2.5 gap-2", columns)}>
        {options.map((o) => {
          const checked = value === o.value;
          return (
            <label
              key={o.value}
              className={cn(
                "relative flex cursor-pointer items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm transition-all duration-300 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold/40",
                checked
                  ? "border-gold bg-gold/15 text-bone"
                  : "border-gold/15 bg-charcoal/40 text-bone/75 hover:border-gold/40 hover:text-bone"
              )}
            >
              <input
                type="radio"
                name={name}
                value={o.value}
                checked={checked}
                onChange={() => onChange(o.value)}
                className="sr-only"
              />
              {renderIcon?.(o.value)}
              <span>{o.label}</span>
              {checked && <CheckCircle2 aria-hidden className="ml-auto size-4 shrink-0 text-gold" />}
            </label>
          );
        })}
      </div>
      <FieldError id={errId} msg={error} />
    </fieldset>
  );
}

/* --------------------------------- Section -------------------------------- */

export function ContactSection() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Errors>({});
  const [sentUrl, setSentUrl] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const uid = useId();

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  // Links elsewhere on the page can prefill the form:
  //   data-discipline="boxing"  data-format="Group class"  data-slot="Monday · Muay Thai · 8:00pm–9:15pm"
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>(
        "a[data-discipline], a[data-format], a[data-slot]"
      );
      if (!link) return;
      const { discipline, format, slot } = link.dataset;
      setForm((f) => ({
        ...f,
        ...(discipline && disciplineOptions.some((d) => d.value === discipline) && { discipline: discipline as Discipline }),
        ...(format && (formatOptions as readonly string[]).includes(format) && { format }),
        ...(slot && { message: `I'd like to book: ${slot}` }),
      }));
      if (discipline) setErrors((er) => ({ ...er, discipline: undefined }));
      setSentUrl(null);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }
    const url = whatsappUrl(buildMessage(form));
    // Opened directly from the submit gesture so pop-up blockers allow it
    window.open(url, "_blank", "noopener,noreferrer");
    setSentUrl(url);
  };

  const reset = () => {
    setForm(emptyForm);
    setErrors({});
    setSentUrl(null);
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative overflow-hidden border-t border-gold/10 bg-background py-24 md:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/4 right-[-15%] size-[820px] rounded-full bg-[radial-gradient(circle,rgba(224,33,125,0.06)_0%,transparent_60%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-[-10%] size-[700px] rounded-full bg-[radial-gradient(circle,rgba(201,168,106,0.08)_0%,transparent_65%)]"
      />

      <div className="relative mx-auto grid max-w-7xl gap-14 px-6 md:px-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        {/* LEFT: pitch + contact details */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
            <span className="text-stone">09</span>
            <span className="h-px w-8 bg-gold" />
            Start Training
          </p>
          <h2
            id="contact-heading"
            className="mt-8 font-display text-5xl leading-[0.95] tracking-wide text-bone sm:text-6xl lg:text-7xl"
          >
            Step onto <span className="text-gold">the mats.</span>
          </h2>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-stone">
            No experience needed. Tell us a little about yourself and your message opens straight in WhatsApp —
            ready to send to our team.
          </p>

          <ul className="mt-10 space-y-3">
            <li>
              <a
                href={whatsappUrl("Hi StrikeZone! I'd like to know more about training.")}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-2xl border border-gold/15 bg-charcoal-2/50 p-4 transition-colors duration-300 hover:border-gold/40 hover:bg-charcoal-2"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gold/10 text-gold">
                  <WhatsAppIcon className="size-5" />
                </span>
                <span className="flex-1">
                  <span className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-stone">WhatsApp</span>
                  <span className="mt-0.5 block text-sm font-medium text-bone">{ACADEMY.phoneDisplay}</span>
                </span>
                <ArrowUpRight className="size-4 text-gold transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </li>
            <li>
              <a
                href={`mailto:${ACADEMY.email}`}
                className="group flex items-center gap-4 rounded-2xl border border-gold/15 bg-charcoal-2/50 p-4 transition-colors duration-300 hover:border-gold/40 hover:bg-charcoal-2"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gold/10 text-gold">
                  <Mail className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-stone">Email</span>
                  <span className="mt-0.5 block truncate text-sm font-medium text-bone">{ACADEMY.email}</span>
                </span>
                <ArrowUpRight className="size-4 shrink-0 text-gold transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </li>
            <li>
              <a
                href={ACADEMY.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-2xl border border-gold/15 bg-charcoal-2/50 p-4 transition-colors duration-300 hover:border-gold/40 hover:bg-charcoal-2"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gold/10 text-gold">
                  <MapPin className="size-5" />
                </span>
                <span className="flex-1">
                  <span className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-stone">Find us</span>
                  <span className="mt-0.5 block text-sm font-medium text-bone">{ACADEMY.address}</span>
                </span>
                <ArrowUpRight className="size-4 text-gold transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </li>
            <li className="flex items-center gap-4 rounded-2xl border border-gold/15 bg-charcoal-2/50 p-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gold/10 text-gold">
                <Clock className="size-5" />
              </span>
              <span>
                <span className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-stone">Classes</span>
                <span className="mt-0.5 block text-sm font-medium text-bone">Boxing · Muay Thai · Martial Arts &amp; Fitness</span>
              </span>
            </li>
          </ul>
        </div>

        {/* RIGHT: enquiry form */}
        <div className="relative">
          <div
            aria-hidden
            className="absolute -inset-px rounded-[28px] bg-[linear-gradient(160deg,rgba(201,168,106,0.5),rgba(201,168,106,0.05)_40%,rgba(224,33,125,0.25))]"
          />
          <div className="relative rounded-[27px] bg-charcoal-2/95 p-6 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)] backdrop-blur sm:p-8 md:p-10">
            <AnimatePresence mode="wait" initial={false}>
              {sentUrl ? (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="flex min-h-[520px] flex-col items-center justify-center text-center"
                  role="status"
                >
                  <span className="bg-strike-gradient flex size-16 items-center justify-center rounded-full text-white shadow-[0_0_40px_-6px_rgba(224,33,125,0.7)]">
                    <WhatsAppIcon className="size-8" />
                  </span>
                  <h3 className="mt-8 font-display text-4xl tracking-wide text-bone">Opening WhatsApp…</h3>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-stone">
                    Your message is ready — just hit <span className="font-semibold text-bone">send</span> in WhatsApp
                    {WHATSAPP_NUMBER ? "" : " and choose StrikeZone as the chat"}. We&apos;ll get back to you soon.
                  </p>
                  <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
                    <a
                      href={sentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-strike-gradient inline-flex items-center gap-2 rounded-full px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white"
                    >
                      Didn&apos;t open? Tap here
                      <ArrowUpRight className="size-4" />
                    </a>
                    <button
                      type="button"
                      onClick={reset}
                      className="border-b border-gold/40 pb-1 text-xs font-semibold uppercase tracking-[0.2em] text-bone hover:border-gold hover:text-gold"
                    >
                      Send another enquiry
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  ref={formRef}
                  noValidate
                  onSubmit={onSubmit}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-7"
                  aria-describedby={`${uid}-intro`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display text-3xl tracking-wide text-bone md:text-4xl">Book your first class</h3>
                      <p id={`${uid}-intro`} className="mt-1 text-sm text-stone">
                        Takes 30 seconds. Sent securely through WhatsApp.
                      </p>
                    </div>
                    <span className="hidden size-12 shrink-0 items-center justify-center rounded-2xl border border-gold/30 bg-gold/10 text-gold sm:flex">
                      <WhatsAppIcon className="size-6" />
                    </span>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor={`${uid}-name`} className={fieldLabel}>
                        Full name
                      </label>
                      <input
                        id={`${uid}-name`}
                        name="name"
                        autoComplete="name"
                        value={form.name}
                        onChange={(e) => set("name", e.target.value)}
                        placeholder="Your name"
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? "name-error" : undefined}
                        className={cn(inputBase, errors.name ? "border-[#ff7a9c]/70" : "border-gold/15")}
                      />
                      <FieldError id="name-error" msg={errors.name} />
                    </div>
                    <div>
                      <label htmlFor={`${uid}-phone`} className={fieldLabel}>
                        Phone <span className="normal-case tracking-normal text-stone/60">(optional)</span>
                      </label>
                      <input
                        id={`${uid}-phone`}
                        name="phone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        value={form.phone}
                        onChange={(e) => set("phone", e.target.value)}
                        placeholder="+60 12-345 6789"
                        aria-invalid={!!errors.phone}
                        aria-describedby={errors.phone ? "phone-error" : undefined}
                        className={cn(inputBase, errors.phone ? "border-[#ff7a9c]/70" : "border-gold/15")}
                      />
                      <FieldError id="phone-error" msg={errors.phone} />
                    </div>
                  </div>

                  <PillGroup
                    legend="I want to train"
                    name="discipline"
                    options={disciplineOptions}
                    value={form.discipline}
                    onChange={(v) => set("discipline", v as Discipline)}
                    error={errors.discipline}
                    columns="grid grid-cols-1 sm:grid-cols-2"
                    renderIcon={(v) => {
                      const Icon = disciplineOptions.find((d) => d.value === v)!.icon;
                      return <Icon aria-hidden className="size-4 shrink-0 text-gold" />;
                    }}
                  />

                  <PillGroup
                    legend="Experience"
                    name="experience"
                    options={experienceOptions.map((o) => ({ value: o, label: o }))}
                    value={form.experience}
                    onChange={(v) => set("experience", v)}
                    error={errors.experience}
                  />

                  <PillGroup
                    legend="Age group"
                    name="age"
                    options={ageOptions.map((o) => ({ value: o, label: o }))}
                    value={form.age}
                    onChange={(v) => set("age", v)}
                    error={errors.age}
                  />

                  <PillGroup
                    legend="Session type"
                    name="format"
                    optional
                    options={formatOptions.map((o) => ({ value: o, label: o }))}
                    value={form.format}
                    onChange={(v) => set("format", v)}
                  />

                  <PillGroup
                    legend="Preferred time"
                    name="time"
                    optional
                    options={timeOptions.map((o) => ({ value: o, label: o }))}
                    value={form.time}
                    onChange={(v) => set("time", v)}
                  />

                  <div>
                    <label htmlFor={`${uid}-message`} className={fieldLabel}>
                      Anything else? <span className="normal-case tracking-normal text-stone/60">(optional)</span>
                    </label>
                    <textarea
                      id={`${uid}-message`}
                      name="message"
                      rows={3}
                      maxLength={500}
                      value={form.message}
                      onChange={(e) => set("message", e.target.value)}
                      placeholder="Goals, injuries, questions…"
                      className={cn(inputBase, "resize-none border-gold/15")}
                    />
                  </div>

                  <div className="flex flex-col gap-4 border-t border-gold/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs leading-relaxed text-stone/80 sm:max-w-[16rem]">
                      Opens WhatsApp with your details prefilled. Nothing is stored on this site.
                    </p>
                    <button
                      type="submit"
                      className="bg-strike-gradient group inline-flex items-center justify-center gap-2.5 rounded-full px-7 py-4 text-xs font-bold uppercase tracking-[0.2em] text-white transition-shadow duration-300 hover:shadow-[0_0_36px_-6px_rgba(224,33,125,0.75)] focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-2 focus-visible:outline-none"
                    >
                      Send via WhatsApp
                      <Send className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

    </section>
  );
}
