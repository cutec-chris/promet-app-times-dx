rtl.module("timereg",["System","JS","Web","Classes","Avamm","webrouter","AvammForms","SysUtils"],function () {
  "use strict";
  var $mod = this;
  rtl.createClass($mod,"TTimeregForm",pas.AvammForms.TAvammListForm,function () {
    this.ToolbarButtonClick = function (id) {
      var aDate = null;
      var tmp = "";
      if (id === "refresh") {}
      else if (id === "datep") {}
      else if (id === "daten") {
        tmp = "" + this.Toolbar.getValue("datea");
        aDate = new Date(Date.parse(tmp));
        aDate.setDate(aDate.getDate() - 1);
        this.Toolbar.setValue("datea",pas.SysUtils.FormatDateTime("dd.MM.YYYY",pas.SysUtils.JSDateToDateTime(aDate)));
        this.Refresh();
      } else if (id === "new") ;
    };
    this.Refresh = function () {
    };
    this.Create$1 = function (aParent, aDataSet) {
      pas.AvammForms.TAvammListForm.Create$1.call(this,aParent,aDataSet);
      var $with1 = this.Toolbar;
      $with1.addButton("new",0,rtl.getResStr(pas.timereg,"strNew"),"fa fa-plus-circle","fa fa-plus-circle");
      $with1.addSeparator("sep1",1);
      $with1.addButton("datep",2,"","fa fa-chevron-left","fa fa-chevron-left");
      $with1.addInput("datea",3,"",null);
      $with1.addButton("daten",4,"","fa fa-chevron-right","fa fa-chevron-right");
      $with1.addSeparator("sep2",1);
      $with1.attachEvent("onClick",rtl.createCallback(this,"ToolbarButtonClick"));
    };
  });
  this.List = null;
  this.ShowTimereg = function (URl, aRoute, Params) {
    var aParent = null;
    if (!($mod.List != null)) {
      aParent = rtl.getObject(pas.Avamm.GetAvammContainer());
      $mod.List = $mod.TTimeregForm.$create("Create$1",[aParent,"times"]);
    };
    $mod.List.Show();
  };
  $mod.$resourcestrings = {strTimeregistering: {org: "Zeiterfassung"}, strNew: {org: "Neu"}};
  $mod.$init = function () {
    if (pas.Avamm.getRight("timereg") > 0) pas.Avamm.RegisterSidebarRoute(rtl.getResStr(pas.timereg,"strTimeregistering"),"timeregistering",$mod.ShowTimereg);
  };
});
//# sourceMappingURL=timereg.js.map
