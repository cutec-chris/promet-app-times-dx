rtl.module("timereg",["System","JS","Web","Classes","Avamm","webrouter","AvammForms","SysUtils","DB","dhtmlx_calendar","dhtmlx_base","dhtmlx_grid","AvammAutocomplete"],function () {
  "use strict";
  var $mod = this;
  rtl.createClass($mod,"TTimeregForm",pas.AvammForms.TAvammListForm,function () {
    this.$init = function () {
      pas.AvammForms.TAvammListForm.$init.call(this);
      this.ProjectComplete = null;
    };
    this.$final = function () {
      this.ProjectComplete = undefined;
      pas.AvammForms.TAvammListForm.$final.call(this);
    };
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
    this.CompleteProjectDblClick = function (Sender) {
      if ((this.FDataSet.FState in rtl.createSet(pas.DB.TDataSetState.dsInsert)) || this.FDataSet.Locate("SQL_ID",this.Grid.getSelectedRowId(),{})) {
        if (!(this.FDataSet.FState in rtl.createSet(pas.DB.TDataSetState.dsInsert))) this.FDataSet.Edit();
        this.FDataSet.FieldByName("PROJECT").SetAsString(((("PROJECTS@" + this.ProjectComplete.Grid.cells(this.ProjectComplete.Grid.getSelectedRowId(),2).getValue()) + "{") + this.ProjectComplete.Grid.cells(this.ProjectComplete.Grid.getSelectedRowId(),0).getValue()) + "}");
        this.Grid.cells(this.Grid.getSelectedRowId(),0).setValue(this.ProjectComplete.Grid.cells(this.ProjectComplete.Grid.getSelectedRowId(),0).getValue());
        this.FDataSet.FieldByName("PROJECTID").SetAsString(this.ProjectComplete.Grid.cells(this.ProjectComplete.Grid.getSelectedRowId(),2).getValue());
        this.ProjectComplete.Popup.hide();
        this.ProjectComplete.Grid.clearSelection();
        this.Toolbar.enableItem("save");
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
        tmp = "" + Self.Toolbar.getValue("datea");
        pas.SysUtils.TryStrToDate(tmp,{get: function () {
            return aDate;
          }, set: function (v) {
            aDate = v;
          }});
        Self.FDataSet.FieldByName("START").SetAsDateTime(pas.System.Trunc(aDate) + pas.System.Frac(pas.SysUtils.Now()));
        Self.FDataSet.FieldByName("ISPAUSE").SetAsString("N");
        Self.Toolbar.enableItem("save");
      } else if (id === "delete") {
        Self.FDataLink.FDatastore.remove(Self.Grid.getSelectedRowId());
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
      var Result = false;
      Result = true;
      return Result;
    };
    this.Create$2 = function (aParent, aDataSet, aPattern) {
      var Self = this;
      var eDate = undefined;
      var cDate = null;
      function DoEditgridCell(stage, rId, cInd, nValue, oValue) {
        var Result = false;
        var cell = null;
        var rect = null;
        Result = true;
        if ((stage === 2) && !Self.ProjectComplete.Popup.isVisible()) {
          Result = true;
          return Result;
        } else if ((cInd === 0) && (nValue != "")) {
          cell = Self.Grid.cells(rId,cInd).cell;
          rect = cell.getBoundingClientRect();
          if (!Self.ProjectComplete.Popup.isVisible()) Self.ProjectComplete.Popup.show(rect.left,rect.top,rect.width,rect.height);
        };
        return Result;
      };
      function DoGridKeyPress(code, cFlag, sFlag) {
        var Result = false;
        var tmp = null;
        if (Self.ProjectComplete.Popup.isVisible()) {
          tmp = Self.Grid.cells(Self.Grid.getSelectedRowId(),Self.Grid.getSelectedCellIndex());
          Self.ProjectComplete.DoFilter(tmp.getValue(),false);
        };
        return Result;
      };
      pas.AvammForms.TAvammListForm.Create$2.call(Self,aParent,aDataSet,"1C");
      var $with1 = Self.Grid;
      $with1.setHeader("Projekt,Aufgabe,Dauer (h),Notiz");
      $with1.setColumnIds("PROJECT,JOB,DURATION,NOTE");
      $with1.setColValidators("NotEmpty,NotEmpty,ValidTime,null");
      $with1.setInitWidths("*,*,70,*,*");
      $with1.enableEditEvents(false,true,true);
      $with1.enableValidation();
      $with1.setEditable(true);
      $with1.init();
      Self.FDataLink.FDataprocessor.init(Self.Grid);
      Self.ProjectComplete = pas.AvammAutocomplete.TAvammAutoComplete.$create("Create$1",[null,"projects","ID","Projekt,Nummer,ID","NAME,NUMBER,ID",'lower("NAME") like lower(\'%FILTERVALUE%\')',500,200]);
      var $with2 = Self.ProjectComplete.Grid;
      Self.ProjectComplete.FDblClick = rtl.createCallback(Self,"CompleteProjectDblClick");
      Self.Grid.attachEvent("onEditCell",DoEditgridCell);
      Self.Grid.attachEvent("onKeyPress",DoGridKeyPress);
      Self.ProjectComplete.Grid.setColumnHidden(2,true);
      var $with3 = Self.Toolbar;
      $with3.addButton("save",0,"","fa fa-save","fa fa-save");
      $with3.setItemToolTip("save",rtl.getResStr(pas.AvammForms,"strSave"));
      $with3.addButton("new",1,"","fa fa-plus-circle","fa fa-plus-circle");
      $with3.setItemToolTip("new",rtl.getResStr(pas.AvammForms,"strNew"));
      $with3.addButton("delete",2,"","fa fa-minus-circle","fa fa-minus-circle");
      $with3.setItemToolTip("delete",rtl.getResStr(pas.AvammForms,"strDelete"));
      $with3.addSeparator("sep1",3);
      $with3.addButton("datep",4,"","fa fa-chevron-left");
      $with3.addInput("datea",5,"",null);
      $with3.addButton("daten",6,"","fa fa-chevron-right");
      $with3.addSeparator("sep2",7);
      $with3.disableItem("save");
      Self.FDataSet.FFieldDefsLoaded = rtl.createCallback(Self,"DataSetAfterOpen");
      eDate = Self.Toolbar.getInput("datea");
      cDate = new dhtmlXCalendarObject(eDate);
      cDate.setDateFormat(pas.dhtmlx_calendar.DateFormatToDHTMLX(pas.SysUtils.ShortDateFormat));
      cDate.attachEvent("onChange",rtl.createCallback(Self,"RefreshList"));
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
