# Arrow Escape Fonts

Use bundled, redistributable font files here when a display or body font is
added. The game must remain readable when the files are unavailable, so every
font is paired with the fallback stack in `frontend/src/styles/tokens.css`.

Do not load a remote font as a gameplay dependency. Record the font license and
the intended `--ae-font-display` or `--ae-font-body` token before adding a file.
