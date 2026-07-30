import { FileBlob, SpreadsheetFile } from '@oai/artifact-tool';
import fs from 'node:fs/promises';

const path = 'C:/Users/andre/Downloads/Copia de Historias de Usuario BonoGas AH 12052026.xlsx';
const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(path));
const sheets = await workbook.inspect({ kind: 'sheet', include: 'id,name', maxChars: 12000 });
const overview = await workbook.inspect({
  kind: 'workbook,sheet,table',
  maxChars: 30000,
  tableMaxRows: 20,
  tableMaxCols: 12,
  tableMaxCellChars: 300,
});
await fs.writeFile('work/bonogas_hu_inspect.txt', `SHEETS\n${sheets.ndjson}\nOVERVIEW\n${overview.ndjson}\n`, 'utf8');
