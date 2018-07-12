rtl.module("timereg",["System","JS","Web","Classes","Avamm","webrouter","AvammForms","SysUtils","DB","dhtmlx_calendar"],function () {
  "use strict";
  var $mod = this;
  rtl.createClass($mod,"TTimeregForm",pas.AvammForms.TAvammListForm,function () {
    this.DataSetAfterOpen = function (DataSet) {
      var $with1 = rtl.as(DataSet,pas.DB.TDataSet);
      $with1.FieldByName("PROJECT").FOnGetText = rtl.createCallback(this,"DataSetGetText");
      $with1.FieldByName("PROJECT").FOnSetText = rtl.createCallback(this,"DataSetSetText");
      $with1.FieldByName("DURATION").FOnGetText = rtl.createCallback(this,"DataSetGetText");
      $with1.FieldByName("DURATION").FOnSetText = rtl.createCallback(this,"DataSetSetText");
    };
    this.DataSetGetText = function (Sender, aText, DisplayText) {
      var tmp = 0.0;
      aText.set(Sender.GetAsString());
      var $tmp1 = Sender.FFieldName;
      if ($tmp1 === "PROJECT") {
        if (pas.System.Pos("{",aText.get()) > 0) aText.set(pas.System.Copy(aText.get(),pas.System.Pos("{",aText.get()) + 1,(aText.get().length - pas.System.Pos("{",aText.get())) - 1));
      } else if ($tmp1 === "DURATION") {
        tmp = Sender.GetAsFloat() * 8;
        if (tmp > 1) {
          aText.set(pas.SysUtils.FormatFloat("0.00",tmp) + " h")}
         else aText.set(pas.SysUtils.IntToStr(Math.round(tmp * 60)) + " min");
      };
    };
    this.DataSetSetText = function (Sender, aText) {
    };
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
      } else if (id === "new") {
        this.FDataSet.Append();
      };
    };
    this.DoRowDblClick = function () {
    };
    this.Create$2 = function (aParent, aDataSet, aPattern) {
      var eDate = undefined;
      var cDate = null;
      pas.AvammForms.TAvammListForm.Create$2.call(this,aParent,aDataSet,"1C");
      var $with1 = this.Grid;
      $with1.setHeader("Projekt,Aufgabe,Dauer (h),Notiz,Start,Project ID");
      $with1.setColumnIds("PROJECT,JOB,DURATION,NOTE,START,PROJECTID");
      $with1.setColValidators("NotEmpty,NotEmpty,ValidTime,null,NotEmpty");
      $with1.setColumnHidden(4,true);
      $with1.setColumnHidden(5,true);
      $with1.setInitWidths("*,*,70,*,*");
      $with1.enableValidation();
      $with1.setEditable(true);
      $with1.init();
      this.FDataLink.FDataprocessor.init(this.Grid);
      var $with2 = this.Toolbar;
      $with2.addButton("new",0,rtl.getResStr(pas.timereg,"strNew"),"fa fa-plus-circle");
      $with2.addSeparator("sep1",1);
      $with2.addButton("datep",2,"","fa fa-chevron-left");
      $with2.addInput("datea",3,"",null);
      $with2.addButton("daten",4,"","fa fa-chevron-right");
      $with2.addSeparator("sep2",1);
      $with2.attachEvent("onClick",rtl.createCallback(this,"ToolbarButtonClick"));
      this.FDataSet.FFieldDefsLoaded = rtl.createCallback(this,"DataSetAfterOpen");
      eDate = this.Toolbar.getInput("datea");
      cDate = new dhtmlXCalendarObject(eDate);
      cDate.setDateFormat(pas.dhtmlx_calendar.DateFormatToDHTMLX(pas.SysUtils.ShortDateFormat));
      cDate.attachEvent("onChange",rtl.createCallback(this,"RefreshList"));
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
        Self.FDataSet.Close();
        Self.FDataSet.SetFilter(((('"START">=\'' + pas.SysUtils.FormatDateTime("YYYYMMdd",aDate)) + '\' AND "START"<\'') + pas.SysUtils.FormatDateTime("YYYYMMdd",aDate + 1)) + "'");
        Self.FDataSet.Load(rtl.createSet(pas.DB.TLoadOption.loNoEvents),SwitchProgressOff);
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
      $mod.List = $mod.TTimeregForm.$create("Create$2",[aParent,"times","1C"]);
    };
    $mod.List.Show();
  };
  $mod.$resourcestrings = {strTimeregistering: {org: "Zeiterfassung"}, strNew: {org: "Neu"}};
  $mod.$init = function () {
    if (pas.Avamm.getRight("timereg") > 0) pas.Avamm.RegisterSidebarRoute(rtl.getResStr(pas.timereg,"strTimeregistering"),"timeregistering",$mod.ShowTimereg);
  };
});
//# sourceMappingURL=timereg.js.map
