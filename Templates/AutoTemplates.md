<%*
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



