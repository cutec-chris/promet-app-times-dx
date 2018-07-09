library timereg;
  uses js, web, classes, Avamm, webrouter, AvammForms, SysUtils, db, dhtmlx_calendar;

type

  { TTimeregForm }

  TTimeregForm = class(TAvammListForm)
  private
    procedure DataSetAfterOpen(DataSet: TObject);
    procedure DataSetGetText(Sender: TField; var aText: string;
      DisplayText: Boolean);
    procedure DataSetSetText(Sender: TField; const aText: string);
  protected
    procedure ToolbarButtonClick(id : string);
  public
    constructor Create(aParent : TJSElement;aDataSet : string;aPattern : string = '1C');override;
    procedure RefreshList; override;
    procedure Show; override;
  end;

resourcestring
  strTimeregistering     = 'Zeiterfassung';
  strNew                 = 'Neu';

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

    end;
  end;
end;

procedure TTimeregForm.DataSetSetText(Sender: TField; const aText: string);
begin

end;

procedure TTimeregForm.ToolbarButtonClick(id : string);
var
  tmp: String;
  aDate: TDateTime;
begin
  aDate := now();
  if (id='refresh') then
    begin
      RefreshList;
    end
  else if (id='daten') then
    begin
      tmp := string(Toolbar.getValue('datea'));
      TryStrToDate(tmp,aDate);
      aDate := aDate + 1;
      Toolbar.setValue('datea', DateToStr(aDate));
      RefreshList;
    end
  else if (id='datep') then
    begin
      tmp := string(Toolbar.getValue('datea'));
      TryStrToDate(tmp,aDate);
      aDate := aDate - 1;
      Toolbar.setValue('datea', DateToStr(aDate));
      RefreshList;
    end
  else if (id='new') then
    begin

    end
  ;
end;

constructor TTimeregForm.Create(aParent: TJSElement; aDataSet: string;
  aPattern: string);
var
  eDate : JSValue;
  cDate : TDHTMLXCalendar;
begin
  inherited Create(aParent, aDataSet);
  with Grid do
    begin
      setHeader('Projekt,Aufgabe,Dauer (h),Notiz,Start,Project ID',',',TJSArray._of([]));
      setColumnIds('PROJECT,JOB,DURATION,NOTE,START,PROJECTID');
      setColValidators('NotEmpty,NotEmpty,ValidTime,null,NotEmpty');
      setColumnHidden(4,true);
      setColumnHidden(5,true);
      setInitWidths('*,*,70,*,*');
      enableValidation;
      init();
    end;
  with Toolbar do
    begin
      addButton('new',0,strNew,'fa fa-plus-circle','fa fa-plus-circle');
      addSeparator('sep1',1);
      addButton('datep',2,'','fa fa-chevron-left','fa fa-chevron-left');
      addInput('datea',3,'',null);
      addButton('daten',4,'','fa fa-chevron-right','fa fa-chevron-right');
      addSeparator('sep2',1);
      attachEvent('onClick', @ToolbarButtonClick);
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
        writeln('Refresh Exception:'+e.message);
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
    RegisterSidebarRoute(strTimeregistering,'timeregistering',@ShowTimereg);
end.

