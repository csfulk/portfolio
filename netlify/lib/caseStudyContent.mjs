/**
 * Server-side case-study content.
 *
 * These Figma embed URLs live here rather than in src/data/caseStudyRegistry.js
 * because they point at embed.figma.com, which we cannot gate at our own edge:
 * anyone holding the URL can view the deck forever. Keeping them out of the
 * client bundle means they are only ever handed to an authenticated session.
 */
export const CASE_STUDY_EMBEDS = {
  'snapchat-design-systems': 'https://embed.figma.com/deck/7bhyglnKVQY3YoEjzvviyp/Snapchat-Design-Systems?node-id=247-2576&viewport=-104%2C-47%2C0.5&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&embed-host=share',
  'snapchat-accessibility': 'https://embed.figma.com/deck/HlWuUXXvHABY8w7cm6Sfy2/Snapchat--Addressing-Core-Accessibility-Challenges?node-id=1-17124&viewport=-171%2C-185%2C0.98&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&embed-host=share',
  'snapchat-history-perception': 'https://embed.figma.com/deck/wADARTo2BiOXWSqNBf0mJQ/Elevating-Design-Through-History---Perception?node-id=1-42&viewport=-104%2C-47%2C0.5&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&embed-host=share',
  'apple-dev-docs-figma': 'https://embed.figma.com/deck/VUYfRxLN6Is3JehNitrn2e/Apple-Developer-Documentation-Design-System?node-id=1-42&viewport=-104%2C-47%2C0.5&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&embed-host=share',
  'apple-dev-docs': 'https://embed.figma.com/deck/VUYfRxLN6Is3JehNitrn2e/Apple-Developer-Documentation-Design-System?node-id=1-42&viewport=-95%2C-35%2C0.46&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&embed-host=share',
  'fetch-figma-data': 'https://embed.figma.com/proto/TFOcvXbwsCU33FQqBkNMWO/Colt-Fulk?page-id=737%3A4564&node-id=738-4584&p=f&viewport=-378%2C384%2C0.26&scaling=contain&content-scaling=fixed&embed-host=share',
  'select-projects': 'https://embed.figma.com/deck/4u9UmVjECH20l1Q7xQSw82/Colt-Fulk---Select-Projects?node-id=2-1341&viewport=-95%2C-25%2C0.46&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&embed-host=share',
};
