import { FileBlob, SpreadsheetFile } from '@oai/artifact-tool';

const inputPath = 'C:/Users/andre/Downloads/Historias de Usuario de Ahorro GNV AH 21052026 (3).xlsx';
const input = await FileBlob.load(inputPath);
const workbook = await SpreadsheetFile.importXlsx(input);
const summary = await workbook.inspect({
  kind: 'workbook,sheet,table,region',
  maxChars: 30000,
  tableMaxRows: 80,
  tableMaxCols: 16,
  tableMaxCellChars: 500,
});
console.log(summary.ndjson);
