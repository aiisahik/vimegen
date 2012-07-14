$(function(){

   // Person Model
   // ----------
   window.Person = Backbone.Model.extend();
   window.Persons = Backbone.Collection.extend({
      model: Person,
      url: '/persons'
   });


//-- VIEWS

   // PERSON VIEW
   // ----------
   window.PersonView = Backbone.View.extend({
      template: _.template($("#person-template").html()),
      tagName: 'li',
      className: "span3",

      events: {
         'click .thumbnail': 'toNode',
      },
      initialize: function() {
         _.bindAll(this, 'render','toNode');
         this.model.bind('reset', this.render);
      },
      render: function() {

         if (!this.model.has('pictureUrl')) {
            this.model.set("pictureUrl", "/img/noprofile.png");
         }
         if (!this.model.has('headline')) {
            this.model.set("headline", "");
         }
         $(this.el).empty().append(this.template(this.model.toJSON()));
         return this;
      },
      toNode: function(){
         ///treeNodesView.update(this.model.get('id'));
      }
   });

   // PERSONS GENERATOR VIEW
   // ----------

   window.PersonsView = Backbone.View.extend({
      tagName: 'ul',
      className: "thumbnails",
      // tagName: 'div',
      // className: "row-fluid",
      initialize: function() {
         _.bindAll(this, 'render');
         this.collection.bind('reset', this.render);
      },
      render: function() {
         $(this.el).empty();
         var $i = 0
         _.each(this.collection.models, function(person){
            var personView = new PersonView({
               model: person
            });
            $(this.el).append(personView.render().el);
            // if ($i%4 == 3){
            //    $(this.el).append('</div><div class="row-fluid">');
            // }
            // $i++;
         }, this);
         //$('#persons').empty().append($(this.el));
         //-- resize node to below 200 px --//
         window.personsView.after();

         return this;
      },

      after: function(){
         $("#persons").find('li').height(150);
         $("#persons").find('.thumbnail').height(150);

         var firstNames = window.personsList.pluck('firstName');   
         var lastNames = window.personsList.pluck('lastName');
         window.names = [];
         for(var i=0; i<lastNames.length; ++i) {
            window.names.push(firstNames[i] + " " + lastNames[i]);
         }
         $("#searchbox").autocomplete({source: window.names});

         $("#searchbox").keypress(function(event) {
            if ( event.which == 13 ) {
               if ($("#searchbox").val() == "") {
                  window.personsView.render();
               } else {
                  event.preventDefault();
                  var person_index = jQuery.inArray($("#searchbox").val(), window.names);
                  if (person_index >=0 ) {
                     window.personsView.render_person(window.personsList.at(person_index));
                  }
                  if ($("#searchbox").val() == 'Chia-Chi Li') {
                     $("#persons").append("<h2>IS GAY</H2>");
                  }
               }
            }
         });
      },

      render_person: function(person){
         //$(this.el).empty();
         var personView = new PersonView({
               model: person
         });
         $(this.el).empty().append(personView.render().el);
         $("#persons").empty().append(this.el);
      }
   });

   var AppRouter = Backbone.Router.extend({
      routes: {
         '': 'home'
      },
      initialize: function() {
         // should instantiate root level views
         window.personsList = new Persons();

         window.personsView = new PersonsView({
            collection: window.personsList
         });
      },

      home: function() {
          window.personsList.fetch();
         $("#persons").append(window.personsView.render().el);
         

      },

      render: function(){
         

      }


   });

   $(function() {
      var app = new AppRouter();
      Backbone.history.start();

   });

});