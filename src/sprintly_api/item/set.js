/**
 * Sprintly API - Update Item
 *
 * Update the specified item.
 *
 * EXAMPLE:
 *
 * var update_item = sprintly_api.item.set( 123 , {
 *      title: 'Testing',
 *      score: 'S',
 *      status: 'backlog',
 *      assigned_to: 123,
 *      description: 'This is a fun test description.',
 *      tags: ['test', 'abc', '123']
 * });
 *
 * Update item saved to: sprintly_api.item.data.set_item
 *
 * @param item_id number
 * @param args object
 * @return sprintly_api.item.data.set_item
 */
sprintly_api.item.set = function(item_id, args)
{
	// Fetch original item to validate requirements
	var item = sprintly_api.item.get(item_id);

	// Make sure we have a title if its not a story
	if(item.type !== 'story' && typeof args.title === 'undefined')
	{
		sprintly_api.debug('error', 'Title Not Provided');
		return null;
	}

	// Make sure we have a who if it is a story
	if(item.type === 'story' && typeof args.who === 'undefined')
	{
		sprintly_api.debug('error', 'Who Not Provided for Story');
		return null;
	}

	// Make sure we have a what if it is a story
	if(item.type === 'story' && typeof args.what === 'undefined')
	{
		sprintly_api.debug('error', 'Who Not Provided for Story');
		return null;
	}

	// Make sure we have a why if it is a story
	if(item.type === 'story' && typeof args.why === 'undefined')
	{
		sprintly_api.debug('error', 'Who Not Provided for Story');
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
			'products/'+ sprintly_api.product.selected +'/items/'+ item_id +'.json',
			function(data)
			{
				sprintly_api.item.data.set_item = data;
				sprintly_api.track('API', 'Item', 'Set Success');
			},
			function(error)
			{
				sprintly_api.item.data.set_item = null;
				sprintly_api.track('API', 'Item', 'Set Error: ' + error);
				sprintly_api.debug('error', 'Set Item Error: ' + error);
			},
			args,
			'POST'
		);

		sprintly_api.track('API', 'Item', 'Set: ' + JSON.stringify(args));
	}
	else
	{
		sprintly_api.debug('error', 'No Product Selected');
	}

	return sprintly_api.item.data.set_item;
};