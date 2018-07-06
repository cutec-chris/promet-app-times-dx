rtl.module("timereg",["System","JS","Web","Classes","Avamm","webrouter","AvammForms","SysUtils"],function () {
  "use strict";
  var $mod = this;
  rtl.createClass($mod,"TTimeregForm",pas.AvammForms.TAvammListForm,function () {
    this.ToolbarButtonClick = function (id) {
      var tmp = "";
      var aDate = 0.0;
      aDate = pas.SysUtils.Now();
      if (id === "refresh") {
        this.Refresh();
      } else if (id === "daten") {
        tmp = "" + this.Toolbar.getValue("datea");
        pas.SysUtils.TryStrToDate(tmp,{get: function () {
            return aDate;
          }, set: function (v) {
            aDate = v;
          }});
        aDate = aDate + 1;
        this.Toolbar.setValue("datea",pas.SysUtils.DateToStr(aDate));
        this.Refresh();
      } else if (id === "datep") {
        tmp = "" + this.Toolbar.getValue("datea");
        pas.SysUtils.TryStrToDate(tmp,{get: function () {
            return aDate;
          }, set: function (v) {
            aDate = v;
          }});
        aDate = aDate - 1;
        this.Toolbar.setValue("datea",pas.SysUtils.DateToStr(aDate));
        this.Refresh();
      } else if (id === "new") ;
    };
    this.Refresh = function () {
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
