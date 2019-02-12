/*
* @author skitsanos
*/
function doGet(e)
{
    var result;

    if (e.parameter === undefined)
    {
        return response({error: 'No data provided'});
    }

    if (e.parameter.sheetId === undefined)
    {
        return response({error: 'Sheet ID is undefined'});
    }

    if (e.parameter.deviceId === undefined)
    {
        return response({error: 'Device-ID is undefined'});
    }

    var id = e.parameter.sheetId;//docs.google.com/spreadsheetURL/d
    var sheet = SpreadsheetApp.openById(id).getSheetByName(e.parameter.deviceId);

    if (sheet === null) //sheet is not found, create a new one
    {
        sheet = SpreadsheetApp.openById(id).insertSheet();
        sheet.setName(e.parameter.deviceId);
    }

    var newRow = sheet.getLastRow() + 1;
    var rowData = [(new Date())]; //add timestamp

    var ndx = 1;

    delete(e.parameter.deviceId);
    delete(e.parameter.sheetId);

    for (var param in e.parameter)
    {
        rowData[ndx] = stripQuotes(e.parameter[param]);

        ndx++;
    }

    // Write new row below
    var newRange = sheet.getRange(newRow, 1, 1, rowData.length);
    newRange.setValues([rowData]);

    return response({result: {sheetId: sheet.getName(), rowId: newRow}});
}

function response(result)
{
    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Remove leading and trailing single or double quotes
 */
function stripQuotes(value)
{
    return value.replace(/^["']|['"]$/g, '');
}
