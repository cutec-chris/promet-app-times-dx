rtl.module("timereg",["System","Web","Classes","Avamm","webrouter","AvammForms"],function () {
  "use strict";
  var $mod = this;
  this.List = null;
  this.ShowTimereg = function (URl, aRoute, Params) {
    var aParent = null;
    pas.System.Writeln("Timereg should be shown");
    if (!($mod.List != null)) {
      aParent = rtl.getObject(pas.Avamm.GetAvammContainer());
      $mod.List = pas.AvammForms.TAvammListForm.$create("Create$1",[aParent,"times"]);
    };
    $mod.List.Show();
  };
  $mod.$resourcestrings = {strTimeregistering: {org: "Zeiterfassung"}};
  $mod.$init = function () {
    pas.System.Writeln("Hello World from Timereg...");
    pas.Avamm.RegisterSidebarRoute(rtl.getResStr(pas.timereg,"strTimeregistering"),"timeregistering",$mod.ShowTimereg);
  };
});
//# sourceMappingURL=timereg.js.map
