# Arrow Escape Accessibility

Arrow tiles are native buttons with labels such as "Arrow at row 2, column 3,
pointing right". Direction is also rendered as a visible arrow glyph, so color
is never the only cue. Focus is visible and controls are sized for touch.

A polite status region announces successful escapes, blocked moves, hints, pause,
and completion. Escape pauses an active level. Pause, resume, restart, return
home, navigation, settings, and completion actions are keyboard reachable.

The game honors both the system `prefers-reduced-motion` preference and the
player setting. Nonessential movement and particles are reduced while state
changes and accessible feedback remain. Sound and vibration are supplemental and
can be disabled without removing essential feedback.

Automated coverage lives in `frontend/tests/accessibility/` and the browser
accessibility/responsive specs. Chrome/Edge manual acceptance must still inspect
focus, labels, live feedback, reduced motion, touch behavior, and contrast.
