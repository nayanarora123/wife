/**
 * Seed script — Migrates existing page-data.json + uploaded files to Supabase.
 *
 * Usage:
 *   npx tsx scripts/seed-supabase.ts
 *
 * What it does:
 *   1. Reads data/page-data.json
 *   2. Uploads all files from public/uploads/ to Supabase Storage
 *   3. Replaces all /uploads/... URLs with Supabase Storage public URLs
 *   4. Inserts the data into the page_store table
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load env from .env.local
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

function getContentType(fileName: string): string {
  const ext = path.extname(fileName).toLowerCase();
  const types: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.mp3': 'audio/mpeg',
    '.mp4': 'video/mp4',
    '.wav': 'audio/wav',
    '.ogg': 'audio/ogg',
    '.webm': 'video/webm',
  };
  return types[ext] || 'application/octet-stream';
}

async function main() {
  console.log('🚀 Starting Supabase data seed...');
  console.log(`   URL: ${SUPABASE_URL}\n`);

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  // ─── 1. Read existing page data ───
  const dataPath = path.join(process.cwd(), 'data', 'page-data.json');
  if (!fs.existsSync(dataPath)) {
    console.error('❌ data/page-data.json not found');
    process.exit(1);
  }

  const rawData = fs.readFileSync(dataPath, 'utf-8');
  let pageData = JSON.parse(rawData);
  console.log('✅ Read data/page-data.json\n');

  // ─── 2. Upload files from public/uploads/ to Supabase Storage ───
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  const urlMap: Record<string, string> = {};

  if (fs.existsSync(uploadsDir)) {
    const files = fs.readdirSync(uploadsDir).filter((f) => {
      const stat = fs.statSync(path.join(uploadsDir, f));
      return stat.isFile();
    });

    console.log(`📁 Uploading ${files.length} files to Supabase Storage...\n`);

    for (const fileName of files) {
      const filePath = path.join(uploadsDir, fileName);
      const stat = fs.statSync(filePath);
      const fileBuffer = fs.readFileSync(filePath);
      const contentType = getContentType(fileName);

      process.stdout.write(
        `   ${fileName} (${(stat.size / 1024 / 1024).toFixed(2)} MB)... `
      );

      const { error } = await supabase.storage
        .from('Media')
        .upload(fileName, fileBuffer, {
          contentType,
          upsert: true,
        });

      if (error) {
        console.log(`❌ ${error.message}`);
        continue;
      }

      const { data: urlData } = supabase.storage
        .from('Media')
        .getPublicUrl(fileName);

      const oldUrl = `/uploads/${fileName}`;
      urlMap[oldUrl] = urlData.publicUrl;
      console.log('✅');
    }

    console.log(`\n   Uploaded ${Object.keys(urlMap).length}/${files.length} files\n`);
  } else {
    console.log('📁 No public/uploads/ directory found, skipping file upload\n');
  }

  // ─── 3. Replace all /uploads/ URLs with Supabase Storage URLs ───
  if (Object.keys(urlMap).length > 0) {
    console.log('🔗 Replacing file URLs in page data...');
    let dataStr = JSON.stringify(pageData);

    for (const [oldUrl, newUrl] of Object.entries(urlMap)) {
      const count = (dataStr.match(new RegExp(escapeRegex(oldUrl), 'g')) || []).length;
      if (count > 0) {
        dataStr = dataStr.replaceAll(oldUrl, newUrl);
        console.log(`   ${oldUrl} → ${newUrl} (${count} occurrences)`);
      }
    }

    pageData = JSON.parse(dataStr);
    console.log('');
  }

  // ─── 4. Insert into page_store ───
  console.log('💾 Saving data to Supabase page_store table...');

  const { error: insertError } = await supabase
    .from('page_store')
    .upsert({
      id: 'default',
      data: pageData,
      updated_at: new Date().toISOString(),
    });

  if (insertError) {
    console.error(`❌ Failed to save: ${insertError.message}`);
    process.exit(1);
  }

  console.log('✅ Data saved successfully!\n');

  // ─── Verify ───
  console.log('🔍 Verifying...');
  const { data: verify, error: verifyError } = await supabase
    .from('page_store')
    .select('id, updated_at')
    .eq('id', 'default')
    .single();

  if (verifyError || !verify) {
    console.error('❌ Verification failed:', verifyError?.message);
    process.exit(1);
  }

  console.log(`   ✅ Found record: id="${verify.id}", updated_at="${verify.updated_at}"\n`);
  console.log('🎉 Seed complete! Your love story is now in Supabase.');
  console.log('   - Database: page_store table has your draft + published data');
  console.log('   - Storage: media bucket has all your photos, videos, and music');
  console.log('\n   Next: Add these env vars to Vercel and redeploy! 🚀');
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

main().catch((err) => {
  console.error('❌ Unexpected error:', err);
  process.exit(1);
});
