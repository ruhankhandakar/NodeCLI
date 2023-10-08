export const listNotes = (notes) => {
  notes.forEach(({ id, tags, content }) => {
    console.log('\n');
    console.log('id: ', id);
    console.log('tags: ', tags.join(', '));
    console.log('note: ', content);
  });
};
