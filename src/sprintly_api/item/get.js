/**
 * Sprintly API - Get Item
 *
 * Query a product's items by various arguments. If no arguments are provided,
 * it will only return items that are in the backlog and in-progress.
 *
 * EXAMPLE:
 *
 * var my_item = sprintly_api.item.get( 123 );
 *
 * Fetched item saved to: sprintly_api.item.data.get_item
 *
 * @param item_id number
 * @return sprintly_api.item.data.get_item
 */
sprintly_api.item.get = function(item_id)
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
			'products/'+ sprintly_api.product.selected +'/items/'+ item_id +'.json',
			function(data)
			{
				sprintly_api.item.data.get_item = data;
				sprintly_api.track('API', 'Item', 'Get Success');
			},
			function(error)
			{
				sprintly_api.item.data.get_item = sprintly_api.ajax.responseJSON;
				sprintly_api.track('API', 'Item', 'Get Error: ' + error);
				sprintly_api.debug('error', 'Get Item Error: ' + error);
			}
		);

		sprintly_api.track('API', 'Item', 'Get: ' + item_id);
	}
	else
	{
		sprintly_api.debug('error', 'No Product Selected');
	}

	return sprintly_api.item.data.get_item;
};