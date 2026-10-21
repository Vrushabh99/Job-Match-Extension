# JD vs Resume (React + TypeScript)

Chrome extension (Manifest V3) built with Vite, React 18 and TypeScript.
Compares the job posting in your active tab with your resume and lists
matched and missing keywords.

## Build and load
```
npm install
npm run build
```
Then open chrome://extensions, turn on Developer mode, click "Load unpacked"
and choose the `dist` folder.

While developing, run `npm run dev` (rebuilds on save) and press the reload
icon on the extension card after each rebuild.

## Structure
- `public/manifest.json`: copied to `dist` as-is
- `src/App.tsx`: state and scan flow
- `src/components/`: ResumeBox, Results, ChipList
- `src/lib/keywords.ts`: the SKILLS list and `compare()`; edit the list to add terms
- `src/lib/page.ts`: reads the page text with chrome.scripting
- `src/lib/storage.ts`: saves your resume in chrome.storage.local
