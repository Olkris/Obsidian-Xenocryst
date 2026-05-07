<%*
// Give Obsidian a tiny fraction of a second to register plugin-inserted text
await new Promise(r => setTimeout(r, 50)); 

const content = await tp.file.content;

// If the file already has text (inserted by your Base/Button), stop the script!
if (content.length > 0) {
    return; 
}

const title = tp.file.title;
const isUntitled = title.startsWith("Untitled");

const templateA = tp.file.find_tfile(`✍️Moment.md`); 
const templateB = tp.file.find_tfile(`_📍Thing.md`);

if (isUntitled) {
    // Appends the fetched content to the actual page
    tR += await tp.file.include(templateA);
} else {
    tR += await tp.file.include(templateB);
}
%>
