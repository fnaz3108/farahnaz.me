# Farahnaz Spatial V2.8

Update: About and footer particle cubes now use the same interaction language as the hero cube — click-drag rotation, light inertia after release, and slow idle drift — while retaining subtle local particle response.

Run with a local HTTP server, e.g. `python3 -m http.server 8080`.


V2.9: shifted hero cube left and increased particle-cube hover repulsion radius/force.


V3 geometry update: Hero Cube → Gallery Particle Sphere → About Particle Cylinder → Contact Particle Pyramid. Particle geometries share slow idle drift, drag/inertia, cursor scatter and spring-back.

V3.1: Gallery uses four oversized complete animated circles; About uses particle sphere; Contact retains particle pyramid.

V3.2: Gallery circles no longer animate autonomously; About particle sphere enlarged and shifted left for a much larger cropped presence.

V3.3: Gallery complete circles made visibly stronger on dark background; About particle sphere repositioned to left-center.

V3.4: Gallery full circles switched to dark strokes for visibility on cream background; About sphere unclipped and centered across the left side.

V3.5: About content layer made transparent so the oversized sphere remains visible beneath it; Gallery circles now have extremely slow continuous ambient drift.

V3.6: About sphere rebuilt as one square oversized spherical canvas centered off the left edge, matching the supplied red-circle composition; portrait repositioned inside the sphere.

V3.7: Gallery complete circles now use the same visible continuous drift, breathing, and pointer-response motion language as the Hero circles.

V3.8: Refined section typography. Replaced rough display heading font with a cleaner editorial sans while preserving serif italic emphasis and leaving FARAH hero branding unchanged.

V3.14: Removed live GLB rendering from hero. Uses the supplied interior render as a full-bleed optimized WebP background with subtle parallax. Existing hero cube stays in markup/code but is hidden.

V3.15: Restored interactive hero cube at 76% desktop scale, shifted slightly left so the loft render remains more visible.


V3.19 — COMPLETE 3D HERO UI TEST
- V3.15 remains the stable build.
- Entire hero is now one Three.js scene.
- GLB environment + Farah branding + logo + navigation + CTA + availability + animated circles all exist inside the 3D world.
- Navigation planes and CTA are raycast-clickable and scroll to the existing site sections.
- Orbit/pan/zoom remain available; Reset View and double-click reset the scene.

V3.20: Hero camera moved much closer, FOV widened, and entire 3D world scaled up 1.55× so the loft + 3D UI fill the hero immediately instead of appearing as a small scene.

V3.21: 3D interaction is now opt-in via Explore 3D; normal scrolling works by default. Escape/Exit 3D restores page behavior. FARAH/NAZ branding inside the scene was restyled to match the original hero hierarchy more closely, including outlined NAZ.

V3.22: Restored original HTML FARAH/NAZ hero branding above the GLB so it remains readable regardless of camera position. Removed the duplicate camera-bound 3D brand plane. Explore/Exit 3D is now fixed to the viewport while the hero is visible, with Reset shown during interaction. Leaving the hero releases 3D mode.

V3.23: Hero text contrast strengthened with a localized dark radial backdrop. Removed the selected-work CTA from the 3D scene; the normal HTML CTA remains.

V3.24: Default/reset camera changed to close lounge/staircase framing. Removed dark hero-copy backdrop and uses text shadows only.

V3.25: Default/reset camera changed to a frontal lounge composition: sofa faces the viewer, staircase remains visible on the right, and the camera is slightly pulled back for a wider hero view.

V3.26: Corrected default/reset camera to the opposite side of the sofa so the sofa faces the viewer. Kept the same wider FOV and lounge/staircase composition.

V3.27: Restored three oversized wire circles as a screen-space overlay over the live 3D hero. Circles use continuous slow drift, subtle breathing, and mouse response, so they remain visible regardless of the GLB camera angle.

V3.28: Replaced the Watch project imagery with the four supplied high-resolution originals (finished render, exploded view, movement close-up, and wireframe). Originals are copied without recompression.

V3.29: Replaced Interior & Exterior project imagery with four supplied high-resolution originals: three interior scenes and one exterior architectural render. Originals copied without recompression.

V3.30: Homepage portfolio cards now support automatic crossfade thumbnail slideshows. Projects with multiple images cycle every ~4.4–5.1s with staggered timing and subtle zoom; single-image projects remain static. Hover/focus pauses the active card.

V3.31: Fixed portfolio card collapse introduced by the slideshow wrapper. The slideshow now contributes the same 1.35:1 aspect ratio as the original static images, restoring the exact thumbnail proportions from V3.29.

V3.32: Removed old full-width black top/bottom thumbnail bands. Metadata now uses compact translucent labels over edge-to-edge slideshow imagery.

V3.36: Portfolio card itself now owns the 1.35:1 ratio. Slideshow is absolute inset 0 and every slide fills the card edge-to-edge. This removes the extra page-colored top/bottom space without per-image crop hacks.

V3.38: Replaced the old Noomf thumbnail/project artwork with the three supplied high-resolution renders. Noomf now uses an automatic three-image slideshow on the work card and the same images in the project detail gallery.

V3.40: Synced homepage slideshow markup with the latest project image arrays. Pocket Watch, Interior & Exterior, Transformer and Noomf now cycle through all available images; single-image projects remain static.

V3.41: Portfolio thumbnails now use a cinematic dead-slow zoom (~5.5%) over ~11.2–12.5 seconds, followed by a 1.45s crossfade into the next image. Single-image cards use the same slow zoom without slideshow cycling.

V3.42: Fixed portfolio zoom animation conflicts. Active slideshow frames now use dedicated keyframe-based transform animation, preventing older work-card/card-slide transform rules from cancelling the slow zoom.

V3.43: Removed conflicting historical slideshow zoom rules and rebuilt thumbnail motion as one clean animation system. JS now explicitly restarts the cinematic zoom each time a frame becomes active.

V3.44: Increased portfolio thumbnail zoom strength from ~6.5% to ~8.5% for multi-image slides and ~8% for single-image cards while preserving the same cinematic timing.

V3.45: Added full-screen 3D preloader with small morphing wireframe Cube→Sphere→Pyramid, huge bottom-right percentage, 1px edge-to-edge progress line, real weighted progress from hero GLB + page images + window load, and graceful fail-open timeout.

V3.46: Preloader wire geometry made denser/continuous with full-opacity solid strokes. Percentage typography changed from medium/bold to hairline weight 100.

V3.47: Rebuilt sphere morph target with continuous latitude/longitude wire loops so it no longer reads as dotted. Increased preloader shape size slightly, pulled camera back, and reduced pyramid apex height slightly to keep every shape completely inside frame.

V3.50: Responsive pass focused on two issues: portfolio cards/slideshows are forced visible in a single-column tablet/mobile layout, and navigation converts to a full-screen hamburger menu below 900px. Other responsive sections are unchanged.

V3.51: Added a real dark mobile menu scrim/backdrop and fixed stacking so project modal/close controls always appear above the hamburger navigation.

V3.52: Fixed actual mobile layering causes. Disabled header mix-blend-mode on mobile so hamburger gets a true solid dark full-screen background. Opening a project now force-closes the hamburger and hides the entire header while the project modal is open, preventing close-button overlap.

V3.53: Mobile project detail layout changed to image-first composition. Project image is no longer covered by title/description on screens <=900px; intro copy and metadata now sit below the image on the light project background. Desktop presentation remains unchanged.

V3.54: Corrected project intro using the actual .project-title-wrap selector. Mobile intro now moves below artwork. Desktop retains overlay composition but adds a restrained translucent dark glass panel for reliable readability over light artwork.

## V3.56 — Portfolio hero information bar
- Removed the floating dark title/description card from desktop project heroes.
- Added a full-width information bar anchored to the bottom of the hero.
- Project type now sits above the project title on the left.
- Description is separated horizontally on the right with a subtle divider.
- Responsive layout stacks cleanly on mobile while retaining the same hierarchy.

V3.60: Returned to V3.56 project hero baseline. Added same-render full-bleed cover background plus complete contained foreground artwork with left-to-right reveal, fade and subtle scale. Existing horizontal info bar retained.
