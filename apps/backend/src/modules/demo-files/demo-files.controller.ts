import { Controller, Get, NotFoundException, Param, Res, StreamableFile } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';
import type { Response } from 'express';
import { Public } from '../../common/decorators';

const ALLOWED = new Set([
  'pld-2021-sc-1-bail.pdf',
  'constitution-art-10a.pdf',
  'ira-2012-labour.pdf',
]);

function resolveDemoPath(fileName: string): string | null {
  const candidates = [
    join(process.cwd(), 'public', 'demo', fileName),
    join(process.cwd(), 'apps', 'backend', 'public', 'demo', fileName),
    join(__dirname, '..', '..', '..', 'public', 'demo', fileName),
  ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

@ApiExcludeController()
@Controller('demo')
export class DemoFilesController {
  @Public()
  @Get(':fileName')
  getDemoPdf(
    @Param('fileName') fileName: string,
    @Res({ passthrough: true }) res: Response,
  ): StreamableFile {
    if (!ALLOWED.has(fileName) || fileName.includes('..')) {
      throw new NotFoundException('Demo file not found');
    }

    const filePath = resolveDemoPath(fileName);
    if (!filePath) {
      throw new NotFoundException('Demo file not found on disk');
    }

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${fileName}"`,
      'Cache-Control': 'public, max-age=3600',
    });

    return new StreamableFile(createReadStream(filePath));
  }
}
