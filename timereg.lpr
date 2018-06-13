library timereg;
  uses js, web, classes, Avamm,webrouter,AvammForms;

resourcestring
  strTimeregistering     = 'Zeiterfassung';

var
  List: TAvammListForm = nil;

Procedure ShowTimereg(URl : String; aRoute : TRoute; Params: TStrings);
var
  aParent: TJSHTMLElement;
begin
  writeln('Timereg should be shown');
  if not Assigned(List) then
    begin
      aParent := TJSHTMLElement(GetAvammContainer());
      List := TAvammListForm.Create(aParent,'times');
    end;
  List.Show;
end;
initialization
  writeln('Hello World from Timereg...');
  RegisterSidebarRoute(strTimeregistering,'timeregistering',@ShowTimereg);
end.

