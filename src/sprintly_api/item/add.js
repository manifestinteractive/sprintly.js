/**
 * Sprintly API - Add Item
 *
 * Create a new item for the given product. This endpoint allows you to create
 * new items within your products. It will return the newly created item on success.
 *
 * EXAMPLE:
 *
 * var new_item = sprintly_api.item.add({
 *      type: 'task',
 *      title: 'Testing',
 *      score: 'S',
 *      status: 'backlog',
 *      assigned_to: 123,
 *      description: 'This is a test description.',
 *      tags: ['test', 'abc', '123']
 * });
 *
 * New item response also saved to: sprintly_api.item.data.new_item
 *
 * @param args object
 * @return sprintly_api.item.data.new_item
 */
sprintly_api.item.add = function(args)
{
	// Make sure we have a type defined
	if(typeof args.type === 'undefined' || sprintly_api.item.valid.type.indexOf(args.type) === -1)
	{
		sprintly_api.debug('error', 'Invalid Type');
		return null;
	}

	// Make sure we have a title if its not a story
	if(args.type !== 'story' && typeof args.title === 'undefined')
	{
		sprintly_api.debug('error', 'Title Not Provided');
		return null;
	}

	// Make sure we have a who if it is a story
	if(args.type === 'story' && typeof args.who === 'undefined')
	{
		sprintly_api.debug('error', 'Who Not Provided for Story');
		return null;
	}

	// Make sure we have a what if it is a story
	if(args.type === 'story' && typeof args.what === 'undefined')
	{
		sprintly_api.debug('error', 'What Not Provided for Story');
		return null;
	}

	// Make sure we have a why if it is a story
	if(args.type === 'story' && typeof args.why === 'undefined')
	{
		sprintly_api.debug('error', 'Why Not Provided for Story');
		return null;
	}

	// Make sure description is correct
	if(args.description && typeof args.description !== 'string')
	{
		sprintly_api.debug('error', 'Invalid Description');
		return null;
	}

	// Make sure we have a valid description
	if(args.score && sprintly_api.item.valid.score.indexOf(args.score) === -1)
	{
		sprintly_api.debug('error', 'Invalid Score');
		return null;
	}
	else if(typeof args.score === 'undefined')
	{
		args.score = '~';
	}

	// Make sure we have a valid status
	if(args.status && sprintly_api.item.valid.status.indexOf(args.status) === -1)
	{
		sprintly_api.debug('error', 'Invalid Status');
		return null;
	}
	else if(typeof args.status === 'undefined')
	{
		args.status = 'someday';
	}

	// Make sure assigned_to is correct
	if(args.assigned_to && typeof args.assigned_to !== 'number')
	{
		sprintly_api.debug('error', 'Invalid assigned_to');
		return null;
	}

	// Let's check for tags
	if(args.tags && typeof args.tags === 'object')
	{
		args.tags = args.tags.join();
	}

	// Make API call if we have a product selected
	if(sprintly_api.product.selected)
	{
		sprintly_api.call(
			'products/'+ sprintly_api.product.selected +'/items.json',
			function(data)
			{
				sprintly_api.item.data.new_item = data;
				sprintly_api.track('API', 'Item', 'Add Success');
			},
			function(error)
			{
				sprintly_api.item.data.new_item = null;
				sprintly_api.track('API', 'Item', 'Add Error: ' + error);
				sprintly_api.debug('error', 'Add Item Error: ' + error);
			},
			args,
			'POST'
		);

		sprintly_api.track('API', 'Item', 'Add: ' + JSON.stringify(args));
	}
	else
	{
		sprintly_api.debug('error', 'No Product Selected');
	}

	return sprintly_api.item.data.new_item;
};