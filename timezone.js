module.exports = {
getTZOffset : function (tz) {
  switch (tz) {
    case "Alaska Standard Time":
      return "-0900";
    case "Alaska Daylight Time":
      return "-0800";
    case "Eastern Standard Time":
      return "-0500";
    case "Eastern Daylight Time":
      return "-0400";
    case "Central Standard Time":
      return "-0600";
    case "Central Daylight Time":
      return "-0500";
    case "Mountain Standard Time":
      return "-0700";
    case "Mountain Daylight Time":
      return "-0600";
    case "Pacific Standard Time":
      return "-0800";
    case "Pacific Daylight Time":
      return "-0700";
    case "Hawaii-Aleutian Standard Time":
      return "-1000";
    case "Hawaii-Aleutian Daylight Time":
      return "-0900";
    case "Samoa Standard Time":
      return "-1100";
    case "Chamorro Standard Time":
      return "+1000";
    default:
      return "+0000";
  }
}
};