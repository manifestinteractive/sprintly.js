/**
 * Sprintly API - Get Blocking
 *
 * Get all of the items that item_number is blocking.
 * Returns a list of block objects that are comprised of the user who is blocking,
 * the item object for item_number provided, and the item object, blocked, for the
 * item that is blocked by the given item_number.
 *
 * EXAMPLE:
 *
 * var blocking = sprintly_api.blocking.list( 123 );
 *
 * Blocking list also saved to: sprintly_api.blocking.data.blocking_list
 *
 * @param item_id number
 * @return sprintly_api.blocking.data.blocking_list
 */
sprintly_api.blocking.list = function(item_id)
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
				sprintly_api.blocking.data.blocking_list = data;
				sprintly_api.track('API', 'Blocking', 'List Success');
			},
			function(error)
			{
				sprintly_api.blocking.data.blocking_list = null;
				sprintly_api.track('API', 'Blocking', 'List Error: ' + error);
				sprintly_api.debug('error', 'List Blocking Error: ' + error);
			}
		);

		sprintly_api.track('API', 'Blocking', 'List');
	}
	else
	{
		sprintly_api.debug('error', 'No Product Selected');
	}

	return sprintly_api.blocking.data.blocking_list;
};