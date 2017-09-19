
$.get( "/card.json", function(json) {
  $('#cardContent').text("Total No of Orders: "+ json.value);
});
