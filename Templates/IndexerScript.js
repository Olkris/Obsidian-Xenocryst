class IndexerScript {
  constructor() {
    // Explicitly set this.app from global (runs auto on load)
    this.app = app;

    // Register listener for file creation
    this.handleFileCreate = this.handleFileCreate.bind(this);
    this.app.vault.on('create', this.handleFileCreate);
  }

  deconstructor() {
    // Clean up listener on reload/unload
    this.app.vault.off('create', this.handleFileCreate);
  }

  async invoke() {
    // No params; use existing this.app (set in constructor)
    await this.updateIndex();

    new Notice('UpdateIndexOnCreate invoked manually and updated index!'); // Mobile test: Pops on invoke
  }

  async handleFileCreate(file) {
    if (file.extension !== 'md') return; // Skip non-Markdown files

    await this.updateIndex();
  }

  async updateIndex() {
    // Index update logic (uses this.app directly)
    const indexFilename = 'Index.md';
    const allFiles = this.app.vault.getMarkdownFiles();
    const indexFile = allFiles.find(f => f.path.endsWith(indexFilename));
    if (!indexFile) return;

    // Optimized filter with a for loop (no callback overhead)
    const files = [];
    for (const f of allFiles) {
      if (f.extension === 'md' && f !== indexFile) {
        files.push(f);
      }
    }

    // Generate list (no sort, as requested)
    let list = files.map(f => `- [[${f.basename}]]`).join('\n');

    // Update between markers (add <!-- START LIST --> and <!-- END LIST --> to your index file if not present)
    let indexContent = await this.app.vault.read(indexFile);
    const startMarker = "<!-- START LIST -->";
    const endMarker = "<!-- END LIST -->";
    const regex = new RegExp(`${startMarker}[\\s\\S]*?${endMarker}`, 'g');
    if (indexContent.includes(startMarker) && indexContent.includes(endMarker)) {
      indexContent = indexContent.replace(regex, `${startMarker}\n${list}\n${endMarker}`);
    } else {
      indexContent += `\n${startMarker}\n${list}\n${endMarker}`;
    }

    await this.app.vault.modify(indexFile, indexContent);
  }
}