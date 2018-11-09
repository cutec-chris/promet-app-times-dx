library timereg;
  uses js, web, classes, Avamm, webrouter, AvammForms, SysUtils, db,
    dhtmlx_calendar,dhtmlx_base, dhtmlx_grid, AvammAutocomplete;

type

  { TTimeregForm }

  TTimeregForm = class(TAvammListForm)
  private
    ProjectComplete: TAvammAutoComplete;
    procedure DataSetAfterOpen(DataSet: TObject);
    procedure DataSetGetText(Sender: TField; var aText: string;
      DisplayText: Boolean);
    procedure DataSetSetText(Sender: TField; const aText: string);
    procedure CompleteProjectDblClick(Sender : TObject);
  protected
    procedure ToolbarButtonClick(id : string);override;
    function DoRowDblClick : Boolean; override;
  public
    constructor Create(aParent : TJSElement;aDataSet : string;aPattern : string = '1C');override;
    procedure RefreshList; override;
    procedure Show; override;
  end;

resourcestring
  strTimeregistering     = 'Zeiterfassung';

var
  List: TAvammListForm = nil;

Procedure ShowTimereg(URl : String; aRoute : TRoute; Params: TStrings);
var
  aParent: TJSHTMLElement;
begin
  if not Assigned(List) then
    begin
      aParent := TJSHTMLElement(GetAvammContainer());
      List := TTimeregForm.Create(aParent,'times');
    end;
  List.Show;
end;

{ TTimeregForm }

procedure TTimeregForm.DataSetAfterOpen(DataSet: TObject);
begin
  with DataSet as TDataSet do
    begin
      FieldByName('PROJECT').OnGetText:=@DataSetGetText;
      FieldByName('PROJECT').OnSetText:=@DataSetSetText;
      FieldByName('DURATION').OnGetText:=@DataSetGetText;
      FieldByName('DURATION').OnSetText:=@DataSetSetText;
    end;
end;

procedure TTimeregForm.DataSetGetText(Sender: TField; var aText: string;
  DisplayText: Boolean);
var
  tmp: Double;
begin
  aText := Sender.AsString;
  case Sender.FieldName of
  'PROJECT':
    begin
      if pos('{',aText)>0 then
        aText := copy(aText,pos('{',aText)+1,length(aText)-pos('{',aText)-1);
    end;
  'DURATION':
    begin
      tmp := Sender.AsFloat*8;
      if (tmp > 1) then
        atext := FormatFloat('0.00',tmp)+' h'
      else atext := IntToStr(round(tmp*60))+' min';
    end;
  end;
end;

procedure TTimeregForm.DataSetSetText(Sender: TField; const aText: string);
var
  tmp, tmp2: String;
begin
  Toolbar.enableItem('save');
  case Sender.FieldName of
  'PROJECT':
    begin
      if Sender.AsString<>'' then
        begin
          tmp := Sender.AsString;
          if pos('{',tmp)>0 then
            begin
              tmp := copy(tmp,0,pos('{',tmp));
              tmp := tmp+aText+'}';
            end
          else tmp := atext;
          Sender.AsString:=tmp;
        end
      else
        Sender.AsString:=aText;
    end;
  'DURATION':
    begin
      tmp := copy(aText,pos(' ',aText)+1,length(aText));
      case lowercase(tmp) of
      'min':
        begin
          tmp2 := copy(atext,0,pos(' ',aText)-1);
          Sender.AsFloat:= StrToInt(tmp2)/60/8
        end;
      else
        Sender.AsFloat:=StrToFloat(aText)/8;
      end;
    end
  else
    Sender.AsString:=aText;
  end;
end;

procedure TTimeregForm.CompleteProjectDblClick(Sender: TObject);
begin
  if (DataSet.State in [dsInsert]) or (DataSet.Locate('SQL_ID',Grid.getSelectedRowId(),[])) then
    begin
      if not (DataSet.State in [dsInsert]) then
        DataSet.Edit;
      DataSet.FieldByName('PROJECT').AsString := 'PROJECTS.ID@'+string(ProjectComplete.Grid.getSelectedRowId())+'{'+ProjectComplete.Grid.cells(ProjectComplete.Grid.getSelectedRowId(),0).getValue()+'}';
      Grid.cells(Grid.getSelectedRowId(),0).setValue(ProjectComplete.Grid.cells(ProjectComplete.Grid.getSelectedRowId(),0).getValue());
      DataSet.FieldByName('PROJECTID').AsString := string(ProjectComplete.Grid.getSelectedRowId());
      ProjectComplete.Popup.hide();
      ProjectComplete.Grid.clearSelection();
      Toolbar.enableItem('save');
    end;
end;

procedure TTimeregForm.ToolbarButtonClick(id : string);
var
  tmp: String;
  aDate: TDateTime;
  function DoRefreshList(aValue: JSValue): JSValue;
  begin
    if aValue then
      RefreshList;
  end;
  function DoDateN(aValue : JSValue) : JSValue;
  begin
    Toolbar.setValue('datea', DateToStr(aDate));
    RefreshList;
  end;
  function DoNothing(aValue : JSValue) : JSValue;
  begin
  end;
begin
  aDate := now();
  if (id='refresh') then
    begin
      CheckSaved(Toolbar)._then(@DoRefreshList).catch(@DoNothing);
    end
  else if (id='daten') then
    begin
      tmp := string(Toolbar.getValue('datea'));
      TryStrToDate(tmp,aDate);
      aDate := aDate + 1;
      CheckSaved(Toolbar)._then(@DoDateN).catch(@DoNothing);
    end
  else if (id='datep') then
    begin
      tmp := string(Toolbar.getValue('datea'));
      TryStrToDate(tmp,aDate);
      aDate := aDate - 1;
      CheckSaved(Toolbar)._then(@DoDateN).catch(@DoNothing);
    end
  else if (id='new') then
    begin
      DataSet.Append;
      tmp := string(Toolbar.getValue('datea'));
      TryStrToDate(tmp,aDate);
      DataSet.FieldByName('START').AsDateTime :=  Trunc(aDate)+Frac(Now());
      DataSet.FieldByName('ISPAUSE').AsString := 'N';
      Toolbar.enableItem('save');
    end
  else if (id='delete') then
    begin
      DataLink.Datastore.remove(Grid.getSelectedRowId); //Use the grid method, DataSet possibly dont know on which record we are since Dataprocessor dont reports it
      Toolbar.enableItem('save');
    end
  else if (id='save') then
    begin
      if DataSet.State in [dsEdit,dsInsert] then
        begin
          DataSet.DisableControls;
          DataSet.Append;
          DataSet.Cancel;
          DataSet.EnableControls;
        end;
      DataSet.ApplyUpdates;
      Toolbar.disableItem('save');
    end
  ;
end;

function TTimeregForm.DoRowDblClick: Boolean;
begin
  Result := True;//enable Edit (process Event further in Grid)
end;

constructor TTimeregForm.Create(aParent: TJSElement; aDataSet: string;
  aPattern: string);
var
  eDate : JSValue;
  cDate : TDHTMLXCalendar;
  function DoEditgridCell(stage : Integer;rId : JSValue;cInd : Integer;nValue,oValue : JSValue) : Boolean;
  var
    cell: TJSHTMLElement;
    rect: TJSDOMRect;
  begin
    Result := true;
    if ((stage = 2) and (not ProjectComplete.Popup.isVisible())) then //validation
      begin
        Result := true;
        exit;
      end
    else if ((cInd=0) and (nValue<>'')) then
      begin
        cell := Grid.cells(rId, cInd).cell;
      	rect := cell.getBoundingClientRect();
        if (not ProjectComplete.Popup.isVisible()) then
          ProjectComplete.Popup.show(rect.left, rect.top,rect.width,rect.height);
      end;
  end;
  function DoGridKeyPress(code,cFlag,sFlag : JSValue) : Boolean;
  var
    tmp: TDHTMLXGridCellObject;
  begin
    if ((ProjectComplete.Popup.isVisible())) then
      begin
        tmp := Grid.cells(Grid.getSelectedRowId(), Grid.getSelectedCellIndex());
        ProjectComplete.DoFilter(tmp.getValue());
      end;
  end;
begin
  inherited Create(aParent, aDataSet);
  with Grid do
    begin
      setHeader('Projekt,Aufgabe,Dauer (h),Notiz');
      setColumnIds('PROJECT,JOB,DURATION,NOTE');
      setColValidators('NotEmpty,NotEmpty,ValidTime,null');
      setInitWidths('*,*,70,*,*');
      enableEditEvents(false,true,true);
      enableValidation;
      setEditable(true);
      init();
      DataLink.Dataprocessor.init(Grid);
    end;
  ProjectComplete := TAvammAutoComplete.Create(null,'projects','ID','Projekt,Nummer,ID','NAME,NUMBER,ID','lower("NAME") like lower(''%FILTERVALUE%'') or "ID" like ''FILTERVALUE%''',500);
  with ProjectComplete.Grid do
    begin
      //setHeader('Projekt,Nummer');
      //setColumnIds('NAME,NUMBER');
      //setInitWidthsP('70,30');
      //init();
    end;
  ProjectComplete.OnDblClick:=@CompleteProjectDblClick;
  Grid.attachEvent('onEditCell',@DoEditgridCell);
  Grid.attachEvent('onKeyPress',@DoGridKeyPress);
  ProjectComplete.grid.setColumnHidden(2,true);
  with Toolbar do
    begin
      addButton('save',0,'','fa fa-save','fa fa-save');
      setItemToolTip('save',strSave);
      addButton('new',1,'','fa fa-plus-circle','fa fa-plus-circle');
      setItemToolTip('new',strNew);
      addButton('delete',2,'','fa fa-minus-circle','fa fa-minus-circle');
      setItemToolTip('delete',strDelete);
      addSeparator('sep1',3);
      addButton('datep',4,'','fa fa-chevron-left');
      addInput('datea',5,'',null);
      addButton('daten',6,'','fa fa-chevron-right');
      addSeparator('sep2',7);
      disableItem('save');
    end;
  DataSet.OnFieldDefsLoaded:=@DataSetAfterOpen;
  eDate := Toolbar.getInput('datea');
  cDate := TDHTMLXCalendar.New(eDate);
  cDate.setDateFormat(DateFormatToDHTMLX(ShortDateFormat));
  cDate.attachEvent('onChange',@RefreshList);
end;

procedure TTimeregForm.RefreshList;
  procedure SwitchProgressOff(DataSet: TDataSet; Data: JSValue);
  begin
    Page.progressOff;
    Toolbar.disableItem('save');
  end;

var
  aDate: TDateTime;
begin
  try
    Page.progressOn();
    aDate := strToDate(string(Toolbar.getValue('datea')));
    DataSet.Close;
    DataSet.ServerFilter:='"START">='''+FormatDateTime('YYYYMMdd',aDate)+''' AND "START"<'''+FormatDateTime('YYYYMMdd',aDate+1)+'''';
    DataSet.Load([loNoEvents],@SwitchProgressOff);
  except
    on e : Exception do
      begin
        console.log('Refresh Exception:'+e.message);
        Page.progressOff();
      end;
  end;
end;

procedure TTimeregForm.Show;
begin
  DoShow;
  Toolbar.setValue('datea', DateToStr(Now()));
  RefreshList;
end;

initialization
  if getRight('timereg')>0 then
    RegisterSidebarRoute(strTimeregistering,'timeregistering',@ShowTimereg,'fa-clock-o');
end.

