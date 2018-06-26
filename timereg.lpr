library timereg;
  uses js, web, classes, Avamm, webrouter, AvammForms, SysUtils;

type

  { TTimeregForm }

  TTimeregForm = class(TAvammListForm)
  protected
    procedure ToolbarButtonClick(id : string);
    procedure Refresh;
  public
    constructor Create(aParent: TJSElement; aDataSet: string);override;
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

procedure TTimeregForm.ToolbarButtonClick(id : string);
var
  aDate: TJSDate;
  tmp: String;
begin
  if (id='refresh') then
    begin
    end
  else if (id='datep') then
    begin
    end
  else if (id='daten') then
    begin
      tmp := string(Toolbar.getValue('datea'));
      aDate := TJSDate.New(TJSDate.parse(tmp));
      aDate.Date := aDate.Date - 1;
      Toolbar.setValue('datea', FormatDateTime('dd.MM.YYYY',JSDateToDateTime(aDate)));
      Refresh;
    end
  else if (id='new') then
    begin
    end
  ;
end;

procedure TTimeregForm.Refresh;
begin

end;

constructor TTimeregForm.Create(aParent: TJSElement; aDataSet: string);
begin
  inherited Create(aParent, aDataSet);
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
end;

initialization
  if getRight('timereg')>0 then
    RegisterSidebarRoute(strTimeregistering,'timeregistering',@ShowTimereg);
end.

