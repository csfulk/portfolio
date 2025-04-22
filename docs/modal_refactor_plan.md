Here’s a concrete, file‑by‑file roadmap. Once you open each file, we’ll walk through and implement the changes for that step before moving on:
	1.	Unify Modal State
	•	Open: src/hooks/useModal.jsx
	•	Goal: Make it the single source of truth for modal visibility, content, animation flags, and open/close methods.
	2.	Lift Hook into App
	•	Open: src/App.jsx
	•	Goal:
	•	Replace its two useState calls (isModalOpen/modalContent) with a destructured useModal() instance.
	•	Wire openModal, closeModal, modalContent, isExpanded, loading, and transitioning into the JSX.
	•	Swap out the inline <div className="modal-overlay">… block for a <Modal> component.
	3.	Enhance <Modal> Component
	•	Open: src/components/Modal.jsx
	•	Goal:
	•	Add a close <button className="modal-close">×</button> inside .modal-container.
	•	Add role="dialog", aria-modal="true", tabIndex={-1}, and focus‑trap/focus‑on‑mount.
	•	Remove any redundant scroll‑lock logic if you’ll rely on this component exclusively.
	4.	Fix Auth‑Gate Prop Forwarding
	•	Open: src/hooks/useAuth.jsx
	•	Goal:
	•	Change openPasswordGate() to accept and store the exact viewerProps (e.g. { images, onClose }).
	•	In each call site (SectionOne.jsx), pass those props when invoking openPasswordGate.
	5.	Wire up SectionOne
	•	Open: src/components/sections/SectionOne.jsx
	•	Goal:
	•	Ensure you import the correct image array (e.g. ytImages) and pass { images: ytImages, onClose: closeHandler } into openPasswordGate.
	•	Confirm you’re now calling openModal() only when authenticated.
	6.	Replace Timeouts with Transition Events
	•	Open: src/hooks/useAuth.jsx (again)
	•	Goal:
	•	Remove hard‑coded setTimeout calls; instead listen for the modal container’s transitionend event (or use a Promise) to call completeTransition().
	7.	Polish Carousel Accessibility
	•	Open: src/components/projectViewer.jsx
	•	Goal:
	•	Add role="dialog"/aria-modal="true" to the root.
	•	Give the close button aria-label="Close dialog".
	•	Trap focus inside while open.
	8.	Clean Up CSS
	•	Open: src/styles/modal.css
	•	Goal:
	•	Remove the unused .project-viewer-container rules.
	•	Consolidate @keyframes fadeIn.
	•	Delete redundant centering styles (either flex on overlay or absolute/transform on container).
	•	Reset aspect-ratio: auto in .modal-container.expanded.
	9.	Quick Smoke Test
	•	Run the app, click “View Project” on an unauthenticated session, verify the password gate opens, enter the correct password, and ensure the carousel loads with smooth spinner→expand animation.