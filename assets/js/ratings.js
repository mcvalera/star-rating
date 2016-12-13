var Rating = (function() {
  'use strict';

  function Rating(configObj) { //el, rating, maxRating, callback
    this.container = configObj.container; // container element
    this.currentRating = configObj.currentRating || 0; // set 0 as default rating
    this.maxRating = configObj.maxRating || 5; // set 5 as default max rating
    this.collectionName = configObj.collectionName || 0; // setting default to 0 won't matter assuming that there won't be multiple Rating instances
    this.settable = configObj.settable || false;
    this.callback = configObj.callbackFunction;
  }

  Rating.prototype = {
    /* the id links the input to the label/star, while the collectionName groups the stars together. hence the ids are unique to each input-label pair, while all inputs within the same Rating instance share the same collectionName as their name */
    starTemplate: '<input type="radio" id="{id}" name="{collectionName}" value="{val}" {checked} {disabled}>' +
      '<label for="{id}" {disabled}>' +
      '<svg height="25" width="23" class="star" data-rating="{val}">' +
      '<polygon points="9.9, 1.1, 3.3, 21.78, 19.8, 8.58, 0, 8.58, 16.5, 21.78" style="fill-rule:nonzero;"/>' +
      '</svg></label>'
    ,
    getRating: function() {
      return this.currentRating;
    },
    setRating: function(val) {
      this.currentRating = val;
      return val;
    },
    init: function() {
      var wrapper = this.createWrapperNode();
      this.appendStarsToWrapper(wrapper);
    },
    createWrapperNode: function() {
      var wrapper = document.createElement('div');
      wrapper.classList = 'star-rating-wrapper';
      this.container.append(wrapper);
      return wrapper;
    },
    appendStarsToWrapper: function(wrapper) {
      var set = false;
      var currentRating = this.getRating();
      var collectionName = this.collectionName; // set as the name of each input within a Rating instance to group them together

      for (var i = this.maxRating; i > 0; i--) {
        var id = collectionName + '-' + i; // id needs to be unique to each input-label pair
        var temp = this.starTemplate.replace(/{id}/g,id).replace(/{collectionName}/g, collectionName).replace(/{val}/g, i);

        // if not settable, add disabled attribute to prevent hover states and click events on radio input and their labels
        if (!this.settable) {
          temp = temp.replace(/{disabled}/g, 'disabled')
        }
        // if rating data is being passed in, then add checked attribute to the first input that satisfies the condition below
        if (currentRating > 0 && !set && i <= currentRating) {
          temp = temp.replace(/{checked}/, 'checked');
          set = true;
        }
        // this.container.innerHTML += temp;
        wrapper.innerHTML += temp;
      }
      return this.container;
    }
  }

  return Rating;

})();

// <input type="radio" id="{id}" name="star-rating-{collectionName}" value="{val}" {checked}>
// <label for="{id}">
// <svg height="25" width="23" class="star" data-rating="{val}">
// <polygon points="9.9, 1.1, 3.3, 21.78, 19.8, 8.58, 0, 8.58, 16.5, 21.78" style="fill-rule:nonzero;"/>
// </svg></label>