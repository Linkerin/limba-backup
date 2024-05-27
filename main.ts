import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { PrismaClient } from '@prisma/client';

import { Database } from './supabase';

const supabaseUrl = 'https://epzcxetjipqthrjrvzcu.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || '';
const supabase = createClient<Database>(supabaseUrl, supabaseKey);

const prisma = new PrismaClient();

async function updateSets() {
  try {
    let sets;
    const lastSet = await prisma.sets.findFirst({
      select: { id: true, created_at: true },
      orderBy: { created_at: 'desc' }
    });

    if (lastSet?.created_at) {
      const { data, error } = await supabase
        .from('sets')
        .select('*')
        .gt('created_at', JSON.stringify(lastSet.created_at));
      if (error) throw error;

      sets = data.filter(record => record.id !== lastSet.id);
    } else {
      const { data, error } = await supabase.from('sets').select('*');
      if (error) throw error;

      sets = data;
    }

    if (!sets || sets.length === 0) {
      console.log(`No sets recorded. Timestamp: ${new Date().toUTCString()}`);
      return;
    }

    const recordSets = await prisma.sets.createMany({
      data: sets
    });

    console.log('Recorded sets:', recordSets.count);
    console.log(`Timestamp: ${new Date().toUTCString()}`);
  } catch (error) {
    console.error('Caught error while backing up sets list:');
    console.error(error);
  }
}

async function updateWords() {
  try {
    let words;
    const lastWord = await prisma.words.findFirst({
      select: { id: true, created_at: true },
      orderBy: { created_at: 'desc' }
    });

    if (lastWord?.created_at) {
      const { data, error } = await supabase
        .from('words')
        .select('*')
        .gt('created_at', JSON.stringify(lastWord.created_at));
      if (error) throw error;

      words = data.filter(record => record.id !== lastWord.id);
    } else {
      const { data, error } = await supabase.from('words').select('*');
      if (error) throw error;

      words = data;
    }

    if (!words || words.length === 0) {
      console.log(`No words recorded. Timestamp: ${new Date().toUTCString()}`);
      return;
    }

    const filteredWords = words.map(record => {
      if (record.en_alternatives !== null) return record;

      const result = { ...record, en_alternatives: undefined };

      return result;
    });

    const recordSets = await prisma.words.createMany({
      data: filteredWords
    });

    console.log('Recorded words:', recordSets.count);
    console.log(`Timestamp: ${new Date().toUTCString()}`);
  } catch (error) {
    console.error('Caught error while backing up words list:');
    console.error(error);
  }
}

updateSets();
updateWords();
