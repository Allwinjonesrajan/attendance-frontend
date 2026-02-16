import * as XLSX from 'xlsx';

/**
 * Generic Excel Downloader
 * @param {Array} formattedData 
 * @param {String} registerName 
 * @param {String} branch 
 * @param {String} month
 */
export const downloadExcelFile = (formattedData, registerName, branch, month) => {
  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  const finalFileName = `${registerName}_${branch}_${month}.xlsx`;

  XLSX.writeFile(workbook, finalFileName);
};
