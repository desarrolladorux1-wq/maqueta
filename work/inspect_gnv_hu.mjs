import { FileBlob, SpreadsheetFile } from '@oai/artifact-tool';

const path = 'C:/Users/andre/Downloads/Historias de Usuario de Ahorro GNV AH 21052026 (3).xlsx';
const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(path));
const summary = await workbook.inspect({
  kind: 'workbook,sheet,table,region',
  maxChars: 30000,
  tableMaxRows: 100,
  tableMaxCols: 15,
  tableMaxCellChars: 500,
});
console.log(summary.ndjson);
