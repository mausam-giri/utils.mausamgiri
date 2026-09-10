export const sectionIcons: Record<string, string> = {
  "travel-docs": "description",
  "nsdc-items": "inventory_2",
  clothing: "checkroom",
  "health-hygiene": "medical_services",
  "food-snacks": "restaurant",
  "tech-power": "devices",
  "travel-gear": "luggage",
  info: "location_on",
  "foreigner-arrival-card": "flight_land",
};

export function getSectionIcon(sectionId: string) {
  return sectionIcons[sectionId] ?? "checklist";
}
