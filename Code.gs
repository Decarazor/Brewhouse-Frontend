// Code.gs - Backend Script

let recipeFolderId = "1Sdp-7u2ZE0uKN1-d8iQYdvCxo1SwQViB";

function doGet() {
  return HtmlService.createHtmlOutputFromFile("BrewTimerUi");
}

function getRecipeFiles() {
  const folder = DriveApp.getFolderById(recipeFolderId);
  const files = folder.getFilesByType(MimeType.GOOGLE_SHEETS);
  const recipes = [];
  while (files.hasNext()) {
    const file = files.next();
    recipes.push({ name: file.getName(), id: file.getId() });
  }
  return recipes;
}

function getRecipeData(fileId) {
  const ss = SpreadsheetApp.openById(fileId);
  const sheet = ss.getSheets()[0];

  const timeRemaining = sheet.getRange("P31:P43").getValues().flat();
  const names = sheet.getRange("A31:A43").getValues().flat();
  const hops = sheet.getRange("M31:M43").getValues().flat();
  const ibus = sheet.getRange("T31:T43").getValues().flat();
  const adjuncts = sheet.getRange("X31:X43").getValues().flat();
  const other = sheet.getRange("AC31:AC43").getValues().flat();
  const batchA = sheet.getRange("AK31:AK43").getValues().flat();
  const batchB = sheet.getRange("AM31:AM43").getValues().flat();

  const preBoilA = sheet.getRange("AU6").getValue();
  const preBoilB = sheet.getRange("AU17").getValue();
  const fermcapA = sheet.getRange("AS30").getValue();
  const fermcapB = sheet.getRange("AU30").getValue();

  const boilTimeA = Number(sheet.getRange("AS29").getValue()) || 0;
  const boilTimeB = Number(sheet.getRange("AU29").getValue()) || 0;

  const additions = names.map((name, i) => {
    const time = Number(timeRemaining[i]);
    return {
      name,
      timeRemaining: isNaN(time) ? null : time,
      hops: Number(hops[i]) || 0,
      ibus: Number(ibus[i]) || 0,
      adjuncts: Number(adjuncts[i]) || 0,
      other: other[i] || "",
      batchA: batchA[i] === "A",
      batchB: batchB[i] === "B"
    };
  }).filter(add => add.name && add.timeRemaining !== null);

  return {
    additions,
    preBoilA,
    preBoilB,
    fermcapA,
    fermcapB,
    boilTimeA,
    boilTimeB
  };
}

function markFermcapUsed(batch) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  const cell = batch === "A" ? sheet.getRange("AS30") : sheet.getRange("AU30");
  cell.setBackground("lime");
  return "Ok!";
}
