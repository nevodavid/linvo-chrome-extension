export const loadStyle = async (tabId: number) => {
    const all = await new Promise((res) => {
        const files = {} as any;
        chrome.runtime.getPackageDirectoryEntry(function (root) {
            root.getDirectory("css", {}, function (fileEntry) {
                fileEntry.createReader().readEntries((en) => {
                    en.forEach((e) => {
                        fileEntry.getFile(e.name, {}, (f) => {
                            f.file((t) =>
                                t.text().then((getText) => {
                                    files[e.name] = getText;
                                    if (Object.keys(files).length === en.length) {
                                        res(files);
                                    }
                                })
                            );
                        });
                    });
                });
            });
        });
    });

    function styles(a: any) {
        // @ts-ignore
        window.getStyles = () => {
            return a;
        };
    }

    const fun = "(" + styles.toString() + `)(${JSON.stringify(all)})`;
    chrome.tabs.executeScript(tabId, {
        code: fun,
        runAt: "document_start",
    });
}
