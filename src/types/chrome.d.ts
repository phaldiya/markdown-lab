declare namespace chrome {
  namespace runtime {
    function sendMessage(message: unknown): void;
    const onMessage: {
      addListener(
        callback: (message: unknown, sender: unknown, sendResponse: (response?: unknown) => void) => void,
      ): void;
    };
  }
  namespace sidePanel {
    function setPanelBehavior(behavior: { openPanelOnActionClick: boolean }): Promise<void>;
    function setOptions(options: { path?: string; enabled?: boolean; tabId?: number }): Promise<void>;
  }
  namespace contextMenus {
    function create(properties: { id: string; title: string; contexts: string[]; targetUrlPatterns?: string[] }): void;
    const onClicked: {
      addListener(callback: (info: { menuItemId: string; linkUrl?: string }, tab?: { id?: number }) => void): void;
    };
  }
  namespace tabs {
    function create(properties: { url: string }): void;
    const onUpdated: {
      addListener(
        callback: (tabId: number, changeInfo: { url?: string; status?: string }, tab: { id?: number }) => void,
      ): void;
    };
  }
  namespace action {
    function setBadgeText(details: { text: string; tabId?: number }): void;
    function setBadgeBackgroundColor(details: { color: string; tabId?: number }): void;
  }
}
