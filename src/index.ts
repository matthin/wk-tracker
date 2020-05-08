interface Item {
  readonly category: string;
  readonly name: string;
}

function isItem(obj: any): obj is Item {
  return (
    obj !== "undefined" &&
    typeof obj.category === "string" &&
    typeof obj.name === "string"
  );
}

function extractItems(elements: NodeListOf<Element>): Item[] {
  return Array.from(elements).map(e => {
    return {
      category: e.getAttribute("class"),
      name: e.textContent
    };
  }).filter(isItem);
}

async function saveSession(correct: Item[], incorrect: Item[], d: Date) {
  const latest = await getStorage("latest") as number;
  if (d <= new Date(latest)) {
    return;
  }

  await browser.storage.local.set({
    "latest": d.getTime()
  });

  await setStorage(d.getTime(), { correct: correct, incorrect: incorrect });
}

async function getStorage(key: string): Promise<any> {
  const r = await browser.storage.local.get(key);
  return r[key];
}

async function setStorage(k: number, v: any): Promise<void> {
  await browser.storage.local.set({[k]: JSON.stringify(v)});
}

(async function() {
  const correct = extractItems(document.querySelectorAll("#correct li"));
  const incorrect = extractItems(document.querySelectorAll("#incorrect li"));

  const sessionDate = document.querySelector("#last-session-date time")
                              ?.getAttribute("datetime")!;
  
  await saveSession(correct, incorrect, new Date(sessionDate)); 
})();
