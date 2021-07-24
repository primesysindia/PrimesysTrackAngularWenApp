import { Injectable } from '@angular/core';import * as Excel from "exceljs/dist/exceljs.min.js";
import * as logoFile from './companyLogo.js';
import * as fs from 'file-saver';
import { DatePipe } from 'node_modules/@angular/common';
import { getApprovalBeats} from '../core/beatInfo.model';

@Injectable({
  providedIn: 'root'
})
export class BeatExcelService {

  constructor(private datePipe: DatePipe) { }

  applyStyle(titleRow,subTitleRow,workbook,worksheet,headerRow){
    //report name style
    titleRow.font = { name: 'Times New Roman', family: 4, size: 16, underline: 'double', bold: true }
    titleRow.alignment = {
      horizontal: 'center',
      verticle: 'center'
    }
    //vehicle details & datetime style
    subTitleRow.font = { name: 'Times New Roman', family: 4, size: 12, bold: true }
    subTitleRow.alignment = {
      horizontal: 'center'
    }
    subTitleRow.color = 'blue';
    //rows & cols style
    worksheet.mergeCells('A3:I3');
     worksheet.mergeCells('A1:I2');

    //Add Image
    let logo = workbook.addImage({
      base64: logoFile.logoBase64,
      extension: 'png',
    });
    worksheet.addImage(logo, 'A1:A2');
    //header row Cell Style : Fill and Border
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFF00' },
        bgColor: { argb: 'FF0000FF' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    })
  }

  generateBeatReportExcel(data: Array<getApprovalBeats>,tableHeader) {
    let FileName = 'Keymen Beat Report';
    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet('Report');
    //setFileName
    let subTitleRow;
    //Add Row and formatting
    
    let titleRow = worksheet.addRow(['Keymen Beat Report']);
    worksheet.addRow([]);
    subTitleRow = worksheet.addRow([]);
    
    //Blank Row 
    worksheet.addRow([]);
    //Add Header Row
    let headerRow = worksheet.addRow(['Sr.No','Device Name','Km Start','Km End','Section Name', 'Verification Date']);

    //set style to file
    this.applyStyle(titleRow,subTitleRow,workbook,worksheet,headerRow)
    let i=1;
      data.forEach(item =>{
        let vals=[];
        vals.push(i);
        vals.push(item.Devicename);
        vals.push(item.KmStart);
        vals.push(item.KmEnd);
        vals.push(item.SectionName);
        vals.push(this.datePipe.transform(item.ApprovedDate, 'MMM d, y'));
        worksheet.addRow(vals);
        i++;
      })
      worksheet.getColumn(1).width = 10;
      worksheet.getColumn(2).width = 20;
      worksheet.getColumn(3).width = 10;
      worksheet.getColumn(4).width = 10;
      worksheet.getColumn(5).width = 20;
      worksheet.getColumn(6).width = 20;
      this.saveFile(workbook,FileName)
  }

  saveFile(workbook,fileName){
    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data: any) => {
     let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
     fs.saveAs(blob, fileName+'.xlsx');
   })
 }
}
