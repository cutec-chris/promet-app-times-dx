var siTimes,tbToolbar,gTimes,dsTimes,ppTimes,ppTimesGrid;
function RefreshTimes() {
  console.log("Refresh Times");
  try {
    var aDate = new Date();
    aDate = parseDate(tbToolbar.getValue("datea"));
    var bDate = new Date(aDate.getTime());
    bDate.setDate(bDate.getDate() + 1);
    siTimes.progressOn();
    dsTimes.FillGrid(gTimes,'\"START\">=\''+formatDate(aDate,'YYYYMMdd')+'\' AND \"START\"<\''+formatDate(bDate,'YYYYMMdd')+'\'',0,function (){
      siTimes.progressOff();
    });
  } catch(err) {
    console.log('Refresh Exception:'+err.message);
    siTimes.progressOff();
  }
}
function AddEntry() {
  console.log("New Entry");
  var aId = gTimes.uid();
  //dsTimes.add({id:aId})
  //gTimes.sync(dsTimes);
  var aDate = new Date();
  aDate = parseDate(tbToolbar.getValue("datea")+' '+formatDate(aDate,'HH:mm'));
  gTimes.addRow(aId,',,,,,');
  aDate.setMinutes(gTimes.getRowsNum())
  gTimes.cells(aId,4).setValue(formatDate(aDate,'dd.MM.YYYY HH:mm'));
  gTimes.selectCell(gTimes.getRowIndex(aId),0);
  window.setTimeout(function(){
    gTimes.editCell();
    gTimes.enableKeyboardSupport(true);
    gTimes.setActive();
  },1);
}
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
        ,{id: "refresh", type: "button", text: "", img: "fa fa-refresh"}
        ,{id: "menu", type: "button", text: "", img: "fa fa-bars"}
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
  gTimes.setHeader(["Projekt","Aufgabe","Dauer (h)","Notiz","Start"]);
  gTimes.setColumnIds('PROJECT,JOB,DURATION,NOTE,START')
  gTimes.setColTypes("edtxt,edtxt,edtxt,txt,txt");
  gTimes.setColValidators("NotEmpty,NotEmpty,ValidTime,null,NotEmpty");
  gTimes.setColumnHidden(4,true);
  gTimes.setInitWidths('*,*,70,*,*');
  gTimes.enableValidation(true);
  //gTimes.enableEditEvents(false,true,true);

  ppTimes = new dhtmlXPopup();
  var ppTimeseId = ppTimes.attachEvent("onShow",function(){
 		 ppTimesGrid = ppTimes.attachGrid(300,200);
  				ppTimesGrid.setImagePath("../../../codebase/imgs/")
  				ppTimesGrid.load("../common/grid2.xml", function(){
  					ppTimesGrid.filterBy(1, myForm.getItemValue("country"));
  					ppTimesGrid.selectRow(0);
  					ppTimesGrid._loaded = true;
  				});
  				ppTimesGrid.attachEvent("onRowDblClicked", function(id){
  					myForm.setItemValue("country", ppTimesGrid.cells(id,1).getValue());
  					myPop.hide();
  					ppTimesGrid.clearSelection();
  				});
  				ppTimes.detachEvent(ppTimeseId);
	});
  gTimes.attachEvent("onEditCell", function(stage,rId,cInd,nValue,oValue){
    if (stage == 2) //validation
      return true;
    else if ((cInd==0)&&(nValue!="")) {
      var cell = gTimes.cells(rId, cInd).cell;
    	var rect = cell.getBoundingClientRect();
      if (!ppTimes.isVisible()) ppTimes.show(rect.left, rect.top,rect.width,rect.height);
      if (ppTimesGrid._loaded) {
        ppTimesGrid.filterBy(1,value);
        selectRowIfNotSelected();
      }
    }
  });
  //gTimes.setDateFormat("%d.%m.%Y");
  //gTimes.setColSorting('str,str,str,str');
  gTimes.attachFooter("Gesamtzeit,#cspan,#stat_sum,,",["text-align:left;"]);
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
  dsTimes.onSetValue = function(aField,aValue) {
    if (aField=='PROJECT') {
      return aValue;
    } if (aField=='DURATION') {
      var tmp = aValue.substring(aValue.indexOf(' ')+1,aValue.length);
      switch (tmp) {
      case 'min':{
        var tmp2 = aValue.substring(0,aValue.indexOf(' '));
        tmp2 = tmp2/60/8;
        return tmp2.toPrecision(2).replace('.',',');
      }
      default:{
        return aValue/8;
      }
    }
    } else {
      return aValue;
    }
  }
  dsTimes.onGetValue = function(aField,aValue) {
    if (aField=='PROJECT') {
      if (aValue.indexOf('{')>-1)
        return aValue.substring(aValue.indexOf('{')+1,aValue.indexOf('}'))
      else return aValue;
    } if (aField=='DURATION') {
      var tmp = parseFloat(aValue.replace(',','.'))*8;
      if (tmp > 1)
        return tmp.toPrecision(2)+' h'
      else return Math.round(tmp*60)+' min';
    } else {
      return aValue;
    }
  }
  window.parent.sbMain.attachEvent("onSelect", function(id, lastId){
    if (id == 'siTimes') {
      RefreshTimes();
    }
  });
});
