/**
 * Sprintly API - Add Blocking
 *
 * Create a new blocking on the given item_id on behalf of the requesting user.
 *
 * EXAMPLE:
 *
 * var new_blocking = sprintly_api.blocking.add( 123 );
 *
 * New blocking response also saved to: sprintly_api.blocking.data.new_blocking
 *
 * @param item_id number
 * @return sprintly_api.blocking.data.new_blocking
 */
sprintly_api.blocking.add = function(item_id)
{
	// Make sure we have a type defined
	if(typeof item_id !== 'number')
	{
		sprintly_api.debug('error', 'Invalid Item ID');
		return null;
	}

	// Make API call if we have a product selected
	if(sprintly_api.product.selected)
	{
		sprintly_api.call(
			'products/'+ sprintly_api.product.selected +'/items/'+ item_id +'/blocking.json',
			function(data)
			{
				sprintly_api.blocking.data.new_blocking = data;
				sprintly_api.track('API', 'Blocking', 'Add Success');
			},
			function(error)
			{
				sprintly_api.blocking.data.new_blocking = sprintly_api.ajax.responseJSON;
				sprintly_api.track('API', 'Blocking', 'Add Blocking: ' + error);
				sprintly_api.debug('error', 'Add Blocking Error: ' + error);
			},
			{ blocked: item_id },
			'POST'
		);

		sprintly_api.track('API', 'Blocking', 'Add: ' + item_id);
	}
	else
	{
		sprintly_api.debug('error', 'No Product Selected');
	}

	return sprintly_api.blocking.data.new_blocking;
};