var headers = ["Sample ID", "Name", "Plate Location", "Description"];
var data = [["CTGCC", "Sample #1", "A1","foo"]];
var idRegex = new RegExp("[a-zA-Z_-]");
var load = document.getElementById("load");
//var save = document.getElementById("submit");
var notification = document.getElementById("status");
var 
    id = document.getElementById("id"),
    email = document.getElementById("email"),
    title = document.getElementById("tit"),
    amplicon = document.getElementById("amp"),
    date = document.getElementById("date");



idValidator = function(value, callback) {//id Validator for Sample Id, and Index Columns
    setTimeout(function() {
        if (idRegex.test(value)) {

            callback(true);
        } else {
            callback(false);
        }
    }, 500);

};

function firstRowRenderer(instance, td, row, col, prop, value, cellProperties) {//renders empty rows with '~'
    Handsontable.renderers.TextRenderer.apply(this, arguments);
    if (!value || value === '' || value == null) {
        td.innerHTML = "~";

    }
}

/*var cols = [{
        type: 'text',
        validator: idValidator,
        allowedInvalid: false,
        allowInsertRow: false,
        allowInsertColumn: false,
        contextMenu: false,
        manualColumnMove: false



    },
    {
        
        validator: idValidator,
        autoColumnsSize: true


    },
    {
        type: "text",
        validator: idValidator,
        allowedInvalid: true


    },
    {
        
        autoColumnsSize: true,
        allowInsertColumn: false,
        manualColumnMove: false

    }


];*/

var
    container = document.getElementById('spreadsheet'),
    hot;

var settings = {//setting for handsontable
    data: data,
    rowHeaders:true,
    colHeaders: headers,
    columnSorting: true,
    //columns: cols,
    minRows:10,
    cells: function(row, col, prop, value) {
        var cellProperties = {};
        cellProperties.renderer = firstRowRenderer;
          
        return cellProperties;
    },
    manualColumnMove: true,
    manualRowMove: true,
    contextMenu:{
        callback: function(key, options) {},
        items: { 
            "col_left": {
                disabled: function() {
                    arr = hot.getSelected();
                    // if first col, disable this option
                    return arr[0][1] == 0;
                }
            },
            "col_right": {
                disabled: function() {
                    // if last col, disable this option
                    arr = hot.getSelected();
                    return arr[0][1] == hot.countCols() - 1 || hot.getSelectedLast()[3] == hot.countCols()-1;
                }
            },
            "remove_col":{
              disabled:function(){
                return hot.countCols() == 1
              }
            },
            "remove_row":{
              disabled:function(){
                return hot.countRows() == 1 || (Math.abs(hot.getSelectedLast()[2] - hot.getSelectedLast()[0]) == hot.countRows()-1);
              }
            },
            "row_above":{
              disabled:function(){
                var col = hot.getSelectedLast()
                return col[1] == col[3]
              }
            },
            "row_below":{
              disabled:function(){
                var col = hot.getSelectedLast()
                return col[1] == col[3]
              }
            },
            "rename_header": {
                name: "Rename Header",
                callback: (function() {
                    var getCol = hot.getSelectedLast()[1];
                    headers[getCol] = prompt("Enter Name:");
                    hot.updateSettings({
                        colHeaders: headers
                    })
                })
            }
        }
    }
};



hot = new Handsontable(container, settings);

hot.updateSettings({//adds validator to table
  cells: function(row,col,prop,value){
    var cellProperties = {};
    cellProperties.renderer = firstRowRenderer;
    if(hot.getColHeader(col) === "Sample ID" || hot.getColHeader(col) === "Index I" || hot.getColHeader(col) === "Index II"){
          cellProperties.validator = idValidator;
    }
    return cellProperties
  }
});

function arraymove(arr, fromIndex, toIndex) {
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
}


/*Handsontable.dom.addEvent(load, 'click', function() {//load data from flask into table
    $.ajax('scripts/json/load.json', 'GET', '', function(res) {
        var data = JSON.parse(res.response);

        hot.loadData(data.data);
        notification.innerText = 'Data loaded';

    });
});*/

function formValid(){
    
    return id.checkValidity() && email.checkValidity() && title.checkValidity().checkValidity() && amplicon.checkValidity() && date.checkValidity();
   
}

Handsontable.dom.addEvent(submit, 'click', function() {//save data from table into flask
    if(formValid()){
      var SampleData = {headers:hot.getColHeader(),data:hot.getData();
      var requestData = {id:id.value(),email:email.value(),title:tit.value(),amplicon:amp.value(),date:date.value,Samples:SampleData};
      console.log(data);
      // save all cell's data
      $.ajax({
          url: '/',
          type: 'POST',
          data: JSON.stringify({
              request:requestData

          }),
          contentType: 'application/json;charset=UTF-8',
          success: function(res) {
              //document.getElementById("status").innerHTML = "" + res;

          }
      });
    }
    
});