import Ember from 'ember';
import config from './../config/environment';

export default Ember.TextArea.extend({
  tagName: "textarea",
  attributeBindings: ["disabled"],
  disabled: false,
  cordova: Ember.inject.service(),

  valueChanged: Ember.observer('value', function () {
    var _this = this;
    var textarea = _this.element;

    if(textarea) {
      Ember.run.once(function(){
        // auto-resize height of textarea $('textarea')[0].
        if (textarea.scrollHeight < 120) {
          Ember.$(textarea)
            .css({'height':'auto','overflow-y':'hidden'})
            .height(textarea.scrollHeight - 15);

          var parent = _this.get('parentDiv');
          var grandParentDiv = Ember.$("." + parent).closest(".review_item ");
          if(grandParentDiv.length === 0) {

            // auto-move textarea by chaning margin of parentDiv
            var paddingSize = config.cordova.enabled ? 5 : (textarea.scrollHeight - 40);
            Ember.$("." + parent)
              .css({'padding-bottom': (paddingSize > 0 ? paddingSize : 0) });

            // scrolling down to bottom of page
            if(_this.get("value") !== ""){
              window.scrollTo(0, document.body.scrollHeight);
            }
          }

        } else {
          Ember.$(textarea)
            .css({'height':'auto','overflow-y':'auto'})
            .height(105);
        }
      });
    }
  }),

  didInsertElement() {
    var _this = this;
    var parent = _this.get('parentDiv');
    var grandParentDiv = Ember.$("." + parent).closest(".review_item ");

    // Apply only in Donor Cordova App.
    if(grandParentDiv.length === 0 && config.cordova.enabled) {

      var msgTextbox = Ember.$(Ember.$(_this.element).closest(".message-textbar"));

      Ember.run.scheduleOnce('afterRender', this, function(){

        var height = _this.get("cordova").isIOS() ? 55 : 30;
        Ember.$(".message-footer").height(height);

        Ember.$(_this.element).focus(function(){
          msgTextbox.css({'position':'relative'});
          window.scrollTo(0, document.body.scrollHeight);
        });

        Ember.$(_this.element).blur(function(){
          msgTextbox.css({'position':'fixed'});
        });
      });

    }
  }

});
