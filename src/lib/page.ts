export type PageText = {
  title: string;
  text: string;
  usedSelection: boolean;
};

// Injected into the job posting page, so it must stay self-contained: it can
// only use browser globals, not anything imported in this bundle.
// Uses your selection when you selected the description (less noise from
// menus and footers), otherwise the whole page.
export function readPage(): PageText {
  const selection = window.getSelection()?.toString().trim() ?? "";
  const usedSelection = selection.length > 200;
  return {
    title: document.title,
    text: usedSelection ? selection : document.body.innerText,
    usedSelection,
  };
}

export async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

export async function scanActiveTab(): Promise<PageText> {
  const tab = await getActiveTab();
  if (tab?.id === undefined) throw new Error("No active tab");
  const [injection] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: readPage,
  });
  return injection.result as PageText;
}
