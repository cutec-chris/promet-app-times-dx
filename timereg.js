rtl.module("timereg",["System","JS","Web","Classes","Avamm","webrouter","AvammForms","SysUtils","DB"],function () {
  "use strict";
  var $mod = this;
  rtl.createClass($mod,"TTimeregForm",pas.AvammForms.TAvammListForm,function () {
    this.ToolbarButtonClick = function (id) {
      var tmp = "";
      var aDate = 0.0;
      aDate = pas.SysUtils.Now();
      if (id === "refresh") {
        this.RefreshList();
      } else if (id === "daten") {
        tmp = "" + this.Toolbar.getValue("datea");
        pas.SysUtils.TryStrToDate(tmp,{get: function () {
            return aDate;
          }, set: function (v) {
            aDate = v;
          }});
        aDate = aDate + 1;
        this.Toolbar.setValue("datea",pas.SysUtils.DateToStr(aDate));
        this.RefreshList();
      } else if (id === "datep") {
        tmp = "" + this.Toolbar.getValue("datea");
        pas.SysUtils.TryStrToDate(tmp,{get: function () {
            return aDate;
          }, set: function (v) {
            aDate = v;
          }});
        aDate = aDate - 1;
        this.Toolbar.setValue("datea",pas.SysUtils.DateToStr(aDate));
        this.RefreshList();
      } else if (id === "new") ;
    };
    this.Create$1 = function (aParent, aDataSet, aPattern) {
      pas.AvammForms.TAvammListForm.Create$1.call(this,aParent,aDataSet,"1C");
      var $with1 = this.Toolbar;
      $with1.addButton("new",0,rtl.getResStr(pas.timereg,"strNew"),"fa fa-plus-circle","fa fa-plus-circle");
      $with1.addSeparator("sep1",1);
      $with1.addButton("datep",2,"","fa fa-chevron-left","fa fa-chevron-left");
      $with1.addInput("datea",3,"",null);
      $with1.addButton("daten",4,"","fa fa-chevron-right","fa fa-chevron-right");
      $with1.addSeparator("sep2",1);
      $with1.attachEvent("onClick",rtl.createCallback(this,"ToolbarButtonClick"));
    };
    this.RefreshList = function () {
      var Self = this;
      function SwitchProgressOff(DataSet, Data) {
        Self.Page.progressOff();
      };
      var aDate = 0.0;
      try {
        Self.Page.progressOn();
        aDate = pas.SysUtils.StrToDate("" + Self.Toolbar.getValue("datea"));
        Self.FDataSet.SetFilter(((('"START">=' + pas.SysUtils.FormatDateTime("YYYYMMdd",aDate)) + ' AND "START"<\'') + pas.SysUtils.FormatDateTime("YYYYMMdd",aDate)) + "'");
        Self.FDataSet.Load({},SwitchProgressOff);
      } catch ($e) {
        if (pas.SysUtils.Exception.isPrototypeOf($e)) {
          var e = $e;
          pas.System.Writeln("Refresh Exception:" + e.fMessage);
          Self.Page.progressOff();
        } else throw $e
      };
    };
  });
  this.List = null;
  this.ShowTimereg = function (URl, aRoute, Params) {
    var aParent = null;
    if (!($mod.List != null)) {
      aParent = rtl.getObject(pas.Avamm.GetAvammContainer());
      $mod.List = $mod.TTimeregForm.$create("Create$1",[aParent,"times","1C"]);
    };
    $mod.List.Show();
  };
  $mod.$resourcestrings = {strTimeregistering: {org: "Zeiterfassung"}, strNew: {org: "Neu"}};
  $mod.$init = function () {
    if (pas.Avamm.getRight("timereg") > 0) pas.Avamm.RegisterSidebarRoute(rtl.getResStr(pas.timereg,"strTimeregistering"),"timeregistering",$mod.ShowTimereg);
  };
});
//# sourceMappingURL=timereg.js.map
