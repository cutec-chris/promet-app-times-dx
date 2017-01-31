function RefreshTimes() {
  siTimes.progressOn();
  console.log("Refresh Times");
  dsTimes.FillGrid(gTimes);
  siTimes.progressOff();
}
function AddEntry() {
  console.log("New Entry");
  var aId = gTimes.uid();
  //dsTimes.add({id:aId})
  //gTimes.sync(dsTimes);
  gTimes.addRow(aId,"");
  gTimes.selectCell(gTimes.getRowIndex(aId),1);
  window.setTimeout(function(){
    gTimes.editCell();
    gTimes.enableKeyboardSupport(true);
    gTimes.setActive();
  },1);
}
var siTimes,tbToolbar,gTimes,dsTimes;

dhtmlxEvent(window,"load",function(){
  console.log("Loading Times Page...");
  sbMain.addItem({id: 'siTimes', text: 'Zeitaufschreibung', icon: ''});
  siTimes = window.parent.sbMain.cells('siTimes');
  tbToolbar = siTimes.attachToolbar({
    parent:"pToolbar",
      items:[
         {id: "new", type: "button", text: "Neu", img: "fa fa-plus-circle"}
        ,{id: "sep1", type: "separator" }
        ,{id: "datea", type: "buttonInput"}
        ,{id: "sep1", type: "separator" }
        ,{id: "refresh", type: "button", text: "Aktualisieren", img: "fa fa-refresh"}
      ],
    iconset: "awesome"
  });
  tbToolbar.attachEvent("onClick", function(id) {
    if (id=='new') {
      AddTask();
    } else if (id=='refresh') {
      RefreshTimes();
    }
		});
  gTimes = siTimes.attachGrid({parent:"pTimes"});
  gTimes.setImagePath("codebase/imgs/");
  //gTimes.enableAutoWidth(true);
  //gTimes.enableAutoHeight(true);
  gTimes.setSizes();
  gTimes.setHeader(["Aufgabe","Projekt","Dauer"]);
  gTimes.setColumnIds('TASK,PROJECT,DURATION')
  gTimes.setColTypes("edtxt,co,edtxt");
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
  gTimes.setColSorting('str,str,str');
  gTimes.init();
  var eDate = tbToolbar.getInput("datea")
  var cDate = new dhtmlXCalendarObject([eDate]);
  cDate.setDateFormat("%d.%m.%Y");
  tbToolbar.setValue("datea","02.07.2012");

  dsTimes = newPrometDataStore('times');
  dsTimes.DataProcessor.init(gTimes);

  //RefreshTimes();
});
