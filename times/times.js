function RefreshTimes() {
  siTimes.progressOn();
  console.log("Refresh Times");
  var aDate = new Date();
  aDate = parseDate(tbToolbar.getValue("datea"));
  var bDate = new Date(aDate.getTime());
  bDate.setDate(bDate.getDate() + 1);
  dsTimes.FillGrid(gTimes,'\"START\">\''+formatDate(aDate,'YYYYMMdd')+'\' AND \"START\"<\''+formatDate(bDate,'YYYYMMdd')+'\'');
  siTimes.progressOff();
}
function AddEntry() {
  console.log("New Entry");
  var aId = gTimes.uid();
  //dsTimes.add({id:aId})
  //gTimes.sync(dsTimes);
  gTimes.addRow(aId,"");
  gTimes.selectCell(gTimes.getRowIndex(aId),0);
  window.setTimeout(function(){
    gTimes.editCell();
    gTimes.enableKeyboardSupport(true);
    gTimes.setActive();
  },1);
}
var siTimes,tbToolbar,gTimes,dsTimes;

dhtmlxEvent(window,"load",function(){
  console.log("Loading Times Page...");
  sbMain.addItem({id: 'siTimes', text: 'Zeitaufschreibung', icon: 'fa fa-refresh'});
  siTimes = window.parent.sbMain.cells('siTimes');
  tbToolbar = siTimes.attachToolbar({
    parent:"pToolbar",
      items:[
         {id: "new", type: "button", text: "Neu", img: "fa fa-plus-circle"}
        ,{id: "sep1", type: "separator" }
        ,{id: "datep", type: "button", img: "fa fa-chevron-left"}
        ,{id: "datea", type: "buttonInput"}
        ,{id: "daten", type: "button", img: "fa fa-chevron-right"}
        ,{id: "sep1", type: "separator" }
        ,{id: "refresh", type: "button", text: "Aktualisieren", img: "fa fa-refresh"}
      ],
    iconset: "awesome"
  });
  tbToolbar.attachEvent("onClick", function(id) {
    if (id=='new') {
      AddEntry();
    } else if (id=='refresh') {
      RefreshTimes();
    } else if (id=='datep') {
      var aDate = new Date();
      aDate = parseDate(tbToolbar.getValue("datea"));
      aDate.setDate(aDate.getDate() - 1);
      tbToolbar.setValue("datea",formatDate(aDate,'dd.MM.YYYY'));
      RefreshTimes();
    } else if (id=='daten') {
      var aDate = new Date();
      aDate = parseDate(tbToolbar.getValue("datea"));
      aDate.setDate(aDate.getDate() + 1);
      tbToolbar.setValue("datea",formatDate(aDate,'dd.MM.YYYY'));
      RefreshTimes();
    }
  });
  dhtmlxValidation.isValidTime=function(data){
    return true;
  };
  gTimes = siTimes.attachGrid({parent:"pTimes"});
  gTimes.setImagePath("codebase/imgs/");
  //gTimes.enableAutoWidth(true);
  //gTimes.enableAutoHeight(true);
  gTimes.setSizes();
  gTimes.setHeader(["Aufgabe","Projekt","Dauer (h)","Notiz"]);
  gTimes.setColumnIds('JOB,PROJECT,DURATION,NOTE')
  gTimes.setColTypes("edtxt,co,edtxt,txt");
  gTimes.setColValidators("NotEmpty,NotEmpty,ValidTime,");
  //gTimes.enableEditEvents(false,true,true);
  var cbProject = gTimes.getCombo(2);
  /*
  if (cbProject) {
    cbProject.attachEvent("onOpen", function(){
      //TODO:fill with first Project Items
    });
    cbProject.attachEvent("onChange", function(value, text){
      //TODO:fill with Project Items based on text
    });
  }
  */

  gTimes.setDateFormat("%d.%m.%Y");
  gTimes.setColSorting('str,str,str,str');
  gTimes.attachFooter("Gesamtzeit,#cspan,<div id='sr_q'>0</div>,",["text-align:left;"]);
  gTimes.init();
  var eDate = tbToolbar.getInput("datea");
  var cDate = new dhtmlXCalendarObject([eDate]);
  cDate.setDateFormat("%d.%m.%Y");
  var aDate = new Date();
  tbToolbar.setValue("datea",formatDate(aDate,'dd.MM.YYYY'));
  cDate.attachEvent("onChange", function(date, state){
    RefreshTimes();
  });
  dsTimes = newPrometDataStore('times');
  dsTimes.DataProcessor.init(gTimes);

  //RefreshTimes();
});
