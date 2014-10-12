/***********************
* Adobe Edge Animate Composition Actions
*
* Edit this file with caution, being careful to preserve 
* function signatures and comments starting with 'Edge' to maintain the 
* ability to interact with these actions from within Adobe Edge Animate
*
***********************/
(function($, Edge, compId){
var Composition = Edge.Composition, Symbol = Edge.Symbol; // aliases for commonly used Edge classes

   (function(symbolName) {
      Symbol.bindElementAction(compId, symbolName, 'document', 'compositionReady', function(sym, e) { 
        setAnimationObject('ipos-attraction');
        $('.ipos-attraction-os').html(deviceOS);
        $('.ipos-attraction-processor').html(deviceProcessor);
        $('.ipos-attraction-memory').html(deviceRam);
      });
      
      Symbol.bindTimelineAction(compId,symbolName,'Default Timeline','play',function(sym,e) {
        
      });
      
      Symbol.bindTriggerAction(compId,symbolName,'Default Timeline',18774,function(sym,e) {
        sym.play('loop');
      });
      
      Symbol.bindTriggerAction(compId,symbolName,'Default Timeline',2264,function(sym,e) {
        highlightButton('processor');
      });

      Symbol.bindTriggerAction(compId, symbolName, 'Default Timeline', 6259, function(sym, e) {
        resetButtons();
      });
      
      Symbol.bindTriggerAction(compId,symbolName,'Default Timeline',6509,function(sym,e) {
        highlightButton('os');
      });

      Symbol.bindTriggerAction(compId, symbolName, 'Default Timeline', 13772, function(sym, e) {
         resetButtons();
      });
      
      Symbol.bindTriggerAction(compId,symbolName,'Default Timeline',14007,function(sym,e) {
        highlightButton('memory');
      });
      
      Symbol.bindTriggerAction(compId, symbolName, 'Default Timeline', 18259, function(sym, e) {
         resetButtons();
      });
      
      Symbol.bindTimelineAction(compId, symbolName, 'Default Timeline', 'complete', function(sym, e) {
         //animationComplete();
      });

   })('stage');

})(jQuery, AdobeEdge, 'ipos-attraction');