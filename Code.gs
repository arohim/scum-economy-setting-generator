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

function exportToJsonFile(beautifulFormat){
  var ui = SpreadsheetApp.getUi();
  var jsonStr = makeJsonString(beautifulFormat);
  // Logger.log(jsonStr);
  displayTexts_(jsonStr);
}

function makeJsonString(beautifulFormat){
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
  // var json = JSON.stringify(obj);
  var json = null;
  if(beautifulFormat){
    json = JSON.stringify(obj, null, '\t');
  } else {
    json = JSON.stringify(obj);
  }
  return json;
}

function makeTraders() {
  var A_0_Armory = getShopConfigurations("A_0_Armory");
  var A_0_BoatShop = getShopConfigurations("A_0_BoatShop");
  var A_0_Mechanic = getShopConfigurations("A_0_Mechanic");
  var A_0_Trader = getShopConfigurations("A_0_Trader");
  var B_4_Armory = getShopConfigurations("B_4_Armory");
  var B_4_BoatShop = getShopConfigurations("B_4_BoatShop");
  var B_4_Mechanic = getShopConfigurations("B_4_Mechanic");
  var B_4_Trader = getShopConfigurations("B_4_Trader");
  var C_2_Armory = getShopConfigurations("C_2_Armory");
  var C_2_BoatShop = getShopConfigurations("C_2_BoatShop");
  var C_2_Mechanic = getShopConfigurations("C_2_Mechanic");
  var C_2_Trader = getShopConfigurations("C_2_Trader");
  var Z_3_Armory = getShopConfigurations("Z_3_Armory");
  var Z_3_BoatShop = getShopConfigurations("Z_3_BoatShop");
  var Z_3_Mechanic = getShopConfigurations("Z_3_Mechanic");
  var Z_3_Trader = getShopConfigurations("Z_3_Trader");

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

function getShopConfigurations(sheetName) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if(sheet == null)
    return [];

  var tradeableCodeHeader = "tradeable-code";
  var basePurchasePriceHeader = "base-purchase-price";
  var baseSellPriceHeader = "base-sell-price";
  var deltaPriceHeader = "delta-price";
  var canBePurchasedHeader = "can-be-purchased";

  var items = [];
  var dataValues = sheet.getRange(2, 1, sheet.getMaxRows(), sheet.getMaxColumns()).getValues();
  for(var i=0;i<sheet.getMaxRows() - 1;i++){
    var tradeableCodeValue = dataValues[i][0];
    if(tradeableCodeValue == ""){
      continue;
    }
    var item = {
      [tradeableCodeHeader] : tradeableCodeValue,
      [basePurchasePriceHeader] : dataValues[i][1],
      [baseSellPriceHeader] : dataValues[i][2],
      [deltaPriceHeader] : dataValues[i][3],
      [canBePurchasedHeader] : dataValues[i][4],
    }
    items.push(item);
  }
  return items;
}

function makeLimitedTradeables() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("limited-tradable-vehicles");
  var limitedVehicles = [];
  var dataValues = sheet.getRange(2, 1, sheet.getMaxRows(), sheet.getMaxColumns()).getValues();
  for(var i=0;i<sheet.getMaxRows() - 1;i++){
    var vehicleGroup = dataValues[i][0];
    var vehicleGroupMaxAmount = dataValues[i][1].toString();

    if(vehicleGroup == ""){
      break;
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


