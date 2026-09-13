import { useState, type FormEvent } from "react";
import { Mail, Phone, MapPin, CheckCircle2 } from "lucide-react";
import { wait } from "../../api/mock/delay";
import { Input } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/Textarea";
import { Button } from "../../components/ui/Button";

const CONTACT_INFO = [
  { icon: Mail, label: "hello@kbcgoldjewel.com" },
  { icon: Phone, label: "+1 (555) 018-2947" },
  { icon: MapPin, label: "142 Wren Street, Portland, OR" },
];

export function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await wait(700);
    setSubmitting(false);
    setSent(true);
  };

  return (
    <div className="container py-8 sm:py-12">
      <h1 className="font-display text-h1 font-semibold text-foreground">Contact Us</h1>
      <p className="mt-2 max-w-lg text-body text-muted-foreground">
        Questions about an order, sizing, or a custom piece? We'd love to help.
      </p>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_320px]">
        {sent ? (
          <div className="flex flex-col items-start gap-3 rounded-md border border-success/20 bg-success/5 p-6">
            <CheckCircle2 className="h-8 w-8 text-success" aria-hidden="true" />
            <p className="text-h3 font-display font-semibold text-foreground">Message sent</p>
            <p className="text-small text-muted-foreground">
              Thanks for reaching out — our team typically replies within one business day.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input label="Name" required value={name} onChange={(e) => setName(e.target.value)} />
            <Input label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            <Textarea label="Message" required rows={6} value={message} onChange={(e) => setMessage(e.target.value)} />
            <Button type="submit" size="lg" loading={submitting}>
              Send Message
            </Button>
          </form>
        )}

        <div className="space-y-4">
          <h2 className="text-h3 font-display font-semibold text-foreground">Get in Touch</h2>
          {CONTACT_INFO.map((info) => (
            <div key={info.label} className="flex items-center gap-3 text-small text-muted-foreground">
              <info.icon className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              {info.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
