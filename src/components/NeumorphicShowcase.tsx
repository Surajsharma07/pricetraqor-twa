import { useState } from "react"
import { NeumorphicRadioGroup } from "./NeumorphicRadioGroup"
import { NeumorphicSwitch } from "./NeumorphicSwitch"
import { NeumorphicButton } from "./NeumorphicButton"
import { NeumorphicSlider } from "./NeumorphicSlider"
import { NeumorphicCheckbox } from "./NeumorphicCheckbox"
import { ArrowLeft, Heart, Star, ShoppingCart, Bell } from "@phosphor-icons/react"

interface NeumorphicShowcaseProps {
  onBack: () => void
}

export function NeumorphicShowcase({ onBack }: NeumorphicShowcaseProps) {
  const [alertType, setAlertType] = useState("drops")
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [targetPercent, setTargetPercent] = useState(10)
  const [emailNotifs, setEmailNotifs] = useState(false)
  const [pushNotifs, setPushNotifs] = useState(true)
  const [theme, setTheme] = useState("auto")
  const [volume, setVolume] = useState(50)

  return (
    <div className="min-h-screen py-6" style={{ background: 'oklch(0.93 0.005 250)' }}>
      <div className="mx-auto max-w-[600px] px-4">
        <button
          onClick={onBack}
          className="mb-6 inline-flex items-center gap-2 text-[#394a56] hover:opacity-70 transition-opacity"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back</span>
        </button>

        <h1 className="text-3xl font-bold mb-2 text-[#394a56]">
          Neumorphic Components
        </h1>
        <p className="text-[#6b7c8a] mb-8">
          Real-life tactile design inspired by physical materials and depth
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4 text-[#394a56]">
              Radio Groups
            </h2>
            <NeumorphicRadioGroup
              name="alert-type"
              value={alertType}
              onChange={setAlertType}
              options={[
                { value: "drops", label: "Price Drops Only" },
                { value: "all", label: "All Price Changes" },
                { value: "target", label: "Target Price Hit" },
              ]}
            />
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-[#394a56]">
              Theme Preference
            </h2>
            <NeumorphicRadioGroup
              name="theme"
              value={theme}
              onChange={setTheme}
              options={[
                { value: "auto", label: "System Default" },
                { value: "light", label: "Always Light" },
                { value: "dark", label: "Always Dark" },
              ]}
            />
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-[#394a56]">
              Toggles & Switches
            </h2>
            <div className="neumorphic-radiogroup rounded-2xl p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-[#394a56]">Notifications</div>
                  <div className="text-sm text-[#6b7c8a]">Enable price alerts</div>
                </div>
                <NeumorphicSwitch
                  checked={notificationsEnabled}
                  onChange={setNotificationsEnabled}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-[#394a56]">Dark Mode</div>
                  <div className="text-sm text-[#6b7c8a]">Toggle dark theme</div>
                </div>
                <NeumorphicSwitch
                  checked={darkMode}
                  onChange={setDarkMode}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-[#394a56]">Email Notifications</div>
                  <div className="text-sm text-[#6b7c8a]">Receive email updates</div>
                </div>
                <NeumorphicCheckbox
                  checked={emailNotifs}
                  onChange={setEmailNotifs}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-[#394a56]">Push Notifications</div>
                  <div className="text-sm text-[#6b7c8a]">Browser push alerts</div>
                </div>
                <NeumorphicCheckbox
                  checked={pushNotifs}
                  onChange={setPushNotifs}
                />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-[#394a56]">
              Sliders & Range Controls
            </h2>
            <div className="neumorphic-radiogroup rounded-2xl p-8 space-y-6">
              <div>
                <div className="mb-4 flex items-baseline justify-between">
                  <span className="text-[#394a56] font-medium">Alert Threshold</span>
                  <span className="text-2xl font-bold text-[#394a56]">{targetPercent}%</span>
                </div>
                <NeumorphicSlider
                  value={targetPercent}
                  onChange={setTargetPercent}
                  min={5}
                  max={50}
                  step={5}
                />
              </div>

              <div>
                <div className="mb-4 flex items-baseline justify-between">
                  <span className="text-[#394a56] font-medium">Volume</span>
                  <span className="text-2xl font-bold text-[#394a56]">{volume}</span>
                </div>
                <NeumorphicSlider
                  value={volume}
                  onChange={setVolume}
                  min={0}
                  max={100}
                  step={1}
                />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-[#394a56]">
              Action Buttons
            </h2>
            <div className="neumorphic-radiogroup rounded-2xl p-8 space-y-4">
              <NeumorphicButton variant="primary" fullWidth>
                Save Preferences
              </NeumorphicButton>
              <NeumorphicButton variant="secondary" fullWidth>
                Reset to Defaults
              </NeumorphicButton>
              <div className="grid grid-cols-4 gap-4">
                <NeumorphicButton variant="icon">
                  <Heart size={24} weight="fill" className="text-[#394a56]" />
                </NeumorphicButton>
                <NeumorphicButton variant="icon">
                  <Star size={24} weight="fill" className="text-[#394a56]" />
                </NeumorphicButton>
                <NeumorphicButton variant="icon">
                  <ShoppingCart size={24} weight="fill" className="text-[#394a56]" />
                </NeumorphicButton>
                <NeumorphicButton variant="icon">
                  <Bell size={24} weight="fill" className="text-[#394a56]" />
                </NeumorphicButton>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-[#394a56]">
              Neumorphic Cards
            </h2>
            <div className="space-y-4">
              <div className="neumorphic-card rounded-3xl p-6">
                <h3 className="text-lg font-bold text-[#394a56] mb-2">Product Card</h3>
                <p className="text-sm text-[#6b7c8a] mb-4">
                  A soft, raised surface that appears to extrude from the background with subtle shadows
                </p>
                <div className="flex gap-2">
                  <NeumorphicButton variant="primary">Learn More</NeumorphicButton>
                  <NeumorphicButton variant="secondary">Dismiss</NeumorphicButton>
                </div>
              </div>

              <div className="neumorphic-inset-card rounded-3xl p-6">
                <h3 className="text-lg font-bold text-[#394a56] mb-2">Input Area</h3>
                <p className="text-sm text-[#6b7c8a] mb-4">
                  A recessed surface that appears pressed into the background, perfect for input fields
                </p>
                <div className="h-12 rounded-xl neumorphic-inset flex items-center px-4">
                  <span className="text-[#6b7c8a]">Type something here...</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
