# Microsoft Edge Alternative Sidebar

An alternative way to open any website in the Microsoft Edge sidebar (also known as the side panel).

## Installation and Setup

- Open `manifest.json` and customize the `name` and `custom_config.target_url` fields
- Replace `icon.png` with your own icon if desired
- Open any Chromium-based browser and navigate to the Extensions page
- Enable `Developer Mode`
- Click `Load Unpacked` and select the extension folder
- Pin the extension to the toolbar for quick access
- Click the extension icon to open your configured website in the sidebar

## Limitations

- Closing the sidebar terminates the session completely, meaning there is no background process running
- The sidebar does not remember or save your previously adjusted window size