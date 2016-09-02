var OptionsDlg = function(list) {
   this.dlg = $('#optionsDlg');
   this.list = $('#pokeList');
   this.dropDown = $('#pokeMenu');
   this.search = $('#searchBar');
   var self = this;
   list.forEach(function(e, i){
      self.list.append($('<li></li>').append($('<a href="#"></a>').append(e)));
   });
}

OptionsDlg.prototype.run = function(func) {   
   var self = this;
   var select;

    $('#pokeMenu').menu({
      position: {my: "left top", at: "left bottom"},
      icons: {submenu: "ui-icon-circle-triangle-s"},
      select: function(event, ui) {
         if(ui.item.text().substr(0, 6) !== "Select"){
            self.search.val(ui.item.text());
            self.dlg.dialog("close");
            func();
         }
      }
   });
   
   this.dlg.dialog({
      width: 450,
      height: 800,
      modal: true,
      buttons: [
         {text: "Ok", click: function() {self.dlg.dialog("close");}},
      ]
   });
}