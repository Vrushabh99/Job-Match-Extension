export async function loadResume(): Promise<string> {
  const { resume } = await chrome.storage.local.get("resume");
  return typeof resume === "string" ? resume : "";
}

export function saveResume(resume: string): Promise<void> {
  return chrome.storage.local.set({ resume });
}
