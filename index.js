var us = typeof require === 'function' ? require('underscore') : _

var ObjectIndexer = function() {
	var self = this
	var objects = []
	var indexed_properties = {}

	var remove = function(object_index) {
		var to_remove = objects[object_index]
		for (property in to_remove) {
			if (to_remove.hasOwnProperty(property)) {
				indexed_properties[property].splice(
					indexed_properties[property].indexOf(object_index), 1)
			}
		}
		//objects.splice(object_index, 1)
	}

	var sort = function(property) {
		self.sortByPropertyValue(objects, indexed_properties, property)
	}

	var getObjects = function(indexes) {
		return indexes.map(function(object_index) {
			return objects[object_index]
		})
	}

	var callOnObjectsWithMatchingProperties = function(to_match, callback) {
		getIndexesOfObjectsWithMatchingProperties(to_match).forEach(function(object_index) {
			callback(objects[object_index], object_index)
		})
	}

	var addPropertyValue = function(property, value, object_index) {
		if (typeof indexed_properties[property] === 'undefined') {
			indexed_properties[property] = []
		}
		indexed_properties[property].push(object_index)
		sort(property)
	}

	this.add = function(new_object) {
		if (Array.isArray(new_object)) {
			new_object.forEach(function(value) {
				self.add(value)
			})
		} else {
			new_object = this.copyObject(new_object)
			var index = objects.push(new_object) - 1
			for (property in new_object) {
				if (new_object.hasOwnProperty(property)) {
					addPropertyValue(property, new_object[property], index)
				}
			}
		}
	}

	var getIndexesOfObjectsWithMatchingProperties = function(to_match) {
		var matches = []
		for (property in to_match) {
			if (typeof indexed_properties[property] !== 'undefined') {
				matches = us.union(matches, indexed_properties[property].filter(function(object_index) {
					return to_match[property] === objects[object_index][property]
				}))
			}
		}
		return matches
	}

	this.removeObjectsWithMatchingProperties = function(to_match) {
		callOnObjectsWithMatchingProperties(to_match, function(object, index) {
			remove(index)
		})
	}

	this.getObjectsWithMatchingProperties = function(to_match, callback) {
		callback(getObjects(getIndexesOfObjectsWithMatchingProperties(to_match)).map(function(object) {
			return self.copyObject(object)
		}))
	}

	this.getFirstObjectWithMatchingProperties = function(to_match, callback) {
		var matching_indexes = getIndexesOfObjectsWithMatchingProperties(to_match)
		callback(matching_indexes.length > 0 && this.copyObject(objects[matching_indexes[0]]))
	}

	this.getOrderedObjects = function(property_to_order_by, callback, offset, count) {
		if (indexed_properties.hasOwnProperty(property_to_order_by)) {
			var indexes
			offset = offset || 0
			if (count) {
				indexes = indexed_properties[property_to_order_by].slice(offset, offset + count)
			} else if (offset) {
				indexes = indexed_properties[property_to_order_by].slice(offset)
			} else {
				indexes = indexed_properties[property_to_order_by]
			}
			callback(indexes.map(function(object_index) {
				return objects[object_index]
			}))
		} else {
			callback([])
		}
	}
}

// Based on http://stackoverflow.com/a/728694/201789
ObjectIndexer.prototype.copyObject = function(obj) {
	// Handle the 3 simple types, and null or undefined
	if (null === obj || "object" !== typeof obj) {
		return obj
	}

	var copy = {}

	if (obj instanceof Date) {
		copy = new Date()
		copy.setTime(obj.getTime())
	}

	if (obj instanceof Array) {
		copy = []
		for (var i = 0; i < obj.length; ++i) {
			copy[i] = ObjectIndexer.prototype.copyObject(obj[i])
		}
	}

	Object.getOwnPropertyNames(obj).filter(function(attr) {
		return !copy.hasOwnProperty(attr)
	}).forEach(function(attr) {
		copy[attr] = obj[attr]
	})

	return copy
}

ObjectIndexer.prototype.sortByPropertyValue = function(objects, indexed_properties, property) {
	if (typeof indexed_properties[property] !== 'undefined') {
		indexed_properties[property].sort(function(a, b) {
			var a_value = objects[a][property]
			var b_value = objects[b][property]
			if (a_value === b_value) {
				return 0
			}
			return (a_value < b_value) ? -1 : 1
		})
	}
}

ObjectIndexer.prototype.objectsMatch = function(obj1, obj2) {
	if (Object.keys(obj1).length !== Object.keys(obj2).length) {
		return false
	}
	return Object.keys(obj1).every(function(property) {
		return obj2.hasOwnProperty(property) && obj1[property] === obj2[property]
	})
}

if (typeof module !== 'undefined'
	&& typeof module.exports !== 'undefined') {
	module.exports = function() { return new ObjectIndexer() }
}
