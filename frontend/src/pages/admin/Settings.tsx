import { useState, type FormEvent } from "react";
import { useToast } from "../../context/ToastContext";
import { Tabs } from "../../components/ui/Tabs";
import { Input } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/Textarea";
import { Checkbox } from "../../components/ui/Checkbox";
import { Button } from "../../components/ui/Button";

const TABS = [
  { value: "store", label: "Store Information" },
  { value: "appearance", label: "Appearance" },
  { value: "shipping", label: "Shipping" },
  { value: "notifications", label: "Notifications" },
  { value: "account", label: "Account" },
];

function SettingsSection({ title, description, onSave, saving, children }: { title: string; description: string; onSave: (e: FormEvent) => void; saving: boolean; children: React.ReactNode }) {
  return (
    <form onSubmit={onSave} className="max-w-lg space-y-5">
      <div>
        <h2 className="text-h3 font-display font-semibold text-foreground">{title}</h2>
        <p className="mt-1 text-small text-muted-foreground">{description}</p>
      </div>
      {children}
      <Button type="submit" loading={saving}>
        Save Changes
      </Button>
    </form>
  );
}

export function Settings() {
  const [tab, setTab] = useState("store");
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);

  const [storeName, setStoreName] = useState("Aurelle");
  const [storeDescription, setStoreDescription] = useState("Fine jewelry crafted with timeless elegance.");
  const [supportEmail, setSupportEmail] = useState("hello@aurelle.com");

  const [primaryColor, setPrimaryColor] = useState("#3b1f5c");
  const [accentColor, setAccentColor] = useState("#c99a3d");

  const [freeShippingThreshold, setFreeShippingThreshold] = useState("100");
  const [flatShippingRate, setFlatShippingRate] = useState("15");

  const [notifyNewOrders, setNotifyNewOrders] = useState(true);
  const [notifyLowStock, setNotifyLowStock] = useState(true);
  const [notifyReviews, setNotifyReviews] = useState(false);

  const [adminName, setAdminName] = useState("Admin");
  const [adminEmail, setAdminEmail] = useState("admin@aurelle.com");

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
    showToast("Settings saved");
  };

  return (
    <div>
      <h1 className="font-display text-h1 font-semibold text-foreground">Settings</h1>
      <p className="mt-1 text-small text-muted-foreground">Manage your store configuration.</p>

      <Tabs items={TABS} value={tab} onChange={setTab} className="mt-6" />

      <div className="mt-8">
        {tab === "store" && (
          <SettingsSection title="Store Information" description="Basic details about your store, shown to customers." onSave={handleSave} saving={saving}>
            <Input label="Store Name" value={storeName} onChange={(e) => setStoreName(e.target.value)} />
            <Textarea label="Description" rows={3} value={storeDescription} onChange={(e) => setStoreDescription(e.target.value)} />
            <Input label="Support Email" type="email" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} />
          </SettingsSection>
        )}

        {tab === "appearance" && (
          <SettingsSection title="Appearance" description="Brand colors used across the storefront and admin." onSave={handleSave} saving={saving}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="primary-color" className="text-label font-medium text-foreground">Primary Color</label>
                <div className="mt-1.5 flex items-center gap-2">
                  <input id="primary-color" type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="h-11 w-14 cursor-pointer rounded border border-border bg-surface" />
                  <span className="text-small text-muted-foreground">{primaryColor}</span>
                </div>
              </div>
              <div>
                <label htmlFor="accent-color" className="text-label font-medium text-foreground">Accent Color</label>
                <div className="mt-1.5 flex items-center gap-2">
                  <input id="accent-color" type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="h-11 w-14 cursor-pointer rounded border border-border bg-surface" />
                  <span className="text-small text-muted-foreground">{accentColor}</span>
                </div>
              </div>
            </div>
          </SettingsSection>
        )}

        {tab === "shipping" && (
          <SettingsSection title="Shipping" description="Configure shipping rates for your storefront." onSave={handleSave} saving={saving}>
            <Input label="Flat Shipping Rate ($)" type="number" min="0" step="0.01" value={flatShippingRate} onChange={(e) => setFlatShippingRate(e.target.value)} />
            <Input label="Free Shipping Threshold ($)" type="number" min="0" step="0.01" value={freeShippingThreshold} onChange={(e) => setFreeShippingThreshold(e.target.value)} hint="Orders above this amount ship free." />
          </SettingsSection>
        )}

        {tab === "notifications" && (
          <SettingsSection title="Notifications" description="Choose which events send you an email alert." onSave={handleSave} saving={saving}>
            <div className="space-y-3">
              <Checkbox label="New order placed" checked={notifyNewOrders} onChange={(e) => setNotifyNewOrders(e.target.checked)} />
              <Checkbox label="Product low on stock" checked={notifyLowStock} onChange={(e) => setNotifyLowStock(e.target.checked)} />
              <Checkbox label="New product review" checked={notifyReviews} onChange={(e) => setNotifyReviews(e.target.checked)} />
            </div>
          </SettingsSection>
        )}

        {tab === "account" && (
          <SettingsSection title="Account" description="Your administrator profile." onSave={handleSave} saving={saving}>
            <Input label="Name" value={adminName} onChange={(e) => setAdminName(e.target.value)} />
            <Input label="Email" type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} />
          </SettingsSection>
        )}
      </div>
    </div>
  );
}
