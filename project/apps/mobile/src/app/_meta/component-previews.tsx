/**
 * Hand-curated preview map for `/kitchen-sink`. The key is the basename of
 * each file in `src/ui/components` (e.g. `listing-card` for
 * `listing-card.tsx`). The kitchen sink page enumerates the components folder
 * via `require.context` and renders these previews; files with no entry here
 * render a "no preview yet" placeholder so they stay discoverable.
 *
 * Add a new component to `src/ui/components` → add an entry here when you
 * want it rendered. Sample data lives in this file only.
 */

import { Button } from "@pitsi-ui/native/button";
import { Text } from "@pitsi-ui/native/text";
import { type ReactNode, useState } from "react";
import { Pressable, View } from "react-native";

import { defaultActivityFilters, defaultStayFilters } from "../../lib/api/travel";
import { AccountSurface } from "../../ui/components/account-surface";
import { ActionMenu } from "../../ui/components/action-menu";
import { ActivityFilterMenu } from "../../ui/components/activity-filter-menu";
import { ActivityFilterQuickSheet } from "../../ui/components/activity-filter-quick-sheet";
import { ActivityFilterSheet } from "../../ui/components/activity-filter-sheet";
import { AdaptiveGlassView } from "../../ui/components/adaptive-glass-view";
import { AiSmartBadge, AiSmartText, PlanCard } from "../../ui/components/ai-primitives";
import { AinnbLogo } from "../../ui/components/ainnb-logo";
import { CategoryStrip } from "../../ui/components/category-strip";
import { ChatBubble } from "../../ui/components/chat-bubble";
import { ChipMultiSelect } from "../../ui/components/chip-multi-select";
import { FavoriteHeartButton } from "../../ui/components/favorite-heart-button";
import { FilterMenu } from "../../ui/components/filter-menu";
import { FilterQuickSheet } from "../../ui/components/filter-quick-sheet";
import { FilterSheet } from "../../ui/components/filter-sheet";
import { HorizontalCardStrip } from "../../ui/components/horizontal-card-strip";
import { LiquidGlassInput } from "../../ui/components/liquid-glass-input";
import { ListingCard } from "../../ui/components/listing-card";
import { ListingRow } from "../../ui/components/listing-row";
import { LocationMap } from "../../ui/components/location-map";
import { NativeTextInput } from "../../ui/components/native-text-input";
import { OnboardingFlow } from "../../ui/components/onboarding-flow";
import { OptionListPicker } from "../../ui/components/option-list-picker";
import { ReviewRows } from "../../ui/components/review-rows";
import { Screen } from "../../ui/components/screen";
import { SearchPill } from "../../ui/components/search-pill";
import { SearchResultTile } from "../../ui/components/search-result-tile";
import { SeedAvatar } from "../../ui/components/seed-avatar";
import { StepIndicator } from "../../ui/components/step-indicator";
import { defaultTheatreFilters, TheatreFilterMenu } from "../../ui/components/theatre-filter-menu";
import { TravelEmptyState } from "../../ui/components/travel-empty-state";

const SAMPLE_IMAGE = "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800";
const stubImageSrc = (img: unknown) =>
  typeof img === "string" ? img : ((img as { src?: string })?.src ?? SAMPLE_IMAGE);

const sampleListing: [string, string, string, string, string] = [
  "Cosy loft in Lisbon",
  "Hosted by Inês · 2 guests",
  "4.92",
  SAMPLE_IMAGE,
  "sample-1",
];

const noop = () => {};

export type PreviewEntry = {
  render: () => ReactNode;
};

export default function ComponentPreviewsMetaRoute() {
  return null;
}

/** Trigger wrapper for menus/sheets so the open state is reachable from inline. */
function Toggleable({
  children,
  label = "Open",
}: {
  children: (open: boolean, setOpen: (v: boolean) => void) => ReactNode;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <View className="gap-2">
      <Button onPress={() => setOpen((v) => !v)} size="sm" variant="secondary">
        <Button.Label>{open ? `Close ${label.toLowerCase()}` : label}</Button.Label>
      </Button>
      {children(open, setOpen)}
    </View>
  );
}

function FavoriteDemo() {
  const [saved, setSaved] = useState(false);
  return (
    <View className="flex-row items-center gap-3">
      <FavoriteHeartButton
        accessibilityLabel={saved ? "Remove preview favorite" : "Save preview favorite"}
        onPress={() => setSaved((v) => !v)}
        saved={saved}
        style={{ position: "relative", right: 0, top: 0 }}
      />
      <Text className="text-[14px] text-muted">{saved ? "Saved" : "Tap me"}</Text>
    </View>
  );
}

function ChipMultiSelectDemo() {
  const [selected, setSelected] = useState<string[]>(["beach"]);
  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  return (
    <ChipMultiSelect
      onToggle={toggle}
      options={[
        { id: "beach", title: "Beach" },
        { id: "mountains", title: "Mountains" },
        { id: "city", title: "City" },
        { id: "cabin", title: "Cabin" },
      ]}
      selected={selected}
    />
  );
}

function OptionListPickerDemo() {
  const [selected, setSelected] = useState<string | null>("relaxed");
  return (
    <OptionListPicker
      onSelect={setSelected}
      options={[
        { id: "relaxed", title: "Relaxed" },
        { id: "balanced", title: "Balanced" },
        { id: "packed", title: "Packed" },
      ]}
      selected={selected}
    />
  );
}

function LiquidGlassInputDemo() {
  const [value, setValue] = useState("");
  return <LiquidGlassInput onChangeText={setValue} placeholder="Type something" value={value} />;
}

export const componentPreviews: Record<string, PreviewEntry> = {
  "account-surface": {
    render: () => (
      <View style={{ height: 360 }}>
        <AccountSurface
          email="ines@example.com"
          links={[
            { label: "Trips", onPress: noop },
            { label: "Wishlists", onPress: noop },
            { destructive: true, label: "Sign out", onPress: noop },
          ]}
          name="Inês Almeida"
          seed="ines-almeida"
          stats="4 trips · 12 wishlists"
        />
      </View>
    ),
  },

  "action-menu": {
    render: () => (
      <ActionMenu
        actions={[
          { id: "edit", title: "Edit" },
          { id: "delete", title: "Delete" },
        ]}
        onAction={noop}
        title="Choose"
      >
        <Pressable className="rounded-full bg-default px-4 py-2">
          <Text className="text-[14px] font-semibold text-foreground">Tap me</Text>
        </Pressable>
      </ActionMenu>
    ),
  },

  "activity-filter-menu": {
    render: () => (
      <ActivityFilterMenu filters={defaultActivityFilters} onChange={noop} onClear={noop}>
        <Pressable className="rounded-full bg-default px-4 py-2">
          <Text className="text-[14px] font-semibold text-foreground">Activity filters</Text>
        </Pressable>
      </ActivityFilterMenu>
    ),
  },

  "activity-filter-quick-sheet": {
    render: () => (
      <Toggleable label="Quick sheet">
        {(open, setOpen) => (
          <ActivityFilterQuickSheet
            filters={defaultActivityFilters}
            isOpen={open}
            onChange={noop}
            onClear={noop}
            onOpenAll={() => setOpen(false)}
            onOpenChange={setOpen}
          />
        )}
      </Toggleable>
    ),
  },

  "activity-filter-sheet": {
    render: () => (
      <Toggleable label="Full sheet">
        {(open, setOpen) => (
          <ActivityFilterSheet
            count={0}
            filters={defaultActivityFilters}
            isOpen={open}
            onChange={noop}
            onClear={noop}
            onOpenChange={setOpen}
          />
        )}
      </Toggleable>
    ),
  },

  "adaptive-glass-view": {
    render: () => (
      <AdaptiveGlassView glassEffectStyle="regular" style={{ borderRadius: 18, padding: 18 }}>
        <Text className="text-[15px] font-semibold text-foreground">Liquid glass surface</Text>
        <Text className="mt-1 text-[13px] text-muted">
          Falls back to a tinted card on platforms without glass support.
        </Text>
      </AdaptiveGlassView>
    ),
  },

  "ai-primitives": {
    render: () => (
      <View className="gap-3">
        <AiSmartText>Default AI text on a surface.</AiSmartText>
        <AiSmartText muted>Muted secondary text.</AiSmartText>
        <View className="flex-row gap-2">
          <AiSmartBadge>Default</AiSmartBadge>
          <AiSmartBadge tone="accent">Accent</AiSmartBadge>
        </View>
        <PlanCard cta={{ label: "Open plan", onPress: noop }} title="Weekend in Lisbon">
          <AiSmartText muted>3 stays, 5 activities, $612 total.</AiSmartText>
        </PlanCard>
      </View>
    ),
  },

  "ainnb-logo": {
    render: () => <AinnbLogo height={36} />,
  },

  "category-strip": {
    render: () => (
      <CategoryStrip
        activeCategory="wifi"
        categories={[
          { id: "all", label: "All" },
          { id: "wifi", label: "Wifi" },
          { id: "kitchen", label: "Kitchen" },
          { id: "ac", label: "AC" },
          { id: "parking", label: "Parking" },
          { id: "coffee", label: "Coffee" },
        ]}
        onCategoryChange={noop}
      />
    ),
  },

  "chat-bubble": {
    render: () => (
      <View className="gap-2">
        <ChatBubble {...{ role: "ai" as const, text: "Hey — looking for a weekend in Lisbon?" }} />
        <ChatBubble {...{ role: "user" as const, text: "Yes, beach if possible." }} />
        <ChatBubble {...{ role: "ai" as const, text: "Got it. Two options coming up." }} />
      </View>
    ),
  },

  "chip-multi-select": {
    render: () => <ChipMultiSelectDemo />,
  },

  "favorite-heart-button": {
    render: () => <FavoriteDemo />,
  },

  "filter-menu": {
    render: () => (
      <FilterMenu count={0} filters={defaultStayFilters} onChange={noop} onClear={noop}>
        <Pressable className="rounded-full bg-default px-4 py-2">
          <Text className="text-[14px] font-semibold text-foreground">Stay filters</Text>
        </Pressable>
      </FilterMenu>
    ),
  },

  "filter-quick-sheet": {
    render: () => (
      <Toggleable label="Quick sheet">
        {(open, setOpen) => (
          <FilterQuickSheet
            count={0}
            filters={defaultStayFilters}
            isOpen={open}
            onChange={noop}
            onClear={noop}
            onOpenAll={() => setOpen(false)}
            onOpenChange={setOpen}
          />
        )}
      </Toggleable>
    ),
  },

  "filter-sheet": {
    render: () => (
      <Toggleable label="Full sheet">
        {(open, setOpen) => (
          <FilterSheet
            bounds={{ max: 1000, min: 0 }}
            count={0}
            filters={defaultStayFilters}
            isOpen={open}
            onChange={noop}
            onClear={noop}
            onOpenChange={setOpen}
            routeNoun="stays"
          />
        )}
      </Toggleable>
    ),
  },

  "horizontal-card-strip": {
    render: () => (
      <HorizontalCardStrip
        imageSrc={stubImageSrc}
        listings={[
          sampleListing,
          ["Mountain cabin", "Hosted by Tomas", "4.88", SAMPLE_IMAGE, "sample-2"],
          ["Beachside studio", "Hosted by Lea", "4.95", SAMPLE_IMAGE, "sample-3"],
        ]}
      />
    ),
  },

  "liquid-glass-input": {
    render: () => <LiquidGlassInputDemo />,
  },

  "listing-card": {
    render: () => (
      <View style={{ width: 232 }}>
        <ListingCard imageSrc={stubImageSrc} listing={sampleListing} onOpen={noop} />
      </View>
    ),
  },

  "listing-row": {
    render: () => (
      <ListingRow
        badge="Recommended"
        imageSrc={stubImageSrc}
        onOpen={noop}
        row={{
          items: [
            sampleListing,
            ["Mountain cabin", "Hosted by Tomas", "4.88", SAMPLE_IMAGE, "sample-2"],
            ["Beachside studio", "Hosted by Lea", "4.95", SAMPLE_IMAGE, "sample-3"],
          ],
          title: "Stays in Lisbon",
        }}
      />
    ),
  },

  "location-map": {
    render: () => (
      <View style={{ borderRadius: 16, height: 220, overflow: "hidden" }}>
        <LocationMap lat={38.7223} lng={-9.1393} title="Lisbon" />
      </View>
    ),
  },

  "native-text-input": {
    render: () => <NativeTextInput initialValue="" placeholder="Native SwiftUI text" />,
  },

  "onboarding-flow": {
    render: () => (
      <View style={{ height: 480 }}>
        <OnboardingFlow
          groups={[
            {
              key: "intro",
              skippable: false,
              steps: [
                {
                  key: "welcome",
                  render: () => (
                    <Text className="text-center text-[15px] text-muted">
                      Generic stepper shell.
                    </Text>
                  ),
                  title: "Welcome",
                },
                {
                  key: "details",
                  render: () => (
                    <Text className="text-center text-[15px] text-muted">Step two body.</Text>
                  ),
                  title: "Details",
                },
              ],
              title: "Intro",
            },
          ]}
        />
      </View>
    ),
  },

  "option-list-picker": {
    render: () => <OptionListPickerDemo />,
  },

  "review-rows": {
    render: () => (
      <ReviewRows
        rows={[
          { label: "Destination", value: "Lisbon" },
          { label: "Dates", value: "31 May — 3 Jun" },
          { label: "Guests", value: "2" },
        ]}
      />
    ),
  },

  screen: {
    render: () => (
      <View style={{ height: 120 }}>
        <Screen>
          <View className="flex-1 items-center justify-center">
            <Text className="text-[14px] text-muted">Screen wrapper</Text>
          </View>
        </Screen>
      </View>
    ),
  },

  "search-pill": {
    render: () => (
      <SearchPill
        form={{
          checkIn: "2026-05-31",
          checkOut: "2026-06-03",
          destination: "Lisbon",
          guests: 2,
        }}
        onClear={noop}
        onOpen={noop}
      />
    ),
  },

  "search-result-tile": {
    render: () => (
      <SearchResultTile imageSrc={stubImageSrc} listing={sampleListing} onOpen={noop} />
    ),
  },

  "seed-avatar": {
    render: () => (
      <View className="flex-row gap-3">
        <SeedAvatar seed="ines" size={56} />
        <SeedAvatar seed="tomas" size={56} />
        <SeedAvatar seed="lea" size={56} />
      </View>
    ),
  },

  "step-indicator": {
    render: () => (
      <StepIndicator
        currentGroup={0}
        currentStep={1}
        groups={[
          { key: "info", title: "Info", total: 3 },
          { key: "targets", title: "Targets", total: 2 },
        ]}
      />
    ),
  },

  "theatre-filter-menu": {
    render: () => (
      <TheatreFilterMenu
        availableCountries={["Portugal", "Spain"]}
        availableGenres={["Drama", "Comedy"]}
        filters={defaultTheatreFilters}
        onChange={noop}
        onClear={noop}
      >
        <Pressable className="rounded-full bg-default px-4 py-2">
          <Text className="text-[14px] font-semibold text-foreground">Theatre filters</Text>
        </Pressable>
      </TheatreFilterMenu>
    ),
  },

  "travel-empty-state": {
    render: () => (
      <View style={{ height: 280 }}>
        <TravelEmptyState
          actionLabel="Browse stays"
          message="Nothing here yet — start by searching a destination."
          onAction={noop}
          title="No saved trips"
        />
      </View>
    ),
  },
};

export function PreviewSection({ children, name }: { children: ReactNode; name: string }) {
  return (
    <View className="gap-3 border-b border-border pb-6">
      <Text className="text-[15px] font-semibold text-foreground">{name}</Text>
      <View>{children}</View>
    </View>
  );
}

export function MissingPreview({ name }: { name: string }) {
  return (
    <View className="border-t border-border py-3">
      <Text className="text-[13px] text-muted">
        No preview for <Text className="font-semibold text-foreground">{name}</Text> yet.
      </Text>
    </View>
  );
}
