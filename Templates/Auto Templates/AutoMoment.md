---
Engaged: <%*
// 1. Find the file named "Today.md"
const todayFile = app.vault.getMarkdownFiles().find(f => f.name === 'Today.md');
let dateValue = "";

if (todayFile) {
  // 2. Access Obsidian's metadata cache for Today.md
  const fileCache = app.metadataCache.getFileCache(todayFile);
  
  // 3. Extract the 'date' property from Today.md's frontmatter
  // (Change .date here if your property in Today.md has a different name, e.g., .journal_date)
  if (fileCache?.frontmatter?.Engaged) {
    dateValue = fileCache.frontmatter.Engaged;
  }
}

// 4. Fallback: If Today.md or the property is missing, use the current system date
if (!dateValue) {
  dateValue = tp.date.now("YYYY-MM-DD");
}

// 5. Insert the value cleanly into the current note's frontmatter
tR += dateValue;
%>
Discusses:
---
