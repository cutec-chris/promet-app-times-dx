﻿rtl.module("timereg",["System","JS","Web","Classes","Avamm","webrouter","AvammForms","SysUtils","DB"],function () {
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
      var $with1 = this.Grid;
      $with1.setHeader("Projekt,Aufgabe,Dauer (h),Notiz,Start,Project ID",",",Array.of({}));
      $with1.setColumnIds("PROJECT,JOB,DURATION,NOTE,START,PROJECTID");
      $with1.setColValidators("NotEmpty,NotEmpty,ValidTime,null,NotEmpty");
      $with1.setColumnHidden(4,true);
      $with1.setColumnHidden(5,true);
      $with1.setInitWidths("*,*,70,*,*");
      $with1.enableValidation();
      $with1.init();
      var $with2 = this.Toolbar;
      $with2.addButton("new",0,rtl.getResStr(pas.timereg,"strNew"),"fa fa-plus-circle","fa fa-plus-circle");
      $with2.addSeparator("sep1",1);
      $with2.addButton("datep",2,"","fa fa-chevron-left","fa fa-chevron-left");
      $with2.addInput("datea",3,"",null);
      $with2.addButton("daten",4,"","fa fa-chevron-right","fa fa-chevron-right");
      $with2.addSeparator("sep2",1);
      $with2.attachEvent("onClick",rtl.createCallback(this,"ToolbarButtonClick"));
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
        Self.FDataSet.SetFilter(((('"START">=\'' + pas.SysUtils.FormatDateTime("YYYYMMdd",aDate)) + '\' AND "START"<\'') + pas.SysUtils.FormatDateTime("YYYYMMdd",aDate + 1)) + "'");
        Self.FDataSet.Load({},SwitchProgressOff);
      } catch ($e) {
        if (pas.SysUtils.Exception.isPrototypeOf($e)) {
          var e = $e;
          pas.System.Writeln("Refresh Exception:" + e.fMessage);
          Self.Page.progressOff();
        } else throw $e
      };
    };
    this.Show = function () {
      this.DoShow();
      this.Toolbar.setValue("datea",pas.SysUtils.DateToStr(pas.SysUtils.Now()));
      this.RefreshList();
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
