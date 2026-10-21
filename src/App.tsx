import { useEffect, useState } from "react";
import { ResumeBox } from "./components/ResumeBox";
import { Results } from "./components/Results";
import { compare, type Comparison } from "./lib/keywords";
import { getActiveTab, scanActiveTab } from "./lib/page";
import { loadResume, saveResume } from "./lib/storage";

type Scan = { comparison: Comparison; usedSelection: boolean };

export default function App() {
  const [resume, setResume] = useState("");
  const [resumeOpen, setResumeOpen] = useState(false);
  const [tabTitle, setTabTitle] = useState("");
  const [scan, setScan] = useState<Scan | null>(null);
  const [message, setMessage] = useState("");
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    loadResume().then((saved) => {
      setResume(saved);
      if (!saved) setResumeOpen(true);
    });
    getActiveTab().then((tab) => setTabTitle(tab?.title ?? ""));
  }, []);

  // The side panel stays open while you browse, so follow the active tab
  // and drop results that belong to a page you've left.
  useEffect(() => {
    const onActivated = () => {
      getActiveTab().then((tab) => setTabTitle(tab?.title ?? ""));
      setScan(null);
      setMessage("");
    };
    const onUpdated = (
      _tabId: number,
      info: chrome.tabs.TabChangeInfo,
      tab: chrome.tabs.Tab
    ) => {
      if (!tab.active) return;
      if (info.title) setTabTitle(info.title);
      if (info.url) {
        setScan(null);
        setMessage("");
      }
    };
    chrome.tabs.onActivated.addListener(onActivated);
    chrome.tabs.onUpdated.addListener(onUpdated);
    return () => {
      chrome.tabs.onActivated.removeListener(onActivated);
      chrome.tabs.onUpdated.removeListener(onUpdated);
    };
  }, []);

  function fail(text: string) {
    setScan(null);
    setMessage(text);
  }

  async function handleScan() {
    setMessage("");
    const trimmed = resume.trim();
    if (!trimmed) {
      setResumeOpen(true);
      return fail("Paste your resume text first, then scan again.");
    }

    setScanning(true);
    try {
      await saveResume(trimmed);
      let page;
      try {
        page = await scanActiveTab();
      } catch {
        return fail(
          "Can't read this page. Open a job posting on a regular website and try again."
        );
      }

      const comparison = compare(page.text, trimmed);
      if (comparison.matched.length + comparison.missing.length === 0) {
        return fail(
          "No known keywords found. Select the job description text on the page and scan again."
        );
      }
      setScan({ comparison, usedSelection: page.usedSelection });
    } finally {
      setScanning(false);
    }
  }

  return (
    <main>
      <header className="mb-3">
        <h1>Posting vs resume</h1>
        <p className="muted title">
          {tabTitle || "Open a job posting, then scan it."}
        </p>
      </header>

      <ResumeBox
        value={resume}
        open={resumeOpen}
        onOpenChange={setResumeOpen}
        onChange={setResume}
        onSave={() => saveResume(resume)}
      />

      <button
        className="primary"
        type="button"
        onClick={handleScan}
        disabled={scanning}
      >
        {scanning ? "Scanning…" : "Scan this page"}
      </button>

      {message && (
        <p className="message" role="status">
          {message}
        </p>
      )}
      {scan && <Results {...scan} />}
    </main>
  );
}