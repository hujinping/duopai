import xlrd
from collections import OrderedDict
import json
import codecs
import os

Const_Xlsx_Format = [".xlsx"]
fileList = []
xlsxsDir="C:/Users/cici/Desktop/xlsx/"



def FindFile(dirr,filtrate = 1):
    global Const_Xlsx_Format

    for s in os.listdir(dirr):
        newDir = os.path.join(dirr,s)
        if os.path.isfile(newDir):
            if filtrate:
                    if newDir and(os.path.splitext(newDir)[1] in Const_Xlsx_Format):
                        fileList.append(newDir)
            else:
                fileList.append(newDir)


def IsArray(value):
    for i in range(len(value)):
        if value[i]=='[':
            return True
    return False

def Xlsx2Json(xlsxFile):
    #print("log--------xlsxFile=:",xlsxFile)
    wb = xlrd.open_workbook(xlsxFile)
    convert_list = []
    sh = wb.sheet_by_index(0)
    title = sh.row_values(0)
    for rownum in range(1, sh.nrows):
        rowvalue = sh.row_values(rownum)
        single = OrderedDict()
        for colnum in range(0, len(rowvalue)):
            single[title[colnum]] = rowvalue[colnum]
            if type(rowvalue[colnum])==type(u'kankgang'):
                if IsArray(rowvalue[colnum]):
                    single[title[colnum]] = eval(rowvalue[colnum])
        convert_list.append(single)
        
    j = json.dumps(convert_list)
	
    filename=xlsxFile[len(xlsxsDir):len(xlsxFile)-5]
    with codecs.open('D:/games/Bees/assets/resources/config/'+filename+'.json',"w","utf-8") as f:
        f.write(j)

 

if __name__ == "__main__":
        FindFile(xlsxsDir)
        for file in fileList:
            print("log---------file=:",file)
            Xlsx2Json(file)






