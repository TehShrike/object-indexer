var makeNewIndex = require('./')

var index = makeNewIndex()

var things_to_index = [
	{
		slug: 'whatever',
		num: 13,
		num_str: '13'
	},
	{
		slug: 'another',
		num: 1,
		num_str: '1'
	},
	{
		slug: 'more',
		num: 117,
		num_str: '117'
	},
	{
		slug: 'a bit more',
		num: 1
	},
	{
		slug: 'even more',
		num: 2,
		num_str: '2'
	}
]

index.add(things_to_index)


console.log("index.getOrderedObjects('num'):")
console.log(index.getOrderedObjects('num'))
console.log("index.getOrderedObjects('num_str'):")
console.log(index.getOrderedObjects('num_str'))
console.log("index.getObjectsWithMatchingProperties({num: 1}):")
console.log(index.getObjectsWithMatchingProperties({num: 1}))
console.log("index.getObjectsWithMatchingProperties({slug: 'another'})")
console.log(index.getObjectsWithMatchingProperties({slug: 'another'}))
console.log("index.getFirstObjectWithMatchingProperties({num: 1}):")
console.log(index.getFirstObjectWithMatchingProperties({num: 1}))
console.log("index.getFirstObjectWithMatchingProperties({slug: 'another'}):")
console.log(index.getFirstObjectWithMatchingProperties({slug: 'another'}))
console.log("index.removeObjectsWithMatchingProperties({slug: 'another', num: 2}):")
index.removeObjectsWithMatchingProperties({slug: 'another', num: 2})
console.log("index.getOrderedObjects('num'):")
console.log(index.getOrderedObjects('num'))
console.log("index.getOrderedObjects('num', 1, 1):")
console.log(index.getOrderedObjects('num', 1, 1))
console.log("index.getOrderedObjects('num_str'):")
console.log(index.getOrderedObjects('num_str'))
console.log("index.getObjectsWithMatchingProperties({num: 1}):")
console.log(index.getObjectsWithMatchingProperties({num: 1}))

index.add({slug: 'another', num: 20, num_str: '20'})
console.log("index.getOrderedObjects('slug')")
console.log(index.getOrderedObjects('slug'))
