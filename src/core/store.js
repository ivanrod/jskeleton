'use strict';
/*globals Jskeleton, Backbone _ */
/* jshint unused: false */

//## Jskeleton.store
Jskeleton.store = function(classConstructor, attributes) {
    if (!classConstructor || typeof classConstructor !== 'function') {
        throw new Error("classConstructor must be exist");
    }

    if (attributes) {
        // Find idAttribute into object attributes
        var key = undefined;
        _.each(attributes, function(value, _key) {
            if (_key === classConstructor.prototype.idAttribute) {
                key = _key;
                return;
            }
        });

        // If idAttribute exist into model attributes, find that model and get it from store
        if (key) {
            var objectId = _.pick(attributes, classConstructor.prototype.idAttribute),
                modelId = objectId[classConstructor.prototype.idAttribute];

            // Check if model exist into store
            if (Jskeleton.modelStore.modelExist(modelId, classConstructor)) {
                var model = Jskeleton.modelStore.get(modelId, classConstructor);
                if (model) {
                    model.set(attributes);
                }
                return model;
            }
        }
    }

    // Create model instance
    var model = new classConstructor(attributes);
    Jskeleton.modelStore.add(model);
    return model;
};
