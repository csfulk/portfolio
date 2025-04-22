# Section Modularity Improvement Plan

This document outlines the steps for refactoring the portfolio site to make adding new sections easy, modular, and maintainable.

---

## ✅ Step 1: Set Up Centralized Data File
- [ ] Create `src/components/sections/sectionsData.js`
- [ ] Define the structure clearly for each section (id, title, subtitle, description, bulletPoints, logo, image, caseStudies)

Example structure:
```jsx
export const sections = [
  {
    id: 'youtube',
    title: 'YouTube TV Design System',
    subtitle: 'Cross-platform design at scale',
    description: 'Led design across multiple platforms...',
    bulletPoints: ['Point A', 'Point B', 'Point C'],
    logo: '/assets/section_01_colt.fulk.youtube.png',
    image: '/assets/yt_case_study_00/featured_ytlr_01.webp',
    caseStudies: [
      {
        name: 'YouTube Living Room',
        images: [/* array of images */],
      },
      {
        name: 'YouTube Movies & Shows',
        images: [/* array of images */],
      },
    ],
  },
  // Add more sections here...
];
```

---

## ✅ Step 2: Update Section.jsx
- [ ] Ensure `Section.jsx` can handle all props dynamically.
- [ ] Confirm the expand/collapse functionality works with new dynamic props.

---

## ✅ Step 3: Abstract Reusable UI Logic into Hooks
- [ ] Create hook `useExpandable.js` in `src/hooks/`
- [ ] Refactor expand/collapse logic from `Section.jsx` into `useExpandable.js`

---

## ✅ Step 4: Create Shared Case Study Logic
- [ ] Create `useCaseStudyViewer.js` hook in `src/hooks/`
- [ ] Abstract modal, password gate, and projectViewer logic from `SectionOne.jsx` into this hook so they work in unison
- [ ] Update `SectionOne.jsx` (and any other affected section components) to use the `useCaseStudyViewer` hook for coordinated handling of modal, password gate, and project viewer

---

## ✅ Step 5: Integrate Hook into Section Components
- [ ] Import the `useCaseStudyViewer` hook at the top of each section file (e.g., `SectionOne.jsx`, `SectionTwo.jsx`, etc.).
- [ ] Remove all existing modal, password gate, and project viewer logic from these components.
- [ ] In the component body, call:
  ```js
  const {
    handleCaseStudyClick,
    isGateOpen,
    gateLoading,
    gateError,
    isModalOpen,
    modalContent,
    closeGate,
    closeModal
  } = useCaseStudyViewer();
  ```
- [ ] Replace any per-component `handleCaseStudyClick` implementations with the hook’s `handleCaseStudyClick`.
- [ ] Render `<PasswordGate>` inside a conditional block when `isGateOpen` is true:
  ```jsx
  {isGateOpen && (
    <PasswordGate
      loading={gateLoading}
      error={gateError}
      onSubmit={(pw) => handleCaseStudyClick(currentKey, pw)}
      onCancel={closeGate}
    />
  )}
  ```
- [ ] Similarly, render `<Modal>` when `isModalOpen` is true:
  ```jsx
  {isModalOpen && (
    <Modal onClose={closeModal}>
      {modalContent}
    </Modal>
  )}
  ```
- [ ] Ensure the “Case Study” buttons simply call `handleCaseStudyClick('yourKey')` without additional logic.

## ✅ Step 6: Render Sections Dynamically in App.jsx
- [ ] Import `sectionsData.js` into `App.jsx`
- [ ] Replace manual imports of individual section components with dynamic mapping:
  ```jsx
  {sections.map((sec) => (
    <SectionWrapper key={sec.id} data={sec} />
  ))}
  ```
- [ ] Create a `SectionWrapper` (or similar) component to delegate to specialized or generic section components based on `sec.id`.

---

## ✅ Step 7: Testing and Debugging
- [ ] Verify dynamic section rendering works correctly.
- [ ] Test case study modal functionality thoroughly.

---

## ✅ Step 8: Documentation and Cleanup
- [ ] Update project documentation to reflect changes clearly.
- [ ] Remove redundant component files (`SectionOne.jsx`, `SectionTwo.jsx`, etc.) once confirmed stable.

---

### 🚩 Next Steps
Proceed systematically, confirming each step is fully functional before advancing to the next. Track progress here clearly.