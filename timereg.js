rtl.module("timereg",["System","JS","Web","Classes","Avamm","webrouter","AvammForms","SysUtils","DB","dhtmlx_calendar","dhtmlx_base"],function () {
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
      var tmp = "";
      var tmp2 = "";
      this.Toolbar.enableItem("save");
      var $tmp1 = Sender.FFieldName;
      if ($tmp1 === "PROJECT") {
        Sender.SetAsString(aText);
      } else if ($tmp1 === "DURATION") {
        tmp = pas.System.Copy(aText,pas.System.Pos(" ",aText) + 1,aText.length);
        var $tmp2 = pas.SysUtils.LowerCase(tmp);
        if ($tmp2 === "min") {
          tmp2 = pas.System.Copy(aText,0,pas.System.Pos(" ",aText) - 1);
          Sender.SetAsFloat((pas.SysUtils.StrToInt(tmp2) / 60) / 8);
        } else {
          Sender.SetAsFloat(pas.SysUtils.StrToFloat(aText) / 8);
        };
      } else {
        Sender.SetAsString(aText);
      };
    };
    this.ToolbarButtonClick = function (id) {
      var Self = this;
      var tmp = "";
      var aDate = 0.0;
      function DoRefreshList(aValue) {
        var Result = undefined;
        if (aValue) Self.RefreshList();
        return Result;
      };
      function DoDateN(aValue) {
        var Result = undefined;
        Self.Toolbar.setValue("datea",pas.SysUtils.DateToStr(aDate));
        Self.RefreshList();
        return Result;
      };
      function DoNothing(aValue) {
        var Result = undefined;
        return Result;
      };
      aDate = pas.SysUtils.Now();
      if (id === "refresh") {
        pas.AvammForms.CheckSaved(Self.Toolbar).then(DoRefreshList).catch(DoNothing);
      } else if (id === "daten") {
        tmp = "" + Self.Toolbar.getValue("datea");
        pas.SysUtils.TryStrToDate(tmp,{get: function () {
            return aDate;
          }, set: function (v) {
            aDate = v;
          }});
        aDate = aDate + 1;
        pas.AvammForms.CheckSaved(Self.Toolbar).then(DoDateN).catch(DoNothing);
      } else if (id === "datep") {
        tmp = "" + Self.Toolbar.getValue("datea");
        pas.SysUtils.TryStrToDate(tmp,{get: function () {
            return aDate;
          }, set: function (v) {
            aDate = v;
          }});
        aDate = aDate - 1;
        pas.AvammForms.CheckSaved(Self.Toolbar).then(DoDateN).catch(DoNothing);
      } else if (id === "new") {
        Self.FDataSet.Append();
        Self.FDataSet.FieldByName("START").SetAsDateTime(pas.SysUtils.Now());
        Self.FDataSet.FieldByName("ISPAUSE").SetAsString("N");
        Self.Toolbar.enableItem("save");
      } else if (id === "save") {
        if (Self.FDataSet.FState in rtl.createSet(pas.DB.TDataSetState.dsEdit,pas.DB.TDataSetState.dsInsert)) {
          Self.FDataSet.DisableControls();
          Self.FDataSet.Append();
          Self.FDataSet.Cancel();
          Self.FDataSet.EnableControls();
        };
        Self.FDataSet.ApplyUpdates();
        Self.Toolbar.disableItem("save");
      };
    };
    this.DoRowDblClick = function () {
    };
    this.Create$2 = function (aParent, aDataSet, aPattern) {
      var eDate = undefined;
      var cDate = null;
      pas.AvammForms.TAvammListForm.Create$2.call(this,aParent,aDataSet,"1C");
      var $with1 = this.Grid;
      $with1.setHeader("Projekt,Aufgabe,Dauer (h),Notiz");
      $with1.setColumnIds("PROJECT,JOB,DURATION,NOTE");
      $with1.setColValidators("NotEmpty,NotEmpty,ValidTime,null");
      $with1.setInitWidths("*,*,70,*,*");
      $with1.enableValidation();
      $with1.setEditable(true);
      $with1.init();
      this.FDataLink.FDataprocessor.init(this.Grid);
      var $with2 = this.Toolbar;
      $with2.addButton("save",0,"","fa fa-save","fa fa-save");
      $with2.setItemToolTip("save",rtl.getResStr(pas.AvammForms,"strSave"));
      $with2.addButton("new",1,"","fa fa-plus-circle","fa fa-plus-circle");
      $with2.setItemToolTip("new",rtl.getResStr(pas.AvammForms,"strNew"));
      $with2.addSeparator("sep1",2);
      $with2.addButton("datep",3,"","fa fa-chevron-left");
      $with2.addInput("datea",4,"",null);
      $with2.addButton("daten",5,"","fa fa-chevron-right");
      $with2.addSeparator("sep2",6);
      $with2.disableItem("save");
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
        Self.Toolbar.disableItem("save");
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
  $mod.$resourcestrings = {strTimeregistering: {org: "Zeiterfassung"}};
  $mod.$init = function () {
    if (pas.Avamm.getRight("timereg") > 0) pas.Avamm.RegisterSidebarRoute(rtl.getResStr(pas.timereg,"strTimeregistering"),"timeregistering",$mod.ShowTimereg,"fa-clock-o");
  };
});
//# sourceMappingURL=timereg.js.map
