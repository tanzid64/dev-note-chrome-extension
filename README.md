# 🔑 DevNotes — Chrome Extension

A minimal Chrome extension for storing dev credentials, tokens, and notes with one-click copy. Credentials are blurred by default so they're safe from shoulder-surfing.

---

## Installation

> No Chrome Web Store account needed. Runs entirely locally.

1. Clone or download this repository to your machine.

2. Open Chrome and navigate to:
   ```
   chrome://extensions/
   ```

3. Enable **Developer mode** using the toggle in the top-right corner.

4. Click **Load unpacked** (top-left).

5. Select the `note-extension` folder and click **Open**.

6. Click the 🧩 puzzle piece icon in Chrome's toolbar and **pin DevNotes** so it's always one click away.

---

## Features

### One-click copy
Hit the blue **Copy** button on any note to copy its full content to the clipboard instantly — no need to reveal the content first.

### Blur by default
All note content is blurred when the popup opens. Click **Show** to reveal a specific note. This prevents credentials from being exposed when someone is looking over your shoulder.

### Line-level copy
When a note is revealed, click any individual line to copy just that line (e.g. copy only the password, or only the token). A green flash confirms the copy.

### Search / filter
Type in the search bar to filter notes by title or content in real time.

### Keyboard shortcut
Press `Ctrl+Enter` inside the content field to save a note without reaching for the mouse.

### Persistent storage
Notes are saved to `chrome.storage.local` — they survive browser restarts and extension reloads.

---

## Usage

### Adding a note
1. Enter a **title** (e.g. `Staging DB`, `AWS Dev`, `GitHub Token`)
2. Paste or type the **content** (credentials, connection strings, tokens, etc.)
3. Click **Save** or press `Ctrl+Enter`

### Copying credentials
| Goal | Action |
|---|---|
| Copy everything | Click the blue **Copy** button |
| Copy one line | Click **Show**, then click the specific line |
| Copy without revealing | Use the **Copy** button directly — content stays blurred |

### Managing notes
- **Show / Hide** — toggle visibility of a note's content
- **✕** — delete a note permanently
- **Search bar** — filter notes by title or content

---

## File Structure

```
note-extension/
├── manifest.json   # Chrome extension config (Manifest V3)
├── popup.html      # Extension popup UI
├── popup.css       # Styles (dark theme)
├── popup.js        # Logic — storage, copy, render
└── icon.svg        # Toolbar icon
```

---

## Updating the extension

After editing any file, go to `chrome://extensions/` and click the **↺ refresh** icon on the DevNotes card to reload the latest code.

---

## Notes on security

- All data is stored locally in `chrome.storage.local` — nothing is sent anywhere.
- This extension does **not** encrypt stored notes. Treat it like a local notepad, not a password manager.
- For sensitive production credentials, use a dedicated secrets manager (e.g. 1Password, Bitwarden, AWS Secrets Manager).
