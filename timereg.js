rtl.module("timereg",["System","Classes","Avamm","webrouter"],function () {
  "use strict";
  var $mod = this;
  this.ShowTimereg = function (URl, aRoute, Params) {
    pas.System.Writeln("Timereg should be shown");
  };
  $mod.$resourcestrings = {strTimeregistering: {org: "Zeiterfassung"}};
  $mod.$init = function () {
    pas.System.Writeln("Hello World from Timereg...");
    pas.Avamm.RegisterSidebarRoute(rtl.getResStr(pas.timereg,"strTimeregistering"),"timeregistering",$mod.ShowTimereg);
  };
});
