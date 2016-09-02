var Poketype = function(){
    this.pokedex;
    this.pokemonList = [];
    this.currentPokemon;
    this.resource = "https://pokeapi.co";
    this.bulbSearch = 'https://bulbapedia.bulbagarden.net/w/index.php?title=Special%3ASearch&search=';
    this.atk = true;
}

Poketype.types = ["water", "flying", "normal", "fighting", "bug", "ghost", "psychic", 
  "ice", "dark", "fairy", "fire", "steel", "rock", "poison", "electric",
  "grass", "dragon", "ground"];

Poketype.prototype.init = function(){
    var self = this;
    var name;
    
    $("#searchBtn").button().on('click', function(e) {self.search();});
    $("#atkBtn").button().on('click', function(e){self.switchAD();});
    var search = $("#searchBar").attr("placeholder", "Enter Pokemon name or ID #");
    this.makeAllTypesList();
    $.ajax({
        url: this.resource + "/api/v1/pokedex/1/",
        async: false,
   
        contentType: "application/json",
        type: "GET",
        dataType: "json",
   
        success: function(data) {
           self.pokedex = data.pokemon;
           self.pokedex.forEach( function(e, i){
              name = e.name.toUpperCase();
              self.pokemonList.push(name);
           });
           $("#searchBar").autocomplete({
              source: self.pokemonList,
              select: function(event, ui){
                search.val(ui.item.value);
                self.search();
                search.val("");
              }
           });
           search.val("PIKACHU");
           self.search();
           self.switchAD();
           self.optionsDlg = new OptionsDlg(self.pokemonList);
           $("#helpBtn").button().on('click', function(e){self.optionsDlg.run(self.search.bind(self))});
        },
   
        error: function(xhr, status) {
           alert("Get Pokedex Failed!?");
        }
    });


}

Poketype.prototype.switchAD = function(){
    var atkBtn = $("#atkBtn");
    if(this.atk){
        atkBtn.button('option', 'label', 'Defense');
        $('#normal').children('.effectiveness-header').text("Normally damaged by...");
    }
    else{
        atkBtn.button('option', 'label', 'Attack');
        $('#normal').children('.effectiveness-header').text("Normally damages...");
    }
    $('#effectiveness-container').children().toggleClass('hidden');
    $('#normal').toggleClass('hidden');
    this.atk = !this.atk;
    this.loadTypes();
}
Poketype.prototype.search = function(){
    var resource, self = this;

    var val = $('#searchBar').val(), prevSprite;
    $("#spriteImg").attr("src",  'http://sierrafire.cr.usgs.gov/images/loading.gif');
    if(!isNaN(val)){
        resource = "api/v1/pokemon/" + val+'/';
    }
    else{
        this.pokedex.forEach(function(e, i){
            if($('#searchBar').val().toLowerCase() === e.name){
                resource = e.resource_uri;
            }
        });
    }
    if(resource){
        $.ajax({
          url: this.resource + '/' +  resource,
     
          contentType: "application/json",
          type: "GET",
          dataType: "json",
          async: false,
     
          success: function(data) {
             self.currentPokemon = {
                name: data.name.toUpperCase(),
                types: data.types,
                abilities: data.abilities,
                spriteUri: data.sprites.length && data.sprites[0].resource_uri
             }
             self.load();
             
          },
     
          error: function(xhr, status) {
             alert("Get Pokemon info Failed!?");
          }
       });
    }
    else{
        alert("Pokemon not found");
    }
    $('#searchBar').val("");
}

Poketype.prototype.load = function(){
    this.loadSprite();
    this.loadName();
    this.loadTypes();
}

Poketype.prototype.loadSprite = function(){
    var self = this;
    var imgUrl;
    if(this.currentPokemon.spriteUri){
        $.ajax({
          url: this.resource + self.currentPokemon.spriteUri,
          async: false,
     
          contentType: "application/json",
          type: "GET",
          dataType: "json",
     
          success: function(data) {
             imgUrl = self.resource + data.image;
          },
     
          error: function(xhr, status) {
             alert("Get Pokemon info Failed!?");
          }
       });
    }
    else{
      imgUrl = "http://ic.pics.livejournal.com/uosnim/63552471/19021/19021_original.png";
    }
    if(imgUrl){
            $("#spriteImg").attr("src",  imgUrl);
    }
}

Poketype.prototype.loadName= function(){
    var self = this;
    var name = $('#species-name'), insert = "", ability, temp = "", type, types, typing;
    name.empty();
    for(var i = 0; i < this.currentPokemon.name.length; i++){
      insert += this.currentPokemon.name.charAt(i);
      insert += i < this.currentPokemon.name.length - 1 ? " " : "";
    }
    name.text(insert);

    var abilities = $('#abilities');
    abilities.empty();
    insert = $("<p>Abilities: </p>");
    for(var i = 0; i < self.currentPokemon.abilities.length; i++){
        ability = self.currentPokemon.abilities[i].name;
        ability = ability.split('-');
        temp = "";
        for(var j = 0; j < ability.length; j++){
            temp += ability[j].charAt(0).toUpperCase() + ability[j].slice(1);
            temp += j < ability.length -1 ? " " : "";
        }

        ability = temp;
        insert.append($("<a target='_blank' href ='"  + self.bulbSearch + ability +"'>"+
          ability  + "</a> "));
        if(i < self.currentPokemon.abilities.length -1){
          insert.append($("<span>, &nbsp;</span>"));
        }
    }
    abilities.append(insert);

    typing = $("#typing").empty();
    types = this.currentPokemon.types;
    types.forEach(function(e, i){
      typing.append(Poketype.makeType(e.name));
      if(i < types.length -1){
          typing.append($("<span> / </span>"));
      }
    });
};

Poketype.prototype.loadTypes= function(){
   if(this.atk){
      this.loadAtkTypes();
   }
   else{
      this.loadDfnTypes();
   }
};

Poketype.prototype.loadAtkTypes = function(){
    var normal = this.makeAllTypesList();
    var types = this.currentPokemon.types;
    var typesData = [], ineffective = {}, supereffective = {}, noeffect = {};
    var ineffectiveT = [], supereffectiveT = [], noeffectT  = [];
    var self = this;
    types.forEach(function(e, i){
        ineffectiveT = [];
        supereffectiveT = [];
        noeffectT  = [];
        $.ajax({
          url: self.resource + e.resource_uri,
          async: false,
     
          contentType: "application/json",
          type: "GET",
          dataType: "json",
     
          success: function(data) {
             data.ineffective.forEach(function(e, i){ineffectiveT.push(e.name)});
             data.super_effective.forEach(function(e, i){supereffectiveT.push(e.name)});
             data.no_effect.forEach(function(e, i){noeffectT.push(e.name)});
          },
     
          error: function(xhr, status) {
             alert("Get Type Ability Failed");
          }
       });
        self.checkAndMoveType(normal, "ineffective", ineffectiveT, ineffective);
        self.checkAndMoveType(normal, "super_effective", supereffectiveT, supereffective);
        self.checkAndMoveType(normal, "no_effect", noeffectT, noeffect);
    });
    this.multipliers(noeffect, ineffective, supereffective);
};

Poketype.prototype.multipliers = function(noeffect, ineffective, supereffective){
    Poketype.types.forEach(function(e, i){
          var label = this.atk ? '#no_effect' : '#immune';
          var normal = $("#normal").children('.types');
          if(noeffect[e]){
              $('#no_effect').children('.types').append($('.types').children().children('.'+e).parent());
          }
          else if(supereffective[e] && ineffective[e]){
              if(supereffective[e] > ineffective[e]){
                  $('.types').children().children('.'+e).append($('<span> ('+ (2*(supereffective[e] - ineffective[e]))+'x)</span>'));
              }
              else if(supereffective[e] < ineffective[e]){
                  $('.types').children().children('.'+e).append($('<span> ('+ (1/(2*(ineffective[e]-effective[e])))+'x)</span>'));
              }
              else{
                  normal.append($('.types').children().children('.'+e).parent());
              }
          }
          else if(ineffective[e]){
              $('.types').children().children('.'+e).append($('<span> ('+ (1/(2*ineffective[e]))+'x)</span>'));
          }
          else if(supereffective[e]){
              $('.types').children().children('.'+e).append($('<span> ('+ (2*supereffective[e])+'x)</span>'));
          }
    });
}

Poketype.prototype.loadDfnTypes = function(){
    var normal = this.makeAllTypesList();
    var types = this.currentPokemon.types;
    var typesData = [], ineffective = {}, supereffective = {}, noeffect = {};
    var self = this;
    var dfense = defense;
    types.forEach(function(e, i){
        self.checkAndMoveType(normal, "weak", defense[e.name].super, supereffective);
        self.checkAndMoveType(normal, "resists", defense[e.name].ineffective, ineffective);
        self.checkAndMoveType(normal, "immune", defense[e.name].immune, noeffect);
    });
    this.multipliers(noeffect, ineffective, supereffective);
}

Poketype.prototype.checkAndMoveType = function(normal, effectivity, effectTypes,  effectArray){
    var name = "#"+effectivity;
    effectTypes.forEach(function(e, i){
          $(name).children('.types').append(normal.children().children('.'+e).parent());
          effectArray[e] = effectArray[e] === undefined ? 1 : effectArray[e] + 1 ;
    });
}



Poketype.prototype.makeAllTypesList = function(){
    $('.types').empty();
    var normal = $("#normal").children('.types');
    var element;
    Poketype.types.forEach(function(e, i){
        normal.append($('<li></li>').append(Poketype.makeType(e)));
    });
    return normal;
};

Poketype.makeType = function(type) {
   return $('<span class = "'+type+'">' + type.charAt(0).toUpperCase() + type.slice(1) +'</span>');
};