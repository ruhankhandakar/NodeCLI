import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import {
  newNote,
  getAllNotes,
  findNotes,
  removeNote,
  removeAllNotes,
} from './notes.js';
import { listNotes } from './utils.js';
import { start } from './server.js';

yargs(hideBin(process.argv))
  .command(
    'new <note>',
    'create a new note',
    (yargs) => {
      return yargs.positional('note', {
        describe: 'The content of the note you want to create',
        type: 'string',
      });
    },
    async (argv) => {
      let tags = argv.tags ? argv.tags.split(',') : [];
      tags = tags.map((tag) => tag.trim());
      const note = await newNote(argv.note, tags);
      console.log('New Notes: ', note);
    }
  )
  .option('tags', {
    alias: 't',
    type: 'string',
    description: 'tags to add to the note',
  })
  .command(
    'all',
    'get all notes',
    () => {},
    async (argv) => {
      const notes = await getAllNotes();
      listNotes(notes);
    }
  )
  .command(
    'find <filter>',
    'get matching notes',
    (yargs) => {
      return yargs.positional('filter', {
        describe:
          'The search term to filter notes by, will be applied to note.content',
        type: 'string',
      });
    },
    async (argv) => {
      const notes = await findNotes(argv.filter);
      listNotes(notes);
    }
  )
  .command(
    'remove <id>',
    'remove a note by id',
    (yargs) => {
      return yargs.positional('id', {
        type: 'number',
        description: 'The id of the note you want to remove',
      });
    },
    async (argv) => {
      const id = await removeNote(argv.id);
      if (!id) {
        return console.log('Note not found');
      }
      console.log(id);
    }
  )
  .command(
    'web [port]',
    'launch website to see notes',
    (yargs) => {
      return yargs.positional('port', {
        describe: 'port to bind on',
        default: 5000,
        type: 'number',
      });
    },
    async (argv) => {
      const notes = await getAllNotes();
      start(notes, argv.port);
    }
  )
  .command(
    'clean',
    'remove all notes',
    () => {},
    async () => {
      await removeAllNotes();
      console.log('DB Reset completed');
    }
  )
  .demandCommand(1)
  .parse();
