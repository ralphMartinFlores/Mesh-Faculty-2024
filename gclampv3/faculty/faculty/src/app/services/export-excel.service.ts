import { Injectable } from '@angular/core';
import * as fs from 'file-saver';
import { Workbook } from 'exceljs';


@Injectable({
  providedIn: 'root'
})
export class ExportExcelService {

  constructor() { }

  exportExcel(excelData) {

    //Title, Header & Data
    const title = excelData.title;
    const title1 = excelData.title1;
    const title2 = excelData.title2;
    const title3 = excelData.title3;
    const header = excelData.headers
    const data = excelData.data;

    //Create a workbook with a worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(title);


    //Add Row and formatting
    worksheet.mergeCells('A1', 'H1');
    worksheet.mergeCells('A2', 'H2');
    worksheet.mergeCells('A3', 'H3');

    let titleRow1 = worksheet.getCell('A1');
    titleRow1.value = title1;
    titleRow1.font = {
      name: 'Calibri',
      size: 16,
      underline: 'single',
      bold: true,
      color: { argb: '0085A3' }
    }
    titleRow1.alignment = { vertical: 'middle', horizontal: 'left' }


    let titleRow2 = worksheet.getCell('A2');
    titleRow2.value = title2;
    titleRow2.font = {
      name: 'Calibri',
      size: 16,
      underline: 'single',
      bold: true,
      color: { argb: '0085A3' }
    }
    titleRow2.alignment = { vertical: 'middle', horizontal: 'left' }

    let titleRow3 = worksheet.getCell('A3');
    titleRow3.value = title3;
    titleRow3.font = {
      name: 'Calibri',
      size: 16,
      underline: 'single',
      bold: true,
      color: { argb: '0085A3' }
    }
    titleRow3.alignment = { vertical: 'middle', horizontal: 'left' }

    // Date
    // worksheet.mergeCells('G1:H4');
    let d = new Date();
    let date = (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getFullYear();
    // let dateCell = worksheet.getCell('G1');
    // dateCell.value = date;
    // dateCell.font = {
    //   name: 'Calibri',
    //   size: 12,
    //   bold: true
    // }
    // dateCell.alignment = { vertical: 'middle', horizontal: 'center' }

    //Add Image
    // let myLogoImage = workbook.addImage({
    //   base64: logo.imgBase64,
    //   extension: 'png',
    // });
    // worksheet.mergeCells('A1:B4');
    // worksheet.addImage(myLogoImage, 'A1:B4');

    //Blank Row 
    worksheet.addRow([]);

    //Adding Header Row
    let headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4167B8' },
        bgColor: { argb: '' }
      }
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFF' },
        size: 12
      }
    })

    // Adding Data
    data.forEach(d => { let row = worksheet.addRow(d); });

    worksheet.getColumn(1).width = 5;
    worksheet.getColumn(1).alignment = { vertical: "middle", horizontal: "center" };
    worksheet.getColumn(2).width = 20;
    worksheet.getColumn(2).alignment = { vertical: "middle", horizontal: "center" };
    worksheet.getColumn(3).width = 50;
    worksheet.getColumn(4).width = 20;
    worksheet.getColumn(4).alignment = { vertical: "middle", horizontal: "center" };
    worksheet.getColumn(5).width = 20;
    worksheet.getColumn(5).alignment = { vertical: "middle", horizontal: "center" };
    worksheet.getColumn(6).width = 20;
    worksheet.getColumn(6).alignment = { vertical: "middle", horizontal: "center" };
    worksheet.getColumn(7).width = 40;
    worksheet.getColumn(7).alignment = { vertical: "middle", horizontal: "center" };
    worksheet.getColumn(8).width = 20;
    worksheet.getColumn(8).alignment = { vertical: "middle", horizontal: "center" };
    worksheet.addRow([]);

    //Footer Row
    let footerRow = worksheet.addRow(['Student List Generated from R3LAMP on ' + date]);
    footerRow.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFB050' }
    };

    //Merge Cells
    worksheet.mergeCells(`A${footerRow.number}:H${footerRow.number}`);

    //Generate & Save Excel File
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, title + '.xlsx');
    });

  }

  exportScores(excelData){
    const title = excelData.title;
    const title1 = excelData.title1;
    const title2 = excelData.title2;
    const title3 = excelData.title3;
    const header = excelData.headers
    const data = excelData.data;

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lastchar = alphabet.charAt(data[0].length-1)
    
    //Create a workbook with a worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(title);


    //Add Row and formatting
    worksheet.mergeCells('A1', lastchar+'1');
    worksheet.mergeCells('A2', lastchar+'2');
    worksheet.mergeCells('A3', lastchar+'3');

    let titleRow1 = worksheet.getCell('A1');
    titleRow1.value = title1;
    titleRow1.font = {
      name: 'Calibri',
      size: 16,
      underline: 'single',
      bold: true,
      color: { argb: '0085A3' }
    }
    titleRow1.alignment = { vertical: 'middle', horizontal: 'left' }


    let titleRow2 = worksheet.getCell('A2');
    titleRow2.value = title2;
    titleRow2.font = {
      name: 'Calibri',
      size: 16,
      underline: 'single',
      bold: true,
      color: { argb: '0085A3' }
    }
    titleRow2.alignment = { vertical: 'middle', horizontal: 'left' }

    let titleRow3 = worksheet.getCell('A3');
    titleRow3.value = title3;
    titleRow3.font = {
      name: 'Calibri',
      size: 16,
      underline: 'single',
      bold: true,
      color: { argb: '0085A3' }
    }
    titleRow3.alignment = { vertical: 'middle', horizontal: 'left' }

    // Date
    // worksheet.mergeCells('G1:H4');
    let d = new Date();
    let date = (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getFullYear();
    

    //Blank Row 
    worksheet.addRow([]);

    //Adding Header Row
    let headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4167B8' },
        bgColor: { argb: '' }
      }
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFF' },
        size: 12
      }
    })

    // Adding Data
    data.forEach(d => { let row = worksheet.addRow(d); });
    
    worksheet.getColumn(1).width = 5;
    worksheet.getColumn(1).alignment = { vertical: "middle", horizontal: "center" };
    worksheet.getColumn(2).width = 20;
    worksheet.getColumn(2).alignment = { vertical: "middle", horizontal: "center" };
    worksheet.getColumn(3).width = 50;

    for(let i = 3; i <data[0].length; i++){
      worksheet.getColumn(i+1).width = 20;
      worksheet.getColumn(i+1).alignment = { vertical: "middle", horizontal: "center" };
    }
  
    worksheet.addRow([]);

    //Footer Row
    let footerRow = worksheet.addRow(['Summary of Scores from R3LAMP on ' + date]);
    footerRow.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFB050' }
    };

    //Merge Cells
    worksheet.mergeCells(`A${footerRow.number}:${lastchar+footerRow.number}`);

    // Generate & Save Excel File
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, title + '.xlsx');
    });
  }
}
