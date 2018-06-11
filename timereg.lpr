library timereg;
  uses js, web, classes, Avamm,webrouter;

resourcestring
  strTimeregistering     = 'Zeiterfassung';

Procedure ShowTimereg(URl : String; aRoute : TRoute; Params: TStrings);
begin
  writeln('Timereg should be shown');
end;
initialization
  writeln('Hello World from Timereg...');
  RegisterSidebarRoute(strTimeregistering,'timeregistering',@ShowTimereg);
end.

