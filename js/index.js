$(document).ready(function() {
  $("#info").append("Coded by <a href=\"https://www.freecodecamp.com/dereje1\" target=\"_blank\">DGetahun</a>, Powered by: <a href=\"https://www.mediawiki.org/wiki/API:Main_page\" target=\"_blank\">Wiki API</a>");
});

//Do the following when the search button is clicked (or enter is hit)
 $("#searchbutton" ).click(function() {
   //empty div and get search request
   $("#wikiresults").empty();
   var searchitem=$('#searchrequest').val();
   //append "&Callback=?" here to avoid cross origin unlike the weather app where you have to append "?callback=?"
   var wikiApiConnection="https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch="+searchitem+"&callback=?";
   //attempt getting json data from wiki
   $.getJSON(wikiApiConnection, function(wikiData){
          $("#wikiresults").empty();
          //get number of results (if any)
          var resultLength = wikiData['query']['search'].length;
          //if results found display dynamically
          if (resultLength!==0){
            for (var i=0;i<resultLength;i++){
              //get metadata of entry and isolate title
              var wikiEntry=wikiData['query']['search'][i];
              var title=(wikiEntry.title);
              //send to function that finds detailed info on the title
              articleDetail(i+1,title);
              }
          }
          //otherwise display appropriately
          else{
            var divID=createDiv(0,0);
            $(divID).append("<h4><strong>No Results Found!</strong></h4>");
          }
          });
   });

//function that finds detailed information on a specific title
function articleDetail(i,title){
  //different wiki api params to find details on a specific title
  var wikiDetailApiConn="https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&exsentences=2&titles="+title+"&callback=?";
  $.getJSON(wikiDetailApiConn, function(wikiDetailData){
    //if response use Object keys (very useful) to find all the keys of an object if not known already
    //in this case the object keys are the pageId's 
    var pageKey = Object.keys(wikiDetailData.query.pages)[0];
    var content = wikiDetailData.query.pages[pageKey]['extract'];
    var pageId = (wikiDetailData.query.pages[pageKey]['pageid']);
    //create div to contain results
    var divID=createDiv(i,pageId);
    //append results into the div
    $(divID).append("<h4><strong>"+title+"</strong></h4>");
    $(divID).append(content);
    
  });
}

//cretes the divs dynamically to contain the results
function createDiv(idTag,pageid){
  //create wrapper to link that sends to main wiki article note here you can use both the pageID, with ?curid
  //or just the title
  var linkWrap="<a href=\"https://en.wikipedia.org/wiki/?curid="+pageid+"\" target=\"_blank\">";
  //create initial div format
  var divMaker=linkWrap+"<div class=\"linking\" id=\"searchresultdiv" +idTag+"\""+"></div></a>";
  //console.log(newdiv);
  var divID="#searchresultdiv" +idTag;
  //create div
  $("#wikiresults").append(divMaker);
  //assign common css
  $(divID).css({
       "background-color": "#cfd9f7",
       "margin-top": ".4em",
       "padding": "1em",
       "border-radius": ".25em"
    });
  //assign desired css based on window size as mobile overflows
  if($(window).width() > 500){
       $(divID).css({
       "font-size": "1.25em",
       "margin-left": "5em",
       "margin-right": "5em",
    });
  }
  else{
       $(divID).css({
       "background-color": "#cfd9f7",
       "font-size": "0.75em",
       "margin-left": "0em",
       "margin-right": "0em",
    });
  }

  $(".linking").css({
    "color":"black"
  });
  //return divID
  return divID;
}