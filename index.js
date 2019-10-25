const fs = require("fs");

const countryCodeToName = JSON.parse(fs.readFileSync("countyCodeToName.json", { encoding: "utf-8" }));
//Get latest file from here: https://s3.amazonaws.com/aws-sms-pricing-info-prod-us-east-1/sms_pricelist_inbound.json
const smsInboundPrices = JSON.parse(fs.readFileSync("sms_pricelist_inbound.json", { encoding: "utf-8" }));
//Get latest file from here: https://s3.amazonaws.com/aws-sms-pricing-info-prod-us-east-1/smsPricesAndDeliverability-latest.json
const smsOutBoundPrices = JSON.parse(fs.readFileSync("smsPricesAndDeliverability-latest.json", { encoding: "utf-8" }));
const priceList = ["CountryName,CountryCode,Inbound Price,Provider,OutBoundTransactional Price,OutBound Promotional Price,OutBound OTP Price"];
for (let countryCode in countryCodeToName) {
    let countryOutBoundPrices = smsOutBoundPrices[countryCode];
    let countryInboundPrice = smsInboundPrices[countryCode];
    if (!countryOutBoundPrices || !countryInboundPrice) {
        continue;
    }
    for (let countryOutBoundPrice of countryOutBoundPrices) {
        const priceForCountry = `${countryCodeToName[countryCode]},${countryCode},${countryInboundPrice},${countryOutBoundPrice.name},${countryOutBoundPrice.transPrice},${countryOutBoundPrice.promoPrice},${countryOutBoundPrice.otpPrice || ""}`;
        priceList.push(priceForCountry);
    }
}
fs.writeFileSync("pinpoint_prices.csv", priceList.join("\n"), { encoding: "utf-8" });
