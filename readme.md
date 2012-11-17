An extremely simple object store that supports returning the objects back to you in an ordered array sorted by any given property.  Meant for prototyping an app that will probably make use of a database eventually.

Unlike [stupid-indexer](https://github.com/TehShrike/stupid-indexer), the objects that are stored are immutable.  When you perform a lookup, you are given a copy of the object, not the stored object itself.

Supports asynchronous reading from the data store - not because it's necessary, but because that's almost certainly how you'll be interacting with the real database you use down the road.

So let's say you decide to start storing objects in here:

	var makeMeANewIndexPlease = require('object-indexer')
	var a_place_to_keep_my_things = makeMeANewIndexPlease()
	a_place_to_keep_my_things.add([{
		date: new Date('2015-03-02'),
		type: 'diary',
		message: 'Quiet today. I think the walls are ignoring me.'
	}, {
		date: new Date('2015-03-03'),
		type: 'diary',
		message: 'One of the kids was on my lawn today.  I think he was planting a fir tree.',
		bananas_eaten: 3
	}])
	
Get them back IN ORDER!

	a_place_to_keep_my_things.getOrderedObjects('date', function(objects){ console.log(objects) })

	[ { type: 'diary',
		message: 'Quiet today. I think the walls are ignoring me.',
		date: Mon Mar 02 2015 00:00:00 GMT+0000 (Coordinated Universal Time) },
	  { type: 'diary',
		message: 'One of the kids was on my lawn today.  I think he was planting a fir tree.',
		bananas_eaten: 3,
		date: Tue Mar 03 2015 00:00:00 GMT+0000 (Coordinated Universal Time) } ]

Wait, that's not very impressive.  Here, let's add another thing:

	a_place_to_keep_my_things.add({
		date: new Date('2015-03-05'),
		type: 'facebook',
		message: "I told the squirrels to grab the next kid that ran across my lawn!  That'll show 'em!",
		bananas_eaten: 2
	})
	
And then get the results back ordered by a different thing!

	a_place_to_keep_my_things.getOrderedObjects('bananas_eaten', function(objects) { console.log(objects) })

	[ { type: 'facebook',
		message: 'I told the squirrels to grab the next kid that ran across my lawn!  That\'ll show \'em!',
		bananas_eaten: 2,
		date: Thu Mar 05 2015 00:00:00 GMT+0000 (Coordinated Universal Time) },
	  { type: 'diary',
		message: 'One of the kids was on my lawn today.  I think he was planting a fir tree.',
		bananas_eaten: 3,
		date: Tue Mar 03 2015 00:00:00 GMT+0000 (Coordinated Universal Time) } ]

See?  The object from March 2nd didn't show up, because it didn't have a bananas_eaten property!  Eh?  Eh?

Here, let me search for one of those objects:

	a_place_to_keep_my_things.getFirstObjectWithMatchingProperties({ type: 'facebook' }, function(object) { console.log(object) })

	{ type: 'facebook',
	  message: 'I told the squirrels to grab the next kid that ran across my lawn!  That\'ll show \'em!',
	  bananas_eaten: 2,
	  date: Thu Mar 05 2015 00:00:00 GMT+0000 (Coordinated Universal Time) }

...and if you want to, you can even remove objects.

	a_place_to_keep_my_things.removeObjectsWithMatchingProperties({ type: 'facebook' })
