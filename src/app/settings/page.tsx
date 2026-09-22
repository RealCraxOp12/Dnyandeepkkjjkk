import { getSettings } from "../actions/settings";
import SettingsForm from "./SettingsForm";

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-transparent">
      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-auto p-8 pt-4">
        <SettingsForm initialData={settings} />
      </div>
    </div>
  );
}
