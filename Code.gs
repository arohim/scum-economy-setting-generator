function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Scum menu')
    .addItem('To beautiful JSON format', 'exportToBeautifulJsonFormat')
    .addItem('To minify JSON', 'exportToJsonFormat')
    .addToUi();
}

function exportToBeautifulJsonFormat() {
  exportToJsonFile(true);
}

function exportToJsonFormat() {
  exportToJsonFile(false);
}

function exportToJsonFile(beautifulFormat) {
  var ui = SpreadsheetApp.getUi();
  var jsonStr = makeJsonString(beautifulFormat);
  // Logger.log(jsonStr);
  displayTexts_(jsonStr);
}

function makeJsonString(beautifulFormat) {
  var app = SpreadsheetApp;
  var ui = app.getUi();

  var rootSheet = app.getActiveSpreadsheet().getSheetByName("main-setting");
  var enableEconomy = rootSheet.getRange("B2").getValue().toString();
  var economyResetTimeHours = rootSheet.getRange("B3").getValue().toString();
  var pricesRandomizationTimeHours = rootSheet.getRange("B4").getValue().toString();
  var fullyRestockTradeableHours = rootSheet.getRange("B5").getValue().toString();
  var traderFundsChangeRatePerHourMultiplier = rootSheet.getRange("B6").getValue().toString();
  var tradersUnlimitedFunds = rootSheet.getRange("B7").getValue().toString();
  var limitedTradeables = makeLimitedTradeables();
  var traders = makeTraders();

  var obj = {
    "economy-override": {
      "enable-economy": enableEconomy,
      "economy-reset-time-hours": economyResetTimeHours,
      "prices-randomization-time-hours": pricesRandomizationTimeHours,
      "fully-restock-tradeable-hours": fullyRestockTradeableHours,
      "trader-funds-change-rate-per-hour-multiplier": traderFundsChangeRatePerHourMultiplier,
      "traders-unlimited-funds": tradersUnlimitedFunds,
      "limited-tradeables": limitedTradeables,
      "traders": traders
    }
  };
  // Converting JS object to JSON string
  var json = null;
  if (beautifulFormat) {
    json = JSON.stringify(obj, null, '\t');
  } else {
    json = JSON.stringify(obj);
  }
  return json;
}

function makeTraders() {
  var [A_0_Mechanic, B_4_Mechanic, C_2_Mechanic, Z_3_Mechanic] = [{}, {}, {}, {}];
  var [A_0_Armory, B_4_Armory, C_2_Armory, Z_3_Armory] = [{}, {}, {}, {}];
  var [A_0_Trader, B_4_Trader, C_2_Trader, Z_3_Trader] = [{}, {}, {}, {}];
  var [A_0_BoatShop, B_4_BoatShop, C_2_BoatShop, Z_3_BoatShop] = [{}, {}, {}, {}];

  var allShopSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("All_Shop");
  var isAllShopSheetAvailable = allShopSheet != null;
  if (isAllShopSheetAvailable) {
    var allShopData = getDataByShopType("Shop");
    [A_0_Mechanic, B_4_Mechanic, C_2_Mechanic, Z_3_Mechanic] = allShopData;
    [A_0_Armory, B_4_Armory, C_2_Armory, Z_3_Armory] = allShopData;
    [A_0_Trader, B_4_Trader, C_2_Trader, Z_3_Trader] = allShopData;
    [A_0_BoatShop, B_4_BoatShop, C_2_BoatShop, Z_3_BoatShop] = allShopData;
  } else {
    [A_0_Mechanic, B_4_Mechanic, C_2_Mechanic, Z_3_Mechanic] = getDataByShopType("Mechanic");
    [A_0_Armory, B_4_Armory, C_2_Armory, Z_3_Armory] = getDataByShopType("Armory");
    [A_0_Trader, B_4_Trader, C_2_Trader, Z_3_Trader] = getDataByShopType("Trader");
    [A_0_BoatShop, B_4_BoatShop, C_2_BoatShop, Z_3_BoatShop] = getDataByShopType("BoatShop");
  }
  return {
    "A_0_Armory": A_0_Armory,
    "A_0_BoatShop": A_0_BoatShop,
    "A_0_Mechanic": A_0_Mechanic,
    "A_0_Trader": A_0_Trader,
    "B_4_Armory": B_4_Armory,
    "B_4_BoatShop": B_4_BoatShop,
    "B_4_Mechanic": B_4_Mechanic,
    "B_4_Trader": B_4_Trader,
    "C_2_Armory": C_2_Armory,
    "C_2_BoatShop": C_2_BoatShop,
    "C_2_Mechanic": C_2_Mechanic,
    "C_2_Trader": C_2_Trader,
    "Z_3_Armory": Z_3_Armory,
    "Z_3_BoatShop": Z_3_BoatShop,
    "Z_3_Mechanic": Z_3_Mechanic,
    "Z_3_Trader": Z_3_Trader
  };
}

function getDataByShopType(shopType) {
  var a0Shop = {};
  var b4Shop = {};
  var c2Shop = {};
  var z3Shop = {};
  var allShopTypeSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("All_" + shopType);
  var isSheetAvailable = allShopTypeSheet != null;
  if (isSheetAvailable) {
    var allData = getShopConfigurations("All_" + shopType);
    a0Shop = allData;
    b4Shop = allData;
    c2Shop = allData;
    z3Shop = allData;
  } else {
    a0Shop = getShopConfigurations("A_0_" + shopType);
    b4Shop = getShopConfigurations("B_4_" + shopType);
    c2Shop = getShopConfigurations("C_2_" + shopType);
    z3Shop = getShopConfigurations("Z_3_" + shopType);
  }
  return [a0Shop, b4Shop, c2Shop, z3Shop];
}

function getShopConfigurations(sheetName) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (sheet == null)
    return [];

  var tradeableCodeHeader = "tradeable-code";
  var basePurchasePriceHeader = "base-purchase-price";
  var baseSellPriceHeader = "base-sell-price";
  var deltaPriceHeader = "delta-price";
  var canBePurchasedHeader = "can-be-purchased";

  var items = [];
  var dataValues = sheet.getRange(2, 1, sheet.getMaxRows(), sheet.getMaxColumns()).getValues();
  for (var i = 0; i < sheet.getMaxRows() - 1; i++) {
    var tradeableCodeValue = dataValues[i][0];
    var basePurchasePriceValue = dataValues[i][1].toString();
    var baseSellPriceValue = dataValues[i][2].toString();
    var deltaPriceValue = dataValues[i][3].toString();
    var canBePurchasedHeaderValue = dataValues[i][4].toString();

    if (isDefaultOrEmptyItem(tradeableCodeValue, basePurchasePriceValue, baseSellPriceValue, deltaPriceValue, canBePurchasedHeaderValue)) {
      continue;
    }
    var item = {
      [tradeableCodeHeader]: tradeableCodeValue,
      [basePurchasePriceHeader]: basePurchasePriceValue,
      [baseSellPriceHeader]: baseSellPriceValue,
      [deltaPriceHeader]: deltaPriceValue,
      [canBePurchasedHeader]: canBePurchasedHeaderValue,
    }
    items.push(item);
  }
  return items;
}

function isDefaultOrEmptyItem(tradeableCodeValue, basePurchasePriceValue, baseSellPriceValue, deltaPriceValue, canBePurchasedHeaderValue) {
  return tradeableCodeValue == "" || (
    basePurchasePriceValue == "-1" &&
    baseSellPriceValue == "-1" &&
    deltaPriceValue == "-1" &&
    (canBePurchasedHeaderValue == "default" || canBePurchasedHeaderValue == "true")
  )
}

function makeLimitedTradeables() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("limited-tradable-vehicles");
  var limitedVehicles = [];
  var dataValues = sheet.getRange(2, 1, sheet.getMaxRows(), sheet.getMaxColumns()).getValues();
  for (var i = 0; i < sheet.getMaxRows() - 1; i++) {
    var vehicleGroup = dataValues[i][0];
    var vehicleGroupMaxAmount = dataValues[i][1].toString();

    if (vehicleGroup == "") {
      continue;
    } else {
      limitedVehicles.push({
        "vehicle-group": vehicleGroup,
        "vehicle-group-max-amount": vehicleGroupMaxAmount
      });
    }
  }

  return {
    "limited-vehicles": limitedVehicles
  };
}

function makeTextBox(content) {
  return '<div style="font-size:12;">Select all and copy to your server</div><br/><textarea style="height: 560px; width: 100%;">' + content + '</textarea>';
}

function displayTexts_(texts) {
  var app = HtmlService.createHtmlOutput().setWidth(1000).setHeight(1000);
  app.append(makeTextBox(texts))
  SpreadsheetApp.getUi().showModalDialog(app, "EconomyOverride.json");
  return app;
}


