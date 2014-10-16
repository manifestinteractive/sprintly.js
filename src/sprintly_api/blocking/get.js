/**
 * Sprintly API - Get Blocking
 *
 * Get single block object by its ID
 *
 * EXAMPLE:
 *
 * var blocking = sprintly_api.blocking.get(3, 123);
 *
 * Fetched blocking also saved to: sprintly_api.blocking.data.item_blocking
 *
 * @param item_id number
 * @param blocking_id number
 * @return sprintly_api.blocking.data.item_blocking
 */
sprintly_api.blocking.get = function(item_id, blocking_id)
{
	// Make sure we have a item id defined
	if(typeof item_id !== 'number')
	{
		sprintly_api.debug('error', 'Invalid Item ID');
		return null;
	}

	// Make sure we have a blocking id defined
	if(typeof blocking_id !== 'number')
	{
		sprintly_api.debug('error', 'Invalid Blocking ID');
		return null;
	}

	// Make API call if we have a product selected
	if(sprintly_api.product.selected)
	{
		sprintly_api.call(
			'products/'+ sprintly_api.product.selected +'/items/'+ item_id +'/blocking/'+ blocking_id +'.json',
			function(data)
			{
				sprintly_api.blocking.data.item_blocking = data;
				sprintly_api.track('API', 'Blocking', 'Get Success');
			},
			function(error)
			{
				sprintly_api.blocking.data.item_blocking = null;
				sprintly_api.track('API', 'Blocking', 'Get Error: ' + error);
				sprintly_api.debug('error', 'Get Person Error: ' + error);
			}
		);

		sprintly_api.track('API', 'Blocking', 'Get: item_id: ' + item_id + ', blocking_id: ' + blocking_id);
	}
	else
	{
		sprintly_api.debug('error', 'No Product Selected');
	}

	return sprintly_api.blocking.data.item_blocking;
};