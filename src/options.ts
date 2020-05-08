interface Item {
  readonly category: string;
  readonly name: string;
}

interface Session {
  readonly correct: Item[],
  readonly incorrect: Item[],
  readonly timestamp: number
}

document
  .querySelector("#wk-tracker-save")
  ?.addEventListener("click", async ev => {
    const archive = await loadArchive();
    const dlUrl = URL.createObjectURL(
      new Blob([JSON.stringify(archive)], { type: "application/json" })
    );

    await browser.downloads.download({
      url: dlUrl,
      filename: `wk-tracker_${Date.now()}.json`
    });

  });

async function loadArchive(): Promise<Session[]> {
  let archive: Session[] = [];

  const dump = await browser.storage.local.get(undefined);
  delete dump["latest"];

  for (const k in dump) {
    const v = JSON.parse(dump[k]?.toString() ?? "");
    archive.push({
      correct: v["correct"],
      incorrect: v["incorrect"],
      timestamp: Number(k)
    });
  }

  return archive;
}
