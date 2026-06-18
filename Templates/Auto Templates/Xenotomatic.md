<%*

// ==**AUTO TEMPLATES**==

const title = tp.file.title;
const isUntitled = title.startsWith("Untitled");

const templateMoment = tp.file.find_tfile(`AutoMoment.md`); 
const templateThing = tp.file.find_tfile(`AutoThing.md`);
const templateCrossmatch = tp.file.find_tfile(`AutoCrossmatch`);

// Give Obsidian a tiny fraction of a second to register plugin-inserted text
// await new Promise(r => setTimeout(r, 01)); 

const content = await tp.file.content;

// If the file already has text (inserted by your Base/Button), ~~stop the script!~~ *insert Crossmatch*
if (content.length > 0) {
    // 1. Get the current file being processed by Templater
    const currentFile = tp.config.target_file;
    // 2. Fetch its metadata cache
    const fileCache = app.metadataCache.getFileCache(currentFile);
    // 3. Define the property you are looking for
    const targetProperty = "Engaged";
    // 4. Check if frontmatter exists, and then check if the property is in it
    if (fileCache?.frontmatter && fileCache.frontmatter[targetProperty] === undefined) {
        tR += await tp.file.include(templateCrossmatch);
    }
} else if (isUntitled) {
    // Appends the fetched content to the actual page
    tR += await tp.file.include(templateMoment);
} else {
    tR += await tp.file.include(templateThing);
}



/////////////////////////////////////////

// ==**INDEXER SCRIPT**==

const indexFilename = 'Index.md';
const allFiles = app.vault.getMarkdownFiles();
const indexFile = allFiles.find(f => f.name === indexFilename);

if (indexFile) {
  // Optimized filter using a for loop
  const files = [];
  for (const f of allFiles) {
    if (f.extension === 'md' && f !== indexFile) {
      files.push(f);
    }
  }

  // Generate the markdown list
  let list = files.map(f => `- [[${f.basename}]]`).join('\n');

  // Read and update the Index file between markers
  let indexContent = await app.vault.read(indexFile);
  const startMarker = "<!-- START LIST -->";
  const endMarker = "<!-- END LIST -->";
  const regex = new RegExp(`${startMarker}[\\s\\S]*?${endMarker}`, 'g');

  if (indexContent.includes(startMarker) && indexContent.includes(endMarker)) {
    indexContent = indexContent.replace(regex, `${startMarker}\n${list}\n${endMarker}`);
  } else {
    indexContent += `\n${startMarker}\n${list}\n${endMarker}`;
  }

  // Save the changes
  await app.vault.modify(indexFile, indexContent);
  new Notice('Index updated automatically!');
} else {
  new Notice('Index.md not found!');
}

%>